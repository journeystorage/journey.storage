import { getSupabaseServer } from '@/lib/supabase-server'
import type { HubInsight } from '@/lib/types'
import { PageHeader } from '@/components/PageHeader'
import { GenerateInsightsButton } from '@/components/GenerateInsightsButton'

const CATEGORY_STYLES: Record<string, string> = {
  risk: 'bg-danger/15 text-danger',
  opportunity: 'bg-violet/15 text-violet',
  note: 'bg-surface-floating text-stone',
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default async function InsightsPage() {
  const supabase = await getSupabaseServer()
  const { data } = await supabase.from('hub_insights').select('*').order('created_at', { ascending: false }).limit(20)
  const insights = (data as HubInsight[]) ?? []

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader
        title="Insights"
        subtitle="Claude reading your actual tasks and notes on demand — grounded in real data, not a live feed."
        actions={<GenerateInsightsButton />}
      />

      {insights.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">
          Nothing yet — click "Generate insights" to have Claude look at what's actually open right now.
        </p>
      ) : (
        <ul className="space-y-3">
          {insights.map((insight) => (
            <li
              key={insight.id}
              className="hud-panel hub-fade-up p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 font-sans text-label font-semibold uppercase tracking-wide ${
                    CATEGORY_STYLES[insight.category ?? 'note']
                  }`}
                >
                  {insight.category ?? 'note'}
                </span>
                <span className="font-sans text-body-sm text-stone">{relativeTime(insight.created_at)}</span>
              </div>
              <p className="font-sans text-body text-warm-white">{insight.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
