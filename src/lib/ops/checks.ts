import 'server-only'
import { type LeaseSnapshot, where, money, daysSince, prettyContact } from './snapshot'
import { facilityBySlug } from '@/lib/nectar/facilities'

// ---------------------------------------------------------------------------
// What the sweep looks for. Each check returns findings worth a human's time.
//
// Severity decides delivery: `urgent` findings are emailed on their own the
// moment they're found; `watch` findings ride along in the daily digest. The
// split exists so the alerts stay readable — an inbox that cries wolf gets
// filtered, and then the one that mattered is missed.
// ---------------------------------------------------------------------------

export type Severity = 'urgent' | 'watch'

export interface FindingRow {
  /** Who it concerns. */
  who: string
  /** Where — property and unit. */
  where?: string
  /** Money at stake, when there is any. */
  amount?: number
  /** Short qualifier: "197d late", "autopay OFF". */
  note?: string
  /** Phone or email, so the row is actionable without a lookup. */
  contact?: string
  /** True for the ones that need attention first. */
  severe?: boolean
}

export interface Finding {
  severity: Severity
  /** Short group name, used in the subject line. */
  group: string
  /** Email headline, sentence case, payload in <b>: "Rentals that <b>never collected</b>". */
  headline?: string
  /** Structured rows — rendered as a table in HTML, lines in plain text. */
  rows: FindingRow[]
  /** Total money across the rows, when meaningful. */
  total?: number
  /** What to do about it. */
  action: string
}

/** Plain-text rendering of a finding's rows, for the text fallback. */
export const findingLines = (f: Finding): string[] =>
  f.rows.map((r) =>
    [r.who, r.where, r.amount != null ? money(r.amount) : null, r.note, r.contact]
      .filter(Boolean)
      .join(' · '),
  )

/** A rental that completed but whose money never arrived. */
export function unpaidNewRentals(all: LeaseSnapshot[]): Finding | null {
  const hits = all.filter((s) => {
    const age = daysSince(s.createdAt)
    // Give the provider a day to settle — collection is not synchronous.
    return age !== null && age <= 14 && age >= 1 && s.openBalance > 0 && s.lifetimePayments === 0
  })
  if (!hits.length) return null
  const total = hits.reduce((t, s) => t + s.openBalance, 0)
  return {
    severity: 'urgent',
    group: 'Rentals that never collected',
    headline: 'Rentals that <b>never collected</b>',
    total,
    rows: hits.map((s) => ({
      who: s.name, where: where(s), amount: s.openBalance,
      note: `rented ${daysSince(s.createdAt)}d ago · never paid`, contact: s.phone, severe: true,
    })),
    action: 'Take payment and check why the card never charged. These tenants already have access to their space.',
  }
}

/** A lease that will not collect next month either, because nothing is enrolled. */
export function noAutopay(all: LeaseSnapshot[]): Finding | null {
  const hits = all.filter((s) => !s.autopay && s.openBalance > 0)
  if (!hits.length) return null
  const total = hits.reduce((t, s) => t + s.openBalance, 0)
  return {
    severity: 'urgent',
    group: 'Owing with no autopay',
    headline: 'Owing, with <b>no autopay</b>',
    total,
    rows: hits
      .sort((a, b) => b.openBalance - a.openBalance)
      .map((s) => ({
        who: s.name, where: where(s), amount: s.openBalance,
        note: s.daysLate ? `${s.daysLate}d late` : undefined, contact: s.phone, severe: s.daysLate >= 30,
      })),
    action: 'No card is enrolled, so these will not collect on their own. Enrol a card or chase payment.',
  }
}

/** Newly rented and not enrolled — catchable before it becomes arrears. */
export function newLeaseWithoutAutopay(all: LeaseSnapshot[]): Finding | null {
  const hits = all.filter((s) => {
    const age = daysSince(s.createdAt)
    return age !== null && age <= 3 && !s.autopay
  })
  if (!hits.length) return null
  return {
    severity: 'urgent',
    group: 'New rentals with no autopay',
    headline: 'New rentals with <b>no autopay</b>',
    rows: hits.map((s) => ({
      who: s.name, where: where(s), note: `rented ${daysSince(s.createdAt)}d ago · autopay OFF`,
      contact: s.email ?? s.phone, severe: true,
    })),
    action: 'Enrol a card now, while they are still expecting to hear from us. Left alone these become next month’s arrears.',
  }
}

/**
 * Tenants who legitimately occupy a space at no charge: house accounts, and
 * the previous owner while she moves out. Without this the check would nag
 * every single day about something nobody intends to fix. Override with
 * OPS_ZERO_RENT_IGNORE as a comma-separated list of names.
 */
const zeroRentIgnored = (): string[] =>
  (process.env.OPS_ZERO_RENT_IGNORE ?? 'GRANBURY SELF STORAGE,TRACY BOLT')
    .split(',')
    .map((n) => n.trim().toLowerCase())
    .filter(Boolean)

/** A space rented for nothing, excluding the ones we mean to be free. */
export function zeroRent(all: LeaseSnapshot[], floor = 1): Finding | null {
  const ignored = zeroRentIgnored()
  const hits = all.filter(
    (s) => s.rent < floor && !ignored.some((n) => s.name.toLowerCase().includes(n)),
  )
  if (!hits.length) return null
  return {
    severity: 'urgent',
    group: 'Rented at no charge',
    headline: 'Rented at <b>no charge</b>',
    rows: hits.map((s) => ({ who: s.name, where: where(s), amount: s.rent })),
    action: 'Check the rate in Hummingbird. A $0 group in the back office can be rented straight off the website.',
  }
}

/** Arrears, bucketed so the worst rise to the top. */
export function delinquency(all: LeaseSnapshot[]): Finding | null {
  const late = all.filter((s) => s.openBalance > 0 && s.daysLate > 0).sort((a, b) => b.daysLate - a.daysLate)
  if (!late.length) return null
  const bucket = (n: number) => (n >= 30 ? '30d+' : n >= 10 ? '10–29d' : '1–9d')
  const total = late.reduce((t, s) => t + s.openBalance, 0)
  return {
    severity: late.some((s) => s.daysLate >= 30) ? 'urgent' : 'watch',
    group: 'Past due',
    headline: 'Accounts <b>past due</b>',
    total,
    rows: late.slice(0, 25).map((s) => ({
      who: s.name, where: where(s), amount: s.openBalance,
      note: `${bucket(s.daysLate)} · ${s.daysLate}d late${s.autopay ? '' : ' · NO AUTOPAY'}`,
      contact: s.phone, severe: s.daysLate >= 30,
    })),
    action: 'Work the 30d+ list first. Anything marked NO AUTOPAY will not fix itself.',
  }
}

/** Money that did arrive, so the digest is not purely bad news. */
export function collectedYesterday(all: LeaseSnapshot[]): { count: number; total: number; lines: string[] } {
  const y = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  const rows: string[] = []
  let total = 0
  for (const s of all) {
    for (const p of s.payments) {
      if (p.date === y || p.date === today) {
        total += p.amount
        rows.push(`${p.date} · ${s.name} · ${where(s)} — ${money(p.amount)}`)
      }
    }
  }
  return { count: rows.length, total, lines: rows }
}

export function portfolioSummary(everything: LeaseSnapshot[]) {
  const all = everything.filter((s) => s.readOk)
  const owing = all.filter((s) => s.openBalance > 0)
  return {
    leases: all.length,
    /** Leases that could not be read this run — excluded from every figure. */
    unreadable: everything.length - all.length,
    autopayOn: all.filter((s) => s.autopay).length,
    owingCount: owing.length,
    owingTotal: owing.reduce((t, s) => t + s.openBalance, 0),
    monthlyRent: all.reduce((t, s) => t + s.rent, 0),
  }
}

export function runAllChecks(everything: LeaseSnapshot[]): Finding[] {
  // A lease that failed to read carries default values (rent 0, no site) that
  // are indistinguishable from real problems. Only judge what was read.
  const all = everything.filter((s) => s.readOk)
  return [
    unpaidNewRentals(all),
    newLeaseWithoutAutopay(all),
    zeroRent(all),
    noAutopay(all),
    delinquency(all),
  ].filter((f): f is Finding => f !== null)
}

// ---------------------------------------------------------------------------
// Checks over the people signals (src/lib/ops/events.ts) rather than leases.
// These catch customers who never became a lease, so nothing in the storage
// system would ever show them.
// ---------------------------------------------------------------------------

import { recentEvents, type StoredEvent } from './events'

const contactOf = (e: StoredEvent) => (e.contact ?? '').toLowerCase()

/** Reached the payment step and never finished. The most valuable call list. */
export async function abandonedCheckouts(all: LeaseSnapshot[]): Promise<Finding | null> {
  // An hour's grace: checkout legitimately takes a few minutes, and the charge
  // itself can run to a minute.
  const started = (await recentEvents(['checkout_started'], 72)).filter(
    (e) => Date.now() - Date.parse(e.created_at) > 3600_000,
  )
  if (!started.length) return null
  const rented = new Set(all.map((s) => (s.email ?? '').toLowerCase()).filter(Boolean))
  const seen = new Set<string>()
  const hits = started.filter((e) => {
    const c = contactOf(e)
    if (!c || rented.has(c) || seen.has(c)) return false
    seen.add(c)
    return true
  })
  if (!hits.length) return null
  return {
    severity: 'urgent',
    group: 'Started renting online and didn’t finish',
    headline: 'Started renting, <b>didn’t finish</b>',
    rows: hits.map((e) => {
      const d = (e.detail ?? {}) as { facility?: string; space?: string }
      const hrs = Math.round((Date.now() - Date.parse(e.created_at)) / 3600_000)
      // The rental flow records the facility's slug; show the name people use.
      const site = d.facility ? facilityBySlug(d.facility)?.displayName ?? d.facility : 'one of the sites'
      return {
        who: e.name ?? 'Someone',
        where: `${d.space ?? 'a space'} · ${site}`,
        note: `${hrs}h ago`,
        contact: [e.contact, prettyContact(e.phone ?? undefined)].filter(Boolean).join(' · '),
        severe: true,
      }
    }),
    action: 'They picked a space and entered their details, then stopped at payment. Call them — they were ready to rent.',
  }
}

/** Asked for a sign-in code and never used it. */
export async function unusedSignInCodes(): Promise<Finding | null> {
  const events = await recentEvents(['code_requested', 'code_confirmed'], 48)
  const confirmed = new Set(events.filter((e) => e.kind === 'code_confirmed').map(contactOf))
  const seen = new Set<string>()
  const hits = events.filter((e) => {
    const c = contactOf(e)
    if (e.kind !== 'code_requested' || !c || confirmed.has(c) || seen.has(c)) return false
    if (Date.now() - Date.parse(e.created_at) < 3600_000) return false
    seen.add(c)
    return true
  })
  if (!hits.length) return null
  return {
    severity: 'watch',
    group: 'Asked for a sign-in code and never used it',
    headline: 'Sign-in codes <b>never used</b>',
    rows: hits.map((e) => ({
      who: e.name ?? 'Someone', contact: e.contact ?? undefined,
      note: `${Math.round((Date.now() - Date.parse(e.created_at)) / 3600_000)}h ago`,
    })),
    action: 'Either the email never arrived or they gave up. Worth checking the first few while online payments are new.',
  }
}

/** The same person failing a card more than once — bank block, or our bug. */
export async function repeatedCardFailures(): Promise<Finding | null> {
  const events = await recentEvents(['card_failed'], 48)
  const byContact = new Map<string, StoredEvent[]>()
  for (const e of events) {
    const c = contactOf(e)
    if (!c) continue
    byContact.set(c, [...(byContact.get(c) ?? []), e])
  }
  const hits = [...byContact.entries()].filter(([, list]) => list.length >= 2)
  if (!hits.length) return null
  return {
    severity: 'urgent',
    group: 'Cards failing repeatedly',
    headline: 'Cards <b>failing repeatedly</b>',
    rows: hits.map(([c, list]) => {
      const kinds = [...new Set(list.map((e) => ((e.detail ?? {}) as { kind?: string }).kind ?? '?'))].join(', ')
      return {
        who: list[0].name ?? c, note: `${list.length} failures in 48h · ${kinds}`,
        contact: list[0].phone ?? c, severe: list.length >= 3,
      }
    }),
    action: 'Two or more failures is either their bank blocking us or a bug on our side. Worth a call, and worth checking the reason we logged.',
  }
}

/** The people-signal checks, which need a round trip each. */
export async function runPeopleChecks(all: LeaseSnapshot[]): Promise<Finding[]> {
  const [abandoned, codes, cards] = await Promise.all([
    abandonedCheckouts(all),
    unusedSignInCodes(),
    repeatedCardFailures(),
  ])
  return [abandoned, cards, codes].filter((f): f is Finding => f !== null)
}
