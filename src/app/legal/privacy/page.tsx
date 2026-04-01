import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Journey.Storage™',
}

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="text-h2 font-bold text-black">Privacy policy</h1>
      <p className="mt-6 text-body text-charcoal">
        Privacy policy coming soon. This page will outline how
        Journey.Storage™ collects, uses, and protects your personal
        information.
      </p>
      <p className="mt-4 text-body-sm text-stone">
        Last updated: March 2026
      </p>
    </article>
  )
}
