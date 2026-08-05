'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Linkified } from '@/components/Linkified'

// Jarvis, omnipresent. A floating command line docked bottom-right on every
// page (except /chat, where the full panel lives). Streams from the same
// /api/chat route, so anything typed here lands in the same history and can
// use every tool Jarvis has.
export function JarvisDock() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [reply, setReply] = useState('')
  const [lastAsk, setLastAsk] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const replyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    replyRef.current?.scrollTo({ top: replyRef.current.scrollHeight })
  }, [reply])

  // Cmd/Ctrl+J summons Jarvis from anywhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (pathname === '/chat') return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return

    setInput('')
    setLastAsk(text)
    setReply('')
    setBusy(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.body) throw new Error('no stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setReply((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch {
      setReply('Something went wrong reaching Jarvis. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="hub-fade-up w-[380px] rounded-lg border border-cyan/25 bg-surface-floating/95 backdrop-blur-md"
          style={{ boxShadow: 'var(--shadow-floating)' }}
        >
          <div className="flex items-center justify-between border-b border-surface-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="hub-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />
              <span className="hud-label text-warm-white">Jarvis</span>
            </div>
            <Link href="/chat" className="hud-label transition-colors duration-150 hover:text-cyan">
              Full view →
            </Link>
          </div>

          {(lastAsk || reply) && (
            <div ref={replyRef} className="max-h-64 space-y-2.5 overflow-y-auto px-4 py-3">
              {lastAsk && (
                <p className="font-sans text-body-sm text-stone">
                  <span className="text-cyan">›</span> {lastAsk}
                </p>
              )}
              <p className="whitespace-pre-wrap font-sans text-body-sm text-warm-white">
                {reply ? <Linkified text={reply} /> : busy ? '…' : ''}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-surface-border p-2.5">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={busy ? 'Jarvis is working…' : 'Command or ask anything…'}
              disabled={busy}
              className="w-full rounded-md border border-surface-border bg-surface-elevated px-3 py-2 font-sans text-body-sm text-warm-white placeholder:text-stone/60 focus:border-cyan focus:outline-none disabled:opacity-60"
            />
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close Jarvis' : 'Summon Jarvis'}
        aria-expanded={open}
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-transform duration-150 ease-out hover:scale-105 active:scale-95 ${
          open ? 'border-cyan bg-cyan text-black' : 'border-cyan/40 bg-surface-floating text-cyan'
        }`}
        style={{ boxShadow: 'var(--shadow-glow-cyan)' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="10" r="3" fill="currentColor" />
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
        </svg>
      </button>
    </div>
  )
}
