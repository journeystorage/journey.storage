// POST /api/nectar/checkout/hold
// Resolve a bookable unit for a requested size at a facility, place a 15-minute
// hold, and return the token + ids the quote/commit steps need.
// Verified live against the sandbox (space-groups → tiers → offers → hold).

import { NextRequest, NextResponse } from 'next/server'
import { facilityBySlug } from '@/lib/nectar/facilities'
import { resolveBookableUnit, holdUnit } from '@/lib/nectar/rental'
import { NectarError } from '@/lib/nectar/client'

export async function POST(req: NextRequest) {
  let body: { facility?: string; width?: number; length?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const cfg = body.facility ? facilityBySlug(body.facility) : undefined
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  try {
    const unit = await resolveBookableUnit(cfg.propertyId, { width: body.width, length: body.length })
    if (!unit) return NextResponse.json({ error: 'No spaces of that size are available online right now.' }, { status: 409 })
    const holdToken = await holdUnit(unit.unitId)
    return NextResponse.json({
      holdToken,
      unitId: unit.unitId,
      tierId: unit.tierId,
      spaceTypeId: unit.spaceTypeId,
      spaceMixId: unit.spaceMixId,
      dossierToken: unit.dossierToken,
      promotionId: unit.promotionId,
      expiresInSeconds: 900,
    })
  } catch (e) {
    const status = e instanceof NectarError ? 502 : 502
    return NextResponse.json({ error: 'Could not hold a space — please try again or call us.' }, { status })
  }
}
