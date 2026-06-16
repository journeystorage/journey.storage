'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

const CALENDLY_URL = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1UO_n2BsSorjoLlzCVGjqLvi8dhAWDYSFVTj0uSItghc2OgucVW1F2nHLcwPeyLDbi546yr8kV'

const step1Schema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone required'),
  state_code: z.string().length(2, 'Select your state'),
})

const step2Schema = z.object({
  accredited_status: z.enum([
    'income', 'net_worth', 'professional', 'entity',
    'not_accredited', 'unsure',
  ]),
})

const step3Schema = z.object({
  check_size_band: z.enum([
    '50k_100k', '100k_250k', '250k_500k', '500k_1m', '1m_plus',
  ]),
  timeline: z.enum([
    'immediate', '30_60_days', '60_90_days', 'exploring',
  ]),
  prior_re_experience: z.enum([
    'syndications', 'direct_ownership', 'reit_only', 'none',
  ]),
  source_of_capital: z.enum([
    'personal_savings', '1031_exchange', 'sdira',
    'company_cash', 'family_office', 'other',
  ]),
  message: z.string().optional(),
})

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema)
type InvestorFormData = z.infer<typeof fullSchema>

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

export default function InvestorApplicationForm({
  formSource = 'website-investor-form',
}: { formSource?: string }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState<null | 'accredited' | 'not_accredited'>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register, handleSubmit, trigger, getValues,
    formState: { errors, isSubmitting },
  } = useForm<InvestorFormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
    if (Array.isArray(dl)) {
      dl.push({ event: 'investor_form_view', form_source: formSource })
    }
  }, [formSource])

  const totalSteps = 3
  const progressPct = (step / totalSteps) * 100

  const onFinalSubmit = async (data: InvestorFormData) => {
    setError(null)
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

      const isAccredited = ['income', 'net_worth', 'professional', 'entity']
        .includes(data.accredited_status)
      setSubmitted(isAccredited ? 'accredited' : 'not_accredited')

      if (isAccredited) {
        setTimeout(() => { window.location.href = CALENDLY_URL }, 2500)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  const handleNext = async () => {
    let valid = false
    if (step === 1) valid = await trigger(['full_name', 'email', 'phone', 'state_code'])
    if (step === 2) valid = await trigger(['accredited_status'])
    if (valid) setStep(s => s + 1)
  }

  const handleBack = () => setStep(s => Math.max(1, s - 1))

  if (submitted === 'accredited') {
    return (
      <div className="py-16 text-center">
        <h3 className="text-3xl font-black text-warm-white mb-4">
          You&apos;re in. Redirecting you to book your call.
        </h3>
        <p className="text-warm-white/60 max-w-md mx-auto leading-relaxed">
          Jonah will walk you through the platform thesis, the Granbury deal specifics,
          and answer every question. Quietly, directly, on a 30-minute call.
        </p>
        <p className="mt-6 text-sm text-warm-white/40">
          If you aren&apos;t redirected in 5 seconds,{' '}
          <a href={CALENDLY_URL} className="text-orange underline">click here</a>.
        </p>
      </div>
    )
  }

  if (submitted === 'not_accredited') {
    return (
      <div className="py-16 text-center max-w-lg mx-auto">
        <h3 className="text-3xl font-black text-warm-white mb-4">
          Thanks for your interest.
        </h3>
        <p className="text-warm-white/60 leading-relaxed">
          Journey.Direct&trade; opportunities under Rule 506(c) are limited to
          accredited investors. We&apos;ll keep you informed of our broader market
          insights and any future opportunities open to a wider audience.
        </p>
        <p className="mt-6 text-sm text-warm-white/40">
          Curious what accredited means? Income above $200k single / $300k joint
          for the last two years, or $1M+ net worth excluding primary residence.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onFinalSubmit)} className="flex flex-col gap-6">
      <div className="w-full bg-warm-white/10 h-px relative">
        <div
          className="absolute top-0 left-0 h-px bg-orange transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-caption uppercase tracking-[0.15em] text-warm-white/40">
        Step {step} of {totalSteps}
      </p>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5"
          >
            <h3 className="text-2xl font-black text-warm-white">
              Tell us who you are
            </h3>
            <Field label="Full name" error={errors.full_name?.message}>
              <input {...register('full_name')} className={inputCls} placeholder="Jane Investor" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input {...register('email')} type="email" className={inputCls} placeholder="you@email.com" />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input {...register('phone')} type="tel" className={inputCls} placeholder="(555) 000-0000" />
            </Field>
            <Field label="State of residence" error={errors.state_code?.message}>
              <select {...register('state_code')} className={inputCls} defaultValue="">
                <option value="" disabled>Select your state</option>
                {US_STATES.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </Field>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5"
          >
            <h3 className="text-2xl font-black text-warm-white">
              Accredited investor status
            </h3>
            <p className="text-sm text-warm-white/60 leading-relaxed">
              Journey.Direct&trade; offerings are made under SEC Rule 506(c).
              Accreditation will be verified independently before any subscription.
              Pick the basis that applies to you.
            </p>
            <RadioOption value="income" register={register('accredited_status')}
              title="Income"
              desc="$200k+ single / $300k+ joint for the last 2 years with reasonable expectation of the same this year."
            />
            <RadioOption value="net_worth" register={register('accredited_status')}
              title="Net worth"
              desc="$1M+ net worth, individually or jointly with spouse, excluding primary residence."
            />
            <RadioOption value="professional" register={register('accredited_status')}
              title="Professional certification"
              desc="Series 7, Series 65, Series 82, or a knowledgeable employee of the fund."
            />
            <RadioOption value="entity" register={register('accredited_status')}
              title="Entity / family office"
              desc="An entity with $5M+ in assets, or all equity owners are accredited."
            />
            <RadioOption value="unsure" register={register('accredited_status')}
              title="I'm not sure"
              desc="Reach out anyway. We can help you determine eligibility."
            />
            <RadioOption value="not_accredited" register={register('accredited_status')}
              title="I'm not accredited"
              desc="Our 506(c) deals aren't available to non-accredited investors, but we'll keep you informed."
            />
            {errors.accredited_status && (
              <p className="text-sm text-orange">Please choose one</p>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5"
          >
            <h3 className="text-2xl font-black text-warm-white">
              Your investment profile
            </h3>
            <p className="text-sm text-warm-white/60 leading-relaxed">
              This helps Jonah prep for your call. Nothing here commits you to anything.
            </p>

            <Field label="Check size you're considering">
              <select {...register('check_size_band')} className={inputCls} defaultValue="">
                <option value="" disabled>Select a range</option>
                <option value="50k_100k">$50,000 - $100,000</option>
                <option value="100k_250k">$100,000 - $250,000</option>
                <option value="250k_500k">$250,000 - $500,000</option>
                <option value="500k_1m">$500,000 - $1,000,000</option>
                <option value="1m_plus">$1,000,000+</option>
              </select>
            </Field>

            <Field label="Investment timeline">
              <select {...register('timeline')} className={inputCls} defaultValue="">
                <option value="" disabled>Select timeline</option>
                <option value="immediate">Ready now</option>
                <option value="30_60_days">30 - 60 days</option>
                <option value="60_90_days">60 - 90 days</option>
                <option value="exploring">Exploring, no timeline</option>
              </select>
            </Field>

            <Field label="Prior real estate investing experience">
              <select {...register('prior_re_experience')} className={inputCls} defaultValue="">
                <option value="" disabled>Select one</option>
                <option value="syndications">Prior syndications / private deals</option>
                <option value="direct_ownership">Direct property ownership</option>
                <option value="reit_only">Public REITs only</option>
                <option value="none">This would be my first</option>
              </select>
            </Field>

            <Field label="Source of investment capital">
              <select {...register('source_of_capital')} className={inputCls} defaultValue="">
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
                {...register('message')}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Specific questions, context on your goals, etc."
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-orange text-sm">{error}</p>
      )}

      <div className="flex gap-3 mt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 py-3 border border-warm-white/20 text-warm-white/70 hover:text-warm-white hover:border-warm-white/40 transition-colors"
          >
            Back
          </button>
        )}
        {step < totalSteps && (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 bg-orange text-warm-white font-bold hover:bg-orange/90 transition-colors"
          >
            Continue
          </button>
        )}
        {step === totalSteps && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 bg-orange text-warm-white font-bold hover:bg-orange/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Request platform overview'}
          </button>
        )}
      </div>

      <p className="text-caption text-warm-white/40 leading-relaxed">
        By submitting, you confirm the information above is accurate. Accredited status
        will be verified independently before any subscription. We do not sell or share
        your information.
      </p>
    </form>
  )
}

const inputCls =
  'w-full bg-warm-white/[0.06] text-warm-white border border-stone/30 ' +
  'rounded-sm px-4 py-3.5 text-body font-normal placeholder:text-stone ' +
  'focus:border-orange focus:outline-none transition-colors'

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-sm font-bold text-warm-white">{label}</label>
      {children}
      {error && <p className="text-sm text-orange">{error}</p>}
    </div>
  )
}

function RadioOption({
  value, register, title, desc,
}: {
  value: string
  register: ReturnType<ReturnType<typeof useForm>['register']>
  title: string
  desc: string
}) {
  return (
    <label className="flex gap-3 p-4 border border-warm-white/10 hover:border-orange/40 transition-colors cursor-pointer">
      <input type="radio" value={value} {...register} className="mt-1 accent-orange" />
      <div className="flex flex-col gap-1">
        <span className="text-warm-white font-bold">{title}</span>
        <span className="text-sm text-warm-white/60 leading-relaxed">{desc}</span>
      </div>
    </label>
  )
}
