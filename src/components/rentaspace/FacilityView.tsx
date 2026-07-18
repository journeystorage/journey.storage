'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Phone, Menu, Star, Check, ChevronRight, ChevronLeft, ChevronDown, X, Ruler, Sparkles } from 'lucide-react'
import { socialUrls } from '@/lib/constants'
import { SIZE_ART, SizeArt, getSizeArt } from '@/lib/sizeArt'

/* Brand social glyphs (lucide dropped brand icons) */
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

export type Unit = {
  size: string
  art: string
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
  slides: { src: string; alt: string }[]
  promo?: string
  mapQuery: string
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
      {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-orange" strokeWidth={0} aria-hidden />))}
    </span>
  )
}

export default function FacilityView({ facility: f }: { facility: Facility }) {
  const [slide, setSlide] = useState(0)
  const [guideOpen, setGuideOpen] = useState(false)
  const n = f.slides.length

  // auto-advance the hero
  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setSlide((s) => (s + 1) % n), 6000)
    return () => clearInterval(t)
  }, [n])

  const go = useCallback((d: number) => setSlide((s) => (s + d + n) % n), [n])

  // size-guide board: lock scroll + close on Escape
  useEffect(() => {
    if (!guideOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setGuideOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [guideOpen])

  const socials = [
    { Icon: IgIcon, href: socialUrls.instagram, label: 'Instagram' },
    { Icon: InIcon, href: socialUrls.linkedin, label: 'LinkedIn' },
    { Icon: FbIcon, href: socialUrls.facebook, label: 'Facebook' },
  ]

  return (
    <div id="facility" className="bg-warm-white text-black antialiased">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      <Nav />

      {/* ── HERO CAROUSEL ── */}
      <section className="relative h-[460px] overflow-hidden bg-black lg:h-[540px]">
        {f.slides.map((sl, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={sl.src} src={sl.src} alt={i === slide ? sl.alt : ''} className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-charcoal/30 mix-blend-multiply" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(24,24,24,0.60) 0%, rgba(24,24,24,0.25) 45%, rgba(24,24,24,0.88) 100%)' }} />

        <div className="relative mx-auto flex h-full max-w-content flex-col px-5 pt-[104px] lg:px-16 lg:pt-[120px]">
          <nav className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-warm-white/70">
            <a href="/" className="transition-colors hover:text-warm-white">Home</a>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <a href="/rentaspace" className="transition-colors hover:text-warm-white">Rent a Space</a>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-warm-white">{f.short}</span>
          </nav>

          <div className="mt-auto max-w-2xl pb-14">
            <h1 className="track-tighter text-[2.25rem] font-black leading-[1.02] text-warm-white lg:text-[3.25rem]">{f.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex items-center gap-2 text-warm-white"><Stars /><span className="font-bold">{f.rating}</span><span className="text-warm-white/70">({f.reviews} reviews)</span></span>
              <a href={`https://www.google.com/maps?q=${encodeURIComponent(f.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-warm-white/90 transition-colors hover:text-terracotta">
                <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />{f.address}, {f.city}
              </a>
            </div>
          </div>
        </div>

        {/* slide controls */}
        {n > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="btn-spring absolute left-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-warm-white backdrop-blur hover:bg-black/70"><ChevronLeft className="h-6 w-6" aria-hidden /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="btn-spring absolute right-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-warm-white backdrop-blur hover:bg-black/70"><ChevronRight className="h-6 w-6" aria-hidden /></button>
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {f.slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Go to photo ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-orange' : 'w-2 bg-warm-white/60 hover:bg-warm-white'}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── PROMO BANNER ── */}
      <div className="bg-orange text-warm-white">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-3.5 text-center lg:px-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-white/20 px-3 py-1 text-[0.75rem] font-black uppercase tracking-wide"><Sparkles className="h-3.5 w-3.5" aria-hidden />Limited time</span>
          <span className="text-[1.0625rem] font-black tracking-tight lg:text-[1.25rem]">{f.promo ?? '50% off your first month'}</span>
          <span className="text-[0.9375rem] font-light text-warm-white/85">when you rent online</span>
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
                  {group.units.map((u) => {
                    const art = getSizeArt(u.art)
                    return (
                      <div key={u.size} className="unit flex flex-col rounded-2xl border border-black/[0.06] bg-warm-white p-5">
                        <div className="flex items-start gap-4">
                          <div className="grid h-[64px] w-[80px] shrink-0 place-items-center overflow-hidden rounded-xl" style={{ background: art?.tint ?? 'rgba(232,98,42,0.1)' }}>
                            <SizeArt artKey={u.art} className="h-full w-full" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-[1.375rem] font-black tracking-[-0.02em] text-black">{u.size}</h4>
                                <p className="mt-0.5 text-[0.8125rem] text-stone">{u.sqft} sq ft · {u.fits}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-stone">Walk-in <span className="line-through">${u.walkIn}</span></p>
                                <p className="leading-none"><span className="text-[1.625rem] font-black text-orange">${u.online}</span><span className="text-[0.8125rem] font-bold text-stone">/mo</span></p>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {u.tags.map((t) => (<span key={t} className={`rounded-full px-2.5 py-1 text-[0.75rem] font-bold ${t === 'Climate-controlled' ? 'bg-sage-green/15 text-[#5c8a52]' : 'bg-sand/25 text-charcoal'}`}>{t}</span>))}
                            </div>
                          </div>
                        </div>
                        <a href="#" className="btn-spring shadow-cta mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-2.5 font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Rent this unit<span aria-hidden>→</span></a>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <p className="mt-8 text-[0.8125rem] italic text-stone/70">Intro online rates shown. Live availability &amp; final pricing will load from the Tenant Inc reservation system.</p>
          </div>

          {/* sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            {/* map + contact + socials */}
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-warm-white shadow-card">
              <iframe title={`Map of ${f.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(f.mapQuery)}&output=embed`} className="h-44 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="p-5">
                <p className="flex items-start gap-2 text-[0.9375rem] font-bold text-black"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" strokeWidth={2} aria-hidden /><span>{f.address}<br /><span className="font-normal text-stone">{f.city}</span></span></p>
                <a href={f.tel} className="btn-spring shadow-cta mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3 font-bold text-warm-white"><Phone className="h-4 w-4" strokeWidth={2} aria-hidden />Call {f.phone}</a>
                <div className="mt-4 flex items-center justify-center gap-3 border-t border-black/[0.06] pt-4">
                  {socials.map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="btn-spring grid h-10 w-10 place-items-center rounded-full bg-charcoal text-warm-white hover:bg-orange"><Icon className="h-5 w-5" /></a>
                  ))}
                </div>
              </div>
            </div>

            {/* size guide button — opens board, does not navigate */}
            <button onClick={() => setGuideOpen(true)} className="btn-spring flex w-full items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-warm-white p-5 text-left shadow-card hover:border-orange/40">
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-orange/[0.12] text-orange"><Ruler className="h-5 w-5" strokeWidth={2} aria-hidden /></span>
                <span><span className="block text-[0.9375rem] font-black text-black">Not sure what fits?</span><span className="block text-[0.8125rem] text-stone">Open the storage size guide</span></span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-orange" aria-hidden />
            </button>

            {/* amenities */}
            <div className="rounded-2xl border border-black/[0.06] bg-warm-white p-5 shadow-card">
              <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-orange">Amenities</p>
              <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {f.amenities.map((a) => (<li key={a} className="flex items-center gap-2 text-[0.875rem] text-charcoal"><Check className="h-4 w-4 shrink-0 text-sage-green" strokeWidth={2.5} aria-hidden />{a}</li>))}
              </ul>
            </div>

            {/* FAQ dropdown */}
            <div className="rounded-2xl border border-black/[0.06] bg-warm-white p-5 shadow-card">
              <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-orange">Common questions</p>
              <div className="mt-2 divide-y divide-black/[0.07]">
                {f.faqs.map((faq) => (
                  <details key={faq.q} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.9375rem] font-bold text-black">{faq.q}<ChevronDown className="h-4 w-4 shrink-0 text-orange transition-transform duration-200 group-open:rotate-180" aria-hidden /></summary>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-stone">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="border-y border-black/[0.06] bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-14 lg:px-16 lg:py-20">
          <div className="max-w-3xl">
            <span className="text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-orange">About this facility</span>
            <h2 className="track-tight mt-3 text-[1.75rem] font-black leading-tight text-black lg:text-[2.25rem]">Self storage in Granbury, done right.</h2>
            <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-stone">{f.about.map((p, i) => (<p key={i}>{p}</p>))}</div>
          </div>
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

      {/* ── SIZE GUIDE BOARD (modal) ── */}
      {guideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setGuideOpen(false)} aria-hidden />
          <div role="dialog" aria-modal="true" aria-label="Storage size guide" className="relative flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-warm-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5">
              <div>
                <h3 className="track-tight text-[1.375rem] font-black text-black">Storage size guide</h3>
                <p className="mt-0.5 text-[0.875rem] text-stone">Find the space that fits — every size at {f.short}.</p>
              </div>
              <button onClick={() => setGuideOpen(false)} aria-label="Close size guide" className="btn-spring grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/[0.06] text-black hover:bg-black/[0.12]"><X className="h-5 w-5" aria-hidden /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SIZE_ART.map((s) => (
                  <div key={s.key} className="rounded-xl border border-black/[0.06] bg-warm-white p-4 shadow-card">
                    <div className="grid h-28 place-items-center overflow-hidden rounded-lg" style={{ background: s.tint }}>
                      <SizeArt artKey={s.key} className="h-full w-full" />
                    </div>
                    <p className="mt-3 text-[1.25rem] font-black tracking-[-0.02em] text-black">{s.size.replace(/'/g, '')}</p>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-stone">{s.label}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-stone">{s.sqft} sq ft</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] px-6 py-4">
              <p className="text-[0.8125rem] text-stone">Still unsure? Our team can help you pick the right fit.</p>
              <button onClick={() => setGuideOpen(false)} className="btn-spring shadow-cta rounded-xl bg-orange px-5 py-2.5 font-bold text-warm-white">Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
