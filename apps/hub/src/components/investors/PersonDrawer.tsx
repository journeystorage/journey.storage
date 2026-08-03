'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubDeal, HubDealInvestor, HubInvestor, Stage } from '@/lib/investors/types'
import { STAGES } from '@/lib/investors/types'
import { nextBizDay, todayISO } from '@/lib/investors/helpers'
import { StageChip } from './StageChip'

const inputClass =
  'w-full rounded-md border border-surface-border bg-surface-base px-2.5 py-2 font-sans text-body-sm text-warm-white focus:border-cyan focus:outline-none'

interface PersonDrawerProps {
  investor: HubInvestor
  entries: HubDealInvestor[]
  deals: HubDeal[]
  onClose: () => void
  onChanged: () => void
}

export function PersonDrawer({ investor, entries, deals, onClose, onChanged }: PersonDrawerProps) {
  const [group, setGroup] = useState(investor.investor_group ?? '')
  const [introducer, setIntroducer] = useState(investor.introducer ?? '')
  const [emails, setEmails] = useState((investor.emails ?? []).join(', '))

  useEffect(() => {
    setGroup(investor.investor_group ?? '')
    setIntroducer(investor.introducer ?? '')
    setEmails((investor.emails ?? []).join(', '))
  }, [investor])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function saveInvestorFields() {
    const supabase = getSupabaseBrowser()
    await supabase
      .from('hub_investors')
      .update({
        investor_group: group,
        introducer,
        emails: emails.split(',').map((s) => s.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      })
      .eq('id', investor.id)
    onChanged()
  }

  async function updateEntry(entryId: string, patch: Record<string, unknown>) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_deal_investors').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', entryId)
    onChanged()
  }

  async function addToDeal(dealId: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_deal_investors').insert({ deal_id: dealId, investor_id: investor.id, stage: 'lead' })
    onChanged()
  }

  async function toggleThankYou(field: 'thank_you_email' | 'thank_you_card' | 'thank_you_gift') {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_investors').update({ [field]: !investor[field] }).eq('id', investor.id)
    onChanged()
  }

  const otherDeals = deals.filter((d) => !entries.some((e) => e.deal_id === d.id))

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} aria-hidden />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-surface-border bg-surface-elevated p-7">
        <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 font-sans text-h3 text-stone hover:text-warm-white">
          ×
        </button>

        <p className="hud-label">{investor.investor_group || 'Individual'}</p>
        <h2 className="mb-5 font-display text-h1 font-black text-warm-white">{investor.name}</h2>

        <div className="mb-6 space-y-3">
          <div>
            <label className="hud-label mb-1 block">Group</label>
            <input value={group} onChange={(e) => setGroup(e.target.value)} onBlur={saveInvestorFields} className={inputClass} />
          </div>
          <div>
            <label className="hud-label mb-1 block">Introducer</label>
            <input value={introducer} onChange={(e) => setIntroducer(e.target.value)} onBlur={saveInvestorFields} className={inputClass} />
          </div>
          <div>
            <label className="hud-label mb-1 block">Email</label>
            <input
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              onBlur={saveInvestorFields}
              placeholder="add email…"
              className={inputClass}
            />
          </div>
        </div>

        {entries.map((entry) => {
          const deal = deals.find((d) => d.id === entry.deal_id)
          return (
            <div key={entry.id} className="hud-panel mb-4 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="hud-label text-cyan">{deal?.name ?? entry.deal_id}</span>
                <StageChip stage={entry.stage} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="hud-label mb-1 block">Status</label>
                  <select
                    value={entry.stage}
                    onChange={(e) => updateEntry(entry.id, { stage: e.target.value, funded: e.target.value === 'funded' })}
                    className={inputClass}
                  >
                    {(Object.entries(STAGES) as [Stage, { label: string }][]).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="hud-label mb-1 block">Amount ($)</label>
                  <input
                    type="number"
                    defaultValue={entry.amount ?? ''}
                    onBlur={(e) => updateEntry(entry.id, { amount: e.target.value ? +e.target.value : null })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="hud-label mb-1 block">Last outreach</label>
                  <input
                    type="date"
                    defaultValue={entry.last_outreach ?? ''}
                    onChange={(e) => updateEntry(entry.id, { last_outreach: e.target.value || null })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="hud-label mb-1 block">Last connection</label>
                  <input
                    type="date"
                    defaultValue={entry.last_connection ?? ''}
                    onChange={(e) => updateEntry(entry.id, { last_connection: e.target.value || null })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="hud-label mb-1 block">Next follow-up</label>
                  <input
                    type="date"
                    defaultValue={entry.next_follow_up ?? ''}
                    onChange={(e) => updateEntry(entry.id, { next_follow_up: e.target.value || null })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="hud-label mb-1 block">Backup amount</label>
                  <input
                    type="number"
                    defaultValue={entry.backup_amount ?? ''}
                    onBlur={(e) => updateEntry(entry.id, { backup_amount: e.target.value ? +e.target.value : null })}
                    className={inputClass}
                  />
                </div>
              </div>
              <label className="hud-label mb-1 mt-3 block">Notes / feedback</label>
              <textarea
                defaultValue={entry.notes ?? ''}
                onBlur={(e) => updateEntry(entry.id, { notes: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => updateEntry(entry.id, { last_outreach: todayISO(), last_connection: todayISO() })}
                  className="rounded-md bg-cyan px-3 py-1.5 font-sans text-body-sm font-semibold text-black hover:bg-cyan-400"
                >
                  Log a touch today
                </button>
                <button
                  onClick={() => updateEntry(entry.id, { next_follow_up: nextBizDay(1) })}
                  className="rounded-md border border-surface-border px-3 py-1.5 font-sans text-body-sm text-stone hover:text-warm-white"
                >
                  Follow up tomorrow
                </button>
                <button
                  onClick={() => updateEntry(entry.id, { next_follow_up: nextBizDay(7) })}
                  className="rounded-md border border-surface-border px-3 py-1.5 font-sans text-body-sm text-stone hover:text-warm-white"
                >
                  Next week
                </button>
              </div>
            </div>
          )
        })}

        {otherDeals.map((d) => (
          <button
            key={d.id}
            onClick={() => addToDeal(d.id)}
            className="mb-2 mr-2 rounded-md border border-surface-border px-3 py-1.5 font-sans text-body-sm text-stone hover:border-cyan hover:text-cyan"
          >
            + Add to {d.name}
          </button>
        ))}

        {investor.has_thank_you && (
          <div className="hud-panel mt-4 p-4">
            <p className="hud-label mb-2">Thank you</p>
            <div className="flex gap-2">
              {(
                [
                  ['thank_you_email', 'Email'],
                  ['thank_you_card', 'Card'],
                  ['thank_you_gift', 'Gift'],
                ] as const
              ).map(([field, label]) => (
                <button
                  key={field}
                  onClick={() => toggleThankYou(field)}
                  className={`rounded-full px-3 py-1 font-sans text-body-sm ${
                    investor[field] ? 'bg-status-good/15 text-status-good' : 'bg-surface-floating text-stone'
                  }`}
                >
                  {label} {investor[field] ? '✓' : ''}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
