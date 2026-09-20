// GET /api/ops/email-preview?token=...&template=movein[&send=1]
//
// Renders a real email with sample data so it can be eyeballed before a
// customer ever sees it. Without `send=1` it returns the HTML to look at in a
// browser; with it, the email is sent — always and only to the owner inbox,
// never to an address from the query, so this can't become a way to send mail
// to arbitrary people.
//
// Worth having: these templates are only otherwise triggered by a real
// rental, which means a real lease and a real charge just to check a layout.

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { renderMoveInEmail } from '@/lib/move-in-email'
import { brandedFrom } from '@/lib/email-shell'

const OWNER_INBOX = process.env.MOVE_IN_NOTIFY_TO || process.env.LEAD_NOTIFY_TO || 'lyvia@journey.storage'

function authorised(req: NextRequest): boolean {
  const expected = process.env.OPS_TOKEN
  if (!expected) return false
  const given = req.nextUrl.searchParams.get('token') ?? req.headers.get('x-ops-token') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Representative data — a climate-controlled 10×10 with the promo applied. */
function sample() {
  const today = new Date()
  const iso = today.toISOString().slice(0, 10)
  return renderMoveInEmail({
    facilitySlug: 'westernhillstrl',
    tenantFirst: 'Lyvia',
    tenantEmail: OWNER_INBOX,
    spaceLabel: '10 × 10 · Climate Controlled',
    unitNumber: 'A083',
    startDate: iso,
    billDay: today.getDate(),
    lineItems: [
      { name: 'Rent', amount: 45 },
      { name: 'Admin Fee', amount: 30 },
      { name: '$3,000 Protection Plan', amount: 12 },
    ],
    totalDue: 87,
    signed: true,
    documentUrl: 'https://journey.storage/rentaspace',
    autopayRequested: true,
  })
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  const template = req.nextUrl.searchParams.get('template') ?? 'movein'
  if (template !== 'movein') {
    return NextResponse.json({ error: 'Unknown template. Try template=movein.' }, { status: 400 })
  }
  const { subject, html } = sample()

  if (req.nextUrl.searchParams.get('send') !== '1') {
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 503 })
  const from = brandedFrom(process.env.MOVE_IN_EMAIL_FROM || process.env.LEAD_NOTIFY_FROM)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: OWNER_INBOX, subject: `[TEST] ${subject}`, html }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return NextResponse.json({ error: 'Send failed', status: res.status, detail: detail.slice(0, 400) }, { status: 502 })
  }
  return NextResponse.json({ ok: true, sentTo: OWNER_INBOX, subject: `[TEST] ${subject}` })
}
