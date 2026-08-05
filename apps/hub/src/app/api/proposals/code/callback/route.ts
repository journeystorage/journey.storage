import { getServiceClient } from '@/lib/service-client'

export const runtime = 'nodejs'

// Called by .github/workflows/jarvis-code.yml when a coding run finishes.
// No Supabase session is available here (GitHub Actions can't hold one) —
// gated by a shared secret instead (see proxy.ts, which exempts only this
// exact route from the normal session check). Report-only: this can update
// a hub_code_proposals row's status/pr_url, nothing else. There is no path
// from here (or anywhere reachable from chat/voice) to an actual merge.
export async function POST(req: Request) {
  const secret = req.headers.get('x-code-callback-secret')
  if (!secret || secret !== process.env.CODE_CALLBACK_SECRET) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const proposalId = body?.proposal_id
  const status = body?.status

  if (typeof proposalId !== 'string' || !['ready', 'failed'].includes(status)) {
    return Response.json({ error: 'proposal_id and status (ready|failed) are required' }, { status: 400 })
  }

  const supabase = getServiceClient()
  if (!supabase) return Response.json({ error: 'service client not configured' }, { status: 503 })

  const patch: Record<string, unknown> = { status }
  if (typeof body.pr_url === 'string') patch.pr_url = body.pr_url
  if (typeof body.branch === 'string') patch.branch = body.branch
  if (typeof body.workflow_run_id === 'string' || typeof body.workflow_run_id === 'number') {
    patch.workflow_run_id = String(body.workflow_run_id)
  }
  if (typeof body.summary === 'string') patch.summary = body.summary.slice(0, 4000)

  const { error } = await supabase.from('hub_code_proposals').update(patch).eq('id', proposalId)
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true })
}
