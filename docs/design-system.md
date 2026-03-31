# Design System — journey.storage
### Step 5: Brand Manual + Visual DNA + References → Implementable Rules

> **This document is the single source of truth for all visual decisions on the website.**
> Claude Code follows this file. If it's not here, it doesn't exist.

---

## 1. Color System

### Primary Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--black` | #181818 | 24, 24, 24 | Page backgrounds (Energy mode), headlines, primary text on light bg |
| `--charcoal` | #3A3835 | 58, 56, 53 | Secondary backgrounds, card surfaces on dark sections, subtle elevation |
| `--journey-orange` | #E8622A | 232, 98, 42 | Primary accent. Activator. ONE element per composition — never decorative |
| `--stone` | #888680 | 136, 134, 128 | Supporting text, secondary labels, metadata, muted UI elements |
| `--warm-white` | #F5F0E8 | 245, 240, 232 | Page backgrounds (Comfort mode), light surfaces. **Replaces #FFFFFF everywhere** |

### Secondary Palette A — Warm Earth (70%+ of total color usage)

| Token | Hex | Usage |
|-------|-----|-------|
| `--terracotta` | #D4956A | Comfort mode accents, warm highlights, hover states on light backgrounds |
| `--sunlight` | #E8C547 | Maximum impact only: hero CTAs, launch announcements. Never casual |
| `--warm-white` | #F5F0E8 | (shared with primary) |

### Secondary Palette B — Contrast (supplementary, use sparingly)

| Token | Hex | Usage |
|-------|-----|-------|
| `--sky-blue` | #4A90D9 | Tech content, Gen Z targeting, data visualizations on investor pages |
| `--ice` | #E8F4F8 | Alternative light background for contrast sections (rare) |

### Secondary Palette C — Nature (supplementary, use sparingly)

| Token | Hex | Usage |
|-------|-----|-------|
| `--sage-green` | #7AAF6E | Growth narratives, expansion/roadmap visuals |
| `--sand` | #C4B89A | Soft comfort backgrounds, dividers on light sections |

### Color Rules (non-negotiable)

| Rule | Detail |
|------|--------|
| **Never use #FFFFFF** | All light backgrounds use `--warm-white` (#F5F0E8). Cold white is banned. |
| **Orange activates, never decorates** | Journey Orange marks ONE point of tension per composition: a button, a word, a shape, an accent. Never scattered across multiple elements. |
| **Dark-first for Energy mode** | Dark backgrounds (#181818) are the default for hero sections, investor pages, and high-impact moments. |
| **Warm White for Comfort mode** | Light sections use #F5F0E8. Warmth is a brand principle. |
| **Max two palettes per composition** | Never combine Palette B and Palette C in the same section. Palette A is always present. |
| **Sunlight is reserved** | #E8C547 only for maximum-impact moments: hero CTA, launch badge. Never as a casual accent. |

### Tailwind Config Extension

```js
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
}
```

---

## 2. Typography

### Typeface: Lato

**Primary and only typeface.** Lato is a geometric sans-serif with warmth — the rounded terminals give it approachability while the structure maintains professionalism. Available on Google Fonts. Self-host via `next/font`.

**Fallback stack:** `'Lato', sans-serif`

**No serifs. Ever.** No secondary display fonts. No decorative typefaces. Lato carries everything.

### Weight System

| Weight | CSS Value | Role |
|--------|-----------|------|
| Black | 900 | Display headlines (hero H1, campaign statements). Energy mode. Uppercase permitted for display only. |
| Bold | 700 | Section headlines (H2), card titles, CTA buttons, nav items, labels/tags (uppercase + letter-spacing) |
| Regular | 400 | Body copy, descriptions, form fields, supporting text |
| Light | 300 | Subheadlines, emotional/poetic lines, Comfort mode intro phrases. Use italic for slogan lockup. |

### Type Scale

| Token | Size (desktop) | Size (mobile) | Line Height | Weight | Usage |
|-------|---------------|---------------|-------------|--------|-------|
| `--text-display` | 72px / 4.5rem | 40px / 2.5rem | 0.95 | 900 (Black) | Hero H1 only. "Space to move on." |
| `--text-h1` | 56px / 3.5rem | 32px / 2rem | 1.05 | 700 (Bold) | Page-level headlines (rare — most pages use display) |
| `--text-h2` | 40px / 2.5rem | 28px / 1.75rem | 1.1 | 700 (Bold) | Section headlines. "Journeys need space." |
| `--text-h3` | 28px / 1.75rem | 22px / 1.375rem | 1.2 | 700 (Bold) | Sub-section titles, card headlines |
| `--text-h4` | 22px / 1.375rem | 18px / 1.125rem | 1.3 | 700 (Bold) | Card titles, differentiator hooks |
| `--text-subhead` | 22px / 1.375rem | 18px / 1.125rem | 1.4 | 300 (Light) | Intro phrases, emotional sublines. Comfort mode. |
| `--text-body` | 17px / 1.0625rem | 16px / 1rem | 1.65 | 400 (Regular) | Body copy, descriptions, paragraphs |
| `--text-body-sm` | 15px / 0.9375rem | 14px / 0.875rem | 1.6 | 400 (Regular) | Secondary text, form labels, helper text |
| `--text-label` | 13px / 0.8125rem | 12px / 0.75rem | 1.4 | 700 (Bold) | Tags, metadata, category labels. Uppercase + letter-spacing 1.5px |
| `--text-caption` | 12px / 0.75rem | 11px / 0.6875rem | 1.5 | 400 (Regular) | Legal text, copyright, fine print |

### Typography Rules

| Rule | Detail |
|------|--------|
| **Sentence case always** | All copy uses sentence case. Never Title Case in body text. |
| **Uppercase exceptions only** | Uppercase permitted for: display hero text (Black 900), labels/tags (Bold 700 + letter-spacing), and JOURNEY.STORAGE institutional logo variant. |
| **Max two weights per section** | Each section uses at most two weights. Typically Bold + Regular, or Black + Light. More creates noise. |
| **Orange for one word/phrase** | A single word or phrase per composition can be set in Journey Orange for activation. Never multiple orange words. |
| **Slogan in Light Italic** | "Space to move on." always renders in Light 300 Italic when used as a lockup element. Stone color (#888680). |

### Tailwind Config Extension

```js
fontFamily: {
  sans: ['Lato', 'sans-serif'],
},
fontSize: {
  'display': ['4.5rem', { lineHeight: '0.95', fontWeight: '900' }],
  'h1': ['3.5rem', { lineHeight: '1.05', fontWeight: '700' }],
  'h2': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
  'h3': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
  'h4': ['1.375rem', { lineHeight: '1.3', fontWeight: '700' }],
  'subhead': ['1.375rem', { lineHeight: '1.4', fontWeight: '300' }],
  'body': ['1.0625rem', { lineHeight: '1.65', fontWeight: '400' }],
  'body-sm': ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }],
  'label': ['0.8125rem', { lineHeight: '1.4', fontWeight: '700', letterSpacing: '0.1em' }],
  'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
},
```

---

## 3. Spacing System

Based on a 4px base unit. Generous spacing is a brand principle — compositions should breathe.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro spacing (icon gaps, inline elements) |
| `--space-2` | 8px | Tight spacing (between label and field, icon and text) |
| `--space-3` | 12px | Small gaps (between related elements) |
| `--space-4` | 16px | Default element spacing (between paragraphs, form fields) |
| `--space-6` | 24px | Medium spacing (between card elements, between heading and body) |
| `--space-8` | 32px | Section internal padding (top/bottom of content blocks) |
| `--space-12` | 48px | Large spacing (between sections on mobile) |
| `--space-16` | 64px | Section padding (desktop) |
| `--space-20` | 80px | Major section breaks |
| `--space-24` | 96px | Section padding (large desktop) |
| `--space-32` | 128px | Hero section padding, maximum breathing room |

### Layout Constraints

| Property | Value |
|----------|-------|
| Max content width | 1200px |
| Content padding (desktop) | 0 64px (space-16 each side) |
| Content padding (tablet) | 0 32px (space-8 each side) |
| Content padding (mobile) | 0 20px |
| Section vertical padding (desktop) | 96px–128px (space-24 to space-32) |
| Section vertical padding (mobile) | 48px–64px (space-12 to space-16) |

---

## 4. Border Radius & Shape Language

Journey's visual signature is **asymmetric corner rounding** — selective rounding on individual corners creates implicit movement and direction. This comes directly from the logo icon's geometric construction.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Sharp corners (tables, dividers, utility elements) |
| `--radius-sm` | 4px | Subtle rounding (form inputs, small buttons) |
| `--radius-md` | 8px | Default rounding (cards, image containers) |
| `--radius-lg` | 16px | Prominent rounding (hero cards, featured elements) |
| `--radius-xl` | 24px | Large rounding (CTA buttons, hero badges) |
| `--radius-brand` | Custom | **Asymmetric** — one or two corners rounded (16–24px), others sharp. The brand's visual fingerprint. Use deliberately on featured cards, image frames, and decorative shapes. |

### Shape Language Rules

| Rule | Detail |
|------|--------|
| **Asymmetric corners are the signature** | When rounding a container, round 1–2 corners and leave the rest sharp. This implies movement and direction. |
| **Geometric modules only** | All shapes are grid-based: rectangles, circles, half-circles. No organic or freeform shapes. |
| **Negative space communicates** | Generous empty space = confidence and maturity. Never fill every available area. |
| **Shapes suggest motion** | Position shapes to suggest movement across the frame. The geometry tells a directional story. |

---

## 5. Shadows & Elevation

Minimal shadows. Journey's depth comes from color contrast and spacing, not drop shadows.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(24,24,24,0.05)` | Subtle lift on light backgrounds (form inputs, small cards) |
| `--shadow-md` | `0 4px 12px rgba(24,24,24,0.08)` | Cards and elevated surfaces on Warm White backgrounds |
| `--shadow-lg` | `0 8px 24px rgba(24,24,24,0.12)` | Modals, dropdowns, floating elements |
| `--shadow-none` | none | Dark backgrounds. No shadows on dark surfaces — use border or color shift for elevation. |

### Elevation on Dark vs. Light

| Background | Elevation method |
|------------|-----------------|
| Dark (#181818) | Use `--charcoal` (#3A3835) as surface color. No shadows. Border `1px solid rgba(255,255,255,0.06)` for subtle separation. |
| Light (#F5F0E8) | Use `--shadow-sm` or `--shadow-md`. White/cream card surfaces with subtle shadow. |

---

## 6. Components

### Buttons

| Variant | Background | Text | Border | Hover | Usage |
|---------|-----------|------|--------|-------|-------|
| **Primary** | `--journey-orange` | White | none | Darken 10%, subtle scale 1.02 | Main CTA: "Join the Waitlist", "Schedule a Call" |
| **Secondary** | transparent | `--warm-white` (on dark) or `--black` (on light) | 1px solid current text color | Background fills with 10% opacity of text color | Secondary actions: "Learn more", "Explore" |
| **Ghost** | transparent | `--stone` | none | Text color shifts to `--journey-orange` | Tertiary: footer links, nav items |

**Button specs:**
- Padding: 14px 28px (desktop), 12px 24px (mobile)
- Border radius: `--radius-xl` (24px) — fully rounded feel
- Font: Lato Bold 700, `--text-body` size, sentence case
- Directional arrow (→) appended to text on secondary/ghost variants
- Min touch target: 44px height (accessibility)
- Disabled state: 40% opacity, no hover effect, cursor not-allowed

### Form Inputs

| Property | Value |
|----------|-------|
| Background | `rgba(255,255,255,0.06)` on dark / `white` on light |
| Border | 1px solid `--stone` at 30% opacity |
| Border (focus) | 1px solid `--journey-orange` |
| Border radius | `--radius-sm` (4px) |
| Padding | 14px 16px |
| Font | Lato Regular 400, `--text-body` |
| Placeholder color | `--stone` |
| Label | Lato Bold 700, `--text-body-sm`, positioned above input with `--space-2` gap |
| Error state | Border color `#D94A4A`, error message in `--text-caption` below input |

### Cards

| Property | Dark background | Light background |
|----------|----------------|-----------------|
| Surface color | `--charcoal` (#3A3835) | White (#FFFFFF — exception: card surfaces on warm-white bg CAN be pure white for contrast) |
| Border | `1px solid rgba(255,255,255,0.06)` | none |
| Shadow | none | `--shadow-md` |
| Border radius | `--radius-md` (8px) or `--radius-brand` (asymmetric) |
| Padding | 32px (space-8) | 32px (space-8) |
| Hover | Border opacity increases to 0.12 | Shadow increases to `--shadow-lg` |

### Navigation

**Desktop:**
- Height: 72px
- Background: transparent (over hero) → `--black` with 95% opacity + backdrop blur on scroll
- Transition: 300ms ease background-color and backdrop-filter
- Logo: left-aligned, minimum 180px wide
- Nav links: Lato Bold 700, `--text-body-sm`, `--warm-white`, 32px gap between items
- CTA button: Primary button variant, right-aligned
- Dropdown (Business): appears on hover/click, `--charcoal` background, `--shadow-lg`, `--radius-md`

**Mobile:**
- Hamburger icon: right side, 24px, `--warm-white`
- Menu overlay: fullscreen, `--black` background, fade-in 300ms
- Nav items: centered, Lato Bold 700, `--text-h3` size, 24px vertical gap between items
- CTA button: full-width at bottom of overlay, Primary variant

### Footer

- Background: `--black`
- 4-column grid (desktop), stacked (mobile)
- Logo + slogan in column 1. Slogan in Light 300 Italic, `--stone` color.
- Link text: Lato Regular 400, `--text-body-sm`, `--stone` color. Hover: `--warm-white`.
- Column headers: Lato Bold 700, `--text-label`, `--warm-white`, uppercase + letter-spacing.
- Social icons: 20px, `--stone` fill. Hover: `--journey-orange`.
- Compact email capture: single-line form, `--text-body-sm`, Secondary button style.
- Copyright: `--text-caption`, `--stone`.
- Vertical padding: `--space-20` top, `--space-12` bottom.

---

## 7. Icons

**Library:** Lucide React
**Default size:** 20px (nav, inline), 24px (standalone), 40px (featured)
**Stroke width:** 1.5px (default Lucide)
**Color:** inherits text color. On dark backgrounds: `--warm-white` or `--stone`. On light backgrounds: `--black` or `--stone`.
**Hover color:** `--journey-orange` (when interactive)

**Custom icons:** The "How It Works" step icons may need custom SVGs matching Journey's geometric shape language. Built as simple line icons — rectangular forms, selective corner rounding, consistent stroke weight.

---

## 8. Motion & Animation

### Principles
- **Confident, not playful.** Animations communicate quality and intentionality, not fun.
- **Forward motion.** Default direction is upward (enter from below) or left-to-right. Consistent with Journey's "moving forward" brand concept.
- **Restraint.** If an animation doesn't serve comprehension or emotional impact, remove it.

### Timing Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--motion-fast` | 150ms | ease-out | Hover states, button feedback, micro-interactions |
| `--motion-normal` | 300ms | ease-out | Section reveals, fade-ins, nav transitions |
| `--motion-slow` | 500ms | ease-out | Hero entrance, page transitions, map pin animations |
| `--motion-stagger` | 100ms | — | Delay between sequential elements (cards, steps, pins) |

### Animation Patterns

| Pattern | Spec | Usage |
|---------|------|-------|
| **Scroll reveal** | `translateY(20px) → translateY(0)` + `opacity 0 → 1`, duration `--motion-normal` | Default entrance for all sections as they enter viewport |
| **Stagger reveal** | Same as scroll reveal, each child delayed by `--motion-stagger` | Cards, steps, differentiator blocks, map pins |
| **Navbar solidify** | Background opacity `0 → 0.95` + backdrop-filter blur, duration `--motion-normal` | Navbar transition on scroll past hero |
| **Parallax (subtle)** | `translateY` at 0.1–0.2x scroll speed | Hero background image only. Subtle. Never on text. |
| **Pin pop** | `scale(0) → scale(1.1) → scale(1)` + `opacity 0 → 1`, duration `--motion-slow` | Map location pins appearing on the U.S. map |
| **Pin pulse** | `scale(1) → scale(1.3) → scale(1)` + opacity shift, infinite loop, 2s | 2–3 "active" pins on the map suggesting coming-soon |
| **Form success** | Content crossfade, duration `--motion-normal` | Form → success message transition after submission |
| **Hover lift** | `translateY(-2px)` + shadow increase, duration `--motion-fast` | Cards on light backgrounds |

### Reduced Motion
- Respect `prefers-reduced-motion: reduce`. Disable all animations except essential state changes (hover, focus).
- Parallax completely disabled. Scroll reveals become instant (no translate, just immediate visibility).

---

## 9. Visual Modes

Every section operates in one of two modes. This is not optional — it's how the brand breathes.

### Energy Mode
| Property | Value |
|----------|-------|
| Background | `--black` (#181818) or `--charcoal` (#3A3835) |
| Text | `--warm-white` (#F5F0E8) |
| Accent | `--journey-orange` — dominant, activating |
| Typography | Bold/Black weights. Larger scale. Condensed leading. |
| Composition | Asymmetric. Shapes cutting the frame. Dynamic tension. |
| Use for | Hero, differentiators, locations map, investor content, launch energy |

### Comfort Mode
| Property | Value |
|----------|-------|
| Background | `--warm-white` (#F5F0E8) or `--sand` (#C4B89A) |
| Text | `--black` (#181818) |
| Accent | `--journey-orange` — restrained, warm |
| Typography | Regular/Light weights. Generous leading. Breathing compositions. |
| Composition | Centered or balanced. Generous negative space. |
| Use for | Life moments, brand positioning, waitlist, blog content, trust-building |

### Mode Alternation
The landing page alternates between modes to create rhythm:
```
Hero ............... Energy (dark)
Life Moments ....... Comfort (light)
Brand Positioning .. Comfort (light) — can use subtle bg shift to sand/cream
How It Works ....... Transitional — light bg, bolder type
Differentiators .... Energy (dark)
Locations Map ...... Energy (dark)
Founded By ......... Comfort (light)
Waitlist ........... Comfort (light)
Footer ............. Energy (dark)
```

---

## 10. Logo Usage on the Website

### Rules (from Visual DNA Manual)

| Rule | Implementation |
|------|---------------|
| **Always include ™** | The ™ symbol is never omitted, even in the nav. |
| **Clear space = height of letter J** | Maintain this padding around the logo in all contexts. |
| **Minimum digital size: 180px wide** | Nav logo must be at least 180px. Footer logo can be smaller but never below 120px. |
| **Dark bg: white logo** | On `--black` or `--charcoal` backgrounds, use the full-white logo variant. |
| **Light bg: dark logo** | On `--warm-white` or light backgrounds, use the original dark variant. |
| **Slogan lockup** | "Space to move on." in Light 300 Italic, `--stone` color, positioned below the logo with `--space-2` gap. Used in footer and hero if applicable. |

### Brand Icon (JS Mark)
- Used for favicon (16px), app icon, and compact contexts.
- Minimum size: 24px.
- Same colorway rules as the full logotype.

---

## 11. Image Treatment

### Photography Principles (from Brand Manual)
| Principle | Detail |
|-----------|--------|
| **People as subject, storage as consequence** | Never show storage units or boxes as the hero of any image. Show the human moment — the move, the person, the life in motion. |
| **Warm color treatment** | All photography uses warm tones. No cool/blue color grading. |
| **Authentic, not staged** | Images should feel like real moments, not marketing setups. |
| **Dark overlay for text legibility** | Hero images use a gradient overlay (black to transparent) to ensure text contrast. |

### Image Containers
- Default border radius: `--radius-md` (8px)
- Brand signature: `--radius-brand` (asymmetric rounding) on featured images
- Aspect ratios: 16:9 (hero, wide), 4:3 (cards), 1:1 (portraits, icons)

### Sourcing Priority
1. AI-generated photorealistic (for facility renderings, lifestyle moments)
2. Licensed premium stock (curated for warmth and authenticity)
3. Actual photography (when facilities are built, Jonah's headshot)

---

## 12. Breakpoints

| Name | Min Width | Tailwind Prefix |
|------|-----------|-----------------|
| Mobile | 0px | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |
| Large Desktop | 1280px | `xl:` |
| Max Width | 1440px | `2xl:` |

### Responsive Behavior
- **Mobile-first:** Default styles are mobile. Larger screens override with `md:`, `lg:`, etc.
- **Type scaling:** All type sizes have mobile and desktop values (see Type Scale table).
- **Grid:** 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop) for cards/features.
- **Nav:** Hamburger (mobile/tablet) → full horizontal nav (desktop at `lg:`).
- **Sections:** Padding scales from `--space-12` (mobile) to `--space-24` (desktop).

---

## 13. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| **WCAG 2.1 AA** | Minimum standard for all pages. |
| **Color contrast** | All text meets 4.5:1 ratio against its background. Orange on dark passes. Orange on light: use only for large text (3:1 minimum). Verify all combinations. |
| **Focus states** | All interactive elements have visible focus ring: `2px solid --journey-orange`, `2px offset`. |
| **Alt text** | All content images have descriptive alt text. Decorative images/shapes use `aria-hidden="true"`. |
| **Keyboard navigation** | All interactive elements reachable via Tab. Logical focus order. Dropdown menus navigable with arrow keys. |
| **Reduced motion** | `prefers-reduced-motion` disables all animations except essential state changes. |
| **Form accessibility** | All inputs have associated `<label>`. Error messages linked via `aria-describedby`. Required fields marked with `aria-required`. |

---

*This design system is the visual authority for the Journey.Storage™ website.
It is derived from the Brand Manual v1.1, Visual DNA Manual v1.0, and the
references analysis. All implementation follows these rules without exception.*