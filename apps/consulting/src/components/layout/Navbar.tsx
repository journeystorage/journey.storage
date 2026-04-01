'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { CALENDAR_URL, sectionIds } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'

const links = [
  { label: 'How it works', id: sectionIds.howItWorks },
  { label: 'Pricing', id: sectionIds.pricing },
  { label: 'About', id: sectionIds.founder },
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
            className="relative block cursor-pointer"
            aria-label="Scroll to top"
          >
            <Image
              src="/images/brand/logo-white.svg"
              alt="Journey.Storage™ logo"
              width={160}
              height={36}
              className="w-[120px] lg:w-[160px]"
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

            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-orange px-5 py-2.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              Schedule a call
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-warm-white cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black animate-[fadeIn_300ms_ease-out]" role="dialog" aria-modal="true">
          <div className="flex h-[64px] items-center justify-end px-5">
            <button onClick={() => setMobileOpen(false)} className="text-warm-white cursor-pointer" aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.id)}
                className="text-2xl font-bold text-warm-white cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="px-5 pb-8">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-sm bg-orange py-4 text-center text-body-sm font-bold text-warm-white"
            >
              Schedule a call
            </a>
          </div>
        </div>
      )}
    </>
  )
}
