// The AI reader for the Accounting Intake portal: Claude reads an invoice or
// receipt and returns the fields the form pre-fills. Ported from the Apps
// Script version (apps/accounting/apps-script/Code.gs → extractDocument).
//
// Needs ANTHROPIC_API_KEY on the main site instance. The key must belong to
// a workspace (an org-level key is rejected with "must include
// anthropic-workspace-id"). Without it the page falls back to its basic
// in-browser PDF text reader.

import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-opus-5-5'

export type Extraction = {
  vendor: string
  doc_date: string
  amount: string
  description: string
  paid_status: 'paid' | 'unpaid' | 'unknown'
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['vendor', 'doc_date', 'amount', 'description', 'paid_status'],
  properties: {
    vendor: { type: 'string' },
    doc_date: { type: 'string' },
    amount: { type: 'string' },
    description: { type: 'string' },
    paid_status: { type: 'string', enum: ['paid', 'unpaid', 'unknown'] },
  },
}

const SYSTEM =
  'You are an accounts-payable assistant for Journey Storage, a self-storage operator in Texas. You extract structured fields from vendor invoices and receipts accurately and conservatively. Never invent values that are not on the document.'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const

export function readerConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

function instructions(isReceipt: boolean): string {
  return [
    `Read this ${isReceipt ? 'receipt or payment confirmation' : 'invoice or bill'} and extract the fields below.`,
    '- vendor: the business that issued the document and is being paid. Never "Journey Storage", "Journey Capital Holdings" or one of its entities unless the document is clearly issued BY them. Use the legal or trading name as printed, without addresses.',
    '- doc_date: the invoice/receipt date as YYYY-MM-DD. Empty string if not printed.',
    `- amount: ${isReceipt ? 'the amount actually paid' : 'the total due / amount payable'} as a plain number with two decimals and no currency symbol, e.g. "1234.56". Empty string if not printed.`,
    '- description: one line, at most 90 characters, in plain English, saying what was billed (the service or goods, and the period or property if stated). No amounts, no dates, no invoice numbers.',
    '- paid_status: "paid" if the document itself says it is paid, a receipt, or shows a zero balance; "unpaid" if it shows an amount due; otherwise "unknown".',
    'If the document is unreadable, return empty strings and paid_status "unknown".',
  ].join('\n')
}

function documentBlock(file: File, data: string): Anthropic.Beta.BetaContentBlockParam | null {
  let mime = (file.type || '').toLowerCase()
  if (mime === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } }
  }
  if (mime === 'image/jpg') mime = 'image/jpeg'
  const imageType = IMAGE_TYPES.find((t) => t === mime)
  if (imageType) return { type: 'image', source: { type: 'base64', media_type: imageType, data } }
  return null
}

function normalizeDate(s: string): string {
  s = String(s || '').trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const d = new Date(s)
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

function normalizeAmount(s: string): string {
  const n = parseFloat(String(s ?? '').replace(/[^0-9.\-]/g, ''))
  return isNaN(n) ? '' : n.toFixed(2)
}

// Throws an Error with a message fit to show the uploader.
export async function extractDocument(file: File, kind: 'invoice' | 'receipt'): Promise<Extraction> {
  const block = documentBlock(file, Buffer.from(await file.arrayBuffer()).toString('base64'))
  if (!block) throw new Error(`Unsupported file type: ${file.type || 'unknown'}. Use PDF, JPG, PNG, GIF or WebP.`)

  const client = new Anthropic()
  let response: Anthropic.Beta.BetaMessage
  try {
    response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
      system: SYSTEM,
      messages: [{ role: 'user', content: [block, { type: 'text', text: instructions(kind === 'receipt') }] }],
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new Error('the AI key was rejected')
    if (err instanceof Anthropic.RateLimitError) throw new Error('the AI reader is busy, try again in a minute')
    if (err instanceof Anthropic.APIError) throw new Error(err.message)
    throw err
  }

  if (response.stop_reason === 'refusal') throw new Error('the AI reader declined to read this document')
  const text = response.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
  const data = JSON.parse(text) as Extraction
  return {
    vendor: String(data.vendor || '').slice(0, 80),
    doc_date: normalizeDate(data.doc_date),
    amount: normalizeAmount(data.amount),
    description: String(data.description || '').replace(/\s+/g, ' ').trim().slice(0, 90),
    paid_status: data.paid_status || 'unknown',
  }
}
