import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Ownership check for tenant self-service.
 *
 * Pay Bill finds an account from just an email or phone, which is fine for
 * showing a balance but far too weak to let someone sign a lease: anyone who
 * knew a customer's email could put a unit in that customer's name. So any
 * action that creates an obligation is gated behind a code emailed to the
 * address already on the account.
 *
 * Codes are derived, not stored — an HMAC over (contact, time window) — so
 * they survive a redeploy and need no table. Each is valid for its 10-minute
 * window plus the one before it, giving the tenant 10–20 minutes to type it.
 * Attempts and sends are throttled in memory (Hostinger runs one long-lived
 * Node process; a restart simply clears the counters, which fails safe).
 *
 * The code is keyed on the normalised email/phone the tenant typed, NOT on a
 * contact id: live data has one email mapping to two contact records, so an
 * id-keyed code would depend on which record happened to sort first and would
 * fail unpredictably. Possession of the mailbox is what's being proven, and the
 * code is only ever sent to the address already on the account.
 */

const WINDOW_MS = 10 * 60 * 1000
const SESSION_MS = 30 * 60 * 1000
const MAX_ATTEMPTS = 5
const MAX_SENDS = 3
const SEND_WINDOW_MS = 15 * 60 * 1000

export const VERIFY_COOKIE = 'jsv'

function secret(): string {
  // A dedicated secret is preferred; the Nectar key is always present in prod
  // so verification works without extra configuration.
  const s = process.env.VERIFY_SECRET || process.env.NECTAR_API_KEY
  if (!s) throw new Error('No verification secret configured')
  return s
}

const hmac = (data: string) => createHmac('sha256', secret()).update(data).digest()

/** Email lowercased, phone reduced to digits, so the key is stable. */
export function normalizeContact(contact: string): string {
  const c = (contact ?? '').trim()
  return c.includes('@') ? c.toLowerCase() : c.replace(/\D/g, '')
}

/** The 6-digit code for a normalised contact in a given 10-minute window. */
export function codeFor(contact: string, windowIndex: number): string {
  const d = hmac(`code:${normalizeContact(contact)}:${windowIndex}`)
  // Truncate like TOTP: 31 bits, then 6 digits.
  const n = ((d[0] & 0x7f) << 24) | (d[1] << 16) | (d[2] << 8) | d[3]
  return String(n % 1_000_000).padStart(6, '0')
}

export const currentWindow = (now = Date.now()) => Math.floor(now / WINDOW_MS)

const attempts = new Map<string, { n: number; resetAt: number }>()
const sends = new Map<string, { n: number; resetAt: number }>()

function bump(map: typeof attempts, key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const cur = map.get(key)
  if (!cur || cur.resetAt < now) {
    map.set(key, { n: 1, resetAt: now + windowMs })
    return true
  }
  if (cur.n >= max) return false
  cur.n += 1
  return true
}

export const canSend = (contact: string) => bump(sends, normalizeContact(contact), MAX_SENDS, SEND_WINDOW_MS)

/** Constant-time check of a submitted code against this window and the last. */
export function verifyCode(contact: string, submitted: string): boolean {
  const key = normalizeContact(contact)
  const clean = (submitted ?? '').replace(/\D/g, '')
  if (clean.length !== 6) return false
  if (!bump(attempts, key, MAX_ATTEMPTS, WINDOW_MS)) return false
  const w = currentWindow()
  for (const idx of [w, w - 1]) {
    const expected = Buffer.from(codeFor(key, idx))
    const got = Buffer.from(clean)
    if (expected.length === got.length && timingSafeEqual(expected, got)) {
      attempts.delete(key) // success clears the throttle
      return true
    }
  }
  return false
}

export interface VerifiedSession {
  /** Contact record to attach a new lease to. */
  contactId: string
  /** Normalised email/phone that was verified — the key the account is read by. */
  contact: string
}

/**
 * Signed cookie value. Carries the verified contact as well as the id, because
 * one email can map to several contact records: reading the account by contact
 * returns all of the tenant's spaces, while the id alone would return only some.
 */
export function issueSession(session: VerifiedSession): string {
  const exp = Date.now() + SESSION_MS
  const payload = Buffer.from(JSON.stringify({ ...session, exp })).toString('base64url')
  const sig = hmac(`session:${payload}`).toString('base64url')
  return `${payload}.${sig}`
}

/** Returns the verified session, or null when absent/expired/tampered. */
export function readSession(value: string | undefined | null): VerifiedSession | null {
  if (!value) return null
  const idx = value.lastIndexOf('.')
  if (idx <= 0) return null
  const payload = value.slice(0, idx)
  const sig = value.slice(idx + 1)
  const expected = Buffer.from(hmac(`session:${payload}`).toString('base64url'))
  const got = Buffer.from(sig)
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as VerifiedSession & { exp?: number }
    if (!parsed?.contactId || !parsed?.contact) return null
    if (!Number.isFinite(parsed.exp) || (parsed.exp as number) < Date.now()) return null
    return { contactId: parsed.contactId, contact: parsed.contact }
  } catch {
    return null
  }
}

/** "l***a@journey.storage" — enough to recognise, not enough to harvest. */
export function maskEmail(email: string): string {
  const [user = '', domain = ''] = email.split('@')
  if (!domain) return '***'
  const shown = user.length <= 2 ? user.slice(0, 1) : `${user[0]}***${user[user.length - 1]}`
  return `${shown}@${domain}`
}
