// POST /api/nectar/checkout/rent
// Commit an online move-in via the verified Direct Rental flow:
//   lease-set-up (authoritative cost) → documents/finalize (auto-signs) → lease (pending).
// Verified end-to-end against the sandbox (returns lease_id + gate PIN).
// Card data is server-side only and never logged. Gated behind
// NECTAR_CHECKOUT_LIVE so it stays dormant until deliberately switched on.

import { NextRequest, NextResponse } from 'next/server'
import { facilityBySlug } from '@/lib/nectar/facilities'
import { leaseSetup, completeRental, type Tenant, type Card } from '@/lib/nectar/rental'

interface RentBody {
  facility?: string
  unitId?: string
  holdToken?: string
  dossierToken?: string
  spaceMixId?: string
  startDate?: string
  insuranceId?: string
  promotionIds?: string[]
  tenant?: Tenant
  card?: Card
}

export async function POST(req: NextRequest) {
  if (process.env.NECTAR_CHECKOUT_LIVE !== 'true') {
    return NextResponse.json({ error: 'Online rental completes by phone for now — please call to finish.' }, { status: 503 })
  }
  let body: RentBody
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const cfg = body.facility ? facilityBySlug(body.facility) : undefined
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  const { unitId, holdToken, startDate, tenant, card } = body
  if (!unitId || !holdToken || !startDate || !tenant?.email || !card?.card_number) {
    return NextResponse.json({ error: 'Missing rental details.' }, { status: 400 })
  }
  try {
    // Re-quote server-side so the charged amounts are authoritative (not client-supplied).
    const setup = await leaseSetup(unitId, {
      hold_token: holdToken,
      start_date: startDate,
      insurance_id: body.insuranceId,
      promotions: body.promotionIds?.map((promotion_id) => ({ promotion_id })),
      token: body.dossierToken,
    })
    const result = await completeRental({
      unitId,
      holdToken,
      dossierToken: body.dossierToken,
      spaceMixId: body.spaceMixId,
      startDate,
      billDay: setup.bill_day ?? 1,
      webRate: setup.rent ?? setup.monthly ?? 0,
      totalDue: setup.Charges?.total_due ?? 0,
      setup,
      tenant,
      card,
      metadata: {
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
        user_agent: req.headers.get('user-agent') || 'Mozilla/5.0',
      },
    })
    // Never echo card data. Confirmation-safe fields only.
    return NextResponse.json({
      ok: true,
      leaseId: result.leaseId,
      gatePin: result.gatePin ?? null,
      signed: result.signed,
      documentUrl: result.documentUrl ?? null,
      status: result.status ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'We could not complete the rental — please call us to finish.' }, { status: 502 })
  }
}
