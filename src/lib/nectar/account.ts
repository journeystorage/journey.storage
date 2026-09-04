import 'server-only'
import { nectarV2 } from './client'
import { COMPANY_ID, facilityByPropertyId } from './facilities'

// ---------------------------------------------------------------------------
// Account / Pay Bill — look a tenant up by email or phone, read the balance,
// and post a payment against the lease.
//
// There is no server-side tenant search, so lookup pages the company's active
// tenants (100/page) and matches the inline Contact's email / phone. Balance
// isn't on the inline Lease, so it's read from GET leases/{id}. Payment posts
// to POST leases/{id}/payment. Card data is server-side only, never logged.
// ---------------------------------------------------------------------------

const co = () => COMPANY_ID
const digits = (s: string) => s.replace(/\D/g, '')

interface TenantRow {
  lease_id?: string
  Contact?: { first?: string; last?: string; email?: string; Phones?: Array<{ phone?: string }> }
  Lease?: { id?: string; unit_id?: string }
}

export interface AccountMatch {
  leaseId: string
  name: string
  code?: string
  unitId?: string
  /** Human unit number, e.g. "85" or "B210". */
  unitNumber?: string
  /** Unit size label, e.g. "10' x 10'". */
  unitSize?: string
  propertyId?: string
  propertyName?: string
  balance: number
  monthlyRent?: number
  /** Paid-through date (YYYY-MM-DD) when nothing is owed. */
  paidThrough?: string
  /** Open invoice, when there is one — drives the "what am I paying" line. */
  dueDate?: string
  periodStart?: string
  periodEnd?: string
  pastDue?: boolean
}

interface LeaseDetail {
  balance?: number
  open_balance?: number
  code?: string
  unit_id?: string
  rent?: number
  rent_paid_through?: string
}
interface UnitDetail {
  number?: string | number
  label?: string
  property_id?: string
}
interface InvoiceRow {
  paid?: number
  balance?: number
  amount?: number
  due?: string
  date?: string
  period_start?: string
  period_end?: string
  unit_number?: string
  property_id?: string
}

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Find every active lease whose tenant matches the given email or phone.
 * A tenant may hold several spaces — including at different properties — so all
 * matches are returned, deduped by lease, each enriched with the unit number and
 * property name so the payer can tell them apart.
 */
export async function findLeasesByContact(contact: string): Promise<AccountMatch[]> {
  const isEmail = contact.includes('@')
  const target = isEmail ? contact.trim().toLowerCase() : digits(contact)
  if (!target || (!isEmail && target.length < 7)) return []

  const byLease = new Map<string, AccountMatch>()
  for (let offset = 0; offset < 2000; offset += 100) {
    const { data } = await nectarV2<{ tenant?: TenantRow[]; paging?: { total?: number } }>(
      `companies/${co()}/tenants`,
      { query: { limit: 100, offset, status: 'active' } },
    )
    const rows = data.tenant ?? []
    if (!rows.length) break
    for (const t of rows) {
      const c = t.Contact ?? {}
      const email = (c.email ?? '').toLowerCase()
      const phones = (c.Phones ?? []).map((p) => digits(p.phone ?? ''))
      const hit = isEmail ? email === target : phones.some((p) => p.endsWith(target) || target.endsWith(p))
      if (hit && t.lease_id && !byLease.has(t.lease_id)) {
        byLease.set(t.lease_id, {
          leaseId: t.lease_id,
          name: `${c.first ?? ''} ${c.last ?? ''}`.trim() || 'Your account',
          unitId: t.Lease?.unit_id,
          balance: 0,
        })
      }
    }
    // Keep scanning: a tenant's spaces can straddle pages, and leases at
    // different properties are separate rows.
    if (offset + 100 >= (data.paging?.total ?? 0)) break
  }

  // Enrich each lease: balance + rent from the lease, unit number/size and
  // property from the unit, billing period from the open invoice.
  await Promise.all(
    [...byLease.values()].map(async (m) => {
      try {
        const { data } = await nectarV2<{ lease?: LeaseDetail } & LeaseDetail>(`companies/${co()}/leases/${m.leaseId}`)
        const lz = (data.lease ?? data) as LeaseDetail
        m.balance = lz.open_balance ?? lz.balance ?? 0
        m.code = lz.code
        m.monthlyRent = lz.rent
        m.paidThrough = lz.rent_paid_through
        if (!m.unitId && lz.unit_id) m.unitId = lz.unit_id
      } catch { /* leave balance 0 */ }

      const unitCall = m.unitId
        ? nectarV2<{ unit?: UnitDetail } & UnitDetail>(`companies/${co()}/units/${m.unitId}`)
            .then(({ data }) => {
              const u = (data.unit ?? data) as UnitDetail
              if (u.number != null && String(u.number).trim() !== '') m.unitNumber = String(u.number)
              m.unitSize = u.label
              m.propertyId = u.property_id
              if (u.property_id) m.propertyName = facilityByPropertyId(u.property_id)?.displayName
            })
            .catch(() => {})
        : Promise.resolve()

      const invoiceCall = nectarV2<{ invoices?: InvoiceRow[] }>(`companies/${co()}/leases/${m.leaseId}/invoices`)
        .then(({ data }) => {
          const open = (data.invoices ?? [])
            .filter((i) => !i.paid && (i.balance ?? 0) > 0)
            .sort((a, b) => String(a.due ?? '').localeCompare(String(b.due ?? '')))[0]
          if (!open) return
          m.dueDate = open.due
          m.periodStart = open.period_start
          m.periodEnd = open.period_end
          // `due` may carry a time component; compare on the date part only.
          m.pastDue = !!open.due && open.due.slice(0, 10) < today()
          if (!m.unitNumber && open.unit_number) m.unitNumber = open.unit_number
          if (!m.propertyName && open.property_id) m.propertyName = facilityByPropertyId(open.property_id)?.displayName
        })
        .catch(() => {})

      await Promise.all([unitCall, invoiceCall])
    }),
  )

  // Owed first, then by property and unit so the list reads predictably.
  return [...byLease.values()].sort(
    (a, b) =>
      Number(b.balance > 0) - Number(a.balance > 0) ||
      (a.propertyName ?? '').localeCompare(b.propertyName ?? '') ||
      (a.unitNumber ?? '').localeCompare(b.unitNumber ?? '', undefined, { numeric: true }),
  )
}

export interface PayCard {
  card_number: string
  cvv2: string
  exp_mo: string
  exp_yr: string
  name_on_card: string
  address: string
  city: string
  state: string
  zip: string
}

/**
 * Store a card on the lease and return its payment-method id.
 *
 * `auto_charge: true` is what enrols the lease in autopay — verified against
 * the sandbox: storing a card this way flips the lease's
 * `auto_pay_after_billing_date` from 0 to 1. A billing-address zip is required.
 * The body is FLAT (a nested `payment_method` object is rejected).
 */
export async function savePaymentMethod(leaseId: string, card: PayCard, autopay: boolean): Promise<string> {
  const { data } = await nectarV2<{ paymentMethod?: { id?: string } } & { id?: string }>(
    `companies/${co()}/leases/${leaseId}/payment-methods`,
    { method: 'POST', body: { type: 'card', ...card, auto_charge: autopay } },
  )
  const id = data.paymentMethod?.id ?? data.id
  if (!id) throw new Error('Card could not be saved')
  return id
}

export interface PayResult {
  ok: boolean
  autopayOn: boolean
  requestId?: string
  message?: string
}

/**
 * Pay a lease: store the card, then charge it.
 *
 * The charge endpoint takes only `payment_amount` + a 10-char
 * `payment_method_id` — it will NOT accept card details inline (a nested
 * `payment_method` returns 400 "payment_method is not allowed"), which is why
 * the card has to be stored first.
 */
export async function payLease(leaseId: string, amount: number, card: PayCard, autopay = false): Promise<PayResult> {
  const paymentMethodId = await savePaymentMethod(leaseId, card, autopay)
  const { data, requestId } = await nectarV2<{ payment_id?: string; message?: string }>(
    `companies/${co()}/leases/${leaseId}/payment`,
    { method: 'POST', body: { payment_amount: amount, payment_method_id: paymentMethodId } },
  )
  return { ok: !!(data?.payment_id ?? true), autopayOn: autopay, requestId, message: data?.message }
}

/** Turn on autopay without taking a payment now. */
export async function enableAutopay(leaseId: string, card: PayCard): Promise<{ ok: boolean }> {
  await savePaymentMethod(leaseId, card, true)
  return { ok: true }
}
