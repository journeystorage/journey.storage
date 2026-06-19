'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getSizeAnalogy } from '@/lib/utils'
import Link from 'next/link'

const SIZES = [
  { w: 5, l: 5 },
  { w: 5, l: 10 },
  { w: 10, l: 10 },
  { w: 10, l: 15 },
  { w: 10, l: 20 },
  { w: 10, l: 25 },
  { w: 10, l: 30 },
]

export default function SizeGuidePage() {
  const [activeIndex, setActiveIndex] = useState(2)
  const active = SIZES[activeIndex]
  const activeSqft = active.w * active.l
  const activeAnalogy = getSizeAnalogy(activeSqft)

  return (
    <div style={{ backgroundColor: '#F5F0E8' }}>
      <section className="px-5 py-12 lg:py-16" style={{ borderBottom: '1px solid rgba(196,184,154,0.4)' }}>
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 font-bold transition-colors duration-150 hover:text-orange"
            style={{ fontSize: '0.9375rem', color: '#888680' }}
          >
            ← Back
          </Link>
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-orange" />
              <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Size guide</span>
              <div className="h-px flex-1 bg-orange" />
            </div>
            <h1 className="font-black tracking-[-0.03em] text-black" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 0.98 }}>
              Find your size.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-black/65">
              Sizes are approximate and may vary by facility. Tap any size to see what fits, or let them cycle through on their own.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="relative overflow-hidden rounded-[32px] bg-[#F5F0E8] p-5 shadow-[0_24px_80px_rgba(24,24,24,0.08)] sm:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-6 z-0 flex justify-center" aria-hidden="true">
              <span className="text-[6.5rem] font-black uppercase tracking-[-0.05em] text-black/[0.05] select-none">SIZES</span>
            </div>

            <div className="relative z-10">
              <div className="lg:hidden">
                <div className="flex items-stretch gap-2 overflow-x-auto pb-1 h-[108px]">
                  {SIZES.map(({ w, l }, index) => {
                    const sqft = w * l
                    const isActive = index === activeIndex
                    return (
                      <motion.button
                        key={`${w}x${l}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        animate={{ flex: isActive ? '1 1 0%' : '0 0 58px' }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex min-w-[58px] flex-col justify-between overflow-hidden rounded-[18px] border px-3 py-3 text-left shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
                        style={{
                          backgroundColor: isActive ? '#E8622A' : 'rgba(255,255,255,0.06)',
                          color: isActive ? '#FFFFFF' : '#181818',
                          borderColor: isActive ? 'transparent' : 'rgba(24,24,24,0.08)',
                        }}
                      >
                        {isActive ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/80" />
                              <span className="text-[0.65rem] uppercase tracking-[0.24em] text-white/80">{String(index + 1).padStart(2, '0')}</span>
                            </div>
                            <div>
                              <p className="mt-3 text-sm font-black leading-tight">{w}&apos; × {l}&apos;</p>
                              <p className="mt-2 text-[0.75rem] leading-snug text-white/90">{getSizeAnalogy(sqft).analogy}</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-black/20" style={{ writingMode: 'vertical-lr' }}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                <div className="mt-5 rounded-[26px] bg-[#181818] p-5 text-white shadow-[0_22px_75px_rgba(24,24,24,0.12)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/50">Selected size</p>
                      <p className="mt-3 text-2xl font-black">{active.w}&apos; × {active.l}&apos;</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                      {activeSqft} ft²
                    </span>
                  </div>
                  <p className="mt-4 text-lg font-bold text-orange">{activeAnalogy.analogy}</p>
                  <div className="mt-5 space-y-3 text-sm text-white/80">
                    {activeAnalogy.items.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-1 block h-2 w-2 rounded-full bg-white/30" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
                <div className="grid gap-3">
                  {SIZES.map(({ w, l }, index) => {
                    const sqft = w * l
                    const isActive = index === activeIndex
                    return (
                      <button
                        key={`${w}x${l}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`group flex items-center justify-between rounded-[22px] border px-6 py-5 text-left transition duration-200 ${
                          isActive ? 'border-transparent bg-orange text-white shadow-[0_20px_60px_rgba(232,98,42,0.18)]' : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <p className="text-sm uppercase tracking-[0.22em] text-white/60">{sqft} ft²</p>
                          <p className="mt-2 text-lg font-bold">{w}&apos; × {l}&apos;</p>
                        </div>
                        <span className="text-3xl font-black text-white/20 group-hover:text-white/40">{String(index + 1).padStart(2, '0')}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="rounded-[24px] bg-[#181818] p-10 shadow-[0_18px_60px_rgba(24,24,24,0.08)] text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45">Selected size</p>
                      <p className="mt-2 text-4xl font-black">{active.w}&apos; × {active.l}&apos;</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
                      {activeSqft} ft²
                    </span>
                  </div>
                  <p className="mt-6 text-2xl font-bold text-orange">{activeAnalogy.analogy}</p>
                  <div className="mt-6 space-y-3 text-sm text-white/80">
                    {activeAnalogy.items.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-1 block h-2 w-2 rounded-full bg-white/30" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="overflow-hidden rounded-[28px] bg-[#181818] p-5">
            <div className="flex items-end gap-3 overflow-x-auto pb-3">
              {SIZES.map(({ w, l }) => {
                const sqft = w * l
                const scale = sqft / 300
                const barHeight = 32 + scale * 160
                return (
                  <div key={`${w}x${l}`} className="flex min-w-[72px] flex-col items-center gap-2">
                    <div
                      style={{
                        width: 48,
                        height: barHeight,
                        borderRadius: '4px 4px 0 0',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'linear-gradient(to top, rgba(232,98,42,0.85), rgba(232,98,42,0.2))',
                      }}
                    />
                    <span className="font-semibold" style={{ fontSize: '0.8125rem', color: '#F5F0E8' }}>
                      {w}&apos;×{l}&apos;
                    </span>
                    <span className="text-sm" style={{ color: '#B8B0A0' }}>{sqft} ft²</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
