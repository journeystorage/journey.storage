import { NextRequest, NextResponse } from 'next/server'
import { getUnits } from '@/lib/tenant-api'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const propertyId = searchParams.get('property_id')
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')

  if (!propertyId) {
    return NextResponse.json({ error: 'property_id is required' }, { status: 400 })
  }

  try {
    const data = await getUnits(propertyId, {
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
    })
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
