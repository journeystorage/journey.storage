'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

export default function Founder() {
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
    <section ref={ref} id={sectionIds.founder} className="relative overflow-hidden bg-warm-white py-24 lg:py-32">
      <div className="pointer-events-none absolute top-10 left-0 z-0 select-none hidden lg:block" aria-hidden="true">
        <span className="ml-[5%] text-[10rem] xl:text-[14rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap">
          JONAH
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 lg:items-start">
          {/* Photo */}
          <motion.div className="flex flex-col items-center lg:items-start" {...anim(0)}>
            <div className="relative w-48 h-48 lg:w-full lg:h-auto lg:aspect-[3/4] overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/team/home-jonah-portrait.webp"
                alt="Jonah M. Hall"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="mt-4 text-lg font-bold text-black text-center lg:text-left">Jonah M. Hall</p>
            <p className="text-caption uppercase tracking-[0.15em] text-orange">Founder &amp; CEO</p>
          </motion.div>

          {/* Bio */}
          <div className="mt-10 lg:mt-0">
            <motion.div className="flex items-center gap-3 mb-5" {...anim(0.1)}>
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Your consultant</span>
            </motion.div>

            <motion.h2 className="text-h2 font-black leading-snug text-black" {...anim(0.15)}>
              Jonah M. Hall built this from inside the industry, not from above it.
            </motion.h2>

            <motion.p className="mt-6 text-body leading-[1.8] text-charcoal" {...anim(0.25)}>
              In under a decade, Jonah has served in nearly every capacity in self-storage, acquisitions, development, construction, facility operations, property management, asset management, investor relations, capital raising, and deal structuring.
            </motion.p>

            <motion.p className="mt-4 text-body leading-[1.8] text-charcoal" {...anim(0.35)}>
              He co-founded Smartlock Self Storage&reg; and scaled it from inception to ~$70M+ in assets under management across 17 locations in three states, pioneering the autonomous customer journey. He then served as President &amp; Chief Investment Officer at Cedar Creek Capital&reg;, where he transformed a team of seventy into a high-performing operation of fifty-four, cutting nearly $1M in payroll while repositioning over $150M in existing assets and acquiring $60M in new ones.
            </motion.p>

            <motion.p className="mt-4 text-body leading-[1.8] text-charcoal" {...anim(0.45)}>
              In January 2026, Jonah exited both ventures to build the Journey.Storage&trade; ecosystem with a clean slate. <strong className="font-bold text-black">Journey.Advisory&trade; is where that experience becomes yours.</strong>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
