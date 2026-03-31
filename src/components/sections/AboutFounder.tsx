'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds, externalUrls } from '@/lib/constants'

const stats = [
  { number: '$200M+', label: 'in deals' },
  { number: '17', label: 'facilities' },
  { number: '8+', label: 'years' },
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

      {/* ── Part 1: Brand Philosophy ── */}
      <div className="relative z-10 pt-24 pb-20 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">
            {/* Left: heading */}
            <div>
              <motion.div className="flex items-center gap-3 mb-5" {...anim(0)}>
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">About Journey</span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[0.92] text-black"
                {...anim(0.1)}
              >
                Not a warehouse.
                <br />
                <span className="font-light text-stone/70">A partner.</span>
              </motion.h2>
            </div>

            {/* Right: body text */}
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
                We&apos;re not here to rent you a unit. We&apos;re here so you
                can focus on what actually needs your attention: the move, the
                business, the family, the fresh start.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      </div>

      {/* ── Part 2: Founder ── */}
      <div className="relative z-10 pt-20 pb-24 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            {/* Portrait */}
            <motion.div
              className="lg:w-[28%] shrink-0"
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.6, ease, delay: 0.5 }}
            >
              <div className="relative mx-auto lg:mx-0 w-full max-w-[280px] overflow-hidden rounded-tl-[4px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[24px]" style={{ aspectRatio: '3/4' }}>
                <Image
                  src="/images/team/home-jonah-portrait.jpg"
                  alt="Jonah M. Hall, Founder of Journey.Storage"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 28vw"
                />
              </div>
            </motion.div>

            {/* Text + stats */}
            <motion.div className="lg:flex-1" {...anim(0.6)}>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug text-black">
                Founded by someone who built this industry.<br className="hidden lg:block" />
                <span className="font-light text-stone/70"> And walked away to build it right.</span>
              </h3>

              <p className="mt-4 max-w-[520px] text-body-sm leading-[1.7] text-stone/70">
                Jonah M. Hall has spent nearly a decade in self-storage,
                acquiring, building, and operating over $200M in assets across 17
                facilities. He left it all behind to start Journey.
              </p>

              {/* Stats */}
              <div className="mt-8 flex gap-10">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.4, ease, delay: 0.7 + i * 0.1 }}
                  >
                    <span className="text-2xl md:text-3xl font-bold text-orange">{stat.number}</span>
                    <p className="mt-0.5 text-caption text-black/30">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Links */}
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-6">
                <a href={externalUrls.investors} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-caption uppercase tracking-[0.15em] text-black/30 transition-colors duration-200 hover:text-orange">
                  Investment platform
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
                </a>
                <a href={externalUrls.consulting} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-caption uppercase tracking-[0.15em] text-black/30 transition-colors duration-200 hover:text-orange">
                  Consulting division
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
