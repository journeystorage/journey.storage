import type { Metadata } from 'next'
import FacilityView, { type Facility } from '@/components/rentaspace/FacilityView'

const westernHills: Facility = {
  slug: 'westernhillstrl',
  name: 'Self Storage on Western Hills Trail',
  short: 'Western Hills Trl',
  formerly: 'Granbury Self Storage',
  address: '409 Western Hills Trail',
  city: 'Granbury, TX 76049',
  phone: '(817) 579-0607',
  tel: 'tel:+18175790607',
  rating: '4.9',
  reviews: 94,
  slides: [
    { src: '/images/granbury/wh-slide-1.webp', alt: 'Aerial view of the Western Hills facility' },
    { src: '/images/granbury/wh-slide-2.webp', alt: 'Rows of drive-up storage spaces' },
    { src: '/images/granbury/wh-slide-3.webp', alt: 'Wide drive aisle between spaces' },
    { src: '/images/granbury/wh-slide-4.webp', alt: 'Open drive-up space' },
  ],
  promo: '50% off your first month',
  gallery: [
    { thumb: '/images/granbury/wh-t-1.webp', full: '/images/granbury/wh-p-1.webp', alt: 'Aerial view of the facility' },
    { thumb: '/images/granbury/wh-t-2.webp', full: '/images/granbury/wh-p-2.webp', alt: 'Rows of drive-up spaces' },
    { thumb: '/images/granbury/wh-t-3.webp', full: '/images/granbury/wh-p-3.webp', alt: 'Wide drive aisle' },
    { thumb: '/images/granbury/wh-t-4.webp', full: '/images/granbury/wh-p-4.webp', alt: 'Open drive-up space' },
    { thumb: '/images/granbury/wh-t-5.webp', full: '/images/granbury/wh-p-5.webp', alt: 'Roll-up door detail' },
    { thumb: '/images/granbury/wh-t-6.webp', full: '/images/granbury/wh-p-6.webp', alt: 'Storage spaces' },
  ],
  mapQuery: '409 Western Hills Trail, Granbury, TX 76049',
  amenities: [
    'Drive-up access',
    '24/7 gated access',
    'Keyless smart-lock entry',
    '24/7 security cameras',
    'Well-lit drive aisles',
    'Roll-up doors',
    'Ground-level spaces',
    'Online rental & bill pay',
    'Month-to-month · no deposit',
    'No long-term commitment',
    'Moving carts on-site',
    'Boxes & moving supplies',
    'Vehicle & trailer parking',
  ],
  about: [
    'JOURNEY.STORAGE™ on Western Hills Trail (formerly Granbury Self Storage) serves the west side of Granbury and the Harbor Lakes and Pecan Plantation communities, just off Highway 377 — 100+ clean, gated drive-up spaces built for easy, roll-up-and-go access.',
    'Every space is ground-level with a wide, well-lit roll-up door, so you can pull your vehicle right up and load in minutes — perfect for lake gear, tools, seasonal storage, or a small business’s overflow.',
    'Month-to-month, no deposit, no long-term commitment, and 24/7 gate access — rent online in minutes and move in on your schedule.',
  ],
  groups: [
    { category: 'Small', blurb: 'A closet to a single room', units: [
      { size: '5 × 5', art: '5x5', sqft: 25, fits: 'A few boxes & small furniture', walkIn: 35, online: 25, tags: ['Drive-up', 'Ground-level'] },
      { size: '5 × 10', art: '5x10', sqft: 50, fits: 'A studio or one room', walkIn: 52, online: 42, tags: ['Drive-up', 'Ground-level'] },
    ] },
    { category: 'Medium', blurb: 'One to two bedrooms', units: [
      { size: '10 × 10', art: '10x10', sqft: 100, fits: 'A one-bedroom apartment', walkIn: 89, online: 72, tags: ['Drive-up', 'Roll-up door'] },
      { size: '10 × 15', art: '10x15', sqft: 150, fits: 'Two bedrooms + appliances', walkIn: 119, online: 99, tags: ['Drive-up', 'Roll-up door'] },
    ] },
    { category: 'Large', blurb: 'A full household', units: [
      { size: '10 × 20', art: '10x20', sqft: 200, fits: 'A three-bedroom home', walkIn: 169, online: 139, tags: ['Drive-up', 'Roll-up door'] },
    ] },
    { category: 'X-Large', blurb: 'A large home or a vehicle', units: [
      { size: '10 × 30', art: '10x30', sqft: 300, fits: 'A large home, or a car + household', walkIn: 239, online: 199, tags: ['Drive-up', 'Roll-up door', 'Extra tall'] },
    ] },
  ],
  faqs: [
    { q: 'What’s the cheapest space here?', a: 'Our smallest 5×5 drive-up spaces start at $25/mo online. Prices vary by size and current availability.' },
    { q: 'Do I need a reservation?', a: 'No — you can rent online in minutes, any time of day. Reserving online locks in your online rate and holds the space until you move in.' },
    { q: 'What are the access hours?', a: 'We’re open 24/7 — gate access every day of the year, any hour. Rent and pay online any time, no office visit required.' },
    { q: 'Are all spaces drive-up?', a: 'Yes — Western Hills is a drive-up facility. Every space is ground-level with a roll-up door, so you can pull your vehicle right up and load in minutes. Need climate control? See our Temple Hall Hwy or McCreary Rd locations.' },
    { q: 'Do I need my own lock?', a: 'No — every space comes with a built-in smart lock. There’s nothing to buy or bring; you unlock your space right from your phone, and only you have access.' },
    { q: 'Is insurance or a protection plan required?', a: 'Your belongings should be covered. Use your own homeowner’s or renter’s policy with proof of coverage, or add an affordable tenant protection plan at checkout.' },
    { q: 'Can I store a boat, trailer, or vehicle?', a: 'Yes — with drive-up access and vehicle & trailer parking, Western Hills is a great fit for lake and outdoor gear. Larger 10×20 and 10×30 spaces fit a vehicle plus household goods.' },
    { q: 'What can’t I store?', a: 'No hazardous, flammable, or perishable items, and nothing living (people, animals, or plants). If you’re unsure about something, just ask.' },
    { q: 'Is autopay available?', a: 'Yes. Set up autopay and manage everything — payments, documents, move-out — online, anytime.' },
  ],
}

const OG_IMG = 'https://journey.storage/images/granbury/wh-p-1.webp'
export const metadata: Metadata = {
  title: 'Drive-Up Storage on Western Hills Trl, Granbury TX | JOURNEY.STORAGE™',
  description:
    'Rent a clean, gated drive-up storage space at JOURNEY.STORAGE™ on Western Hills Trail in Granbury, TX (formerly Granbury Self Storage). Ground-level spaces from $25/mo, 24/7 gated access. Reserve online in minutes.',
  alternates: { canonical: '/rentaspace/westernhillstrl' },
  openGraph: {
    title: 'Drive-Up Storage on Western Hills Trl, Granbury TX | JOURNEY.STORAGE™',
    description: 'Gated drive-up storage from $25/mo, 24/7 access, serving west Granbury & Harbor Lakes. Formerly Granbury Self Storage.',
    url: 'https://journey.storage/rentaspace/westernhillstrl',
    type: 'website',
    images: [{ url: OG_IMG, width: 1400, height: 933, alt: 'Journey.Storage on Western Hills Trail, Granbury TX' }],
  },
  twitter: { card: 'summary_large_image', title: 'Drive-Up Storage on Western Hills Trl, Granbury TX', description: 'Gated drive-up storage from $25/mo, 24/7 access.', images: [OG_IMG] },
}

export default function WesternHillsPage() {
  return <FacilityView facility={westernHills} />
}
