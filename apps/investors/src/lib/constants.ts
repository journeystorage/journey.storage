export const CALENDAR_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1UO_n2BsSorjoLlzCVGjqLvi8dhAWDYSFVTj0uSItghc2OgucVW1F2nHLcwPeyLDbi546yr8kV'

// ─── Launch target ───
// April 13, 2026 — 00:00 America/Chicago (CDT, UTC-5)
export const LAUNCH_DATE_ISO = '2026-04-13T05:00:00.000Z'

// ─── Ecosystem dropdown (mirrors main site) ───
export const externalUrls = {
  mainSite: 'https://journey.storage',
  advisory: 'https://advisory.journey.storage',
  direct: 'https://direct.journey.storage',
} as const

export const ecosystemDropdownLinks = [
  {
    label: 'Storage',
    description: 'Self-storage built for life in motion',
    href: externalUrls.mainSite,
  },
  {
    label: 'Advisory',
    description: 'Consulting & operations',
    href: externalUrls.advisory,
  },
  {
    label: 'Direct',
    description: 'Investment platform',
    href: externalUrls.direct,
    current: true,
  },
] as const
