'use client'

import { useMemo, useState } from 'react'
import { useInvestorsData } from '@/lib/investors/useInvestorsData'
import type { Stage } from '@/lib/investors/types'
import { STAGES } from '@/lib/investors/types'
import { StageChip } from '@/components/investors/StageChip'
import { PersonDrawer } from '@/components/investors/PersonDrawer'
import { AddInvestorModal } from '@/components/investors/AddInvestorModal'

export default function InvestorsListPage() {
  const { deals, investors, entries, investorsById, loading, refetch, setPaused } = useInvestorsData()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all')
  const [openInvestorId, setOpenInvestorId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const entriesByInvestor = useMemo(() => {
    const map = new Map<string, typeof entries>()
    for (const e of entries) {
      map.set(e.investor_id, [...(map.get(e.investor_id) ?? []), e])
    }
    return map
  }, [entries])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return investors
      .filter((inv) => {
        if (stageFilter !== 'all' && !entriesByInvestor.get(inv.id)?.some((e) => e.stage === stageFilter)) return false
        if (!q) return true
        return (
          inv.name.toLowerCase().includes(q) ||
          (inv.investor_group ?? '').toLowerCase().includes(q) ||
          (inv.introducer ?? '').toLowerCase().includes(q) ||
          inv.emails.some((e) => e.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [investors, entriesByInvestor, search, stageFilter])

  function openDrawer(id: string) {
    setOpenInvestorId(id)
    setPaused(true)
  }

  const openInvestor = openInvestorId ? investorsById.get(openInvestorId) : undefined
  const openEntries = openInvestorId ? entries.filter((e) => e.investor_id === openInvestorId) : []

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
            Investors
          </h1>
          <p className="font-sans text-body text-stone">{investors.length} people in the database</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="shrink-0 rounded-md bg-cyan px-4 py-2 font-sans text-body-sm font-semibold text-black hover:bg-cyan-400"
        >
          + Add investor
        </button>
      </div>

      <div className="mb-5 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, group, introducer, email…"
          suppressHydrationWarning
          className="flex-1 rounded-md border border-surface-border bg-surface-base px-3 py-2 font-sans text-body-sm text-warm-white placeholder:text-stone/60 focus:border-cyan focus:outline-none"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as Stage | 'all')}
          className="rounded-md border border-surface-border bg-surface-base px-3 py-2 font-sans text-body-sm text-warm-white focus:border-cyan focus:outline-none"
        >
          <option value="all">All statuses</option>
          {(Object.entries(STAGES) as [Stage, { label: string }][]).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : (
        <div className="hud-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="hud-label px-4 py-2.5 text-left">Name</th>
                <th className="hud-label px-4 py-2.5 text-left">Group</th>
                <th className="hud-label px-4 py-2.5 text-left">Introducer</th>
                <th className="hud-label px-4 py-2.5 text-left">Email</th>
                <th className="hud-label px-4 py-2.5 text-left">Deals</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => openDrawer(inv.id)}
                  className="cursor-pointer border-b border-surface-border/60 transition-colors duration-150 last:border-0 hover:bg-surface-floating"
                >
                  <td className="px-4 py-3 font-sans text-body-sm font-medium text-warm-white">{inv.name}</td>
                  <td className="px-4 py-3 font-sans text-body-sm text-stone">{inv.investor_group || '—'}</td>
                  <td className="px-4 py-3 font-sans text-body-sm text-stone">{inv.introducer || '—'}</td>
                  <td className="px-4 py-3 font-sans text-body-sm text-stone">{inv.emails[0] || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(entriesByInvestor.get(inv.id) ?? []).map((e) => (
                        <StageChip key={e.id} stage={e.stage} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center font-sans text-body-sm text-stone">
                    No matches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {openInvestor && (
        <PersonDrawer
          investor={openInvestor}
          entries={openEntries}
          deals={deals}
          onClose={() => {
            setOpenInvestorId(null)
            setPaused(false)
          }}
          onChanged={refetch}
        />
      )}

      {adding && (
        <AddInvestorModal
          deals={deals}
          onClose={() => setAdding(false)}
          onAdded={() => {
            setAdding(false)
            refetch()
          }}
        />
      )}
    </div>
  )
}
