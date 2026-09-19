import 'server-only'
import { nectarV2, nectarV1 } from './client'
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
  Contact?: { id?: string; first?: string; last?: string; email?: string; Phones?: Array<{ phone?: string }> }
  Lease?: { id?: string; unit_id?: string }
}

export interface AccountMatch {
  leaseId: string
  name: string
  /**
   * Hummingbird contact id and the email on file. Server-side only — never
   * returned by the lookup API, since that endpoint needs no authentication.
   */
  contactId?: string
  contactEmail?: string
  code?: string
  unitId?: string
  /** Human unit number, e.g. "85" or "B210". */
  unitNumber?: string
  /** Unit size label, e.g. "10' x 10'". */
  unitSize?: string
  propertyId?: string
  propertyName?: string
  /** Facility slug, so the UI can link to that location's spaces. */
  propertySlug?: string
  balance: number
  monthlyRent?: number
  /** Paid-through date (YYYY-MM-DD) when nothing is owed. */
  paidThrough?: string
  /**
   * When the next payment is due. Verified against live data: this is always
   * rent_paid_through + 1 day, and it matches both the lease's bill_day and the
   * open invoice's due date whenever one exists.
   */
  nextDueDate?: string
  /** Open invoice, when there is one — drives the "what am I paying" line. */
  dueDate?: string
  periodStart?: string
  periodEnd?: string
  pastDue?: boolean
  /**
   * Whether this lease is enrolled in autopay. Hummingbird stores it as
   * `auto_pay_after_billing_date` — 0 is off, a positive number is the day
   * offset it charges on. Read-only: the edge API exposes no way to switch it
   * on, off, or onto a different card (every route 404s, and deleting the
   * autopay card is refused), so changes go through staff.
   */
  autopayOn?: boolean
  /**
   * Card kept on file for this lease, e.g. "Visa ending 5007". Only ever
   * returned after the tenant has verified ownership of the account.
   */
  cardOnFile?: string
}

interface LeaseDetail {
  balance?: number
  open_balance?: number
  code?: string
  unit_id?: string
  rent?: number
  rent_paid_through?: string
  auto_pay_after_billing_date?: number
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
          contactId: c.id,
          contactEmail: c.email,
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
        m.autopayOn = (lz.auto_pay_after_billing_date ?? 0) > 0
        if (lz.rent_paid_through) {
          const d = new Date(`${String(lz.rent_paid_through).slice(0, 10)}T00:00`)
          if (!Number.isNaN(d.getTime())) {
            d.setDate(d.getDate() + 1)
            m.nextDueDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          }
        }
        if (!m.unitId && lz.unit_id) m.unitId = lz.unit_id
      } catch { /* leave balance 0 */ }

      const unitCall = m.unitId
        ? nectarV2<{ unit?: UnitDetail } & UnitDetail>(`companies/${co()}/units/${m.unitId}`)
            .then(({ data }) => {
              const u = (data.unit ?? data) as UnitDetail
              if (u.number != null && String(u.number).trim() !== '') m.unitNumber = String(u.number)
              m.unitSize = u.label
              m.propertyId = u.property_id
              if (u.property_id) {
                const f = facilityByPropertyId(u.property_id)
                m.propertyName = f?.displayName
                m.propertySlug = f?.slug
              }
            })
            .catch(() => {})
        : Promise.resolve()

      const cardCall = nectarV2<{ paymentMethods?: Array<{ card_end?: string; card_type?: string }> }>(
        `companies/${co()}/leases/${m.leaseId}/payment-methods`,
      )
        .then(({ data }) => {
          const pm = (data.paymentMethods ?? [])[0]
          if (!pm?.card_end) return
          const brand = (pm.card_type ?? '').trim()
          const pretty = brand ? brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase() : 'Card'
          m.cardOnFile = `${pretty} ending ${pm.card_end}`
        })
        .catch(() => {})

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
          if (!m.propertyName && open.property_id) {
            const f = facilityByPropertyId(open.property_id)
            m.propertyName = f?.displayName
            m.propertySlug = m.propertySlug ?? f?.slug
          }
        })
        .catch(() => {})

      await Promise.all([unitCall, invoiceCall, cardCall])
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
 * NOTE: `auto_charge` does NOT enrol the lease in autopay. Retested on the
 * sandbox — a lease created with auto_charge:false still came back with
 * auto_pay_after_billing_date = 2, while adding a card later with
 * auto_charge:true left an autopay-off lease at 0. The flag comes from a
 * property default applied at lease creation; the edge API exposes no way to
 * turn autopay on, off, or move it to another card.
 * A billing-address zip is required. The body is FLAT (a nested
 * `payment_method` object is rejected).
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


/**
 * A card already stored on this lease matching the one being paid with, by
 * brand-agnostic last four. Returns its payment-method id, or null when the
 * card is genuinely new. Never throws — a failed lookup just means "store it".
 */
async function findStoredCard(leaseId: string, card: PayCard): Promise<string | null> {
  const last4 = card.card_number.replace(/\D/g, '').slice(-4)
  if (last4.length !== 4) return null
  try {
    const { data } = await nectarV2<{ paymentMethods?: Array<{ id?: string; card_end?: string }> }>(
      `companies/${co()}/leases/${leaseId}/payment-methods`,
    )
    const hit = (data.paymentMethods ?? []).find((pm) => pm.card_end === last4 && pm.id)
    return hit?.id ?? null
  } catch {
    return null
  }
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
  // Reuse a card already on the lease rather than storing another copy.
  // Storing unconditionally meant every failed attempt left a duplicate behind
  // (one live lease collected four cards over three retries), which clutters
  // the back office and makes it impossible to tell which card is real.
  const paymentMethodId = (await findStoredCard(leaseId, card)) ?? (await savePaymentMethod(leaseId, card, autopay))
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


/**
 * The contact behind an email/phone, for the ownership check. Returns the id we
 * address the code to and the email it goes to — never surfaced to the browser.
 */
export async function findContactFor(
  contact: string,
): Promise<{ contactId: string; email: string; name: string; matches: AccountMatch[] } | null> {
  const matches = await findLeasesByContact(contact)
  const hit = matches.find((m) => m.contactId && m.contactEmail)
  if (!hit?.contactId || !hit.contactEmail) return null
  // `matches` rides along so callers don't pay for a second full tenant scan
  // (it pages every active tenant) just to report what the tenant owes.
  return { contactId: hit.contactId, email: hit.contactEmail, name: hit.name, matches }
}


/**
 * Name and email straight off the contact record, for a verified tenant whose
 * details we deliberately don't accept from the browser.
 */
export async function getContactBasics(contactId: string): Promise<{ first: string; last: string; email: string } | null> {
  try {
    const { data } = await nectarV2<{ contact?: { first?: string; last?: string; email?: string } } & { first?: string; last?: string; email?: string }>(
      `companies/${co()}/contacts/${contactId}`,
    )
    const c = (data.contact ?? data) as { first?: string; last?: string; email?: string }
    if (!c?.email) return null
    return { first: c.first ?? '', last: c.last ?? '', email: c.email }
  } catch {
    return null
  }
}


/**
 * A one-time hosted payment link for a tenant — Tenant Inc's supported way to
 * collect from an existing tenant, and the answer to the v2 payment endpoint
 * that crashed on contact_id (their engineering team, 2026-09-18).
 *
 * The tenant pays on Hummingbird's own page and the payment posts to their
 * ledger automatically, so no card details ever reach us. The link is scoped
 * to the CONTACT, not a lease — it cannot be limited to one space or amount
 * (lease_id and amount query params are ignored) — and it expires at midnight
 * local time, so generate one per request and never store it.
 *
 * It is a bearer credential to pay on that account: only ever hand it to a
 * verified session, and never log it.
 */
export async function getPaymentLink(contactId: string): Promise<string | null> {
  const { data } = await nectarV1<{ link?: string }>(`companies/${co()}/contacts/${contactId}/one-time-link`)
  const link = data.link
  return typeof link === 'string' && /^https:\/\//.test(link) ? link : null
}
