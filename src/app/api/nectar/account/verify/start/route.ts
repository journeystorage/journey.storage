// POST /api/nectar/account/verify/start  { contact }
// Emails a 6-digit code to the address already on the tenant's account, so we
// can prove they own it before letting them add a space in their own name.
// The code always goes to the address on file — never to one supplied here.

import { NextRequest, NextResponse } from 'next/server'
import { findContactFor } from '@/lib/nectar/account'
import { canSend, codeFor, currentWindow, maskEmail } from '@/lib/account-verify'
import { emailShell, brandedFrom, p, label, panel, BRAND } from '@/lib/email-shell'

async function sendCode(to: string, name: string, code: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const from = brandedFrom(process.env.LEAD_NOTIFY_FROM)
  const first = (name || '').split(' ')[0] || 'there'
  const html = emailShell({
    preheader: `Your Journey.Storage code: ${code}`,
    eyebrow: 'Your account',
    heading: 'Here’s your verification code',
    bodyHtml:
      p(`Hi ${first},`) +
      p('Use this code to sign in and see your balance. It works for about 15 minutes, and only on your account.') +
      panel(
        label('Verification code') +
        `<p style="margin:0;font-family:'Barlow Condensed','Work Sans',Montserrat,sans-serif;font-weight:700;font-size:40px;line-height:1.1;letter-spacing:.18em;color:${BRAND.orange700}">${code}</p>`,
      ) +
      p('Didn’t ask for this? You can ignore it — nothing on your account has changed.', { muted: true, small: true }),
    footNote: 'We’ll never ask for your card details by email or text.',
    slogan: false,
  })
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject: `Your Journey.Storage code: ${code}`, html }),
    })
    if (!r.ok) {
      // Resend's rejection text names the cause (unverified domain, bad
      // sender, rate limit). Without this the failure is invisible in prod.
      const detail = await r.text().catch(() => '')
      console.error('[verify] code send rejected', { status: r.status, from, detail: detail.slice(0, 400) })
    }
    return r.ok
  } catch (e) {
    console.error('[verify] code send threw', e)
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
