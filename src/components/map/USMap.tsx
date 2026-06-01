'use client'

/**
 * U.S. outline map — inverted to light stroke on dark background.
 * Reduced opacity for elegant, understated presence.
 */
export default function USMap() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/images/map/usa-outline-map.svg"
      alt=""
      aria-hidden="true"
      className="h-auto w-full invert opacity-[0.12]"
    />
  )
}
