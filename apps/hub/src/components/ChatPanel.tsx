'use client'

import { useEffect, useRef, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Linkified } from '@/components/Linkified'
import { extractFileText, EXTRACTABLE_ACCEPT, EXTRACTABLE_LABEL } from '@/lib/extract-text'
import type { HubChatMessage } from '@/lib/types'
import type { Conversation as ElevenLabsConversation } from '@elevenlabs/client'

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

function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
    onEnd?.()
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  utterance.pitch = 1
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

// Minimal Web Speech API typings — not in TS's dom lib.
interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>
}

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => SpeechRecognitionLike) | null
}

export function ChatPanel({ employeeId, name, subtitle, accent, placeholder, emptyHint }: ChatPanelProps) {
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [micSupported, setMicSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [docCount, setDocCount] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const scrollRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const callRef = useRef<ElevenLabsConversation | null>(null)

  useEffect(() => {
    setVoiceSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    setMicSupported(getSpeechRecognition() !== null)
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

    async function loadDocCount() {
      if (!employeeId) return
      const supabase = getSupabaseBrowser()
      const { count } = await supabase
        .from('hub_employee_docs')
        .select('id', { count: 'exact', head: true })
        .eq('employee_id', employeeId)
      setDocCount(count ?? 0)
    }
    loadDocCount()

    return () => {
      window.speechSynthesis?.cancel()
      recognitionRef.current?.abort()
    }
  }, [employeeId])

  const MAX_DOC_CHARS = 120_000

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length || !employeeId) return

    setUploading(true)
    const supabase = getSupabaseBrowser()
    let added = 0
    for (const file of files) {
      const text = await extractFileText(file)
      if (!text) continue
      const { error } = await supabase.from('hub_employee_docs').insert({
        employee_id: employeeId,
        filename: file.name,
        content: text.slice(0, MAX_DOC_CHARS),
      })
      if (!error) added++
    }
    setDocCount((prev) => (prev ?? 0) + added)
    setUploading(false)
    if (added > 0) {
      setTurns((prev) => [
        ...prev,
        {
          id: `local-doc-${Date.now()}`,
          role: 'assistant',
          content: `Got ${added} file${added === 1 ? '' : 's'} — added to my library. I'll use ${added === 1 ? 'it' : 'them'} as context from now on.`,
        },
      ])
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns])

  useEffect(() => {
    return () => {
      callRef.current?.endSession()
    }
  }, [])

  // Real back-and-forth voice via ElevenLabs — Jarvis only (employeeId is
  // undefined here). The Hub's own logic (context, tools, RLS-equivalent
  // scoping) stays the source of truth: this just opens a live audio
  // session against api/voice/completions, the same Jarvis brain the text
  // chat uses, over a different transport.
  async function startVoiceCall() {
    if (callRef.current) return
    setCallStatus('connecting')
    try {
      const res = await fetch('/api/voice/session', { method: 'POST' })
      if (!res.ok) throw new Error('could not start voice session')
      const { signedUrl, userEmail, userName } = await res.json()

      const { Conversation } = await import('@elevenlabs/client')
      const conversation = await Conversation.startSession({
        signedUrl,
        dynamicVariables: { user_email: userEmail, user_name: userName },
        onConnect: () => setCallStatus('connected'),
        onDisconnect: () => {
          callRef.current = null
          setCallStatus('idle')
        },
        onError: () => {
          callRef.current = null
          setCallStatus('error')
        },
        onMessage: ({ message, role }) => {
          setTurns((prev) => [
            ...prev,
            { id: `voice-${Date.now()}-${role}`, role: role === 'agent' ? 'assistant' : 'user', content: message },
          ])
        },
      })
      callRef.current = conversation
    } catch {
      setCallStatus('error')
    }
  }

  function endVoiceCall() {
    callRef.current?.endSession()
    callRef.current = null
    setCallStatus('idle')
  }

  // Auto-starts the call the moment this page opens — by explicit request,
  // with the tradeoff spelled out first: the mic goes live immediately,
  // every time this page is open, not just when you mean to talk. Jarvis
  // only; department employees still use the click-to-talk browser mic.
  useEffect(() => {
    if (!employeeId) startVoiceCall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleVoice() {
    const next = !voiceEnabled
    setVoiceEnabled(next)
    localStorage.setItem(VOICE_PREF_KEY, String(next))
    if (!next) window.speechSynthesis?.cancel()
  }

  function stopListening() {
    recognitionRef.current?.abort()
    recognitionRef.current = null
    setListening(false)
  }

  function startListening() {
    const SpeechRecognitionCtor = getSpeechRecognition()
    if (!SpeechRecognitionCtor || sending) return

    window.speechSynthesis?.cancel()
    stopListening()

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) final += result[0].transcript
        else interim += result[0].transcript
      }
      if (interim) setInput(interim)
      if (final.trim()) {
        setInput('')
        recognitionRef.current = null
        setListening(false)
        recognition.abort()
        void sendMessage(final.trim(), true)
      }
    }
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null
        setListening(false)
      }
    }
    recognition.onerror = recognition.onend

    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  async function sendMessage(text: string, fromVoice = false) {
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

      // Spoke to him -> he speaks back, no toggle required. The Voice toggle
      // still controls whether typed messages get spoken replies. After
      // speaking, the mic reopens so the conversation keeps flowing.
      if (fromVoice) {
        speak(fullReply, () => startListening())
      } else if (voiceEnabled) {
        speak(fullReply)
      }
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void sendMessage(input.trim())
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
        <div className="flex items-center gap-2">
        {employeeId && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={EXTRACTABLE_ACCEPT}
              onChange={handleFiles}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title={`Drop files into this employee's library (${EXTRACTABLE_LABEL})`}
              className="rounded-full bg-surface-elevated px-3 py-1 font-sans text-body-sm text-stone transition-colors duration-150 hover:text-warm-white disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : `+ Files${docCount ? ` (${docCount})` : ''}`}
            </button>
          </>
        )}
        {/* Browser TTS/STT is a fallback for department employees only —
            Jarvis has real two-way voice via ElevenLabs below instead, and
            showing both was confusing (this one just reads text aloud
            robotically; that one is an actual live conversation). */}
        {voiceSupported && employeeId && (
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
        {!employeeId && (
          <button
            onClick={callStatus === 'connected' || callStatus === 'connecting' ? endVoiceCall : startVoiceCall}
            disabled={callStatus === 'connecting'}
            aria-pressed={callStatus === 'connected'}
            className={`rounded-full px-3 py-1 font-sans text-body-sm transition-colors duration-150 disabled:opacity-60 ${
              callStatus === 'connected'
                ? 'hub-pulse-dot bg-danger text-warm-white'
                : 'bg-surface-elevated text-stone hover:text-warm-white'
            }`}
          >
            {callStatus === 'connected' ? '● On a call — end' : callStatus === 'connecting' ? 'Connecting…' : 'Talk to Jarvis'}
          </button>
        )}
        </div>
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
              {turn.role === 'assistant' ? (
                turn.content ? <Linkified text={turn.content} /> : '…'
              ) : (
                turn.content
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-surface-border px-8 py-5">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          {micSupported && employeeId && (
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              disabled={sending}
              aria-pressed={listening}
              aria-label={listening ? 'Stop listening' : 'Talk to ' + name}
              className={`shrink-0 rounded-full px-3 py-2.5 font-sans text-body-sm transition-colors duration-150 disabled:opacity-50 ${
                listening
                  ? 'hub-pulse-dot bg-danger text-warm-white'
                  : 'bg-surface-elevated text-stone hover:text-warm-white'
              }`}
            >
              {listening ? '● Listening…' : '🎙'}
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? 'Listening…' : (placeholder ?? `Message ${name}…`)}
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
