import type Anthropic from '@anthropic-ai/sdk'
import { getServiceClient } from '@/lib/service-client'
import { HUB_ALLOWED_EMAILS } from '@/lib/constants'
import { gatherJarvisContext, runJarvisLoop } from '@/lib/jarvis-loop'

export const runtime = 'nodejs'
export const maxDuration = 60

// ElevenLabs' "Custom LLM" webhook — OpenAI chat-completions-compatible,
// SSE streaming. No Supabase session is available here (see proxy.ts,
// which exempts only this exact route from the normal session check), so
// identity + authorization both come from headers instead: a shared secret
// proving the call actually came from our own ElevenLabs agent config, and
// an explicit user email (from the dynamic variable set in
// /api/voice/session + passed by the browser at conversation start) that
// must be one of the two allowlisted hub users. Jarvis-only for now — this
// route always runs with employee: null, same persona/tools as the text
// chat's Jarvis conversation, never a department employee.
export async function POST(req: Request) {
  const secret = req.headers.get('x-hub-voice-secret')
  if (!secret || secret !== process.env.VOICE_LLM_SECRET) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const userEmail = req.headers.get('x-user-email')
  if (!userEmail || !HUB_ALLOWED_EMAILS.includes(userEmail)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const incoming = Array.isArray(body?.messages) ? (body.messages as { role: string; content: string }[]) : []
  const turns = incoming.filter((m) => m.role === 'user' || m.role === 'assistant')
  if (turns.length === 0 || turns[turns.length - 1].role !== 'user') {
    return Response.json({ error: 'messages must end with a user turn' }, { status: 400 })
  }

  const supabase = getServiceClient()
  if (!supabase) return Response.json({ error: 'service client not configured' }, { status: 503 })

  const messages: Anthropic.MessageParam[] = turns.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const latestUserMessage = turns[turns.length - 1].content

  const [context] = await Promise.all([
    gatherJarvisContext(supabase, null),
    supabase.from('hub_chat_messages').insert({ role: 'user', content: latestUserMessage, employee_id: null }),
  ])

  const id = `chatcmpl-${crypto.randomUUID()}`
  const created = Math.floor(Date.now() / 1000)
  const model = 'jarvis'
  const encoder = new TextEncoder()

  function chunk(delta: Record<string, unknown>, finishReason: string | null = null): string {
    return `data: ${JSON.stringify({
      id,
      object: 'chat.completion.chunk',
      created,
      model,
      choices: [{ index: 0, delta, finish_reason: finishReason }],
    })}\n\n`
  }

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await runJarvisLoop({
          supabase,
          employee: null,
          userEmail,
          context,
          messages,
          // Forwarded live, turn by turn, including any pre-tool-call text
          // — voice has near-zero dead-air tolerance, so this can't buffer
          // until the full reply is ready the way a naive implementation
          // would.
          onDelta: (text) => controller.enqueue(encoder.encode(chunk({ content: text }))),
        })
      } catch (err) {
        controller.enqueue(
          encoder.encode(chunk({ content: "Sorry — something went wrong on my end." }, 'stop')),
        )
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
        console.error('[voice/completions]', err)
        return
      }
      controller.enqueue(encoder.encode(chunk({}, 'stop')))
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
