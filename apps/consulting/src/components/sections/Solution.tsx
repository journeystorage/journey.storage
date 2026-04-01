'use client'

import { useRef } from 'react'
import { UserCheck, Zap, CalendarOff } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const highlights = [
  { Icon: UserCheck, text: 'Direct access to Jonah and his team' },
  { Icon: Zap, text: 'Scale up or down with deal flow' },
  { Icon: CalendarOff, text: 'Cancel with 30 days\u2019 notice' },
]

export default function Solution() {
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
    <section ref={ref} id={sectionIds.solution} className="relative overflow-hidden bg-warm-white pb-12 md:pb-16 lg:pb-20">
      {/* Dark floating container */}
      <div className="grain relative mx-3 md:mx-6 lg:mx-10 mt-4 md:mt-6 lg:mt-8 rounded-[24px] md:rounded-[32px] overflow-hidden bg-black">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
          background: 'radial-gradient(ellipse 50% 50% at 70% 30%, rgba(232,98,42,0.05), transparent)',
        }} />

        {/* Ghost watermark — bottom at label midline */}
        <div className="pointer-events-none absolute inset-x-0 top-[15px] md:top-0 z-[1] select-none overflow-hidden flex justify-center" aria-hidden="true">
          <span className="text-[4.5rem] md:text-[12rem] lg:text-[15rem] font-black uppercase leading-none text-warm-white/[0.02] whitespace-nowrap">
            DIFFERENT
          </span>
        </div>

        <div className="relative z-[3] py-20 md:py-24 lg:py-28 px-5 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[var(--container-content)]">
            {/* Header — centered */}
            <motion.div className="text-center mb-14 lg:mb-16" {...anim(0)}>
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">A different model</span>
                <div className="h-px w-8 bg-orange" />
              </div>
              <h2 className="text-h1 font-black leading-[1.0] text-warm-white max-w-[700px] mx-auto">
                The output of an in-house acquisitions team,without building&nbsp;one.
              </h2>
            </motion.div>

            {/* Two-column: text + highlight pills */}
            <div className="lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:items-start">
              <div>
                <motion.p className="text-body leading-[1.85] text-warm-white/55" {...anim(0.15)}>
                  Journey.Consulting&trade; is the fractional underwriting arm of Journey.Storage&trade;. You get direct access to Jonah M. Hall and his team,the same operational and analytical capability that has underwritten, acquired, developed, and managed over $500M in self-storage assets across 27 locations.
                </motion.p>

                <motion.p className="mt-5 text-body leading-[1.85] text-warm-white/55" {...anim(0.25)}>
                  No intake forms. No layers of account managers. A direct line to someone who has personally sat in the seat you&apos;re sitting in,evaluating deals, structuring capital, and making the call on whether to move forward.
                </motion.p>

                <motion.p className="mt-5 text-body leading-[1.85] text-warm-white/55" {...anim(0.35)}>
                  Pay for what you need, when you need it. Scale up when deal flow accelerates. Scale back when it slows.
                </motion.p>
              </div>

              {/* Right — highlight cards */}
              <motion.div className="mt-10 lg:mt-0 space-y-4" {...anim(0.3)}>
                {highlights.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.04] px-5 py-4"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, x: 16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : undefined}
                    transition={{ duration: 0.5, ease, delay: 0.35 + i * 0.1 }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                      <item.Icon size={18} className="text-orange" strokeWidth={1.5} />
                    </div>
                    <span className="text-body-sm font-bold text-warm-white">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
