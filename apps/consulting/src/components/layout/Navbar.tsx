'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'

const links = [
  { label: 'Why Journey', id: sectionIds.problem },
  { label: 'Services', id: sectionIds.solution },
  { label: 'Pricing', id: sectionIds.pricing },
  { label: 'FAQ', id: sectionIds.faq },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNav = useCallback((id: string) => {
    setMobileOpen(false)
    scrollToSection(id)
  }, [])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300 ease-out',
          scrolled
            ? 'bg-black/95 backdrop-blur-[12px] border-b border-white/[0.04]'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <nav className="mx-auto flex h-[64px] max-w-[var(--container-content)] items-center justify-between px-5 lg:h-[72px] lg:px-16" aria-label="Main navigation">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative block min-w-[140px] lg:min-w-[180px] cursor-pointer"
            aria-label="Scroll to top"
          >
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage™ logo"
              width={180}
              height={40}
              className="w-[140px] lg:w-[180px]"
              style={{ height: 'auto' }}
              priority
            />
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.id)}
                className="text-body-sm font-bold text-warm-white transition-opacity duration-150 hover:opacity-70 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNav(sectionIds.pricing)}
            className="hidden lg:inline-flex rounded-sm bg-orange px-5 py-2.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Get Started
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            className={[
              'lg:hidden cursor-pointer rounded-lg p-2 transition-all duration-300',
              scrolled
                ? 'text-warm-white'
                : 'text-warm-white bg-black/40 backdrop-blur-sm',
            ].join(' ')}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          {/* Subtle radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 0% 30%, rgba(232,98,42,0.06), transparent)' }}
          />

          {/* Header: logo + close */}
          <div className="relative z-10 flex h-[64px] items-center justify-between px-6">
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage™"
              width={140}
              height={32}
              style={{ height: 'auto' }}
            />
            <button
              onClick={() => setMobileOpen(false)}
              className="text-warm-white/60 hover:text-warm-white cursor-pointer transition-colors duration-150 rounded-lg p-1.5"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Links — left-aligned, numbered */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-8 -mt-8">
            <nav className="flex flex-col gap-1">
              {links.map((link, i) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.id)}
                  className="group flex items-baseline gap-3 py-2.5 cursor-pointer text-left"
                >
                  <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-orange/60 group-hover:text-orange transition-colors duration-150">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.7rem] font-black text-warm-white group-hover:text-orange transition-colors duration-150 leading-tight">
                    {link.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* CTA at bottom */}
          <div className="relative z-10 px-8 pb-8">
            <button
              onClick={() => { handleNav(sectionIds.pricing); setMobileOpen(false) }}
              className="block w-full rounded-sm bg-orange py-4 text-center text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  )
}
