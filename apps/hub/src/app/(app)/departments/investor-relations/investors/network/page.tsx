'use client'

import { useMemo, useState } from 'react'
import { useInvestorsData } from '@/lib/investors/useInvestorsData'
import { fmtUsd } from '@/lib/investors/helpers'
import { PersonDrawer } from '@/components/investors/PersonDrawer'

interface IntroducerRow {
  introducer: string
  count: number
  funded: number
  committed: number
  amount: number
}

export default function NetworkPage() {
  const { deals, investors, entries, investorsById, loading, refetch, setPaused } = useInvestorsData()
  const [openInvestorId, setOpenInvestorId] = useState<string | null>(null)

  const leaderboard = useMemo(() => {
    const byIntroducer = new Map<string, IntroducerRow>()
    for (const inv of investors) {
      const name = inv.introducer?.trim()
      if (!name) continue
      const row = byIntroducer.get(name) ?? { introducer: name, count: 0, funded: 0, committed: 0, amount: 0 }
      row.count += 1
      const invEntries = entries.filter((e) => e.investor_id === inv.id)
      row.funded += invEntries.filter((e) => e.funded).length
      row.committed += invEntries.filter((e) => e.stage === 'committed').length
      row.amount += invEntries.reduce((s, e) => (e.funded || e.stage === 'committed' ? s + (e.amount ?? 0) : s), 0)
      byIntroducer.set(name, row)
    }
    return [...byIntroducer.values()].sort((a, b) => b.amount - a.amount || b.count - a.count)
  }, [investors, entries])

  function openIntroducer(name: string) {
    const match = investors.find((inv) => inv.name === name)
    if (!match) return
    setOpenInvestorId(match.id)
    setPaused(true)
  }

  const openInvestor = openInvestorId ? investorsById.get(openInvestorId) : undefined
  const openEntries = openInvestorId ? entries.filter((e) => e.investor_id === openInvestorId) : []

  return (
    <div>
      <h1 className="mb-1 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
        Network
      </h1>
      <p className="mb-8 font-sans text-body text-stone">Introducer leaderboard — who's bringing capital in</p>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : leaderboard.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">No introducers logged yet.</p>
      ) : (
        <div className="hud-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="hud-label px-4 py-2.5 text-left">Introducer</th>
                <th className="hud-label px-4 py-2.5 text-right">Introduced</th>
                <th className="hud-label px-4 py-2.5 text-right">Committed</th>
                <th className="hud-label px-4 py-2.5 text-right">Funded</th>
                <th className="hud-label px-4 py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr
                  key={row.introducer}
                  onClick={() => openIntroducer(row.introducer)}
                  className="cursor-pointer border-b border-surface-border/60 transition-colors duration-150 last:border-0 hover:bg-surface-floating"
                >
                  <td className="px-4 py-3 font-sans text-body-sm font-medium text-warm-white">{row.introducer}</td>
                  <td className="px-4 py-3 text-right font-sans text-body-sm text-stone">{row.count}</td>
                  <td className="px-4 py-3 text-right font-sans text-body-sm text-cyan">{row.committed}</td>
                  <td className="px-4 py-3 text-right font-sans text-body-sm text-status-good">{row.funded}</td>
                  <td className="px-4 py-3 text-right font-sans text-body-sm text-warm-white">{fmtUsd(row.amount) || '—'}</td>
                </tr>
              ))}
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
    </div>
  )
}
