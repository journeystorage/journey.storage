import Image from 'next/image'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'
import ContactButton from '@/components/ui/ContactButton'

export default function Hero() {
  return (
    <section id={sectionIds.hero} className="relative h-screen min-h-[700px] flex items-end lg:items-center overflow-hidden bg-black">
      {/* Background image */}
      <Image
        src="/images/hero/consulting-hero-bg.webp"
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

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16 pb-[14vh] lg:pb-0">
        <div className="hero-fade-up inline-flex items-center gap-2.5 mb-8 rounded-full border border-warm-white/[0.10] bg-black/40 backdrop-blur-md px-5 py-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.9rem] font-black tracking-[0.08em] text-warm-white/90">JOURNEY.<span className="font-light">ADVISORY</span>&trade;</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-warm-white/40">Consulting &amp; Operations</span>
          </span>
        </div>

        <h1
          className="hero-fade-up max-w-[820px] text-[2.35rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-black leading-[0.95] text-warm-white"
          style={{ animationDelay: '0.15s' }}
        >
          <span className="hidden md:inline">Your next deal deserves better<br />than a spreadsheet<br />and a gut&nbsp;feeling.</span>
          <span className="md:hidden">Your next deal<br />deserves better<br />than a spreadsheet<br />and a gut&nbsp;feeling.</span>
        </h1>

        <p
          className="hero-fade-up mt-6 max-w-[580px] md:max-w-[520px] text-base md:text-lg leading-[1.7] text-warm-white/70"
          style={{ animationDelay: '0.3s' }}
        >
          Journey.Advisory&trade; gives you institutional-grade self-storage expertise, the same expertise behind <strong className="font-semibold text-warm-white/80">$200M+ in transactions</strong>, at a monthly rate, with no hiring friction. Cancel anytime.
        </p>

        <div className="hero-fade-up mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.45s' }}>
          <ContactButton
            className="inline-flex items-center justify-center rounded-sm bg-orange px-7 py-4 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
          >
            Contact Us
          </ContactButton>
        </div>
      </div>
    </section>
  )
}
