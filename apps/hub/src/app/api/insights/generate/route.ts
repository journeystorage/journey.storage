import { getSupabaseServer } from '@/lib/supabase-server'
import { getAnthropicClient, JARVIS_MODEL } from '@/lib/anthropic'
import { computeCostUsd } from '@/lib/cost'
import { getDepartment } from '@/lib/departments'
import type { HubAiEmployee, HubNote, HubTask } from '@/lib/types'

export const runtime = 'nodejs'

const INSIGHTS_SCHEMA = {
  type: 'object' as const,
  properties: {
    insights: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          content: { type: 'string' as const },
          category: { type: 'string' as const, enum: ['risk', 'opportunity', 'note'] },
        },
        required: ['content', 'category'],
        additionalProperties: false,
      },
    },
  },
  required: ['insights'],
  additionalProperties: false,
}

// Proxy already rejects unauthenticated requests to /api/* (see src/proxy.ts).
export async function POST() {
  const supabase = await getSupabaseServer()

  const [{ data: tasks }, { data: employees }, { data: notes }] = await Promise.all([
    supabase.from('hub_tasks').select('title,department,status,priority,due_date').neq('status', 'done'),
    supabase.from('hub_ai_employees').select('*'),
    supabase.from('hub_notes').select('title,content,department').order('updated_at', { ascending: false }).limit(20),
  ])

  const taskLines = ((tasks as HubTask[]) ?? [])
    .map((t) => `- [${getDepartment(t.department ?? '')?.label ?? 'Unassigned'}] [${t.priority ?? 'normal'}] ${t.title}${t.due_date ? ` (due ${t.due_date})` : ''}`)
    .join('\n') || '(no open tasks)'

  const employeeLines = ((employees as HubAiEmployee[]) ?? [])
    .map((e) => `- ${e.name}, ${e.role}, ${getDepartment(e.department)?.label}`)
    .join('\n') || '(no AI employees hired yet)'

  const noteLines = ((notes as HubNote[]) ?? [])
    .map((n) => `- [${getDepartment(n.department ?? '')?.label ?? 'Unassigned'}] ${n.title}: ${n.content.slice(0, 200)}`)
    .join('\n') || '(no notes)'

  const system = `You analyze the real current state of Journey Storage's internal hub and produce concrete, grounded observations for the founder. Only state things directly supported by the data given below — never invent trends, external events, market conditions, or signals that aren't present in this data. If a department has nothing notable, don't force an observation about it. Produce 3 to 5 insights, each one or two sentences, direct and specific (name the department/task/employee involved) rather than generic advice.`

  const userContent = `Open tasks:\n${taskLines}\n\nAI employees:\n${employeeLines}\n\nRecent notes:\n${noteLines}`

  const client = getAnthropicClient()
  const response = await client.messages.create({
    model: JARVIS_MODEL,
    max_tokens: 2048,
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema: INSIGHTS_SCHEMA },
    },
    system,
    messages: [{ role: 'user', content: userContent }],
  })

  await supabase.from('hub_api_usage').insert({
    employee_id: null,
    model: JARVIS_MODEL,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
    cache_creation_input_tokens: response.usage.cache_creation_input_tokens ?? 0,
    cache_read_input_tokens: response.usage.cache_read_input_tokens ?? 0,
    cost_usd: computeCostUsd(JARVIS_MODEL, response.usage),
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    return Response.json({ error: 'no insights generated' }, { status: 502 })
  }

  let parsed: { insights: { content: string; category: string }[] }
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    return Response.json({ error: 'could not parse insights' }, { status: 502 })
  }

  const rows = parsed.insights.map((insight) => ({ content: insight.content, category: insight.category }))
  if (rows.length > 0) {
    await supabase.from('hub_insights').insert(rows)
  }

  return Response.json({ inserted: rows.length })
}
