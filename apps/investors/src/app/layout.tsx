import Script from 'next/script'
import type { Metadata } from 'next'
import { Lato, IBM_Plex_Mono } from 'next/font/google'
import '@/styles/globals.css'

const GTM_ID = 'GTM-PK22Z6BM'

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
  title: 'Journey.Direct™ — Direct investment in self-storage | Journey.Storage™',
  description:
    'Operator-led direct investment in self-storage. Value-add acquisitions in high-demand U.S. markets. For accredited investors. Part of the Journey.Storage ecosystem.',
  metadataBase: new URL('https://direct.journey.storage'),
  openGraph: {
    title: 'Journey.Direct™ — Direct investment in self-storage',
    description: 'Operator-led direct investment in self-storage. Value-add acquisitions in high-demand U.S. markets. For accredited investors.',
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
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <body className="bg-black text-warm-white font-sans antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
