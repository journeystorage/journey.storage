'use client'

import { useState, useEffect } from 'react'
import { X, Check, ChevronLeft, ChevronRight, Search, Wallet, CreditCard } from 'lucide-react'

/**
 * Pay Bill — real tenant payment.
 *   1. Look up the account by email/phone (/api/nectar/account/lookup)
 *   2. Show the live balance
 *   3. Pay by card (/api/nectar/account/pay → leases/{id}/payment)
 * Card data is sent to our server route only; never stored client-side.
 */

const STEPS = ['Account', 'Balance', 'Payment', 'Done'] as const
type StepName = (typeof STEPS)[number]
const WATERMARK: Record<StepName, string> = { Account: 'BILL', Balance: 'BALANCE', Payment: 'PAY', Done: 'PAID' }

const money = (n: number) => `$${n.toFixed(2)}`
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

type Account = { leaseId: string; name: string; code: string | null; balance: number }

// `short` names the facility when opened from a facility page; omit it when
// opened from the site nav (account lookup spans all locations) so the copy
// doesn't read "Granbury, Granbury TX".
export default function PayBillFlow({ facility, onClose }: { facility: { short?: string; phone: string; tel: string }; onClose: () => void }) {
  const atFacility = facility.short ? ` at ${facility.short}` : ''
  const yourAccount = facility.short ? `your ${facility.short} account` : 'your account'
  const [step, setStep] = useState(0)
  const [contact, setContact] = useState('')
  const [looking, setLooking] = useState(false)
  const [account, setAccount] = useState<Account | null>(null)
  const [lookupMsg, setLookupMsg] = useState<string | null>(null)
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' })
  const [billing, setBilling] = useState({ name: '', address1: '', city: '', state: '', zip: '' })
  const [processing, setProcessing] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const stepName: StepName = STEPS[step]
  const amountDue = account?.balance ?? 0

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const canNext = () => {
    if (stepName === 'Account') return /.+@.+\..+/.test(contact) || contact.replace(/\D/g, '').length >= 7
    if (stepName === 'Balance') return amountDue > 0
    if (stepName === 'Payment') return card.number.replace(/\s/g, '').length >= 12 && card.exp.length >= 4 && card.cvc.length >= 3 && !!billing.name && !!billing.address1 && !!billing.city && !!billing.state && !!billing.zip
    return true
  }

  async function lookup() {
    setLooking(true); setLookupMsg(null)
    try {
      const r = await fetch('/api/nectar/account/lookup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contact }) })
      const j = await r.json()
      if (!r.ok) { setLookupMsg(j.error ?? 'Lookup failed.'); return false }
      if (!j.found || !j.accounts?.length) { setLookupMsg('We couldn’t find an account for that email or phone. Double-check it, or call us.'); return false }
      setAccount(j.accounts[0] as Account) // first active lease
      return true
    } catch { setLookupMsg('Something went wrong — please try again or call us.'); return false }
    finally { setLooking(false) }
  }

  async function pay(): Promise<boolean> {
    if (!account) return false
    const [mm = '', yyRaw = ''] = card.exp.split('/').map((s) => s.trim())
    const yy = yyRaw.length === 2 ? `20${yyRaw}` : yyRaw
    try {
      const r = await fetch('/api/nectar/account/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        leaseId: account.leaseId, amount: amountDue,
        card: { card_number: card.number.replace(/\s/g, ''), cvv2: card.cvc, exp_mo: mm, exp_yr: yy, name_on_card: billing.name, address: billing.address1, city: billing.city, state: billing.state, zip: billing.zip },
      }) })
      const j = await r.json()
      if (r.ok && j.ok) return true
      setPayError(j.error ?? 'Payment could not be processed.')
    } catch { setPayError('Something went wrong — please try again or call us.') }
    return false
  }

  const next = async () => {
    if (stepName === 'Account') { if (await lookup()) setStep(1); return }
    if (stepName === 'Payment') {
      setProcessing(true); setPayError(null)
      const ok = await pay()
      setProcessing(false)
      if (ok) setStep(3)
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const primaryBtn = 'inline-flex items-center justify-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-[0.9375rem] font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,.3)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100'
  const glassCard = `${R} border border-warm-white/10 bg-warm-white/[0.04]`

  return (
    <div className="fixed inset-0 z-[130] flex items-stretch justify-center overflow-y-auto bg-black/80 backdrop-blur-md sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Pay your bill">
      <div className="grain relative flex min-h-full w-full max-w-3xl flex-col overflow-hidden bg-black text-warm-white antialiased sm:min-h-0 sm:max-h-[92vh] sm:rounded-tl-[32px] sm:rounded-tr-[6px] sm:rounded-br-[6px] sm:rounded-bl-[6px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(232,98,42,0.12), transparent 70%)' }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #F5F0E8 0.7px, transparent 0.7px)', backgroundSize: '22px 22px' }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[88px] z-[1] flex select-none justify-center overflow-hidden">
          <span className="whitespace-nowrap text-[6rem] font-black uppercase leading-none tracking-tight text-warm-white/[0.03] lg:text-[10rem]">{WATERMARK[stepName]}</span>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-[5] flex items-center justify-between gap-4 border-b border-warm-white/[0.07] bg-black/70 px-5 py-4 backdrop-blur-md lg:px-10">
          <div>
            <p className="text-[0.9375rem] font-black leading-tight tracking-[-0.02em] text-warm-white">Pay your bill</p>
            <p className="text-[0.75rem] text-warm-white/50">Journey.Storage™ — {facility.short ? `${facility.short}, ` : ''}Granbury TX</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-warm-white/[0.08] text-warm-white transition-colors hover:bg-warm-white/[0.16]"><X className="h-5 w-5" aria-hidden /></button>
        </div>

        <div className="relative z-[3] flex-1 overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
          {stepName === 'Account' && (
            <div className="mx-auto max-w-md">
              <Eyebrow label="Find account" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><Search className="h-6 w-6 text-orange" aria-hidden />Find your account</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Enter the email or phone on your rental{atFacility}.</p>
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Email or phone" className={`mt-7 ${FIELD}`} />
              <p className="mt-3 text-[0.75rem] leading-relaxed text-warm-white/40">We&rsquo;ll find your balance and let you pay securely. No login required.</p>
              {lookupMsg && <p className="mt-4 rounded-sm border border-[#D4956A]/40 bg-[#D4956A]/10 px-4 py-3 text-[0.8125rem] font-bold text-[#E8A87C]">{lookupMsg} <a href={facility.tel} className="underline">{facility.phone}</a></p>}
            </div>
          )}

          {stepName === 'Balance' && account && (
            <div className="mx-auto max-w-md">
              <Eyebrow label="Balance" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><Wallet className="h-6 w-6 text-orange" aria-hidden />Your balance</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">{account.name}{account.code ? ` · ${account.code}` : ''}</p>
              <div className={`mt-7 ${glassCard} p-5`}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.9375rem] text-warm-white/70">Amount due now</span>
                  <span className={`text-[1.75rem] font-black ${amountDue > 0 ? 'text-orange' : 'text-sage-green'}`}>{money(amountDue)}</span>
                </div>
              </div>
              {amountDue <= 0 && <p className="mt-4 flex items-center gap-2 text-[0.9375rem] font-bold text-sage-green"><Check className="h-4 w-4" aria-hidden />You&rsquo;re all paid up — nothing due right now.</p>}
            </div>
          )}

          {stepName === 'Payment' && (
            <div className="mx-auto max-w-md">
              <Eyebrow label="Payment" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><CreditCard className="h-6 w-6 text-orange" aria-hidden />Payment</h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/50">Paying {money(amountDue)} on {yourAccount}.</p>
              <div className="mt-7 space-y-3">
                <input inputMode="numeric" placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={FIELD} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className={FIELD} />
                  <input placeholder="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} className={FIELD} />
                </div>
                <p className="pt-2 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-warm-white/40">Billing address</p>
                <input placeholder="Cardholder name" value={billing.name} onChange={(e) => setBilling({ ...billing, name: e.target.value })} className={FIELD} />
                <input placeholder="Street address" value={billing.address1} onChange={(e) => setBilling({ ...billing, address1: e.target.value })} className={FIELD} />
                <div className="grid grid-cols-[1fr_80px_100px] gap-3">
                  <input placeholder="City" value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} className={FIELD} />
                  <input placeholder="State" maxLength={2} value={billing.state} onChange={(e) => setBilling({ ...billing, state: e.target.value.toUpperCase() })} className={FIELD} />
                  <input placeholder="ZIP" value={billing.zip} onChange={(e) => setBilling({ ...billing, zip: e.target.value })} className={FIELD} />
                </div>
              </div>
              {payError && <p className="mt-4 rounded-sm border border-[#D4956A]/40 bg-[#D4956A]/10 px-4 py-3 text-[0.8125rem] font-bold text-[#E8A87C]">{payError} <a href={facility.tel} className="underline">{facility.phone}</a></p>}
              <p className="mt-4 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/55">Secured by Tenant Payments. Your card is charged {money(amountDue)} and applied to your account.</p>
            </div>
          )}

          {stepName === 'Done' && (
            <div className="mx-auto max-w-md py-4 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-green/20 text-sage-green ring-1 ring-sage-green/30"><Check className="h-9 w-9" strokeWidth={3} aria-hidden /></div>
              <h2 className="mt-5 text-[2rem] font-black leading-[1.02] tracking-[-0.02em] text-warm-white">Payment received</h2>
              <p className="mt-3 text-[1rem] leading-[1.6] text-warm-white/50">Thanks{account?.name ? `, ${account.name.split(' ')[0]}` : ''}! We&rsquo;ve applied {money(amountDue)} to {yourAccount}. A receipt is on its way.</p>
              <div className={`mt-7 ${R} relative overflow-hidden border border-warm-white/10 bg-warm-white/[0.05] p-6 text-left`}>
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(232,98,42,0.18) 0%, transparent 60%)' }} />
                <dl className="relative space-y-2 text-[0.9375rem]">
                  {account?.code && <div className="flex justify-between"><dt className="text-warm-white/55">Account</dt><dd className="font-bold text-warm-white">{account.code}</dd></div>}
                  <div className="flex justify-between"><dt className="text-warm-white/55">Amount paid</dt><dd className="font-bold text-warm-white">{money(amountDue)}</dd></div>
                </dl>
              </div>
              <p className="mt-7 text-[0.75rem] text-warm-white/40">Questions? Call <a href={facility.tel} className="font-bold text-orange">{facility.phone}</a>.</p>
              <button onClick={onClose} className={`mt-6 ${primaryBtn}`}>Done</button>
            </div>
          )}
        </div>

        {stepName !== 'Done' && (
          <div className="sticky bottom-0 z-[5] flex items-center justify-between gap-3 border-t border-warm-white/[0.07] bg-black/70 px-5 py-4 backdrop-blur-md lg:px-10">
            <button onClick={step === 0 ? onClose : back} className="inline-flex items-center gap-1.5 rounded-sm px-4 py-2.5 font-bold text-warm-white/60 transition-colors hover:bg-warm-white/[0.06] hover:text-warm-white">
              <ChevronLeft className="h-4 w-4" aria-hidden />{step === 0 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex items-center gap-3">
              {stepName === 'Balance' && amountDue > 0 && <span className="hidden text-[0.9375rem] font-black text-warm-white sm:inline">{money(amountDue)} due</span>}
              <button onClick={next} disabled={!canNext() || looking || processing} className={primaryBtn}>
                {looking ? 'Finding…' : processing ? 'Processing…' : stepName === 'Account' ? 'Find my balance' : stepName === 'Balance' ? 'Continue to payment' : `Pay ${money(amountDue)}`}
                {!looking && !processing && <ChevronRight className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
