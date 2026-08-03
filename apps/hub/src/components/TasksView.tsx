'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubTask } from '@/lib/types'
import { DEPARTMENTS, getDepartment, isDepartmentSlug, type DepartmentSlug } from '@/lib/departments'
import { PageHeader } from '@/components/PageHeader'

type Filter = 'all' | 'unassigned' | DepartmentSlug

const STATUS_CYCLE: Record<HubTask['status'], HubTask['status']> = {
  open: 'doing',
  doing: 'done',
  done: 'open',
}

const PRIORITY_STYLES: Record<NonNullable<HubTask['priority']>, string> = {
  high: 'bg-orange/15 text-orange',
  normal: 'bg-surface-floating text-stone',
  low: 'bg-sage/15 text-sage',
}

export function TasksView({ initialDepartment }: { initialDepartment?: string }) {
  const startingFilter: Filter =
    initialDepartment && isDepartmentSlug(initialDepartment) ? initialDepartment : 'all'

  const [filter, setFilter] = useState<Filter>(startingFilter)
  const [tasks, setTasks] = useState<HubTask[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<HubTask['priority']>('normal')
  const [dueDate, setDueDate] = useState('')
  const [department, setDepartment] = useState<DepartmentSlug | 'unassigned'>(
    isDepartmentSlug(startingFilter) ? startingFilter : 'unassigned',
  )

  async function refetch(activeFilter: Filter) {
    const supabase = getSupabaseBrowser()
    let query = supabase
      .from('hub_tasks')
      .select('*')
      .order('status', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false })

    if (activeFilter === 'unassigned') query = query.is('department', null)
    else if (activeFilter !== 'all') query = query.eq('department', activeFilter)

    const { data } = await query
    setTasks((data as HubTask[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    refetch(filter)
  }, [filter])

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_tasks').insert({
      title: title.trim(),
      priority,
      due_date: dueDate || null,
      department: department === 'unassigned' ? null : department,
    })
    setTitle('')
    setDueDate('')
    refetch(filter)
  }

  async function cycleStatus(task: HubTask) {
    const supabase = getSupabaseBrowser()
    await supabase
      .from('hub_tasks')
      .update({ status: STATUS_CYCLE[task.status], updated_at: new Date().toISOString() })
      .eq('id', task.id)
    refetch(filter)
  }

  async function deleteTask(id: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_tasks').delete().eq('id', id)
    refetch(filter)
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader title="Tasks" subtitle="What's actually open right now." />

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

      <form onSubmit={addTask} className="hud-panel mb-8 flex flex-wrap items-center gap-2 p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
          suppressHydrationWarning
          className="min-w-[200px] flex-1 rounded-md bg-transparent px-2 py-2 font-sans text-body text-warm-white placeholder:text-stone/60 focus:outline-none"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value as DepartmentSlug | 'unassigned')}
          className="rounded-md border border-surface-border bg-surface-base px-2 py-2 font-sans text-body-sm text-warm-white focus:border-cyan focus:outline-none"
        >
          <option value="unassigned">Unassigned</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.label}
            </option>
          ))}
        </select>
        <select
          value={priority ?? 'normal'}
          onChange={(e) => setPriority(e.target.value as HubTask['priority'])}
          className="rounded-md border border-surface-border bg-surface-base px-2 py-2 font-sans text-body-sm text-warm-white focus:border-cyan focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          suppressHydrationWarning
          className="rounded-md border border-surface-border bg-surface-base px-2 py-2 font-sans text-body-sm text-warm-white focus:border-cyan focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-cyan px-4 py-2 font-sans text-body-sm font-semibold text-black transition-transform duration-150 hover:bg-cyan-400 active:scale-[0.98]"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">Nothing here. Add something above.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => {
            const dept = task.department ? getDepartment(task.department) : null
            return (
              <li
                key={task.id}
                className="hud-panel hub-fade-up group flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:border-stone/40"
              >
                <button
                  onClick={() => cycleStatus(task)}
                  aria-label={`Mark ${task.title} as next status`}
                  className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors duration-150 ${
                    task.status === 'done'
                      ? 'border-cyan bg-cyan'
                      : task.status === 'doing'
                        ? 'border-cyan bg-transparent'
                        : 'border-stone bg-transparent'
                  }`}
                />
                <span
                  className={`flex-1 font-sans text-body ${
                    task.status === 'done' ? 'text-stone line-through' : 'text-warm-white'
                  }`}
                >
                  {task.title}
                </span>
                {dept && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-label font-semibold uppercase tracking-wide text-black"
                    style={{ backgroundColor: dept.accent }}
                  >
                    {dept.label}
                  </span>
                )}
                {task.due_date && (
                  <span className="font-sans text-body-sm text-stone">{task.due_date}</span>
                )}
                {task.priority && (
                  <span className={`rounded-full px-2 py-0.5 font-sans text-label font-semibold uppercase tracking-wide ${PRIORITY_STYLES[task.priority]}`}>
                    {task.priority}
                  </span>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                  className="font-sans text-body-sm text-stone opacity-0 transition-opacity duration-150 hover:text-danger group-hover:opacity-100"
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
