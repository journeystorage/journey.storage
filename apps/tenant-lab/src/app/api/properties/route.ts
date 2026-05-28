import { NextResponse } from 'next/server'
import { getProperties } from '@/lib/tenant-api'

export async function GET() {
  try {
    const data = await getProperties()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
