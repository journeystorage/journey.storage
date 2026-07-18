import type { Metadata } from 'next'
import FacilityView, { type Facility } from '@/components/rentaspace/FacilityView'

const templeHall: Facility = {
  name: 'Journey Storage — Temple Hall Hwy',
  short: 'Temple Hall',
  address: '212 Temple Hall Hwy',
  city: 'Granbury, TX 76049',
  phone: '(817) 579-0607',
  tel: 'tel:+18175790607',
  rating: '5.0',
  reviews: 128,
  hero: '/images/granbury/th-hero.webp',
  gallery: [
    { src: '/images/granbury/th-g-aerial.webp', alt: 'Aerial view of the Temple Hall facility' },
    { src: '/images/granbury/th-g-climate.webp', alt: 'Climate-controlled interior units' },
    { src: '/images/granbury/th-g-office.webp', alt: 'Rental office' },
    { src: '/images/granbury/th-g-gate.webp', alt: 'Gated entry' },
  ],
  mapQuery: '212 Temple Hall Hwy, Granbury, TX 76049',
  officeHours: ['Mon–Fri: 8:30 AM – 5:00 PM', 'Sat: 8:30 AM – 3:00 PM', 'Sun: Closed'],
  gateHours: '6:00 AM – 10:00 PM daily',
  amenities: [
    'Climate-controlled units',
    'Drive-up access',
    'Gated entry',
    '24/7 security cameras',
    'Bright LED lighting',
    'Roll-up doors',
    'Ground-level units',
    'Online rental & bill pay',
    'Month-to-month leases',
    'Moving carts on-site',
    'Boxes & moving supplies',
    'Storage protection plan',
  ],
  about: [
    'Journey Storage on Temple Hall Highway is our flagship Granbury facility — 350+ clean, secure units set on landscaped grounds just minutes from Lake Granbury, downtown, and the Highway 377 corridor.',
    'Whether you need a breezy drive-up space for seasonal gear or a fully climate-controlled unit for furniture and keepsakes, you’ll find wide, well-lit aisles, roll-up doors, a friendly on-site office, and a gated perimeter watched around the clock.',
    'Month-to-month, no deposit, and no long-term commitment — rent online in minutes and move in on your schedule.',
  ],
  groups: [
    {
      category: 'Small',
      blurb: 'A closet to a single room',
      units: [
        { size: '5 × 5', sqft: 25, fits: 'A few boxes & small furniture', walkIn: 39, online: 29, tags: ['Climate-controlled', 'Interior', 'Ground-level'] },
        { size: '5 × 10', sqft: 50, fits: 'A studio or one room', walkIn: 55, online: 45, tags: ['Drive-up', 'Ground-level'] },
      ],
    },
    {
      category: 'Medium',
      blurb: 'One to two bedrooms',
      units: [
        { size: '10 × 10', sqft: 100, fits: 'A one-bedroom apartment', walkIn: 95, online: 79, tags: ['Climate-controlled', 'Interior'] },
        { size: '10 × 15', sqft: 150, fits: 'Two bedrooms + appliances', walkIn: 129, online: 109, tags: ['Drive-up', 'Roll-up door'] },
      ],
    },
    {
      category: 'Large',
      blurb: 'A full household',
      units: [
        { size: '10 × 20', sqft: 200, fits: 'A three-bedroom home', walkIn: 175, online: 149, tags: ['Drive-up', 'Roll-up door'] },
      ],
    },
    {
      category: 'X-Large',
      blurb: 'A large home or a vehicle',
      units: [
        { size: '10 × 30', sqft: 300, fits: 'A large home, or a car + household', walkIn: 255, online: 219, tags: ['Drive-up', 'Roll-up door', 'Extra tall'] },
      ],
    },
  ],
  faqs: [
    {
      q: 'What’s the cheapest unit at Journey Storage — Temple Hall?',
      a: 'Our smallest 5×5 units start at $29/mo when you reserve online. Prices vary by size, features (climate-controlled vs. drive-up), and current availability.',
    },
    {
      q: 'Do I need a reservation to rent?',
      a: 'No — you can rent online in minutes, any time of day. Reserving online simply locks in your online rate and holds the unit until you’re ready to move in.',
    },
    {
      q: 'What’s the difference between climate-controlled and drive-up units?',
      a: 'Climate-controlled units sit inside an insulated building with regulated temperature and humidity — ideal for furniture, electronics, and keepsakes. Drive-up units let you pull your vehicle right up to a roll-up door for quick, easy loading and unloading.',
    },
    {
      q: 'What are the access hours?',
      a: 'Gate access is 6:00 AM–10:00 PM every day. The front office is open Mon–Fri 8:30 AM–5:00 PM and Sat 8:30 AM–3:00 PM (closed Sunday).',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Storage Units on Temple Hall Hwy, Granbury TX | Journey Storage',
  description:
    'Rent a clean, secure storage unit at Journey Storage — Temple Hall Hwy in Granbury, TX. Climate-controlled & drive-up units from $29/mo. Gated, 24/7 cameras. Reserve online in minutes.',
  alternates: { canonical: '/rentaspace/templehallhwy' },
}

export default function TempleHallPage() {
  return <FacilityView facility={templeHall} />
}
