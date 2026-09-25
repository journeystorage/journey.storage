// Content shared between the /rentaspace page (JSON-LD) and its view (render),
// so the FAQPage schema and the visible questions never drift apart.

export const hubFaqs = [
  {
    q: 'How do I choose a Journey location?',
    a: 'Pick the one nearest you, then check the type: climate-controlled for anything heat ruins, drive-up for anything you load often. Every location has the same smart entry, pricing rules and month-to-month terms.',
  },
  {
    q: 'Where does Journey have storage locations?',
    a: 'Three in Granbury, Texas today: Temple Hall Hwy, Western Hills Trail and McCreary Rd. Malakoff, near Cedar Creek Lake, is next. New markets are added to this page as they open.',
  },
  {
    q: 'How much do storage units cost in Granbury?',
    a: 'Online rates start at $25 a month for a 5×5 and run to about $200 for a 10×30. Climate-controlled spaces cost a little more than drive-up. You see the price before you rent, and the first month is half off on select sizes.',
  },
  {
    q: 'Which Journey location is closest to Lake Granbury?',
    a: 'Western Hills Trail, by the Harbor Lakes neighborhood on the west side of town. Temple Hall Hwy is a few minutes further and has climate-controlled spaces.',
  },
  {
    q: 'Do you have climate-controlled storage in Granbury?',
    a: 'Yes, at Temple Hall Hwy and McCreary Rd. Western Hills Trail is drive-up only.',
  },
  {
    q: 'Can I get into my storage unit at night?',
    a: 'Yes. The gate and your space open from your phone, any hour, every day of the year.',
  },
  {
    q: 'Is there a long-term contract?',
    a: 'No. Month-to-month, no deposit, and move-out is a photo in the app.',
  },
  {
    q: 'Do you offer business and contractor storage?',
    a: 'Yes. Small businesses, contractors and home offices rent the same units on the same month-to-month terms: drive-up units for tools, equipment and inventory, climate-controlled units for records and samples. The gate opens from your phone any hour, so early starts and late returns are no problem.',
  },
  {
    q: 'Do you serve towns outside Granbury?',
    a: 'Yes. Acton, DeCordova, Tolar, Cresson, Glen Rose and Stephenville customers all use these three locations. All of Hood County is an easy drive on 377 or 144.',
  },
] as const

// Business storage use cases for the hub's "Business storage in Granbury"
// section. Each card links to the location or section that fits the use.
export const businessUses = [
  {
    title: 'Contractors & equipment',
    body: 'Drive-up storage units for tools, materials and equipment. Pull the truck up, roll the door, load, go. Western Hills Trail is all drive-up.',
    href: '/rentaspace/westernhillstrl',
    cta: 'See Western Hills Trl',
  },
  {
    title: 'Inventory & overflow',
    body: 'E-commerce stock, seasonal merchandise, event gear. Sizes from 5×10 to 10×30 on month-to-month terms, so your storage grows and shrinks with sales.',
    href: '/rentaspace#sizes',
    cta: 'Compare sizes',
  },
  {
    title: 'Records & documents',
    body: 'Files, samples and anything paper belong in a climate-controlled unit at Temple Hall Hwy or McCreary Rd, out of the Texas heat.',
    href: '/rentaspace/templehallhwy',
    cta: 'See Temple Hall Hwy',
  },
] as const

// "From" prices are the lowest online rate for that size across the three
// Granbury locations (curated fallback data on the facility pages). Replace
// with live Tenant Inc pricing when the API is wired in.
export const sizeRows = [
  { label: 'Small storage units', sizes: '5×5 · 5×10', fits: 'Boxes, a dorm room, seasonal gear.', from: 25, art: '5x10' },
  { label: 'Medium storage units', sizes: '10×10 · 10×15', fits: 'A one- or two-bedroom apartment.', from: 72, art: '10x10' },
  { label: 'Large storage units', sizes: '10×20', fits: 'A three-bedroom house, or a car.', from: 139, art: '10x20' },
  { label: 'Extra-large storage units', sizes: '10×30', fits: 'A large home, or a vehicle plus the boxes.', from: 199, art: '10x30' },
] as const
