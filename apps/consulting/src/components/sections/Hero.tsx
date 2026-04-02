import Image from 'next/image'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'

export default function Hero() {
  return (
    <section id={sectionIds.hero} className="relative min-h-[100vh] flex items-end overflow-hidden bg-black">
      {/* Background image */}
      <Image
        src="/images/hero/consulting-hero-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
        quality={85}
      />

      {/* Dark overlay gradient — heavier at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      {/* Orange tint overlay for brand warmth */}
      <div className="absolute inset-0 bg-orange/[0.06] mix-blend-multiply" />

      {/* Grain */}
      <div className="grain absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16 pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="hero-fade-up inline-flex items-center gap-2.5 mb-8 rounded-full border border-warm-white/[0.10] bg-black/40 backdrop-blur-md px-5 py-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          <span className="text-label font-bold uppercase tracking-[0.2em] text-warm-white/70">Consulting division</span>
        </div>

        <h1
          className="hero-fade-up max-w-[820px] text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-black leading-[0.95] text-warm-white"
          style={{ animationDelay: '0.15s' }}
        >
          Your next deal deserves better than a spreadsheet and a gut&nbsp;feeling.
        </h1>

        <p
          className="hero-fade-up mt-8 max-w-[580px] text-body leading-[1.75] text-warm-white/60"
          style={{ animationDelay: '0.3s' }}
        >
          Journey.Consulting&trade; gives you institutional-grade self-storage underwriting,the same expertise behind <strong className="font-semibold text-warm-white/80">$200M+ in transactions</strong>,at a monthly rate, with no hiring friction. Cancel anytime.
        </p>

        <div className="hero-fade-up mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.45s' }}>
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-sm bg-orange px-7 py-4 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Schedule a call with Jonah
          </a>
          <a
            href={`#${sectionIds.howItWorks}`}
            className="inline-flex items-center gap-2 text-body-sm font-bold text-warm-white/50 transition-colors duration-150 hover:text-warm-white"
          >
            See how it works <span className="text-orange">&darr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}
