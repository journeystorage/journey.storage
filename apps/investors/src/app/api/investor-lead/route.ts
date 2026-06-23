import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimited, isValidEmail } from '@/lib/api-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED = {
  accredited_status: ['income', 'net_worth', 'professional', 'entity', 'not_accredited', 'unsure'],
  check_size_band: ['50k_100k', '100k_250k', '250k_500k', '500k_1m', '1m_plus'],
  timeline: ['immediate', '30_60_days', '60_90_days', 'exploring'],
  prior_re_experience: ['syndications', 'direct_ownership', 'reit_only', 'none'],
  source_of_capital: ['personal_savings', '1031_exchange', 'sdira', 'company_cash', 'family_office', 'other'],
}

function isStr(v: unknown, max = 1000): v is string {
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

  if (!isStr(body.full_name, 200)) return bad('full_name required')
  if (!isStr(body.email, 320) || !isValidEmail((body.email as string).trim())) return bad('email invalid')
  if (!isStr(body.phone, 50)) return bad('phone required')
  if (!isStr(body.state_code, 2)) return bad('state_code required')
  if (!isStr(body.accredited_status) || !ALLOWED.accredited_status.includes(body.accredited_status as string)) {
    return bad('accredited_status invalid')
  }

  for (const key of ['check_size_band', 'timeline', 'prior_re_experience', 'source_of_capital'] as const) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
      if (!ALLOWED[key].includes(body[key] as string)) {
        return bad(`${key} invalid`)
      }
    }
  }

  if (body.website) return NextResponse.json({ ok: true })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Supabase env vars missing')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const row = {
    full_name: (body.full_name as string).trim(),
    email: (body.email as string).trim().toLowerCase(),
    phone: (body.phone as string).trim(),
    state_code: (body.state_code as string).toUpperCase(),
    accredited_status: body.accredited_status as string,
    check_size_band: (body.check_size_band as string) || null,
    timeline: (body.timeline as string) || null,
    prior_re_experience: (body.prior_re_experience as string) || null,
    source_of_capital: (body.source_of_capital as string) || null,
    utm_source: (body.utm_source as string) || null,
    utm_medium: (body.utm_medium as string) || null,
    utm_campaign: (body.utm_campaign as string) || null,
    utm_content: (body.utm_content as string) || null,
    utm_term: (body.utm_term as string) || null,
    referrer: (body.referrer as string) || null,
    landing_page: (body.landing_page as string) || null,
    form_source: (body.form_source as string) || 'website-investor-form',
    message: (body.message as string) || null,
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

  notifyTeam(row).catch(err => console.error('Notify failed:', err))

  return NextResponse.json({ ok: true, id: data?.id })
}

function bad(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 })
}

async function notifyTeam(row: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY
  if (!key) return

  const subject = `New investor lead: ${row.full_name} (${row.check_size_band || 'no range'})`
  const html = `
    <h2>New investor application</h2>
    <table style="border-collapse:collapse">
      ${Object.entries(row).map(([k, v]) =>
        `<tr><td style="padding:4px 12px;border:1px solid #eee"><b>${k}</b></td><td style="padding:4px 12px;border:1px solid #eee">${escapeHtml(String(v ?? ''))}</td></tr>`
      ).join('')}
    </table>
    <p>Review the full lead in Supabase or your investor CRM.</p>
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
      html,
    }),
  })
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c)
  )
}
