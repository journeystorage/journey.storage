import Link from 'next/link'
import type { DepartmentSlug } from '@/lib/departments'
import { HudNumber } from '@/components/HudNumber'

export interface DepartmentStat {
  slug: DepartmentSlug
  label: string
  accent: string
  openCount: number
  employeeCount: number
  highPriorityCount: number
  overdueCount: number
}

const ORBIT_RADIUS_PCT = 36
const NODE_BASE = 60
const NODE_SCALE = 13
const NODE_MAX = 104

function nodePosition(index: number, total: number) {
  const angle = -90 + index * (360 / total)
  const radians = (angle * Math.PI) / 180
  return {
    left: `${50 + ORBIT_RADIUS_PCT * Math.cos(radians)}%`,
    top: `${50 + ORBIT_RADIUS_PCT * Math.sin(radians)}%`,
  }
}

function nodeSize(openCount: number) {
  return Math.min(NODE_BASE + Math.sqrt(openCount) * NODE_SCALE, NODE_MAX)
}

export function OrbitalOverview({
  totalOpen,
  departments,
}: {
  totalOpen: number
  departments: DepartmentStat[]
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      {/* Radar sweep — slow rotating wedge behind everything */}
      <div
        className="hub-radar-sweep absolute rounded-full"
        style={{ inset: `${50 - ORBIT_RADIUS_PCT - 6}%` }}
        aria-hidden
      />

      {/* Orbit ring + spokes — decorative structure only, no data encoded here */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <g className="hub-orbit-spin">
          <circle
            cx="50"
            cy="50"
            r={ORBIT_RADIUS_PCT}
            fill="none"
            stroke="var(--color-surface-border)"
            strokeWidth="0.4"
            strokeDasharray="1.5 2"
          />
          <circle
            cx="50"
            cy="50"
            r={ORBIT_RADIUS_PCT + 6}
            fill="none"
            stroke="var(--color-surface-border)"
            strokeWidth="0.2"
            strokeDasharray="0.5 4"
            opacity="0.6"
          />
        </g>
        {departments.map((dept, i) => {
          const pos = nodePosition(i, departments.length)
          return (
            <line
              key={dept.slug}
              x1="50"
              y1="50"
              x2={parseFloat(pos.left)}
              y2={parseFloat(pos.top)}
              stroke="var(--color-surface-border)"
              strokeWidth="0.3"
            />
          )
        })}
      </svg>

      {/* Core — the single headline number: total open work across the company */}
      <div
        className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan/30 bg-surface-elevated"
        style={{ boxShadow: 'var(--shadow-glow-cyan)' }}
      >
        <span className="hub-core-breathe absolute -inset-1 rounded-full border border-cyan/20" aria-hidden />
        <span className="font-mono text-h1 font-medium leading-none text-warm-white">
          <HudNumber value={totalOpen} />
        </span>
        <span className="hud-label mt-1">Open</span>
      </div>

      {departments.map((dept, i) => {
        const pos = nodePosition(i, departments.length)
        const size = nodeSize(dept.openCount)
        const hasOverdue = dept.overdueCount > 0
        const hasHighPriority = dept.highPriorityCount > 0

        return (
          <Link
            key={dept.slug}
            href={`/departments/${dept.slug}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: pos.left, top: pos.top }}
          >
            {(hasOverdue || hasHighPriority) && (
              <span
                className="hub-pulse-dot absolute -inset-2 rounded-full"
                style={{ boxShadow: `0 0 0 1px ${hasOverdue ? 'var(--color-danger)' : 'var(--color-orange)'}33` }}
                aria-hidden
              />
            )}
            <span
              className="relative flex flex-col items-center justify-center rounded-full border-2 bg-surface-elevated transition-transform duration-150 ease-out group-hover:scale-105"
              style={{ width: size, height: size, borderColor: dept.accent, backgroundColor: `${dept.accent}1A` }}
            >
              <span className="font-mono text-h3 font-medium leading-none text-warm-white">{dept.openCount}</span>
              {(hasOverdue || hasHighPriority) && (
                <span
                  className={`absolute -right-1 -top-1 flex items-center gap-0.5 px-1.5 py-0.5 font-sans text-[0.625rem] font-bold leading-none text-black ${
                    hasOverdue ? 'rounded-sm' : 'rounded-full'
                  }`}
                  style={{ backgroundColor: hasOverdue ? 'var(--color-danger)' : 'var(--color-orange)' }}
                >
                  {hasOverdue ? dept.overdueCount : dept.highPriorityCount}
                </span>
              )}
            </span>
            <p className="mt-2 whitespace-nowrap font-sans text-body-sm font-medium text-warm-white group-hover:text-cyan">
              {dept.label}
            </p>
            <p className="hud-label whitespace-nowrap">
              {dept.employeeCount} employee{dept.employeeCount === 1 ? '' : 's'}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
