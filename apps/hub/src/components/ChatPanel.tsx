'use client'

import { useEffect, useRef, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubChatMessage } from '@/lib/types'

interface ChatTurn {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  employeeId?: string
  name: string
  subtitle?: string
  accent?: string
  placeholder?: string
  emptyHint: string
}

const VOICE_PREF_KEY = 'hub-voice-enabled'

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

export function ChatPanel({ employeeId, name, subtitle, accent, placeholder, emptyHint }: ChatPanelProps) {
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVoiceSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    setVoiceEnabled(localStorage.getItem(VOICE_PREF_KEY) === 'true')
  }, [])

  useEffect(() => {
    async function loadHistory() {
      const supabase = getSupabaseBrowser()
      let query = supabase.from('hub_chat_messages').select('*').order('created_at', { ascending: true }).limit(100)
      query = employeeId ? query.eq('employee_id', employeeId) : query.is('employee_id', null)
      const { data } = await query
      setTurns(((data as HubChatMessage[]) ?? []).map((m) => ({ id: m.id, role: m.role, content: m.content })))
    }
    loadHistory()
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [employeeId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns])

  function toggleVoice() {
    const next = !voiceEnabled
    setVoiceEnabled(next)
    localStorage.setItem(VOICE_PREF_KEY, String(next))
    if (!next) window.speechSynthesis?.cancel()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    setInput('')
    setSending(true)
    const userTurn: ChatTurn = { id: `local-${Date.now()}`, role: 'user', content: text }
    const assistantId = `local-${Date.now()}-a`
    setTurns((prev) => [...prev, userTurn, { id: assistantId, role: 'assistant', content: '' }])

    let fullReply = ''

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, employeeId }),
      })

      if (!res.body) throw new Error('No response stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullReply += chunk
        setTurns((prev) =>
          prev.map((t) => (t.id === assistantId ? { ...t, content: t.content + chunk } : t)),
        )
      }

      if (voiceEnabled) speak(fullReply)
    } catch {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === assistantId ? { ...t, content: `Something went wrong reaching ${name} — try again.` } : t,
        ),
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b border-surface-border px-8 py-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="hub-pulse-dot h-2 w-2 rounded-full"
              style={{ backgroundColor: accent ?? 'var(--color-cyan)' }}
              aria-hidden
            />
            <h1 className="font-display text-h2 font-bold uppercase tracking-wide text-warm-white">{name}</h1>
          </div>
          {subtitle && <p className="mt-1 font-sans text-body-sm text-stone">{subtitle}</p>}
        </div>
        {voiceSupported && (
          <button
            onClick={toggleVoice}
            aria-pressed={voiceEnabled}
            className={`rounded-full px-3 py-1 font-sans text-body-sm transition-colors duration-150 ${
              voiceEnabled ? 'bg-cyan text-black' : 'bg-surface-elevated text-stone hover:text-warm-white'
            }`}
          >
            {voiceEnabled ? 'Voice: On' : 'Voice: Off'}
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {turns.length === 0 && <p className="font-sans text-body-sm text-stone">{emptyHint}</p>}
          {turns.map((turn) => (
            <div
              key={turn.id}
              className={`hub-fade-up max-w-[85%] rounded-lg px-4 py-2.5 font-sans text-body ${
                turn.role === 'user' ? 'ml-auto bg-cyan text-black' : 'bg-surface-elevated text-warm-white'
              }`}
            >
              {turn.content || (turn.role === 'assistant' ? '…' : '')}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-surface-border px-8 py-5">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder ?? `Message ${name}…`}
            disabled={sending}
            suppressHydrationWarning
            className="flex-1 rounded-md border border-surface-border bg-surface-elevated px-3 py-2.5 font-sans text-body text-warm-white placeholder:text-stone/60 focus:border-cyan focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-md bg-cyan px-4 py-2.5 font-sans text-body-sm font-semibold text-black transition-transform duration-150 hover:bg-cyan-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
