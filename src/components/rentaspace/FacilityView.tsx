'use client'

import { Search, MapPin, Phone, Menu, Star, Clock, Check, ChevronRight } from 'lucide-react'

export type Unit = {
  size: string
  sqft: number
  fits: string
  walkIn: number
  online: number
  tags: string[]
}
export type UnitGroup = { category: string; blurb: string; units: Unit[] }
export type Facility = {
  name: string
  short: string
  address: string
  city: string
  phone: string
  tel: string
  rating: string
  reviews: number
  hero: string
  gallery: { src: string; alt: string }[]
  mapQuery: string
  officeHours: string[]
  gateHours: string
  amenities: string[]
  about: string[]
  groups: UnitGroup[]
  faqs: { q: string; a: string }[]
}

const SCOPED_CSS = `
#facility .track-tight{letter-spacing:-.03em}
#facility .track-tighter{letter-spacing:-.04em}
#facility .shadow-card{box-shadow:0 1px 2px rgba(24,24,24,.04),0 12px 32px -12px rgba(24,24,24,.14)}
#facility .shadow-cta{box-shadow:0 2px 8px rgba(232,98,42,.3)}
#facility .btn-spring{transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s cubic-bezier(.22,1,.36,1),filter .2s ease}
#facility .btn-spring:hover{transform:translateY(-1px);filter:brightness(1.06)}
#facility .btn-spring:active{transform:translateY(0)}
#facility .unit{box-shadow:0 1px 2px rgba(24,24,24,.04),0 10px 26px -14px rgba(24,24,24,.14);transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s cubic-bezier(.22,1,.36,1)}
#facility .unit:hover{transform:translateY(-3px);box-shadow:0 2px 4px rgba(24,24,24,.05),0 22px 44px -18px rgba(232,98,42,.24)}
`

function Nav() {
  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex h-[72px] max-w-content items-center justify-between px-5 lg:px-16">
        <a href="/rentaspace" className="min-w-[150px] lg:min-w-[180px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" className="w-[150px] lg:w-[180px]" style={{ height: 'auto' }} />
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          <a href="/rentaspace" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">Locations</a>
          <a href="/size-guide" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">Size Guide</a>
          <a href="/#about" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">About Us</a>
          <a href="tel:+18175790607" className="flex items-center gap-2 text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">
            <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />(817) 579-0607
          </a>
          <a href="#" className="btn-spring rounded-full border-2 border-warm-white/80 px-5 py-2 text-[0.9375rem] font-bold text-warm-white hover:bg-warm-white hover:text-black">Pay Bill</a>
        </div>
        <button className="text-warm-white lg:hidden" aria-label="Menu"><Menu className="h-7 w-7" strokeWidth={2} aria-hidden /></button>
      </nav>
    </header>
  )
}

function Stars() {
  return (
    <span className="flex items-center gap-0.5 text-orange">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-orange" strokeWidth={0} aria-hidden />
      ))}
    </span>
  )
}

export default function FacilityView({ facility: f }: { facility: Facility }) {
  return (
    <div id="facility" className="bg-warm-white text-black antialiased">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      <Nav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.hero} alt={`${f.name} facility`} className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-charcoal/30 mix-blend-multiply" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(24,24,24,0.62) 0%, rgba(24,24,24,0.30) 45%, rgba(24,24,24,0.85) 100%)' }} />
        </div>
        <div className="relative mx-auto max-w-content px-5 pb-8 pt-[104px] lg:px-16 lg:pt-[120px]">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-warm-white/70">
            <a href="/" className="transition-colors hover:text-warm-white">Home</a>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <a href="/rentaspace" className="transition-colors hover:text-warm-white">Rent a Space</a>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-warm-white">{f.short}</span>
          </nav>

          <div className="mt-[120px] max-w-2xl lg:mt-[150px]">
            <h1 className="track-tighter text-[2.25rem] font-black leading-[1.02] text-warm-white lg:text-[3.25rem]">{f.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex items-center gap-2 text-warm-white">
                <Stars /><span className="font-bold">{f.rating}</span>
                <span className="text-warm-white/70">({f.reviews} reviews)</span>
              </span>
              <a href={`https://www.google.com/maps?q=${encodeURIComponent(f.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-warm-white/90 transition-colors hover:text-terracotta">
                <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />{f.address}, {f.city}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* gallery strip */}
      <div className="border-b border-black/[0.06] bg-warm-white">
        <div className="mx-auto flex max-w-content gap-3 overflow-x-auto px-5 py-4 lg:px-16">
          {f.gallery.map((g) => (
            <div key={g.src} className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl shadow-card lg:h-24 lg:w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN: units + sidebar ── */}
      <section className="mx-auto max-w-content px-5 py-12 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* units */}
          <div>
            <h2 className="track-tight text-[1.75rem] font-black text-black lg:text-[2.25rem]">Choose your space</h2>
            <p className="mt-2 text-[1.0625rem] leading-relaxed text-stone">Reserve online in minutes — lock in the online rate, move in when you like. No long-term commitment.</p>

            {f.groups.map((group) => (
              <div key={group.category} className="mt-10">
                <div className="flex items-baseline justify-between border-b border-black/[0.08] pb-2">
                  <h3 className="text-[1.25rem] font-black text-black">{group.category}</h3>
                  <span className="text-[0.875rem] text-stone">{group.blurb}</span>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {group.units.map((u) => (
                    <div key={u.size} className="unit flex flex-col rounded-2xl border border-black/[0.05] bg-white p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-[1.375rem] font-black tracking-[-0.02em] text-black">{u.size}</h4>
                          <p className="mt-0.5 text-[0.8125rem] text-stone">{u.sqft} sq ft · {u.fits}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-stone">
                            Walk-in <span className="line-through">${u.walkIn}</span>
                          </p>
                          <p className="leading-none">
                            <span className="text-[1.75rem] font-black text-orange">${u.online}</span>
                            <span className="text-[0.8125rem] font-bold text-stone">/mo</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {u.tags.map((t) => (
                          <span key={t} className={`rounded-full px-2.5 py-1 text-[0.75rem] font-bold ${t === 'Climate-controlled' ? 'bg-sage-green/15 text-[#5c8a52]' : 'bg-sand/25 text-charcoal'}`}>{t}</span>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-1 items-end">
                        <a href="#" className="btn-spring shadow-cta flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-2.5 font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">
                          Rent this unit
                          <span aria-hidden>→</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="mt-8 text-[0.8125rem] italic text-stone/70">Intro online rates shown. Live availability &amp; final pricing will load from the Tenant Inc reservation system.</p>
          </div>

          {/* sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-card">
              <iframe
                title={`Map of ${f.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(f.mapQuery)}&output=embed`}
                className="h-48 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <p className="flex items-start gap-2 text-[0.9375rem] font-bold text-black">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" strokeWidth={2} aria-hidden />
                  <span>{f.address}<br /><span className="font-normal text-stone">{f.city}</span></span>
                </p>
                <a href={f.tel} className="btn-spring shadow-cta mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3 font-bold text-warm-white">
                  <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />Call {f.phone}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-card">
              <p className="flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-wide text-orange"><Clock className="h-4 w-4" strokeWidth={2} aria-hidden />Hours</p>
              <dl className="mt-3 space-y-1.5 text-[0.9375rem] text-charcoal">
                {f.officeHours.map((line) => (<dd key={line}>{line}</dd>))}
                <dd className="pt-1 text-stone">Gate access: {f.gateHours}</dd>
              </dl>
            </div>

            <div className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-card">
              <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-orange">Amenities</p>
              <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {f.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-[0.875rem] text-charcoal">
                    <Check className="h-4 w-4 shrink-0 text-sage-green" strokeWidth={2.5} aria-hidden />{a}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="border-y border-black/[0.05] bg-white">
        <div className="mx-auto max-w-content px-5 py-14 lg:px-16 lg:py-20">
          <div className="max-w-3xl">
            <span className="text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-orange">About this facility</span>
            <h2 className="track-tight mt-3 text-[1.75rem] font-black leading-tight text-black lg:text-[2.25rem]">Self storage in Granbury, done right.</h2>
            <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-stone">
              {f.about.map((p, i) => (<p key={i}>{p}</p>))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-content px-5 py-14 lg:px-16 lg:py-20">
        <h2 className="track-tight text-center text-[1.75rem] font-black text-black lg:text-[2.25rem]">Questions? Answered.</h2>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-black/[0.08]">
          {f.faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.0625rem] font-bold text-black">
                {faq.q}
                <ChevronRight className="h-5 w-5 shrink-0 text-orange transition-transform duration-200 group-open:rotate-90" aria-hidden />
              </summary>
              <p className="mt-3 text-[1rem] leading-relaxed text-stone">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 50% 0%, rgba(232,98,42,0.22) 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-content px-5 py-16 text-center lg:px-16 lg:py-20">
          <h2 className="track-tighter text-[2.25rem] font-black leading-[1.02] text-warm-white lg:text-[3rem]">Space to move on.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] font-light text-warm-white/70 lg:text-[1.25rem]">Reserve your unit at {f.short} today — clear pricing, month-to-month, rented online in minutes.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#" className="btn-spring shadow-cta rounded-xl bg-orange px-8 py-3.5 font-bold text-warm-white">Rent a unit</a>
            <a href={f.tel} className="btn-spring rounded-xl border-2 border-warm-white/70 px-8 py-3.5 font-bold text-warm-white hover:bg-warm-white hover:text-black">Call us</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-charcoal text-warm-white/70">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-5 py-8 text-[0.875rem] sm:flex-row lg:px-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" className="w-[140px]" style={{ height: 'auto' }} />
          <span>Space to move on.</span>
        </div>
      </footer>
    </div>
  )
}
