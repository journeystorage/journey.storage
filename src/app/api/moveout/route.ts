import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import { sendLeadNotification } from '@/lib/lead-email'
import { rateLimited, isValidEmail } from '@/lib/api-guard'
import { getMoveOutProperty } from '@/lib/moveout-properties'

// Move-out requests land in the same `waitlist_leads` table as every other
// lead (distinguished by form_source), so this needs no new schema. The
// move-out specifics — unit, property, date, notes, photo — ride along in
// raw_payload and in the email notification.
const SOURCE_APP = 'main' as const
const FORM_SOURCE = 'moveout-request' as const

// Per-property notification routing. Each facility's move-out request emails
// its own address so the team can triage by location. Defaults below can be
// overridden per-instance via Hostinger env (no code change needed). Keys must
// match the slugs in src/lib/moveout-properties.ts.
const PROPERTY_NOTIFY: Record<string, string> = {
  'temple-hall': process.env.MOVEOUT_NOTIFY_TEMPLE_HALL || 'templehallhwy@journey.storage',
  'western-hills': process.env.MOVEOUT_NOTIFY_WESTERN_HILLS || 'westernhillstrl@journey.storage',
  'cleveland-road': process.env.MOVEOUT_NOTIFY_CLEVELAND_ROAD || 'mccrearyrd@journey.storage',
}

// Oversight copy — every move-out request is CC'd here regardless of facility,
// so a central inbox always keeps a copy. Env-overridable.
const MOVEOUT_ALWAYS_CC = process.env.MOVEOUT_ALWAYS_CC || 'lyvia@journey.storage'

// Proof-of-empty photos are uploaded here. Create a PUBLIC bucket named
// `moveout-photos` in the Supabase project for uploads to persist; if it's
// missing, the request still saves (photo upload is best-effort, like email).
const PHOTO_BUCKET = 'moveout-photos' as const
const MAX_PHOTO_BYTES = 12 * 1024 * 1024 // 12 MB — a generous phone-photo ceiling

function str(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  if (rateLimited(request)) {
    return NextResponse.json({ success: false, error: 'rate_limited' }, { status: 429 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_form' }, { status: 400 })
  }

  // Honeypot — bots fill hidden fields; pretend success without storing.
  if (str(form.get('website'))) {
    return NextResponse.json({ success: true })
  }

  const name = str(form.get('name'))
  const email = str(form.get('email')).toLowerCase()
  const phone = str(form.get('phone'))
  const propertySlug = str(form.get('property_slug'))
  const unit = str(form.get('unit'))
  const moveOutDate = str(form.get('moveout_date'))
  const notes = str(form.get('notes'))

  if (!name) {
    return NextResponse.json({ success: false, error: 'name_required' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: 'email_invalid' }, { status: 400 })
  }
  // Property is chosen from the on-page picker; trust the server's own list
  // (not client-sent text) for the label and email routing.
  const selectedProperty = getMoveOutProperty(propertySlug)
  if (!selectedProperty) {
    return NextResponse.json({ success: false, error: 'property_required' }, { status: 400 })
  }
  const property = `${selectedProperty.name} — ${selectedProperty.street}, ${selectedProperty.cityState}`
  if (!unit) {
    return NextResponse.json({ success: false, error: 'unit_required' }, { status: 400 })
  }
  if (!moveOutDate) {
    return NextResponse.json({ success: false, error: 'date_required' }, { status: 400 })
  }

  const supabase = getSupabaseServer()

  // ── Best-effort photo upload ─────────────────────────────────────────
  // Never let a storage hiccup block the move-out notice from being saved.
  let photoUrl: string | null = null
  let photoReceived = false
  const photo = form.get('photo')
  if (photo instanceof File && photo.size > 0) {
    photoReceived = true
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ success: false, error: 'photo_too_large' }, { status: 413 })
    }
    try {
      const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const safeUnit = unit.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 24) || 'unit'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeUnit}.${ext}`
      const buffer = Buffer.from(await photo.arrayBuffer())
      const { error: upErr } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, buffer, { contentType: photo.type || 'image/jpeg', upsert: false })
      if (upErr) {
        console.error('[Moveout] Photo upload failed:', upErr)
      } else {
        photoUrl = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
      }
    } catch (err) {
      console.error('[Moveout] Photo upload error:', err)
    }
  }

  const rawPayload = {
    form_source: FORM_SOURCE,
    name,
    email,
    phone,
    property,
    property_slug: selectedProperty.slug,
    unit,
    moveout_date: moveOutDate,
    notes,
    photo_received: photoReceived,
    photo_url: photoUrl,
  }

  try {
    const { error } = await supabase.from('waitlist_leads').insert({
      source_app: SOURCE_APP,
      form_source: FORM_SOURCE,
      name,
      email,
      phone: phone || null,
      raw_payload: rawPayload,
      user_agent: request.headers.get('user-agent'),
    })

    if (error) {
      console.error('[Moveout] Supabase insert failed:', error)
      return NextResponse.json({ success: false, error: 'insert_failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('[Moveout] Server error:', err)
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }

  // Best-effort email — the request is already saved, so a failure here must
  // not affect the response the tenant receives.
  try {
    const summary = [
      `Property: ${property}`,
      `Unit: ${unit}`,
      `Move-out date: ${moveOutDate}`,
      photoReceived
        ? photoUrl
          ? `Photo: ${photoUrl}`
          : 'Photo: received (upload to storage failed — check the moveout-photos bucket)'
        : 'Photo: none provided',
      notes ? `Notes: ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    await sendLeadNotification({
      name,
      email,
      phone,
      message: summary,
      formSource: FORM_SOURCE,
      to: PROPERTY_NOTIFY[selectedProperty.slug] || undefined,
      cc: MOVEOUT_ALWAYS_CC,
      subject: `Move-out request — ${selectedProperty.name} — ${name}`,
    })
  } catch (err) {
    console.error('[Moveout] Email notification failed:', err)
  }

  return NextResponse.json({ success: true })
}
