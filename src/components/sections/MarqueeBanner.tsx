'use client'

import { useReducedMotion } from 'framer-motion'

const items = [
  '24/7 access',
  '100% digital',
  '0 hidden fees',
  'month-to-month',
  'smart locks',
  'climate control',
  '24/7 access',
  '100% digital',
  '0 hidden fees',
  'month-to-month',
  'smart locks',
  'climate control',
]

export default function MarqueeBanner() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="relative overflow-hidden bg-orange py-3.5">
      <div
        className={`flex whitespace-nowrap ${prefersReducedMotion ? '' : 'animate-[marquee_8s_linear_infinite] md:animate-[marquee_25s_linear_infinite]'}`}
      >
        {items.map((item, i) => (
          <span key={i} className="mx-6 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-warm-white/90 md:mx-10">
            {item}
            <span className="ml-6 text-warm-white/40 md:ml-10">&#x2022;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
