import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

const SOURCE_APP = 'investors' as const

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_json' }, { status: 400 })
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : ''
  const company = typeof payload.company === 'string' ? payload.company.trim() : ''
  const formSource = typeof payload.form_source === 'string' ? payload.form_source : 'investors-booking'
  const accreditedRaw = typeof payload.accredited_investor === 'string' ? payload.accredited_investor : ''
  const accreditedInvestor = ['yes', 'no', 'not_sure'].includes(accreditedRaw) ? accreditedRaw : null
  const smsOptIn = payload.sms_opt_in === true

  if (!name) {
    return NextResponse.json({ success: false, error: 'name_required' }, { status: 400 })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'email_invalid' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServer()
    const { error } = await supabase.from('leads').insert({
      source_app: SOURCE_APP,
      form_source: formSource,
      name,
      email,
      phone: phone || null,
      company: company || null,
      accredited_investor: accreditedInvestor,
      sms_opt_in: smsOptIn,
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

  return NextResponse.json({ success: true })
}
