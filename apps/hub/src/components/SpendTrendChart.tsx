'use client'

import { useState } from 'react'
import type { DailySpendPoint } from '@/lib/cost'

const WIDTH = 100
const HEIGHT = 34
const PAD_TOP = 4

// Single-series change-over-time — one hue (cyan, the app's primary
// accent), thin 2px line, subtle area fill, rounded data-end on the most
// recent point. No legend needed: the panel title already names the series.
export function SpendTrendChart({ points }: { points: DailySpendPoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const max = Math.max(...points.map((p) => p.amountUsd), 0.01)
  const stepX = WIDTH / Math.max(points.length - 1, 1)
  const yFor = (v: number) => PAD_TOP + (1 - v / max) * (HEIGHT - PAD_TOP)

  const coords = points.map((p, i) => ({ x: i * stepX, y: yFor(p.amountUsd), point: p }))
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${HEIGHT} L ${coords[0].x} ${HEIGHT} Z`

  const hovered = hoverIdx != null ? coords[hoverIdx] : null
  const total = points.reduce((s, p) => s + p.amountUsd, 0)

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="hud-label">Spend, last {points.length}d</p>
        <p className="font-mono text-body-sm text-warm-white">${total.toFixed(2)}</p>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-16 w-full overflow-visible"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Recessive baseline only — no full grid, this is a sparkline not a report */}
        <line x1={0} y1={HEIGHT} x2={WIDTH} y2={HEIGHT} stroke="var(--color-surface-border)" strokeWidth={0.5} />

        <defs>
          <linearGradient id="spend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#spend-fill)" stroke="none" />
        <path d={linePath} fill="none" stroke="var(--color-cyan)" strokeWidth={0.9} vectorEffect="non-scaling-stroke" />

        {/* Rounded data-end on the latest point */}
        <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={1.6} fill="var(--color-cyan)" />

        {hovered && (
          <>
            <line x1={hovered.x} y1={PAD_TOP} x2={hovered.x} y2={HEIGHT} stroke="var(--color-cyan)" strokeWidth={0.4} strokeOpacity={0.5} />
            <circle cx={hovered.x} cy={hovered.y} r={1.8} fill="var(--color-surface-elevated)" stroke="var(--color-cyan)" strokeWidth={0.8} />
          </>
        )}

        {/* Wide invisible hit targets — bigger than the mark, one per day */}
        {coords.map((c, i) => (
          <rect
            key={c.point.date}
            x={i * stepX - stepX / 2}
            y={0}
            width={stepX}
            height={HEIGHT}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}
      </svg>
      <div className="relative h-4">
        {hovered && (
          <div
            className="hud-panel absolute -translate-x-1/2 whitespace-nowrap px-2 py-1"
            style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: -2 }}
          >
            <p className="font-mono text-label text-warm-white">
              {new Date(`${hovered.point.date}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' — '}
              ${hovered.point.amountUsd.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
