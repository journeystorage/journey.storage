'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { sectionIds, socialUrls } from '@/lib/constants'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const waitlistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  zip: z.string().min(5, 'Please enter a valid ZIP code').max(10),
  phone: z.string().optional(),
  message: z.string().optional(),
})

type WaitlistForm = z.infer<typeof waitlistSchema>

function IconInstagram() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconLinkedin() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const socialLinks = [
  { label: 'Instagram', href: socialUrls.instagram, Icon: IconInstagram },
  { label: 'LinkedIn', href: socialUrls.linkedin, Icon: IconLinkedin },
  { label: 'Facebook', href: socialUrls.facebook, Icon: IconFacebook },
]

export default function Waitlist() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
  })

  const onSubmit = async (data: WaitlistForm) => {
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch { /* Phase 1 */ }
    setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      id={sectionIds.waitlist}
      className="grain relative overflow-hidden bg-black pt-0 pb-20 lg:pt-0 lg:pb-28"
    >
      {/* Warm radial glow behind form */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(232,98,42,0.05), transparent)',
      }} />

      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* Divider */}
        <div className="mb-14 lg:mb-16 h-px bg-gradient-to-r from-transparent via-warm-white/[0.06] to-transparent" />

        <motion.div
          className="text-center"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Join us</span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-warm-white leading-[0.95]">
            Be the first.
          </h2>
          <p className="mx-auto mt-4 max-w-[400px] text-body font-light leading-[1.7] text-warm-white/40">
            Sign up and we&apos;ll let you know when Journey is ready in your
            area. Plus early access and updates.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-[400px]">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input label="Name" placeholder="Your full name" required onDark {...register('name')} error={errors.name?.message} />
                <Input label="Email" type="email" placeholder="you@email.com" required onDark {...register('email')} error={errors.email?.message} />
                <Input label="ZIP code" placeholder="90210" required onDark {...register('zip')} error={errors.zip?.message} />
                <Input label="Phone" type="tel" placeholder="(555) 000-0000" onDark {...register('phone')} error={errors.phone?.message} />
                <p className="-mt-2 text-caption text-warm-white/30">Optional, for SMS updates</p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="waitlist-message" className="text-body-sm font-bold text-warm-white">Message</label>
                  <textarea
                    id="waitlist-message"
                    rows={3}
                    placeholder="Tell us who you are and why you'd like Journey in your city..."
                    className="w-full rounded-sm px-4 py-3.5 text-body font-normal placeholder:text-stone transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-0 bg-white/[0.06] text-warm-white border border-stone/30 focus:border-orange resize-none"
                    {...register('message')}
                  />
                </div>
                <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-3 w-full">
                  {isSubmitting ? 'Submitting...' : 'Join the waitlist'}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="py-16 text-center"
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-3xl font-black text-warm-white">
                  You&apos;re on the list.
                </h3>
                <p className="mt-3 text-lg font-light text-warm-white/50">
                  We&apos;ll be in touch soon.
                </p>
                <p className="mt-6 text-subhead font-light italic text-stone">
                  Welcome to the journey.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Social */}
        <motion.div
          className="mt-12 text-center"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, ease, delay: 0.4 }}
        >
          <p className="text-caption uppercase tracking-[0.15em] text-warm-white/30">Follow the journey</p>
          <div className="mt-4 flex justify-center gap-5">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="text-warm-white/30 transition-colors duration-200 hover:text-orange">
                <Icon />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
