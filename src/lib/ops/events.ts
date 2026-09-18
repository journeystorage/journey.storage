import 'server-only'
import { getSupabaseServer } from '@/lib/supabase-server'

// ---------------------------------------------------------------------------
// Short-lived signals about people, not leases.
//
// The nightly sweep can read the storage system for anything that became a
// lease. These are the things that leave no trace there: someone who filled in
// their details and never paid, someone who asked for a sign-in code and never
// used it, someone whose card keeps failing. Without somewhere to write them
// down they are invisible.
//
// Every write is best-effort. A logging table must never be the reason a
// customer cannot rent a unit, so failures are swallowed and logged.
// ---------------------------------------------------------------------------

export type OpsEventKind =
  | 'checkout_started'
  | 'checkout_completed'
  | 'code_requested'
  | 'code_confirmed'
  | 'card_failed'

const TABLE = 'ops_events'

export interface OpsEvent {
  kind: OpsEventKind
  /** Email or phone, normalised by the caller. Used to pair events up. */
  contact?: string
  name?: string
  phone?: string
  detail?: Record<string, unknown>
}

export async function recordEvent(e: OpsEvent): Promise<void> {
  try {
    await getSupabaseServer().from(TABLE).insert({
      kind: e.kind,
      contact: (e.contact ?? '').toLowerCase().trim() || null,
      name: e.name ?? null,
      phone: e.phone ?? null,
      detail: e.detail ?? {},
    })
  } catch (err) {
    console.error('[ops-events] write failed', e.kind, err instanceof Error ? err.message : err)
  }
}

export interface StoredEvent extends OpsEvent {
  id: string
  created_at: string
}

/** Events of the given kinds from the last `hours`. Empty on any failure. */
export async function recentEvents(kinds: OpsEventKind[], hours: number): Promise<StoredEvent[]> {
  try {
    const since = new Date(Date.now() - hours * 3600_000).toISOString()
    const { data, error } = await getSupabaseServer()
      .from(TABLE)
      .select('*')
      .in('kind', kinds)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1000)
    if (error) throw error
    return (data ?? []) as StoredEvent[]
  } catch (err) {
    console.error('[ops-events] read failed', err instanceof Error ? err.message : err)
    return []
  }
}

/** How many times this contact's card has failed recently. */
export async function cardFailureCount(contact: string, hours = 24): Promise<number> {
  const key = contact.toLowerCase().trim()
  if (!key) return 0
  return (await recentEvents(['card_failed'], hours)).filter((e) => e.contact === key).length
}
