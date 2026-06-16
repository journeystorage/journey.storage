'use client'

import { useState, useEffect, type FormEvent, type ReactNode } from 'react'

const CALENDLY_URL = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1UO_n2BsSorjoLlzCVGjqLvi8dhAWDYSFVTj0uSItghc2OgucVW1F2nHLcwPeyLDbi546yr8kV'

type FormData = {
  full_name: string
  email: string
  phone: string
  state_code: string
  accredited_status: string
  check_size_band: string
  timeline: string
  prior_re_experience: string
  source_of_capital: string
  message: string
}

const initialForm: FormData = {
  full_name: '',
  email: '',
  phone: '',
  state_code: '',
  accredited_status: '',
  check_size_band: '',
  timeline: '',
  prior_re_experience: '',
  source_of_capital: '',
  message: '',
}

const US_STATES: Array<[string, string]> = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],
  ['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],
  ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],
  ['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],
  ['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],
  ['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
  ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
  ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],
  ['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],
  ['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],
  ['WI','Wisconsin'],['WY','Wyoming'],['DC','District of Columbia'],
]

const ACCREDITED_OPTIONS: Array<{ value: string; title: string; desc: string }> = [
  { value: 'income', title: 'Income', desc: '$200k+ single / $300k+ joint for the last 2 years with reasonable expectation of the same this year.' },
  { value: 'net_worth', title: 'Net worth', desc: '$1M+ net worth, individually or jointly with spouse, excluding primary residence.' },
  { value: 'professional', title: 'Professional certification', desc: 'Series 7, Series 65, Series 82, or a knowledgeable employee of the fund.' },
  { value: 'entity', title: 'Entity / family office', desc: 'An entity with $5M+ in assets, or all equity owners are accredited.' },
  { value: 'unsure', title: "I'm not sure", desc: 'Reach out anyway. We can help you determine eligibility.' },
  { value: 'not_accredited', title: "I'm not accredited", desc: "Our 506(c) deals aren't available to non-accredited investors, but we'll keep you informed." },
]

function getUtmFromUrl() {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source') || undefined,
    utm_medium: p.get('utm_medium') || undefined,
    utm_campaign: p.get('utm_campaign') || undefined,
    utm_content: p.get('utm_content') || undefined,
    utm_term: p.get('utm_term') || undefined,
    referrer: document.referrer || undefined,
    landing_page: window.location.pathname + window.location.search,
  }
}

const inputCls =
  'w-full bg-white/[0.06] text-white border border-stone-400/30 rounded-sm px-4 py-3.5 text-base font-normal placeholder:text-stone-400 focus:border-orange-500 focus:outline-none transition-colors'

export default function InvestorApplicationForm({
  formSource = 'website-investor-form',
}: { formSource?: string }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | 'accredited' | 'not_accredited'>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
    if (Array.isArray(dl)) {
      dl.push({ event: 'investor_form_view', form_source: formSource })
    }
  }, [formSource])

  const totalSteps = 3
  const progressPct = (step / totalSteps) * 100

  const update = (field: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateStep1 = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (data.full_name.trim().length < 2) e.full_name = 'Full name required'
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = 'Valid email required'
    if (data.phone.trim().length < 7) e.phone = 'Phone required'
    if (data.state_code.length !== 2) e.state_code = 'Select your state'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!data.accredited_status) e.accredited_status = 'Please choose one'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!data.check_size_band) e.check_size_band = 'Select a range'
    if (!data.timeline) e.timeline = 'Select timeline'
    if (!data.prior_re_experience) e.prior_re_experience = 'Select one'
    if (!data.source_of_capital) e.source_of_capital = 'Select one'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    let valid = false
    if (step === 1) valid = validateStep1()
    if (step === 2) valid = validateStep2()
    if (valid) setStep(s => s + 1)
  }

  const handleBack = () => setStep(s => Math.max(1, s - 1))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateStep3()) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const payload = { ...data, ...getUtmFromUrl(), form_source: formSource }
      const res = await fetch('/api/investor-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Submission failed')
      }
      if (typeof window !== 'undefined') {
        const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
        if (Array.isArray(dl)) {
          dl.push({
            event: 'investor_lead_submitted',
            form_source: formSource,
            check_size_band: data.check_size_band,
            accredited_status: data.accredited_status,
            timeline: data.timeline,
            state_code: data.state_code,
          })
        }
      }
      const isAccredited = ['income', 'net_worth', 'professional', 'entity'].includes(data.accredited_status)
      setSubmitted(isAccredited ? 'accredited' : 'not_accredited')
      if (isAccredited) {
        setTimeout(() => { window.location.href = CALENDLY_URL }, 2500)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted === 'accredited') {
    return (
      <div className="py-16 text-center">
        <h3 className="text-3xl font-black text-white mb-4">
          You&apos;re in. Redirecting you to book your call.
        </h3>
        <p className="text-white/60 max-w-md mx-auto leading-relaxed">
          Jonah will walk you through the platform thesis, the Granbury deal specifics,
          and answer every question. Quietly, directly, on a 30-minute call.
        </p>
        <p className="mt-6 text-sm text-white/40">
          If you aren&apos;t redirected in 5 seconds,{' '}
          <a href={CALENDLY_URL} className="text-orange-500 underline">click here</a>.
        </p>
      </div>
    )
  }

  if (submitted === 'not_accredited') {
    return (
      <div className="py-16 text-center max-w-lg mx-auto">
        <h3 className="text-3xl font-black text-white mb-4">
          Thanks for your interest.
        </h3>
        <p className="text-white/60 leading-relaxed">
          Journey.Direct&trade; opportunities under Rule 506(c) are limited to
          accredited investors. We&apos;ll keep you informed of our broader market
          insights and any future opportunities open to a wider audience.
        </p>
        <p className="mt-6 text-sm text-white/40">
          Curious what accredited means? Income above $200k single / $300k joint
          for the last two years, or $1M+ net worth excluding primary residence.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="w-full bg-white/10 h-px relative">
        <div
          className="absolute top-0 left-0 h-px bg-orange-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-xs uppercase tracking-[0.15em] text-white/40">
        Step {step} of {totalSteps}
      </p>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl font-black text-white">Tell us who you are</h3>
          <Field label="Full name" error={errors.full_name}>
            <input
              value={data.full_name}
              onChange={(e) => update('full_name', e.target.value)}
              className={inputCls}
              placeholder="Jane Investor"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputCls}
              placeholder="you@email.com"
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={inputCls}
              placeholder="(555) 000-0000"
            />
          </Field>
          <Field label="State of residence" error={errors.state_code}>
            <select
              value={data.state_code}
              onChange={(e) => update('state_code', e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>Select your state</option>
              {US_STATES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl font-black text-white">Accredited investor status</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Journey.Direct&trade; offerings are made under SEC Rule 506(c).
            Accreditation will be verified independently before any subscription.
            Pick the basis that applies to you.
          </p>
          {ACCREDITED_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`flex gap-3 p-4 border transition-colors cursor-pointer ${
                data.accredited_status === opt.value
                  ? 'border-orange-500'
                  : 'border-white/10 hover:border-orange-500/40'
              }`}
            >
              <input
                type="radio"
                name="accredited_status"
                value={opt.value}
                checked={data.accredited_status === opt.value}
                onChange={(e) => update('accredited_status', e.target.value)}
                className="mt-1 accent-orange-500"
              />
              <div className="flex flex-col gap-1">
                <span className="text-white font-bold">{opt.title}</span>
                <span className="text-sm text-white/60 leading-relaxed">{opt.desc}</span>
              </div>
            </label>
          ))}
          {errors.accredited_status && (
            <p className="text-sm text-orange-500">{errors.accredited_status}</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl font-black text-white">Your investment profile</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            This helps Jonah prep for your call. Nothing here commits you to anything.
          </p>

          <Field label="Check size you're considering" error={errors.check_size_band}>
            <select
              value={data.check_size_band}
              onChange={(e) => update('check_size_band', e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>Select a range</option>
              <option value="50k_100k">$50,000 - $100,000</option>
              <option value="100k_250k">$100,000 - $250,000</option>
              <option value="250k_500k">$250,000 - $500,000</option>
              <option value="500k_1m">$500,000 - $1,000,000</option>
              <option value="1m_plus">$1,000,000+</option>
            </select>
          </Field>

          <Field label="Investment timeline" error={errors.timeline}>
            <select
              value={data.timeline}
              onChange={(e) => update('timeline', e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>Select timeline</option>
              <option value="immediate">Ready now</option>
              <option value="30_60_days">30 - 60 days</option>
              <option value="60_90_days">60 - 90 days</option>
              <option value="exploring">Exploring, no timeline</option>
            </select>
          </Field>

          <Field label="Prior real estate investing experience" error={errors.prior_re_experience}>
            <select
              value={data.prior_re_experience}
              onChange={(e) => update('prior_re_experience', e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>Select one</option>
              <option value="syndications">Prior syndications / private deals</option>
              <option value="direct_ownership">Direct property ownership</option>
              <option value="reit_only">Public REITs only</option>
              <option value="none">This would be my first</option>
            </select>
          </Field>

          <Field label="Source of investment capital" error={errors.source_of_capital}>
            <select
              value={data.source_of_capital}
              onChange={(e) => update('source_of_capital', e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>Select one</option>
              <option value="personal_savings">Personal savings / liquid</option>
              <option value="1031_exchange">1031 exchange proceeds</option>
              <option value="sdira">Self-directed IRA</option>
              <option value="company_cash">Company / operating cash</option>
              <option value="family_office">Family office</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Anything you'd like Jonah to know? (Optional)">
            <textarea
              value={data.message}
              onChange={(e) => update('message', e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Specific questions, context on your goals, etc."
            />
          </Field>
        </div>
      )}

      {submitError && (
        <p className="text-orange-500 text-sm">{submitError}</p>
      )}

      <div className="flex gap-3 mt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            Back
          </button>
        )}
        {step < totalSteps && (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
          >
            Continue
          </button>
        )}
        {step === totalSteps && (
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Request platform overview'}
          </button>
        )}
      </div>

      <p className="text-xs text-white/40 leading-relaxed">
        By submitting, you confirm the information above is accurate. Accredited status
        will be verified independently before any subscription. We do not sell or share
        your information.
      </p>
    </form>
  )
}

function Field({
  label, error, children,
}: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-white">{label}</label>
      {children}
      {error && <p className="text-sm text-orange-500">{error}</p>}
    </div>
  )
}
