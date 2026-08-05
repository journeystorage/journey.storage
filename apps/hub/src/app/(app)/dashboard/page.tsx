import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase-server'
import { hasGoogleConnection } from '@/lib/google'
import type { HubInsight, HubNote, HubTask } from '@/lib/types'
import { DEPARTMENTS, getDepartment } from '@/lib/departments'
import { CommandHeader } from '@/components/CommandHeader'
import { OrbitalOverview, type DepartmentStat } from '@/components/OrbitalOverview'
import { ProposalsPanel } from '@/components/ProposalsPanel'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await getSupabaseServer()
  const today = new Date().toISOString().slice(0, 10)
  const startOfToday = `${today}T00:00:00Z`

  const [
    { data: tasks },
    { data: notes },
    { data: allOpenTasks },
    { data: employees },
    { data: insights },
    { data: usageToday },
    googleConnected,
  ] = await Promise.all([
    supabase
      .from('hub_tasks')
      .select('*')
      .neq('status', 'done')
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(7),
    supabase.from('hub_notes').select('*').order('updated_at', { ascending: false }).limit(3),
    supabase.from('hub_tasks').select('department,priority,due_date').neq('status', 'done'),
    supabase.from('hub_ai_employees').select('department'),
    supabase.from('hub_insights').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('hub_api_usage').select('cost_usd').gte('created_at', startOfToday),
    hasGoogleConnection(supabase),
  ])

  const openTasks = (tasks as HubTask[]) ?? []
  const recentNotes = (notes as HubNote[]) ?? []
  const recentInsights = (insights as HubInsight[]) ?? []
  const spendTodayUsd = (usageToday ?? []).reduce((sum, r) => sum + Number(r.cost_usd ?? 0), 0)

  const employeeCountByDept = new Map<string, number>()
  for (const row of employees ?? []) {
    employeeCountByDept.set(row.department, (employeeCountByDept.get(row.department) ?? 0) + 1)
  }

  const departmentStats: DepartmentStat[] = DEPARTMENTS.map((dept) => {
    const rows = (allOpenTasks ?? []).filter((t) => t.department === dept.slug)
    return {
      slug: dept.slug,
      label: dept.label,
      accent: dept.accent,
      openCount: rows.length,
      employeeCount: employeeCountByDept.get(dept.slug) ?? 0,
      highPriorityCount: rows.filter((t) => t.priority === 'high').length,
      overdueCount: rows.filter((t) => t.due_date && t.due_date < today).length,
    }
  })

  const totalOpen = (allOpenTasks ?? []).length
  const overdueCount = (allOpenTasks ?? []).filter((t) => t.due_date && t.due_date < today).length

  const systems = [
    { label: 'Database', detail: 'Supabase', online: true },
    { label: 'Intelligence', detail: 'Jarvis · Claude', online: true },
    { label: 'Google', detail: googleConnected ? 'Gmail + Calendar' : 'Not connected', online: googleConnected },
    { label: 'Finance', detail: 'QuickBooks · planned', online: false },
    { label: 'Operations', detail: 'Tenant Inc · planned', online: false },
  ]

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <CommandHeader
        totalOpen={totalOpen}
        overdueCount={overdueCount}
        spendTodayUsd={spendTodayUsd}
        employeeCount={(employees ?? []).length}
      />

      <div className="hub-stagger grid grid-cols-[1fr_340px] gap-6">
        {/* ── Orbital core — the company at a glance ── */}
        <section className="hud-panel relative overflow-hidden py-6">
          <p className="hud-label absolute left-5 top-4">Company orbit</p>
          <OrbitalOverview totalOpen={totalOpen} departments={departmentStats} />
        </section>

        {/* ── Right rail: systems + signal feed ── */}
        <div className="flex flex-col gap-6">
          <section className="hud-panel p-5">
            <p className="hud-label mb-3">Systems</p>
            <ul className="space-y-2.5">
              {systems.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.online ? 'hub-pulse-dot bg-status-good' : 'bg-surface-border'}`}
                    aria-hidden
                  />
                  <span className="flex-1 font-sans text-body-sm font-medium text-warm-white">{s.label}</span>
                  <span className={`font-mono text-label uppercase tracking-wider ${s.online ? 'text-status-good' : 'text-stone/60'}`}>
                    {s.online ? 'Online' : s.detail.includes('planned') ? 'Planned' : 'Offline'}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/connections"
              className="mt-4 block font-sans text-body-sm text-cyan transition-colors duration-150 hover:text-cyan-400"
            >
              Manage connections →
            </Link>
          </section>

          <section className="hud-panel flex-1 p-5">
            <p className="hud-label mb-3">Signal feed</p>
            {recentInsights.length === 0 && recentNotes.length === 0 ? (
              <p className="font-sans text-body-sm text-stone">
                Quiet for now. Ask Jarvis to generate insights once real work is flowing.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentInsights.map((i) => (
                  <li key={i.id} className="border-l-2 pl-3" style={{ borderColor: i.category === 'risk' ? 'var(--color-danger)' : i.category === 'opportunity' ? 'var(--color-status-good)' : 'var(--color-cyan)' }}>
                    <p className="hud-label">{i.category ?? 'note'}</p>
                    <p className="font-sans text-body-sm text-warm-white">{i.content}</p>
                  </li>
                ))}
                {recentNotes.map((n) => (
                  <li key={n.id} className="border-l-2 border-surface-border pl-3">
                    <p className="hud-label">Note</p>
                    <p className="font-sans text-body-sm text-warm-white">{n.title}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ── Team proposals — the approval desk ── */}
        <ProposalsPanel />

        {/* ── Priority queue — full width below ── */}
        <section className="hud-panel col-span-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="hud-label">Priority queue</p>
            <Link href="/tasks" className="font-sans text-body-sm text-cyan transition-colors duration-150 hover:text-cyan-400">
              All tasks →
            </Link>
          </div>
          {openTasks.length === 0 ? (
            <p className="font-sans text-body-sm text-stone">Nothing open. Good place to be.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {openTasks.map((task) => {
                const dept = task.department ? getDepartment(task.department) : null
                const isOverdue = Boolean(task.due_date && task.due_date < today)
                return (
                  <li key={task.id} className="flex items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        isOverdue ? 'bg-danger' : task.priority === 'high' ? 'bg-orange' : 'bg-stone'
                      }`}
                      aria-hidden
                    />
                    <span className="flex-1 truncate font-sans text-body text-warm-white">{task.title}</span>
                    {dept && (
                      <span className="hud-label hidden lg:block" style={{ color: dept.accent }}>
                        {dept.label}
                      </span>
                    )}
                    {task.due_date && (
                      <span className={`font-mono text-body-sm ${isOverdue ? 'text-danger' : 'text-stone'}`}>
                        {task.due_date.slice(5)}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
