'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
  /** Use full-bleed background (children still constrained to max-width) */
  fullBleed?: boolean
  /** Additional classes on the outer wrapper (for background color) */
  outerClassName?: string
}

export default function SectionWrapper({
  id,
  children,
  className = '',
  fullBleed = false,
  outerClassName = '',
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  const content = (
    <div
      className={`mx-auto w-full max-w-content px-5 md:px-8 lg:px-16 ${className}`}
    >
      {children}
    </div>
  )

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 20 }
      }
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={
        fullBleed
          ? `py-12 md:py-16 lg:py-24 ${outerClassName}`
          : `py-12 md:py-16 lg:py-24 ${outerClassName}`
      }
    >
      {content}
    </motion.section>
  )
}
