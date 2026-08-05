import { getSupabaseServer } from '@/lib/supabase-server'

export const runtime = 'nodejs'

const GITHUB_OWNER = 'journeystorage'
const GITHUB_REPO = 'journey.storage'

function parsePrNumber(prUrl: string): number | null {
  const match = prUrl.match(/\/pull\/(\d+)/)
  return match ? Number(match[1]) : null
}

// Session-gated like every other Hub route — proxy.ts does not exempt this
// one. This is the ONLY place a code proposal can actually be merged, and
// it is deliberately unreachable from any Jarvis tool (no merge tool exists
// in tools.ts) or from chat/voice input. A UI button click hitting this
// route with a real Supabase session is the only path that can merge or
// deploy anything Jarvis proposed.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const id = body?.id
  const decision = body?.decision

  if (typeof id !== 'string' || !['approve', 'dismiss'].includes(decision)) {
    return Response.json({ error: 'id and decision (approve|dismiss) required' }, { status: 400 })
  }

  const supabase = await getSupabaseServer()
  const { data: proposal } = await supabase
    .from('hub_code_proposals')
    .select('*')
    .eq('id', id)
    .eq('status', 'ready')
    .single()

  if (!proposal) return Response.json({ error: 'proposal not found or not ready' }, { status: 404 })

  const token = process.env.GITHUB_MERGE_TOKEN
  if (!token) return Response.json({ error: 'merge is not configured (no GITHUB_MERGE_TOKEN)' }, { status: 503 })

  const prNumber = proposal.pr_url ? parsePrNumber(proposal.pr_url) : null
  if (!prNumber) return Response.json({ error: 'no pull request associated with this proposal' }, { status: 400 })

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }

  if (decision === 'approve') {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${prNumber}/merge`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ merge_method: 'squash' }),
    })
    if (!res.ok) {
      const detail = await res.text().then((t) => t.slice(0, 300))
      return Response.json({ error: `merge failed (${res.status}): ${detail}` }, { status: 502 })
    }
  } else {
    await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${prNumber}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ state: 'closed' }),
    })
  }

  const { error: updateError } = await supabase
    .from('hub_code_proposals')
    .update({ status: decision === 'approve' ? 'merged' : 'dismissed', decided_at: new Date().toISOString() })
    .eq('id', id)

  if (updateError) return Response.json({ error: updateError.message }, { status: 500 })
  return Response.json({ ok: true })
}
