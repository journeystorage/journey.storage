'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubFamilyOffice, HubFinderBroker, HubSlDirectoryRow } from '@/lib/investors/types'

type Tab = 'offices' | 'finders' | 'directory'

export default function ProspectsPage() {
  const [tab, setTab] = useState<Tab>('offices')
  const [offices, setOffices] = useState<HubFamilyOffice[]>([])
  const [finders, setFinders] = useState<HubFinderBroker[]>([])
  const [directory, setDirectory] = useState<HubSlDirectoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowser()
      const [{ data: officeRows }, { data: finderRows }, { data: dirRows }] = await Promise.all([
        supabase.from('hub_family_offices').select('*').order('office', { ascending: true }),
        supabase.from('hub_finders_brokers').select('*').order('affiliation', { ascending: true }),
        supabase.from('hub_sl_directory').select('*').order('name', { ascending: true }),
      ])
      setOffices((officeRows as HubFamilyOffice[]) ?? [])
      setFinders((finderRows as HubFinderBroker[]) ?? [])
      setDirectory((dirRows as HubSlDirectoryRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const q = search.trim().toLowerCase()

  const filteredOffices = offices.filter(
    (o) => !q || o.office.toLowerCase().includes(q) || (o.contacts ?? '').toLowerCase().includes(q),
  )
  const filteredFinders = finders.filter(
    (f) =>
      !q ||
      (f.affiliation ?? '').toLowerCase().includes(q) ||
      (f.contacts ?? '').toLowerCase().includes(q) ||
      (f.type ?? '').toLowerCase().includes(q),
  )
  const filteredDirectory = directory.filter(
    (r) =>
      !q ||
      (r.name ?? '').toLowerCase().includes(q) ||
      (r.org ?? '').toLowerCase().includes(q) ||
      (r.dba ?? '').toLowerCase().includes(q) ||
      (r.city ?? '').toLowerCase().includes(q),
  )

  return (
    <div>
      <h1 className="mb-1 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
        Prospects
      </h1>
      <p className="mb-6 font-sans text-body text-stone">Family offices, finders/brokers, and the storage-industry directory</p>

      <div className="mb-5 flex items-center gap-4">
        <div className="flex gap-1">
          {(
            [
              ['offices', `Family Offices (${offices.length})`],
              ['finders', `Finders & Brokers (${finders.length})`],
              ['directory', `SL Directory (${directory.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-md px-3 py-2 font-sans text-body-sm font-medium transition-colors duration-150 ${
                tab === key ? 'bg-cyan/10 text-cyan' : 'text-stone hover:text-warm-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          suppressHydrationWarning
          className="flex-1 rounded-md border border-surface-border bg-surface-base px-3 py-2 font-sans text-body-sm text-warm-white placeholder:text-stone/60 focus:border-cyan focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : (
        <div className="hud-panel overflow-hidden">
          {tab === 'offices' && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="hud-label px-4 py-2.5 text-left">Office</th>
                  <th className="hud-label px-4 py-2.5 text-left">Contacts</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffices.map((o) => (
                  <tr key={o.id} className="border-b border-surface-border/60 last:border-0">
                    <td className="px-4 py-3 font-sans text-body-sm font-medium text-warm-white">{o.office}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{o.contacts || '—'}</td>
                  </tr>
                ))}
                {filteredOffices.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center font-sans text-body-sm text-stone">No matches.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {tab === 'finders' && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="hud-label px-4 py-2.5 text-left">Affiliation</th>
                  <th className="hud-label px-4 py-2.5 text-left">Type</th>
                  <th className="hud-label px-4 py-2.5 text-left">Contacts</th>
                  <th className="hud-label px-4 py-2.5 text-left">Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinders.map((f) => (
                  <tr key={f.id} className="border-b border-surface-border/60 last:border-0">
                    <td className="px-4 py-3 font-sans text-body-sm font-medium text-warm-white">{f.affiliation || '—'}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{f.type || '—'}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{f.contacts || '—'}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{f.comments || '—'}</td>
                  </tr>
                ))}
                {filteredFinders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center font-sans text-body-sm text-stone">No matches.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {tab === 'directory' && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="hud-label px-4 py-2.5 text-left">Name</th>
                  <th className="hud-label px-4 py-2.5 text-left">Org / DBA</th>
                  <th className="hud-label px-4 py-2.5 text-left">City, State</th>
                  <th className="hud-label px-4 py-2.5 text-left">Facilities</th>
                  <th className="hud-label px-4 py-2.5 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredDirectory.map((r) => (
                  <tr key={r.id} className="border-b border-surface-border/60 last:border-0">
                    <td className="px-4 py-3 font-sans text-body-sm font-medium text-warm-white">{r.name || '—'}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{[r.org, r.dba].filter(Boolean).join(' · ') || '—'}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{[r.city, r.state].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{r.facilities || '—'}</td>
                    <td className="px-4 py-3 font-sans text-body-sm text-stone">{r.email || r.phone || '—'}</td>
                  </tr>
                ))}
                {filteredDirectory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center font-sans text-body-sm text-stone">No matches.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
