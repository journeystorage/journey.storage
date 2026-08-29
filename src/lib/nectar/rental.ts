import 'server-only'
import { nectarV2 } from './client'
import { COMPANY_ID } from './facilities'

// ---------------------------------------------------------------------------
// Real Nectar v2 rental chain (the online move-in).
// Verified live against the sandbox (company kQoBXpBpnx, property 85B73ubBGy):
//   space-types → space-groups → groups?cost=true → offers → hold → lease-set-up
// The commit steps (reserve → documents/finalize → lease → autopay) are built
// from the tenant.dev rental-flow docs and are exercised end-to-end once the
// live company authorizes (a throwaway tenant, not sandbox clutter).
//
// Envelope handling + inner-status errors are done by nectarV2.
// ---------------------------------------------------------------------------

const co = () => COMPANY_ID

export interface SpaceType {
  unit_type_id: string
  unit_type_name: string
  display_name: string
  id: string
  show_on_website?: number
}

export interface SpaceGroup {
  id: string
  name: string
  property_id: string
  active: number
  is_default: number
}

interface RangeBucket { count?: number; min_price?: number; max_price?: number }
export interface Tier {
  tier_id: string
  description: string
  width: string | null
  length: string | null
  space_type_id: string
  set_rate: number | null
  sell_rate: number | null
  units?: RangeBucket
  vacant?: RangeBucket
  promo?: Array<{ id: string; name: string; type: string; value: number }>
  allocated_promo?: { id?: string; name?: string; type?: string; value?: number; channel?: string }
}

export interface Offer {
  unit_id?: string
  space_mix_id?: string
  value_tier?: { type: string; label: string }
  apwEnable?: boolean
  dossier?: { token?: string }
}

export interface Insurance {
  id: string
  name: string
  description: string
  coverage: string
  premium_value: number
  premium_type: string
  taxable: number
  unit_type_id: string
  recurring: number
}

export interface LeaseCharges {
  date?: string
  discounts?: number
  sub_total?: number
  total_tax?: number
  total_due?: number
  balance?: number
  Detail?: Array<{ name: string; cost: number; total_cost: number; qty?: number }>
}
export interface LeaseSetup {
  rent?: number
  monthly?: number
  bill_day?: number
  start_date?: string
  end_date?: string | null
  security_deposit?: number | null
  terms?: number
  Charges?: LeaseCharges
  Invoices?: unknown[]
  Discounts?: Array<{ promotion_id: string; value: number; type: string; name: string }>
  Promotions?: Array<{ name: string; value: number; type: string; months: number }>
}

// ── Read chain (all GET, verified) ──────────────────────────────────────────

export async function getSpaceTypes(): Promise<SpaceType[]> {
  const { data } = await nectarV2<SpaceType[]>(`companies/${co()}/space-management/space-types`, { next: { revalidate: 600 } })
  return Array.isArray(data) ? data : []
}

export async function getSpaceGroups(propertyId: string): Promise<SpaceGroup[]> {
  const { data } = await nectarV2<{ spaceGroups: SpaceGroup[] }>(`companies/${co()}/properties/${propertyId}/space-groups`, { next: { revalidate: 600 } })
  return data.spaceGroups ?? []
}

/** Flattened rate tiers for a space-group profile (cost=true → pricing per tier). */
export async function getTiers(propertyId: string, spaceGroupId: string): Promise<Tier[]> {
  const { data } = await nectarV2<{ spaceGroupProfile: Record<string, unknown> }>(
    `companies/${co()}/properties/${propertyId}/space-groups/${spaceGroupId}/groups`,
    { query: { cost: true }, next: { revalidate: 120 } },
  )
  const tiers: Tier[] = []
  for (const v of Object.values(data.spaceGroupProfile ?? {})) {
    const groups = (v as { groups?: Array<{ tiers?: Tier[] }> })?.groups
    if (Array.isArray(groups)) for (const g of groups) for (const t of g.tiers ?? []) tiers.push(t)
  }
  return tiers
}

/** Bookable offers (units) for a tier. Only call for tiers with vacant.count > 0. */
export async function getOffers(propertyId: string, tierId: string): Promise<Offer[]> {
  const { data } = await nectarV2<{ offers: Offer[] }>(
    `companies/${co()}/properties/${propertyId}/offers`,
    { query: { unitGroupId: tierId } },
  )
  return data.offers ?? []
}

export async function getInsurances(propertyId: string, unitTypeIds: string[]): Promise<Insurance[]> {
  const { data } = await nectarV2<{ insurances: Insurance[] }>(
    `companies/${co()}/properties/${propertyId}/insurances`,
    { query: { unit_type_ids: `[${unitTypeIds.join(',')}]` }, next: { revalidate: 600 } },
  )
  return data.insurances ?? []
}

/**
 * Resolve a bookable unit for a requested size at a facility.
 * Matches a vacant tier by width×length (falls back to the first vacant tier),
 * then pulls the offer carrying a unit_id. Returns the pieces the hold/quote
 * steps need. Width/length come from the space-mix card the user clicked.
 */
export async function resolveBookableUnit(
  propertyId: string,
  want: { width?: number | null; length?: number | null },
): Promise<{ unitId: string; tierId: string; spaceMixId?: string; dossierToken?: string; spaceTypeId?: string } | null> {
  const groups = await getSpaceGroups(propertyId)
  const group = groups.find((g) => g.is_default === 1 && g.active === 1) ?? groups.find((g) => g.active === 1) ?? groups[0]
  if (!group) return null
  const tiers = (await getTiers(propertyId, group.id)).filter((t) => (t.vacant?.count ?? 0) > 0)
  if (!tiers.length) return null
  const dimMatch = (t: Tier) => want.width != null && want.length != null && Number(t.width) === want.width && Number(t.length) === want.length
  const tier = tiers.find(dimMatch) ?? tiers[0]
  const offers = await getOffers(propertyId, tier.tier_id)
  const offer = offers.find((o) => o.unit_id)
  if (!offer?.unit_id) return null
  return { unitId: offer.unit_id, tierId: tier.tier_id, spaceMixId: offer.space_mix_id, dossierToken: offer.dossier?.token, spaceTypeId: tier.space_type_id }
}

// ── Hold + quote (verified) ─────────────────────────────────────────────────

export async function holdUnit(unitId: string): Promise<string> {
  const { data } = await nectarV2<{ hold_token: string }>(`companies/${co()}/units/${unitId}/hold`, { method: 'POST' })
  return data.hold_token
}

export interface LeaseSetupParams {
  hold_token: string
  start_date: string // YYYY-MM-DD
  insurance_id?: string
  promotions?: Array<{ promotion_id: string }>
  token?: string // dossier offer token
}
export async function leaseSetup(unitId: string, p: LeaseSetupParams): Promise<LeaseSetup> {
  const { data } = await nectarV2<{ details: LeaseSetup }>(`companies/${co()}/units/${unitId}/lease-set-up`, { method: 'POST', body: p })
  return data.details
}

// ── Commit steps (from docs — smoke-test at go-live) ────────────────────────
// Payment card data flows through these bodies; nectarV2 redaction is on the
// legacy client, so keep these server-only and never log the body.

export interface ReserveParams {
  hold_token: string
  move_in_cost?: unknown
  bill_day?: number
  start_date?: string
  tenant?: unknown // { firstName, lastName, email, phone, Address:{...} }
}
export async function reserveUnit(unitId: string, body: ReserveParams) {
  const { data } = await nectarV2(`companies/${co()}/units/${unitId}/reserve`, { method: 'POST', body })
  return data as { reservation_id?: string; lease_id?: string; tenants?: unknown }
}

export async function finalizeDocuments(unitId: string, body: unknown) {
  const { data } = await nectarV2(`companies/${co()}/units/${unitId}/documents/finalize`, { method: 'POST', body })
  return data as { documents?: Array<{ document_type?: string; filename?: string; src?: string; url?: string; display_name?: unknown }>; signed?: boolean }
}

export async function createLease(unitId: string, body: unknown) {
  const { data } = await nectarV2(`companies/${co()}/units/${unitId}/lease`, { method: 'POST', body })
  return data as { lease_id?: string; payment_method_id?: string }
}

export async function setAutopay(leaseId: string, paymentMethodId: string, enable = true) {
  const { data } = await nectarV2(
    `companies/${co()}/leases/${leaseId}/payment-methods/${paymentMethodId}/autopay`,
    { method: enable ? 'PUT' : 'DELETE' },
  )
  return data
}
