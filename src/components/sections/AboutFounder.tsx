'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const stats = [
  { value: '30', suffix: '+', label: 'Facilities' },
  { value: '18', suffix: '+', label: 'Years' },
]

export default function AboutFounder() {
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
          transition: { duration: 0.5, ease, delay },
        }

  return (
    <section ref={ref} id={sectionIds.about} className="relative overflow-hidden bg-warm-white">
      {/* Ghost watermark */}
      <div className="pointer-events-none absolute top-16 left-0 z-0 select-none hidden lg:block" aria-hidden="true">
        <span className="ml-[5%] text-[10rem] xl:text-[14rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap">
          ABOUT
        </span>
      </div>

      {/* ── Brand Philosophy ── */}
      <div className="relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">
            <div>
              <motion.div className="flex items-center gap-3 mb-5" {...anim(0)}>
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">About Journey</span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[0.92] text-black"
                {...anim(0.1)}
              >
                Not a container.
                <br />
                <span className="font-light text-stone/70">A partner.</span>
              </motion.h2>
            </div>

            <div className="mt-8 lg:mt-12">
              <motion.p className="text-lg leading-[1.8] text-stone" {...anim(0.2)}>
                There&apos;s a moment in every transition that nobody talks
                about. It&apos;s not the new apartment, the grand opening, or
                the first day of something new. It&apos;s the moment right
                before. When you&apos;ve decided where you&apos;re going, but
                you&apos;re not there yet.
              </motion.p>

              <motion.p className="mt-6 text-xl font-bold text-black" {...anim(0.3)}>
                That&apos;s where Journey lives.
              </motion.p>

              <motion.p className="mt-4 text-lg leading-[1.8] text-stone" {...anim(0.4)}>
                We&apos;re not here to rent you a space. We&apos;re here so you
                can focus on what actually needs your attention: the move, the
                business, the family, the fresh start.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Built by Operators — dark card ── */}
      <div className="relative z-10 pb-20 lg:pb-24">
        <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <motion.div
            className="grain relative overflow-hidden rounded-[20px] md:rounded-[24px] bg-charcoal px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14"
            {...anim(0.5)}
          >
            {/* Subtle radial glow */}
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{
              background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(232,98,42,0.06), transparent)',
            }} />

            <div className="relative z-10 flex flex-col items-center text-center gap-6 lg:flex-row lg:items-center lg:text-left lg:gap-0">
              {/* Left: heading */}
              <div className="flex-1 flex flex-col items-center lg:items-start">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-orange mb-4">Built by operators</span>
                <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-black text-warm-white leading-[1]">
                  Starting fresh.
                  <br />
                  <span className="font-light text-warm-white/40">To build it right.</span>
                </h3>
              </div>

              {/* Vertical divider — desktop only */}
              <div className="hidden lg:block self-stretch w-px bg-warm-white/[0.08] mx-10 xl:mx-14" />

              {/* Horizontal divider — mobile only */}
              <div className="h-px w-16 bg-warm-white/[0.08] lg:hidden" />

              {/* Right: tagline + stats */}
              <div className="flex flex-col items-center lg:items-end gap-5">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-orange">The experience behind Journey</span>
                <div className="flex items-center">
                  {stats.map((stat, i) => (
                    <div key={stat.label} className="flex items-center">
                      {i > 0 && (
                        <div className="h-10 w-px bg-warm-white/[0.08] mx-6 sm:mx-8 lg:mx-10" />
                      )}
                      <div className="text-center">
                        <span className="block text-4xl font-black leading-none">
                          <span className="text-warm-white">{stat.value}</span>
                          {stat.suffix && <span className="text-orange">{stat.suffix}</span>}
                        </span>
                        <span className="mt-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.25em] text-warm-white/40">
                          {stat.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
