// POST /api/nectar/account/verify/start  { contact }
// Emails a 6-digit code to the address already on the tenant's account, so we
// can prove they own it before letting them add a space in their own name.
// The code always goes to the address on file — never to one supplied here.

import { NextRequest, NextResponse } from 'next/server'
import { findContactFor } from '@/lib/nectar/account'
import { canSend, codeFor, currentWindow, maskEmail } from '@/lib/account-verify'

async function sendCode(to: string, name: string, code: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const from = process.env.LEAD_NOTIFY_FROM || 'Journey Storage <onboarding@resend.dev>'
  const first = (name || '').split(' ')[0] || 'there'
  const html = `<!doctype html><html><body style="margin:0;background:#F5F0E8;font-family:Lato,Helvetica,Arial,sans-serif;color:#181818">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
  <div style="border-top:4px solid #E8622A;background:#181818;color:#F5F0E8;padding:18px 22px;font-weight:900;letter-spacing:-.02em">JOURNEY<span style="color:#E8622A">.</span>STORAGE</div>
  <div style="background:#fff;padding:28px 24px;box-shadow:0 1px 2px rgba(24,24,24,.06)">
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Hi ${first},</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6">Here is your verification code for your Journey Storage account:</p>
    <p style="margin:0 0 20px;font-size:34px;font-weight:900;letter-spacing:.18em;color:#E8622A">${code}</p>
    <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#3A3835">It expires in about 15 minutes and can only be used on your account.</p>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#8A857B">If you didn't request this, you can ignore this email — nothing has changed on your account.</p>
  </div>
</div></body></html>`
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject: `Your Journey Storage code: ${code}`, html }),
    })
    return r.ok
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  let body: { contact?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const contact = (body.contact ?? '').trim()
  if (!contact) return NextResponse.json({ error: 'Enter the email or phone on your account.' }, { status: 400 })
  try {
    const found = await findContactFor(contact)
    // Don't reveal whether an account exists, and don't reveal the address.
    if (!found) return NextResponse.json({ sent: true, email: null })
    if (!canSend(contact)) {
      return NextResponse.json({ error: 'Too many codes requested. Wait a few minutes and try again.' }, { status: 429 })
    }
    const code = codeFor(contact, currentWindow())
    const ok = await sendCode(found.email, found.name, code)
    if (!ok) {
      return NextResponse.json({ error: 'We couldn’t send a code right now — please call us.' }, { status: 503 })
    }
    return NextResponse.json({ sent: true, email: maskEmail(found.email) })
  } catch {
    return NextResponse.json({ error: 'We couldn’t start verification — please try again or call us.' }, { status: 502 })
  }
}
