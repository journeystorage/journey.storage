import type { Metadata } from 'next'
import RentASpaceView from '@/components/rentaspace/RentASpaceView'
import { hubFaqs } from '@/components/rentaspace/hub-content'
import { facilities } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Storage Locations, Find a Space Near You | JOURNEY.STORAGE™',
  description:
    'Find a Journey self storage location and rent online. Now open in Granbury, TX: three gated locations, climate-controlled and drive-up units, from $25/mo.',
  alternates: { canonical: '/rentaspace' },
}

// The hub is the locations index: an ItemList of every facility (each facility
// page carries its own full SelfStorage entity), breadcrumbs, and the FAQ.
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Journey.Storage locations',
  itemListOrder: 'https://schema.org/ItemListUnordered',
  numberOfItems: facilities.length,
  itemListElement: facilities.map((f, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `Journey.Storage — ${f.name}, ${f.city}, ${f.region}`,
    url: `https://journey.storage/rentaspace/${f.slug}`,
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://journey.storage/' },
    { '@type': 'ListItem', position: 2, name: 'Rent a Space', item: 'https://journey.storage/rentaspace' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: hubFaqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function RentASpacePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <RentASpaceView />
    </>
  )
}
