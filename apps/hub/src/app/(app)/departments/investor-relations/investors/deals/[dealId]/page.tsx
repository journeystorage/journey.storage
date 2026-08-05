'use client'

import { use, useState } from 'react'
import { useInvestorsData } from '@/lib/investors/useInvestorsData'
import { dealStats } from '@/lib/investors/helpers'
import { BOARD_COLUMNS, STAGES } from '@/lib/investors/types'
import { fmtUsd } from '@/lib/investors/helpers'
import { PersonDrawer } from '@/components/investors/PersonDrawer'
import { AddInvestorModal } from '@/components/investors/AddInvestorModal'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

export default function DealBoardPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = use(params)
  const { deals, entries, investorsById, loading, refetch, setPaused } = useInvestorsData()
  const [openInvestorId, setOpenInvestorId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [notes, setNotes] = useState<string | null>(null)

  const deal = deals.find((d) => d.id === dealId)
  const stats = dealStats(dealId, entries, investorsById)

  function openDrawer(id: string) {
    setOpenInvestorId(id)
    setPaused(true)
  }

  async function saveNotes(value: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_deals').update({ working_notes: value }).eq('id', dealId)
    refetch()
  }

  const openInvestor = openInvestorId ? investorsById.get(openInvestorId) : undefined
  const openEntries = openInvestorId ? entries.filter((e) => e.investor_id === openInvestorId) : []

  if (!loading && !deal) {
    return <p className="font-sans text-body-sm text-stone">Deal not found.</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
            {deal?.name ?? '…'}
          </h1>
          {deal?.description && <p className="font-sans text-body text-stone">{deal.description}</p>}
        </div>
        <button
          onClick={() => setAdding(true)}
          className="shrink-0 rounded-md bg-cyan px-4 py-2 font-sans text-body-sm font-semibold text-black hover:bg-cyan-400"
        >
          + Add investor
        </button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-3">
        <div className="hud-panel p-4">
          <p className="hud-label mb-1">Funded</p>
          <p className="font-display text-h2 font-bold text-status-good">{fmtUsd(stats.fundedSum) || '$0'}</p>
        </div>
        <div className="hud-panel p-4">
          <p className="hud-label mb-1">Committed</p>
          <p className="font-display text-h2 font-bold text-cyan">{fmtUsd(stats.commitSum) || '$0'}</p>
        </div>
        <div className="hud-panel p-4">
          <p className="hud-label mb-1">Backup</p>
          <p className="font-display text-h2 font-bold text-warm-white">{fmtUsd(stats.backupSum) || '$0'}</p>
        </div>
        <div className="hud-panel p-4">
          <p className="hud-label mb-1">Active leads</p>
          <p className="font-display text-h2 font-bold text-orange">{stats.leads.length}</p>
        </div>
      </div>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : (
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {BOARD_COLUMNS.map((stage) => {
            const cards = stats.entries.filter((e) => e.entry.stage === stage)
            return (
              <div key={stage} className="w-64 shrink-0">
                <p className="hud-label mb-2 px-1">
                  {STAGES[stage].label} <span className="text-stone/60">({cards.length})</span>
                </p>
                <div className="space-y-2">
                  {cards.map((row) => (
                    <button
                      key={row.entry.id}
                      onClick={() => openDrawer(row.investor.id)}
                      className="hud-panel block w-full p-3 text-left transition-colors duration-150 hover:border-stone/40"
                    >
                      <p className="font-sans text-body-sm font-medium text-warm-white">{row.investor.name}</p>
                      {row.entry.amount ? (
                        <p className="font-sans text-body-sm text-stone">{fmtUsd(row.entry.amount)}</p>
                      ) : null}
                    </button>
                  ))}
                  {cards.length === 0 && <p className="px-1 font-sans text-body-sm text-stone/50">—</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {deal && (
        <div>
          <p className="hud-label mb-1.5">Working notes</p>
          <textarea
            defaultValue={notes ?? deal.working_notes ?? ''}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={(e) => saveNotes(e.target.value)}
            rows={5}
            placeholder="Strategy, context, next moves…"
            className="hud-panel w-full resize-none p-4 font-sans text-body-sm text-warm-white placeholder:text-stone/60 focus:outline-none"
          />
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
          defaultDealId={dealId}
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
