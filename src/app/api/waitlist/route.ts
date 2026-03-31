import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()

  // Phase 1: log to console. Email service integration is Phase 2.
  console.log('[Waitlist Signup]', {
    name: data.name,
    email: data.email,
    zip: data.zip,
    phone: data.phone || null,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
