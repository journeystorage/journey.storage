'use client'

import { useState } from 'react'
import type { DepartmentStat } from '@/components/OrbitalOverview'

// Magnitude across categorical entities — one bar per department. Color
// follows the department's own established identity color (same accent
// used everywhere else in the app — sidebar dots, orbital nodes), sorted
// by magnitude rather than alphabetically so the one close CVD pair
// (sand/sage) rarely lands adjacent, and every bar carries its name as a
// direct label — color is never the only way to tell two bars apart.
export function DepartmentLoadChart({ departments }: { departments: DepartmentStat[] }) {
  const [hoverSlug, setHoverSlug] = useState<string | null>(null)
  const sorted = [...departments].sort((a, b) => b.openCount - a.openCount)
  const max = Math.max(...sorted.map((d) => d.openCount), 1)

  return (
    <div className="space-y-2.5">
      {sorted.map((dept) => {
        const pct = (dept.openCount / max) * 100
        const isHovered = hoverSlug === dept.slug
        return (
          <div
            key={dept.slug}
            className="group relative"
            onMouseEnter={() => setHoverSlug(dept.slug)}
            onMouseLeave={() => setHoverSlug(null)}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-sans text-body-sm font-medium text-warm-white">{dept.label}</span>
              <span className="font-mono text-body-sm text-stone">{dept.openCount}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-floating">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${Math.max(pct, dept.openCount > 0 ? 3 : 0)}%`,
                  backgroundColor: dept.accent,
                  opacity: isHovered ? 1 : 0.85,
                }}
              />
            </div>
            {isHovered && (dept.overdueCount > 0 || dept.highPriorityCount > 0) && (
              <div className="hud-panel absolute right-0 top-full z-10 mt-1 whitespace-nowrap px-2 py-1">
                <p className="font-sans text-label text-stone">
                  {dept.overdueCount > 0 && <span className="text-danger">{dept.overdueCount} overdue</span>}
                  {dept.overdueCount > 0 && dept.highPriorityCount > 0 && ' · '}
                  {dept.highPriorityCount > 0 && <span className="text-orange">{dept.highPriorityCount} high priority</span>}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
