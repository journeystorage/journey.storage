// GET /api/nectar/disclosures?facility=<slug>
// The ClickWrap Superlease "General Disclosures" exactly as configured in
// Hummingbird (Lease Configuration & State Compliance). Served live so an edit
// in the back office flows straight through to the Sign step — we never
// hand-write lease language on the site.
//
// Source: GET companies/{co}/properties/{id} → superlease.disclosures[]
//         (company-wide rows carry property_id: null)

import { NextRequest, NextResponse } from 'next/server'
import { nectarV2 } from '@/lib/nectar/client'
import { facilityBySlug, COMPANY_ID } from '@/lib/nectar/facilities'

type Disclosure = { id?: number; disclosure_text?: string; compliance_required?: number; font_size?: string }
type PropertyPayload = {
  property?: { superlease?: { superleaseEnabled?: boolean; clickwrap_enabled?: boolean; disclosures?: Disclosure[] } }
  superlease?: { superleaseEnabled?: boolean; clickwrap_enabled?: boolean; disclosures?: Disclosure[] }
}

// Strip the template's own heading — the UI supplies its own — and keep only
// the inline formatting we're willing to render.
const ALLOWED = /^(p|br|b|strong|i|em|u|ul|ol|li)$/i
function sanitize(html: string): string {
  return html
    .replace(/<\s*(script|style)[\s\S]*?<\/\s*\1\s*>/gi, '')
    .replace(/<\s*\/?\s*([a-zA-Z0-9]+)((?:\s+[^>]*)?)>/g, (_m, tag: string) => (ALLOWED.test(tag) ? `<${_m.includes('</') ? '/' : ''}${tag.toLowerCase()}>` : ''))
    .replace(/<strong>\s*General Disclosures:\s*<\/strong>\s*(<br>)?/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('facility') ?? ''
  const cfg = facilityBySlug(slug)
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  try {
    const { data } = await nectarV2<PropertyPayload>(
      `companies/${COMPANY_ID}/properties/${cfg.propertyId}`,
      { next: { revalidate: 900 } },
    )
    const sl = data.property?.superlease ?? data.superlease
    const rows = (sl?.disclosures ?? []).filter((d) => (d.disclosure_text ?? '').trim() !== '')
    if (!rows.length) return NextResponse.json({ error: 'No disclosures configured' }, { status: 404 })
    return NextResponse.json(
      {
        clickwrap: sl?.clickwrap_enabled === true,
        items: rows.map((d) => ({ id: d.id ?? 0, html: sanitize(d.disclosure_text ?? ''), required: d.compliance_required === 1 })),
      },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=86400' } },
    )
  } catch {
    return NextResponse.json({ error: 'Disclosures unavailable' }, { status: 502 })
  }
}
