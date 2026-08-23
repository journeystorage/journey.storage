'use client'

import { useEffect, useState } from 'react'
import { HudNumber } from '@/components/HudNumber'

interface CommandHeaderProps {
  totalOpen: number
  overdueCount: number
  spendTodayUsd: number
  employeeCount: number
}

// Live command strip — the "mission clock" at the top of the control room.
// Ticks client-side; everything else arrives from the server snapshot.
export function CommandHeader({ totalOpen, overdueCount, spendTodayUsd, employeeCount }: CommandHeaderProps) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now
    ? now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : '--:--:--'
  const date = now
    ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : ''

  const readouts = [
    { label: 'Open', value: totalOpen, tone: 'text-warm-white' },
    { label: 'Overdue', value: overdueCount, tone: overdueCount > 0 ? 'text-danger' : 'text-status-good' },
    {
      label: 'AI spend today',
      value: spendTodayUsd,
      format: (n: number) => `$${n.toFixed(2)}`,
      tone: 'text-warm-white',
    },
    { label: 'Agents', value: employeeCount, tone: 'text-warm-white' },
  ]

  return (
    <header className="mb-8 flex items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="hub-pulse-dot h-2 w-2 rounded-full bg-status-good" aria-hidden />
          <p className="hud-label">Journey.Storage · Command</p>
        </div>
        <h1 className="mt-1 font-display text-display font-bold uppercase leading-none tracking-tight text-warm-white">
          Control room
        </h1>
        <p className="mt-2 font-sans text-body-sm text-stone" suppressHydrationWarning>
          {date}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hud-corners hidden gap-6 rounded-md px-4 py-2 md:flex">
          {readouts.map((r) => (
            <div key={r.label} className="text-right">
              <p className={`font-mono text-h2 font-medium leading-none ${r.tone}`}>
                <HudNumber value={r.value} format={r.format} />
              </p>
              <p className="hud-label mt-1">{r.label}</p>
            </div>
          ))}
        </div>
        <div className="border-l border-surface-border pl-6 text-right">
          <p className="font-mono text-h1 font-medium leading-none text-cyan" suppressHydrationWarning>
            {time}
          </p>
          <p className="hud-label mt-1">Central</p>
        </div>
      </div>
    </header>
  )
}
