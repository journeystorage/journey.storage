'use client'

import { Search, MapPin, Phone, CheckCircle2, CalendarDays, Zap, Check, Menu } from 'lucide-react'

const SCOPED_CSS = `
#rentaspace .track-tight{letter-spacing:-.03em}
#rentaspace .track-tighter{letter-spacing:-.04em}
#rentaspace .grain::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");mix-blend-mode:overlay}
#rentaspace .shadow-card{box-shadow:0 1px 2px rgba(24,24,24,.04),0 12px 32px -12px rgba(24,24,24,.14)}
#rentaspace .shadow-cta{box-shadow:0 2px 8px rgba(232,98,42,.3)}
#rentaspace .btn-spring{transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s cubic-bezier(.22,1,.36,1),filter .2s ease}
#rentaspace .btn-spring:hover{transform:translateY(-1px);filter:brightness(1.06)}
#rentaspace .btn-spring:active{transform:translateY(0)}
#rentaspace .card-spring{box-shadow:0 1px 2px rgba(24,24,24,.04),0 12px 32px -12px rgba(24,24,24,.14);transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s cubic-bezier(.22,1,.36,1)}
#rentaspace .card-spring:hover{transform:translateY(-4px);box-shadow:0 2px 4px rgba(24,24,24,.06),0 24px 48px -16px rgba(232,98,42,.22)}
`

const phoneIcon = (cls: string) => <Phone className={cls} strokeWidth={2} aria-hidden />

export default function RentASpaceView() {
  return (
    <div id="rentaspace" className="bg-warm-white text-black antialiased">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* ── NAV ── */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <nav className="mx-auto flex h-[72px] max-w-content items-center justify-between px-5 lg:px-16">
          <a href="#" className="min-w-[150px] lg:min-w-[180px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™" className="w-[150px] lg:w-[180px]" style={{ height: 'auto' }} />
          </a>
          <div className="hidden items-center gap-8 lg:flex">
            <a href="#locations" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">Locations</a>
            <a href="/size-guide" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">Size Guide</a>
            <a href="/#about" className="text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">About Us</a>
            <a href="tel:+18175790607" className="flex items-center gap-2 text-[0.9375rem] font-bold text-warm-white transition-opacity hover:opacity-70">
              {phoneIcon('h-4 w-4')}
              (817) 579-0607
            </a>
            <a href="#" className="btn-spring rounded-full border-2 border-warm-white/80 px-5 py-2 text-[0.9375rem] font-bold text-warm-white hover:bg-warm-white hover:text-black">Pay Bill</a>
          </div>
          <button className="text-warm-white lg:hidden" aria-label="Menu">
            <Menu className="h-7 w-7" strokeWidth={2} aria-hidden />
          </button>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="grain relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/granbury/hero-interior.webp" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-charcoal/40 mix-blend-multiply" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(24,24,24,0.78) 0%, rgba(24,24,24,0.55) 42%, rgba(24,24,24,0.88) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 70% at 50% 45%, rgba(24,24,24,0.45) 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 8%, rgba(232,98,42,0.22) 0%, transparent 55%)' }} />
        </div>

        <div className="relative mx-auto max-w-content px-5 pb-24 pt-[150px] lg:px-16 lg:pb-28 lg:pt-[188px]">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-block text-[0.8125rem] font-bold uppercase tracking-[0.22em] text-terracotta">Clean · Secure · Month-to-month</span>
            <h1 className="track-tighter text-[2.75rem] font-black leading-[0.98] text-warm-white sm:text-[3.75rem] lg:text-[4.25rem]">
              Space to move on.
            </h1>
            <p className="mt-5 text-[1.0625rem] font-light leading-relaxed text-warm-white/85 lg:text-[1.25rem]">
              Storage built for people in motion — not for boxes sitting still. Find a clean, secure space near you and reserve online in minutes.
            </p>

            <form className="mx-auto mt-9 max-w-xl" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-stretch gap-2 rounded-2xl bg-warm-white p-2 shadow-[0_20px_60px_-20px_rgba(24,24,24,0.6)]">
                <div className="flex flex-1 items-center gap-3 pl-4">
                  <MapPin className="h-5 w-5 shrink-0 text-orange" strokeWidth={2} aria-hidden />
                  <input type="text" placeholder="Enter your ZIP or city" aria-label="Search by ZIP or city" className="w-full bg-transparent py-3 text-[1.0625rem] text-black placeholder:text-stone focus:outline-none" />
                </div>
                <button type="submit" className="btn-spring shadow-cta flex shrink-0 items-center gap-2 rounded-xl bg-orange px-6 py-3 font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">
                  <Search className="h-5 w-5" strokeWidth={2.2} aria-hidden />
                  <span className="hidden sm:inline">Find spaces</span>
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.875rem] text-warm-white/70">
                <span>Popular sizes:</span>
                <button type="button" className="font-bold text-warm-white transition-colors hover:text-terracotta">5×10</button><span className="opacity-40">·</span>
                <button type="button" className="font-bold text-warm-white transition-colors hover:text-terracotta">10×10</button><span className="opacity-40">·</span>
                <button type="button" className="font-bold text-warm-white transition-colors hover:text-terracotta">10×20</button><span className="opacity-40">·</span>
                <button type="button" className="font-bold text-warm-white transition-colors hover:text-terracotta">Climate-controlled</button>
              </div>
            </form>
          </div>
        </div>

        <a href="#locations" className="relative block bg-charcoal py-4 text-center text-[0.9375rem] font-bold tracking-wide text-warm-white transition-colors hover:bg-black">
          See our locations ↓
        </a>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="border-b border-black/[0.06] bg-warm-white">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-4 px-5 py-6 text-center sm:grid-cols-3 lg:px-16">
          <div className="flex items-center justify-center gap-2.5 text-[0.9375rem] font-bold text-charcoal">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-orange" strokeWidth={2} aria-hidden />
            Clear pricing — no hidden fees
          </div>
          <div className="flex items-center justify-center gap-2.5 border-black/[0.06] text-[0.9375rem] font-bold text-charcoal sm:border-x">
            <CalendarDays className="h-5 w-5 shrink-0 text-orange" strokeWidth={2} aria-hidden />
            Month-to-month — we earn your stay
          </div>
          <div className="flex items-center justify-center gap-2.5 text-[0.9375rem] font-bold text-charcoal">
            <Zap className="h-5 w-5 shrink-0 text-orange" strokeWidth={2} aria-hidden />
            Rent online in minutes
          </div>
        </div>
      </div>

      {/* ── LOCATIONS ── */}
      <section id="locations" className="mx-auto max-w-content px-5 py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-orange">Storage without the friction</span>
          <h2 className="track-tight mt-3 text-[2rem] font-black leading-tight text-black lg:text-[2.5rem]">Our Granbury locations</h2>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-stone">Three facilities across Granbury. Pick the one nearest you and reserve online — someone who understands your moment is close by.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* #1 Temple Hall */}
          <article className="card-spring group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.05] bg-white">
            <div className="relative h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/granbury/rs-card-th-aerial.webp" alt="Temple Hall facility aerial" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="shadow-cta absolute left-4 top-4 rounded-full bg-orange px-3 py-1 text-[0.8125rem] font-bold text-warm-white">350+ units</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="track-tight text-[1.25rem] font-black leading-snug text-black">JOURNEY.STORAGE™ — Temple Hall</h3>
              <div className="mt-2 flex items-center gap-2 text-[0.875rem]">
                <span className="inline-flex items-center gap-1.5 font-bold text-sage-green"><span className="h-2 w-2 rounded-full bg-sage-green" />Open today</span>
                <span className="text-stone">· until 5:00 PM</span>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">212 Temple Hall Hwy<br />Granbury, TX 76049</p>
              <a href="tel:+18175790607" className="mt-2 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-black transition-colors hover:text-orange">
                {phoneIcon('h-4 w-4 text-orange')}(817) 579-0607
              </a>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-wide">
                <span className="rounded-full bg-sage-green/15 px-2.5 py-1 text-[#5c8a52]">Climate-controlled</span>
                <span className="rounded-full bg-sand/25 px-2.5 py-1 text-charcoal">Drive-up</span>
                <span className="rounded-full bg-sand/25 px-2.5 py-1 text-charcoal">Gated</span>
              </div>
              <div className="mt-6 flex flex-1 items-end gap-2">
                <a href="#temple-hall" className="btn-spring flex-1 rounded-xl border-2 border-black/85 py-3 text-center font-bold text-black hover:bg-black hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Tour</a>
                <a href="/rentaspace/templehallhwy" className="btn-spring shadow-cta flex-[1.4] rounded-xl bg-orange py-3 text-center font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Rent online</a>
              </div>
            </div>
          </article>

          {/* #2 Western Hills */}
          <article className="card-spring group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.05] bg-white">
            <div className="relative h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/granbury/rs-card-wh-aerial.webp" alt="Western Hills facility aerial" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-charcoal px-3 py-1 text-[0.8125rem] font-bold text-warm-white">100+ units</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="track-tight text-[1.25rem] font-black leading-snug text-black">JOURNEY.STORAGE™ — Western Hills</h3>
              <div className="mt-2 flex items-center gap-2 text-[0.875rem]">
                <span className="inline-flex items-center gap-1.5 font-bold text-sage-green"><span className="h-2 w-2 rounded-full bg-sage-green" />Open today</span>
                <span className="text-stone">· until 5:00 PM</span>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">409 Western Hills Trail<br />Granbury, TX 76049</p>
              <a href="tel:+18175790607" className="mt-2 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-black transition-colors hover:text-orange">
                {phoneIcon('h-4 w-4 text-orange')}(817) 579-0607
              </a>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-wide">
                <span className="rounded-full bg-sand/25 px-2.5 py-1 text-charcoal">Drive-up</span>
                <span className="rounded-full bg-sand/25 px-2.5 py-1 text-charcoal">Roll-up doors</span>
                <span className="rounded-full bg-sand/25 px-2.5 py-1 text-charcoal">Gated</span>
              </div>
              <div className="mt-6 flex flex-1 items-end">
                <a href="/rentaspace/westernhillstrl" className="btn-spring w-full rounded-xl border-2 border-black/85 py-3 text-center font-bold text-black hover:bg-black hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">View spaces</a>
              </div>
            </div>
          </article>

          {/* #3 Cleveland Rd */}
          <article className="card-spring group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.05] bg-white">
            <div className="relative h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/granbury/rs-card-cl-aerial.webp" alt="Cleveland Rd facility aerial" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-charcoal px-3 py-1 text-[0.8125rem] font-bold text-warm-white">Newest</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="track-tight text-[1.25rem] font-black leading-snug text-black">JOURNEY.STORAGE™ — Cleveland Rd</h3>
              <div className="mt-2 flex items-center gap-2 text-[0.875rem]">
                <span className="inline-flex items-center gap-1.5 font-bold text-sage-green"><span className="h-2 w-2 rounded-full bg-sage-green" />Open today</span>
                <span className="text-stone">· until 5:00 PM</span>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">3501 McCreary Rd<br />Granbury, TX 76049</p>
              <a href="tel:+18175790607" className="mt-2 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-black transition-colors hover:text-orange">
                {phoneIcon('h-4 w-4 text-orange')}(817) 579-0607
              </a>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-wide">
                <span className="rounded-full bg-sage-green/15 px-2.5 py-1 text-[#5c8a52]">Climate-controlled</span>
                <span className="rounded-full bg-sand/25 px-2.5 py-1 text-charcoal">Drive-up</span>
                <span className="rounded-full bg-sand/25 px-2.5 py-1 text-charcoal">Cameras</span>
              </div>
              <div className="mt-6 flex flex-1 items-end">
                <a href="/rentaspace/mccrearyrd" className="btn-spring w-full rounded-xl border-2 border-black/85 py-3 text-center font-bold text-black hover:bg-black hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">View spaces</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── TEMPLE HALL SPOTLIGHT ── */}
      <section id="temple-hall" className="border-y border-black/[0.05] bg-white">
        <div className="mx-auto max-w-content px-5 py-20 lg:px-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-orange">Featured facility</span>
              <h2 className="track-tight mt-3 text-[2rem] font-black leading-[1.05] text-black lg:text-[2.5rem]">Not a container.<br />A partner on Temple Hall.</h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">Our flagship Granbury facility: 350+ clean, secure units set on landscaped grounds — from breezy drive-up spaces to fully climate-controlled interior storage. Wide, well-lit aisles, a friendly front office, and a gated perimeter watched around the clock.</p>
              <ul className="mt-6 space-y-3">
                {['Climate-controlled & drive-up units', 'Gated access, 6 AM–10 PM daily', 'Sizes from 5×10 to 10×30'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[1rem] font-bold text-charcoal">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-orange/[0.12] text-orange"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/rentaspace/templehallhwy" className="btn-spring shadow-cta rounded-xl bg-orange px-7 py-3.5 font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Rent a unit here</a>
                <a href="tel:+18175790607" className="btn-spring rounded-xl border-2 border-black/85 px-7 py-3.5 font-bold text-black hover:bg-black hover:text-warm-white">Call (817) 579-0607</a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="shadow-card relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/granbury/rs-gallery-aerial.webp" alt="Aerial of Temple Hall facility" className="h-full w-full object-cover" />
              </div>
              <div className="shadow-card relative aspect-[4/3] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/granbury/rs-gallery-climate.webp" alt="Climate-controlled units" className="h-full w-full object-cover" />
              </div>
              <div className="shadow-card relative aspect-[4/3] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/granbury/rs-gallery-office.webp" alt="Rental office" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOURS / INFO ── */}
      <section className="mx-auto max-w-content px-5 py-16 lg:px-16 lg:py-20">
        <div className="shadow-card grid grid-cols-1 gap-6 rounded-2xl border border-black/[0.05] bg-white p-6 text-center sm:grid-cols-3 lg:p-8">
          <div>
            <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-orange">Office hours</p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-charcoal">Mon–Fri 8:30 AM – 5:00 PM<br />Sat 8:30 AM – 3:00 PM · Sun closed</p>
          </div>
          <div className="border-black/[0.06] sm:border-x">
            <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-orange">Gate access</p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-charcoal">Every day<br />6:00 AM – 10:00 PM</p>
          </div>
          <div>
            <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-orange">Rentals</p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-charcoal">Month-to-month · no deposit<br />Rent &amp; pay online 24/7</p>
          </div>
        </div>
        <p className="mt-6 text-center text-[0.8125rem] italic text-stone/70">Live unit availability &amp; pricing will load from the Tenant Inc API.</p>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 50% 0%, rgba(232,98,42,0.22) 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-content px-5 py-16 text-center lg:px-16 lg:py-20">
          <h2 className="track-tighter text-[2.25rem] font-black leading-[1.02] text-warm-white lg:text-[3rem]">Space to move on.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] font-light text-warm-white/70 lg:text-[1.25rem]">Find your unit in Granbury today. Clear pricing, no lock-in, and a team that gets your moment.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#locations" className="btn-spring shadow-cta rounded-xl bg-orange px-8 py-3.5 font-bold text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">Find a unit</a>
            <a href="tel:+18175790607" className="btn-spring rounded-xl border-2 border-warm-white/70 px-8 py-3.5 font-bold text-warm-white hover:bg-warm-white hover:text-black">Call us</a>
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
