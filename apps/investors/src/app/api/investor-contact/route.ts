import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Lightweight "Contact Us" submissions from the Journey.Direct popup. These
// land in the same `investor_leads` table as the detailed /apply application,
// tagged form_source=investors-contact, with only the contact fields filled in.

function isStr(v: unknown, max = 2000): v is string {
  return typeof v === 'string' && v.length > 0 && v.length <= max
}

export async function POST(req: Request) {
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

  if (!fullName) return bad('full_name required')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('email invalid')

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
    form_source: 'investors-contact',
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

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Journey.Direct <noreply@journey.storage>',
      to: ['jonah@journey.storage', 'lyvia@journey.storage'],
      subject,
      reply_to: String(row.email ?? ''),
      html,
    }),
  })
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c,
  )
}
