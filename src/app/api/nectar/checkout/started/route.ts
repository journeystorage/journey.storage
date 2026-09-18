// POST /api/nectar/checkout/started
//
// Called once the renter has entered their details, before payment. Until now
// everything they typed lived only in their browser, so someone who got as far
// as the payment step and then stopped left no trace at all — no name, no way
// to follow up. In self storage that is the most valuable list there is.
//
// Records the contact only. No identification, no card, nothing sensitive: if
// they don't complete, we want enough to phone them and nothing more.

import { NextRequest, NextResponse } from 'next/server'
import { recordEvent } from '@/lib/ops/events'

export async function POST(req: NextRequest) {
  let body: { facility?: string; spaceLabel?: string; name?: string; email?: string; phone?: string }
  try { body = await req.json() } catch { return NextResponse.json({ ok: true }) }
  const email = (body.email ?? '').trim()
  // No contact, nothing worth recording.
  if (!email && !body.phone) return NextResponse.json({ ok: true })
  await recordEvent({
    kind: 'checkout_started',
    contact: email || body.phone,
    name: body.name,
    phone: body.phone,
    detail: { facility: body.facility ?? null, space: body.spaceLabel ?? null },
  })
  // Always 200: this is telemetry, and it must never block a rental.
  return NextResponse.json({ ok: true })
}
