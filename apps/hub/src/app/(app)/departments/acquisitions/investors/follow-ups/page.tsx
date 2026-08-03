'use client'

import { useMemo, useState } from 'react'
import { useInvestorsData } from '@/lib/investors/useInvestorsData'
import { followUpItems, daysFromToday, dueText, nextBizDay } from '@/lib/investors/helpers'
import type { EntryRow } from '@/lib/investors/helpers'
import { StageChip } from '@/components/investors/StageChip'
import { PersonDrawer } from '@/components/investors/PersonDrawer'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

function Group({
  title,
  items,
  dealName,
  onOpen,
  onDone,
  onSnooze,
}: {
  title: string
  items: EntryRow[]
  dealName: (id: string) => string
  onOpen: (row: EntryRow) => void
  onDone: (row: EntryRow) => void
  onSnooze: (row: EntryRow) => void
}) {
  if (items.length === 0) return null
  return (
    <section className="mb-6">
      <h2 className="mb-3 font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
        {title} <span className="text-stone">({items.length})</span>
      </h2>
      <div className="space-y-2">
        {items.map((row) => (
          <div
            key={row.entry.id}
            className="hud-panel flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:border-stone/40"
          >
            <button onClick={() => onOpen(row)} className="flex-1 text-left">
              <p className="font-sans text-body font-medium text-warm-white">{row.investor.name}</p>
              <p className="font-sans text-body-sm text-stone">
                {dealName(row.entry.deal_id)} · {dueText(row.entry.next_follow_up)}
              </p>
            </button>
            <StageChip stage={row.entry.stage} />
            <button
              onClick={() => onDone(row)}
              className="rounded-md border border-surface-border px-2.5 py-1 font-sans text-body-sm text-stone hover:text-status-good"
            >
              Done
            </button>
            <button
              onClick={() => onSnooze(row)}
              className="rounded-md border border-surface-border px-2.5 py-1 font-sans text-body-sm text-stone hover:text-cyan"
            >
              Snooze
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function FollowUpsPage() {
  const { deals, entries, investorsById, loading, refetch, setPaused } = useInvestorsData()
  const [openInvestorId, setOpenInvestorId] = useState<string | null>(null)

  const items = useMemo(() => followUpItems(entries, investorsById), [entries, investorsById])
  const dealName = (id: string) => deals.find((d) => d.id === id)?.name ?? id

  function openDrawer(row: EntryRow) {
    setOpenInvestorId(row.investor.id)
    setPaused(true)
  }

  const overdue = items.filter((i) => (daysFromToday(i.entry.next_follow_up) ?? 0) < 0)
  const today = items.filter((i) => daysFromToday(i.entry.next_follow_up) === 0)
  const soon = items.filter((i) => {
    const d = daysFromToday(i.entry.next_follow_up)
    return d != null && d > 0 && d <= 7
  })
  const later = items.filter((i) => (daysFromToday(i.entry.next_follow_up) ?? 0) > 7)

  async function markDone(row: EntryRow) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_deal_investors').update({ next_follow_up: null }).eq('id', row.entry.id)
    refetch()
  }

  async function snooze(row: EntryRow) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_deal_investors').update({ next_follow_up: nextBizDay(7) }).eq('id', row.entry.id)
    refetch()
  }

  const openInvestor = openInvestorId ? investorsById.get(openInvestorId) : undefined
  const openEntries = openInvestorId ? entries.filter((e) => e.investor_id === openInvestorId) : []

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
        Follow-Ups
      </h1>
      <p className="mb-8 font-sans text-body text-stone">{items.length} outstanding across all deals</p>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">Nothing to follow up on. Clean slate.</p>
      ) : (
        <>
          <Group
            title="Overdue"
            items={overdue}
            dealName={dealName}
            onOpen={openDrawer}
            onDone={markDone}
            onSnooze={snooze}
          />
          <Group
            title="Today"
            items={today}
            dealName={dealName}
            onOpen={openDrawer}
            onDone={markDone}
            onSnooze={snooze}
          />
          <Group
            title="Next 7 days"
            items={soon}
            dealName={dealName}
            onOpen={openDrawer}
            onDone={markDone}
            onSnooze={snooze}
          />
          <Group
            title="Later"
            items={later}
            dealName={dealName}
            onOpen={openDrawer}
            onDone={markDone}
            onSnooze={snooze}
          />
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
