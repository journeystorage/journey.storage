'use client'

import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface OpportunitiesProps {
  onBookCall: () => void
}

export default function Opportunities({ onBookCall }: OpportunitiesProps) {
  return (
    <section id="opportunities" className="grain relative overflow-hidden bg-black py-20 md:py-24 lg:py-32">
      {/* Ghost text */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-4 top-[15%] font-black uppercase leading-none text-warm-white/[0.015]"
        style={{ fontSize: 'clamp(8rem, 16vw, 14rem)' }}
      >
        Deals
      </div>

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(232,98,42,0.04), transparent)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* Section label */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange/60" />
            <span className="text-label font-bold uppercase tracking-[0.25em] text-orange">
              Opportunities
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={80}>
          <h2
            className="font-black leading-[0.95] tracking-[-0.03em] text-warm-white mb-10 lg:mb-14"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Active investments.
          </h2>
        </ScrollReveal>

        {/* Split layout: photo FIRST in HTML (mobile top), card SECOND */}
        <ScrollReveal delay={160}>
          <div className="grid lg:gap-0 lg:grid-cols-[3fr_2fr] max-w-[1000px]">

            {/* Facility photo — appears FIRST on mobile (top), RIGHT on desktop */}
            <div className="lg:order-2 relative rounded-t-lg lg:rounded-t-none lg:rounded-r-lg overflow-hidden min-h-[200px] lg:min-h-0 border border-warm-white/[0.08] border-b-0 lg:border-b lg:border-l-0">
              <Image
                src="/images/deals/granbury/granbury-2.jpg"
                alt="Granbury self-storage facility, 773 units across 17 buildings"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                style={{ objectPosition: '50% 70%', transform: 'scale(1.4)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
              <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'rgba(232,98,42,0.08)' }} />

              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-warm-white/70">
                    On-site
                  </span>
                </div>
                <p className="text-[0.75rem] leading-[1.5] text-warm-white/50">
                  773-unit facility across 17 buildings in a supply-constrained Texas market.
                </p>
              </div>
            </div>

            {/* Deal card — appears SECOND on mobile (below), LEFT on desktop */}
            <div className="lg:order-1 rounded-b-lg lg:rounded-b-none lg:rounded-l-lg bg-charcoal/40 border border-warm-white/[0.08] border-t-0 lg:border-t lg:border-r-0 overflow-hidden">

              {/* Card header */}
              <div className="px-6 lg:px-8 pt-6 lg:pt-8 pb-5 border-b border-warm-white/[0.06]">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/40">
                      Journey.Storage&trade;
                    </span>
                    <h3 className="mt-1 text-h3 font-black text-warm-white tracking-[-0.02em]">
                      Granbury
                    </h3>
                    <p className="mt-1 text-body-sm text-warm-white/50">Granbury, TX</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-orange" />
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-orange">
                      Accepting subscriptions
                    </span>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 lg:px-8 py-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                  {[
                    { label: 'Units', value: '773' },
                    { label: 'NRSF', value: '126,000' },
                    { label: 'Buildings', value: '17' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-baseline gap-1.5">
                      <span
                        className="font-bold text-warm-white text-lg"
                        style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
                      >
                        {stat.value}
                      </span>
                      <span className="text-[0.7rem] text-warm-white/40">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {['Drive-up', 'Climate', 'Commercial'].map(type => (
                    <span
                      key={type}
                      className="rounded-full border border-warm-white/[0.08] bg-warm-white/[0.03] px-3 py-1 text-[0.7rem] font-bold text-warm-white/60"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-warm-white/40">
                    Strategy:
                  </span>
                  <span className="text-body-sm font-bold text-warm-white/70">
                    Value-add acquisition
                  </span>
                </div>

                <button
                  onClick={onBookCall}
                  className="group inline-flex items-center gap-2 rounded-sm bg-orange px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.15em] text-warm-white shadow-[0_2px_12px_rgba(232,98,42,0.25)] transition-[transform,box-shadow,filter] duration-200 hover:brightness-[1.1] hover:shadow-[0_4px_20px_rgba(232,98,42,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Request the full overview
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </div>

              {/* Card footer */}
              <div className="px-6 lg:px-8 py-4 border-t border-warm-white/[0.06] bg-warm-white/[0.02]">
                <p className="text-body-sm leading-[1.6] text-warm-white/40 italic">
                  &ldquo;Acquired below replacement cost in a supply-constrained market
                  with strong demographic tailwinds.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Below card */}
        <ScrollReveal delay={280}>
          <p className="mt-8 max-w-[600px] text-body-sm leading-[1.6] text-warm-white/45">
            Each opportunity is presented in detail during a private call.
            We share the full platform overview: market analysis, financial
            projections, and investment terms. Directly with qualified investors.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
