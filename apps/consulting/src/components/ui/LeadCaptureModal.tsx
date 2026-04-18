'use client'

import { useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import Input from './Input'

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
})

type LeadForm = z.infer<typeof leadSchema>

export type FormSource = 'consulting-scout' | 'consulting-pursuit' | 'consulting-booking'

interface LeadCaptureModalProps {
  open: boolean
  onClose: () => void
  formSource: FormSource
  tierName: string
  tierDetail: string
  redirectUrl: string
  webhookUrl?: string
}

const WEBHOOK_URL = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL || ''

export default function LeadCaptureModal({
  open,
  onClose,
  formSource,
  tierName,
  tierDetail,
  redirectUrl,
  webhookUrl,
}: LeadCaptureModalProps) {
  const prefersReducedMotion = useReducedMotion()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const onSubmit = async (data: LeadForm) => {
    const url = webhookUrl || WEBHOOK_URL
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_source: formSource,
            ...data,
          }),
        })
      } catch {
        // Non-blocking — redirect regardless
      }
    }
    reset()
    onClose()
    window.open(redirectUrl, '_blank', 'noopener,noreferrer')
  }

  const close = useCallback(() => {
    reset()
    onClose()
  }, [onClose, reset])

  const isBooking = formSource === 'consulting-booking'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start md:items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-sm px-5 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-[440px] shrink-0 rounded-tl-[24px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px] bg-warm-white p-8 md:p-10"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
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
                  {tierName}
                </span>
              </div>
              <h3 className="text-xl font-black text-black">
                {isBooking ? 'One last step.' : 'Almost there.'}
              </h3>
              <p className="mt-2 text-body-sm text-stone leading-relaxed">
                {isBooking
                  ? 'Tell us a bit about yourself so Jonah can prepare for your call.'
                  : (
                    <>
                      You&apos;re about to start with <span className="font-bold text-black">{tierDetail}</span>. Let us know who you are.
                    </>
                  )
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label="Name"
                placeholder="Your full name"
                required
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@email.com"
                required
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="(555) 000-0000"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Input
                label="Company"
                placeholder="Your company or fund name"
                {...register('company')}
                error={errors.company?.message}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-sm bg-orange py-3.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting
                  ? 'Submitting...'
                  : isBooking
                    ? 'Continue to booking \u2192'
                    : 'Continue to checkout \u2192'
                }
              </button>
            </form>

            <p className="mt-4 text-center text-[0.65rem] text-stone/60 leading-relaxed">
              Your information is only used to prepare for your engagement. We don&apos;t share or sell your data.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
