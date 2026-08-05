import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { isDepartmentSlug } from '@/lib/departments'
import { listCalendarEvents, listRecentEmails, saveToDrive, searchDriveFiles } from '@/lib/google'
import type { HubAiEmployee } from '@/lib/types'

// Jarvis's hands. Every tool writes through the caller's own Supabase
// session, so RLS still applies — Claude can never touch a row the
// logged-in user couldn't. Department employees get the same task/note
// tools but are forced into their own department; investor tools are
// Jarvis + Acquisitions only.

const DEPARTMENT_DESC =
  'One of: finance, marketing, investor-relations, acquisitions, development, operations. Omit for company-wide.'

const TASK_NOTE_TOOLS: Anthropic.Tool[] = [
  {
    name: 'create_task',
    description:
      'Create a new task in the hub. Use when Lyvia asks you to add, track, or remember something actionable.',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short imperative title.' },
        notes: { type: 'string', description: 'Optional detail or context.' },
        priority: { type: 'string', enum: ['low', 'normal', 'high'] },
        due_date: { type: 'string', description: 'YYYY-MM-DD, omit if no deadline.' },
        department: { type: 'string', description: DEPARTMENT_DESC },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_task',
    description:
      'Update an existing task — mark it done/doing, change priority, due date, title, or notes. Task IDs are in your context next to each open task.',
    input_schema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'UUID of the task, from your context.' },
        status: { type: 'string', enum: ['open', 'doing', 'done'] },
        priority: { type: 'string', enum: ['low', 'normal', 'high'] },
        due_date: { type: 'string', description: 'YYYY-MM-DD.' },
        title: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['task_id'],
    },
  },
  {
    name: 'create_note',
    description:
      'Save a note in the hub. Use for decisions, ideas, meeting outcomes, or anything Lyvia wants written down that is not a task.',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        department: { type: 'string', description: DEPARTMENT_DESC },
      },
      required: ['title', 'content'],
    },
  },
]

const INVESTOR_TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_investors',
    description:
      'Search the investor CRM by name (partial match). Returns each match with their per-deal stage, amounts, and follow-up dates. Use before updating any investor record.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Part of the investor name.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'update_investor_deal',
    description:
      'Update an investor\'s record on a specific deal — stage, follow-up date, outreach date, amount, or notes. Get investor_id and deal_id from search_investors first.',
    input_schema: {
      type: 'object',
      properties: {
        investor_id: { type: 'string', description: 'UUID from search_investors.' },
        deal_id: { type: 'string', description: 'Deal id from search_investors.' },
        stage: {
          type: 'string',
          enum: [
            'funded', 'committed', 'engaged', 'lead', 'backup', 'finder',
            'connector', 'gatekept', 'needs_contact', 'finder_inactive', 'out',
          ],
        },
        next_follow_up: { type: 'string', description: 'YYYY-MM-DD.' },
        last_outreach: { type: 'string', description: 'YYYY-MM-DD.' },
        amount: { type: 'number' },
        notes: { type: 'string', description: 'Replaces the existing notes on this deal row.' },
      },
      required: ['investor_id', 'deal_id'],
    },
  },
]

// Jarvis-only: the hire box moved out of the UI and into conversation.
const JARVIS_TOOLS: Anthropic.Tool[] = [
  {
    name: 'hire_employee',
    description:
      'Hire a new AI employee into a department. Use when Lyvia asks to add someone to the team. Write the mandate yourself in the same style as existing employees: mandate, north stars, operating behavior, and an initiative clause. Confirm the hire briefly afterward.',
    input_schema: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          enum: ['finance', 'marketing', 'investor-relations', 'acquisitions', 'development', 'operations'],
        },
        name: { type: 'string', description: 'Short evocative name, e.g. Ledger, Scout.' },
        role: { type: 'string', description: 'Job title.' },
        system_prompt: { type: 'string', description: 'The full mandate / job description.' },
      },
      required: ['department', 'name', 'role', 'system_prompt'],
    },
  },
]

// Available to everyone once Google is connected — deliverables get filed
// in Drive under Journey Hub/<employee name>/.
const DRIVE_SAVE_TOOL: Anthropic.Tool = {
  name: 'save_to_drive',
  description:
    "File a finished piece of work in Journey's Google Drive as a Google Doc, under Journey Hub/<your name>/. Use for real deliverables — memos, playbooks, drafts, reports — not for quick thoughts (those are notes). Include the returned link in your reply.",
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Document title.' },
      content: { type: 'string', description: 'Full document body (plain text or markdown).' },
    },
    required: ['title', 'content'],
  },
}

const GOOGLE_TOOLS: Anthropic.Tool[] = [
  {
    name: 'read_recent_emails',
    description:
      "Read Lyvia's recent Gmail inbox (read-only). Returns sender, subject, date, and a snippet per message. Use for 'catch me up on email', 'anything from <person>?', etc.",
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            "Optional Gmail search query (e.g. 'from:jonah newer_than:7d', 'is:unread'). Defaults to the last 2 days of inbox.",
        },
        max: { type: 'number', description: 'Max messages, default 15, cap 25.' },
      },
    },
  },
  {
    name: 'find_drive_files',
    description:
      "Search Journey's Google Drive by file name (searches shared drives too). Returns each match with an open link. Use when Lyvia asks to open, find, or pull up a document, deck, sheet, or folder. Include the link in your reply so she can click it.",
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Part of the file name, e.g. "Granbury deck" -> "Granbury".' },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_calendar',
    description:
      "Read Lyvia's Google Calendar (read-only): upcoming events with times, locations, and attendees. Use for 'what's my day look like', 'when am I free', 'what's coming up this week'.",
    input_schema: {
      type: 'object',
      properties: {
        days_ahead: { type: 'number', description: 'How many days ahead to look, default 7, cap 31.' },
      },
    },
  },
]

// Google tools are Jarvis-only — the personal-life side of the hub doesn't
// belong to department employees — and only offered once tokens exist.
export function getToolsFor(employee: HubAiEmployee | null, hasGoogle = false): Anthropic.Tool[] {
  const driveTools = hasGoogle ? [DRIVE_SAVE_TOOL] : []
  if (!employee) {
    return hasGoogle
      ? [...TASK_NOTE_TOOLS, ...INVESTOR_TOOLS, ...JARVIS_TOOLS, ...GOOGLE_TOOLS, ...driveTools]
      : [...TASK_NOTE_TOOLS, ...INVESTOR_TOOLS, ...JARVIS_TOOLS]
  }
  // The investor CRM lives in Investor Relations (Meridian's lane);
  // Acquisitions keeps access too since Compass matches investors to deals.
  if (employee.department === 'investor-relations' || employee.department === 'acquisitions') {
    return [...TASK_NOTE_TOOLS, ...INVESTOR_TOOLS, ...driveTools]
  }
  return [...TASK_NOTE_TOOLS, ...driveTools]
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function asDate(value: unknown): string | undefined {
  return typeof value === 'string' && DATE_RE.test(value) ? value : undefined
}

function fail(message: string): string {
  return JSON.stringify({ ok: false, error: message })
}

function ok(payload: Record<string, unknown>): string {
  return JSON.stringify({ ok: true, ...payload })
}

// Returns a JSON string for the tool_result block. Never throws — errors go
// back to Claude as { ok: false } so he can tell Lyvia what happened.
export async function executeTool(
  supabase: SupabaseClient,
  employee: HubAiEmployee | null,
  name: string,
  input: Record<string, unknown>,
): Promise<string> {
  try {
    switch (name) {
      case 'create_task': {
        if (typeof input.title !== 'string' || !input.title.trim()) return fail('title is required')
        const department = employee
          ? employee.department
          : typeof input.department === 'string' && isDepartmentSlug(input.department)
            ? input.department
            : null
        const { data, error } = await supabase
          .from('hub_tasks')
          .insert({
            title: input.title.trim(),
            notes: typeof input.notes === 'string' ? input.notes : null,
            priority: ['low', 'normal', 'high'].includes(input.priority as string) ? input.priority : null,
            due_date: asDate(input.due_date) ?? null,
            department,
          })
          .select('id,title')
          .single()
        if (error) return fail(error.message)
        return ok({ created: data })
      }

      case 'update_task': {
        if (typeof input.task_id !== 'string') return fail('task_id is required')
        const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
        if (['open', 'doing', 'done'].includes(input.status as string)) patch.status = input.status
        if (['low', 'normal', 'high'].includes(input.priority as string)) patch.priority = input.priority
        if (asDate(input.due_date)) patch.due_date = input.due_date
        if (typeof input.title === 'string' && input.title.trim()) patch.title = input.title.trim()
        if (typeof input.notes === 'string') patch.notes = input.notes
        if (Object.keys(patch).length === 1) return fail('nothing to update — pass at least one field')
        const { data, error } = await supabase
          .from('hub_tasks')
          .update(patch)
          .eq('id', input.task_id)
          .select('id,title,status')
          .single()
        if (error) return fail(error.message)
        return ok({ updated: data })
      }

      case 'create_note': {
        if (typeof input.title !== 'string' || typeof input.content !== 'string') {
          return fail('title and content are required')
        }
        const department = employee
          ? employee.department
          : typeof input.department === 'string' && isDepartmentSlug(input.department)
            ? input.department
            : null
        const tags = Array.isArray(input.tags) ? input.tags.filter((t): t is string => typeof t === 'string') : []
        const { data, error } = await supabase
          .from('hub_notes')
          .insert({ title: input.title, content: input.content, tags, department })
          .select('id,title')
          .single()
        if (error) return fail(error.message)

        // Best-effort Drive mirror — the note is the source of truth; the
        // Doc in Journey Hub/<name>/ is the filing-cabinet copy.
        let driveLink: string | undefined
        try {
          const saved = await saveToDrive(supabase, employee?.name ?? 'Jarvis', input.title, input.content)
          driveLink = saved.link
        } catch {
          // Google not connected or upload failed — note still created.
        }
        return ok({ created: data, ...(driveLink ? { drive_link: driveLink } : {}) })
      }

      case 'save_to_drive': {
        if (typeof input.title !== 'string' || typeof input.content !== 'string' || !input.title.trim()) {
          return fail('title and content are required')
        }
        const saved = await saveToDrive(supabase, employee?.name ?? 'Jarvis', input.title.trim(), input.content)
        return ok({ saved_to: saved.folder, link: saved.link })
      }

      case 'search_investors': {
        if (typeof input.query !== 'string' || !input.query.trim()) return fail('query is required')
        const { data: investors, error } = await supabase
          .from('hub_investors')
          .select('id,name,investor_group,introducer,emails')
          .ilike('name', `%${input.query.trim()}%`)
          .limit(8)
        if (error) return fail(error.message)
        if (!investors?.length) return ok({ matches: [] })

        const ids = investors.map((i) => i.id)
        const { data: dealRows } = await supabase
          .from('hub_deal_investors')
          .select('investor_id,deal_id,stage,amount,funded,last_outreach,next_follow_up,notes')
          .in('investor_id', ids)

        const matches = investors.map((inv) => ({
          ...inv,
          deals: (dealRows ?? []).filter((d) => d.investor_id === inv.id),
        }))
        return ok({ matches })
      }

      case 'update_investor_deal': {
        if (typeof input.investor_id !== 'string' || typeof input.deal_id !== 'string') {
          return fail('investor_id and deal_id are required')
        }
        const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
        const stages = [
          'funded', 'committed', 'engaged', 'lead', 'backup', 'finder',
          'connector', 'gatekept', 'needs_contact', 'finder_inactive', 'out',
        ]
        if (stages.includes(input.stage as string)) patch.stage = input.stage
        if (asDate(input.next_follow_up)) patch.next_follow_up = input.next_follow_up
        if (asDate(input.last_outreach)) patch.last_outreach = input.last_outreach
        if (typeof input.amount === 'number') patch.amount = input.amount
        if (typeof input.notes === 'string') patch.notes = input.notes
        if (Object.keys(patch).length === 1) return fail('nothing to update — pass at least one field')
        const { data, error } = await supabase
          .from('hub_deal_investors')
          .update(patch)
          .eq('investor_id', input.investor_id)
          .eq('deal_id', input.deal_id)
          .select('investor_id,deal_id,stage,next_follow_up')
          .single()
        if (error) return fail(error.message)
        return ok({ updated: data })
      }

      case 'read_recent_emails': {
        const emails = await listRecentEmails(
          supabase,
          typeof input.query === 'string' ? input.query : undefined,
          typeof input.max === 'number' ? input.max : 15,
        )
        return ok({ emails })
      }

      case 'hire_employee': {
        if (employee) return fail('only Jarvis can hire')
        const { department, name: empName, role, system_prompt } = input as Record<string, unknown>
        if (
          typeof department !== 'string' ||
          !isDepartmentSlug(department) ||
          typeof empName !== 'string' ||
          !empName.trim() ||
          typeof role !== 'string' ||
          !role.trim() ||
          typeof system_prompt !== 'string' ||
          !system_prompt.trim()
        ) {
          return fail('department, name, role, and system_prompt are all required')
        }
        const { data: existing } = await supabase.from('hub_ai_employees').select('id').eq('name', empName.trim()).limit(1)
        if (existing?.length) return fail(`an employee named ${empName.trim()} already exists`)
        const { data, error } = await supabase
          .from('hub_ai_employees')
          .insert({ department, name: empName.trim(), role: role.trim(), system_prompt: system_prompt.trim() })
          .select('id,name,role,department')
          .single()
        if (error) return fail(error.message)
        return ok({ hired: data })
      }

      case 'find_drive_files': {
        if (typeof input.query !== 'string' || !input.query.trim()) return fail('query is required')
        const files = await searchDriveFiles(supabase, input.query.trim())
        return ok({ files })
      }

      case 'read_calendar': {
        const events = await listCalendarEvents(
          supabase,
          typeof input.days_ahead === 'number' ? input.days_ahead : 7,
        )
        return ok({ events })
      }

      default:
        return fail(`unknown tool: ${name}`)
    }
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'unexpected error')
  }
}
