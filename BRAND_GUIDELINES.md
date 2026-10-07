# Journey.Storage — Brand Guidelines v3.0

> ⚠️ **Superseded where it conflicts (2026-10-07).** The `journey-design-system` skill is the source of truth for colours, type, shapes, motion, components and voice. In particular its orange tokens win: `brand` `#ff6320` (bright marks, icons, links on dark) and `brand-2` `#e8622a` (bars, focus, links on light). Use this file only for detail the skill doesn't cover.

> **The typography and layout system for new work** — handouts, decks, new pages, new sites — across Journey.Storage, Journey.Managed, Journey.Direct, the investor portal, print, and email.
>
> ### Scope — read this first
>
> **What v3.0 changes:** typography. One typeface, more weights, a new heading pattern, and the layout/motion language that goes with it.
>
> **What v3.0 does NOT change:**
> - 🔒 **Logos.** The files in `public/images/brand/` stay exactly as they are. Do not re-export or recolor them.
> - 🔒 **Brand colors.** The existing palette stays. `--color-orange` remains `#E8622A` as it is in the code today.
>
> **This is forward-looking.** It tells you how to build the *next* thing. It is **not** a mandate to restyle existing pages — never migrate a live page to it unless explicitly asked.
>
> Last revised: 2026-09-18 · Derived from the approved reference build at `web-journey-ashen.vercel.app`

---

## Table of Contents

1. [What Changed in v3.0](#what-changed-in-v30)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [The Heading Pattern](#the-heading-pattern)
5. [Layout & Spacing](#layout--spacing)
6. [Section Bands](#section-bands)
7. [Shape & Radius](#shape--radius)
8. [Elevation & Shadows](#elevation--shadows)
9. [Texture](#texture)
10. [Motion](#motion)
11. [Components](#components)
12. [Imagery](#imagery)
13. [Logo Usage](#logo-usage)
14. [Verbal Identity](#verbal-identity)
15. [Accessibility](#accessibility)
16. [Implementation Notes](#implementation-notes)
17. [Open Items](#open-items)

---

## What Changed in v3.0

The short version: **one typeface, more weights, a new heading pattern.** Color and logos are untouched.

| Area | Before | v3.0 |
|------|--------|------|
| Typeface | v2.0 called for Barlow Condensed + Work Sans | **Lato only**, everything |
| Weights | 300 / 400 / 700 / 900 | **300 → 900 including 500, 600, 800** (self-hosted) |
| Heading contrast | Two families | **Weight contrast within one family** |
| Max width | 1200px | **1440px** (new layouts) |
| Radius | 4 / 8 / 16 / 24px | **16 / 22 / 30 / 60 / pill** |
| Easing | unspecified | **`cubic-bezier(.16,1,.3,1)`** |
| Section transitions | gradient fades | **hard orange rule between bands** |
| **Logos** | — | 🔒 **unchanged** |
| **Brand colors** | — | 🔒 **unchanged** |

**The rule that was deleted:** "Never use the same font for headings and body — pair a display/serif with a clean sans." That rule produced nothing we shipped, and the approved design does the opposite deliberately. Contrast now comes from **weight**, not family.

---

## Color System

> 🔒 **Unchanged in v3.0.** This section documents the palette **as it exists in the code today**. It is here for reference, not as a change. Do not swap these values.

### Live tokens — `src/styles/globals.css`

| Token | Hex | CSS var |
|-------|-----|---------|
| Black | `#181818` | `--color-black` |
| Charcoal | `#3A3835` | `--color-charcoal` |
| **Journey Orange** | **`#E8622A`** | `--color-orange` |
| Stone | `#888680` | `--color-stone` |
| Warm White | `#F5F0E8` | `--color-warm-white` |
| Terracotta | `#D4956A` | `--color-terracotta` |
| Sunlight | `#E8C547` | `--color-sunlight` |
| Sky Blue | `#4A90D9` | `--color-sky-blue` |
| Ice | `#E8F4F8` | `--color-ice` |
| Sage Green | `#7AAF6E` | `--color-sage-green` |
| Sand | `#C4B89A` | `--color-sand` |

### Color Rules

- **Never pure white.** Use Warm White `#F5F0E8`.
- **Never pure black.** Use Black `#181818`.
- **Never default Tailwind palette.** No `blue-600`, no `indigo-500`.
- Orange carries **one point of tension per composition** — the section tick, the active card, *or* the CTA. Not all three.

### Surface values used by the reference build

The designer's build introduces two surface tones for its alternating bands. They sit very close to existing tokens and are listed so new layouts can match the reference — **not** as replacements:

| Role | Reference build | Nearest existing token |
|------|-----------------|------------------------|
| Dark band | `#181818` | Black `#181818` — identical |
| Card on dark | `#222222` | *(none — new)* |
| Light band | `#F9F5EE` | Warm White `#F5F0E8` — near-identical |

> **Open question for design:** whether `#222222` should become a real token, or whether new layouts should use Charcoal `#3A3835`. Left undecided — see [Open Items](#open-items).

---

## Typography

### Typeface

**Lato** — and nothing else. No serif, no display face, no secondary family.

- **Self-hosted** via `next/font/local`. **Not** `next/font/google`.
- Weights: **300, 400, 500, 600, 700, 800, 900** + Semibold Italic
- Stack: `"Lato", system-ui, -apple-system, "Segoe UI", sans-serif`
- License: SIL OFL 1.1 — self-hosting is permitted

> ⚠️ **Google Fonts cannot serve this.** It offers Lato in 300/400/700/900 only; requesting 500, 600, or 800 returns HTTP 400. Weight **800 is the single most important weight in the system** — it sets every bold heading phrase. Loading Lato from Google silently collapses 800 → 700 and destroys the heading contrast. Self-hosting is not an optimization, it is a requirement.

### Type Scale

| Tier | Desktop | Mobile | Line Height | Tracking | Weight | Usage |
|------|---------|--------|-------------|----------|--------|-------|
| Display | 60px | 36px | 1.1 | −1.2px | 300 / 800 | Hero H1 only |
| H1 | 50px | 32px | 1.15 | −1.0px | 300 / 800 | Page headlines |
| H2 | 45px | 28px | 1.25 | −0.9px | 300 / 800 | Section headlines |
| H3 | 30px | 24px | 1.2 | −0.5px | 600 | Sub-section titles |
| H4 | 22px | 19px | 1.25 | −0.2px | 700 | Card titles |
| Lead | 18px | 17px | 1.45 | 0 | 400 | Intro paragraphs |
| Body | 16px | 16px | 1.4 | 0 | 400 | Default body copy |
| Body SM | 14px | 14px | 1.5 | 0 | 400 | Secondary text, form labels |
| Label | 13px | 12px | 1.3 | 0.12em | 800 | Uppercase tags, eyebrows |
| Caption | 12px | 11px | 1.3 | 0 | 400 | Legal, fine print |

**Note on body line-height:** v1.0 specified `1.7`. v3.0 uses **`1.4`**, matching the reference build. The tighter leading is deliberate — it keeps dark-band paragraphs dense and confident rather than airy.

---

## The Heading Pattern

This is the signature of the brand. Get it right and everything else follows.

Every section headline is **uppercase**, set in **Light 300**, with the payload phrase in **ExtraBold 800** on the same line.

```html
<h2 class="jrny-h2">Journeys <b>need space.</b></h2>
<h2 class="jrny-h2">Storage without <b>the friction.</b></h2>
<h2 class="jrny-h2">Be <b>the first.</b></h2>
```

```css
.jrny-h2 {
  font-size: 45px;
  line-height: 1.25;
  letter-spacing: -0.9px;
  text-transform: uppercase;
  font-weight: 300;
}
.jrny-h2 b { font-weight: 800; }
```

### Rules

- **Write the copy in sentence case in the markup.** Uppercase is applied by CSS, never typed. This keeps the DOM readable and screen-reader output correct.
- **The bold phrase is the subject, not the modifier.** "Storage without **the friction**" — the bold half is what the reader should leave with.
- **Two weights per heading. Never three.**
- The split happens **once** per headline.
- Body copy may bold a phrase at weight **800** for the same emphasis effect — `<b>` and `<strong>` are globally 800.

### The Accent Tick

Section headings carry a 5px orange bar in the left margin:

```css
.jrny-accent { position: relative; }
.jrny-accent::before {
  content: "";
  position: absolute;
  top: 0; bottom: 0;
  width: 5px;
  background: var(--color-orange);
  left: var(--accent-x, -80px);
  z-index: 2;
}
```

It spans the **full height of the heading block** and sits in the gutter, outside the text column. This is the repeating section marker — use it consistently or not at all.

---

## Layout & Spacing

### Container

```css
.wrap  { width: min(1440px, calc(100% - 64px)); margin: 0 auto; }
.inner { padding: 0 80px; }
```

| Property | Value |
|----------|-------|
| Max content width | **1440px** |
| Viewport gutter | 32px each side (via `100% - 64px`) |
| Inner padding (desktop) | 80px |
| Inner padding (tablet) | 40px |
| Inner padding (mobile) | 20px |
| Section rhythm | **92px** vertical |

### Base Unit: 4px

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 80 · 92 · 128`

Use these. Do not reach for arbitrary Tailwind steps.

### Breakpoints

| Name | Max-width | Purpose |
|------|-----------|---------|
| Wide | 1560px | Reduce outer gutters |
| Desktop | 1400px | Compress inner padding |
| Tablet | 900px | Stack two-column layouts |
| Mobile | 600px | Single column, reduced type |

**Viewport discipline:** the primary device is a MacBook Air M3 13" — effective viewport **1440×820**. Every full-viewport layout (hero sections, deck slides) must fit 1440×820, not 1440×900.

---

## Section Bands

The page alternates **full-bleed dark and cream bands**, each separated by a hard orange rule.

```
┌─ dark  (#181818 + dot texture) ─┐
├───── 5px orange rule ───────────┤
├─ cream (#F9F5EE)  ──────────────┤
├───── 5px orange rule ───────────┤
└─ dark  (#181818 + dot texture) ─┘
```

### Rules

- Bands are **full-bleed**. The container constrains content, never the background.
- The divider is a **hard orange rule** — not a gradient fade, not a soft transition.
- **Never two cream bands in a row.** Alternation is the rhythm.
- Dark bands are the default. Cream bands are for content that needs to breathe: the size guide, the needs list.
- Text on cream uses Ink `#222` / Ink Muted `#615C53`. Text on dark uses Text `#FFFCF8` / Muted `#CEC5B6`.

---

## Shape & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 12px | Icon tiles, small chips |
| `radius-md` | 16px | Dropdown items, inputs |
| `radius-lg` | 22px | Cards, dropdown panels |
| `radius-xl` | 30px | Feature panels, image containers |
| `radius-2xl` | 60px | Large band-edge panels |
| `radius-pill` | 900px | **All buttons**, badges, tags |

### Shape Rules

- **Buttons are always pills.** `border-radius: 900px`, height 63px, padding 14px 20px.
- Large panels may round **selected corners** — the band-edge panels round the two corners facing the page interior and leave the bleeding edge square. This asymmetry is the brand's fingerprint; keep it intentional, not random.
- Radii are generous. When in doubt, go larger.

---

## Elevation & Shadows

Never flat. Never a bare `shadow-md`. Every shadow is **layered**, **low-opacity**, and where it sits on orange, **orange-tinted**.

```css
/* floating panel on dark */
box-shadow: 0 30px 70px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05);

/* raised card */
box-shadow: 0 10px 30px rgba(0,0,0,.6);

/* orange element */
box-shadow: 0 -6px 30px rgba(232,98,42,.35);

/* hairline border (no blur) */
box-shadow: inset 0 0 0 1px var(--color-line);

/* button inner highlight */
box-shadow: inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(232,98,42,.45);
```

### Layering System

| Level | Surface | Treatment |
|-------|---------|-----------|
| Base | `#191919` + dot texture | No shadow |
| Raised | `#222` | Hairline inset border |
| Elevated | `#222` | `0 10px 30px rgba(0,0,0,.6)` |
| Floating | `rgba(28,28,28,.96)` + `blur(16px)` | `0 30px 70px` + inset highlight |

Surfaces must not all sit on the same z-plane.

---

## Texture

Dark backgrounds are **never flat fills.** They carry an 8px SVG dot tile:

```css
--dots: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><rect width='8' height='8' fill='%23191919'/><rect x='1' y='1' width='6' height='6' rx='1.6' fill='%231e1e1e'/></svg>");
background: #191919 var(--dots) repeat;
```

The contrast is deliberately near-invisible (`#191919` on `#1E1E1E`) — it reads as material, not pattern.

> ⚠️ **Print/PDF exception:** SVG filter-based grain balloons exported PDFs (55MB+ observed). For any fixed-page HTML destined for PDF, substitute a **baked-alpha PNG tile**. See `mockups/` for the established pattern.

---

## Motion

### House Easing

```css
--ease: cubic-bezier(.16, 1, .3, 1);
```

This single curve covers the overwhelming majority of transitions. Supporting curves, in order of frequency:

| Curve | Use |
|-------|-----|
| `cubic-bezier(.16,1,.3,1)` | **Default.** Reveals, transforms, panels |
| `cubic-bezier(.2,.8,.2,1)` | Secondary transforms |
| `cubic-bezier(.3,0,.55,1)` | Continuous / looping motion |
| `cubic-bezier(.65,0,.15,1)` | Heavy curtain transitions (intro) |

### Rules

- **Only animate `transform` and `opacity`.** `background` and `color` are permitted for hover states. Nothing else.
- **Never `transition-all`.** Name every property.
- Durations: micro 0.2s · standard 0.35s · reveal 0.6s · curtain 1.6s
- **Every animation must honor `prefers-reduced-motion: reduce`.** No exceptions — the reference build does this on all of them.

### Line Reveal

The signature entrance: headings reveal per line, masked, rising from below.

```css
.rv__line { display: block; overflow: hidden; padding-bottom: .08em; margin-bottom: -.08em; }
.rv__in   { display: block; transform: translateY(112%); opacity: 0; }
.rv.is-in .rv__in {
  transform: translateY(0); opacity: 1;
  transition: transform .6s var(--ease), opacity .3s;
  transition-delay: var(--rv-delay);
}
@media (prefers-reduced-motion: reduce) {
  .rv .rv__in { transform: none; opacity: 1; }
}
```

Stagger lines with `--rv-delay` in ~80ms increments.

---

## Components

### Primary Button

```css
height: 63px;
padding: 14px 20px;
border-radius: 900px;
background: var(--color-orange);   /* #E8622A — the existing brand orange */
color: var(--color-warm-white);    /* as shipped today — see Accessibility */
font-size: 18px;
font-weight: 700;
line-height: 24px;
gap: 10px;
transition: filter .2s, transform .2s;
```

- Always paired with a **circular arrow glyph** on the trailing edge.
- Hover: `filter: brightness(1.06)` + `transform: translateY(-1px)`
- Active: `transform: translateY(0)`
- **Focus-visible is mandatory:** a 3px orange ring at 2px offset.
- ⚠️ **Label color is an open accessibility question.** Light text on the orange fill fails AA (see [Accessibility](#accessibility)). Not changed — flagged for design.

### Interactive State Requirements

Every clickable element ships **hover**, **focus-visible**, and **active**. No exceptions. Focus-visible must be distinguishable from hover — reviewers should be able to tab the entire page and always know where they are.

### Numbered Steps

Process lists use two-digit orange numerals (`01`–`05`) at weight 800, paired with an uppercase title at 700 and a muted description. The numeral is the anchor; the eye should land on it first.

### Cards on Dark

Background `#222`, radius 22px, hairline inset border `var(--color-line)`, elevated shadow on hover only.

---

## Imagery

- **Real people mid-transition.** Moving, unpacking, handing over keys — never staged stock smiles against white.
- **Warm color grade.** The photography leans amber/orange to sit with the palette.
- Orange objects in-frame (boxes, tape, doors) tie image to brand without an overlay.
- Where text sits over an image, apply a gradient scrim: `linear-gradient(to top, rgba(0,0,0,.6), transparent)`.
- Images in panels inherit the panel radius.
- **Pre-optimize every image.** `next.config.ts` sets `images.unoptimized: true`, so Next does not process them. Convert with `sharp` to WebP at true display size before committing.

---

## Logo Usage

> 🔒 **Unchanged in v3.0.** The logo files stay exactly as they are. Do not re-export, recolor, or substitute them.

- Wordmark is always full uppercase **`JOURNEY.STORAGE™`** — `JOURNEY.` bold, `STORAGE™` regular. **Locked artwork — never re-typeset it.**
- The **™ is always present.**
- Files live in [`public/images/brand/`](public/images/brand/): `logo-white.svg`, `logo-dark.svg`, plus `-TM` variants.
- Use `-TM` variants in all formal, legal, and investor contexts.
- Clear space = the height of the letter **J** on all sides.
- Minimum sizes: print 35mm · digital 180px · J Icon 24px / 6mm · favicon 16px.
- **J Icon** (rounded J against the orange corner block) is the compact mark for favicons, avatars, watermarks, and tight UI.
- The oversized footer wordmark is a deliberate device — low-contrast, running the full container width.

---

## Verbal Identity

- **Primary slogan** (used with the logo): **"Space to move on."** — set in Light 300 *Italic*, Stone.
- **Campaign slogan** (brand name absent): **"Journeys need space."**
- **Brand promise:** "Journey holds what matters while you move forward."
- **Two voice modes:** *Energy* (direct, confident, light) and *Comfort* (gentle, present, unhurried). Pick one per composition.
- **Never corporate language** — no "trusted partner", "industry-leading", "best-in-class".
- The brand manifesto is **internal only**. Never publish it as public copy.

**Three-question test before shipping anything:** Does it speak to a life moment? Does it feel like Journey — or could a competitor publish it unchanged? Does it carry the right temperature?

---

## Accessibility

Measured against **`#E8622A`**, the Journey Orange actually in the code:

| Pair | Ratio | Verdict |
|------|-------|---------|
| Warm White `#F5F0E8` on Black `#181818` | **15.65:1** | ✅ AAA |
| Orange `#E8622A` on Black `#181818` | **5.25:1** | ✅ AA |
| Stone `#888680` on Black `#181818` | **4.88:1** | ✅ AA |
| **Black `#181818` on Orange** | **5.25:1** | ✅ AA |
| ⚠️ White on Orange | **3.38:1** | ⚠️ large text only |
| ⚠️ Warm White on Orange | **2.98:1** | ❌ **FAILS** |
| ⚠️ Orange on Warm White | **2.98:1** | ❌ **FAILS** |

### The two that bite

1. **Warm White on an orange fill fails at 2.98:1** — and that is what the CTAs use today. Black on orange would pass at 5.25:1. **Unresolved; nothing has been changed.** See the callout below.
2. **Orange type on light grounds fails at 2.98:1.** On light backgrounds use orange for graphic elements only — rules, ticks, fills — never for text.

> ⚠️ **For design, not for unilateral change.** The site ships Warm White on orange. Fixing it means either dark labels (passes, but changes every CTA) or a darker fill (keeps light text, costs the orange its brightness). **No code has been changed for this.**

### Other requirements

- Orange is never used for **small body copy** on any background.
- Uppercase headings must be **sentence-case in markup** with `text-transform` in CSS, so screen readers do not spell out words letter by letter.
- All motion honors `prefers-reduced-motion`.
- Focus-visible required on every interactive element, visually distinct from hover.
- Interactive states: derive hover/pressed from the existing `--color-orange` (lighten for hover, darken for pressed) rather than introducing new hex values. Disabled 40% opacity.

---

## Implementation Notes

### Tailwind v4 Token Namespace

Tailwind v4 reads specific namespaces. **`--font-size-*` generates nothing.** The correct namespace is **`--text-*`**:

```css
@theme {
  /* ✅ correct */
  --text-h2: 45px;
  --text-h2--line-height: 1.25;
  --text-h2--letter-spacing: -0.9px;

  /* ❌ generates no class */
  --font-size-h2: 2.5rem;
}
```

> This is the root cause of the site-wide 16px fallback: `text-body`, `text-body-sm`, `text-label`, `text-caption`, `text-h2`, `text-h3`, `text-h4`, and `text-subhead` never existed as classes. Verified 2026-09-14 by computed-style probe on `/` and `/smartentry`. The mobile override block at the bottom of `globals.css` is dead for the same reason.

> 🚨 **This is not a one-line fix — it is a visual regression pass.** Every section that looks correct today is correct *by accident of the 16px default*. Renaming the tokens resizes type on **every route at once**. Budget a full screenshot-and-compare sweep across all routes, at all four breakpoints, in the same change.
>
> **Until the migration lands,** new pages must use explicit Tailwind sizes (`text-[16px] leading-[1.4]`, `text-4xl md:text-5xl`) rather than the custom scale — that is what `src/app/smartentry/page.tsx` and `HowItWorks.tsx` already do. Do not "fix" a single page by switching it to the custom classes; they do not work.

### Font Loading — implemented

Nine faces live in `src/fonts/`, loaded via `next/font/local` in each app's `layout.tsx`:

| Weight | Face | Style |
|--------|------|-------|
| 300 | Lato-Light | normal + italic |
| 400 | Lato-Regular | normal |
| 500 | Lato-Medium | normal |
| 600 | Lato-Semibold | normal + italic |
| 700 | Lato-Bold | normal |
| **800** | **Lato-Heavy** | normal — **the heading weight** |
| 900 | Lato-Black | normal |

**Subset to the Latin range only** — 260KB total, down from 1.5MB unsubset. The upstream faces ship with Cyrillic and Greek that Journey has no use for.

Latin covers English, **Spanish**, **Portuguese**, French, German and Italian — every accented character in Spanish and Portuguese lives in Latin-1 Supplement (`U+00C0–00FF`), inside the base latin range. Latin **Extended** (Polish, Czech, Turkish, Romanian, Vietnamese) is deliberately excluded: it costs ~72KB *per face* — 3.5× the file size — for markets Journey does not serve. If that changes, add the ranges to `scripts/subset-fonts.sh` and re-run.

**Regenerate:** `./scripts/subset-fonts.sh <dir-with-full-lato-faces>`

**Verifying it works.** Weight 800 failing silently is the whole risk, and it fails invisibly — the page still renders, just at 700. Measure rendered text width per weight; each must be distinct:

```
300: 709.06px   400: 717.45px   500: 719.20px   600: 721.20px
700: 724.50px   800: 727.56px   900: 731.00px          ← all distinct ✓
```

If 800 equals 700, the Heavy face is not loading.

**Apps:** main site, `investors`, `managed`, `tenant-lab` each carry their own `src/fonts/` copy — there is no shared workspace package (`packages/` does not exist), and each app deploys to its own instance. `apps/hub` is exempt.

### Scope

This guide governs **Journey.Storage**, **Journey.Managed**, **Journey.Direct**, the **investor portal**, **decks and print**, and **email templates**.

**Exception:** `apps/hub` (the internal JARVIS-style work hub) is intentionally off-brand and exempt.

---

## Open Items

### Done

| Item | Notes |
|------|-------|
| ✅ **Self-host Lato** | 9 faces (300–900 + 2 italics), Latin subset, 260KB. Wired into main site, investors, managed, tenant-lab. Weight **800 verified rendering distinct** from 700 and 900 |
| ✅ **Regeneration script** | `scripts/subset-fonts.sh`, with the reasoning in its header |

That is the whole of v3.0 so far. Nothing else in the codebase has been changed.

### For design to decide

| # | Question | Why it matters |
|---|----------|----------------|
| 1 | **Text on orange fills** | Light-on-orange fails AA (2.44–2.98:1). Dark text passes (5.25:1) but changes how every CTA looks. Or darken the fill and keep light text. **Currently unchanged — still light text** |
| 2 | **Is `#222222` a real token?** | The reference build uses it for cards on dark. Existing Charcoal is `#3A3835`. New layouts need one or the other |
| 3 | **Body line-height 1.4 or 1.7?** | v3.0 follows the reference at 1.4. v1.0 said 1.7. Matters most for long-form (blog, legal) |

### Engineering, when the type system gets used

| # | Item | Notes |
|---|------|-------|
| 4 | `--font-size-*` → `--text-*` | Tailwind v4 builds `text-*` from `--text-*`, so the custom type scale generates **nothing** today and everything falls back to 16px. Fixing it resizes type on every route at once — a visual regression pass, not a rename. **Until then, new work should use explicit sizes** (`text-[16px] leading-[1.4]`) |
| 5 | `/smartentry` runs v2.0 typography | Loads Barlow Condensed + Work Sans from Google. Worth aligning next time that page is touched |
| 6 | 22 × `transition-all` | Breaks the stated motion rule, including `src/components/ui/Button.tsx`. Each needs its real property list |

None of items 4–6 are urgent. They are noted so they are not rediscovered from scratch.
