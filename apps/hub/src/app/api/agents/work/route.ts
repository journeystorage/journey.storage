import { getSupabaseServer } from '@/lib/supabase-server'
import { getServiceClient } from '@/lib/service-client'
import { resolvePrimaryGoogleEmail } from '@/lib/google'
import { executeTaskWork } from '@/lib/task-work'
import type { HubAiEmployee, HubTask } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

// The work engine. Each cycle, a few employees pick up an open task in
// their department and actually work it — using the same tools they have
// in chat (create_note, update_task, investor tools, save_to_drive) rather
// than just drafting text for a human to act on. Two guarantees enforced
// regardless of what the model does: a task assigned this cycle always
// ends this cycle at status 'doing', never 'done' — finishing is Lyvia or
// Jonah's call — and some record of the work always lands as a note, even
// if the model never calls create_note itself.
//
// Called by pg_cron (unauthenticated, via service client) or by a signed-in
// user. Self-limits to one cycle per WORK_INTERVAL_MIN so a stray or
// malicious trigger can't burn money — an unauthenticated caller can never
// make it do more than the schedule already does. No department employee
// ever gets the propose_code_change tool (Jarvis-only, see tools.ts) or
// runs as Jarvis (employee is always set here) — this cycle's reach is
// exactly what that employee could already do from their own chat.

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
  const userEmail = userData.user?.email ?? (await resolvePrimaryGoogleEmail(supabase))

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

  const claimed = new Set<string>()

  const results = await Promise.allSettled(
    eligible.map(async (employee) => {
      const task = openTasks.find((t) => t.department === employee.department && !claimed.has(t.id))
      if (!task) return { employee: employee.name, note: 'no task' }
      claimed.add(task.id)

      try {
        const result = await executeTaskWork({ supabase, employee, task, userEmail, allowDone: false })
        return { employee: employee.name, task: task.title, tools_used: result.toolsUsed, saved_note: result.savedNote }
      } catch (err) {
        return { employee: employee.name, task: task.title, error: err instanceof Error ? err.message : 'failed' }
      }
    }),
  )

  const summary = results.map((r) =>
    r.status === 'fulfilled' ? r.value : { error: r.reason instanceof Error ? r.reason.message : 'failed' },
  )
  await supabase.from('hub_agent_runs').insert({ kind: 'work', summary: { status: 'finished', summary } })
  return Response.json({ ran: true, summary })
}
