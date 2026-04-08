export const CALENDAR_URL = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1UO_n2BsSorjoLlzCVGjqLvi8dhAWDYSFVTj0uSItghc2OgucVW1F2nHLcwPeyLDbi546yr8kV'

export const sectionIds = {
  hero: 'hero',
  problem: 'problem',
  solution: 'solution',
  howItWorks: 'how-it-works',
  pricing: 'pricing',
  founder: 'founder',
  faq: 'faq',
  cta: 'book',
} as const

export const externalUrls = {
  mainSite: 'https://journey.storage',
  advisory: 'https://advisory.journey.storage',
  investors: 'https://direct.journey.storage',
} as const

// ─── Ecosystem dropdown (mirrors main site / investors structure) ───
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
    current: true,
  },
  {
    label: 'Direct',
    description: 'Investment platform',
    href: externalUrls.investors,
  },
] as const
