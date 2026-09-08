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
//   MOVE_IN_EMAIL_DISABLED – set to "true" to stop sending entirely (use this
//                            once Tenant Inc's own move-in email is branded,
//                            so tenants don't get two confirmations)
//   RESEND_API_KEY       – required to send anything
//   MOVE_IN_EMAIL_FROM   – sender (falls back to LEAD_NOTIFY_FROM, then resend.dev)
//   MOVE_IN_NOTIFY_TO    – internal copy recipient (default: lyvia@journey.storage)

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
  gatePin?: string | null
  signed: boolean
  documentUrl?: string | null
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

const FONT = "'Lato',-apple-system,'Segoe UI',Arial,sans-serif"
const INK = '#181818'
const ORANGE = '#E8622A'
const WARM = '#F5F0E8'
const STONE = '#8A857B'
const LINE = '#ece7dd'
const MUTED = '#6f6a60'

const CHECK_SVG = (color: string, size: number) =>
  `<span style="color:${color};font-size:${size}px;font-weight:900;line-height:1">&#10003;</span>`

function eyebrow(label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px"><tr>
    <td style="width:26px;border-top:1px solid ${ORANGE};font-size:0;line-height:0">&nbsp;</td>
    <td style="padding-left:10px;font-family:${FONT};font-size:11px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:${ORANGE}">${label}</td>
  </tr></table>`
}

function factRow(k: string, v: string, sub?: string, last = false): string {
  return `<tr>
    <td style="padding:13px 0;border-bottom:${last ? '0' : `1px solid ${LINE}`};font-family:${FONT};font-size:14.5px;color:${STONE};font-weight:700;width:42%;vertical-align:top">${k}</td>
    <td align="right" style="padding:13px 0;border-bottom:${last ? '0' : `1px solid ${LINE}`};font-family:${FONT};font-size:14.5px;color:${INK};font-weight:700;vertical-align:top">${v}${sub ? `<br><span style="color:${STONE};font-weight:400;font-size:12.5px">${sub}</span>` : ''}</td>
  </tr>`
}

function badge(label: string): string {
  return `<td style="padding:0 8px 8px 0"><span style="display:inline-block;background:rgba(122,175,110,.14);color:#4f7a46;border:1px solid rgba(122,175,110,.3);border-radius:6px;padding:6px 11px;font-family:${FONT};font-size:12.5px;font-weight:700">&#10003;&nbsp;&nbsp;${label}</span></td>`
}

function nextStep(n: number, title: string, detail: string, last = false): string {
  return `<tr>
    <td style="width:44px;padding:12px 0;border-bottom:${last ? '0' : '1px solid #f2eee6'};vertical-align:top">
      <span style="display:inline-block;width:30px;height:30px;border-radius:50%;background:rgba(232,98,42,.12);color:${ORANGE};font-family:${FONT};font-weight:900;font-size:14px;line-height:30px;text-align:center">${n}</span>
    </td>
    <td style="padding:12px 0;border-bottom:${last ? '0' : '1px solid #f2eee6'};vertical-align:top">
      <div style="font-family:${FONT};font-size:14.5px;font-weight:700;color:${INK};margin:3px 0 2px">${title}</div>
      <div style="font-family:${FONT};font-size:13px;line-height:1.55;color:${MUTED}">${detail}</div>
    </td>
  </tr>`
}

export function renderMoveInEmail(data: MoveInEmailData): { subject: string; html: string } {
  const fac = FACILITY_DISPLAY[data.facilitySlug] ?? { name: data.facilitySlug, address: 'Granbury, TX' }
  const first = esc(data.tenantFirst.trim() || 'there')
  const pin = data.gatePin?.trim() || ''
  const pinSpaced = esc(pin.split('').join(' '))
  const spaceLabel = data.spaceLabel ? esc(data.spaceLabel.slice(0, 80)) : 'Self storage space'
  const unit = data.unitNumber ? esc(String(data.unitNumber).slice(0, 20)) : ''
  const docUrl = data.documentUrl && /^https:\/\//.test(data.documentUrl) ? data.documentUrl : ''

  const subject = pin
    ? 'You’re all moved in — your gate code & receipt'
    : 'You’re all moved in — your receipt'

  const receiptRows = data.lineItems
    .map((li) => {
      const negative = li.amount < 0
      const color = negative ? '#5c8a52' : '#3A3835'
      const weight = negative ? 700 : 400
      return `<tr>
        <td style="padding:5px 0;font-family:${FONT};font-size:14px;color:${color};font-weight:${weight}">${esc(li.name.slice(0, 80))}</td>
        <td align="right" style="padding:5px 0;font-family:${FONT};font-size:14px;font-weight:700;color:${negative ? '#5c8a52' : INK}">${money(li.amount)}</td>
      </tr>`
    })
    .join('')

  const badges =
    (data.signed ? badge('Lease signed') : '') + badge('Payment received') + badge('Autopay enrolled')

  const gatePanel = pin
    ? `<tr><td style="padding:20px 32px 6px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#181818" style="background:${INK} radial-gradient(90% 130% at 100% 0%, rgba(232,98,42,.20), transparent 58%);border-radius:14px 4px 4px 4px"><tr><td style="padding:24px 26px">
          <div style="font-family:${FONT};font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#a49e93">&#128273;&nbsp; Your gate code</div>
          <div style="margin:8px 0 2px;font-family:${FONT};font-size:44px;font-weight:900;letter-spacing:.10em;color:${WARM};line-height:1">${pinSpaced}</div>
          <div style="font-family:${FONT};font-size:12.5px;color:#a49e93">24/7 access, every day of the year &middot; non-transferable</div>
        </td></tr></table>
      </td></tr>`
    : ''

  const steps = [
    ...(pin
      ? [
          nextStep(
            1,
            'Head over anytime',
            `Use gate code <strong style="color:${INK}">${esc(pin)}</strong> at the keypad for 24/7 access to your space.`,
          ),
        ]
      : []),
    nextStep(
      pin ? 2 : 1,
      'Manage everything online',
      `View payments, update your card, or move out from <a href="${SITE}/rentaspace" style="color:${ORANGE};font-weight:700;text-decoration:none">journey.storage</a> &mdash; no phone call needed.`,
    ),
    nextStep(
      pin ? 3 : 2,
      'Keep your lease handy',
      docUrl
        ? `Your signed rental agreement is ready &mdash; <a href="${docUrl}" style="color:${ORANGE};font-weight:700;text-decoration:none">download it here (PDF)</a>.`
        : `Your signed rental agreement is on file &mdash; call us any time for a copy.`,
      true,
    ),
  ].join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#e9e5dc">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e5dc"><tr><td align="center" style="padding:28px 16px 56px">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">

  <!-- masthead -->
  <tr><td bgcolor="#181818" style="background:${INK} radial-gradient(120% 160% at 100% -10%, rgba(232,98,42,.22), transparent 55%);padding:22px 32px">
    <span style="font-family:${FONT};font-weight:900;font-size:20px;letter-spacing:.02em;color:${WARM}"><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${ORANGE};margin-right:9px"></span>JOURNEY<span style="color:#b7b2a8;font-weight:700">.STORAGE</span><span style="font-size:10px;vertical-align:super;color:${STONE}">&trade;</span></span>
  </td></tr>

  <!-- hero -->
  <tr><td align="center" style="padding:40px 32px 8px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" style="width:60px;height:60px;border-radius:50%;background:rgba(122,175,110,.16)">${CHECK_SVG('#5c8a52', 28)}</td></tr></table>
    <h1 style="margin:18px 0 0;font-family:${FONT};font-size:30px;line-height:1.08;font-weight:900;letter-spacing:-.03em;color:${INK}">You&rsquo;re all moved in, ${first}!</h1>
    <p style="margin:12px auto 0;max-width:400px;font-family:${FONT};font-size:15px;line-height:1.65;color:${MUTED}">Your space at ${esc(fac.name)} is rented and ready. Everything you need is right here.</p>
  </td></tr>

  ${gatePanel}

  <!-- rental details -->
  <tr><td style="padding:26px 32px 6px">
    ${eyebrow('Your rental')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${factRow('Facility', esc(fac.name), esc(fac.address))}
      ${factRow('Space', spaceLabel, unit ? `Unit ${unit}` : undefined)}
      ${factRow('Move-in date', esc(longDate(data.startDate)))}
      ${factRow('Billing', `Autopay on &middot; bills the ${ordinal(data.billDay)}`, 'Month-to-month &middot; cancel anytime', true)}
    </table>
  </td></tr>

  <!-- receipt -->
  <tr><td style="padding:20px 32px 6px">
    ${eyebrow('Paid today')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WARM};border-radius:12px"><tr><td style="padding:20px 22px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${receiptRows}</table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;border-top:1px solid ${LINE}"><tr>
        <td style="padding-top:13px;font-family:${FONT};font-size:15px;font-weight:900;color:${INK}">Paid today</td>
        <td align="right" style="padding-top:13px;font-family:${FONT};font-size:22px;font-weight:900;color:${ORANGE}">${money(data.totalDue)}</td>
      </tr></table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr>${badges}</tr></table>
    </td></tr></table>
  </td></tr>

  <!-- what's next -->
  <tr><td style="padding:20px 32px 8px">
    ${eyebrow('What’s next')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table>
  </td></tr>

  <!-- CTA -->
  <tr><td align="center" style="padding:6px 32px 30px">
    <a href="${SITE}/rentaspace" style="display:inline-block;background:${ORANGE};color:#ffffff;text-decoration:none;font-family:${FONT};font-weight:900;font-size:15px;letter-spacing:.01em;padding:15px 34px;border-radius:6px">Manage my account</a>
    <p style="margin:14px 0 0;font-family:${FONT};font-size:13px;color:${STONE}">Questions? Call us at <a href="${PHONE_TEL}" style="color:${ORANGE};font-weight:700;text-decoration:none">${PHONE_DISPLAY}</a> &mdash; Mon&ndash;Fri 8:30&ndash;5, Sat 8:30&ndash;3.</p>
  </td></tr>

  <!-- footer -->
  <tr><td align="center" style="background:${INK};padding:30px 32px">
    <div style="font-family:${FONT};font-weight:900;font-size:15px;color:${WARM};letter-spacing:.02em"><span style="display:inline-block;width:7px;height:7px;border-radius:2px;background:${ORANGE};margin-right:7px"></span>JOURNEY.STORAGE&trade;</div>
    <p style="margin:10px auto 0;max-width:380px;font-family:${FONT};font-size:12.5px;line-height:1.6;color:#a49e93">Clean, secure, month-to-month self storage in Granbury, TX.<br>212 Temple Hall Hwy &middot; 409 Western Hills Trl &middot; 3501 McCreary Rd</p>
    <p style="margin:16px auto 0;font-family:${FONT};font-size:11.5px;line-height:1.6;color:#77726a">Formerly Granbury Self Storage &middot; You received this because you rented a space online.<br>&copy; ${new Date().getFullYear()} Journey Storage 001, LLC</p>
  </td></tr>

</table>

</td></tr></table>
</body>
</html>`

  return { subject, html }
}

// ── Send ────────────────────────────────────────────────────────────────────

export async function sendMoveInConfirmation(data: MoveInEmailData): Promise<void> {
  if (process.env.MOVE_IN_EMAIL_DISABLED === 'true') return
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[move-in-email] RESEND_API_KEY not set; skipping confirmation email')
    return
  }

  const from = process.env.MOVE_IN_EMAIL_FROM || process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM
  const ownerInbox = process.env.MOVE_IN_NOTIFY_TO || OWNER_INBOX
  const verifiedSender = !/@resend\.dev/i.test(from)

  const { subject, html } = renderMoveInEmail(data)

  // Unverified sender: Resend rejects mail to anyone but the account owner, so
  // deliver the owner-inbox copy only — flagged so it's obvious the tenant has
  // NOT received it yet.
  const to = verifiedSender ? data.tenantEmail : ownerInbox
  const bcc = verifiedSender ? [ownerInbox] : undefined
  const finalSubject = verifiedSender ? subject : `[not sent to tenant ${data.tenantEmail}] ${subject}`

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
