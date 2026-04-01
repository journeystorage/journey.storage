'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const stats = [
  { value: '$200M+', label: 'deals acquired & developed' },
  { value: '27', label: 'facilities · 6 states' },
  { value: '8+ Yrs', label: 'industry-specific experience' },
  { value: '$500M', label: 'self-storage assets managed' },
]

export default function Problem() {
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
    <section ref={ref} id={sectionIds.problem} className="relative overflow-hidden bg-warm-white">
      {/* ━━ Dark proof bar ━━ */}
      <div className="grain relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16 py-10 lg:py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              >
                <p className="text-3xl lg:text-4xl font-black leading-none text-warm-white" dangerouslySetInnerHTML={{ __html: stat.value.replace(/\+/g, '<span class="text-orange">+</span>') }} />
                <p className="mt-2 text-caption leading-snug text-warm-white/35">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━ Main content — directly on warm-white, NO container ━━ */}
      <div className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">
          {/* ── Centered header ── */}
          <motion.div className="relative text-center mb-14 lg:mb-16" {...anim(0)}>
            {/* Ghost watermark — bottom edge at label midline */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -translate-y-[80%] md:-translate-y-[55%] z-0 select-none overflow-visible flex justify-center" aria-hidden="true">
              <span className="text-[4.5rem] md:text-[12rem] lg:text-[15rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap">
                GUESSING
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">
                The real cost of guessing
              </span>
              <div className="h-px w-8 bg-orange" />
            </div>

            <h2 className="text-h1 font-black leading-[1.08] text-black max-w-[720px] mx-auto">
              Most investors enter self-storage with capital and conviction.{' '}
              <span className="text-orange">
                What they don&apos;t have is the&nbsp;underwriting.
              </span>
            </h2>
          </motion.div>

          {/* ── Two-column: Door + Content — no wrapper ── */}
          <div className="lg:grid lg:grid-cols-[1fr_1.15fr] lg:gap-12 xl:gap-16 lg:items-center">

            {/* LEFT — Door image with stenciled text */}
            <motion.div className="relative mb-12 lg:mb-0" {...anim(0.1)}>
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  boxShadow:
                    '0 20px 50px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.04)',
                }}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/images/hero/storage-door-v2.jpg"
                    alt="Orange self-storage unit door — closed"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1023px) 100vw, 480px"
                  />
                </div>

                {/* Stenciled text on the door — painted-on feel */}
                <div className="absolute inset-0 z-10 flex items-end p-6 md:p-8 lg:p-8">
                  <motion.p
                    className="text-[1.35rem] md:text-[1.5rem] lg:text-[1.6rem] font-black uppercase leading-[1.15] tracking-[-0.01em] text-warm-white/[0.35] select-none"
                    style={{
                      mixBlendMode: 'overlay',
                      textShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                    initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : undefined}
                    transition={{ duration: 1.2, ease, delay: 0.6 }}
                  >
                    This door won&apos;t<br />
                    open with<br />
                    guesswork.
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Content */}
            <div>
              <motion.p
                className="text-body leading-[1.85] text-charcoal"
                {...anim(0.15)}
              >
                The difference between a good deal and an expensive lesson
                isn&apos;t ambition,it&apos;s the quality of your
                analysis at the moment the deal lands on your desk. Market
                assumptions that look reasonable on paper. Revenue projections
                borrowed from a broker&apos;s pro&nbsp;forma.
              </motion.p>

              <motion.p
                className="mt-5 text-body leading-[1.85] text-charcoal"
                {...anim(0.25)}
              >
                Expense ratios disconnected from operational reality. Without
                proper underwriting, you&apos;re standing in front of a closed
                door,capital in hand, but no way to see
                what&apos;s on the other&nbsp;side.
              </motion.p>

              {/* $150K — typographic treatment, not a card */}
              <motion.div className="mt-10" {...anim(0.35)}>
                <p className="text-[2.75rem] md:text-[3.25rem] font-black text-black leading-none tracking-tight">
                  $150K<span className="text-orange">+</span>
                  <span className="text-lg md:text-xl font-bold text-stone tracking-normal">&nbsp;/&nbsp;yr</span>
                </p>
                <p className="mt-3 text-body-sm leading-[1.75] text-charcoal max-w-[420px]">
                  That&apos;s what a single analyst costs,before
                  benefits, onboarding, and the months it takes to calibrate
                  them to self-storage.
                </p>
              </motion.div>

              <motion.div className="mt-10" {...anim(0.45)}>
                <p className="text-lg font-black text-black">
                  You don&apos;t need a full-time hire.
                </p>
                <p className="text-lg font-black text-orange">
                  You need fractional access.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
