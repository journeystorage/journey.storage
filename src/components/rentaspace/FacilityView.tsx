'use client'

import { useState, useEffect, useCallback, useMemo, useRef, type FormEvent } from 'react'
import { MapPin, Phone, Menu, Star, Check, ChevronRight, ChevronLeft, ChevronDown, X, Ruler, Sparkles } from 'lucide-react'
import { SizeArt, getSizeArt } from '@/lib/sizeArt'
import { openSizeGuide } from '@/components/SizeGuideModal'
import RentFooter from '@/components/rentaspace/RentFooter'
import RentalFlow from '@/components/rentaspace/RentalFlow'
import PayBillFlow from '@/components/rentaspace/PayBillFlow'

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
// Live availability card from GET /api/nectar/spaces/[facility] (preview-only).
type LiveSpace = { id: string; size: string | null; available: number; inStock: boolean; onlinePrice: number | null; fromPrice: number | null; category: string | null }

const SIZE_ART_KEYS = new Set(['5x5', '5x10', '10x10', '10x15', '10x20', '10x30'])
const liveArtKey = (size: string | null): string | null => {
  if (!size) return null
  const k = size.replace(/\s*×\s*/, 'x').toLowerCase()
  return SIZE_ART_KEYS.has(k) ? k : null
}
const liveSqft = (size: string | null): number | null => {
  const m = size?.match(/(\d+)\s*×\s*(\d+)/)
  return m ? Number(m[1]) * Number(m[2]) : null
}
// Tidy raw back-office category names: drop the "Granbury/Ganbury" locale word
// (incl. the back-office typo) and any trailing "#1" group suffix.
const cleanCat = (cat: string | null): string =>
  (cat ? cat.replace(/\bGr?anbury\b/gi, '').replace(/#\s*\d+/g, '').replace(/\s+/g, ' ').trim() : '') || 'Storage'
export type Facility = {
  slug: string
  name: string
  short: string
  formerly?: string
  address: string
  city: string
  phone: string
  tel: string
  rating: string
  reviews: number
  slides: { src: string; alt: string }[]
  promo?: string
  gallery: { thumb: string; full: string; alt: string }[]
  mapQuery: string
  amenities: string[]
  about: string[]
  groups: UnitGroup[]
  faqs: { q: string; a: string }[]
}

const PHONE_TEL = 'tel:+18175790607'

const SCOPED_CSS = `
#facility .track-tight{letter-spacing:-.03em}
#facility .track-tighter{letter-spacing:-.04em}
#facility .shadow-card{box-shadow:0 1px 2px rgba(24,24,24,.04),0 12px 32px -12px rgba(24,24,24,.14)}
#facility .shadow-cta{box-shadow:0 2px 8px rgba(232,98,42,.3)}
#facility .btn-spring{transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s cubic-bezier(.22,1,.36,1),filter .2s ease}
#facility .btn-spring:hover{transform:translateY(-1px);filter:brightness(1.06)}
#facility .btn-spring:active{transform:translateY(0)}
#facility .r-jr{border-radius:20px 4px 4px 4px}
#facility .eyebrow{display:flex;align-items:center;gap:.75rem}
#facility .eyebrow::before{content:'';height:1px;width:2rem;background:var(--color-orange)}
#facility .unit{box-shadow:0 1px 2px rgba(24,24,24,.04),0 10px 26px -14px rgba(24,24,24,.14);transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s cubic-bezier(.22,1,.36,1)}
#facility .unit:hover{transform:translateY(-3px);box-shadow:0 2px 4px rgba(24,24,24,.05),0 22px 44px -18px rgba(232,98,42,.24)}
`

function Nav({ onSizeGuide, onPayBill }: { onSizeGuide: () => void; onPayBill?: () => void }) {
  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex h-[72px] max-w-content items-center justify-between px-5 lg:px-16">
        <a href="https://journey.storage" className="min-w-[150px] lg:min-w-[180px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" className="w-[150px] lg:w-[180px]" style={{ height: 'auto' }} />
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          <a href="/rentaspace" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">Locations</a>
          <button onClick={onSizeGuide} className="cursor-pointer text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">Size Guide</button>
          <a href="/#about" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">About Us</a>
          <a href={PHONE_TEL} className="flex items-center gap-2 text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">
            <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />(817) 579-0607
          </a>
          {onPayBill ? (
            <button onClick={onPayBill} className="btn-spring rounded-full border-2 border-warm-white/80 px-5 py-2 text-[0.9375rem] font-bold text-warm-white hover:bg-warm-white hover:text-black">Pay Bill</button>
          ) : (
            <a href={PHONE_TEL} className="btn-spring rounded-full border-2 border-warm-white/80 px-5 py-2 text-[0.9375rem] font-bold text-warm-white hover:bg-warm-white hover:text-black">Pay Bill</a>
          )}
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

/* Size-guide animation for a space — SVG art shows as a poster; video loads/plays when scrolled into view. */
function SizeVideo({ art, tint }: { art: string; tint: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setShow(true); io.disconnect() } },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative aspect-[3/4] w-[86px] shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-[0_3px_12px_-4px_rgba(24,24,24,0.35)] transition-transform duration-300 ease-out will-change-transform hover:z-30 hover:scale-[1.85] hover:shadow-[0_16px_40px_-10px_rgba(24,24,24,0.5)]" style={{ background: `linear-gradient(165deg, #F5F0E8 0%, ${tint} 100%)` }}>
      <SizeArt artKey={art} className="absolute inset-0 h-full w-full" />
      {show && (
        <video src={`/videos/storage-${art}-sm.webm`} autoPlay muted loop playsInline preload="none" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  )
}

export default function FacilityView({ facility: f }: { facility: Facility }) {
  const [slide, setSlide] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [reserveSize, setReserveSize] = useState<string | null>(null)
  const [reserveStatus, setReserveStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [preview, setPreview] = useState(false)
  const [live, setLive] = useState<{ status: 'off' | 'loading' | 'ok' | 'error'; spaces: LiveSpace[]; error?: string }>({ status: 'off', spaces: [] })
  const [rentalSpace, setRentalSpace] = useState<{ size: string; price: number; category?: string | null } | null>(null)
  const [payBill, setPayBill] = useState(false)
  const n = f.slides.length
  const gLen = f.gallery.length
  const reviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Journey Storage ${f.short} Granbury TX`)}`

  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setSlide((s) => (s + 1) % n), 3000)
    return () => clearInterval(t)
  }, [n])

  const go = useCallback((d: number) => setSlide((s) => (s + d + n) % n), [n])

  // Hidden live-data preview: /rentaspace/<slug>?preview=live pulls real availability
  // from the Nectar API into the page, so you can see the integration render without
  // touching the public page. No-op unless the flag is present.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('preview') === 'live') setPreview(true)
    setLive({ status: 'loading', spaces: [] })
    fetch(`/api/nectar/spaces/${f.slug}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
        return j
      })
      .then((j) => setLive({ status: 'ok', spaces: (j.spaces ?? []) as LiveSpace[] }))
      .catch((e: unknown) => setLive({ status: 'error', spaces: [], error: e instanceof Error ? e.message : String(e) }))
  }, [f.slug])

  // Live availability grouped by category (in-stock, priced), cheapest group first.
  const liveGroups = useMemo(() => {
    if (live.status !== 'ok') return []
    const inStock = live.spaces.filter((s) => s.inStock && s.size && (s.onlinePrice ?? 0) > 0)
    const byCat = new Map<string, LiveSpace[]>()
    for (const s of inStock) {
      const c = cleanCat(s.category)
      const arr = byCat.get(c) ?? []
      arr.push(s)
      byCat.set(c, arr)
    }
    return [...byCat.entries()]
      .map(([category, spaces]) => ({
        category,
        spaces: spaces.sort((a, b) => (a.onlinePrice ?? 0) - (b.onlinePrice ?? 0)),
        min: Math.min(...spaces.map((s) => s.onlinePrice ?? Infinity)),
      }))
      .sort((a, b) => a.min - b.min)
  }, [live])

  useEffect(() => {
    if (lightbox === null) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      else if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % gLen))
      else if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + gLen) % gLen))
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [lightbox, gLen])

  useEffect(() => {
    if (reserveSize === null) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setReserveSize(null) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [reserveSize])

  const openReserve = (size: string) => { setReserveStatus('idle'); setReserveSize(size) }

  async function submitReserve(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) { setReserveStatus('done'); return } // honeypot
    const name = String(fd.get('name') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const email = String(fd.get('email') || '').trim()
    const moveIn = String(fd.get('moveIn') || '').trim()
    const size = String(fd.get('size') || '').trim()
    setReserveStatus('sending')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          form_source: `reserve-${f.slug}`,
          message: `Reserve/hold request — ${f.short}${size ? `, size ${size}` : ''}${moveIn ? `, move-in ${moveIn}` : ''}`,
          facility: f.short, size, move_in: moveIn,
        }),
      })
      const j = await res.json()
      setReserveStatus(j.success ? 'done' : 'error')
    } catch {
      setReserveStatus('error')
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SelfStorage',
    name: `Journey.Storage — ${f.short}`,
    image: `https://journey.storage${f.slides[0]?.src ?? ''}`,
    telephone: '+18175790607',
    url: `https://journey.storage/rentaspace/${f.slug}`,
    priceRange: '$',
    address: { '@type': 'PostalAddress', streetAddress: f.address, addressLocality: 'Granbury', addressRegion: 'TX', postalCode: '76049', addressCountry: 'US' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59', description: 'Gate access' },
    ],
  }

  return (
    <div id="facility" className="bg-warm-white pb-16 text-black antialiased lg:pb-0">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav onSizeGuide={openSizeGuide} onPayBill={preview ? () => setPayBill(true) : undefined} />

      {/* ── HERO CAROUSEL ── */}
      <section className="grain relative h-[460px] overflow-hidden bg-black lg:h-[540px]">
        {f.slides.map((sl, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={sl.src} src={sl.src} alt={i === slide ? sl.alt : ''} className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-charcoal/30 mix-blend-multiply" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(24,24,24,0.60) 0%, rgba(24,24,24,0.25) 45%, rgba(24,24,24,0.88) 100%)' }} />
        {/* Ghost watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-2.5rem] z-[1] flex select-none justify-end overflow-hidden pr-4 lg:pr-16">
          <span className="whitespace-nowrap text-[7rem] font-black uppercase leading-none tracking-tighter text-warm-white/[0.04] lg:text-[14rem]">Storage</span>
        </div>

        <div className="relative mx-auto flex h-full max-w-content flex-col px-5 pt-[104px] lg:px-16 lg:pt-[120px]">
          <nav className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-warm-white/70">
            <a href="/" className="transition-colors hover:text-warm-white">Home</a>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <a href="/rentaspace" className="transition-colors hover:text-warm-white">Rent a Space</a>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-warm-white">{f.short}</span>
          </nav>

          <div className="mt-auto max-w-2xl pb-10">
            <h1 className="track-tighter text-[2.25rem] font-black leading-[1.02] text-warm-white lg:text-[3rem]">{f.name}</h1>
            {f.formerly && <p className="mt-1.5 text-[0.9375rem] font-bold text-warm-white/70">Formerly {f.formerly}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-warm-white transition-colors hover:text-terracotta">
                <Stars /><span className="font-bold underline-offset-4 hover:underline">Read our Google reviews</span>
              </a>
              <a href={`https://www.google.com/maps?q=${encodeURIComponent(f.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-warm-white/90 transition-colors hover:text-terracotta">
                <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />{f.address}, {f.city}
              </a>
            </div>

            {/* facility photo gallery — click to enlarge */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {f.gallery.map((g, i) => (
                <button key={g.thumb} onClick={() => setLightbox(i)} aria-label={`View photo: ${g.alt}`} className="btn-spring relative h-12 w-16 overflow-hidden rounded-lg ring-2 ring-warm-white/40 hover:ring-warm-white lg:h-14 lg:w-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.thumb} alt={g.alt} className="h-full w-full object-cover" />
                </button>
              ))}
              <button onClick={() => setLightbox(0)} className="ml-1 text-[0.8125rem] font-bold text-warm-white underline-offset-4 transition-colors hover:text-terracotta hover:underline">View all photos</button>
            </div>
          </div>
        </div>

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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-white/25 px-3 py-1 text-[0.75rem] font-black uppercase tracking-wide"><Sparkles className="h-3.5 w-3.5" aria-hidden />Limited time</span>
          <span className="text-[1.0625rem] font-black tracking-tight lg:text-[1.25rem]">{f.promo ?? '50% off your first month'}</span>
          <span className="text-[0.9375rem] font-semibold text-warm-white">when you rent online</span>
        </div>
      </div>

      {/* ── MAIN: spaces + sidebar ── */}
      <section className="mx-auto max-w-content px-5 py-12 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <div className="eyebrow"><span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-orange">Rent a space</span></div>
            <h2 className="track-tight mt-3 text-[1.75rem] font-black text-black lg:text-[2.25rem]">Choose your space</h2>
            <p className="mt-2 text-[1.0625rem] leading-relaxed text-stone">Reserve online in minutes — lock in the online rate, move in when you like. Month-to-month, no deposit, no long-term commitment.</p>

            {live.status === 'ok' && liveGroups.length > 0 ? (
              // ── LIVE availability + pricing (real Tenant Inc data) ──
              liveGroups.map((group) => (
                <div key={group.category} className="mt-10">
                  <div className="flex items-baseline justify-between border-b border-black/[0.08] pb-2">
                    <h3 className="text-[1.25rem] font-black text-black">{group.category}</h3>
                    <span className="text-[0.875rem] text-stone">{group.spaces.length} size{group.spaces.length > 1 ? 's' : ''} available</span>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {group.spaces.map((s) => {
                      const artKey = liveArtKey(s.size)
                      const art = artKey ? getSizeArt(artKey) : null
                      const sqft = liveSqft(s.size)
                      const price = s.onlinePrice!
                      return (
                        <div key={s.id} className="unit r-jr flex h-full flex-col border border-black/[0.06] bg-warm-white p-5">
                          <div className="mb-5 flex items-start gap-4">
                            {artKey ? (
                              <SizeVideo art={artKey} tint={art?.tint ?? 'rgba(232,98,42,0.1)'} />
                            ) : (
                              <div className="grid aspect-[3/4] w-[86px] shrink-0 place-items-center rounded-xl text-center shadow-[0_3px_12px_-4px_rgba(24,24,24,0.35)]" style={{ background: 'linear-gradient(165deg, #F5F0E8 0%, rgba(232,98,42,0.12) 100%)' }}>
                                <span className="px-1 text-[0.95rem] font-black leading-tight text-charcoal">{s.size}</span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="whitespace-nowrap text-[1.375rem] font-black tracking-[-0.02em] text-black">{s.size}</h4>
                                  <p className="mt-0.5 text-[0.8125rem] text-stone">{sqft ? `${sqft} sq ft · ` : ''}{group.category}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="leading-none"><span className="text-[1.625rem] font-black text-orange">${price}</span><span className="text-[0.8125rem] font-bold text-stone">/mo online</span></p>
                                  <p className="mt-1 text-[0.6875rem] font-bold text-[#5c8a52]">1st month ${Math.round(price / 2)}</p>
                                </div>
                              </div>
                              <div className="mt-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-green/15 px-2.5 py-1 text-[0.75rem] font-bold text-[#5c8a52]"><span className="h-1.5 w-1.5 rounded-full bg-sage-green" aria-hidden />{s.available} available now</span>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => setRentalSpace({ size: s.size!, price, category: group.category })} className="btn-spring shadow-cta mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-2.5 font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Rent this space<span aria-hidden>→</span></button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              // ── Fallback: curated sizes (while live loads, or if the feed is down) ──
              f.groups.map((group) => (
                <div key={group.category} className="mt-10">
                  <div className="flex items-baseline justify-between border-b border-black/[0.08] pb-2">
                    <h3 className="text-[1.25rem] font-black text-black">{group.category}</h3>
                    <span className="text-[0.875rem] text-stone">{group.blurb}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {group.units.map((u) => {
                      const art = getSizeArt(u.art)
                      return (
                        <div key={u.size} className="unit r-jr flex h-full flex-col border border-black/[0.06] bg-warm-white p-5">
                          <div className="mb-5 flex items-start gap-4">
                            <SizeVideo art={u.art} tint={art?.tint ?? 'rgba(232,98,42,0.1)'} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-[1.375rem] font-black tracking-[-0.02em] text-black">{u.size}</h4>
                                  <p className="mt-0.5 text-[0.8125rem] text-stone">{u.sqft} sq ft · {u.fits}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-stone">In store <span className="line-through">${u.walkIn}</span></p>
                                  <p className="leading-none"><span className="text-[1.625rem] font-black text-orange">${u.online}</span><span className="text-[0.8125rem] font-bold text-stone">/mo online</span></p>
                                  <p className="mt-1 text-[0.6875rem] font-bold text-[#5c8a52]">1st month ${Math.round(u.online / 2)}</p>
                                </div>
                              </div>
                              <div className="mt-3 flex min-h-[3.25rem] flex-wrap content-start gap-1.5">
                                {u.tags.map((t) => (<span key={t} className={`h-fit rounded-full px-2.5 py-1 text-[0.75rem] font-bold ${t === 'Climate-controlled' ? 'bg-sage-green/15 text-[#5c8a52]' : 'bg-sand/25 text-charcoal'}`}>{t}</span>))}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => setRentalSpace({ size: u.size, price: u.online, category: u.tags[0] ?? null })} className="btn-spring shadow-cta mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-2.5 font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Rent this space<span aria-hidden>→</span></button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}

            <p className="mt-8 text-[0.8125rem] italic text-stone/70">Online rates shown — final price is confirmed at checkout. First-month offer applies to new rentals on select sizes.</p>
          </div>

          {/* sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <div className="r-jr overflow-hidden border border-black/[0.06] bg-warm-white shadow-card">
              <iframe title={`Map of Journey.Storage ${f.short}, ${f.address}`} src={`https://www.google.com/maps?q=${encodeURIComponent(f.mapQuery)}&output=embed`} className="h-44 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="p-5">
                <p className="flex items-start gap-2 text-[0.9375rem] font-bold text-black"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" strokeWidth={2} aria-hidden /><span>{f.address}<br /><span className="font-normal text-stone">{f.city}</span></span></p>
                <p className="mt-3 text-[0.8125rem] text-stone"><span className="font-bold text-charcoal">Open 24/7:</span> gate access every day of the year</p>
                <a href={f.tel} className="btn-spring shadow-cta mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3 font-bold text-warm-white"><Phone className="h-4 w-4" strokeWidth={2} aria-hidden />Call {f.phone}</a>
              </div>
            </div>

            <button onClick={openSizeGuide} className="btn-spring r-jr flex w-full items-center justify-between gap-3 border border-black/[0.06] bg-warm-white p-5 text-left shadow-card hover:border-orange/40">
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-orange/[0.12] text-orange"><Ruler className="h-5 w-5" strokeWidth={2} aria-hidden /></span>
                <span><span className="block text-[0.9375rem] font-black text-black">Not sure what fits?</span><span className="block text-[0.8125rem] text-stone">Open the storage size guide</span></span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-orange" aria-hidden />
            </button>

            <div className="r-jr border border-black/[0.06] bg-warm-white p-5 shadow-card">
              <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-orange">Amenities</p>
              <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {f.amenities.map((a) => (<li key={a} className="flex items-center gap-2 text-[0.875rem] text-charcoal"><Check className="h-4 w-4 shrink-0 text-sage-green" strokeWidth={2.5} aria-hidden />{a}</li>))}
              </ul>
            </div>

            <div className="r-jr border border-black/[0.06] bg-warm-white p-5 shadow-card">
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
            <div className="eyebrow"><span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-orange">About this location</span></div>
            <h2 className="track-tight mt-3 text-[1.75rem] font-black leading-tight text-black lg:text-[2.25rem]">Self storage on {f.short}, Granbury.</h2>
            <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-stone">{f.about.map((p, i) => (<p key={i}>{p}</p>))}</div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="grain relative overflow-hidden bg-black">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 50% 0%, rgba(232,98,42,0.22) 0%, transparent 60%)' }} />
        {/* Ghost watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] flex select-none items-center justify-center overflow-hidden">
          <span className="whitespace-nowrap text-[5rem] font-black uppercase leading-none tracking-tighter text-warm-white/[0.03] lg:text-[11rem]">Journey</span>
        </div>
        <div className="relative z-[2] mx-auto max-w-content px-5 py-16 text-center lg:px-16 lg:py-20">
          <div className="eyebrow justify-center"><span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-orange">Space to move on</span></div>
          <h2 className="track-tighter mt-4 text-[2.25rem] font-black leading-[1.02] text-warm-white lg:text-[3rem]">Your space is waiting.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] font-light text-warm-white/70 lg:text-[1.25rem]">Reserve your space at {f.short} today — clear pricing, month-to-month, rented online in minutes.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => openReserve('')} className="btn-spring shadow-cta rounded-sm bg-orange px-8 py-3.5 font-bold text-warm-white">Reserve a space</button>
            <a href={f.tel} className="btn-spring rounded-sm border-2 border-warm-white/70 px-8 py-3.5 font-bold text-warm-white hover:bg-warm-white hover:text-black">Call us</a>
          </div>
        </div>
      </section>

      <RentFooter />

      {/* ── RENTAL FLOW (real online move-in) ── */}
      {rentalSpace && (
        <RentalFlow
          facility={{ slug: f.slug, short: f.short, address: f.address, city: f.city, phone: f.phone, tel: f.tel }}
          space={rentalSpace}
          preview={preview}
          onClose={() => setRentalSpace(null)}
        />
      )}

      {/* ── PAY BILL (preview-only demo) ── */}
      {payBill && (
        <PayBillFlow facility={{ short: f.short, phone: f.phone, tel: f.tel }} onClose={() => setPayBill(false)} />
      )}

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-black/10 bg-warm-white/95 p-3 backdrop-blur lg:hidden">
        <a href={f.tel} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-black/85 py-3 font-bold text-black"><Phone className="h-4 w-4" strokeWidth={2} aria-hidden />Call</a>
        <button onClick={() => openReserve('')} className="shadow-cta flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-orange py-3 font-bold text-warm-white">Reserve a space</button>
      </div>


      {/* ── PHOTO LIGHTBOX ── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => setLightbox(null)} aria-hidden />
          <button onClick={() => setLightbox(null)} aria-label="Close" className="btn-spring absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-warm-white backdrop-blur hover:bg-white/20"><X className="h-6 w-6" aria-hidden /></button>
          {gLen > 1 && (
            <>
              <button onClick={() => setLightbox((i) => (i === null ? i : (i - 1 + gLen) % gLen))} aria-label="Previous photo" className="btn-spring absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-warm-white backdrop-blur hover:bg-white/20"><ChevronLeft className="h-7 w-7" aria-hidden /></button>
              <button onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % gLen))} aria-label="Next photo" className="btn-spring absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-warm-white backdrop-blur hover:bg-white/20"><ChevronRight className="h-7 w-7" aria-hidden /></button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.gallery[lightbox].full} alt={f.gallery[lightbox].alt} className="relative z-10 max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" />
          <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-[0.8125rem] font-bold text-warm-white backdrop-blur">{lightbox + 1} / {gLen}</div>
        </div>
      )}

      {/* ── RESERVE / HOLD MODAL ── */}
      {reserveSize !== null && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReserveSize(null)} aria-hidden />
          <div role="dialog" aria-modal="true" aria-label="Reserve a space" className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/[0.06] bg-warm-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
            <button onClick={() => setReserveSize(null)} aria-label="Close" className="btn-spring absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/[0.06] text-black hover:bg-black/[0.12]"><X className="h-5 w-5" aria-hidden /></button>
            {reserveStatus === 'done' ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-green/20 text-[#5c8a52]"><Check className="h-7 w-7" strokeWidth={3} aria-hidden /></div>
                <h3 className="track-tight mt-4 text-[1.375rem] font-black text-black">You&rsquo;re on the list</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">Thanks! We&rsquo;ll hold a {reserveSize || 'space'} at {f.short} and reach out shortly to finish your rental. Need it now? Call <a href={f.tel} className="font-bold text-orange">{f.phone}</a>.</p>
                <button onClick={() => setReserveSize(null)} className="btn-spring shadow-cta mt-6 rounded-xl bg-orange px-6 py-2.5 font-bold text-warm-white">Done</button>
              </div>
            ) : (
              <form onSubmit={submitReserve} className="px-6 py-6">
                <h3 className="track-tight text-[1.375rem] font-black text-black">Reserve your space</h3>
                <p className="mt-1 text-[0.875rem] text-stone">{reserveSize ? `Hold a ${reserveSize} at ${f.short}` : `Hold a space at ${f.short}`} — no payment now, no obligation.</p>
                <input type="hidden" name="size" value={reserveSize ?? ''} />
                <div className="hidden"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                <div className="mt-5 space-y-3">
                  <input name="name" required placeholder="Full name" className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[0.9375rem] text-black placeholder:text-stone focus:border-orange focus:outline-none" />
                  <input name="phone" required type="tel" placeholder="Phone" className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[0.9375rem] text-black placeholder:text-stone focus:border-orange focus:outline-none" />
                  <input name="email" required type="email" placeholder="Email" className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[0.9375rem] text-black placeholder:text-stone focus:border-orange focus:outline-none" />
                  <label className="block text-[0.8125rem] font-bold text-stone">Preferred move-in date
                    <input name="moveIn" type="date" className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[0.9375rem] font-normal text-black focus:border-orange focus:outline-none" />
                  </label>
                </div>
                {reserveStatus === 'error' && <p className="mt-3 text-[0.8125rem] font-bold text-[#D94A4A]">Something went wrong — please call {f.phone} or try again.</p>}
                <button type="submit" disabled={reserveStatus === 'sending'} className="btn-spring shadow-cta mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3 font-bold text-warm-white disabled:opacity-60">{reserveStatus === 'sending' ? 'Sending…' : 'Hold this space'}</button>
                <p className="mt-3 text-center text-[0.75rem] text-stone">We&rsquo;ll call or text to finish your rental. By submitting you agree to be contacted about your reservation.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
