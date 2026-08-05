'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useInvestorsData } from '@/lib/investors/useInvestorsData'
import { dealStats, followUpItems, dueText, fmtUsd } from '@/lib/investors/helpers'
import { StageChip } from '@/components/investors/StageChip'
import { PersonDrawer } from '@/components/investors/PersonDrawer'

export default function InvestorsDashboardPage() {
  const { deals, investors, entries, investorsById, loading, refetch, setPaused } = useInvestorsData()
  const [openInvestorId, setOpenInvestorId] = useState<string | null>(null)

  const upNext = followUpItems(entries, investorsById).slice(0, 8)

  function openDrawer(id: string) {
    setOpenInvestorId(id)
    setPaused(true)
  }

  const openInvestor = openInvestorId ? investorsById.get(openInvestorId) : undefined
  const openEntries = openInvestorId ? entries.filter((e) => e.investor_id === openInvestorId) : []

  return (
    <div>
      <h1 className="mb-1 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
        Dashboard
      </h1>
      <p className="mb-8 font-sans text-body text-stone">{investors.length} people across {deals.length} deals</p>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4">
            {deals.map((deal) => {
              const stats = dealStats(deal.id, entries, investorsById)
              return (
                <Link key={deal.id} href={`/departments/investor-relations/investors/deals/${deal.id}`} className="hud-panel block p-5 transition-colors duration-150 hover:border-stone/40">
                  <p className="hud-label mb-3">{deal.name}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="font-sans text-body-sm text-stone">Funded</p>
                      <p className="font-display text-h3 font-bold text-status-good">{fmtUsd(stats.fundedSum) || '$0'}</p>
                    </div>
                    <div>
                      <p className="font-sans text-body-sm text-stone">Committed</p>
                      <p className="font-display text-h3 font-bold text-cyan">{fmtUsd(stats.commitSum) || '$0'}</p>
                    </div>
                    <div>
                      <p className="font-sans text-body-sm text-stone">Leads</p>
                      <p className="font-display text-h3 font-bold text-orange">{stats.leads.length}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
            {deals.length === 0 && (
              <p className="font-sans text-body-sm text-stone">No deals yet.</p>
            )}
          </div>

          <div className="hud-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-h3 font-bold uppercase tracking-wide text-warm-white">Up next</h2>
              <Link href="/departments/investor-relations/investors/follow-ups" className="font-sans text-body-sm text-cyan hover:text-cyan-400">
                All follow-ups →
              </Link>
            </div>
            {upNext.length === 0 ? (
              <p className="font-sans text-body-sm text-stone">Nothing due. Clean slate.</p>
            ) : (
              <div className="space-y-2">
                {upNext.map((row) => (
                  <button
                    key={row.entry.id}
                    onClick={() => openDrawer(row.investor.id)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-floating"
                  >
                    <span className="flex-1 font-sans text-body-sm font-medium text-warm-white">{row.investor.name}</span>
                    <StageChip stage={row.entry.stage} />
                    <span className="w-20 shrink-0 text-right font-sans text-body-sm text-stone">{dueText(row.entry.next_follow_up)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
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
    </div>
  )
}
