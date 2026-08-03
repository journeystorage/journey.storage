import type { Metadata } from 'next'
import { Barlow_Condensed, Work_Sans, IBM_Plex_Mono } from 'next/font/google'
import '@/styles/globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-work-sans',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hub — Journey.Storage',
  description: 'Private working hub for Journey.Storage.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${workSans.variable} ${plexMono.variable}`}>
      <body className="bg-surface-base font-sans antialiased">{children}</body>
    </html>
  )
}
