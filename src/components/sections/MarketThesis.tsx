import ScrollReveal from '@/components/ui/ScrollReveal'

const supplyData = [
  { year: '2023', total: 1205 },
  { year: '2024', total: 907 },
  { year: '2025', total: 668 },
  { year: '2026', total: 584 },
  { year: '2027', total: 561 },
  { year: '2028', total: 451 },
  { year: '2029', total: 455 },
]

const MAX_SUPPLY = 1205

export default function MarketThesis() {
  return (
    <section id="market" className="grain relative overflow-hidden bg-black py-20 md:py-24 lg:py-32">
      {/* Divider top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-warm-white/[0.10] to-transparent" />

      {/* Ghost text */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-6 top-[8%] font-black uppercase leading-none text-warm-white/[0.015]"
        style={{ fontSize: 'clamp(8rem, 18vw, 16rem)' }}
      >
        Market
      </div>

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* Section label */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange/60" />
            <span className="text-label font-bold uppercase tracking-[0.25em] text-orange">
              The Market
            </span>
          </div>
        </ScrollReveal>

        {/* Two-column hero: headline+body LEFT, hero stat RIGHT */}
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[1fr_auto] items-start">

          {/* Left — Headline + body */}
          <div>
            <ScrollReveal delay={80}>
              <h2
                className="font-black leading-[0.95] tracking-[-0.03em] text-warm-white mb-8"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                A new golden age of self-storage{' '}
                <br className="hidden lg:block" />
                is starting.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="max-w-[600px]">
                <p className="text-body leading-[1.7] text-warm-white/60">
                  For a decade, new self-storage supply flooded the market.
                  That era is over.
                </p>
                <p className="text-body leading-[1.7] text-warm-white/60 mt-4">
                  The capital, permits, and land economics that drove the boom
                  are no longer working. What this creates is rare: a window
                  where operators, not developers, define the market.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — Hero stats */}
          <ScrollReveal delay={200}>
            <div className="flex flex-col items-start lg:items-end lg:text-right">
              <div
                className="font-black text-orange leading-[0.85]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(4.5rem, 12vw, 9rem)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                &gt;60<span className="text-[0.55em] text-orange/70">%</span>
              </div>
              <p className="mt-2 text-body-sm font-bold uppercase tracking-[0.15em] text-warm-white/40">
                decline in new supply
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span
                  className="font-bold text-warm-white/80"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontVariantNumeric: 'tabular-nums' }}
                >
                  1,205
                </span>
                <span className="text-orange text-lg">→</span>
                <span
                  className="font-bold text-warm-white/80"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontVariantNumeric: 'tabular-nums' }}
                >
                  455
                </span>
              </div>
              <p className="mt-1 text-caption uppercase tracking-[0.15em] text-warm-white/25">
                new facilities per year · 2023 vs 2029
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Supply decline chart — full width, prominent */}
        <ScrollReveal delay={280}>
          <div className="mt-16 lg:mt-20">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/40 mb-6">
              New Facility Supply · Nationwide
            </h3>
            <div className="space-y-2.5">
              {supplyData.map((d, i) => {
                const pct = (d.total / MAX_SUPPLY) * 100
                const opFrom = Math.max(0.22, 0.65 - i * 0.06)
                const opTo = Math.max(0.10, 0.35 - i * 0.03)
                return (
                  <div key={d.year} className="flex items-center gap-3 lg:gap-4">
                    <span
                      className="w-10 text-right text-body-sm font-bold text-warm-white/50"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {d.year}
                    </span>
                    <div className="flex-1 h-10 relative">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, rgba(232,98,42,${opFrom}), rgba(232,98,42,${opTo}))`,
                          boxShadow: `0 0 16px rgba(232,98,42,${opFrom * 0.25})`,
                        }}
                      />
                    </div>
                    <span
                      className="w-14 text-right text-body-sm font-bold text-warm-white/70"
                      style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {d.total.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Golden Age callout */}
        <ScrollReveal delay={360}>
          <div className="mt-16 border-l-2 border-orange/40 pl-6 lg:pl-8 max-w-[800px]">
            <p className="text-body leading-[1.7] text-warm-white/60 mb-4">
              In markets that weren&apos;t overdeveloped, the supply dip creates
              room to push revenue without new competition diluting demand.
            </p>
            <p className="text-body leading-[1.7] text-warm-white/60 mb-4">
              In markets that were heavily built during Covid, demand is
              catching up. Absorption is outpacing new deliveries for
              the first time in years.
            </p>
            <p className="text-body leading-[1.7] text-warm-white/80 font-bold">
              Both dynamics favor the same profile: disciplined operators
              who already have the infrastructure to capture this window.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
