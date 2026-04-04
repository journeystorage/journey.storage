import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Problem from '@/components/sections/Problem'
import Solution from '@/components/sections/Solution'
import Pricing from '@/components/sections/Pricing'
import FAQ from '@/components/sections/FAQ'
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
          <Pricing />
        </div>
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
