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
  /**
   * A payment we have already told staff about. `contact` holds the ledger
   * row's id — it is the dedupe key, not a person — so the watcher can run
   * often without repeating itself.
   */
  | 'payment_seen'

const TABLE = 'ops_events'

export interface OpsEvent {
  kind: OpsEventKind
  /** Email or phone, normalised by the caller. Used to pair events up. */
  contact?: string
  name?: string
  phone?: string
  detail?: Record<string, unknown>
}

/**
 * Test and probe contacts. Reserved domains (RFC 2606 / 6761) can never be a
 * real customer, and the named addresses are ones used to verify these
 * pipelines. They are refused on write and ignored on read, so a test can
 * never turn up in an alert — even if nobody cleans the table.
 */
const TEST_DOMAIN = /@([a-z0-9-]+\.)*(invalid|test|example|localhost)$|@example\.(com|net|org)$/i
const TEST_ADDRESSES = new Set([
  'deploy.probe@journey.storage',
  'sender.test@journey.storage',
  'subject.test@journey.storage',
  'sandbox.tester@example.com',
  'diagnostic.donotuse@journey.storage',
])
export function isTestContact(contact?: string | null): boolean {
  const c = (contact ?? '').trim().toLowerCase()
  return !!c && (TEST_DOMAIN.test(c) || TEST_ADDRESSES.has(c))
}

export async function recordEvent(e: OpsEvent): Promise<void> {
  if (e.kind !== 'payment_seen' && isTestContact(e.contact)) return
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
    return ((data ?? []) as StoredEvent[]).filter(
      (e) => e.kind === 'payment_seen' || !isTestContact(e.contact),
    )
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

/** Record several events at once — one insert, for the payment watcher. */
export async function recordEvents(events: OpsEvent[]): Promise<void> {
  if (!events.length) return
  try {
    await getSupabaseServer().from(TABLE).insert(
      events.map((e) => ({
        kind: e.kind,
        contact: (e.contact ?? '').toLowerCase().trim() || null,
        name: e.name ?? null,
        phone: e.phone ?? null,
        detail: e.detail ?? {},
      })),
    )
  } catch (err) {
    console.error('[ops-events] batch write failed', err instanceof Error ? err.message : err)
  }
}
