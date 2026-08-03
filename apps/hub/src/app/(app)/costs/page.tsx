import { getSupabaseServer } from '@/lib/supabase-server'
import { formatUsd } from '@/lib/cost'
import type { HubAiEmployee, HubApiUsage } from '@/lib/types'
import { PageHeader } from '@/components/PageHeader'

export default async function CostsPage() {
  const supabase = await getSupabaseServer()
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: usageRows }, { data: employees }] = await Promise.all([
    supabase
      .from('hub_api_usage')
      .select('*')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false }),
    supabase.from('hub_ai_employees').select('*'),
  ])

  const rows = (usageRows as HubApiUsage[]) ?? []
  const employeeById = new Map(((employees as HubAiEmployee[]) ?? []).map((e) => [e.id, e]))

  const todayStr = now.toISOString().slice(0, 10)
  const sevenDaysAgoTime = now.getTime() - 7 * 24 * 60 * 60 * 1000
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysElapsed = now.getDate()

  let todaySpend = 0
  let sevenDaySpend = 0
  let monthToDateSpend = 0
  const spendByPersona = new Map<string, { label: string; total: number; turns: number }>()

  for (const row of rows) {
    const createdAt = new Date(row.created_at)
    if (row.created_at.slice(0, 10) === todayStr) todaySpend += row.cost_usd
    if (createdAt.getTime() >= sevenDaysAgoTime) sevenDaySpend += row.cost_usd
    if (createdAt >= startOfMonth) monthToDateSpend += row.cost_usd

    const key = row.employee_id ?? 'jarvis'
    const label = row.employee_id ? employeeById.get(row.employee_id)?.name ?? 'Deleted employee' : 'Jarvis'
    const existing = spendByPersona.get(key) ?? { label, total: 0, turns: 0 }
    existing.total += row.cost_usd
    existing.turns += 1
    spendByPersona.set(key, existing)
  }

  const projectedThisMonth = daysElapsed > 0 ? (monthToDateSpend / daysElapsed) * daysInMonth : 0
  const breakdown = Array.from(spendByPersona.values()).sort((a, b) => b.total - a.total)
  const maxSpend = Math.max(...breakdown.map((b) => b.total), 0.0001)

  const tiles = [
    { label: 'Today', value: todaySpend },
    { label: '7-day', value: sevenDaySpend },
    { label: 'Month-to-date', value: monthToDateSpend },
    { label: 'Projected this month', value: projectedThisMonth },
  ]

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader title="Costs" subtitle="Real Anthropic API spend — every number here is a real charge, not an estimate." />

      <div className="mb-8 grid grid-cols-4 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="hud-panel p-4">
            <p className="hud-label">{tile.label}</p>
            <p className="mt-1 font-mono text-h2 font-medium text-warm-white">{formatUsd(tile.value)}</p>
          </div>
        ))}
      </div>

      <section className="hud-panel p-6">
        <h2 className="mb-4 font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
          By persona (last 30 days)
        </h2>
        {breakdown.length === 0 ? (
          <p className="font-sans text-body-sm text-stone">No chat activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {breakdown.map((entry) => (
              <li key={entry.label}>
                <div className="mb-1 flex items-center justify-between font-sans text-body-sm">
                  <span className="text-warm-white">
                    {entry.label} <span className="text-stone">· {entry.turns} messages</span>
                  </span>
                  <span className="font-mono font-medium text-warm-white">{formatUsd(entry.total)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-floating">
                  <div
                    className="h-1.5 rounded-full bg-cyan"
                    style={{ width: `${Math.max((entry.total / maxSpend) * 100, 2)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
