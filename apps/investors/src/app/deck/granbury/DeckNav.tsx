'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

const STORAGE_KEY = 'deck-theme'

function ToolPill() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [dlState, setDlState] = useState<'idle' | 'loading' | 'done'>('idle')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null
    if (stored === 'light') setTheme('light')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    const root = document.querySelector('.deck-root')
    if (root) {
      if (next === 'light') root.setAttribute('data-theme', 'light')
      else root.removeAttribute('data-theme')
    }
  }

  const handleDownload = async () => {
    if (dlState === 'loading') return
    setDlState('loading')
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ])

      const t = document.querySelector('.deck-root')?.getAttribute('data-theme') || 'dark'

      // Load print layout in a hidden iframe
      const iframe = document.createElement('iframe')
      iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:1123px;height:794px;border:none;'
      document.body.appendChild(iframe)

      await new Promise<void>((resolve, reject) => {
        iframe.onload = () => resolve()
        iframe.onerror = () => reject(new Error('iframe load failed'))
        iframe.src = `/deck/granbury?mode=print&theme=${t}`
      })

      // Wait for images/fonts to settle
      const iframeDoc = iframe.contentDocument!
      const images = Array.from(iframeDoc.querySelectorAll('img'))
      await Promise.all(
        images.map(img =>
          img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r })
        )
      )
      await new Promise(r => setTimeout(r, 1500))

      const pages = Array.from(iframeDoc.querySelectorAll('.deck-print-page'))
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          windowWidth: 1123,
          windowHeight: 794,
        })

        const imgData = canvas.toDataURL('image/jpeg', 0.75)

        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210)
      }

      document.body.removeChild(iframe)

      const today = new Date().toISOString().slice(0, 10)
      pdf.save(`Journey.Direct_Granbury_Deck_${today}.pdf`)

      setDlState('done')
      setTimeout(() => setDlState('idle'), 3000)
    } catch (err) {
      console.error('PDF generation failed:', err)
      setDlState('idle')
    }
  }

  return (
    <div className="hidden lg:flex print:hidden fixed right-4 top-5 z-50 items-center rounded-full border border-deck-text/[0.08] bg-deck-surface/50 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className="flex items-center justify-center h-8 w-8 rounded-full text-deck-text/40 hover:text-deck-text/80 transition-colors duration-200 cursor-pointer"
      >
        {theme === 'dark' ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-4 bg-deck-text/[0.08]" />

      {/* Download PDF */}
      <button
        onClick={handleDownload}
        disabled={dlState === 'loading'}
        aria-label={dlState === 'loading' ? 'Generating PDF...' : 'Download PDF'}
        className={`flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
          dlState === 'loading'
            ? 'h-8 px-3 gap-2 text-orange'
            : dlState === 'done'
            ? 'h-8 w-8 text-green-500'
            : 'h-8 w-8 text-deck-text/40 hover:text-deck-text/80'
        }`}
      >
        {dlState === 'loading' ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.08em]">PDF</span>
          </>
        ) : dlState === 'done' ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
      </button>
    </div>
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
      <div className="hidden lg:flex print:hidden fixed right-4 top-1/2 z-50 -translate-y-1/2 flex-col items-center gap-1.5 rounded-full border border-deck-text/[0.08] bg-deck-surface/50 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] py-2 px-1.5">
        {/* Chevron up */}
        <button
          onClick={() => goTo(current - 1)}
          aria-label="Previous page"
          className={`cursor-pointer transition-opacity duration-200 ${current <= 1 ? 'opacity-0 pointer-events-none' : 'opacity-40 hover:opacity-80'}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-deck-text"><polyline points="18 15 12 9 6 15" /></svg>
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            aria-label={`Go to page ${i + 1}`}
            className={`block rounded-full transition-all duration-200 cursor-pointer ${
              current === i + 1
                ? 'h-2.5 w-2.5 bg-orange'
                : 'h-1.5 w-1.5 bg-deck-text/20 hover:bg-deck-text/40'
            }`}
          />
        ))}

        {/* Chevron down */}
        <button
          onClick={() => goTo(current + 1)}
          aria-label="Next page"
          className={`cursor-pointer transition-opacity duration-200 ${current >= totalPages ? 'opacity-0 pointer-events-none' : 'opacity-40 hover:opacity-80'}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-deck-text"><polyline points="6 9 12 15 18 9" /></svg>
        </button>

        <div className="w-3 h-px bg-deck-text/[0.08]" />

        <span className="text-[0.5rem] font-mono font-bold tabular-nums text-deck-text/35">
          {String(current).padStart(2, '0')}
        </span>
      </div>

      {/* Tool pill — theme toggle + PDF download */}
      <ToolPill />
    </>
  )
}
