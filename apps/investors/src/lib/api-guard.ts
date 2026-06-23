// Lightweight in-memory request guard for public lead endpoints. Each Hostinger
// instance runs a single standalone Node process, so a module-level Map is a
// valid per-instance rate limiter (it resets on redeploy/restart — acceptable
// for spam mitigation on low-traffic marketing endpoints).

const RL_WINDOW_MS = 60_000
const RL_MAX = 6
const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimited(req: Request): boolean {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const now = Date.now()
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k)
  }
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RL_MAX
}

// Strict single-address validation — rejects whitespace, commas, and the
// punctuation used in header-injection / multi-recipient vectors, so the value
// is safe to store and to use as an email/reply-to field.
export function isValidEmail(value: string): boolean {
  return (
    value.length <= 320 &&
    /^[^\s@,;:<>"'()[\]\\]+@[^\s@,;:<>"'()[\]\\]+\.[^\s@,;:<>"'()[\]\\]{2,}$/.test(value)
  )
}
