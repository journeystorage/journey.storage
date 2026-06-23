'use client'

import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useFocusTrap } from '@/lib/use-focus-trap'

interface LeadCaptureModalProps {
  open: boolean
  onClose: () => void
  redirectUrl: string
}

export default function LeadCaptureModal({
  open,
  onClose,
  redirectUrl,
}: LeadCaptureModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const trapRef = useFocusTrap<HTMLDivElement>(open)

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const close = useCallback(() => {
    setErrors({})
    onClose()
  }, [onClose])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      accredited_investor: String(formData.get('accredited_investor') || '').trim(),
      sms_opt_in: formData.get('sms_opt_in') === 'on',
    }

    // Minimal client-side validation
    const newErrors: Record<string, string> = {}
    if (!data.name) newErrors.name = 'Name is required'
    if (!data.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    setSubmitting(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_source: 'investors-booking',
          ...data,
        }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setSubmitting(false)
      onClose()
      window.open(redirectUrl, '_blank', 'noopener,noreferrer')
    } catch {
      // Keep the modal open and show an error — don't redirect on a lost lead.
      setSubmitting(false)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start md:items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-sm px-5 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Book a call"
      onClick={close}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        ref={trapRef}
        className="relative w-full max-w-[440px] shrink-0 rounded-tl-[24px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px] bg-warm-white p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 text-stone hover:text-black transition-colors duration-150 cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-5 bg-orange" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-orange">
              Journey.Direct
            </span>
          </div>
          <h3 className="text-xl font-black text-black">Get on the early list.</h3>
          <p className="mt-2 text-body-sm text-stone leading-relaxed">
            Tell us a bit about yourself and we&apos;ll set up a call before the
            platform opens to investors.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field
            label="Name"
            name="name"
            placeholder="Your full name"
            required
            error={errors.name}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@email.com"
            required
            error={errors.email}
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            placeholder="(555) 000-0000"
          />
          <Field
            label="Company"
            name="company"
            placeholder="Your company or fund name"
          />

          {/* Accredited investor dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="field-accredited" className="text-body-sm font-bold text-black">
              Are you an accredited investor?
              <span className="text-orange ml-1" aria-hidden="true">*</span>
            </label>
            <select
              id="field-accredited"
              name="accredited_investor"
              required
              defaultValue=""
              className="w-full rounded-sm px-4 py-3.5 text-body font-normal bg-white text-black border border-stone/30 focus:border-orange transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-0 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
              }}
            >
              <option value="" disabled>Please select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not_sure">Not sure</option>
            </select>
          </div>

          {/* SMS opt-in checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="sms_opt_in"
              className="mt-1 h-4 w-4 shrink-0 rounded border-stone/30 accent-orange cursor-pointer"
            />
            <span className="text-[0.7rem] leading-[1.5] text-stone/70">
              I agree to receive occasional texts about new investment
              opportunities and updates from Journey.Direct&trade;. Message and
              data rates may apply. Approx. 4 messages/month.
              Reply STOP at any time.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-sm bg-orange py-3.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? 'Submitting…' : 'Continue to booking →'}
          </button>
          {errors.submit && (
            <p className="text-caption text-[#D94A4A]" role="alert">
              {errors.submit}
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-[0.65rem] text-stone/60 leading-relaxed">
          Your information is only used to prepare for your call. We don&apos;t
          share or sell your data.
        </p>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
}

function Field({ label, name, type = 'text', placeholder, required, error }: FieldProps) {
  const id = `field-${name}`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body-sm font-bold text-black">
        {label}
        {required && (
          <span className="text-orange ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        className={[
          'w-full rounded-sm px-4 py-3.5',
          'text-body font-normal',
          'placeholder:text-stone',
          'bg-white text-black',
          'transition-colors duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-0',
          error
            ? 'border border-[#D94A4A] focus:border-[#D94A4A]'
            : 'border border-stone/30 focus:border-orange',
        ].join(' ')}
      />
      {error && (
        <p className="text-caption text-[#D94A4A]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
