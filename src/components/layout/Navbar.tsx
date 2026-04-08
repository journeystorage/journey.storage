'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { navLinks, ecosystemDropdownLinks, sectionIds } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileEcoOpen, setMobileEcoOpen] = useState(false)

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
      if (isHome) {
        scrollToSection(id)
      } else {
        router.push(`/#${id}`)
      }
    },
    [isHome, router],
  )

  const handleLogoClick = useCallback(() => {
    setMobileOpen(false)
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
  }, [isHome, router])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300 ease-out',
          scrolled || !isHome
            ? isHome
              ? 'bg-black/95 backdrop-blur-[12px] border-b border-white/[0.04]'
              : 'bg-warm-white border-b border-black/[0.06]'
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
              src={isHome ? '/images/brand/logo-white-TM.svg' : '/images/brand/logo-dark-TM.svg'}
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
                className={`text-body-sm font-bold transition-opacity duration-150 hover:opacity-70 cursor-pointer ${isHome ? 'text-warm-white' : 'text-black'}`}
              >
                {link.label}
              </button>
            ))}

            {/* Blog — Phase 2 */}
            <span
              className={`text-body-sm font-bold cursor-default ${isHome ? 'text-warm-white/40' : 'text-black/30'}`}
              title="Coming soon"
            >
              Blog
            </span>

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
                className={`flex items-center gap-1 text-body-sm font-bold transition-opacity duration-150 hover:opacity-70 cursor-pointer ${isHome ? 'text-warm-white' : 'text-black'}`}
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
                        target={isCurrent ? undefined : '_blank'}
                        rel={isCurrent ? undefined : 'noopener noreferrer'}
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
            className={[
              'lg:hidden cursor-pointer rounded-lg p-2 transition-all duration-300',
              isHome
                ? scrolled
                  ? 'text-warm-white'
                  : 'text-warm-white bg-black/40 backdrop-blur-sm'
                : 'text-black',
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

          {/* Links — left-aligned, numbered */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-8 -mt-8">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <button
                  key={link.label}
                  onClick={() => handleAnchor(link.href.replace('#', ''))}
                  className="group flex items-baseline gap-3 py-2.5 cursor-pointer text-left"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-orange/60 group-hover:text-orange transition-colors duration-150">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.7rem] font-black text-warm-white group-hover:text-orange transition-colors duration-150 leading-tight">
                    {link.label}
                  </span>
                </button>
              ))}

              {/* Blog — disabled */}
              <div className="flex items-baseline gap-3 py-2.5">
                <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-warm-white/15">
                  {String(navLinks.length + 1).padStart(2, '0')}
                </span>
                <span className="text-[1.7rem] font-black text-warm-white/20 leading-tight" title="Coming soon">
                  Blog
                </span>
              </div>

              {/* Separator */}
              <div className="my-2 h-px w-12 bg-warm-white/10" />

              {/* Ecosystem accordion */}
              <div>
                <button
                  onClick={() => setMobileEcoOpen((v) => !v)}
                  className="group flex items-center gap-2.5 py-2.5 cursor-pointer"
                >
                  <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.2em] text-orange/60">
                    {String(navLinks.length + 2).padStart(2, '0')}
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
                          target={isCurrent ? undefined : '_blank'}
                          rel={isCurrent ? undefined : 'noopener noreferrer'}
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
