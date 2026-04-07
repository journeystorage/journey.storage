'use client'

import { useState, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import ComingSoonHero from '@/components/sections/ComingSoonHero'
import LeadCaptureModal from '@/components/ui/LeadCaptureModal'
import { CALENDAR_URL } from '@/lib/constants'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <main>
      <Navbar onBookCall={openModal} />
      <ComingSoonHero onBookCall={openModal} />
      <LeadCaptureModal
        open={modalOpen}
        onClose={closeModal}
        redirectUrl={CALENDAR_URL}
      />
    </main>
  )
}
