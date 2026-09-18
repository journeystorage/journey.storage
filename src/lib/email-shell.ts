// ---------------------------------------------------------------------------
// The one branded email layout, shared by every system that sends mail.
//
// Values come from Brand Guide v2.0 (June 2026) — NOT the repo's stale
// BRAND_GUIDELINES.md. The rules that bite in email:
//   · Orange is #FF6320. On an orange fill, text is #181818 — never white
//     (white on orange is 2.97:1 and fails). Orange type on a light ground
//     fails too, so orange-family type uses Blaze 700 #B34516.
//   · Cold #FFFFFF is never a Journey background; the ground is Warm White.
//   · Lato is logo artwork only. Body is Work Sans, display is Barlow
//     Condensed, and the ONLY fallback is Montserrat — never Arial/Helvetica,
//     never a serif.
//   · The wordmark is locked artwork and always carries the ™. It is shipped
//     as PNG because no mail client renders SVG reliably.
// ---------------------------------------------------------------------------

export const BRAND = {
  orange: '#FF6320',
  /** Orange-family type on a light ground (4.90:1). Plain orange fails. */
  orange700: '#B34516',
  black: '#181818',
  charcoal: '#3A3835',
  stone: '#888680',
  warmWhite: '#F5F0E8',
  terracotta: '#C97B5A',
  sage: '#7AAF6E',
} as const

/** What recipients see as the sender. */
export const SENDER_NAME = 'JOURNEY.STORAGE™'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://journey.storage').replace(/\/$/, '')
const WORDMARK = `${SITE}/images/brand/email-wordmark-white.png`

/** Work Sans with the only sanctioned fallback. */
const BODY_FONT = "'Work Sans',Montserrat,sans-serif"
/** Barlow Condensed for display; Montserrat carries it where it can't load. */
const DISPLAY_FONT = "'Barlow Condensed','Work Sans',Montserrat,sans-serif"

/**
 * Re-label any sender address with the brand name, so a recipient always sees
 * JOURNEY.STORAGE™ however the env var is written. The address is preserved —
 * it has to stay on a domain verified with Resend or nothing is delivered.
 */
export function brandedFrom(raw: string | undefined, fallbackAddress = 'onboarding@resend.dev'): string {
  const address = (raw?.match(/<([^>]+)>/)?.[1] ?? (raw?.includes('@') ? raw : '') ?? '').trim() || fallbackAddress
  return `${encodeDisplayName(SENDER_NAME)} <${address}>`
}

/**
 * A display name safe for a mail header. The ™ is non-ASCII, and a raw
 * high-byte display name is rejected by some senders, so encode it as an
 * RFC 2047 encoded-word — which mail clients decode back to JOURNEY.STORAGE™.
 * Pure-ASCII names are just quoted.
 */
function encodeDisplayName(name: string): string {
  // eslint-disable-next-line no-control-regex
  if (!/[^\x00-\x7F]/.test(name)) return `"${name}"`
  return `=?UTF-8?B?${Buffer.from(name, 'utf8').toString('base64')}?=`
}

export interface ShellOptions {
  /** Inbox preview line. Kept out of the visible body. */
  preheader: string
  /** Small uppercase label above the heading. */
  eyebrow?: string
  heading: string
  /** Body markup — use `p()`, `panel()`, `rows()` below so styling stays inline. */
  bodyHtml: string
  cta?: { label: string; href: string }
  /** Quiet line above the footer rule. */
  footNote?: string
  /** Hide the "Space to move on." slogan on transactional utility mail. */
  slogan?: boolean
}

/** A body paragraph. */
export const p = (html: string, opts: { muted?: boolean; small?: boolean } = {}) =>
  `<p style="margin:0 0 14px;font-family:${BODY_FONT};font-weight:400;font-size:${opts.small ? '13px' : '15px'};line-height:1.65;color:${opts.muted ? BRAND.charcoal : BRAND.black}">${html}</p>`

/** An uppercase label. */
export const label = (text: string) =>
  `<p style="margin:0 0 6px;font-family:${BODY_FONT};font-weight:600;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:${BRAND.stone}">${text}</p>`

/** A bordered panel for figures a reader will look for. */
export const panel = (inner: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 18px;border:1px solid rgba(24,24,24,0.12);background:#FFFFFF"><tr><td style="padding:18px 20px">${inner}</td></tr></table>`

/** Label/value rows, right-aligned values, for amounts and dates. */
export const rows = (items: Array<[string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family:${BODY_FONT}">${items
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:${i ? '8px' : '0'} 0 0;font-size:13px;font-weight:400;color:${BRAND.charcoal}">${k}</td>` +
        `<td align="right" style="padding:${i ? '8px' : '0'} 0 0;font-size:13px;font-weight:600;color:${BRAND.black}">${v}</td></tr>`,
    )
    .join('')}</table>`

/** Wrap body content in the branded frame. */
export function emailShell(o: ShellOptions): string {
  const cta = o.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 6px"><tr>` +
      // Dark text on the orange fill — white would fail contrast.
      `<td style="background:${BRAND.orange}"><a href="${o.cta.href}" style="display:inline-block;padding:13px 26px;font-family:${BODY_FONT};font-weight:600;font-size:14px;letter-spacing:.3px;color:${BRAND.black};text-decoration:none">${o.cta.label} &rarr;</a></td>` +
      `</tr></table>`
    : ''

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${o.heading}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Work+Sans:ital,wght@0,400;0,600;1,300&display=swap">
</head>
<body style="margin:0;padding:0;background:${BRAND.warmWhite};-webkit-font-smoothing:antialiased">
<div style="display:none;font-size:1px;color:${BRAND.warmWhite};max-height:0;overflow:hidden">${o.preheader}</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND.warmWhite}">
  <tr><td align="center" style="padding:28px 16px 40px">
    <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px">

      <!-- Dark colourway: the preferred lockup. The wordmark artwork carries
           the J mark and the trademark. -->
      <tr><td style="background:${BRAND.black};padding:22px 28px">
        <img src="${WORDMARK}" alt="${SENDER_NAME}" width="196" height="14"
             style="display:block;width:196px;height:auto;border:0;outline:none;text-decoration:none">
      </td></tr>
      <tr><td style="background:${BRAND.orange};font-size:0;line-height:0;height:3px">&nbsp;</td></tr>

      <tr><td style="background:${BRAND.warmWhite};padding:30px 28px 26px">
        ${o.eyebrow ? label(o.eyebrow) : ''}
        <h1 style="margin:0 0 16px;font-family:${DISPLAY_FONT};font-weight:700;font-size:28px;line-height:1.15;letter-spacing:-0.01em;color:${BRAND.black}">${o.heading}</h1>
        ${o.bodyHtml}
        ${cta}
      </td></tr>

      <tr><td style="padding:0 28px">
        <div style="height:1px;background:rgba(24,24,24,0.12);font-size:0;line-height:0">&nbsp;</div>
      </td></tr>
      <tr><td style="padding:18px 28px 0">
        ${o.footNote ? `<p style="margin:0 0 10px;font-family:${BODY_FONT};font-weight:400;font-size:12px;line-height:1.6;color:${BRAND.charcoal}">${o.footNote}</p>` : ''}
        ${o.slogan === false ? '' : `<p style="margin:0 0 8px;font-family:${BODY_FONT};font-weight:300;font-style:italic;font-size:14px;color:${BRAND.stone}">Space to move on.</p>`}
        <p style="margin:0;font-family:${BODY_FONT};font-weight:400;font-size:11px;line-height:1.7;color:${BRAND.stone}">
          ${SENDER_NAME} &middot; Granbury, TX &middot; <a href="tel:+18175790607" style="color:${BRAND.orange700};text-decoration:none">(817) 579-0607</a><br>
          <a href="${SITE}" style="color:${BRAND.orange700};text-decoration:none">journey.storage</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`
}

// ---------------------------------------------------------------------------
// Blocks for operational mail, where the job is to be scanned rather than read.
// Figures are set in tabular numerals and right-aligned so columns line up, and
// each block leads with the number that decides whether to act.
// ---------------------------------------------------------------------------

/** A single headline figure with its label underneath. */
export const stat = (value: string, label: string, tone: 'normal' | 'alert' | 'good' = 'normal') => {
  const colour = tone === 'alert' ? BRAND.orange700 : tone === 'good' ? '#4E7A44' : BRAND.black
  return `<td style="padding:0 8px 0 0;vertical-align:top">
    <div style="font-family:${DISPLAY_FONT};font-weight:700;font-size:26px;line-height:1.1;font-variant-numeric:tabular-nums;color:${colour}">${value}</div>
    <div style="margin-top:3px;font-family:${BODY_FONT};font-weight:600;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.stone}">${label}</div>
  </td>`
}

/** A row of stats — pass the cells from `stat()`. */
export const statBand = (cells: string[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 22px;border-top:2px solid ${BRAND.black};padding-top:14px"><tr>${cells.join('')}</tr></table>`

/** Section heading with a rule, so blocks are separable at a glance. */
export const section = (title: string, count?: number) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:26px 0 10px">
    <tr>
      <td style="font-family:${BODY_FONT};font-weight:600;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.black};white-space:nowrap;padding-right:10px">${title}${count != null ? ` <span style="color:${BRAND.stone}">(${count})</span>` : ''}</td>
      <td style="width:100%"><div style="height:1px;background:rgba(24,24,24,0.15);font-size:0;line-height:0">&nbsp;</div></td>
    </tr>
  </table>`

export interface EmailRow {
  who: string
  where?: string
  amount?: string
  note?: string
  contact?: string
  severe?: boolean
}

/**
 * The workhorse: one line per person, money right-aligned, the ones that need
 * attention first marked with a coloured rule rather than a shouty background.
 */
export const dataTable = (rows: EmailRow[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
    ${rows
      .map(
        (r) => `<tr>
      <td style="padding:9px 10px 9px ${r.severe ? '10px' : '11px'};border-bottom:1px solid rgba(24,24,24,0.08);${r.severe ? `border-left:3px solid ${BRAND.orange};` : `border-left:1px solid rgba(24,24,24,0.10);`}">
        <div style="font-family:${BODY_FONT};font-weight:600;font-size:14px;color:${BRAND.black}">${r.who}</div>
        ${r.where ? `<div style="font-family:${BODY_FONT};font-weight:400;font-size:12px;color:${BRAND.charcoal}">${r.where}</div>` : ''}
        ${r.note ? `<div style="font-family:${BODY_FONT};font-weight:400;font-size:11px;color:${BRAND.stone}">${r.note}</div>` : ''}
        ${r.contact ? `<div style="font-family:${BODY_FONT};font-weight:400;font-size:11px;color:${BRAND.stone}">${r.contact}</div>` : ''}
      </td>
      <td align="right" style="padding:9px 0 9px 10px;border-bottom:1px solid rgba(24,24,24,0.08);white-space:nowrap;vertical-align:top">
        ${r.amount ? `<span style="font-family:${BODY_FONT};font-weight:600;font-size:15px;font-variant-numeric:tabular-nums;color:${BRAND.black}">${r.amount}</span>` : ''}
      </td>
    </tr>`,
      )
      .join('')}
  </table>`

/** What to do, set apart from the data. */
export const callout = (text: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:12px 0 0"><tr>
    <td style="padding:11px 14px;background:rgba(255,99,32,0.08);border-left:3px solid ${BRAND.orange}">
      <div style="font-family:${BODY_FONT};font-weight:500;font-size:13px;line-height:1.55;color:${BRAND.black}">${text}</div>
    </td>
  </tr></table>`

/** A compact two-column list, for availability and similar. */
export const miniList = (items: Array<[string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${items
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;font-family:${BODY_FONT};font-size:13px;color:${BRAND.charcoal};border-bottom:1px solid rgba(24,24,24,0.06)">${k}</td>
         <td align="right" style="padding:6px 0;font-family:${BODY_FONT};font-weight:600;font-size:13px;font-variant-numeric:tabular-nums;color:${BRAND.black};border-bottom:1px solid rgba(24,24,24,0.06)">${v}</td></tr>`,
    )
    .join('')}</table>`
