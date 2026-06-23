import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-5 text-center">
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-orange">404</span>
      <h1 className="mt-4 text-2xl md:text-3xl font-black text-warm-white">
        This page took a wrong turn.
      </h1>
      <p className="mt-4 max-w-[400px] text-body-sm text-warm-white/50">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-sm bg-orange px-7 py-3.5 text-body-sm font-bold text-warm-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        Back to home
      </Link>
    </main>
  )
}
