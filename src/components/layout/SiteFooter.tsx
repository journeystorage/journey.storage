'use client'

import { type FormEvent, useRef, useState } from 'react'
import { facilities, PHONE, externalUrls, socialUrls } from '@/lib/constants'
import { SizeGuideLink } from '@/components/SizeGuideModal'

/*
 * Site footer — the SEO footer from mockups/seo-footer.html, built for the
 * three-level site (brand → locations index → facility).
 *
 * Rules it follows:
 *  - Linked columns, never a keyword paragraph. Each anchor is one search
 *    phrase pointing at the page that owns it. Types go to the locations hub
 *    so the renter picks a location first.
 *  - NAP (name, address, phone) per facility in an <address>, from the same
 *    `facilities` constant the schema uses. Must match Google Business Profile.
 *  - 20 crawlable links + the size-guide button. Stay under 25.
 *  - Markets without a page (Malakoff) are text, not links: no 404s.
 */

const storageTypes = [
  { label: 'Climate-controlled storage', href: '/rentaspace' },
  { label: 'Drive-up storage units', href: '/rentaspace' },
  { label: 'Small storage units', sub: '5×5 · 5×10', href: '/rentaspace#sizes' },
  { label: 'Large storage units', sub: '10×20 · 10×30', href: '/rentaspace#sizes' },
  { label: 'Business & contractor storage', href: '/rentaspace#business' },
]

const locationLinks = [
  { label: 'Storage units in Granbury, TX', href: '/rentaspace' },
  { label: 'Storage near Lake Granbury', href: '/rentaspace/westernhillstrl' },
  { label: 'Near Acton, Tolar, Cresson & Glen Rose', href: '/rentaspace#faq' },
]

const resourceLinks = [
  { label: 'Smart entry & 24/7 access', href: '/smartentry' },
  { label: 'Move-out request', href: '/moveout' },
  { label: 'About Journey', href: '/#about' },
  { label: 'Journey.Managed', href: externalUrls.managed },
  { label: 'Journey.Direct', href: externalUrls.investors },
]

const IgIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const FbIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const InIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
const linkCls = `block py-1 text-[0.9375rem] leading-snug text-warm-white/60 transition-colors duration-200 hover:text-warm-white ${focus}`
const headCls = 'text-[0.6875rem] font-extrabold uppercase tracking-[0.16em] text-stone'

function Newsletter() {
  const [done, setDone] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  const subscribe = async (e: FormEvent) => {
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
    setDone(true)
  }

  if (done) return <p className="text-[0.875rem] text-warm-white/60">You&rsquo;re subscribed. Welcome to the journey.</p>
  return (
    <form onSubmit={subscribe} className="flex max-w-[320px] items-end gap-3 border-b border-warm-white/20 pb-2 transition-colors duration-200 focus-within:border-warm-white/60">
      <input
        ref={emailRef}
        id="footer-newsletter-email"
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email for newsletter"
        className="min-w-0 flex-1 bg-transparent text-[0.9375rem] text-warm-white placeholder:text-warm-white/30 focus-visible:outline-none"
      />
      <button type="submit" className={`shrink-0 text-[0.6875rem] font-extrabold uppercase tracking-[0.16em] text-warm-white/70 transition-colors duration-200 hover:text-orange active:text-warm-white ${focus}`}>
        Subscribe
      </button>
    </form>
  )
}

export default function SiteFooter() {
  const socials = [
    { Icon: IgIcon, href: socialUrls.instagram, label: 'Instagram' },
    { Icon: FbIcon, href: socialUrls.facebook, label: 'Facebook' },
    { Icon: InIcon, href: socialUrls.linkedin, label: 'LinkedIn' },
  ]

  return (
    <footer aria-label="Site footer" className="relative overflow-hidden border-t-[5px] border-orange bg-black pb-8 pt-14 text-warm-white lg:pt-16">
      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">

        {/* Row 1 — brand + linked columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          <div className="md:col-span-3 lg:col-span-1">
            <a href="/" aria-label="JOURNEY.STORAGE™ home" className={`inline-block ${focus}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand/logo-white-TM.svg" alt="JOURNEY.STORAGE™" className="w-[160px]" style={{ height: 'auto' }} />
            </a>
            <p className="mt-3 text-[1rem] font-light italic text-stone">Space to move on.</p>
            <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-[1.5] text-warm-white/60">
              Self storage built for people in motion. Rent online, <b className="font-extrabold text-warm-white/90">month-to-month</b>, 24/7 smart entry.
            </p>
            <a href={`tel:${PHONE.tel}`} className={`mt-5 block text-[1.125rem] font-bold text-warm-white transition-colors duration-200 hover:text-orange ${focus}`}>{PHONE.display}</a>
            <a href="mailto:hello@journey.storage" className={`mt-0.5 block text-[0.875rem] text-warm-white/60 transition-colors duration-200 hover:text-orange ${focus}`}>hello@journey.storage</a>
            <div className="mt-7">
              <Newsletter />
            </div>
          </div>

          <nav aria-labelledby="f-types">
            <h3 id="f-types" className={headCls}>Storage types</h3>
            <ul className="mt-4 space-y-0.5">
              {storageTypes.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkCls}>
                    {l.label}
                    {l.sub && <span className="ml-1.5 text-[0.75rem] text-stone">{l.sub}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f-locations">
            <h3 id="f-locations" className={headCls}>Locations</h3>
            <ul className="mt-4 space-y-0.5">
              {locationLinks.map((l) => (
                <li key={l.label}><a href={l.href} className={linkCls}>{l.label}</a></li>
              ))}
              <li className="py-1 text-[0.9375rem] leading-snug text-stone">
                Malakoff, TX <span className="ml-1.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-stone/70">2026</span>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="f-resources">
            <h3 id="f-resources" className={headCls}>Resources</h3>
            <ul className="mt-4 space-y-0.5">
              <li><a href="/rentaspace" className={linkCls}>Rent a space online</a></li>
              <li><SizeGuideLink className={`${linkCls} w-full cursor-pointer text-left`}>Size guide</SizeGuideLink></li>
              {resourceLinks.map((l) => (
                <li key={l.label}><a href={l.href} className={linkCls}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Row 2 — NAP per facility, one quiet strip */}
        <section aria-labelledby="f-nap" className="mt-12 border-t border-warm-white/10 pt-7">
          <h2 id="f-nap" className={headCls}>Storage locations in Granbury, TX <span className="mt-1 block font-bold normal-case tracking-normal text-stone/70 sm:ml-2 sm:mt-0 sm:inline">· gate open 24/7</span></h2>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            {facilities.map((f) => (
              <address key={f.slug} className="text-[0.875rem] not-italic leading-[1.6] text-warm-white/60">
                <a href={`/rentaspace/${f.slug}`} className={`font-bold text-warm-white transition-colors duration-200 hover:text-orange ${focus}`}>{f.name}</a>
                <br />{f.street}, {f.city}, {f.region} {f.zip}
                <br /><a href={`tel:${PHONE.tel}`} className={`transition-colors duration-200 hover:text-orange ${focus}`}>{PHONE.display}</a>
              </address>
            ))}
          </div>
        </section>

        {/* Row 3 — oversized wordmark: the locked logo artwork at low contrast, never re-typeset */}
        <div aria-hidden className="mt-12 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-white-TM.svg" alt="" className="pointer-events-none w-full opacity-[0.06]" style={{ height: 'auto' }} />
        </div>

        {/* Row 4 — legal + social */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-warm-white/10 pt-5 text-[0.75rem] text-stone sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} JOURNEY.STORAGE&trade; · All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><a href="/legal/privacy" className={`transition-colors duration-200 hover:text-warm-white ${focus}`}>Privacy</a></li>
            <li><a href="/legal/terms" className={`transition-colors duration-200 hover:text-warm-white ${focus}`}>Terms</a></li>
            <li><a href="/legal/disclaimer" className={`transition-colors duration-200 hover:text-warm-white ${focus}`}>Disclaimer</a></li>
          </ul>
          <div className="flex gap-4">
            {socials.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`text-warm-white/50 transition-[color,transform] duration-200 hover:-translate-y-px hover:text-warm-white active:translate-y-0 ${focus}`}>
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
