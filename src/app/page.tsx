import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import MarqueeBanner from '@/components/sections/MarqueeBanner'
import LifeMoments from '@/components/sections/LifeMoments'
import BrandPositioning from '@/components/sections/BrandPositioning'
import HowItWorks from '@/components/sections/HowItWorks'
import Differentiators from '@/components/sections/Differentiators'
import LocationsMap from '@/components/sections/LocationsMap'
import FoundedBy from '@/components/sections/FoundedBy'
import Waitlist from '@/components/sections/Waitlist'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MarqueeBanner />
        <LifeMoments />
        <BrandPositioning />
        <HowItWorks />
        <Differentiators />
        <LocationsMap />
        <FoundedBy />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
