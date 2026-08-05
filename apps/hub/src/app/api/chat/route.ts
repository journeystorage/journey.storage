import type Anthropic from '@anthropic-ai/sdk'
import { getSupabaseServer } from '@/lib/supabase-server'
import { buildSystemPrompt, getAnthropicClient, JARVIS_MODEL } from '@/lib/anthropic'
import { computeCostUsd, summarizeSpend } from '@/lib/cost'
import { executeTool, getToolsFor } from '@/lib/tools'
import { hasGoogleConnection } from '@/lib/google'
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

  const tasksQuery = supabase.from('hub_tasks').select('id,title,status,priority,due_date').neq('status', 'done')
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

  const userInsert = supabase.from('hub_chat_messages').insert({ role: 'user', content: message, employee_id: employeeId })

  const docsQuery = employee
    ? supabase
        .from('hub_employee_docs')
        .select('filename,content')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(8)
    : null

  // Department library — shared context every employee in the department absorbs.
  const deptDocsQuery = employee
    ? supabase
        .from('hub_department_docs')
        .select('filename,content')
        .eq('department', employee.department)
        .order('created_at', { ascending: false })
        .limit(8)
    : null

  const [{ data: tasks }, { data: notes }, { data: historyRows }, , docsResult, deptDocsResult, ...extraResults] =
    await Promise.all([tasksQuery, notesQuery, historyQuery, userInsert, docsQuery, deptDocsQuery, ...extraQueries])

  const [employeesResult, insightsResult, usageResult] = extraResults

  const system = buildSystemPrompt({
    employee,
    tasks: (tasks as HubTask[]) ?? [],
    notes: (notes as HubNote[]) ?? [],
    docs: employee
      ? [
          ...(((docsResult?.data as { filename: string; content: string }[] | null) ?? [])),
          ...(((deptDocsResult?.data as { filename: string; content: string }[] | null) ?? []).map((d) => ({
            filename: `${d.filename} (department library)`,
            content: d.content,
          }))),
        ]
      : undefined,
    allEmployees: employee ? undefined : ((employeesResult?.data as HubAiEmployee[]) ?? []),
    recentInsights: employee ? undefined : ((insightsResult?.data as HubInsight[]) ?? []),
    spend: employee ? undefined : summarizeSpend((usageResult?.data as { created_at: string; cost_usd: number }[]) ?? []),
  })

  // Built locally rather than re-read back from the DB after the insert
  // above — a read-after-write round trip that was racing (or the insert
  // silently failing with no error surfaced), which is why Claude was
  // sometimes called with an empty `messages` array ("at least one message
  // is required"). historyQuery only ever contains turns before this one.
  const messages: Anthropic.MessageParam[] = [
    ...(historyRows ?? []).map((row) => ({
      role: row.role as 'user' | 'assistant',
      content: row.content as string,
    })),
    { role: 'user' as const, content: message },
  ]

  const client = getAnthropicClient()
  // Everyone gets Drive filing once Google is connected; Gmail/Calendar stay Jarvis-only.
  const hasGoogle = await hasGoogleConnection(supabase)
  const tools = getToolsFor(employee, hasGoogle)
  const encoder = new TextEncoder()
  let fullText = ''

  // Accumulated across every iteration of the tool loop — one usage row per
  // chat turn, same as before tools existed, but now covering all API calls
  // the turn actually made.
  const totalUsage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  }
  let totalCostUsd = 0

  // Agentic loop: stream text out as it arrives; when Claude stops to use
  // tools, execute them, feed results back, and continue. MAX_TURNS guards
  // against a runaway loop — 8 is far more than any real request needs.
  const MAX_TURNS = 8

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let turn = 0; turn < MAX_TURNS; turn++) {
          const stream = client.messages.stream({
            model: JARVIS_MODEL,
            max_tokens: 8192,
            output_config: { effort: 'medium' },
            system,
            messages,
            tools,
          })

          stream.on('text', (delta) => {
            fullText += delta
            controller.enqueue(encoder.encode(delta))
          })

          const finalMessage = await stream.finalMessage()

          totalUsage.input_tokens += finalMessage.usage.input_tokens
          totalUsage.output_tokens += finalMessage.usage.output_tokens
          totalUsage.cache_creation_input_tokens += finalMessage.usage.cache_creation_input_tokens ?? 0
          totalUsage.cache_read_input_tokens += finalMessage.usage.cache_read_input_tokens ?? 0
          totalCostUsd += computeCostUsd(JARVIS_MODEL, finalMessage.usage)

          if (finalMessage.stop_reason !== 'tool_use') break

          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const block of finalMessage.content) {
            if (block.type !== 'tool_use') continue
            const result = await executeTool(
              supabase,
              employee,
              block.name,
              (block.input ?? {}) as Record<string, unknown>,
            )
            toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
          }

          messages.push({ role: 'assistant', content: finalMessage.content })
          messages.push({ role: 'user', content: toolResults })

          // Visual breathing room between pre-tool text and the follow-up.
          if (fullText.trim() && !fullText.endsWith('\n')) {
            fullText += '\n\n'
            controller.enqueue(encoder.encode('\n\n'))
          }
        }
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

      inserts.push(
        supabase.from('hub_api_usage').insert({
          employee_id: employeeId,
          model: JARVIS_MODEL,
          input_tokens: totalUsage.input_tokens,
          output_tokens: totalUsage.output_tokens,
          cache_creation_input_tokens: totalUsage.cache_creation_input_tokens,
          cache_read_input_tokens: totalUsage.cache_read_input_tokens,
          cost_usd: totalCostUsd,
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
