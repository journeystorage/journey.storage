import { socialUrls } from '@/lib/constants'

const FACILITIES = [
  { name: 'Temple Hall Hwy', href: '/rentaspace/templehallhwy', address: '212 Temple Hall Hwy, Granbury, TX 76049' },
  { name: 'Western Hills Trl', href: '/rentaspace/westernhillstrl', address: '409 Western Hills Trail, Granbury, TX 76049' },
  { name: 'McCreary Rd', href: '/rentaspace/mccrearyrd', address: '3501 McCreary Rd, Granbury, TX 76049' },
]

const IgIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.3" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)
const InIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21H9z" />
  </svg>
)
const FbIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
  </svg>
)

export default function RentFooter() {
  const socials = [
    { Icon: IgIcon, href: socialUrls.instagram, label: 'Instagram' },
    { Icon: InIcon, href: socialUrls.linkedin, label: 'LinkedIn' },
    { Icon: FbIcon, href: socialUrls.facebook, label: 'Facebook' },
  ]
  return (
    <footer className="bg-charcoal text-warm-white/70">
      <div className="mx-auto max-w-content px-5 py-14 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="https://journey.storage" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" className="w-[150px]" style={{ height: 'auto' }} />
            </a>
            <p className="mt-3 text-[0.875rem] leading-relaxed">Clean, secure, month-to-month self storage in Granbury, TX. Formerly Granbury Self Storage.</p>
            <div className="mt-4 flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-warm-white/10 text-warm-white transition-colors hover:bg-orange">
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-wide text-warm-white/50">Locations</p>
            <ul className="mt-3 space-y-3 text-[0.875rem]">
              {FACILITIES.map((fac) => (
                <li key={fac.href}>
                  <a href={fac.href} className="font-bold text-warm-white transition-colors hover:text-terracotta">{fac.name}</a>
                  <br />
                  <span className="text-warm-white/60">{fac.address}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours + phone */}
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-wide text-warm-white/50">Hours &amp; contact</p>
            <dl className="mt-3 space-y-1.5 text-[0.875rem]">
              <dd><span className="font-bold text-warm-white">Open 24/7</span> — gate access every day of the year</dd>
              <dd>Rent &amp; pay online any time</dd>
              <dd className="pt-2"><a href="tel:+18175790607" className="font-bold text-warm-white transition-colors hover:text-terracotta">(817) 579-0607</a></dd>
            </dl>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-wide text-warm-white/50">Explore</p>
            <ul className="mt-3 space-y-2 text-[0.875rem]">
              <li><a href="/rentaspace" className="transition-colors hover:text-warm-white">Rent a Space</a></li>
              <li><a href="/size-guide" className="transition-colors hover:text-warm-white">Size Guide</a></li>
              <li><a href="/moveout" className="transition-colors hover:text-warm-white">Move Out</a></li>
              <li><a href="https://journey.storage" className="transition-colors hover:text-warm-white">About Journey</a></li>
              <li><a href="/legal/privacy" className="transition-colors hover:text-warm-white">Privacy Policy</a></li>
              <li><a href="/legal/terms" className="transition-colors hover:text-warm-white">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-warm-white/10 pt-6 text-[0.8125rem] sm:flex-row">
          <span>© {new Date().getFullYear()} Journey.Storage™. All rights reserved.</span>
          <span className="italic">Space to move on.</span>
        </div>
      </div>
    </footer>
  )
}
