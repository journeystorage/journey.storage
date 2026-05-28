'use client'

import { useState, useRef } from 'react'
import { MapPin, ChevronRight, SearchX } from 'lucide-react'
import Link from 'next/link'
import type { ConsumerFacility } from '@/lib/consumer-data'

export function LocationSearch({ facilities }: { facilities: ConsumerFacility[] }) {
  const [query, setQuery] = useState('')
  const resultsRef = useRef<HTMLElement>(null)

  const filtered = query.trim()
    ? facilities.filter((f) => {
        const q = query.toLowerCase()
        return (
          f.name.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          f.state.toLowerCase().includes(q) ||
          f.zip.includes(q) ||
          f.address.toLowerCase().includes(q)
        )
      })
    : facilities

  function handleSearch() {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Search bar */}
      <div className="relative z-10 mt-10 w-full max-w-lg">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#888680', opacity: 0.5 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter city, zip code, or address..."
            style={{
              width: '100%',
              padding: '14px 160px 14px 48px',
              fontSize: '1.0625rem',
              color: '#181818',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(136,134,128,0.3)',
              borderRadius: 4,
              outline: 'none',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '10px 24px',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#E8622A',
              borderRadius: 24,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Find storage
          </button>
        </div>
      </div>

      {/* Results */}
      <section
        ref={resultsRef}
        className="mt-16 w-full px-5 pt-16 pb-20"
        style={{ borderTop: '1px solid rgba(196,184,154,0.4)' }}
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10">
            <h2 className="font-bold tracking-tight" style={{ fontSize: '2.5rem', lineHeight: 1.08, color: '#181818' }}>
              {query.trim() ? 'Search results' : 'Our locations'}
            </h2>
            <p className="mt-2" style={{ fontSize: '1.0625rem', color: '#888680' }}>
              {filtered.length} {filtered.length === 1 ? 'facility' : 'facilities'}
              {query.trim() ? ` matching "${query.trim()}"` : ' available'}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((f) => (
                <Link
                  key={f.id}
                  href={`/locations/${f.id}`}
                  className="group transition-all duration-150 hover:-translate-y-0.5"
                  style={{
                    display: 'block',
                    padding: 32,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px 8px 16px 8px',
                    boxShadow: '0 1px 2px rgba(24,24,24,0.05)',
                  }}
                >
                  <h3 className="font-bold tracking-tight" style={{ fontSize: '1.375rem', color: '#181818' }}>
                    {f.name}
                  </h3>
                  <p className="mt-2 flex items-start gap-2" style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#888680' }}>
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {f.address}
                  </p>

                  {f.phone && (
                    <p className="mt-1" style={{ fontSize: '0.8125rem', color: 'rgba(136,134,128,0.6)' }}>
                      {f.phone}
                    </p>
                  )}

                  <div
                    className="mt-6 flex items-center justify-between pt-6"
                    style={{ borderTop: '1px solid rgba(196,184,154,0.3)' }}
                  >
                    <div className="flex items-center gap-2 font-bold" style={{ fontSize: '0.9375rem', color: '#E8622A' }}>
                      View units <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px 8px 16px 8px', boxShadow: '0 1px 2px rgba(24,24,24,0.05)' }}>
              <SearchX className="mx-auto mb-4 h-10 w-10" style={{ color: 'rgba(136,134,128,0.3)' }} />
              <p style={{ fontSize: '1.0625rem', color: '#888680' }}>No facilities found for &ldquo;{query.trim()}&rdquo;</p>
              <button
                onClick={() => setQuery('')}
                className="mt-4 font-bold"
                style={{ fontSize: '0.9375rem', color: '#E8622A' }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
