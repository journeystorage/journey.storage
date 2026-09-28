'use client'

import { useEffect } from 'react'

// Tells the RevealFailsafe timer that React hydrated, so the scroll-reveal
// animations are running and the failsafe must not force content visible.
export default function RevealReady() {
  useEffect(() => {
    ;(window as unknown as { __revealReady?: boolean }).__revealReady = true
  }, [])
  return null
}
