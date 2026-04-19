'use client'

import { useEffect } from 'react'

export default function PrintTrigger() {
  useEffect(() => {
    // Wait for images to load, then auto-trigger print dialog
    const timer = setTimeout(() => {
      window.print()
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Back button — returns to interactive deck after print
  return (
    <div className="fixed top-4 left-4 z-[9999] print:hidden">
      <a
        href="/deck/granbury"
        className="inline-flex items-center gap-2 rounded-lg border border-deck-text/[0.08] bg-deck-surface/80 backdrop-blur-sm px-3 py-1.5 text-[0.75rem] font-bold text-deck-text/50 transition-colors hover:text-deck-text/80 hover:border-deck-text/20"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to deck
      </a>
    </div>
  )
}
