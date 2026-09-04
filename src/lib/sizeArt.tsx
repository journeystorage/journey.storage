/* Shared per-size SVG "arts" — mirrors the illustrations on /size-guide so the
   facility unit boxes and the size-guide pop-up board use the same artwork. */

export type SizeArtEntry = {
  key: string
  size: string
  label: string
  sqft: number
  accent: string
  tint: string
  illo: number
}

export const SIZE_ART: SizeArtEntry[] = [
  { key: '5x5', size: "5' × 5'", label: 'XS storage locker', sqft: 25, accent: 'rgb(74, 144, 217)', tint: 'rgba(74,144,217,0.12)', illo: 0 },
  { key: '5x10', size: "5' × 10'", label: 'Walk-in closet', sqft: 50, accent: 'rgb(232, 197, 71)', tint: 'rgba(232,197,71,0.16)', illo: 2 },
  { key: '10x10', size: "10' × 10'", label: 'Small bedroom', sqft: 100, accent: 'rgb(212, 149, 106)', tint: 'rgba(212,149,106,0.16)', illo: 3 },
  { key: '10x15', size: "10' × 15'", label: 'Large bedroom', sqft: 150, accent: 'rgb(185, 108, 82)', tint: 'rgba(185,108,82,0.16)', illo: 4 },
  { key: '10x20', size: "10' × 20'", label: 'One-car garage', sqft: 200, accent: 'rgb(138, 122, 165)', tint: 'rgba(138,122,165,0.16)', illo: 5 },
  { key: '10x25', size: "10' × 25'", label: 'Oversized garage', sqft: 250, accent: 'rgb(140, 146, 96)', tint: 'rgba(140,146,96,0.16)', illo: 5 },
  { key: '10x30', size: "10' × 30'", label: 'Two-car garage', sqft: 300, accent: 'rgb(93, 138, 133)', tint: 'rgba(93,138,133,0.18)', illo: 6 },
]

export function getSizeArt(key: string): SizeArtEntry | undefined {
  return SIZE_ART.find((s) => s.key === key)
}

/* Per-size illustration — returns inner SVG markup (drawn around x=150, baseline y≈262). */
export function illustration(i: number, a: string): string {
  if (i === 0) {
    return `<g transform="translate(150,260)">
      <rect x="-32" y="-30" width="64" height="50" rx="3" fill="none" stroke="${a}" stroke-width="2.5"/>
      <line x1="-32" y1="-10" x2="32" y2="-10" stroke="${a}" stroke-width="2"/>
      <rect x="-26" y="-72" width="50" height="38" rx="3" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.85"/>
      <line x1="-26" y1="-58" x2="24" y2="-58" stroke="${a}" stroke-width="2" opacity="0.85"/>
      <rect x="-20" y="-104" width="40" height="28" rx="3" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.7"/>
    </g>`
  }
  if (i === 1) {
    return `<g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
      <rect x="-70" y="-30" width="100" height="42" rx="6"/>
      <rect x="-60" y="-26" width="30" height="20" rx="3" fill="${a}" opacity="0.25" stroke="none"/>
      <line x1="-70" y1="12" x2="-70" y2="22"/><line x1="30" y1="12" x2="30" y2="22"/>
      <rect x="42" y="-22" width="42" height="34" rx="3" opacity="0.85"/>
      <line x1="42" y1="-7" x2="84" y2="-7" opacity="0.85"/>
    </g>`
  }
  if (i === 2) {
    return `<g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
      <rect x="-90" y="-50" width="80" height="38" rx="5"/>
      <rect x="-82" y="-46" width="25" height="18" rx="3" fill="${a}" opacity="0.25" stroke="none"/>
      <path d="M -90,18 L -90,-2 Q -90,-8 -84,-8 L -22,-8 Q -16,-8 -16,-2 L -16,18 Z"/>
      <line x1="-72" y1="-8" x2="-72" y2="18" opacity="0.6"/><line x1="-48" y1="-8" x2="-48" y2="18" opacity="0.6"/>
      <rect x="14" y="-30" width="64" height="48" rx="3"/><line x1="14" y1="-6" x2="78" y2="-6"/>
    </g>`
  }
  if (i === 3) {
    return `<g transform="translate(150,260)" stroke="${a}" stroke-width="2.5" fill="none">
      <rect x="-80" y="-40" width="86" height="50" rx="6"/>
      <rect x="-72" y="-36" width="32" height="22" rx="3" fill="${a}" opacity="0.3" stroke="none"/>
      <rect x="14" y="-30" width="58" height="40" rx="3"/><line x1="14" y1="-15" x2="72" y2="-15"/>
      <line x1="43" y1="-30" x2="43" y2="10"/>
      <circle cx="43" cy="-23" r="2" fill="${a}"/><circle cx="43" cy="2" r="2" fill="${a}"/>
      <g transform="translate(70,-58)"><circle cx="0" cy="0" r="10" opacity="0.5"/><line x1="0" y1="10" x2="0" y2="22"/><line x1="-8" y1="22" x2="8" y2="22"/></g>
    </g>`
  }
  if (i === 4) {
    return `<g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
      <path d="M -95,8 L -95,-12 Q -95,-22 -85,-22 L -10,-22 Q 0,-22 0,-12 L 0,8 Z"/>
      <line x1="-72" y1="-22" x2="-72" y2="8" opacity="0.6"/><line x1="-48" y1="-22" x2="-48" y2="8" opacity="0.6"/><line x1="-24" y1="-22" x2="-24" y2="8" opacity="0.6"/>
      <rect x="22" y="-44" width="72" height="42" rx="3"/>
      <line x1="58" y1="-2" x2="58" y2="14" opacity="0.7"/><line x1="46" y1="14" x2="70" y2="14" opacity="0.7"/>
      <ellipse cx="-50" cy="32" rx="34" ry="9" fill="${a}" opacity="0.18" stroke="none"/><ellipse cx="-50" cy="32" rx="34" ry="9" opacity="0.6"/>
    </g>`
  }
  if (i === 5) {
    return `<g transform="translate(150,260)" stroke="${a}" stroke-width="2.5" fill="none">
      <rect x="-100" y="-50" width="60" height="50" rx="4"/><rect x="-94" y="-44" width="30" height="22" rx="2" fill="${a}" opacity="0.3" stroke="none"/>
      <rect x="-30" y="-50" width="60" height="50" rx="4"/><rect x="-24" y="-44" width="30" height="22" rx="2" fill="${a}" opacity="0.3" stroke="none"/>
      <rect x="40" y="-50" width="60" height="50" rx="4"/><rect x="46" y="-44" width="30" height="22" rx="2" fill="${a}" opacity="0.3" stroke="none"/>
      <path d="M -100,16 L -100,10 Q -100,4 -94,4 L 94,4 Q 100,4 100,10 L 100,16 Z" opacity="0.85"/>
      <line x1="-60" y1="4" x2="-60" y2="16" opacity="0.5"/><line x1="0" y1="4" x2="0" y2="16" opacity="0.5"/><line x1="60" y1="4" x2="60" y2="16" opacity="0.5"/>
    </g>`
  }
  return `<g transform="translate(150,265)" stroke="${a}" stroke-width="2.5" fill="none">
    <path d="M -110,30 L -110,-30 L -60,-30 L -60,-60 L 60,-60 L 60,-30 L 110,-30 L 110,30 Z"/>
    <rect x="-95" y="-20" width="26" height="22" opacity="0.85"/><rect x="-90" y="-16" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
    <rect x="-40" y="-50" width="26" height="22" opacity="0.85"/><rect x="-35" y="-46" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
    <rect x="14" y="-50" width="26" height="22" opacity="0.85"/><rect x="19" y="-46" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
    <rect x="69" y="-20" width="26" height="22" opacity="0.85"/><rect x="74" y="-16" width="16" height="18" fill="${a}" opacity="0.25" stroke="none"/>
    <rect x="-18" y="-6" width="36" height="36" opacity="0.9"/><line x1="0" y1="-6" x2="0" y2="30" opacity="0.6"/><circle cx="-5" cy="14" r="1.5" fill="${a}"/>
  </g>`
}

/** Small standalone art for a given size key. */
export function SizeArt({ artKey, className }: { artKey: string; className?: string }) {
  const e = getSizeArt(artKey)
  if (!e) return null
  return (
    <svg viewBox="20 135 260 150" className={className} aria-hidden dangerouslySetInnerHTML={{ __html: illustration(e.illo, e.accent) }} />
  )
}
