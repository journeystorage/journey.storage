import { Fragment, type ReactNode } from 'react'

type Brand = 'Direct' | 'Storage'

/**
 * The Journey lockup, set inline: JOURNEY in black weight, the sub-brand in
 * light. Sized at 0.94em so the all-caps run optically matches the
 * lowercase body text it sits inside.
 */
export function BrandMark({ brand }: { brand: Brand }) {
  return (
    <span className="whitespace-nowrap font-black tracking-[0.02em] text-[0.94em]">
      JOURNEY.<span className="font-light">{brand.toUpperCase()}</span>
      &trade;
    </span>
  )
}

const BRAND_RE = /Journey\.(Direct|Storage)™?/g

/**
 * Swaps every "Journey.Direct™" / "Journey.Storage™" in a plain string for the
 * lockup, so copy can stay as strings in data arrays.
 */
export function renderBrand(text: string): ReactNode {
  const parts: ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(BRAND_RE)) {
    const start = match.index
    if (start > last) parts.push(text.slice(last, start))
    parts.push(<BrandMark key={start} brand={match[1] as Brand} />)
    last = start + match[0].length
  }

  if (last === 0) return text
  if (last < text.length) parts.push(text.slice(last))

  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>)
}
