import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-warm-white px-5 text-center">
      <span className="text-label font-bold uppercase tracking-[0.1em] text-orange">
        404
      </span>
      <h1 className="mt-4 text-h2 font-bold text-black">
        Looks like this journey took a wrong turn.
      </h1>
      <p className="mt-4 max-w-[400px] text-body text-stone">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary">Back to home</Button>
      </Link>
    </main>
  )
}
