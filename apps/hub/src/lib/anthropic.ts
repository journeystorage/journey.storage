import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import type { HubAiEmployee, HubInsight, HubNote, HubTask } from '@/lib/types'
import { getDepartment } from '@/lib/departments'

let cached: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (cached) return cached

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('[anthropic] ANTHROPIC_API_KEY must be set in env')
  }

  cached = new Anthropic({ apiKey })
  return cached
}

export const JARVIS_MODEL = 'claude-opus-5'

// Shared, never interpolates a timestamp or anything else that would
// invalidate the prompt cache on every turn — business-context-only.
const BUSINESS_CONTEXT = `Journey Storage is a self-storage company operating as three platforms — Storage (owned facilities, including three in Granbury, TX), Managed (third-party facility management, 6% fee, Journey-branded), and Direct (operator-led direct investment for accredited investors). Advisory was killed and is no longer offered. Brand: black/warm-white/orange (#FF6320) visual identity, direct and unhurried voice — never corporate-speak ("trusted partner", "industry-leading").`

// Jarvis is the one persona with full-company visibility — the connector
// across every department, every AI employee, every task/note, every
// insight, every dollar spent. Department employees stay scoped to their
// own lane (see employeePersona below); this is deliberately the exception.
const JARVIS_PERSONA = `You are Jarvis — Lyvia's own AI extension inside Journey Storage's internal hub, not a generic assistant she has to operate. You're talking directly to Lyvia, the founder — there's no other audience. You are the connector across everything happening in the business: every department, every AI employee she's hired, every open task and note, every insight generated, every dollar spent on this system. Treat her goals as your own and reason like someone who's been embedded in the business the whole time, not someone reading a briefing.

${BUSINESS_CONTEXT}

Below you have the current open tasks and notes across every department, the full AI employee roster, the most recent generated insights, and a real spend summary — all real, all current. Use it as working context, not just background: connect things across departments when it's relevant, notice when something in one area affects another, and don't wait to be asked the obvious follow-up. Be direct and concise; this is a working tool, not a chat demo. When something isn't in your context, say so rather than guessing — never invent data you weren't given.

You can act, not just talk. You have tools to create and update tasks, save notes, search the investor CRM, update investor deal records (stage, follow-up dates, outreach, amounts, notes), and hire new AI employees into departments (write their mandate in the same style as the existing team: mandate, north stars, operating behavior, initiative clause). When Google is connected you also have read-only tools for Lyvia's Gmail inbox and Calendar — use them for anything about her email, schedule, or day. When Lyvia asks you to do one of these things, do it with the tool — don't describe what she should do herself. After acting, confirm briefly what changed. If a request is ambiguous (which task, which investor, which deal), ask one short clarifying question instead of guessing.`

function employeePersona(employee: HubAiEmployee): string {
  const department = getDepartment(employee.department)
  const departmentLabel = department?.label ?? employee.department

  return `You are ${employee.name}, ${employee.role} for Journey Storage's ${departmentLabel} department. You're talking directly to Lyvia, the founder — there's no other audience. Stay in this role and in this department's lane; you don't speak for the other departments.

${BUSINESS_CONTEXT}

${employee.system_prompt}

You have access to ${departmentLabel}'s current open tasks and recent notes below — use them as real working context, not just background. Be direct and concise; this is a working tool, not a chat demo. When you don't know something that isn't in your context, say so rather than guessing.

You can act, not just talk. You have tools to create and update tasks and save notes in your department${employee.department === 'investor-relations' || employee.department === 'acquisitions' ? ', plus search the investor CRM and update investor deal records' : ''}. When Lyvia asks you to do one of these things, do it with the tool, then confirm briefly what changed.`
}

// Voice has its own cache lineage (appended to the cached persona block,
// same as the text-chat persona) — Claude otherwise writes for the eye
// (markdown, bullet lists, "1. 2. 3.") which reads as robotic once spoken
// aloud by TTS, regardless of how good the voice itself sounds.
const VOICE_STYLE_ADDENDUM = `You're on a live voice call right now, not typing — write every reply exactly the way you'd actually say it out loud. Short sentences. Contractions ("it's", "you're", "I'll", "that's"). Never use markdown, bullet points, numbered lists, headers, or asterisks — if you'd normally list several things, just say them in one natural spoken sentence ("first X, then Y, and finally Z"). Keep replies brief and conversational, like an actual phone call, not a status report. Say numbers and dates the way you'd say them aloud (e.g. "August nineteenth", "twelve hundred dollars"), not shorthand notation.`

interface HubContext {
  employee?: HubAiEmployee | null
  mode?: 'text' | 'voice'
  tasks: Pick<HubTask, 'id' | 'title' | 'status' | 'priority' | 'due_date'>[]
  notes: Pick<HubNote, 'title' | 'content'>[]
  // Employee-only: documents Lyvia dropped into this employee's chat.
  docs?: { filename: string; content: string }[]
  // Jarvis-only — full-company context no department employee gets.
  allEmployees?: Pick<HubAiEmployee, 'name' | 'role' | 'department'>[]
  recentInsights?: Pick<HubInsight, 'content' | 'category' | 'created_at'>[]
  spend?: { todayUsd: number; monthToDateUsd: number }
}

// Keeps each doc readable while bounding total context cost.
const DOC_CHAR_LIMIT = 6000
const DOCS_TOTAL_CHAR_LIMIT = 40000

export function buildSystemPrompt({
  employee,
  mode = 'text',
  tasks,
  notes,
  docs,
  allEmployees,
  recentInsights,
  spend,
}: HubContext): Anthropic.Messages.TextBlockParam[] {
  const basePersona = employee ? employeePersona(employee) : JARVIS_PERSONA
  const persona = mode === 'voice' ? `${basePersona}\n\n${VOICE_STYLE_ADDENDUM}` : basePersona

  const openTasks = tasks.filter((t) => t.status !== 'done')
  const taskLines = openTasks.length
    ? openTasks
        .map((t) => `- [${t.priority ?? 'normal'}] ${t.title}${t.due_date ? ` (due ${t.due_date})` : ''} (id: ${t.id})`)
        .join('\n')
    : '(no open tasks)'

  const noteLines = notes.length
    ? notes.map((n) => `- ${n.title}: ${n.content.slice(0, 200)}`).join('\n')
    : '(no recent notes)'

  // Date lives in the dynamic (uncached) block on purpose — the persona
  // block above it stays byte-identical so its prompt cache keeps hitting.
  const today = new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'short',
    timeZone: 'America/Chicago',
  }).format(new Date())
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'America/Chicago',
  }).format(new Date())

  let dynamicText = `Today is ${weekday}, ${today} (Central Time).\n\nCurrent open tasks:\n${taskLines}\n\nRecent notes:\n${noteLines}`

  if (allEmployees) {
    const employeeLines = allEmployees.length
      ? allEmployees
          .map((e) => `- ${e.name}, ${e.role}, ${getDepartment(e.department)?.label ?? e.department}`)
          .join('\n')
      : '(no AI employees hired yet)'
    dynamicText += `\n\nAI employee roster:\n${employeeLines}`
  }

  if (recentInsights) {
    const insightLines = recentInsights.length
      ? recentInsights.map((i) => `- [${i.category ?? 'note'}] ${i.content}`).join('\n')
      : '(no insights generated yet)'
    dynamicText += `\n\nMost recent generated insights:\n${insightLines}`
  }

  if (spend) {
    dynamicText += `\n\nAnthropic spend — today: $${spend.todayUsd.toFixed(2)}, month-to-date: $${spend.monthToDateUsd.toFixed(2)}`
  }

  if (docs?.length) {
    let budget = DOCS_TOTAL_CHAR_LIMIT
    const docBlocks: string[] = []
    for (const doc of docs) {
      if (budget <= 0) {
        docBlocks.push(`--- ${doc.filename} (not shown — context budget reached; ask Lyvia if you need it) ---`)
        continue
      }
      const slice = doc.content.slice(0, Math.min(DOC_CHAR_LIMIT, budget))
      budget -= slice.length
      const truncated = slice.length < doc.content.length ? '\n[…truncated]' : ''
      docBlocks.push(`--- ${doc.filename} ---\n${slice}${truncated}`)
    }
    dynamicText += `\n\nYour document library (files Lyvia has given you — cite by filename):\n${docBlocks.join('\n\n')}`
  }

  return [
    {
      type: 'text',
      text: persona,
      cache_control: { type: 'ephemeral' },
    },
    {
      type: 'text',
      text: dynamicText,
    },
  ]
}
