// Pay Bill — tenant payment via the Nectar GDS payments API.
//
// Documented flow (tenant.dev "Customer & Tenant Information" + payments):
//   1. GET tenant details → read `balance` (amount due)
//   2. If balance due  → POST facilities/{fid}/tenants/{tid}/payments?liveData=true
//                        body: { paymentAmount, paymentInstrument:{card,address}, spaceId, periods:0 }
//   3. If no balance   → GET  facilities/{fid}/tenants/{tid}/payments?liveData=true&spaceid=..&periods=N
//                        (prepay quote) then POST payment with periods=N
//
// This surface is a DIFFERENT Nectar application than the availability feed
// (its responses carry their own applicationData app id) and needs the GDS
// `fac…`/`tnt…` ids + that app's key. Until NECTAR_PAY_BASE_URL is configured
// we return 503 so the "call us" fallback stays the path of record.
// Card data is handled server-side only and never logged.

import { NextRequest, NextResponse } from 'next/server'

const PAY_BASE_URL = process.env.NECTAR_PAY_BASE_URL // e.g. https://prod.edge.tenant.dev/api/v3/applications/{payAppId}/v2
const API_KEY = process.env.NECTAR_API_KEY ?? ''

interface PayBody {
  facilityId?: string
  tenantId?: string
  spaceId?: string
  paymentAmount?: number
  periods?: number // 0 for settling dues, N for prepay
  paymentInstrument?: {
    card?: { name?: string; cvv?: string; expiration?: string; number?: string; zip?: string }
    address?: { name?: string; address1?: string; address2?: string; city?: string; stateCode?: string; postalCode?: string }
  }
}

function headers() {
  return {
    'X-storageapi-key': API_KEY,
    'X-storageapi-date': String(Math.floor(Date.now() / 1000)),
    'Content-Type': 'application/json',
  }
}

// GET → prepay quote (Step 3): cost breakdown for `periods` months ahead.
export async function GET(req: NextRequest) {
  if (!PAY_BASE_URL || !API_KEY) return NextResponse.json({ error: 'Online bill pay is not available yet — please call to pay.' }, { status: 503 })
  const { searchParams } = new URL(req.url)
  const facilityId = searchParams.get('facilityId')
  const tenantId = searchParams.get('tenantId')
  const spaceId = searchParams.get('spaceId')
  const periods = searchParams.get('periods') ?? '1'
  if (!facilityId || !tenantId || !spaceId) return NextResponse.json({ error: 'facilityId, tenantId and spaceId are required' }, { status: 400 })
  try {
    const url = `${PAY_BASE_URL.replace(/\/$/, '')}/facilities/${facilityId}/tenants/${tenantId}/payments?liveData=true&spaceid=${spaceId}&periods=${periods}`
    const res = await fetch(url, { headers: headers(), cache: 'no-store' })
    const json = await res.json()
    return NextResponse.json(json, { status: res.ok ? 200 : 502 })
  } catch {
    return NextResponse.json({ error: 'Could not retrieve prepay amount' }, { status: 502 })
  }
}

// POST → make a payment (Step 2 for dues with periods:0, or prepay with periods:N).
export async function POST(req: NextRequest) {
  if (!PAY_BASE_URL || !API_KEY) return NextResponse.json({ error: 'Online bill pay is not available yet — please call to pay.' }, { status: 503 })
  let body: PayBody
  try { body = (await req.json()) as PayBody } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const { facilityId, tenantId, spaceId, paymentAmount, periods = 0, paymentInstrument } = body
  if (!facilityId || !tenantId || !spaceId || !paymentAmount || !paymentInstrument?.card || !paymentInstrument?.address) {
    return NextResponse.json({ error: 'Missing payment details (card and billing address are required).' }, { status: 400 })
  }
  try {
    const url = `${PAY_BASE_URL.replace(/\/$/, '')}/facilities/${facilityId}/tenants/${tenantId}/payments?liveData=true`
    const res = await fetch(url, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ paymentAmount, spaceId, periods, paymentInstrument }),
      cache: 'no-store',
    })
    const json = await res.json()
    // Never echo card data back; return only status + confirmation metadata.
    return NextResponse.json(
      { ok: res.ok, requestId: json?.meta?.requestId, message: res.ok ? 'Payment received' : (json?.message ?? 'Payment failed') },
      { status: res.ok ? 200 : 502 },
    )
  } catch {
    return NextResponse.json({ error: 'Payment could not be processed' }, { status: 502 })
  }
}
