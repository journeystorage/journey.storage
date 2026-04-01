'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { duration: 0.7, ease, delay },
        }

  return (
    <section ref={ref} id={sectionIds.hero} className="relative min-h-[100vh] flex items-end overflow-hidden bg-black">
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
        <motion.div className="inline-flex items-center gap-2.5 mb-8 rounded-full border border-warm-white/[0.10] bg-black/40 backdrop-blur-md px-5 py-2.5" {...fadeUp(0)}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          <span className="text-label font-bold uppercase tracking-[0.2em] text-warm-white/70">Consulting division</span>
        </motion.div>

        <motion.h1
          className="max-w-[820px] text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-black leading-[0.95] text-warm-white"
          {...fadeUp(0.15)}
        >
          Your next deal deserves better than a spreadsheet and a gut&nbsp;feeling.
        </motion.h1>

        <motion.p
          className="mt-8 max-w-[580px] text-body leading-[1.75] text-warm-white/60"
          {...fadeUp(0.3)}
        >
          Journey.Consulting&trade; gives you institutional-grade self-storage underwriting,the same expertise behind <strong className="font-semibold text-warm-white/80">$200M+ in transactions</strong>,at a monthly rate, with no hiring friction. Cancel anytime.
        </motion.p>

        <motion.div className="mt-10 flex flex-wrap items-center gap-4" {...fadeUp(0.45)}>
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-sm bg-orange px-7 py-4 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Schedule a call with Jonah
          </a>
          <button
            onClick={() => scrollToSection(sectionIds.howItWorks)}
            className="inline-flex items-center gap-2 text-body-sm font-bold text-warm-white/50 transition-colors duration-150 hover:text-warm-white cursor-pointer"
          >
            See how it works <span className="text-orange">&darr;</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
