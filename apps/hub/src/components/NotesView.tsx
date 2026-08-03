'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubNote } from '@/lib/types'
import { DEPARTMENTS, getDepartment, isDepartmentSlug, type DepartmentSlug } from '@/lib/departments'
import { PageHeader } from '@/components/PageHeader'

type Filter = 'all' | 'unassigned' | DepartmentSlug

export function NotesView({ initialDepartment }: { initialDepartment?: string }) {
  const startingFilter: Filter =
    initialDepartment && isDepartmentSlug(initialDepartment) ? initialDepartment : 'all'

  const [filter, setFilter] = useState<Filter>(startingFilter)
  const [notes, setNotes] = useState<HubNote[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [department, setDepartment] = useState<DepartmentSlug | 'unassigned'>(
    isDepartmentSlug(startingFilter) ? startingFilter : 'unassigned',
  )

  async function refetch(activeFilter: Filter) {
    const supabase = getSupabaseBrowser()
    let query = supabase.from('hub_notes').select('*').order('updated_at', { ascending: false })

    if (activeFilter === 'unassigned') query = query.is('department', null)
    else if (activeFilter !== 'all') query = query.eq('department', activeFilter)

    const { data } = await query
    setNotes((data as HubNote[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    refetch(filter)
  }, [filter])

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_notes').insert({
      title: title.trim(),
      content,
      department: department === 'unassigned' ? null : department,
    })
    setTitle('')
    setContent('')
    refetch(filter)
  }

  async function deleteNote(id: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_notes').delete().eq('id', id)
    refetch(filter)
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader title="Notes" subtitle="A running journal — anything worth not forgetting." />

      <div className="mb-6 flex flex-wrap gap-1.5">
        {(['all', 'unassigned', ...DEPARTMENTS.map((d) => d.slug)] as Filter[]).map((f) => {
          const dept = f !== 'all' && f !== 'unassigned' ? getDepartment(f) : null
          const label = f === 'all' ? 'All' : f === 'unassigned' ? 'Unassigned' : dept?.label ?? f
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-body-sm transition-colors duration-150 ${
                active ? 'bg-cyan text-black' : 'bg-surface-elevated text-stone hover:text-warm-white'
              }`}
            >
              {dept && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dept.accent }} />}
              {label}
            </button>
          )
        })}
      </div>

      <form onSubmit={addNote} className="hud-panel mb-8 space-y-2 p-4">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title…"
            suppressHydrationWarning
            className="flex-1 rounded-md bg-transparent px-2 py-1.5 font-sans text-body font-medium text-warm-white placeholder:text-stone/60 focus:outline-none"
          />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as DepartmentSlug | 'unassigned')}
            className="rounded-md border border-surface-border bg-surface-base px-2 py-1.5 font-sans text-body-sm text-warm-white focus:border-cyan focus:outline-none"
          >
            <option value="unassigned">Unassigned</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write it down…"
          rows={3}
          suppressHydrationWarning
          className="w-full resize-none rounded-md bg-transparent px-2 py-1.5 font-sans text-body-sm text-warm-white placeholder:text-stone/60 focus:outline-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-cyan px-4 py-2 font-sans text-body-sm font-semibold text-black transition-transform duration-150 hover:bg-cyan-400 active:scale-[0.98]"
          >
            Save note
          </button>
        </div>
      </form>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">No notes here.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => {
            const dept = note.department ? getDepartment(note.department) : null
            return (
              <li
                key={note.id}
                className="hud-panel hub-fade-up group p-4 transition-colors duration-150 hover:border-stone/40"
              >
                <div className="mb-1 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans text-body font-semibold text-warm-white">{note.title}</h3>
                    {dept && (
                      <span
                        className="rounded-full px-2 py-0.5 font-sans text-label font-semibold uppercase tracking-wide text-black"
                        style={{ backgroundColor: dept.accent }}
                      >
                        {dept.label}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    aria-label={`Delete ${note.title}`}
                    className="shrink-0 font-sans text-body-sm text-stone opacity-0 transition-opacity duration-150 hover:text-danger group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
                {note.content && (
                  <p className="whitespace-pre-wrap font-sans text-body-sm leading-relaxed text-stone">{note.content}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
