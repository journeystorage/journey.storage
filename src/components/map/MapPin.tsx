'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface MapPinProps {
  x: number
  y: number
  delay?: number
  active?: boolean
  isInView: boolean
}

export default function MapPin({ x, y, delay = 0, active = false, isInView }: MapPinProps) {
  const prefersReducedMotion = useReducedMotion()
  const cx = `${x}%`
  const cy = `${y}%`

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={active ? 1.1 : 0.6}
      className="fill-orange"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: active ? 1 : 0.7, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: prefersReducedMotion ? 0 : delay }}
    />
  )
}

export function MapPinPulse({ x, y, isInView }: { x: number; y: number; isInView: boolean }) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) return null

  const cx = `${x}%`
  const cy = `${y}%`

  return (
    <>
      <motion.circle
        cx={cx}
        cy={cy}
        r={1.1}
        className="fill-none stroke-orange"
        strokeWidth={0.25}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.6, 0], r: [1.1, 3.5, 1.1] } : undefined}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 2 }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={1.1}
        className="fill-none stroke-orange"
        strokeWidth={0.15}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.3, 0], r: [1.1, 5.5, 1.1] } : undefined}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 2.4 }}
      />
    </>
  )
}
