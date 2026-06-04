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
    const html = document.documentElement;
    const body = document.body;
    html.setAttribute('data-theme', theme);
    if (theme === 'light') {
      body.classList.remove('bg-black', 'text-warm-white');
      body.classList.add('bg-warm-white', 'text-black');
    } else {
      body.classList.remove('bg-warm-white', 'text-black');
      body.classList.add('bg-black', 'text-warm-white');
    }
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

    const sections = Array.from(document.querySelectorAll('section'));
    const total = sections.length;
    if (!total) return;

    /* ---------- 1. Rebuild side pager ---------- */
    const pagerWrap = document.querySelector('.hidden.lg\\:flex.fixed.right-4.top-1\\/2, [class*="right-4"][class*="top-1/2"]');
    if (pagerWrap) {
      // Find the existing prev / next buttons
      const prevBtn = pagerWrap.querySelector('button[aria-label="Previous page"]');
      const nextBtn = pagerWrap.querySelector('button[aria-label="Next page"]');

      // Remove all existing "Go to page N" buttons
      pagerWrap.querySelectorAll('button[aria-label^="Go to page"]').forEach(b => b.remove());

      // Build a wrapper for the dots between prev and next
      const dotsCol = document.createElement('div');
      dotsCol.className = 'flex flex-col gap-2 items-center my-2';
      dotsCol.style.maxHeight = '70vh';
      dotsCol.style.overflowY = 'auto';
      dotsCol.style.overflowX = 'hidden';
      dotsCol.style.padding = '4px 2px';
      dotsCol.style.scrollbarWidth = 'thin';

      sections.forEach((sec, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Go to page ' + (i+1));
        btn.dataset.idx = String(i);
        btn.className = 'deck-dot block rounded-full transition-all duration-200 cursor-pointer h-1.5 w-1.5 bg-deck-text/20 hover:bg-deck-text/40';
        btn.style.flexShrink = '0';
        btn.addEventListener('click', function(){
          sec.scrollIntoView({behavior:'smooth', block:'start'});
        });
        dotsCol.appendChild(btn);
      });

      if (prevBtn && nextBtn) {
        prevBtn.parentNode.insertBefore(dotsCol, nextBtn);
      } else {
        pagerWrap.appendChild(dotsCol);
      }

      // Wire prev/next
      function currentIdx(){
        const mid = window.scrollY + window.innerHeight/2;
        let best = 0, bestDist = Infinity;
        sections.forEach((s, i) => {
          const c = s.offsetTop + s.offsetHeight/2;
          const d = Math.abs(c - mid);
          if (d < bestDist){ best = i; bestDist = d; }
        });
        return best;
      }
      if (prevBtn) prevBtn.addEventListener('click', () => {
        const i = Math.max(0, currentIdx() - 1);
        sections[i].scrollIntoView({behavior:'smooth', block:'start'});
      });
      if (nextBtn) nextBtn.addEventListener('click', () => {
        const i = Math.min(sections.length - 1, currentIdx() + 1);
        sections[i].scrollIntoView({behavior:'smooth', block:'start'});
      });

      /* Active dot tracking via IntersectionObserver */
      const dots = Array.from(dotsCol.querySelectorAll('button.deck-dot'));
      function setActive(i){
        dots.forEach((d, j) => {
          if (j === i){
            d.className = 'deck-dot block rounded-full transition-all duration-200 cursor-pointer h-2.5 w-2.5 bg-orange';
          } else {
            d.className = 'deck-dot block rounded-full transition-all duration-200 cursor-pointer h-1.5 w-1.5 bg-deck-text/20 hover:bg-deck-text/40';
          }
        });
        // Scroll active dot into view within the dots column
        if (dots[i]) dots[i].scrollIntoView({block:'nearest', inline:'nearest'});
      }

      /* Update active dot on scroll (debounced via rAF) */
      let scrollTick = false;
      window.addEventListener('scroll', () => {
        if (scrollTick) return;
        scrollTick = true;
        requestAnimationFrame(() => {
          setActive(currentIdx());
          scrollTick = false;
        });
      }, {passive:true});
      setActive(0);
    }

    /* ---------- 2. Per-section page-number indicators ---------- */
    /* Each section's bottom-right shows a 2-digit page index.
     * Find the existing span and update it to "01 / N" format
     * so the user can see total pages.                            */
    sections.forEach((sec, i) => {
      // The page number indicator is typically a small <span> with classes like
      // "uppercase tracking-[0.12em] text-deck-text/25" sitting in a flex row footer
      const candidates = sec.querySelectorAll('span');
      for (const sp of candidates) {
        const t = (sp.textContent || '').trim();
        if (/^\d{2}$/.test(t)) {
          // Existing page indicator (e.g., "01") — replace with "<idx>/<total>"
          const override = sec.getAttribute('data-page-label');
          const idx = override || String(i + 1).padStart(2, '0');
          sp.textContent = idx;
          break;
        }
      }
    });

    /* Theme toggle + download were already bound by the MOBILE PATCH
       block at the top of ready(); rebinding them here would cause the
       handler to fire twice per click and toggle right back to the
       previous state, so the click appears to do nothing. */
  });
})();
