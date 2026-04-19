# Deployment Guide — Journey.Storage

## Project Structure

```
/ (root)              ← Web app (journey.storage main site)
├── src/              ← Web source code
├── public/           ← Web static assets
├── next.config.ts    ← Web Next.js config (NO standalone)
├── package.json      ← Root package with all scripts
├── apps/
│   ├── consulting/   ← Consulting landing page (has its own next.config.ts WITH standalone)
│   └── investors/    ← Investors page (self-contained Next.js app)
```

The **web app** lives at the root. Consulting and investors live inside `apps/`.
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

### Consulting

| Field              | Value                      |
|--------------------|----------------------------|
| Framework preset   | Custom                     |
| Branch             | main                       |
| Node version       | 20                         |
| Install command    | `npm ci`                   |
| Build command      | `npm run build:consulting` |
| Start command      | `npm run start -- -p $PORT`|

**How it works:** `build:consulting` replaces `src/`, `public/`, and `next.config.ts` at the root with consulting's files (which include `output: 'standalone'`), then runs `next build`, then copies `public/` and `.next/static/` into `.next/standalone/`. The start command runs `node .next/standalone/server.js` — a single lightweight process.

> **IMPORTANT:** Consulting uses **Custom** preset (not "Next.js" preset) because it needs an explicit Start command to run the standalone server. The "Next.js" preset ignores the `"start"` script.

### Investors

| Field              | Value                      |
|--------------------|----------------------------|
| Framework preset   | Custom                     |
| Branch             | main                       |
| Node version       | 20                         |
| Install command    | `npm ci`                   |
| Build command      | `npm run build:investors`  |
| Start command      | `npm run start -- -p $PORT`|

**How it works:** identical to consulting. `build:investors` replaces `src/`, `public/`, and `next.config.ts` at the root with investors' files (which include `output: 'standalone'`), then runs `next build`, then copies `public/` and `.next/static/` into `.next/standalone/`. The start command runs `node .next/standalone/server.js` — single lightweight process.

> **IMPORTANT:** Investors uses **Custom** preset (not "Next.js" preset) because it needs an explicit Start command to run the standalone server. Same rationale as consulting.

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
| `apps/consulting/next.config.ts` | Consulting config (has standalone) | Only if you understand the build:consulting flow |
| `package.json` `"build"` script | Main site build | **NO** — must be plain `next build` |
| `package.json` `"build:consulting"` script | Consulting build | Only if you understand the file replacement flow |
| `package.json` `"build:investors"` script | Investors build | Only if you understand the file replacement flow |
| `apps/investors/next.config.ts` | Investors config (has standalone) | Only if you understand the build:investors flow |
| `package.json` `"start"` script | Used by consulting only | **NO** — main site ignores this (Framework preset) |
| `turbo.json` | Turborepo config | Avoid changes — affects workspace detection |
| `.gitignore` | Must include `screenshots/` | Ensure screenshots/ stays ignored |

---

## Important Notes

### Auto-deploy triggers on every push
Every `git push` to `main` triggers a redeploy on **all** Hostinger instances. A commit that only changes consulting files will also redeploy web (and vice versa). This is expected — each instance rebuilds with its own build command.

### Why the web app is at the root
Hostinger's Next.js preset expects `next.config.ts`, `src/`, `public/`, and `.next/` at the repository root. There is no option to change the root directory.

### Why consulting uses file replacement
Since Hostinger always builds from the root, `build:consulting` temporarily replaces the root's `src/`, `public/`, and `next.config.ts` with consulting's files before running `next build`. Each Hostinger instance is an isolated clone, so this does not affect other instances.

### Why consulting uses standalone but main site does not
Hostinger's shared hosting has a **120 process limit** shared across all sites on the plan. The default `next start` spawns multiple workers. With 2 sites, processes can spike to 90-100+.

- **Consulting** uses `output: 'standalone'` + Custom preset with explicit Start command → single process
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
- Consulting: Node 20 (Custom preset)
- Next.js 16.x requires Node.js >= 20.9.0

---

## Pitch Deck PDF — Pre-Commit Generation

The Granbury pitch deck has a **Download PDF** button that serves pre-generated static PDFs from `apps/investors/public/deck/`. These PDFs must be regenerated locally before pushing whenever deck files change, because Hostinger does not have Chrome/Puppeteer.

### When to regenerate

Regenerate if **any** of these files were modified:
- `apps/investors/src/app/deck/granbury/page.tsx`
- `apps/investors/src/app/deck/granbury/*.tsx` (any deck component)
- `apps/investors/src/styles/globals.css` (print/deck styles)
- `apps/investors/public/images/` (any deck image)

### How to regenerate

```bash
# 1. Start the investors dev server (if not already running)
npm run dev:investors

# 2. Generate both dark and light PDFs
node apps/investors/scripts/generate-pdf.mjs

# 3. Stage the updated PDFs
git add apps/investors/public/deck/Journey.Direct_Granbury_Deck_dark.pdf
git add apps/investors/public/deck/Journey.Direct_Granbury_Deck_light.pdf
```

The script generates both theme variants, outputs to `apps/investors/public/deck/`, and logs the file sizes. Current output is ~23 MB per file (uncompressed).

---

## Local Development

```bash
# Web (main site) — http://localhost:3000
npm run dev

# Consulting — http://localhost:3001
npm run dev:consulting

# Investors — http://localhost:3002
npm run dev:investors
```

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
