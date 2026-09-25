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
 *    phrase pointing at the page that owns it. No dedicated type pages exist
 *    yet, so each storage type links to the facility that owns that keyword.
 *  - NAP (name, address, phone) per facility in an <address>, from the same
 *    `facilities` constant the schema uses. Must match Google Business Profile.
 *  - 20 crawlable links + the size-guide button. Stay under 25.
 *  - Markets without a page (Malakoff) are text, not links: no 404s.
 */

// Every type goes to the locations hub so the renter picks a location first.
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
  { label: 'Rent a space online', href: '/rentaspace' },
  { label: 'Smart entry & 24/7 access', href: '/smartentry' },
  { label: 'Move-out request', href: '/moveout' },
  { label: 'About Journey', href: '/#about' },
]

// One-line descriptor per facility for the NAP cards. Keyed by slug so it
// stays in step with `facilities`.
const FACILITY_BLURB: Record<string, string> = {
  templehallhwy: 'Climate-controlled & drive-up · 350+ spaces',
  westernhillstrl: 'All drive-up · near Harbor Lakes',
  mccrearyrd: 'Newest location · units to 10×30',
}

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
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
)

const linkCls = 'block py-1.5 text-[0.9375rem] leading-snug text-warm-white/70 transition-colors duration-200 hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
const headCls = 'text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-stone'

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
    <form onSubmit={subscribe} className="flex max-w-[360px] items-stretch gap-2">
      <input
        ref={emailRef}
        id="footer-newsletter-email"
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email for newsletter"
        className="min-w-0 flex-1 rounded-full border border-warm-white/10 bg-warm-white/[0.05] px-4 py-2.5 text-[0.875rem] text-warm-white placeholder:text-warm-white/30 transition-colors duration-150 focus:border-orange focus-visible:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full border border-warm-white/15 px-4 py-2.5 text-[0.75rem] font-extrabold uppercase tracking-[0.1em] text-warm-white/80 transition-colors duration-200 hover:bg-warm-white/[0.06] hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange active:bg-warm-white/[0.1]"
      >
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
    <footer aria-label="Site footer" className="relative overflow-hidden border-t-[5px] border-orange bg-black pb-10 pt-16 text-warm-white lg:pt-20">
      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">

        {/* Row 1 — brand + linked columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-12">
          <div className="md:col-span-3 lg:col-span-1">
            <a href="/" aria-label="JOURNEY.STORAGE™ home" className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand/logo-white-TM.svg" alt="JOURNEY.STORAGE™" className="w-[180px]" style={{ height: 'auto' }} />
            </a>
            <p className="mt-3 text-[1.0625rem] font-light italic text-stone">Space to move on.</p>
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-[1.5] text-warm-white/70">
              Self storage built for people in motion. Rent online in minutes, <b className="font-extrabold text-warm-white">month-to-month</b>, with 24/7 smart entry. Now open in Granbury, Texas.
            </p>
            <a href={`tel:${PHONE.tel}`} className="mt-5 inline-flex items-center gap-2.5 text-[1.25rem] font-bold text-warm-white transition-colors duration-200 hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">
              <PhoneIcon className="h-5 w-5" />{PHONE.display}
            </a>
            <a href="mailto:hello@journey.storage" className="mt-1 block text-[0.875rem] text-warm-white/60 transition-colors duration-200 hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">hello@journey.storage</a>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { label: 'Journey.Managed', href: externalUrls.managed },
                { label: 'Journey.Direct', href: externalUrls.investors },
              ].map((l) => (
                <a key={l.href} href={l.href} className="rounded-full border border-warm-white/12 px-3.5 py-2 text-[0.75rem] font-extrabold uppercase tracking-[0.1em] text-warm-white/70 transition-colors duration-200 hover:bg-warm-white/[0.05] hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange active:bg-warm-white/[0.1]">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="mt-7">
              <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-stone">Stay in the loop</p>
              <Newsletter />
            </div>
          </div>

          <nav aria-labelledby="f-types">
            <h3 id="f-types" className={headCls}>Storage types</h3>
            <ul className="mt-4">
              {storageTypes.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkCls}>
                    {l.label}
                    {l.sub && <span className="block text-[0.75rem] text-stone">{l.sub}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f-locations">
            <h3 id="f-locations" className={headCls}>Locations</h3>
            <ul className="mt-4">
              {locationLinks.map((l) => (
                <li key={l.label}><a href={l.href} className={linkCls}>{l.label}</a></li>
              ))}
              <li>
                <span className="block py-1.5 text-[0.9375rem] leading-snug text-stone">
                  Malakoff, TX · Cedar Creek Lake
                  <span className="block text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-stone/80">Coming 2026</span>
                </span>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="f-resources">
            <h3 id="f-resources" className={headCls}>Resources</h3>
            <ul className="mt-4">
              <li><a href={resourceLinks[0].href} className={linkCls}>{resourceLinks[0].label}</a></li>
              <li><SizeGuideLink className={`${linkCls} w-full cursor-pointer text-left`}>Size guide</SizeGuideLink></li>
              {resourceLinks.slice(1).map((l) => (
                <li key={l.label}><a href={l.href} className={linkCls}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Row 2 — NAP per facility */}
        <section aria-labelledby="f-nap" className="mt-14 border-t border-warm-white/10 pt-12">
          <div className="relative mb-7 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <span aria-hidden className="absolute -left-5 top-0.5 bottom-0.5 w-[5px] bg-orange md:-left-8 lg:-left-16" />
            <h2 id="f-nap" className="text-[1.75rem] font-light uppercase leading-[1.2] tracking-[-0.5px] text-warm-white lg:text-[1.875rem]">
              Our <b className="font-extrabold">Granbury locations.</b>
            </h2>
            <p className="text-[0.875rem] text-stone">Three facilities · one phone number · gate open 24/7</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {facilities.map((f) => (
              <div key={f.slug} className="rounded-[22px] bg-[#222] p-6 shadow-[inset_0_0_0_1px_rgba(255,252,248,0.1)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_rgba(255,252,248,0.1),0_10px_30px_rgba(0,0,0,0.6)]">
                <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] text-stone">{f.city} · {f.region}</p>
                <h4 className="mt-2 text-[1.25rem] font-bold leading-snug text-warm-white">
                  <a href={`/rentaspace/${f.slug}`} className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">
                    {f.name}<span aria-hidden className="text-[0.9em] opacity-60">→</span>
                  </a>
                </h4>
                <p className="mt-1 text-[0.8125rem] text-stone">{FACILITY_BLURB[f.slug]}</p>
                <address className="mt-3 text-[0.875rem] not-italic leading-[1.5] text-warm-white/70">
                  {f.street}<br />{f.city}, {f.region} {f.zip}<br />
                  <a href={`tel:${PHONE.tel}`} className="mt-1 inline-block font-bold text-warm-white transition-colors duration-200 hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">{PHONE.display}</a>
                </address>
                <p className="mt-3 border-t border-warm-white/10 pt-3 text-[0.75rem] text-stone"><b className="font-bold text-warm-white/70">Gate</b> 24/7 · <b className="font-bold text-warm-white/70">Rent &amp; pay</b> online, any time</p>
              </div>
            ))}
          </div>
        </section>

        {/* Row 3 — oversized wordmark: the locked logo artwork at low contrast, never re-typeset */}
        <div aria-hidden className="mt-14 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-white-TM.svg" alt="" className="pointer-events-none w-full opacity-[0.07]" style={{ height: 'auto' }} />
        </div>

        {/* Row 4 — legal + social */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-warm-white/10 pt-6 text-[0.75rem] text-stone sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} JOURNEY.STORAGE&trade; · All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><a href="/legal/privacy" className="transition-colors duration-200 hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Privacy</a></li>
            <li><a href="/legal/terms" className="transition-colors duration-200 hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Terms</a></li>
            <li><a href="/legal/disclaimer" className="transition-colors duration-200 hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Disclaimer</a></li>
          </ul>
          <div className="flex gap-2">
            {socials.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full text-warm-white/70 shadow-[inset_0_0_0_1px_rgba(255,252,248,0.12)] transition-[color,background-color,transform] duration-200 hover:-translate-y-px hover:bg-warm-white/[0.05] hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange active:translate-y-0">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
