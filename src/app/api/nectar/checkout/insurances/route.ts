// GET /api/nectar/checkout/insurances?facility=<slug>
// Real coverage options (protection plans) for a facility, mapped browser-safe.

import { NextRequest, NextResponse } from 'next/server'
import { facilityBySlug } from '@/lib/nectar/facilities'
import { getSpaceTypes, getInsurances } from '@/lib/nectar/rental'

export const revalidate = 600

export async function GET(req: NextRequest) {
  const facility = new URL(req.url).searchParams.get('facility') ?? ''
  const cfg = facilityBySlug(facility)
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  try {
    const types = await getSpaceTypes()
    const unitTypeIds = types.map((t) => t.unit_type_id).filter(Boolean)
    const plans = await getInsurances(cfg.propertyId, unitTypeIds)
    // Use only the branded "Protection Plan" products (the current offering);
    // exclude legacy SafeLease variants. Dedupe by coverage.
    const seen = new Set<string>()
    const options = plans
      .filter((p) => /protection plan/i.test(p.name))
      .filter((p) => (seen.has(p.coverage) ? false : (seen.add(p.coverage), true)))
      .map((p) => ({
        id: p.id,
        name: p.name,
        coverage: Number(p.coverage),
        premium: p.premium_value,
        premiumType: p.premium_type,
        taxable: !!p.taxable,
      }))
      .sort((a, b) => a.coverage - b.coverage)
    return NextResponse.json({ facility: cfg.slug, options })
  } catch {
    return NextResponse.json({ error: 'Coverage options temporarily unavailable' }, { status: 502 })
  }
}
