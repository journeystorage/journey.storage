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

// ─── External URLs ───
// This app IS managed.journey.storage — everything else in the ecosystem is
// an absolute link back out.
export const externalUrls = {
  mainSite: 'https://journey.storage',
  managed: 'https://managed.journey.storage',
  investors: 'https://direct.journey.storage',
} as const

// ─── Social Media URLs ───
export const socialUrls = {
  instagram: 'https://www.instagram.com/storage.journey',
  linkedin: 'https://www.linkedin.com/company/journey-storage%E2%84%A2',
  facebook: 'https://www.facebook.com/people/JourneyStorage/61587719385923/',
} as const

// ─── Nav Configuration ───
// All absolute — these leave the subdomain.
// In-page anchors — this page sells management to facility owners, so the nav
// answers an owner's three questions: what you do, what it costs, who runs it.
export const navLinks = [
  { label: 'How it works', href: '#managed-model' },
  { label: 'Pricing', href: '#managed-pricing' },
  { label: 'Leadership', href: '#managed-leadership' },
] as const

export const ecosystemDropdownLinks = [
  { label: 'Storage', description: 'Self-storage built for life in motion', href: externalUrls.mainSite },
  { label: 'Managed', description: 'Third-party management', href: externalUrls.managed, current: true },
  { label: 'Direct', description: 'Investment platform', href: externalUrls.investors },
] as const

// ─── Layout ───
export const NAV_HEIGHT = 72
