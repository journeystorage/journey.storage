import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'

// Gmail + Google Calendar, read-only, via raw REST (no googleapis dep).
// Tokens live in hub_google_tokens, one row per hub user, RLS-scoped to
// that user's own session. Jarvis only ever reads — no send, no delete.

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  // Metadata-only: search files, get names + open links. Never file contents.
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  // Write access ONLY to files/folders the hub itself creates (the
  // "Journey Hub" output folder) — it cannot touch anything else in Drive.
  'https://www.googleapis.com/auth/drive.file',
]

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3006/api/google/callback'
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret, redirectUri }
}

interface TokenRow {
  user_email: string
  refresh_token: string
  access_token: string | null
  expires_at: string | null
}

export async function getUserEmail(supabase: SupabaseClient): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.email ?? null
}

export async function hasGoogleConnection(supabase: SupabaseClient): Promise<boolean> {
  if (!getGoogleOAuthConfig()) return false
  const { data } = await supabase.from('hub_google_tokens').select('user_email').limit(1)
  return Boolean(data?.length)
}

// Returns a live access token, refreshing (and persisting) if expired.
async function getAccessToken(supabase: SupabaseClient): Promise<string | null> {
  const config = getGoogleOAuthConfig()
  if (!config) return null

  const { data } = await supabase.from('hub_google_tokens').select('*').limit(1).single()
  const row = data as TokenRow | null
  if (!row) return null

  const stillValid =
    row.access_token && row.expires_at && new Date(row.expires_at).getTime() - Date.now() > 60_000
  if (stillValid) return row.access_token

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: row.refresh_token,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) return null
  const json = (await res.json()) as { access_token: string; expires_in: number }

  await supabase
    .from('hub_google_tokens')
    .update({
      access_token: json.access_token,
      expires_at: new Date(Date.now() + json.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_email', row.user_email)

  return json.access_token
}

async function googleGet(token: string, url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Google API ${res.status}: ${await res.text().then((t) => t.slice(0, 200))}`)
  return res.json()
}

export interface EmailSummary {
  from: string
  subject: string
  date: string
  snippet: string
}

export async function listRecentEmails(supabase: SupabaseClient, query?: string, max = 15): Promise<EmailSummary[]> {
  const token = await getAccessToken(supabase)
  if (!token) throw new Error('Google is not connected')

  const q = encodeURIComponent(query?.trim() || 'newer_than:2d in:inbox')
  const list = (await googleGet(
    token,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=${Math.min(max, 25)}`,
  )) as { messages?: { id: string }[] }

  const ids = (list.messages ?? []).map((m) => m.id)
  const emails = await Promise.all(
    ids.map(async (id) => {
      const msg = (await googleGet(
        token,
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
      )) as { snippet?: string; payload?: { headers?: { name: string; value: string }[] } }
      const header = (name: string) =>
        msg.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? ''
      return {
        from: header('From'),
        subject: header('Subject'),
        date: header('Date'),
        snippet: msg.snippet ?? '',
      }
    }),
  )
  return emails
}

export interface DriveFileSummary {
  name: string
  type: string
  link: string
  modified: string
}

export async function searchDriveFiles(supabase: SupabaseClient, query: string): Promise<DriveFileSummary[]> {
  const token = await getAccessToken(supabase)
  if (!token) throw new Error('Google is not connected')

  const q = `name contains '${query.replace(/['\\]/g, '')}' and trashed = false`
  const data = (await googleGet(
    token,
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(name,mimeType,webViewLink,modifiedTime)&pageSize=10&orderBy=modifiedTime desc&supportsAllDrives=true&includeItemsFromAllDrives=true&corpora=allDrives`,
  )) as { files?: { name?: string; mimeType?: string; webViewLink?: string; modifiedTime?: string }[] }

  return (data.files ?? []).map((f) => ({
    name: f.name ?? '(unnamed)',
    type: (f.mimeType ?? '').replace('application/vnd.google-apps.', ''),
    link: f.webViewLink ?? '',
    modified: f.modifiedTime ?? '',
  }))
}

// ── Drive output sync ────────────────────────────────────────────────
// Everything the team produces lands in My Drive under:
//   Journey Hub / <employee name> / <doc>
// Files are created as real Google Docs so they're editable and shareable.

const HUB_FOLDER_NAME = 'Journey Hub'
const FOLDER_MIME = 'application/vnd.google-apps.folder'

async function googlePost(token: string, url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Google API ${res.status}: ${await res.text().then((t) => t.slice(0, 200))}`)
  return res.json()
}

// Finds (or creates) a folder by name. With drive.file scope, list only sees
// what the hub created — so name lookup is unambiguous within our own tree.
async function ensureFolder(token: string, name: string, parentId?: string): Promise<string> {
  const safeName = name.replace(/['\\]/g, '')
  let q = `name = '${safeName}' and mimeType = '${FOLDER_MIME}' and trashed = false`
  if (parentId) q += ` and '${parentId}' in parents`
  const found = (await googleGet(
    token,
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)&pageSize=1`,
  )) as { files?: { id: string }[] }
  if (found.files?.[0]?.id) return found.files[0].id

  const created = (await googlePost(token, 'https://www.googleapis.com/drive/v3/files?fields=id', {
    name: safeName,
    mimeType: FOLDER_MIME,
    ...(parentId ? { parents: [parentId] } : {}),
  })) as { id: string }
  return created.id
}

export interface DriveSaveResult {
  link: string
  folder: string
}

export async function saveToDrive(
  supabase: SupabaseClient,
  ownerName: string,
  title: string,
  content: string,
): Promise<DriveSaveResult> {
  const token = await getAccessToken(supabase)
  if (!token) throw new Error('Google is not connected')

  const rootId = await ensureFolder(token, HUB_FOLDER_NAME)
  const ownerId = await ensureFolder(token, ownerName, rootId)

  const boundary = 'journey-hub-upload-boundary'
  const metadata = {
    name: title.slice(0, 200),
    parents: [ownerId],
    mimeType: 'application/vnd.google-apps.document',
  }
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${content}\r\n--${boundary}--`

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
      body,
    },
  )
  if (!res.ok) throw new Error(`Drive upload failed (${res.status}): ${await res.text().then((t) => t.slice(0, 200))}`)
  const file = (await res.json()) as { id: string; webViewLink?: string }

  return {
    link: file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`,
    folder: `${HUB_FOLDER_NAME}/${ownerName}`,
  }
}

export interface CalendarEventSummary {
  summary: string
  start: string
  end: string
  location: string
  attendees: string[]
}

export async function listCalendarEvents(
  supabase: SupabaseClient,
  daysAhead = 7,
): Promise<CalendarEventSummary[]> {
  const token = await getAccessToken(supabase)
  if (!token) throw new Error('Google is not connected')

  const timeMin = new Date().toISOString()
  const timeMax = new Date(Date.now() + Math.min(daysAhead, 31) * 24 * 60 * 60 * 1000).toISOString()
  const data = (await googleGet(
    token,
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=25`,
  )) as {
    items?: {
      summary?: string
      location?: string
      start?: { dateTime?: string; date?: string }
      end?: { dateTime?: string; date?: string }
      attendees?: { email?: string }[]
    }[]
  }

  return (data.items ?? []).map((e) => ({
    summary: e.summary ?? '(no title)',
    start: e.start?.dateTime ?? e.start?.date ?? '',
    end: e.end?.dateTime ?? e.end?.date ?? '',
    location: e.location ?? '',
    attendees: (e.attendees ?? []).map((a) => a.email ?? '').filter(Boolean),
  }))
}
