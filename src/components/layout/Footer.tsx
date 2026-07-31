'use client'

import { type FormEvent, useRef, useState } from 'react'
import Image from 'next/image'
import { externalUrls, socialUrls, facilities } from '@/lib/constants'
import { openSizeGuide } from '@/components/SizeGuideModal'
import Button from '@/components/ui/Button'

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

const socialLinks = [
  { label: 'Instagram', href: socialUrls.instagram, Icon: IconInstagram },
  { label: 'LinkedIn', href: socialUrls.linkedin, Icon: IconLinkedin },
  { label: 'Facebook', href: socialUrls.facebook, Icon: IconFacebook },
]

// Keyword links that open the shared size-guide modal. Real hrefs keep them
// crawlable; onClick opens the box in place.
const storageTypes = [
  'Climate-controlled storage',
  'Drive-up storage',
  'Indoor storage',
  'Vehicle & RV storage',
  'Business storage',
  '24/7 access storage',
]

const companyLinks = [
  { label: 'About Journey', href: '/#about' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Rent a space', href: '/rentaspace' },
  { label: 'Move out', href: '/moveout' },
  { label: 'FAQ', href: '/#faq' },
]

const linkClass =
  'block py-1.5 text-body-sm text-warm-white/35 transition-colors duration-200 hover:text-warm-white'
const headingClass =
  'mb-4 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50'

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
    <footer className="relative border-t border-warm-white/[0.04] bg-black pt-20 pb-10">
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™ logo" width={140} height={32} className="w-[140px]" style={{ height: 'auto' }} />
            <p className="mt-3 text-body-sm font-light italic text-warm-white/30">Space to move on.</p>
            <p className="mt-4 max-w-[280px] text-body-sm leading-relaxed text-warm-white/40">
              Clean, secure, month-to-month self storage in Granbury &amp; Hood County, Texas. 100% digital, 24/7 access.
            </p>
            <a href="mailto:hello@journey.storage" className="mt-4 block text-body-sm text-warm-white/40 transition-colors duration-200 hover:text-orange">
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

          {/* Locations */}
          <div>
            <h3 className={headingClass}>Locations</h3>
            <ul className="space-y-3">
              {facilities.map((f) => (
                <li key={f.slug} className="text-body-sm leading-tight">
                  <a href={`/rentaspace/${f.slug}`} className="font-bold text-warm-white/70 transition-colors duration-200 hover:text-orange">
                    {f.name}
                  </a>
                  <br />
                  <span className="text-warm-white/30">{f.street}, {f.city}, {f.region} {f.zip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Storage options */}
          <div>
            <h3 className={headingClass}>Storage options</h3>
            <ul>
              {storageTypes.map((label) => (
                <li key={label}>
                  <a href="/?sizeguide" onClick={openGuide} className={linkClass}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className={headingClass}>Company</h3>
            <ul>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>{link.label}</a>
                </li>
              ))}
              <li>
                <a href="/?sizeguide" onClick={openGuide} className={linkClass}>Size guide</a>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h3 className={headingClass}>Ecosystem</h3>
            <ul>
              <li><a href={externalUrls.managed} target="_blank" rel="noopener noreferrer" className={linkClass}>Managed — facility management</a></li>
              <li><a href={externalUrls.investors} target="_blank" rel="noopener noreferrer" className={linkClass}>Direct — storage investing</a></li>
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
              <Button type="submit" variant="secondary" onDark className="!py-2.5 !px-5 !text-body-sm">
                Subscribe
              </Button>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-warm-white/[0.04] pt-6 sm:flex-row">
          <p className="text-caption text-warm-white/20 order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Journey.Storage&trade;. All rights reserved.
          </p>
          <nav aria-label="Legal" className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:order-2">
            <a href="/legal/privacy" className="text-caption text-warm-white/30 transition-colors duration-200 hover:text-warm-white">Privacy</a>
            <a href="/legal/terms" className="text-caption text-warm-white/30 transition-colors duration-200 hover:text-warm-white">Terms</a>
            <a href="/legal/disclaimer" className="text-caption text-warm-white/30 transition-colors duration-200 hover:text-warm-white">Disclaimer</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
