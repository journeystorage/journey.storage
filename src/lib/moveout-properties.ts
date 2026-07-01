// Journey's live storage facilities that a tenant can move out of. Shared by
// the /moveout page (renders the location picker) and the /api/moveout route
// (validates the submitted slug and labels the notification). Client-safe:
// no notification emails live here — those are resolved server-side by slug in
// the API route, so they never ship to the browser.

export type MoveOutProperty = {
  slug: string
  name: string        // short display name ("Temple Hall")
  street: string      // "212 Temple Hall Hwy"
  cityState: string   // "Granbury, TX 76049"
  phone: string       // "(817) 579-0607"
  phoneHref: string   // "+18175790607"
  image: string       // /public path
  badge?: string      // small overlay tag on the card photo
}

export const MOVEOUT_PROPERTIES: MoveOutProperty[] = [
  {
    slug: 'temple-hall',
    name: 'Temple Hall',
    street: '212 Temple Hall Hwy',
    cityState: 'Granbury, TX 76049',
    phone: '(817) 579-0607',
    phoneHref: '+18175790607',
    image: '/images/granbury/temple-hall-aerial.jpg',
    badge: '350+ units',
  },
  {
    slug: 'western-hills',
    name: 'Western Hills',
    street: '409 Western Hills Trail',
    cityState: 'Granbury, TX 76049',
    phone: '(817) 579-0607',
    phoneHref: '+18175790607',
    image: '/images/granbury/western-hills-aerial-2.jpg',
    badge: '100+ units',
  },
  {
    slug: 'cleveland-road',
    name: 'Cleveland Rd',
    street: '3501 McCreary Rd',
    cityState: 'Granbury, TX 76049',
    phone: '(817) 579-0607',
    phoneHref: '+18175790607',
    image: '/images/granbury/cleveland-aerial.jpg',
    badge: 'Newest',
  },
]

export function getMoveOutProperty(slug: string): MoveOutProperty | undefined {
  return MOVEOUT_PROPERTIES.find((p) => p.slug === slug)
}
