'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Menu,
  ChevronDown,
  Clock,
  Smartphone,
  ThermometerSun,
  Lock,
  DoorOpen,
  ShieldCheck,
  Search,
  FileText,
  LogOut,
  Plus,
} from 'lucide-react'
import MarqueeBanner from '@/components/sections/MarqueeBanner'

/* ── Size data (the cycling cards) ───────────────────────────────── */
type SizeCard = {
  num: string
  size: string
  label: string
  sqft: number
  accent: string
  tint: string
  title: string
  caption: string
}

const SIZES: SizeCard[] = [
  {
    num: '01', size: "5' × 5'", label: 'STORAGE CLOSET', sqft: 25,
    accent: 'rgb(74, 144, 217)', tint: 'rgba(74,144,217,0.12)',
    title: "5' × 5', fits a storage closet",
    caption: "Just enough room for the things you can't quite let go of.",
  },
  {
    num: '02', size: "5' × 10'", label: 'STUDIO APARTMENT', sqft: 50,
    accent: 'rgb(122, 175, 110)', tint: 'rgba(122,175,110,0.12)',
    title: "5' × 10', fits a studio apartment",
    caption: 'Room for the studio you outgrew, with space to breathe.',
  },
  {
    num: '03', size: "5' × 15'", label: 'ONE-BEDROOM', sqft: 75,
    accent: 'rgb(232, 197, 71)', tint: 'rgba(232,197,71,0.14)',
    title: "5' × 15', fits a one-bedroom apartment",
    caption: 'A clean transition between chapters of life.',
  },
  {
    num: '04', size: "10' × 10'", label: 'TWO BEDROOMS', sqft: 100,
    accent: 'rgb(212, 149, 106)', tint: 'rgba(212,149,106,0.14)',
    title: "10' × 10', fits two small bedrooms",
    caption: 'Two rooms, packed and waiting for what comes next.',
  },
  {
    num: '05', size: "10' × 15'", label: 'TWO-BEDROOM HOME', sqft: 150,
    accent: 'rgb(185, 108, 82)', tint: 'rgba(185,108,82,0.14)',
    title: "10' × 15', fits a two-bedroom home",
    caption: 'Your growth should not wait for square footage.',
  },
  {
    num: '06', size: "10' × 20'", label: 'THREE-BEDROOM HOME', sqft: 200,
    accent: 'rgb(138, 122, 165)', tint: 'rgba(138,122,165,0.14)',
    title: "10' × 20', fits a three-bedroom home",
    caption: 'Big enough for the home you are building toward.',
  },
  {
    num: '07', size: "10' × 30'", label: 'FOUR/FIVE-BEDROOM', sqft: 300,
    accent: 'rgb(93, 138, 133)', tint: 'rgba(93,138,133,0.16)',
    title: "10' × 30', fits a four or five-bedroom home",
    caption: 'A whole life, ready for its next move.',
  },
]

/* ── Comparison table data ───────────────────────────────────────── */
type Unit = { num: string; size: string; sqft: number; cubicFt: number; fits: string }
const UNITS: Unit[] = [
  { num: '01', size: "5' × 5'", sqft: 25, cubicFt: 200, fits: 'Fits a storage closet' },
  { num: '02', size: "5' × 10'", sqft: 50, cubicFt: 400, fits: 'Fits a studio apartment' },
  { num: '03', size: "5' × 15'", sqft: 75, cubicFt: 600, fits: 'Fits a one-bedroom apartment' },
  { num: '04', size: "10' × 10'", sqft: 100, cubicFt: 800, fits: 'Fits two small bedrooms' },
  { num: '05', size: "10' × 15'", sqft: 150, cubicFt: 1200, fits: 'Fits a two-bedroom home' },
  { num: '06', size: "10' × 20'", sqft: 200, cubicFt: 1600, fits: 'Fits a three-bedroom home' },
  { num: '07', size: "10' × 30'", sqft: 300, cubicFt: 2400, fits: 'Fits a four or five-bedroom home' },
]
const fmt = (n: number) => n.toLocaleString('en-US')

/* ── Features ────────────────────────────────────────────────────── */
const FEATURES = [
  { Icon: Clock, title: '24/7 Access', body: 'Drive up to your unit any hour, any day. Gates open automatically with your code. No office hours, no waiting.' },
  { Icon: Smartphone, title: '100% Digital', body: 'Rent, sign, pay, and manage your space from your phone. No paperwork, no in-person visits, ever.' },
  { Icon: ThermometerSun, title: 'Climate Control', body: "Steady temperature and humidity for items that don't tolerate Texas summers. Available on select units." },
  { Icon: Lock, title: 'Smart Locks', body: 'Bluetooth-enabled smart locks open from your phone. No keys to lose, no codes to remember.' },
  { Icon: DoorOpen, title: 'Drive-Up Access', body: 'Pull right up to your unit. Loading and unloading is fast, easy, and out of the weather.' },
  { Icon: ShieldCheck, title: 'Security', body: '24/7 video surveillance, perimeter fencing, gated entry, and well-lit drive aisles. Your stuff stays safe.' },
]

/* ── How it works ────────────────────────────────────────────────── */
const STEPS = [
  { Icon: Search, num: '01', title: 'Find your space', body: 'Browse available spaces and rent online. No phone calls, no office visits.' },
  { Icon: ShieldCheck, num: '02', title: 'Verify in seconds', body: 'Quick digital identity verification. No paperwork, no waiting.' },
  { Icon: FileText, num: '03', title: 'Sign and get your access', body: 'Digital lease. Instant access code delivered to your phone.' },
  { Icon: DoorOpen, num: '04', title: 'Arrive and move in', body: 'Gates open automatically. Your space is ready. Any hour, any day.' },
  { Icon: Smartphone, num: '05', title: "You're in control", body: 'Manage everything from your phone. Pay, upgrade, or move out. Zero friction.' },
  { Icon: LogOut, num: '06', title: 'Easy out', body: "Empty your space, snap a photo, and you're done. Access turns off instantly. No calls, no hassle." },
]

/* ── FAQ ─────────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'When is Journey opening?', a: "We're building our first facilities now. Join the waitlist and we'll notify you the moment we open near you. Early members get priority access." },
  { q: 'How does pricing work?', a: 'Month-to-month. No lock-in contracts, no rate hikes after move-in. You see the price, you pay the price. If you need to leave, you leave. No penalties, no fees.' },
  { q: 'What sizes are available?', a: 'From compact 5×5 closets (~25 sq ft) for boxes and seasonal gear, to 10×25 garage-size spaces (~250 sq ft) that fit an entire household. Mid-range options like 5×10, 10×10, and 10×15 cover everything in between.' },
  { q: 'What types of storage do you offer?', a: 'Self storage, climate-controlled spaces, drive-up access, indoor storage, and vehicle & RV parking. Every facility is designed with digital locks, 24/7 access, and the same quality experience across all space types.' },
  { q: 'How does digital access work?', a: 'No keys, no codes to memorize. You get a digital access credential on your phone. Gates and locks respond to you automatically. Works 24/7, every day of the year.' },
  { q: 'How does move-out work?', a: "Empty your space, snap a photo, and send it through the app. You'll get approval in seconds. Access turns off, and you're done. No calls, no office visits, no waiting." },
]

const ECO_LINKS = [
  { name: 'Storage', desc: 'Self-storage built for life in motion', href: 'https://journey.storage', current: true },
  { name: 'Advisory', desc: 'Consulting & operations', href: 'https://advisory.journey.storage', current: false },
  { name: 'Direct', desc: 'Investment platform', href: 'https://direct.journey.storage', current: false },
]

/* ── Per-size SVG illustration (returns inner SVG markup string) ──── */
function illustration(i: number, a: string): string {
  if (i === 0) {
    return `
      <g transform="translate(150,260)">
        <rect x="-32" y="-30" width="64" height="50" rx="3" fill="none" stroke="${a}" stroke-width="2.5"/>
        <line x1="-32" y1="-10" x2="32" y2="-10" stroke="${a}" stroke-width="2"/>
        <rect x="-26" y="-72" width="50" height="38" rx="3" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.85"/>
        <line x1="-26" y1="-58" x2="24" y2="-58" stroke="${a}" stroke-width="2" opacity="0.85"/>
        <rect x="-20" y="-104" width="40" height="28" rx="3" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.7"/>
      </g>`
  }
  if (i === 1) {
    return `
      <g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
        <rect x="-70" y="-30" width="100" height="42" rx="6"/>
        <rect x="-60" y="-26" width="30" height="20" rx="3" fill="${a}" opacity="0.25" stroke="none"/>
        <line x1="-70" y1="12" x2="-70" y2="22"/>
        <line x1="30" y1="12" x2="30" y2="22"/>
        <rect x="42" y="-22" width="42" height="34" rx="3" opacity="0.85"/>
        <line x1="42" y1="-7" x2="84" y2="-7" opacity="0.85"/>
      </g>`
  }
  if (i === 2) {
    return `
      <g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
        <rect x="-90" y="-50" width="80" height="38" rx="5"/>
        <rect x="-82" y="-46" width="25" height="18" rx="3" fill="${a}" opacity="0.25" stroke="none"/>
        <path d="M -90,18 L -90,-2 Q -90,-8 -84,-8 L -22,-8 Q -16,-8 -16,-2 L -16,18 Z"/>
        <line x1="-72" y1="-8" x2="-72" y2="18" opacity="0.6"/>
        <line x1="-48" y1="-8" x2="-48" y2="18" opacity="0.6"/>
        <rect x="14" y="-30" width="64" height="48" rx="3"/>
        <line x1="14" y1="-6" x2="78" y2="-6"/>
      </g>`
  }
  if (i === 3) {
    return `
      <g transform="translate(150,260)" stroke="${a}" stroke-width="2.5" fill="none">
        <rect x="-80" y="-40" width="86" height="50" rx="6"/>
        <rect x="-72" y="-36" width="32" height="22" rx="3" fill="${a}" opacity="0.3" stroke="none"/>
        <rect x="-72" y="-32" width="32" height="22" rx="3" fill="${a}" opacity="0.3" stroke="none"/>
        <rect x="14" y="-30" width="58" height="40" rx="3"/>
        <line x1="14" y1="-15" x2="72" y2="-15"/>
        <line x1="43" y1="-30" x2="43" y2="10"/>
        <circle cx="43" cy="-23" r="2" fill="${a}"/>
        <circle cx="43" cy="2" r="2" fill="${a}"/>
        <g transform="translate(70,-58)">
          <circle cx="0" cy="0" r="10" opacity="0.5"/>
          <line x1="0" y1="10" x2="0" y2="22"/>
          <line x1="-8" y1="22" x2="8" y2="22"/>
        </g>
      </g>`
  }
  if (i === 4) {
    return `
      <g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
        <path d="M -95,8 L -95,-12 Q -95,-22 -85,-22 L -10,-22 Q 0,-22 0,-12 L 0,8 Z"/>
        <line x1="-72" y1="-22" x2="-72" y2="8" opacity="0.6"/>
        <line x1="-48" y1="-22" x2="-48" y2="8" opacity="0.6"/>
        <line x1="-24" y1="-22" x2="-24" y2="8" opacity="0.6"/>
        <rect x="22" y="-44" width="72" height="42" rx="3"/>
        <line x1="58" y1="-2" x2="58" y2="14" opacity="0.7"/>
        <line x1="46" y1="14" x2="70" y2="14" opacity="0.7"/>
        <ellipse cx="-50" cy="32" rx="34" ry="9" fill="${a}" opacity="0.18" stroke="none"/>
        <ellipse cx="-50" cy="32" rx="34" ry="9" opacity="0.6"/>
      </g>`
  }
  if (i === 5) {
    return `
      <g transform="translate(150,260)" stroke="${a}" stroke-width="2.5" fill="none">
        <rect x="-100" y="-50" width="60" height="50" rx="4"/>
        <rect x="-94" y="-44" width="30" height="22" rx="2" fill="${a}" opacity="0.3" stroke="none"/>
        <rect x="-30" y="-50" width="60" height="50" rx="4"/>
        <rect x="-24" y="-44" width="30" height="22" rx="2" fill="${a}" opacity="0.3" stroke="none"/>
        <rect x="40" y="-50" width="60" height="50" rx="4"/>
        <rect x="46" y="-44" width="30" height="22" rx="2" fill="${a}" opacity="0.3" stroke="none"/>
        <path d="M -100,16 L -100,10 Q -100,4 -94,4 L 94,4 Q 100,4 100,10 L 100,16 Z" opacity="0.85"/>
        <line x1="-60" y1="4" x2="-60" y2="16" opacity="0.5"/>
        <line x1="0" y1="4" x2="0" y2="16" opacity="0.5"/>
        <line x1="60" y1="4" x2="60" y2="16" opacity="0.5"/>
      </g>`
  }
  return `
    <g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
      <path d="M -110,30 L -110,-30 L -60,-30 L -60,-60 L 60,-60 L 60,-30 L 110,-30 L 110,30 Z"/>
      <rect x="-95" y="-20" width="26" height="22" opacity="0.85"/>
      <rect x="-90" y="-16" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
      <rect x="-40" y="-50" width="26" height="22" opacity="0.85"/>
      <rect x="-35" y="-46" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
      <rect x="14" y="-50" width="26" height="22" opacity="0.85"/>
      <rect x="19" y="-46" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
      <rect x="69" y="-20" width="26" height="22" opacity="0.85"/>
      <rect x="74" y="-16" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
      <rect x="-18" y="-6" width="36" height="36" opacity="0.9"/>
      <line x1="0" y1="-6" x2="0" y2="30" opacity="0.6"/>
      <circle cx="-5" cy="14" r="1.5" fill="${a}"/>
    </g>`
}

function cardSVG(d: SizeCard, i: number): string {
  return `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 w-full h-full">
    <text x="30" y="48" font-family="Lato,sans-serif" font-size="10" font-weight="900" letter-spacing="3.5" fill="#181818" opacity="0.45">${d.num}</text>
    <line x1="60" y1="44" x2="86" y2="44" stroke="${d.accent}" stroke-width="2" stroke-linecap="round"/>
    <text x="30" y="120" font-family="Lato,sans-serif" font-size="42" font-weight="900" fill="#181818" letter-spacing="-1">${d.size}</text>
    <text x="30" y="148" font-family="Lato,sans-serif" font-size="9" font-weight="900" letter-spacing="3" fill="#181818" opacity="0.55">${d.label}</text>
    <text x="30" y="172" font-family="Lato,sans-serif" font-size="11" font-weight="400" fill="#181818" opacity="0.5">${d.sqft} sq ft</text>
    ${illustration(i, d.accent)}
  </svg>`
}

const ROTATE_MS = 3000

export default function SizeGuidePage() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [ecoOpen, setEcoOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const ecoRef = useRef<HTMLDivElement>(null)
  const N = SIZES.length

  // Auto-cycle the size carousel
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIdx((i) => (i + 1) % N), ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, N])

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

  const select = useCallback((i: number) => setIdx(i), [])

  const cardStyle = (j: number) => {
    const offset = (j - idx + N) % N
    if (offset === 0) return { transform: 'none', opacity: 1, zIndex: 30 }
    if (offset === 1) return { transform: 'translateX(45%) scale(0.85)', opacity: 0.7, zIndex: 20 }
    if (offset === N - 1) return { transform: 'translateX(-45%) scale(0.85)', opacity: 0.7, zIndex: 20 }
    return { transform: 'scale(0.7)', opacity: 0, zIndex: 10 }
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
            <a href="#life-moments" className="text-body-sm font-bold transition-opacity duration-150 hover:opacity-70 text-warm-white">Size Guide</a>
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
              href="#find-storage"
              className="inline-flex items-center justify-center gap-2 rounded-xl text-body font-bold min-h-[44px] !py-3 !px-6 transition-all duration-200 ease-out bg-orange text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)] hover:brightness-[1.1] hover:shadow-[0_4px_16px_rgba(232,98,42,0.4)] hover:-translate-y-px active:translate-y-0 no-underline"
            >
              Rent a Space
            </a>
          </div>

          <a href="#find-storage" className="lg:hidden rounded-lg p-2 transition-all duration-300 text-warm-white bg-black/40 backdrop-blur-sm" aria-label="Rent a space">
            <Menu size={22} aria-hidden="true" />
          </a>
        </nav>
      </header>

      {/* spacer for fixed header */}
      <div className="h-[64px] lg:h-[72px]" aria-hidden="true" />

      {/* ── Ticker ── */}
      <MarqueeBanner />

      {/* ── Find your size (cycling cards) ── */}
      <section
        id="life-moments"
        className="relative bg-black pt-8 pb-10 md:pt-10 md:pb-14 lg:pt-10 lg:pb-16 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative mx-3 md:mx-6 lg:mx-10 rounded-[24px] md:rounded-[32px] pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20 overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
          <div className="pointer-events-none absolute inset-x-0 top-4 md:top-2 lg:top-0 z-[1] select-none overflow-hidden flex justify-center" aria-hidden="true">
            <span className="text-[7rem] md:text-[12rem] lg:text-[17rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap">SIZES</span>
          </div>

          <div className="relative z-[2] mx-auto max-w-content px-5 md:px-8 lg:px-16">
            <div className="text-center mb-10 lg:mb-14">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Size guide</span>
                <div className="h-px w-8 bg-orange" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.95]">Find your size.</h1>
              <p className="mx-auto mt-[18px] max-w-[640px] text-center text-[16px] leading-[1.55] text-black/65">
                Sizes are approximate and may vary by facility. Tap any size to see what fits, or let them cycle through on their own.
              </p>
            </div>

            {/* Mobile horizontal tab strip */}
            <div className="lg:hidden flex items-stretch gap-2 mb-6 h-[106px] md:h-[114px]">
              {SIZES.map((d, j) => {
                const active = j === idx
                return (
                  <button
                    key={d.num}
                    type="button"
                    onClick={() => select(j)}
                    className="relative text-left rounded-[14px] md:rounded-[16px] cursor-pointer overflow-hidden transition-all duration-300"
                    style={{ backgroundColor: active ? d.accent : 'rgba(0,0,0,0.04)', flex: active ? '1 1 0%' : '0 0 44px' }}
                    aria-label={d.title}
                  >
                    {active ? (
                      <div className="relative z-[1] px-4 py-4 md:px-5 md:py-5">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
                          <span className="text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-[0.25em] text-black/35">{d.num}</span>
                        </div>
                        <p className="text-sm md:text-base font-black leading-snug text-black">{d.title}</p>
                      </div>
                    ) : (
                      <div className="relative z-[1] flex items-center justify-center h-full">
                        <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-black/25" style={{ writingMode: 'vertical-lr' }}>{d.num}</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-10 xl:gap-14 lg:items-center">
              {/* Desktop number list */}
              <div className="hidden lg:block">
                <div className="flex flex-col gap-2">
                  {SIZES.map((d, j) => {
                    const active = j === idx
                    return (
                      <button
                        key={d.num}
                        type="button"
                        onClick={() => select(j)}
                        className="group relative w-full text-left rounded-[16px] cursor-pointer overflow-hidden transition-shadow duration-300"
                        style={{ backgroundColor: active ? d.accent : 'transparent' }}
                      >
                        {active && (
                          <span className="absolute -right-3 -bottom-4 text-[5.5rem] font-black leading-none select-none pointer-events-none text-black/[0.06]" aria-hidden="true">{d.num}</span>
                        )}
                        <div className="relative z-[1] transition-all duration-300 px-8" style={{ paddingTop: active ? 24 : 20, paddingBottom: active ? 24 : 20 }}>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div
                              className="h-2 w-2 rounded-full flex-shrink-0 transition-all duration-300"
                              style={active
                                ? { backgroundColor: 'rgba(0,0,0,0.4)', transform: 'scale(1)', opacity: 1 }
                                : { backgroundColor: d.accent, transform: 'scale(0.6)', opacity: 0.4 }}
                            />
                            <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] transition-colors duration-300" style={{ color: active ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.2)' }}>{d.num}</span>
                          </div>
                          <p className="leading-snug transition-colors duration-300" style={{ fontSize: '0.95rem', fontWeight: 900, lineHeight: 1.3, color: active ? 'rgb(0,0,0)' : 'rgba(0,0,0,0.35)' }}>{d.title}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Card collage */}
              <div className="relative flex items-center justify-center h-[420px] md:h-[480px] lg:h-[540px]">
                {SIZES.map((d, j) => {
                  const active = j === idx
                  const st = cardStyle(j)
                  return (
                    <div
                      key={d.num}
                      className="absolute w-[280px] md:w-[320px] lg:w-[350px] cursor-pointer"
                      style={{ transition: 'transform 0.5s ease, opacity 0.5s ease', ...st }}
                      onClick={() => select(j)}
                    >
                      <div className="relative overflow-hidden rounded-[20px] shadow-[0_18px_50px_-10px_rgba(0,0,0,0.4)]">
                        <div
                          className="aspect-[3/4] relative"
                          style={{ background: `linear-gradient(165deg, #F5F0E8 0%, ${d.tint} 100%)` }}
                          dangerouslySetInnerHTML={{ __html: cardSVG(d, j) }}
                        />
                        {active && (
                          <div
                            className="absolute bottom-0 inset-x-0 z-10"
                            style={{ padding: '60px 30px 28px', background: 'linear-gradient(180deg, transparent 0%, rgba(245,240,232,0.55) 35%, rgba(245,240,232,0.92) 80%)' }}
                          >
                            <div style={{ height: 2, width: 24, borderRadius: 2, marginBottom: 14, backgroundColor: d.accent }} />
                            <p style={{ color: 'rgba(24,24,24,0.85)', fontSize: '0.95rem', lineHeight: 1.55, fontWeight: 400, margin: 0, letterSpacing: '-0.01em', fontStyle: 'italic' }}>{d.caption}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section id="comparison" className="grain relative overflow-hidden bg-black pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 10%, rgba(232,98,42,0.035), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-[680px] px-5 md:px-8 lg:px-10">
          <div className="mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-7 bg-orange" />
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-orange">Side by side</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-warm-white leading-[1.0] tracking-tight">Unit size comparison</h2>
            <p className="mt-3 max-w-[520px] text-[0.95rem] leading-[1.6] text-warm-white/55">All Journey self-storage sizes at a glance.</p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="px-1 py-3 border-b border-warm-white/[0.1]" style={{ display: 'grid', gridTemplateColumns: '0.85fr 0.7fr 0.7fr 1.4fr 0.55fr', gap: 18 }}>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-warm-white/35">Unit size</p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-warm-white/35">Square feet</p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-warm-white/35">Cubic feet</p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-warm-white/35">Fits the contents of</p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-warm-white/35 text-right" />
            </div>
            {UNITS.map((u) => (
              <div key={u.num} className="cmp-row px-1 py-4 border-b border-warm-white/[0.07]" style={{ display: 'grid', gridTemplateColumns: '0.85fr 0.7fr 0.7fr 1.4fr 0.55fr', gap: 18, alignItems: 'center' }}>
                <p className="text-[0.85rem] font-black text-warm-white tracking-tight">{u.size}</p>
                <p className="tabular text-[0.85rem] text-warm-white/75">{fmt(u.sqft)}</p>
                <p className="tabular text-[0.85rem] text-warm-white/75">{fmt(u.cubicFt)}</p>
                <p className="text-[0.85rem] text-warm-white/60">{u.fits}</p>
                <a href="#find-storage" className="cmp-rent text-[0.7rem] font-bold uppercase tracking-[0.18em] text-warm-white/50 hover:text-orange no-underline transition-colors" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  Rent <span aria-hidden="true">→</span>
                </a>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col mt-2 border-t border-warm-white/[0.1] pt-6">
            {UNITS.map((u) => (
              <div key={u.num} className="flex flex-col py-5 border-b border-warm-white/[0.07] last:border-b-0">
                <div className="flex items-baseline justify-between mb-1.5 gap-4">
                  <p className="text-lg font-black text-warm-white tracking-tight">{u.size}</p>
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] font-bold text-warm-white/40 whitespace-nowrap">
                    {fmt(u.sqft)} <span className="opacity-60">sq ft</span> &nbsp;·&nbsp; {fmt(u.cubicFt)} <span className="opacity-60">cu ft</span>
                  </p>
                </div>
                <p className="text-sm text-warm-white/60 leading-snug">{u.fits}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="grain relative overflow-hidden bg-black py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(232,98,42,0.035), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="mb-14 lg:mb-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">What&apos;s inside</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
              Built for the way<br /><span className="font-light text-warm-white/40">you live now.</span>
            </h2>
            <p className="mt-5 mx-auto max-w-[600px] text-base md:text-lg leading-[1.55] text-warm-white/55">
              Every Journey unit comes standard with the features that matter. No add-ons, no upsells.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {FEATURES.map(({ Icon, title, body }) => (
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

      {/* ── How it works ── */}
      <section id="how-it-works" className="grain relative overflow-hidden bg-black pt-28 pb-16 lg:pt-40 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-[5vw] overflow-hidden select-none" aria-hidden="true">
          {['01', '02', '03', '04', '05', '06'].map((n) => (
            <span key={n} className="text-[10rem] md:text-[16rem] lg:text-[22rem] font-black text-warm-white/[0.015] leading-none">{n}</span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="mb-20 lg:mb-28 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">How it works</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
              Storage without<br /><span className="font-light text-warm-white/40">the friction.</span>
            </h2>
          </div>

          {/* Desktop timeline */}
          <div className="relative hidden lg:block">
            <div className="absolute left-[10%] right-[10%] top-[32px] z-0">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-warm-white/10 to-transparent" />
            </div>
            <div className="relative z-10 grid grid-cols-6 gap-4">
              {STEPS.map(({ Icon, num, title, body }) => (
                <div key={num} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-warm-white/[0.08] bg-charcoal/40">
                    <Icon size={26} strokeWidth={1.5} className="text-warm-white/70" aria-hidden="true" />
                  </div>
                  <span className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">{num}</span>
                  <h3 className="mt-3 text-sm font-bold leading-tight text-warm-white">{title}</h3>
                  <p className="mt-2 max-w-[170px] text-[0.8125rem] leading-[1.6] text-warm-white/40">{body}</p>
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

      {/* ── Find storage (ZIP) ── */}
      <section id="find-storage" className="relative bg-black px-3 md:px-6 lg:px-10 py-20 lg:py-28">
        <div className="grain relative mx-auto max-w-[1340px] rounded-[24px] md:rounded-[32px] overflow-hidden" style={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(245,240,232,0.07)' }}>
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,98,42,0.06), transparent)' }} />
          <div className="relative z-10 px-6 md:px-10 py-16 md:py-20 lg:py-24 text-center max-w-[680px] mx-auto">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Rent a space</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-warm-white leading-[0.95]">
              Find your space,<br /><span className="font-light text-warm-white/40">rent today.</span>
            </h2>
            <p className="mt-5 mx-auto max-w-[500px] text-base leading-[1.6] text-warm-white/55">
              Enter your ZIP to see available units near you. Reserve online in minutes and get your access code straight to your phone.
            </p>
            <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-[560px] mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="fs-input relative flex-1 flex items-center gap-3 rounded-full pl-5 pr-6 py-4" style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.1)' }}>
                <Search size={18} className="text-warm-white/40 flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="ZIP code, city, or address"
                  aria-label="ZIP code, city, or address"
                  className="flex-1 bg-transparent border-none text-base text-warm-white placeholder:text-warm-white/35 focus:outline-none"
                />
              </div>
              <button type="submit" className="fs-btn rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] bg-orange text-warm-white cursor-pointer border-none" style={{ boxShadow: '0 4px 16px rgba(232,98,42,0.25)' }}>
                Find Spaces
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="grain relative overflow-hidden bg-black py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 20%, rgba(232,98,42,0.04), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
          <div className="mb-14 lg:mb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">FAQ</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
              Questions?<br /><span className="font-light text-warm-white/30">Answered.</span>
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

      {/* ── Final CTA ── */}
      <section id="still-not-sure" className="relative bg-black px-3 md:px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="relative mx-auto max-w-[1340px] rounded-[24px] md:rounded-[32px] overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-[1] flex justify-center overflow-hidden select-none" aria-hidden="true">
            <span className="text-[8rem] md:text-[14rem] lg:text-[18rem] font-black uppercase leading-none text-black/[0.025] whitespace-nowrap tracking-tight">JOURNEY</span>
          </div>
          <div className="relative z-[2] px-6 md:px-10 py-16 md:py-20 lg:py-24 text-center max-w-[760px] mx-auto">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Ready to move in?</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-[1.0] tracking-tight">Rent your space today.</h2>
            <p className="mt-5 mx-auto max-w-[540px] text-base leading-[1.6] text-black/60">
              Reserve online in minutes. No paperwork, no office visits. Your access code arrives the moment you sign.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <a href="#find-storage" className="cta-btn inline-flex items-center gap-3 rounded-full text-xs font-bold uppercase tracking-[0.18em] no-underline" style={{ background: '#181818', color: '#f5f0e8', padding: '16px 32px' }}>
                Rent a Space
                <svg className="cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a href="mailto:hello@journey.storage?subject=Storage%20size%20guide%20inquiry" className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-black/55 hover:text-black no-underline" style={{ borderBottom: '1px solid rgba(0,0,0,0.15)', paddingBottom: 2, transition: 'color .2s ease, border-color .2s ease' }}>
                Or talk to our team →
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
        .tabular { font-variant-numeric: tabular-nums; }

        .cmp-row { transition: background-color 0.3s ease; }
        .cmp-row:hover { background-color: rgba(245, 240, 232, 0.025); }

        .feat-card { transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease; }
        .feat-card:hover { transform: translateY(-3px); background-color: rgba(245, 240, 232, 0.03); border-color: rgba(245, 240, 232, 0.12); }
        .feat-icon { transition: background-color 0.3s ease, border-color 0.3s ease; }
        .feat-card:hover .feat-icon { background-color: rgba(232, 98, 42, 0.08); border-color: rgba(232, 98, 42, 0.3); }
        .feat-card:hover .feat-icon svg { color: rgb(232, 98, 42); }

        .cta-btn { transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease; }
        .cta-btn:hover { transform: translateY(-2px); background-color: #1f1f1f; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35); }
        .cta-btn:hover .cta-arrow { transform: translateX(4px); }
        .cta-arrow { transition: transform 0.25s ease; }

        .fs-input { transition: border-color 0.25s ease, background-color 0.25s ease; }
        .fs-input:focus-within { border-color: rgba(232, 98, 42, 0.6); background-color: rgba(245, 240, 232, 0.07); }
        .fs-btn { transition: filter 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease; }
        .fs-btn:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(232, 98, 42, 0.35); }

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
