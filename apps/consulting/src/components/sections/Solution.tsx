'use client'

import { useRef, useState } from 'react'
import { UserCheck, Zap, CalendarOff } from 'lucide-react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const accentColors = {
  orange: '#E8622A',
  terracotta: '#D4956A',
  sand: '#C4B89A',
} as const

const highlights = [
  {
    Icon: UserCheck,
    tab: 'Direct access',
    hook: 'Access to Journey.Storage\u2019s team',
    body: 'No intake forms. No account managers. Direct access to the people behind $200M+ in transactions, so you can confidently deploy capital in self-storage.',
    number: '01',
    accent: 'bg-orange',
    accentHex: accentColors.orange,
    textDark: false,
  },
  {
    Icon: Zap,
    tab: 'Flexible',
    hook: 'Scale with deal flow',
    body: 'Ramp up when the pipeline accelerates. Scale back when it slows. Pay only for what you use, so your advisory cost always matches your activity, never your headcount.',
    number: '02',
    accent: 'bg-terracotta',
    accentHex: accentColors.terracotta,
    textDark: false,
  },
  {
    Icon: CalendarOff,
    tab: 'No lock-in',
    hook: 'Cancel with 30 days\u2019 notice',
    body: 'No annual contracts. No lock-in. You stay because the work is worth it, not because a contract says so.',
    number: '03',
    accent: 'bg-sand',
    accentHex: accentColors.sand,
    textDark: true,
  },
]

export default function Solution() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  const [activeCard, setActiveCard] = useState(0)

  const anim = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 } as const,
          animate: isInView ? ({ opacity: 1, y: 0 } as const) : undefined,
          transition: { duration: 0.6, ease, delay },
        }

  const active = highlights[activeCard]

  return (
    <section ref={ref} id={sectionIds.solution} className="grain relative overflow-hidden bg-black">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 50% 50% at 70% 30%, rgba(232,98,42,0.05), transparent)',
      }} />

      <div className="relative z-[3] py-12 md:py-20 lg:py-24 px-5 md:px-8 lg:px-16">
        <div className="mx-auto max-w-[var(--container-content)]">
            {/* Header — always centered */}
            <motion.div className="text-center mb-8 lg:mb-8" {...anim(0)}>
              <div className="flex items-center justify-center gap-3 mb-4 md:mb-5">
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Here&apos;s what replacing guesswork looks like</span>
                <div className="h-px w-8 bg-orange" />
              </div>
              <h2 className="text-h2 md:text-h1 font-black leading-[1.08] md:leading-[1.0] text-warm-white max-w-[700px] mx-auto">
                The output of an entire self storage team, without building any of&nbsp;it.
              </h2>
            </motion.div>

            {/* Scope — service labels */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:gap-x-3 mb-10 md:mb-10 lg:mb-12"
              {...anim(0.1)}
            >
              {['Acquisitions', 'Transactions', 'Operations', 'Marketing', 'Finance', 'Leadership'].map((label, i) => (
                <span key={label} className="flex items-center gap-2 md:gap-3">
                  {i > 0 && <span className="text-warm-white/15 text-[0.6rem]" aria-hidden="true">/</span>}
                  <span className="text-[0.7rem] md:text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/45">
                    {label}
                  </span>
                </span>
              ))}
            </motion.div>

            {/* ── Tabs + content panel (all breakpoints) ── */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease, delay: 0.15 }}
            >
              {/* Tab bar — Chrome-inspired */}
              <div className="relative flex items-end gap-[2px] md:gap-1">
                {highlights.map((card, i) => {
                  const isActive = i === activeCard
                  return (
                    <button
                      key={card.number}
                      onClick={() => setActiveCard(i)}
                      className="relative cursor-pointer transition-all duration-300 flex items-center justify-center"
                      style={{
                        flex: isActive ? '1.2 1 0%' : '1 1 0%',
                        backgroundColor: isActive ? card.accentHex : 'rgba(245,240,232,0.04)',
                        borderRadius: isActive ? '12px 12px 0 0' : '8px 8px 0 0',
                        height: isActive ? 44 : 38,
                        zIndex: isActive ? 2 : 1,
                      }}
                    >
                      <span className={`block text-[0.6rem] md:text-[0.7rem] font-bold uppercase tracking-[0.2em] leading-tight transition-colors duration-300 ${
                        isActive
                          ? card.textDark ? 'text-black/70' : 'text-warm-white/90'
                          : 'text-warm-white/20 hover:text-warm-white/35'
                      }`}>
                        {card.tab}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Content panel */}
              <div
                className="relative rounded-b-[12px] md:rounded-b-[14px] overflow-hidden h-[180px] md:h-[200px] lg:h-[210px]"
                style={{ backgroundColor: active.accentHex }}
              >
                {/* Ghost number */}
                <span
                  className={`pointer-events-none absolute -right-2 -bottom-4 md:-right-4 md:-bottom-6 text-[6rem] md:text-[10rem] font-black leading-none select-none ${active.textDark ? 'text-black/[0.06]' : 'text-warm-white/[0.08]'}`}
                  aria-hidden="true"
                >
                  {active.number}
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCard}
                    className="relative z-[1] p-5 md:p-8 lg:p-10"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <active.Icon size={16} className={active.textDark ? 'text-black/40' : 'text-warm-white/50'} strokeWidth={2} />
                      <span className={`text-[0.6rem] font-bold uppercase tracking-[0.25em] ${active.textDark ? 'text-black/35' : 'text-warm-white/40'}`}>
                        {active.number}
                      </span>
                    </div>
                    <h3 className={`text-[1.1rem] md:text-[1.5rem] lg:text-[1.75rem] font-black leading-snug ${active.textDark ? 'text-black' : 'text-warm-white'}`}>
                      {active.hook}
                    </h3>
                    <p className={`mt-2 md:mt-3 text-[0.8rem] md:text-[0.9rem] leading-[1.6] max-w-[540px] ${active.textDark ? 'text-black/50' : 'text-warm-white/55'}`}>
                      {active.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

        </div>
      </div>
    </section>
  )
}
