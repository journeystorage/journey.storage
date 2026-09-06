// POST /api/nectar/account/lookup  { contact: email-or-phone }
// Find the tenant's active lease(s) + balance for Pay Bill.

import { NextRequest, NextResponse } from 'next/server'
import { findLeasesByContact } from '@/lib/nectar/account'

export async function POST(req: NextRequest) {
  let body: { contact?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const contact = (body.contact ?? '').trim()
  if (!contact) return NextResponse.json({ error: 'Enter the email or phone on your account.' }, { status: 400 })
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
        monthlyRent: m.monthlyRent ?? null,
        paidThrough: m.paidThrough ?? null,
        dueDate: m.dueDate ?? null,
        periodStart: m.periodStart ?? null,
        periodEnd: m.periodEnd ?? null,
        pastDue: !!m.pastDue,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'We couldn’t look up your account right now — please try again or call us.' }, { status: 502 })
  }
}
