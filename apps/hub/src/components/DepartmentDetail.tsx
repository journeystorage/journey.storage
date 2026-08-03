'use client'

import { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [adding, setAdding] = useState(false)

  async function refetch() {
    const supabase = getSupabaseBrowser()
    const [{ data: employeeRows }, { data: taskRows }, { data: noteRows }] = await Promise.all([
      supabase.from('hub_ai_employees').select('*').eq('department', slug).order('created_at', { ascending: true }),
      supabase
        .from('hub_tasks')
        .select('*')
        .eq('department', slug)
        .neq('status', 'done')
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(6),
      supabase.from('hub_notes').select('*').eq('department', slug).order('updated_at', { ascending: false }).limit(4),
    ])
    setEmployees((employeeRows as HubAiEmployee[]) ?? [])
    setTasks((taskRows as HubTask[]) ?? [])
    setNotes((noteRows as HubNote[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !role.trim()) return
    setAdding(true)
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_ai_employees').insert({
      department: slug,
      name: name.trim(),
      role: role.trim(),
      system_prompt: systemPrompt.trim(),
    })
    setName('')
    setRole('')
    setSystemPrompt('')
    setAdding(false)
    refetch()
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
                <p className="font-sans text-body-sm text-stone">No employees yet — hire one below.</p>
              )}
            </ul>
          )}

          <form onSubmit={addEmployee} className="hud-panel space-y-2 p-4">
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (e.g. Ledger)"
                suppressHydrationWarning
                className="flex-1 rounded-md bg-transparent px-2 py-1.5 font-sans text-body text-warm-white placeholder:text-stone/60 focus:outline-none"
              />
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role (e.g. Bookkeeper)"
                suppressHydrationWarning
                className="flex-1 rounded-md bg-transparent px-2 py-1.5 font-sans text-body text-warm-white placeholder:text-stone/60 focus:outline-none"
              />
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="What should they focus on, and how should they act? (optional)"
              rows={3}
              suppressHydrationWarning
              className="w-full resize-none rounded-md bg-transparent px-2 py-1.5 font-sans text-body-sm text-warm-white placeholder:text-stone/60 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={adding}
                className="rounded-md bg-cyan px-4 py-2 font-sans text-body-sm font-semibold text-black transition-transform duration-150 hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50"
              >
                {adding ? 'Hiring…' : 'Hire employee'}
              </button>
            </div>
          </form>
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
