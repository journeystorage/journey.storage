import 'server-only'
import { type LeaseSnapshot, where, money, daysSince } from './snapshot'

// ---------------------------------------------------------------------------
// What the sweep looks for. Each check returns findings worth a human's time.
//
// Severity decides delivery: `urgent` findings are emailed on their own the
// moment they're found; `watch` findings ride along in the daily digest. The
// split exists so the alerts stay readable — an inbox that cries wolf gets
// filtered, and then the one that mattered is missed.
// ---------------------------------------------------------------------------

export type Severity = 'urgent' | 'watch'

export interface Finding {
  severity: Severity
  /** Short group name, used as the heading in the email. */
  group: string
  /** One line per affected lease. */
  lines: string[]
  /** What to do about it. */
  action: string
}

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
    group: `Rentals that never collected — ${money(total)} outstanding`,
    lines: hits.map((s) => `${s.name} · ${where(s)} — ${money(s.openBalance)} owed, rented ${daysSince(s.createdAt)}d ago, nothing ever paid${s.phone ? ` · ${s.phone}` : ''}`),
    action: 'Take payment by phone and check why the card never charged. These tenants have keys and a gate code.',
  }
}

/** A lease that will not collect next month either, because nothing is enrolled. */
export function noAutopay(all: LeaseSnapshot[]): Finding | null {
  const hits = all.filter((s) => !s.autopay && s.openBalance > 0)
  if (!hits.length) return null
  const total = hits.reduce((t, s) => t + s.openBalance, 0)
  return {
    severity: 'urgent',
    group: `Owing with no autopay — ${money(total)} across ${hits.length}`,
    lines: hits
      .sort((a, b) => b.openBalance - a.openBalance)
      .map((s) => `${s.name} · ${where(s)} — ${money(s.openBalance)}${s.daysLate ? `, ${s.daysLate}d late` : ''}${s.phone ? ` · ${s.phone}` : ''}`),
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
    lines: hits.map((s) => `${s.name} · ${where(s)} — rented ${daysSince(s.createdAt)}d ago, autopay OFF${s.email ? ` · ${s.email}` : ''}`),
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
    lines: hits.map((s) => `${s.name} · ${where(s)} — rent ${money(s.rent)}`),
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
    group: `Past due — ${money(total)} across ${late.length}`,
    lines: late.slice(0, 25).map((s) => `[${bucket(s.daysLate)}] ${s.name} · ${where(s)} — ${money(s.openBalance)}, ${s.daysLate}d late${s.autopay ? '' : ' · NO AUTOPAY'}${s.phone ? ` · ${s.phone}` : ''}`),
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

export function portfolioSummary(all: LeaseSnapshot[]) {
  const owing = all.filter((s) => s.openBalance > 0)
  return {
    leases: all.length,
    autopayOn: all.filter((s) => s.autopay).length,
    owingCount: owing.length,
    owingTotal: owing.reduce((t, s) => t + s.openBalance, 0),
    monthlyRent: all.reduce((t, s) => t + s.rent, 0),
  }
}

export function runAllChecks(all: LeaseSnapshot[]): Finding[] {
  return [
    unpaidNewRentals(all),
    newLeaseWithoutAutopay(all),
    zeroRent(all),
    noAutopay(all),
    delinquency(all),
  ].filter((f): f is Finding => f !== null)
}
