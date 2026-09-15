import type { Metadata } from 'next'
import Image from 'next/image'
import { Barlow_Condensed, Work_Sans } from 'next/font/google'
import {
  Download,
  ChevronDown,
  TriangleAlert,
  Bluetooth,
  MapPinOff,
  WifiOff,
  Lock,
  MessageSquare,
  Smartphone,
  Activity,
  KeyRound,
  MapPin,
  Phone,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MarqueeBanner from '@/components/sections/MarqueeBanner'
import { PHONE } from '@/lib/constants'
import SetupStepper from './SetupStepper'

// /smartentry, v2 (Sept 2026). Image-led rewrite of the tenant guide: about
// 480 visible words, a picture beside every step, numbered photo sequences for
// the gate and the unit, one embedded video, six troubleshooting cards.
//
// Facts on this page match the printed handout and the tenant email. Anything
// changed here should change there too. Do not add a motion-sensing claim (it
// is an optional ION add-on) and do not say the lock re-locks itself.
//
// Server component. SetupStepper is the only client island.
//
// Type sizes are explicit ([..px]) for the same reason as the rest of the
// site: the text-* scale tokens don't generate under Tailwind v4 here.
//
// Orange type on light backgrounds is #B34516 (Brand Guide v2.0); #FF6320 is
// for fills and for type on dark.

// Brand Guide v2.0 faces, scoped to this page: Barlow Condensed for display type
// (h1, section h2s, step numbers, the phone number), Work Sans for everything else.
// The site chrome (Navbar, Footer, marquee) stays in Lato.
const barlow = Barlow_Condensed({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-barlow', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-work-sans', display: 'swap' })
const DISPLAY = 'font-[family-name:var(--font-barlow)]'

const APP_URL = 'https://noke.app'
const IMG = '/images/smartentry'

export const metadata: Metadata = {
  title: 'Smart Entry · Your phone is your key | Journey.Storage™',
  description:
    'Set up Storage Smart Entry in five minutes. Your gate and your unit both open from your phone.',
  alternates: { canonical: '/smartentry' },
  openGraph: {
    title: 'Smart Entry · Your phone is your key',
    description: 'Set up the app in about five minutes. Your gate and your unit both open from your phone.',
    url: 'https://journey.storage/smartentry',
    type: 'article',
    images: [{ url: `${IMG}/hero-corridor.jpg`, width: 2107, height: 1580 }],
  },
}

/* ── Copy ─────────────────────────────────────────────────────────── */

const GATE = [
  {
    img: `${IMG}/gate-1-open-app.jpg`,
    alt: 'A tenant opening the app as she walks up',
    title: 'Open the app',
    body: (
      <>
        Tap the <strong className="font-semibold text-warm-white">Entries</strong> tab. You see the gate and your
        unit, nothing else.
      </>
    ),
    contain: false,
  },
  {
    img: `${IMG}/shot-tiles.png`,
    alt: 'Gate tile lit up blue: in range',
    title: 'Wait a beat',
    body: (
      <>
        In range, the gate tile <strong className="font-semibold text-warm-white">lights up</strong>. Still dim? Pull
        a few feet closer.
      </>
    ),
    contain: true,
  },
  {
    img: `${IMG}/door-photo.webp`,
    alt: 'A phone held beside the electronic latch on a roll-up door',
    title: 'Tap the tile',
    body: 'The gate opens. Same on the way out. No code, no clicker, no office.',
    contain: false,
  },
]

const UNIT = [
  {
    img: `${IMG}/unit-1-tap.jpg`,
    alt: 'A hand holding the phone up to the unit door',
    icon: `${IMG}/rollup-1-ink.png`,
    title: 'Tap your unit in the app',
    body: 'Stand at the door so the tile lights up, then tap it. You’ll hear the lock release.',
  },
  {
    img: `${IMG}/unit-2-latch.jpg`,
    alt: 'The latch on the unit door, LED showing',
    icon: `${IMG}/rollup-2-ink.png`,
    title: 'Slide the latch across',
    body: 'The lock is open, but the latch still holds the door. Slide it with your hand.',
  },
  {
    img: `${IMG}/unit-3-lift.jpg`,
    alt: 'Roll-up door with the electronic latch, ready to lift',
    icon: `${IMG}/rollup-3-ink.png`,
    title: 'Pull the handle up',
    body: 'Lift the door and you’re in.',
  },
]

const FIXES = [
  {
    Icon: Bluetooth,
    q: 'The tile never lights up',
    a: (
      <>
        <b className="font-semibold text-black">Bluetooth is off.</b> Switch it on in your phone’s settings, then
        reopen the app.
      </>
    ),
    open: true,
  },
  {
    Icon: MapPinOff,
    q: 'Worked yesterday, not today (Android)',
    a: (
      <>
        <b className="font-semibold text-black">Location got switched off.</b> Android needs it on for Bluetooth to
        work. Turn it back on.
      </>
    ),
  },
  {
    Icon: WifiOff,
    q: 'No signal at the facility',
    a: (
      <>
        <b className="font-semibold text-black">Launch the app before you drive in</b>, while you still have bars. It
        stays loaded.
      </>
    ),
  },
  {
    Icon: Lock,
    q: 'You forgot your password',
    a: (
      <>
        Use <b className="font-semibold text-black">Forgot Password</b> on the login screen. The reset comes by text.
      </>
    ),
  },
  {
    Icon: MessageSquare,
    q: 'You never got the setup text',
    a: (
      <>
        Check blocked numbers and spam, then <b className="font-semibold text-black">call us</b> and we’ll resend it.
      </>
    ),
  },
  {
    Icon: Smartphone,
    q: 'You got a new phone',
    a: (
      <>
        Download the app again and log in with the same cell number.{' '}
        <b className="font-semibold text-black">Your keys live with the account</b>, not the handset.
      </>
    ),
  },
]

const CAPS = [
  { Icon: Activity, k: 'See who came', v: 'A record of every time your unit opened, and by whom.' },
  { Icon: KeyRound, k: 'Take a key back', v: 'Revoke shared access anytime. It stops working immediately.' },
  {
    Icon: MapPin,
    k: 'Find your unit',
    v: (
      <>
        <strong className="font-semibold text-black">Locate Unit</strong> makes your door chirp and flash so you
        walk straight to it.
      </>
    ),
  },
]

/* ── Small pieces ──────────────────────────────────────────────────── */

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 bg-orange" />
      <span
        className={[
          'text-[12px] font-bold uppercase tracking-[0.22em]',
          dark ? 'text-orange' : 'text-[#B34516]',
        ].join(' ')}
      >
        {children}
      </span>
    </div>
  )
}

function SectionHead({
  eyebrow,
  title,
  tag,
  dark = false,
}: {
  eyebrow: string
  title: string
  tag?: string
  dark?: boolean
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <h2
          className={[
            DISPLAY,
            'mt-3.5 max-w-[18ch] text-[clamp(34px,5vw,56px)] font-bold leading-[0.98]',
            dark ? 'text-warm-white' : 'text-black',
          ].join(' ')}
        >
          {title}
        </h2>
      </div>
      {tag && <span className="text-[12px] font-bold uppercase tracking-[0.17em] text-stone">{tag}</span>}
    </div>
  )
}

function Caption({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={[
        'mt-3 text-center text-[11.5px] font-bold uppercase tracking-[0.16em]',
        dark ? 'text-warm-white/45' : 'text-stone',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function PhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={[
        'mx-auto w-full max-w-[280px] rounded-[28px] border p-2.5 shadow-[0_30px_50px_-30px_rgba(24,24,24,0.45)]',
        dark ? 'border-warm-white/15 bg-[#0f0f0f]' : 'border-black/10 bg-white',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function SmartEntryPage() {
  return (
    <>
      <Navbar />
      <div className="h-[64px] lg:h-[72px]" aria-hidden="true" />
      <MarqueeBanner />

      <main className={`${barlow.variable} ${workSans.variable} bg-warm-white font-[family-name:var(--font-work-sans)]`}>
        {/* ── Hero ───────────────────────────────────────────────── */}
        <header className="grain relative flex min-h-[min(92vh,860px)] items-end overflow-hidden bg-black text-warm-white">
          <Image
            src={`${IMG}/hero-corridor.jpg`}
            alt="A tenant walking a corridor of storage units with her phone in hand"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_50%]"
          />
          {/* Warm multiply plus scrim so the photo sits in the Journey palette
              and the type stays legible over the darkest part of the frame. */}
          <div className="pointer-events-none absolute inset-0 bg-terracotta/30 mix-blend-multiply" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(180deg,rgba(24,24,24,.35) 0%,rgba(24,24,24,.15) 35%,rgba(24,24,24,.92) 100%),linear-gradient(100deg,rgba(24,24,24,.85) 0%,rgba(24,24,24,.35) 55%,rgba(24,24,24,.1) 100%)',
            }}
          />

          <div className="relative z-10 mx-auto grid w-full max-w-content gap-9 px-5 pt-28 pb-14 md:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:px-16 lg:pb-[72px]">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-orange">
                No keys · No lock to buy · No office hours
              </div>
              <h1 className={`${DISPLAY} mt-4 text-[56px] font-black uppercase leading-[0.92] tracking-normal text-warm-white md:text-[96px] lg:text-[132px]`}>
                Your phone
                <br />
                is your <span className="text-orange">key</span>
              </h1>
              <p className="mt-5 max-w-[44ch] text-[19px] font-light leading-[1.55] text-warm-white/80">
                Your gate and your unit both open from one free app. Five minutes to set up, then you never think
                about it again.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] items-center gap-2.5 rounded-[10px_3px_10px_3px] bg-orange px-6 text-[16px] font-bold text-black no-underline transition duration-200 hover:-translate-y-px hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  <Download size={18} aria-hidden="true" />
                  Download the app
                </a>
                <a
                  href="#setup"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-[10px_3px_10px_3px] border border-warm-white/35 px-6 text-[16px] font-bold text-warm-white no-underline transition duration-200 hover:bg-warm-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  Start the setup
                </a>
              </div>
            </div>

            <aside className="rounded-[20px_4px_20px_4px] border border-warm-white/12 bg-warm-white/[0.06] p-[22px] backdrop-blur-sm">
              <div className="flex items-center gap-3.5 border-b border-warm-white/12 pb-4">
                <Image
                  src={`${IMG}/app-icon.png`}
                  alt="Storage Smart Entry app icon"
                  width={52}
                  height={52}
                  className="rounded-xl"
                />
                <div>
                  <b className="block text-[16px] text-warm-white">Storage Smart Entry</b>
                  <span className="text-[13px] text-warm-white/55">Free · iPhone and Android</span>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ['Setup', '5 min'],
                  ['Opens', 'Gate + unit'],
                  ['Range', '~15 ft'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-warm-white/45">{k}</dt>
                    <dd className="mt-1 text-[15px] font-bold text-warm-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 hidden items-center gap-3 border-t border-warm-white/12 pt-3.5 text-[12.5px] text-warm-white/60 lg:flex">
                <Image
                  src={`${IMG}/qr-app.svg`}
                  alt="QR code to noke.app"
                  width={56}
                  height={56}
                  className="rounded-md bg-white p-1"
                />
                <span>
                  Scan to download
                  <br />
                  <b className="text-warm-white">noke.app</b>
                </span>
              </div>
            </aside>
          </div>
        </header>

        {/* ── Three moments strip ───────────────────────────────── */}
        <nav className="border-t border-warm-white/12 bg-black" aria-label="Sections">
          <div className="mx-auto grid max-w-content grid-cols-3 px-5 md:px-8 lg:px-16">
            {[
              ['01', 'Set it up', 'before you arrive', '#setup'],
              ['02', 'The gate', 'from your car', '#gate'],
              ['03', 'Your unit', 'tap, slide, lift', '#unit'],
            ].map(([n, t, s, href], i) => (
              <a
                key={href}
                href={href}
                className={[
                  'flex items-center gap-3 py-[18px] pr-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-warm-white/70 no-underline md:py-[22px] md:px-5',
                  i > 0 ? 'border-l border-warm-white/12 pl-3' : '',
                ].join(' ')}
              >
                <b className={`${DISPLAY} text-[26px] font-black leading-none text-orange`}>{n}</b>
                <span>
                  {t} <span className="hidden md:inline">· {s}</span>
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* ── Set it up ─────────────────────────────────────────── */}
        <section id="setup" className="scroll-mt-24 bg-warm-white py-[88px] lg:py-[120px]">
          <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
            <SectionHead
              eyebrow="Set it up · 4 steps"
              title="Do this before your first visit"
              tag="Every screen you’ll see is pictured"
            />
            <SetupStepper />

            <div className="mt-10 grid items-center gap-[22px] rounded-[4px_16px_16px_4px] border border-orange/25 border-l-[3px] border-l-[#DB551C] bg-orange/[0.05] p-[22px] md:grid-cols-[1fr_300px] md:px-8 md:py-7">
              <div className="flex items-start gap-[18px]">
                <TriangleAlert size={26} className="mt-1 shrink-0 text-[#DB551C]" aria-hidden="true" />
                <p className="text-[16.5px] leading-[1.65] text-black/75">
                  <strong className="font-bold text-black">If you tap “Don’t Allow,” nothing will open.</strong> No
                  Bluetooth means no gate and no unit. Already tapped it? Phone Settings → Storage Smart Entry → switch
                  Bluetooth and Location back on.
                </p>
              </div>
              <figure className="m-0">
                <PhoneFrame>
                  <Image
                    src={`${IMG}/app-home.webp`}
                    alt="The app home screen once you’re logged in"
                    width={600}
                    height={1067}
                    className="w-full rounded-[20px]"
                  />
                </PhoneFrame>
                <Caption>What you’ll see once you’re in</Caption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── At the gate ───────────────────────────────────────── */}
        <section id="gate" className="grain relative scroll-mt-24 overflow-hidden bg-black py-[88px] text-warm-white/70 lg:py-[120px]">
          <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
            <SectionHead
              dark
              eyebrow="When you get here"
              title="The gate opens from your car"
              tag="Open the app before you pull up"
            />

            <ol className="mt-12 grid gap-[18px] md:grid-cols-3 md:gap-[22px]">
              {GATE.map((s, i) => (
                <li key={s.title}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px_4px_18px_4px] bg-[#2a2826]">
                    <Image
                      src={s.img}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className={s.contain ? 'bg-white object-contain p-3' : 'object-cover'}
                    />
                    {!s.contain && (
                      <div className="pointer-events-none absolute inset-0 bg-terracotta/20 mix-blend-multiply" aria-hidden="true" />
                    )}
                    <span className={`${DISPLAY} absolute left-3.5 top-3.5 grid h-11 w-11 place-items-center rounded-full bg-orange text-[24px] font-black text-black`}>
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[21px] font-semibold text-warm-white">{s.title}</h3>
                  <p className="mt-1.5 text-[15.5px] leading-[1.6]">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-14 grid items-center gap-9 border-t border-warm-white/12 pt-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div className="grid gap-3.5">
                {[
                  ['Lit up means in range', 'A bright tile is a lock your phone can reach right now. Dim ones wake up as you walk closer.', false],
                  ['Only your doors', 'Renting more than one space? They all appear here. The search bar finds a unit by number.', false],
                  ['No signal out here?', 'Launch the app while you still have bars. It holds your keys once loaded, so everything still opens with no service.', true],
                ].map(([t, d, tint]) => (
                  <div
                    key={t as string}
                    className={[
                      'rounded-[14px_3px_14px_3px] border px-5 py-[18px]',
                      tint ? 'border-orange/25 bg-orange/[0.07]' : 'border-warm-white/12 bg-warm-white/[0.035]',
                    ].join(' ')}
                  >
                    <div className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-orange">{t as string}</div>
                    <p className="mt-1.5 text-[15.5px] leading-[1.55]">{d as string}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 items-end gap-[22px]">
                <figure className="m-0">
                  <PhoneFrame dark>
                    <Image
                      src={`${IMG}/app-entries.webp`}
                      alt="The Entries tab listing your gate and unit"
                      width={600}
                      height={1067}
                      className="w-full rounded-[20px]"
                    />
                  </PhoneFrame>
                  <Caption dark>The Entries tab</Caption>
                </figure>
                <figure className="m-0">
                  <PhoneFrame dark>
                    <Image
                      src={`${IMG}/shot-entries.png`}
                      alt="Entries list"
                      width={440}
                      height={980}
                      className="w-full rounded-[20px]"
                    />
                  </PhoneFrame>
                  <Caption dark>Search by unit number</Caption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ── At your unit ──────────────────────────────────────── */}
        <section id="unit" className="scroll-mt-24 bg-warm-white py-[88px] lg:py-[120px]">
          <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
            <SectionHead eyebrow="At your unit" title="Tap. Slide. Lift." tag="Roll-up door with an electronic lock" />

            <ol className="mt-12 grid gap-[18px] md:grid-cols-3 md:gap-[22px]">
              {UNIT.map((s, i) => (
                <li key={s.title}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[18px_4px_18px_4px] bg-[#2a2826]">
                    <Image src={s.img} alt={s.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-terracotta/20 mix-blend-multiply" aria-hidden="true" />
                    <span className={`${DISPLAY} absolute left-3.5 top-3.5 grid h-11 w-11 place-items-center rounded-full bg-orange text-[24px] font-black text-black`}>
                      {i + 1}
                    </span>
                    <Image
                      src={s.icon}
                      alt=""
                      width={74}
                      height={74}
                      className="absolute bottom-3 right-3 h-[74px] w-[74px] rounded-full bg-warm-white/90 p-2"
                    />
                  </div>
                  <h3 className="mt-4 text-[21px] font-semibold text-black">{s.title}</h3>
                  <p className="mt-1.5 text-[15.5px] leading-[1.6] text-black/70">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 grid gap-[22px] md:grid-cols-2">
              <div className="rounded-[18px_4px_18px_4px] border border-black/[0.06] bg-[#FBF8F3] p-[26px]">
                <div className="mb-3.5 h-[3px] w-6 rounded-sm bg-[#DB551C]" />
                <h3 className="text-[22px] font-semibold text-black">Closing up</h3>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-black/70">
                  Shut the door and slide the latch back. Then{' '}
                  <strong className="font-semibold text-black">check the app</strong> before you drive off: your unit
                  should show as locked.
                </p>
              </div>
              <div className="rounded-[18px_4px_18px_4px] border border-orange/20 bg-orange/[0.05] p-[26px]">
                <div className="mb-3.5 h-[3px] w-6 rounded-sm bg-[#DB551C]" />
                <h3 className="text-[22px] font-semibold text-black">Tip from the lock maker</h3>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-black/70">
                  Keep <strong className="font-semibold text-black">Bluetooth switched on</strong>. It’s the one
                  thing that stops a door opening more than anything else, and it costs nothing to leave on.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Share ─────────────────────────────────────────────── */}
        <section id="share" className="grain relative scroll-mt-24 overflow-hidden bg-black py-[88px] text-warm-white/70 lg:py-[120px]">
          <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
            <SectionHead
              dark
              eyebrow="Let someone else in"
              title="Send a key. Take it back anytime."
              tag="Both live under the + in the top right"
            />

            <div className="mt-12 grid gap-[22px] lg:grid-cols-[1.1fr_1fr_1fr] lg:items-start">
              <div className="grid grid-cols-2 items-end gap-[22px]">
                <figure className="m-0">
                  <PhoneFrame dark>
                    <Image
                      src={`${IMG}/share-1-number.webp`}
                      alt="Share access: type their cell number"
                      width={600}
                      height={1301}
                      className="w-full rounded-[20px]"
                    />
                  </PhoneFrame>
                  <Caption dark>Type their number</Caption>
                </figure>
                <figure className="m-0">
                  <PhoneFrame dark>
                    <Image
                      src={`${IMG}/share-2-duration.png`}
                      alt="Pick how long: one day, three days, one week, indefinitely"
                      width={600}
                      height={1301}
                      className="w-full rounded-[20px]"
                    />
                  </PhoneFrame>
                  <Caption dark>Pick how long</Caption>
                </figure>
              </div>

              {[
                {
                  title: 'Share a digital key',
                  steps: [
                    <>Tap the <strong className="font-semibold text-black">+</strong> in the top right.</>,
                    <>Choose <strong className="font-semibold text-black">Share Unit</strong>.</>,
                    <>Type their cell number and pick the unit.</>,
                  ],
                  note: 'Movers, family, a business partner. Revoke it whenever you want and it stops working immediately.',
                  shot: false,
                },
                {
                  title: 'Add a fob',
                  steps: [
                    <>Tap the <strong className="font-semibold text-black">+</strong>, then <strong className="font-semibold text-black">Add Fob</strong>.</>,
                    <>Squeeze the fob when the app asks.</>,
                    <>Name it so you know whose it is.</>,
                  ],
                  note: 'For anyone who’d rather not use a phone. Same gate, same unit.',
                  shot: true,
                },
              ].map((c) => (
                <div key={c.title} className="rounded-[18px_4px_18px_4px] border border-black/[0.06] bg-[#FBF8F3] p-[26px] text-black/70">
                  <div className="mb-3.5 h-[3px] w-6 rounded-sm bg-[#DB551C]" />
                  <h3 className="text-[22px] font-semibold text-black">{c.title}</h3>
                  <ol className="mt-3.5 grid gap-2">
                    {c.steps.map((s, i) => (
                      <li key={i} className="flex gap-2.5 text-[16px] leading-[1.55]">
                        <b className="shrink-0 font-bold text-[#B34516]">{i + 1}.</b>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3.5 border-t border-black/[0.06] pt-3 text-[14px] leading-[1.5] text-stone">{c.note}</p>
                  {c.shot && (
                    <figure className="m-0 mt-4">
                      <Image
                        src={`${IMG}/shot-share.png`}
                        alt="The + menu: Share Unit and Add Fob"
                        width={660}
                        height={266}
                        className="w-full rounded-lg border border-black/10"
                      />
                      <Caption>
                        What the <em className="not-italic text-[#B34516]">+</em> opens
                      </Caption>
                    </figure>
                  )}
                </div>
              ))}
            </div>

            {/* Only video on the page. Operator-made walkthrough of the share
                flow, kept until Journey shoots its own. Privacy-enhanced
                player, no related videos. */}
            <div className="mt-12 grid items-center gap-[26px] lg:grid-cols-[1.25fr_1fr] lg:gap-12">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-warm-white/12 bg-black">
                <iframe
                  loading="lazy"
                  src="https://www.youtube-nocookie.com/embed/3NxvF51TUGk?rel=0&modestbranding=1"
                  title="How to share access in the Storage Smart Entry app"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              <div>
                <h3 className={`${DISPLAY} text-[32px] font-bold leading-none text-warm-white`}>Watch: sharing a key</h3>
                <p className="mt-3 text-[16px] leading-[1.6]">Seventy seconds, start to finish.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What else it does ─────────────────────────────────── */}
        <section className="bg-warm-white pt-[88px] lg:pt-[120px]">
          <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
            <SectionHead eyebrow="What else it does" title="Already on your phone, no setup" />
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-black/10 md:grid-cols-3">
              {CAPS.map(({ Icon, k, v }) => (
                <div key={k} className="bg-warm-white px-6 py-[26px]">
                  <Icon size={28} strokeWidth={1.7} className="mb-3.5 text-[#B34516]" aria-hidden="true" />
                  <h3 className={`${DISPLAY} text-[26px] font-bold leading-none text-black`}>{k}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.55] text-black/70">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Troubleshooting ───────────────────────────────────── */}
        <section id="help" className="scroll-mt-24 bg-warm-white py-[88px] lg:py-[120px]">
          <div className="mx-auto max-w-content px-5 md:px-8 lg:px-16">
            <SectionHead eyebrow="If something won’t open" title="It’s almost always one of these" tag="Tap one" />

            <div className="mt-12 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
              {FIXES.map(({ Icon, q, a, open }) => (
                <details
                  key={q}
                  open={open}
                  className="group overflow-hidden rounded-[16px_4px_16px_4px] border border-black/[0.06] bg-[#FBF8F3]"
                >
                  <summary className="grid cursor-pointer list-none grid-cols-[48px_1fr_auto] items-center gap-3.5 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange [&::-webkit-details-marker]:hidden">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange/10">
                      <Icon size={24} strokeWidth={1.8} className="text-[#B34516]" aria-hidden="true" />
                    </span>
                    <b className="text-[17px] font-semibold leading-tight text-black">{q}</b>
                    <ChevronDown
                      size={20}
                      className="text-stone transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-5 pb-5 pl-[82px] text-[15.5px] leading-[1.6] text-black/70">{a}</p>
                </details>
              ))}
            </div>

            <div className="mt-16 grid items-center gap-9 border-t border-black/10 pt-14 lg:grid-cols-[1fr_260px] lg:gap-16">
              <div>
                <h3 className="text-[24px] font-semibold text-black">Help inside the app</h3>
                <p className="mt-3 text-[16.5px] leading-[1.65] text-black/70">
                  <strong className="font-semibold text-black">Settings</strong> tab (far right) →{' '}
                  <strong className="font-semibold text-black">Help and Support</strong>. Short guides for
                  everything the app does, and a <strong className="font-semibold text-black">Contact Us</strong>{' '}
                  button that reaches the people who make the lock.
                </p>
                <p className="mt-2.5 text-[14.5px] leading-[1.6] text-stone">
                  Use it for the app itself. For your space, your bill, or a door that won’t budge, call us.
                </p>
              </div>
              <figure className="m-0">
                <PhoneFrame>
                  <Image
                    src={`${IMG}/shot-help.png`}
                    alt="The Help and Support screen: tiles for Start Here, Open Gate/Door, Unlocking Your Unit, Locking Your Unit, Sharing a Digital Key, Make Payment and Contact Us"
                    width={440}
                    height={913}
                    className="w-full rounded-[20px]"
                  />
                </PhoneFrame>
                <Caption>
                  Settings → <em className="not-italic text-[#B34516]">Help and Support</em>
                </Caption>
              </figure>
            </div>

            {/* ── Call us ─────────────────────────────────────────── */}
            <div
              className="grain relative mt-20 flex flex-wrap items-center justify-between gap-7 overflow-hidden rounded-[20px_5px_20px_5px] px-8 py-11 text-warm-white lg:px-16 lg:py-14"
              style={{
                background:
                  'radial-gradient(ellipse 45% 140% at 10% 50%, rgba(255,99,32,0.22), transparent 70%), #181818',
              }}
            >
              <div className="relative z-10">
                <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange">Still stuck</span>
                <h2 className={`${DISPLAY} mt-2.5 text-[clamp(34px,5vw,54px)] font-bold leading-none`}>
                  Call us. A person picks up.
                </h2>
                <p className="mt-3 max-w-[40ch] text-warm-white/60">
                  Standing at a door that won’t open? Don’t wait until morning.
                </p>
              </div>
              <div className="relative z-10">
                <a
                  href={`tel:${PHONE.tel}`}
                  className={`${DISPLAY} inline-flex items-center gap-3 text-[clamp(36px,5vw,60px)] font-black leading-none text-warm-white no-underline`}
                >
                  <Phone size={28} className="hidden md:block" aria-hidden="true" />
                  {PHONE.display}
                </a>
                <div className="mt-2 text-right text-[14px] text-warm-white/50">journey.storage/smartentry</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
