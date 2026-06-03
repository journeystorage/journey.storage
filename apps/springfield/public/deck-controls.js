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
  const __themeBtn = document.querySelector('button[aria-label*="theme" i]');
  if (__themeBtn && !__themeBtn.dataset.boundEarly) {
    __themeBtn.dataset.boundEarly = '1';
    __themeBtn.addEventListener('click', function(){
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      __themeBtn.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }
  const __dlBtn = document.querySelector('button[aria-label*="Download" i], button[aria-label*="PDF" i]');
  if (__dlBtn && !__dlBtn.dataset.boundEarly) {
    __dlBtn.dataset.boundEarly = '1';
    __dlBtn.addEventListener('click', function(){ window.print(); });
  }
  if (window.matchMedia('(max-width: 1023px)').matches) return;

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

    /* ---------- 3. Theme toggle (sun/moon) ---------- */
    /* The Granbury CSS uses [data-theme=light] on <html> to swap
     * the deck color tokens (--color-deck-bg, --color-deck-text, etc).
     * Just toggle that attribute - every Tailwind class referencing
     * the deck tokens picks up the new colors automatically. */
    const themeBtn = document.querySelector('button[aria-label*="theme" i]');
    if (themeBtn) {
      themeBtn.addEventListener('click', function(){
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        themeBtn.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      });
    }

    /* ---------- 4. Download / print ---------- */
    const dlBtn = document.querySelector('button[aria-label*="Download" i], button[aria-label*="PDF" i]');
    if (dlBtn) {
      dlBtn.addEventListener('click', function(){
        window.print();
      });
    }
  });
})();
