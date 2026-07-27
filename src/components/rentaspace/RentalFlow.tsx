'use client'

import { useState, useEffect, useMemo, type FormEvent } from 'react'
import { X, Check, ChevronLeft, ChevronRight, ShieldCheck, Lock, FileText, CreditCard, KeyRound, Sparkles } from 'lucide-react'

/**
 * PREVIEW-ONLY online move-in flow. Mirrors the real Nectar rental sequence
 * (space → hold → lease-set-up → reserve → sign documents → lease → autopay)
 * but runs entirely client-side in demo mode — no API mutations, no charge,
 * no real rental. Used behind ?preview=live so the full experience is visible
 * before the live checkout endpoints are wired.
 */

type Space = { size: string; price: number; sqft?: number; category?: string | null }

const STEPS = ['Move-in', 'Your details', 'Protection', 'Review', 'Sign lease', 'Payment', 'Done'] as const
type StepName = (typeof STEPS)[number]

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

  // Deterministic-looking confirmation artifacts, generated once.
  const gateCode = useMemo(() => String(1000 + Math.floor(Math.random() * 8999)), [])
  const unitNo = useMemo(() => `${'ABCD'[Math.floor(Math.random() * 4)]}-${100 + Math.floor(Math.random() * 240)}`, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  // ── cost math (first month, promo 50% off, optional protection + lock, tax) ──
  const firstMonthFull = space.price
  const promoDiscount = firstMonthFull * 0.5 // 50% off first month
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
    if (stepName === 'Payment') {
      setProcessing(true)
      setTimeout(() => { setProcessing(false); setStep((s) => s + 1) }, 1400)
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const field = 'w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[0.9375rem] text-black placeholder:text-stone focus:border-orange focus:outline-none transition-colors'
  const primaryBtn = 'inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-6 py-3 font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,.3)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0'

  return (
    <div className="fixed inset-0 z-[130] flex items-stretch justify-center overflow-y-auto bg-black/70 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={`Rent a ${space.size} space`}>
      <div className="relative flex min-h-full w-full max-w-4xl flex-col bg-warm-white text-black antialiased sm:min-h-0 sm:max-h-[92vh] sm:rounded-2xl sm:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/[0.07] bg-warm-white/95 px-5 py-4 backdrop-blur sm:rounded-t-2xl lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-wide text-warm-white"><Sparkles className="h-3 w-3" aria-hidden />Preview</span>
            <div>
              <p className="text-[0.9375rem] font-black leading-tight tracking-[-0.02em]">Rent a {space.size} space</p>
              <p className="text-[0.75rem] text-stone">Journey.Storage™ — {facility.short}, Granbury TX</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/[0.06] text-black transition-colors hover:bg-black/[0.12]"><X className="h-5 w-5" aria-hidden /></button>
        </div>

        {/* Progress rail */}
        {stepName !== 'Done' && (
          <div className="border-b border-black/[0.06] px-5 py-3 lg:px-8">
            <div className="flex items-center gap-1.5">
              {STEPS.slice(0, 6).map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-1.5">
                  <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-orange' : 'bg-black/10'}`} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[0.75rem] font-bold uppercase tracking-wide text-stone">Step {step + 1} of 6 · <span className="text-orange">{stepName}</span></p>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-8">
          {stepName === 'Move-in' && (
            <div className="mx-auto max-w-lg">
              <h2 className="text-[1.5rem] font-black tracking-[-0.02em]">When do you want to move in?</h2>
              <p className="mt-1.5 text-[0.9375rem] text-stone">Reserve today, move in on your schedule. Your online rate is locked in.</p>
              <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(24,24,24,.04),0_12px_32px_-12px_rgba(24,24,24,.14)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[1.375rem] font-black tracking-[-0.02em]">{space.size}</p>
                    {space.category && <p className="text-[0.8125rem] text-stone">{space.category}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-stone line-through">{money(space.price)}/mo</p>
                    <p className="leading-none"><span className="text-[1.625rem] font-black text-orange">{money(firstMonth)}</span></p>
                    <p className="text-[0.6875rem] font-bold text-[#5c8a52]">1st month · 50% off</p>
                  </div>
                </div>
                <label className="mt-5 block text-[0.8125rem] font-bold text-charcoal">Move-in date
                  <input type="date" min={todayISO()} value={moveIn} onChange={(e) => setMoveIn(e.target.value)} className={`mt-1 ${field}`} />
                </label>
              </div>
            </div>
          )}

          {stepName === 'Your details' && (
            <div className="mx-auto max-w-lg">
              <h2 className="text-[1.5rem] font-black tracking-[-0.02em]">Tell us about you</h2>
              <p className="mt-1.5 text-[0.9375rem] text-stone">The primary tenant on the lease. Your info is never shared.</p>
              <div className="mt-6 space-y-3">
                <input placeholder="Full legal name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className={field} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input type="email" placeholder="Email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} className={field} />
                  <input type="tel" placeholder="Phone" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} className={field} />
                </div>
                <input placeholder="Street address" value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} className={field} />
                <label className="block text-[0.8125rem] font-bold text-stone">Date of birth
                  <input type="date" value={details.dob} onChange={(e) => setDetails({ ...details, dob: e.target.value })} className={`mt-1 ${field}`} />
                </label>
              </div>
            </div>
          )}

          {stepName === 'Protection' && (
            <div className="mx-auto max-w-lg">
              <h2 className="flex items-center gap-2 text-[1.5rem] font-black tracking-[-0.02em]"><ShieldCheck className="h-6 w-6 text-orange" aria-hidden />Protect your belongings</h2>
              <p className="mt-1.5 text-[0.9375rem] text-stone">Coverage is required. Pick a protection plan, or use your own policy.</p>
              <div className="mt-6 space-y-3">
                {PLANS.map((p) => {
                  const active = !ownPolicy && planId === p.id
                  return (
                    <button key={p.id} onClick={() => { setOwnPolicy(false); setPlanId(p.id) }} className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-colors ${active ? 'border-orange bg-orange/[0.05]' : 'border-black/10 bg-white hover:border-orange/40'}`}>
                      <span>
                        <span className="block text-[1.0625rem] font-black">{money(p.coverage).replace('.00', '')} coverage</span>
                        <span className="block text-[0.8125rem] text-stone">Damage & theft protection</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-[1.125rem] font-black text-orange">{money(p.premium)}<span className="text-[0.75rem] font-bold text-stone">/mo</span></span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${active ? 'border-orange bg-orange text-warm-white' : 'border-black/20'}`}>{active && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}</span>
                      </span>
                    </button>
                  )
                })}
                <button onClick={() => setOwnPolicy(true)} className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-colors ${ownPolicy ? 'border-orange bg-orange/[0.05]' : 'border-black/10 bg-white hover:border-orange/40'}`}>
                  <span>
                    <span className="block text-[1.0625rem] font-black">I&rsquo;ll use my own policy</span>
                    <span className="block text-[0.8125rem] text-stone">Homeowner&rsquo;s / renter&rsquo;s insurance — proof required at move-in</span>
                  </span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${ownPolicy ? 'border-orange bg-orange text-warm-white' : 'border-black/20'}`}>{ownPolicy && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}</span>
                </button>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white p-4">
                <input type="checkbox" checked={addLock} onChange={(e) => setAddLock(e.target.checked)} className="h-4 w-4 accent-orange" />
                <span className="flex items-center gap-2 text-[0.9375rem] font-bold"><Lock className="h-4 w-4 text-orange" aria-hidden />Add a disc lock — {money(LOCK_PRICE)}</span>
              </label>
            </div>
          )}

          {stepName === 'Review' && (
            <div className="mx-auto max-w-lg">
              <h2 className="text-[1.5rem] font-black tracking-[-0.02em]">Review your move-in</h2>
              <p className="mt-1.5 text-[0.9375rem] text-stone">{space.size} at {facility.short} · move-in {new Date(moveIn + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(24,24,24,.04),0_12px_32px_-12px_rgba(24,24,24,.14)]">
                <dl className="space-y-2.5 text-[0.9375rem]">
                  <div className="flex justify-between"><dt className="text-charcoal">First month rent</dt><dd className="font-bold">{money(firstMonthFull)}</dd></div>
                  <div className="flex justify-between text-[#5c8a52]"><dt>50% off first month</dt><dd className="font-bold">−{money(promoDiscount)}</dd></div>
                  <div className="flex justify-between"><dt className="text-charcoal">One-time admin fee</dt><dd className="font-bold">{money(ADMIN_FEE)}</dd></div>
                  {!ownPolicy && <div className="flex justify-between"><dt className="text-charcoal">Protection ({money(plan.coverage).replace('.00', '')})</dt><dd className="font-bold">{money(protection)}</dd></div>}
                  {addLock && <div className="flex justify-between"><dt className="text-charcoal">Disc lock</dt><dd className="font-bold">{money(lock)}</dd></div>}
                  <div className="flex justify-between"><dt className="text-charcoal">Estimated tax</dt><dd className="font-bold">{money(tax)}</dd></div>
                  <div className="mt-2 flex justify-between border-t border-black/10 pt-3 text-[1.125rem]"><dt className="font-black">Due today</dt><dd className="font-black text-orange">{money(dueToday)}</dd></div>
                </dl>
                <p className="mt-3 rounded-lg bg-sand/20 px-3 py-2 text-[0.75rem] text-charcoal">Then {money(monthlyGoing)}/mo starting next cycle. Month-to-month — cancel anytime. Amounts are an estimate; the facility confirms final totals.</p>
              </div>
            </div>
          )}

          {stepName === 'Sign lease' && (
            <div className="mx-auto max-w-lg">
              <h2 className="flex items-center gap-2 text-[1.5rem] font-black tracking-[-0.02em]"><FileText className="h-6 w-6 text-orange" aria-hidden />Lease agreement</h2>
              <p className="mt-1.5 text-[0.9375rem] text-stone">Review and sign your month-to-month rental agreement.</p>
              <div className="mt-5 h-52 overflow-y-auto rounded-xl border border-black/10 bg-white p-4 text-[0.8125rem] leading-relaxed text-charcoal">
                <p className="font-black text-black">SELF-STORAGE RENTAL AGREEMENT</p>
                <p className="mt-2">This Agreement is between Journey Storage 001, LLC (&ldquo;Operator&rdquo;), {facility.address}, {facility.city}, and {details.name || 'the Occupant'} (&ldquo;Occupant&rdquo;) for one {space.size} storage space, on a month-to-month basis beginning {new Date(moveIn + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
                <p className="mt-2"><b>1. Rent.</b> Occupant agrees to pay {money(space.price)} per month, due on the billing date each month, with the first month discounted 50% under the current promotion. A one-time administrative fee of {money(ADMIN_FEE)} applies.</p>
                <p className="mt-2"><b>2. Use.</b> The space is for storage of personal property only. No hazardous, flammable, perishable, or living things may be stored.</p>
                <p className="mt-2"><b>3. Insurance.</b> Occupant must maintain coverage on stored goods, via the Operator&rsquo;s protection plan or the Occupant&rsquo;s own policy with proof of coverage.</p>
                <p className="mt-2"><b>4. Access.</b> Occupant receives a personal gate code for 24/7 access. Codes are non-transferable.</p>
                <p className="mt-2"><b>5. Termination.</b> Either party may terminate with proper notice per state law. This is a month-to-month tenancy with no long-term commitment.</p>
                <p className="mt-2 text-stone">…full agreement provided as a PDF after signing.</p>
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[0.875rem]">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange" />
                <span>I have read and agree to the rental agreement, and I authorize the charges shown at review.</span>
              </label>
              <div className="mt-4">
                <label className="block text-[0.8125rem] font-bold text-stone">Type your full name to sign</label>
                <input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Your signature" className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[1.5rem] text-black placeholder:text-[1rem] placeholder:text-stone/60 focus:border-orange focus:outline-none" style={{ fontFamily: '"Snell Roundhand","Brush Script MT",cursive' }} />
                {signature.trim().length >= 3 && <p className="mt-1 flex items-center gap-1.5 text-[0.75rem] font-bold text-[#5c8a52]"><Check className="h-3.5 w-3.5" aria-hidden />Signed {new Date().toLocaleDateString()}</p>}
              </div>
            </div>
          )}

          {stepName === 'Payment' && (
            <div className="mx-auto max-w-lg">
              <h2 className="flex items-center gap-2 text-[1.5rem] font-black tracking-[-0.02em]"><CreditCard className="h-6 w-6 text-orange" aria-hidden />Payment</h2>
              <p className="mt-1.5 text-[0.9375rem] text-stone">Pay {money(dueToday)} today to complete your rental.</p>
              <div className="mt-6 space-y-3">
                <input inputMode="numeric" placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={field} />
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className={field} />
                  <input placeholder="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} className={field} />
                  <input placeholder="ZIP" value={card.zip} onChange={(e) => setCard({ ...card, zip: e.target.value })} className={field} />
                </div>
              </div>
              <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-black/10 bg-white p-4">
                <span className="text-[0.9375rem] font-bold">Enroll in autopay <span className="font-normal text-stone">— never miss a payment</span></span>
                <input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} className="h-4 w-4 accent-orange" />
              </label>
              <p className="mt-4 rounded-lg bg-sand/20 px-3 py-2 text-[0.75rem] text-charcoal"><b>Demo only.</b> This is a preview — no card is charged and no rental is created. In production this is processed securely by Tenant Payments.</p>
            </div>
          )}

          {stepName === 'Done' && (
            <div className="mx-auto max-w-lg py-4 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-green/20 text-[#5c8a52]"><Check className="h-9 w-9" strokeWidth={3} aria-hidden /></div>
              <h2 className="mt-5 text-[1.75rem] font-black tracking-[-0.02em]">You&rsquo;re all moved in{details.name ? `, ${details.name.split(' ')[0]}` : ''}!</h2>
              <p className="mt-2 text-[0.9375rem] text-stone">Your {space.size} space at {facility.short} is reserved. A confirmation and lease PDF are on the way to {details.email || 'your email'}.</p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/[0.06] bg-white p-5 text-left shadow-[0_1px_2px_rgba(24,24,24,.04),0_12px_32px_-12px_rgba(24,24,24,.14)]">
                  <p className="flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-wide text-stone"><KeyRound className="h-3.5 w-3.5 text-orange" aria-hidden />Gate code</p>
                  <p className="mt-1 text-[1.75rem] font-black tracking-[0.1em] text-black">{gateCode}#</p>
                  <p className="text-[0.75rem] text-stone">24/7 access · non-transferable</p>
                </div>
                <div className="rounded-2xl border border-black/[0.06] bg-white p-5 text-left shadow-[0_1px_2px_rgba(24,24,24,.04),0_12px_32px_-12px_rgba(24,24,24,.14)]">
                  <p className="text-[0.75rem] font-bold uppercase tracking-wide text-stone">Your space</p>
                  <p className="mt-1 text-[1.75rem] font-black text-black">{unitNo}</p>
                  <p className="text-[0.75rem] text-stone">{space.size} · {facility.address}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[0.8125rem]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-green/15 px-3 py-1.5 font-bold text-[#5c8a52]"><FileText className="h-3.5 w-3.5" aria-hidden />Lease signed</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-green/15 px-3 py-1.5 font-bold text-[#5c8a52]"><Check className="h-3.5 w-3.5" aria-hidden />Paid {money(dueToday)}</span>
                {autopay && <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-green/15 px-3 py-1.5 font-bold text-[#5c8a52]"><Check className="h-3.5 w-3.5" aria-hidden />Autopay on</span>}
              </div>
              <p className="mt-6 text-[0.75rem] text-stone">Preview — no real rental was created. Questions? Call <a href={facility.tel} className="font-bold text-orange">{facility.phone}</a>.</p>
              <button onClick={onClose} className={`mt-6 ${primaryBtn}`}>Close preview</button>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {stepName !== 'Done' && (
          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-black/[0.07] bg-warm-white/95 px-5 py-4 backdrop-blur sm:rounded-b-2xl lg:px-8">
            <button onClick={step === 0 ? onClose : back} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-bold text-charcoal transition-colors hover:bg-black/[0.05]">
              <ChevronLeft className="h-4 w-4" aria-hidden />{step === 0 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex items-center gap-3">
              {stepName === 'Review' && <span className="hidden text-[0.9375rem] font-black text-orange sm:inline">{money(dueToday)} due today</span>}
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
