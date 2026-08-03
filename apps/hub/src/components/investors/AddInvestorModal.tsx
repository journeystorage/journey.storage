'use client'

import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubDeal, Stage } from '@/lib/investors/types'
import { STAGES } from '@/lib/investors/types'
import { nextBizDay } from '@/lib/investors/helpers'

const inputClass =
  'w-full rounded-md border border-surface-border bg-surface-base px-2.5 py-2 font-sans text-body-sm text-warm-white focus:border-cyan focus:outline-none'

interface AddInvestorModalProps {
  deals: HubDeal[]
  defaultName?: string
  defaultGroup?: string
  defaultDealId?: string
  onClose: () => void
  onAdded: () => void
}

export function AddInvestorModal({ deals, defaultName, defaultGroup, defaultDealId, onClose, onAdded }: AddInvestorModalProps) {
  const [name, setName] = useState(defaultName ?? '')
  const [group, setGroup] = useState(defaultGroup ?? '')
  const [introducer, setIntroducer] = useState('')
  const [email, setEmail] = useState('')
  const [dealId, setDealId] = useState(defaultDealId ?? deals[0]?.id ?? '')
  const [stage, setStage] = useState<Stage>('lead')
  const [amount, setAmount] = useState('')
  const [nextFollowUp, setNextFollowUp] = useState(nextBizDay(1))
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!name.trim()) return
    setSaving(true)
    const supabase = getSupabaseBrowser()
    const { data: investor, error } = await supabase
      .from('hub_investors')
      .insert({
        name: name.trim(),
        investor_group: group.trim() || null,
        introducer: introducer.trim() || null,
        emails: email.trim() ? [email.trim()] : [],
      })
      .select()
      .single()

    if (!error && investor && dealId) {
      await supabase.from('hub_deal_investors').insert({
        deal_id: dealId,
        investor_id: investor.id,
        stage,
        funded: stage === 'funded',
        amount: amount ? +amount : null,
        next_follow_up: nextFollowUp || null,
        notes: notes.trim() || null,
      })
    }

    setSaving(false)
    onAdded()
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} aria-hidden />
      <div className="fixed left-1/2 top-16 z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border border-surface-border bg-surface-elevated p-6">
        <h2 className="mb-1 font-display text-h2 font-bold text-warm-white">Add investor</h2>
        <p className="mb-4 font-sans text-body-sm text-stone">New relationship in the database</p>

        <div className="space-y-3">
          <div>
            <label className="hud-label mb-1 block">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="hud-label mb-1 block">Investor group / company</label>
            <input value={group} onChange={(e) => setGroup(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="hud-label mb-1 block">Introducer</label>
            <input value={introducer} onChange={(e) => setIntroducer(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="hud-label mb-1 block">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="hud-label mb-1 block">Deal</label>
              <select value={dealId} onChange={(e) => setDealId(e.target.value)} className={inputClass}>
                <option value="">None yet</option>
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="hud-label mb-1 block">Status</label>
              <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} className={inputClass}>
                {(Object.entries(STAGES) as [Stage, { label: string }][]).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="hud-label mb-1 block">Amount ($)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="hud-label mb-1 block">Next follow-up</label>
              <input type="date" value={nextFollowUp} onChange={(e) => setNextFollowUp(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="hud-label mb-1 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={save}
            disabled={saving || !name.trim()}
            className="rounded-md bg-cyan px-4 py-2 font-sans text-body-sm font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save investor'}
          </button>
          <button onClick={onClose} className="rounded-md border border-surface-border px-4 py-2 font-sans text-body-sm text-stone hover:text-warm-white">
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
