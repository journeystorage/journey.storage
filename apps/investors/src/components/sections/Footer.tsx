import Image from 'next/image'
import { externalUrls, CALENDAR_URL } from '@/lib/constants'

// Crawlable in-page anchors → the investors page sections.
const investLinks = [
  { label: 'How it works', href: '#process' },
  { label: 'Opportunities', href: '#opportunities' },
  { label: 'Strategy', href: '#strategy' },
  { label: 'Market', href: '#market' },
  { label: 'Team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
]

const headingClass = 'mb-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-warm-white/45'
const linkClass = 'block py-1.5 text-body-sm text-warm-white/55 transition-colors duration-200 hover:text-warm-white'

export default function Footer() {
  return (
    <footer className="border-t border-warm-white/[0.06] bg-black">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* ── Brand moment + CTA ── */}
        <div className="flex flex-col gap-10 border-b border-warm-white/[0.06] py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div className="max-w-md">
            <Image src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" width={150} height={34} className="w-[150px]" style={{ height: 'auto' }} />
            <h2 className="mt-7 text-[1.75rem] font-black leading-[1.05] tracking-tight text-warm-white md:text-[2.1rem]">
              Direct investment in self storage.
            </h2>
            <p className="mt-3 text-body-sm leading-relaxed text-warm-white/50">
              Institutional-grade self-storage real estate, offered directly to accredited investors.
            </p>
          </div>

          <div className="w-full lg:max-w-xs">
            <p className="mb-3 text-body-sm font-bold text-warm-white/80">Interested in investing with us?</p>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-3.5 text-body-sm font-bold text-warm-white transition-all duration-200 hover:brightness-110 active:translate-y-px">
              Request access <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </div>

        {/* ── Link columns ── */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 lg:grid-cols-3">
          <div>
            <h3 className={headingClass}>Invest</h3>
            <ul>
              {investLinks.map((link) => (
                <li key={link.label}><a href={link.href} className={linkClass}>{link.label}</a></li>
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
                <a href={externalUrls.managed} target="_blank" rel="noopener noreferrer" className="font-bold text-warm-white/85 transition-colors duration-200 hover:text-orange">Journey.Managed</a>
                <span className="mt-0.5 block text-warm-white/40">Facility management for owners</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>Contact</h3>
            <p className="text-body-sm text-warm-white/55">Dallas, TX</p>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-body-sm font-bold text-warm-white/80 transition-colors duration-200 hover:text-orange">
              Request access &rarr;
            </a>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="border-t border-warm-white/[0.06] py-6">
          <p className="max-w-[900px] text-[0.72rem] leading-[1.7] text-warm-white/45">
            This website contains information that is privileged and confidential.
            It is for informational purposes only and is not intended as a general
            solicitation or a securities offering of any kind. The information
            presented is from sources believed to be reliable; however, no
            representation, expressed or implied, is made as to its accuracy.
            Journey.Direct&trade; and Journey.Storage&trade; do not provide tax,
            legal, or investment advice. Nothing on this website should be
            construed as such. All forward-looking statements, projections, and
            estimates are based on current assumptions and expectations, which are
            inherently subject to risks and uncertainties. Past performance does
            not guarantee future results. Potential investors should conduct their
            own due diligence and consult with qualified legal, tax, and financial
            advisors before making any investment decision. Securities offerings,
            if any, are made only to accredited investors through official offering
            documents. The SEC has not passed upon the merits of or given its
            approval to any securities referenced on this website.
          </p>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-3 border-t border-warm-white/[0.06] py-7 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-caption text-warm-white/30">
            &copy; {new Date().getFullYear()}{' '}Journey.Storage&trade;. All rights reserved.
          </span>
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-warm-white/45">
            Privileged &amp; Confidential
          </span>
        </div>
      </div>
    </footer>
  )
}
