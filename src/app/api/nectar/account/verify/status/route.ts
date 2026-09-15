// GET /api/nectar/account/verify/status
// Whether this browser has proved it controls a tenant account. The cookie is
// HttpOnly, so the UI asks the server rather than reading it.

import { NextRequest, NextResponse } from 'next/server'
import { VERIFY_COOKIE, readSession } from '@/lib/account-verify'
import { getContactBasics } from '@/lib/nectar/account'

export async function GET(req: NextRequest) {
  const session = readSession(req.cookies.get(VERIFY_COOKIE)?.value)
  if (!session) return NextResponse.json({ verified: false }, { headers: { 'Cache-Control': 'no-store' } })
  const basics = await getContactBasics(session.contactId)
  return NextResponse.json(
    { verified: true, name: [basics?.first, basics?.last].filter(Boolean).join(' ') || null, email: basics?.email ?? null },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
