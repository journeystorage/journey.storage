'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

function DownloadButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleDownload = async () => {
    if (state === 'loading') return
    setState('loading')
    try {
      const res = await fetch('/api/deck/pdf')
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const today = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `Journey.Direct_Granbury_Deck_${today}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setState('done')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      // API unavailable (production) — fallback to print mode page
      window.open('/deck/granbury?mode=print', '_blank')
      setState('idle')
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={state === 'loading'}
      aria-label={state === 'loading' ? 'Generating PDF...' : 'Download PDF'}
      className={`hidden lg:flex print:hidden fixed right-4 top-5 z-50 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer ${
        state === 'loading'
          ? 'h-8 w-auto px-3 gap-2 border-orange/30 bg-orange/10 text-orange'
          : state === 'done'
          ? 'h-8 w-8 border-green-500/30 bg-green-500/10 text-green-400'
          : 'h-8 w-8 border-warm-white/[0.08] bg-charcoal/60 text-warm-white/30 hover:text-warm-white/70 hover:border-warm-white/20'
      }`}
    >
      {state === 'loading' ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em]">Generating...</span>
        </>
      ) : state === 'done' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
    </button>
  )
}

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
        {/* Chevron up */}
        <button
          onClick={() => goTo(current - 1)}
          aria-label="Previous page"
          className={`mb-1 cursor-pointer transition-opacity duration-200 ${current <= 1 ? 'opacity-0 pointer-events-none' : 'opacity-30 hover:opacity-70'}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-warm-white"><polyline points="18 15 12 9 6 15" /></svg>
        </button>

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

        {/* Chevron down */}
        <button
          onClick={() => goTo(current + 1)}
          aria-label="Next page"
          className={`mt-1 cursor-pointer transition-opacity duration-200 ${current >= totalPages ? 'opacity-0 pointer-events-none' : 'opacity-30 hover:opacity-70'}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-warm-white"><polyline points="6 9 12 15 18 9" /></svg>
        </button>

        <span className="mt-1.5 text-[0.55rem] font-mono font-bold tabular-nums text-warm-white/30">
          {String(current).padStart(2, '0')}/{String(totalPages).padStart(2, '0')}
        </span>
      </div>

      {/* Download PDF button — with loading state */}
      <DownloadButton />
    </>
  )
}
