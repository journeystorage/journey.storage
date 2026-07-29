/* ===== Springfield deck custom interactivity =====
 * Replaces / augments the static SSR'd controls so the deck works
 * fully offline (file://) without depending on Next.js hydration.
 *
 *  - Side pager rebuilt with one dot per <section>
 *  - Click a dot -> smooth scroll to that section
 *  - Up/Down arrows (Prev/Next) keep working
 *  - Page indicator (bottom-right of each section) updates as the user scrolls
 *  - Theme toggle (sun/moon) flips body between dark and light
 *  - Download button triggers window.print() so the user can save as PDF
 */
(function(){
  'use strict';

  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
  // --- MOBILE PATCH: theme + download keep working at all breakpoints,
  // but the deck pager / scroll-spy is desktop-only.
  // Helper: apply a theme reliably by flipping data-theme AND swapping
  // the body's hardcoded Tailwind bg-black / bg-warm-white utilities
  // (otherwise the body element keeps its hardcoded color through
  // the cascade and the light theme is barely visible).
  function applyTheme(theme){
    // Match Granbury behavior: set/clear data-theme on .deck-root (the
    // wrapper). The original deck CSS keys variables on
    // [data-theme=light] which inherits from any ancestor — both <html>
    // and .deck-root work, but Granbury uses .deck-root and we match.
    const html = document.documentElement;
    const root = document.querySelector('.deck-root');
    const body = document.body;
    // Wipe both theme classes first so reverts don't get stuck
    body.classList.remove('bg-black', 'bg-warm-white', 'text-black', 'text-warm-white');
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      if (root) root.setAttribute('data-theme', 'light');
      body.classList.add('bg-warm-white', 'text-black');
    } else {
      html.removeAttribute('data-theme');
      if (root) root.removeAttribute('data-theme');
      body.classList.add('bg-black', 'text-warm-white');
    }
    // Trigger a recompute in case any rule was cached
    body.offsetHeight; // force reflow
    try { localStorage.setItem('deck-theme', theme); } catch(e){}
  }
  // Apply persisted theme on load
  try {
    const saved = localStorage.getItem('deck-theme');
    if (saved === 'light') applyTheme('light');
  } catch(e){}

  const __themeBtn = document.querySelector('button[aria-label*="theme" i]');
  if (__themeBtn && !__themeBtn.dataset.boundEarly) {
    __themeBtn.dataset.boundEarly = '1';
    __themeBtn.addEventListener('click', function(){
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      __themeBtn.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }
  const __dlBtn = document.querySelector('button[aria-label*="Download" i], button[aria-label*="PDF" i]');
  if (__dlBtn && !__dlBtn.dataset.boundEarly) {
    __dlBtn.dataset.boundEarly = '1';
    __dlBtn.addEventListener('click', function(){ window.print(); });
  }
  // --- MOBILE PATCH: inject a visible floating theme toggle so the
  // user can switch dark/light from a phone. The original toggle lives
  // inside a `hidden lg:flex` side-pager wrapper which is display:none
  // on mobile, leaving the click handler unreachable. We add a sibling
  // button on the body that proxies to it.
  if (window.matchMedia('(max-width: 1023px)').matches) {
    if (!document.getElementById('mobile-deck-controls')) {
      const wrap = document.createElement('div');
      wrap.id = 'mobile-deck-controls';
      wrap.style.cssText = 'position:fixed; top:14px; right:14px; z-index:9999; display:flex; gap:8px;';
      const mkBtn = function(label, svgPath, onClick){
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.style.cssText = 'width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.45); color:#fff; border:1px solid rgba(255,255,255,0.18); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); cursor:pointer; -webkit-tap-highlight-color:transparent; padding:0;';
        b.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+svgPath+'</svg>';
        b.addEventListener('click', onClick);
        return b;
      };
      // Sun + moon path swaps in CSS via [data-theme]; default icon is moon
      const themePath = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>';
      const dlPath = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
      // Direct toggle via the shared applyTheme() helper. Modifies body
      // classList in addition to data-theme so the cascade always loses
      // to bg-black, even on iOS Safari.
      const themeBtnMobile = mkBtn('Toggle theme', themePath, function(){
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
        const orig = document.querySelector('button[aria-label*="theme" i]:not(#mobile-deck-controls button)');
        const label = next === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
        if (orig) orig.setAttribute('aria-label', label);
        themeBtnMobile.setAttribute('aria-label', label);
      });
      const dlBtnMobile = mkBtn('Download PDF', dlPath, function(){
        // Direct print (no proxy). Brief delay lets the browser paint
        // the print stylesheet's hidden-mobile-controls before snapping.
        window.print();
      });
      wrap.appendChild(themeBtnMobile);
      wrap.appendChild(dlBtnMobile);
      document.body.appendChild(wrap);
    }
    return;
  }

    /* ---------- Desktop deck navigation ----------
     * The side pager and per-slide page badges this file used to build
     * do not exist in this export — the selectors matched nothing, and
     * the badge loop was overwriting real content (it renumbered the
     * "01" step marker on the Frictionless slide to "06").  Both were
     * removed.  What remains is keyboard navigation, which the deck
     * genuinely lacked: <main class="deck"> is the scroll container,
     * not the document, so arrow keys did nothing until the visitor
     * happened to click inside the deck first.
     */
    const deck = document.querySelector('main.deck');
    const sections = Array.from(document.querySelectorAll('section'));
    if (!deck || !sections.length) return;

    function currentIdx() {
      const h = deck.clientHeight || 1;
      return Math.round(deck.scrollTop / h);
    }
    function goTo(i) {
      const target = Math.max(0, Math.min(sections.length - 1, i));
      // Smooth for a step or two; jumping the length of the deck with a
      // smooth animation takes seconds and fights the mandatory snap.
      const far = Math.abs(target - currentIdx()) > 2;
      deck.scrollTo({ top: target * deck.clientHeight, behavior: far ? 'auto' : 'smooth' });
    }

    document.addEventListener('keydown', function (e) {
      // Never fight the lightbox, a modifier chord, or a focused field.
      const lb = document.getElementById('deck-lightbox');
      if (lb && lb.classList.contains('open')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

      switch (e.key) {
        case 'ArrowDown': case 'PageDown': case 'ArrowRight':
          e.preventDefault(); goTo(currentIdx() + 1); break;
        case 'ArrowUp': case 'PageUp': case 'ArrowLeft':
          e.preventDefault(); goTo(currentIdx() - 1); break;
        case ' ': case 'Spacebar':
          e.preventDefault(); goTo(currentIdx() + (e.shiftKey ? -1 : 1)); break;
        case 'Home':
          e.preventDefault(); goTo(0); break;
        case 'End':
          e.preventDefault(); goTo(sections.length - 1); break;
      }
    });

  });
})();
