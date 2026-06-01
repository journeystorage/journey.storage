import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import MarqueeBanner from '@/components/sections/MarqueeBanner'
import LifeMoments from '@/components/sections/LifeMoments'
import HowItWorks from '@/components/sections/HowItWorks'
import Differentiators from '@/components/sections/Differentiators'
import LocationsMap from '@/components/sections/LocationsMap'
import AboutFounder from '@/components/sections/AboutFounder'
import FAQ from '@/components/sections/FAQ'
import Waitlist from '@/components/sections/Waitlist'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MarqueeBanner />
        <LifeMoments />
        <HowItWorks />
        <Differentiators />
        <LocationsMap />
        <AboutFounder />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
