import Script from 'next/script'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { socialUrls } from '@/lib/constants'
import '@/styles/globals.css'
import SizeGuideModal from '@/components/SizeGuideModal'

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

// WebSite structured data — names the site for sitelinks/brand results. The
// per-facility SelfStorage entities live on each facility page (they used to
// be emitted here on every route, which duplicated them on the facility pages
// and would bloat the homepage as more locations open).
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Journey.Storage',
  url: 'https://journey.storage',
  publisher: { '@type': 'Organization', name: 'Journey.Storage', url: 'https://journey.storage' },
}

const GTM_ID = 'GTM-NL5KP8QJ'

// Lato is self-hosted, NOT loaded from next/font/google.
//
// Google Fonts serves Lato in 300/400/700/900 only — requesting weights 500, 600
// or 800 returns HTTP 400. Weight 800 (Heavy) sets the bold phrase in every
// heading and is the core of the brand's type system (see BRAND_GUIDELINES.md
// § The Heading Pattern), so Google is not a viable source.
//
// Files in src/fonts/ are subset to the Latin range (English, Spanish,
// Portuguese, French, German) — ~260KB for 9 faces, down from 1.5MB unsubset.
// Regenerate with scripts/subset-fonts.sh.
const lato = localFont({
  src: [
    { path: '../fonts/Lato-Light.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/Lato-LightItalic.woff2', weight: '300', style: 'italic' },
    { path: '../fonts/Lato-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Lato-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Lato-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Lato-SemiboldItalic.woff2', weight: '600', style: 'italic' },
    { path: '../fonts/Lato-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Lato-Heavy.woff2', weight: '800', style: 'normal' },
    { path: '../fonts/Lato-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-lato',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})


export const metadata: Metadata = {
  title: 'Self Storage, Rent Online, Month-to-Month | JOURNEY.STORAGE™',
  description:
    'Self storage built for people in motion. Smart entry, 24/7 access, month-to-month, no hidden fees. Rent online in minutes. Now open in Granbury, Texas.',
  metadataBase: new URL('https://journey.storage'),
  openGraph: {
    title: 'Self Storage, Rent Online, Month-to-Month | JOURNEY.STORAGE™',
    description:
      'Self storage built for people in motion. Smart entry, 24/7 access, month-to-month, no hidden fees. Rent online in minutes. Now open in Granbury, Texas.',
    url: 'https://journey.storage',
    siteName: 'Journey.Storage™',
    images: [
      {
        url: '/images/brand/og-image-default.png',
        width: 1200,
        height: 630,
        alt: 'JOURNEY.STORAGE™ — Self storage. Space to move on.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self Storage, Rent Online, Month-to-Month | JOURNEY.STORAGE™',
    description:
      'Self storage built for people in motion. Smart entry, 24/7 access, month-to-month, no hidden fees. Rent online in minutes. Now open in Granbury, Texas.',
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
      {/* journey_property is mapped to GA4 content_group in GTM, so sibling
          sites sharing this container (managed.journey.storage) stay separable
          in standard reports — page paths alone collide on "/". */}
      <Script id="gtm" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ journey_property: 'Main Site' });
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
        <SizeGuideModal />
      </body>
    </html>
  )
}
