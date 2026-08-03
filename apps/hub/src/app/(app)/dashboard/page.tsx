import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase-server'
import type { HubNote, HubTask } from '@/lib/types'
import { DEPARTMENTS } from '@/lib/departments'
import { PageHeader } from '@/components/PageHeader'
import { OrbitalOverview, type DepartmentStat } from '@/components/OrbitalOverview'

const QUICK_LINKS = [
  { label: 'Investors CRM', href: '/departments/acquisitions/investors' },
  { label: 'Supabase', href: 'https://supabase.com/dashboard/project/uwncchrmdotateyditjc' },
  { label: 'Hostinger', href: 'https://hpanel.hostinger.com' },
  { label: 'GitHub repo', href: 'https://github.com/journeystorage/journey.storage' },
]

export default async function DashboardPage() {
  const supabase = await getSupabaseServer()
  const today = new Date().toISOString().slice(0, 10)

  const [{ data: tasks }, { data: notes }, { data: allOpenTasks }, { data: employees }] = await Promise.all([
    supabase
      .from('hub_tasks')
      .select('*')
      .neq('status', 'done')
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(8),
    supabase.from('hub_notes').select('*').order('updated_at', { ascending: false }).limit(4),
    supabase.from('hub_tasks').select('department,priority,due_date').neq('status', 'done'),
    supabase.from('hub_ai_employees').select('department'),
  ])

  const openTasks = (tasks as HubTask[]) ?? []
  const recentNotes = (notes as HubNote[]) ?? []

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

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader title="Dashboard" subtitle="Everything open, in one place." />

      <section className="hud-panel mb-10 py-8">
        <OrbitalOverview totalOpen={totalOpen} departments={departmentStats} />
      </section>

      <div className="grid grid-cols-[1.5fr_1fr] gap-6">
        <section className="hud-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
              Open ({openTasks.length})
            </h2>
            <Link href="/tasks" className="font-sans text-body-sm text-cyan hover:text-cyan-400">
              View all →
            </Link>
          </div>
          {openTasks.length === 0 ? (
            <p className="font-sans text-body-sm text-stone">Nothing open. Good place to be.</p>
          ) : (
            <ul className="space-y-2.5">
              {openTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      task.priority === 'high' ? 'bg-orange' : 'bg-stone'
                    }`}
                  />
                  <span className="flex-1 font-sans text-body text-warm-white">{task.title}</span>
                  {task.due_date && <span className="font-sans text-body-sm text-stone">{task.due_date}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="hud-panel p-6">
            <h2 className="mb-4 font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
              Quick links
            </h2>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) =>
                link.href.startsWith('/') ? (
                  <li key={link.href}>
                    <Link href={link.href} className="font-sans text-body-sm text-stone hover:text-cyan">
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sans text-body-sm text-stone hover:text-cyan"
                    >
                      {link.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </section>

          <section className="hud-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-h3 font-bold uppercase tracking-wide text-warm-white">
                Recent notes
              </h2>
              <Link href="/notes" className="font-sans text-body-sm text-cyan hover:text-cyan-400">
                View all →
              </Link>
            </div>
            {recentNotes.length === 0 ? (
              <p className="font-sans text-body-sm text-stone">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentNotes.map((note) => (
                  <li key={note.id}>
                    <p className="font-sans text-body-sm font-medium text-warm-white">{note.title}</p>
                    {note.content && (
                      <p className="line-clamp-1 font-sans text-body-sm text-stone">{note.content}</p>
                    )}
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
