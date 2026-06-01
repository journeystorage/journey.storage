'use client'

import { motion, useReducedMotion } from 'framer-motion'

type PinSize = 'sm' | 'md' | 'lg'

interface MapPinProps {
  x: number
  y: number
  delay?: number
  size?: PinSize
  isInView: boolean
}

/* Responsive sizes: [mobile, desktop] */
const pinDimensions: Record<PinSize, [number, number]> = { sm: [2, 3], md: [3, 6], lg: [5, 8] }
const pinOpacity: Record<PinSize, number> = { sm: 0.25, md: 0.6, lg: 1 }

/* Tailwind classes for responsive width/height */
const sizeClasses: Record<PinSize, string> = {
  sm: 'w-[2px] h-[2px] md:w-[3px] md:h-[3px]',
  md: 'w-[3px] h-[3px] md:w-[6px] md:h-[6px]',
  lg: 'w-1 h-1 md:w-[8px] md:h-[8px]',
}

export default function MapPin({ x, y, delay = 0, size = 'md', isInView }: MapPinProps) {
  const prefersReducedMotion = useReducedMotion()
  const targetOpacity = pinOpacity[size]

  return (
    <motion.div
      className={`absolute rounded-full bg-orange -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={prefersReducedMotion ? { opacity: targetOpacity } : { opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: targetOpacity, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: prefersReducedMotion ? 0 : delay }}
    />
  )
}

/* Pulse ring sizes: [mobile, desktop] for the base ring */
const pulseClasses = 'w-1 h-1 md:w-[8px] md:h-[8px]'

export function MapPinPulse({ x, y, isInView }: { x: number; y: number; isInView: boolean }) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) return null

  return (
    <>
      <motion.div
        className={`absolute rounded-full border border-orange pointer-events-none -translate-x-1/2 -translate-y-1/2 ${pulseClasses}`}
        style={{ left: `${x}%`, top: `${y}%` }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.5, 0], scale: [1, 2.8, 1] } : undefined}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 2 }}
      />
      <motion.div
        className={`absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 ${pulseClasses}`}
        style={{ left: `${x}%`, top: `${y}%`, borderWidth: 0.5, borderStyle: 'solid', borderColor: '#E8622A' }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.25, 0], scale: [1, 4.2, 1] } : undefined}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 2.4 }}
      />
    </>
  )
}
