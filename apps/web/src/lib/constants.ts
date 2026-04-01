// ─── Brand Colors ───
export const colors = {
  black: '#181818',
  charcoal: '#3A3835',
  orange: '#E8622A',
  stone: '#888680',
  warmWhite: '#F5F0E8',
  terracotta: '#D4956A',
  sunlight: '#E8C547',
  skyBlue: '#4A90D9',
  ice: '#E8F4F8',
  sageGreen: '#7AAF6E',
  sand: '#C4B89A',
} as const

// ─── Section IDs (anchor navigation) ───
export const sectionIds = {
  hero: 'hero',
  lifeMoments: 'life-moments',
  about: 'about',
  howItWorks: 'how-it-works',
  differentiators: 'differentiators',
  locations: 'locations',
  foundedBy: 'founded-by',
  waitlist: 'waitlist',
} as const

// ─── External URLs ───
export const externalUrls = {
  investors: 'https://direct.journey.storage',
  consulting: 'https://consulting.journey.storage',
} as const

// ─── Social Media URLs ───
export const socialUrls = {
  instagram: 'https://www.instagram.com/storage.journey',
  linkedin: 'https://www.linkedin.com/company/journey-storage%E2%84%A2',
  facebook: 'https://www.facebook.com/people/JourneyStorage/61587719385923/',
} as const

// ─── Nav Configuration ───
export const navLinks = [
  { label: 'How it works', href: `#${sectionIds.howItWorks}` },
  { label: 'Locations', href: `#${sectionIds.locations}` },
  { label: 'About', href: `#${sectionIds.about}` },
] as const

export const businessDropdownLinks = [
  { label: 'For investors', href: externalUrls.investors, external: true },
  { label: 'Consulting', href: externalUrls.consulting, external: true },
] as const

// ─── Layout ───
export const NAV_HEIGHT = 72
export const SCROLL_OFFSET = 80
