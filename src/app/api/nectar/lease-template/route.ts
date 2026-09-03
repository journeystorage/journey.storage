// GET /api/nectar/lease-template?facility=<slug>
// Serves a BLANK, reference copy of the rental agreement as a standalone,
// print-friendly HTML page — so a renter can read the full terms before they
// sign. Opened in a new tab from the Sign step.
//
// Source of truth is Hummingbird's document library, never hand-written text:
//   1. the corporate lease template ("TSSA Rental Lease HB", type `lease`) —
//      this is the document that actually gets signed, and it ships its own CSS
//   2. failing that, the per-property unsigned copy ("TSSA Lease - Unsigned")
// Carbone merge tokens ({d.Tenant.Name} …) are rendered as blanks, because this
// is the unexecuted form; the completed copy is generated at checkout.

import { NextRequest, NextResponse } from 'next/server'
import { nectarV2 } from '@/lib/nectar/client'
import { facilityBySlug, COMPANY_ID } from '@/lib/nectar/facilities'
import { PHONE } from '@/lib/constants'

type DocRow = { id?: string; document_id?: string; name?: string; type?: string; document_type?: string }
type Template = { name?: string; type?: string; template?: string }

const isLeaseish = (d: DocRow) => {
  const t = d.type ?? d.document_type
  const n = d.name ?? ''
  return t === 'lease' || (t === 'other-unsigned' && /lease|rental agreement/i.test(n))
}

// Signature/initial tokens are images in the template; everything else is text.
const IMG_TOKEN = /^(Signature|Initials|.*\.Signature)$/i

function blankTokens(html: string): string {
  return html
    // <img src="{d.Signature}"> → a ruled blank line
    .replace(/<img[^>]*src=["']?\{d\.[^}]*\}["']?[^>]*>/gi, '<span class="jr-blank jr-blank-sig"></span>')
    .replace(/\{d\.([A-Za-z0-9._:()'&,\s-]+)\}/g, (_m, raw: string) => {
      const key = String(raw).split(':')[0]
      if (IMG_TOKEN.test(key)) return '<span class="jr-blank jr-blank-sig"></span>'
      return '<span class="jr-blank"></span>'
    })
    // Carbone flow directives that aren't value tokens
    .replace(/\{[dc]\.[^}]*:(show(Begin|End)|agg[A-Za-z]*|append[A-Za-z]*)[^}]*\}/gi, '')
}

const strip = (html: string) => html.replace(/<\s*(script|iframe|object|embed)[\s\S]*?<\/\s*\1\s*>/gi, '')

function page(opts: { title: string; facility: string; address: string; phone: string; tel: string; body: string }) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${opts.title} — Journey.Storage</title>
<style>
  :root { --ink:#181818; --charcoal:#3A3835; --orange:#E8622A; --stone:#8A857B; --paper:#fff; --ground:#F5F0E8; }
  * { box-sizing:border-box; }
  html { -webkit-text-size-adjust:100%; }
  body { margin:0; background:var(--ground); color:var(--ink);
         font-family:Lato,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; }
  .jr-bar { border-top:4px solid var(--orange); background:var(--ink); color:var(--ground); }
  .jr-bar-in { max-width:8.5in; margin:0 auto; padding:18px 28px; display:flex; flex-wrap:wrap;
               align-items:baseline; justify-content:space-between; gap:10px; }
  .jr-mark { font-weight:900; letter-spacing:-.02em; font-size:1.0625rem; }
  .jr-mark span { color:var(--orange); }
  .jr-loc { font-size:.8125rem; color:rgba(245,240,232,.65); }
  .jr-note { max-width:8.5in; margin:22px auto 0; padding:0 28px; }
  .jr-note-in { border:1px solid rgba(232,98,42,.35); background:rgba(232,98,42,.07);
                border-radius:3px; padding:12px 14px; font-size:.8125rem; line-height:1.6; color:var(--charcoal); }
  .jr-note-in b { color:var(--orange); }
  .jr-doc { max-width:8.5in; margin:18px auto 64px; padding:44px 52px; background:var(--paper);
            box-shadow:0 1px 2px rgba(24,24,24,.06), 0 12px 32px -12px rgba(24,24,24,.18); }
  /* The document ships print-oriented markup; give it sane defaults. */
  .jr-doc, .jr-doc td, .jr-doc th, .jr-doc p, .jr-doc div, .jr-doc span, .jr-doc li {
    font-family:Georgia,"Times New Roman",serif; font-size:10.5pt; line-height:1.55; color:var(--ink); }
  .jr-doc table { border-collapse:collapse; max-width:100%; }
  .jr-doc img { max-width:100%; height:auto; }
  .jr-doc h1,.jr-doc h2,.jr-doc h3 { font-family:Lato,system-ui,sans-serif; line-height:1.25; }
  /* Blanks where a tenant's details will be merged in. */
  .jr-blank { display:inline-block; min-width:9ch; border-bottom:1px solid rgba(24,24,24,.35);
              vertical-align:baseline; height:1em; }
  .jr-blank-sig { min-width:22ch; height:2.1em; }
  .jr-foot { max-width:8.5in; margin:0 auto 56px; padding:0 28px; font-size:.8125rem; color:var(--stone); }
  .jr-foot a { color:var(--orange); font-weight:700; }
  @media (max-width:640px) { .jr-doc { padding:26px 20px; margin:14px auto 40px; } }
  @media print {
    body { background:#fff; }
    .jr-bar, .jr-note, .jr-foot { display:none; }
    .jr-doc { box-shadow:none; margin:0; padding:0; max-width:none; }
  }
</style>
</head><body>
<div class="jr-bar"><div class="jr-bar-in">
  <div class="jr-mark">JOURNEY<span>.</span>STORAGE</div>
  <div class="jr-loc">${opts.facility} · ${opts.address}</div>
</div></div>
<div class="jr-note"><div class="jr-note-in">
  <b>Blank copy for reference.</b> These are the full terms of the rental agreement.
  Blank lines are filled in with your details when you complete checkout, and your
  signed copy is emailed to you and linked on your confirmation screen.
</div></div>
<div class="jr-doc">${opts.body}</div>
<div class="jr-foot">Questions about these terms? Call <a href="${opts.tel}">${opts.phone}</a>.</div>
</body></html>`
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('facility') ?? ''
  const cfg = facilityBySlug(slug)
  if (!cfg) return new NextResponse('Unknown facility', { status: 404 })
  try {
    // Corporate templates (the signed lease) live on the company; the unsigned
    // reference copy is assigned per property. Check both.
    const [coRes, propRes] = await Promise.all([
      nectarV2<{ documents?: DocRow[] }>(`companies/${COMPANY_ID}/documents`, { next: { revalidate: 3600 } }),
      nectarV2<{ documents?: DocRow[] }>(`companies/${COMPANY_ID}/properties/${cfg.propertyId}/documents`, { next: { revalidate: 3600 } }),
    ])
    const all = [...(coRes.data.documents ?? []), ...(propRes.data.documents ?? [])].filter(isLeaseish)
    // Prefer the real signed lease template, then any TSSA-named copy.
    const pick =
      all.find((d) => (d.type ?? d.document_type) === 'lease' && /tssa/i.test(d.name ?? '')) ??
      all.find((d) => (d.type ?? d.document_type) === 'lease') ??
      all.find((d) => /tssa/i.test(d.name ?? '')) ??
      all[0]
    const pickId = pick?.id ?? pick?.document_id
    if (!pickId) return new NextResponse('No rental agreement on file', { status: 404 })

    const { data: detail } = await nectarV2<{ template?: Template }>(
      `companies/${COMPANY_ID}/documents/${pickId}`,
      { next: { revalidate: 3600 } },
    )
    const raw = detail.template?.template
    if (!raw) return new NextResponse('Rental agreement unavailable', { status: 404 })

    const html = page({
      title: detail.template?.name ?? 'Rental Agreement',
      facility: cfg.displayName,
      address: 'Granbury, TX',
      phone: PHONE.display,
      tel: `tel:${PHONE.tel}`,
      body: blankTokens(strip(raw)),
    })
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('Rental agreement unavailable', { status: 502 })
  }
}
