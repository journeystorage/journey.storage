// Move-in confirmation email for completed online rentals.
//
// Sent via the Resend REST API (same fetch-only pattern as lead-email.ts)
// right after completeRental succeeds. Fire-and-forget: the lease is already
// committed and charged upstream, so a failure here must never break the
// rental response.
//
// Deliverability gate (mirrors lead-email.ts): until journey.storage is a
// verified sending domain in Resend, mail from a @resend.dev sender only
// delivers to the account-owner inbox — so the tenant copy collapses to the
// owner inbox (still useful: it's an instant move-in notification). The moment
// MOVE_IN_EMAIL_FROM (or LEAD_NOTIFY_FROM) is a verified @journey.storage
// sender, tenants get the email directly and the owner inbox is bcc'd.
//
// Env:
//   MOVE_IN_EMAIL_LIVE     – must be "true" before a tenant ever receives this.
//                            Unset (the default) sends the owner a copy marked
//                            "[not sent to tenant …]" instead, so the wording
//                            can be reviewed without mailing a customer.
//   MOVE_IN_EMAIL_DISABLED – set to "true" to stop sending entirely (use this
//                            once Tenant Inc's own move-in email is branded,
//                            so tenants don't get two confirmations)
//   RESEND_API_KEY       – required to send anything
//   MOVE_IN_EMAIL_FROM   – sender (falls back to LEAD_NOTIFY_FROM, then resend.dev)
//   MOVE_IN_NOTIFY_TO    – internal copy recipient (default: lyvia@journey.storage)

import { brandedFrom, emailShell, p, section, miniList, rows, panel, pills, steps, link, heroFigure, callout } from './email-shell'

const OWNER_INBOX = 'lyvia@journey.storage'
const DEFAULT_FROM = 'Journey.Storage <onboarding@resend.dev>'
const SITE = 'https://journey.storage'
const PHONE_DISPLAY = '(817) 579-0607'
const PHONE_TEL = 'tel:+18175790607'

// Display details per facility slug. Kept here (not facilities.ts) because that
// module is Nectar API config; these are brand-facing strings for the email.
const FACILITY_DISPLAY: Record<string, { name: string; address: string }> = {
  templehallhwy: { name: 'Temple Hall Hwy', address: '212 Temple Hall Hwy, Granbury, TX 76049' },
  westernhillstrl: { name: 'Western Hills Trl', address: '409 Western Hills Trail, Granbury, TX 76049' },
  mccrearyrd: { name: 'McCreary Rd', address: '3501 McCreary Rd, Granbury, TX 76049' },
}

export interface MoveInEmailData {
  facilitySlug: string
  tenantFirst: string
  tenantEmail: string
  /** e.g. "10 × 10 · Climate Controlled" (client-supplied label, escaped before render) */
  spaceLabel?: string
  unitNumber?: string | null
  /** YYYY-MM-DD */
  startDate: string
  billDay: number
  lineItems: Array<{ name: string; amount: number }>
  totalDue: number
  signed: boolean
  documentUrl?: string | null
  /**
   * Whether the tenant asked for autopay. It cannot be enabled through Tenant
   * Inc's API, so this is a request for staff — the email must not claim it is
   * already running.
   */
  autopayRequested?: boolean
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function money(n: number): string {
  const abs = Math.abs(n).toFixed(2)
  return `${n < 0 ? '−' : ''}$${abs}`
}

function ordinal(n: number): string {
  const rem10 = n % 10
  const rem100 = n % 100
  if (rem10 === 1 && rem100 !== 11) return `${n}st`
  if (rem10 === 2 && rem100 !== 12) return `${n}nd`
  if (rem10 === 3 && rem100 !== 13) return `${n}rd`
  return `${n}th`
}

function longDate(ymd: string): string {
  const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ymd
  // Construct in local time so the date never shifts across the UTC boundary.
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// ── Render ──────────────────────────────────────────────────────────────────
// Table-based markup with fully inline styles: Gmail clips <style> blocks and
// Outlook ignores most non-inline CSS, so the mockup's classes are translated
// property-for-property onto the elements.

// Presentation lives in ./email-shell — this file only decides content.

export function renderMoveInEmail(data: MoveInEmailData): { subject: string; html: string } {
  const fac = FACILITY_DISPLAY[data.facilitySlug] ?? { name: data.facilitySlug, address: 'Granbury, TX' }
  const first = esc(data.tenantFirst.trim() || 'there')
  const spaceLabel = data.spaceLabel ? esc(data.spaceLabel.slice(0, 80)) : 'Self storage space'
  const unit = data.unitNumber ? esc(String(data.unitNumber).slice(0, 20)) : ''
  const docUrl = data.documentUrl && /^https:\/\//.test(data.documentUrl) ? data.documentUrl : ''

  // Access is the thing they need first, so the subject leads with it.
  const subject = 'You’re all moved in — here’s how to get in'

  // The receipt, with the total set apart under a rule.
  const receipt = panel(
    rows(data.lineItems.map((li) => [esc(li.name.slice(0, 80)), money(li.amount)] as [string, string])) +
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-top:1px solid rgba(34,34,34,0.12)"><tr>
      <td style="padding-top:14px;font-family:'Lato',system-ui,-apple-system,'Segoe UI',sans-serif;font-weight:800;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#222222">Paid today</td>
      <td align="right" style="padding-top:14px;font-family:'Lato',system-ui,-apple-system,'Segoe UI',sans-serif;font-weight:800;font-size:24px;font-variant-numeric:tabular-nums;color:#222222">${money(data.totalDue)}</td>
    </tr></table>` +
    pills([
      ...(data.signed ? ['Lease signed'] : []),
      'Payment received',
      ...(data.autopayRequested ? ['Autopay requested'] : []),
    ]),
  )

  const nextLeaseLine = docUrl
    ? `Your signed rental agreement is ready — ${link(docUrl, 'download it here (PDF)')}.`
    : 'Your signed rental agreement is on file — call us any time for a copy.'

  const html = emailShell({
    preheader: 'Your phone is your key — set it up before your first visit.',
    eyebrow: 'Move-in confirmed',
    heading: `You’re all <b>moved in, ${first}</b>`,
    // The unit number is what they need on day one.
    highlight: unit ? heroFigure(`Unit ${unit}`, 'Your space', `${spaceLabel} · ${esc(fac.address)}`) : undefined,
    bodyHtml:
      p(`Your space at ${esc(fac.name)} is rented and ready. Everything you need is right here.`) +
      section('Your rental') +
      miniList([
        ['Facility', `${esc(fac.name)}<br><span style="font-weight:400;font-size:12px;color:#615C53">${esc(fac.address)}</span>`],
        ['Space', `${spaceLabel}${unit ? `<br><span style="font-weight:400;font-size:12px;color:#615C53">Unit ${unit}</span>` : ''}`],
        ['Move-in date', esc(longDate(data.startDate))],
        [
          'Billing',
          `Bills the ${ordinal(data.billDay)} each month<br><span style="font-weight:400;font-size:12px;color:#615C53">${
            data.autopayRequested ? 'Autopay requested · we’ll confirm by email' : 'Month-to-month · cancel anytime'
          }</span>`,
        ],
      ]) +
      section('Getting in') +
      p('Your gate and your unit both open from one free app — there are no keys to collect and no keypad code. Do this before your first visit.') +
      steps([
        [
          'Find the text message we sent you',
          'It arrives automatically once your space is set up and holds the two things you need: a download link and a 6-digit PIN. Keep it until you’re logged in.',
        ],
        [
          'Download the app',
          `Search your app store for “Storage Smart Entry”, or go straight to ${link('https://noke.app', 'noke.app')}. It’s free, on iPhone and Android.`,
        ],
        [
          'Log in, then pick your own password',
          'Your username is your cell number and your password is the 6-digit PIN from the text. The app will ask you to choose a password of at least 8 characters.',
        ],
        [
          'Allow Bluetooth when it asks',
          'On Android, allow Location too. That’s how your phone finds the lock when you walk up to it — it isn’t used to track where you are.',
        ],
      ]) +
      callout(
        'If you tap “Don’t Allow”, nothing will open — no Bluetooth means no gate and no unit. Already tapped it? Open your phone’s Settings, find Storage Smart Entry, and switch Bluetooth (and Location on Android) back on.',
        'Important',
      ) +
      p(`Full guide with photos, including what to do at the gate and at your door: ${link(`${SITE}/smartentry`, 'journey.storage/smartentry')}.`, { small: true }) +
      section('Receipt') +
      receipt +
      section('Also good to know') +
      p(`View payments, update your card or move out from ${link(`${SITE}/rentaspace`, 'journey.storage')} — no phone call needed.`) +
      p(nextLeaseLine),
    cta: { label: 'Set up Smart Entry', href: `${SITE}/smartentry` },
    footNote: `Questions? Call us at ${link(PHONE_TEL, PHONE_DISPLAY)}.`,
    legal:
      'Clean, secure, month-to-month self storage in Granbury, TX · 212 Temple Hall Hwy · 409 Western Hills Trl · 3501 McCreary Rd.<br>' +
      `Formerly Granbury Self Storage · You received this because you rented a space online.<br>© ${new Date().getFullYear()} Journey Storage 001, LLC`,
  })

  return { subject, html }
}

export async function sendMoveInConfirmation(data: MoveInEmailData): Promise<void> {
  if (process.env.MOVE_IN_EMAIL_DISABLED === 'true') return
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[move-in-email] RESEND_API_KEY not set; skipping confirmation email')
    return
  }

  const from = brandedFrom(process.env.MOVE_IN_EMAIL_FROM || process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM)
  const ownerInbox = process.env.MOVE_IN_NOTIFY_TO || OWNER_INBOX
  const verifiedSender = !/@resend\.dev/i.test(from)

  const { subject, html } = renderMoveInEmail(data)

  // Reaching the tenant needs BOTH a verified sender and MOVE_IN_EMAIL_LIVE
  // set explicitly. Default is owner-only: a confirmation going to a customer
  // is not something to switch on by side effect, and until the wording has
  // been signed off it should land nowhere but the owner's inbox.
  //
  // Unverified sender is the other reason to hold it back — Resend rejects
  // mail to anyone but the account owner, so the tenant would get nothing.
  const liveToTenants = process.env.MOVE_IN_EMAIL_LIVE === 'true'
  const sendToTenant = verifiedSender && liveToTenants
  const to = sendToTenant ? data.tenantEmail : ownerInbox
  const bcc = sendToTenant ? [ownerInbox] : undefined
  const finalSubject = sendToTenant
    ? subject
    : `[not sent to tenant ${data.tenantEmail}] ${subject}`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, ...(bcc ? { bcc } : {}), subject: finalSubject, html }),
    })
    if (!res.ok) {
      console.error('[move-in-email] Resend rejected the message', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.error('[move-in-email] send failed', err)
  }
}
