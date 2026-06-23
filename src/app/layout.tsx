import Script from 'next/script'
import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import { socialUrls } from '@/lib/constants'
import '@/styles/globals.css'

// Organization structured data — tells Google the official company name, logo,
// and social profiles (helps logo/brand display and knowledge-panel eligibility).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Journey.Storage',
  alternateName: 'Journey.Storage™',
  url: 'https://journey.storage',
  logo: 'https://journey.storage/images/brand/logo-dark-TM.svg',
  description:
    'A new kind of self-storage company — 100% digital, 24/7 access, month-to-month with no hidden fees. Built for people in motion.',
  sameAs: [socialUrls.instagram, socialUrls.linkedin, socialUrls.facebook],
}

const GTM_ID = 'GTM-NL5KP8QJ'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Journey.Storage™ — Modern Self-Storage. Space to move on.',
  description:
    'A new kind of self-storage — 100% digital, 24/7 access, month-to-month, no hidden fees. Built for people in motion, not boxes sitting still.',
  metadataBase: new URL('https://journey.storage'),
  openGraph: {
    title: 'Journey.Storage™ — Modern Self-Storage. Space to move on.',
    description:
      'A new kind of self-storage — 100% digital, 24/7 access, month-to-month, no hidden fees. Built for people in motion, not boxes sitting still.',
    url: 'https://journey.storage',
    siteName: 'Journey.Storage™',
    images: [
      {
        url: '/images/brand/og-image-default.png',
        width: 1200,
        height: 630,
        alt: 'Journey.Storage™ — Modern Self-Storage. Space to move on.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journey.Storage™ — Modern Self-Storage. Space to move on.',
    description:
      'A new kind of self-storage — 100% digital, 24/7 access, month-to-month, no hidden fees. Built for people in motion, not boxes sitting still.',
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
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <body className="bg-black text-black font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
