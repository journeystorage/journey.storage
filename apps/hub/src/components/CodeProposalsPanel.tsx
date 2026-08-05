'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

interface CodeProposalRow {
  id: string
  instruction: string
  status: 'pending' | 'ready' | 'merged' | 'dismissed' | 'failed'
  pr_url: string | null
  summary: string | null
  created_at: string
}

const POLL_MS = 15_000

// Code changes Jarvis has dispatched. "pending" = the GitHub Actions run is
// still working; "ready" = a pull request exists and is waiting here for an
// actual human decision — approving merges it (which triggers the site's
// normal deploy), dismissing closes it unmerged. There is no other way for
// any of this to reach production.
export function CodeProposalsPanel() {
  const [rows, setRows] = useState<CodeProposalRow[]>([])
  const [deciding, setDeciding] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser()
    const { data } = await supabase
      .from('hub_code_proposals')
      .select('*')
      .in('status', ['pending', 'ready'])
      .order('created_at', { ascending: false })
    setRows((data as CodeProposalRow[]) ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const hasPending = rows.some((r) => r.status === 'pending')
    if (hasPending && !pollRef.current) {
      pollRef.current = setInterval(load, POLL_MS)
    } else if (!hasPending && pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [rows, load])

  async function decide(id: string, decision: 'approve' | 'dismiss') {
    setDeciding(id)
    try {
      const res = await fetch('/api/proposals/code/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      })
      if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id))
    } finally {
      setDeciding(null)
    }
  }

  if (rows.length === 0) return null

  return (
    <section className="hud-panel col-span-2 p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="hud-label">Code changes</p>
        <p className="hud-label">{rows.length} in flight</p>
      </div>

      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.id} className="rounded-md border border-surface-border bg-surface-elevated/60 p-4">
            <p className="font-sans text-body text-warm-white">{row.instruction}</p>
            {row.status === 'pending' ? (
              <p className="mt-1.5 flex items-center gap-1.5 font-sans text-body-sm text-stone">
                <span className="hub-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />
                Run in progress — a pull request will appear here to review
              </p>
            ) : (
              <>
                {row.pr_url && (
                  <a
                    href={row.pr_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-block font-sans text-body-sm text-cyan hover:text-cyan-400"
                  >
                    View pull request →
                  </a>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => decide(row.id, 'approve')}
                    disabled={deciding === row.id}
                    className="rounded-md bg-cyan px-3 py-1.5 font-sans text-body-sm font-semibold text-black transition-transform duration-150 hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50"
                  >
                    Approve &amp; merge
                  </button>
                  <button
                    onClick={() => decide(row.id, 'dismiss')}
                    disabled={deciding === row.id}
                    className="rounded-md border border-surface-border px-3 py-1.5 font-sans text-body-sm text-stone transition-colors duration-150 hover:text-warm-white disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
