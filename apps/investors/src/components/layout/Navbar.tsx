'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { ecosystemDropdownLinks } from '@/lib/constants'

const sectionLinks = [
  { label: 'Market', href: '#market' },
  { label: 'Strategy', href: '#strategy' },
  { label: 'Team', href: '#team' },
  { label: 'Deals', href: '#opportunities' },
]

interface NavbarProps {
  onBookCall: () => void
  onContact?: () => void
  showNavLinks?: boolean
}

export default function Navbar({ onBookCall, onContact, showNavLinks = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileEcoOpen, setMobileEcoOpen] = useState(false)

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

  const handleLogoClick = useCallback(() => {
    setMobileOpen(false)
    window.location.href = 'https://journey.storage'
  }, [])

  const handleContact = useCallback(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
    ;(onContact ?? onBookCall)()
  }, [onContact, onBookCall])

  const handleNavClick = useCallback(() => {
    setMobileOpen(false)
  }, [])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-[background-color,border-color,backdrop-filter] duration-300 ease-out',
          scrolled
            ? 'bg-black/95 backdrop-blur-[12px] border-b border-white/[0.04]'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <nav
          className="mx-auto flex h-[64px] max-w-[var(--container-content)] items-center justify-between px-5 lg:h-[72px] lg:px-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="relative block min-w-[140px] lg:min-w-[180px] cursor-pointer"
            aria-label="Scroll to top"
          >
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage logo"
              width={180}
              height={40}
              className="w-[140px] lg:w-[180px]"
              style={{ height: 'auto' }}
              priority
            />
          </button>

          {/* Desktop: section links + ecosystem + CTA */}
          <div className="hidden lg:flex items-center gap-7">
            {/* Section links */}
            {showNavLinks && sectionLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-body-sm font-bold text-warm-white/60 hover:text-warm-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}

            {showNavLinks && (
              <div className="h-5 w-px bg-warm-white/[0.10]" />
            )}

            {/* Ecosystem dropdown */}
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
                Ecosystem
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 pt-2 min-w-[260px]">
                  <div
                    className="rounded-xl border border-warm-white/[0.08] bg-black/95 backdrop-blur-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                    role="menu"
                  >
                    {ecosystemDropdownLinks.map((link) => {
                      const isCurrent = 'current' in link && link.current
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          rel="noopener noreferrer"
                          role="menuitem"
                          aria-current={isCurrent ? 'page' : undefined}
                          className={[
                            'flex items-start justify-between gap-3 rounded-lg px-4 py-3 transition-colors duration-150 group',
                            isCurrent ? 'bg-orange/[0.08]' : 'hover:bg-warm-white/[0.06]',
                          ].join(' ')}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className={[
                              'text-body-sm font-bold transition-colors duration-150',
                              isCurrent ? 'text-orange' : 'text-warm-white/80 group-hover:text-warm-white',
                            ].join(' ')}>
                              {link.label}
                            </span>
                            <span className={[
                              'text-[0.7rem] transition-colors duration-150',
                              isCurrent ? 'text-orange/60' : 'text-warm-white/30 group-hover:text-warm-white/50',
                            ].join(' ')}>
                              {link.description}
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-orange">Here</span>
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleContact}
              className="rounded-sm bg-orange px-5 py-2.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Invest Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={[
              'lg:hidden cursor-pointer rounded-lg p-2 transition-colors duration-300',
              scrolled ? 'text-warm-white' : 'text-warm-white bg-black/40 backdrop-blur-sm',
            ].join(' ')}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 0% 30%, rgba(232,98,42,0.06), transparent)' }}
          />

          {/* Header */}
          <div className="relative z-10 flex h-[64px] items-center justify-between px-6">
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage"
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

          {/* Body */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-8 -mt-8">
            {/* Section links */}
            {showNavLinks && (
              <div className="flex flex-col gap-4 mb-8">
                {sectionLinks.map((link, i) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className="group flex items-baseline gap-3"
                  >
                    <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-orange/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[1.5rem] font-black text-warm-white group-hover:text-orange transition-colors duration-150 leading-tight">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Ecosystem accordion */}
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-orange/60">
                {showNavLinks ? '05' : '01'}
              </span>
              <button
                onClick={() => setMobileEcoOpen((v) => !v)}
                className="group flex items-center gap-2.5 cursor-pointer"
              >
                <span className="text-[1.5rem] font-black text-warm-white group-hover:text-orange transition-colors duration-150 leading-tight">
                  Ecosystem
                </span>
                <ChevronDown
                  size={18}
                  className={`text-warm-white/40 transition-transform duration-200 ${mobileEcoOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            {mobileEcoOpen && (
              <div className="ml-[1.85rem] flex flex-col gap-3 pt-1 pb-2">
                {ecosystemDropdownLinks.map((link) => {
                  const isCurrent = 'current' in link && link.current
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={isCurrent ? undefined : '_blank'}
                      rel={isCurrent ? undefined : 'noopener noreferrer'}
                      aria-current={isCurrent ? 'page' : undefined}
                      className="group/sub flex flex-col gap-0.5"
                    >
                      <span className={[
                        'text-base font-bold transition-colors duration-150',
                        isCurrent ? 'text-orange' : 'text-warm-white/50 group-hover/sub:text-warm-white',
                      ].join(' ')}>
                        {link.label}
                        {isCurrent && (
                          <span className="ml-2 text-[0.55rem] uppercase tracking-[0.18em] text-orange/70">&middot; Here</span>
                        )}
                      </span>
                      <span className={[
                        'text-[0.7rem] transition-colors duration-150',
                        isCurrent ? 'text-orange/50' : 'text-warm-white/25 group-hover/sub:text-warm-white/40',
                      ].join(' ')}>
                        {link.description}
                      </span>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* CTA at bottom */}
          <div className="relative z-10 px-8 pb-8">
            <button
              onClick={handleContact}
              className="block w-full rounded-sm bg-orange py-4 text-center text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Invest Now
            </button>
          </div>
        </div>
      )}
    </>
  )
}
