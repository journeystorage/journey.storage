'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { DEPARTMENTS, getDepartment, type DepartmentSlug } from '@/lib/departments'
import type { HubAiEmployee, HubTask } from '@/lib/types'
import { PageHeader } from '@/components/PageHeader'

type Filter = 'all' | DepartmentSlug

interface Row {
  employee: HubAiEmployee
  lastActiveAt: string | null
  openCount: number
  highPriorityCount: number
  overdueCount: number
}

function statusLabel(lastActiveAt: string | null): { label: string; tone: string } {
  if (!lastActiveAt) return { label: 'New', tone: 'text-stone' }
  const hoursSince = (Date.now() - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60)
  if (hoursSince < 24) return { label: 'Active', tone: 'text-status-good' }
  return { label: 'Idle', tone: 'text-stone' }
}

export default function AgentsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().slice(0, 10)

  async function refetch() {
    const supabase = getSupabaseBrowser()
    const [{ data: employees }, { data: openTasks }, { data: chatRows }] = await Promise.all([
      supabase.from('hub_ai_employees').select('*').order('created_at', { ascending: true }),
      supabase.from('hub_tasks').select('department,priority,due_date').neq('status', 'done'),
      supabase
        .from('hub_chat_messages')
        .select('employee_id,created_at')
        .not('employee_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(500),
    ])

    const lastActiveByEmployee = new Map<string, string>()
    for (const row of chatRows ?? []) {
      if (row.employee_id && !lastActiveByEmployee.has(row.employee_id)) {
        lastActiveByEmployee.set(row.employee_id, row.created_at)
      }
    }

    const nextRows: Row[] = ((employees as HubAiEmployee[]) ?? []).map((employee) => {
      const deptTasks = (openTasks ?? []).filter((t) => t.department === employee.department)
      return {
        employee,
        lastActiveAt: lastActiveByEmployee.get(employee.id) ?? null,
        openCount: deptTasks.length,
        highPriorityCount: deptTasks.filter((t) => t.priority === 'high').length,
        overdueCount: deptTasks.filter((t) => t.due_date && t.due_date < today).length,
      }
    })

    setRows(nextRows)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function removeEmployee(id: string) {
    const supabase = getSupabaseBrowser()
    await supabase.from('hub_ai_employees').delete().eq('id', id)
    refetch()
  }

  const visibleRows = filter === 'all' ? rows : rows.filter((r) => r.employee.department === filter)

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <PageHeader title="Agents" subtitle={`${rows.length} AI employee${rows.length === 1 ? '' : 's'} across every department.`} />

      <div className="mb-6 flex flex-wrap gap-1.5">
        {(['all', ...DEPARTMENTS.map((d) => d.slug)] as Filter[]).map((f) => {
          const dept = f !== 'all' ? getDepartment(f) : null
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
              {f === 'all' ? 'All' : dept?.label ?? f}
            </button>
          )
        })}
      </div>

      {loading ? (
        <p className="font-sans text-body-sm text-stone">Loading…</p>
      ) : visibleRows.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">
          No one hired yet — visit a department page to hire your first AI employee.
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleRows.map(({ employee, lastActiveAt, openCount, highPriorityCount, overdueCount }) => {
            const dept = getDepartment(employee.department)
            const status = statusLabel(lastActiveAt)
            const hasOverdue = overdueCount > 0
            const hasHighPriority = highPriorityCount > 0

            return (
              <li
                key={employee.id}
                className="hud-panel hub-fade-up group flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:border-stone/40"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-body font-bold text-black"
                  style={{ backgroundColor: dept?.accent }}
                >
                  {employee.name.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1">
                  <p className="font-sans text-body font-medium text-warm-white">{employee.name}</p>
                  <p className="font-sans text-body-sm text-stone">
                    {employee.role} · {dept?.label}
                  </p>
                </div>
                <span className={`font-sans text-body-sm ${status.tone}`}>{status.label}</span>
                {(hasOverdue || hasHighPriority) && (
                  <span
                    className={`px-2 py-0.5 font-sans text-label font-semibold text-black ${
                      hasOverdue ? 'rounded-sm' : 'rounded-full'
                    }`}
                    style={{ backgroundColor: hasOverdue ? 'var(--color-danger)' : 'var(--color-orange)' }}
                  >
                    {hasOverdue ? overdueCount : highPriorityCount} {hasOverdue ? 'overdue' : 'high priority'}
                  </span>
                )}
                {!hasOverdue && !hasHighPriority && (
                  <span className="font-sans text-body-sm text-stone">{openCount} open</span>
                )}
                <Link
                  href={`/departments/${employee.department}/employees/${employee.id}`}
                  className="font-sans text-body-sm font-medium text-cyan hover:text-cyan-400"
                >
                  Chat →
                </Link>
                <button
                  onClick={() => removeEmployee(employee.id)}
                  aria-label={`Remove ${employee.name}`}
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
