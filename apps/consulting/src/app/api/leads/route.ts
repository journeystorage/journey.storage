import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import { sendLeadNotification } from '@/lib/lead-email'
import { rateLimited, isValidEmail } from '@/lib/api-guard'

// Note: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are read from this instance's
// Hostinger environment at runtime. Updating them requires a redeploy (not just
// a restart) for the standalone server to pick up the new values.

const SOURCE_APP = 'consulting' as const
const ALLOWED_FORM_SOURCES = new Set([
  'consulting-scout',
  'consulting-pursuit',
  'consulting-booking',
  'consulting-contact',
])

export async function POST(request: Request) {
  if (rateLimited(request)) {
    return NextResponse.json({ success: false, error: 'rate_limited' }, { status: 429 })
  }

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_json' }, { status: 400 })
  }

  // Honeypot — bots fill hidden fields; pretend success without storing.
  if (payload.website) {
    return NextResponse.json({ success: true })
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : ''
  const company = typeof payload.company === 'string' ? payload.company.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''
  const formSource = typeof payload.form_source === 'string' && ALLOWED_FORM_SOURCES.has(payload.form_source)
    ? payload.form_source
    : null

  if (!name) {
    return NextResponse.json({ success: false, error: 'name_required' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: 'email_invalid' }, { status: 400 })
  }
  if (!formSource) {
    return NextResponse.json({ success: false, error: 'form_source_invalid' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServer()
    const { error } = await supabase.from('advisory_leads').insert({
      source_app: SOURCE_APP,
      form_source: formSource,
      name,
      email,
      phone: phone || null,
      company: company || null,
      message: message || null,
      raw_payload: payload,
      user_agent: request.headers.get('user-agent'),
    })

    if (error) {
      console.error('[Lead] Supabase insert failed:', error)
      return NextResponse.json({ success: false, error: 'insert_failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('[Lead] Server error:', err)
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }

  // Best-effort email notification — the lead is already saved above, so a
  // failure here must not affect the response the visitor receives.
  try {
    await sendLeadNotification({
      name,
      email,
      phone,
      company,
      message,
      formSource,
    })
  } catch (err) {
    console.error('[Lead] Email notification failed:', err)
  }

  return NextResponse.json({ success: true })
}
