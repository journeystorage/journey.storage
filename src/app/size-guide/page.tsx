'use client'

import { useEffect, useRef, useState } from 'react'

type Unit = {
  num: string
  size: string
  sqft: number
  cubicFt: number
  fits: string
  caption: string
  comparison: string
  description: string
  rightSizeFor: string[]
  accent: string
  card: string
}

const UNITS: Unit[] = [
  {
    num: '01', size: "5' x 5'", sqft: 25, cubicFt: 200,
    fits: 'a storage closet',
    caption: "Just enough room for the things you can't quite let go of.",
    comparison: 'Similar to a large standard closet.',
    description: "Our smallest standard unit. The right fit for stashing away household items, small furniture, or seasonal belongings you don't need every day.",
    rightSizeFor: ['Up to 10 large moving boxes', 'Seasonal clothing or shoes', 'Sports gear or equipment', 'A small desk or chair'],
    accent: '#6f9fc4', card: '#d4e2ec',
  },
  {
    num: '02', size: "5' x 10'", sqft: 50, cubicFt: 400,
    fits: 'a studio apartment',
    caption: 'Room for the studio you outgrew, with space to breathe.',
    comparison: 'Similar to a large walk-in closet or small shed.',
    description: 'A balance of space and versatility. Holds the contents of a mid-sized bedroom, dorm, or studio apartment, a few large furniture pieces plus boxes.',
    rightSizeFor: ['20+ large moving boxes', 'A twin or full mattress', 'A small office set-up', 'Around 2 large furniture pieces'],
    accent: '#8ab07a', card: '#d6e2cb',
  },
  {
    num: '03', size: "5' x 15'", sqft: 75, cubicFt: 600,
    fits: 'a one-bedroom apartment',
    caption: 'A clean transition between chapters of life.',
    comparison: 'Similar to a large walk-in closet.',
    description: "Fits the contents of an entire bedroom and a bit extra. A go-to choice if you're moving out of a small apartment, with room to walk around and browse.",
    rightSizeFor: ['Around 30 large moving boxes', 'A bedroom furniture set', 'A kitchen table', 'Luggage and travel gear'],
    accent: '#e3c14a', card: '#f0e0a8',
  },
  {
    num: '04', size: "10' x 10'", sqft: 100, cubicFt: 800,
    fits: 'two small bedrooms',
    caption: 'Two rooms, packed and waiting for what comes next.',
    comparison: 'Similar to half of a one-car garage.',
    description: 'Space for an entire living area or two bedrooms, boxes and all. Spacious enough to store your stuff with room to spare.',
    rightSizeFor: ['Around 40 large moving boxes', 'Large household furniture sets', 'Appliances', 'Seasonal clothing'],
    accent: '#d4956a', card: '#e8cbb4',
  },
  {
    num: '05', size: "10' x 15'", sqft: 150, cubicFt: 1200,
    fits: 'a two-bedroom home',
    caption: 'Your growth should not wait for square footage.',
    comparison: 'Similar to a large bedroom.',
    description: "Room for bulky furniture and appliances. Holds up to four rooms' worth of belongings, ideal for moving, decluttering, or freeing up your garage.",
    rightSizeFor: ['Around 60 large moving boxes', 'Large furniture sets', 'Small business inventory', 'Kitchenware'],
    accent: '#b96c52', card: '#e3b9a8',
  },
  {
    num: '06', size: "10' x 20'", sqft: 200, cubicFt: 1600,
    fits: 'a three-bedroom home',
    caption: 'Big enough for the home you are building toward.',
    comparison: 'Similar to a standard one-car garage.',
    description: "For when you need serious space. Five rooms' worth of belongings, living room sets, patio furniture, and full-sized appliances all fit comfortably.",
    rightSizeFor: ['Around 80 large moving boxes', 'Full living and dining rooms', 'Full kitchenware sets', 'Major appliances'],
    accent: '#8a7aa5', card: '#cec5dc',
  },
  {
    num: '07', size: "10' x 30'", sqft: 300, cubicFt: 2400,
    fits: 'a four or five-bedroom home',
    caption: 'A whole life, ready for its next move.',
    comparison: 'Similar to a large one-car garage.',
    description: 'Our largest standard unit. Built for big moves, full home renovations, or storing the contents of a multi-bedroom house with room to maneuver.',
    rightSizeFor: ['Around 100+ large moving boxes', 'Multiple bedroom sets', 'Large appliances and furniture', 'Long-term storage of vehicles or trailers (where permitted)'],
    accent: '#5d8a85', card: '#bdd3d0',
  },
]

const TICKER_ITEMS = ['24/7 access', '100% digital', '0 hidden fees', 'month-to-month', 'smart locks', 'climate control']

const ROTATE_MS = 4500

function UnitSVG() {
  return (
    <svg viewBox="0 0 200 140" width="170" aria-hidden="true">
      <rect x={10} y={14} width={180} height={112} rx={6} fill="none" stroke="#181818" strokeOpacity={0.4} strokeWidth={2} />
      <g stroke="#181818" strokeOpacity={0.2} strokeWidth={1.5}>
        <line x1={20} y1={40} x2={180} y2={40} />
        <line x1={20} y1={58} x2={180} y2={58} />
        <line x1={20} y1={76} x2={180} y2={76} />
        <line x1={20} y1={94} x2={180} y2={94} />
        <line x1={20} y1={112} x2={180} y2={112} />
      </g>
      <circle cx={100} cy={120} r={2.5} fill="#181818" fillOpacity={0.5} />
    </svg>
  )
}

function Placeholder({ unit, showCaption }: { unit: Unit; showCaption: boolean }) {
  return (
    <>
      <div className="sg-placeholder" style={{ background: unit.card }}>
        <UnitSVG />
        <p style={{ marginTop: 16, fontSize: 30, fontWeight: 900, letterSpacing: '-0.01em' }}>{unit.size}</p>
        <p style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(24,24,24,0.6)', fontWeight: 700 }}>
          {unit.sqft} sq ft
        </p>
      </div>
      {showCaption && <div className="sg-caption">{unit.caption}</div>}
    </>
  )
}

export default function SizeGuidePage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % UNITS.length)
    }, ROTATE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, activeIdx])

  const active = UNITS[activeIdx]
  const prevIdx = (activeIdx - 1 + UNITS.length) % UNITS.length
  const nextIdx = (activeIdx + 1) % UNITS.length

  return (
    <main className="sg-root">
      {/* Site header (matched to journey.storage main page) */}
      <header className="sg-header">
        <div className="sg-header-inner">
          <a href="/" aria-label="Journey.Storage home" className="sg-logo-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo-white-TM.svg"
              alt="Journey.Storage"
              className="sg-logo"
            />
          </a>
          <nav className="sg-nav" aria-label="Primary">
            <a href="/spaces">Spaces</a>
            <a href="/locations">Locations</a>
            <a href="/about">About</a>
            <a href="/blog" className="sg-nav-muted">Blog</a>
            <a href="/ecosystem">Ecosystem <span aria-hidden="true" style={{ opacity: 0.7 }}>▾</span></a>
          </nav>
          <a className="sg-waitlist-btn" href="/#waitlist">Join the waitlist</a>
          <button
            type="button"
            className="sg-hamburger"
            aria-label="Open menu"
            onClick={() => { window.location.href = '/' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Orange ticker */}
      <div className="sg-ticker" aria-label="Journey features">
        <div className="sg-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={`${item}-${i}`} className="sg-ticker-item">
              {item}
              <span className="sg-ticker-dot">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Life Moments wrapper: matches main site section.bg-black py-10 md:py-14 lg:py-16 */}
      <section className="sg-life-section">
        {/* Cream card (Life Moments style) */}
        <section
          className="sg-cream-card"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span aria-hidden="true" className="sg-watermark">SIZES</span>

          <div style={{ position: 'relative' }}>
            <div className="sg-eyebrow">
              <span className="sg-dash" />
              <span>Size Guide</span>
              <span className="sg-dash" />
            </div>
            <h1 className="sg-title">Find your size.</h1>
            <p className="sg-subtitle">
              Sizes are approximate and may vary by facility. Tap any size to see what fits, or let them cycle through on their own.
            </p>

            <div className="sg-grid">
              {/* Numbered list */}
              <ul className="sg-list">
                {UNITS.map((u, i) => {
                  const isActive = i === activeIdx
                  return (
                    <li key={u.num}>
                      <button
                        type="button"
                        data-active={isActive}
                        className="sg-num-button"
                        style={isActive ? { background: u.accent } : undefined}
                        onClick={() => {
                          setActiveIdx(i)
                          if (timerRef.current) clearInterval(timerRef.current)
                          timerRef.current = null
                        }}
                      >
                        <span className="sg-bg-num">{u.num}</span>
                        <div className="sg-row-meta">
                          <span className="sg-row-dot" />
                          <span>{u.num}</span>
                        </div>
                        <div className="sg-row-title">
                          {u.size} <span className="sg-row-sub">, fits {u.fits}</span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* Collage */}
              <div className="sg-collage">
                {UNITS.map((u, i) => {
                  let pos: 'active' | 'left' | 'right' | 'hidden' = 'hidden'
                  if (i === activeIdx) pos = 'active'
                  else if (i === prevIdx) pos = 'left'
                  else if (i === nextIdx) pos = 'right'
                  return (
                    <div key={u.num} data-pos={pos} className="sg-photo-card">
                      <Placeholder unit={u} showCaption={pos === 'active'} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Details panel — moved OUT of the cream card, sits on black background */}
      <section className="sg-details-section">
        <div className="sg-details">
          <div>
            <p className="sg-stat-eyebrow">Selected size</p>
            <p className="sg-stat-size">{active.size}</p>
            <p className="sg-stat-compare">{active.comparison}</p>
            <div className="sg-stat-grid">
              <div className="sg-stat">
                <p className="sg-stat-label">Square feet</p>
                <p className="sg-stat-value">{active.sqft}</p>
              </div>
              <div className="sg-stat">
                <p className="sg-stat-label">Cubic feet</p>
                <p className="sg-stat-value">{active.cubicFt.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="sg-desc">{active.description}</p>
            <div style={{ marginTop: 24 }}>
              <p className="sg-rsf-label">The right size for</p>
              <ul className="sg-rsf-list">
                {active.rightSizeFor.map((item) => (
                  <li key={item}>
                    <span className="sg-rsf-bullet" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: 32 }}>
              <a
                className="sg-pill-cta"
                href={`mailto:hello@journey.storage?subject=${encodeURIComponent(
                  `Inquiry about ${active.size} unit`,
                )}`}
              >
                Contact us about this size <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Side by side — How It Works style: full-width black with grain texture */}
      <section className="sg-table-section">
        <div className="sg-table-inner">
          <div className="sg-eyebrow sg-eyebrow-left">
            <span className="sg-dash" />
            <span>Side by side</span>
          </div>
          <h2 className="sg-table-title">Unit size comparison</h2>
          <p className="sg-table-sub">All Journey self-storage sizes at a glance.</p>

          <div className="sg-table-scroll">
            <table className="sg-table">
              <thead>
                <tr>
                  <th>Unit Size</th>
                  <th>Square Feet</th>
                  <th>Cubic Feet</th>
                  <th>Fits The Contents Of</th>
                </tr>
              </thead>
              <tbody>
                {UNITS.map((u) => (
                  <tr key={u.num}>
                    <td style={{ fontWeight: 900, color: 'var(--sg-warm-white)' }}>{u.size}</td>
                    <td>{u.sqft}</td>
                    <td>{u.cubicFt.toLocaleString()}</td>
                    <td>Fits {u.fits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="sg-final-cta">
        <div className="sg-eyebrow">
          <span className="sg-dash" />
          <span>Still not sure?</span>
          <span className="sg-dash" />
        </div>
        <h2 className="sg-final-title">Tell us what you need to store.</h2>
        <p className="sg-final-sub">
          Our team can walk you through unit options at the facility nearest you and answer any questions about availability, pricing, and features.
        </p>
        <div style={{ marginTop: 32 }}>
          <a className="sg-pill-cta" href="mailto:hello@journey.storage?subject=Storage%20size%20guide%20inquiry">
            Contact Us <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <style jsx>{`
        :global(:root) {
          --sg-site-dark: #181818;
          --sg-warm-white: #f5f0e8;
          --sg-orange: #e8622a;
        }
        .sg-root {
          background: var(--sg-site-dark);
          color: var(--sg-warm-white);
          font-family: 'Lato', 'Lato Fallback', system-ui, -apple-system, sans-serif;
        }

        /* Header */
        .sg-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(24, 24, 24, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .sg-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 1024px) {
          .sg-header-inner { padding: 0 64px; height: 73px; }
        }
        .sg-logo-link { display: inline-flex; align-items: center; }
        .sg-logo { height: 11px; width: 140px; display: block; }
        @media (min-width: 1024px) {
          .sg-logo { height: 13px; width: 180px; }
        }
        .sg-nav { display: none; }
        @media (min-width: 1024px) {
          .sg-nav { display: flex; gap: 32px; align-items: center; }
        }
        .sg-nav a {
          color: var(--sg-warm-white);
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          letter-spacing: 0;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .sg-nav a.sg-nav-muted { color: rgba(245, 240, 232, 0.5); }
        .sg-nav a:hover { color: var(--sg-orange); }
        .sg-waitlist-btn {
          display: none;
          background: var(--sg-orange);
          color: var(--sg-warm-white);
          font-weight: 700;
          border-radius: 24px;
          padding: 12px 24px;
          font-size: 16px;
          line-height: 24px;
          align-items: center;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        @media (min-width: 1024px) {
          .sg-waitlist-btn { display: inline-flex; }
        }
        .sg-waitlist-btn:hover { opacity: 0.9; }
        .sg-hamburger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          color: var(--sg-warm-white);
          border: 0;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .sg-hamburger:hover { background: rgba(0, 0, 0, 0.6); }
        @media (min-width: 1024px) {
          .sg-hamburger { display: none; }
        }

        /* Ticker */
        .sg-ticker {
          position: relative;
          overflow: hidden;
          background: var(--sg-orange);
          padding: 14px 0;
        }
        .sg-ticker-track {
          display: flex;
          width: max-content;
          animation: sg-ticker-scroll 30s linear infinite;
        }
        .sg-ticker:hover .sg-ticker-track { animation-play-state: paused; }
        .sg-ticker-item {
          color: rgba(245, 240, 232, 0.9);
          font-size: 11.2px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin: 0 24px;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .sg-ticker-item { margin: 0 40px; }
        }
        .sg-ticker-dot { opacity: 0.7; }
        @keyframes sg-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Life Moments wrapper section: matches main site (bg-black py-10 md:py-14 lg:py-16) */
        .sg-life-section {
          position: relative;
          background: var(--sg-site-dark);
          padding: 40px 0;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .sg-life-section { padding: 56px 0; }
        }
        @media (min-width: 1024px) {
          .sg-life-section { padding: 64px 0; }
        }

        /* Cream card (matches Life Moments cream card exactly) */
        .sg-cream-card {
          background: var(--sg-warm-white);
          color: var(--sg-site-dark);
          border-radius: 24px;
          margin: 0 12px;
          padding: 64px 20px 48px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .sg-cream-card { margin: 0 24px; border-radius: 32px; padding: 80px 32px 64px; }
        }
        @media (min-width: 1024px) {
          .sg-cream-card { margin: 0 40px; border-radius: 32px; padding: 96px 40px 80px; }
        }
        .sg-watermark {
          position: absolute;
          inset-inline: 0;
          top: 60px;
          text-align: center;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(24, 24, 24, 0.06);
          user-select: none;
          pointer-events: none;
          font-size: clamp(110px, 13vw, 200px);
        }

        .sg-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--sg-orange);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }
        .sg-eyebrow-left { justify-content: flex-start; }
        .sg-dash { height: 1px; width: 36px; background: var(--sg-orange); }

        .sg-title {
          text-align: center;
          font-weight: 900;
          font-size: clamp(36px, 5.5vw, 60px);
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: var(--sg-site-dark);
          margin-top: 18px;
        }
        .sg-subtitle {
          text-align: center;
          max-width: 640px;
          margin: 18px auto 0;
          color: rgba(24, 24, 24, 0.65);
          font-size: 16px;
          line-height: 1.55;
        }

        /* Grid stacks until lg */
        .sg-grid {
          display: grid;
          gap: 32px;
          margin-top: 40px;
        }
        @media (min-width: 1024px) {
          .sg-grid {
            grid-template-columns: 1fr 1.5fr;
            align-items: center;
            gap: 40px;
            margin-top: 56px;
          }
        }

        /* Number list */
        .sg-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 460px;
          margin: 0 auto;
          list-style: none;
          padding: 0;
        }
        .sg-num-button {
          position: relative;
          width: 100%;
          min-height: 90px;
          text-align: left;
          border-radius: 16px;
          padding: 18px 26px;
          background: transparent;
          cursor: pointer;
          border: 0;
          color: rgba(24, 24, 24, 0.42);
          transition: background-color 0.35s ease, color 0.35s ease;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .sg-num-button:hover { background: rgba(24, 24, 24, 0.04); }
        .sg-row-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: inherit;
        }
        .sg-row-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.6;
        }
        .sg-row-title {
          margin-top: 6px;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.01em;
          line-height: 1.15;
          color: inherit;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sg-row-sub {
          font-size: 16px;
          font-weight: 400;
          color: rgba(24, 24, 24, 0.55);
          margin-left: 6px;
          letter-spacing: 0;
        }
        .sg-num-button[data-active='true'] .sg-row-sub { color: rgba(24, 24, 24, 0.7); }
        .sg-bg-num {
          position: absolute;
          right: 26px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 900;
          font-size: 72px;
          color: rgba(24, 24, 24, 0.07);
          pointer-events: none;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .sg-num-button[data-active='true'] { color: var(--sg-site-dark); }
        .sg-num-button[data-active='true'] .sg-row-meta { color: rgba(24, 24, 24, 0.85); }
        .sg-num-button[data-active='true'] .sg-row-title { color: var(--sg-site-dark); }
        .sg-num-button[data-active='true'] .sg-bg-num { color: rgba(24, 24, 24, 0.14); }

        /* Collage */
        .sg-collage {
          position: relative;
          height: 400px;
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .sg-collage { height: 480px; }
        }
        .sg-photo-card {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.55s ease;
          box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.35);
        }
        .sg-photo-card[data-pos='active'] {
          transform: translate(-50%, -50%) scale(1);
          width: 260px;
          height: 340px;
          z-index: 30;
          opacity: 1;
        }
        .sg-photo-card[data-pos='left'] {
          transform: translate(calc(-50% - 90px), calc(-50% + 4px)) rotate(-3deg) scale(0.85);
          width: 170px;
          height: 270px;
          z-index: 10;
          opacity: 0.85;
        }
        .sg-photo-card[data-pos='right'] {
          transform: translate(calc(-50% + 90px), calc(-50% + 4px)) rotate(3deg) scale(0.85);
          width: 170px;
          height: 270px;
          z-index: 10;
          opacity: 0.85;
        }
        .sg-photo-card[data-pos='hidden'] {
          transform: translate(-50%, -50%) scale(0.6);
          opacity: 0;
          pointer-events: none;
        }
        @media (min-width: 1024px) {
          .sg-photo-card[data-pos='active'] {
            width: 350px;
            height: 440px;
          }
          .sg-photo-card[data-pos='left'] {
            transform: translate(calc(-50% - 140px), calc(-50% + 4px)) rotate(-3deg) scale(0.85);
            width: 220px;
            height: 340px;
          }
          .sg-photo-card[data-pos='right'] {
            transform: translate(calc(-50% + 140px), calc(-50% + 4px)) rotate(3deg) scale(0.85);
            width: 220px;
            height: 340px;
          }
        }
        :global(.sg-placeholder) {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #181818;
          text-align: center;
          padding: 24px;
        }
        :global(.sg-caption) {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          padding: 22px 24px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0));
          color: var(--sg-warm-white);
          font-size: 14px;
          font-weight: 700;
        }

        /* Details section — sits on dark background BELOW cream card */
        .sg-details-section {
          background: var(--sg-site-dark);
          padding: 56px 16px;
        }
        @media (min-width: 768px) {
          .sg-details-section { padding: 72px 32px; }
        }
        @media (min-width: 1024px) {
          .sg-details-section { padding: 80px 40px; }
        }
        .sg-details {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px;
          background: rgba(245, 240, 232, 0.04);
          border: 1px solid rgba(245, 240, 232, 0.1);
          border-radius: 20px;
          display: grid;
          gap: 28px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .sg-details { grid-template-columns: 1fr 2fr; padding: 40px; }
        }
        .sg-stat-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--sg-orange);
        }
        .sg-stat-size {
          margin-top: 10px;
          font-size: 40px;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1;
          color: var(--sg-warm-white);
        }
        .sg-stat-compare {
          margin-top: 8px;
          font-size: 14px;
          color: rgba(245, 240, 232, 0.6);
        }
        .sg-stat-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 14px;
        }
        .sg-stat {
          background: rgba(245, 240, 232, 0.06);
          border: 1px solid rgba(245, 240, 232, 0.1);
          border-radius: 12px;
          padding: 10px 14px;
        }
        .sg-stat-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(245, 240, 232, 0.5);
        }
        .sg-stat-value {
          margin-top: 4px;
          font-size: 18px;
          font-weight: 900;
          color: var(--sg-warm-white);
        }
        .sg-desc {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(245, 240, 232, 0.78);
        }
        .sg-rsf-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245, 240, 232, 0.55);
        }
        .sg-rsf-list {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          font-size: 14px;
          color: rgba(245, 240, 232, 0.78);
          list-style: none;
          padding: 0;
        }
        @media (min-width: 640px) {
          .sg-rsf-list { grid-template-columns: 1fr 1fr; }
        }
        .sg-rsf-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .sg-rsf-bullet {
          margin-top: 9px;
          display: inline-block;
          width: 5px;
          height: 5px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--sg-orange);
        }
        .sg-pill-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--sg-warm-white);
          color: var(--sg-site-dark);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 13px 26px;
          border-radius: 24px;
          transition: background-color 0.25s ease, color 0.25s ease;
          text-decoration: none;
        }
        .sg-pill-cta:hover { background: var(--sg-orange); color: var(--sg-warm-white); }

        /* Side by side — How It Works style: full-width black with grain texture */
        .sg-table-section {
          position: relative;
          background: var(--sg-site-dark);
          padding: 112px 20px 64px;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .sg-table-section { padding: 160px 64px 80px; }
        }
        /* Subtle grain texture overlay (matches main site .grain class) */
        .sg-table-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            radial-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          background-size: 3px 3px, 7px 7px;
          background-position: 0 0, 1px 2px;
          pointer-events: none;
          opacity: 0.6;
        }
        .sg-table-inner {
          position: relative;
          z-index: 1;
          max-width: 1024px;
          margin: 0 auto;
        }
        .sg-table-title {
          margin-top: 12px;
          font-weight: 900;
          font-size: clamp(30px, 4vw, 42px);
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: var(--sg-warm-white);
        }
        .sg-table-sub {
          margin-top: 12px;
          max-width: 640px;
          color: rgba(245, 240, 232, 0.7);
          font-size: 15px;
        }
        .sg-table-scroll {
          margin-top: 32px;
          overflow-x: auto;
        }
        .sg-table {
          width: 100%;
          min-width: 640px;
          border-collapse: collapse;
          text-align: left;
        }
        .sg-table thead th {
          padding: 12px 16px 12px 0;
          color: rgba(245, 240, 232, 0.5);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          border-bottom: 1px solid rgba(245, 240, 232, 0.1);
        }
        .sg-table tbody tr { border-bottom: 1px solid rgba(245, 240, 232, 0.08); }
        .sg-table tbody tr:last-child { border-bottom: 0; }
        .sg-table tbody td {
          padding: 16px 16px 16px 0;
          color: rgba(245, 240, 232, 0.9);
          font-size: 14px;
        }

        /* Final CTA */
        .sg-final-cta {
          margin: 0 12px 60px;
          background: var(--sg-warm-white);
          color: var(--sg-site-dark);
          border-radius: 24px;
          padding: 64px 24px;
          text-align: center;
        }
        @media (min-width: 768px) {
          .sg-final-cta { margin: 0 24px 64px; padding: 80px 32px; border-radius: 32px; }
        }
        @media (min-width: 1024px) {
          .sg-final-cta { margin: 0 40px 72px; }
        }
        .sg-final-cta .sg-pill-cta {
          background: var(--sg-site-dark);
          color: var(--sg-warm-white);
        }
        .sg-final-cta .sg-pill-cta:hover {
          background: var(--sg-orange);
          color: var(--sg-warm-white);
        }
        .sg-final-title {
          margin-top: 12px;
          font-weight: 900;
          font-size: clamp(34px, 4.5vw, 52px);
          letter-spacing: -0.02em;
          line-height: 1.05;
        }
        .sg-final-sub {
          margin: 16px auto 0;
          color: rgba(24, 24, 24, 0.65);
          max-width: 640px;
          line-height: 1.55;
        }
      `}</style>
    </main>
  )
}
