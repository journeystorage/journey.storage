'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { navLinks, businessDropdownLinks, sectionIds } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // ── Scroll listener ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Lock body when mobile menu is open ──
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleAnchor = useCallback(
    (id: string) => {
      setMobileOpen(false)
      setDropdownOpen(false)
      scrollToSection(id)
    },
    [],
  )

  const handleLogoClick = useCallback(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <nav
          className="mx-auto flex h-[64px] max-w-content items-center justify-between px-5 lg:h-[72px] lg:px-16"
          aria-label="Main navigation"
        >
          {/* ── Logo ── */}
          <button
            onClick={handleLogoClick}
            className="relative block min-w-[140px] lg:min-w-[180px] cursor-pointer"
            aria-label="Scroll to top"
          >
            <Image
              src="/images/brand/logo-white.svg"
              alt="Journey.Storage™ logo"
              width={180}
              height={40}
              className="w-[140px] lg:w-[180px]"
              style={{ height: 'auto' }}
              priority
            />
          </button>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href.replace('#', ''))}
                className="text-body-sm font-bold text-warm-white transition-opacity duration-150 hover:opacity-70 cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            {/* Blog — Phase 2 */}
            <span
              className="text-body-sm font-bold text-warm-white/40 cursor-default"
              title="Coming soon"
            >
              Blog
            </span>

            {/* Business dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-body-sm font-bold text-warm-white transition-opacity duration-150 hover:opacity-70 cursor-pointer"
              >
                Business
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 pt-2 min-w-[200px]">
                <div
                  className="rounded-xl border border-warm-white/[0.08] bg-black/95 backdrop-blur-xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                  role="menu"
                >
                  {businessDropdownLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-body-sm font-bold text-warm-white/70 transition-colors duration-150 hover:bg-warm-white/[0.06] hover:text-warm-white"
                    >
                      {link.label}
                      <span className="text-warm-white/20 text-xs">&rarr;</span>
                    </a>
                  ))}
                </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:block">
            <Button
              variant="primary"
              onClick={() => handleAnchor(sectionIds.waitlist)}
              className="!py-3 !px-6"
            >
              Join the waitlist
            </Button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-warm-white cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-black animate-[fadeIn_300ms_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Close button */}
          <div className="flex h-[64px] items-center justify-end px-5">
            <button
              onClick={() => setMobileOpen(false)}
              className="text-warm-white cursor-pointer"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href.replace('#', ''))}
                className="text-h3 font-bold text-warm-white cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            <span
              className="text-h3 font-bold text-warm-white/40 cursor-default"
              title="Coming soon"
            >
              Blog
            </span>

            {/* Business links inline */}
            {businessDropdownLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-h3 font-bold text-warm-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA at bottom */}
          <div className="px-5 pb-8">
            <Button
              variant="primary"
              onClick={() => handleAnchor(sectionIds.waitlist)}
              className="w-full"
            >
              Join the waitlist
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
