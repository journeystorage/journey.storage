import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Problem from '@/components/sections/Problem'
import Solution from '@/components/sections/Solution'
import HowItWorks from '@/components/sections/HowItWorks'
import Pricing from '@/components/sections/Pricing'
import Founder from '@/components/sections/Founder'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <div className="grain relative bg-black overflow-hidden">
          <HowItWorks />
          <Pricing />
        </div>
        <Founder />
        <FinalCTA />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
