import { getSizeAnalogy } from '@/lib/utils'
import { Package, Sofa, Bed, Home, Warehouse } from 'lucide-react'
import Link from 'next/link'

const SIZES = [
  { w: 5, l: 5, icon: Package },
  { w: 5, l: 10, icon: Package },
  { w: 10, l: 10, icon: Sofa },
  { w: 10, l: 15, icon: Bed },
  { w: 10, l: 20, icon: Home },
  { w: 10, l: 25, icon: Warehouse },
  { w: 10, l: 30, icon: Warehouse },
]

export default function SizeGuidePage() {
  return (
    <div style={{ backgroundColor: '#F5F0E8' }}>
      {/* Header */}
      <section className="px-5 py-12 lg:py-16" style={{ borderBottom: '1px solid rgba(196,184,154,0.4)' }}>
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 font-bold transition-colors duration-150 hover:text-orange"
            style={{ fontSize: '0.9375rem', color: '#888680' }}
          >
            ← Back
          </Link>
          <h1 className="font-black tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1, color: '#181818' }}>
            Storage unit <span style={{ color: '#E8622A' }}>size guide</span>
          </h1>
          <p className="mt-4 max-w-lg font-light" style={{ fontSize: '1.375rem', lineHeight: 1.4, color: '#888680' }}>
            Not sure what size you need? Use this guide to find the right unit.
          </p>
        </div>
      </section>

      {/* Scale chart — dark accent strip */}
      <section className="px-5 py-12" style={{ backgroundColor: '#181818' }}>
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-end gap-3 overflow-x-auto pb-2">
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
                      border: '1px solid rgba(232,98,42,0.2)',
                      background: 'linear-gradient(to top, rgba(232,98,42,0.7), rgba(232,98,42,0.15))',
                    }}
                  />
                  <span className="font-bold" style={{ fontSize: '0.8125rem', color: '#F5F0E8' }}>
                    {w}&apos;×{l}&apos;
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#888680' }}>{sqft} ft²</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="px-5 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SIZES.map(({ w, l, icon: Icon }) => {
              const sqft = w * l
              const analogy = getSizeAnalogy(sqft)
              return (
                <div
                  key={`${w}x${l}`}
                  className="transition-all duration-150 hover:-translate-y-0.5"
                  style={{
                    padding: 32,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px 8px 16px 8px',
                    boxShadow: '0 1px 2px rgba(24,24,24,0.05)',
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center"
                      style={{ borderRadius: 8, backgroundColor: 'rgba(232,98,42,0.1)' }}
                    >
                      <Icon className="h-5 w-5" style={{ color: '#E8622A' }} />
                    </div>
                    <span className="font-bold" style={{ fontSize: '0.8125rem', color: '#888680', backgroundColor: '#F5F0E8', padding: '4px 10px', borderRadius: 4 }}>
                      {sqft} ft²
                    </span>
                  </div>

                  <h3 className="font-bold tracking-tight" style={{ fontSize: '1.75rem', lineHeight: 1.15, color: '#181818' }}>
                    {w}&apos; × {l}&apos;
                  </h3>
                  <p className="mt-1 font-bold" style={{ fontSize: '0.9375rem', color: '#E8622A' }}>{analogy.analogy}</p>

                  <div className="mt-6 space-y-2">
                    <p className="font-bold uppercase" style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', color: '#888680' }}>
                      What fits
                    </p>
                    {analogy.items.map((item) => (
                      <div key={item} className="flex items-center gap-2.5" style={{ fontSize: '0.9375rem', color: 'rgba(24,24,24,0.7)' }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(136,134,128,0.4)', flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
