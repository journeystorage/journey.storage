'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Menu,
  ChevronDown,
  PackageOpen,
  Camera,
  Send,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Check,
  MapPin,
  Phone,
  Upload,
  X,
  ArrowRight,
  Plus,
} from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import MarqueeBanner from '@/components/sections/MarqueeBanner'
import { MOVEOUT_PROPERTIES } from '@/lib/moveout-properties'

/* ── How move-out works ──────────────────────────────────────────── */
const STEPS = [
  { Icon: PackageOpen, num: '01', title: 'Empty your space', body: 'Clear everything out and give it a quick sweep. Broom-clean, nothing left behind.' },
  { Icon: Camera, num: '02', title: 'Snap a photo', body: 'Take one clear photo of the empty unit — that’s your proof, and your peace of mind.' },
  { Icon: Send, num: '03', title: 'Submit your notice', body: 'Fill in your unit and date below, attach the photo, and send. Takes under a minute.' },
  { Icon: Lock, num: '04', title: 'Access turns off', body: 'We confirm in seconds. Billing stops, your access ends, and you’re officially done.' },
]

/* ── What we need (reassurance cards) ────────────────────────────── */
const NEED = [
  { Icon: PackageOpen, title: 'A fully empty unit', body: 'Everything removed and swept clean. Leave it the way you’d want to find it.' },
  { Icon: Camera, title: 'One clear photo', body: 'A single well-lit shot of the empty space is all the proof we need.' },
  { Icon: ShieldCheck, title: 'Your unit details', body: 'Your facility and unit number so we can match your notice to the right space.' },
]

/* ── FAQ ─────────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'When does my billing stop?', a: 'The moment we confirm your unit is empty. Submit your move-out with a photo and you won’t be charged for the next cycle. No notice period, no trailing fees.' },
  { q: 'How much notice do I need to give?', a: 'None. Journey is month-to-month with no lock-in. Empty your space and submit whenever you’re ready — same day is fine.' },
  { q: 'What counts as "empty"?', a: 'Everything removed and the floor swept clean. No furniture, no boxes, no trash. Leave it broom-clean and you’re set.' },
  { q: 'Why do you need a photo?', a: 'One clear photo of the empty unit lets us confirm and close out your space instantly — no in-person inspection, no waiting on an office visit. It protects you, too.' },
  { q: 'When does my access turn off?', a: 'Right after we confirm. Your digital access credential is deactivated automatically, so there’s nothing to return and no keys to drop off.' },
  { q: 'Can I change my mind after submitting?', a: 'If you haven’t moved out yet, just email us at hello@journey.storage and we’ll cancel the notice. Once access is turned off, you’d simply rent again — no penalty either way.' },
]

const ECO_LINKS = [
  { name: 'Storage', desc: 'Self-storage built for life in motion', href: 'https://journey.storage', current: true },
  { name: 'Advisory', desc: 'Consulting & operations', href: 'https://advisory.journey.storage', current: false },
  { name: 'Direct', desc: 'Investment platform', href: 'https://direct.journey.storage', current: false },
]

/* ── Form validation ─────────────────────────────────────────────── */
const moveOutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  unit: z.string().min(1, 'Unit number is required'),
  moveout_date: z.string().min(1, 'Pick a move-out date'),
  notes: z.string().optional(),
})
type MoveOutForm = z.infer<typeof moveOutSchema>

const MAX_PHOTO_BYTES = 12 * 1024 * 1024

export default function MoveOutPage() {
  const [scrolled, setScrolled] = useState(false)
  const [ecoOpen, setEcoOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const ecoRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const selectedProperty = MOVEOUT_PROPERTIES.find((p) => p.slug === selectedSlug) ?? null

  const selectProperty = (slug: string) => {
    setSelectedSlug(slug)
    // Reveal + scroll the details form into view after it mounts.
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MoveOutForm>({
    resolver: zodResolver(moveOutSchema),
  })

  // Header scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ecosystem dropdown: click-outside + escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ecoRef.current && !ecoRef.current.contains(e.target as Node)) setEcoOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setEcoOpen(false) }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const onPickPhoto = (file: File | null) => {
    setPhotoError(null)
    if (!file) { setPhoto(null); return }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('That image is over 12 MB — please choose a smaller one.')
      return
    }
    setPhoto(file)
  }

  const onSubmit = async (data: MoveOutForm) => {
    setError(false)
    if (!selectedProperty) {
      setError(true)
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (!photo) {
      setPhotoError('A photo of your empty unit is required.')
      return
    }
    try {
      const body = new FormData()
      Object.entries(data).forEach(([k, v]) => body.append(k, v ?? ''))
      body.append('property_slug', selectedProperty.slug)
      body.append('property', selectedProperty.name)
      body.append('photo', photo)
      body.append('website', '') // honeypot

      const res = await fetch('/api/moveout', { method: 'POST', body })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)

      if (typeof window !== 'undefined') {
        const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
        if (Array.isArray(dl)) dl.push({ event: 'moveout_submitted', form_source: 'moveout-request' })
      }
      setSubmitted(true)
    } catch {
      setError(true)
    }
  }

  return (
    <main className="bg-black text-warm-white" style={{ fontFamily: "var(--font-lato), 'Lato', system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <header
        className={[
          'js-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
          scrolled ? 'scrolled' : '',
        ].join(' ')}
      >
        <nav className="mx-auto flex h-[64px] max-w-content items-center justify-between px-5 lg:h-[72px] lg:px-16" aria-label="Main navigation">
          <a href="/" className="relative block min-w-[140px] lg:min-w-[180px]" aria-label="Journey.Storage home">
            <Image
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage™ logo"
              width={180}
              height={40}
              className="w-[140px] lg:w-[180px]"
              style={{ height: 'auto' }}
              priority
            />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            <a href="/#locations" className="text-body-sm font-bold transition-opacity duration-150 hover:opacity-70 text-warm-white">Locations</a>
            <a href="/size-guide" className="text-body-sm font-bold transition-opacity duration-150 hover:opacity-70 text-warm-white">Size Guide</a>
            <a href="/#about" className="text-body-sm font-bold transition-opacity duration-150 hover:opacity-70 text-warm-white">About Us</a>

            <div ref={ecoRef} className={`eco-menu ${ecoOpen ? 'open' : ''}`} style={{ marginLeft: 96 }}>
              <button
                type="button"
                aria-expanded={ecoOpen}
                aria-haspopup="true"
                onClick={(e) => { e.stopPropagation(); setEcoOpen((o) => !o) }}
                className="eco-trigger flex items-center gap-1 text-body-sm font-bold transition-opacity duration-150 hover:opacity-70 text-warm-white"
              >
                Ecosystem
                <ChevronDown size={16} className="eco-chevron" aria-hidden="true" />
              </button>
              <div className="eco-panel">
                <div className="eco-card" role="menu">
                  {ECO_LINKS.map((l) => (
                    <a
                      key={l.name}
                      href={l.href}
                      role="menuitem"
                      aria-current={l.current ? 'page' : undefined}
                      className={`eco-row ${l.current ? 'eco-current' : ''}`}
                    >
                      <span className="flex flex-col">
                        <span className="eco-row-name">{l.name}</span>
                        <span className="eco-row-desc">{l.desc}</span>
                      </span>
                      {l.current && <span className="eco-here">Here</span>}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <a
              href="/#waitlist"
              className="inline-flex items-center justify-center gap-2 rounded-xl text-body font-bold min-h-[44px] !py-3 !px-6 transition-all duration-200 ease-out bg-orange text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)] hover:brightness-[1.1] hover:shadow-[0_4px_16px_rgba(232,98,42,0.4)] hover:-translate-y-px active:translate-y-0 no-underline"
            >
              Rent a Space
            </a>
          </div>

          <a href="#moveout-form" className="lg:hidden rounded-lg p-2 transition-all duration-300 text-warm-white bg-black/40 backdrop-blur-sm" aria-label="Start move-out">
            <Menu size={22} aria-hidden="true" />
          </a>
        </nav>
      </header>

      {/* spacer for fixed header */}
      <div className="h-[64px] lg:h-[72px]" aria-hidden="true" />

      {/* ── Ticker ── */}
      <MarqueeBanner />

      {/* ── Hero ── */}
      <section className="relative bg-black pt-8 pb-10 md:pt-10 md:pb-14 lg:pt-10 lg:pb-16 overflow-hidden">
        <div className="relative mx-3 md:mx-6 lg:mx-10 rounded-[24px] md:rounded-[32px] pt-16 pb-14 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20 overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
          <div className="pointer-events-none absolute inset-x-0 top-6 md:top-3 lg:top-1 z-[1] select-none overflow-hidden flex justify-center" aria-hidden="true">
            <span className="text-[5.5rem] md:text-[10rem] lg:text-[14rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap tracking-tight">MOVE OUT</span>
          </div>

          <div className="relative z-[2] mx-auto max-w-[760px] px-5 md:px-8 lg:px-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Move-out</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.95] tracking-tight">
              Moving out is<br /><span className="font-light text-black/40">the easy part.</span>
            </h1>
            <p className="mx-auto mt-[18px] max-w-[560px] text-center text-[16px] md:text-[17px] leading-[1.6] text-black/65">
              No notice periods, no office visits, no waiting on hold. Empty your space, snap a photo, submit it below, and your access turns off the moment we confirm.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <a
                href="#moveout-form"
                className="hero-cta inline-flex items-center gap-3 rounded-full text-xs font-bold uppercase tracking-[0.18em] no-underline"
                style={{ background: '#181818', color: '#f5f0e8', padding: '16px 32px' }}
              >
                Start your move-out
                <ArrowRight size={15} className="hero-cta-arrow" aria-hidden="true" />
              </a>
              <p className="text-[0.78rem] font-medium text-black/45">Takes under a minute · No fees to leave</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How move-out works ── */}
      <section id="how-it-works" className="grain relative overflow-hidden bg-black pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 25%, rgba(232,98,42,0.04), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="mb-16 lg:mb-24 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">How it works</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
              Four steps,<br /><span className="font-light text-warm-white/40">then you&apos;re done.</span>
            </h2>
          </div>

          {/* Desktop timeline */}
          <div className="relative hidden lg:block">
            <div className="absolute left-[12%] right-[12%] top-[32px] z-0">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-warm-white/10 to-transparent" />
            </div>
            <div className="relative z-10 grid grid-cols-4 gap-6">
              {STEPS.map(({ Icon, num, title, body }) => (
                <div key={num} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                    <Icon size={26} strokeWidth={1.5} className="text-warm-white/70" aria-hidden="true" />
                  </div>
                  <span className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">{num}</span>
                  <h3 className="mt-3 text-base font-bold leading-tight text-warm-white">{title}</h3>
                  <p className="mt-2 max-w-[200px] text-[0.8125rem] leading-[1.6] text-warm-white/40">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile stacked */}
          <div className="lg:hidden flex flex-col gap-8">
            {STEPS.map(({ Icon, num, title, body }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                  <Icon size={22} strokeWidth={1.5} className="text-warm-white/70" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">{num}</span>
                  <h3 className="mt-1 text-base font-bold leading-tight text-warm-white">{title}</h3>
                  <p className="mt-1.5 text-[0.875rem] leading-[1.6] text-warm-white/40">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Move-out form (the primary action) ── */}
      <section id="moveout-form" className="relative bg-black px-3 md:px-6 lg:px-10 pt-4 pb-20 lg:pb-28">
        <div className="grain relative mx-auto max-w-[1040px] rounded-[24px] md:rounded-[32px] overflow-hidden" style={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(245,240,232,0.07)' }}>
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(232,98,42,0.07), transparent)' }} />
          <div className="relative z-10 px-6 md:px-12 py-14 md:py-16 lg:py-20">
            {!submitted ? (
              <>
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <div className="h-px w-8 bg-orange" />
                    <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Submit your notice</span>
                    <div className="h-px w-8 bg-orange" />
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black text-warm-white leading-[1.0] tracking-tight">
                    Tell us you&apos;re moving out.
                  </h2>
                  <p className="mt-4 mx-auto max-w-[460px] text-[0.95rem] leading-[1.6] text-warm-white/55">
                    Pick your location, add your details and a photo of the empty unit, and we&apos;ll close out your space — usually within seconds.
                  </p>
                </div>

                {/* Step 1 — location picker */}
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange text-[0.72rem] font-black text-warm-white">1</span>
                  <span className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-warm-white/70">Which location are you moving out of?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOVEOUT_PROPERTIES.map((p) => {
                    const active = selectedSlug === p.slug
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => selectProperty(p.slug)}
                        aria-pressed={active}
                        className={`loc-card group relative text-left rounded-2xl overflow-hidden bg-white transition-all duration-200 ${active ? 'ring-2 ring-orange border-transparent' : 'border border-black/[0.06]'} ${selectedSlug && !active ? 'opacity-55 hover:opacity-100' : ''}`}
                      >
                        <div className="relative h-36 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={`${p.name} facility`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
                          {p.badge && (
                            <span className="absolute left-3 top-3 rounded-full bg-orange px-2.5 py-1 text-[0.68rem] font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.35)]">{p.badge}</span>
                          )}
                          {active && (
                            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-warm-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                              <Check size={16} strokeWidth={3} aria-hidden="true" />
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="text-[1.05rem] font-black text-black leading-snug tracking-tight">{p.name}</h4>
                          <p className="mt-2 flex items-start gap-1.5 text-[0.83rem] text-black/55 leading-snug">
                            <MapPin size={14} className="mt-[2px] text-orange flex-shrink-0" aria-hidden="true" />
                            <span>{p.street}<br />{p.cityState}</span>
                          </p>
                          <p className="mt-2 flex items-center gap-1.5 text-[0.83rem] font-bold text-black/70">
                            <Phone size={13} className="text-orange flex-shrink-0" aria-hidden="true" />
                            {p.phone}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {!selectedProperty && (
                  <p className="mt-5 text-center text-[0.85rem] text-warm-white/40">Select your location above to continue.</p>
                )}

                {/* Step 2 — details form (revealed on selection) */}
                {selectedProperty && (
                <div ref={formRef} className="mt-12 scroll-mt-24">
                  <div className="mb-6 flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange text-[0.72rem] font-black text-warm-white">2</span>
                    <span className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-warm-white/70">Your move-out details</span>
                  </div>

                  {/* Selected-location summary */}
                  <div className="mx-auto mb-6 flex max-w-[460px] items-center justify-between gap-3 rounded-xl border border-orange/30 bg-orange/[0.08] px-4 py-3">
                    <span className="flex items-center gap-2.5 min-w-0">
                      <MapPin size={16} className="text-orange flex-shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-warm-white/45">Moving out of</span>
                        <span className="block truncate text-[0.9rem] font-bold text-warm-white">{selectedProperty.name} · {selectedProperty.street}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(null)}
                      className="flex-shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-warm-white/50 hover:text-orange transition-colors"
                    >
                      Change
                    </button>
                  </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[460px] flex flex-col gap-4" noValidate>
                  <Input label="Full name" placeholder="Your full name" required onDark {...register('name')} error={errors.name?.message} />
                  <Input label="Email" type="email" placeholder="you@email.com" required onDark {...register('email')} error={errors.email?.message} />
                  <Input label="Unit number" placeholder="e.g. B-114" required onDark {...register('unit')} error={errors.unit?.message} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Move-out date" type="date" required onDark style={{ colorScheme: 'dark' }} {...register('moveout_date')} error={errors.moveout_date?.message} />
                    <Input label="Phone" type="tel" placeholder="(555) 000-0000" onDark {...register('phone')} error={errors.phone?.message} />
                  </div>

                  {/* Photo dropzone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-body-sm font-bold text-warm-white">
                      Photo of the empty unit<span className="text-orange ml-1" aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
                    />
                    {!photo ? (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="photo-drop flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-stone/40 bg-white/[0.03] px-4 py-8 text-center cursor-pointer"
                      >
                        <Upload size={22} className="text-warm-white/45" aria-hidden="true" />
                        <span className="text-[0.9rem] font-bold text-warm-white/80">Add a photo</span>
                        <span className="text-[0.75rem] text-warm-white/40">Tap to take or upload · JPG or PNG, up to 12 MB</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-3 rounded-sm border border-stone/30 bg-white/[0.06] px-4 py-3.5">
                        <span className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2 size={18} className="text-orange flex-shrink-0" aria-hidden="true" />
                          <span className="truncate text-[0.85rem] text-warm-white/80">{photo.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = '' }}
                          className="flex-shrink-0 text-warm-white/40 hover:text-orange transition-colors"
                          aria-label="Remove photo"
                        >
                          <X size={18} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    {photoError && <p className="text-caption text-[#E8865C]" role="alert">{photoError}</p>}
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="moveout-notes" className="text-body-sm font-bold text-warm-white">Anything we should know?</label>
                    <textarea
                      id="moveout-notes"
                      rows={3}
                      placeholder="Optional — questions, special circumstances, forwarding details..."
                      className="w-full rounded-sm px-4 py-3.5 text-body font-normal placeholder:text-stone transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-0 bg-white/[0.06] text-warm-white border border-stone/30 focus:border-orange resize-none"
                      {...register('notes')}
                    />
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                  <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-3 w-full">
                    {isSubmitting ? 'Submitting...' : 'Submit move-out'}
                  </Button>
                  {error && (
                    <p className="text-caption text-[#E8865C]" role="alert">
                      Something went wrong submitting your move-out. Please try again, or email us at hello@journey.storage.
                    </p>
                  )}
                  <p className="text-center text-[0.72rem] leading-[1.5] text-warm-white/35">
                    By submitting, you confirm the unit is empty and ready for us to close out.
                  </p>
                </form>
                </div>
                )}
              </>
            ) : (
              <div className="py-12 md:py-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-orange/30 bg-orange/10">
                  <CheckCircle2 size={30} className="text-orange" aria-hidden="true" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-warm-white tracking-tight">You&apos;re all set.</h3>
                <p className="mx-auto mt-4 max-w-[420px] text-[0.95rem] leading-[1.6] text-warm-white/55">
                  We&apos;ve got your move-out notice. We&apos;ll confirm your unit is empty and turn off your access — you&apos;ll get an email the moment it&apos;s done.
                </p>
                <p className="mt-7 text-subhead font-light italic text-stone">Thanks for storing with Journey.</p>
                <a
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-warm-white/55 hover:text-orange no-underline transition-colors"
                >
                  Back to home <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── What we need ── */}
      <section className="grain relative overflow-hidden bg-black py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(232,98,42,0.03), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="mb-14 lg:mb-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Before you go</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
              All we need<br /><span className="font-light text-warm-white/40">to close it out.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            {NEED.map(({ Icon, title, body }) => (
              <div key={title} className="feat-card rounded-2xl border p-7" style={{ borderColor: 'rgba(245,240,232,0.07)', background: 'rgba(245,240,232,0.015)' }}>
                <div className="feat-icon flex h-12 w-12 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                  <Icon size={22} strokeWidth={1.5} className="text-warm-white/70" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-warm-white">{title}</h3>
                <p className="mt-2 text-sm leading-[1.65] text-warm-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="grain relative overflow-hidden bg-black pt-0 pb-20 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 20%, rgba(232,98,42,0.04), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="mb-14 lg:mb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">FAQ</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
              Moving out?<br /><span className="font-light text-warm-white/30">No surprises.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-[700px]">
            <div className="border-t border-warm-white/[0.06]">
              {FAQS.map((f, i) => {
                const open = openFaq === i
                return (
                  <div key={f.q} className={`faq-item border-b border-warm-white/[0.06] ${open ? 'open' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="faq-toggle flex w-full items-center justify-between gap-4 py-6 text-left cursor-pointer group"
                      aria-expanded={open}
                    >
                      <span className="faq-q text-base md:text-lg font-bold transition-colors duration-200 text-warm-white/65 group-hover:text-warm-white/85">{f.q}</span>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200 bg-warm-white/[0.06] group-hover:bg-warm-white/[0.1]">
                        <Plus size={14} className="faq-plus" aria-hidden="true" />
                      </div>
                    </button>
                    <div className="faq-answer">
                      <div className="faq-answer-inner">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final note ── */}
      <section className="relative bg-black px-3 md:px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="relative mx-auto max-w-[1340px] rounded-[24px] md:rounded-[32px] overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-[1] flex justify-center overflow-hidden select-none" aria-hidden="true">
            <span className="text-[8rem] md:text-[14rem] lg:text-[18rem] font-black uppercase leading-none text-black/[0.025] whitespace-nowrap tracking-tight">JOURNEY</span>
          </div>
          <div className="relative z-[2] px-6 md:px-10 py-16 md:py-20 lg:py-24 text-center max-w-[640px] mx-auto">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Still here for you</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-[1.0] tracking-tight">Need a hand on your way out?</h2>
            <p className="mt-5 mx-auto max-w-[480px] text-base leading-[1.6] text-black/60">
              Whether it&apos;s a question about your final bill or you&apos;re not quite ready to leave, we&apos;re a message away.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <a href="#moveout-form" className="cta-btn inline-flex items-center gap-3 rounded-full text-xs font-bold uppercase tracking-[0.18em] no-underline" style={{ background: '#181818', color: '#f5f0e8', padding: '16px 32px' }}>
                Submit my move-out
                <svg className="cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a href="mailto:hello@journey.storage?subject=Move-out%20question" className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-black/55 hover:text-black no-underline" style={{ borderBottom: '1px solid rgba(0,0,0,0.15)', paddingBottom: 2, transition: 'color .2s ease, border-color .2s ease' }}>
                Or email our team →
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .js-header {
          background: transparent;
          backdrop-filter: none;
          border-bottom: 1px solid transparent;
          transition: background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;
        }
        .js-header.scrolled {
          background: rgba(24, 24, 24, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(245, 240, 232, 0.06);
        }

        .hero-cta { transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease; }
        .hero-cta:hover { transform: translateY(-2px); background-color: #1f1f1f; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25); }
        .hero-cta:hover .hero-cta-arrow { transform: translateX(4px); }
        .hero-cta-arrow { transition: transform 0.25s ease; }

        .photo-drop { transition: border-color 0.2s ease, background-color 0.2s ease; }
        .photo-drop:hover { border-color: rgba(232, 98, 42, 0.5); background-color: rgba(245, 240, 232, 0.05); }
        .photo-drop:focus-visible { outline: 2px solid var(--color-orange); outline-offset: 2px; }

        .loc-card { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; cursor: pointer; }
        .loc-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.38); }
        .loc-card:focus-visible { outline: 2px solid var(--color-orange); outline-offset: 3px; }
        .loc-card[aria-pressed='true'] { box-shadow: 0 10px 26px rgba(232, 98, 42, 0.25); }

        .feat-card { transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease; }
        .feat-card:hover { transform: translateY(-3px); background-color: rgba(245, 240, 232, 0.03); border-color: rgba(245, 240, 232, 0.12); }
        .feat-icon { transition: background-color 0.3s ease, border-color 0.3s ease; }
        .feat-card:hover .feat-icon { background-color: rgba(232, 98, 42, 0.08); border-color: rgba(232, 98, 42, 0.3); }
        .feat-card:hover .feat-icon svg { color: rgb(232, 98, 42); }

        .cta-btn { transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease; }
        .cta-btn:hover { transform: translateY(-2px); background-color: #1f1f1f; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35); }
        .cta-btn:hover .cta-arrow { transform: translateX(4px); }
        .cta-arrow { transition: transform 0.25s ease; }

        .faq-answer { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease, opacity 0.25s ease; }
        .faq-answer-inner { padding: 0 0 26px 0; max-width: 600px; }
        .faq-answer p { color: rgba(245, 240, 232, 0.55); font-size: 0.95rem; line-height: 1.65; margin: 0; }
        .faq-item.open .faq-answer { max-height: 360px; opacity: 1; }
        .faq-plus { transition: transform 0.3s ease; }
        .faq-item.open .faq-plus { transform: rotate(45deg); }
        .faq-item.open .faq-q { color: rgba(245, 240, 232, 0.95); }

        .eco-menu { position: relative; }
        .eco-trigger { background: none; border: none; cursor: pointer; }
        .eco-panel {
          position: absolute; top: 100%; right: 0; width: 260px; margin-top: 14px;
          opacity: 0; visibility: hidden; transform: translateY(4px);
          transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
          z-index: 50; pointer-events: none;
        }
        .eco-menu.open .eco-panel { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
        .eco-card {
          border-radius: 12px; padding: 8px; background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(245, 240, 232, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        .eco-chevron { transition: transform 0.25s ease; }
        .eco-menu.open .eco-chevron { transform: rotate(180deg); }
        .eco-row {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
          padding: 12px 16px; border-radius: 8px; text-decoration: none; transition: background-color 0.15s ease;
        }
        .eco-row .eco-row-name { font-size: 0.875rem; font-weight: 700; line-height: 1.3; transition: color 0.15s ease; }
        .eco-row .eco-row-desc { font-size: 0.7rem; font-weight: 400; line-height: 1.35; margin-top: 2px; transition: color 0.15s ease; }
        .eco-row.eco-current { background: rgba(232, 98, 42, 0.08); }
        .eco-row.eco-current .eco-row-name { color: rgb(232, 98, 42); }
        .eco-row.eco-current .eco-row-desc { color: rgba(232, 98, 42, 0.6); }
        .eco-row:not(.eco-current) .eco-row-name { color: rgba(245, 240, 232, 0.8); }
        .eco-row:not(.eco-current) .eco-row-desc { color: rgba(245, 240, 232, 0.4); }
        .eco-row:not(.eco-current):hover { background: rgba(245, 240, 232, 0.06); }
        .eco-row:not(.eco-current):hover .eco-row-name { color: rgba(245, 240, 232, 1); }
        .eco-here { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: rgb(232, 98, 42); margin-top: 4px; flex-shrink: 0; }
      `}</style>
    </main>
  )
}
