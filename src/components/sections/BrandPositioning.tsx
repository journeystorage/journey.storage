'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

export default function BrandPositioning() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section ref={ref} id={sectionIds.about} className="grain relative overflow-hidden bg-black py-32 lg:py-44">
      {/* Full-bleed background image — the positioning photo IS the section */}
      <div className="absolute inset-0">
        <Image
          src="/images/moments/home-positioning-bg.webp"
          alt="A visual metaphor for transition — a road, bridge, or open doorway"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Heavy dark overlay for legibility — atmospheric */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Warm tint for brand feel */}
      <div className="absolute inset-0 bg-orange/[0.03]" />

      {/* Ghost text */}
      <div className="pointer-events-none absolute top-12 left-0 z-0 select-none hidden lg:block" aria-hidden="true">
        <span className="ml-[5%] text-[10rem] xl:text-[14rem] font-black uppercase leading-none text-warm-white/[0.02] whitespace-nowrap">
          ABOUT US
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
        <div className="max-w-[620px]">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease }}
          >
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">About Journey</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.92] text-warm-white"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            Not a warehouse.
            <br />
            <span className="font-light text-warm-white/50">A partner.</span>
          </motion.h2>

          <div className="mt-10 space-y-6">
            <motion.p
              className="text-lg leading-[1.8] text-warm-white/60"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease, delay: 0.2 }}
            >
              There&apos;s a moment in every transition that nobody talks
              about. It&apos;s not the new apartment, the grand opening, or
              the first day of something new. It&apos;s the moment right
              before. When you&apos;ve decided where you&apos;re going, but
              you&apos;re not there yet.
            </motion.p>

            <motion.p
              className="text-2xl font-black text-warm-white"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease, delay: 0.3 }}
            >
              That&apos;s where Journey lives.
            </motion.p>

            <motion.p
              className="text-lg leading-[1.8] text-warm-white/60"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease, delay: 0.4 }}
            >
              We&apos;re not here to rent you a unit. We&apos;re here so you
              can focus on what actually needs your attention: the move, the
              business, the family, the fresh start.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
