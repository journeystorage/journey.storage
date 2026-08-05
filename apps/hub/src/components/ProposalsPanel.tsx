'use client'

import { useCallback, useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { getDepartment } from '@/lib/departments'

interface ProposalRow {
  id: string
  employee_id: string
  title: string
  rationale: string | null
  action_type: 'task' | 'note'
  created_at: string
}

interface EmployeeInfo {
  id: string
  name: string
  role: string
  department: string
}

// The approval desk. On load it nudges the standup engine (no-op if the team
// already worked today), then lists every pending proposal. Approve executes;
// dismiss archives. This is where "always working" meets "Lyvia approves".
export function ProposalsPanel() {
  const [proposals, setProposals] = useState<ProposalRow[]>([])
  const [employees, setEmployees] = useState<Map<string, EmployeeInfo>>(new Map())
  const [thinking, setThinking] = useState(true)
  const [deciding, setDeciding] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser()
    const [{ data: rows }, { data: emps }] = await Promise.all([
      supabase.from('hub_proposals').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('hub_ai_employees').select('id,name,role,department'),
    ])
    setProposals((rows as ProposalRow[]) ?? [])
    setEmployees(new Map(((emps as EmployeeInfo[]) ?? []).map((e) => [e.id, e])))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function boot() {
      await load()
      try {
        // Fire the standup — returns immediately if it already ran recently.
        const res = await fetch('/api/agents/standup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        const json = await res.json().catch(() => null)
        if (!cancelled && json?.ran) await load()
      } catch {
        // standup failing should never break the dashboard
      }
      if (!cancelled) setThinking(false)
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [load])

  async function decide(id: string, decision: 'approve' | 'dismiss') {
    setDeciding(id)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      })
      if (res.ok) setProposals((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setDeciding(null)
    }
  }

  return (
    <section className="hud-panel col-span-2 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="hud-label">Team proposals</p>
          {thinking && (
            <span className="hub-pulse-dot font-sans text-body-sm text-cyan">team is thinking…</span>
          )}
        </div>
        <p className="hud-label">{proposals.length} awaiting your call</p>
      </div>

      {proposals.length === 0 ? (
        <p className="font-sans text-body-sm text-stone">
          {thinking ? 'Checking in with the team…' : 'No pending proposals. The team checks in daily.'}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {proposals.map((p) => {
            const emp = employees.get(p.employee_id)
            const dept = emp ? getDepartment(emp.department) : null
            return (
              <li key={p.id} className="rounded-md border border-surface-border bg-surface-elevated/60 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  {dept && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dept.accent }} aria-hidden />}
                  <span className="hud-label" style={dept ? { color: dept.accent } : undefined}>
                    {emp ? `${emp.name} · ${emp.role}` : 'Unknown'}
                  </span>
                  <span className="hud-label ml-auto">{p.action_type}</span>
                </div>
                <p className="font-sans text-body font-medium text-warm-white">{p.title}</p>
                {p.rationale && <p className="mt-1 font-sans text-body-sm text-stone">{p.rationale}</p>}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => decide(p.id, 'approve')}
                    disabled={deciding === p.id}
                    className="rounded-md bg-cyan px-3 py-1.5 font-sans text-body-sm font-semibold text-black transition-transform duration-150 hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => decide(p.id, 'dismiss')}
                    disabled={deciding === p.id}
                    className="rounded-md border border-surface-border px-3 py-1.5 font-sans text-body-sm text-stone transition-colors duration-150 hover:text-warm-white disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
