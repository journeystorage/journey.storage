'use client'

import Image from 'next/image'

interface HeroProps {
  onBookCall: () => void
}

export default function Hero({ onBookCall }: HeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      {/* ── Background image (COLOR with premium overlay system) ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/direct-hero-bg-v2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            filter: 'contrast(1.1) brightness(0.45) saturate(0.85)',
            objectPosition: '50% 62%',
          }}
        />
      </div>

      {/* Overlay stack */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent, rgba(24,24,24,0.65))' }} />
      <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(232,98,42,0.12), transparent)' }} />
      <div className="absolute inset-0 bg-[#1a1510]/30" />
      <div className="grain absolute inset-0 pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--container-content)] flex-1 flex-col items-center justify-center px-5 md:px-8 lg:px-16 text-center pt-[120px] pb-[60px]">

        {/* Eyebrow badge */}
        <div className="hero-fade-up inline-flex items-center gap-2.5 rounded-full border border-warm-white/[0.10] bg-black/40 backdrop-blur-md px-5 py-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-orange opacity-60" style={{ animation: 'pulseDot 2s ease-in-out infinite' }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.9rem] font-black tracking-[0.08em] text-warm-white/90">
              JOURNEY.<span className="font-light">DIRECT</span>&trade;
            </span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-warm-white/40">
              Investment Platform
            </span>
          </span>
        </div>

        {/* Accent divider */}
        <div className="hero-fade-up mt-10 flex items-center gap-3" style={{ animationDelay: '0.08s' }}>
          <div className="h-px w-8 bg-orange/60" />
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-orange/80">Est. 2026</span>
          <div className="h-px w-8 bg-orange/60" />
        </div>

        {/* Headline */}
        <h1
          className="hero-fade-up mt-8 lg:mt-10 font-black leading-[0.88] tracking-[-0.045em] text-warm-white"
          style={{ animationDelay: '0.14s', fontSize: 'clamp(2.8rem, 8.5vw, 7rem)' }}
        >
          Direct access to<br />self-storage
        </h1>

        {/* Subheadline */}
        <p
          className="hero-fade-up mt-8 lg:mt-10 max-w-[520px] text-base md:text-lg leading-[1.7] text-warm-white/70"
          style={{ animationDelay: '0.22s' }}
        >
          Invest in <strong className="font-semibold text-warm-white/90">value-add acquisitions</strong> through
          an operator-led platform designed for <strong className="font-semibold text-warm-white/90">long-term
          value creation</strong>.
        </p>

        {/* CTA: exploratory, not "book a call" */}
        <a
          href="#market"
          className="hero-fade-up group mt-10 lg:mt-12 inline-flex items-center gap-3 rounded-sm border border-warm-white/20 bg-warm-white/[0.04] backdrop-blur-sm px-10 py-4 text-body-sm font-bold uppercase tracking-[0.18em] text-warm-white transition-colors duration-200 hover:border-orange hover:bg-orange/[0.08] hover:text-orange"
          style={{ animationDelay: '0.30s' }}
        >
          Explore the platform
          <span className="transition-transform duration-200 group-hover:translate-y-0.5">&darr;</span>
        </a>

        <span
          className="hero-fade-up mt-4 text-caption text-warm-white/35"
          style={{ animationDelay: '0.34s' }}
        >
          For accredited investors.
        </span>
      </div>

      {/* ── Proof strip: bridge between hero and content ── */}
      <div className="hero-fade-up relative z-10 shrink-0 border-t border-warm-white/[0.06]" style={{ animationDelay: '0.40s' }}>
        <div className="mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16 py-5 flex items-center justify-center gap-6 lg:gap-14 flex-wrap">
          {[
            { value: '$200M+', label: 'acquired' },
            { value: '30+', label: 'facilities' },
            { value: '18+', label: 'years' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6 lg:gap-14">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-bold text-warm-white text-lg"
                  style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
                >
                  {stat.value.replace('+', '')}<span className="text-orange">+</span>
                </span>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-warm-white/35">
                  {stat.label}
                </span>
              </div>
              {i < 2 && <div className="h-4 w-px bg-warm-white/[0.08] hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
