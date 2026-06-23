import { useEffect, useRef } from 'react'

/**
 * Focus management for modal dialogs. When `active` becomes true it moves focus
 * into the dialog, traps Tab/Shift+Tab within it, and restores focus to the
 * previously-focused element when the dialog closes. Attach the returned ref to
 * the dialog's content container.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active: boolean) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active) return
    const container = ref.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const SELECTOR =
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      )

    // Move focus into the dialog (first focusable, else the container itself).
    const initial = getFocusable()
    ;(initial[0] ?? container).focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement
      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault()
          last.focus()
        }
      } else if (activeEl === last || !container.contains(activeEl)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      previouslyFocused?.focus?.()
    }
  }, [active])

  return ref
}
