import type { Metadata } from 'next'
import { Lato, IBM_Plex_Mono } from 'next/font/google'
import '@/styles/globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Journey.Direct™ — Coming soon | Journey.Storage™',
  description:
    'Built by operators. A direct investment platform for self-storage, on the way. Stay tuned.',
  metadataBase: new URL('https://direct.journey.storage'),
  openGraph: {
    title: 'Journey.Direct™ — Coming soon',
    description: 'Built by operators. A direct investment platform for self-storage, on the way.',
    url: 'https://direct.journey.storage',
    siteName: 'Journey.Direct™',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/images/brand/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lato.variable} ${plexMono.variable}`}>
      <body className="bg-black text-warm-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
