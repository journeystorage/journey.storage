import { PageHeader } from '@/components/PageHeader'
import { getSupabaseServer } from '@/lib/supabase-server'
import { getGoogleOAuthConfig, hasGoogleConnection } from '@/lib/google'

const NOT_CONNECTED = ['Slack', 'Stripe']

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>
}) {
  const supabase = await getSupabaseServer()
  const googleConfigured = Boolean(getGoogleOAuthConfig())
  const googleConnected = await hasGoogleConnection(supabase)
  const { google: googleParam } = await searchParams

  const connections = [
    { label: 'Supabase', detail: 'Tasks, notes, employees, chat history, usage — all data lives here.', connected: true },
    {
      label: 'Anthropic',
      detail: 'Powers Jarvis and every AI employee.',
      connected: Boolean(process.env.ANTHROPIC_API_KEY),
    },
    {
      label: 'Google (Gmail + Calendar)',
      detail: googleConnected
        ? 'Inbox + calendar read-only; team output filed to Drive under Journey Hub/.'
        : googleConfigured
          ? 'Credentials set — click Connect to grant read-only access.'
          : 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.',
      connected: googleConnected,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader
        title="Connections"
        subtitle="What's actually wired up right now — not a wishlist dressed up as green checkmarks."
      />

      {googleParam === 'error' && (
        <p className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 font-sans text-body-sm text-danger">
          Google connection failed — check the OAuth credentials in .env.local and try again.
        </p>
      )}
      {googleParam === 'connected' && (
        <p className="mb-4 rounded-md border border-status-good/40 bg-status-good/10 px-4 py-3 font-sans text-body-sm text-status-good">
          Google connected. Ask Jarvis about your email or calendar.
        </p>
      )}

      <section className="hud-panel mb-8 p-6">
        <ul className="space-y-4">
          {connections.map((conn) => (
            <li key={conn.label} className="flex items-center gap-3">
              <span
                className={`hub-pulse-dot h-2 w-2 shrink-0 rounded-full ${conn.connected ? 'bg-status-good' : 'bg-danger'}`}
                aria-hidden
              />
              <div className="flex-1">
                <p className="font-sans text-body font-medium text-warm-white">{conn.label}</p>
                <p className="font-sans text-body-sm text-stone">{conn.detail}</p>
              </div>
              {conn.label.startsWith('Google') && !conn.connected && googleConfigured ? (
                <a
                  href="/api/google/auth"
                  className="rounded-md bg-cyan px-3 py-1.5 font-sans text-body-sm font-semibold text-black transition-colors hover:bg-cyan-400"
                >
                  Connect
                </a>
              ) : (
                <span
                  className={`font-sans text-body-sm font-medium ${conn.connected ? 'text-status-good' : 'text-danger'}`}
                >
                  {conn.connected ? 'Connected' : 'Not connected'}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="hud-panel p-6">
        <h2 className="mb-1 font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
          Not yet connected
        </h2>
        <p className="mb-4 font-sans text-body-sm text-stone">
          On the roadmap, not built — nothing here is faked or partially wired.
        </p>
        <ul className="space-y-2">
          {NOT_CONNECTED.map((label) => (
            <li key={label} className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-surface-border" aria-hidden />
              <span className="font-sans text-body text-stone">{label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
