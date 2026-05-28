import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import Image from 'next/image'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Journey.Storage™ — Find your unit',
  description: 'Browse available storage units, compare sizes, and reserve online.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="font-sans antialiased" style={{ backgroundColor: '#F5F0E8', color: '#181818' }}>
        <nav
          className="sticky top-0 z-50 backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(245, 240, 232, 0.95)', borderBottom: '1px solid rgba(24,24,24,0.06)' }}
        >
          <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 lg:px-16">
            <a href="/">
              <Image
                src="/images/logo-dark-TM.svg"
                alt="Journey.Storage™"
                width={180}
                height={24}
                style={{ width: 180, height: 'auto' }}
                priority
              />
            </a>
            <div className="flex items-center gap-8">
              <a
                href="/size-guide"
                className="font-bold transition-colors duration-150 hover:text-orange"
                style={{ fontSize: '0.9375rem', color: '#888680' }}
              >
                Size guide
              </a>
              <span
                className="font-bold uppercase"
                style={{
                  fontSize: '0.8125rem',
                  letterSpacing: '0.1em',
                  color: '#E8622A',
                  border: '1px solid rgba(232,98,42,0.2)',
                  backgroundColor: 'rgba(232,98,42,0.05)',
                  padding: '4px 10px',
                  borderRadius: 4,
                }}
              >
                Lab
              </span>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
