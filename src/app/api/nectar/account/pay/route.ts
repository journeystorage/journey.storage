// POST /api/nectar/account/pay  { leaseId, amount, card }
// Post a payment against a tenant's lease (v2 leases/{id}/payment).
// Card data is server-side only and never logged. Gated behind
// NECTAR_CHECKOUT_LIVE so real payments stay off until deliberately enabled.

import { NextRequest, NextResponse } from 'next/server'
import { payLease, type PayCard } from '@/lib/nectar/account'

interface PayBody {
  leaseId?: string
  amount?: number
  card?: PayCard
  /** Store the card for automatic monthly charges on this lease. */
  autopay?: boolean
}

export async function POST(req: NextRequest) {
  if (process.env.NECTAR_CHECKOUT_LIVE !== 'true') {
    return NextResponse.json({ error: 'Online bill pay is not available yet — please call to pay.' }, { status: 503 })
  }
  let body: PayBody
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const { leaseId, amount, card, autopay } = body
  if (!leaseId || !amount || amount <= 0 || !card?.card_number) {
    return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 })
  }
  // The card is stored before it's charged, and storing it requires a billing zip.
  if (!card.zip) return NextResponse.json({ error: 'A billing ZIP code is required.' }, { status: 400 })
  try {
    const res = await payLease(leaseId, amount, card, autopay === true)
    // Never echo card data.
    return NextResponse.json({ ok: res.ok, autopayOn: res.autopayOn, requestId: res.requestId ?? null })
  } catch {
    return NextResponse.json({ error: 'We couldn’t process your payment — please try again or call us.' }, { status: 502 })
  }
}
