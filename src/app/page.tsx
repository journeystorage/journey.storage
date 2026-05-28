'use client'

import { useState, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import MarketThesis from '@/components/sections/MarketThesis'
import Strategy from '@/components/sections/Strategy'
import Leadership from '@/components/sections/Leadership'
import Opportunities from '@/components/sections/Opportunities'
import Process from '@/components/sections/Process'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'
import LeadCaptureModal from '@/components/ui/LeadCaptureModal'
import { CALENDAR_URL } from '@/lib/constants'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <main>
      <Navbar onBookCall={openModal} showNavLinks />
      <Hero onBookCall={openModal} />
      <MarketThesis />
      <Strategy />
      <Leadership />
      <Opportunities onBookCall={openModal} />
      <Process />
      <FAQ />
      <FinalCTA onBookCall={openModal} />
      <Footer />
      <LeadCaptureModal
        open={modalOpen}
        onClose={closeModal}
        redirectUrl={CALENDAR_URL}
      />
    </main>
  )
}
