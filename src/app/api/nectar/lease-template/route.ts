// GET /api/nectar/lease-template?facility=<slug>
// Returns the property's active lease document template (the real text the
// tenant signs at documents/finalize — e.g. the TSSA lease), straight from the
// Hummingbird document library, with Carbone merge tokens ({d.Tenant.Name})
// left in place for the client to fill for display. Cached: the template only
// changes when the back office edits it.

import { NextRequest, NextResponse } from 'next/server'
import { nectarV2 } from '@/lib/nectar/client'
import { facilityBySlug, COMPANY_ID } from '@/lib/nectar/facilities'

type DocRow = { id?: string; document_id?: string; name?: string; type?: string; document_type?: string }

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('facility') ?? ''
  const cfg = facilityBySlug(slug)
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  try {
    const { data } = await nectarV2<{ documents?: DocRow[] }>(
      `companies/${COMPANY_ID}/properties/${cfg.propertyId}/documents`,
      { next: { revalidate: 3600 } },
    )
    const docs = data.documents ?? []
    const leases = docs.filter((d) => (d.type ?? d.document_type) === 'lease')
    // Prefer the TSSA lease when assigned; otherwise the property's lease doc.
    const pick = leases.find((d) => /tssa/i.test(d.name ?? '')) ?? leases[0]
    const pickId = pick?.id ?? pick?.document_id
    if (!pickId) return NextResponse.json({ error: 'No lease template' }, { status: 404 })
    const { data: detail } = await nectarV2<{ template?: { name?: string; template?: string } }>(
      `companies/${COMPANY_ID}/documents/${pickId}`,
      { next: { revalidate: 3600 } },
    )
    const html = detail.template?.template
    if (!html) return NextResponse.json({ error: 'Empty lease template' }, { status: 404 })
    return NextResponse.json(
      { name: detail.template?.name ?? pick?.name ?? 'Rental Agreement', html },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } },
    )
  } catch {
    return NextResponse.json({ error: 'Lease template unavailable' }, { status: 502 })
  }
}
