'use client'

import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  TrendingUp, Megaphone, PhoneCall, Gavel, Wrench, Calculator, Cpu, Umbrella,
  Check, ArrowRight, ChevronDown, MapPin, Building2, ShieldOff, BadgeCheck, Repeat,
  ClipboardCheck, Handshake, Smartphone,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   Journey Managed — third-party self-storage management.
   Remote-first operations + full bookkeeping for independent owners.
   NOTE(fee): headline fee is 6% — management + bookkeeping bundled.
   ───────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const

const SCOPED_CSS = `
#managed .track-tight{letter-spacing:-.03em}
#managed .track-tighter{letter-spacing:-.045em}
#managed .btn-spring{transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s cubic-bezier(.22,1,.36,1),filter .2s ease,background-color .2s ease,color .2s ease}
#managed .btn-spring:hover{transform:translateY(-1px)}
#managed .btn-spring:active{transform:translateY(0)}
#managed .shadow-cta{box-shadow:0 2px 8px rgba(232,98,42,.3)}
#managed .shadow-cta:hover{box-shadow:0 6px 20px rgba(232,98,42,.4)}
#managed .card{box-shadow:0 1px 2px rgba(24,24,24,.04),0 12px 32px -16px rgba(24,24,24,.16);transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s cubic-bezier(.22,1,.36,1),border-color .2s ease}
#managed .card:hover{transform:translateY(-3px);box-shadow:0 2px 6px rgba(24,24,24,.05),0 24px 48px -20px rgba(232,98,42,.22)}
`

/* `immediate` is for above-the-fold content: it animates on mount instead of
   waiting for an IntersectionObserver tick, so the hero can never sit invisible
   before the user's first scroll. Everything below the fold keeps useInView. */
function Reveal({ children, delay = 0, className = '', immediate = false }: { children: ReactNode; delay?: number; className?: string; immediate?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const rm = useReducedMotion()
  const show = immediate || inView
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={rm ? undefined : { opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: EASE, delay: rm ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}

/* Centered ecosystem-style section header: double-rule eyebrow + big display
   headline with a light-weight second line, matching the Storage / Advisory pages. */
function SectionHead({ eyebrow, line1, line2, dark = false, sub }: { eyebrow: string; line1: ReactNode; line2?: ReactNode; dark?: boolean; sub?: ReactNode }) {
  return (
    <Reveal className="text-center">
      <div className="mb-5 flex items-center justify-center gap-3">
        <div className="h-px w-8 bg-orange" />
        <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">{eyebrow}</span>
        <div className="h-px w-8 bg-orange" />
      </div>
      <h2 className={`mx-auto max-w-[780px] text-4xl font-black leading-[0.95] md:text-5xl lg:text-6xl ${dark ? 'text-warm-white' : 'text-black'}`}>
        {line1}
        {line2 && <><br /><span className={`font-light ${dark ? 'text-warm-white/30' : 'text-black/30'}`}>{line2}</span></>}
      </h2>
      {sub && <p className={`mx-auto mt-6 max-w-[640px] text-body leading-[1.7] lg:text-subhead ${dark ? 'text-warm-white/50' : 'text-stone'}`}>{sub}</p>}
    </Reveal>
  )
}

/* Ordered by what a prospective owner cares about first: the fee is the
   differentiator, speed second, then proof of operating credibility. */
const HERO_STATS = [
  { n: '6%', l: 'Flat fee, books included' },
  { n: '30+', l: 'Facilities retrofitted' },
  { n: '3', l: 'Facilities operated' },
  { n: '$200M+', l: 'In storage transactions across our ecosystem' },
]

const SERVICES = [
  { Icon: TrendingUp, t: 'Revenue & dynamic pricing', d: 'Demand-based rates tuned every week — pushing rate without spooking tenants or churning your base.' },
  { Icon: Megaphone, t: 'Marketing & online rentals', d: 'SEO, paid search, and a conversion-built listing. Renters find you and reserve online in minutes.' },
  { Icon: PhoneCall, t: 'Call center & lead capture', d: 'Every call answered, every lead worked. No rentals lost to a locked office or a full voicemail.' },
  { Icon: Gavel, t: 'Collections & auctions', d: 'Automated reminders, clean lien processing, and by-the-book auction handling that protects the asset.' },
  { Icon: Wrench, t: 'Maintenance & vendors', d: 'Hybrid site visits and a vetted vendor bench keep the property audit-ready, clean, and leasable.' },
  { Icon: Calculator, t: 'Bookkeeping & reporting', d: 'Full books, monthly P&L, and tax-ready statements. Not an add-on — it comes standard.' },
  { Icon: Cpu, t: 'Technology & smart access', d: 'Smart locks, gate control, and a modern management stack. The facility runs on software, not staff.' },
  { Icon: Umbrella, t: 'Tenant protection', d: 'Tenant insurance and protection plans that add a revenue line and de-risk the whole property.' },
]

const PROBLEMS = [
  { n: '01', t: 'You compete with REITs on rate', d: 'The big operators price with data science and buy marketing at scale. Alone, you feel it in occupancy and NOI.' },
  { n: '02', t: 'On-site staff is expensive and thin', d: 'A manager in a chair all day is your biggest line item — and your biggest single point of failure when they quit.' },
  { n: '03', t: 'Absentee management drifts', d: 'Delinquencies creep, curb appeal slips, rates go stale. Small misses compound into real value lost every month.' },
  { n: '04', t: 'The books are a year-end fire drill', d: 'Reconciliations, P&L, tax prep — scattered across spreadsheets and inboxes until it all comes due at once.' },
]

const WHY = [
  { Icon: Building2, t: 'Operator-owned', d: 'We own and run our own facilities. We manage yours the exact same way — with real skin in the game.', color: 'bg-orange', dark: false },
  { Icon: ShieldOff, t: 'Not a REIT. No agenda.', d: "The largest managers are also the largest buyers. We're an independent operator — here to run your facility first.", color: 'bg-terracotta', dark: false },
  { Icon: BadgeCheck, t: 'Your building, our brand', d: 'Facilities operate as JOURNEY.STORAGE™ — instant credibility, a modern web presence, and a brand renters already trust.', color: 'bg-charcoal', dark: false },
  { Icon: Repeat, t: 'One number. No surprises.', d: '6% of revenue with bookkeeping, marketing, and technology all included — one rate, no line-item add-ons. Your terms are laid out plainly in your proposal.', color: 'bg-sand', dark: true },
]

const MODEL = [
  { k: 'Software runs the front desk', d: 'Smart access, dynamic pricing, online rentals, and automated collections replace the person sitting in the office all day.', pts: ['24/7 online rentals', 'Instant communications', 'Smart gate & space access'] },
  { k: 'Our team runs the operation', d: 'Revenue management, marketing, call handling, and delinquency are handled remotely by people who do this all day, across facilities.', pts: ['Weekly rate & revenue reviews', 'Lead capture & follow-up', 'Reporting & oversight'] },
  { k: 'Locals run the property', d: 'Scheduled hybrid site visits handle the physical — audits, curb appeal, unit readiness, and vendor coordination.', pts: ['Facility audits by us', 'Vendor management', 'Curb-appeal upkeep'] },
]

/* Operating targets & standards we manage toward — deliberately framed as goals,
   not guarantees or past results. Every facility starts from a different place. */
const OUTCOMES = [
  { fig: '90%+', label: 'Target economic occupancy', d: 'Marketing, a real call center, and dynamic pricing all aimed at a stabilized, high-revenue facility.' },
  { fig: 'Under 2%', label: 'Target delinquency', d: 'Automated reminders and clean, by-the-book lien handling keep past-due low and predictable.' },
  { fig: 'Weekly', label: 'Rate reviews', d: 'We revisit street and existing-tenant rates every week — capturing revenue most owners leave on the table.' },
  { fig: 'Monthly', label: 'Reconciled owner report', d: 'Books closed and a clear P&L in your dashboard every month, on a set date. No year-end scramble.' },
]

/* Smart-lock conversion — Journey Managed is built for smart-lock operations.
   For owners not on smart access yet, we run the full retrofit with industry
   hardware vendors as part of onboarding. */
const CONVERSION = [
  { Icon: ClipboardCheck, t: 'Site survey & access audit', d: 'We map every unit, gate, and door, then spec the right hardware for your buildings, layout, and climate.' },
  { Icon: Handshake, t: 'Vendor selection & pricing', d: 'We work with proven smart-lock and gate-access vendors, gather the quotes, and put transparent conversion pricing in your proposal.' },
  { Icon: Wrench, t: 'Installation & integration', d: 'We coordinate the install and wire locks, gate, and cameras into our management stack. The facility stays open the whole time.' },
  { Icon: Smartphone, t: 'Tenant transition', d: 'We move your tenants to app and keypad access with clear communication, so nobody shows up to a lock they cannot open.' },
]

const FACILITIES = [
  { name: 'Temple Hall Hwy', city: 'Granbury, TX', img: '/images/granbury/rs-card-temple-hall.webp', href: 'https://journey.storage/rentaspace/templehallhwy' },
  { name: 'Western Hills Trl', city: 'Granbury, TX', img: '/images/granbury/rs-card-western-hills.webp', href: 'https://journey.storage/rentaspace/westernhillstrl' },
  { name: 'McCreary Rd', city: 'Granbury, TX', img: '/images/granbury/rs-card-cleveland.webp', href: 'https://journey.storage/rentaspace/mccrearyrd' },
]

const INCLUDED = [
  'Full facility operations & staffing', 'Revenue management & dynamic pricing',
  'Marketing, SEO & paid acquisition', 'Call center & lead conversion',
  'Collections, delinquency & auctions', 'Complete bookkeeping & monthly P&L',
  'Tax-ready financial statements', 'Technology & smart-access stack',
  'Owner dashboard & reporting', 'Hybrid on-site visits & vendor management',
]

/* Generic-competitor phrasing only — no named competitors, no invented figures. */
const COMPARE = [
  { item: 'Management fee', journey: '6% flat', typical: 'Comparable %' },
  { item: 'Bookkeeping & monthly P&L', journey: 'Included', typical: 'On you, or billed extra' },
  { item: 'Technology & smart access', journey: 'Included', typical: 'Add-on fees' },
  { item: 'Setup / onboarding fee', journey: 'Quoted upfront', typical: 'Often hidden' },
  { item: 'Owner reporting', journey: 'Monthly, reconciled', typical: 'Varies' },
]

const STEPS = [
  { n: '01', t: 'Discovery & facility review', d: 'A call plus a look at your rent roll, occupancy, and financials. We tell you straight what we can move.' },
  { n: '02', t: 'Proposal & agreement', d: 'A transparent scope and the flat fee in writing, with every term laid out plainly before you sign anything.' },
  { n: '03', t: 'Systems & brand transition', d: 'We migrate to our management stack, stand up smart access, and take the facility live as JOURNEY.STORAGE™.' },
  { n: '04', t: 'Live, managed & reported', d: 'We operate day-to-day and you get a clean, reconciled monthly report and owner dashboard.' },
]

const FAQS = [
  { q: 'Do I still own my facility?', a: 'Yes — completely. You keep 100% ownership and all the upside. Journey Managed operates the facility on your behalf; you stay the owner and the decision-maker.' },
  { q: 'What does the fee actually cover?', a: 'Everything to run the facility: operations, revenue management, marketing, call center, collections, maintenance coordination, technology, and full bookkeeping with monthly financials. One flat percentage of revenue — no à la carte add-ons.' },
  { q: 'Do you really do the bookkeeping?', a: 'Yes, and it is the part most managers skip. We keep the full books — bank reconciliations, AP/AR, monthly P&L, and tax-ready statements — so your accountant gets clean numbers, not a shoebox.' },
  { q: 'What is “tech-first” — is anyone ever on site?', a: 'The office runs on software, so we do not pay for someone to sit in a chair all day. But yes — locals run the property, with scheduled site visits for audits, curb appeal, unit readiness, and vendors. You get modern operations without the on-site overhead.' },
  { q: 'What happens to my current staff?', a: 'It depends on the facility. In many cases we operate leaner and reassign or wind down on-site roles; in others we keep a part-time local presence. We will walk through it honestly during discovery.' },
  { q: 'Are you going to try to buy my facility?', a: 'No. Unlike the REIT-owned managers, we are an independent operator. Third-party management is the service — not a funnel to acquire your property out from under you.' },
  { q: 'My facility doesn’t have smart locks yet. Can you still take it on?', a: 'Yes. The conversion is part of the service. We survey the site, spec and price the hardware with our vendor partners, manage the installation, and move your tenants to smart access during onboarding. The facility stays open the whole time, and the hardware is yours.' },
  { q: 'How fast can you take over?', a: 'Faster than the large managers typically quote, because our stack is tech-first from day one. The exact timeline depends on your facility — particularly whether it needs a smart-lock retrofit — and we scope it upfront in your proposal so there are no surprises.' },
]

export default function ManagedView() {
  const reduceMotion = useReducedMotion()
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', facilities: '1', message: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.website) { setSubmitted(true); return } // honeypot
    setError(false)
    setSubmitting(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_source: 'managed-inquiry',
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          facilities: form.facilities,
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
      if (Array.isArray(dl)) dl.push({ event: 'lead_submitted', form_source: 'managed-inquiry' })
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const field = 'w-full rounded-sm bg-white/[0.06] px-4 py-3.5 text-body text-warm-white placeholder:text-warm-white/25 border border-warm-white/15 focus:border-orange focus-visible:outline-none transition-colors duration-150'

  return (
    <div id="managed" className="bg-warm-white text-black antialiased">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      {/* FAQPage structured data — mirrors the visible FAQ section below */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* ══════════ HERO — full-bleed photographic ══════════ */}
      <section className="grain relative flex h-screen min-h-[680px] items-center overflow-hidden bg-black">
        {/* Background video — muted 8s aerial loop. The poster frame paints
            immediately, `muted` is also set via ref because React omits the
            attribute from SSR HTML (autoplay policy needs it), and
            reduced-motion users get the still poster instead of autoplay. */}
        <video
          ref={(el) => { if (el) el.muted = true }}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="/videos/managed-hero.mp4"
          poster="/videos/managed-hero-poster.webp"
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        {/* legibility + brand warmth overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/70 to-black/35 max-lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/40 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-orange/[0.06] mix-blend-multiply" aria-hidden />

        {/* ghost watermark */}
        <div className="pointer-events-none absolute inset-0 z-[3] flex items-center overflow-hidden select-none" aria-hidden>
          <span className="ml-[3%] text-[9rem] font-black uppercase leading-none text-warm-white/[0.04] md:text-[15rem] lg:text-[22rem]">OPERATED</span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-content px-5 md:px-8 lg:px-16">
          <div className="max-w-[940px]">
            <Reveal immediate>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-warm-white/[0.12] bg-black/40 px-5 py-2.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.9rem] font-black tracking-[0.06em] text-warm-white/90">JOURNEY.<span className="font-light">MANAGED</span>&trade;</span>
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-warm-white/40">Third-Party Management</span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.12} immediate>
              <h1 className="track-tighter mt-8 text-[2.6rem] font-black leading-[0.95] text-warm-white sm:text-[3.4rem] md:text-[3.9rem] lg:text-[4.15rem]">
                We run storage for a&nbsp;living.
                <br /><span className="font-light text-warm-white/45">Now we&rsquo;ll run yours.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.24} immediate>
              <p className="mt-7 max-w-[560px] text-lg leading-[1.7] text-warm-white/70 lg:text-xl">
                <strong className="font-black text-warm-white">JOURNEY.</strong>MANAGED&trade; is{' '}
                <strong className="font-semibold text-warm-white/90">tech-first, quality-driven</strong>{' '}
                third-party management for independent self-storage owners. Your facility becomes a{' '}
                <strong className="font-black text-warm-white">JOURNEY.</strong>STORAGE&trade; store — operated the way we run our own, with the
                <strong className="font-semibold text-warm-white/90"> books included</strong>, at one transparent fee.
              </p>
            </Reveal>

            <Reveal delay={0.36} immediate>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#managed-contact" className="btn-spring shadow-cta inline-flex items-center gap-2 rounded-xl bg-orange px-7 py-4 text-body-sm font-bold text-warm-white">
                  Get your free facility review <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href="#managed-model" className="btn-spring inline-flex items-center gap-2 rounded-xl border-2 border-warm-white/40 px-7 py-4 text-body-sm font-bold text-warm-white hover:border-warm-white hover:bg-warm-white hover:text-black">
                  See how it works
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
          <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="h-6 w-6 text-warm-white/40" aria-hidden />
          </motion.div>
        </div>
      </section>

      {/* ══════════ PROOF BAR — stats ══════════ */}
      <div className="grain relative overflow-hidden border-t border-warm-white/[0.06] bg-black">
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(70% 120% at 50% 0%, rgba(232,98,42,0.10) 0%, transparent 60%)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 py-10 md:px-8 lg:px-16 lg:py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {HERO_STATS.map((s, i) => (
              <motion.div
                key={s.l}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              >
                <p className="track-tight text-3xl font-black leading-none text-warm-white lg:text-4xl">
                  {s.n.replace('+', '')}{s.n.includes('+') && <span className="text-orange">+</span>}
                </p>
                <p className="mt-2 text-caption leading-snug text-warm-white/35">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ PROBLEM ══════════ */}
      <section className="border-b border-black/[0.06] bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead
            eyebrow="The independent owner’s dilemma"
            line1="Running a facility yourself"
            line2={<>is a full-time job you didn’t sign up&nbsp;for.</>}
          />
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.n} delay={0.08 * i}>
                <div className="card h-full rounded-2xl border border-black/[0.06] bg-white/40 p-7 lg:p-8">
                  <span className="text-[0.7rem] font-bold tracking-[0.3em] text-orange">{p.n}</span>
                  <h3 className="mt-3 text-[1.3rem] font-black tracking-[-0.01em] text-black">{p.t}</h3>
                  <p className="mt-2.5 text-body leading-[1.65] text-stone">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ MODEL ══════════ */}
      <section id="managed-model" className="scroll-mt-20 bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead
            eyebrow="Our model"
            line1="Tech-first, by design."
            line2="Not by compromise."
            sub="Modern storage runs on software. Running lean isn’t a cut corner — it’s lower overhead that stays in your NOI. Here’s how the three layers fit together."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {MODEL.map((m, i) => (
              <Reveal key={m.k} delay={0.1 * i}>
                <div className="card flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white/50 p-7 lg:p-8">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-orange/[0.12] text-[1.1rem] font-black text-orange">{String(i + 1)}</span>
                  <h3 className="mt-5 text-[1.3rem] font-black tracking-[-0.01em] text-black">{m.k}</h3>
                  <p className="mt-2.5 text-body leading-[1.65] text-stone">{m.d}</p>
                  <ul className="mt-5 space-y-2 border-t border-black/[0.07] pt-5">
                    {m.pts.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5 text-body-sm font-medium text-charcoal">
                        <Check className="h-4 w-4 shrink-0 text-sage-green" strokeWidth={2.5} aria-hidden />{pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.24}>
            <div className="mx-auto mt-12 max-w-[720px] text-center">
              <p className="track-tight text-[1.35rem] font-black text-black md:text-[1.6rem]">
                We automate everything. Except what matters.
              </p>
              <p className="mt-3 text-body leading-[1.7] text-stone">
                <strong className="font-bold text-black">Systems</strong> handle everything that <em>doesn&rsquo;t</em> require empathy.{' '}
                <strong className="font-bold text-black">Humans</strong> handle everything that <em>does</em>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ WHAT WE OPERATE TOWARD (targets) ══════════ */}
      <section className="relative overflow-hidden bg-black">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(70% 70% at 50% 0%, rgba(232,98,42,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead
            eyebrow="What we operate toward"
            line1="We manage to the numbers"
            line2="that actually move value."
            dark
            sub="Occupancy, rate, delinquency, and clean books are what a facility is worth. Here’s what we run every property toward — the same discipline we hold our own to."
          />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {OUTCOMES.map((o, i) => (
              <Reveal key={o.label} delay={0.08 * i}>
                <div className="h-full rounded-2xl border border-warm-white/[0.08] bg-warm-white/[0.03] p-7 transition-colors duration-200 hover:border-orange/40">
                  <p className="track-tighter text-[2.75rem] font-black leading-none text-orange">{o.fig}</p>
                  <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-warm-white/50">{o.label}</p>
                  <p className="mt-2 text-body-sm leading-[1.6] text-warm-white/45">{o.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-[680px] text-center text-body-sm leading-[1.7] text-warm-white/35">
              These are the operating targets and standards we manage toward — <span className="text-warm-white/60">not a guarantee of results.</span>{' '}
              Every facility starts somewhere different. Your free facility review gives you a realistic, property-specific read on what&rsquo;s achievable.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════ SMART-LOCK CONVERSION ══════════ */}
      <section className="border-t border-black/[0.06] bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead
            eyebrow="Modernization included"
            line1="No smart locks yet?"
            line2="We run the whole conversion."
            sub="Journey Managed is built for smart-lock operations, but plenty of great facilities still run on padlocks and a keypad. If that is yours, we manage the entire retrofit with the industry's hardware vendors and hand you back a remotely managed store."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CONVERSION.map((c, i) => (
              <Reveal key={c.t} delay={0.08 * i}>
                <div className="card flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white/50 p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange/[0.12] text-orange">
                    <c.Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[1.15rem] font-black tracking-[-0.01em] text-black">{c.t}</h3>
                  <p className="mt-2 text-body-sm leading-[1.6] text-stone">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-[640px] text-center text-body text-stone">
              Already on smart locks? Even better. <span className="font-bold text-black">Your transition gets faster</span>, and
              onboarding starts by plugging the hardware you own into our management stack.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════ WHAT WE MANAGE ══════════ */}
      <section className="relative overflow-hidden bg-black">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(70% 60% at 50% 0%, rgba(232,98,42,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead eyebrow="Full scope" line1="One partner." line2="The whole operation." dark />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.t} delay={0.05 * i}>
                <div className="group h-full rounded-2xl border border-warm-white/[0.08] bg-warm-white/[0.03] p-6 transition-colors duration-200 hover:border-orange/40 hover:bg-warm-white/[0.05]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange/[0.14] text-orange">
                    <s.Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-black text-warm-white">{s.t}</h3>
                  <p className="mt-2 text-body-sm leading-[1.6] text-warm-white/45">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BOOKKEEPING SPOTLIGHT ══════════ */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Included, not extra</span>
              </div>
              <h2 className="text-4xl font-black leading-[0.98] text-black md:text-5xl">
                Most managers stop at the gate. <span className="text-orange">We keep the books.</span>
              </h2>
              <p className="mt-6 text-body leading-[1.7] text-stone lg:text-subhead">
                Bookkeeping is the piece almost every third-party manager makes you handle yourself. We run
                the whole financial back office — so your accountant gets clean numbers and you get a true
                picture of the asset, every month.
              </p>
              <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {['Bank & credit reconciliations', 'Accounts payable & receivable', 'Monthly profit & loss', 'Tax-ready year-end statements', 'Owner dashboard & KPIs', 'Cash-flow visibility'].map((x) => (
                  <li key={x} className="flex items-center gap-2.5 text-body font-medium text-charcoal">
                    <Check className="h-4 w-4 shrink-0 text-sage-green" strokeWidth={2.5} aria-hidden />{x}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="card rounded-3xl border border-black/[0.06] bg-white p-7 lg:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-stone">Owner report</p>
                    <p className="track-tight text-[1.15rem] font-black text-black">Monthly snapshot</p>
                  </div>
                  <span className="rounded-full bg-sage-green/15 px-3 py-1 text-[0.7rem] font-black uppercase tracking-wide text-[#5c8a52]">Reconciled</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { l: 'Revenue', v: '$48,200', d: '+6.4%' },
                    { l: 'NOI', v: '$31,540', d: '+8.1%' },
                    { l: 'Occupancy', v: '90%', d: '+3 pts' },
                    { l: 'Delinquency', v: '2.1%', d: '−1.4 pts' },
                  ].map((k) => (
                    <div key={k.l} className="rounded-2xl border border-black/[0.05] bg-warm-white/60 p-4">
                      <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-stone">{k.l}</p>
                      <p className="track-tight mt-1 text-[1.5rem] font-black text-black">{k.v}</p>
                      <p className="text-[0.72rem] font-bold text-sage-green">{k.d} vs last mo.</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-black/[0.05] bg-warm-white/60 p-4">
                  <div className="flex items-end justify-between gap-1.5">
                    {[42, 48, 45, 53, 58, 61, 64, 68].map((h, idx) => (
                      <div key={idx} className="flex-1 rounded-t bg-gradient-to-t from-orange/30 to-orange" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                  <p className="mt-3 text-[0.72rem] font-medium text-stone">Trailing 8 months · net operating income</p>
                </div>
                <p className="mt-4 text-[0.68rem] italic text-stone/60">Illustrative figures for layout.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ WHY JOURNEY ══════════ */}
      <section className="relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead eyebrow="Why Journey" line1="Managers who" line2="actually care." dark />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {WHY.map((c, i) => (
              <Reveal key={c.t} delay={0.1 * i}>
                <div className={`group relative ${c.color} flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1 md:min-h-[240px]`}>
                  <span className={`pointer-events-none absolute -right-5 -bottom-8 select-none ${c.dark ? 'text-black/[0.06]' : 'text-warm-white/[0.09]'}`} aria-hidden>
                    <c.Icon className="h-40 w-40" strokeWidth={1} />
                  </span>
                  <span className={`relative z-10 grid h-11 w-11 place-items-center rounded-xl ${c.dark ? 'bg-black/10 text-black' : 'bg-black/15 text-warm-white'}`}>
                    <c.Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <div className="relative z-10 mt-auto pt-6">
                    <h3 className={`text-[1.4rem] font-black tracking-[-0.01em] ${c.dark ? 'text-black' : 'text-warm-white'}`}>{c.t}</h3>
                    <p className={`mt-2 text-body-sm leading-[1.6] ${c.dark ? 'text-black/60' : 'text-warm-white/70'}`}>{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PROOF — OUR FACILITIES ══════════ */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead
            eyebrow="Proof, not promises"
            line1="We don’t just manage."
            line2="We operate."
            sub="These are our own facilities in Granbury, Texas. We run them tech-first every day — the same playbook, systems, and books we’ll put to work on yours."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {FACILITIES.map((f, i) => (
              <Reveal key={f.name} delay={0.1 * i}>
                <Link href={f.href} className="card group block overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={f.img} alt={f.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(24,24,24,0.55) 100%)' }} />
                    <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.15em] text-warm-white backdrop-blur">Journey-operated</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div>
                      <h3 className="text-[1.2rem] font-black tracking-[-0.01em] text-black">{f.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-body-sm text-stone"><MapPin className="h-3.5 w-3.5 text-orange" aria-hidden />{f.city}</p>
                    </div>
                    <span className="btn-spring grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange/[0.12] text-orange group-hover:bg-orange group-hover:text-warm-white"><ArrowRight className="h-4 w-4" aria-hidden /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOUNDER ══════════ */}
      <section id="managed-leadership" className="scroll-mt-20 relative overflow-hidden border-t border-black/[0.06] bg-warm-white">
        <div className="pointer-events-none absolute left-0 top-8 z-0 hidden select-none lg:block" aria-hidden>
          <span className="ml-[4%] text-[10rem] font-black uppercase leading-none text-black/[0.03] xl:text-[14rem]">JONAH</span>
        </div>
        <div className="relative z-10 mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <div className="lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-16">
            {/* Photo */}
            <Reveal className="flex flex-col items-center lg:items-start">
              <div className="relative aspect-[3/4] w-56 overflow-hidden rounded-2xl shadow-[0_24px_48px_-20px_rgba(24,24,24,0.4)] lg:w-full">
                <Image
                  src="/images/team/jonah-portrait-office.webp"
                  alt="Jonah M. Hall, Founder & CEO of Journey.Storage"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:1023px) 224px, 300px"
                />
              </div>
              <p className="mt-4 text-[1.15rem] font-black text-black">Jonah M. Hall</p>
              <p className="text-caption uppercase tracking-[0.15em] text-orange">Founder &amp; CEO</p>
            </Reveal>

            {/* Bio */}
            <div className="mt-10 lg:mt-0">
              <Reveal>
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-orange" />
                  <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Who runs your facility</span>
                </div>
                <h2 className="text-4xl font-black leading-[1.0] text-black md:text-5xl">
                  You&rsquo;re not handing your facility <span className="font-light text-black/30">to a call center.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-body leading-[1.8] text-charcoal">
                  <strong className="font-black text-black">JOURNEY.</strong>MANAGED&trade; is run by <strong className="font-bold text-black">Jonah M. Hall</strong>, who has spent his
                  career operating self-storage from the inside — acquisitions, development, operations, and asset management.
                </p>
                <p className="mt-4 text-body leading-[1.8] text-charcoal">
                  He co-founded <strong className="font-bold text-black">Smartlock Self&nbsp;Storage&reg;</strong>{' '}
                  and scaled it to ~$70M+ in assets
                  under management across 17 locations in three states — pioneering the autonomous, tech-first model{' '}
                  <strong className="font-black text-black">JOURNEY.</strong>MANAGED&trade; runs on.
                  As President &amp; Chief Investment Officer at <strong className="font-bold text-black">Cedar Creek Capital&reg;</strong>,
                  he repositioned over $150M in assets and acquired $60M more.
                </p>
                <p className="mt-4 text-body leading-[1.8] text-charcoal">
                  That&rsquo;s the operator accountable for your NOI — <strong className="font-bold text-black">not a franchise desk, not a REIT&rsquo;s regional manager.</strong>
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TRANSPARENT TERMS ══════════ */}
      <section id="managed-pricing" className="scroll-mt-20 relative overflow-hidden bg-black">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(232,98,42,0.16) 0%, transparent 55%)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead eyebrow="Transparent terms" line1="One fee." line2="Everything included." dark />

          <Reveal delay={0.12}>
            <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-3xl border border-warm-white/[0.1] bg-warm-white/[0.04] backdrop-blur-sm">
              <div className="border-b border-warm-white/[0.08] p-8 text-center lg:p-10">
                <div className="flex items-start justify-center gap-1">
                  <span className="track-tighter text-[4.5rem] font-black leading-none text-orange lg:text-[5.5rem]">6%</span>
                  <span className="mt-3 text-body-sm font-bold text-warm-white/50">/ of monthly<br />revenue</span>
                </div>
                <p className="mt-4 text-body font-medium text-warm-white/70">Management <span className="text-warm-white">and</span> bookkeeping, in one number.</p>
                <p className="mx-auto mt-3 max-w-[46ch] text-body-sm leading-[1.6] text-warm-white/45">
                  On a facility grossing $300k a year, that&rsquo;s $18k. Less than half the fully loaded
                  cost of one full-time on-site manager, with the books done.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  {['Bookkeeping included', 'One flat rate', 'No line-item add-ons'].map((t) => (
                    <span key={t} className="rounded-full border border-warm-white/15 px-3.5 py-1.5 text-[0.75rem] font-bold text-warm-white/75">{t}</span>
                  ))}
                </div>
              </div>
              <div className="p-8 lg:p-10">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-orange">What the fee covers</p>
                <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {INCLUDED.map((x) => (
                    <li key={x} className="flex items-start gap-2.5 text-body-sm text-warm-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-green" strokeWidth={2.5} aria-hidden />{x}
                    </li>
                  ))}
                </ul>
                {/* Journey vs typical third-party manager — the fine-print claim, made scannable */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-warm-white/[0.08]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-warm-white/[0.08] bg-warm-white/[0.03]">
                        <th scope="col" className="px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-warm-white/40">What you pay for</th>
                        <th scope="col" className="px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-orange">Journey</th>
                        <th scope="col" className="px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-warm-white/40">Typical manager</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-white/[0.06]">
                      {COMPARE.map((r) => (
                        <tr key={r.item}>
                          <td className="px-4 py-3 text-body-sm font-medium text-warm-white/70">{r.item}</td>
                          <td className="px-4 py-3 text-body-sm font-bold text-warm-white">{r.journey}</td>
                          <td className="px-4 py-3 text-body-sm text-warm-white/40">{r.typical}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <a href="#managed-contact" className="btn-spring shadow-cta mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-4 text-body-sm font-bold text-warm-white">
                  Get your free facility review <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <p className="mt-4 text-center text-[0.75rem] text-warm-white/40">One number covers it all. <span className="text-warm-white/25">No line-item surprises at the end of the month.</span></p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ ONBOARDING ══════════ */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <SectionHead
            eyebrow="Getting started"
            line1="From handshake to fully managed"
            line2="without the drawn-out handoff."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={0.09 * i}>
                <div className="relative h-full rounded-2xl border border-black/[0.06] bg-white/50 p-7">
                  <span className="track-tighter text-[2.4rem] font-black leading-none text-orange/25">{s.n}</span>
                  <h3 className="mt-3 text-[1.15rem] font-black tracking-[-0.01em] text-black">{s.t}</h3>
                  <p className="mt-2 text-body-sm leading-[1.6] text-stone">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="border-t border-black/[0.06] bg-warm-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Common questions</span>
              </div>
              <h2 className="text-4xl font-black leading-[0.98] text-black md:text-5xl">
                Answers before <span className="font-light text-black/30">you ask.</span>
              </h2>
              <p className="mt-6 text-body leading-[1.7] text-stone">
                Still weighing it? Email us at <a href="mailto:hello@journey.storage" className="font-bold text-orange underline-offset-4 hover:underline">hello@journey.storage</a> — a real operator will answer.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="divide-y divide-black/[0.08] border-t border-black/[0.08]">
                {FAQS.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.05rem] font-black text-black">
                      {f.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-orange transition-transform duration-200 group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="mt-3 max-w-[62ch] text-body leading-[1.7] text-stone">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="managed-contact" className="grain relative overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 35%, rgba(232,98,42,0.10), transparent)' }} />
        <div className="relative z-10 mx-auto max-w-content px-5 py-20 md:px-8 lg:px-16 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-orange" />
                <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Free facility review</span>
              </div>
              <h2 className="text-4xl font-black leading-[0.98] text-warm-white md:text-5xl lg:text-6xl">
                Let&rsquo;s look at <span className="font-light text-warm-white/35">your facility.</span>
              </h2>
              <p className="mt-6 max-w-[440px] text-body leading-[1.7] text-warm-white/60 lg:text-subhead">
                Send us the basics and a real operator will review your facility, free — a straight read on
                what we&rsquo;d move on rate, occupancy, and delinquency, plus the flat fee to run it. No obligation.
              </p>
              <ul className="mt-8 space-y-3">
                {['A real operator reviews your rent roll & numbers', 'What we’d move — rate, occupancy, delinquency', 'Your transparent flat fee, in writing — no obligation'].map((x) => (
                  <li key={x} className="flex items-center gap-3 text-body font-medium text-warm-white/80">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange/20 text-orange"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /></span>{x}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-warm-white/[0.08] bg-warm-white/[0.03] px-8 py-16 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-green/20 text-sage-green"><Check className="h-7 w-7" strokeWidth={3} aria-hidden /></span>
                  <h3 className="mt-5 text-[1.6rem] font-black text-warm-white">Got it — thank you.</h3>
                  <p className="mt-2 max-w-[32ch] text-body font-light text-warm-white/50">A member of our team will review your facility and be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="rounded-3xl border border-warm-white/[0.08] bg-warm-white/[0.03] p-6 lg:p-8">
                  <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-body-sm font-bold text-warm-white">Name</span>
                      <input required value={form.name} onChange={set('name')} placeholder="Your full name" className={field} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-body-sm font-bold text-warm-white">Email</span>
                      <input required type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" className={field} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-body-sm font-bold text-warm-white">Phone <span className="font-normal text-warm-white/35">(optional)</span></span>
                      <input type="tel" value={form.phone} onChange={set('phone')} placeholder="(555) 000-0000" className={field} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-body-sm font-bold text-warm-white"># of facilities</span>
                      <select value={form.facilities} onChange={set('facilities')} className={`${field} appearance-none`}>
                        <option value="1">1 facility</option>
                        <option value="2-3">2–3 facilities</option>
                        <option value="4-9">4–9 facilities</option>
                        <option value="10+">10+ facilities</option>
                      </select>
                    </label>
                  </div>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-body-sm font-bold text-warm-white">Facility name / location</span>
                    <input value={form.company} onChange={set('company')} placeholder="e.g. Main St Storage — Granbury, TX" className={field} />
                  </label>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-body-sm font-bold text-warm-white">Anything we should know?</span>
                    <textarea rows={3} value={form.message} onChange={set('message')} placeholder="Occupancy, unit count, what's frustrating you today..." className={`${field} resize-none`} />
                  </label>
                  <button type="submit" disabled={submitting} className="btn-spring shadow-cta mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-4 text-body-sm font-bold text-warm-white disabled:opacity-50">
                    {submitting ? 'Sending…' : <>Get my free review <ArrowRight className="h-4 w-4" aria-hidden /></>}
                  </button>
                  {error && <p className="mt-3 text-body-sm text-[#E8865C]" role="alert">Something went wrong. Please try again, or email hello@journey.storage.</p>}
                  <p className="mt-4 text-center text-[0.72rem] text-warm-white/35">We&rsquo;ll only use your details to prepare your review. No spam, no obligation.</p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
