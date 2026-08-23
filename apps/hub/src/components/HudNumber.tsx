'use client'

import { useEffect, useRef, useState } from 'react'

// Counts up from 0 to value on mount/change — a system-readout feel for
// headline numbers. transform/opacity-safe: this animates a number, not a
// CSS property, so it doesn't run into the transition-all guardrail at all.
export function HudNumber({ value, format }: { value: number; format?: (n: number) => string }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    let raf: number
    startRef.current = null
    const duration = 650

    function tick(now: number) {
      if (startRef.current == null) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <>{format ? format(display) : Math.round(display)}</>
}
