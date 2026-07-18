import type { Metadata } from 'next'
import RentASpaceView from '@/components/rentaspace/RentASpaceView'

export const metadata: Metadata = {
  title: 'Rent a Space in Granbury, TX | Journey Storage',
  description:
    'Clean, secure, month-to-month self storage in Granbury, TX. Three gated facilities — climate-controlled & drive-up units. Find a unit near you and rent online in minutes.',
  alternates: { canonical: '/rentaspace' },
}

export default function RentASpacePage() {
  return <RentASpaceView />
}
