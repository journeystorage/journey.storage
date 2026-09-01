import 'server-only'
import { nectarV2 } from './client'
import { COMPANY_ID } from './facilities'

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
  balance: number
}

/** Find active leases whose tenant matches the given email or phone. */
export async function findLeasesByContact(contact: string): Promise<AccountMatch[]> {
  const isEmail = contact.includes('@')
  const target = isEmail ? contact.trim().toLowerCase() : digits(contact)
  if (!target || (!isEmail && target.length < 7)) return []

  const matches: AccountMatch[] = []
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
      if (hit && t.lease_id) {
        matches.push({ leaseId: t.lease_id, name: `${c.first ?? ''} ${c.last ?? ''}`.trim() || 'Your account', unitId: t.Lease?.unit_id, balance: 0 })
      }
    }
    if (matches.length) break // email/phone is unique enough — stop at the first hit page
    if (offset + 100 >= (data.paging?.total ?? 0)) break
  }

  // Balance lives on the full lease, not the inline one.
  for (const m of matches) {
    try {
      const { data } = await nectarV2<{ lease?: { balance?: number; open_balance?: number; code?: string } } & { balance?: number; open_balance?: number; code?: string }>(`companies/${co()}/leases/${m.leaseId}`)
      const lz = (data.lease ?? data) as { balance?: number; open_balance?: number; code?: string }
      m.balance = lz.open_balance ?? lz.balance ?? 0
      m.code = lz.code
    } catch { /* leave balance 0 */ }
  }
  return matches
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

/** Post a payment against a lease. Returns a confirmation-safe result. */
export async function payLease(leaseId: string, amount: number, card: PayCard): Promise<{ ok: boolean; requestId?: string; message?: string }> {
  const { data, requestId } = await nectarV2<{ payment_id?: string; message?: string }>(
    `companies/${co()}/leases/${leaseId}/payment`,
    { method: 'POST', body: { payment_amount: amount, payment_method: { type: 'card', ...card } } },
  )
  return { ok: !!(data?.payment_id ?? true), requestId, message: data?.message }
}
