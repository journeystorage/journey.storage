// Google Sheets + Drive access for the Accounting Intake portal (/portal).
//
// Submissions land where the Apps Script version put them: a row on the
// "Submissions" tab of "Accounting Intake — Submissions" and the files in
// the "Accounting Intake Files" Drive folder.
//
// Auth is a one-time OAuth grant from a journey.storage Google account (run
// scripts/portal-google-auth.mjs), not a service account: service accounts
// cannot own files in a normal Drive folder, and Workspace blocks their keys
// by default. The refresh token is exchanged for a short-lived access token
// here and cached until shortly before it expires.
//
// Env (main site Hostinger instance):
//   GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN
//   ACCOUNTING_SHEET_ID, ACCOUNTING_FOLDER_ID, ACCOUNTING_SHARE_DOMAIN (optional overrides)

const SHEET_ID = process.env.ACCOUNTING_SHEET_ID || '159MK2lb0Dgp8qgYiS8AaYIUbpJtc8PW9rHg6nNXcTh0'
const FOLDER_ID = process.env.ACCOUNTING_FOLDER_ID || '18D8F2_ouon-im7hqndpmWconsx4SKC_2'
const SHARE_DOMAIN = process.env.ACCOUNTING_SHARE_DOMAIN || 'journey.storage'
const TAB = 'Submissions'

let cached: { token: string; expiresAt: number } | null = null

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  )
}

async function accessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN || '',
      grant_type: 'refresh_token',
    }),
  })
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string }
  if (!res.ok || !json.access_token) {
    throw new Error(`Google sign-in failed (${json.error || res.status}). The portal's Google grant may need renewing.`)
  }
  cached = { token: json.access_token, expiresAt: Date.now() + ((json.expires_in || 3600) - 120) * 1000 }
  return json.access_token
}

async function google(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await accessToken()
  const res = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const msg = body.match(/"message":\s*"([^"]+)"/)?.[1] || `HTTP ${res.status}`
    throw new Error(`Google ${new URL(url).hostname.split('.')[0]} error: ${msg}`)
  }
  return res
}

// Uploads into the intake folder and shares it view-only with anyone at the
// Workspace domain who has the link (what the Apps Script did). Returns the
// file's Drive link for the sheet.
export async function uploadFile(file: File): Promise<string> {
  const boundary = `portal${crypto.randomUUID().replace(/-/g, '')}`
  const meta = JSON.stringify({ name: file.name || 'file', parents: [FOLDER_ID] })
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`),
    Buffer.from(await file.arrayBuffer()),
    Buffer.from(`\r\n--${boundary}--`),
  ])
  const res = await google(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,webViewLink',
    { method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body },
  )
  const { id, webViewLink } = (await res.json()) as { id: string; webViewLink: string }
  try {
    await google(`https://www.googleapis.com/drive/v3/files/${id}/permissions?supportsAllDrives=true&sendNotificationEmail=false`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'domain', domain: SHARE_DOMAIN, role: 'reader', allowFileDiscovery: false }),
    })
  } catch (err) {
    // Sharing is a convenience; the file is saved and the uploader can open it.
    console.warn('[portal] domain share failed:', err)
  }
  return webViewLink
}

// A leading = + - @ would make Sheets evaluate a vendor name as a formula.
function cell(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value
}

function chicagoTimestamp(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date())
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]))
  return `${p.year}-${p.month}-${p.day} ${p.hour === '24' ? '00' : p.hour}:${p.minute}:${p.second}`
}

// Values are placed by header NAME, not position, so reordering columns in
// the sheet stays safe. Returns the sheet row number that was written.
export async function appendSubmission(values: Record<string, string>): Promise<number | null> {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`
  const range = encodeURIComponent(`${TAB}!1:1`)
  const headerRes = await google(`${base}/${range}`)
  const header = ((await headerRes.json()) as { values?: string[][] }).values?.[0] ?? []
  if (!header.length) throw new Error(`The "${TAB}" tab has no header row.`)

  const all: Record<string, string> = { Timestamp: chicagoTimestamp(), ...values }
  const row = header.map((h) => (h === 'Timestamp' ? all[h] : cell(all[h] ?? '')))
  const res = await google(
    `${base}/${encodeURIComponent(`${TAB}!A1`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values: [row] }) },
  )
  const updated = ((await res.json()) as { updates?: { updatedRange?: string } }).updates?.updatedRange || ''
  const n = Number(updated.match(/(\d+)(?::[A-Z]+\d+)?$/)?.[1])
  return Number.isFinite(n) && n > 0 ? n : null
}
