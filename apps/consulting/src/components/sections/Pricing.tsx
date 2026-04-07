'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Check, Layers, Send } from 'lucide-react'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'
import LeadCaptureModal, { type FormSource } from '@/components/ui/LeadCaptureModal'

const tiers = [
  {
    name: 'Scout',
    badge: null,
    price: '$7,500',
    tier: 'Entry access',
    description: 'Expert eyes on your next deal. Institutional-grade feasibility without the full-time hire.',
    forWho: 'For the selective investor',
    features: [
      'Up to 3 complete underwriting analyses per month',
      'Institutional-grade financial modeling & yield projections',
      'Feasibility review and market viability assessment',
      'Buy-box definition and target market mapping',
      'Video call to walk through findings and strategy',
      'Direct access to Journey\u2019s team',
    ],
    cta: 'Get started',
    href: 'https://buy.stripe.com/3cI14oaMr6jk6Mh8ll0sU00',
    formSource: 'consulting-scout' as FormSource,
    tierDetail: 'Scout — $7,500/mo',
  },
  {
    name: 'Pursuit',
    badge: 'Most popular',
    price: '$15,000',
    tier: 'Active access',
    description: 'Feasibility for what\u2019s next. Advisory for what you already own. One subscription, both covered.',
    forWho: 'For the acquirer',
    features: [
      'Up to 10 complete underwriting analyses and feasibility studies',
      'Deal sourcing support once your buy-box is defined',
      'Operational review and revenue optimization for active facilities',
      'Technology, marketing, and lease-up advisory',
      'Financing strategy: debt structuring, lender positioning, refi timing',
      'Unlimited video calls and priority response, day or night',
    ],
    cta: 'Get started',
    href: 'https://buy.stripe.com/aFa7sM07N0Z08UpcBB0sU02',
    formSource: 'consulting-pursuit' as FormSource,
    tierDetail: 'Pursuit — $15,000/mo',
  },
  {
    name: 'Command',
    badge: null,
    price: null,
    tier: 'Full access',
    description: 'Journey\u2019s full capability embedded in your team. Feasibility, advisory, execution. No limits.',
    forWho: 'For the portfolio builder',
    features: [
      'Unlimited analyses, underwriting, and feasibility studies',
      'Full advisory: operations, financing, marketing, and tech stack',
      'Transaction coordination and due diligence management',
      'Site inspection, audit support, and closing mechanics',
      'Direct line to Journey\u2019s team, treated as in-house resource',
      'Single-project and success fee structures available',
    ],
    cta: 'Schedule a call',
    href: CALENDAR_URL,
    formSource: 'consulting-booking' as FormSource,
    tierDetail: 'Command — Custom',
  },
]

export default function Pricing() {
  const ref = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  const [activeIndex, setActiveIndex] = useState(1)
  const [modalTier, setModalTier] = useState<typeof tiers[number] | null>(null)

  // Scroll to Pursuit (index 1) on mount — mobile only
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const isMobile = window.innerWidth < 768
    if (!isMobile) return
    requestAnimationFrame(() => {
      const firstCard = el.firstElementChild as HTMLElement | null
      if (!firstCard) return
      const cardWidth = firstCard.offsetWidth
      const gap = 16
      el.scrollLeft = cardWidth + gap
    })
  }, [])

  // Track scroll position to update active dot
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const firstCard = el.firstElementChild as HTMLElement | null
      if (!firstCard) return
      const cardWidth = firstCard.offsetWidth
      const gap = 16
      const index = Math.round(el.scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(Math.max(index, 0), tiers.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return
    const firstCard = scrollRef.current.firstElementChild as HTMLElement | null
    if (!firstCard) return
    const cardWidth = firstCard.offsetWidth
    const gap = 16
    scrollRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth',
    })
  }, [])

  return (
    <section ref={ref} id={sectionIds.pricing} className="relative overflow-hidden bg-black pt-12 pb-24 lg:pt-16 lg:pb-32">
      {/* Ghost divider line */}
      <div className="absolute top-0 inset-x-0 z-10 flex justify-center" aria-hidden="true">
        <div className="h-px w-full max-w-[var(--container-content)] mx-5 md:mx-8 lg:mx-16 bg-gradient-to-r from-transparent via-orange/20 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)',
      }} />

      <div className="relative z-10 mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Pricing</span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
            Choose your level
            <br />
            <span className="font-light text-warm-white/30">of&nbsp;access.</span>
          </h2>

          {/* Compact two-step indicator */}
          <div className="mt-8 flex items-center justify-center gap-3 md:gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-warm-white/[0.08] bg-warm-white/[0.03]">
                <Layers size={14} className="text-orange" strokeWidth={2} />
              </div>
              <div className="text-left">
                <span className="block text-[0.55rem] font-bold uppercase tracking-[0.25em] text-orange">01</span>
                <span className="block text-[0.75rem] font-bold text-warm-white/70">Choose your level</span>
              </div>
            </div>

            <div className="h-px w-6 md:w-10 bg-warm-white/10" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-warm-white/[0.08] bg-warm-white/[0.03]">
                <Send size={14} className="text-orange" strokeWidth={2} />
              </div>
              <div className="text-left">
                <span className="block text-[0.55rem] font-bold uppercase tracking-[0.25em] text-orange">02</span>
                <span className="block text-[0.75rem] font-bold text-warm-white/70">Send us your deals</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carousel wrapper / Grid (desktop) */}
        <div className="relative">
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
                  <p className="mt-1 text-caption uppercase tracking-[0.1em] text-orange">{tier.tier}</p>
                  <p className="mt-2 text-caption text-warm-white/25">{tier.forWho}</p>
                  <div className="mt-3 h-px w-full bg-warm-white/[0.06]" />
                  {tier.price ? (
                    <p className="mt-4 text-3xl font-black text-warm-white">
                      {tier.price}<span className="text-base font-bold text-warm-white/40">/month</span>
                    </p>
                  ) : (
                    <p className="mt-4 text-3xl font-black text-warm-white/30">
                      Let&apos;s talk
                    </p>
                  )}
                  <p className="mt-3 text-[0.8rem] leading-[1.6] text-warm-white/40">{tier.description}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check size={16} className="mt-0.5 shrink-0 text-orange" strokeWidth={2} />
                        <span className="text-body-sm leading-snug text-warm-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-[0.65rem] text-warm-white/20 leading-relaxed">
                    Monthly subscription. Cancel with 30 days&apos; notice.
                  </p>

                  <button
                    onClick={() => setModalTier(tier)}
                    className={`mt-6 block w-full rounded-sm py-3.5 text-center text-body-sm font-bold transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                      isPopular
                        ? 'bg-orange text-warm-white'
                        : 'border border-warm-white/[0.1] text-warm-white hover:border-warm-white/20'
                    }`}
                  >
                    {tier.cta} <span>&rarr;</span>
                  </button>
                </motion.div>
              )
            })}
          </div>

          {/* Dot indicators — mobile only */}
          <div className="flex items-center justify-center gap-2 mt-6 md:hidden">
            {tiers.map((tier, i) => (
              <button
                key={tier.name}
                onClick={() => scrollTo(i)}
                className="group flex items-center gap-1.5 cursor-pointer py-1"
                aria-label={`Go to ${tier.name}`}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? 24 : 6,
                    height: 6,
                    backgroundColor: i === activeIndex ? '#E8622A' : 'rgba(245,240,232,0.15)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <LeadCaptureModal
        open={modalTier !== null}
        onClose={() => setModalTier(null)}
        formSource={modalTier?.formSource ?? 'consulting-scout'}
        tierName={modalTier?.name ?? ''}
        tierDetail={modalTier?.tierDetail ?? ''}
        redirectUrl={modalTier?.href ?? ''}
      />
    </section>
  )
}
