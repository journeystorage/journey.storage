'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

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

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % moments.length)
  }, [])

  // Auto-rotate every 4s
  useEffect(() => {
    if (paused || prefersReducedMotion) return
    intervalRef.current = setInterval(next, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, prefersReducedMotion, next])

  const goTo = (i: number) => {
    setActive(i)
    // Reset timer when manually selecting
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!paused && !prefersReducedMotion) {
      intervalRef.current = setInterval(next, 4000)
    }
  }

  // Helpers: which indices are "prev" and "next" (for the 3-card fan)
  const prevIdx = (active - 1 + moments.length) % moments.length
  const nextIdx = (active + 1) % moments.length

  return (
    <section
      id={sectionIds.lifeMoments}
      className="relative bg-warm-white pt-16 pb-20 lg:pt-20 lg:pb-28 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ghost watermark — large, spanning behind header + subtitle area */}
      <div className="pointer-events-none absolute inset-x-0 top-10 md:top-8 lg:top-6 z-0 select-none overflow-hidden flex justify-center" aria-hidden="true">
        <span className="text-[7rem] md:text-[12rem] lg:text-[17rem] font-black uppercase leading-none text-black/[0.04] whitespace-nowrap">
          JOURNEYS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.95]">
            Journeys need space.
          </h2>
        </div>

        {/* Active card text — crossfades with slide */}
        <div className="text-center mb-10 lg:mb-14 min-h-[56px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg md:text-xl font-bold text-black">
                {moments[active].question}
              </p>
              <p className="mt-1 text-body-sm text-stone">
                {moments[active].answer}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel — Nubank style: 3 visible cards, center one elevated */}
        <div className="relative flex items-center justify-center h-[420px] md:h-[480px] lg:h-[540px]">
          {moments.map((moment, i) => {
            let position: 'left' | 'center' | 'right' | 'hidden' = 'hidden'
            if (i === active) position = 'center'
            else if (i === prevIdx) position = 'left'
            else if (i === nextIdx) position = 'right'

            const transforms = {
              center: {
                x: 0,
                scale: 1,
                zIndex: 30,
                opacity: 1,
                rotateY: 0,
              },
              left: {
                x: '-55%',
                scale: 0.82,
                zIndex: 20,
                opacity: 1,
                rotateY: 0,
              },
              right: {
                x: '55%',
                scale: 0.82,
                zIndex: 20,
                opacity: 1,
                rotateY: 0,
              },
              hidden: {
                x: 0,
                scale: 0.7,
                zIndex: 10,
                opacity: 0,
                rotateY: 0,
              },
            }

            const t = transforms[position]
            const isCenter = position === 'center'

            return (
              <motion.div
                key={i}
                className="absolute w-[260px] md:w-[300px] lg:w-[340px] cursor-pointer"
                style={{ zIndex: t.zIndex }}
                animate={{
                  x: t.x,
                  scale: t.scale,
                  opacity: t.opacity,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => { if (!isCenter) goTo(i) }}
              >
                <div
                  className={`relative overflow-hidden rounded-[24px] shadow-lg transition-shadow duration-300 ${isCenter ? 'shadow-2xl' : ''}`}
                >
                  <div className="aspect-[3/4]">
                    <Image
                      src={moment.image}
                      alt={moment.alt}
                      fill
                      className={`object-cover ${moment.objectPosition}`}
                      sizes="340px"
                    />
                    {/* Overlay: strong on background cards, minimal on center */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isCenter
                          ? 'bg-black/10'
                          : 'bg-black/40'
                      }`}
                    />
                    {/* Gradient at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Title on the card */}
                  <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 z-10">
                    <p className={`text-base md:text-lg font-bold leading-tight transition-opacity duration-300 ${
                      isCenter ? 'text-warm-white' : 'text-warm-white/60'
                    }`}>
                      {moment.question}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Dots indicator + pause */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {moments.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === active
                  ? 'w-8 bg-black'
                  : 'w-1.5 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
