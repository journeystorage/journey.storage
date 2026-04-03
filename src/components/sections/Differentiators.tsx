'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const cards = [
  {
    hook: "Storage shouldn't feel like storage.",
    body: "Every detail, redesigned. The access. The experience. The respect.",
    color: 'bg-orange',
    number: '01',
  },
  {
    hook: 'No hidden fees. Ever.',
    body: "Clear pricing. Month-to-month. We earn your stay, not your lock-in.",
    color: 'bg-terracotta',
    number: '02',
  },
  {
    hook: 'Talk to a real person.',
    body: "Not a chatbot. Someone who understands your moment and how to help.",
    color: 'bg-charcoal',
    number: '03',
  },
  {
    hook: 'Smart, safe, always open.',
    body: "Smart access. Digital locks. Trust made physical.",
    color: 'bg-sand',
    textDark: true,
    number: '04',
  },
]

export default function Differentiators() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section ref={ref} id={sectionIds.differentiators} className="relative overflow-hidden bg-black pt-0 pb-16 lg:pt-0 lg:pb-20">
      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* Thin divider — separates from HowItWorks without a gap */}
        <div className="mb-16 lg:mb-20 h-px bg-gradient-to-r from-transparent via-warm-white/[0.06] to-transparent" />

        {/* Header */}
        <motion.div
          className="mb-14 lg:mb-20"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Why Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.92] text-warm-white">
            A different kind of
            <br />
            <span className="font-light text-warm-white/30">storage company.</span>
          </h2>
        </motion.div>

        {/* Rivian-style colored block cards — 2x2 grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.number}
              className={`group relative ${card.color} rounded-[16px] p-7 md:p-9 flex flex-col justify-between min-h-[200px] md:min-h-[240px] overflow-hidden transition-transform duration-300 hover:-translate-y-1 cursor-pointer`}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease, delay: prefersReducedMotion ? 0 : 0.15 + i * 0.1 }}
            >
              {/* Ghost number in background */}
              <span
                className={`pointer-events-none absolute -right-4 -bottom-6 select-none text-[8rem] md:text-[10rem] font-black leading-none ${card.textDark ? 'text-black/[0.06]' : 'text-warm-white/[0.08]'}`}
                aria-hidden="true"
              >
                {card.number}
              </span>

              {/* Top: number */}
              <div className="relative z-10">
                <span className={`text-[0.6rem] font-bold uppercase tracking-[0.3em] ${card.textDark ? 'text-black/40' : 'text-warm-white/50'}`}>
                  {card.number}
                </span>
              </div>

              {/* Bottom: text */}
              <div className="relative z-10 mt-auto">
                <h3 className={`text-xl md:text-2xl font-black leading-snug ${card.textDark ? 'text-black' : 'text-warm-white'}`}>
                  {card.hook}
                </h3>
                <p className={`mt-2 text-sm leading-[1.6] ${card.textDark ? 'text-black/50' : 'text-warm-white/50'}`}>
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
