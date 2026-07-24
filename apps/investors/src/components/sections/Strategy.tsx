import ScrollReveal from '@/components/ui/ScrollReveal'
import { BrandMark, renderBrand } from '@/components/ui/BrandMark'

const pillars = [
  {
    number: '01',
    title: 'Acquire',
    subtitle: 'Disciplined sourcing.',
    desc: 'Off-market acquisitions below replacement cost in supply-constrained Tier 1-3 markets.',
  },
  {
    number: '02',
    title: 'Transform',
    subtitle: 'Operational value-add.',
    desc: 'Technology, automation, and data-driven pricing. Every facility to the Journey.Storage\u2122 standard.',
  },
  {
    number: '03',
    title: 'Consolidate',
    subtitle: 'Portfolio-level value creation.',
    desc: 'Individual deals create value. A unified portfolio compounds it at institutional scale.',
  },
]

export default function Strategy() {
  return (
    <section id="strategy" className="grain relative overflow-hidden bg-black py-24 md:py-28 lg:py-36">
      {/* Elevated surface */}
      <div className="absolute inset-0 bg-charcoal/[0.12]" />

      {/* Divider top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-warm-white/[0.10] to-transparent" />

      {/* Ghost text */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-4 top-[12%] font-black uppercase leading-none text-warm-white/[0.015]"
        style={{ fontSize: 'clamp(8rem, 18vw, 16rem)' }}
      >
        Thesis
      </div>

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 70% 40%, rgba(232,98,42,0.03), transparent)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* Section label */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange/60" />
            <span className="text-label font-bold uppercase tracking-[0.25em] text-orange">
              The Strategy
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={80}>
          <h2
            className="font-black leading-[1.05] tracking-[-0.03em] text-warm-white mb-6"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Build the portfolio.<br />
            Compound the value.<br />
            <span className="text-orange">Exit at scale.</span>
          </h2>
        </ScrollReveal>

        {/* Body copy */}
        <ScrollReveal delay={160}>
          <div className="max-w-[680px] mb-16 lg:mb-20">
            <p className="text-body leading-[1.7] text-warm-white/60">
              <BrandMark brand="Direct" />{' '}doesn&apos;t buy one deal and move on.
              We&apos;re building a large-scale portfolio. Programmatically.
              As the portfolio grows, so does its strategic value.
              Large-scale portfolios attract a different class of buyer,
              and a different pricing structure, than individual assets sold piecemeal.
              <strong className="text-warm-white/80"> This is the long game.</strong>
            </p>
          </div>
        </ScrollReveal>

        {/* ── PIPELINE ── */}
        <ScrollReveal delay={240}>
          <div>
            {/* Three blocks with arrows */}
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-0 lg:items-start">
              {pillars.map((pillar, i) => (
                <div key={pillar.number} className="contents">
                  {/* Block */}
                  <div className="rounded-lg bg-charcoal/50 border border-warm-white/[0.06] p-6 xl:p-8 relative overflow-hidden transition-colors duration-200 hover:border-warm-white/[0.12]">
                    {/* Ghost number */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute -top-3 -right-1 font-black leading-none text-warm-white/[0.04]"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '7rem' }}
                    >
                      {pillar.number}
                    </div>
                    <div className="relative z-10">
                      <div className="h-[3px] w-8 bg-orange rounded-full mb-4" />
                      <h3 className="text-h3 font-black tracking-[-0.02em] text-warm-white">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-body-sm font-bold text-warm-white/70">
                        {pillar.subtitle}
                      </p>
                      <p className="mt-3 text-body-sm leading-[1.6] text-warm-white/45">
                        {renderBrand(pillar.desc)}
                      </p>
                    </div>
                  </div>

                  {/* Arrow connector (not after last) */}
                  {i < pillars.length - 1 && (
                    <>
                      {/* Horizontal arrow: desktop */}
                      <div className="hidden lg:flex items-center justify-center px-3 pt-12">
                        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="text-orange/50">
                          <path d="M0 7h22M18 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      {/* Vertical arrow: mobile */}
                      <div className="flex lg:hidden items-center justify-center py-2">
                        <svg width="14" height="28" viewBox="0 0 14 28" fill="none" className="text-orange/50">
                          <path d="M7 0v22M1 18l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar + end state */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-[3px] rounded-full overflow-hidden bg-warm-white/[0.04]">
                <div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, rgba(232,98,42,0.15) 0%, rgba(232,98,42,0.5) 60%, rgba(232,98,42,0.8) 100%)' }}
                />
              </div>
              <span className="shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-orange/70">
                Exit at scale
              </span>
            </div>
          </div>
        </ScrollReveal>


        {/* Closing bridge */}
        <ScrollReveal delay={600}>
          <div className="mt-12 border-l-2 border-orange/40 pl-6 max-w-[600px]">
            <p className="text-body-sm leading-[1.7] text-warm-white/50 italic">
              The operators who can acquire, improve, and consolidate during
              this window will build the portfolios that institutions compete
              to buy on the other side of it.
            </p>
            <p className="text-body-sm leading-[1.7] text-warm-white/65 mt-2 font-bold not-italic">
              That&apos;s why we built <BrandMark brand="Direct" />.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
