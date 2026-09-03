'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Check, ChevronLeft, ChevronRight, ShieldCheck, FileText, CreditCard, KeyRound } from 'lucide-react'

/**
 * PREVIEW-ONLY online move-in flow. Mirrors the real Nectar rental sequence
 * (space → hold → lease-set-up → reserve → sign documents → lease → autopay)
 * but runs entirely client-side in demo mode — no API mutations, no charge,
 * no real rental. Styled to journey.storage's high-end dark surface language:
 * grain, orange radial glow, ghost watermark, rule-flanked eyebrows, the
 * signature asymmetric radius, and dark glass forms.
 */

type Space = { size: string; price: number; sqft?: number; category?: string | null }

const STEPS = ['Move-in', 'Your details', 'Protection', 'Review', 'Sign lease', 'Payment', 'Done'] as const
type StepName = (typeof STEPS)[number]
const WATERMARK: Record<StepName, string> = { 'Move-in': 'SPACE', 'Your details': 'ABOUT', Protection: 'PROTECT', Review: 'REVIEW', 'Sign lease': 'SIGN', Payment: 'PAY', Done: 'WELCOME' }

const PLANS = [
  { id: 'p1', coverage: 2000, premium: 10 },
  { id: 'p2', coverage: 3000, premium: 13 },
  { id: 'p3', coverage: 5000, premium: 16 },
]
const ADMIN_FEE = 30
const TAX_RATE = 0.0825 // TX example rate — final tax confirmed at the facility

const money = (n: number) => `$${n.toFixed(2)}`
// Local calendar date (not UTC) — UTC rolls to "tomorrow" in the evening in
// Texas, which blocked same-day (24/7) move-ins.
const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Journey signature radius — one large corner, three sharp.
const R = 'rounded-tl-[20px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]'
const FIELD = 'w-full rounded-sm border border-stone/30 bg-warm-white/[0.06] px-4 py-3 text-[0.9375rem] text-warm-white placeholder:text-stone transition-colors duration-150 focus:border-orange focus-visible:outline-none focus-visible:ring-0'
// Date inputs need iOS Safari fixes: consistent height, native inset styling
// stripped, value left-aligned (otherwise the box renders collapsed/off).
const DATE_FIELD = `${FIELD} [color-scheme:dark] block min-h-[3.25rem] appearance-none [-webkit-appearance:none] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-date-and-time-value]:m-0 [&::-webkit-date-and-time-value]:text-left`

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 bg-orange" />
      <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-orange">{label}</span>
    </div>
  )
}

export default function RentalFlow({ facility, space, preview = false, onClose }: { facility: { slug: string; short: string; address: string; city: string; phone: string; tel: string }; space: Space; preview?: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [moveIn, setMoveIn] = useState(todayISO())
  const [details, setDetails] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', dob: '', dlNumber: '', dlState: '', dlExp: '', isBusiness: false, businessName: '', military: false, militaryBranch: '' })
  const [planId, setPlanId] = useState<string>('p2')
  const [signature, setSignature] = useState('')
  const [agree, setAgree] = useState(false)
  const [fullLease, setFullLease] = useState(false)
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', zip: '' })
  const [processing, setProcessing] = useState(false)
  const [payingMsg, setPayingMsg] = useState<string | null>(null)
  const autopay = true // required — enrollment is not optional

  // ── Live API state (demo math is the graceful fallback) ──
  const [hold, setHold] = useState<{ token: string; unitId: string; dossierToken?: string; spaceMixId?: string; promotionId?: string } | null>(null)
  const [realQuote, setRealQuote] = useState<{ dueToday: number; monthlyRent: number; billDay: number; lineItems: { name: string; amount: number }[] } | null>(null)
  const [realPlans, setRealPlans] = useState<{ id: string; coverage: number; premium: number }[] | null>(null)
  const [rentResult, setRentResult] = useState<{ gatePin?: string | null; leaseId?: string; unitNumber?: string | null; documentUrl?: string | null } | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const real = !!hold // live mode once a hold is placed
  const dims = useMemo(() => { const m = space.size.match(/(\d+)\s*×\s*(\d+)/); return m ? { width: Number(m[1]), length: Number(m[2]) } : {} as { width?: number; length?: number } }, [space.size])

  const stepName: StepName = STEPS[step]
  const plans = realPlans && realPlans.length ? realPlans : PLANS
  const plan = plans.find((p) => p.id === planId) ?? plans[0]
  const gateCode = useMemo(() => String(1000 + Math.floor(Math.random() * 8999)), [])
  const unitNo = useMemo(() => `${'ABCD'[Math.floor(Math.random() * 4)]}-${100 + Math.floor(Math.random() * 240)}`, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const firstMonthFull = space.price
  const promoDiscount = firstMonthFull * 0.5
  const firstMonth = firstMonthFull - promoDiscount
  const protection = plan.premium
  const taxable = firstMonth + ADMIN_FEE
  const tax = +(taxable * TAX_RATE).toFixed(2)
  const dueToday = +(firstMonth + ADMIN_FEE + protection + tax).toFixed(2)
  const monthlyGoing = +(space.price + protection).toFixed(2)
  // Effective (real quote when live, else demo)
  const effDueToday = realQuote?.dueToday ?? dueToday
  const effMonthly = realQuote?.monthlyRent ?? space.price

  type Held = { token: string; unitId: string; dossierToken?: string; spaceMixId?: string; promotionId?: string }
  async function doHold(): Promise<Held | null> {
    try {
      const r = await fetch('/api/nectar/checkout/hold', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ facility: facility.slug, width: dims.width, length: dims.length }) })
      const j = await r.json()
      if (r.ok && j.holdToken) return { token: j.holdToken, unitId: j.unitId, dossierToken: j.dossierToken, spaceMixId: j.spaceMixId, promotionId: j.promotionId }
    } catch { /* fall through */ }
    return null
  }
  // Place a 15-minute hold on entering the flow. Returns whether it succeeded.
  async function placeHold(): Promise<boolean> {
    if (hold) return true
    const h = await doHold()
    if (h) { setHold(h); return true }
    return false
  }
  // ONE lease-setup per hold (a second one 500s the lease). We quote exactly once
  // per hold, with the chosen insurance; changing protection re-holds first.
  async function fetchQuote(h: Held, insuranceId?: string): Promise<boolean> {
    try {
      const r = await fetch('/api/nectar/checkout/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ facility: facility.slug, unitId: h.unitId, holdToken: h.token, startDate: moveIn, insuranceId, promotionIds: h.promotionId ? [h.promotionId] : undefined }) })
      const j = await r.json()
      if (j?.dueToday != null) { setRealQuote({ dueToday: j.dueToday, monthlyRent: j.monthlyRent ?? space.price, billDay: j.billDay ?? 1, lineItems: j.lineItems ?? [] }); return true }
    } catch { /* fall through */ }
    return false
  }

  // Load the facility's real protection products when the Protection step opens.
  useEffect(() => {
    if (stepName !== 'Protection' || !real || realPlans) return
    fetch(`/api/nectar/checkout/insurances?facility=${facility.slug}`)
      .then((r) => r.json())
      .then((j) => {
        const opts = ((j.options ?? []) as { id: string; coverage: number; premium: number }[])
          .filter((o) => o.premium > 0 && o.coverage >= 1000)
          .sort((a, b) => a.coverage - b.coverage)
        if (opts.length) { setRealPlans(opts); setPlanId(opts[Math.min(1, opts.length - 1)].id) }
      })
      .catch(() => {})
  }, [stepName, real, realPlans, facility.slug])

  // Commit the rental (real). Returns true on success; false → demo confirmation.
  // While the charge + lease are committing, warn the browser before leaving —
  // closing the tab mid-payment leaves the customer unsure whether they were charged.
  useEffect(() => {
    if (!payingMsg) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [payingMsg])

  async function submitRent(): Promise<boolean> {
    if (!hold || !realQuote) return false // needs the single quote already fetched
    const parts = details.name.trim().split(/\s+/)
    const last = parts.length > 1 ? parts.pop()! : parts[0]
    const first = parts.join(' ') || details.name
    const [mm = '', yyRaw = ''] = card.exp.split('/').map((s) => s.trim())
    const yy = yyRaw.length === 2 ? `20${yyRaw}` : yyRaw
    try {
      const r = await fetch('/api/nectar/checkout/rent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        facility: facility.slug, unitId: hold.unitId, holdToken: hold.token, dossierToken: hold.dossierToken, spaceMixId: hold.spaceMixId, startDate: moveIn,
        billDay: realQuote.billDay, webRate: realQuote.monthlyRent, totalDue: realQuote.dueToday, lineItems: realQuote.lineItems,
        promotionIds: hold.promotionId ? [hold.promotionId] : undefined,
        insuranceId: realPlans ? planId : undefined,
        tenant: {
          first, last, email: details.email, phone: details.phone, address: details.address, city: details.city, state: details.state, zip: details.zip,
          dob: details.dob, dlNumber: details.dlNumber, dlState: details.dlState, dlExp: details.dlExp,
          isBusiness: details.isBusiness, businessName: details.isBusiness ? details.businessName : undefined,
          military: details.military, militaryBranch: details.military ? details.militaryBranch : undefined,
        },
        card: { card_number: card.number.replace(/\s/g, ''), cvv2: card.cvc, exp_mo: mm, exp_yr: yy, name_on_card: details.name, address: details.address, city: details.city, state: details.state, zip: card.zip || details.zip },
      }) })
      const j = await r.json()
      if (r.ok && j.ok) { setRentResult({ gatePin: j.gatePin, leaseId: j.leaseId, unitNumber: j.unitNumber, documentUrl: j.documentUrl }); return true }
    } catch { /* fall through to demo */ }
    return false
  }

  const canNext = () => {
    if (stepName === 'Move-in') return !!moveIn
    if (stepName === 'Your details') return !!details.name && /.+@.+\..+/.test(details.email) && details.phone.length >= 7 && !!details.address && !!details.city && !!details.state && !!details.zip && !!details.dob && !!details.dlNumber && details.dlState.length === 2 && !!details.dlExp && (!details.isBusiness || !!details.businessName)
    if (stepName === 'Protection') return !!planId
    if (stepName === 'Sign lease') return agree && signature.trim().length >= 3
    if (stepName === 'Payment') return card.number.replace(/\s/g, '').length >= 12 && card.exp.length >= 4 && card.cvc.length >= 3
    return true
  }
  const next = async () => {
    if (stepName === 'Move-in') {
      setProcessing(true); setApiError(null)
      const ok = await placeHold()
      setProcessing(false)
      // Live: a hold must succeed to continue. Preview: allow demo walkthrough.
      if (!ok && !preview) { setApiError('We couldn’t hold this space — it may have just been taken. Try another size, or call us.'); return }
      setStep(1); return
    }
    if (stepName === 'Protection') {
      if (real) {
        setProcessing(true); setApiError(null)
        // One lease-setup per hold: if re-quoting after a change, re-hold first.
        let h = hold!
        if (realQuote) { setRealQuote(null); const nh = await doHold(); if (nh) { setHold(nh); h = nh } }
        await fetchQuote(h, realPlans ? planId : undefined)
        setProcessing(false)
      }
      setStep((s) => s + 1); return
    }
    if (stepName === 'Payment') {
      setProcessing(true); setApiError(null)
      if (real && realQuote) {
        // Staged reassurance while Tenant Payments charges the card and the
        // lease is created — a single long server call the customer must wait out.
        const stages: Array<[number, string]> = [
          [0, 'Securing your payment…'],
          [6, 'Processing your card…'],
          [14, 'Creating your lease…'],
          [26, 'Assigning your unit & gate code…'],
          [40, 'Almost there — finalizing with the facility…'],
        ]
        const t0 = Date.now()
        setPayingMsg(stages[0][1])
        const tick = setInterval(() => {
          const s = (Date.now() - t0) / 1000
          for (let i = stages.length - 1; i >= 0; i--) { if (s >= stages[i][0]) { setPayingMsg(stages[i][1]); break } }
        }, 1000)
        // Live: only advance on a real, confirmed lease — never fake success.
        const ok = await submitRent()
        clearInterval(tick)
        setPayingMsg(null)
        setProcessing(false)
        if (!ok) { setApiError('We couldn’t complete your rental just now. Please try again, or call us to finish.'); return }
        setStep((s) => s + 1); return
      }
      // Demo/preview: no hold or no live quote → simulated confirmation.
      await new Promise((r) => setTimeout(r, 1200))
      setProcessing(false); setStep((s) => s + 1); return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const primaryBtn = 'inline-flex items-center justify-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-[0.9375rem] font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,.3)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100'
  const glassCard = `${R} border border-warm-white/10 bg-warm-white/[0.04]`
  const optionBase = `flex w-full items-center justify-between rounded-sm border p-4 text-left transition-colors duration-150`
  const dateLong = (iso: string) => new Date(iso + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="fixed inset-0 z-[130] flex items-stretch justify-center overflow-y-auto bg-black/80 backdrop-blur-md sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={`Rent a ${space.size} space`}>
      <div className={`grain relative flex min-h-full w-full max-w-4xl flex-col overflow-hidden bg-black text-warm-white antialiased sm:min-h-0 sm:max-h-[92vh] sm:rounded-tl-[32px] sm:rounded-tr-[6px] sm:rounded-br-[6px] sm:rounded-bl-[6px]`}>
        {/* Orange radial glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(232,98,42,0.12), transparent 70%)' }} />
        {/* Dot grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #F5F0E8 0.7px, transparent 0.7px)', backgroundSize: '22px 22px' }} />
        {/* Ghost watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[88px] z-[1] flex select-none justify-center overflow-hidden">
          <span className="whitespace-nowrap text-[6rem] font-black uppercase leading-none tracking-tight text-warm-white/[0.03] lg:text-[10rem]">{WATERMARK[stepName]}</span>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-[5] flex items-center justify-between gap-4 border-b border-warm-white/[0.07] bg-black/70 px-5 py-4 backdrop-blur-md lg:px-10">
          <div className="flex items-center gap-3">
            {preview && <span className="rounded-sm bg-orange px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-[0.15em] text-warm-white">Preview</span>}
            <div>
              <p className="text-[0.9375rem] font-black leading-tight tracking-[-0.02em] text-warm-white">Rent a {space.size} space</p>
              <p className="text-[0.75rem] text-warm-white/50">Journey.Storage™ — {facility.short}, Granbury TX</p>
            </div>
          </div>
          <button onClick={onClose} disabled={!!payingMsg} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-warm-white/[0.08] text-warm-white transition-colors hover:bg-warm-white/[0.16] disabled:pointer-events-none disabled:opacity-30"><X className="h-5 w-5" aria-hidden /></button>
        </div>

        {/* Progress rail */}
        {stepName !== 'Done' && (
          <div className="relative z-[5] border-b border-warm-white/[0.07] px-5 py-3.5 lg:px-10">
            <div className="flex items-center gap-1.5">
              {STEPS.slice(0, 6).map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < step ? 'bg-orange' : i === step ? 'bg-orange' : 'bg-warm-white/12'}`} />
              ))}
            </div>
            <p className="mt-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-warm-white/40">{String(step + 1).padStart(2, '0')} / 06 · <span className="text-orange">{stepName}</span></p>
          </div>
        )}

        {/* Body */}
        <div className="relative z-[3] flex-1 overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
          {stepName === 'Move-in' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Move-in" />
              <h2 className="mt-4 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white">When do you want to move in?</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Reserve today, move in on your schedule. Your online rate is locked in.</p>
              <div className={`mt-7 ${glassCard} p-5`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[1.5rem] font-black tracking-[-0.02em] text-warm-white">{space.size}</p>
                    {space.category && <p className="text-[0.8125rem] text-warm-white/45">{space.category}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-warm-white/40 line-through">{money(space.price)}/mo</p>
                    <p className="leading-none"><span className="text-[1.75rem] font-black text-orange">{money(firstMonth)}</span></p>
                    <p className="text-[0.6875rem] font-bold text-sage-green">1st month · 50% off</p>
                  </div>
                </div>
                <label className="mt-5 block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">Move-in date
                  <input type="date" min={todayISO()} value={moveIn} onChange={(e) => setMoveIn(e.target.value)} className={`mt-2 ${FIELD} [color-scheme:dark] block min-h-[3.25rem] appearance-none [-webkit-appearance:none] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-date-and-time-value]:m-0 [&::-webkit-date-and-time-value]:text-left`} />
                </label>
              </div>
              {apiError && <p className="mt-4 rounded-sm border border-[#D4956A]/40 bg-[#D4956A]/10 px-4 py-3 text-[0.8125rem] font-bold text-[#E8A87C]">{apiError} <a href={facility.tel} className="underline">{facility.phone}</a></p>}
            </div>
          )}

          {stepName === 'Your details' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="About you" />
              <h2 className="mt-4 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white">Tell us about you</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">The primary tenant on the lease. Your info is never shared.</p>
              <div className="mt-7 space-y-3">
                <input placeholder="Full legal name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className={FIELD} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input type="email" placeholder="Email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} className={FIELD} />
                  <input type="tel" placeholder="Phone" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} className={FIELD} />
                </div>
                <input placeholder="Street address" value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} className={FIELD} />
                <div className="grid grid-cols-[1fr_80px_110px] gap-3">
                  <input placeholder="City" value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} className={FIELD} />
                  <input placeholder="State" maxLength={2} value={details.state} onChange={(e) => setDetails({ ...details, state: e.target.value.toUpperCase() })} className={FIELD} />
                  <input placeholder="ZIP" inputMode="numeric" value={details.zip} onChange={(e) => setDetails({ ...details, zip: e.target.value })} className={FIELD} />
                </div>
              </div>

              <p className="mt-6 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">Identification</p>
              <div className="mt-2 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[0.6875rem] font-bold text-warm-white/45">Date of birth</span>
                    <input type="date" max={todayISO()} value={details.dob} onChange={(e) => setDetails({ ...details, dob: e.target.value })} className={`${DATE_FIELD} mt-1`} />
                  </label>
                  <label className="block">
                    <span className="text-[0.6875rem] font-bold text-warm-white/45">Driver&rsquo;s license / ID number</span>
                    <input value={details.dlNumber} onChange={(e) => setDetails({ ...details, dlNumber: e.target.value })} placeholder="License or ID #" className={`${FIELD} mt-1`} />
                  </label>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-3">
                  <label className="block">
                    <span className="text-[0.6875rem] font-bold text-warm-white/45">Issuing state</span>
                    <input maxLength={2} value={details.dlState} onChange={(e) => setDetails({ ...details, dlState: e.target.value.toUpperCase() })} placeholder="TX" className={`${FIELD} mt-1`} />
                  </label>
                  <label className="block">
                    <span className="text-[0.6875rem] font-bold text-warm-white/45">License expiration</span>
                    <input type="date" min={todayISO()} value={details.dlExp} onChange={(e) => setDetails({ ...details, dlExp: e.target.value })} className={`${DATE_FIELD} mt-1`} />
                  </label>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 text-[0.875rem] text-warm-white/80">
                  <input type="checkbox" checked={details.isBusiness} onChange={(e) => setDetails({ ...details, isBusiness: e.target.checked })} className="mt-0.5 h-4 w-4 accent-orange" />
                  <span>I&rsquo;m renting as a <b className="text-warm-white">business</b></span>
                </label>
                {details.isBusiness && (
                  <input value={details.businessName} onChange={(e) => setDetails({ ...details, businessName: e.target.value })} placeholder="Business name" className={FIELD} />
                )}
                <label className="flex cursor-pointer items-start gap-3 text-[0.875rem] text-warm-white/80">
                  <input type="checkbox" checked={details.military} onChange={(e) => setDetails({ ...details, military: e.target.checked })} className="mt-0.5 h-4 w-4 accent-orange" />
                  <span>I am (or my spouse/dependent is) <b className="text-warm-white">active-duty military, reserves, or National Guard</b></span>
                </label>
                {details.military && (
                  <input value={details.militaryBranch} onChange={(e) => setDetails({ ...details, militaryBranch: e.target.value })} placeholder="Branch of service (optional)" className={FIELD} />
                )}
              </div>
            </div>
          )}

          {stepName === 'Protection' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Protection" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><ShieldCheck className="h-6 w-6 text-orange" aria-hidden />Protect your belongings</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Coverage is required. Choose a protection plan below.</p>
              <div className="mt-7 space-y-3">
                {plans.map((p) => {
                  const active = planId === p.id
                  return (
                    <button key={p.id} onClick={() => setPlanId(p.id)} className={`${optionBase} ${active ? 'border-orange bg-orange/[0.08]' : 'border-warm-white/12 bg-warm-white/[0.03] hover:border-orange/50'}`}>
                      <span>
                        <span className="block text-[1.0625rem] font-black text-warm-white">{money(p.coverage).replace('.00', '')} coverage</span>
                        <span className="block text-[0.8125rem] text-warm-white/45">Damage &amp; theft protection</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-[1.125rem] font-black text-orange">{money(p.premium)}<span className="text-[0.75rem] font-bold text-warm-white/40">/mo</span></span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${active ? 'border-orange bg-orange text-warm-white' : 'border-warm-white/25'}`}>{active && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 flex items-start gap-2.5 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-4 py-3 text-[0.8125rem] leading-relaxed text-warm-white/60">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-green" aria-hidden />
                <span>Already insured? Just send us proof of your homeowner&rsquo;s or renter&rsquo;s coverage and we&rsquo;ll happily drop this protection from your bill.</span>
              </p>
            </div>
          )}

          {stepName === 'Review' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Review" />
              <h2 className="mt-4 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white">Review your move-in</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">{space.size} at {facility.short} · move-in {dateLong(moveIn)}</p>
              <div className={`mt-7 ${glassCard} p-5`}>
                {realQuote ? (
                  <dl className="space-y-2.5 text-[0.9375rem]">
                    {realQuote.lineItems.map((l, i) => (
                      <div key={i} className="flex justify-between"><dt className="text-warm-white/70">{l.name}</dt><dd className="font-bold text-warm-white">{money(l.amount)}</dd></div>
                    ))}
                    <div className="mt-2 flex items-baseline justify-between border-t border-warm-white/12 pt-3"><dt className="text-[1.125rem] font-black text-warm-white">Due today</dt><dd className="text-[1.375rem] font-black text-orange">{money(effDueToday)}</dd></div>
                  </dl>
                ) : (
                  <dl className="space-y-2.5 text-[0.9375rem]">
                    <div className="flex justify-between"><dt className="text-warm-white/70">First month rent</dt><dd className="font-bold text-warm-white">{money(firstMonthFull)}</dd></div>
                    <div className="flex justify-between text-sage-green"><dt>50% off first month</dt><dd className="font-bold">−{money(promoDiscount)}</dd></div>
                    <div className="flex justify-between"><dt className="text-warm-white/70">One-time admin fee</dt><dd className="font-bold text-warm-white">{money(ADMIN_FEE)}</dd></div>
                    <div className="flex justify-between"><dt className="text-warm-white/70">Protection ({money(plan.coverage).replace('.00', '')})</dt><dd className="font-bold text-warm-white">{money(protection)}</dd></div>
                    <div className="flex justify-between"><dt className="text-warm-white/70">Estimated tax</dt><dd className="font-bold text-warm-white">{money(tax)}</dd></div>
                    <div className="mt-2 flex items-baseline justify-between border-t border-warm-white/12 pt-3"><dt className="text-[1.125rem] font-black text-warm-white">Due today</dt><dd className="text-[1.375rem] font-black text-orange">{money(dueToday)}</dd></div>
                  </dl>
                )}
                <p className="mt-4 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/55">Then {money(effMonthly)}/mo starting next cycle. Month-to-month — cancel anytime.{realQuote ? '' : ' Amounts are an estimate; the facility confirms final totals.'}</p>
              </div>
            </div>
          )}

          {stepName === 'Sign lease' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Sign lease" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><FileText className="h-6 w-6 text-orange" aria-hidden />Lease agreement</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Review and sign your month-to-month rental agreement.</p>
              <p className="mt-4 rounded-sm border border-orange/25 bg-orange/[0.06] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/70"><b className="text-orange">Summary of terms.</b> Your full, binding rental agreement is generated and signed when you complete checkout.</p>
              <div className="mt-4 h-52 overflow-y-auto rounded-sm border border-warm-white/10 bg-warm-white/[0.04] p-4 text-[0.8125rem] leading-relaxed text-warm-white/70">
                <p className="font-black tracking-[0.05em] text-warm-white">SELF-STORAGE RENTAL AGREEMENT</p>
                <p className="mt-2">This Agreement is between Journey Storage 001, LLC (&ldquo;Operator&rdquo;), {facility.address}, {facility.city}, and {details.name || 'the Occupant'} (&ldquo;Occupant&rdquo;) for one {space.size} storage space, on a month-to-month basis beginning {dateLong(moveIn)}.</p>
                <p className="mt-2"><b className="text-warm-white/90">1. Rent.</b> Occupant agrees to pay {money(space.price)} per month, due on the billing date each month, with the first month discounted 50% under the current promotion. A one-time administrative fee of {money(ADMIN_FEE)} applies.</p>
                <p className="mt-2"><b className="text-warm-white/90">2. Use.</b> The space is for storage of personal property only. No hazardous, flammable, perishable, or living things may be stored.</p>
                <p className="mt-2"><b className="text-warm-white/90">3. Insurance.</b> Occupant must maintain coverage on stored goods, via the Operator&rsquo;s protection plan or the Occupant&rsquo;s own policy with proof of coverage.</p>
                <p className="mt-2"><b className="text-warm-white/90">4. Access.</b> Occupant receives a personal gate code for 24/7 access. Codes are non-transferable.</p>
                <p className="mt-2"><b className="text-warm-white/90">5. Termination.</b> Either party may terminate with proper notice per state law. This is a month-to-month tenancy with no long-term commitment.</p>
                <p className="mt-2 text-warm-white/40">…continued in the full agreement.</p>
              </div>
              <button type="button" onClick={() => setFullLease(true)} className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-orange underline-offset-4 transition-colors hover:underline">
                <FileText className="h-3.5 w-3.5" aria-hidden />Read the full agreement
              </button>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[0.875rem] text-warm-white/80">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange" />
                <span>I have read and agree to the rental agreement, and I authorize the charges shown at review.</span>
              </label>
              <div className="mt-4">
                <label className="block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">Type your full name to sign</label>
                <input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Your signature" className="mt-2 w-full rounded-sm border border-stone/30 bg-warm-white/[0.06] px-4 py-3 text-[1.625rem] text-warm-white placeholder:text-[1rem] placeholder:text-warm-white/35 focus:border-orange focus-visible:outline-none" style={{ fontFamily: '"Snell Roundhand","Brush Script MT",cursive' }} />
                {signature.trim().length >= 3 && <p className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] font-bold text-sage-green"><Check className="h-3.5 w-3.5" aria-hidden />Signed {new Date().toLocaleDateString()}</p>}
              </div>
            </div>
          )}

          {stepName === 'Payment' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Payment" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><CreditCard className="h-6 w-6 text-orange" aria-hidden />Payment</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Pay {money(effDueToday)} today to complete your rental.</p>
              <div className="mt-7 space-y-3">
                <input inputMode="numeric" placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={FIELD} />
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className={FIELD} />
                  <input placeholder="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} className={FIELD} />
                  <input placeholder="ZIP" value={card.zip} onChange={(e) => setCard({ ...card, zip: e.target.value })} className={FIELD} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-sm border border-warm-white/12 bg-warm-white/[0.03] p-4">
                <span className="text-[0.9375rem] font-bold text-warm-white">Enroll in autopay <span className="font-normal text-warm-white/45">— never miss a payment</span></span>
                <span className="flex items-center gap-2.5">
                  <span className="rounded-sm bg-warm-white/[0.08] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-warm-white/50">Required</span>
                  <input type="checkbox" checked readOnly disabled aria-label="Autopay enrollment (required)" className="h-4 w-4 accent-orange opacity-80" />
                </span>
              </div>
              {apiError && <p className="mt-4 rounded-sm border border-[#D4956A]/40 bg-[#D4956A]/10 px-3 py-2.5 text-[0.8125rem] font-bold text-[#E8A87C]">{apiError} <a href={facility.tel} className="underline">{facility.phone}</a></p>}
              {payingMsg && (
                <div className="mt-4 rounded-sm border border-orange/40 bg-orange/[0.12] px-4 py-3.5" role="status" aria-live="polite">
                  <p className="flex items-center gap-2.5 text-[0.9375rem] font-bold text-warm-white">
                    <span aria-hidden className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-orange border-t-transparent" />
                    {payingMsg}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-warm-white/70">This can take up to a minute. <b className="text-warm-white">Please don’t close or refresh this page</b> — we’ll take you to your confirmation automatically.</p>
                </div>
              )}
              {real ? (
                <p className="mt-4 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/55">Secured by Tenant Payments. Your card is charged {money(effDueToday)} today; autopay continues each cycle.</p>
              ) : (
                <p className="mt-4 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/55"><b className="text-warm-white/80">Demo only.</b> This is a preview — no card is charged and no rental is created. In production this is processed securely by Tenant Payments.</p>
              )}
            </div>
          )}

          {stepName === 'Done' && (
            <div className="mx-auto max-w-lg py-4 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-green/20 text-sage-green ring-1 ring-sage-green/30"><Check className="h-9 w-9" strokeWidth={3} aria-hidden /></div>
              <h2 className="mt-5 text-[2rem] font-black leading-[1.02] tracking-[-0.02em] text-warm-white">You&rsquo;re all moved in{details.name ? `, ${details.name.split(' ')[0]}` : ''}!</h2>
              <p className="mt-3 text-[1rem] leading-[1.6] text-warm-white/50">Your {space.size} space at {facility.short} is {rentResult ? 'rented' : 'reserved'}. A confirmation and lease PDF are on the way to {details.email || 'your email'}.</p>
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className={`relative overflow-hidden ${R} border border-warm-white/10 bg-warm-white/[0.05] p-5 text-left`}>
                  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(232,98,42,0.18) 0%, transparent 60%)' }} />
                  <p className="relative flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-warm-white/45"><KeyRound className="h-3.5 w-3.5 text-orange" aria-hidden />Gate code</p>
                  <p className="relative mt-1.5 text-[1.875rem] font-black tracking-[0.12em] text-warm-white">{rentResult?.gatePin ? rentResult.gatePin : `${gateCode}#`}</p>
                  <p className="relative text-[0.75rem] text-warm-white/45">24/7 access · non-transferable</p>
                </div>
                <div className={`relative overflow-hidden ${R} border border-warm-white/10 bg-warm-white/[0.05] p-5 text-left`}>
                  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(232,98,42,0.18) 0%, transparent 60%)' }} />
                  <p className="relative text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-warm-white/45">Your space</p>
                  <p className="relative mt-1.5 text-[1.875rem] font-black text-warm-white">{rentResult?.unitNumber ? `Unit ${rentResult.unitNumber}` : space.size}</p>
                  <p className="relative text-[0.75rem] text-warm-white/45">{rentResult ? (rentResult.unitNumber ? `${space.size} · ${facility.address}` : 'Unit number in your confirmation email') : `${unitNo} · ${facility.address}`}</p>
                </div>
              </div>
              {rentResult?.documentUrl && (
                <a
                  href={rentResult.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-sm border border-warm-white/20 bg-warm-white/[0.06] px-4 py-2.5 text-[0.875rem] font-bold text-warm-white transition-colors duration-150 hover:border-orange hover:bg-orange/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  <FileText className="h-4 w-4 text-orange" aria-hidden />
                  View your signed lease
                </a>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[0.8125rem]">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-sage-green/25 bg-sage-green/10 px-3 py-1.5 font-bold text-sage-green"><FileText className="h-3.5 w-3.5" aria-hidden />Lease signed</span>
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-sage-green/25 bg-sage-green/10 px-3 py-1.5 font-bold text-sage-green"><Check className="h-3.5 w-3.5" aria-hidden />Paid {money(effDueToday)}</span>
                {autopay && <span className="inline-flex items-center gap-1.5 rounded-sm border border-sage-green/25 bg-sage-green/10 px-3 py-1.5 font-bold text-sage-green"><Check className="h-3.5 w-3.5" aria-hidden />Autopay on</span>}
              </div>
              <p className="mt-7 text-[0.75rem] text-warm-white/40">{rentResult ? 'Rental complete.' : 'Preview — no real rental was created.'} Questions? Call <a href={facility.tel} className="font-bold text-orange">{facility.phone}</a>.</p>
              <button onClick={onClose} className={`mt-6 ${primaryBtn}`}>{rentResult ? 'Done' : 'Close'}</button>
            </div>
          )}
        </div>

        {/* Full lease agreement overlay */}
        {fullLease && (
          <div className="absolute inset-0 z-[20] flex items-stretch justify-center bg-black/85 backdrop-blur-md sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Full rental agreement">
            <div className={`relative flex min-h-full w-full max-w-2xl flex-col overflow-hidden border border-warm-white/10 bg-black sm:min-h-0 sm:max-h-[88vh] sm:rounded-tl-[24px] sm:rounded-tr-[6px] sm:rounded-br-[6px] sm:rounded-bl-[6px]`}>
              <div className="flex items-center justify-between gap-4 border-b border-warm-white/[0.07] px-5 py-4 lg:px-7">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-orange" aria-hidden />
                  <p className="text-[0.9375rem] font-black tracking-[-0.01em] text-warm-white">Self-Storage Rental Agreement</p>
                </div>
                <button onClick={() => setFullLease(false)} aria-label="Close full agreement" className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-warm-white/[0.08] text-warm-white transition-colors hover:bg-warm-white/[0.16]"><X className="h-5 w-5" aria-hidden /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6 text-[0.8125rem] leading-[1.7] text-warm-white/70 lg:px-7">
                <p className="mb-4 rounded-sm border border-orange/25 bg-orange/[0.06] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/70"><b className="text-orange">Summary of terms.</b> Your full, binding rental agreement is generated and signed when you complete checkout, using Journey&rsquo;s official lease.</p>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-warm-white/40">Journey Storage 001, LLC · {facility.address}, {facility.city}</p>
                <p className="mt-3">This Self-Storage Rental Agreement (the &ldquo;Agreement&rdquo;) is entered into between Journey Storage 001, LLC (&ldquo;Operator&rdquo;) and {details.name || 'the Occupant'} (&ldquo;Occupant&rdquo;) for the rental of one {space.size} storage space (the &ldquo;Space&rdquo;) at the facility above, on a month-to-month basis commencing {dateLong(moveIn)}.</p>
                {[
                  ['1. Rent & Fees', `Occupant agrees to pay ${money(space.price)} per month in advance, due on the billing date each month, with the first month discounted 50% under the current promotion. A one-time, non-refundable administrative fee of ${money(ADMIN_FEE)} is charged at move-in. Rent may be adjusted with at least 30 days’ written notice.`],
                  ['2. Autopay', 'Occupant enrolls in automatic payments using the payment method on file. Autopay is required for online rentals and will be charged on each billing date until the Agreement is terminated.'],
                  ['3. Permitted Use', 'The Space is to be used solely for the storage of personal property. Occupant shall not store hazardous, flammable, explosive, perishable, or illegal materials, nor any living thing (person, animal, or plant). Occupant shall not use the Space as a residence or place of business.'],
                  ['4. Insurance / Protection', 'Occupant is required to maintain insurance covering the stored property. Occupant may enroll in the Operator’s protection plan or provide proof of a homeowner’s or renter’s policy, in which case the protection charge is removed. The Operator is not a warehouseman and does not insure Occupant’s property.'],
                  ['5. Access', 'Occupant receives a personal gate code providing 24/7 access. Access codes are non-transferable and may be suspended for non-payment. Occupant is responsible for securing the Space with a lock.'],
                  ['6. Care of Space', 'Occupant shall keep the Space clean and shall be liable for any damage beyond ordinary wear. Occupant shall not make alterations or attach anything to the walls, floor, or ceiling.'],
                  ['7. Default & Lien', 'If Occupant fails to pay rent when due, the Operator may deny access, and after the statutory period may enforce a lien on the stored property and sell it in accordance with the Texas Self-Service Storage Facility Act.'],
                  ['8. Termination', 'Either party may terminate this month-to-month Agreement with proper written notice as provided by state law. Upon termination, Occupant shall remove all property and leave the Space clean; the gate code will be deactivated.'],
                  ['9. Release & Limitation of Liability', 'To the fullest extent permitted by law, the Operator is not liable for loss or damage to stored property from any cause, including theft, fire, water, pests, or mold. Occupant stores property at Occupant’s sole risk.'],
                  ['10. Entire Agreement', 'This Agreement, together with the facility rules and any addenda, constitutes the entire agreement between the parties and supersedes prior understandings. It is governed by the laws of the State of Texas.'],
                ].map(([h, body]) => (
                  <div key={h} className="mt-4">
                    <p className="font-bold text-warm-white/90">{h}</p>
                    <p className="mt-1">{body}</p>
                  </div>
                ))}
                <p className="mt-6 text-warm-white/40">By typing your name and continuing, you acknowledge you have read, understood, and agree to be bound by this Agreement. A signed PDF copy is emailed to you after checkout.</p>
              </div>
              <div className="flex justify-end border-t border-warm-white/[0.07] px-5 py-4 lg:px-7">
                <button onClick={() => setFullLease(false)} className={primaryBtn}>Got it</button>
              </div>
            </div>
          </div>
        )}

        {/* Footer nav */}
        {stepName !== 'Done' && (
          <div className="sticky bottom-0 z-[5] flex items-center justify-between gap-3 border-t border-warm-white/[0.07] bg-black/70 px-5 py-4 backdrop-blur-md lg:px-10">
            <button onClick={step === 0 ? onClose : back} disabled={processing} className="inline-flex items-center gap-1.5 rounded-sm px-4 py-2.5 font-bold text-warm-white/60 transition-colors hover:bg-warm-white/[0.06] hover:text-warm-white disabled:pointer-events-none disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" aria-hidden />{step === 0 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex items-center gap-3">
              {stepName === 'Review' && <span className="hidden text-[0.9375rem] font-black text-warm-white sm:inline">{money(effDueToday)} due today</span>}
              <button onClick={next} disabled={!canNext() || processing} className={primaryBtn}>
                {processing && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-warm-white/40 border-t-warm-white" />}
                {processing ? (stepName === 'Payment' ? 'Processing payment…' : 'Processing…') : stepName === 'Payment' ? `Pay ${money(effDueToday)}` : stepName === 'Sign lease' ? 'Sign & continue' : stepName === 'Review' ? 'Looks good' : 'Continue'}
                {!processing && <ChevronRight className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
