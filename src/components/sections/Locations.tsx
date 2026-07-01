'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, MapPin, ArrowDown } from 'lucide-react'
import { sectionIds } from '@/lib/constants'

/** Granbury facilities acquired by Journey — live inventory/pricing will come from the Tenant Inc API. */
const locations = [
  {
    name: 'Temple Hall Hwy',
    address: '212 Temple Hall Hwy · Granbury, TX 76049',
    img: '/images/granbury/temple-hall-aerial-sm.webp',
  },
  {
    name: 'Western Hills Trl',
    address: '409 Western Hills Trl · Granbury, TX 76049',
    img: '/images/granbury/western-hills-aerial-2-sm.webp',
  },
  {
    name: 'McCreary Rd',
    address: '3501 McCreary Rd · Granbury, TX 76049',
    img: '/images/granbury/cleveland-aerial-sm.webp',
  },
] as const

const popularSizes = ['5×10', '10×10', '10×20', 'Climate-controlled'] as const
const springEase = [0.22, 1, 0.36, 1] as const

export default function Locations() {
  const prefersReducedMotion = useReducedMotion()

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.6, ease: springEase, delay },
        }

  return (
    <section
      id={sectionIds.locations}
      className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center overflow-hidden bg-black pt-[84px] pb-11"
    >
      {/* Facility interior backdrop */}
      <Image
        src="/images/granbury/hero-interior.webp"
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Layered scrims for legibility + warm accent */}
      <div className="absolute inset-0 bg-charcoal/40 mix-blend-multiply" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,rgba(24,24,24,.72),rgba(24,24,24,.5) 40%,rgba(24,24,24,.9))' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(85% 60% at 50% 42%,rgba(24,24,24,.42),transparent 70%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 50% 6%,rgba(232,98,42,.22),transparent 55%)' }}
      />

      {/* Search */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-content px-5 text-center lg:px-16"
        {...fadeUp(0)}
      >
        <span className="mb-5 inline-block text-label font-bold uppercase tracking-[0.22em] text-terracotta">
          Storage without the friction
        </span>
        <h2 className="mx-auto max-w-[880px] text-[2.2rem] font-black leading-[1.05] tracking-[-0.03em] text-warm-white lg:text-[3.2rem]">
          Find a clean, secure space near you
        </h2>
        <p className="mx-auto mt-3.5 text-[1.05rem] font-light leading-[1.5] text-warm-white/80 lg:text-[1.2rem]">
          Rent online in minutes.
        </p>

        <form className="mx-auto mt-8 w-full max-w-[560px]" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-stretch gap-2 rounded-2xl bg-warm-white p-2 shadow-[0_20px_60px_-20px_rgba(24,24,24,0.7)]">
            <div className="flex flex-1 items-center gap-3 pl-4">
              <MapPin className="h-5 w-5 shrink-0 text-orange" strokeWidth={2} aria-hidden />
              <input
                type="text"
                placeholder="Enter your ZIP or city"
                aria-label="Search by ZIP code or city"
                className="w-full bg-transparent py-3 text-[1.0625rem] text-black placeholder:text-stone focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-orange px-6 py-3 font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.3)] transition duration-200 ease-out hover:-translate-y-px hover:brightness-105 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <Search className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              <span>Find units</span>
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-body-sm text-warm-white/70">
            <span>Popular sizes:</span>
            {popularSizes.map((size, i) => (
              <span key={size} className="contents">
                <button type="button" className="font-bold text-warm-white transition-colors duration-150 hover:text-terracotta">
                  {size}
                </button>
                {i < popularSizes.length - 1 && <span className="opacity-40">·</span>}
              </span>
            ))}
          </div>
        </form>

        {/* See our locations */}
        <div className="mt-[52px] flex items-center justify-center gap-3.5">
          <span className="h-px w-11 bg-warm-white/[0.28]" />
          <a
            href={`#${sectionIds.locations}`}
            className="group inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.16em] text-warm-white/[0.78] transition-colors duration-200 hover:text-terracotta"
          >
            See our locations
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-y-0.5" aria-hidden />
          </a>
          <span className="h-px w-11 bg-warm-white/[0.28]" />
        </div>
      </motion.div>

      {/* Location picks */}
      <motion.div
        className="relative z-10 mx-auto mt-6 grid w-full max-w-content grid-cols-1 gap-4 px-5 md:grid-cols-3 md:gap-4 lg:mt-[30px] lg:px-2"
        {...fadeUp(0.12)}
      >
        {locations.map((loc) => (
          <a
            key={loc.name}
            href="#"
            className="group flex items-center gap-2 rounded-2xl border border-white/35 bg-warm-white p-3.5 shadow-[0_22px_48px_-24px_rgba(0,0,0,0.85)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-22px_rgba(232,98,42,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-[0_6px_16px_-6px_rgba(24,24,24,0.6)]">
              <Image
                src={loc.img}
                alt={`Journey Storage — ${loc.name}, Granbury TX`}
                fill
                unoptimized
                sizes="56px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-0 rounded-full shadow-[inset_0_0_0_2px_rgba(245,240,232,0.9)]" />
            </span>

            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[1.02rem] font-black leading-tight tracking-[-0.02em] text-black">
                {loc.name}
              </span>
              <span className="mt-0.5 truncate text-[0.66rem] leading-[1.35] text-stone">{loc.address}</span>
            </span>

            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-orange px-3.5 py-2 text-[0.82rem] font-bold text-warm-white shadow-[0_2px_8px_rgba(232,98,42,0.32)] transition duration-200 group-hover:brightness-105">
              Rent
              <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>
            </span>
          </a>
        ))}
      </motion.div>
    </section>
  )
}
