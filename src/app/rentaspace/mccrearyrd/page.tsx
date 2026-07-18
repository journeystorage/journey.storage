import type { Metadata } from 'next'
import FacilityView, { type Facility } from '@/components/rentaspace/FacilityView'

const mcCreary: Facility = {
  name: 'McCreary Rd',
  short: 'McCreary Rd',
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
    'Gated entry',
    '24/7 security cameras',
    'Bright LED lighting',
    'Roll-up doors',
    'Ground-level spaces',
    'Newest facility',
    'Online rental & bill pay',
    'Month-to-month leases',
    'Moving carts on-site',
    'Storage protection plan',
  ],
  about: [
    'JOURNEY.STORAGE™ on McCreary Rd is our newest Granbury facility — clean, modern spaces with both climate-controlled interiors and easy drive-up access, just off Cleveland Road near US-377.',
    'Wide concrete drive aisles, bright LED lighting, roll-up doors, and a fully gated perimeter watched around the clock by 24/7 cameras.',
    'Month-to-month, no deposit, and no long-term commitment — reserve online in minutes and move in on your schedule.',
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
  title: 'Storage Spaces on McCreary Rd, Granbury TX | JOURNEY.STORAGE™',
  description:
    'Rent a clean, secure storage space at JOURNEY.STORAGE™ — McCreary Rd in Granbury, TX. Our newest facility with climate-controlled & drive-up spaces from $29/mo. Reserve online in minutes.',
  alternates: { canonical: '/rentaspace/mccrearyrd' },
}

export default function McCrearyPage() {
  return <FacilityView facility={mcCreary} />
}
