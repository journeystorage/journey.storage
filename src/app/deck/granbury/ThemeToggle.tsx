'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'deck-theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null
    if (stored === 'light') setTheme('light')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    const root = document.querySelector('.deck-root')
    if (root) {
      if (next === 'light') {
        root.setAttribute('data-theme', 'light')
      } else {
        root.removeAttribute('data-theme')
      }
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="hidden lg:flex print:hidden fixed right-4 top-14 z-50 items-center justify-center rounded-full border backdrop-blur-md cursor-pointer h-8 w-8 border-deck-text/[0.08] bg-deck-surface/60 text-deck-text/30 hover:text-deck-text/70 hover:border-deck-text/20 transition-colors duration-300"
    >
      {theme === 'dark' ? (
        /* Sun icon — click to go light */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        /* Moon icon — click to go dark */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
