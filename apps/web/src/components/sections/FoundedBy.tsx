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

export default function FoundedBy() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section ref={ref} id={sectionIds.foundedBy} className="relative overflow-hidden bg-charcoal py-20 lg:py-28">
      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Portrait — compact */}
          <motion.div
            className="lg:w-[28%] shrink-0"
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-tl-[4px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[24px] max-w-[280px]" style={{ aspectRatio: '3/4' }}>
              <Image
                src="/images/team/home-jonah-portrait.jpg"
                alt="Jonah M. Hall, Founder of Journey.Storage™"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 28vw"
              />
            </div>
          </motion.div>

          {/* Text + stats — compact, not dramatic */}
          <motion.div
            className="lg:flex-1"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold leading-snug text-warm-white">
              Founded by someone who built this industry.<br className="hidden lg:block" />
              <span className="font-light text-warm-white/50"> And walked away to build it right.</span>
            </h2>

            <p className="mt-4 max-w-[520px] text-body-sm leading-[1.7] text-warm-white/40">
              Jonah M. Hall has spent nearly a decade in self-storage,
              acquiring, building, and operating over $200M in assets across 17
              facilities. He left it all behind to start Journey.
            </p>

            {/* Inline stats — small, horizontal, not dramatic */}
            <div className="mt-6 flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className="text-xl md:text-2xl font-bold text-orange">{stat.number}</span>
                  <p className="text-caption text-warm-white/30">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-6">
              <a href={externalUrls.investors} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-caption uppercase tracking-[0.15em] text-warm-white/30 transition-colors duration-200 hover:text-orange">
                Investment platform
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
              <a href={externalUrls.consulting} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-caption uppercase tracking-[0.15em] text-warm-white/30 transition-colors duration-200 hover:text-orange">
                Consulting division
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
