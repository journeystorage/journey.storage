'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const stats = [
  { value: '$200M+', label: 'in deals acquired & developed' },
  { value: '17', label: 'facilities across 3 states' },
  { value: '8+', label: 'years of storage-specific underwriting' },
  { value: '~$100M', label: 'in CRE managed for a family office' },
]

export default function ProofBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <div ref={ref} className="relative border-y border-warm-white/[0.06] bg-black">
      <div className="mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16 py-12 lg:py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center md:text-left"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <p className="text-3xl lg:text-4xl font-black leading-none text-warm-white">{stat.value}</p>
              <p className="mt-2 text-body-sm leading-snug text-warm-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
