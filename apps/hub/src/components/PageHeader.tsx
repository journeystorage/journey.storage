export function PageHeader({
  title,
  subtitle,
  actions,
  kicker,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  kicker?: string
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="hub-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />
          <p className="hud-label">Journey.Storage · Hub{kicker ? ` · ${kicker}` : ''}</p>
        </div>
        <h1 className="font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
          {title}
        </h1>
        {subtitle && <p className="mt-2 font-sans text-body text-stone">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
