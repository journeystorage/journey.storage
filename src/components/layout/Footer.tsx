'use client'

import { type FormEvent, useRef, useState } from 'react'
import Image from 'next/image'
import { externalUrls, socialUrls, facilities } from '@/lib/constants'
import { openSizeGuide } from '@/components/SizeGuideModal'

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconLinkedin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const socialLinks = [
  { label: 'Instagram', href: socialUrls.instagram, Icon: IconInstagram },
  { label: 'LinkedIn', href: socialUrls.linkedin, Icon: IconLinkedin },
  { label: 'Facebook', href: socialUrls.facebook, Icon: IconFacebook },
]

// Keyword links that open the size-guide modal. Real hrefs stay crawlable.
const storageTypes = ['Climate-controlled', 'Drive-up units', 'Indoor storage', 'Vehicle & RV', 'Business storage']
const exploreLinks = [
  { label: 'Rent a space', href: '/rentaspace' },
  { label: 'Size guide', href: '/?sizeguide', guide: true },
  { label: 'Move out', href: '/moveout' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
]

const headingClass = 'mb-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-warm-white/45'
const linkClass = 'block py-1.5 text-body-sm text-warm-white/55 transition-colors duration-200 hover:text-warm-white'

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
        body: JSON.stringify({ form_source: 'website-newsletter', email }),
      })
    } catch { /* non-blocking */ }
    setEmailSubmitted(true)
  }

  const openGuide = (e: React.MouseEvent) => { e.preventDefault(); openSizeGuide() }

  return (
    <footer className="border-t border-warm-white/[0.06] bg-black">
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* ── Brand moment + signup ── */}
        <div className="flex flex-col gap-10 border-b border-warm-white/[0.06] py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div className="max-w-md">
            <Image src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" width={150} height={34} className="w-[150px]" style={{ height: 'auto' }} />
            <h2 className="mt-7 text-[1.75rem] font-black leading-[1.05] tracking-tight text-warm-white md:text-[2.1rem]">
              Space to move on.
            </h2>
            <p className="mt-3 text-body-sm leading-relaxed text-warm-white/50">
              Month-to-month self storage in Granbury &amp; Hood County, Texas — all digital, 24/7 access, no hidden fees.
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            {emailSubmitted ? (
              <p className="text-body-sm text-warm-white/50">You&apos;re on the list — we&apos;ll be in touch.</p>
            ) : (
              <>
                <p className="mb-3 text-body-sm font-bold text-warm-white/80">Be first to know when we open near you.</p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    ref={emailRef} type="email" required placeholder="you@email.com" aria-label="Email"
                    className="min-w-0 flex-1 rounded-lg border border-warm-white/10 bg-warm-white/[0.04] px-4 py-3 text-body-sm text-warm-white placeholder:text-warm-white/25 transition-colors duration-150 focus:border-orange focus-visible:outline-none"
                  />
                  <button type="submit" className="shrink-0 rounded-lg bg-orange px-5 py-3 text-body-sm font-bold text-warm-white transition-all duration-200 hover:brightness-110 active:translate-y-px">
                    Notify me
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── Link columns ── */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 lg:grid-cols-4">
          {/* Locations */}
          <div>
            <h3 className={headingClass}>Locations</h3>
            <ul className="space-y-3">
              {facilities.map((f) => (
                <li key={f.slug} className="text-body-sm leading-snug">
                  <a href={`/rentaspace/${f.slug}`} className="font-bold text-warm-white/85 transition-colors duration-200 hover:text-orange">
                    {f.name}
                  </a>
                  <span className="mt-0.5 block text-warm-white/40">{f.street}, {f.city}, {f.region}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className={headingClass}>Explore</h3>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={link.guide ? openGuide : undefined} className={linkClass}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Storage */}
          <div>
            <h3 className={headingClass}>Storage</h3>
            <ul>
              {storageTypes.map((label) => (
                <li key={label}>
                  <a href="/?sizeguide" onClick={openGuide} className={linkClass}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h3 className={headingClass}>Ecosystem</h3>
            <ul className="space-y-3">
              <li className="text-body-sm leading-snug">
                <a href={externalUrls.managed} target="_blank" rel="noopener noreferrer" className="font-bold text-warm-white/85 transition-colors duration-200 hover:text-orange">Journey.Managed</a>
                <span className="mt-0.5 block text-warm-white/40">Facility management for owners</span>
              </li>
              <li className="text-body-sm leading-snug">
                <a href={externalUrls.investors} target="_blank" rel="noopener noreferrer" className="font-bold text-warm-white/85 transition-colors duration-200 hover:text-orange">Journey.Direct</a>
                <span className="mt-0.5 block text-warm-white/40">Invest in self storage</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-5 border-t border-warm-white/[0.06] py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="text-warm-white/35 transition-colors duration-200 hover:text-orange">
                <Icon />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-warm-white/35">
            <a href="/legal/privacy" className="transition-colors duration-200 hover:text-warm-white">Privacy</a>
            <a href="/legal/terms" className="transition-colors duration-200 hover:text-warm-white">Terms</a>
            <a href="/legal/disclaimer" className="transition-colors duration-200 hover:text-warm-white">Disclaimer</a>
            <span className="text-warm-white/25">&copy; {new Date().getFullYear()} Journey.Storage&trade;</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
