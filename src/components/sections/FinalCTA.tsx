'use client'

import ScrollReveal from '@/components/ui/ScrollReveal'

interface FinalCTAProps {
  onBookCall: () => void
}

export default function FinalCTA({ onBookCall }: FinalCTAProps) {
  return (
    <section className="grain relative overflow-hidden bg-black py-24 md:py-28 lg:py-36">
      {/* Ghost text */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black uppercase leading-none text-warm-white/[0.015]"
        style={{ fontSize: 'clamp(6rem, 20vw, 18rem)' }}
      >
        Direct
      </div>

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 40%, rgba(232,98,42,0.07), transparent)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16 text-center">

        <ScrollReveal>
          <h2
            className="font-black leading-[0.95] tracking-[-0.03em] text-warm-white mb-6"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}
          >
            Ready to see the<br />full picture?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <p className="mx-auto max-w-[520px] text-body leading-[1.7] text-warm-white/55 mb-10">
            We share the complete platform overview: market thesis, deal
            specifics, financial projections, and investment terms. In a
            private, one-on-one conversation. No gatekeepers.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <button
            onClick={onBookCall}
            className="group inline-flex items-center gap-3 rounded-sm bg-orange px-12 py-5 text-body font-bold uppercase tracking-[0.18em] text-warm-white shadow-[0_4px_24px_rgba(232,98,42,0.35)] transition-[transform,box-shadow,filter] duration-200 hover:brightness-[1.1] hover:shadow-[0_8px_32px_rgba(232,98,42,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Book a call
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <p className="mt-6 text-body-sm text-warm-white/40">
            For accredited investors.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
