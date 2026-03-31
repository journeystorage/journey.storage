import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import '@/styles/globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Journey.Storage™ — Space to move on.',
  description:
    'Journey.Storage™ is a new kind of self-storage company — built for the moments that matter. Space to move on.',
  metadataBase: new URL('https://journey.storage'),
  openGraph: {
    title: 'Journey.Storage™ — Space to move on.',
    description:
      'Journey.Storage™ is a new kind of self-storage company — built for the moments that matter. Space to move on.',
    url: 'https://journey.storage',
    siteName: 'Journey.Storage™',
    images: [
      {
        url: '/images/brand/og-image-default.png',
        width: 1200,
        height: 630,
        alt: 'Journey.Storage™ — Space to move on.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journey.Storage™ — Space to move on.',
    description:
      'Journey.Storage™ is a new kind of self-storage company — built for the moments that matter. Space to move on.',
    images: ['/images/brand/og-image-default.png'],
  },
  icons: {
    icon: '/images/brand/favicon.svg',
    apple: '/images/brand/apple-touch-icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="bg-black text-black font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
