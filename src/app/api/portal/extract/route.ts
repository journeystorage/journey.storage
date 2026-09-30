// POST /api/portal/extract   (x-portal-code header; multipart: file, kind)
//
// Runs the AI reader on one invoice or receipt and returns the fields the
// portal form pre-fills. The page sends a downscaled copy of photos; the
// original is what /api/portal/submit archives.

import { NextResponse } from 'next/server'
import { checkAccess, accessError } from '@/lib/portal/access'
import { extractDocument, readerConfigured } from '@/lib/portal/reader'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const MAX_BYTES = 20 * 1024 * 1024

export async function POST(req: Request) {
  const access = checkAccess(req)
  if (access !== 'ok') {
    const { error, status } = accessError(access)
    return NextResponse.json({ ok: false, error }, { status })
  }
  if (!readerConfigured()) {
    return NextResponse.json({ ok: false, error: 'AI reader is not configured.' }, { status: 503 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'No file received.' }, { status: 400 })
  }
  const file = form.get('file')
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ ok: false, error: 'No file received.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'File is over 20 MB.' }, { status: 413 })
  }
  const kind = form.get('kind') === 'receipt' ? 'receipt' : 'invoice'

  try {
    return NextResponse.json({ ok: true, ...(await extractDocument(file, kind)) })
  } catch (err) {
    console.error('[portal] extract failed:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: `AI reader failed: ${message}` }, { status: 502 })
  }
}
