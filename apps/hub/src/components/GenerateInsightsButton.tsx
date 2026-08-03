'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function GenerateInsightsButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/insights/generate', { method: 'POST' })
      if (!res.ok) throw new Error('Generation failed')
      router.refresh()
    } catch {
      setError("Couldn't generate insights — try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        className="rounded-md bg-violet px-4 py-2 font-sans text-body-sm font-semibold text-black transition-transform duration-150 hover:bg-violet/80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Analyzing…' : 'Generate insights'}
      </button>
      {error && <p className="mt-2 font-sans text-body-sm text-danger">{error}</p>}
    </div>
  )
}
