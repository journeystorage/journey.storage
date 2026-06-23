'use client'

import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { X } from 'lucide-react'

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Reset state shortly after close so it's fresh on next open
  useEffect(() => {
    if (open) return
    const t = setTimeout(() => {
      setSubmitted(false)
      setErrors({})
    }, 300)
    return () => clearTimeout(t)
  }, [open])

  const close = useCallback(() => {
    setErrors({})
    onClose()
  }, [onClose])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      full_name: String(formData.get('full_name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || '').trim(),
    }

    const newErrors: Record<string, string> = {}
    if (!data.full_name) newErrors.full_name = 'Name is required'
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
      const res = await fetch('/api/investor-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_source: 'investors-contact', ...data }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      if (typeof window !== 'undefined') {
        const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
        if (Array.isArray(dl)) {
          dl.push({ event: 'lead_submitted', form_source: 'investors-contact' })
        }
      }
      setSubmitting(false)
      setSubmitted(true)
    } catch {
      // Keep the form open and surface the error — never a false success.
      setSubmitting(false)
      setErrors({ submit: 'Something went wrong. Please try again, or email us directly.' })
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start md:items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-sm px-5 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Contact us"
      onClick={close}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
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

        {submitted ? (
          /* ── Success state ── */
          <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-5 bg-orange" />
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-orange">
                Journey.Direct
              </span>
            </div>
            <h3 className="text-xl font-black text-black">Thanks — we&apos;ll be in touch.</h3>
            <p className="mt-2 text-body-sm text-stone leading-relaxed">
              Your message is in. A member of our team will reach out shortly to
              the email you provided.
            </p>
            <button
              onClick={close}
              className="mt-6 w-full rounded-sm bg-orange py-3.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-5 bg-orange" />
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-orange">
                  Journey.Direct
                </span>
              </div>
              <h3 className="text-xl font-black text-black">Let&apos;s talk.</h3>
              <p className="mt-2 text-body-sm text-stone leading-relaxed">
                Tell us a bit about you and what you&apos;re looking for, and
                we&apos;ll reach out to start the conversation.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Honeypot — hidden from people; bots that fill it are dropped server-side */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <Field
                label="Name"
                name="full_name"
                placeholder="Your full name"
                required
                error={errors.full_name}
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

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="field-message" className="text-body-sm font-bold text-black">
                  How can we help?
                </label>
                <textarea
                  id="field-message"
                  name="message"
                  rows={4}
                  placeholder="A sentence or two about what you're looking for."
                  className="w-full resize-none rounded-sm px-4 py-3.5 text-body font-normal placeholder:text-stone bg-white text-black border border-stone/30 focus:border-orange transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-0"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-sm bg-orange py-3.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? 'Sending…' : 'Send message'}
              </button>
              {errors.submit && (
                <p className="text-caption text-[#D94A4A]" role="alert">
                  {errors.submit}
                </p>
              )}
            </form>

            <p className="mt-4 text-center text-[0.65rem] text-stone/60 leading-relaxed">
              Your information is only used to get in touch. We don&apos;t share or
              sell your data.
            </p>
          </>
        )}
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
