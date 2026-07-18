'use client'

import Image from 'next/image'
import { Check, Clock, CalendarDays, Zap, MapPin, Phone, ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'

const PHONE = '(817) 579-0607'
const TEL = 'tel:+18175790607'

type Property = {
  name: string
  address: string
  city: string
  img: string
  badge: string
  badgeStyle: 'orange' | 'dark'
  status: string
  tags: string[]
}

const properties: Property[] = [
  {
    name: 'Journey Storage — Temple Hall',
    address: '212 Temple Hall Hwy',
    city: 'Granbury, TX 76049',
    img: '/images/granbury/rs-card-temple-hall.webp',
    badge: '350+ units',
    badgeStyle: 'orange',
    status: 'Open today · until 5:00 PM',
    tags: ['Climate-controlled', 'Drive-up', 'Gated'],
  },
  {
    name: 'Journey Storage — Western Hills',
    address: '409 Western Hills Trl',
    city: 'Granbury, TX 76049',
    img: '/images/granbury/rs-card-western-hills.webp',
    badge: '100+ units',
    badgeStyle: 'dark',
    status: 'Open today · until 5:00 PM',
    tags: ['Drive-up', 'Roll-up doors', 'Gated'],
  },
  {
    name: 'Journey Storage — Cleveland Rd',
    address: '3501 McCreary Rd',
    city: 'Granbury, TX 76049',
    img: '/images/granbury/rs-card-cleveland.webp',
    badge: 'Newest',
    badgeStyle: 'dark',
    status: 'Open today · until 5:00 PM',
    tags: ['Climate-controlled', 'Drive-up', 'Cameras'],
  },
]

export default function RentContent() {
  return (
    <>
      {/* ── Trust strip ── */}
      <div className="border-b border-black/[0.06] bg-warm-white">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-4 px-5 py-6 text-center sm:grid-cols-3 md:px-8 lg:px-16">
          <div className="flex items-center justify-center gap-2.5 text-body-sm font-bold text-charcoal">
            <Check className="h-5 w-5 shrink-0 text-orange" strokeWidth={2.5} aria-hidden />
            Clear pricing — no hidden fees
          </div>
          <div className="flex items-center justify-center gap-2.5 border-black/[0.06] text-body-sm font-bold text-charcoal sm:border-x">
            <CalendarDays className="h-5 w-5 shrink-0 text-orange" strokeWidth={2} aria-hidden />
            Month-to-month — we earn your stay
          </div>
          <div className="flex items-center justify-center gap-2.5 text-body-sm font-bold text-charcoal">
            <Zap className="h-5 w-5 shrink-0 text-orange" strokeWidth={2} aria-hidden />
            Rent online in minutes
          </div>
        </div>
      </div>

      {/* ── Detailed property cards ── */}
      <SectionWrapper id="properties" outerClassName="bg-warm-white">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">
            Storage without the friction
          </span>
          <h2 className="mt-3 text-h2 font-black tracking-[-0.03em] text-black">Our Granbury locations</h2>
          <p className="mt-3 text-body leading-relaxed text-stone">
            Three facilities across Granbury. Pick the one nearest you and reserve online — someone who
            understands your moment is close by.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {properties.map((p) => (
            <article
              key={p.name}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(24,24,24,0.04),0_12px_32px_-12px_rgba(24,24,24,0.14)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(24,24,24,0.06),0_24px_48px_-16px_rgba(232,98,42,0.22)]"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={p.img}
                  alt={`${p.name}, Granbury TX`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-label font-bold text-warm-white ${
                    p.badgeStyle === 'orange' ? 'bg-orange shadow-[0_2px_8px_rgba(232,98,42,0.3)]' : 'bg-charcoal'
                  }`}
                >
                  {p.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-h4 font-black leading-snug tracking-[-0.02em] text-black">{p.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-body-sm">
                  <span className="inline-flex items-center gap-1.5 font-bold text-sage-green">
                    <span className="h-2 w-2 rounded-full bg-sage-green" />
                    Open today
                  </span>
                  <span className="text-stone">· until 5:00 PM</span>
                </div>
                <p className="mt-3 text-body-sm leading-relaxed text-stone">
                  {p.address}
                  <br />
                  {p.city}
                </p>
                <a
                  href={TEL}
                  className="mt-2 inline-flex items-center gap-2 text-body-sm font-bold text-black transition-colors hover:text-orange"
                >
                  <Phone className="h-4 w-4 text-orange" strokeWidth={2} aria-hidden />
                  {PHONE}
                </a>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full px-2.5 py-1 text-label font-bold uppercase tracking-wide ${
                        t === 'Climate-controlled'
                          ? 'bg-sage-green/15 text-[#5c8a52]'
                          : 'bg-sand/25 text-charcoal'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-1 items-end">
                  <a
                    href="#"
                    className="group/cta flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3 font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)] transition duration-200 ease-out hover:-translate-y-px hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    Rent online
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5" aria-hidden />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Temple Hall spotlight ── */}
      <SectionWrapper outerClassName="border-y border-black/[0.05] bg-white">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Featured facility</span>
            <h2 className="mt-3 text-h2 font-black leading-[1.05] tracking-[-0.03em] text-black">
              Not a container.
              <br />
              A partner on Temple Hall.
            </h2>
            <p className="mt-4 text-body leading-relaxed text-stone">
              Our flagship Granbury facility: 350+ clean, secure units on landscaped grounds — from breezy
              drive-up spaces to fully climate-controlled interior storage. Wide, well-lit aisles, a friendly
              front office, and a gated perimeter watched around the clock.
            </p>
            <ul className="mt-6 space-y-3">
              {['Climate-controlled & drive-up units', 'Gated access, 6 AM–10 PM daily', 'Sizes from 5×10 to 10×30'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-body font-bold text-charcoal">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange/[0.12] text-orange">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-xl bg-orange px-7 py-3.5 font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)] transition duration-200 ease-out hover:-translate-y-px hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                Rent a unit here
              </a>
              <a
                href={TEL}
                className="rounded-xl border-2 border-black/85 px-7 py-3.5 font-bold text-black transition-colors duration-200 hover:bg-black hover:text-warm-white"
              >
                Call {PHONE}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_12px_32px_-12px_rgba(24,24,24,0.2)]">
              <Image src="/images/granbury/rs-gallery-aerial.webp" alt="Aerial of the Temple Hall facility" fill unoptimized sizes="(max-width: 1024px) 100vw, 520px" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_12px_32px_-12px_rgba(24,24,24,0.2)]">
              <Image src="/images/granbury/rs-gallery-climate.webp" alt="Climate-controlled units" fill unoptimized sizes="(max-width: 1024px) 50vw, 260px" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_12px_32px_-12px_rgba(24,24,24,0.2)]">
              <Image src="/images/granbury/rs-gallery-office.webp" alt="Rental office" fill unoptimized sizes="(max-width: 1024px) 50vw, 260px" className="object-cover" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Hours / info ── */}
      <SectionWrapper outerClassName="bg-warm-white">
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-black/[0.05] bg-white p-6 text-center shadow-[0_1px_2px_rgba(24,24,24,0.04),0_12px_32px_-12px_rgba(24,24,24,0.14)] sm:grid-cols-3 lg:p-8">
          <div>
            <p className="flex items-center justify-center gap-2 text-label font-bold uppercase tracking-wide text-orange">
              <Clock className="h-4 w-4" strokeWidth={2} aria-hidden /> Office hours
            </p>
            <p className="mt-1 text-body-sm leading-relaxed text-charcoal">
              Mon–Fri 8:30 AM – 5:00 PM
              <br />
              Sat 8:30 AM – 3:00 PM · Sun closed
            </p>
          </div>
          <div className="border-black/[0.06] sm:border-x">
            <p className="flex items-center justify-center gap-2 text-label font-bold uppercase tracking-wide text-orange">
              <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden /> Gate access
            </p>
            <p className="mt-1 text-body-sm leading-relaxed text-charcoal">
              Every day
              <br />
              6:00 AM – 10:00 PM
            </p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-2 text-label font-bold uppercase tracking-wide text-orange">
              <Zap className="h-4 w-4" strokeWidth={2} aria-hidden /> Rentals
            </p>
            <p className="mt-1 text-body-sm leading-relaxed text-charcoal">
              Month-to-month · no deposit
              <br />
              Rent &amp; pay online 24/7
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-caption italic text-stone/70">
          Live unit availability &amp; pricing will load from the Tenant Inc API.
        </p>
      </SectionWrapper>

      {/* ── Closing CTA band ── */}
      <section className="relative overflow-hidden bg-black">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(90% 120% at 50% 0%, rgba(232,98,42,0.22) 0%, transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-content px-5 py-16 text-center md:px-8 lg:px-16 lg:py-20">
          <h2 className="text-h1 font-black tracking-[-0.03em] text-warm-white">Space to move on.</h2>
          <p className="mx-auto mt-4 max-w-xl text-body font-light text-warm-white/70 lg:text-subhead">
            Find your unit in Granbury today. Clear pricing, no lock-in, and a team that gets your moment.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#locations"
              className="rounded-xl bg-orange px-8 py-3.5 font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)] transition duration-200 ease-out hover:-translate-y-px hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              Find a unit
            </a>
            <a
              href={TEL}
              className="rounded-xl border-2 border-warm-white/70 px-8 py-3.5 font-bold text-warm-white transition-colors duration-200 hover:bg-warm-white hover:text-black"
            >
              Call us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
