'use client'

import Image from 'next/image'
import { externalUrls, socialUrls } from '@/lib/constants'

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

const exploreLinks = [
  { label: 'How it works', href: '#managed-model' },
  { label: 'Pricing', href: '#managed-pricing' },
  { label: 'Leadership', href: '#managed-leadership' },
  { label: 'Free facility review', href: '#managed-contact' },
]
const serviceLinks = ['Revenue management', 'Marketing & occupancy', 'Smart access & tech', 'Reporting & reconciliation', 'Facility operations']

const headingClass = 'mb-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-warm-white/45'
const linkClass = 'block py-1.5 text-body-sm text-warm-white/55 transition-colors duration-200 hover:text-warm-white'

export default function Footer() {
  return (
    <footer className="border-t border-warm-white/[0.06] bg-black">
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* ── Brand moment + CTA ── */}
        <div className="flex flex-col gap-10 border-b border-warm-white/[0.06] py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div className="max-w-md">
            <Image src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" width={150} height={34} className="w-[150px]" style={{ height: 'auto' }} />
            <h2 className="mt-7 text-[1.75rem] font-black leading-[1.05] tracking-tight text-warm-white md:text-[2.1rem]">
              We run storage for a living.
            </h2>
            <p className="mt-3 text-body-sm leading-relaxed text-warm-white/50">
              Third-party self-storage management for facility owners — one flat fee, everything included. Managing facilities across Texas.
            </p>
          </div>

          <div className="w-full lg:max-w-xs">
            <p className="mb-3 text-body-sm font-bold text-warm-white/80">Considering handing off management?</p>
            <a href="#managed-contact" className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-3.5 text-body-sm font-bold text-warm-white transition-all duration-200 hover:brightness-110 active:translate-y-px">
              Free facility review <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </div>

        {/* ── Link columns ── */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 lg:grid-cols-3">
          <div>
            <h3 className={headingClass}>Explore</h3>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.label}><a href={link.href} className={linkClass}>{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>What we do</h3>
            <ul>
              {serviceLinks.map((label) => (
                <li key={label}><a href="#managed-model" className={linkClass}>{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>Ecosystem</h3>
            <ul className="space-y-3">
              <li className="text-body-sm leading-snug">
                <a href={externalUrls.mainSite} target="_blank" rel="noopener noreferrer" className="font-bold text-warm-white/85 transition-colors duration-200 hover:text-orange">Journey.Storage</a>
                <span className="mt-0.5 block text-warm-white/40">Self storage for renters</span>
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
            <a href="https://journey.storage/legal/privacy" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-warm-white">Privacy</a>
            <a href="https://journey.storage/legal/terms" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-warm-white">Terms</a>
            <span className="text-warm-white/25">&copy; {new Date().getFullYear()} Journey.Storage&trade;</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
