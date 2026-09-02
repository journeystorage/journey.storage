// Shared ZIP/city resolver for the space finders on the homepage Locations
// section and the /rentaspace hub. All three facilities sit in Granbury, TX
// 76049, so there is no meaningful "nearest" to compute from a ZIP — a ZIP or
// city we serve shows the locations grid and lets the renter pick; only naming
// a facility outright (its name, street, or street number) jumps straight to
// that rental page.

// Typing a facility, its street, or its street number goes straight there.
const FACILITY_ALIASES: ReadonlyArray<readonly [RegExp, string]> = [
  [/temple\s*hall|(^|\D)212(\D|$)/, '/rentaspace/templehallhwy'],
  [/western\s*hills|(^|\D)409(\D|$)/, '/rentaspace/westernhillstrl'],
  [/mc\s*creary|(^|\D)3501(\D|$)/, '/rentaspace/mccrearyrd'],
]

// Granbury proper plus the Hood County / Somervell towns people drive in from.
const SERVED_ZIPS = new Set(['76048', '76049', '76035', '76043', '76462', '76476', '76077'])
const SERVED_CITIES = ['granbury', 'acton', 'cresson', 'glen rose', 'lipan', 'tolar', 'rainbow', 'pecan plantation', 'hood county']

export type SearchResult =
  | { kind: 'facility'; path: string } // named a specific facility
  | { kind: 'served' }                 // somewhere we cover — show all three
  | { kind: 'unserved' }               // say where we actually are

export function resolveSearch(raw: string): SearchResult {
  const q = raw.trim().toLowerCase().replace(/[.,]/g, ' ').replace(/\s+/g, ' ')
  if (!q) return { kind: 'served' }

  for (const [pattern, path] of FACILITY_ALIASES) {
    if (pattern.test(q)) return { kind: 'facility', path }
  }

  const zip = q.match(/\b\d{5}\b/)?.[0]
  if (zip) return SERVED_ZIPS.has(zip) ? { kind: 'served' } : { kind: 'unserved' }

  return SERVED_CITIES.some((city) => q.includes(city)) ? { kind: 'served' } : { kind: 'unserved' }
}
