'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-warm-white px-5 text-center">
      <span className="text-label font-bold uppercase tracking-[0.1em] text-orange">
        Something went wrong
      </span>
      <h1 className="mt-4 text-h2 font-bold text-black">
        This journey hit a snag.
      </h1>
      <p className="mt-4 max-w-[400px] text-body text-stone">
        An unexpected error occurred. Please try again, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Link href="/" className="text-body-sm font-bold text-black underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </main>
  )
}
