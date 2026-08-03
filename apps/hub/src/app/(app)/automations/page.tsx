import { PageHeader } from '@/components/PageHeader'

const CANDIDATES = [
  {
    title: 'Flush Hostinger CDN cache',
    description: 'One-click cache flush after a deploy, instead of the manual dashboard click.',
  },
  {
    title: 'Deploy status check',
    description: "Ping each Hostinger instance and show last-deploy status right here.",
  },
  {
    title: 'Lead notifications digest',
    description: 'Roll up new waitlist/lead rows across storage, managed, and direct into one daily view.',
  },
]

export default function AutomationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader
        title="Automations"
        subtitle="Nothing wired up yet — the repo's deploy scripts do a destructive rm -rf as part of the build, so I'm not hooking one-click buttons to them without you naming exactly which actions are safe first."
      />

      <div className="hud-panel p-6">
        <h2 className="mb-4 font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
          Candidates
        </h2>
        <ul className="space-y-4">
          {CANDIDATES.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone" />
              <div>
                <p className="font-sans text-body font-medium text-warm-white">{item.title}</p>
                <p className="font-sans text-body-sm text-stone">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
