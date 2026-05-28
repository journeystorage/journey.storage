/**
 * Tenant Inc. / Nectar API client (server-side only)
 *
 * All calls go through this module so credentials never leak to the browser.
 * Import this ONLY in API routes or server components.
 */

const BASE_URL = process.env.TENANT_API_BASE_URL!
const APP_ID = process.env.TENANT_APP_ID!
const COMPANY_ID = process.env.TENANT_COMPANY_ID!
const API_KEY = process.env.TENANT_API_KEY!
const API_VERSION = process.env.TENANT_API_VERSION || 'v2'

function buildUrl(path: string) {
  return `${BASE_URL}/${APP_ID}/${API_VERSION}/companies/${COMPANY_ID}/${path}`
}

function headers() {
  return {
    'X-Storageapi-Key': API_KEY,
    'X-Storageapi-Date': Math.floor(Date.now() / 1000).toString(),
    'Content-Type': 'application/json',
  }
}

/**
 * Unwrap Tenant's response envelope.
 * Response shape: { applicationData: { APP_ID: [{ status, data, message }] } }
 */
function unwrap<T>(json: Record<string, unknown>): T {
  const appData = (json.applicationData as Record<string, unknown[]>)?.[APP_ID]
  if (!appData?.[0]) throw new Error('Unexpected Tenant API response structure')
  const entry = appData[0] as { status: number; data: T; message?: string; msg?: string }
  if (entry.status !== 200) {
    throw new Error(entry.msg || entry.message || `Tenant API error: ${entry.status}`)
  }
  return entry.data
}

// ── Read endpoints ──────────────────────────────────────────────

export async function getProperties() {
  const res = await fetch(buildUrl('properties'), { headers: headers(), next: { revalidate: 300 } })
  const json = await res.json()
  return unwrap<{ properties: TenantProperty[]; paging: Paging }>(json)
}

export async function getProperty(propertyId: string) {
  const res = await fetch(buildUrl(`properties/${propertyId}`), { headers: headers(), next: { revalidate: 300 } })
  const json = await res.json()
  return unwrap<{ properties: TenantProperty[] }>(json)
}

export async function getUnits(propertyId: string, opts?: { limit?: number; offset?: number; concise?: boolean }) {
  const params = new URLSearchParams()
  if (opts?.limit) params.set('limit', String(opts.limit))
  if (opts?.offset) params.set('offset', String(opts.offset))
  if (opts?.concise) params.set('concise', 'true')
  const qs = params.toString() ? `?${params}` : ''
  const res = await fetch(buildUrl(`properties/${propertyId}/units${qs}`), { headers: headers(), next: { revalidate: 60 } })
  const json = await res.json()
  return unwrap<{ units: TenantUnit[]; paging: Paging }>(json)
}

export async function getUnit(unitId: string) {
  const res = await fetch(buildUrl(`units/${unitId}`), { headers: headers(), next: { revalidate: 60 } })
  const json = await res.json()
  return unwrap<TenantUnit>(json)
}

export async function getCategories() {
  const res = await fetch(buildUrl('categories/list'), { headers: headers(), next: { revalidate: 600 } })
  const json = await res.json()
  return unwrap<{ categories: TenantCategory[] }>(json)
}

// ── Types ───────────────────────────────────────────────────────

export interface Paging {
  total: number
  count: number
}

export interface TenantProperty {
  id: string
  name: string
  legal_name: string
  number: string
  description: string
  status: number
  unit_count: number
  lease_count: number
  occupancy: number
  landing_page: string | null
  Address: {
    address: string
    address2: string | null
    city: string
    state: string
    zip: string
    country: string
    lat: number
    lng: number
  }
  Phones: { phone: string; type: string }[]
  Emails: { email: string; type: string }[]
}

export interface TenantUnit {
  id: string
  property_id: string
  category_id: string
  space_mix_id: string
  number: string
  floor: string | null
  type: string
  description: string
  price: number
  set_rate: number
  default_price: number
  featured: number
  available_date: string | null
  state: string
  length: string
  width: string
  height: string
  Category: {
    id: string
    name: string
    description: string
    price: string
    unit_type: string
  }
  Amenities: Record<string, TenantAmenity[]>
  Promotions: TenantPromotion[]
  Lease: Record<string, unknown> | null
}

export interface TenantAmenity {
  id: string
  name: string
  value: string
  category_type: string
  category_name: string
}

export interface TenantPromotion {
  id: string
  name: string
  [key: string]: unknown
}

export interface TenantCategory {
  id: string
  name: string
  description: string
  price: string
  unit_type: string | null
}
