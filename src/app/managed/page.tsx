import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ManagedView from '@/components/managed/ManagedView'

export const metadata: Metadata = {
  title: 'Journey Managed™ — Third-Party Self-Storage Management',
  description:
    'Tech-first, quality-driven third-party management and full bookkeeping for independent self-storage owners. One transparent flat fee. Operated the way we run our own facilities.',
  openGraph: {
    title: 'Journey Managed™ — Third-Party Self-Storage Management',
    description:
      'Tech-first management + bookkeeping for independent self-storage owners. Your facility, operated the way we run our own, at one transparent fee.',
    type: 'website',
  },
}

export default function ManagedPage() {
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
