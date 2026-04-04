'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const stats = [
  { value: '$200M+', label: 'deals acquired & developed' },
  { value: '30', label: 'facilities · 6 states' },
  { value: '18+ Years', label: 'industry-specific experience' },
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
      <div className="relative pt-24 pb-14 lg:pt-32 lg:pb-20">
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
                What they don&apos;t have is the&nbsp;expertise.
              </span>
            </h2>
          </motion.div>

          {/* ── Two-column: Door + Editorial text ── */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-14 xl:gap-20 lg:items-center">

            {/* LEFT — Door image with stenciled text */}
            <motion.div className="relative mb-12 lg:mb-0" {...anim(0.1)}>
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  boxShadow:
                    '0 20px 50px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.04)',
                }}
              >
                <div className="relative aspect-[4/5] lg:aspect-square">
                  <Image
                    src="/images/hero/storage-door-v2.webp"
                    alt="Orange self-storage unit door — closed"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1023px) 100vw, 480px"
                  />
                </div>

                {/* Stenciled text on the door — painted-on feel */}
                <div className="absolute inset-0 z-10 flex items-end p-6 md:p-8 lg:p-8">
                  <motion.p
                    className="text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] font-black uppercase leading-[1.1] tracking-[-0.01em] text-warm-white/[0.45] select-none"
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

            {/* RIGHT — Problem & Solution text */}
            <div>
              <motion.p
                className="text-body leading-[1.85] text-charcoal"
                {...anim(0.15)}
              >
                While simple, it&apos;s far from easy. Self storage is a modern, sophisticated business, and must be run like&nbsp;one.
              </motion.p>

              <motion.p
                className="mt-5 text-body leading-[1.85] text-charcoal"
                {...anim(0.25)}
              >
                Most investors fail in self-storage because they mistake a retail business for a passive real estate play. They buy an asset, inherit a job, and destroy their returns through operational&nbsp;incompetence.
              </motion.p>

              <motion.p
                className="mt-8 text-[1.15rem] md:text-[1.25rem] leading-[1.5] font-black text-black border-l-2 border-orange pl-5"
                {...anim(0.3)}
              >
                Journey.Advisory&trade; offers you Infrastructure-as-a-Service&nbsp;(IaaS).
              </motion.p>
              <motion.p
                className="mt-4 text-body leading-[1.85] text-charcoal"
                {...anim(0.33)}
              >
                We do not teach you how to build the machine; we install the machine into your portfolio. We do not simply provide you a Roadmap; we provide the vehicle and the&nbsp;driver.
              </motion.p>

              <motion.div className="mt-8" {...anim(0.36)}>
                <p className="text-h3 font-black leading-tight text-black">
                  You have the balance&nbsp;sheet.
                </p>
                <p className="mt-1 text-h3 font-black leading-tight text-orange">
                  You lack the infrastructure.
                </p>
              </motion.div>
            </div>
          </div>

          {/* ── Horizontal scroll cards (snap on mobile, grid on md+) ── */}
          <div className="relative mt-14 lg:mt-20 -mx-5 md:mx-0">
            {/* Gradient fade hint — mobile only */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-warm-white to-transparent z-10 md:hidden" aria-hidden="true" />

            <motion.div
              className="flex md:grid md:grid-cols-2 gap-5 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-1"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease, delay: 0.4 }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollPaddingLeft: '20px' }}
            >
              {/* Left padding spacer — mobile only */}
              <div className="shrink-0 w-5 -mr-5 md:hidden" aria-hidden="true" />

              {/* $200K card */}
              <div className="shrink-0 w-[75vw] sm:w-[60vw] md:w-auto snap-start rounded-xl border border-black/[0.06] bg-black/[0.025] p-6 lg:p-8">
                <p className="text-caption font-bold uppercase tracking-[0.2em] text-stone mb-4">Without us</p>
                <p className="text-[2.5rem] md:text-[3rem] font-black text-black leading-none tracking-tight">
                  $200K<span className="text-orange">+</span>
                  <span className="text-base md:text-lg font-bold text-stone tracking-normal">&nbsp;/&nbsp;yr</span>
                </p>
                <p className="mt-4 text-body-sm leading-[1.7] text-charcoal">
                  That&apos;s what a single analyst costs, after benefits, onboarding, and the months it takes to calibrate them to self-storage.
                </p>
              </div>

              {/* The alternative card */}
              <div className="shrink-0 w-[75vw] sm:w-[60vw] md:w-auto snap-start rounded-xl border border-black/[0.06] bg-black/[0.025] p-6 lg:p-8">
                <p className="text-caption font-bold uppercase tracking-[0.2em] text-orange mb-4">The alternative</p>
                <p className="text-body-sm leading-[1.7] text-charcoal">
                  You don&apos;t need a full-time hire.
                </p>
                <p className="mt-3 text-[1.5rem] md:text-[1.75rem] font-black text-black leading-snug">
                  You provide the capital.
                </p>
                <p className="mt-0.5 text-[1.5rem] md:text-[1.75rem] font-black text-orange leading-snug">
                  We provide the execution.
                </p>
              </div>

              {/* Right padding spacer — mobile only */}
              <div className="shrink-0 w-5 md:hidden" aria-hidden="true" />
            </motion.div>

            {/* Swipe hint — mobile only */}
            <div className="flex items-center justify-center gap-1.5 mt-4 md:hidden" aria-hidden="true">
              <span className="block h-1 w-6 rounded-full bg-orange/40" />
              <span className="block h-1 w-6 rounded-full bg-black/[0.06]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
