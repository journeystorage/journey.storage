import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ManagedView from '@/components/managed/ManagedView'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ManagedView />
      </main>
      <Footer />
    </>
  )
}
