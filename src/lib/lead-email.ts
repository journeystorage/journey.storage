// Best-effort email notification for new leads.
//
// Sends an email via the Resend REST API (no SDK dependency — just fetch) so
// the team is notified the moment someone submits the Contact Us form. This is
// intentionally fire-and-forget: the lead is already persisted to Supabase
// before this runs, so a failure here must never break the form response.
//
// Required env (set in the Hostinger dashboard for the main site):
//   RESEND_API_KEY     – your Resend API key
// Optional env:
//   LEAD_NOTIFY_TO     – recipient (default: lyvia@journey.storage)
//   LEAD_NOTIFY_FROM   – sender (default: onboarding@resend.dev, which works
//                        without domain verification while you get set up;
//                        switch to e.g. "Journey Storage <notify@journey.storage>"
//                        once journey.storage is verified in Resend)

export type LeadNotification = {
  name: string
  email: string
  zip?: string
  phone?: string
  message?: string
  formSource: string
  /** Override recipient (e.g. per-property move-out routing). Falls back to LEAD_NOTIFY_TO. */
  to?: string
  /** Copy these address(es) on the notification (e.g. always keep an oversight inbox in the loop). */
  cc?: string | string[]
  /** Overrides the email subject line when set. */
  subject?: string
}

const DEFAULT_TO = 'lyvia@journey.storage'
const DEFAULT_FROM = 'Journey.Storage <onboarding@resend.dev>'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value?: string): string {
  if (!value) return ''
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#6b6b6b;font:600 13px/1.5 system-ui,sans-serif;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:6px 0;color:#111;font:400 14px/1.6 system-ui,sans-serif">${escapeHtml(value)}</td>
  </tr>`
}

export async function sendLeadNotification(lead: LeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Not configured yet — skip silently so the form keeps working.
    console.warn('[lead-email] RESEND_API_KEY not set; skipping email notification')
    return
  }

  const from = process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM
  const ownerInbox = process.env.LEAD_NOTIFY_TO || DEFAULT_TO

  // Resend only delivers to the account-owner inbox (lyvia@) until
  // journey.storage is a VERIFIED sending domain. While the sender is still a
  // resend.dev address, sending to any other recipient makes Resend reject the
  // whole message — so collapse every notification to the owner inbox (the
  // facility still shows in the subject). Per-recipient routing (lead.to) and
  // the support@ cc auto-activate the moment LEAD_NOTIFY_FROM is a verified
  // @journey.storage sender.
  const verifiedSender = !/@resend\.dev/i.test(from)
  const to = verifiedSender ? (lead.to || ownerInbox) : ownerInbox

  // support@ is copied on every lead notification (all forms), plus any
  // per-call cc (e.g. lyvia@ on move-out). Dedupe, and never cc the primary
  // recipient. LEAD_NOTIFY_ALWAYS_CC (comma-separated) overrides the default.
  const alwaysCc = (process.env.LEAD_NOTIFY_ALWAYS_CC ?? 'support@journey.storage')
    .split(',').map((s) => s.trim()).filter(Boolean)
  const perCallCc = Array.isArray(lead.cc) ? lead.cc : lead.cc ? [lead.cc] : []
  const cc = verifiedSender
    ? [...alwaysCc, ...perCallCc]
        .filter((addr) => addr && addr.toLowerCase() !== to.toLowerCase())
        .filter((addr, i, arr) => arr.findIndex((a) => a.toLowerCase() === addr.toLowerCase()) === i)
    : []

  const isMoveout = lead.formSource.includes('moveout')
  const subject = lead.subject || `New Contact Us submission — ${lead.name}`
  const eyebrow = isMoveout ? 'Move-out request' : 'New contact'

  const html = `<div style="max-width:560px;margin:0 auto;padding:24px;background:#fff">
    <p style="margin:0 0 4px;color:#e0531f;font:700 12px/1.4 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase">${eyebrow}</p>
    <h1 style="margin:0 0 20px;color:#111;font:800 22px/1.3 system-ui,sans-serif">${escapeHtml(lead.name)}</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row('Email', lead.email)}
      ${row('Phone', lead.phone)}
      ${row('ZIP', lead.zip)}
      ${row('Message', lead.message)}
      ${row('Source', lead.formSource)}
    </table>
  </div>`

  const text = [
    `New Contact Us submission`,
    ``,
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    lead.phone ? `Phone:   ${lead.phone}` : '',
    lead.zip ? `ZIP:     ${lead.zip}` : '',
    lead.message ? `Message: ${lead.message}` : '',
    `Source:  ${lead.formSource}`,
  ]
    .filter(Boolean)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      ...(cc.length ? { cc } : {}),
      subject,
      html,
      text,
      reply_to: lead.email,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend responded ${res.status}: ${detail}`)
  }
}
