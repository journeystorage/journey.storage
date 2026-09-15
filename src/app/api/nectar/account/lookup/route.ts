// POST /api/nectar/account/lookup  { contact: email-or-phone }
// Find the tenant's active lease(s) + balance for Pay Bill.

import { NextRequest, NextResponse } from 'next/server'
import { findLeasesByContact } from '@/lib/nectar/account'
import { VERIFY_COOKIE, readSession } from '@/lib/account-verify'

export async function POST(req: NextRequest) {
  // Balances, unit numbers and the card on file are only shown to someone who
  // has proved they control the account. The contact comes from the signed
  // cookie, never the request body, so a verified tenant can only read their
  // own account and not look anyone else up.
  const session = readSession(req.cookies.get(VERIFY_COOKIE)?.value)
  if (!session) {
    return NextResponse.json({ error: 'Verify your account to see your balance.', needsVerification: true }, { status: 401 })
  }
  const contact = session.contact
  try {
    const matches = await findLeasesByContact(contact)
    return NextResponse.json({
      found: matches.length > 0,
      payOnline: process.env.NECTAR_BILLPAY_LIVE === 'true',
      name: matches[0]?.name ?? null,
      totalDue: +matches.reduce((s, m) => s + (m.balance > 0 ? m.balance : 0), 0).toFixed(2),
      accounts: matches.map((m) => ({
        leaseId: m.leaseId,
        name: m.name,
        code: m.code ?? null,
        balance: m.balance,
        unitNumber: m.unitNumber ?? null,
        unitSize: m.unitSize ?? null,
        propertyName: m.propertyName ?? null,
        propertySlug: m.propertySlug ?? null,
        monthlyRent: m.monthlyRent ?? null,
        paidThrough: m.paidThrough ?? null,
        nextDueDate: m.nextDueDate ?? null,
        dueDate: m.dueDate ?? null,
        periodStart: m.periodStart ?? null,
        periodEnd: m.periodEnd ?? null,
        pastDue: !!m.pastDue,
        cardOnFile: m.cardOnFile ?? null,
        autopayOn: !!m.autopayOn,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'We couldn’t look up your account right now — please try again or call us.' }, { status: 502 })
  }
}
