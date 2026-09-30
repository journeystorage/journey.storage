// Team access code for the Accounting Intake portal. The page is on the
// public internet, so every API call carries the code (x-portal-code header)
// to keep strangers from writing to the Sheet or spending on the AI reader.
//
// Env: PORTAL_ACCESS_CODE. With no code configured the portal refuses to run,
// so it cannot be left accidentally open.

import { timingSafeEqual } from 'crypto'

const FAIL_WINDOW_MS = 15 * 60_000
const FAIL_MAX = 10
const failures = new Map<string, { count: number; resetAt: number }>()

function ip(req: Request): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
}

export type AccessResult = 'ok' | 'wrong' | 'locked' | 'unconfigured'

// Wrong guesses are counted per IP; after FAIL_MAX in the window every
// attempt from that IP is refused until it resets (per-instance memory, like
// api-guard's limiter).
export function checkAccess(req: Request): AccessResult {
  const expected = process.env.PORTAL_ACCESS_CODE
  if (!expected) return 'unconfigured'
  const key = ip(req)
  const now = Date.now()
  const entry = failures.get(key)
  if (entry && now < entry.resetAt && entry.count >= FAIL_MAX) return 'locked'

  const given = Buffer.from((req.headers.get('x-portal-code') || '').trim().toLowerCase())
  const want = Buffer.from(expected.trim().toLowerCase())
  if (given.length === want.length && timingSafeEqual(given, want)) return 'ok'

  if (failures.size > 5000) for (const [k, v] of failures) if (now > v.resetAt) failures.delete(k)
  if (!entry || now > entry.resetAt) failures.set(key, { count: 1, resetAt: now + FAIL_WINDOW_MS })
  else entry.count += 1
  return 'wrong'
}

export function accessError(result: Exclude<AccessResult, 'ok'>): { error: string; status: number } {
  if (result === 'unconfigured') return { error: 'The portal is not set up yet (no access code configured).', status: 503 }
  if (result === 'locked') return { error: 'Too many wrong codes. Try again in 15 minutes.', status: 429 }
  return { error: 'That access code is not right.', status: 401 }
}
