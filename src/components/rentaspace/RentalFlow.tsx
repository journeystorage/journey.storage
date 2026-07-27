'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Check, ChevronLeft, ChevronRight, ShieldCheck, Lock, FileText, CreditCard, KeyRound } from 'lucide-react'

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
  { id: 'p2', coverage: 5000, premium: 16 },
  { id: 'p3', coverage: 10000, premium: 24 },
]
const LOCK_PRICE = 14.99
const ADMIN_FEE = 25
const TAX_RATE = 0.0825 // TX example rate — final tax confirmed at the facility

const money = (n: number) => `$${n.toFixed(2)}`
const todayISO = () => new Date().toISOString().slice(0, 10)

// Journey signature radius — one large corner, three sharp.
const R = 'rounded-tl-[20px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]'
const FIELD = 'w-full rounded-sm border border-stone/30 bg-warm-white/[0.06] px-4 py-3 text-[0.9375rem] text-warm-white placeholder:text-stone transition-colors duration-150 focus:border-orange focus-visible:outline-none focus-visible:ring-0'

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 bg-orange" />
      <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-orange">{label}</span>
    </div>
  )
}

export default function RentalFlow({ facility, space, onClose }: { facility: { short: string; address: string; city: string; phone: string; tel: string }; space: Space; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [moveIn, setMoveIn] = useState(todayISO())
  const [details, setDetails] = useState({ name: '', email: '', phone: '', address: '', dob: '' })
  const [planId, setPlanId] = useState<string>('p2')
  const [ownPolicy, setOwnPolicy] = useState(false)
  const [addLock, setAddLock] = useState(true)
  const [signature, setSignature] = useState('')
  const [agree, setAgree] = useState(false)
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', zip: '' })
  const [autopay, setAutopay] = useState(true)
  const [processing, setProcessing] = useState(false)

  const stepName: StepName = STEPS[step]
  const plan = PLANS.find((p) => p.id === planId)!
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
  const protection = ownPolicy ? 0 : plan.premium
  const lock = addLock ? LOCK_PRICE : 0
  const taxable = firstMonth + ADMIN_FEE + lock
  const tax = +(taxable * TAX_RATE).toFixed(2)
  const dueToday = +(firstMonth + ADMIN_FEE + protection + lock + tax).toFixed(2)
  const monthlyGoing = +(space.price + protection).toFixed(2)

  const canNext = () => {
    if (stepName === 'Move-in') return !!moveIn
    if (stepName === 'Your details') return details.name && /.+@.+\..+/.test(details.email) && details.phone.length >= 7 && details.address
    if (stepName === 'Protection') return ownPolicy || !!planId
    if (stepName === 'Sign lease') return agree && signature.trim().length >= 3
    if (stepName === 'Payment') return card.number.replace(/\s/g, '').length >= 12 && card.exp.length >= 4 && card.cvc.length >= 3
    return true
  }
  const next = () => {
    if (stepName === 'Payment') { setProcessing(true); setTimeout(() => { setProcessing(false); setStep((s) => s + 1) }, 1400); return }
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
            <span className="rounded-sm bg-orange px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-[0.15em] text-warm-white">Preview</span>
            <div>
              <p className="text-[0.9375rem] font-black leading-tight tracking-[-0.02em] text-warm-white">Rent a {space.size} space</p>
              <p className="text-[0.75rem] text-warm-white/50">Journey.Storage™ — {facility.short}, Granbury TX</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-warm-white/[0.08] text-warm-white transition-colors hover:bg-warm-white/[0.16]"><X className="h-5 w-5" aria-hidden /></button>
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
                  <input type="date" min={todayISO()} value={moveIn} onChange={(e) => setMoveIn(e.target.value)} className={`mt-2 ${FIELD} [color-scheme:dark]`} />
                </label>
              </div>
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
                <label className="block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/50">Date of birth
                  <input type="date" value={details.dob} onChange={(e) => setDetails({ ...details, dob: e.target.value })} className={`mt-2 ${FIELD} [color-scheme:dark]`} />
                </label>
              </div>
            </div>
          )}

          {stepName === 'Protection' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Protection" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><ShieldCheck className="h-6 w-6 text-orange" aria-hidden />Protect your belongings</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Coverage is required. Pick a protection plan, or use your own policy.</p>
              <div className="mt-7 space-y-3">
                {PLANS.map((p) => {
                  const active = !ownPolicy && planId === p.id
                  return (
                    <button key={p.id} onClick={() => { setOwnPolicy(false); setPlanId(p.id) }} className={`${optionBase} ${active ? 'border-orange bg-orange/[0.08]' : 'border-warm-white/12 bg-warm-white/[0.03] hover:border-orange/50'}`}>
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
                <button onClick={() => setOwnPolicy(true)} className={`${optionBase} ${ownPolicy ? 'border-orange bg-orange/[0.08]' : 'border-warm-white/12 bg-warm-white/[0.03] hover:border-orange/50'}`}>
                  <span>
                    <span className="block text-[1.0625rem] font-black text-warm-white">I&rsquo;ll use my own policy</span>
                    <span className="block text-[0.8125rem] text-warm-white/45">Homeowner&rsquo;s / renter&rsquo;s insurance — proof required at move-in</span>
                  </span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${ownPolicy ? 'border-orange bg-orange text-warm-white' : 'border-warm-white/25'}`}>{ownPolicy && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}</span>
                </button>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-sm border border-warm-white/12 bg-warm-white/[0.03] p-4">
                <input type="checkbox" checked={addLock} onChange={(e) => setAddLock(e.target.checked)} className="h-4 w-4 accent-orange" />
                <span className="flex items-center gap-2 text-[0.9375rem] font-bold text-warm-white"><Lock className="h-4 w-4 text-orange" aria-hidden />Add a disc lock — {money(LOCK_PRICE)}</span>
              </label>
            </div>
          )}

          {stepName === 'Review' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Review" />
              <h2 className="mt-4 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white">Review your move-in</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">{space.size} at {facility.short} · move-in {dateLong(moveIn)}</p>
              <div className={`mt-7 ${glassCard} p-5`}>
                <dl className="space-y-2.5 text-[0.9375rem]">
                  <div className="flex justify-between"><dt className="text-warm-white/70">First month rent</dt><dd className="font-bold text-warm-white">{money(firstMonthFull)}</dd></div>
                  <div className="flex justify-between text-sage-green"><dt>50% off first month</dt><dd className="font-bold">−{money(promoDiscount)}</dd></div>
                  <div className="flex justify-between"><dt className="text-warm-white/70">One-time admin fee</dt><dd className="font-bold text-warm-white">{money(ADMIN_FEE)}</dd></div>
                  {!ownPolicy && <div className="flex justify-between"><dt className="text-warm-white/70">Protection ({money(plan.coverage).replace('.00', '')})</dt><dd className="font-bold text-warm-white">{money(protection)}</dd></div>}
                  {addLock && <div className="flex justify-between"><dt className="text-warm-white/70">Disc lock</dt><dd className="font-bold text-warm-white">{money(lock)}</dd></div>}
                  <div className="flex justify-between"><dt className="text-warm-white/70">Estimated tax</dt><dd className="font-bold text-warm-white">{money(tax)}</dd></div>
                  <div className="mt-2 flex items-baseline justify-between border-t border-warm-white/12 pt-3"><dt className="text-[1.125rem] font-black text-warm-white">Due today</dt><dd className="text-[1.375rem] font-black text-orange">{money(dueToday)}</dd></div>
                </dl>
                <p className="mt-4 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/55">Then {money(monthlyGoing)}/mo starting next cycle. Month-to-month — cancel anytime. Amounts are an estimate; the facility confirms final totals.</p>
              </div>
            </div>
          )}

          {stepName === 'Sign lease' && (
            <div className="mx-auto max-w-lg">
              <Eyebrow label="Sign lease" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><FileText className="h-6 w-6 text-orange" aria-hidden />Lease agreement</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Review and sign your month-to-month rental agreement.</p>
              <div className="mt-5 h-52 overflow-y-auto rounded-sm border border-warm-white/10 bg-warm-white/[0.04] p-4 text-[0.8125rem] leading-relaxed text-warm-white/70">
                <p className="font-black tracking-[0.05em] text-warm-white">SELF-STORAGE RENTAL AGREEMENT</p>
                <p className="mt-2">This Agreement is between Journey Storage 001, LLC (&ldquo;Operator&rdquo;), {facility.address}, {facility.city}, and {details.name || 'the Occupant'} (&ldquo;Occupant&rdquo;) for one {space.size} storage space, on a month-to-month basis beginning {dateLong(moveIn)}.</p>
                <p className="mt-2"><b className="text-warm-white/90">1. Rent.</b> Occupant agrees to pay {money(space.price)} per month, due on the billing date each month, with the first month discounted 50% under the current promotion. A one-time administrative fee of {money(ADMIN_FEE)} applies.</p>
                <p className="mt-2"><b className="text-warm-white/90">2. Use.</b> The space is for storage of personal property only. No hazardous, flammable, perishable, or living things may be stored.</p>
                <p className="mt-2"><b className="text-warm-white/90">3. Insurance.</b> Occupant must maintain coverage on stored goods, via the Operator&rsquo;s protection plan or the Occupant&rsquo;s own policy with proof of coverage.</p>
                <p className="mt-2"><b className="text-warm-white/90">4. Access.</b> Occupant receives a personal gate code for 24/7 access. Codes are non-transferable.</p>
                <p className="mt-2"><b className="text-warm-white/90">5. Termination.</b> Either party may terminate with proper notice per state law. This is a month-to-month tenancy with no long-term commitment.</p>
                <p className="mt-2 text-warm-white/40">…full agreement provided as a PDF after signing.</p>
              </div>
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
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Pay {money(dueToday)} today to complete your rental.</p>
              <div className="mt-7 space-y-3">
                <input inputMode="numeric" placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={FIELD} />
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className={FIELD} />
                  <input placeholder="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} className={FIELD} />
                  <input placeholder="ZIP" value={card.zip} onChange={(e) => setCard({ ...card, zip: e.target.value })} className={FIELD} />
                </div>
              </div>
              <label className="mt-4 flex cursor-pointer items-center justify-between rounded-sm border border-warm-white/12 bg-warm-white/[0.03] p-4">
                <span className="text-[0.9375rem] font-bold text-warm-white">Enroll in autopay <span className="font-normal text-warm-white/45">— never miss a payment</span></span>
                <input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} className="h-4 w-4 accent-orange" />
              </label>
              <p className="mt-4 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/55"><b className="text-warm-white/80">Demo only.</b> This is a preview — no card is charged and no rental is created. In production this is processed securely by Tenant Payments.</p>
            </div>
          )}

          {stepName === 'Done' && (
            <div className="mx-auto max-w-lg py-4 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-green/20 text-sage-green ring-1 ring-sage-green/30"><Check className="h-9 w-9" strokeWidth={3} aria-hidden /></div>
              <h2 className="mt-5 text-[2rem] font-black leading-[1.02] tracking-[-0.02em] text-warm-white">You&rsquo;re all moved in{details.name ? `, ${details.name.split(' ')[0]}` : ''}!</h2>
              <p className="mt-3 text-[1rem] leading-[1.6] text-warm-white/50">Your {space.size} space at {facility.short} is reserved. A confirmation and lease PDF are on the way to {details.email || 'your email'}.</p>
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className={`relative overflow-hidden ${R} border border-warm-white/10 bg-warm-white/[0.05] p-5 text-left`}>
                  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(232,98,42,0.18) 0%, transparent 60%)' }} />
                  <p className="relative flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-warm-white/45"><KeyRound className="h-3.5 w-3.5 text-orange" aria-hidden />Gate code</p>
                  <p className="relative mt-1.5 text-[1.875rem] font-black tracking-[0.12em] text-warm-white">{gateCode}#</p>
                  <p className="relative text-[0.75rem] text-warm-white/45">24/7 access · non-transferable</p>
                </div>
                <div className={`relative overflow-hidden ${R} border border-warm-white/10 bg-warm-white/[0.05] p-5 text-left`}>
                  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(232,98,42,0.18) 0%, transparent 60%)' }} />
                  <p className="relative text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-warm-white/45">Your space</p>
                  <p className="relative mt-1.5 text-[1.875rem] font-black text-warm-white">{unitNo}</p>
                  <p className="relative text-[0.75rem] text-warm-white/45">{space.size} · {facility.address}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[0.8125rem]">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-sage-green/25 bg-sage-green/10 px-3 py-1.5 font-bold text-sage-green"><FileText className="h-3.5 w-3.5" aria-hidden />Lease signed</span>
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-sage-green/25 bg-sage-green/10 px-3 py-1.5 font-bold text-sage-green"><Check className="h-3.5 w-3.5" aria-hidden />Paid {money(dueToday)}</span>
                {autopay && <span className="inline-flex items-center gap-1.5 rounded-sm border border-sage-green/25 bg-sage-green/10 px-3 py-1.5 font-bold text-sage-green"><Check className="h-3.5 w-3.5" aria-hidden />Autopay on</span>}
              </div>
              <p className="mt-7 text-[0.75rem] text-warm-white/40">Preview — no real rental was created. Questions? Call <a href={facility.tel} className="font-bold text-orange">{facility.phone}</a>.</p>
              <button onClick={onClose} className={`mt-6 ${primaryBtn}`}>Close preview</button>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {stepName !== 'Done' && (
          <div className="sticky bottom-0 z-[5] flex items-center justify-between gap-3 border-t border-warm-white/[0.07] bg-black/70 px-5 py-4 backdrop-blur-md lg:px-10">
            <button onClick={step === 0 ? onClose : back} className="inline-flex items-center gap-1.5 rounded-sm px-4 py-2.5 font-bold text-warm-white/60 transition-colors hover:bg-warm-white/[0.06] hover:text-warm-white">
              <ChevronLeft className="h-4 w-4" aria-hidden />{step === 0 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex items-center gap-3">
              {stepName === 'Review' && <span className="hidden text-[0.9375rem] font-black text-warm-white sm:inline">{money(dueToday)} due today</span>}
              <button onClick={next} disabled={!canNext() || processing} className={primaryBtn}>
                {processing ? 'Processing…' : stepName === 'Payment' ? `Pay ${money(dueToday)}` : stepName === 'Sign lease' ? 'Sign & continue' : stepName === 'Review' ? 'Looks good' : 'Continue'}
                {!processing && <ChevronRight className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
