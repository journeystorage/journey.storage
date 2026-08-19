import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { buildSystemPrompt, getAnthropicClient, JARVIS_MODEL } from '@/lib/anthropic'
import { computeCostUsd, summarizeSpend } from '@/lib/cost'
import { executeTool, getToolsFor } from '@/lib/tools'
import { hasGoogleConnection } from '@/lib/google'
import type { HubAiEmployee, HubInsight, HubNote, HubTask } from '@/lib/types'

// Shared by every Jarvis-fronting transport (text chat, voice) so there is
// exactly one place that gathers context, builds the system prompt, and
// exposes tools — a voice-only or chat-only copy of this would be exactly
// the kind of divergent-brains problem this design deliberately avoids.

export interface JarvisContext {
  system: Anthropic.Messages.TextBlockParam[]
  tools: Anthropic.Tool[]
}

export async function gatherJarvisContext(
  supabase: SupabaseClient,
  employee: HubAiEmployee | null,
  mode: 'text' | 'voice' = 'text',
): Promise<JarvisContext> {
  const employeeId = employee?.id ?? null

  const tasksQuery = supabase.from('hub_tasks').select('id,title,status,priority,due_date').neq('status', 'done')
  const notesQuery = supabase.from('hub_notes').select('title,content').order('updated_at', { ascending: false }).limit(10)

  if (employee) {
    tasksQuery.eq('department', employee.department)
    notesQuery.eq('department', employee.department)
  }

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

  const docsQuery = employee
    ? supabase
        .from('hub_employee_docs')
        .select('filename,content')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(8)
    : null

  const deptDocsQuery = employee
    ? supabase
        .from('hub_department_docs')
        .select('filename,content')
        .eq('department', employee.department)
        .order('created_at', { ascending: false })
        .limit(8)
    : null

  const [{ data: tasks }, { data: notes }, docsResult, deptDocsResult, ...extraResults] = await Promise.all([
    tasksQuery,
    notesQuery,
    docsQuery,
    deptDocsQuery,
    ...extraQueries,
  ])

  const [employeesResult, insightsResult, usageResult] = extraResults

  const system = buildSystemPrompt({
    employee,
    mode,
    tasks: (tasks as HubTask[]) ?? [],
    notes: (notes as HubNote[]) ?? [],
    docs: employee
      ? [
          ...((docsResult?.data as { filename: string; content: string }[] | null) ?? []),
          ...((deptDocsResult?.data as { filename: string; content: string }[] | null) ?? []).map((d) => ({
            filename: `${d.filename} (department library)`,
            content: d.content,
          })),
        ]
      : undefined,
    allEmployees: employee ? undefined : ((employeesResult?.data as HubAiEmployee[]) ?? []),
    recentInsights: employee ? undefined : ((insightsResult?.data as HubInsight[]) ?? []),
    spend: employee ? undefined : summarizeSpend((usageResult?.data as { created_at: string; cost_usd: number }[]) ?? []),
  })

  const hasGoogle = await hasGoogleConnection(supabase)
  const tools = getToolsFor(employee, hasGoogle)

  return { system, tools }
}

export interface RunJarvisLoopParams {
  supabase: SupabaseClient
  employee: HubAiEmployee | null
  userEmail: string | null
  context: JarvisContext
  messages: Anthropic.MessageParam[]
  onDelta: (text: string) => void
}

// Agentic loop: stream text out as it arrives; when Claude stops to use
// tools, execute them, feed results back, and continue. MAX_TURNS guards
// against a runaway loop — 8 is far more than any real request needs.
// Persists the assistant's reply and real token usage at the end, same as
// before this was shared between transports.
export async function runJarvisLoop({
  supabase,
  employee,
  userEmail,
  context,
  messages,
  onDelta,
}: RunJarvisLoopParams): Promise<{ fullText: string }> {
  const employeeId = employee?.id ?? null
  const client = getAnthropicClient()
  let fullText = ''

  const totalUsage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  }
  let totalCostUsd = 0

  const MAX_TURNS = 8

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const stream = client.messages.stream({
      model: JARVIS_MODEL,
      max_tokens: 8192,
      output_config: { effort: 'medium' },
      system: context.system,
      messages,
      tools: context.tools,
    })

    stream.on('text', (delta) => {
      fullText += delta
      onDelta(delta)
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
      const result = await executeTool(supabase, employee, block.name, (block.input ?? {}) as Record<string, unknown>, userEmail)
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
    }

    messages.push({ role: 'assistant', content: finalMessage.content })
    messages.push({ role: 'user', content: toolResults })

    // Visual/audible breathing room between pre-tool text and the follow-up.
    if (fullText.trim() && !fullText.endsWith('\n')) {
      fullText += '\n\n'
      onDelta('\n\n')
    }
  }

  const inserts: PromiseLike<unknown>[] = []
  if (fullText.trim()) {
    inserts.push(supabase.from('hub_chat_messages').insert({ role: 'assistant', content: fullText, employee_id: employeeId }))
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

  return { fullText }
}
