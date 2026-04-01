'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  const anim = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 } as const,
          animate: isInView ? ({ opacity: 1, y: 0 } as const) : undefined,
          transition: { duration: 0.6, ease, delay },
        }

  return (
    <section ref={ref} id={sectionIds.cta} className="relative overflow-hidden bg-warm-white pb-6 md:pb-8 lg:pb-10">
      {/* Dark floating container */}
      <div className="grain relative mx-3 md:mx-6 lg:mx-10 mt-4 md:mt-6 lg:mt-8 rounded-[24px] md:rounded-[32px] overflow-hidden bg-black">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 40%, rgba(232,98,42,0.06), transparent)',
        }} />

        {/* Ghost watermark — bottom at label midline */}
        <div className="pointer-events-none absolute inset-x-0 top-[15px] md:top-0 z-[1] select-none overflow-hidden flex justify-center" aria-hidden="true">
          <span className="text-[4.5rem] md:text-[12rem] lg:text-[15rem] font-black uppercase leading-none text-warm-white/[0.02] whitespace-nowrap">
            READY?
          </span>
        </div>

        <div className="relative z-[3] py-20 md:py-24 lg:py-28 px-5 md:px-10 lg:px-16 text-center">
          <motion.div className="flex items-center justify-center gap-3 mb-5" {...anim(0)}>
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Ready to move?</span>
            <div className="h-px w-8 bg-orange" />
          </motion.div>

          <motion.h2 className="text-h1 font-black text-warm-white leading-[1.0]" {...anim(0.1)}>
            Book a 30-minute call<br className="hidden md:block" /> directly with Jonah.
          </motion.h2>

          <motion.p className="mt-5 mx-auto max-w-[480px] text-body leading-[1.75] text-warm-white/45" {...anim(0.2)}>
            No sales team. No intake form. A direct conversation about your deals, your market, and whether Journey.Consulting&trade; is the right fit for you.
          </motion.p>

          <motion.div className="mt-10" {...anim(0.3)}>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-orange px-8 py-4 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              Schedule a call <span>&rarr;</span>
            </a>
          </motion.div>

          <motion.p className="mt-5 text-caption text-warm-white/25" {...anim(0.4)}>
            Single-project engagements also available &middot; Retainer + success fee structure upon request
          </motion.p>
        </div>
      </div>
    </section>
  )
}
