# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `journey-design-system` skill before any visual work.** It is the source of truth for colours, type, shapes, motion, components and voice. **Where it conflicts with `BRAND_GUIDELINES.md` or anything below, the skill wins.** Visual component reference: `mockups/journey-design-system.html` (the library the skill was extracted from; copy component CSS from it rather than re-deriving).
- **Read `BRAND_GUIDELINES.md` (v3.0)** for layout and print detail the skill doesn't cover. Neither document authorizes changing existing pages: never migrate live pages unless asked.
- **Read `DEPLOYMENT.md` before modifying any infrastructure file** (`next.config.ts`, `package.json` scripts, `turbo.json`, `apps/*/next.config.ts`).
- **Never use `git add -A` or `git add .`** — always stage specific files by name.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `npm run dev` (main site at `http://localhost:3000`)
- Consulting: `npm run dev:consulting` (port 3001) | Investors: `npm run dev:investors` (port 3002)
- Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed as a project dev dependency (`node_modules/puppeteer`).
- **Always screenshot from localhost:** `node scripts/screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `screenshots/` with timestamp and viewport name (mobile, tablet, desktop), both full-page and above-the-fold.
- `scripts/screenshot.mjs` lives at project root. Use it as-is.
- After screenshotting, read the PNG from `screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Fonts — how to load Lato (READ THIS BEFORE ANY HANDOUT, DECK, OR PAGE)
**Never `<link>` Lato from Google Fonts.** Google serves 300/400/700/900 only; weights 500, 600 and 800 return HTTP 400. Weight **800 sets the bold phrase in every heading** — Google silently collapses it to 700 and the type system flattens with no error.

| Building | How to load Lato |
|---|---|
| **Standalone HTML** — handouts, decks, print pagers, mockups | `<link rel="stylesheet" href="assets/lato.css">` (from `mockups/`). Gives all 9 faces incl. 800 |
| **Next app** — main site, managed, investors, tenant-lab | Already wired via `next/font/local` in each `layout.tsx`. Use the `--font-lato` variable |
| **Anything outside the repo** | Copy `mockups/assets/lato.css` + `mockups/assets/fonts/` alongside it |

Handouts and print pagers live in `mockups/` as fixed-page HTML — see `BRAND_GUIDELINES.md` for the print/PDF caveats (no SVG grain filters).

## Brand Assets
- **`BRAND_GUIDELINES.md`** — type, spacing, motion, and component specs. Read it first.
- **`public/images/brand/`** — logo SVGs (`logo-white`, `logo-dark`, plus `-TM` variants for formal/legal/investor use).
- **Logos and brand colors are NOT changing.** Use the files and hex values exactly as they are. Do not re-export, recolor, or "correct" them.
- Use the real assets. Do not use placeholders where real assets exist, and never invent brand colors.

## Design Mindset — Senior Designer Behavior
- **You are not an executor — you are a senior designer.** When you receive feedback, don't just apply it mechanically. Listen, think, then propose a solution that comes from deep experience and a large repertoire of design patterns.
- **Information hierarchy is non-negotiable.** Every section has ONE hero element. Design so it captures attention first, then guides the eye to supporting information. If you can't identify the hero, stop and figure it out before writing code.
- **Design for the reading experience.** Every person who sees the final output should see it correctly — the right things emphasized, the right flow, the right balance. The layout should feel intentional, not accidental.
- **Invoke the `journey-design-system` skill** before proposing or implementing any visual change. Use them as your design toolkit, not as an afterthought.
- **Viewport discipline:** The primary device is a MacBook Air M3 13" (effective viewport ~1440×820 with browser chrome). All full-viewport layouts (deck slides, hero sections) MUST fit this constraint. Test at 1440×820 in Puppeteer, not 1440×900.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the tokens from the `journey-design-system` skill: `brand` `#ff6320` for bright marks, icons and links on dark; `brand-2` `#e8622a` for bars, focus, links on light and checked controls; `page` `#181818`, `cream` `#f9f5ee`. Never pure black. Never invent colours outside the skill's tables.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** **Lato only** — one family, everything. Contrast comes from *weight*, not family: uppercase headings set in Light 300 with the payload phrase in ExtraBold 800 on the same line. Two weights per heading, never three. Tight tracking (`-0.9px` at 45px) on large headings, `1.4` line-height on body. Lato must be **self-hosted** — Google Fonts cannot serve weights 500/600/800.
- **Gradients:** Prefer one gradient per composition, derived from the existing brand orange. Dark surfaces carry an 8px SVG **dot tile** for texture rather than a noise filter (SVG noise filters blow up exported PDFs — use a baked-alpha PNG tile for print).
- **Animations:** Only animate `transform` and `opacity` (`background`/`color` allowed for hover). Never `transition-all`. House easing is `cubic-bezier(.16,1,.3,1)`. Every animation must honor `prefers-reduced-motion`.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not pair a second typeface with Lato
- Do not load Lato from `next/font/google` — it cannot serve weight 800
- Do not define type tokens as `--font-size-*` in Tailwind v4 — the namespace is `--text-*`
- Do not change brand colors or logo files
- Do not retroactively restyle existing pages when applying the design system
