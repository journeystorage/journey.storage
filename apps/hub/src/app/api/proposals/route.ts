import { getSupabaseServer } from '@/lib/supabase-server'
import { getUserEmail, saveToDrive } from '@/lib/google'
import { executeTaskWork } from '@/lib/task-work'
import type { HubAiEmployee } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

// Decide a proposal. For a note, the proposal's own content already IS the
// deliverable — approving just files it. For a task, approving is the
// moment Lyvia or Jonah is actually present and engaged, so the employee
// works it for real right then (via executeTaskWork, same tool loop as the
// scheduled work engine) rather than leaving a bare row for some later
// cron cycle to maybe pick up — and because a human explicitly triggered
// this one, the employee may mark it fully done, not just "doing".
// Dismiss just archives the proposal either way.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const id = body?.id
  const decision = body?.decision

  if (typeof id !== 'string' || !['approve', 'dismiss'].includes(decision)) {
    return Response.json({ error: 'id and decision (approve|dismiss) required' }, { status: 400 })
  }

  const supabase = await getSupabaseServer()

  const { data: proposal } = await supabase
    .from('hub_proposals')
    .select('*, hub_ai_employees(*)')
    .eq('id', id)
    .eq('status', 'pending')
    .single()

  if (!proposal) return Response.json({ error: 'proposal not found or already decided' }, { status: 404 })

  let workResult: { toolsUsed: string[]; savedNote: boolean } | null = null

  if (decision === 'approve') {
    const payload = (proposal.action_payload ?? {}) as {
      title?: string
      notes?: string | null
      content?: string | null
      priority?: string | null
      due_date?: string | null
    }
    const employee = proposal.hub_ai_employees as HubAiEmployee | null
    const department = employee?.department ?? null
    const userEmail = await getUserEmail(supabase)

    if (proposal.action_type === 'note') {
      const title = payload.title ?? proposal.title
      const content = payload.content ?? payload.notes ?? proposal.rationale ?? ''
      const { error } = await supabase.from('hub_notes').insert({ title, content, department })
      if (error) return Response.json({ error: error.message }, { status: 500 })
      // Best-effort Drive mirror under the author's folder.
      if (userEmail) {
        try {
          await saveToDrive(supabase, userEmail, employee?.name ?? 'Team', title, content)
        } catch {
          // Google not connected — note still created in the hub.
        }
      }
    } else {
      const { data: task, error } = await supabase
        .from('hub_tasks')
        .insert({
          title: payload.title ?? proposal.title,
          notes: payload.notes ?? proposal.rationale ?? null,
          priority: payload.priority ?? 'normal',
          due_date: payload.due_date ?? null,
          department,
        })
        .select('*')
        .single()
      if (error) return Response.json({ error: error.message }, { status: 500 })

      if (employee) {
        try {
          workResult = await executeTaskWork({ supabase, employee, task, userEmail, allowDone: true })
        } catch (err) {
          // The task row exists either way — surface the failure but don't
          // fail the approval itself, since dismissing it now would just
          // lose the task with no way to retry.
          workResult = { toolsUsed: [], savedNote: false }
          console.error('[proposals] executeTaskWork failed', err)
        }
      }
    }
  }

  const { error: updateError } = await supabase
    .from('hub_proposals')
    .update({ status: decision === 'approve' ? 'approved' : 'dismissed', decided_at: new Date().toISOString() })
    .eq('id', id)

  if (updateError) return Response.json({ error: updateError.message }, { status: 500 })
  return Response.json({ ok: true, work: workResult })
}
