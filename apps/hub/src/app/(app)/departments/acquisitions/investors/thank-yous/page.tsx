'use client'

import { useState } from 'react'
import { useInvestorsData } from '@/lib/investors/useInvestorsData'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubInvestor } from '@/lib/investors/types'

const TOGGLE_FIELDS = [
  ['thank_you_email', 'Email'],
  ['thank_you_card', 'Card'],
  ['thank_you_gift', 'Gift'],
] as const

export default function ThankYousPage() {
  const { investors, loading, refetch } = useInvestorsData()
  const [notesById, setNotesById] = useState<Record<string, string>>({})

  const people = investors.filter((inv) => inv.has_thank_you).sort((a, b) => a.name.localeCompare(b.name))

  async function toggle(investor: HubInvestor, field: (typeof TOGGLE_FIELDS)[number][0]) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_investors').update({ [field]: !investor[field] }).eq('id', investor.id)
    refetch()
  }

  async function saveNotes(investor: HubInvestor, value: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_investors').update({ thank_you_notes: value }).eq('id', investor.id)
    refetch()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
        Thank Yous
      </h1>
      <p className="mb-8 font-sans text-body text-stone">{people.length} people to thank</p>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : people.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">Nobody flagged for a thank-you yet.</p>
      ) : (
        <div className="space-y-3">
          {people.map((inv) => (
            <div key={inv.id} className="hud-panel p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-sans text-body font-medium text-warm-white">{inv.name}</p>
                <div className="flex gap-2">
                  {TOGGLE_FIELDS.map(([field, label]) => (
                    <button
                      key={field}
                      onClick={() => toggle(inv, field)}
                      className={`rounded-full px-3 py-1 font-sans text-body-sm ${
                        inv[field] ? 'bg-status-good/15 text-status-good' : 'bg-surface-floating text-stone'
                      }`}
                    >
                      {label} {inv[field] ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                defaultValue={notesById[inv.id] ?? inv.thank_you_notes ?? ''}
                onChange={(e) => setNotesById((prev) => ({ ...prev, [inv.id]: e.target.value }))}
                onBlur={(e) => saveNotes(inv, e.target.value)}
                rows={2}
                placeholder="Notes…"
                className="w-full resize-none rounded-md bg-transparent px-1 py-1 font-sans text-body-sm text-warm-white placeholder:text-stone/60 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
