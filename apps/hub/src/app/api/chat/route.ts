import { getSupabaseServer } from '@/lib/supabase-server'
import { buildSystemPrompt, getAnthropicClient, JARVIS_MODEL } from '@/lib/anthropic'
import { computeCostUsd, summarizeSpend } from '@/lib/cost'
import type { HubAiEmployee, HubInsight, HubNote, HubTask } from '@/lib/types'

export const runtime = 'nodejs'

// Proxy already rejects unauthenticated requests to /api/* with a 401
// (see src/proxy.ts); every Supabase query below still goes through RLS on
// the caller's own session as a second layer.
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

  await supabase.from('hub_chat_messages').insert({ role: 'user', content: message, employee_id: employeeId })

  const tasksQuery = supabase.from('hub_tasks').select('title,status,priority,due_date').neq('status', 'done')
  const notesQuery = supabase.from('hub_notes').select('title,content').order('updated_at', { ascending: false }).limit(10)
  const historyQuery = supabase
    .from('hub_chat_messages')
    .select('role,content')
    .order('created_at', { ascending: true })
    .limit(50)

  // Jarvis (no employee) sees everything; an employee sees only their own department.
  if (employee) {
    tasksQuery.eq('department', employee.department)
    notesQuery.eq('department', employee.department)
    historyQuery.eq('employee_id', employeeId)
  } else {
    historyQuery.is('employee_id', null)
  }

  // Jarvis is the connector across everything — pull the full roster, recent
  // insights, and real spend alongside tasks/notes. Department employees
  // stay scoped to their own lane, so they skip all three.
  const extraQueries = employee
    ? []
    : [
        supabase.from('hub_ai_employees').select('name,role,department'),
        supabase.from('hub_insights').select('content,category,created_at').order('created_at', { ascending: false }).limit(5),
        supabase
          .from('hub_api_usage')
          .select('created_at,cost_usd')
          .gte('created_at', new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString()),
      ]

  const [{ data: tasks }, { data: notes }, { data: historyRows }, ...extraResults] = await Promise.all([
    tasksQuery,
    notesQuery,
    historyQuery,
    ...extraQueries,
  ])

  const [employeesResult, insightsResult, usageResult] = extraResults

  const system = buildSystemPrompt({
    employee,
    tasks: (tasks as HubTask[]) ?? [],
    notes: (notes as HubNote[]) ?? [],
    allEmployees: employee ? undefined : ((employeesResult?.data as HubAiEmployee[]) ?? []),
    recentInsights: employee ? undefined : ((insightsResult?.data as HubInsight[]) ?? []),
    spend: employee ? undefined : summarizeSpend((usageResult?.data as { created_at: string; cost_usd: number }[]) ?? []),
  })

  const messages = (historyRows ?? []).map((row) => ({
    role: row.role as 'user' | 'assistant',
    content: row.content as string,
  }))

  const client = getAnthropicClient()
  const stream = client.messages.stream({
    model: JARVIS_MODEL,
    max_tokens: 8192,
    output_config: { effort: 'medium' },
    system,
    messages,
  })

  const encoder = new TextEncoder()
  let fullText = ''

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      stream.on('text', (delta) => {
        fullText += delta
        controller.enqueue(encoder.encode(delta))
      })
      stream.on('error', (err) => {
        controller.error(err)
      })

      let finalMessage
      try {
        finalMessage = await stream.finalMessage()
      } catch (err) {
        controller.error(err)
        return
      }

      const inserts: PromiseLike<unknown>[] = []

      if (fullText.trim()) {
        inserts.push(
          supabase.from('hub_chat_messages').insert({ role: 'assistant', content: fullText, employee_id: employeeId }),
        )
      }

      const usage = finalMessage.usage
      inserts.push(
        supabase.from('hub_api_usage').insert({
          employee_id: employeeId,
          model: JARVIS_MODEL,
          input_tokens: usage.input_tokens,
          output_tokens: usage.output_tokens,
          cache_creation_input_tokens: usage.cache_creation_input_tokens ?? 0,
          cache_read_input_tokens: usage.cache_read_input_tokens ?? 0,
          cost_usd: computeCostUsd(JARVIS_MODEL, usage),
        }),
      )

      await Promise.all(inserts)
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
