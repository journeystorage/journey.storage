'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds, externalUrls } from '@/lib/constants'

const founders = [
  {
    name: 'Jonah M. Hall',
    role: 'Founder & CEO',
    image: '/images/team/home-jonah-portrait.jpg',
    alt: 'Jonah M. Hall, Founder of Journey.Storage',
    bio: 'Jonah has spent nearly a decade in self-storage, acquiring, building, and operating over $500M in assets across 26 facilities in 6 states. He left it all behind to start Journey.',
  },
  {
    name: 'Lyvia Hall',
    role: 'Co-founder & COO',
    image: '/images/team/home-lyvia-portrait.jpg',
    alt: 'Lyvia Hall, Co-founder of Journey.Storage',
    bio: 'Lyvia spent five years as Executive Director of a nationally scaling self-storage company, building the financial systems, reporting, and operational controls behind rapid growth. She joined Journey to make sure growth never outpaces discipline.',
  },
]

export default function AboutFounder() {
  const ref = useRef<HTMLElement>(null)
  const foundersRef = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const foundersInView = useInView(foundersRef, { once: true, margin: '-60px' })
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

  const founderAnim = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 } as const,
          animate: foundersInView ? ({ opacity: 1, y: 0 } as const) : undefined,
          transition: { duration: 0.5, ease, delay },
        }

  return (
  <>
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
    </section>

    {/* Divider */}
    <div className="bg-warm-white">
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      </div>
    </div>

    {/* ── Part 2: Founders — light section matching About ── */}
    <section ref={foundersRef} id={sectionIds.foundedBy} className="relative overflow-hidden bg-warm-white">
      {/* Ghost watermark */}
      <div className="pointer-events-none absolute top-8 left-0 z-0 select-none hidden lg:block" aria-hidden="true">
        <span className="ml-[5%] text-[10rem] xl:text-[14rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap">
          FOUNDERS
        </span>
      </div>

      <div className="relative z-10 pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
          {/* Heading */}
          <motion.div
            className="mb-12 lg:mb-14 text-center"
            {...founderAnim(0)}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Founded by operators</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-[0.95]">
              Built this industry.
              <br />
              <span className="font-light text-stone/60">Walked away to build it right.</span>
            </h2>
          </motion.div>

          {/* Founders cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {founders.map((founder, i) => (
              <motion.div
                key={founder.name}
                className="group relative rounded-2xl border border-black/[0.06] bg-white/50 p-6 lg:p-8 text-center"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 25 }}
                animate={foundersInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.15 }}
              >
                {/* Photo */}
                <div className="relative mx-auto w-28 h-28 lg:w-32 lg:h-32 overflow-hidden rounded-full border-2 border-black/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={founder.image}
                    alt={founder.alt}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>

                {/* Info */}
                <div className="mt-5">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">
                    {founder.role}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-black">
                    {founder.name}
                  </h3>
                  <p className="mt-3 text-[0.875rem] leading-[1.7] text-stone max-w-[380px] mx-auto">
                    {founder.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Links */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8"
            {...founderAnim(0.5)}
          >
            <a href={externalUrls.investors} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-caption uppercase tracking-[0.15em] text-stone transition-colors duration-200 hover:text-orange">
              Investment platform
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
            </a>
            <a href={externalUrls.consulting} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-caption uppercase tracking-[0.15em] text-stone transition-colors duration-200 hover:text-orange">
              Consulting division
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  </>
  )
}
