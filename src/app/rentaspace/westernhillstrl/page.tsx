import type { Metadata } from 'next'
import FacilityView, { type Facility } from '@/components/rentaspace/FacilityView'

const westernHills: Facility = {
  name: 'Western Hills Trl',
  short: 'Western Hills Trl',
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
    'Gated entry',
    '24/7 security cameras',
    'Well-lit drive aisles',
    'Roll-up doors',
    'Ground-level spaces',
    'Online rental & bill pay',
    'Month-to-month leases',
    'No long-term commitment',
    'Moving carts on-site',
    'Boxes & moving supplies',
    'Storage protection plan',
  ],
  about: [
    'JOURNEY.STORAGE™ on Western Hills Trail sits just off Highway 377 near Harbor Lakes — 100+ clean, gated drive-up spaces built for easy, roll-up-and-go access.',
    'Pull your vehicle right up to a wide, well-lit roll-up door and load in minutes. Ground-level throughout, fully fenced, and watched around the clock by 24/7 cameras.',
    'Month-to-month, no deposit, and no long-term commitment — rent online in minutes and move in on your schedule.',
  ],
  groups: [
    {
      category: 'Small',
      blurb: 'A closet to a single room',
      units: [
        { size: '5 × 5', art: '5x5', sqft: 25, fits: 'A few boxes & small furniture', walkIn: 35, online: 25, tags: ['Drive-up', 'Ground-level'] },
        { size: '5 × 10', art: '5x10', sqft: 50, fits: 'A studio or one room', walkIn: 52, online: 42, tags: ['Drive-up', 'Ground-level'] },
      ],
    },
    {
      category: 'Medium',
      blurb: 'One to two bedrooms',
      units: [
        { size: '10 × 10', art: '10x10', sqft: 100, fits: 'A one-bedroom apartment', walkIn: 89, online: 72, tags: ['Drive-up', 'Roll-up door'] },
        { size: '10 × 15', art: '10x15', sqft: 150, fits: 'Two bedrooms + appliances', walkIn: 119, online: 99, tags: ['Drive-up', 'Roll-up door'] },
      ],
    },
    {
      category: 'Large',
      blurb: 'A full household',
      units: [
        { size: '10 × 20', art: '10x20', sqft: 200, fits: 'A three-bedroom home', walkIn: 169, online: 139, tags: ['Drive-up', 'Roll-up door'] },
      ],
    },
    {
      category: 'X-Large',
      blurb: 'A large home or a vehicle',
      units: [
        { size: '10 × 30', art: '10x30', sqft: 300, fits: 'A large home, or a car + household', walkIn: 239, online: 199, tags: ['Drive-up', 'Roll-up door', 'Extra tall'] },
      ],
    },
  ],
  faqs: [
    { q: 'What’s the cheapest space here?', a: 'Our smallest 5×5 drive-up spaces start at $25/mo when you reserve online. Prices vary by size and current availability.' },
    { q: 'Do I need a reservation?', a: 'No — you can rent online in minutes, any time of day. Reserving online locks in your online rate and holds the space until you move in.' },
    { q: 'Are all spaces drive-up?', a: 'Yes — Western Hills is a drive-up facility. Every space is ground-level with a roll-up door, so you can pull your vehicle right up and load in minutes. For climate-controlled options, see our Temple Hall Hwy or McCreary Rd locations.' },
    { q: 'What are the access hours?', a: 'Gate access is 6:00 AM–10:00 PM every day. The front office is open Mon–Fri 8:30 AM–5:00 PM and Sat 8:30 AM–3:00 PM.' },
  ],
}

export const metadata: Metadata = {
  title: 'Drive-Up Storage on Western Hills Trl, Granbury TX | JOURNEY.STORAGE™',
  description:
    'Rent a clean, gated drive-up storage space at JOURNEY.STORAGE™ — Western Hills Trl in Granbury, TX. Ground-level spaces from $25/mo, 24/7 cameras. Reserve online in minutes.',
  alternates: { canonical: '/rentaspace/westernhillstrl' },
}

export default function WesternHillsPage() {
  return <FacilityView facility={westernHills} />
}
