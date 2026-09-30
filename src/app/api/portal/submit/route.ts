// POST /api/portal/submit   (x-portal-code header; multipart form)
//
// Saves one invoice/receipt submission: the original file (and optional
// wire-instructions file) into the Accounting Intake Drive folder, then a
// row on the Submissions sheet. Only answers ok once the row is written, so
// the page never shows "Submitted" for something that was not saved.

import { NextResponse } from 'next/server'
import { checkAccess, accessError } from '@/lib/portal/access'
import { appendSubmission, googleConfigured, uploadFile } from '@/lib/portal/google'
import { isValidEmail } from '@/lib/api-guard'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const MAX_BYTES = 20 * 1024 * 1024
const ENTITIES = ['JCH', 'EMB', 'JS', 'JD', 'JSM01', 'JSV01', 'JS001', 'Hall Personal']
const STATUSES = ['unpaid', 'paid', 'receipt']

function str(value: FormDataEntryValue | null, max = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status })
}

export async function POST(req: Request) {
  const access = checkAccess(req)
  if (access !== 'ok') {
    const { error, status } = accessError(access)
    return fail(error, status)
  }
  if (!googleConfigured()) return fail('Saving is not set up yet (no Google access configured).', 503)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return fail('The form could not be read. Please try again.')
  }

  const vendor = str(form.get('vendor'), 120)
  const entity = str(form.get('entity'))
  const docDate = str(form.get('doc_date'))
  const amount = str(form.get('amount')).replace(/[^0-9.]/g, '')
  const status = str(form.get('status'))
  const descr = str(form.get('descr'), 300)
  const comments = str(form.get('comments'), 2000)
  const email = str(form.get('email'), 320).toLowerCase()
  const file = form.get('file')
  const wireFile = form.get('wireFile')

  if (!vendor) return fail('Missing required field: vendor')
  if (!ENTITIES.includes(entity)) return fail('Missing required field: entity')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(docDate)) return fail('Missing required field: date')
  if (!amount) return fail('Missing required field: amount')
  if (!STATUSES.includes(status)) return fail('Missing required field: status')
  if (!descr) return fail('Missing required field: description')
  if (!isValidEmail(email)) return fail('Please enter your email address.')
  if (!(file instanceof File) || !file.size) return fail('The invoice or receipt file is missing.')
  if (file.size > MAX_BYTES) return fail('The invoice file is over 20 MB.', 413)
  const hasWire = wireFile instanceof File && wireFile.size > 0
  if (hasWire && wireFile.size > MAX_BYTES) return fail('The wire-instructions file is over 20 MB.', 413)

  try {
    const [invoiceLink, wireLink] = await Promise.all([
      uploadFile(file),
      hasWire ? uploadFile(wireFile) : Promise.resolve(''),
    ])
    const row = await appendSubmission({
      Vendor: vendor,
      Entity: entity,
      Date: docDate,
      Amount: amount,
      Kind: status === 'receipt' ? 'receipt' : 'invoice',
      Status: status,
      Description: descr,
      Comments: comments,
      'Submitted By': email,
      'Invoice File': invoiceLink,
      'Wire File': wireLink,
    })
    return NextResponse.json({ ok: true, row })
  } catch (err) {
    console.error('[portal] submit failed:', err)
    return fail(err instanceof Error ? err.message : String(err), 502)
  }
}
