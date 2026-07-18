import type { Metadata } from 'next'
import FacilityView, { type Facility } from '@/components/rentaspace/FacilityView'

const templeHall: Facility = {
  name: 'JOURNEY.STORAGE™ — Temple Hall Hwy',
  short: 'Temple Hall Hwy',
  address: '212 Temple Hall Hwy',
  city: 'Granbury, TX 76049',
  phone: '(817) 579-0607',
  tel: 'tel:+18175790607',
  rating: '5.0',
  reviews: 128,
  slides: [
    { src: '/images/granbury/th-slide-1.webp', alt: 'Rental office at Temple Hall Hwy' },
    { src: '/images/granbury/th-slide-2.webp', alt: 'Aerial view of the Temple Hall Hwy facility' },
    { src: '/images/granbury/th-slide-3.webp', alt: 'Drive-up storage spaces' },
    { src: '/images/granbury/th-slide-4.webp', alt: 'Climate-controlled interior spaces' },
    { src: '/images/granbury/th-slide-5.webp', alt: 'Indoor storage spaces' },
  ],
  promo: '50% off your first month',
  mapQuery: '212 Temple Hall Hwy, Granbury, TX 76049',
  amenities: [
    'Climate-controlled spaces',
    'Drive-up access',
    'Gated entry',
    '24/7 security cameras',
    'Bright LED lighting',
    'Roll-up doors',
    'Ground-level spaces',
    'Online rental & bill pay',
    'Month-to-month leases',
    'Moving carts on-site',
    'Boxes & moving supplies',
    'Storage protection plan',
  ],
  about: [
    'JOURNEY.STORAGE™ on Temple Hall Highway is our flagship Granbury facility — 350+ clean, secure spaces set on landscaped grounds just minutes from Lake Granbury, downtown, and the Highway 377 corridor.',
    'Whether you need a breezy drive-up space for seasonal gear or a fully climate-controlled space for furniture and keepsakes, you’ll find wide, well-lit aisles, roll-up doors, a friendly on-site office, and a gated perimeter watched around the clock.',
    'Month-to-month, no deposit, and no long-term commitment — rent online in minutes and move in on your schedule.',
  ],
  groups: [
    {
      category: 'Small',
      blurb: 'A closet to a single room',
      units: [
        { size: '5 × 5', art: '5x5', sqft: 25, fits: 'A few boxes & small furniture', walkIn: 39, online: 29, tags: ['Climate-controlled', 'Interior', 'Ground-level'] },
        { size: '5 × 10', art: '5x10', sqft: 50, fits: 'A studio or one room', walkIn: 55, online: 45, tags: ['Drive-up', 'Ground-level'] },
      ],
    },
    {
      category: 'Medium',
      blurb: 'One to two bedrooms',
      units: [
        { size: '10 × 10', art: '10x10', sqft: 100, fits: 'A one-bedroom apartment', walkIn: 95, online: 79, tags: ['Climate-controlled', 'Interior'] },
        { size: '10 × 15', art: '10x15', sqft: 150, fits: 'Two bedrooms + appliances', walkIn: 129, online: 109, tags: ['Drive-up', 'Roll-up door'] },
      ],
    },
    {
      category: 'Large',
      blurb: 'A full household',
      units: [
        { size: '10 × 20', art: '10x20', sqft: 200, fits: 'A three-bedroom home', walkIn: 175, online: 149, tags: ['Drive-up', 'Roll-up door'] },
      ],
    },
    {
      category: 'X-Large',
      blurb: 'A large home or a vehicle',
      units: [
        { size: '10 × 30', art: '10x30', sqft: 300, fits: 'A large home, or a car + household', walkIn: 255, online: 219, tags: ['Drive-up', 'Roll-up door', 'Extra tall'] },
      ],
    },
  ],
  faqs: [
    { q: 'What’s the cheapest space here?', a: 'Our smallest 5×5 spaces start at $29/mo when you reserve online. Prices vary by size, features, and current availability.' },
    { q: 'Do I need a reservation?', a: 'No — you can rent online in minutes, any time of day. Reserving online locks in your online rate and holds the space until you move in.' },
    { q: 'Climate-controlled vs. drive-up?', a: 'Climate-controlled spaces sit inside an insulated building with regulated temperature and humidity — ideal for furniture and electronics. Drive-up spaces let you pull right up to a roll-up door for fast loading.' },
    { q: 'What are the access hours?', a: 'Gate access is 6:00 AM–10:00 PM every day. The front office is open Mon–Fri 8:30 AM–5:00 PM and Sat 8:30 AM–3:00 PM.' },
  ],
}

export const metadata: Metadata = {
  title: 'Storage Spaces on Temple Hall Hwy, Granbury TX | JOURNEY.STORAGE™',
  description:
    'Rent a clean, secure storage space at JOURNEY.STORAGE™ — Temple Hall Hwy in Granbury, TX. Climate-controlled & drive-up spaces from $29/mo. Gated, 24/7 cameras. Reserve online in minutes.',
  alternates: { canonical: '/rentaspace/templehallhwy' },
}

export default function TempleHallPage() {
  return <FacilityView facility={templeHall} />
}
