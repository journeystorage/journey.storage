import { getSupabaseServer } from '@/lib/supabase-server'
import { saveToDrive } from '@/lib/google'

export const runtime = 'nodejs'

// Decide a proposal. Approve executes the stored action (creates the task or
// note in the employee's department); dismiss just archives it. Either way
// the proposal records when it was decided.
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
    .select('*, hub_ai_employees(name,department)')
    .eq('id', id)
    .eq('status', 'pending')
    .single()

  if (!proposal) return Response.json({ error: 'proposal not found or already decided' }, { status: 404 })

  if (decision === 'approve') {
    const payload = (proposal.action_payload ?? {}) as {
      title?: string
      notes?: string | null
      content?: string | null
      priority?: string | null
      due_date?: string | null
    }
    const employeeInfo = proposal.hub_ai_employees as { name?: string; department?: string } | null
    const department = employeeInfo?.department ?? null

    if (proposal.action_type === 'note') {
      const title = payload.title ?? proposal.title
      const content = payload.content ?? payload.notes ?? proposal.rationale ?? ''
      const { error } = await supabase.from('hub_notes').insert({ title, content, department })
      if (error) return Response.json({ error: error.message }, { status: 500 })
      // Best-effort Drive mirror under the author's folder.
      try {
        await saveToDrive(supabase, employeeInfo?.name ?? 'Team', title, content)
      } catch {
        // Google not connected — note still created in the hub.
      }
    } else {
      const { error } = await supabase.from('hub_tasks').insert({
        title: payload.title ?? proposal.title,
        notes: payload.notes ?? proposal.rationale ?? null,
        priority: payload.priority ?? 'normal',
        due_date: payload.due_date ?? null,
        department,
      })
      if (error) return Response.json({ error: error.message }, { status: 500 })
    }
  }

  const { error: updateError } = await supabase
    .from('hub_proposals')
    .update({ status: decision === 'approve' ? 'approved' : 'dismissed', decided_at: new Date().toISOString() })
    .eq('id', id)

  if (updateError) return Response.json({ error: updateError.message }, { status: 500 })
  return Response.json({ ok: true })
}
