'use client'

import { type FormEvent, useRef, useState } from 'react'
import Image from 'next/image'
import { externalUrls, socialUrls } from '@/lib/constants'

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconLinkedin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

/* Explore links are in-page anchors (owner-focused); ecosystem links are
   absolute and leave the subdomain. */
const exploreLinks = [
  { label: 'How it works', href: '#managed-model' },
  { label: 'Pricing', href: '#managed-pricing' },
  { label: 'Leadership', href: '#managed-leadership' },
  { label: 'Free facility review', href: '#managed-contact' },
]
const ecosystemLinks = [
  { label: 'Storage', href: externalUrls.mainSite },
  { label: 'Investing', href: externalUrls.investors },
]
// Keyword anchors → the "what's included" model section.
const serviceLinks = [
  { label: 'Revenue management', href: '#managed-model' },
  { label: 'Marketing & occupancy', href: '#managed-model' },
  { label: 'Smart access & tech', href: '#managed-model' },
  { label: 'Reporting & reconciliation', href: '#managed-model' },
  { label: 'Facility operations', href: '#managed-model' },
]
const legalLinks = [
  { label: 'Privacy', href: 'https://journey.storage/legal/privacy' },
  { label: 'Terms', href: 'https://journey.storage/legal/terms' },
]
const socialLinks = [
  { label: 'Instagram', href: socialUrls.instagram, Icon: IconInstagram },
  { label: 'LinkedIn', href: socialUrls.linkedin, Icon: IconLinkedin },
  { label: 'Facebook', href: socialUrls.facebook, Icon: IconFacebook },
]

export default function Footer() {
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value
    if (!email) return
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_source: 'managed-newsletter', email }),
      })
    } catch { /* non-blocking */ }
    setEmailSubmitted(true)
  }

  return (
    <footer className="relative border-t border-warm-white/[0.04] bg-black pt-20 pb-10">
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 */}
          <div>
            <Image src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™ logo" width={140} height={32} className="w-[140px]" style={{ height: 'auto' }} />
            <p className="mt-3 text-body-sm font-light italic text-warm-white/30">
              We run storage for a living.
            </p>
            <p className="mt-4 max-w-[280px] text-body-sm leading-relaxed text-warm-white/40">
              Third-party self-storage management for facility owners — one flat fee, everything included. Managing facilities across Texas.
            </p>
            <a
              href="mailto:hello@journey.storage"
              className="mt-4 block text-body-sm text-warm-white/40 transition-colors duration-200 hover:text-orange"
            >
              hello@journey.storage
            </a>
            <div className="mt-5 flex gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-warm-white/25 transition-colors duration-200 hover:text-orange">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Company */}
          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50 mb-4">Explore</h3>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}
                    className="block py-1.5 text-body-sm text-warm-white/30 transition-colors duration-200 hover:text-warm-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — What we do */}
          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50 mb-4">What we do</h3>
            <ul>
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}
                    className="block py-1.5 text-body-sm text-warm-white/30 transition-colors duration-200 hover:text-warm-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Ecosystem */}
          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50 mb-4">Ecosystem</h3>
            <ul>
              {ecosystemLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="block py-1.5 text-body-sm text-warm-white/30 transition-colors duration-200 hover:text-warm-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-10 border-warm-white/[0.04]" />

        {/* Email capture */}
        <div className="mx-auto max-w-[440px]">
          {emailSubmitted ? (
            <p className="text-center text-body-sm text-warm-white/30">
              You&apos;re subscribed. Welcome to the journey.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="shrink-0 text-body-sm text-warm-white/40">Stay in the loop.</p>
              <input
                ref={emailRef} type="email" required placeholder="you@email.com" aria-label="Email for newsletter"
                className="flex-1 rounded-sm bg-warm-white/[0.04] px-4 py-2.5 text-body-sm text-warm-white placeholder:text-warm-white/20 border border-warm-white/[0.06] focus:border-orange focus-visible:outline-none transition-colors duration-150"
              />
              <button
                type="submit"
                className="rounded-sm border border-warm-white/20 px-5 py-2.5 text-body-sm font-bold text-warm-white transition-colors duration-150 hover:border-orange hover:text-orange cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-warm-white/[0.04] pt-6 sm:flex-row">
          <p className="text-caption text-warm-white/20 order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Journey.Storage&trade;. All rights reserved.
          </p>
          <nav aria-label="Legal" className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:order-2">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="text-caption text-warm-white/30 transition-colors duration-200 hover:text-warm-white">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
