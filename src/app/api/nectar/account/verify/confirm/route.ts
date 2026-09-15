// POST /api/nectar/account/verify/confirm  { contact, code }
// Checks the emailed code and, on success, sets a short-lived HttpOnly cookie
// proving this browser controls the account. Only that cookie unlocks actions
// that create an obligation (adding a space).

import { NextRequest, NextResponse } from 'next/server'
import { findContactFor } from '@/lib/nectar/account'
import { VERIFY_COOKIE, issueSession, normalizeContact, verifyCode } from '@/lib/account-verify'

export async function POST(req: NextRequest) {
  let body: { contact?: string; code?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const contact = (body.contact ?? '').trim()
  const code = (body.code ?? '').trim()
  if (!contact || !code) return NextResponse.json({ error: 'Enter the code we emailed you.' }, { status: 400 })
  try {
    const found = await findContactFor(contact)
    if (!found || !verifyCode(contact, code)) {
      return NextResponse.json({ error: 'That code isn’t right, or it has expired. Request a new one.' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true, name: found.name })
    res.cookies.set(VERIFY_COOKIE, issueSession({ contactId: found.contactId, contact: normalizeContact(contact) }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 60,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'We couldn’t verify that code — please try again or call us.' }, { status: 502 })
  }
}
