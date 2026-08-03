// Real Anthropic pricing, per million tokens, as of the model's current
// published rate. Update PRICING if pricing changes — this drives real
// dollar figures on /costs, not an estimate.
interface ModelPricing {
  input: number
  output: number
  cacheWrite: number // 5-minute ephemeral cache write, ~1.25x input
  cacheRead: number // ~0.1x input
}

const PRICING: Record<string, ModelPricing> = {
  'claude-opus-5': { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 },
}

export interface UsageInput {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens?: number | null
  cache_read_input_tokens?: number | null
}

export function computeCostUsd(model: string, usage: UsageInput): number {
  const pricing = PRICING[model] ?? PRICING['claude-opus-5']
  const inputCost = usage.input_tokens * pricing.input
  const outputCost = usage.output_tokens * pricing.output
  const cacheWriteCost = (usage.cache_creation_input_tokens ?? 0) * pricing.cacheWrite
  const cacheReadCost = (usage.cache_read_input_tokens ?? 0) * pricing.cacheRead
  return (inputCost + outputCost + cacheWriteCost + cacheReadCost) / 1_000_000
}

export function formatUsd(amount: number): string {
  if (amount < 0.01 && amount > 0) return `$${amount.toFixed(4)}`
  return `$${amount.toFixed(2)}`
}

export interface SpendRow {
  created_at: string
  cost_usd: number
}

// Shared by /costs and Jarvis's context — one real source of truth for
// "how much have we actually spent."
export function summarizeSpend(rows: SpendRow[]) {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let todayUsd = 0
  let monthToDateUsd = 0

  for (const row of rows) {
    if (row.created_at.slice(0, 10) === todayStr) todayUsd += row.cost_usd
    if (new Date(row.created_at) >= startOfMonth) monthToDateUsd += row.cost_usd
  }

  return { todayUsd, monthToDateUsd }
}
