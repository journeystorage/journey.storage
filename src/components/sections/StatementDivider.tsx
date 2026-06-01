'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export default function StatementDivider() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const textX = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-black py-20 md:py-28 lg:py-36"
    >
      {/* Subtle top/bottom lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-warm-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-warm-white/[0.06] to-transparent" />

      {/* Scrolling large text — editorial style */}
      <motion.div
        className="pointer-events-none select-none"
        style={prefersReducedMotion ? {} : { x: textX }}
      >
        <motion.p
          className="whitespace-nowrap text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] xl:text-[7rem] font-black leading-none tracking-[-0.02em]"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, ease }}
        >
          <span className="text-warm-white/[0.08]">Your space is ready</span>
          <span className="mx-6 md:mx-10 text-orange">·</span>
          <span className="text-warm-white">100% digital</span>
          <span className="mx-6 md:mx-10 text-orange">·</span>
          <span className="text-warm-white/[0.08]">Zero friction</span>
          <span className="mx-6 md:mx-10 text-orange">·</span>
          <span className="text-warm-white">Move in today</span>
          <span className="mx-6 md:mx-10 text-orange">·</span>
          <span className="text-warm-white/[0.08]">Your space is ready</span>
        </motion.p>
      </motion.div>
    </div>
  )
}
