'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { sectionIds } from '@/lib/constants'

/* ── Theme per moment ── */
const themes = [
  { accent: '#4A90D9', textOnBg: 'text-white', numOnBg: 'text-white/[0.08]', subOnBg: 'text-white/50' },
  { accent: '#7AAF6E', textOnBg: 'text-white', numOnBg: 'text-white/[0.08]', subOnBg: 'text-white/50' },
  { accent: '#E8C547', textOnBg: 'text-black', numOnBg: 'text-black/[0.06]', subOnBg: 'text-black/45' },
  { accent: '#D4956A', textOnBg: 'text-white', numOnBg: 'text-white/[0.08]', subOnBg: 'text-white/50' },
]

const moments = [
  {
    image: '/images/moments/home-moments-moving-v2.webp',
    alt: 'A person packing belongings during a home move',
    question: 'Moving to a new home?',
    answer: "You're out before you're in. We hold the middle.",
    objectPosition: 'object-center',
  },
  {
    image: '/images/moments/home-moments-newchapter-v2.webp',
    alt: 'A person looking forward at a new beginning',
    question: 'Starting a new chapter?',
    answer: "New beginnings don't mean leaving everything behind.",
    objectPosition: 'object-top',
  },
  {
    image: '/images/moments/home-moments-business-v2.webp',
    alt: 'A small business workspace overflowing with inventory',
    question: 'Business outgrowing its walls?',
    answer: "Your growth shouldn't wait for square footage.",
    objectPosition: 'object-center',
  },
  {
    image: '/images/moments/home-moments-cityliving-v2.webp',
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

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % moments.length)
  }, [])

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + moments.length) % moments.length)
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

  // Swipe support
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) { next() } else { prev() }
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!paused && !prefersReducedMotion) {
      intervalRef.current = setInterval(next, 4000)
    }
  }, [next, prev, paused, prefersReducedMotion])

  const prevIdx = (active - 1 + moments.length) % moments.length
  const nextIdx = (active + 1) % moments.length

  const anim = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: isInView ? { opacity: 1, y: 0 } : undefined,
          transition: { duration: 0.5, delay, ease },
        }

  return (
    <section
      ref={sectionRef}
      id={sectionIds.lifeMoments}
      className="relative bg-black py-10 md:py-14 lg:py-16 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Floating warm-white container */}
      <div
        className="relative mx-3 md:mx-6 lg:mx-10 rounded-[24px] md:rounded-[32px] pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20 overflow-hidden"
        style={{ backgroundColor: '#F5F0E8' }}
      >
        {/* Ghost watermark */}
        <div className="pointer-events-none absolute inset-x-0 top-4 md:top-2 lg:top-0 z-[1] select-none overflow-hidden flex justify-center" aria-hidden="true">
          <span className="text-[7rem] md:text-[12rem] lg:text-[17rem] font-black uppercase leading-none text-black/[0.03] whitespace-nowrap">
            JOURNEYS
          </span>
        </div>

        <div className="relative z-[2] mx-auto max-w-content px-5 md:px-8 lg:px-16">
          {/* Header */}
          <motion.div className="text-center mb-10 lg:mb-14" {...anim(0)}>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Life moments</span>
              <div className="h-px w-8 bg-orange" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.95]">
              Journeys need space.
            </h2>
          </motion.div>

          {/* ── Mobile / Tablet: horizontal collapse/expand cards ── */}
          <div className="lg:hidden flex items-stretch gap-2 mb-6 h-[106px] md:h-[114px]">
            {moments.map((moment, i) => {
              const isActive = i === active
              const theme = themes[i]
              return (
                <motion.button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative text-left rounded-[14px] md:rounded-[16px] cursor-pointer overflow-hidden transition-shadow duration-300"
                  style={{ backgroundColor: isActive ? theme.accent : 'rgba(0,0,0,0.04)' }}
                  animate={{ flex: isActive ? '1 1 0%' : '0 0 44px' }}
                  transition={{ duration: 0.4, ease }}
                >
                  {/* Ghost number — only on active */}
                  {isActive && (
                    <motion.span
                      className={`absolute -right-1 -bottom-2 text-[4rem] md:text-[4.5rem] font-black leading-none select-none pointer-events-none ${theme.numOnBg}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </motion.span>
                  )}

                  {isActive ? (
                    <motion.div
                      className="relative z-[1] px-4 py-4 md:px-5 md:py-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.15, ease }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: theme.textOnBg === 'text-white' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                          }}
                        />
                        <span className={`text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-[0.25em] ${
                          theme.textOnBg === 'text-white' ? 'text-white/40' : 'text-black/35'
                        }`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className={`text-sm md:text-base font-black leading-snug ${theme.textOnBg}`}>
                        {moment.question}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="relative z-[1] flex items-center justify-center h-full">
                      <span
                        className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-black/20"
                        style={{ writingMode: 'vertical-lr' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* ── Desktop: colored tabs left + carousel right ── */}
          <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-10 xl:gap-14 lg:items-center">
            {/* Left: numbered moment tabs */}
            <div className="hidden lg:block">
              <div className="flex flex-col gap-2">
                {moments.map((moment, i) => {
                  const isActive = i === active
                  const theme = themes[i]
                  return (
                    <motion.button
                      key={i}
                      onClick={() => goTo(i)}
                      className="group relative w-full text-left rounded-[16px] cursor-pointer overflow-hidden transition-shadow duration-300"
                      style={{ backgroundColor: isActive ? theme.accent : 'transparent' }}
                      {...anim(0.15 + i * 0.08)}
                    >
                      {/* Ghost watermark number — only on active */}
                      {isActive && (
                        <motion.span
                          className={`absolute -right-3 -bottom-4 text-[5.5rem] font-black leading-none select-none pointer-events-none ${theme.numOnBg}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease }}
                          aria-hidden="true"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </motion.span>
                      )}

                      <div className={`relative z-[1] transition-all duration-300 ${
                        isActive ? 'py-6 px-8' : 'py-5 px-8 hover:bg-black/[0.04]'
                      }`}>
                        {/* Number + accent dot */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            className="h-2 w-2 rounded-full flex-shrink-0 transition-all duration-300"
                            style={{
                              backgroundColor: isActive
                                ? (theme.textOnBg === 'text-white' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)')
                                : theme.accent,
                              transform: isActive ? 'scale(1)' : 'scale(0.6)',
                              opacity: isActive ? 1 : 0.4,
                            }}
                          />
                          <span className={`text-[0.6rem] font-bold uppercase tracking-[0.3em] transition-colors duration-300 ${
                            isActive
                              ? theme.textOnBg === 'text-white' ? 'text-white/40' : 'text-black/35'
                              : 'text-black/20'
                          }`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Question */}
                        <p className={`text-xl font-black leading-snug transition-colors duration-300 ${
                          isActive ? theme.textOnBg : 'text-black/35 group-hover:text-black/55'
                        }`}>
                          {moment.question}
                        </p>

                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Right: carousel */}
            <div
              className="relative flex items-center justify-center h-[420px] md:h-[480px] lg:h-[540px] touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
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
                    className="absolute w-[280px] md:w-[320px] lg:w-[350px] cursor-pointer"
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
                          sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 350px"
                        />
                        <div
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            isCenter ? 'bg-transparent' : 'bg-black/50'
                          }`}
                        />
                        <div className={`absolute inset-0 transition-opacity duration-500 ${
                          isCenter
                            ? 'bg-gradient-to-t from-black/80 via-black/25 to-transparent'
                            : 'bg-gradient-to-t from-black/70 via-black/30 to-black/10'
                        }`} />
                        {isCenter && (
                          <motion.div
                            className="absolute inset-0 mix-blend-soft-light"
                            style={{ backgroundColor: themes[i].accent }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            transition={{ duration: 0.6 }}
                          />
                        )}
                      </div>

                      {/* Body text — only on center card */}
                      {isCenter && (
                        <motion.div
                          className="absolute bottom-0 inset-x-0 z-10 px-5 pb-5 md:px-6 md:pb-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2, ease }}
                        >
                          <motion.div
                            className="h-[2px] w-6 rounded-full mb-3"
                            style={{ backgroundColor: themes[i].accent }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, delay: 0.35, ease }}
                          />
                          <p className="text-[0.8rem] md:text-[0.9rem] font-normal leading-relaxed tracking-[-0.01em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            {moment.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
