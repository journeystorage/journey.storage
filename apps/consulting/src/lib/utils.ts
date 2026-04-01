export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const offset = 80
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
