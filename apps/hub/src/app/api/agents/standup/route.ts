import { getSupabaseServer } from '@/lib/supabase-server'
import { buildSystemPrompt, getAnthropicClient, JARVIS_MODEL } from '@/lib/anthropic'
import { computeCostUsd } from '@/lib/cost'
import type { HubAiEmployee, HubNote, HubTask } from '@/lib/types'

export const runtime = 'nodejs'
// Vercel Hobby caps serverless functions at 60s.
export const maxDuration = 60

// The initiative engine. Every employee reviews their own lane and proposes
// what they want to do next. Nothing executes — proposals land in
// hub_proposals as pending, waiting for Lyvia/Jonah on the dashboard.
// Runs at most once per STALE_HOURS unless force: true.

const STALE_HOURS = 20
const MAX_PROPOSALS_PER_EMPLOYEE = 2

interface ProposedAction {
  type?: string
  title?: string
  notes?: string
  content?: string
  priority?: string
  due_date?: string
}

interface Proposal {
  title?: string
  rationale?: string
  action?: ProposedAction
}

function extractJsonArray(text: string): Proposal[] {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return []
  try {
    const parsed = JSON.parse(text.slice(start, end + 1))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const force = body?.force === true

  const supabase = await getSupabaseServer()

  if (!force) {
    const staleCutoff = new Date(Date.now() - STALE_HOURS * 60 * 60 * 1000).toISOString()
    const { data: recent } = await supabase
      .from('hub_proposals')
      .select('id')
      .gte('created_at', staleCutoff)
      .limit(1)
    if (recent?.length) {
      return Response.json({ ran: false, reason: 'standup already ran recently' })
    }
  }

  const { data: employeesData } = await supabase.from('hub_ai_employees').select('*')
  const employees = (employeesData as HubAiEmployee[]) ?? []
  if (!employees.length) return Response.json({ ran: false, reason: 'no employees' })

  const today = new Date().toISOString().slice(0, 10)
  const client = getAnthropicClient()

  const results = await Promise.allSettled(
    employees.map(async (employee) => {
      const [{ data: tasks }, { data: notes }, { data: docs }, { data: deptDocs }, { data: pending }] = await Promise.all([
        supabase
          .from('hub_tasks')
          .select('id,title,status,priority,due_date')
          .eq('department', employee.department)
          .neq('status', 'done'),
        supabase
          .from('hub_notes')
          .select('title,content')
          .eq('department', employee.department)
          .order('updated_at', { ascending: false })
          .limit(6),
        supabase
          .from('hub_employee_docs')
          .select('filename,content')
          .eq('employee_id', employee.id)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('hub_department_docs')
          .select('filename,content')
          .eq('department', employee.department)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase.from('hub_proposals').select('title').eq('employee_id', employee.id).eq('status', 'pending'),
      ])

      const system = buildSystemPrompt({
        employee,
        tasks: (tasks as HubTask[]) ?? [],
        notes: (notes as HubNote[]) ?? [],
        docs: [
          ...((docs as { filename: string; content: string }[]) ?? []),
          ...(((deptDocs as { filename: string; content: string }[]) ?? []).map((d) => ({
            filename: `${d.filename} (department library)`,
            content: d.content,
          }))),
        ].map((d) => ({ filename: d.filename, content: d.content.slice(0, 2000) })),
      })

      const pendingTitles = (pending ?? []).map((p) => `- ${p.title}`).join('\n') || '(none)'

      const instruction = `Daily standup, ${today}. Review your mandate and current context, then propose up to ${MAX_PROPOSALS_PER_EMPLOYEE} concrete actions you want to take next in your lane.

Rules:
- Do not repeat existing open tasks or these already-pending proposals:\n${pendingTitles}
- Each proposal must be specific enough to execute immediately once approved.
- Prefer work that compounds: building your playbook, pipeline, checklists, or filling context gaps Lyvia should know about.
- Nothing executes without Lyvia or Jonah's approval, so propose boldly but honestly.

Respond with ONLY a JSON array, no prose:
[{"title": "short action headline", "rationale": "1-2 sentences on why now", "action": {"type": "task" or "note", "title": "...", "notes": "detail (for tasks)", "content": "body (for notes)", "priority": "low|normal|high", "due_date": "YYYY-MM-DD (optional)"}}]

If nothing is genuinely worth proposing, respond with [].`

      const response = await client.messages.create({
        model: JARVIS_MODEL,
        max_tokens: 1500,
        output_config: { effort: 'low' },
        system,
        messages: [{ role: 'user', content: instruction }],
      })

      await supabase.from('hub_api_usage').insert({
        employee_id: employee.id,
        model: JARVIS_MODEL,
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_creation_input_tokens: response.usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: response.usage.cache_read_input_tokens ?? 0,
        cost_usd: computeCostUsd(JARVIS_MODEL, response.usage),
      })

      const text = response.content
        .map((b) => (b.type === 'text' ? b.text : ''))
        .join('')

      const proposals = extractJsonArray(text)
        .slice(0, MAX_PROPOSALS_PER_EMPLOYEE)
        .filter((p) => typeof p.title === 'string' && p.title.trim())

      if (!proposals.length) return { employee: employee.name, proposed: 0 }

      const rows = proposals.map((p) => ({
        employee_id: employee.id,
        title: String(p.title).slice(0, 300),
        rationale: typeof p.rationale === 'string' ? p.rationale.slice(0, 1000) : null,
        action_type: p.action?.type === 'note' ? 'note' : 'task',
        action_payload: {
          title: typeof p.action?.title === 'string' ? p.action.title : p.title,
          notes: typeof p.action?.notes === 'string' ? p.action.notes : null,
          content: typeof p.action?.content === 'string' ? p.action.content : null,
          priority: ['low', 'normal', 'high'].includes(p.action?.priority ?? '') ? p.action?.priority : 'normal',
          due_date: /^\d{4}-\d{2}-\d{2}$/.test(p.action?.due_date ?? '') ? p.action?.due_date : null,
        },
      }))

      const { error } = await supabase.from('hub_proposals').insert(rows)
      if (error) throw new Error(error.message)
      return { employee: employee.name, proposed: rows.length }
    }),
  )

  const summary = results.map((r) =>
    r.status === 'fulfilled' ? r.value : { error: r.reason instanceof Error ? r.reason.message : 'failed' },
  )
  return Response.json({ ran: true, summary })
}
