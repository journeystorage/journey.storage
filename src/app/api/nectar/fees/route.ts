// GET /api/nectar/fees
// The real fee schedule from Hummingbird's product catalogue, so Pay Bill can
// tell a tenant what a late payment costs without anyone hand-typing numbers.
//
// Source: GET companies/{co}/properties/{id}/products
//   "Late Fee" → amount_type "scheduled", price 0, plus a Rules[] array:
//        { type: 'dollar',  price: 20, rent_threshold: 100 }  → rent up to $100
//        { type: 'percent', price: 20, rent_threshold: null } → otherwise 20%
//   "NSF Fee"  → fixed price (returned payment)
// Verified identical across all three properties, but returned per property in
// case that ever diverges.

import { NextResponse } from 'next/server'
import { nectarV2 } from '@/lib/nectar/client'
import { FACILITIES, COMPANY_ID } from '@/lib/nectar/facilities'

type Rule = { type?: string; price?: number; rent_threshold?: number | null }
type Product = { name?: string; price?: number; amount_type?: string; Rules?: Rule[] }

export interface FeeSchedule {
  lateFeeFlat: number | null
  lateFeePercent: number | null
  lateFeeUpTo: number | null
  nsfFee: number | null
}

function scheduleFrom(products: Product[]): FeeSchedule {
  const byName = (re: RegExp) => products.find((p) => re.test(p.name ?? ''))
  const late = byName(/^late fee$/i)
  const rules = late?.Rules ?? []
  const dollar = rules.find((r) => r.type === 'dollar')
  const percent = rules.find((r) => r.type === 'percent')
  return {
    lateFeeFlat: dollar?.price ?? (late?.amount_type === 'fixed' ? late?.price ?? null : null),
    lateFeePercent: percent?.price ?? null,
    lateFeeUpTo: dollar?.rent_threshold ?? null,
    nsfFee: byName(/^nsf fee$/i)?.price ?? null,
  }
}

export async function GET() {
  try {
    const entries = await Promise.all(
      Object.values(FACILITIES).map(async (f) => {
        try {
          const { data } = await nectarV2<{ products?: Product[] }>(
            `companies/${COMPANY_ID}/properties/${f.propertyId}/products`,
            { next: { revalidate: 3600 } },
          )
          return [f.displayName, scheduleFrom(data.products ?? [])] as const
        } catch {
          return null
        }
      }),
    )
    const byProperty = Object.fromEntries(entries.filter(Boolean) as Array<readonly [string, FeeSchedule]>)
    if (!Object.keys(byProperty).length) return NextResponse.json({ error: 'Fees unavailable' }, { status: 502 })
    return NextResponse.json(
      { byProperty, default: Object.values(byProperty)[0] },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } },
    )
  } catch {
    return NextResponse.json({ error: 'Fees unavailable' }, { status: 502 })
  }
}
