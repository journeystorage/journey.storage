import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Journey.Storage™',
}

export default function TermsPage() {
  return (
    <article>
      <h1 className="text-h2 font-bold text-black">Terms of service</h1>
      <p className="mt-6 text-body text-charcoal">
        Terms of service coming soon. This page will detail the terms and
        conditions governing your use of the Journey.Storage™ website and
        services.
      </p>
      <p className="mt-4 text-body-sm text-stone">
        Last updated: March 2026
      </p>
    </article>
  )
}
