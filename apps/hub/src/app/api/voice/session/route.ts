import { getSupabaseServer } from '@/lib/supabase-server'
import { getUserEmail } from '@/lib/google'
import { mintSignedConversationUrl } from '@/lib/elevenlabs'

export const runtime = 'nodejs'

// Session-gated like every other Hub route (proxy.ts does not exempt this
// one). Resolves who's actually signed in and hands the browser a signed
// ElevenLabs URL plus that email — the browser passes both to the
// ElevenLabs client SDK as dynamicVariables, which ElevenLabs then forwards
// to /api/voice/completions on every turn of that conversation, since that
// route has no session cookie to read it from itself.
export async function POST() {
  const supabase = await getSupabaseServer()
  const userEmail = await getUserEmail(supabase)
  if (!userEmail) return Response.json({ error: 'not signed in' }, { status: 401 })

  const minted = await mintSignedConversationUrl()
  if ('error' in minted) return Response.json({ error: minted.error }, { status: 502 })

  return Response.json({ signedUrl: minted.signedUrl, userEmail })
}
