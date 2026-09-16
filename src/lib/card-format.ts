// Input formatters for the card fields, shared by the rental and Pay Bill
// flows so both behave identically. Presentation only — every caller strips
// the formatting before the number reaches the server.

/** Group the card number in fours: 4111 1111 1111 1111. */
export function formatCardNumber(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 19)
  return d.replace(/(.{4})/g, '$1 ').trim()
}

/**
 * Keep the expiry readable as MM/YY — or MM/YYYY when that is what was given.
 *
 * Both have to be accepted: people type either, and a browser autofilling an
 * autocomplete="cc-exp" field supplies a four-digit year. An earlier version
 * capped the field at four digits, which silently turned 12/2026 into 12/20
 * and got live cards declined as expired. Never truncate the year.
 *
 * `prev` lets a backspace delete through the slash instead of re-adding it.
 */
export function formatExpiry(v: string, prev = ''): string {
  const d = v.replace(/\D/g, '').slice(0, 6)
  if (!d) return ''
  if (d.length === 1) return d > '1' ? `0${d}/` : d
  if (d.length === 2) {
    const deleting = v.length < prev.length && prev.endsWith('/')
    return deleting ? d : `${d}/`
  }
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

/**
 * Split a formatted expiry into the month and full year the API wants.
 * Returns null while the field is incomplete or the month is impossible, so
 * callers never post a half-typed date.
 */
export function parseExpiry(v: string): { mm: string; yyyy: string } | null {
  const d = v.replace(/\D/g, '')
  if (d.length !== 4 && d.length !== 6) return null
  const mm = d.slice(0, 2)
  if (Number(mm) < 1 || Number(mm) > 12) return null
  const year = d.slice(2)
  return { mm, yyyy: year.length === 2 ? `20${year}` : year }
}

/** True when the card is already out of date — worth saying before charging. */
export function expiryIsPast(v: string, now = new Date()): boolean {
  const p = parseExpiry(v)
  if (!p) return false
  const end = new Date(Number(p.yyyy), Number(p.mm), 1) // first day after the expiry month
  return end <= now
}

/** US billing ZIP: five digits, no +4. */
export function formatZip(v: string): string {
  return v.replace(/\D/g, '').slice(0, 5)
}

/** Digits only, for validating a formatted field. */
export function cardDigits(v: string): string {
  return v.replace(/\D/g, '')
}
