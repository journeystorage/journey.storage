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

const pins: { x: number; y: number; active?: boolean }[] = [
  { x: 28, y: 62, active: true }, { x: 78, y: 48, active: true }, { x: 18, y: 38, active: true },
  { x: 15, y: 30 }, { x: 22, y: 42 }, { x: 25, y: 50 }, { x: 32, y: 35 }, { x: 38, y: 45 },
  { x: 42, y: 55 }, { x: 48, y: 38 }, { x: 52, y: 48 }, { x: 55, y: 32 }, { x: 60, y: 42 },
  { x: 65, y: 52 }, { x: 72, y: 38 }, { x: 75, y: 30 }, { x: 80, y: 35 }, { x: 68, y: 58 },
  { x: 35, y: 28 }, { x: 45, y: 28 },
  { x: 52, y: 72, active: true }, { x: 56, y: 76 }, { x: 50, y: 78 }, { x: 58, y: 70 },
]

const modalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ModalForm>({ resolver: zodResolver(modalSchema) })

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const handleZipSubmit = (e: FormEvent) => { e.preventDefault(); if (zip.trim()) setShowModal(true) }

  const onModalSubmit = async (data: ModalForm) => {
    try { await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, email: data.email, zip }) }) } catch { /* Phase 1 */ }
    setShowModal(false); setSubmitted(true)
  }

  const closeModal = useCallback(() => setShowModal(false), [])

  return (
    <>
      <section ref={ref} id={sectionIds.locations} className="relative overflow-hidden bg-black pt-0 pb-10 lg:pt-0 lg:pb-14">
        <div className="relative mx-3 md:mx-6 lg:mx-10 rounded-[24px] md:rounded-[32px] bg-charcoal/40 pt-14 pb-14 lg:pt-16 lg:pb-20 overflow-hidden">

        {/* Ghost text — like BeJet map section */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none" aria-hidden="true">
          <span className="text-[10rem] md:text-[16rem] lg:text-[24rem] font-black uppercase leading-none text-warm-white/[0.015] whitespace-nowrap">
            USA
          </span>
        </div>

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
            <div className="relative">
              <USMap />
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                {pins.map((pin, i) => (
                  <MapPin key={i} x={pin.x} y={pin.y} active={pin.active} delay={0.5 + i * 0.05} isInView={isInView} />
                ))}
                {pins.filter(p => p.active).map((pin, i) => (
                  <MapPinPulse key={`p-${i}`} x={pin.x} y={pin.y} isInView={isInView} />
                ))}
              </svg>
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
                <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-2 w-full">{isSubmitting ? 'Submitting...' : 'Notify me'}</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
