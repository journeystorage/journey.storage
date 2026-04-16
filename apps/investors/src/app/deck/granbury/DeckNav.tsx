'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export default function DeckNav({ totalPages }: { totalPages: number }) {
  const [current, setCurrent] = useState(1)
  const currentRef = useRef(1)

  const goTo = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages))
    const sections = document.querySelectorAll('.deck-page')
    if (sections[clamped - 1]) {
      sections[clamped - 1].scrollIntoView({ behavior: 'smooth' })
    }
  }, [totalPages])

  /* Track scroll position via IntersectionObserver */
  useEffect(() => {
    const container = document.querySelector('.deck')
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sections = Array.from(document.querySelectorAll('.deck-page'))
            const idx = sections.indexOf(entry.target as Element)
            if (idx >= 0) {
              const page = idx + 1
              setCurrent(page)
              currentRef.current = page
            }
          }
        }
      },
      { root: container, threshold: 0.5 }
    )

    document.querySelectorAll('.deck-page').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* Keyboard navigation — use ref to avoid stale closure */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const c = currentRef.current
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        goTo(c + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(c - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(1)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(totalPages)
      } else if (e.key >= '1' && e.key <= '9') {
        goTo(parseInt(e.key, 10))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, totalPages])

  return (
    <>
      <div className="hidden lg:flex print:hidden fixed right-4 top-1/2 z-50 -translate-y-1/2 flex-col items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            aria-label={`Go to page ${i + 1}`}
            className={`block rounded-full transition-all duration-200 cursor-pointer ${
              current === i + 1
                ? 'h-3 w-3 bg-orange'
                : 'h-1.5 w-1.5 bg-warm-white/20 hover:bg-warm-white/40'
            }`}
          />
        ))}
        <span className="mt-2 text-[0.55rem] font-mono font-bold tabular-nums text-warm-white/30">
          {String(current).padStart(2, '0')}/{String(totalPages).padStart(2, '0')}
        </span>
      </div>

      {/* Print button — icon-only, top-right, subtle */}
      <a
        href="/deck/granbury/print"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Print version"
        className="hidden lg:flex print:hidden fixed right-4 top-5 z-50 items-center justify-center h-8 w-8 rounded-full border border-warm-white/[0.08] bg-charcoal/60 text-warm-white/30 backdrop-blur-md transition-opacity duration-200 hover:text-warm-white/70 hover:border-warm-white/20"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
      </a>
    </>
  )
}
