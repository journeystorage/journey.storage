// POST /api/portal/session   (x-portal-code header)
//
// Checks the team access code when the portal page opens and tells it
// whether the AI reader is available.

import { NextResponse } from 'next/server'
import { checkAccess, accessError } from '@/lib/portal/access'
import { readerConfigured } from '@/lib/portal/reader'
import { googleConfigured } from '@/lib/portal/google'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const access = checkAccess(req)
  if (access !== 'ok') {
    const { error, status } = accessError(access)
    return NextResponse.json({ ok: false, error }, { status })
  }
  return NextResponse.json({ ok: true, aiEnabled: readerConfigured(), saving: googleConfigured() })
}
