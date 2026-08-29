// POST /api/nectar/checkout/rent
// Commit an online move-in: reserve → documents/finalize → lease → autopay.
// Built from the tenant.dev rental-flow docs. Card data is server-side only and
// never logged. Gated behind NECTAR_CHECKOUT_LIVE so it stays dormant until the
// full chain is smoke-tested against the live account with a throwaway tenant.

import { NextRequest, NextResponse } from 'next/server'
import { facilityBySlug } from '@/lib/nectar/facilities'
import { reserveUnit, finalizeDocuments, createLease, setAutopay } from '@/lib/nectar/rental'

interface RentBody {
  facility?: string
  unitId?: string
  holdToken?: string
  startDate?: string
  billDay?: number
  insuranceId?: string
  promotionIds?: string[]
  tenant?: { firstName?: string; lastName?: string; email?: string; phone?: string; address?: unknown }
  payment?: { card?: unknown; address?: unknown }
  autopay?: boolean
  signatureMeta?: { ip?: string; user_agent?: string; location?: string }
}

export async function POST(req: NextRequest) {
  if (process.env.NECTAR_CHECKOUT_LIVE !== 'true') {
    return NextResponse.json({ error: 'Online rental completes by phone for now — please call to finish.' }, { status: 503 })
  }
  let body: RentBody
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const cfg = body.facility ? facilityBySlug(body.facility) : undefined
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  if (!body.unitId || !body.holdToken || !body.tenant?.email || !body.payment?.card) {
    return NextResponse.json({ error: 'Missing rental details.' }, { status: 400 })
  }
  try {
    // 1. Reserve → reservation_id / lease_id
    const reservation = await reserveUnit(body.unitId, {
      hold_token: body.holdToken,
      bill_day: body.billDay,
      start_date: body.startDate,
      tenant: body.tenant,
    })

    // 2. Finalize documents (ClickWrap / Super Lease auto-sign, or Traditional signing url)
    const docs = await finalizeDocuments(body.unitId, {
      hold_token: body.holdToken,
      reservation_id: reservation.reservation_id,
      bill_day: body.billDay,
      metadata: body.signatureMeta,
    })

    // 3. Create the lease (carry documents + payment)
    const lease = await createLease(body.unitId, {
      hold_token: body.holdToken,
      reservation_id: reservation.reservation_id,
      documents: docs.documents,
      payment_method: body.payment,
      insurance_id: body.insuranceId,
      promotions: body.promotionIds?.map((promotion_id) => ({ promotion_id })),
      start_date: body.startDate,
      bill_day: body.billDay,
    })

    // 4. Autopay (optional)
    if (body.autopay && lease.lease_id && lease.payment_method_id) {
      await setAutopay(lease.lease_id, lease.payment_method_id, true)
    }

    // Never echo card data. Return only confirmation-safe fields.
    return NextResponse.json({
      ok: true,
      leaseId: lease.lease_id,
      signed: docs.signed ?? false,
      documentUrl: docs.documents?.[0]?.src ?? docs.documents?.[0]?.url ?? null,
      autopay: !!body.autopay,
    })
  } catch {
    return NextResponse.json({ error: 'We could not complete the rental — please call us to finish.' }, { status: 502 })
  }
}
