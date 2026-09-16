import 'server-only'
import { NectarError } from './client'

// ---------------------------------------------------------------------------
// Turning a failed checkout into something worth telling the customer.
//
// Every failure used to collapse into one sentence — "we could not complete
// the rental, please call us" — which is useless to the renter (was it my
// card?) and useless to us (what actually broke?). This classifies the error
// instead, so the customer is told whether it was their card, the space, or
// us, and staff get the real cause plus a reference in the server log.
// ---------------------------------------------------------------------------

export type FailureKind =
  | 'card_declined'
  | 'card_invalid'
  | 'card_expired'
  | 'space_unavailable'
  | 'hold_expired'
  | 'duplicate_account'
  | 'processor_unavailable'
  | 'provider_error'
  | 'misconfigured'

export interface Failure {
  kind: FailureKind
  /**
   * The provider's own message. Kept so a failure can be reported to staff by
   * email — production logs aren't readable from here, and without this the
   * real cause is lost the moment the request ends.
   */
  providerMessage?: string
  providerStatus?: number
  /** What the customer reads. */
  message: string
  /** True when trying a different card is the fix — keeps them on the step. */
  retryCard: boolean
  /** HTTP status for the route to return. */
  status: number
}

/** Ordered: the first pattern that matches the provider's text wins. */
const PATTERNS: Array<{ re: RegExp; kind: FailureKind }> = [
  { re: /\bdeclin|\bdo not honou?r|insufficient fund|card.?holder|pick.?up card|restricted card|lost card|stolen card/i, kind: 'card_declined' },
  { re: /\bcvv|\bcvc|security code|\bavs\b|address verification|zip.?code mismatch|postal.?code/i, kind: 'card_declined' },
  { re: /expire|\bexp_(mo|yr)\b|invalid date/i, kind: 'card_expired' },
  { re: /invalid.*(card|account).*(number)?|card.?number|luhn|unsupported card|card type/i, kind: 'card_invalid' },
  { re: /customer profile already exists|duplicate/i, kind: 'duplicate_account' },
  { re: /hold|reservation.*(expire|not found)|dossier|token.*(expire|invalid)/i, kind: 'hold_expired' },
  { re: /unit.*(unavailable|occupied|not vacant|rented)|no longer available|space.*taken/i, kind: 'space_unavailable' },
  { re: /gateway|processor|merchant|acquirer|payment.?method|transaction/i, kind: 'processor_unavailable' },
]

const COPY: Record<FailureKind, { message: string; retryCard: boolean; status: number }> = {
  card_declined: {
    message: 'Your bank declined the card. Nothing has been charged. Try a different card, or call your bank and try again.',
    retryCard: true,
    status: 402,
  },
  card_invalid: {
    message: 'That card number wasn’t accepted. Check the digits and try again — nothing has been charged.',
    retryCard: true,
    status: 402,
  },
  card_expired: {
    message: 'That card came back as expired. Check the expiry date, or use another card — nothing has been charged.',
    retryCard: true,
    status: 402,
  },
  space_unavailable: {
    message: 'That space was taken while you were checking out. Nothing has been charged — pick another space and we’ll hold it for you.',
    retryCard: false,
    status: 409,
  },
  hold_expired: {
    message: 'Your 15-minute hold on the space ran out before checkout finished. Nothing has been charged — start again and it will go through.',
    retryCard: false,
    status: 409,
  },
  duplicate_account: {
    message: 'We already have an account under these details, so we couldn’t finish this online. Nothing has been charged — give us a call and we’ll add the space to your account.',
    retryCard: false,
    status: 409,
  },
  processor_unavailable: {
    message: 'Our payment processor wouldn’t complete the charge. This is on our side, not your card, and nothing has been charged. Please call us and we’ll finish the rental over the phone.',
    retryCard: false,
    status: 502,
  },
  provider_error: {
    message: 'Our storage system didn’t complete the rental. This is on our side, not your card, and nothing has been charged. Please call us and we’ll finish it over the phone.',
    retryCard: false,
    status: 502,
  },
  misconfigured: {
    message: 'Online rentals are temporarily unavailable. Nothing has been charged — please call us and we’ll get you moved in.',
    retryCard: false,
    status: 503,
  },
}

/**
 * Classify a thrown checkout error and log the real cause against a short
 * reference the customer is also shown, so a phone call can be traced to the
 * exact request. Card details are never in the error path, so nothing
 * sensitive is logged here.
 */
export function classifyFailure(err: unknown, context: Record<string, unknown> = {}): Failure & { reference: string } {
  const ne = err instanceof NectarError ? err : null
  const text = [ne?.message, ne?.code, typeof ne?.detail === 'string' ? ne.detail : JSON.stringify(ne?.detail ?? ''), err instanceof Error ? err.message : String(err)]
    .filter(Boolean)
    .join(' ')

  let kind: FailureKind = 'provider_error'
  if (ne?.code === 'ConfigMissing') kind = 'misconfigured'
  else {
    for (const { re, kind: k } of PATTERNS) {
      if (re.test(text)) { kind = k; break }
    }
    // A provider 5xx with nothing quotable is still ours to own, not the card's.
    if (kind === 'provider_error' && ne && ne.status >= 500) kind = 'provider_error'
  }

  const reference = (ne?.requestId ?? '').slice(0, 8) || Math.random().toString(36).slice(2, 10)
  console.error('[checkout] rental failed', {
    reference,
    kind,
    providerStatus: ne?.status,
    providerCode: ne?.code,
    providerMessage: ne?.message,
    providerDetail: ne?.detail,
    ...context,
  })
  return {
    ...COPY[kind],
    kind,
    reference,
    providerMessage: ne?.message ?? (err instanceof Error ? err.message : undefined),
    providerStatus: ne?.status,
  }
}
