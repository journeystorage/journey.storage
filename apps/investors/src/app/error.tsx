'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-5 text-center">
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">
        Something went wrong
      </span>
      <h1 className="mt-4 text-2xl md:text-3xl font-black text-warm-white">
        We hit an unexpected error.
      </h1>
      <p className="mt-4 max-w-[400px] text-body-sm text-warm-white/50">
        Please try again. If it keeps happening, refresh the page.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-sm bg-orange px-7 py-3.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
      >
        Try again
      </button>
    </main>
  )
}
