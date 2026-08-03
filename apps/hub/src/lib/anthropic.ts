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

Below you have the current open tasks and notes across every department, the full AI employee roster, the most recent generated insights, and a real spend summary — all real, all current. Use it as working context, not just background: connect things across departments when it's relevant, notice when something in one area affects another, and don't wait to be asked the obvious follow-up. Be direct and concise; this is a working tool, not a chat demo. When something isn't in your context, say so rather than guessing — never invent data you weren't given.`

function employeePersona(employee: HubAiEmployee): string {
  const department = getDepartment(employee.department)
  const departmentLabel = department?.label ?? employee.department

  return `You are ${employee.name}, ${employee.role} for Journey Storage's ${departmentLabel} department. You're talking directly to Lyvia, the founder — there's no other audience. Stay in this role and in this department's lane; you don't speak for the other departments.

${BUSINESS_CONTEXT}

${employee.system_prompt}

You have access to ${departmentLabel}'s current open tasks and recent notes below — use them as real working context, not just background. Be direct and concise; this is a working tool, not a chat demo. When you don't know something that isn't in your context, say so rather than guessing.`
}

interface HubContext {
  employee?: HubAiEmployee | null
  tasks: Pick<HubTask, 'title' | 'status' | 'priority' | 'due_date'>[]
  notes: Pick<HubNote, 'title' | 'content'>[]
  // Jarvis-only — full-company context no department employee gets.
  allEmployees?: Pick<HubAiEmployee, 'name' | 'role' | 'department'>[]
  recentInsights?: Pick<HubInsight, 'content' | 'category' | 'created_at'>[]
  spend?: { todayUsd: number; monthToDateUsd: number }
}

export function buildSystemPrompt({
  employee,
  tasks,
  notes,
  allEmployees,
  recentInsights,
  spend,
}: HubContext): Anthropic.Messages.TextBlockParam[] {
  const persona = employee ? employeePersona(employee) : JARVIS_PERSONA

  const openTasks = tasks.filter((t) => t.status !== 'done')
  const taskLines = openTasks.length
    ? openTasks
        .map((t) => `- [${t.priority ?? 'normal'}] ${t.title}${t.due_date ? ` (due ${t.due_date})` : ''}`)
        .join('\n')
    : '(no open tasks)'

  const noteLines = notes.length
    ? notes.map((n) => `- ${n.title}: ${n.content.slice(0, 200)}`).join('\n')
    : '(no recent notes)'

  let dynamicText = `Current open tasks:\n${taskLines}\n\nRecent notes:\n${noteLines}`

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
