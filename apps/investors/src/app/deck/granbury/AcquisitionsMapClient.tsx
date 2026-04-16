'use client'

import dynamic from 'next/dynamic'

const AcquisitionsMap = dynamic(() => import('./AcquisitionsMap'), { ssr: false })

export default function AcquisitionsMapClient() {
  return <AcquisitionsMap />
}
