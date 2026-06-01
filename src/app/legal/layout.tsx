import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="bg-warm-white pt-[72px]">
        <div className="mx-auto max-w-[800px] px-5 py-24 md:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
