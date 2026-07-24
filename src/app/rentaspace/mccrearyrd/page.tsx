import type { Metadata } from 'next'
import FacilityView, { type Facility } from '@/components/rentaspace/FacilityView'

const mcCreary: Facility = {
  slug: 'mccrearyrd',
  name: 'Self Storage on McCreary Road',
  short: 'McCreary Rd',
  formerly: 'Granbury Self Storage',
  address: '3501 McCreary Rd',
  city: 'Granbury, TX 76049',
  phone: '(817) 579-0607',
  tel: 'tel:+18175790607',
  rating: '4.8',
  reviews: 61,
  slides: [
    { src: '/images/granbury/cl-slide-1.webp', alt: 'Aerial view of the McCreary Rd facility' },
    { src: '/images/granbury/cl-slide-2.webp', alt: 'Storage buildings exterior' },
    { src: '/images/granbury/cl-slide-3.webp', alt: 'Climate-controlled interior spaces' },
    { src: '/images/granbury/cl-slide-4.webp', alt: 'Storage spaces' },
  ],
  promo: '50% off your first month',
  gallery: [
    { thumb: '/images/granbury/cl-t-1.webp', full: '/images/granbury/cl-p-1.webp', alt: 'Aerial view of the facility' },
    { thumb: '/images/granbury/cl-t-2.webp', full: '/images/granbury/cl-p-2.webp', alt: 'Storage buildings exterior' },
    { thumb: '/images/granbury/cl-t-3.webp', full: '/images/granbury/cl-p-3.webp', alt: 'Climate-controlled interior' },
    { thumb: '/images/granbury/cl-t-4.webp', full: '/images/granbury/cl-p-4.webp', alt: 'Storage spaces' },
  ],
  mapQuery: '3501 McCreary Rd, Granbury, TX 76049',
  amenities: [
    'Climate-controlled spaces',
    'Drive-up access',
    '24/7 gated access',
    'Keyless smart-lock entry',
    '24/7 security cameras',
    'Bright LED lighting',
    'Roll-up doors',
    'Ground-level spaces',
    'Newest facility',
    'Online rental & bill pay',
    'Month-to-month · no deposit',
    'Moving carts on-site',
    'Vehicle & RV parking',
  ],
  about: [
    'JOURNEY.STORAGE™ on McCreary Road (formerly Granbury Self Storage, off Cleveland Road) is our newest Granbury location — serving Acton, DeCordova Bend, and the south side of US-377 with clean, modern spaces.',
    'Choose fully climate-controlled interior spaces for furniture, electronics, and keepsakes, or wide drive-up spaces you can pull right up to. Bright LED lighting, roll-up doors, concrete drive aisles, and a fully gated perimeter watched around the clock.',
    'Month-to-month, no deposit, no long-term commitment, and 24/7 gate access — reserve online in minutes and move in on your schedule.',
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
    { q: 'What’s the cheapest space here?', a: 'Our smallest 5×5 spaces start at $29/mo online. Prices vary by size, features, and current availability.' },
    { q: 'Do I need a reservation?', a: 'No — you can rent online in minutes, any time of day. Reserving online locks in your online rate and holds the space until you move in.' },
    { q: 'What are the access hours?', a: 'We’re open 24/7 — gate access every day of the year, any hour. Rent and pay online any time, no office visit required.' },
    { q: 'Climate-controlled vs. drive-up — what’s the difference?', a: 'Climate-controlled spaces sit inside an insulated building with regulated temperature and humidity — ideal for furniture and electronics. Drive-up spaces let you pull right up to a roll-up door for fast loading.' },
    { q: 'Do I need my own lock?', a: 'No — every space comes with a built-in smart lock. There’s nothing to buy or bring; you unlock your space right from your phone, and only you have access.' },
    { q: 'Is insurance or a protection plan required?', a: 'Your belongings should be covered. Use your own homeowner’s or renter’s policy with proof of coverage, or add an affordable tenant protection plan at checkout.' },
    { q: 'Can I store a car, boat, or RV?', a: 'Yes — McCreary Rd offers drive-up spaces and vehicle & RV parking. Larger 10×20 and 10×30 spaces fit a vehicle plus household goods.' },
    { q: 'What can’t I store?', a: 'No hazardous, flammable, or perishable items, and nothing living (people, animals, or plants). If you’re unsure about something, just ask.' },
    { q: 'Is autopay available?', a: 'Yes. Set up autopay and manage everything — payments, documents, move-out — online, anytime.' },
  ],
}

const OG_IMG = 'https://journey.storage/images/granbury/cl-p-1.webp'
export const metadata: Metadata = {
  title: 'Self Storage on McCreary Rd, Granbury TX | JOURNEY.STORAGE™',
  description:
    'Rent a clean, secure storage space at JOURNEY.STORAGE™ on McCreary Rd in Granbury, TX (formerly Granbury Self Storage). Our newest facility with climate-controlled & drive-up spaces from $29/mo, 24/7 gated access. Reserve online in minutes.',
  alternates: { canonical: '/rentaspace/mccrearyrd' },
  openGraph: {
    title: 'Self Storage on McCreary Rd, Granbury TX | JOURNEY.STORAGE™',
    description: 'Our newest Granbury facility — climate-controlled & drive-up storage from $29/mo, 24/7 access, serving Acton & DeCordova.',
    url: 'https://journey.storage/rentaspace/mccrearyrd',
    type: 'website',
    images: [{ url: OG_IMG, width: 1400, height: 933, alt: 'Journey.Storage on McCreary Rd, Granbury TX' }],
  },
  twitter: { card: 'summary_large_image', title: 'Self Storage on McCreary Rd, Granbury TX', description: 'Climate-controlled & drive-up storage from $29/mo, 24/7 access.', images: [OG_IMG] },
}

export default function McCrearyPage() {
  return <FacilityView facility={mcCreary} />
}
