'use client'

import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { sectionIds } from '@/lib/constants'
import USMap from '@/components/map/USMap'
import MapPin, { MapPinPulse } from '@/components/map/MapPin'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type PinSize = 'sm' | 'md' | 'lg'
const pins: { x: number; y: number; size: PinSize }[] = [
  /* ── Large (active, pulsing) — 4 initial markets ── */
  { x: 48, y: 66, size: 'lg' },  // Dallas–Fort Worth
  { x: 75, y: 57, size: 'lg' },  // Charlotte / Carolinas
  { x: 14, y: 15, size: 'lg' },  // Pacific Northwest
  { x: 47, y: 56, size: 'lg' },  // Oklahoma City / Central
  /* ── Medium — planned metro areas ── */
  { x: 14, y: 43, size: 'md' },  // Northern California
  { x: 16, y: 60, size: 'md' },  // Southern California
  { x: 23, y: 35, size: 'md' },  // Salt Lake City
  { x: 35, y: 40, size: 'md' },  // Denver
  { x: 52, y: 42, size: 'md' },  // Kansas City
  { x: 54, y: 19, size: 'md' },  // Minneapolis
  { x: 64, y: 31, size: 'md' },  // Chicago area
  { x: 70, y: 29, size: 'md' },  // Detroit / Great Lakes
  { x: 71, y: 38, size: 'md' },  // Columbus / Ohio
  { x: 65, y: 53, size: 'md' },  // Nashville / Tennessee
  { x: 69, y: 63, size: 'md' },  // Atlanta / Georgia
  { x: 80, y: 78, size: 'md' },  // Orlando / Florida
  { x: 81, y: 42, size: 'md' },  // DC / Mid-Atlantic
  { x: 85, y: 35, size: 'md' },  // NYC area
  { x: 50, y: 77, size: 'md' },  // South Texas / Houston
  { x: 30, y: 27, size: 'md' },  // Wyoming / Mountain West
  /* ── Small (atmospheric texture) ── */
  { x: 13, y: 22, size: 'sm' },  // Oregon
  { x: 18, y: 38, size: 'sm' },  // Nevada
  { x: 23, y: 64, size: 'sm' },  // Arizona
  { x: 41, y: 44, size: 'sm' },  // Colorado–Kansas border
  { x: 54, y: 32, size: 'sm' },  // Iowa / Nebraska
  { x: 59, y: 44, size: 'sm' },  // Missouri
  { x: 67, y: 45, size: 'sm' },  // Kentucky / Indiana
  { x: 74, y: 33, size: 'sm' },  // Ohio
  { x: 80, y: 48, size: 'sm' },  // Virginia
  { x: 87, y: 30, size: 'sm' },  // New England
  { x: 50, y: 52, size: 'sm' },  // Oklahoma
  { x: 63, y: 65, size: 'sm' },  // Tennessee / Alabama
]

const modalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().optional(),
})
type ModalForm = z.infer<typeof modalSchema>

export default function LocationsMap() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  const [zip, setZip] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ModalForm>({ resolver: zodResolver(modalSchema) })

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const handleZipSubmit = (e: FormEvent) => { e.preventDefault(); if (zip.trim()) setShowModal(true) }

  const onModalSubmit = async (data: ModalForm) => {
    setError(false)
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form_source: 'website-location', name: data.name, email: data.email, zip, message: data.message }) })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setShowModal(false); setSubmitted(true)
    } catch {
      // Keep the modal open and surface the error — never a false success.
      setError(true)
    }
  }

  const closeModal = useCallback(() => setShowModal(false), [])

  return (
    <>
      <section ref={ref} id={sectionIds.locations} className="relative overflow-hidden bg-black pt-0 pb-10 lg:pt-0 lg:pb-14">
        <div className="relative mx-3 md:mx-6 lg:mx-10 rounded-[24px] md:rounded-[32px] bg-charcoal/40 pt-14 pb-14 lg:pt-16 lg:pb-20 overflow-hidden">


        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,98,42,0.03), transparent)',
        }} />

        <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">

          <motion.div
            className="text-center"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Locations</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
              Finding home.
            </h2>
            <p className="mx-auto mt-3 max-w-[440px] text-lg font-light leading-[1.8] text-warm-white/40">
              We&apos;re building something new across America.<br className="hidden lg:block" /> Our first facilities open soon.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-10 max-w-[850px]"
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={isInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
          >
            <div className="relative overflow-hidden">
              <USMap />
              <div className="absolute inset-0 overflow-hidden">
                {pins.map((pin, i) => (
                  <MapPin key={i} x={pin.x} y={pin.y} size={pin.size} delay={0.5 + i * 0.05} isInView={isInView} />
                ))}
                {pins.filter(p => p.size === 'lg').map((pin, i) => (
                  <MapPinPulse key={`p-${i}`} x={pin.x} y={pin.y} isInView={isInView} />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, ease, delay: 0.7 }}
          >
            <h3 className="text-xl font-bold text-warm-white">Want Journey in your city?</h3>
            {submitted ? (
              <p className="mt-4 text-body-sm text-warm-white/40">We&apos;ll let you know the moment Journey arrives near you.</p>
            ) : (
              <>
                <form onSubmit={handleZipSubmit} className="mx-auto mt-5 flex max-w-xs flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} required aria-label="ZIP code"
                    className="w-full rounded-sm bg-warm-white/[0.06] px-4 py-3 text-body-sm text-warm-white placeholder:text-warm-white/30 border border-warm-white/[0.08] focus:border-orange focus-visible:outline-none transition-colors duration-150 sm:w-[180px]" />
                  <Button type="submit" variant="primary">Notify me</Button>
                </form>
                <p className="mt-3 text-caption text-warm-white/30">We&apos;ll let you know the moment Journey arrives near you.</p>
              </>
            )}
          </motion.div>
        </div>
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={closeModal}>
            <motion.div className="relative w-full max-w-[420px] rounded-tl-[24px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px] bg-warm-white p-8 md:p-10"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.3, ease: 'easeOut' as const }} onClick={(e) => e.stopPropagation()}>
              <button onClick={closeModal} className="absolute top-4 right-4 text-stone hover:text-black transition-colors cursor-pointer" aria-label="Close"><X size={18} /></button>
              <h3 className="text-xl font-black text-black">Almost there.</h3>
              <p className="mt-2 text-body-sm text-stone">We&apos;ll notify you when Journey arrives near <span className="font-bold text-black">{zip}</span>.</p>
              <form onSubmit={handleSubmit(onModalSubmit)} className="mt-6 flex flex-col gap-4">
                <Input label="Name" placeholder="Your full name" required {...register('name')} error={errors.name?.message} />
                <Input label="Email" type="email" placeholder="you@email.com" required {...register('email')} error={errors.email?.message} />
                <div className="flex flex-col gap-2">
                  <label htmlFor="modal-message" className="text-body-sm font-bold text-black">Message</label>
                  <textarea
                    id="modal-message"
                    rows={3}
                    placeholder="Tell us who you are and why you'd like Journey in your city..."
                    className="w-full rounded-sm px-4 py-3.5 text-body font-normal placeholder:text-stone transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-0 bg-white text-black border border-stone/30 focus:border-orange resize-none"
                    {...register('message')}
                  />
                </div>
                <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-2 w-full">{isSubmitting ? 'Submitting...' : 'Notify me'}</Button>
                {error && (
                  <p className="text-caption text-[#D94A4A]" role="alert">
                    Something went wrong. Please try again, or email hello@journey.storage.
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
