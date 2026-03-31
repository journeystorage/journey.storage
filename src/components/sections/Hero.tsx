'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { sectionIds } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const [showIndicator, setShowIndicator] = useState(true)

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], [0, 120])
  const parallaxStyle = prefersReducedMotion ? {} : { y: bgY }

  useEffect(() => {
    const onScroll = () => setShowIndicator(window.scrollY < 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
        }

  return (
    <section id={sectionIds.hero} className="grain relative h-screen min-h-[700px] overflow-hidden bg-black">
      <motion.div className="absolute inset-0" style={parallaxStyle}>
        <Image
          src="/images/hero/home-hero-bg.jpg"
          alt="A woman standing at the threshold between her apartment and a modern storage facility"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 max-lg:hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent lg:hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Ghost watermark */}
      <div className="pointer-events-none absolute inset-0 z-[3] flex items-center overflow-hidden select-none" aria-hidden="true">
        <span className="ml-[5%] text-[12rem] md:text-[18rem] lg:text-[28rem] font-black uppercase leading-none text-warm-white/[0.02]">
          SPACE
        </span>
      </div>

      {/* Decorative rings */}
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] z-[3] hidden lg:block" aria-hidden="true">
        <div className="h-[600px] w-[600px] rounded-full border border-warm-white/[0.04]" />
        <div className="absolute inset-[80px] rounded-full border border-orange/[0.06]" />
        <div className="absolute inset-[160px] rounded-full border border-warm-white/[0.03]" />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] hidden opacity-[0.06] lg:block"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5F0E8 0.7px, transparent 0.7px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end pb-[14vh] lg:items-center lg:pb-0">
        <div className="mx-auto w-full max-w-content px-5 md:px-8 lg:px-16">
          <div className="max-w-[750px]">
            <motion.div className="mb-6 flex items-center gap-3" {...fadeUp(0.1)}>
              <div className="h-px w-8 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">
                Journey.Storage&trade;
              </span>
            </motion.div>

            {/* H1 — BIGGER: 4rem mobile → 9rem xl */}
            <motion.h1
              className="text-[3.5rem] leading-[0.86] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[9rem] font-black uppercase text-warm-white"
              {...fadeUp(0.2)}
            >
              Space to
              <br />
              move on.
            </motion.h1>

            <motion.p
              className="mt-8 max-w-[440px] text-xl font-light leading-[1.7] text-warm-white/70"
              {...fadeUp(0.45)}
            >
              A new kind of storage company. Built for people in motion,
              not for boxes sitting still.
            </motion.p>

            <motion.div className="mt-12" {...fadeUp(0.65)}>
              <Button
                variant="primary"
                onClick={() => scrollToSection(sectionIds.waitlist)}
              >
                Join the waitlist
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showIndicator && (
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={24} className="text-warm-white/40" />
          </motion.div>
        </div>
      )}
    </section>
  )
}
