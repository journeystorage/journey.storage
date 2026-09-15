// POST /api/nectar/account/verify/end
// Ends the verified session immediately by clearing the cookie.
//
// Verification is deliberately one-shot: Pay Bill calls this every time the
// panel opens and again the moment it closes (button, Escape, tab hidden), so
// coming back always means entering a fresh emailed code, and a signed-in
// session can never leak into an unrelated rental in the same browser.

import { NextResponse } from 'next/server'
import { VERIFY_COOKIE } from '@/lib/account-verify'

function cleared() {
  const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  res.cookies.set(VERIFY_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}

export const POST = cleared
// sendBeacon on pagehide can only issue POST, but allow GET too so a plain
// navigation away can clear the session as well.
export const GET = cleared
