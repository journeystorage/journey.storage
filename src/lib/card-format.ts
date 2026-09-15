// Input formatters for the card fields, shared by the rental and Pay Bill
// flows so both behave identically. Presentation only — every caller strips
// the formatting before the number reaches the server.

/** Group the card number in fours: 4111 1111 1111 1111. */
export function formatCardNumber(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 19)
  return d.replace(/(.{4})/g, '$1 ').trim()
}

/**
 * Keep the expiry as MM/YY, inserting the slash as the month completes.
 * `prev` lets a backspace delete through the slash instead of re-adding it.
 */
export function formatExpiry(v: string, prev = ''): string {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length === 1) return d > '1' ? `0${d}/` : d
  if (d.length === 2) {
    const deleting = v.length < prev.length && prev.endsWith('/')
    return deleting ? d : `${d}/`
  }
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

/** US billing ZIP: five digits, no +4. */
export function formatZip(v: string): string {
  return v.replace(/\D/g, '').slice(0, 5)
}

/** Digits only, for validating a formatted field. */
export function cardDigits(v: string): string {
  return v.replace(/\D/g, '')
}
