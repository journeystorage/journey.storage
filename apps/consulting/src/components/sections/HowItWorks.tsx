'use client'

import { useRef } from 'react'
import { Phone, Layers, Send } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const steps = [
  {
    number: '01',
    title: 'Talk to Jonah.',
    description: 'Book a 30-minute call. No sales team, no qualification process. You\u2019ll speak directly with Jonah about your deals, your market, and what kind of support makes sense.',
    Icon: Phone,
  },
  {
    number: '02',
    title: 'Choose your level of access.',
    description: 'Pick the tier that matches your deal flow, from a few analyses a month to unlimited access as an extension of your team.',
    Icon: Layers,
  },
  {
    number: '03',
    title: 'Send us your deals.',
    description: 'Forward the OM, the rent roll, the broker\u2019s assumptions. We send back institutional-grade underwriting you can make decisions on, and a call to walk through every number.',
    Icon: Send,
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section ref={ref} id={sectionIds.howItWorks} className="relative overflow-hidden bg-black pt-24 pb-12 lg:pt-32 lg:pb-16">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)',
      }} />

      {/* Ghost watermark — bottom at label midline */}
      <div className="pointer-events-none absolute inset-x-0 top-[52px] md:top-0 z-[1] select-none overflow-hidden flex justify-center" aria-hidden="true">
        <span className="text-[4.5rem] md:text-[12rem] lg:text-[16rem] font-black uppercase leading-none text-warm-white/[0.015] whitespace-nowrap">
          PROCESS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Three steps</span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h2 className="text-h1 font-black text-warm-white leading-[1.0]">
            From first call to first analysis,fast.
          </h2>
        </motion.div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Horizontal line — desktop */}
          <div className="absolute left-[10%] right-[10%] top-[28px] z-0 hidden md:block">
            <motion.div
              className="h-px w-full bg-gradient-to-r from-transparent via-warm-white/10 to-transparent"
              initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.8, ease }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex flex-col items-center text-center"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.15 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                  <step.Icon size={22} className="text-warm-white/70" strokeWidth={1.5} />
                </div>

                <span className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">
                  {step.number}
                </span>

                <h3 className="mt-3 text-lg font-bold text-warm-white">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-[300px] text-body-sm leading-[1.7] text-warm-white/40">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
