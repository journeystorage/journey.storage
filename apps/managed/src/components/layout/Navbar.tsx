'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { navLinks, ecosystemDropdownLinks } from '@/lib/constants'

/* Subdomain navbar — managed.journey.storage is a single dark-hero page, so
   this is the home/darkHero treatment from the main site: transparent over the
   hero, solid black once scrolled. All nav links are absolute URLs that leave
   the subdomain; the CTA anchors to the on-page review form. */
export default function Navbar() {
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
          {/* ── Logo → main site ── */}
          <a href="https://journey.storage" className="relative block min-w-[140px] lg:min-w-[180px]" aria-label="Journey.Storage home">
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage™ logo"
              width={180}
              height={40}
              className="w-[140px] lg:w-[180px]"
              style={{ height: 'auto' }}
              priority
            />
          </a>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-body-sm font-bold text-warm-white transition-opacity duration-150 hover:opacity-70"
              >
                {link.label}
              </a>
            ))}

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
                            <span
                              className={[
                                'text-body-sm font-bold transition-colors duration-150',
                                isCurrent
                                  ? 'text-orange'
                                  : 'text-warm-white/80 group-hover:text-warm-white',
                              ].join(' ')}
                            >
                              {link.label}
                            </span>
                            <span
                              className={[
                                'text-[0.7rem] transition-colors duration-150',
                                isCurrent
                                  ? 'text-orange/60'
                                  : 'text-warm-white/30 group-hover:text-warm-white/50',
                              ].join(' ')}
                            >
                              {link.description}
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-orange">
                              Here
                            </span>
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Desktop CTA → review form ── */}
          <div className="hidden lg:block">
            <a
              href="#managed-contact"
              className="inline-flex items-center justify-center rounded-sm bg-orange px-6 py-3 text-body-sm font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Free Facility Review
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen(true)}
            className={[
              'lg:hidden cursor-pointer rounded-lg p-2 transition-all duration-300',
              scrolled ? 'text-warm-white' : 'text-warm-white bg-black/40 backdrop-blur-sm',
            ].join(' ')}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
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

          <div className="relative z-10 flex h-[64px] items-center justify-between px-6">
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage™"
              width={130}
              height={30}
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

          <div className="relative z-10 flex flex-1 flex-col justify-center px-8 -mt-8">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-baseline gap-3 py-2.5 text-left"
                >
                  <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-orange/60 group-hover:text-orange transition-colors duration-150">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.7rem] font-black text-warm-white group-hover:text-orange transition-colors duration-150 leading-tight">
                    {link.label}
                  </span>
                </a>
              ))}

              <div className="my-2 h-px w-12 bg-warm-white/10" />

              {/* Ecosystem accordion */}
              <div>
                <button
                  onClick={() => setMobileEcoOpen((v) => !v)}
                  className="group flex items-center gap-2.5 py-2.5 cursor-pointer"
                >
                  <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-orange/60">
                    {String(navLinks.length + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.7rem] font-black text-warm-white group-hover:text-orange transition-colors duration-150 leading-tight">
                    Ecosystem
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-warm-white/40 transition-transform duration-200 ${mobileEcoOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileEcoOpen && (
                  <div className="ml-[1.85rem] flex flex-col gap-3 pt-1 pb-2">
                    {ecosystemDropdownLinks.map((link) => {
                      const isCurrent = 'current' in link && link.current
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          aria-current={isCurrent ? 'page' : undefined}
                          className="group/sub flex flex-col gap-0.5"
                        >
                          <span
                            className={[
                              'text-base font-bold transition-colors duration-150',
                              isCurrent
                                ? 'text-orange'
                                : 'text-warm-white/50 group-hover/sub:text-warm-white',
                            ].join(' ')}
                          >
                            {link.label}
                            {isCurrent && (
                              <span className="ml-2 text-[0.55rem] uppercase tracking-[0.18em] text-orange/70">
                                · Here
                              </span>
                            )}
                          </span>
                          <span
                            className={[
                              'text-[0.7rem] transition-colors duration-150',
                              isCurrent
                                ? 'text-orange/50'
                                : 'text-warm-white/25 group-hover/sub:text-warm-white/40',
                            ].join(' ')}
                          >
                            {link.description}
                          </span>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* CTA at bottom */}
          <div className="relative z-10 px-8 pb-8">
            <a
              href="#managed-contact"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center rounded-sm bg-orange px-6 py-4 text-body-sm font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)]"
            >
              Free Facility Review
            </a>
          </div>
        </div>
      )}
    </>
  )
}
