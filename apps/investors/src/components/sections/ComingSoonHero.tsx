'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { LAUNCH_DATE_ISO } from '@/lib/constants'

interface ComingSoonHeroProps {
  onBookCall: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

function diffTo(target: number): TimeLeft {
  const now = Date.now()
  const ms = Math.max(0, target - now)
  if (ms === 0) return ZERO
  const totalSeconds = Math.floor(ms / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function ComingSoonHero({ onBookCall }: ComingSoonHeroProps) {
  const targetMs = new Date(LAUNCH_DATE_ISO).getTime()
  const [time, setTime] = useState<TimeLeft>(ZERO)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(diffTo(targetMs))
    const id = setInterval(() => setTime(diffTo(targetMs)), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  const units: { value: number; label: string }[] = [
    { value: time.days, label: 'days' },
    { value: time.hours, label: 'hours' },
    { value: time.minutes, label: 'minutes' },
    { value: time.seconds, label: 'seconds' },
  ]

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-black pt-[100px] pb-[72px] lg:pt-[110px] lg:pb-[80px]">
      {/* ── Background image (B&W, visible) ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/direct-hero-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            filter: 'grayscale(100%) contrast(1.05) brightness(0.6)',
            objectPosition: '50% 62%',
          }}
        />
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/80" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 65% at 50% 50%, transparent, rgba(24,24,24,0.55))',
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(232,98,42,0.10), transparent)',
        }}
      />
      <div className="grain absolute inset-0 pointer-events-none" />

      {/* ── Foreground stack — pure document flow ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-5 md:px-8 text-center">

        {/* Eyebrow tag — Journey.Direct™ pill */}
        <div className="hero-fade-up inline-flex items-center gap-2.5 rounded-full border border-warm-white/[0.10] bg-black/40 backdrop-blur-md px-5 py-2.5">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-orange opacity-60"
              style={{ animation: 'pulseDot 2s ease-in-out infinite' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.9rem] font-black tracking-[0.08em] text-warm-white/90">
              JOURNEY.<span className="font-light">DIRECT</span>&trade;
            </span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-warm-white/40">
              Investment Platform
            </span>
          </span>
        </div>

        {/* Stay tuned + Launching */}
        <div
          className="hero-fade-up mt-7 flex items-center gap-3"
          style={{ animationDelay: '0.10s' }}
        >
          <div className="h-px w-8 bg-orange/60" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-orange">
            Stay tuned
          </span>
          <div className="h-px w-8 bg-orange/60" />
        </div>
        <div
          className="hero-fade-up mt-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-warm-white/55"
          style={{ animationDelay: '0.14s' }}
        >
          Launching · April 13, 2026
        </div>

        {/* ── TIMER BLOCK — numbers + labels grouped, headline overlaid on numbers ── */}
        <div className="relative mt-9 mx-auto flex w-full max-w-[1120px] flex-col">
          {/* Numbers — wide gaps so each digit reads as its own block */}
          <div
            aria-hidden="true"
            className="grid w-full grid-cols-4 items-center gap-10 sm:gap-14 md:gap-20 lg:gap-28 xl:gap-32"
          >
            {units.map((unit) => (
              <div key={unit.label} className="flex items-center justify-center">
                <span
                  className="block select-none text-center tabular-nums leading-[0.85] text-warm-white/[0.13]"
                  style={{
                    fontFamily: 'var(--font-mono), ui-monospace, monospace',
                    fontWeight: 700,
                    fontSize: 'clamp(4.5rem, 16vw, 16rem)',
                    textShadow: '0 2px 40px rgba(232,98,42,0.05)',
                  }}
                >
                  {mounted ? pad(unit.value) : '00'}
                </span>
              </div>
            ))}
          </div>

          {/* Labels row — DIRECTLY below numbers, mirrors the same 4-col grid */}
          <div
            className="hero-fade-up mt-1 grid w-full grid-cols-4 gap-10 sm:gap-14 md:gap-20 lg:gap-28 xl:gap-32"
            style={{ animationDelay: '0.30s' }}
          >
            {units.map((unit) => (
              <div key={unit.label} className="flex items-center justify-center">
                <span
                  className="text-center font-bold uppercase text-warm-white/45 tracking-[0.28em]"
                  style={{
                    fontFamily: 'var(--font-mono), ui-monospace, monospace',
                    fontSize: 'clamp(0.78rem, 1.15vw, 1.05rem)',
                  }}
                >
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {/* HEADLINE — absolute, vertically centered on the NUMBER band only */}
          <h1
            className="hero-fade-up pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-center whitespace-nowrap font-black leading-[0.9] tracking-[-0.045em] text-warm-white"
            style={{
              animationDelay: '0.18s',
              fontSize: 'clamp(2.1rem, 8.6vw, 8.6rem)',
              height: 'clamp(4.5rem, 16vw, 16rem)',
            }}
          >
            Built by operators
          </h1>
        </div>

        {/* Subline — below the timer block (numbers + labels) */}
        <p
          className="hero-fade-up mt-9 max-w-[640px] text-base md:text-lg leading-[1.7] text-warm-white/80"
          style={{ animationDelay: '0.34s' }}
        >
          A{' '}
          <strong className="font-semibold text-warm-white">
            direct investment platform
          </strong>{' '}
          for self-storage is on the way.
        </p>

        {/* CTA */}
        <button
          onClick={onBookCall}
          className="hero-fade-up group mt-8 inline-flex items-center gap-3 rounded-sm border border-warm-white/25 bg-warm-white/[0.03] backdrop-blur-sm px-10 py-4 text-body-sm font-bold uppercase tracking-[0.18em] text-warm-white transition-colors duration-200 hover:border-orange hover:bg-orange/[0.08] hover:text-orange cursor-pointer"
          style={{ animationDelay: '0.40s' }}
        >
          Book a call
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </button>
        <span
          className="hero-fade-up mt-4 text-[0.65rem] text-warm-white/40 leading-relaxed"
          style={{ animationDelay: '0.40s' }}
        >
          For accredited investors who want a head start.
        </span>
      </div>

      {/* ── Bottom footer — copyright + confidentiality ── */}
      <div className="pointer-events-none absolute bottom-5 lg:bottom-6 left-0 right-0 z-10 mx-auto flex max-w-[var(--container-content)] flex-col items-center gap-1 px-5 text-center md:flex-row md:justify-between md:gap-3 md:px-8 lg:px-16">
        <span className="text-[0.6rem] font-normal tracking-[0.04em] text-warm-white/35">
          © 2026 Journey.Storage&trade;. All rights reserved. Privileged &amp; confidential.
        </span>
        <span className="hidden md:block text-[0.6rem] font-bold uppercase tracking-[0.25em] text-warm-white/25">
          Direct · 001
        </span>
      </div>
    </section>
  )
}
