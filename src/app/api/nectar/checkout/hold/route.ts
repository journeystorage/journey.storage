// POST /api/nectar/checkout/hold
// Resolve a bookable unit for a requested size at a facility, place a 15-minute
// hold, and return the token + ids the quote/commit steps need.
// Verified live against the sandbox (space-groups → tiers → offers → hold).

import { NextRequest, NextResponse } from 'next/server'
import { facilityBySlug } from '@/lib/nectar/facilities'
import { resolveBookableUnit, holdUnit, climateFromCategory } from '@/lib/nectar/rental'
import { NectarError } from '@/lib/nectar/client'

export async function POST(req: NextRequest) {
  let body: {
    facility?: string
    width?: number
    length?: number
    /**
     * The customer-facing category they picked, e.g. "Temple Hall Hwy -
     * Climate Controlled". Several sizes exist as both climate and standard at
     * different prices, so without this the hold picks whichever tier is
     * listed first — which rented standard units to people who chose climate.
     */
    category?: string
    /** Explicit override, when the caller has already worked it out. */
    climate?: boolean
  }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const cfg = body.facility ? facilityBySlug(body.facility) : undefined
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  try {
    const climate = typeof body.climate === 'boolean' ? body.climate : climateFromCategory(body.category)
    const unit = await resolveBookableUnit(cfg.propertyId, { width: body.width, length: body.length, climate })
    if (!unit) {
      // Deliberately specific: a climate-controlled space being gone is not the
      // same as the size being gone, and substituting the other kind is exactly
      // the bug this guards against.
      return NextResponse.json(
        {
          error:
            climate === true
              ? 'That climate-controlled space has just been taken. Try another size, or call us.'
              : climate === false
                ? 'That standard space has just been taken. Try another size, or call us.'
                : 'No spaces of that size are available online right now.',
        },
        { status: 409 },
      )
    }
    const holdToken = await holdUnit(unit.unitId)
    return NextResponse.json({
      holdToken,
      unitId: unit.unitId,
      tierId: unit.tierId,
      spaceTypeId: unit.spaceTypeId,
      spaceMixId: unit.spaceMixId,
      // Echoed back so the browser can confirm it got the kind of space the
      // customer actually chose.
      climate: unit.climate ?? null,
      spaceGroup: unit.groupName ?? null,
      dossierToken: unit.dossierToken,
      promotionId: unit.promotionId,
      expiresInSeconds: 900,
    })
  } catch (e) {
    const status = e instanceof NectarError ? 502 : 502
    return NextResponse.json({ error: 'Could not hold a space — please try again or call us.' }, { status })
  }
}
