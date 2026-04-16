import type { Metadata } from 'next'
import Image from 'next/image'
import DeckNav from './DeckNav'
import AcquisitionsMapClient from './AcquisitionsMapClient'

export const metadata: Metadata = {
  title: 'Journey.Direct™ — Granbury Platform Overview',
  description: 'Operator-led direct investment in self-storage. Granbury, TX portfolio.',
  robots: { index: false, follow: false },
}

const TOTAL_PAGES = 17

/* ─── Shared sub-components ─── */

function PageFooter() {
  return (
    <div className="relative z-10 mt-auto shrink-0 flex items-center justify-center px-5 py-4 lg:py-5">
      <span className="text-[0.6rem] uppercase tracking-[0.12em] text-warm-white/25">
        Privileged &amp; Confidential&ensp;·&ensp;Dallas, TX&ensp;·&ensp;Q2, 2026
      </span>
    </div>
  )
}

function PageDivider() {
  return (
    <div className="lg:hidden h-[3px] bg-orange/40" />
  )
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/images/brand/logo-white-TM.svg"
      alt="Journey.Storage™"
      width={130}
      height={32}
      className={`opacity-80 ${className}`}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px w-8 bg-orange/60" />
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">
        {children}
      </span>
    </div>
  )
}


function GhostText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`hidden lg:block pointer-events-none select-none font-black uppercase leading-none text-warm-white/[0.02] ${className}`}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 1 — COVER
   ═══════════════════════════════════════════════════════ */

function SlideCover() {
  return (
    <section className="deck-page relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-[#111]">
      {/* Padded container — smaller on mobile, larger on desktop */}
      <div className="relative z-10 flex flex-1 flex-col p-3 lg:p-8">
        <div className="grain relative flex flex-1 flex-col overflow-hidden rounded-2xl lg:rounded-3xl">
          <Image
            src="/images/hero/direct-hero-bg.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: 'grayscale(30%) contrast(1.15) brightness(0.45) sepia(0.1)', objectPosition: '50% 62%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(232,98,42,0.1), transparent)' }} />

          {/* Logo */}
          <div className="absolute top-5 right-5 lg:top-8 lg:right-10 z-10">
            <Logo />
          </div>

          {/* Content — centered vertically */}
          <div className="relative z-10 flex flex-1 h-full flex-col items-center justify-center text-center px-6 lg:px-8">
            <span className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.3em] text-orange">— the —</span>
            <h1 className="uppercase leading-[0.88] tracking-[-0.03em] text-warm-white" style={{ fontSize: 'clamp(2.2rem, 9vw, 8rem)' }}>
              <span className="font-black">Journey</span><span className="font-light">.Direct<span className="text-[0.4em] align-super">&trade;</span></span>
            </h1>
            <p className="mt-4 lg:mt-7 text-sm md:text-lg lg:text-xl font-normal tracking-[0.02em] text-warm-white/60">
              Investment Platform&ensp;·&ensp;<span className="font-bold text-warm-white/75">Journey</span><span className="text-warm-white/75">.Storage&trade;</span> Ecosystem
            </p>
            <div className="mt-4 lg:mt-6 inline-flex items-center gap-2 rounded-full border border-warm-white/[0.08] bg-warm-white/[0.03] backdrop-blur-sm px-4 py-1.5">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Est. 2026</span>
            </div>
          </div>

          {/* Orange accent line — desktop only */}
          <div className="absolute bottom-0 left-0 right-0 h-px z-10 hidden lg:block" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(232,98,42,0.5) 30%, rgba(232,98,42,0.5) 70%, transparent 95%)' }} />
        </div>
      </div>

      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 2 — THE OPPORTUNITY (NEW)
   ═══════════════════════════════════════════════════════ */

function SlideOpportunity() {
  const benefits = [
    {
      title: 'Operator-led, not fund-managed',
      desc: 'Every deal is sourced, operated, and managed by the same team.',
    },
    {
      title: 'Value created through operations, not speculation',
      desc: '$200M+ in acquisitions built on operational transformation, not market timing.',
    },
    {
      title: 'Aligned incentives',
      desc: 'The sponsor co-invests in every deal. Same risk, same upside.',
    },
  ]

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <GhostText className="absolute -left-4 top-[15%] text-[10rem] lg:text-[14rem]">
        Opportunity
      </GhostText>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(232,98,42,0.04), transparent)' }} />

      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-8">
          <SectionLabel>The Platform</SectionLabel>
          <Logo />
        </div>

        {/* Headline — the moment */}
        <h2 className="font-black leading-[1.1] tracking-[-0.02em] text-warm-white mb-4" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>
          Invest alongside the operator.<br />
          <span className="text-warm-white/45">Not through a fund.</span><br />
          <span className="text-warm-white/45">Not through a REIT.</span><br />
          <span className="text-orange italic font-light">Directly.</span>
        </h2>

        {/* Closing line — elevated, not buried */}
        <p className="text-body leading-[1.7] text-warm-white/55 mb-10 max-w-[600px]">
          Journey.Direct is the platform. The deals are the opportunity.
        </p>

        {/* Benefits — three clean columns, no cards */}
        <div className="grid gap-8 lg:grid-cols-3 border-t border-warm-white/[0.06] pt-8">
          {benefits.map((b, i) => (
            <div key={i}>
              <div className="h-[3px] w-8 bg-orange rounded-full mb-3" />
              <h3 className="text-[0.95rem] font-bold leading-snug text-warm-white mb-1.5">{b.title}</h3>
              <p className="text-body leading-[1.6] text-warm-white/55">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 3 — THE OPERATOR
   ═══════════════════════════════════════════════════════ */

function SlideOperator() {
  const capabilities = [
    'Acquisitions', 'Asset Management',
    'Development', 'Investor Relations',
    'Construction', 'Capital Raising',
    'Facility Operations', 'Deal Structuring',
    'Property Management',
  ]

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <GhostText className="absolute -right-4 top-[10%] text-[10rem] lg:text-[14rem]">
        Mission
      </GhostText>

      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 lg:mb-10">
          <SectionLabel>Leadership</SectionLabel>
          <Logo />
        </div>

        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-1" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
          On a Mission
        </h2>
        <p className="text-body-sm font-bold text-orange mb-6">Impact &amp; Excellence; Mediocre won&apos;t Suffice</p>

        <div className="grid gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_1fr]">
          {/* LEFT — Jonah */}
          <div>
            <div className="relative h-[180px] w-[180px] overflow-hidden rounded-2xl bg-charcoal mb-4">
              <Image src="/images/team/home-jonah-portrait.webp" alt="Jonah M. Hall" fill className="object-cover object-top" />
            </div>
            <h3 className="text-xl font-black text-warm-white mb-1">Jonah M. Hall</h3>
            <ul className="space-y-0.5 text-[0.9rem] leading-[1.65] text-warm-white/70">
              <li><span className="text-orange mr-1.5">•</span>Deep Industry Relationships</li>
              <li><span className="text-orange mr-1.5">•</span>Proven Team Building</li>
              <li><span className="text-orange mr-1.5">•</span>Operational Mastery</li>
              <li><span className="text-orange mr-1.5">•</span>Transactional Prowess</li>
            </ul>
            <div className="mt-3 hidden lg:flex items-center gap-2">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <Image src="/images/other/qr-code.webp" alt="QR code — team & full bio" fill className="object-contain" />
              </div>
              <span className="text-[0.65rem] text-warm-white/40 leading-tight">Full bio<br />&amp; team</span>
            </div>
          </div>

          {/* CENTER — Capabilities bar + Context + Divestiture */}
          <div className="flex flex-col">
            <p className="text-[0.95rem] leading-[1.7] text-warm-white/70 mb-3">
              In under a decade in the industry, Jonah has served in almost every capacity, wearing the hats and running point directly, as well as building teams, systems and critical infrastructure around:
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {capabilities.map((c, i) => (
                <span key={i} className="rounded-md bg-warm-white/[0.05] border border-orange/20 px-3 py-1 text-[0.85rem] text-warm-white/65">
                  {c}
                </span>
              ))}
            </div>

            <div className="border-l-2 border-orange/40 pl-5 mt-auto">
              <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white/70 mb-1">A Decisive Divestiture</h4>
              <p className="text-[0.88rem] leading-[1.75] text-warm-white/60">
                In January 2026, Jonah M. Hall successfully exited his previous venture, <em className="text-warm-white/70">Smartlock Self Storage&reg;</em>, and walked away from his active principal position as President and Chief Investment Officer at another industry giant, <em className="text-warm-white/70">Cedar Creek Capital&reg;</em> — a calculated maneuver to sever ties with legacy infrastructure and non-compete encumbrances, eliminate go-forward liability through full mutual releases and covenants not to sue, reclaiming sovereignty and clearing the path for the Ecosystem.
              </p>
            </div>
          </div>

          {/* RIGHT — Map + Proof bar (bigger) */}
          <div className="overflow-hidden rounded-xl border border-warm-white/[0.06] flex flex-col">
            <div className="relative flex-1 min-h-[220px] bg-[#181818]">
              <AcquisitionsMapClient />
            </div>
            <div className="flex items-center justify-around bg-charcoal/50 px-4 py-2.5 border-t border-warm-white/[0.06]">
              <div className="text-center">
                <div className="text-xl font-black leading-none text-warm-white">$200M<span className="text-orange">+</span></div>
                <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Acquired</div>
              </div>
              <div className="h-6 w-px bg-warm-white/[0.08]" />
              <div className="text-center">
                <div className="text-xl font-black leading-none text-warm-white">30</div>
                <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Facilities · 6 states</div>
              </div>
              <div className="h-6 w-px bg-warm-white/[0.08]" />
              <div className="text-center">
                <div className="text-xl font-black leading-none text-warm-white">18<span className="text-orange">+</span> Yrs</div>
                <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 4 — THE STORAGE INFLECTION POINT
   ═══════════════════════════════════════════════════════ */

function SlideMarket() {
  const supplyData = [
    { year: '2023', build: '778', exp: '427', total: '1,205' },
    { year: '2024', build: '692', exp: '215', total: '907' },
    { year: '2025', build: '561', exp: '107', total: '668' },
    { year: '2026', build: '447', exp: '137', total: '584' },
    { year: '2027', build: '440', exp: '121', total: '561' },
    { year: '2028', build: '343', exp: '108', total: '451' },
    { year: '2029', build: '337', exp: '118', total: '455' },
  ]

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(232,98,42,0.03), transparent)' }} />

      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>The Market</SectionLabel>
          <Logo />
        </div>

        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-10" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)' }}>
          Self Storage&apos;s Inflection Point
        </h2>

        {/* Declining numbers — pills with proportional accent bars */}
        <div className="flex items-end flex-wrap gap-2 lg:gap-3 mb-6">
          {supplyData.map((d, i) => {
            const val = parseInt(d.total.replace(',', ''))
            const maxVal = 1205
            const pct = (val / maxVal) * 100
            return (
              <div key={d.year} className="relative overflow-hidden rounded-lg bg-warm-white/[0.04] border border-warm-white/[0.06] px-3 py-2 text-center">
                <div className="font-mono font-black text-warm-white leading-none" style={{ fontSize: `clamp(0.9rem, ${1.8 - i * 0.08}vw, ${1.8 - i * 0.08}rem)`, opacity: 0.95 - i * 0.07 }}>
                  {d.total}
                </div>
                <div className="text-[0.55rem] font-bold text-warm-white/25 mt-1">{d.year}</div>
                {/* Proportional accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-warm-white/[0.03]">
                  <div className="h-full bg-orange rounded-full" style={{ width: `${pct}%`, opacity: 0.5 + (pct / 100) * 0.5 }} />
                </div>
              </div>
            )
          })}
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-orange ml-2 mb-2">total<br />new supply</span>
        </div>

        {/* HERO — Integrated chart + data table (single SVG) */}
        {(() => {
          const totals = supplyData.map(d => parseInt(d.total.replace(',', '')))
          const builds = supplyData.map(d => parseInt(d.build))
          const exps = supplyData.map(d => parseInt(d.exp))
          const maxVal = 1400
          const w = 900
          const chartH = 180
          const tableH = 100
          const h = chartH + tableH
          const padL = 60
          const padR = 40
          const padT = 15
          const colW = (w - padL - padR) / (totals.length - 1)

          const x = (i: number) => padL + i * colW
          const y = (val: number) => padT + (1 - val / maxVal) * (chartH - padT - 10)

          const totalLine = totals.map((v, i) => `${x(i)},${y(v)}`).join(' ')
          const buildLine = builds.map((v, i) => `${x(i)},${y(v)}`).join(' ')
          const expLine = exps.map((v, i) => `${x(i)},${y(v)}`).join(' ')
          const areaPath = `M${x(0)},${y(totals[0])} ${totals.map((v, i) => `L${x(i)},${y(v)}`).join(' ')} L${x(totals.length-1)},${chartH} L${x(0)},${chartH} Z`

          const rowY = (row: number) => chartH + 8 + row * 24

          return (
            <div className="mb-5 overflow-x-auto">
              <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '340px', minWidth: '600px' }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8622A" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#E8622A" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* === CHART ZONE === */}
                {/* Subtle grid */}
                {[400, 800, 1200].map(v => (
                  <line key={v} x1={padL} y1={y(v)} x2={w - padR} y2={y(v)} stroke="rgba(245,240,232,0.04)" strokeWidth="1" />
                ))}
                {/* Area */}
                <path d={areaPath} fill="url(#areaFill)" />
                {/* Lines */}
                <polyline points={expLine} fill="none" stroke="rgba(245,240,232,0.15)" strokeWidth="1.5" strokeDasharray="4 3" />
                <polyline points={buildLine} fill="none" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />
                <polyline points={totalLine} fill="none" stroke="#E8622A" strokeWidth="3" strokeLinejoin="round" />
                {/* Dots */}
                {totals.map((v, i) => (
                  <circle key={i} cx={x(i)} cy={y(v)} r="5" fill="#E8622A" stroke="#181818" strokeWidth="2.5" />
                ))}
                {/* Vertical guides connecting chart to table */}
                {totals.map((_, i) => (
                  <line key={i} x1={x(i)} y1={chartH} x2={x(i)} y2={chartH + tableH - 10} stroke="rgba(245,240,232,0.04)" strokeWidth="1" />
                ))}

                {/* === TABLE ZONE (integrated) === */}
                {/* Divider */}
                <line x1={padL - 20} y1={chartH} x2={w - padR + 10} y2={chartH} stroke="rgba(245,240,232,0.08)" strokeWidth="1" />

                {/* Row labels */}
                <text x={padL - 25} y={rowY(0) + 5} textAnchor="end" fill="rgba(245,240,232,0.35)" fontSize="11" fontWeight="700" fontFamily="'Lato', sans-serif">Year</text>
                <text x={padL - 25} y={rowY(1) + 5} textAnchor="end" fill="rgba(245,240,232,0.3)" fontSize="11" fontFamily="'Lato', sans-serif">Build</text>
                <text x={padL - 25} y={rowY(2) + 5} textAnchor="end" fill="rgba(245,240,232,0.3)" fontSize="11" fontFamily="'Lato', sans-serif">Expand</text>
                <text x={padL - 25} y={rowY(3) + 5} textAnchor="end" fill="#E8622A" fontSize="11" fontWeight="700" fontFamily="'Lato', sans-serif">Total</text>

                {/* Data columns — aligned with chart points */}
                {supplyData.map((d, i) => (
                  <g key={i}>
                    <text x={x(i)} y={rowY(0) + 5} textAnchor="middle" fill="rgba(245,240,232,0.4)" fontSize="12" fontWeight="700" fontFamily="'Lato', sans-serif">{d.year}</text>
                    <text x={x(i)} y={rowY(1) + 5} textAnchor="middle" fill="rgba(245,240,232,0.3)" fontSize="12" fontFamily="var(--font-mono), monospace">{d.build}</text>
                    <text x={x(i)} y={rowY(2) + 5} textAnchor="middle" fill="rgba(245,240,232,0.25)" fontSize="12" fontFamily="var(--font-mono), monospace">{d.exp}</text>
                    <text x={x(i)} y={rowY(3) + 5} textAnchor="middle" fill="#E8622A" fontSize="13" fontWeight="700" fontFamily="var(--font-mono), monospace">{d.total}</text>
                  </g>
                ))}

                {/* Row dividers */}
                {[0, 1, 2].map(row => (
                  <line key={row} x1={padL - 20} y1={rowY(row) + 12} x2={w - padR + 10} y2={rowY(row) + 12} stroke="rgba(245,240,232,0.03)" strokeWidth="1" />
                ))}
              </svg>

              {/* Legend */}
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-5">
                  <span className="flex items-center gap-2 text-[0.75rem] text-warm-white/50"><span className="inline-block w-5 h-[2px] bg-warm-white/30" />New Build</span>
                  <span className="flex items-center gap-2 text-[0.75rem] text-warm-white/25"><span className="inline-block w-5 h-[1.5px] border-t border-dashed border-warm-white/25" />Expansion</span>
                </div>
                <span className="flex items-center gap-2 text-[0.75rem] font-bold text-orange"><span className="inline-block w-5 h-[3px] bg-orange rounded-full" />Total New Supply · Nationwide</span>
              </div>
            </div>
          )
        })()}

        {/* Bottom — Market context + Execution punchline */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-body leading-[1.7] text-warm-white/60">
              <strong className="text-warm-white/80">REITs</strong> dominate ~40% through scale. The remaining ~60% are fragmented <strong className="text-warm-white/80">Mom-and-Pop operators</strong> on legacy practices. Demand stays resilient — driven by the &ldquo;4 Ds&rdquo;: <strong className="text-orange">Death</strong>, <strong className="text-orange">Divorce</strong>, <strong className="text-orange">Downsizing</strong>, <strong className="text-orange">Dislocation</strong>. But the easy money has been made. As operators retire, supply thins. The window is now.
            </p>
          </div>
          <div className="flex items-center">
            <div className="border-l-2 border-orange pl-5">
              <p className="text-body font-bold leading-[1.5] text-warm-white max-w-[320px]">
                We acquire below replacement cost and transform with REIT-level technology — without REIT-level overhead.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 5 — STORAGE WITHOUT THE FRICTION
   ═══════════════════════════════════════════════════════ */

function SlideOperations() {
  const journey = [
    { num: '01', title: 'Find your space', desc: 'Browse and rent online. No phone calls, no office visits.' },
    { num: '02', title: 'Verify in seconds', desc: 'Digital identity verification. No paperwork.' },
    { num: '03', title: 'Sign and access', desc: 'Digital lease. Instant access code to your phone.' },
    { num: '04', title: 'Arrive and move in', desc: 'Gates open automatically. Any hour, any day.' },
    { num: '05', title: 'You\'re in control', desc: 'Manage, pay, upgrade, or move out from your phone.' },
  ]

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)' }} />

      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Operations</SectionLabel>
          <Logo />
        </div>

        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-3" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
          Storage Without the Friction
        </h2>

        {/* Tagline hero — the one sentence Jonah builds his pitch around */}
        <div className="mb-8">
          <p className="text-body-sm font-bold uppercase tracking-[0.1em] text-warm-white/50 mb-2">Our Operational Philosophy</p>
          <p className="text-xl lg:text-2xl font-light italic text-orange leading-[1.4]">
            &ldquo;Frictionless Commerce at 11:00pm on a Weekday.&rdquo;
          </p>
          <p className="mt-2 text-body text-warm-white/50">
            Our competitors close at 5 PM. We never close. Technology is the moat.
          </p>
        </div>

        {/* Two-column: Customer journey + Value chain */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left — Customer journey (the system) */}
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mb-4">The Customer Experience</p>
            <div className="space-y-3">
              {journey.map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange/15 font-mono text-[0.6rem] font-bold text-orange mt-0.5">{step.num}</span>
                  <div>
                    <h4 className="text-[0.95rem] font-bold text-warm-white leading-snug">{step.title}</h4>
                    <p className="text-[0.9rem] leading-[1.6] text-warm-white/50">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Value chain (why it matters to the investor) */}
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mb-4">Why It Matters</p>
            <div className="space-y-4">
              <div className="border-l-2 border-warm-white/10 pl-4">
                <h4 className="text-[0.95rem] font-bold text-warm-white">The customer wins</h4>
                <p className="text-[0.9rem] leading-[1.6] text-warm-white/50">Rent anytime. Instant access. Zero friction. Higher satisfaction, lower churn.</p>
              </div>
              <div className="border-l-2 border-warm-white/10 pl-4">
                <h4 className="text-[0.95rem] font-bold text-warm-white">Revenue wins</h4>
                <p className="text-[0.9rem] leading-[1.6] text-warm-white/50">Decreased payroll costs. Data-driven pricing. Higher occupancy from 24/7 availability.</p>
              </div>
              <div className="border-l-2 border-orange pl-4">
                <h4 className="text-[0.95rem] font-bold text-orange">The investor wins</h4>
                <p className="text-[0.9rem] leading-[1.6] text-warm-white/55">Higher NOI. Stronger returns. A defensible operational moat that compounds over time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 6 — GROWTH THESIS
   ═══════════════════════════════════════════════════════ */

function SlideGrowthThesis() {
  const buyBox = [
    { label: 'Market Characteristics', desc: 'Tier 1-3 markets with favorable supply/demand metrics.' },
    { label: 'Demographics', desc: 'Min. 30k people in trade area, positive pop. growth and min. HHI of $60k.' },
    { label: 'Demand', desc: 'Areas indicating strong demand, with manual verifications of pricing & occupancy.' },
    { label: 'Business Friendliness', desc: 'Markets that highlight technology efficiencies and avoid landlord-hurdles.' },
  ]

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 40%, rgba(232,98,42,0.03), transparent)' }} />

      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Strategy</SectionLabel>
          <Logo />
        </div>

        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-3" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)' }}>
          Growth Thesis
        </h2>
        <p className="text-body-sm font-bold uppercase tracking-[0.12em] text-warm-white/50 mb-8">The &ldquo;Value-Add&rdquo; Math</p>

        {/* HERO — The equation */}
        <div className="flex items-center justify-center gap-4 lg:gap-6 mb-3">
          <div className="text-center">
            <div className="font-mono font-black text-warm-white leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontVariantNumeric: 'tabular-nums' }}>$5M</div>
            <div className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">The Buy</div>
          </div>
          <span className="text-2xl text-warm-white/20">→</span>
          <div className="text-center">
            <div className="font-mono font-black text-warm-white leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontVariantNumeric: 'tabular-nums' }}>$8M</div>
            <div className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">The Exit</div>
          </div>
          <span className="text-2xl text-warm-white/20">=</span>
          <div className="text-center">
            <div className="font-mono font-black text-orange leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontVariantNumeric: 'tabular-nums' }}>+$3M</div>
            <div className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-orange/60">Value Created</div>
          </div>
        </div>
        <p className="text-center text-body-sm text-warm-white/55 mb-10 max-w-[650px] mx-auto">
          A facility purchased at a 6% Cap Rate ($300k NOI). Decrease payroll by $80k/year, raise rents 18%. NOI grows to $480k. At the same 6% Cap Rate, it&apos;s worth $8M. <strong className="text-warm-white/65">No speculation. Pure operational value.</strong>
        </p>

        {/* Supporting — Buy Box + UW Inputs side by side */}
        <div className="grid gap-8 lg:grid-cols-2 border-t border-warm-white/[0.06] pt-6">
          <div>
            <h3 className="mb-3 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/55">The Deal Buy Box</h3>
            <div className="space-y-2">
              {buyBox.map((b, i) => (
                <div key={i} className="flex gap-2 text-[0.9rem] leading-[1.6]">
                  <span className="text-orange shrink-0">•</span>
                  <span className="text-warm-white/55"><strong className="text-warm-white/80">{b.label}:</strong> {b.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/55">Key Underwriting Inputs / Value-Add Execution(s)</h3>
            <div className="space-y-2">
              {[
                { label: 'Projection Models', desc: 'A decade of storage-specific underwriting experience.' },
                { label: 'Onboarding Cap-Ex', desc: '$200-500k set aside to ensure tech/brand standards.' },
                { label: 'Financing', desc: '55-65% LTC at competitive rates, sized IO periods w/o prepayment penalties.' },
                { label: 'Conservative Outlook', desc: '24-48 month physical lease-up to 85-90% occupancy, then property-specific revenue stabilization through ECRI\'s (existing customer rental increases).' },
                { label: 'Data Analytics', desc: 'Direct investment in and continued adoption of the best in technology the industry has to offer.' },
              ].map((u, i) => (
                <div key={i} className="flex gap-2 text-[0.9rem] leading-[1.6]">
                  <span className="text-orange shrink-0">•</span>
                  <span className="text-warm-white/55"><strong className="text-warm-white/80">{u.label}:</strong> {u.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 7 — DEAL COVER (Granbury)
   ═══════════════════════════════════════════════════════ */

function SlideDealCover() {
  return (
    <section className="deck-page relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-[#111]">
      <div className="relative z-10 flex flex-1 flex-col p-3 lg:p-8">
        <div className="grain relative flex flex-1 flex-col overflow-hidden rounded-2xl lg:rounded-3xl">
          <Image src="/images/deals/granbury/granbury-2.jpg" alt="" fill className="object-cover" style={{ filter: 'grayscale(30%) contrast(1.15) brightness(0.4) sepia(0.1)', objectPosition: '50% bottom', transform: 'scale(1.35)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 lg:from-black/60 lg:via-black/30 lg:to-black/75" />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(232,98,42,0.1), transparent)' }} />

          {/* Logo */}
          <div className="absolute top-5 right-5 lg:top-8 lg:right-10 z-10">
            <Logo />
          </div>

          {/* Content — centered vertically */}
          <div className="relative z-10 flex flex-1 h-full flex-col items-center justify-center text-center px-6 lg:px-8">
            <span className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.3em] text-orange">— current deal —</span>
            <h1 className="uppercase leading-[0.88] tracking-[-0.03em] text-warm-white" style={{ fontSize: 'clamp(1.8rem, 6vw, 6rem)' }}>
              <span className="font-black">Journey</span><span className="font-light">.Storage<span className="text-[0.5em] align-super">&trade;</span></span>
            </h1>
            <p className="font-light italic leading-[1.0] tracking-[-0.03em] text-orange" style={{ fontSize: 'clamp(2rem, 7vw, 7rem)' }}>
              Granbury
            </p>
            <p className="mt-4 lg:mt-7 text-sm md:text-lg lg:text-xl font-normal tracking-[0.02em] text-warm-white/60">
              Current Investment Opportunity&ensp;·&ensp;An Offering from <span className="font-bold text-warm-white/75">Journey</span><span className="text-warm-white/75">.Direct&trade;</span>
            </p>
            <div className="mt-4 lg:mt-6 inline-flex items-center gap-2 rounded-full border border-warm-white/[0.08] bg-warm-white/[0.03] backdrop-blur-sm px-4 py-1.5">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Est. 2026</span>
            </div>
          </div>

          {/* Orange accent line — desktop only */}
          <div className="absolute bottom-0 left-0 right-0 h-px z-10 hidden lg:block" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(232,98,42,0.5) 30%, rgba(232,98,42,0.5) 70%, transparent 95%)' }} />
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 8 — DISCLAIMER
   ═══════════════════════════════════════════════════════ */

function SlideDisclaimer() {
  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <div />
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Disclaimer
        </h2>
        <div className="text-[0.85rem] leading-[1.8] lg:leading-[1.7] text-warm-white/50">
          {/* Section 1 — General */}
          <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-orange/50">General</p>
          <p className="mb-4">
            This contains privileged and confidential information and unauthorized use of this information in any manner is strictly prohibited. This is for informational purposes and not intended to be a general solicitation or a securities offering of any kind. The information contained herein is from sources believed to be reliable, however no representation by Journey.Direct&trade; (&ldquo;JD&rdquo;), nor by Journey.Storage&trade; (&ldquo;JS&rdquo;), either expressed or implied, is made as to the accuracy of any information and all investors should conduct their own research to determine the accuracy of any statements made.
          </p>
          <p className="mb-5">
            Neither JD (nor JS), nor their representatives, officers, employees, affiliates, sub-contractors or vendors provide tax, legal or investment advice. Nothing in this document is intended to be or should be construed as such advice. The SEC has not passed upon the merits of or given its approval to the securities, the terms of the offering, or the accuracy or completeness of any offering materials.
          </p>

          {/* Section 2 — Forward-Looking Statements */}
          <div className="border-t border-warm-white/[0.06] pt-4 mb-4">
            <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-orange/50">Forward-Looking Statements</p>
            <p className="mb-4">
              Potential investors and other readers are also cautioned that these forward-looking statements are predictions only based on current information, assumptions and expectations that are inherently subject to risks and uncertainties that could cause future events or results to differ materially from those set forth or implied by such forward looking statements. These forward-looking statements can be identified by the use of forward-looking terminology, such as &ldquo;may,&rdquo; &ldquo;will,&rdquo; &ldquo;seek,&rdquo; &ldquo;should,&rdquo; &ldquo;expect,&rdquo; &ldquo;anticipate,&rdquo; &ldquo;project,&rdquo; &ldquo;estimate,&rdquo; &ldquo;intend,&rdquo; &ldquo;continue,&rdquo; or &ldquo;believe&rdquo; or the negatives thereof or other variations thereon or comparable terminology.
            </p>
            <p>
              This further contains several future financial projections and forecasts. These estimated projections are based on numerous assumptions and hypothetical scenarios and JD (and JS) explicitly make no representation or warranty of any kind with respect to any financial projection or forecast.
            </p>
          </div>

          {/* Section 3 — Past Performance */}
          <div className="border-t border-warm-white/[0.06] pt-4">
            <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-orange/50">Past Performance</p>
            <div className="border-l-2 border-orange/30 pl-4">
              <p>
                <strong className="text-warm-white/70">Past performance does not guarantee future results.</strong> Current performance may be lower or higher than the performance data presented. All return examples provided are based on assumptions and expectations in light of currently available information, industry trends and comparisons to competitor&apos;s financials. Therefore, actual performance may, and most likely will, substantially differ from these projections and no guarantee is presented or implied as to the accuracy of specific forecasts, projections or predictive statements contained herein. JD (and JS) further make no representations or warranties that any investor will, or is likely to, achieve profits similar to those shown herein.
              </p>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 9 — CURRENT OPPORTUNITY
   ═══════════════════════════════════════════════════════ */

function SlideCurrentOpportunity() {
  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Current Deal</SectionLabel>
          <Logo />
        </div>

        <h2 className="uppercase leading-[0.95] tracking-[-0.02em] text-warm-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          <span className="font-black">Journey</span><span className="font-light">.Storage&trade;</span> <span className="normal-case">—</span> <span className="font-light italic text-orange normal-case">Granbury</span>
        </h2>

        {/* Deal snapshot — metrics */}
        <div className="border-y border-warm-white/[0.06] py-4 mb-2">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3 lg:flex lg:items-center lg:gap-5 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <div><span className="text-base lg:text-lg font-black text-warm-white">773</span> <span className="text-[0.9rem] leading-[1.6] text-warm-white/50">Units</span></div>
            <div className="h-4 w-px bg-warm-white/[0.1] hidden lg:block" />
            <div><span className="text-base lg:text-lg font-black text-warm-white">126K</span> <span className="text-[0.9rem] leading-[1.6] text-warm-white/50">NRSF</span></div>
            <div className="h-4 w-px bg-warm-white/[0.1] hidden lg:block" />
            <div><span className="text-base lg:text-lg font-black text-orange">$85</span><span className="text-[0.9rem] leading-[1.6] text-warm-white/50">/NRSF</span></div>
            <div className="h-4 w-px bg-warm-white/[0.1] hidden lg:block" />
            <div><span className="text-base lg:text-lg font-black text-orange">$96</span><span className="text-[0.9rem] leading-[1.6] text-warm-white/50">/NRSF all-in</span></div>
            <div className="h-4 w-px bg-warm-white/[0.1] hidden lg:block" />
            <div className="col-span-2"><span className="text-base lg:text-lg font-black text-warm-white">~15%</span> <span className="text-[0.9rem] leading-[1.6] text-warm-white/50">below replacement</span></div>
          </div>
        </div>
        {/* Addresses — metadata, lower hierarchy */}
        <div className="flex items-center flex-wrap gap-2 lg:gap-3 mb-8 text-[0.7rem] text-warm-white/25">
          <span>Granbury, TX</span>
          <span className="text-warm-white/10 hidden md:inline">·</span>
          <span><span className="text-orange/40 font-bold">#1</span> 212 Temple Hall Hwy</span>
          <span className="text-warm-white/10 hidden md:inline">·</span>
          <span><span className="text-orange/40 font-bold">#2</span> 409 Western Hills Trl</span>
          <span className="text-warm-white/10 hidden md:inline">·</span>
          <span><span className="text-orange/40 font-bold">#3</span> 3501 McCreary Rd</span>
        </div>

        {/* We Will + Results */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-warm-white">We Will:</h3>
            <ul className="space-y-3">
              {[
                'Immediately implement additional ancillary revenue sources increasing topline revenue by ~$50k/yr.',
                'Increase occupancy from 70% to ~90% over the first 24 months.',
                'Increase in-place rates from ~$.87/SF to ~$1.02/SF through calculated ECRI\'s from month 18-36.',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[0.9rem] leading-[1.6] text-warm-white/60">
                  <span className="mt-0.5 text-orange font-bold">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-warm-white/60">Results:</h3>
            <ul className="space-y-3">
              {[
                'EGI (Effective Gross Income) will grow from $970k (in-place today) to $1.475M.',
                'OPEX maintained at a healthy margin (~$419k or 29%).',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[0.9rem] leading-[1.6] text-warm-white/60">
                  <span className="text-orange">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Punchline — the ONE number that matters, full width, isolated */}
        <div className="flex items-center gap-6 border-t border-warm-white/[0.06] pt-6">
          <div className="font-mono font-black text-orange leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontVariantNumeric: 'tabular-nums' }}>
            +$7.36M
          </div>
          <div>
            <p className="text-body font-bold text-warm-white">in value created</p>
            <p className="text-body-sm text-warm-white/55">NOI grows by $460k over 60 months at a 6.25% Cap Rate</p>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 10 — INVESTMENT SUMMARY
   ═══════════════════════════════════════════════════════ */

function SlideInvestmentSummary() {
  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Overview</SectionLabel>
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Investment Summary
        </h2>

        {/* Hero metrics — the numbers that sell the deal */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6 border-y border-warm-white/[0.06] py-4">
          <div>
            <div className="font-mono font-black text-orange leading-none" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontVariantNumeric: 'tabular-nums' }}>25% IRR</div>
            <div className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Targeted · Project-level</div>
          </div>
          <div className="h-10 w-px bg-warm-white/[0.08] hidden lg:block" />
          <div>
            <div className="font-mono font-black text-orange leading-none" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontVariantNumeric: 'tabular-nums' }}>2.5x MOIC</div>
            <div className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Equity Multiple</div>
          </div>
          <div className="h-10 w-px bg-warm-white/[0.08] hidden lg:block" />
          <div>
            <div className="font-mono font-black text-warm-white leading-none" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontVariantNumeric: 'tabular-nums' }}>8.8% YOC</div>
            <div className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50">Stabilized Yield on Cost</div>
          </div>
        </div>

        {/* Term sheet — structured table layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <table className="w-full text-[0.95rem]">
            <tbody>
              {[
                { label: 'Equity Raise', value: '$4,560,000', detail: "Inclusive of Sponsor's Co-Invest (3%)" },
                { label: 'Financing', value: '~$7,560,000 (~63% LTC)' },
                { label: 'Total Project Cost', value: '~$12,120,000' },
                { label: 'Sponsor(s)', value: 'Journey.Direct, LLC ("JD")' },
                { label: 'Management', value: 'Journey.Management, LLC ("JM")', detail: 'Under the Journey.Storage™ brand' },
                { label: 'Strategy', value: 'Value Add: Lease Up, Revenue Optimization, Expense Reduction via Automation' },
                { label: 'Waterfall', value: "Return of Equity first, then 70/30 in favor of LP's" },
                { label: 'Hold Period', value: '5 Years +/-', detail: 'Expected cash-out refinance near Month 36 (returning ~70% of equity)' },
                { label: 'Sponsor Fees', value: '3% Acquisition (one-time); 6% Development (one-time); 2% Asset Management (ongoing)' },
              ].map((t, i) => (
                <tr key={i} className="border-b border-warm-white/[0.05]">
                  <td className="py-2.5 pr-6 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-orange w-[140px] align-top">{t.label}</td>
                  <td className="py-2.5 font-bold text-warm-white align-top">{t.value}
                    {t.detail && <span className="font-normal text-warm-white/50 ml-2">— {t.detail}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Badges */}
          <div className="flex flex-col gap-4 justify-start">
            <div className="rounded-2xl bg-orange px-6 py-5 text-center">
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-warm-white/70 mb-1">Ask about</div>
              <div className="text-xl font-black leading-tight text-warm-white">accelerated<br />&ldquo;bonus&rdquo;<br />depreciation</div>
            </div>
            <div className="rounded-xl border border-orange/40 px-5 py-3 text-center">
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mb-1">Investment Window</div>
              <div className="text-sm font-bold text-orange">Until May 8, 2026</div>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 11 — PROPERTY DETAILS
   ═══════════════════════════════════════════════════════ */

function SlidePropertyDetails() {
  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>The Asset</SectionLabel>
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Property Details
        </h2>
        <p className="text-body-sm text-warm-white/55 mb-6">
          A recent expansion added capacity in mid-2025. Lease-up has been excellent.
        </p>

        {/* Photos — hero, asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <div className="relative col-span-2 md:row-span-2 lg:col-span-3 lg:row-span-2 aspect-[16/10] md:aspect-auto overflow-hidden rounded-xl">
            <Image src="/images/deals/granbury/granbury-1.jpg" alt="Granbury aerial view" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="relative col-span-2 md:col-span-1 lg:col-span-3 aspect-[16/7] md:aspect-[4/3] lg:aspect-[16/7] overflow-hidden rounded-xl">
            <Image src="/images/deals/granbury/granbury-5.jpg" alt="Granbury drive-up units perspective" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-3 bottom-3 rounded-sm bg-warm-white/10 backdrop-blur-sm px-2.5 py-1 text-[0.6rem] font-bold text-warm-white/70">Drive-Up Units</div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src="/images/deals/granbury/granbury-4.jpg" alt="Granbury office front" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-3 bottom-3 rounded-sm bg-warm-white/10 backdrop-blur-sm px-2.5 py-1 text-[0.6rem] font-bold text-warm-white/70">Office</div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src="/images/deals/granbury/granbury-2.jpg" alt="Granbury buildings" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-3 bottom-3 rounded-sm bg-orange px-2.5 py-1 text-[0.6rem] font-bold text-warm-white">Recent Expansion</div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src="/images/deals/granbury/granbury-3.jpg" alt="Granbury drive-up units" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-3 bottom-3 rounded-sm bg-orange px-2.5 py-1 text-[0.6rem] font-bold text-warm-white">Recent Expansion</div>
          </div>
        </div>

        {/* Data as support strip — compact, below photos */}
        <div className="border-y border-warm-white/[0.06] py-3 space-y-2">
          <div className="grid grid-cols-4 gap-x-3 gap-y-1.5 lg:flex lg:items-center lg:gap-5 font-mono text-[0.85rem]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span><strong className="font-black text-warm-white">773</strong> <span className="text-warm-white/50">Units</span></span>
            <span className="text-warm-white/10 hidden lg:inline">·</span>
            <span><strong className="font-black text-warm-white">126K</strong> <span className="text-warm-white/50">NRSF</span></span>
            <span className="text-warm-white/10 hidden lg:inline">·</span>
            <span><strong className="font-black text-warm-white">17</strong> <span className="text-warm-white/50">Bldgs</span></span>
            <span className="text-warm-white/10 hidden lg:inline">·</span>
            <span><strong className="font-black text-warm-white">5.37</strong> <span className="text-warm-white/50">Acres</span></span>
            <span className="text-warm-white/10 hidden lg:inline">·</span>
            <span><strong className="font-black text-warm-white">449</strong> <span className="text-warm-white/50">Drive-Up</span></span>
            <span className="text-warm-white/10 hidden lg:inline">·</span>
            <span><strong className="font-black text-warm-white">315</strong> <span className="text-warm-white/50">Climate</span></span>
            <span className="text-warm-white/10 hidden lg:inline">·</span>
            <span><strong className="font-black text-warm-white">9</strong> <span className="text-warm-white/50">Office Suites</span></span>
          </div>
          <div className="text-[0.9rem] leading-[1.6] text-warm-white/55 lg:hidden">
            <span className="text-orange font-bold">5.95%</span> Cap Rate · <span className="text-warm-white font-bold">$85/NRSF</span> <span className="text-warm-white/50">below replacement</span>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-end text-[0.9rem] leading-[1.6] text-warm-white/55">
            <span className="text-orange font-bold">5.95%</span> Cap Rate · <span className="text-warm-white font-bold">$85/NRSF</span> <span className="text-warm-white/50">below replacement</span>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 12 — MARKET OVERVIEW
   ═══════════════════════════════════════════════════════ */

function SlideMarketOverview() {
  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Local Market</SectionLabel>
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Market Overview
        </h2>

        {/* Hero stats — the numbers that matter */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6 border-y border-warm-white/[0.06] py-4">
          <div>
            <div className="font-mono font-black text-orange leading-none text-2xl" style={{ fontVariantNumeric: 'tabular-nums' }}>0</div>
            <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">New supply since 2005</div>
          </div>
          <div className="h-10 w-px bg-warm-white/[0.08] hidden lg:block" />
          <div>
            <div className="font-mono font-black text-warm-white leading-none text-2xl" style={{ fontVariantNumeric: 'tabular-nums' }}>22K</div>
            <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">Cars/day on Hwy 377</div>
          </div>
          <div className="h-10 w-px bg-warm-white/[0.08] hidden lg:block" />
          <div>
            <div className="font-mono font-black text-warm-white leading-none text-2xl" style={{ fontVariantNumeric: 'tabular-nums' }}>3.1%</div>
            <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">Pop. growth (10 min)</div>
          </div>
          <div className="h-10 w-px bg-warm-white/[0.08] hidden lg:block" />
          <div>
            <div className="font-mono font-black text-warm-white leading-none text-2xl" style={{ fontVariantNumeric: 'tabular-nums' }}>$91K</div>
            <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">Median HHI</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
          {/* Left — full data, organized */}
          <div className="space-y-4">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mb-2">Population &amp; Income</p>
              <ul className="space-y-1 text-[0.9rem] leading-[1.65] text-warm-white/70">
                <li>Median HHI of <strong className="text-warm-white/80">$91k</strong> / Avg. HHI of <strong className="text-warm-white/80">$112k</strong></li>
                <li>16k people in 10mins, w/ higher daytime population</li>
                <li><strong className="text-orange">3.1%</strong> population growth projected in 10 mins</li>
              </ul>
            </div>
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mb-2">Demand Drivers</p>
              <p className="text-[0.9rem] leading-[1.65] text-warm-white/70">
                <strong className="text-warm-white/80">No new supply</strong> has entered the 5-mile radius since 2005, besides one multi-story climate property (Store House Storage). All other competitors are lower-quality, many lacking security or online rentals.
              </p>
            </div>
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mb-2">Nearby Growth</p>
              <div className="flex flex-wrap gap-1.5">
                {['Lakeview Landing (47-acre mixed-use)', 'The Crossing (50-acre mixed-use)', '500+ housing units in development', 'Academy Sports', 'Hobby Lobby', 'Homegoods', 'Ulta'].map((item, i) => (
                  <span key={i} className="rounded-md bg-warm-white/[0.04] border border-warm-white/[0.06] px-2.5 py-1 text-[0.85rem] text-warm-white/55">{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — satellite map */}
          <div className="relative aspect-[4/3] md:aspect-square md:max-h-[350px] lg:max-h-[440px] overflow-hidden rounded-2xl">
            <Image src="/images/deals/granbury/granbury-map-satellite.webp" alt="Granbury, TX — Satellite map with property locations and drive times" fill className="object-cover" />
            <div className="absolute bottom-3 right-3 rounded-md bg-black/70 backdrop-blur-sm px-3 py-1.5 border border-warm-white/[0.08]">
              <span className="text-[0.65rem] font-bold tracking-[0.08em] text-orange">⊙</span>
              <span className="ml-1.5 text-[0.65rem] font-bold tracking-[0.08em] text-warm-white/60">5 mi radius</span>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 13 — COMPETITION ANALYSIS
   ═══════════════════════════════════════════════════════ */

function SlideCompetition() {
  const competitors = [
    { name: 'Champion Storage', grade: 'B+', web: 'F', note: 'No Online Rentals' },
    { name: 'DONE Storage', grade: 'C', web: 'C', note: 'Low Vacancy' },
    { name: 'Lake Granbury Lock & Leave', grade: 'B', web: 'NO', note: 'Very Small Location' },
    { name: 'KO Storage', grade: 'B-', web: 'B-', note: 'Basic Automations' },
    { name: 'Landmark Storage', grade: 'F', web: 'C', note: 'Very Rough Facility' },
    { name: 'Store House Storage', grade: 'A+', web: 'B+', note: '3-Story Climate' },
    { name: 'GuardBox Storage', grade: 'B+', web: 'A-', note: 'Location Limited' },
    { name: 'AAA Self Storage', grade: 'C', web: 'C', note: 'Low Vacancy' },
    { name: 'Lancrow Self Storage', grade: 'D+', web: 'C', note: 'Low Vacancy' },
    { name: 'U-Loc-It Storage', grade: 'C+', web: 'B-', note: 'Few Sizes Offered' },
    { name: 'A&E Storage', grade: 'C', web: 'B-', note: 'Waiting Lists' },
    { name: 'Acton Discount Storage', grade: 'D', web: 'C-', note: 'All Gravel/Grass' },
    { name: 'Walnut Creek Storage', grade: 'B', web: 'A-', note: 'Waiting Lists' },
    { name: 'Thrifty Self Storage', grade: 'C', web: 'C', note: 'Low Vacancy' },
  ]

  function gradeColor(g: string) {
    if (g.startsWith('A')) return 'text-orange'
    if (g.startsWith('B')) return 'text-warm-white/70'
    if (g.startsWith('C')) return 'text-stone'
    if (g === 'NO') return 'text-error-red'
    return 'text-warm-white/30' // D, F
  }

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 min-h-0 flex flex-col mx-auto w-full max-w-[1200px] min-w-0 px-5 py-6 md:px-8 lg:px-12 lg:py-8 md:overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <SectionLabel>Competitive Landscape</SectionLabel>
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Competition Analysis
        </h2>

        {/* Hero insight — the pattern */}
        {(() => {
          const grades = competitors.map(c => c.grade)
          const aCount = grades.filter(g => g.startsWith('A')).length
          const bCount = grades.filter(g => g.startsWith('B')).length
          const cCount = grades.filter(g => g.startsWith('C')).length
          const dfCount = grades.filter(g => g.startsWith('D') || g.startsWith('F') || g === 'NO').length
          return (
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5 mb-6 border-y border-warm-white/[0.06] py-4">
              <div className="flex items-center gap-4 lg:gap-5 shrink-0">
                <div className="text-center">
                  <div className="font-mono font-black text-orange text-2xl leading-none">{aCount}</div>
                  <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">A Grade</div>
                </div>
                <div className="h-8 w-px bg-warm-white/[0.08]" />
                <div className="text-center">
                  <div className="font-mono font-black text-warm-white/60 text-2xl leading-none">{bCount}</div>
                  <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">B Grade</div>
                </div>
                <div className="h-8 w-px bg-warm-white/[0.08]" />
                <div className="text-center">
                  <div className="font-mono font-black text-warm-white/30 text-2xl leading-none">{cCount}</div>
                  <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">C Grade</div>
                </div>
                <div className="h-8 w-px bg-warm-white/[0.08]" />
                <div className="text-center">
                  <div className="font-mono font-black text-warm-white/20 text-2xl leading-none">{dfCount}</div>
                  <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">D/F Grade</div>
                </div>
              </div>
              <div className="border-l-2 border-orange pl-4">
                <p className="text-body-sm font-bold text-warm-white">Most competitors lack basic technology, security, or online presence.</p>
                <p className="text-[0.8rem] text-warm-white/55">Journey enters with A+ operations against a market that can&apos;t compete after 5 PM.</p>
              </div>
            </div>
          )
        })()}

        {/* Map + Table side by side */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-[0.9rem] leading-[1.6]">
          <thead>
            <tr className="border-b border-warm-white/[0.08]">
              <th className="py-2 pr-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-warm-white/50">#</th>
              <th className="py-2 pr-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-warm-white/50">Competitor</th>
              <th className="py-2 px-3 text-center text-[0.7rem] font-bold uppercase tracking-[0.12em] text-warm-white/50">Facility</th>
              <th className="py-2 px-3 text-center text-[0.7rem] font-bold uppercase tracking-[0.12em] text-warm-white/50">Website</th>
              <th className="py-2 pl-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-warm-white/50">Note</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={i} className="border-b border-warm-white/[0.03]">
                <td className="py-1.5 pr-3 font-mono text-orange/50 font-bold">{String(i + 1).padStart(2, '0')}</td>
                <td className="py-1.5 pr-3 font-bold text-warm-white/70">{c.name}</td>
                <td className={`py-1.5 px-3 text-center font-bold ${gradeColor(c.grade)}`}>{c.grade}</td>
                <td className={`py-1.5 px-3 text-center font-bold ${gradeColor(c.web)}`}>{c.web}</td>
                <td className="py-1.5 pl-3 text-warm-white/50">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

          {/* Map — geographic context */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden rounded-2xl border border-warm-white/[0.06]">
            <Image src="/images/map/comp-map-dark.webp" alt="Competition map — Granbury area" fill className="object-cover" />
            <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md bg-black/70 backdrop-blur-sm px-3 py-1.5 border border-warm-white/[0.08]">
              <span className="flex items-center gap-1.5 text-[0.6rem] font-bold text-orange"><span className="inline-block w-2 h-2 rounded-full bg-orange" />Journey</span>
              <span className="flex items-center gap-1.5 text-[0.6rem] font-bold text-warm-white/40"><span className="inline-block w-2 h-2 rounded-full bg-stone" />Competitors</span>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 14 — SOURCES & USES
   ═══════════════════════════════════════════════════════ */

function SlideSourcesUses() {
  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Financials</SectionLabel>
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Sources &amp; Uses
        </h2>

        <div className="space-y-6">
          {/* Return Metrics — hero strip + detail table */}
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mb-3">Project-Level Return Metrics</p>
            {/* Hero row — 3 key metrics */}
            <div className="grid grid-cols-3 gap-3 mb-3 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {[
                { label: 'Levered IRR', value: '24.98%' },
                { label: 'Project-Level Equity Multiple', value: '2.51x' },
                { label: 'Yield on Cost at Sale', value: '8.8%' },
              ].map((m, i) => (
                <div key={i} className="text-center py-4 rounded-xl border border-orange/20" style={{ background: 'rgba(232,98,42,0.05)' }}>
                  <div className="text-2xl font-black leading-none text-orange">{m.value}</div>
                  <div className="mt-2 text-[0.7rem] font-bold text-warm-white/40">{m.label}</div>
                </div>
              ))}
            </div>
            {/* Secondary row — 4 supporting metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {[
                { label: 'Unlevered IRR', value: '14.20%' },
                { label: 'Levered CoC (Hold)', value: '11.02%' },
                { label: 'Unlevered CoC (Hold)', value: '6.50%' },
                { label: 'Dev. Spread at Sale', value: '2.5%' },
              ].map((m, i) => (
                <div key={i} className="text-center py-3 rounded-lg border border-warm-white/[0.06]">
                  <div className="text-lg font-black leading-none text-warm-white/70">{m.value}</div>
                  <div className="mt-1.5 text-[0.7rem] font-bold text-warm-white/30">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sources */}
            <div>
              <table className="w-full text-[0.8rem]">
                <thead>
                  <tr><th colSpan={2} className="bg-orange px-3 py-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white rounded-t-lg">Sources (at Close)</th></tr>
                </thead>
                <tbody className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {[
                    ['Acquisition Loan Proceeds', '$7,560,000'],
                    ['LP Equity', '$4,420,484'],
                    ['GP Equity', '$136,716'],
                  ].map(([label, val], i) => (
                    <tr key={i} className="border-b border-warm-white/[0.06]">
                      <td className="py-1.5 pr-2 font-sans text-[0.9rem] leading-[1.6] text-warm-white/55">{label}</td>
                      <td className="py-1.5 text-right text-warm-white">{val}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-warm-white/[0.15]">
                    <td className="py-1.5 pr-2 font-sans text-[0.8rem] font-bold text-warm-white">Total</td>
                    <td className="py-1.5 text-right font-bold text-warm-white">$12,117,200</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Uses — summarized / more vague */}
            <div>
              <table className="w-full text-[0.8rem]">
                <thead>
                  <tr><th colSpan={2} className="bg-orange px-3 py-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white rounded-t-lg">Uses (at Close)</th></tr>
                </thead>
                <tbody className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {[
                    ['Acquisition Costs', '$11,286,000'],
                    ['Reserves & Fees', '$831,200'],
                  ].map(([label, val], i) => (
                    <tr key={i} className="border-b border-warm-white/[0.06]">
                      <td className="py-1.5 pr-2 font-sans text-[0.9rem] leading-[1.6] text-warm-white/55">{label}</td>
                      <td className="py-1.5 text-right text-warm-white">{val}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-warm-white/[0.15]">
                    <td className="py-1.5 pr-2 font-sans text-[0.8rem] font-bold text-warm-white">Total</td>
                    <td className="py-1.5 text-right font-bold text-warm-white">$12,117,200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 15 — ANNUALIZED PROJECTIONS
   ═══════════════════════════════════════════════════════ */

function SlideProjections() {
  const rows = [
    { label: 'Rental Income', indent: true, values: ['$944,852', '$1,145,895', '$1,332,639', '$1,372,618', '$1,413,797'] },
    { label: 'Ancillary Income', indent: true, values: ['$55,192', '$63,077', '$70,961', '$70,961', '$70,961'] },
    { label: 'Fee & Other Income', indent: true, values: ['$31,733', '$36,709', '$39,244', '$40,234', '$41,253'] },
    { label: 'Bad Debt', indent: true, values: ['($9,449)', '($11,459)', '($13,326)', '($13,726)', '($14,138)'] },
    { label: 'Discounts', indent: true, values: ['($37,104)', '($37,104)', '($27,828)', '($27,828)', '($27,828)'] },
    { label: 'Effective Gross Income', bold: true, values: ['$985,225', '$1,197,118', '$1,401,690', '$1,442,259', '$1,484,045'] },
    { label: '', spacer: true, values: ['', '', '', '', ''] },
    { label: 'Total Expenses', bold: true, values: ['($352,056)', '($376,130)', '($399,737)', '($409,719)', '($419,958)'] },
    { label: '', spacer: true, values: ['', '', '', '', ''] },
    { label: 'Net Operating Income', bold: true, highlight: true, values: ['$633,169', '$820,988', '$1,001,953', '$1,032,540', '$1,064,087'] },
    { label: '', spacer: true, values: ['', '', '', '', ''] },
    { label: 'Yield on Cost', metric: true, values: ['5.23%', '6.78%', '8.27%', '8.52%', '8.78%'] },
    { label: 'Debt Service Coverage', metric: true, values: ['1.34x', '1.37x', '1.67x', '1.63x', '1.3x'] },
    { label: 'Cash on Cash', metric: true, values: ['0.00%', '4.36%', '8.24%', '26.78%', '15.72%'] },
  ]

  const years = [
    { label: 'Year 1', sub: 'In Lease-Up' },
    { label: 'Year 2', sub: 'In Lease-Up' },
    { label: 'Year 3', sub: 'Stabilized' },
    { label: 'Year 4', sub: 'Stabilized' },
    { label: 'Year 5', sub: 'Stabilized' },
  ]

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Financial Model</SectionLabel>
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
          Annualized Projections<span className="text-orange">*</span>
        </h2>
        <p className="text-[0.8rem] text-warm-white/55 mb-6">* Expected Case</p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-[0.85rem]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <thead>
              <tr className="border-b border-warm-white/[0.08]">
                <th className="bg-orange px-3 py-2.5 text-left text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white rounded-tl-lg">P&amp;L by Year</th>
                {years.map((y, i) => (
                  <th key={i} className="bg-orange px-3 py-2.5 text-right text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white last:rounded-tr-lg">
                    <div>{y.label}</div>
                    <div className="font-normal text-warm-white/60">{y.sub}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((r, i) => {
                if (r.spacer) return <tr key={i}><td colSpan={6} className="h-2" /></tr>
                return (
                  <tr key={i} className={`border-b border-warm-white/[0.04] ${r.highlight ? 'border-t border-warm-white/[0.12] bg-orange/[0.04]' : ''}`}>
                    <td className={`py-1.5 pr-3 font-sans ${r.indent ? 'pl-4 text-warm-white/40' : ''} ${r.bold ? 'font-bold text-warm-white' : ''} ${r.metric ? 'font-bold text-orange' : ''}`}>
                      {r.label}
                    </td>
                    {r.values.map((v, j) => (
                      <td key={j} className={`py-1.5 px-3 text-right ${r.bold ? 'font-bold text-warm-white' : 'text-warm-white/50'} ${r.metric ? 'font-bold text-orange' : ''} ${r.highlight ? 'text-warm-white font-black' : ''}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 16 — INVESTOR RETURN PROJECTIONS
   ═══════════════════════════════════════════════════════ */

function SlideReturns() {
  const scenarios = [
    {
      name: 'Upside Case',
      color: 'border-[#7AAF6E]/20 bg-[#7AAF6E]/[0.03]',
      labelBg: 'bg-[#7AAF6E]',
      returns: ['$21,246', '$72,603', '$850,537', '$66,114', '$1,448,089'],
      coc: ['2.12%', '9.38%', '94.44%', '101.05%', '245.86%'],
    },
    {
      name: 'Expected Case',
      color: 'border-orange/25 bg-orange/[0.04]',
      labelBg: 'bg-orange',
      returns: ['$20,494', '$69,422', '$749,819', '$80,085', '$1,106,370'],
      coc: ['2.05%', '8.99%', '83.97%', '91.98%', '202.62%'],
    },
    {
      name: 'Downside Case',
      color: 'border-warm-white/[0.08] bg-warm-white/[0.02]',
      labelBg: 'bg-stone',
      returns: ['$19,739', '$66,256', '$651,442', '$76,779', '$848,873'],
      coc: ['1.97%', '8.60%', '73.74%', '81.42%', '166.31%'],
    },
  ]

  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] min-w-0 px-5 py-8 md:px-8 lg:px-12 lg:py-0">
        <div className="flex items-start justify-between mb-6">
          <SectionLabel>Projected Returns</SectionLabel>
          <Logo />
        </div>
        <h2 className="font-black leading-[0.95] tracking-[-0.02em] text-warm-white mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
          Investor Return Projections
        </h2>
        <p className="text-[0.8rem] text-warm-white/55 mb-8">
          All scenarios assume a refinance at end of Year 3 and Sale at end of Year 5.
        </p>

        {/* Expected Case — HERO */}
        <div className="overflow-x-auto rounded-xl border border-orange/25 bg-orange/[0.04] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="rounded px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white bg-orange">Expected Case</span>
            <div className="text-right">
              <div className="font-mono font-black text-orange text-2xl leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>202.62%</div>
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-warm-white/50 mt-1">Cumulative CoC · Year 5</div>
            </div>
          </div>
          <table className="w-full text-[0.85rem] font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <thead>
              <tr>
                <th className="py-1 pr-3 text-left text-[0.65rem] font-bold uppercase tracking-[0.1em] text-warm-white/40 font-sans" />
                {[1, 2, 3, 4, 5].map(y => (
                  <th key={y} className="py-1 px-3 text-right text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white/50 font-sans">Year {y}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-warm-white/[0.06]">
                <td className="py-1.5 pr-3 font-sans text-[0.85rem] text-warm-white/65">Annual Return</td>
                {scenarios[1].returns.map((v, i) => (
                  <td key={i} className="py-1.5 px-3 text-right font-bold text-warm-white">{v}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pr-3 font-sans text-[0.85rem] text-warm-white/65">Cumulative CoC</td>
                {scenarios[1].coc.map((v, i) => (
                  <td key={i} className="py-1.5 px-3 text-right font-bold text-warm-white">{v}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Upside + Downside — context, side by side, compact */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {[scenarios[0], scenarios[2]].map((s) => (
            <div key={s.name} className={`overflow-x-auto rounded-xl border p-4 ${s.color}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`rounded px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white ${s.labelBg}`}>{s.name}</span>
                <span className="font-mono font-bold text-warm-white/60 text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>{s.coc[4]} CoC</span>
              </div>
              <table className="w-full text-[0.85rem] font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <thead>
                  <tr>
                    <th className="py-1 pr-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.1em] text-warm-white/30 font-sans" />
                    {[1, 2, 3, 4, 5].map(y => (
                      <th key={y} className="py-1 px-2 text-right text-[0.65rem] font-bold text-warm-white/50 font-sans">Yr {y}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-warm-white/[0.04]">
                    <td className="py-1 pr-2 font-sans text-[0.8rem] text-warm-white/55">Return</td>
                    {s.returns.map((v, i) => (
                      <td key={i} className="py-1 px-2 text-right text-warm-white/60">{v}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1 pr-2 font-sans text-[0.8rem] text-warm-white/55">Cum. CoC</td>
                    {s.coc.map((v, i) => (
                      <td key={i} className="py-1 px-2 text-right text-warm-white/60">{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[0.7rem] text-warm-white/30 italic">
          *Based on a $1,000,000 investment. Does not include additional tax benefit value from Year 1 bonus depreciation.
        </p>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE 17 — CONTACT / CLOSE
   ═══════════════════════════════════════════════════════ */

function SlideContact() {
  return (
    <section className="deck-page grain relative flex min-h-dvh lg:h-dvh lg:min-h-0 lg:snap-start flex-col overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image src="/images/hero/direct-hero-bg.webp" alt="" fill sizes="100vw" className="object-cover" style={{ filter: 'grayscale(30%) contrast(1.1) brightness(0.4) sepia(0.1)', objectPosition: '50% 62%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(232,98,42,0.08), transparent)' }} />

      <div className="relative z-10 flex flex-1 flex-col px-5 py-8 md:px-8 md:py-10 lg:px-16 lg:py-14">
        <div className="flex items-start justify-end"><Logo /></div>

        <div className="flex flex-1 flex-col lg:flex-row lg:items-center lg:gap-20 justify-center">
          {/* Left — Next Steps */}
          <div className="lg:flex-1 lg:max-w-[520px]">
            <h2 className="font-black uppercase leading-[0.92] tracking-[-0.03em] text-warm-white mb-8" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              What Happens<br />
              <span className="font-light italic normal-case text-orange">Next</span>
            </h2>
            <div className="space-y-4">
              <p className="text-body lg:text-lg leading-[1.7] text-warm-white/70">
                The deal has been presented. The numbers speak.
              </p>
              <p className="text-body lg:text-lg leading-[1.7] text-warm-white/70">
                If it resonates, the next step is simple. Review the documents with your advisors and let&apos;s go from there.
              </p>
            </div>
            <div className="mt-8 inline-flex w-fit items-center rounded-sm bg-orange px-5 py-2.5">
              <span className="text-[0.75rem] font-bold tracking-[0.1em] uppercase text-warm-white">Accepting subscriptions until May 8, 2026</span>
            </div>
          </div>

          {/* Right — Contact */}
          <div className="mt-12 lg:mt-0 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-warm-white/60">Further Information</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange/15">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <span className="text-body text-warm-white/80">(417) 848-2425</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange/15">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <span className="text-body text-warm-white/80">direct.journey.storage</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange/15">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <span className="text-body text-warm-white/80">jonah@journey.storage</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image src="/images/other/qr-code.webp" alt="QR code — direct.journey.storage" fill className="object-contain" />
              </div>
              <span className="text-[0.8rem] text-warm-white/55">Or scan here</span>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE — Assembles all slides
   ═══════════════════════════════════════════════════════ */

export default function GranburyDeck() {
  return (
    <>
      <main className="deck overflow-x-hidden lg:h-dvh lg:snap-y lg:snap-mandatory lg:overflow-y-auto scroll-smooth">
        {/* Platform Section (Reusable) */}
        <SlideCover />
        <PageDivider />
        <SlideOpportunity />
        <PageDivider />
        <SlideOperator />
        <PageDivider />
        <SlideMarket />
        <PageDivider />
        <SlideOperations />
        <PageDivider />
        <SlideGrowthThesis />
        <PageDivider />

        {/* Deal Section (Granbury-specific) */}
        <SlideDealCover />
        <PageDivider />
        <SlideDisclaimer />
        <PageDivider />
        <SlideCurrentOpportunity />
        <PageDivider />
        <SlideInvestmentSummary />
        <PageDivider />
        <SlidePropertyDetails />
        <PageDivider />
        <SlideMarketOverview />
        <PageDivider />
        <SlideCompetition />
        <PageDivider />
        <SlideSourcesUses />
        <PageDivider />
        <SlideProjections />
        <PageDivider />
        <SlideReturns />
        <PageDivider />
        <SlideContact />
      </main>
      <DeckNav totalPages={TOTAL_PAGES} />
    </>
  )
}
