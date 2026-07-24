import type { Metadata } from 'next'
import FacilityView, { type Facility } from '@/components/rentaspace/FacilityView'

const templeHall: Facility = {
  slug: 'templehallhwy',
  name: 'Self Storage on Temple Hall Highway',
  short: 'Temple Hall Hwy',
  formerly: 'Granbury Self Storage',
  address: '212 Temple Hall Hwy',
  city: 'Granbury, TX 76049',
  phone: '(817) 579-0607',
  tel: 'tel:+18175790607',
  rating: '5.0',
  reviews: 128,
  slides: [
    { src: '/images/granbury/th-slide-2.webp', alt: 'Aerial view of the Temple Hall Hwy facility' },
    { src: '/images/granbury/th-slide-3.webp', alt: 'Drive-up storage spaces' },
    { src: '/images/granbury/th-slide-4.webp', alt: 'Climate-controlled interior spaces' },
    { src: '/images/granbury/th-slide-5.webp', alt: 'Indoor storage spaces' },
    { src: '/images/granbury/th-slide-1.webp', alt: 'Rental office at Temple Hall Hwy' },
  ],
  promo: '50% off your first month',
  gallery: [
    { thumb: '/images/granbury/th-t-2.webp', full: '/images/granbury/th-p-2.webp', alt: 'Aerial view of the facility' },
    { thumb: '/images/granbury/th-t-3.webp', full: '/images/granbury/th-p-3.webp', alt: 'Drive-up storage spaces' },
    { thumb: '/images/granbury/th-t-4.webp', full: '/images/granbury/th-p-4.webp', alt: 'Climate-controlled interior spaces' },
    { thumb: '/images/granbury/th-t-5.webp', full: '/images/granbury/th-p-5.webp', alt: 'Front office interior' },
    { thumb: '/images/granbury/th-t-6.webp', full: '/images/granbury/th-p-6.webp', alt: 'Gated entry' },
    { thumb: '/images/granbury/th-t-1.webp', full: '/images/granbury/th-p-1.webp', alt: 'Rental office exterior' },
  ],
  mapQuery: '212 Temple Hall Hwy, Granbury, TX 76049',
  amenities: [
    'Climate-controlled spaces',
    'Drive-up access',
    '24/7 gated access',
    '24/7 security cameras',
    'Bright LED lighting',
    'Roll-up doors',
    'Ground-level spaces',
    'Online rental & bill pay',
    'Month-to-month · no deposit',
    'Moving carts on-site',
    'Boxes & moving supplies',
    'Vehicle & RV parking',
  ],
  about: [
    'JOURNEY.STORAGE™ on Temple Hall Highway (formerly Granbury Self Storage) is our flagship location — 350+ clean, secure spaces serving east Granbury, Lake Granbury, and the Highway 377 corridor, just minutes from downtown and the marina.',
    'It’s our only location with the full range: breezy drive-up spaces for boats, trailers, and seasonal gear, plus fully climate-controlled interior spaces for furniture, electronics, and keepsakes. Wide, well-lit aisles, roll-up doors, a friendly on-site office, and a gated perimeter watched around the clock.',
    'Month-to-month, no deposit, no long-term commitment, and 24/7 gate access — rent online in minutes and move in on your schedule.',
  ],
  groups: [
    { category: 'Small', blurb: 'A closet to a single room', units: [
      { size: '5 × 5', art: '5x5', sqft: 25, fits: 'A few boxes & small furniture', walkIn: 39, online: 29, tags: ['Climate-controlled', 'Interior', 'Ground-level'] },
      { size: '5 × 10', art: '5x10', sqft: 50, fits: 'A studio or one room', walkIn: 55, online: 45, tags: ['Drive-up', 'Ground-level'] },
    ] },
    { category: 'Medium', blurb: 'One to two bedrooms', units: [
      { size: '10 × 10', art: '10x10', sqft: 100, fits: 'A one-bedroom apartment', walkIn: 95, online: 79, tags: ['Climate-controlled', 'Interior'] },
      { size: '10 × 15', art: '10x15', sqft: 150, fits: 'Two bedrooms + appliances', walkIn: 129, online: 109, tags: ['Drive-up', 'Roll-up door'] },
    ] },
    { category: 'Large', blurb: 'A full household', units: [
      { size: '10 × 20', art: '10x20', sqft: 200, fits: 'A three-bedroom home', walkIn: 175, online: 149, tags: ['Drive-up', 'Roll-up door'] },
    ] },
    { category: 'X-Large', blurb: 'A large home or a vehicle', units: [
      { size: '10 × 30', art: '10x30', sqft: 300, fits: 'A large home, or a car + household', walkIn: 255, online: 219, tags: ['Drive-up', 'Roll-up door', 'Extra tall'] },
    ] },
  ],
  faqs: [
    { q: 'What’s the cheapest space here?', a: 'Our smallest 5×5 spaces start at $29/mo online. Prices vary by size, features (climate-controlled vs. drive-up), and current availability.' },
    { q: 'Do I need a reservation?', a: 'No — you can rent online in minutes, any time of day. Reserving online locks in your online rate and holds the space until you move in.' },
    { q: 'What are the access hours?', a: 'We’re open 24/7 — gate access every day of the year, any hour. Rent and pay online any time, no office visit required.' },
    { q: 'Climate-controlled vs. drive-up — what’s the difference?', a: 'Climate-controlled spaces sit inside an insulated building with regulated temperature and humidity — ideal for furniture, electronics, and keepsakes. Drive-up spaces let you pull your vehicle right up to a roll-up door for fast, easy loading.' },
    { q: 'Do I need my own lock?', a: 'No — every space comes with a built-in smart lock. There’s nothing to buy or bring; you unlock your space right from your phone, and only you have access.' },
    { q: 'Is insurance or a protection plan required?', a: 'Your belongings should be covered. You can use your own homeowner’s or renter’s policy with proof of coverage, or add an affordable tenant protection plan at checkout.' },
    { q: 'Can I store a car, boat, or RV?', a: 'Yes — Temple Hall offers drive-up spaces and vehicle & RV parking. Larger 10×20 and 10×30 spaces fit a car plus household goods.' },
    { q: 'What can’t I store?', a: 'No hazardous, flammable, or perishable items, and nothing living (people, animals, or plants). If you’re unsure about something, just ask.' },
    { q: 'Is autopay available?', a: 'Yes. Set up autopay and manage everything — payments, documents, move-out — online, anytime.' },
  ],
}

const OG_IMG = 'https://journey.storage/images/granbury/th-p-2.webp'
export const metadata: Metadata = {
  title: 'Self Storage on Temple Hall Hwy, Granbury TX | JOURNEY.STORAGE™',
  description:
    'Rent a clean, secure storage space at JOURNEY.STORAGE™ on Temple Hall Hwy in Granbury, TX (formerly Granbury Self Storage). Climate-controlled & drive-up spaces from $29/mo, 24/7 gated access. Reserve online in minutes.',
  alternates: { canonical: '/rentaspace/templehallhwy' },
  openGraph: {
    title: 'Self Storage on Temple Hall Hwy, Granbury TX | JOURNEY.STORAGE™',
    description: 'Climate-controlled & drive-up storage from $29/mo, 24/7 gated access. Formerly Granbury Self Storage. Reserve online in minutes.',
    url: 'https://journey.storage/rentaspace/templehallhwy',
    type: 'website',
    images: [{ url: OG_IMG, width: 1400, height: 933, alt: 'Journey.Storage on Temple Hall Hwy, Granbury TX' }],
  },
  twitter: { card: 'summary_large_image', title: 'Self Storage on Temple Hall Hwy, Granbury TX', description: 'Climate-controlled & drive-up storage from $29/mo, 24/7 gated access.', images: [OG_IMG] },
}

export default function TempleHallPage() {
  return <FacilityView facility={templeHall} />
}
