'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(
    initialError === 'unauthorized' ? "That account isn't authorized for the hub." : null,
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setPending(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="hud-panel hub-fade-up w-full max-w-sm p-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="hub-pulse-dot h-2 w-2 rounded-full bg-cyan" aria-hidden />
          <p className="hud-label">Journey.Storage</p>
        </div>
        <h1 className="mb-6 font-display text-h1 font-black uppercase leading-none tracking-tight text-warm-white">
          Hub
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block font-sans text-label font-semibold uppercase tracking-[0.12em] text-stone">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-md border border-surface-border bg-surface-base px-3 py-2.5 font-sans text-body text-warm-white placeholder:text-stone/60 focus:border-cyan focus:outline-none"
              placeholder="lyvia@journey.storage"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block font-sans text-label font-semibold uppercase tracking-[0.12em] text-stone">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-md border border-surface-border bg-surface-base px-3 py-2.5 font-sans text-body text-warm-white focus:border-cyan focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="font-sans text-body-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-cyan px-4 py-2.5 font-sans text-body font-semibold text-black transition-transform duration-150 ease-out hover:bg-cyan-400 active:scale-[0.98] active:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
