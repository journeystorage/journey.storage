'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

const themeColors = [
  { bg: 'bg-terracotta', dot: 'bg-terracotta', accent: '#D4956A' },
  { bg: 'bg-sunlight', dot: 'bg-sunlight', accent: '#E8C547' },
  { bg: 'bg-sage-green', dot: 'bg-sage-green', accent: '#7AAF6E' },
  { bg: 'bg-sky-blue', dot: 'bg-sky-blue', accent: '#4A90D9' },
]

const moments = [
  {
    image: '/images/moments/home-moments-moving.jpg',
    alt: 'A person packing belongings during a home move',
    question: 'Moving to a new home?',
    answer: "You're out before you're in. We hold the middle.",
    objectPosition: 'object-center',
  },
  {
    image: '/images/moments/home-moments-newchapter.jpg',
    alt: 'A person looking forward at a new beginning',
    question: 'Starting a new chapter?',
    answer: "New beginnings don't mean leaving everything behind.",
    objectPosition: 'object-top',
  },
  {
    image: '/images/moments/home-moments-business.jpg',
    alt: 'A small business workspace overflowing with inventory',
    question: 'Business outgrowing its walls?',
    answer: "Your growth shouldn't wait for square footage.",
    objectPosition: 'object-center',
  },
  {
    image: '/images/moments/home-moments-cityliving.jpg',
    alt: 'A cozy but compact city apartment',
    question: 'Living in the city?',
    answer: "The extra room your apartment doesn't have.",
    objectPosition: 'object-center',
  },
]

export default function LifeMoments() {
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const ease = [0.22, 1, 0.36, 1] as const
  const theme = themeColors[active]

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % moments.length)
  }, [])

  useEffect(() => {
    if (paused || prefersReducedMotion) return
    intervalRef.current = setInterval(next, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, prefersReducedMotion, next])

  const goTo = (i: number) => {
    setActive(i)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!paused && !prefersReducedMotion) {
      intervalRef.current = setInterval(next, 4000)
    }
  }

  const prevIdx = (active - 1 + moments.length) % moments.length
  const nextIdx = (active + 1) % moments.length

  return (
    <section
      ref={sectionRef}
      id={sectionIds.lifeMoments}
      className="relative bg-black py-10 md:py-14 lg:py-16 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Floating container */}
      <div
        className="relative mx-3 md:mx-6 lg:mx-10 rounded-[24px] md:rounded-[32px] pt-20 pb-10 md:pt-24 md:pb-14 lg:pt-28 lg:pb-16 overflow-hidden"
        style={{ backgroundColor: '#F5F0E8' }}
      >
{/* Background kept solid warm-white — no gradient */}

        {/* Ghost watermark */}
        <div className="pointer-events-none absolute inset-x-0 top-4 md:top-2 lg:top-0 z-[1] select-none overflow-hidden flex justify-center" aria-hidden="true">
          <span className="text-[7rem] md:text-[12rem] lg:text-[17rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap">
            JOURNEYS
          </span>
        </div>

        <div className="relative z-[2] mx-auto max-w-content px-5 md:px-8 lg:px-16">
          {/* Header */}
          <motion.div
            className="text-center mb-14 lg:mb-18"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Life moments</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.95]">
              Journeys need space.
            </h2>
          </motion.div>

          {/* Layout: text left + carousel right */}
          <div className="lg:grid lg:grid-cols-[1fr_1.6fr] lg:gap-12 lg:items-center">
            {/* Left: active moment text — desktop only */}
            <div className="hidden lg:block py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <motion.div
                    className={`h-1 w-10 rounded-full mb-5 ${theme.bg}`}
                    layoutId="accent-bar"
                    transition={{ duration: 0.4, ease }}
                  />
                  <p className="text-3xl xl:text-4xl font-black text-black leading-snug">
                    {moments[active].question}
                  </p>
                  <p className="mt-4 text-lg leading-[1.7] text-stone">
                    {moments[active].answer}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center gap-3">
                {moments.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === active
                        ? `w-8 ${themeColors[i].dot}`
                        : 'w-1.5 bg-black/15 hover:bg-black/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: carousel */}
            <div className="relative flex items-center justify-center h-[420px] md:h-[480px] lg:h-[560px]">
              {moments.map((moment, i) => {
                let position: 'left' | 'center' | 'right' | 'hidden' = 'hidden'
                if (i === active) position = 'center'
                else if (i === prevIdx) position = 'left'
                else if (i === nextIdx) position = 'right'

                const transforms = {
                  center: { x: 0, scale: 1, zIndex: 30, opacity: 1 },
                  left: { x: '-45%', scale: 0.85, zIndex: 20, opacity: 0.7 },
                  right: { x: '45%', scale: 0.85, zIndex: 20, opacity: 0.7 },
                  hidden: { x: 0, scale: 0.7, zIndex: 10, opacity: 0 },
                }

                const t = transforms[position]
                const isCenter = position === 'center'

                return (
                  <motion.div
                    key={i}
                    className="absolute w-[280px] md:w-[320px] lg:w-[360px] cursor-pointer"
                    style={{ zIndex: t.zIndex }}
                    animate={{
                      x: t.x,
                      scale: t.scale,
                      opacity: t.opacity,
                    }}
                    transition={{ duration: 0.6, ease }}
                    onClick={() => { if (!isCenter) goTo(i) }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[20px] transition-shadow duration-500 ${
                        isCenter ? 'shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)]' : 'shadow-lg'
                      }`}
                    >
                      <div className="aspect-[3/4]">
                        <Image
                          src={moment.image}
                          alt={moment.alt}
                          fill
                          className={`object-cover ${moment.objectPosition}`}
                          sizes="360px"
                        />
                        <div
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            isCenter ? 'bg-black/5' : 'bg-black/35'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        {isCenter && (
                          <motion.div
                            className="absolute inset-0 mix-blend-soft-light"
                            style={{ backgroundColor: themeColors[i].accent }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            transition={{ duration: 0.6 }}
                          />
                        )}
                      </div>

                      <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 z-10">
                        <p className={`text-base md:text-lg font-bold leading-tight transition-opacity duration-300 ${
                          isCenter ? 'text-warm-white' : 'text-warm-white/50'
                        }`}>
                          {moment.question}
                        </p>
                        {isCenter && (
                          <motion.p
                            className="mt-1.5 text-sm text-warm-white/70 leading-snug"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            {moment.answer}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Dots — mobile only */}
          <div className="mt-8 flex items-center justify-center gap-3 lg:hidden">
            {moments.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === active
                    ? `w-8 ${themeColors[i].dot}`
                    : 'w-1.5 bg-black/15 hover:bg-black/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
