import { SCROLL_OFFSET } from './constants'

/**
 * Smooth-scroll to a section by ID, accounting for the sticky navbar offset.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET

  window.scrollTo({ top, behavior: 'smooth' })
}
