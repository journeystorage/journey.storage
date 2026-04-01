'use client'

import { useRef } from 'react'
import { Search, ShieldCheck, FileText, DoorOpen, Smartphone, LogOut } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const steps = [
  { number: '01', title: 'Find your space', description: 'Browse available units and reserve online. No phone calls, no office visits.', Icon: Search },
  { number: '02', title: 'Verify in seconds', description: 'Quick digital identity verification. No paperwork, no waiting.', Icon: ShieldCheck },
  { number: '03', title: 'Sign and get your access', description: 'Digital lease. Instant access code delivered to your phone.', Icon: FileText },
  { number: '04', title: 'Arrive and move in', description: 'Gates open automatically. Your unit is ready. Any hour, any day.', Icon: DoorOpen },
  { number: '05', title: "You're in control", description: 'Manage everything from your phone. Pay, upgrade, or move out. Zero friction.', Icon: Smartphone },
  { number: '06', title: 'Easy out', description: 'Empty your unit, snap a photo, and you\'re done. Access turns off instantly. No calls, no hassle.', Icon: LogOut },
]

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section ref={ref} id={sectionIds.howItWorks} className="grain relative overflow-hidden bg-black pt-28 pb-16 lg:pt-40 lg:pb-20">
      {/* Background watermark numbers — like Turkish Airlines giant numbers */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-[5vw] overflow-hidden select-none" aria-hidden="true">
        {['01', '02', '03', '04', '05', '06'].map((n) => (
          <span key={n} className="text-[10rem] md:text-[16rem] lg:text-[22rem] font-black text-warm-white/[0.015] leading-none">
            {n}
          </span>
        ))}
      </div>

      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)',
      }} />

      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
        <motion.div
          className="mb-20 lg:mb-28 text-center"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">How it works</span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
            Storage without
            <br />
            <span className="font-light text-warm-white/40">the friction.</span>
          </h2>
        </motion.div>

        {/* Desktop: 5-column */}
        <div className="relative hidden lg:block">
          <div className="absolute left-[10%] right-[10%] top-[32px] z-0">
            <motion.div
              className="h-px w-full bg-gradient-to-r from-transparent via-warm-white/10 to-transparent"
              initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.8, ease }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex flex-col items-center text-center"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, ease, delay: prefersReducedMotion ? 0 : 0.3 + i * 0.12 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                  <step.Icon size={26} className="text-warm-white/70" strokeWidth={1.5} />
                </div>

                <span className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">
                  {step.number}
                </span>

                <h3 className="mt-3 text-sm font-bold leading-tight text-warm-white">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-[170px] text-[0.8125rem] leading-[1.6] text-warm-white/40">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="relative lg:hidden">
          <div className="absolute left-[31px] top-0 bottom-0 w-px bg-warm-white/[0.06]" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex gap-6"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.4, ease, delay: prefersReducedMotion ? 0 : i * 0.1 }}
              >
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                  <step.Icon size={26} className="text-warm-white/70" strokeWidth={1.5} />
                </div>

                <div className="pt-1">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">{step.number}</span>
                  <h3 className="mt-1 text-lg font-bold text-warm-white">{step.title}</h3>
                  <p className="mt-1.5 text-body-sm leading-[1.65] text-warm-white/40">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
