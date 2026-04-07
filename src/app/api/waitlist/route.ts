import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL || ''

export async function POST(request: Request) {
  const data = await request.json()

  if (!WEBHOOK_URL) {
    console.warn('[Lead] LEAD_WEBHOOK_URL not set — payload not forwarded:', data)
    return NextResponse.json({ success: true, forwarded: false })
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json().catch(() => ({}))
    return NextResponse.json({ success: true, forwarded: true, ...body })
  } catch (err) {
    console.error('[Lead] Webhook forward failed:', err)
    return NextResponse.json({ success: false, error: 'forward_failed' }, { status: 502 })
  }
}
