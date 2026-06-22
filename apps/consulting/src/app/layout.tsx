import Script from 'next/script'
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

const GTM_ID = 'GTM-54GBZ4GW'
const GA4_ID = 'G-77Z6DN08S9'

export const metadata: Metadata = {
  title: 'Journey.Advisory™ — Fractional Acquisitions & Advisory | Journey.Storage™',
  description:
    'Institutional-grade self-storage advisory without hiring a full-time team. Direct access to $200M+ in transaction expertise. Monthly subscription, cancel anytime.',
  metadataBase: new URL('https://advisory.journey.storage'),
  openGraph: {
    title: 'Journey.Advisory™ — Fractional Acquisitions & Advisory',
    description:
      'Institutional-grade self-storage advisory without hiring a full-time team. Direct access to $200M+ in transaction expertise.',
    url: 'https://advisory.journey.storage',
    siteName: 'Journey.Advisory™',
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
    <html lang="en" className={lato.variable}>
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      {/* Google Analytics 4 (gtag.js) — loaded directly so it does not depend on GTM */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_ID}');
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
