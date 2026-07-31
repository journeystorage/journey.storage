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

const linkClass = 'text-body-sm text-stone hover:text-warm-white transition-colors duration-150'

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-warm-white/[0.04]">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* Top section */}
        <div className="py-10 lg:py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Logo + tagline */}
          <div>
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage™"
              width={160}
              height={36}
              style={{ height: 'auto' }}
            />
            <p className="mt-3 text-body-sm text-stone/60">
              Direct investment in self-storage.
            </p>
            <p className="mt-4 max-w-[280px] text-body-sm leading-relaxed text-warm-white/40">
              Institutional-grade self-storage real estate investment and syndication, offered directly to accredited investors.
            </p>
          </div>

          {/* Invest */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50 mb-3">
              Invest
            </h4>
            <ul className="flex flex-col gap-2">
              {investLinks.map((link) => (
                <li key={link.label}><a href={link.href} className={linkClass}>{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50 mb-3">
              Ecosystem
            </h4>
            <div className="flex flex-col gap-2">
              <a href={externalUrls.mainSite} target="_blank" rel="noopener noreferrer" className={linkClass}>Storage</a>
              <a href={externalUrls.managed} target="_blank" rel="noopener noreferrer" className={linkClass}>Managed</a>
              <span className="text-body-sm text-orange font-bold">Direct</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-warm-white/50 mb-3">
              Contact
            </h4>
            <div className="flex flex-col gap-2">
              <span className="text-body-sm text-stone">Dallas, TX</span>
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} font-bold`}>
                Request access &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-6 border-t border-warm-white/[0.04]">
          <p className="text-[0.72rem] leading-[1.7] text-warm-white/55 max-w-[900px]">
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

        {/* Copyright */}
        <div className="py-5 border-t border-warm-white/[0.04] flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <span className="text-caption text-warm-white/30">
            &copy; 2026 Journey.Storage&trade;. All rights reserved.
          </span>
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-warm-white/45">
            Privileged &amp; Confidential
          </span>
        </div>
      </div>
    </footer>
  )
}
