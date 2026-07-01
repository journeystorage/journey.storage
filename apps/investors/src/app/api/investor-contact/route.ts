import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimited, isValidEmail } from '@/lib/api-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Lightweight "Contact Us" submissions from the Journey.Direct popup. These
// land in the same `investor_leads` table as the detailed /apply application,
// tagged form_source=investors-contact, with only the contact fields filled in.

function isStr(v: unknown, max = 2000): v is string {
  return typeof v === 'string' && v.length > 0 && v.length <= max
}

export async function POST(req: Request) {
  if (rateLimited(req)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const fullName = isStr(body.full_name, 200) ? (body.full_name as string).trim() : ''
  const email = isStr(body.email, 320) ? (body.email as string).trim().toLowerCase() : ''
  const phone = isStr(body.phone, 50) ? (body.phone as string).trim() : ''
  const message = isStr(body.message) ? (body.message as string).trim() : ''
  const ALLOWED_SOURCES = new Set(['investors-contact', 'investors-booking'])
  const formSource = isStr(body.form_source, 40) && ALLOWED_SOURCES.has(body.form_source as string)
    ? (body.form_source as string)
    : 'investors-contact'

  if (!fullName) return bad('full_name required')
  if (!email || !isValidEmail(email)) return bad('email invalid')

  // Honeypot — if present, pretend success without storing.
  if (body.website) return NextResponse.json({ ok: true })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Supabase env vars missing')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const row = {
    full_name: fullName,
    email,
    phone: phone || null,
    message: message || null,
    form_source: formSource,
  }

  const { data, error } = await supabase
    .from('investor_leads')
    .insert(row)
    .select('id')
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }

  notifyTeam(row).catch((err) => console.error('Notify failed:', err))

  return NextResponse.json({ ok: true, id: data?.id })
}

function bad(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 })
}

async function notifyTeam(row: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY
  if (!key) return

  const subject = `New Journey.Direct contact: ${row.full_name}`
  const html = `
    <h2>New contact (Journey.Direct)</h2>
    <table style="border-collapse:collapse">
      ${Object.entries(row)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px;border:1px solid #eee"><b>${k}</b></td><td style="padding:4px 12px;border:1px solid #eee">${escapeHtml(String(v ?? ''))}</td></tr>`,
        )
        .join('')}
    </table>
  `

  // Default to Resend's test sender + the account-owner inbox so notifications
  // work without domain verification. Once journey.storage is verified in
  // Resend, set LEAD_NOTIFY_FROM (e.g. "Journey.Direct <noreply@journey.storage>")
  // and LEAD_NOTIFY_TO (comma-separated, e.g. "lyvia@journey.storage,jonah@journey.storage").
  const from = process.env.LEAD_NOTIFY_FROM || 'Journey.Direct <onboarding@resend.dev>'
  const to = (process.env.LEAD_NOTIFY_TO || 'lyvia@journey.storage')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  // support@ receives via the dedicated dual-send below (its own Resend
  // account), not as a cc here. LEAD_NOTIFY_ALWAYS_CC can add other always-cc
  // addresses, and only from a verified domain (resend.dev senders can only
  // reach the account-owner inbox).
  const verifiedSender = !/@resend\.dev/i.test(from)
  const cc = verifiedSender
    ? (process.env.LEAD_NOTIFY_ALWAYS_CC ?? '')
        .split(',').map((s) => s.trim())
        .filter((addr) => addr && !to.some((t) => t.toLowerCase() === addr.toLowerCase()))
    : []

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      ...(cc.length ? { cc } : {}),
      subject,
      reply_to: String(row.email ?? ''),
      html,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[investor-contact] Resend send failed:', res.status, detail)
  }

  // Dual-send: an independent copy to support@ via its OWN Resend account, so
  // support@ receives without forwarding or domain verification. Best-effort.
  const supportKey = process.env.RESEND_API_KEY_SUPPORT
  if (supportKey) {
    try {
      const supportTo = process.env.SUPPORT_NOTIFY_TO || 'support@journey.storage'
      const supportFrom = process.env.SUPPORT_NOTIFY_FROM || 'Journey.Direct <onboarding@resend.dev>'
      const sres = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${supportKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: supportFrom, to: supportTo, subject, reply_to: String(row.email ?? ''), html }),
      })
      if (!sres.ok) console.error('[investor-contact] support copy failed:', sres.status, await sres.text().catch(() => ''))
    } catch (err) {
      console.error('[investor-contact] support copy error:', err)
    }
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c,
  )
}
