import RevealReady from './RevealReady'

// Scroll-reveal sections (framer-motion `initial={{ opacity: 0 }}`) are
// server-rendered with an inline `opacity:0`. If JavaScript is slow, blocked
// (content blockers, in-app browsers), unsupported (older iPhones) or crashes,
// those sections never reveal and visitors see blank blocks with no text or
// photos. This keeps the animations for everyone whose JS works, and shows
// the content anyway for everyone else:
//   - no JS at all: the <noscript> rule applies immediately
//   - JS present but not hydrated after 3s: the timer adds `reveal-failsafe`
// The selectors match React's server-rendered style format ("opacity:0;").
// Once framer-motion takes over it rewrites styles as "opacity: 0", so the
// failsafe never interferes with running animations or elements that are
// intentionally hidden at runtime.
// This app also uses its own `.scroll-reveal` class (components/ui/ScrollReveal),
// which starts at opacity 0 in globals.css until JS adds `.revealed`.
const HIDDEN = ['[style*="opacity:0;"]', '[style$="opacity:0"]', '.scroll-reveal']
const SHOW = '{opacity:1!important;transform:none!important}'
const failsafeCss = HIDDEN.map((s) => `html.reveal-failsafe ${s}`).join(',') + SHOW
const noscriptCss = `<style>${HIDDEN.join(',')}${SHOW}</style>`
const timer =
  "setTimeout(function(){if(!window.__revealReady)document.documentElement.className+=' reveal-failsafe'},3000)"

export default function RevealFailsafe() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: failsafeCss }} />
      <noscript dangerouslySetInnerHTML={{ __html: noscriptCss }} />
      <script dangerouslySetInnerHTML={{ __html: timer }} />
      <RevealReady />
    </>
  )
}
