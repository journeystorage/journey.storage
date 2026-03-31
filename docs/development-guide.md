# Development Guide — journey.storage
### Step 8: Implementation instructions for Claude Code

---

## SCOPE — PHASE 1 ONLY

**Build now:**
- ✅ journey.storage main landing page (single scrollable page with all sections)
- ✅ Legal pages (/legal/privacy, /legal/terms, /legal/disclaimer) — placeholder content OK
- ✅ 404 page

**DO NOT build yet (Phase 2):**
- ❌ /blog and /blog/[slug] — blog pages
- ❌ direct.journey.storage — investor landing page
- ❌ consulting.journey.storage — consulting landing page

Phase 2 items should not have routes, components, or placeholder pages created. They do not exist yet. The nav links for Blog should point to `#` with a `coming soon` tooltip or simply be omitted from nav until Phase 2. The Business dropdown links (Investors, Consulting) should point to their future subdomain URLs (direct.journey.storage, consulting.journey.storage) — they will resolve when those sites are built.

---

## PROJECT DIRECTORY MAP

Before writing any code, understand the full project structure:

```
journey.storage/
│
├── .claude/                    ← Claude Code config (DO NOT MODIFY)
│   ├── agents/
│   ├── commands/
│   ├── hooks/
│   ├── rules/
│   ├── skills/
│   └── settings.json
│
├── CLAUDE.md                   ← Claude Code project instructions
│
├── docs/                       ← ALL project documentation (READ FIRST)
│   ├── content/
│   │   └── journey.storage.md  ← Copy & content structure (Step 3)
│   ├── references/             ← Visual references organized by category
│   │   ├── cards/
│   │   ├── color-palette/
│   │   ├── footer/
│   │   ├── full-pages/
│   │   ├── hero/
│   │   ├── map/
│   │   ├── navigation/
│   │   ├── typography/
│   │   └── README.md
│   ├── architecture.md         ← Site architecture (Step 2)
│   ├── briefing.md             ← Strategy & business context (Step 1)
│   ├── design-system.md        ← Visual rules & tokens (Step 5)
│   ├── guide.md                ← THIS FILE (Step 8)
│   └── image-map.md            ← Image inventory & sourcing (Step 7)
│
├── public/
│   └── images/
│       ├── brand/              ← Logo SVGs, favicon, og-image, apple-touch-icon
│       ├── hero/               ← Hero background image
│       ├── moments/            ← Life moment card images
│       ├── facility/           ← Facility photos
│       ├── team/               ← Jonah portrait
│       └── README.md
│
├── src/                        ← APPLICATION CODE (you build this)
│   ├── app/                    ← Next.js App Router
│   │   ├── layout.tsx          ← Root layout (font, metadata, global styles)
│   │   ├── page.tsx            ← Landing page (imports all sections)
│   │   ├── legal/
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   └── disclaimer/
│   │   │       └── page.tsx
│   │   └── not-found.tsx       ← 404 page
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/           ← One component per landing page section
│   │   │   ├── Hero.tsx
│   │   │   ├── LifeMoments.tsx
│   │   │   ├── BrandPositioning.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Differentiators.tsx
│   │   │   ├── LocationsMap.tsx
│   │   │   ├── FoundedBy.tsx
│   │   │   └── Waitlist.tsx
│   │   ├── ui/                 ← Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── SectionWrapper.tsx
│   │   └── map/
│   │       ├── USMap.tsx        ← SVG map component
│   │       └── MapPin.tsx       ← Animated pin component
│   │
│   ├── lib/
│   │   ├── constants.ts        ← Brand colors, section IDs, external URLs
│   │   └── utils.ts            ← Utility functions (smooth scroll, etc.)
│   │
│   └── styles/
│       └── globals.css         ← Tailwind imports + global overrides
│
├── tailwind.config.ts          ← Tailwind config with brand tokens
├── next.config.ts
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## DOCUMENT READING ORDER

Before writing ANY code, read the project docs in this order:

1. **`docs/briefing.md`** — Understand WHO Journey is and WHO it serves
2. **`docs/design-system.md`** — Understand ALL visual rules (colors, typography, spacing, components, animation)
3. **`docs/content/journey.storage.md`** — Understand WHAT each section says (copy + structure)
4. **`docs/image-map.md`** — Understand WHAT images exist and WHERE they are

The Page Design Spec (Step 6) is the primary build reference — it combines all of the above into exact section-by-section layout instructions. That file should be provided directly in the build prompt or placed at `docs/page-design-spec.md`.

---

## BUILD SEQUENCE

Build in this exact order. Complete each step before moving to the next.

### Step 1: Project Setup
```
1. Initialize Next.js project with App Router and TypeScript
2. Install dependencies: tailwindcss, framer-motion, lucide-react, react-hook-form, zod
3. Configure tailwind.config.ts with brand tokens (colors, fonts, fontSize — see design-system.md)
4. Set up next/font with Lato (weights: 300, 400, 700, 900)
5. Create globals.css with Tailwind imports
6. Verify: the app runs with Lato loaded and brand colors available
```

### Step 2: Global Layout + Constants
```
1. Create src/lib/constants.ts with:
   - Brand colors object
   - Section IDs: 'hero', 'life-moments', 'about', 'how-it-works', 'differentiators', 'locations', 'founded-by', 'waitlist'
   - External URLs: direct.journey.storage, consulting.journey.storage
   - Social media URLs (placeholder until confirmed)

2. Create src/app/layout.tsx:
   - Lato font applied globally
   - Metadata: title, description, OG image (see design-system.md / image-map.md)
   - Background color: --warm-white as default

3. Create src/lib/utils.ts:
   - Smooth scroll function with offset (80px for nav)
```

### Step 3: UI Components
```
Build reusable components BEFORE sections:

1. Button.tsx — 3 variants: Primary, Secondary, Ghost (see design-system.md Section 6)
2. Input.tsx — Form input with label, error state, focus ring (see design-system.md Section 6)
3. SectionWrapper.tsx — Wrapper that applies consistent section padding, max-width, and scroll-reveal animation via Framer Motion
```

### Step 4: Layout Components
```
1. Navbar.tsx — Full spec in page-design-spec.md Section 0
   - Desktop: transparent → solid on scroll
   - Mobile: hamburger → fullscreen overlay
   - CTA button scrolls to #waitlist
   - Business dropdown with external links

2. Footer.tsx — Full spec in page-design-spec.md Section 9
   - 4-column layout
   - Email capture
   - Logo + slogan + social icons
```

### Step 5: Landing Page Sections (in page order)
```
Build each section component and import into src/app/page.tsx:

1. Hero.tsx — Section 1 spec
2. LifeMoments.tsx — Section 2 spec
3. BrandPositioning.tsx — Section 3 spec
4. HowItWorks.tsx — Section 4 spec (includes connector line SVG)
5. Differentiators.tsx — Section 5 spec
6. LocationsMap.tsx — Section 6 spec (includes USMap.tsx + MapPin.tsx)
7. FoundedBy.tsx — Section 7 spec
8. Waitlist.tsx — Section 8 spec (includes form logic + success state)
```

### Step 6: Page Assembly
```
src/app/page.tsx imports all sections in order:

<Navbar />
<Hero />
<LifeMoments />
<BrandPositioning />
<HowItWorks />
<Differentiators />
<LocationsMap />
<FoundedBy />
<Waitlist />
<Footer />
```

### Step 7: Legal Pages + 404
```
1. /legal/privacy/page.tsx — Simple layout: Navbar + legal text body + Footer
2. /legal/terms/page.tsx — Same layout
3. /legal/disclaimer/page.tsx — Same layout (adapt from platform deck disclaimer)
4. not-found.tsx — Brand-consistent 404: "Looks like this journey took a wrong turn." + link to home
```

### Step 8: Polish & Verify
```
1. Test all anchor links (nav items scroll to correct sections)
2. Test responsive behavior at all breakpoints (mobile, tablet, desktop)
3. Test navbar scroll transition (transparent → solid)
4. Test mobile menu open/close
5. Test waitlist form submission + success state
6. Test Business dropdown links (should point to subdomain URLs)
7. Verify all images load correctly from public/images/
8. Run Lighthouse audit — target 95+ on all metrics
9. Verify accessibility: keyboard nav, focus states, alt text, contrast ratios
```

---

## KEY IMPLEMENTATION RULES

### Images
- Always use Next.js `<Image>` component, never `<img>`
- Import images from `public/images/` using path strings: `/images/hero/home-hero-bg.jpg`
- Set `priority={true}` on hero image (above the fold)
- All other images: default lazy loading
- Always include `alt` text from image-map.md

### Typography
- Font: Lato only. Loaded via `next/font/google` in layout.tsx
- Never use Inter, Arial, Roboto, or system fonts
- Sentence case everywhere. No Title Case in body text.
- Uppercase ONLY for: display H1 (hero), labels/tags, JOURNEY.STORAGE logo variant

### Colors
- **Never use #FFFFFF.** All light backgrounds use `--warm-white` (#F5F0E8)
- **Journey Orange (#E8622A) activates ONE element per section.** Count orange elements — if there's more than one, remove the extras.
- Dark sections use #181818 or #3A3835. Never pure #000000.

### Animation
- Use Framer Motion for all animations
- Respect `prefers-reduced-motion` — disable all motion except essential state changes
- Default scroll reveal: `translateY(20px) → 0` + `opacity 0 → 1`, 300ms ease-out
- Never animate text content on mobile (performance)

### Forms
- Waitlist form: React Hook Form + Zod validation
- Required fields: Name, Email, ZIP Code
- Optional field: Phone
- On submit: POST to Next.js API route at `/api/waitlist`
- API route: for Phase 1, simply log the data to console and return success. Integration with email service (Resend, SendGrid) is Phase 2.
- On success: crossfade to success message (see page-design-spec.md Section 8)

### Nav Behavior
- Blog link: points to `#` for Phase 1 (blog not built yet). Add `title="Coming soon"` attribute. OR omit Blog from nav entirely until Phase 2 — your choice.
- Business dropdown: "Investors" links to `https://direct.journey.storage`, "Consulting" links to `https://consulting.journey.storage`. These are external links. They won't resolve until Phase 2 — that's fine. The nav structure is correct now.

### What NOT to Build
- No blog routes or components
- No investor page routes or components
- No consulting page routes or components
- No authentication system
- No database integration
- No email service integration (Phase 2)
- No analytics integration (add post-launch)
- No cookie banner (add post-launch)
- No dark mode toggle (Journey controls the mode per section, not the user)

---

## COMPONENT NAMING CONVENTIONS

| Type | Convention | Example |
|------|-----------|---------|
| Section components | PascalCase, descriptive | `Hero.tsx`, `LifeMoments.tsx`, `LocationsMap.tsx` |
| UI components | PascalCase, generic | `Button.tsx`, `Input.tsx`, `SectionWrapper.tsx` |
| Layout components | PascalCase | `Navbar.tsx`, `Footer.tsx` |
| Utility files | camelCase | `constants.ts`, `utils.ts` |
| CSS | Only globals.css + Tailwind classes | No CSS modules, no styled-components |
| Images | kebab-case | `home-hero-bg.jpg`, `logo-white.svg` |

---

## TAILWIND CONFIG REFERENCE

This goes in `tailwind.config.ts`. Derived from `docs/design-system.md`.

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#181818',
        charcoal: '#3A3835',
        orange: '#E8622A',
        stone: '#888680',
        'warm-white': '#F5F0E8',
        terracotta: '#D4956A',
        sunlight: '#E8C547',
        'sky-blue': '#4A90D9',
        ice: '#E8F4F8',
        'sage-green': '#7AAF6E',
        sand: '#C4B89A',
      },
      fontFamily: {
        sans: ['var(--font-lato)', 'sans-serif'],
      },
      borderRadius: {
        'brand-sm': '8px',
        'brand-md': '16px',
        'brand-lg': '24px',
      },
      maxWidth: {
        'content': '1200px',
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'pin-pop': 'pin-pop 500ms ease-out forwards',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.3)', opacity: '1' },
        },
        'pin-pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

---

## CLAUDE.md CONTENT

Update the `CLAUDE.md` file at the project root with:

```markdown
# Journey.Storage™ — Project Instructions for Claude Code

## What This Project Is
A single-page landing site for Journey.Storage™, a self-storage brand launching in the U.S.
Built with Next.js (App Router) + Tailwind CSS + Framer Motion + TypeScript.

## Current Phase: Phase 1 — Landing Page Only
Build ONLY the main landing page at journey.storage. Do NOT create blog, investor, or consulting pages.

## Documentation
All project decisions are documented in /docs/. Read before coding:
- docs/briefing.md — business context
- docs/design-system.md — visual rules (THIS IS LAW)
- docs/content/journey.storage.md — all copy
- docs/image-map.md — image inventory
- docs/guide.md — build sequence and implementation rules

The Page Design Spec (exact layout per section) should be provided in the build prompt or placed at docs/page-design-spec.md.

## Critical Rules
1. NEVER use #FFFFFF. All light backgrounds use #F5F0E8 (warm-white).
2. Journey Orange (#E8622A) activates ONE element per section. Never scatter.
3. Font: Lato only. No Inter, no Arial, no system fonts.
4. Sentence case everywhere. Uppercase only for hero H1, labels, and logo variant.
5. No serifs. Ever.
6. All images use Next.js <Image> component.
7. Mobile-first responsive design.
8. Respect prefers-reduced-motion.

## File Structure
See docs/guide.md for the complete directory map and build sequence.
```

---

## PHASE 2 ROADMAP (for reference only — do not build)

When Phase 1 is complete and the landing page is live:

```
Phase 2A: Blog
- Create /blog route with MDX-based article system
- Create /blog/[slug] dynamic route
- Add Blog link to nav (currently disabled or hidden)
- Seed with 2-3 articles

Phase 2B: Investor Landing Page
- Set up direct.journey.storage subdomain in Vercel
- Build single-page landing (same stack, shared design system)
- Content from platform deck + content doc (to be created)

Phase 2C: Consulting Landing Page
- Set up consulting.journey.storage subdomain in Vercel
- Build single-page landing (same stack, shared design system)
- Content from consulting one-pager + content doc (to be created)
```

---

*This guide is the final document before implementation.
Claude Code reads this file alongside the design system and page design spec,
and builds the site section by section in the order specified above.*
