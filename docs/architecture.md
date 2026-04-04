# Journey.Storage™ — Site Architecture & Strategic Blueprint
### Version 2.0 · March 2026

---

## Overview

Journey's web presence consists of three properties under one domain, each serving a distinct audience:

```
journey.storage .................. Consumer-facing brand (landing page + blog)
direct.journey.storage ........... Investor relations (Journey.Direct™)
advisory.journey.storage ....... Consulting services (Journey.Consulting™)
```

Each property is a **single-page landing** with anchor-linked navigation. The main site also includes a `/blog` route for SEO content. This structure reflects the company's early stage — delivering a complete, immersive experience per audience without hollow sub-pages.

---

## Property Roles

### journey.storage — Consumer Launch
**Audience:** Individuals in life transitions. Small businesses outgrowing their space.
**Goal:** Waitlist signups + brand awareness.
**Structure:** Single scrollable landing page. Nav anchors to sections. Blog as the only sub-route.
**Mode:** Comfort → Energy progression.

### direct.journey.storage — Investor Relations
**Audience:** Accredited investors, family offices, capital allocators.
**Goal:** Qualified investor inquiries. Schedule calls. Request deal info.
**Structure:** Single scrollable landing page. Anchor-linked nav. Gated section for deal details.
**Mode:** Energy dominant. Data-forward.

### advisory.journey.storage — Consulting
**Audience:** Self-storage investors and operators needing underwriting expertise.
**Goal:** Call bookings with Jonah.
**Structure:** Single scrollable landing page. Anchor-linked nav. Conversion-focused.
**Mode:** Energy. Pain-point-first.

---

## Navigation Philosophy

- **Main site nav** shows only key topics: About, How It Works, Blog, Business. "About" and "How It Works" anchor-scroll to their sections. "Blog" navigates to `/blog`. "Business" is a dropdown linking to subdomains (Investors → direct.journey.storage, Consulting → advisory.journey.storage).
- **Subdomain navs** scroll to sections within their respective landing pages. Each includes a link back to the main site.
- **CTAs adapt per property:** "Join the Waitlist" (main), "Schedule a Call" (invest), "Book a Call" (consulting). Always visible in nav.

---

## Content & Launch Phases

### Phase 1: Launch (Now)
- [ ] journey.storage — landing page + blog structure (2–3 seed articles)
- [ ] direct.journey.storage — investor landing page
- [ ] advisory.journey.storage — consulting landing page
- [ ] Legal pages (privacy, terms, disclaimer)

### Phase 2: Pre-Opening
- [ ] Locations section updated with facility details
- [ ] Pricing information added
- [ ] Blog content ramp-up (1–2 articles/week)
- [ ] FAQ section added to main landing page

### Phase 3: Post-Opening
- [ ] Customer testimonials / social proof
- [ ] Facility-specific landing pages for local SEO
- [ ] Additional investor offerings as deals come online
- [ ] Sections may split into dedicated pages as content depth grows

---

## Key Strategic Decisions

### Tone calibration by property
| Property | Voice mode | Register | Warmth |
|----------|-----------|----------|--------|
| journey.storage | Comfort → Energy | Inspirational, human | High |
| direct.journey.storage | Energy | Authoritative, data-driven | Medium |
| advisory.journey.storage | Energy | Direct, pain-point-first | Medium |

### What Journey NEVER says on the site
(from brand manual — enforced across all properties):
- "Trusted partner" / "industry-leading" / "best-in-class"
- Storage as the hero of any section
- Corporate language of any kind
- Cold, transactional copy
- Feature lists without emotional context

### The test for every section
1. Does it speak to a life moment? (If it only describes storage, it fails.)
2. Does it feel like Journey? (If Public Storage could publish it, it fails.)
3. Does it carry the right temperature? (Warm? Human? Does it breathe?)

---

## Document References

| Document | Governs |
|----------|---------|
| `briefing.md` | Business definition, audiences, objectives, KPIs |
| `architecture.md` | Tech stack, sitemap, routes, integrations, performance, technical decisions |
| `design-system.md` | Colors, typography, spacing, components, visual rules |
| `content.md` | Section-by-section copy, wireframe details, messaging per section |
| `image-map.md` | Imagery strategy, photo/AI-generated assets, visual sourcing |
| `guide.md` | Development implementation guide |

---

*This blueprint is the strategic overview. Detailed specifications live in the documents referenced above.*

# Architecture & Site Structure

---

## 1. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js (App Router) | SSR/SSG for SEO, file-based routing, API routes for form handling, native image optimization. The standard for production React sites that need to rank. |
| Styling | Tailwind CSS | Utility-first approach is ideal for vibe coding — classes are self-documenting, no context-switching to CSS files. Full control over brand system implementation. |
| UI Components | Custom components (no library) | Journey's brand system (asymmetric corners, two-mode design, specific color rules) requires full visual control. Pre-built libraries fight custom design systems. |
| Animations | Framer Motion | The React standard for declarative animations. Scroll-triggered reveals, page transitions, and micro-interactions without manual JS. Lightweight enough to keep Lighthouse scores high. |
| Icons | Lucide React | Clean, geometric icon set that aligns with Journey's sans-serif, modern brand language. Tree-shakeable — only ships icons actually used. |
| Forms | React Hook Form + Zod | Lightweight form state management with schema validation. No unnecessary re-renders. Works cleanly with Next.js API routes for server-side submission handling. |
| CMS / Data | Markdown/MDX files (Phase 1) → Headless CMS (Phase 2) | Blog content starts as local MDX files for speed and zero-dependency launch. Migrate to a headless CMS when content volume requires a non-developer editing workflow. |
| Deploy / Hosting | Vercel | Native Next.js integration. Automatic previews, edge network, analytics built-in. Generous free tier covers launch phase. Supports subdomain routing natively. |
| Domain | journey.storage | Custom TLD — the domain IS the brand name. |

---

## 2. Domain & Subdomain Structure

Journey operates as three distinct web properties under one domain, each serving a different audience with a different intent.

```
journey.storage ................ Consumer-facing brand (main site)
direct.journey.storage ......... Investor relations (Journey.Direct™)
advisory.journey.storage ..... Consulting services (Journey.Consulting™)
```

### Routing logic

| Property | Type | Structure |
|----------|------|-----------|
| `journey.storage` | Single-page landing + blog | One scrollable landing page with anchor-linked nav. Blog as the only sub-page route (`/blog`, `/blog/[slug]`). |
| `direct.journey.storage` | Single-page landing | One scrollable landing page. Anchor-linked nav. No sub-pages. |
| `advisory.journey.storage` | Single-page landing | One scrollable landing page. Anchor-linked nav. No sub-pages. |

### Rationale
The company is in early stage. Multiple sub-pages with limited content would feel hollow and undermine the premium brand perception. A single, well-crafted landing page per property delivers a complete, immersive experience without dead ends. As the company scales, pages can be split out from sections naturally.

---

## 3. Sitemap

```
journey.storage
├── / .......................... Landing page (scrollable sections, anchor-linked nav)
│   ├── #hero
│   ├── #life-moments
│   ├── #about
│   ├── #how-it-works
│   ├── #differentiators
│   ├── #locations
│   ├── #waitlist
│   └── (footer)
│
├── /blog ...................... Articles & SEO Content Hub
│   └── /blog/[slug] ........... Individual Article
│
├── /legal/privacy ............. Privacy Policy
├── /legal/terms ............... Terms of Service
└── /legal/disclaimer .......... Investment Disclaimer

direct.journey.storage
└── / .......................... Investor landing page (scrollable sections, anchor-linked nav)
    ├── #hero
    ├── #why-self-storage
    ├── #thesis
    ├── #track-record
    ├── #structure
    ├── #current-offerings (gated)
    ├── #contact
    └── (footer with legal disclaimer)

advisory.journey.storage
└── / .......................... Consulting landing page (scrollable sections, anchor-linked nav)
    ├── #hero
    ├── #why-it-matters
    ├── #your-consultant
    ├── #levels-of-access
    ├── #contact
    └── (footer)
```

> Section IDs above are structural placeholders. Actual section names, content, and sequence are defined in `content.md`.

---

## 4. Routes & URLs

### journey.storage

| Page | URL | Page Title | Sitemap Priority |
|------|-----|-----------|-----------------|
| Home (Landing) | `/` | Journey.Storage™ — Space to move on. | 1.0 |
| Blog | `/blog` | Blog — Journey.Storage™ | 0.8 |
| Blog Article | `/blog/[slug]` | [Article Title] — Journey.Storage™ | 0.7 |
| Privacy | `/legal/privacy` | Privacy Policy — Journey.Storage™ | 0.2 |
| Terms | `/legal/terms` | Terms of Service — Journey.Storage™ | 0.2 |
| Disclaimer | `/legal/disclaimer` | Investment Disclaimer — Journey.Storage™ | 0.2 |

### direct.journey.storage

| Page | URL | Page Title | Sitemap Priority |
|------|-----|-----------|-----------------|
| Investor Landing | `/` | Journey.Direct™ — Invest in Self-Storage | 1.0 |

### advisory.journey.storage

| Page | URL | Page Title | Sitemap Priority |
|------|-----|-----------|-----------------|
| Consulting Landing | `/` | Journey.Consulting™ — Fractional Acquisitions & Underwriting | 1.0 |

---

## 5. Navigation Architecture

### journey.storage — Primary Nav

```
[LOGO: Journey.storage™]     About · How It Works · Blog · Business ▾     [CTA: Join the Waitlist]
                                                          ├── Investors → direct.journey.storage
                                                          └── Consulting → advisory.journey.storage
```

- Nav shows only key topics — not a link for every landing page section.
- "About" and "How It Works" scroll to their respective sections on the landing page.
- "Blog" navigates to `/blog` (the only true route change from nav).
- "Business" is a dropdown with two links to the subdomain properties.
- Mobile: Fullscreen overlay menu. Same hierarchy. Waitlist CTA prominent.

### direct.journey.storage — Nav

```
[LOGO: Journey.Direct™ or Journey.storage™ + "Invest" badge]     [anchor links]     [CTA: Schedule a Call]
```

- Nav items scroll to sections within the investor landing page.
- Link back to main site: journey.storage.
- Mobile: Same fullscreen overlay pattern.

### advisory.journey.storage — Nav

```
[LOGO: Journey.Consulting™ or Journey.storage™ + "Consulting" badge]     [anchor links]     [CTA: Book a Call]
```

- Nav items scroll to sections within the consulting landing page.
- Link back to main site: journey.storage.
- Mobile: Same fullscreen overlay pattern.

---

## 6. Page Structure Overview

> **Deferred to content phase.** The section-by-section structure for each landing page (what sections exist, their sequence, structural roles, and content) will be defined in `content.md` after the architecture is finalized. This separation prevents premature content decisions from conflicting with detailed wireframe and copywriting work downstream.

---

## 7. Global Elements

| Element | Decision |
|---------|----------|
| Header — scroll behavior | Transparent over hero → solid on scroll. Smooth transition. Consistent across all three properties. |
| Header — CTA visible? | Yes, always. Adapts per property: "Join the Waitlist" (main), "Schedule a Call" (invest), "Book a Call" (consulting). |
| Mobile menu | Fullscreen overlay. Clean, breathing. Property-specific links + CTA. |
| Footer — structure | Consistent layout across all three properties. Adapted content per property. Main site footer includes links to subdomains. Subdomain footers link back to main site. |
| Footer — waitlist/email capture? | Main site: yes (compact waitlist capture). Subdomains: no (their CTAs are call scheduling / form submission). |
| Floating chat/WhatsApp button | No. Not aligned with brand. Journey uses scheduled calls and email. |
| Cookie banner | Yes. Minimal, non-intrusive. On-brand styling. Required for compliance. |
| Back to top button | No. Single-page landing format doesn't require it — nav anchors serve this purpose. |
| Loading / skeleton screens | Yes — subtle. For blog content and any dynamically loaded elements. |
| Smooth scroll | Yes. Core to the single-page experience. All anchor nav links use smooth scroll with appropriate offset for sticky header. |

---

## 8. External Integrations

| Integration | Purpose | Applies to |
|-------------|---------|------------|
| Google Analytics 4 | Traffic, attribution, conversion tracking | All three properties |
| Google Tag Manager | Centralized tag management | All three properties |
| Google Search Console | SEO monitoring, indexing, Core Web Vitals | All three properties (registered separately per subdomain) |
| Calendly (or Cal.com) | Call scheduling | direct.journey.storage, advisory.journey.storage |
| Resend (or SendGrid) | Transactional email (waitlist confirmation, investor inquiry autoresponders) | journey.storage, direct.journey.storage |
| Meta Pixel | Paid social attribution, audience building | All three properties |
| Vercel Analytics | Real-user performance metrics | All three properties |
| reCAPTCHA v3 (or Turnstile) | Invisible form spam protection | All forms across all properties |

---

## 9. SEO & Metadata

**`<title>` pattern:**
- Main site: `Journey.Storage™ — Space to move on.`
- Invest: `Journey.Direct™ — Invest in Self-Storage`
- Consulting: `Journey.Consulting™ — Fractional Acquisitions & Underwriting`
- Blog articles: `[Article Title] — Journey.Storage™`

**Default meta description** *(fallback)*:
"Journey.Storage™ is a new kind of self-storage company — built for the moments that matter. Space to move on."

**Open Graph:**
- Default image: branded OG image per property (1200×630px). Defined in `image-map.md`.
- Per-property titles and descriptions.

**Structured data (Schema.org):**
- `Organization` — on all properties
- `WebSite` — on journey.storage (with SearchAction for future site search)
- `LocalBusiness` — added per-facility once locations open
- `Article` — on each blog post
- `Service` — on advisory.journey.storage

**Subdomain SEO notes:**
- Each subdomain is registered separately in Google Search Console.
- Each has its own sitemap.xml.
- Subdomains share domain authority with the root domain, which benefits all three properties.
- Cross-linking between properties (main ↔ direct ↔ consulting) reinforces the relationship for search engines.

---

## 10. Performance & Accessibility

**Lighthouse targets:**
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 100

**Accessibility standard:** WCAG 2.1 AA

**Core Web Vitals targets:**
- LCP (Largest Contentful Paint): < 2.0s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- INP (Interaction to Next Paint): < 200ms

**Implementation notes:**
- All images via Next.js `<Image>` component (auto format, lazy loading, responsive srcsets)
- Fonts preloaded and self-hosted via `next/font` (no external font requests)
- Above-the-fold content prioritized for SSR; below-fold lazy loaded
- All interactive elements keyboard-navigable with visible focus states
- Color contrast verified against brand palette (see `design-system.md`)
- Alt text on all images; decorative images `aria-hidden`
- Form fields with proper labels, error states, and ARIA attributes

---

## 11. Technical Decisions & Trade-offs

| Decision | Alternative Considered | Reason for Choice |
|----------|----------------------|-------------------|
| Three subdomains (main + direct + consulting) over single domain with routes | `/invest` and `/consulting` as routes on journey.storage | Clean separation of concerns. Each audience gets a dedicated experience without navigational noise from the others. Subdomains share root domain authority for SEO. Independent deploys if needed. |
| Single-page landing per property over multi-page sites | Multi-page with sub-routes per section | Company is early stage. Multiple pages with thin content feels hollow. A single, well-crafted landing page delivers a complete experience. Sections can be split into pages later as content grows. |
| Anchor-linked nav over route-based nav | Next.js route per section | Smooth single-page scroll is the right UX for landing pages. No page load flashes. Better storytelling flow — the user is guided through a narrative, not jumping between disconnected pages. |
| Custom components over shadcn/ui | shadcn/ui for rapid development | Journey's brand system requires pixel-level control that pre-built libraries would fight. The time saved by a library is lost in overriding its opinions. |
| MDX for blog (Phase 1) over headless CMS | Sanity or Contentful from launch | With 2–3 seed articles and vibe-coding workflow, CMS adds complexity without value. MDX is version-controlled and zero-cost. Migrate when content volume demands it. |
| Self-hosted fonts via next/font over Google Fonts CDN | Google Fonts CDN link | Eliminates external network dependency, prevents layout shift, improves performance scores. |
| Gated content via form-then-reveal over authentication | Login system for investor content | Lead capture is the goal, not security. Sensitive financials go via email/PDF after human review, not served on the site. |
| Fullscreen mobile menu over drawer | Side drawer | More breathing room for the nav hierarchy. Accommodates property-specific links + CTA. Aligned with brand's "compositions should breathe" principle. |
| Vercel over Netlify or AWS | Netlify (comparable), AWS Amplify (more control) | Native Next.js support, zero config. Preview deployments and analytics out of the box. For vibe coding, reducing DevOps friction is critical. |
| No i18n | Next.js built-in i18n | U.S.-only market. English only. Premature complexity otherwise. |

---

## 12. Development Structure

> How the codebase is organized for vibe-coding clarity.

```
journey-storage/
├── apps/
│   ├── main/          ← journey.storage (consumer site + blog)
│   ├── direct/        ← direct.journey.storage (investor landing)
│   └── consulting/    ← advisory.journey.storage (consulting landing)
│
├── packages/
│   └── ui/            ← Shared components, design tokens, utilities
│       ├── components/    (Button, Header, Footer, Form, etc.)
│       ├── styles/        (Tailwind config, global CSS, brand tokens)
│       └── lib/           (Shared utilities, form schemas, constants)
│
└── content/
    └── blog/          ← MDX blog articles
```

**Monorepo rationale:** All three properties share the same brand system (colors, typography, components). A monorepo with a shared `ui` package ensures visual consistency and avoids duplicating components across three separate codebases. Turborepo or npm workspaces manage the structure.

**Alternative (simpler):** If monorepo feels too complex for vibe-coding Phase 1, build as three separate Next.js projects with a shared Tailwind config file copied between them. Migrate to monorepo when the maintenance cost of duplication becomes noticeable.