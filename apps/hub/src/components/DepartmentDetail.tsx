'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { DepartmentSlug } from '@/lib/departments'
import type { HubAiEmployee, HubNote, HubTask } from '@/lib/types'
import { PageHeader } from '@/components/PageHeader'

export function DepartmentDetail({
  slug,
  label,
  accent,
}: {
  slug: DepartmentSlug
  label: string
  accent: string
}) {
  const [employees, setEmployees] = useState<HubAiEmployee[]>([])
  const [tasks, setTasks] = useState<HubTask[]>([])
  const [notes, setNotes] = useState<HubNote[]>([])
  const [docs, setDocs] = useState<{ id: string; filename: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function refetch() {
    const supabase = getSupabaseBrowser()
    const [{ data: employeeRows }, { data: taskRows }, { data: noteRows }, { data: docRows }] = await Promise.all([
      supabase.from('hub_ai_employees').select('*').eq('department', slug).order('created_at', { ascending: true }),
      supabase
        .from('hub_tasks')
        .select('*')
        .eq('department', slug)
        .neq('status', 'done')
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(6),
      supabase.from('hub_notes').select('*').eq('department', slug).order('updated_at', { ascending: false }).limit(4),
      supabase
        .from('hub_department_docs')
        .select('id,filename,created_at')
        .eq('department', slug)
        .order('created_at', { ascending: false }),
    ])
    setEmployees((employeeRows as HubAiEmployee[]) ?? [])
    setTasks((taskRows as HubTask[]) ?? [])
    setNotes((noteRows as HubNote[]) ?? [])
    setDocs((docRows as { id: string; filename: string; created_at: string }[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const MAX_DOC_CHARS = 120_000

  async function ingestFiles(files: File[]) {
    if (!files.length) return
    setUploading(true)
    const supabase = getSupabaseBrowser()
    for (const file of files) {
      try {
        const text = await file.text()
        if (!text.trim()) continue
        await supabase.from('hub_department_docs').insert({
          department: slug,
          filename: file.name,
          content: text.slice(0, MAX_DOC_CHARS),
        })
      } catch {
        // unreadable file — skip
      }
    }
    setUploading(false)
    refetch()
  }

  async function removeDoc(id: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_department_docs').delete().eq('id', id)
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  async function deleteEmployee(id: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_ai_employees').delete().eq('id', id)
    refetch()
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        title={label}
        subtitle={`${employees.length} employee${employees.length === 1 ? '' : 's'} · ${tasks.length} open task${tasks.length === 1 ? '' : 's'}`}
        actions={<span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} aria-hidden />}
      />

      {slug === 'acquisitions' && (
        <Link
          href="/departments/acquisitions/investors"
          className="hud-panel mb-6 flex items-center justify-between px-5 py-4 transition-colors duration-150 hover:border-stone/40"
        >
          <div>
            <p className="font-sans text-body font-medium text-warm-white">Investors CRM</p>
            <p className="font-sans text-body-sm text-stone">Granbury &amp; Springfield capital raises — deals, people, follow-ups</p>
          </div>
          <span className="font-sans text-body-sm font-medium text-cyan">Open →</span>
        </Link>
      )}

      <div className="grid grid-cols-[1.4fr_1fr] gap-6">
        <section>
          <h2 className="mb-4 font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
            Employees
          </h2>

          {loading ? (
            <p className="font-sans text-body-sm text-stone">Loading…</p>
          ) : (
            <ul className="mb-6 space-y-2">
              {employees.map((employee) => (
                <li
                  key={employee.id}
                  className="hud-panel hub-fade-up group flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:border-stone/40"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-body font-bold text-black"
                    style={{ backgroundColor: accent }}
                  >
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <p className="font-sans text-body font-medium text-warm-white">{employee.name}</p>
                    <p className="font-sans text-body-sm text-stone">{employee.role}</p>
                  </div>
                  <Link
                    href={`/departments/${slug}/employees/${employee.id}`}
                    className="font-sans text-body-sm font-medium text-cyan hover:text-cyan-400"
                  >
                    Chat →
                  </Link>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    aria-label={`Remove ${employee.name}`}
                    className="font-sans text-body-sm text-stone opacity-0 transition-opacity duration-150 hover:text-danger group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {employees.length === 0 && (
                <p className="font-sans text-body-sm text-stone">
                  No employees yet — ask Jarvis to hire one for this department.
                </p>
              )}
            </ul>
          )}

          {/* Department context library — every employee in this department
              absorbs these files automatically. */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              void ingestFiles(Array.from(e.dataTransfer.files))
            }}
            className={`hud-panel p-4 transition-colors duration-150 ${dragOver ? 'border-cyan/60' : ''}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="hud-label" style={{ color: accent }}>
                {label} context
              </p>
              <p className="hud-label">{docs.length} file{docs.length === 1 ? '' : 's'}</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.csv,.json,.html"
              onChange={(e) => {
                void ingestFiles(Array.from(e.target.files ?? []))
                e.target.value = ''
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`w-full rounded-md border border-dashed px-4 py-6 text-center font-sans text-body-sm transition-colors duration-150 disabled:opacity-60 ${
                dragOver
                  ? 'border-cyan text-cyan'
                  : 'border-surface-border text-stone hover:border-stone/60 hover:text-warm-white'
              }`}
            >
              {uploading
                ? 'Absorbing…'
                : 'Drop files here or click to add — every employee in this department absorbs them (.txt, .md, .csv, .json, .html)'}
            </button>

            {docs.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {docs.map((doc) => (
                  <li key={doc.id} className="group flex items-center gap-2">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-stone" aria-hidden />
                    <span className="flex-1 truncate font-sans text-body-sm text-warm-white">{doc.filename}</span>
                    <span className="hud-label">{doc.created_at.slice(0, 10)}</span>
                    <button
                      onClick={() => removeDoc(doc.id)}
                      aria-label={`Remove ${doc.filename}`}
                      className="font-sans text-body-sm text-stone opacity-0 transition-opacity duration-150 hover:text-danger group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="hud-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-h3 font-bold uppercase tracking-wide text-warm-white">Open tasks</h2>
              <Link href={`/tasks?department=${slug}`} className="font-sans text-body-sm text-cyan hover:text-cyan-400">
                View all →
              </Link>
            </div>
            {tasks.length === 0 ? (
              <p className="font-sans text-body-sm text-stone">Nothing open.</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li key={task.id} className="font-sans text-body-sm text-warm-white">
                    {task.title}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="hud-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-h3 font-bold uppercase tracking-wide text-warm-white">Recent notes</h2>
              <Link href={`/notes?department=${slug}`} className="font-sans text-body-sm text-cyan hover:text-cyan-400">
                View all →
              </Link>
            </div>
            {notes.length === 0 ? (
              <p className="font-sans text-body-sm text-stone">No notes yet.</p>
            ) : (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li key={note.id} className="font-sans text-body-sm text-warm-white">
                    {note.title}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
