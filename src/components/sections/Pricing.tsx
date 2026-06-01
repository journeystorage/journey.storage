'use client'

import { useRef, useCallback, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'

const tiers = [
  {
    name: 'Scout',
    badge: null,
    tagline: 'Entry access \u00b7 For the selective investor',
    description: 'You\u2019re exploring the market or evaluating a small number of opportunities each month. You need expert eyes on the numbers before committing capital.',
    features: [
      'Up to 3 complete underwriting analyses per month',
      'Institutional-grade financial modeling & yield projections',
      'Feasibility review and market viability assessment',
      'Video call to discuss findings, strategy, and next steps',
    ],
  },
  {
    name: 'Pursuit',
    badge: 'Most popular',
    tagline: 'Active access \u00b7 For the active acquirer',
    description: 'You\u2019re in acquisition mode. Multiple opportunities are in front of you simultaneously, and you need consistent, high-velocity underwriting support.',
    features: [
      'Up to 10 complete analyses and feasibility studies per month',
      'In-depth underwriting with scenario modeling',
      'Deal sourcing support once your buy-box is defined',
      'Unlimited video calls to discuss deals and strategy',
      'Priority response, day or night',
    ],
  },
  {
    name: 'Command',
    badge: null,
    tagline: 'Full access \u00b7 For the portfolio builder',
    description: 'You\u2019re a family office or a serious capital allocator. You want the full consulting capability functioning as an extension of your team.',
    features: [
      'Unlimited analyses, underwriting, and feasibility studies',
      'Full transaction coordination and due diligence management',
      'Financing coordination and vendor oversight',
      'Site inspection, audit support, and closing mechanics',
      'Direct line to Jonah, treated as in-house resource',
    ],
  },
]

export default function Pricing() {
  const ref = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  // Scroll to Pursuit (index 1) on mount — mobile only
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const isMobile = window.innerWidth < 768
    if (!isMobile) return
    // Wait for layout to settle
    requestAnimationFrame(() => {
      const firstCard = el.firstElementChild as HTMLElement | null
      if (!firstCard) return
      const cardWidth = firstCard.offsetWidth
      const gap = 16
      el.scrollLeft = cardWidth + gap
    })
  }, [])

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const cardWidth = (scrollRef.current.firstElementChild as HTMLElement)?.offsetWidth ?? 300
    const gap = 16
    scrollRef.current.scrollBy({
      left: direction === 'right' ? cardWidth + gap : -(cardWidth + gap),
      behavior: 'smooth',
    })
  }, [])

  return (
    <section ref={ref} id={sectionIds.pricing} className="relative overflow-hidden bg-black pt-12 pb-24 lg:pt-16 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)',
      }} />

      <div className="relative z-10 mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Levels of access</span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h2 className="text-h2 font-black text-warm-white leading-snug">
            One model. Three levels. No lock-in.
          </h2>
        </motion.div>

        {/* Carousel wrapper with side arrows (mobile) / Grid (desktop) */}
        <div className="relative">
          {/* Side arrows — mobile only */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm border border-warm-white/[0.10] text-warm-white/50 active:scale-90 cursor-pointer md:hidden"
            aria-label="Previous plan"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm border border-warm-white/[0.10] text-warm-white/50 active:scale-90 cursor-pointer md:hidden"
            aria-label="Next plan"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>

          <div
            ref={scrollRef}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-5 px-5 md:mx-0 md:px-0 pt-4 pb-2 md:pt-0 md:pb-0"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {tiers.map((tier, i) => {
              const isPopular = tier.badge !== null
              return (
                <motion.div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-6 lg:p-8 min-w-[280px] w-[82vw] md:w-auto md:min-w-0 snap-center shrink-0 md:shrink ${
                    isPopular
                      ? 'border-orange/30 bg-orange/[0.04]'
                      : 'border-warm-white/[0.06] bg-warm-white/[0.02]'
                  }`}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 25 }}
                  animate={isInView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.12 }}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-6 rounded-sm bg-orange px-3 py-1 text-caption font-bold uppercase tracking-[0.1em] text-warm-white">
                      {tier.badge}
                    </span>
                  )}

                  <h3 className="text-2xl font-black text-warm-white">{tier.name}</h3>
                  <p className="mt-1 text-caption uppercase tracking-[0.1em] text-orange">{tier.tagline}</p>
                  <p className="mt-4 text-body-sm leading-[1.7] text-warm-white/40">{tier.description}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check size={16} className="mt-0.5 shrink-0 text-orange" strokeWidth={2} />
                        <span className="text-body-sm leading-snug text-warm-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-caption text-warm-white/25 leading-relaxed">
                    Monthly subscription.<br />
                    Cancel with 30 days&apos; notice.
                  </p>

                  <a
                    href={CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 block w-full rounded-sm py-3.5 text-center text-body-sm font-bold transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] ${
                      isPopular
                        ? 'bg-orange text-warm-white'
                        : 'border border-warm-white/[0.1] text-warm-white hover:border-warm-white/20'
                    }`}
                  >
                    Schedule a call
                  </a>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
