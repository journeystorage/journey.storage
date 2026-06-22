// Best-effort email notification for new advisory leads.
//
// Sends an email via the Resend REST API (no SDK dependency — just fetch) so
// the team is notified the moment someone submits the Contact Us form on
// advisory.journey.storage. Fire-and-forget: the lead is already persisted to
// Supabase before this runs, so a failure here must never break the response.
//
// Required env (set in the Hostinger dashboard for the ADVISORY instance):
//   RESEND_API_KEY     – your Resend API key
// Optional env:
//   LEAD_NOTIFY_TO     – recipient (default: lyvia@journey.storage)
//   LEAD_NOTIFY_FROM   – sender (default: onboarding@resend.dev until
//                        journey.storage is verified in Resend)

export type LeadNotification = {
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
  formSource: string
}

const DEFAULT_TO = 'lyvia@journey.storage'
const DEFAULT_FROM = 'Journey.Advisory <onboarding@resend.dev>'

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

  const to = process.env.LEAD_NOTIFY_TO || DEFAULT_TO
  const from = process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM

  const subject = `New Advisory contact — ${lead.name}`

  const html = `<div style="max-width:560px;margin:0 auto;padding:24px;background:#fff">
    <p style="margin:0 0 4px;color:#e0531f;font:700 12px/1.4 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase">New advisory contact</p>
    <h1 style="margin:0 0 20px;color:#111;font:800 22px/1.3 system-ui,sans-serif">${escapeHtml(lead.name)}</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row('Email', lead.email)}
      ${row('Phone', lead.phone)}
      ${row('Company', lead.company)}
      ${row('Message', lead.message)}
      ${row('Source', lead.formSource)}
    </table>
  </div>`

  const text = [
    `New Advisory contact`,
    ``,
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    lead.phone ? `Phone:   ${lead.phone}` : '',
    lead.company ? `Company: ${lead.company}` : '',
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
