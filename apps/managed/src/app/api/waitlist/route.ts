import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import { sendLeadNotification } from '@/lib/lead-email'
import { rateLimited, isValidEmail } from '@/lib/api-guard'

// Journey Managed keeps its own leads table (managed_leads) rather than sharing
// the main site's waitlist_leads. The "free facility review" form posts here.
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
  const facilities = typeof payload.facilities === 'string' ? payload.facilities.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''
  const formSource = typeof payload.form_source === 'string' ? payload.form_source : 'managed-inquiry'

  if (!name) {
    return NextResponse.json({ success: false, error: 'name_required' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: 'email_invalid' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServer()
    const { error } = await supabase.from('managed_leads').insert({
      form_source: formSource,
      name,
      email,
      phone: phone || null,
      company: company || null,
      facilities: facilities || null,
      message: message || null,
      raw_payload: payload,
      user_agent: request.headers.get('user-agent'),
    })

    if (error) {
      console.error('[Managed Lead] Supabase insert failed:', error)
      return NextResponse.json({ success: false, error: 'insert_failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('[Managed Lead] Server error:', err)
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }

  // Best-effort email notification — the lead is already saved above, so a
  // failure here must not affect the response the visitor receives.
  try {
    const noteLines = [
      company && `Facility: ${company}`,
      facilities && `# of facilities: ${facilities}`,
      message && `Notes: ${message}`,
    ].filter(Boolean).join('\n')
    await sendLeadNotification({
      name,
      email,
      zip: '',
      phone,
      message: noteLines,
      formSource,
    })
  } catch (err) {
    console.error('[Managed Lead] Email notification failed:', err)
  }

  return NextResponse.json({ success: true })
}
