// POST /api/nectar/account/pay-link
//
// Hands a verified tenant a one-time hosted payment link so they can settle
// their balance on Hummingbird's own page. This replaces taking card details
// ourselves: that path used POST leases/{id}/payment, which crashes inside
// Tenant Inc's code (500, "Cannot read properties of undefined (reading
// 'contact_id')"), and their engineering team confirmed the one-time link is
// the supported route.
//
// The link is a bearer credential — anyone holding it can pay on that account
// — so it is only ever issued to a session that has proved ownership by code,
// is never logged, and is never stored.

import { NextRequest, NextResponse } from 'next/server'
import { VERIFY_COOKIE, readSession } from '@/lib/account-verify'
import { getPaymentLink } from '@/lib/nectar/account'
import { classifyFailure } from '@/lib/nectar/failure'
import { sendLeadNotification } from '@/lib/lead-email'

export async function POST(req: NextRequest) {
  // NECTAR_BILLPAY_LIVE stays the single switch for online payment. It used to
  // gate our own card form; it now gates the hosted link, so turning it off
  // still sends tenants to the "pay by phone" panel.
  if (process.env.NECTAR_BILLPAY_LIVE !== 'true') {
    return NextResponse.json(
      { error: 'Online payments are temporarily unavailable — please call us and we’ll take your payment.' },
      { status: 503 },
    )
  }
  const session = readSession(req.cookies.get(VERIFY_COOKIE)?.value)
  if (!session) {
    return NextResponse.json(
      { error: 'Verify your account to pay online.', needsVerification: true },
      { status: 401 },
    )
  }
  try {
    const link = await getPaymentLink(session.contactId)
    if (!link) throw new Error('No payment link was returned')
    // Worth knowing a tenant went to pay; the link itself is never included.
    await sendLeadNotification({
      name: 'Tenant opened online payment',
      email: '',
      formSource: 'paybill-link',
      subject: 'Pay Bill — tenant opened the payment page',
      message: [
        'A tenant opened the hosted payment page from Pay Bill.',
        '',
        `Contact: ${session.contactId}`,
        `Signed in as: ${session.contact}`,
        '',
        'Confirm it landed on the lease ledger — the hosted page posts to',
        'Hummingbird directly, so we only know they opened it.',
      ].join('\n'),
    }).catch(() => {})
    return NextResponse.json({ link })
  } catch (err) {
    const f = classifyFailure(err, { route: 'account/pay-link' }, 'payment')
    return NextResponse.json(
      { error: f.message, kind: f.kind, reference: f.reference, detail: f.providerMessage ?? null },
      { status: f.status },
    )
  }
}
