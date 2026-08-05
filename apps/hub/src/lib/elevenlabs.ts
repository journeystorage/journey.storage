import 'server-only'

// NOTE: verify this endpoint + response field name against
// https://elevenlabs.io/docs/conversational-ai before first real use —
// written from documented behavior for private-agent signed URLs, not
// copy-pasted from a working call.
export async function mintSignedConversationUrl(): Promise<{ signedUrl: string } | { error: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID
  if (!apiKey || !agentId) return { error: 'ElevenLabs is not configured (ELEVENLABS_API_KEY / ELEVENLABS_AGENT_ID)' }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
    { headers: { 'xi-api-key': apiKey } },
  )
  if (!res.ok) {
    return { error: `ElevenLabs signed-url request failed (${res.status}): ${await res.text().then((t) => t.slice(0, 300))}` }
  }
  const json = (await res.json()) as { signed_url?: string }
  if (!json.signed_url) return { error: 'ElevenLabs did not return a signed_url' }
  return { signedUrl: json.signed_url }
}
