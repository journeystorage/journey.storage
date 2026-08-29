// POST /api/nectar/checkout/quote
// Lease-setup: the real prorated move-in cost for a held unit (rent, deposit,
// admin fee, insurance, discounts, tax, total due). Verified live against the
// sandbox. Returns a browser-safe, normalized breakdown.

import { NextRequest, NextResponse } from 'next/server'
import { facilityBySlug } from '@/lib/nectar/facilities'
import { leaseSetup } from '@/lib/nectar/rental'

export async function POST(req: NextRequest) {
  let body: { facility?: string; unitId?: string; holdToken?: string; startDate?: string; insuranceId?: string; promotionIds?: string[]; token?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const cfg = body.facility ? facilityBySlug(body.facility) : undefined
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  if (!body.unitId || !body.holdToken || !body.startDate) {
    return NextResponse.json({ error: 'unitId, holdToken and startDate are required' }, { status: 400 })
  }
  try {
    const details = await leaseSetup(body.unitId, {
      hold_token: body.holdToken,
      start_date: body.startDate,
      insurance_id: body.insuranceId,
      promotions: body.promotionIds?.map((promotion_id) => ({ promotion_id })),
      token: body.token,
    })
    const c = details.Charges ?? {}
    return NextResponse.json({
      monthlyRent: details.rent ?? details.monthly ?? null,
      billDay: details.bill_day ?? null,
      startDate: details.start_date ?? body.startDate,
      dueToday: c.total_due ?? null,
      discounts: c.discounts ?? 0,
      tax: c.total_tax ?? 0,
      lineItems: (c.Detail ?? []).map((l) => ({ name: l.name, amount: l.total_cost })),
      promotions: (details.Promotions ?? []).map((p) => ({ name: p.name, value: p.value, type: p.type, months: p.months })),
    })
  } catch {
    return NextResponse.json({ error: 'Live pricing temporarily unavailable' }, { status: 502 })
  }
}
