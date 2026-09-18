// ---------------------------------------------------------------------------
// The one branded email layout, shared by every system that sends mail.
//
// Built on BRAND_GUIDELINES.md v3.0, which covers email explicitly. What that
// means here, and the rules that are easy to break:
//
//   · Logos and brand colours are LOCKED. Orange is #E8622A. The wordmark is a
//     faithful PNG of public/images/brand/logo-white-TM.svg — never recoloured
//     or re-typeset. PNG only because no mail client renders SVG reliably.
//   · Lato only. Headings are uppercase with a Light 300 setup phrase and an
//     ExtraBold 800 payload on the same line; pass the payload wrapped in <b>.
//     Lato is self-hosted — Google cannot serve weight 800 and would silently
//     flatten every heading to 700.
//   · Orange is never text on a light ground (2.98:1 fails). On cream it is a
//     graphic element only. On dark it passes at 5.25:1.
//   · Full-bleed dark and cream bands, each separated by a hard 5px orange
//     rule. Dark bands carry the dot tile. Never two cream bands in a row.
//   · Orange carries one point of tension per composition, so emphasis inside
//     the cream band comes from weight and ink, not more orange.
//
// Mail clients vary: Apple Mail loads the web fonts and the dot texture;
// Gmail and Outlook fall back to the system stack and a flat dark ground.
// Both are deliberate fallbacks, not failures.
// ---------------------------------------------------------------------------

export const BRAND = {
  /** Journey Orange — locked. */
  orange: '#E8622A',
  black: '#181818',
  charcoal: '#3A3835',
  stone: '#888680',
  warmWhite: '#F5F0E8',
  sage: '#7AAF6E',
} as const

/** Band surfaces and their text colours, as the guide's Section Bands specify. */
const DARK = '#191919'
const CREAM = '#F9F5EE'
const ON_DARK = '#FFFCF8'
const ON_DARK_MUTED = '#CEC5B6'
const ON_CREAM = '#222222'
const ON_CREAM_MUTED = '#615C53'
const HAIRLINE = 'rgba(34,34,34,0.12)'

/** What recipients see as the sender. */
export const SENDER_NAME = 'JOURNEY.STORAGE™'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://journey.storage').replace(/\/$/, '')
// Logo, texture and fonts are hosted once, on journey.storage, and every app
// points there — the Managed and investor sites don't carry these files, so
// using their own SITE would break the images and fonts in their mail.
const ASSETS = (process.env.EMAIL_ASSET_URL || 'https://journey.storage').replace(/\/$/, '')
const WORDMARK = `${ASSETS}/images/brand/email-wordmark-white.png`
const DOTS = `${ASSETS}/images/brand/email-dot-tile.png`

/** The guide's stack — Lato, then the platform's own sans. */
const FONT = "'Lato',system-ui,-apple-system,'Segoe UI',sans-serif"

const FONT_FACES = [
  ['Lato-Light', 300, 'normal'],
  ['Lato-LightItalic', 300, 'italic'],
  ['Lato-Regular', 400, 'normal'],
  ['Lato-Bold', 700, 'normal'],
  ['Lato-Heavy', 800, 'normal'],
]
  .map(
    ([file, weight, style]) =>
      `@font-face{font-family:'Lato';src:url('${ASSETS}/fonts/lato/${file}.woff2') format('woff2');font-weight:${weight};font-style:${style};font-display:swap}`,
  )
  .join('')

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

// ── Text ───────────────────────────────────────────────────────────────────

/** A body paragraph on the cream band. */
export const p = (html: string, opts: { muted?: boolean; small?: boolean } = {}) =>
  `<p style="margin:0 0 14px;font-family:${FONT};font-weight:400;font-size:${opts.small ? '14px' : '16px'};line-height:1.45;color:${opts.muted ? ON_CREAM_MUTED : ON_CREAM}">${html}</p>`

/** The guide's Label tier: 800, uppercase, 0.12em. */
export const label = (text: string, onDark = false) =>
  `<p style="margin:0 0 6px;font-family:${FONT};font-weight:800;font-size:12px;line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:${onDark ? ON_DARK_MUTED : ON_CREAM_MUTED}">${text}</p>`

/**
 * The signature heading: uppercase, Light 300 setup + ExtraBold 800 payload.
 * Write it in sentence case with the payload in <b> — CSS does the uppercase,
 * so screen readers read words rather than letters. A heading with no <b>
 * (a tenant's name, say) is set entirely at 800.
 */
const heading = (html: string) => {
  const split = /<b>/i.test(html)
  const body = split ? html.replace(/<b>/gi, '<b style="font-weight:800">') : html
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 4px"><tr>
    <td width="5" style="width:5px;background:${BRAND.orange};font-size:0;line-height:0">&nbsp;</td>
    <td style="padding:2px 0 2px 27px;font-family:${FONT};font-weight:${split ? 300 : 800};font-size:34px;line-height:1.12;letter-spacing:-0.7px;text-transform:uppercase;color:${ON_DARK}" class="hd">${body}</td>
  </tr></table>`
}

// ── Blocks ─────────────────────────────────────────────────────────────────

/** A bordered panel on cream, for figures a reader will look for. */
export const panel = (inner: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 18px;border:1px solid ${HAIRLINE};border-radius:22px;background:#FFFCF8"><tr><td style="padding:20px 22px">${inner}</td></tr></table>`

/** Label/value rows, right-aligned values, for amounts and dates. */
export const rows = (items: Array<[string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family:${FONT}">${items
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:${i ? '9px' : '0'} 0 0;font-size:14px;font-weight:400;color:${ON_CREAM_MUTED}">${k}</td>` +
        `<td align="right" style="padding:${i ? '9px' : '0'} 0 0;font-size:14px;font-weight:700;color:${ON_CREAM}">${v}</td></tr>`,
    )
    .join('')}</table>`

/**
 * A headline figure, for the dark hero band. On dark, orange passes (5.25:1),
 * so an alarming figure may carry it — which is where the composition's one
 * point of orange tension belongs.
 */
export const stat = (value: string, labelText: string, tone: 'normal' | 'alert' | 'good' = 'normal') => {
  const colour = tone === 'alert' ? BRAND.orange : tone === 'good' ? BRAND.sage : ON_DARK
  return `<td style="padding:0 14px 0 0;vertical-align:top" class="st">
    <div style="font-family:${FONT};font-weight:800;font-size:32px;line-height:1.05;letter-spacing:-0.6px;font-variant-numeric:tabular-nums;color:${colour}">${value}</div>
    <div style="margin-top:6px;font-family:${FONT};font-weight:800;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${ON_DARK_MUTED}">${labelText}</div>
  </td>`
}

/** A row of stats — pass cells from `stat()`. Belongs in the hero's `highlight`. */
export const statBand = (cells: string[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:26px 0 0;border-top:1px solid rgba(255,252,248,0.14)"><tr><td style="padding-top:20px">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>${cells.join('')}</tr></table>
  </td></tr></table>`

/** Section heading on cream: a Label with a hairline running out to the edge. */
export const section = (title: string, count?: number) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:30px 0 10px">
    <tr>
      <td style="font-family:${FONT};font-weight:800;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${ON_CREAM};white-space:nowrap;padding-right:12px">${title}${count != null ? `<span style="font-weight:400;color:${ON_CREAM_MUTED}">&nbsp;&nbsp;${count}</span>` : ''}</td>
      <td style="width:100%"><div style="height:1px;background:${HAIRLINE};font-size:0;line-height:0">&nbsp;</div></td>
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
 * One line per person, money right-aligned in tabular figures, names flush
 * with the column. Rows that need attention first carry a heavier amount —
 * emphasis by weight, not by more orange — and callers sort worst-first.
 */
export const dataTable = (rowsIn: EmailRow[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
    ${rowsIn
      .map(
        (r) => `<tr>
      <td style="padding:12px 12px 12px 0;border-bottom:1px solid ${HAIRLINE}">
        <div style="font-family:${FONT};font-weight:700;font-size:15px;line-height:1.3;color:${ON_CREAM}">${r.who}</div>
        ${r.where ? `<div style="font-family:${FONT};font-weight:400;font-size:13px;line-height:1.4;color:${ON_CREAM_MUTED}">${r.where}</div>` : ''}
        ${r.note ? `<div style="font-family:${FONT};font-weight:400;font-size:12px;line-height:1.4;color:${ON_CREAM_MUTED}">${r.note}</div>` : ''}
        ${r.contact ? `<div style="font-family:${FONT};font-weight:400;font-size:12px;line-height:1.4;color:${ON_CREAM_MUTED}">${r.contact}</div>` : ''}
      </td>
      <td align="right" style="padding:12px 0 12px 12px;border-bottom:1px solid ${HAIRLINE};white-space:nowrap;vertical-align:top">
        ${r.amount ? `<span style="font-family:${FONT};font-weight:${r.severe ? 800 : 700};font-size:16px;font-variant-numeric:tabular-nums;color:${ON_CREAM}">${r.amount}</span>` : ''}
      </td>
    </tr>`,
      )
      .join('')}
  </table>`

/**
 * What to do, set apart as an inverted panel. Dark ink on cream draws the eye
 * harder than an orange tint would, and keeps orange to one point of tension.
 */
export const callout = (text: string, title = 'What to do') =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:18px 0 0"><tr>
    <td style="padding:16px 20px;background:${BRAND.black};border-radius:22px">
      <div style="margin:0 0 4px;font-family:${FONT};font-weight:800;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${ON_DARK_MUTED}">${title}</div>
      <div style="font-family:${FONT};font-weight:400;font-size:15px;line-height:1.45;color:${ON_DARK}">${text}</div>
    </td>
  </tr></table>`

/** A compact two-column list, for availability and similar. */
export const miniList = (items: Array<[string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${items
    .map(
      ([k, v]) =>
        `<tr><td style="padding:9px 0;font-family:${FONT};font-size:14px;color:${ON_CREAM_MUTED};border-bottom:1px solid ${HAIRLINE}">${k}</td>
         <td align="right" style="padding:9px 0 9px 12px;font-family:${FONT};font-weight:700;font-size:14px;font-variant-numeric:tabular-nums;color:${ON_CREAM};border-bottom:1px solid ${HAIRLINE}">${v}</td></tr>`,
    )
    .join('')}</table>`

// ── Frame ──────────────────────────────────────────────────────────────────

export interface ShellOptions {
  /** Inbox preview line. Kept out of the visible body. */
  preheader: string
  /** Small uppercase label above the heading. */
  eyebrow?: string
  /** Sentence case, payload in <b>: "Rentals that <b>never collected</b>". */
  heading: string
  /** Optional dark-band content under the heading — headline figures. */
  highlight?: string
  /** Cream-band body — use p(), panel(), rows() and the blocks above. */
  bodyHtml: string
  cta?: { label: string; href: string }
  /** Quiet line at the foot of the cream band. */
  footNote?: string
  /** Hide the slogan on transactional utility mail. */
  slogan?: boolean
  /** Small print in the footer — addresses, why they got this, the entity. */
  legal?: string
}

/** A full-bleed band: the colour runs edge to edge, content holds at 600px. */
const band = (bg: string, inner: string, opts: { dots?: boolean; pad?: string } = {}) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${bg}${opts.dots ? ` url('${DOTS}') repeat` : ''}" bgcolor="${bg}"><tr><td align="center" style="padding:${opts.pad ?? '0'}">
    <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="w" style="width:100%;max-width:600px"><tr><td>${inner}</td></tr></table>
  </td></tr></table>`

/** The hard 5px orange rule between bands. */
const rule = () =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td height="5" style="height:5px;background:${BRAND.orange};font-size:0;line-height:0" bgcolor="${BRAND.orange}">&nbsp;</td></tr></table>`

/** Wrap content in the branded frame: dark hero / orange / cream / orange / dark. */
export function emailShell(o: ShellOptions): string {
  // Buttons are always pills. Ink on the orange fill passes AA at 5.25:1; the
  // site's Warm White label is 2.98:1 and fails. The guide leaves this open —
  // see BRAND_GUIDELINES.md › Accessibility — so email uses the passing pair.
  const cta = o.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px"><tr>
        <td style="background:${BRAND.orange};border-radius:900px" bgcolor="${BRAND.orange}"><a href="${o.cta.href}" style="display:inline-block;padding:15px 24px;font-family:${FONT};font-weight:700;font-size:16px;line-height:20px;color:${BRAND.black};text-decoration:none;border-radius:900px">${o.cta.label}&nbsp;&nbsp;&rarr;</a></td>
      </tr></table>`
    : ''

  const hero = `
    <div style="padding:30px 32px 0" class="px">
      <img src="${WORDMARK}" alt="${SENDER_NAME}" width="200" height="14" style="display:block;width:200px;height:auto;border:0;outline:none;text-decoration:none">
    </div>
    <div style="padding:40px 32px 36px 0" class="pxr">
      ${o.eyebrow ? `<div style="padding-left:32px" class="px">${label(o.eyebrow, true)}</div>` : ''}
      ${heading(o.heading)}
      ${o.highlight ? `<div style="padding-left:32px" class="px">${o.highlight}</div>` : ''}
    </div>`

  const body = `
    <div style="padding:34px 32px 36px" class="px">
      ${o.bodyHtml}
      ${cta}
      ${o.footNote ? `<p style="margin:22px 0 0;font-family:${FONT};font-weight:400;font-size:13px;line-height:1.5;color:${ON_CREAM_MUTED}">${o.footNote}</p>` : ''}
    </div>`

  const foot = `
    <div style="padding:34px 32px 38px" class="px">
      <img src="${WORDMARK}" alt="${SENDER_NAME}" width="180" height="13" style="display:block;width:180px;height:auto;border:0;outline:none;text-decoration:none">
      ${o.slogan === false ? '' : `<p style="margin:14px 0 0;font-family:${FONT};font-weight:300;font-style:italic;font-size:15px;color:${ON_DARK_MUTED}">Space to move on.</p>`}
      <p style="margin:16px 0 0;font-family:${FONT};font-weight:400;font-size:12px;line-height:1.6;color:${ON_DARK_MUTED}">
        Granbury, TX &middot; <a href="tel:+18175790607" style="color:${ON_DARK};text-decoration:underline">(817) 579-0607</a> &middot; <a href="${SITE}" style="color:${ON_DARK};text-decoration:underline">journey.storage</a>
      </p>
      ${o.legal ? `<p style="margin:14px 0 0;font-family:${FONT};font-weight:400;font-size:11px;line-height:1.6;color:${ON_DARK_MUTED}">${o.legal}</p>` : ''}
    </div>`

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${o.heading.replace(/<[^>]+>/g, '')}</title>
<style>
${FONT_FACES}
b{font-weight:800}
@media (max-width:620px){
  .px{padding-left:20px!important;padding-right:20px!important}
  .pxr{padding-right:20px!important}
  .hd{font-size:26px!important;letter-spacing:-0.5px!important;padding-left:15px!important}
  .st{display:block!important;padding:0 0 16px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background:${DARK};-webkit-font-smoothing:antialiased">
<div style="display:none;font-size:1px;color:${DARK};max-height:0;overflow:hidden">${o.preheader}</div>
${band(DARK, hero, { dots: true })}
${rule()}
${band(CREAM, body)}
${rule()}
${band(DARK, foot, { dots: true })}
</body></html>`
}

/**
 * One large figure on the cream band — a sign-in code, a gate code. Ink at
 * 800, never orange: orange type on a light ground fails contrast.
 */
export const bigFigure = (text: string) =>
  `<p style="margin:0;font-family:${FONT};font-weight:800;font-size:40px;line-height:1.1;letter-spacing:0.16em;font-variant-numeric:tabular-nums;color:${ON_CREAM}">${text}</p>`

/**
 * A link on the cream band. Orange cannot be text on a light ground, so the
 * link is ink and the orange lives in the underline — a graphic element.
 */
export const link = (href: string, text: string) =>
  `<a href="${href}" style="color:${ON_CREAM};font-weight:700;text-decoration:underline;text-decoration-color:${BRAND.orange};text-underline-offset:3px">${text}</a>`

/**
 * A large figure for the dark hero band — a gate code. On dark it may be the
 * composition's orange; here it stays Warm White so the heading tick and the
 * button remain the only orange accents.
 */
export const heroFigure = (value: string, labelText: string, sub?: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:26px 0 0;border-top:1px solid rgba(255,252,248,0.14)"><tr><td style="padding-top:20px">
    ${label(labelText, true)}
    <div style="font-family:${FONT};font-weight:800;font-size:46px;line-height:1.05;letter-spacing:0.14em;font-variant-numeric:tabular-nums;color:${ON_DARK}">${value}</div>
    ${sub ? `<div style="margin-top:6px;font-family:${FONT};font-weight:400;font-size:13px;color:${ON_DARK_MUTED}">${sub}</div>` : ''}
  </td></tr></table>`

/**
 * Numbered steps, the guide's pattern: two-digit numerals at 800, uppercase
 * title at 700, muted description. The guide sets the numerals in orange, but
 * orange type fails on cream, so here they are ink — the weight carries them.
 */
export const steps = (items: Array<[string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${items
    .map(
      ([title, detail], i) => `<tr>
      <td width="44" style="width:44px;padding:14px 0;vertical-align:top;border-bottom:${i === items.length - 1 ? '0' : `1px solid ${HAIRLINE}`};font-family:${FONT};font-weight:800;font-size:22px;line-height:1;font-variant-numeric:tabular-nums;color:${ON_CREAM}">${String(i + 1).padStart(2, '0')}</td>
      <td style="padding:14px 0;vertical-align:top;border-bottom:${i === items.length - 1 ? '0' : `1px solid ${HAIRLINE}`}">
        <div style="font-family:${FONT};font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${ON_CREAM}">${title}</div>
        <div style="margin-top:4px;font-family:${FONT};font-weight:400;font-size:15px;line-height:1.45;color:${ON_CREAM_MUTED}">${detail}</div>
      </td>
    </tr>`,
    )
    .join('')}</table>`

/**
 * Status pills. Buttons, badges and tags are always pills in v3. Inline
 * blocks rather than table cells so they wrap on a phone — three pills in one
 * unbreakable row pushed the whole email wider than the screen.
 */
export const pills = (labels: string[]) =>
  `<div style="margin:16px 0 0;font-size:0;line-height:0">${labels
    .map(
      (l) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:7px 13px;border:1px solid ${HAIRLINE};border-radius:900px;background:#FFFCF8;font-family:${FONT};font-weight:700;font-size:12px;line-height:16px;color:${ON_CREAM};white-space:nowrap">&#10003;&nbsp;${l}</span>`,
    )
    .join('')}</div>`
