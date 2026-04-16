import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journey.Direct™ — Granbury (Print)',
  robots: { index: false, follow: false },
}

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
