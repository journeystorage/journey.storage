'use client'

import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { SIZE_ART } from '@/lib/sizeArt'

const OPEN_EVENT = 'journey:open-size-guide'

/** Open the shared size-guide modal from anywhere on the site. */
export function openSizeGuide() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_EVENT))
}

/** Convenience trigger for server-authored surfaces (e.g. the footer). */
export function SizeGuideLink({
  className,
  children = 'Size Guide',
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button type="button" onClick={openSizeGuide} className={className}>
      {children}
    </button>
  )
}

/**
 * The single size-guide "box" for the whole site. Mounted once in the root
 * layout; opens on the `openSizeGuide()` event so any header/footer/CTA can
 * trigger it. Mirrors the board that lives on the facility pages.
 */
export default function SizeGuideModal() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Storage size guide"
        className="relative flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-warm-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5">
          <div>
            <h3 className="track-tight text-[1.375rem] font-black text-black">Storage size guide</h3>
            <p className="mt-0.5 text-[0.875rem] text-stone">Find the space that fits — every Journey size in one place.</p>
          </div>
          <button onClick={close} aria-label="Close size guide" className="btn-spring grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/[0.06] text-black hover:bg-black/[0.12]"><X className="h-5 w-5" aria-hidden /></button>
        </div>
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SIZE_ART.map((s) => (
              <div key={s.key} className="group/card rounded-xl border border-black/[0.06] bg-warm-white p-4 text-center shadow-card">
                <div className="mx-auto aspect-[3/4] w-full max-w-[150px] overflow-hidden rounded-lg shadow-[0_3px_12px_-4px_rgba(24,24,24,0.3)] transition-transform duration-300 ease-out will-change-transform group-hover/card:scale-[1.28] group-hover/card:shadow-[0_16px_40px_-10px_rgba(24,24,24,0.4)]" style={{ background: `linear-gradient(165deg, #F5F0E8 0%, ${s.tint} 100%)` }}>
                  <video src={`/videos/storage-${s.key}-sm.webm`} autoPlay muted loop playsInline preload="metadata" aria-hidden className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-[1.25rem] font-black tracking-[-0.02em] text-black">{s.size.replace(/'/g, '')}</p>
                <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-stone">{s.label}</p>
                <p className="mt-0.5 text-[0.8125rem] text-stone">{s.sqft} sq ft</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] px-6 py-4">
          <p className="text-[0.8125rem] text-stone">Still unsure? Our team can help you pick the right fit.</p>
          <button onClick={close} className="btn-spring shadow-cta rounded-xl bg-orange px-5 py-2.5 font-bold text-warm-white">Got it</button>
        </div>
      </div>
    </div>
  )
}
