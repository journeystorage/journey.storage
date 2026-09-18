import 'server-only'
import { nectarV2 } from '@/lib/nectar/client'
import { COMPANY_ID, facilityByPropertyId } from '@/lib/nectar/facilities'

// ---------------------------------------------------------------------------
// One pass over the portfolio, shared by every operational check.
//
// Reading each lease is a round trip, so the sweep takes a single snapshot and
// every check reads from it. Field notes learned the hard way:
//   · `Metrics.has_autopay` is the real autopay signal. The lease's
//     `auto_pay_after_billing_date` is 0 even on leases that plainly autopay
//     (1 of 90 sampled), so it must NOT be used.
//   · Invoice `paid` is 0 even on settled invoices; invoice `balance` is the
//     honest one, and `leases/{id}/payments` always returns [].
//   · `leases/{id}/ledger` is the reliable payment record.
// ---------------------------------------------------------------------------

const co = () => COMPANY_ID

export interface LeaseSnapshot {
  leaseId: string
  name: string
  email?: string
  phone?: string
  unitId?: string
  unitNumber?: string
  propertyName?: string
  /** Monthly rent. 0 or missing means it was rented at no charge. */
  rent: number
  openBalance: number
  /** Hummingbird's own standing, e.g. "Current" / "Delinquent". */
  standing?: string
  daysLate: number
  paidThrough?: string
  /** Whether the lease actually collects by card. The predictor that matters. */
  autopay: boolean
  /** Total ever collected — 0 on a lease that has never paid. */
  lifetimePayments: number
  /** When the lease was created, for "new rental" checks. */
  createdAt?: string
  /** Ledger payment rows, newest first. */
  payments: Array<{ date: string; amount: number; status?: string }>
}

interface TenantRow {
  lease_id?: string
  created_at?: string
  Contact?: { first?: string; last?: string; email?: string; Phones?: Array<{ phone?: string }> }
  Lease?: { id?: string; unit_id?: string; created_at?: string; start_date?: string }
}

async function allTenantRows(): Promise<TenantRow[]> {
  const rows: TenantRow[] = []
  for (let offset = 0; offset < 4000; offset += 100) {
    const { data } = await nectarV2<{ tenant?: TenantRow[]; paging?: { total?: number } }>(
      `companies/${co()}/tenants`,
      { query: { limit: 100, offset, status: 'active' } },
    )
    const page = data.tenant ?? []
    if (!page.length) break
    rows.push(...page)
    if (offset + 100 >= (data.paging?.total ?? 0)) break
  }
  return rows
}

/** Run `work` over `items` a few at a time, so we don't hammer the API. */
async function pooled<T, R>(items: T[], size: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(work))))
  }
  return out
}

export async function takeSnapshot(): Promise<LeaseSnapshot[]> {
  const rows = await allTenantRows()
  const byLease = new Map<string, TenantRow>()
  for (const r of rows) if (r.lease_id && !byLease.has(r.lease_id)) byLease.set(r.lease_id, r)

  return pooled([...byLease.entries()], 8, async ([leaseId, row]) => {
    const c = row.Contact ?? {}
    const snap: LeaseSnapshot = {
      leaseId,
      name: `${c.first ?? ''} ${c.last ?? ''}`.trim() || 'Unknown tenant',
      email: c.email,
      phone: (c.Phones ?? [])[0]?.phone,
      unitId: row.Lease?.unit_id,
      rent: 0,
      openBalance: 0,
      daysLate: 0,
      autopay: false,
      lifetimePayments: 0,
      createdAt: row.Lease?.created_at ?? row.created_at ?? row.Lease?.start_date,
      payments: [],
    }
    try {
      const { data } = await nectarV2<{ lease?: Record<string, unknown> }>(`companies/${co()}/leases/${leaseId}`)
      const lz = (data.lease ?? {}) as Record<string, unknown>
      const metrics = (lz.Metrics ?? {}) as Record<string, unknown>
      snap.rent = Number(lz.rent ?? 0)
      snap.openBalance = Number(lz.open_balance ?? lz.balance ?? 0)
      snap.standing = ((lz.Standing ?? {}) as { name?: string }).name
      snap.daysLate = Number(lz.days_late ?? 0)
      snap.paidThrough = (lz.rent_paid_through as string) ?? undefined
      snap.autopay = metrics.has_autopay === true
      snap.lifetimePayments = Number(metrics.lifetime_payments ?? 0)
      const unit = (lz.Unit ?? {}) as { number?: string | number; property_id?: string }
      if (unit.number != null) snap.unitNumber = String(unit.number)
      if (unit.property_id) snap.propertyName = facilityByPropertyId(unit.property_id)?.displayName
    } catch { /* leave defaults; a single unreadable lease must not fail the sweep */ }

    try {
      const { data } = await nectarV2<{ ledger?: Array<{ date?: string; payments?: number; status?: string; description?: string }> }>(
        `companies/${co()}/leases/${leaseId}/ledger`,
      )
      snap.payments = (data.ledger ?? [])
        .filter((r) => (r.payments ?? 0) > 0)
        .map((r) => ({ date: String(r.date ?? '').slice(0, 10), amount: Number(r.payments ?? 0), status: r.status }))
        .sort((a, b) => b.date.localeCompare(a.date))
    } catch { /* ledger is best-effort */ }

    return snap
  })
}

/** Facility name, falling back to something printable. */
export const where = (s: LeaseSnapshot) =>
  `${s.propertyName ?? 'Unknown site'}${s.unitNumber ? ` · Unit ${s.unitNumber}` : ''}`

export const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Rounded, for headline figures where cents are noise. */
export const moneyShort = (n: number) =>
  `$${Math.round(n).toLocaleString('en-US')}`

/** Days between an ISO date and now; negative means the future. */
export function daysSince(iso?: string): number | null {
  if (!iso) return null
  const t = Date.parse(String(iso).slice(0, 19).replace(' ', 'T'))
  if (Number.isNaN(t)) return null
  return Math.floor((Date.now() - t) / 86_400_000)
}
