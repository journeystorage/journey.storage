import { getSupabaseServer } from '@/lib/supabase-server'
import { getServiceClient } from '@/lib/service-client'
import { buildSystemPrompt, getAnthropicClient, JARVIS_MODEL } from '@/lib/anthropic'
import { computeCostUsd } from '@/lib/cost'
import { resolvePrimaryGoogleEmail, saveToDrive } from '@/lib/google'
import type { HubAiEmployee, HubNote, HubTask } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

// The work engine. Each cycle, a few employees pick up an open task in
// their department and produce a real draft toward it, saved as a note
// (and mirrored to Drive when connected). Tasks move to 'doing' — never to
// 'done' on their own; finishing is Lyvia's call.
//
// Called by pg_cron (unauthenticated, via service client) or by a signed-in
// user. Self-limits to one cycle per WORK_INTERVAL_MIN so a stray or
// malicious trigger can't burn money — an unauthenticated caller can never
// make it do more than the schedule already does.

const WORK_INTERVAL_MIN = 100
const EMPLOYEES_PER_CYCLE = 3

export async function POST() {
  const sessionClient = await getSupabaseServer()
  const { data: userData } = await sessionClient.auth.getUser()
  const supabase = userData.user ? sessionClient : getServiceClient()

  if (!supabase) {
    return Response.json({ ran: false, reason: 'service client not configured' }, { status: 503 })
  }

  // Interactive trigger: attribute Drive saves to whoever's signed in.
  // Unattended (pg_cron) trigger: no signed-in user to attribute to, so pick
  // deterministically rather than letting an unfiltered query silently grab
  // whichever token row Postgres happens to return first.
  const driveUserEmail = userData.user?.email ?? (await resolvePrimaryGoogleEmail(supabase))

  const cutoff = new Date(Date.now() - WORK_INTERVAL_MIN * 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('hub_agent_runs')
    .select('id')
    .eq('kind', 'work')
    .gte('created_at', cutoff)
    .limit(1)
  if (recent?.length) return Response.json({ ran: false, reason: 'work cycle ran recently' })

  // Claim the slot immediately so overlapping triggers no-op.
  await supabase.from('hub_agent_runs').insert({ kind: 'work', summary: { status: 'started' } })

  const [{ data: employeesData }, { data: openTasksData }] = await Promise.all([
    supabase.from('hub_ai_employees').select('*'),
    supabase
      .from('hub_tasks')
      .select('*')
      .neq('status', 'done')
      .not('department', 'is', null)
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true, nullsFirst: false }),
  ])

  const employees = (employeesData as HubAiEmployee[]) ?? []
  const openTasks = (openTasksData as HubTask[]) ?? []

  // Only employees whose department has open work; rotate by least recent use.
  const { data: usage } = await supabase
    .from('hub_api_usage')
    .select('employee_id,created_at')
    .not('employee_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(500)
  const lastActive = new Map<string, string>()
  for (const row of usage ?? []) {
    if (!lastActive.has(row.employee_id)) lastActive.set(row.employee_id, row.created_at)
  }

  const eligible = employees
    .filter((e) => openTasks.some((t) => t.department === e.department))
    .sort((a, b) => (lastActive.get(a.id) ?? '').localeCompare(lastActive.get(b.id) ?? ''))
    .slice(0, EMPLOYEES_PER_CYCLE)

  if (!eligible.length) {
    return Response.json({ ran: true, summary: [{ note: 'no departments with open tasks' }] })
  }

  const client = getAnthropicClient()
  const claimed = new Set<string>()

  const results = await Promise.allSettled(
    eligible.map(async (employee) => {
      const task = openTasks.find((t) => t.department === employee.department && !claimed.has(t.id))
      if (!task) return { employee: employee.name, note: 'no task' }
      claimed.add(task.id)

      const [{ data: notes }, { data: docs }, { data: deptDocs }] = await Promise.all([
        supabase
          .from('hub_notes')
          .select('title,content')
          .eq('department', employee.department)
          .order('updated_at', { ascending: false })
          .limit(5),
        supabase
          .from('hub_employee_docs')
          .select('filename,content')
          .eq('employee_id', employee.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('hub_department_docs')
          .select('filename,content')
          .eq('department', employee.department)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const system = buildSystemPrompt({
        employee,
        tasks: [task],
        notes: (notes as HubNote[]) ?? [],
        docs: [
          ...(((docs as { filename: string; content: string }[]) ?? [])),
          ...(((deptDocs as { filename: string; content: string }[]) ?? []).map((d) => ({
            filename: `${d.filename} (department library)`,
            content: d.content,
          }))),
        ].map((d) => ({ filename: d.filename, content: d.content.slice(0, 3000) })),
      })

      const instruction = `Work session. Your assigned task right now:
"${task.title}"${task.notes ? `\nTask detail: ${task.notes}` : ''}

Produce the actual work product for this task — the real deliverable or the strongest possible draft of it, not a plan to make one. Ground it in your document library and recent notes where relevant.

Respond with ONLY a JSON object, no prose:
{"note_title": "short deliverable title (start with 'Draft:' if it needs Lyvia's review before use)", "note_content": "the complete work product", "progress_summary": "1 sentence on what you did and what remains"}`

      const response = await client.messages.create({
        model: JARVIS_MODEL,
        max_tokens: 3000,
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

      const text = response.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
      let parsed: { note_title?: string; note_content?: string; progress_summary?: string } = {}
      try {
        const start = text.indexOf('{')
        const end = text.lastIndexOf('}')
        if (start !== -1 && end > start) parsed = JSON.parse(text.slice(start, end + 1))
      } catch {
        // fall through — treat whole text as content
      }

      const title = (parsed.note_title || `Draft: ${task.title}`).slice(0, 200)
      const content = parsed.note_content || text
      if (!content.trim()) return { employee: employee.name, task: task.title, note: 'empty output' }

      await supabase.from('hub_notes').insert({
        title: `${employee.name}: ${title}`,
        content,
        department: employee.department,
      })
      await supabase.from('hub_tasks').update({ status: 'doing', updated_at: new Date().toISOString() }).eq('id', task.id)

      if (driveUserEmail) {
        try {
          await saveToDrive(supabase, driveUserEmail, employee.name, title, content)
        } catch {
          // Google not connected — note still saved in the hub.
        }
      }

      return { employee: employee.name, task: task.title, produced: title, progress: parsed.progress_summary }
    }),
  )

  const summary = results.map((r) =>
    r.status === 'fulfilled' ? r.value : { error: r.reason instanceof Error ? r.reason.message : 'failed' },
  )
  await supabase.from('hub_agent_runs').insert({ kind: 'work', summary: { status: 'finished', summary } })
  return Response.json({ ran: true, summary })
}
