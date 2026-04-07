# Journey.Storage Brand Guidelines

> Single source of truth for all visual and design decisions across **Journey.Storage**, **Journey.Advisory**, and **Journey.Direct**.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Border Radius & Shape Language](#border-radius--shape-language)
5. [Shadows & Elevation](#shadows--elevation)
6. [Gradients](#gradients)
7. [Grain Texture](#grain-texture)
8. [Section Transitions](#section-transitions)
9. [Animations & Motion](#animations--motion)
10. [Components](#components)
11. [Icons](#icons)
12. [Visual Modes](#visual-modes)
13. [Logo Usage](#logo-usage)
14. [Imagery Style](#imagery-style)
15. [Accessibility](#accessibility)
16. [Sub-brands](#sub-brands)
17. [Brand Positioning](#brand-positioning)

---

## Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Black** | `#181818` | Primary dark background, headlines on light |
| **Charcoal** | `#3A3835` | Card surfaces on dark, secondary backgrounds |
| **Journey Orange** | `#E8622A` | Primary accent. Activates ONE element per composition — never scattered |
| **Stone** | `#888680` | Supporting text, metadata, muted UI |
| **Warm White** | `#F5F0E8` | Light backgrounds, primary text on dark. Replaces pure white everywhere |

### Secondary Palette A — Warm Earth (70%+ of total usage)

| Token | Hex | Usage |
|-------|-----|-------|
| **Terracotta** | `#D4956A` | Comfort-mode accents, warm highlights, hover states on light |
| **Sunlight** | `#E8C547` | Reserved for maximum impact only (hero CTAs, launch announcements) |
| **Sand** | `#C4B89A` | Soft comfort backgrounds, dividers on light sections |

### Secondary Palette B — Contrast (sparingly)

| Token | Hex | Usage |
|-------|-----|-------|
| **Sky Blue** | `#4A90D9` | Tech content, data visualizations |
| **Ice** | `#E8F4F8` | Alternative light background for contrast sections (rare) |

### Secondary Palette C — Nature (sparingly)

| Token | Hex | Usage |
|-------|-----|-------|
| **Sage Green** | `#7AAF6E` | Growth narratives, roadmap visuals |

### Error

| Token | Hex | Usage |
|-------|-----|-------|
| **Error Red** | `#D94A4A` | Form validation, error states |

### Color Rules

- Never use pure white (`#FFFFFF`) — always use Warm White (`#F5F0E8`).
- Orange activates ONE point of tension per composition — never scattered decoratively.
- Dark-first default for hero sections, investor pages, high-impact moments.
- Never combine Palette B and Palette C in the same section.
- Sunlight (`#E8C547`) only for maximum-impact moments.
- Never use default Tailwind palette (indigo-500, blue-600, etc.).

---

## Typography

### Typeface

**Lato** — geometric sans-serif with warmth and approachability.

- Source: Google Fonts via `next/font`
- Weights: Light (300), Regular (400), Bold (700), Black (900)
- Fallback: `'Lato', sans-serif`
- No secondary fonts, no serifs, no decorative typefaces.

### Type Scale

| Tier | Desktop | Mobile | Line Height | Weight | Usage |
|------|---------|--------|-------------|--------|-------|
| Display | 4.5rem (72px) | 2.75rem (44px) | 0.92 | 900 Black | Hero H1 only |
| H1 | 3.5rem (56px) | 2rem (32px) | 1.0 | 700 Bold | Page headlines |
| H2 | 2.5rem (40px) | 1.75rem (28px) | 1.08 | 700 Bold | Section headlines |
| H3 | 1.75rem (28px) | 1.375rem (22px) | 1.15 | 700 Bold | Sub-section titles |
| H4 | 1.375rem (22px) | 1.125rem (18px) | 1.25 | 700 Bold | Card titles |
| Subhead | 1.375rem (22px) | 1.125rem (18px) | 1.4 | 300 Light | Intro phrases, emotional lines |
| Body | 1.0625rem (17px) | 1rem (16px) | 1.7 | 400 Regular | Paragraphs, body copy |
| Body SM | 0.9375rem (15px) | 0.875rem (14px) | 1.6 | 400 Regular | Secondary text, form labels |
| Label | 0.8125rem (13px) | 0.75rem (12px) | 1.4 | 700 Bold | Tags, categories (uppercase + 0.2em tracking) |
| Caption | 0.75rem (12px) | 0.6875rem (11px) | 1.5 | 400 Regular | Legal text, copyright, fine print |

### Typography Rules

- Sentence case always — except uppercase for display hero text, labels/tags, and logo lockup.
- Max two weights per section (typically Bold + Regular, or Black + Light).
- One word/phrase per composition may be set in Journey Orange for activation.
- "Space to move on." renders in Light 300 Italic, Stone color.
- No Title Case in body text.
- Tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.

---

## Spacing & Layout

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Micro (icon gaps, inline elements) |
| space-2 | 8px | Tight (label-field gaps, icon-text) |
| space-3 | 12px | Small gaps between related elements |
| space-4 | 16px | Default element spacing |
| space-6 | 24px | Medium (card content, heading-body) |
| space-8 | 32px | Section internal padding |
| space-12 | 48px | Large (section breaks on mobile) |
| space-16 | 64px | Section padding (desktop) |
| space-20 | 80px | Major section breaks |
| space-24 | 96px | Large desktop section padding |
| space-32 | 128px | Hero padding, maximum breathing room |

### Layout Constraints

| Property | Value |
|----------|-------|
| Max content width | 1200px |
| Desktop padding | 0 64px |
| Tablet padding | 0 32px |
| Mobile padding | 0 20px |
| Section vertical (desktop) | 96–128px |
| Section vertical (mobile) | 48–64px |

### Breakpoints

| Name | Width | Tailwind prefix |
|------|-------|-----------------|
| Mobile | 0px | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |
| Large Desktop | 1280px | `xl:` |
| Max Width | 1440px | `2xl:` |

---

## Border Radius & Shape Language

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | Form inputs, small buttons |
| radius-md | 8px | Cards, image containers |
| radius-lg | 16px | Hero cards, featured elements |
| radius-xl | 24px | CTA buttons, hero badges |
| radius-brand | Asymmetric | Brand signature — round 1–2 corners, leave others sharp |

### Shape Language Rules

- **Asymmetric corners** are the brand's visual fingerprint.
- Rounding implies movement and direction.
- All shapes are grid-based (rectangles, circles, half-circles).
- Negative space communicates confidence.
- Shapes should suggest motion across the frame.

---

## Shadows & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | `0 1px 2px rgba(24,24,24,0.05)` | Subtle lift on light backgrounds |
| shadow-md | `0 4px 16px rgba(24,24,24,0.08)` | Cards on Warm White |
| shadow-lg | `0 12px 32px rgba(24,24,24,0.12)` | Modals, dropdowns, floating elements |

### Elevation Rules

| Context | Surface | Shadow | Border |
|---------|---------|--------|--------|
| Dark backgrounds | Charcoal (`#3A3835`) | None | `1px solid rgba(255,255,255,0.06)` |
| Light backgrounds | White / Cream | shadow-sm or shadow-md | None |

Never use flat `shadow-md` from the default Tailwind palette. Use the custom layered definitions above.

---

## Gradients

### Radial (background overlays)

Used to add subtle warmth to sections. Always orange-tinted, very low opacity:

```css
/* Pricing / How It Works */
radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)

/* Locations Map */
radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,98,42,0.03), transparent)

/* Waitlist */
radial-gradient(ellipse 50% 50% at 50% 50%, rgba(232,98,42,0.05), transparent)

/* Final CTA */
radial-gradient(ellipse 50% 60% at 50% 40%, rgba(232,98,42,0.06), transparent)

/* About Founder */
radial-gradient(ellipse 60% 80% at 20% 50%, rgba(232,98,42,0.06), transparent)
```

### Linear (hero image overlays)

```css
/* Desktop hero */
linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)

/* Mobile hero */
linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)

/* Base hero */
linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)
```

### Divider

```css
linear-gradient(to right, transparent 0%, rgba(245,240,232,0.06) 50%, transparent 100%)
```

### Dot Grid (hero)

```css
radial-gradient(circle, #F5F0E8 0.7px, transparent 0.7px)
/* spacing: 20px x 20px */
```

### Gradient Rules

- Layer multiple radial gradients for depth.
- Add grain texture via SVG noise filter on top.
- Never use flat, single-direction gradients as primary design.

---

## Grain Texture

Applied as a pseudo-element on sections for tactile depth:

```css
.grain::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.035;           /* 0.03 on Advisory site */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256'
    xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence
    type='fractalNoise' baseFrequency='0.85' numOctaves='4'
    stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25'
    height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
```

---

## Section Transitions

Wedge shape between sections:

```css
.wedge-top::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 80px;
  background: inherit;
  clip-path: polygon(0 0, 100% 60px, 100% 100%, 0 100%);
  z-index: 1;
}
```

---

## Animations & Motion

### Timing Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| motion-fast | 150ms | ease-out | Hover states, button feedback |
| motion-normal | 300ms | ease-out | Section reveals, nav transitions |
| motion-slow | 500ms | ease-out | Hero entrance, page transitions |
| motion-stagger | 100ms delay | — | Between sequential elements |

### Primary Easing

```
cubic-bezier(0.22, 1, 0.36, 1)
```

Confident, forward motion. Used on all entrance animations.

### Keyframe Animations

**pulse-slow** — ambient map pin glow
```css
0%, 100% { transform: scale(1); opacity: 0.7; }
50%      { transform: scale(1.3); opacity: 1; }
/* 2s infinite */
```

**pin-pop** — map location entrance
```css
0%   { transform: scale(0); opacity: 0; }
70%  { transform: scale(1.15); opacity: 1; }
100% { transform: scale(1); opacity: 1; }
/* 500ms forwards */
```

**heroFadeUp** — hero content entrance
```css
from { opacity: 0; transform: translateY(30px); }
to   { opacity: 1; transform: translateY(0); }
/* 0.7s cubic-bezier(0.22, 1, 0.36, 1) */
```

**fadeIn** — general fade
```css
from { opacity: 0; }
to   { opacity: 1; }
```

**marquee** — scrolling text
```css
0%   { transform: translateX(0); }
100% { transform: translateX(-50%); }
```

### Animation Patterns

| Pattern | Transform | Timing |
|---------|-----------|--------|
| Scroll reveal | translateY(20px) to 0 + fade | 300ms |
| Stagger reveal | Same, each child +100ms delay | 300ms each |
| Navbar solidify | opacity 0 to 0.95 + backdrop blur | 300ms |
| Parallax (subtle) | translateY at 0.1–0.2x scroll | Hero images only |
| Hover lift | translateY(-2px) + shadow increase | 150ms |

### Motion Rules

- Only animate `transform` and `opacity`. Never `transition-all`.
- Use spring-style easing (`cubic-bezier(0.22, 1, 0.36, 1)`).
- Respect `prefers-reduced-motion: reduce` — disable all animations except state changes.

---

## Components

### Buttons

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Primary | Orange `#E8622A` | Warm White | None | brightness(1.1), shadow increase, -1px lift |
| Secondary | Transparent | Warm White (dark) / Black (light) | 1px solid (text at 40%) | bg fill at 10%, border to 60% |
| Ghost | Transparent | Stone `#888680` | None | text color changes to Orange |

**Button specs:**
- Border radius: 24px (radius-xl) — fully rounded
- Font: Lato Bold 700, body size, sentence case
- Min height: 44px
- Padding: 14px 28px
- Directional arrow (`->`) on secondary/ghost variants
- Focus ring: 2px solid Orange, 2px offset
- Primary shadow: `0 2px 8px rgba(232,98,42,0.3)`
- Disabled: 40% opacity, `cursor: not-allowed`

### Form Inputs

- Background: `rgba(255,255,255,0.06)` on dark / white on light
- Border: 1px solid Stone at 30% (focus: Orange)
- Border radius: 4px (radius-sm)
- Padding: 14px 16px
- Placeholder: Stone color
- Label: Lato Bold 700, body-sm, 8px gap above input
- Error: border `#D94A4A`, caption-size message below

### Cards

| Property | Dark Background | Light Background |
|----------|-----------------|------------------|
| Surface | Charcoal `#3A3835` | White |
| Border | 1px solid rgba(255,255,255,0.06) | None |
| Shadow | None | shadow-md |
| Radius | 8px or asymmetric | 8px or asymmetric |
| Padding | 32px | 32px |
| Hover | Border opacity to 0.12 | Shadow to shadow-lg |

### Differentiator Cards (colored blocks)

- Backgrounds: Orange / Terracotta / Charcoal / Sand
- Border radius: 16px (radius-lg)
- Padding: 28px (mobile) / 36px (desktop)
- Min height: 200px (mobile) / 240px (desktop)
- Hover: translateY(-4px)
- Ghost number: 8–10rem, opacity 0.06–0.08

### Navigation

**Desktop:**
- Height: 72px
- Background: transparent over hero, then Black at 95% + 12px backdrop blur on scroll
- Logo: left, min 180px wide
- Nav links: Lato Bold 700, body-sm, Warm White, 32px gap
- CTA: Primary button, right-aligned

**Mobile:**
- Height: 64px
- Hamburger: 24px, right side
- Menu overlay: fullscreen, Black, fade-in 300ms
- Items: centered, h3 size, 24px vertical gap
- CTA: full-width at bottom

### Footer

- Background: Black
- Grid: 4 columns (desktop), stacked (mobile)
- Column headers: Lato Bold 700, label size, uppercase, Warm White
- Links: Lato Regular 400, body-sm, Stone. Hover: Warm White
- Social icons: 20px, Stone. Hover: Orange
- Copyright: caption size, Stone
- Padding: space-20 top, space-12 bottom

---

## Icons

**Library:** Lucide React

| Size | Usage |
|------|-------|
| 20px | Navigation, inline |
| 24px | Standalone (default) |
| 40px | Featured / hero |

- Stroke width: 1.5px
- Color: inherits text color (Warm White / Stone on dark; Black / Stone on light)
- Hover: Orange (interactive elements)

---

## Visual Modes

### Energy Mode (dark-first)

- Background: Black / Charcoal
- Text: Warm White
- Accent: Orange (dominant, activating)
- Typography: Bold/Black weights, larger scale
- Composition: Asymmetric, shapes cutting the frame, dynamic tension
- Use for: Hero, differentiators, locations map, investor content

### Comfort Mode (light)

- Background: Warm White / Sand
- Text: Black
- Accent: Orange (restrained, warm)
- Typography: Regular/Light weights, generous leading
- Composition: Centered/balanced, generous negative space
- Use for: Life moments, waitlist, blog, founder section, trust-building

### Page Alternation Pattern (main site)

| Section | Mode |
|---------|------|
| Hero | Energy (dark) |
| Life Moments | Comfort (light) |
| Brand Positioning | Comfort (light) |
| How It Works | Transitional (light + bold type) |
| Differentiators | Energy (dark) |
| Locations Map | Energy (dark) |
| Founded By | Comfort (light) |
| Waitlist | Comfort (light) |
| Footer | Energy (dark) |

---

## Logo Usage

### Files

| File | Usage |
|------|-------|
| `public/images/brand/logo-white.svg` | Dark backgrounds |
| `public/images/brand/logo-white-TM.svg` | Dark backgrounds (with TM) |
| `public/images/brand/logo-dark.svg` | Light backgrounds |
| `public/images/brand/logo-dark-TM.svg` | Light backgrounds (with TM) |
| `public/images/brand/favicon.svg` | Browser tab (16px JS mark) |
| `public/images/brand/apple-touch-icon.svg` | iOS (180x180px JS mark) |
| `public/images/brand/og-image-default.png` | Social share (1200x630px) |

### Rules

- Always include the TM symbol — never omit.
- Clear space = height of the letter "J".
- Minimum digital size: 180px wide (nav), 120px (footer).
- Dark backgrounds: white logo. Light backgrounds: dark logo.
- Slogan lockup: "Space to move on." in Light 300 Italic, Stone color, space-2 gap below logo.

---

## Imagery Style

### Photography Principles

- People as subject, storage as consequence.
- Never show storage units or boxes as the hero element.
- Show human moments: the move, the person, the life in motion.
- Warm color treatment throughout — no cool/blue grading.
- Authentic, not staged.
- Dark overlay for text legibility on hero images.

### Image Containers

- Default radius: 8px (radius-md)
- Featured: asymmetric rounding (radius-brand)
- Aspect ratios: 16:9 (hero), 4:3 (cards), 1:1 (portraits)

### Image Treatments

- Gradient overlay on all hero imagery: `bg-gradient-to-t from-black/60`
- Color treatment layer with `mix-blend-multiply` where appropriate.

### Asset Locations

| Folder | Contents |
|--------|----------|
| `public/images/brand/` | Logos, favicon, og-image |
| `public/images/hero/` | Hero backgrounds |
| `public/images/moments/` | Life moment photography |
| `public/images/facility/` | Facility renderings |
| `public/images/team/` | Team/founder portraits |
| `public/images/map/` | USA outline map SVG |

---

## Accessibility

### WCAG 2.1 AA Compliance

- All text meets 4.5:1 contrast ratio against its background.
- Orange on dark: passes. Orange on light: large text only (3:1 minimum).
- Focus states: 2px solid Orange, 2px offset, on all interactive elements.
- All content images have descriptive `alt` text. Decorative images use `aria-hidden="true"`.
- Keyboard navigation: logical tab order, arrow keys for dropdowns.
- Reduced motion: `prefers-reduced-motion: reduce` disables all animations except state changes.
- Forms: labeled inputs, `aria-describedby` for errors, `aria-required` for required fields.

---

## Sub-brands

### Journey.Advisory (consulting)

- Same color palette — reduced set (no Sky Blue, Ice, Sage Green).
- Same typography and type scale.
- Same spacing, layout, and animation system.
- Hero badge: "JOURNEY.ADVISORY" with orange live indicator + "Consulting & Operations" subtitle.
- Grain opacity: 0.03 (slightly softer than main site's 0.035).
- Focus: institutional credibility, CTAs oriented toward scheduling and pricing.

### Journey.Direct (investors)

- Status: coming soon.
- Black background, white text, minimal branding.

---

## Brand Positioning

| Element | Value |
|---------|-------|
| **Tagline** | "Space to move on." |
| **Brand Promise** | A new kind of self-storage built for people in motion |
| **Emotional Core** | Confidence, forward movement, intentionality |
| **Visual DNA** | Asymmetric geometry, warm earth tones, high contrast, generous spacing |

---

## Development Reference

| Property | Value |
|----------|-------|
| Color tokens | `src/lib/constants.ts` + CSS variables in `globals.css` |
| Tailwind | v4 with CSS `@theme` variables |
| Font loading | `next/font/google` — Lato 300, 400, 700, 900 |
| Motion library | Framer Motion |
| Icons | Lucide React (24px default) |
| Images | Next.js Image (unoptimized for WebP support) |
| Build | Standalone output |
