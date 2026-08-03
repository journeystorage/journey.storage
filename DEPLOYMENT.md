# Deployment Guide — Journey.Storage

## Project Structure

```
/ (root)              ← Web app (journey.storage main site)
├── src/              ← Web source code
├── public/           ← Web static assets
├── next.config.ts    ← Web Next.js config (NO standalone)
├── package.json      ← Root package with all scripts
├── apps/
│   └── investors/    ← Investors page (self-contained Next.js app)
```

The **web app** lives at the root. Investors and managed live inside `apps/`.
Each app is deployed as a **separate Hostinger instance** from the same GitHub repo.

---

## Hosting Provider: Hostinger

- Platform: Business Web Hosting with Node.js support
- Deploy method: Git push (automatic) — connected to `main` branch
- Hostinger does NOT allow customizing the root directory — always `./`
- CDN cache is active — must be flushed after every deploy (see Post-Deploy Checklist)

---

## Hostinger Settings Per App

### Web (main site)

| Field              | Value              |
|--------------------|--------------------|
| Framework preset   | Next.js            |
| Branch             | main               |
| Node version       | 20.x               |
| Build command      | `npm run build`    |
| Output directory   | `.next`            |

**How it works:** `npm run build` runs `next build` with `output: 'standalone'`, then copies `public/` and `.next/static/` into `.next/standalone/`. Hostinger's Next.js preset detects the standalone output and serves via `node .next/standalone/server.js` automatically — single process, no worker spawning.

> **Note:** The Consulting app (advisory.journey.storage) was retired. Its
> `apps/consulting/` source and `build:consulting` script were removed, and its
> Hostinger instance was decommissioned.

### Investors

| Field              | Value                      |
|--------------------|----------------------------|
| Framework preset   | Custom                     |
| Branch             | main                       |
| Node version       | 20                         |
| Install command    | `npm ci`                   |
| Build command      | `npm run build:investors`  |
| Start command      | `npm run start -- -p $PORT`|

**How it works:** `build:investors` replaces `src/`, `public/`, and `next.config.ts` at the root with investors' files (which include `output: 'standalone'`), then runs `next build`, then copies `public/` and `.next/static/` into `.next/standalone/`. The start command runs `node .next/standalone/server.js` — single lightweight process.

> **IMPORTANT:** Investors uses **Custom** preset (not "Next.js" preset) because it needs an explicit Start command to run the standalone server.

### Managed (managed.journey.storage)

| Field              | Value                      |
|--------------------|----------------------------|
| Framework preset   | Custom                     |
| Branch             | main                       |
| Node version       | 20                         |
| Install command    | `npm ci`                   |
| Build command      | `npm run build:managed`    |
| Start command      | `npm run start -- -p $PORT`|

**How it works:** identical to investors. `build:managed` replaces `src/`, `public/`, and `next.config.ts` at the root with managed's files (which include `output: 'standalone'`), then runs `next build`, then copies `public/` and `.next/static/` into `.next/standalone/`. The start command runs `node .next/standalone/server.js` — single lightweight process.

**Env vars required on the instance** (lead form posts to its own `/api/waitlist`, inserts with `source_app: 'managed'`):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, `LEAD_NOTIFY_TO` (optional CC: `LEAD_NOTIFY_ALWAYS_CC`)

> **IMPORTANT:** Custom preset (not "Next.js") — same rationale as investors.

> **Relationship to the main site:** the page originally shipped at `journey.storage/managed`. Once this instance is live, the main site's `/managed` route becomes a 301 redirect to `https://managed.journey.storage` (see changelog) — do not maintain two live copies.

### Springfield (SGF11 deck)

| Field              | Value                              |
|--------------------|------------------------------------|
| Framework preset   | Custom                             |
| Branch             | main                               |
| Node version       | 20                                 |
| Install command    | `npm ci`                           |
| Build command      | `npm run build:springfield`        |
| Start command      | `npm run start:springfield -- -p $PORT` |

**How it works:** Springfield is a **pre-built static export** (the deck was authored outside this monorepo as a Next.js standalone export). The bundle lives at `apps/springfield/public/` and is served by `apps/springfield/server.mjs` — a tiny zero-dependency Node http server (built-in `http`/`fs`/`path` only). The `build:springfield` script is a no-op echo because there is nothing to compile; `start:springfield` launches the static server, which reads `-p $PORT` from Hostinger's start command and binds to `0.0.0.0`.

The server is single-process and zero-dependency, so it stays well under Hostinger's shared-hosting process limit (see "Process limit strategy" below).

**Replacing the bundle.** When the deck is rebuilt upstream, drop the new static export into `apps/springfield/public/` (replacing the previous contents) and commit. There is no `npm install` step needed for this app — the server has no dependencies.

> **Optimize images on re-export.** The committed bundle's photo/map images were converted from PNG/JPG to WebP (135 MB → 32 MB). A fresh upstream export will likely ship PNG/JPG again — re-run a WebP pass before committing (e.g. a sharp script converting `public/images/**` and rewriting the `.png/.jpg` refs in `index.html` to `.webp`) or the bundle balloons back to ~135 MB.

> **Mobile scroll fix.** The export sets `overflow-x: hidden` on the root, which forces `overflow-y` to compute to `auto` and breaks touch scrolling on mobile (the first full-height slides won't swipe-scroll). A `<style>` override is injected before `</head>` in `index.html`: `@media (max-width:1023px){html,body{overflow-x:clip!important;overflow-y:visible!important}}`. Re-add it after any upstream re-export, or fix it upstream by using `overflow-x: clip` instead of `hidden` on the root scroller.

> **IMPORTANT:** Use the **Custom** preset (not Static / not Next.js). Hostinger's "Static" preset cannot run a Node start command, and the "Next.js" preset expects a `.next/standalone/server.js` artifact that this app does not produce.

---

### Hub (internal — currently LOCAL ONLY, not deployed anywhere)

> **Status as of 2026-08-03: not deployed.** Lyvia and Jonah run it locally
> via `npm run dev:hub` (`http://localhost:3006`) — no Vercel project exists
> yet. All data lives in Supabase, not on disk, so running it locally on two
> different machines works fine and stays in sync. The Vercel plan below is
> documented in case remote/always-on access is wanted later — nothing in it
> has been executed.

| Field              | Value                          |
|--------------------|--------------------------------|
| Platform           | Vercel (separate from Hostinger) |
| Root Directory     | `apps/hub`                     |
| Framework preset   | Next.js (auto-detected)        |
| Branch             | `locations-redesign` (as of 2026-08-03 — that branch carries 26 commits never merged to main; switch this to `main` once it's merged) |

**Why not Hostinger:** the Hub is a 2-person internal tool (Journey employees only, not customer-facing). Every push to `main` already redeploys all 5 Hostinger instances simultaneously against a shared 120-process limit that has already caused a multi-site 503 outage once (see 2026-04-03 in the changelog). Adding a 6th Hostinger instance for an internal tool would tighten that margin for no customer-facing benefit, so the Hub deploys to Vercel instead — fully decoupled from the Hostinger plan and its process limit.

**Setup (one-time, via Vercel dashboard — not automatable from here):**
1. Import this GitHub repo as a new Vercel project.
2. Set **Root Directory** to `apps/hub`. Vercel auto-detects the npm/Turborepo workspace from the root `package-lock.json` + `turbo.json` and installs correctly.
3. Framework preset: Next.js (auto-detected — no build command override needed, just `next build`).
4. Env vars (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL` — `https://uwncchrmdotateyditjc.supabase.co` (also has a safe hardcoded fallback in code, but set it explicitly)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the publishable anon key (see `apps/hub/.env.example`; also has a safe hardcoded fallback)
   - `ANTHROPIC_API_KEY` — **required, no fallback**. Copy the value from `apps/hub/.env.local` (gitignored, not in this doc).
5. Deploy.
6. Add custom domain `hub.journey.storage` in Project Settings → Domains, then add the CNAME record Vercel gives you at the DNS provider.
7. No Supabase Auth redirect-URL changes needed — the Hub uses password sign-in (`supabase.auth.signInWithPassword`), not magic links/OAuth, so there's no callback URL tied to the domain.

`apps/hub/package.json` has its own `build`/`start` scripts (`next build` / `next start`) — Vercel uses these directly; there is no `build:hub` file-replacement script (that pattern is Hostinger-only). Root `package.json` keeps `dev:hub` (port 3006) for local dev.

---

## Post-Deploy Checklist

After every deploy (automatic or manual), do this for **each site**:

1. Go to **Performance → CDN** in the Hostinger dashboard
2. Click **"Flush cache"**
3. Verify in an incognito tab

Without flushing, the CDN may serve a cached version that references old CSS/JS hashes → broken styles.

---

## Critical Files — DO NOT MODIFY Without Reading This Guide

These files control deployment. Changing them incorrectly **will break production**.

| File | Purpose | Safe to edit? |
|------|---------|---------------|
| `next.config.ts` (root) | Main site Next.js config (has standalone) | **NO** — must keep `output: 'standalone'` and `outputFileTracingRoot` |
| `package.json` `"build"` script | Main site build | **NO** — must be plain `next build` |
| `package.json` `"build:investors"` script | Investors build | Only if you understand the file replacement flow |
| `package.json` `"build:managed"` script | Managed build | Only if you understand the file replacement flow |
| `apps/managed/next.config.ts` | Managed config (has standalone) | Only if you understand the build:managed flow |
| `apps/investors/next.config.ts` | Investors config (has standalone) | Only if you understand the build:investors flow |
| `package.json` `"start"` script | Used by investors & managed | **NO** — main site ignores this (Framework preset) |
| `package.json` `"build:springfield"` script | Springfield build (no-op) | Safe to edit only if you understand the static-export flow |
| `package.json` `"start:springfield"` script | Springfield start | Safe to edit — must keep `node apps/springfield/server.mjs` |
| `apps/springfield/server.mjs` | Static file server for the SGF11 deck | **NO** — keep zero-dependency, single-process |
| `turbo.json` | Turborepo config | Avoid changes — affects workspace detection |
| `.gitignore` | Must include `screenshots/` | Ensure screenshots/ stays ignored |

---

## Important Notes

### Auto-deploy triggers on every push
Every `git push` to `main` triggers a redeploy on **all** Hostinger instances. A commit that only changes one app's files will also redeploy the others. This is expected — each instance rebuilds with its own build command.

### Why the web app is at the root
Hostinger's Next.js preset expects `next.config.ts`, `src/`, `public/`, and `.next/` at the repository root. There is no option to change the root directory.

### Why the sub-apps use file replacement
Since Hostinger always builds from the root, `build:investors` / `build:managed` temporarily replace the root's `src/`, `public/`, and `next.config.ts` with the app's files before running `next build`. Each Hostinger instance is an isolated clone, so this does not affect other instances.

### Why the sub-apps use standalone but main site does not
Hostinger's shared hosting has a **120 process limit** shared across all sites on the plan. The default `next start` spawns multiple workers. With multiple sites, processes can spike to 90-100+.

- **Investors** uses `output: 'standalone'` + Custom preset with explicit Start command → single process
- **Main site** uses standalone via Framework preset (Next.js preset detects it automatically) → single process

All three sites now use standalone mode, keeping total process count well below the 120 limit.

### Process limit strategy
Current average: ~90-96 of 120. To reduce:
1. Switch main site to standalone (see above) — biggest impact
2. Monitor via Hostinger → Hosting Plan → Resources Usage → Max Processes
3. If hitting limits: consider upgrading plan or moving to VPS

### ⚠ Deploy can cause 503 across all sites
Every `git push` triggers 3 simultaneous deploys (one per Hostinger instance). The build phase spawns enough processes to temporarily exceed the 120 limit, causing **all sites to go 503** until processes stabilize.

**If this happens:**
1. Go to **Hosting Plan → Resources Usage** — confirm Max Processes is at/above 120
2. Click **"Stop running processes"** to kill stuck build processes
3. Restart each site **one at a time** — wait for one to come up before restarting the next
4. Do NOT restart all three simultaneously or it will spike again

This is a known limitation of Hostinger shared hosting. Consider migrating to Vercel or a VPS to eliminate this issue.

### Node version
- Main site: Node 22.x (Framework preset default)
- Investors: Node 20 (Custom preset)
- Springfield: Node 20 (Custom preset, but the server is zero-dependency so any Node ≥ 16 works)
- Next.js 16.x requires Node.js >= 20.9.0

---

## Pitch Deck PDF — Generated Client-Side

The Granbury pitch deck's **Download PDF** button generates the PDF **in the
browser at click time** via `html2canvas-pro` + `jspdf` (see
`apps/investors/src/app/deck/granbury/DeckNav.tsx`). Both libraries are
dynamically imported only on click, so they're not in the initial bundle.

There is **no pre-committed PDF** anymore. The previous ~23 MB static PDFs in
`apps/investors/public/deck/` were unreferenced dead weight (nothing served
them) and have been removed to shrink the investors deploy artifact. Do **not**
re-add pre-generated PDFs unless you also switch the button back to serving a
static file — don't keep both mechanisms.

---

## Local Development

```bash
# Web (main site) — http://localhost:3000
npm run dev

# Investors — http://localhost:3002
npm run dev:investors

# Tenant Lab (API testing) — http://localhost:3003
npm run dev:tenant-lab

# Springfield (SGF11 static deck) — http://localhost:3004
npm run dev:springfield
```

### Tenant Lab (`apps/tenant-lab/`)

**Local-only testing app** — NOT deployed to Hostinger. No `build:tenant-lab` script exists, no Hostinger instance needed. This app tests the Tenant Inc. / Nectar API integration (units, availability, pricing) before migrating the infrastructure to the main website.

- Requires `apps/tenant-lab/.env.local` with Tenant API credentials (gitignored)
- No `output: 'standalone'` — dev-only, not meant for production
- Safe to commit to `main` — no build script means Hostinger ignores it entirely

---

## Adding a New App

1. Create the app in `apps/<name>/` with its own `src/`, `public/`, `next.config.ts`
2. The app's `next.config.ts` should include `output: 'standalone'` and `outputFileTracingRoot: __dirname`
3. Add a build script to root `package.json`:
   ```
   "build:<name>": "rm -rf src public .next && cp -r apps/<name>/src src && cp -r apps/<name>/public public && cp apps/<name>/next.config.ts next.config.ts && next build && cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static"
   ```
4. Create a new Hostinger instance connected to the same GitHub repo
5. Use **Custom** preset (not "Next.js") with:
   - Build command: `npm run build:<name>`
   - Start command: `npm run start -- -p $PORT`

---

## Changelog

### 2026-07-22 — Managed app (managed.journey.storage)
- Created `apps/managed/` — standalone app serving the Journey Managed third-party-management page at `managed.journey.storage` (mirrors consulting's structure: own `src/`, trimmed `public/`, standalone `next.config.ts`)
- Added `build:managed` + `dev:managed` (port 3005, `--webpack`) to root `package.json`
- Own `/api/waitlist` route with `source_app: 'managed'` — instance needs its own Supabase/Resend env vars (see Managed section above)
- All nav/footer links on the subdomain are absolute URLs back to the ecosystem; facility cards link to `journey.storage/rentaspace/*`
- Rollout sequence: (1) this scaffold is inert until a Hostinger instance uses `build:managed`; (2) create instance + subdomain DNS + env vars; (3) once live, flip main site's `/managed` to a 301 → `https://managed.journey.storage` and update nav/sitemap
- ⚠ This is a 5th git-deploy instance — every push now triggers 5 simultaneous builds; watch the 120-process limit (see "Deploy can cause 503")

### 2026-04-25 — Tenant Lab (API integration testing)
- Created `apps/tenant-lab/` — local-only app for testing Tenant Inc. / Nectar API integration
- Server-side API client at `src/lib/tenant-api.ts`, API routes at `src/app/api/`
- No build script, no Hostinger instance — dev-only (`npm run dev:tenant-lab`, port 3003)
- Added Tenant API credentials to `.env.local` (root + `apps/tenant-lab/`)
- Added `.env.example` at root with credential template (safe to commit)
- Zero impact on existing deploys: no `build:tenant-lab`, no `output: 'standalone'`

### 2026-04-07 — Investors site standalone build ready
- Added `output: 'standalone'` + `outputFileTracingRoot: __dirname` + `images.unoptimized: true` to `apps/investors/next.config.ts`
- Added `build:investors` script to root `package.json` (mirrors `build:consulting` file-replacement pattern)
- Validated locally: `npm run build:investors` produces `.next/standalone/server.js` that boots and serves HTTP 200 with the rendered hero
- Hostinger setup: create third instance, Custom preset, build `npm run build:investors`, start `npm run start -- -p $PORT`
- Note: dev server must be run via `npm run dev:investors` (root, uses `--webpack`) — Turbopack dev is incompatible with `outputFileTracingRoot`

### 2026-04-04 — Standalone migration complete + post-incident review
- **Main site migrated to standalone** — both sites now run as single process. Process count dropped from ~90-96 to ~13.
- **Incident (2026-04-03):** 21 commits over several hours trying to fix deploy after design changes. Root causes: CDN cache serving stale assets, 1.1GB of screenshots accidentally committed via `git add -A`, and multiple config changes without understanding the full deploy flow.
- **Resolution:** Reverted to `a1f592b`, re-applied design changes cleanly, flushed CDN cache, then migrated main site to standalone.
- **Changes to this doc:** Full rewrite with Critical Files table, Post-Deploy Checklist, CDN cache instructions, process limit strategy, and changelog.

### 2026-04-02 — Initial standalone migration (a1f592b)
- Added `output: 'standalone'` to consulting config
- Updated build scripts to copy public/static to standalone directory
- Added `HOSTNAME=0.0.0.0` to start script
- Documented the 120 process limit rationale
