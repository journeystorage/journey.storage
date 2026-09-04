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

type Account = {
  leaseId: string
  name: string
  code: string | null
  balance: number
  unitNumber: string | null
  unitSize: string | null
  propertyName: string | null
  monthlyRent: number | null
  paidThrough: string | null
  dueDate: string | null
  periodStart: string | null
  periodEnd: string | null
  pastDue: boolean
}

// The API mixes "YYYY-MM-DD" and "YYYY-MM-DD HH:MM:SS"; keep the date part and
// parse as local so the day never shifts.
const asDate = (v?: string | null) => {
  const d = (v ?? '').slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T00:00`) : null
}
const dateShort = (v?: string | null) =>
  asDate(v)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ?? ''
const dateDay = (v?: string | null) =>
  asDate(v)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? ''

/** "Unit 85 · 10' x 10'" — whatever of it we know. */
const spaceLabel = (a: Account) =>
  [a.unitNumber ? `Unit ${a.unitNumber}` : null, a.unitSize].filter(Boolean).join(' · ') || 'Your space'

/**
 * Format a US phone as it's typed — "8175790607" → "(817) 579-0607".
 * Left alone the moment it looks like an email (or anything with letters), so
 * the one field still takes either.
 */
function formatContact(v: string): string {
  if (/[a-zA-Z@]/.test(v)) return v
  const raw = v.replace(/\D/g, '').slice(0, 11)
  const d = raw.length === 11 && raw.startsWith('1') ? raw.slice(1) : raw
  if (!d) return ''
  if (d.length <= 3) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`
}

/**
 * One plain sentence saying what this payment covers. The space and property
 * are always shown directly above it, so this line doesn't repeat them.
 */
function whatYouArePaying(a: Account): string {
  if (a.balance <= 0) {
    return a.paidThrough ? `Nothing due — paid through ${dateShort(a.paidThrough)}.` : 'Nothing due right now.'
  }
  const due = a.dueDate ? ` · due ${dateShort(a.dueDate)}` : ''
  if (a.periodStart && a.periodEnd) return `Rent for ${dateDay(a.periodStart)} – ${dateDay(a.periodEnd)}${due}`
  if (a.monthlyRent) return `Monthly rent ${money(a.monthlyRent)}${due}`
  return `Outstanding account balance${due}`
}

// `short` names the facility when opened from a facility page; omit it when
// opened from the site nav (account lookup spans all locations) so the copy
// doesn't read "Granbury, Granbury TX".
export default function PayBillFlow({ facility, onClose }: { facility: { short?: string; phone: string; tel: string }; onClose: () => void }) {
  const atFacility = facility.short ? ` at ${facility.short}` : ''
  const yourAccount = facility.short ? `your ${facility.short} account` : 'your account'
  const [step, setStep] = useState(0)
  const [contact, setContact] = useState('')
  const [looking, setLooking] = useState(false)
  // A tenant can hold several spaces, sometimes at different properties, and
  // may want to settle more than one at once.
  const [accounts, setAccounts] = useState<Account[]>([])
  const [picked, setPicked] = useState<string[]>([])
  // Per-lease outcome — paying N spaces is N charges, so some can fail.
  const [results, setResults] = useState<Array<{ leaseId: string; ok: boolean; error?: string }>>([])
  const [lookupMsg, setLookupMsg] = useState<string | null>(null)
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' })
  const [billing, setBilling] = useState({ name: '', address1: '', city: '', state: '', zip: '' })
  const [autopay, setAutopay] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const stepName: StepName = STEPS[step]
  const payable = accounts.filter((a) => a.balance > 0)
  const chosen = accounts.filter((a) => picked.includes(a.leaseId))
  const amountDue = +chosen.reduce((s, a) => s + a.balance, 0).toFixed(2)
  const toggle = (leaseId: string) =>
    setPicked((p) => (p.includes(leaseId) ? p.filter((x) => x !== leaseId) : [...p, leaseId]))
  const paidOk = accounts.filter((a) => results.some((r) => r.leaseId === a.leaseId && r.ok))
  const paidFailed = accounts.filter((a) => results.some((r) => r.leaseId === a.leaseId && !r.ok))
  const amountPaid = +paidOk.reduce((s, a) => s + a.balance, 0).toFixed(2)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const canNext = () => {
    if (stepName === 'Account') return /.+@.+\..+/.test(contact) || contact.replace(/\D/g, '').length >= 7
    if (stepName === 'Balance') return chosen.length > 0 && amountDue > 0
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
      const list = j.accounts as Account[]
      setAccounts(list)
      // Pre-select every space that owes — the common case is "pay what I owe".
      setPicked(list.filter((a) => a.balance > 0).map((a) => a.leaseId))
      return true
    } catch { setLookupMsg('Something went wrong — please try again or call us.'); return false }
    finally { setLooking(false) }
  }

  /**
   * Each space is its own lease and its own charge, so pay them one at a time
   * and record each outcome — a later one failing must not erase an earlier
   * success, and the receipt has to say exactly what went through.
   */
  async function pay(): Promise<boolean> {
    if (!chosen.length) return false
    const [mm = '', yyRaw = ''] = card.exp.split('/').map((s) => s.trim())
    const yy = yyRaw.length === 2 ? `20${yyRaw}` : yyRaw
    const cardPayload = { card_number: card.number.replace(/\s/g, ''), cvv2: card.cvc, exp_mo: mm, exp_yr: yy, name_on_card: billing.name, address: billing.address1, city: billing.city, state: billing.state, zip: billing.zip }
    const out: Array<{ leaseId: string; ok: boolean; error?: string }> = []
    for (const a of chosen) {
      try {
        const r = await fetch('/api/nectar/account/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leaseId: a.leaseId, amount: a.balance, card: cardPayload, autopay }) })
        const j = await r.json()
        out.push(r.ok && j.ok ? { leaseId: a.leaseId, ok: true } : { leaseId: a.leaseId, ok: false, error: j.error ?? 'Payment declined.' })
      } catch {
        out.push({ leaseId: a.leaseId, ok: false, error: 'Connection problem.' })
      }
    }
    setResults(out)
    const anyOk = out.some((r) => r.ok)
    const failures = out.filter((r) => !r.ok)
    if (failures.length && anyOk) {
      setPayError(`We couldn’t complete ${failures.length} of ${out.length} payments — see below.`)
    } else if (failures.length) {
      setPayError(failures[0].error ?? 'Payment could not be processed.')
    }
    // Land on the receipt whenever anything succeeded, so the tenant sees it.
    return anyOk
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
              <input
                value={contact}
                onChange={(e) => setContact(formatContact(e.target.value))}
                onKeyDown={(e) => { if (e.key === 'Enter' && canNext() && !looking) next() }}
                inputMode="text"
                autoComplete="email"
                placeholder="Email or phone"
                className={`mt-7 ${FIELD}`}
              />
              <p className="mt-3 text-[0.75rem] leading-relaxed text-warm-white/40">We&rsquo;ll find your balance and let you pay securely. No login required.</p>
              {lookupMsg && <p className="mt-4 rounded-sm border border-[#D4956A]/40 bg-[#D4956A]/10 px-4 py-3 text-[0.8125rem] font-bold text-[#E8A87C]">{lookupMsg} <a href={facility.tel} className="underline">{facility.phone}</a></p>}
            </div>
          )}

          {stepName === 'Balance' && accounts.length > 0 && (
            <div className="mx-auto max-w-md">
              <Eyebrow label={accounts.length > 1 ? 'Your spaces' : 'Balance'} />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white">
                <Wallet className="h-6 w-6 shrink-0 text-orange" aria-hidden />
                {payable.length > 1 ? 'Choose spaces to pay' : accounts.length > 1 ? 'Choose a space to pay' : 'Your balance'}
              </h2>
              <p className="mt-2 text-[1rem] leading-[1.6] text-warm-white/60">
                <span className="font-bold text-warm-white">{accounts[0].name}</span>
                {accounts.length > 1 && <> · {accounts.length} spaces{new Set(accounts.map((a) => a.propertyName).filter(Boolean)).size > 1 ? ' across 2+ locations' : ''}</>}
              </p>

              {payable.length > 1 && (
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-[0.8125rem] text-warm-white/55">Select the spaces you&rsquo;d like to pay.</p>
                  <button
                    type="button"
                    onClick={() => setPicked(picked.length === payable.length ? [] : payable.map((a) => a.leaseId))}
                    className="shrink-0 text-[0.8125rem] font-bold text-orange underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    {picked.length === payable.length ? 'Clear all' : 'Select all'}
                  </button>
                </div>
              )}

              <div className="mt-4 space-y-3">
                {accounts.map((a) => {
                  const owes = a.balance > 0
                  const selected = picked.includes(a.leaseId)
                  return (
                    <button
                      key={a.leaseId}
                      type="button"
                      onClick={() => owes && toggle(a.leaseId)}
                      disabled={!owes}
                      aria-pressed={selected}
                      className={`block w-full rounded-sm border p-4 text-left transition-colors duration-150 ${
                        selected ? 'border-orange bg-orange/[0.08]' : 'border-warm-white/12 bg-warm-white/[0.04]'
                      } ${owes ? 'cursor-pointer hover:border-warm-white/30' : 'cursor-default opacity-70'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange`}
                    >
                      <div className="flex items-start gap-3">
                        {owes && (
                          <span
                            aria-hidden
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-sm border transition-colors duration-150 ${
                              selected ? 'border-orange bg-orange text-warm-white' : 'border-warm-white/30'
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[1.0625rem] font-black tracking-[-0.01em] text-warm-white">{spaceLabel(a)}</p>
                              {a.propertyName && <p className="mt-0.5 text-[0.8125rem] text-warm-white/55">{a.propertyName}</p>}
                            </div>
                            <div className="shrink-0 text-right">
                              <p className={`text-[1.25rem] font-black leading-none ${owes ? 'text-orange' : 'text-sage-green'}`}>{money(a.balance)}</p>
                              {a.pastDue ? (
                                <span className="mt-1.5 inline-block rounded-full bg-[#D4956A]/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-[#E8A87C]">Past due</span>
                              ) : owes ? (
                                a.dueDate && <p className="mt-1 text-[0.6875rem] text-warm-white/45">Due {dateShort(a.dueDate)}</p>
                              ) : (
                                <span className="mt-1.5 inline-flex items-center gap-1 text-[0.6875rem] font-bold text-sage-green"><Check className="h-3 w-3" aria-hidden />Paid</span>
                              )}
                            </div>
                          </div>
                          <p className="mt-2.5 border-t border-warm-white/[0.07] pt-2.5 text-[0.75rem] leading-relaxed text-warm-white/55">{whatYouArePaying(a)}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {accounts.every((a) => a.balance <= 0) ? (
                <p className="mt-4 flex items-start gap-2 text-[0.9375rem] font-bold text-sage-green"><Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />You&rsquo;re all paid up — nothing due right now.</p>
              ) : chosen.length > 1 ? (
                <div className="mt-4 flex items-baseline justify-between gap-3 rounded-sm border border-warm-white/12 bg-warm-white/[0.04] px-4 py-3">
                  <span className="text-[0.875rem] font-bold text-warm-white">Total for {chosen.length} spaces</span>
                  <span className="text-[1.25rem] font-black text-orange">{money(amountDue)}</span>
                </div>
              ) : payable.length > 0 && chosen.length === 0 ? (
                <p className="mt-4 text-[0.8125rem] text-warm-white/50">Select at least one space to continue.</p>
              ) : null}
            </div>
          )}

          {stepName === 'Payment' && chosen.length > 0 && (
            <div className="mx-auto max-w-md">
              <Eyebrow label="Payment" />
              <h2 className="mt-4 flex items-center gap-2.5 text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-warm-white"><CreditCard className="h-6 w-6 shrink-0 text-orange" aria-hidden />Payment</h2>
              {/* Exactly what's being paid, and on which space — tenants with
                  spaces at more than one property need this to be unambiguous. */}
              <div className={`mt-5 ${glassCard} p-4`}>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-warm-white/45">Paying for</p>
                <p className="mt-1 text-[0.8125rem] text-warm-white/60">{chosen[0].name}</p>
                <div className="mt-3 space-y-2.5">
                  {chosen.map((a) => (
                    <div key={a.leaseId} className="flex items-start justify-between gap-3 border-t border-warm-white/[0.07] pt-2.5">
                      <div className="min-w-0">
                        <p className="text-[0.9375rem] font-bold text-warm-white">{spaceLabel(a)}</p>
                        <p className="mt-0.5 text-[0.75rem] text-warm-white/55">{[a.propertyName, whatYouArePaying(a)].filter(Boolean).join(' · ')}</p>
                      </div>
                      <p className="shrink-0 text-[0.9375rem] font-black text-warm-white">{money(a.balance)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-warm-white/15 pt-3">
                  <span className="text-[0.875rem] font-bold text-warm-white">Total</span>
                  <span className="text-[1.5rem] font-black leading-none text-orange">{money(amountDue)}</span>
                </div>
                {chosen.length > 1 && (
                  <p className="mt-3 text-[0.6875rem] leading-relaxed text-warm-white/45">Each space is billed separately, so {chosen.length} charges totalling {money(amountDue)} will appear on your statement.</p>
                )}
              </div>
              <div className="mt-6 space-y-3">
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
              {/* Autopay is stored on the card itself, so offer it right here. */}
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-sm border border-warm-white/12 bg-warm-white/[0.04] p-4 text-[0.875rem] text-warm-white/80 transition-colors duration-150 hover:border-warm-white/25">
                <input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-orange" />
                <span>
                  <b className="text-warm-white">Turn on autopay</b> — save this card and charge {chosen.length > 1 ? 'these spaces' : 'this space'} automatically each month, so rent is never late.
                  <span className="mt-1 block text-[0.75rem] leading-relaxed text-warm-white/45">You can turn it off any time by calling us.</span>
                </span>
              </label>
              {payError && <p className="mt-4 rounded-sm border border-[#D4956A]/40 bg-[#D4956A]/10 px-4 py-3 text-[0.8125rem] font-bold text-[#E8A87C]">{payError} <a href={facility.tel} className="underline">{facility.phone}</a></p>}
              <p className="mt-4 rounded-sm border border-warm-white/[0.08] bg-warm-white/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-warm-white/55">Secured by Tenant Payments. Your card is charged {money(amountDue)} and applied to {chosen.length > 1 ? 'the spaces above' : 'your account'}.</p>
            </div>
          )}

          {stepName === 'Done' && (
            <div className="mx-auto max-w-md py-4 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-green/20 text-sage-green ring-1 ring-sage-green/30"><Check className="h-9 w-9" strokeWidth={3} aria-hidden /></div>
              <h2 className="mt-5 text-[2rem] font-black leading-[1.02] tracking-[-0.02em] text-warm-white">{paidFailed.length ? 'Partly paid' : 'Payment received'}</h2>
              <p className="mt-3 text-[1rem] leading-[1.6] text-warm-white/50">
                Thanks{paidOk[0]?.name ? `, ${paidOk[0].name.split(' ')[0]}` : ''}! We&rsquo;ve applied {money(amountPaid)} to {paidOk.length > 1 ? `${paidOk.length} spaces` : paidOk[0] ? spaceLabel(paidOk[0]) : yourAccount}. A receipt is on its way.
              </p>
              <div className={`mt-7 ${R} relative overflow-hidden border border-warm-white/10 bg-warm-white/[0.05] p-6 text-left`}>
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(232,98,42,0.18) 0%, transparent 60%)' }} />
                <dl className="relative space-y-2 text-[0.9375rem]">
                  {paidOk[0]?.name && <div className="flex justify-between gap-3"><dt className="text-warm-white/55">Name</dt><dd className="text-right font-bold text-warm-white">{paidOk[0].name}</dd></div>}
                  {paidOk.map((a) => (
                    <div key={a.leaseId} className="flex justify-between gap-3">
                      <dt className="text-warm-white/55">{spaceLabel(a)}{a.propertyName ? <span className="block text-[0.75rem] text-warm-white/35">{a.propertyName}</span> : null}</dt>
                      <dd className="text-right font-bold text-warm-white">{money(a.balance)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 border-t border-warm-white/[0.07] pt-2"><dt className="text-warm-white/55">Total paid</dt><dd className="text-right font-bold text-warm-white">{money(amountPaid)}</dd></div>
                </dl>
              </div>
              {autopay && paidOk.length > 0 && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-sm border border-sage-green/25 bg-sage-green/10 px-4 py-2.5 text-[0.8125rem] font-bold text-sage-green">
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                  Autopay is on for {paidOk.length > 1 ? `${paidOk.length} spaces` : spaceLabel(paidOk[0])}
                </p>
              )}
              {paidFailed.length > 0 && (
                <p className="mt-5 rounded-sm border border-[#D4956A]/40 bg-[#D4956A]/10 px-4 py-3 text-left text-[0.8125rem] leading-relaxed text-[#E8A87C]">
                  <b>We couldn&rsquo;t charge {paidFailed.map((a) => spaceLabel(a)).join(' or ')}.</b> Nothing was taken for {paidFailed.length > 1 ? 'those spaces' : 'that space'} — try again, or call <a href={facility.tel} className="underline">{facility.phone}</a>.
                </p>
              )}
              {accounts.filter((a) => a.balance > 0 && !results.some((r) => r.leaseId === a.leaseId)).length > 0 && (
                <p className="mt-4 rounded-sm border border-orange/25 bg-orange/[0.06] px-4 py-3 text-left text-[0.8125rem] leading-relaxed text-warm-white/70">
                  You still have a balance on {accounts.filter((a) => a.balance > 0 && !results.some((r) => r.leaseId === a.leaseId)).map((a) => spaceLabel(a)).join(' and ')}. Reopen Pay Bill to take care of that too.
                </p>
              )}
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
                {looking ? 'Finding…' : processing ? 'Processing…' : stepName === 'Account' ? 'Find my balance' : stepName === 'Balance' ? (chosen.length ? 'Continue to payment' : 'Select a space') : `Pay ${money(amountDue)}`}
                {!looking && !processing && <ChevronRight className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
