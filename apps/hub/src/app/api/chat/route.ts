import type Anthropic from '@anthropic-ai/sdk'
import { getSupabaseServer } from '@/lib/supabase-server'
import { getUserEmail } from '@/lib/google'
import { gatherJarvisContext, runJarvisLoop } from '@/lib/jarvis-loop'
import type { HubAiEmployee } from '@/lib/types'

export const runtime = 'nodejs'

// Proxy already rejects unauthenticated requests to /api/* with a 401
// (see src/proxy.ts); every Supabase query below still goes through RLS on
// the caller's own session as a second layer. Context-gathering and the
// tool loop itself live in lib/jarvis-loop.ts, shared with the voice
// transport (api/voice/completions) so there's exactly one Jarvis brain.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const message = body?.message
  const employeeId = typeof body?.employeeId === 'string' ? body.employeeId : null

  if (typeof message !== 'string' || !message.trim()) {
    return Response.json({ error: 'message is required' }, { status: 400 })
  }

  const supabase = await getSupabaseServer()

  let employee: HubAiEmployee | null = null
  if (employeeId) {
    const { data } = await supabase.from('hub_ai_employees').select('*').eq('id', employeeId).single()
    employee = (data as HubAiEmployee) ?? null
    if (!employee) {
      return Response.json({ error: 'unknown employee' }, { status: 404 })
    }
  }

  const historyQuery = supabase
    .from('hub_chat_messages')
    .select('role,content')
    .order('created_at', { ascending: true })
    .limit(50)
  if (employee) historyQuery.eq('employee_id', employeeId)
  else historyQuery.is('employee_id', null)

  const userInsert = supabase.from('hub_chat_messages').insert({ role: 'user', content: message, employee_id: employeeId })

  // Built locally from history fetched before this turn's insert, then the
  // current message appended in-memory — not re-read back from the DB
  // after inserting, which used to race (or silently fail with no error
  // surfaced), sometimes calling Claude with an empty `messages` array.
  const [{ data: historyRows }, , context, userEmail] = await Promise.all([
    historyQuery,
    userInsert,
    gatherJarvisContext(supabase, employee),
    getUserEmail(supabase),
  ])

  const messages: Anthropic.MessageParam[] = [
    ...(historyRows ?? []).map((row) => ({
      role: row.role as 'user' | 'assistant',
      content: row.content as string,
    })),
    { role: 'user' as const, content: message },
  ]

  const encoder = new TextEncoder()

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await runJarvisLoop({
          supabase,
          employee,
          userEmail,
          context,
          messages,
          onDelta: (text) => controller.enqueue(encoder.encode(text)),
        })
      } catch (err) {
        controller.error(err)
        return
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
