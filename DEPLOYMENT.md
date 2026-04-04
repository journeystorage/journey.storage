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
| Node version       | 22.x               |
| Build command      | `npm run build`    |
| Output directory   | `.next`            |

**How it works:** Hostinger runs `npm run build` (which is `next build`) and then serves using its own internal `next start`. The root `next.config.ts` has **no** `output: 'standalone'` — it uses standard Next.js output. Hostinger's Framework preset handles serving automatically.

> **WARNING:** The root `next.config.ts` must NOT have `output: 'standalone'`. The Framework preset mode does not use the `"start"` script from package.json — it runs its own `next start` internally and expects standard `.next/` output.

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

### Investors (when ready)

Follow the same pattern as consulting: Custom preset with explicit Start command.

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
| `next.config.ts` (root) | Main site Next.js config | **NO** — must NOT have `output: 'standalone'` |
| `apps/consulting/next.config.ts` | Consulting config (has standalone) | Only if you understand the build:consulting flow |
| `package.json` `"build"` script | Main site build | **NO** — must be plain `next build` |
| `package.json` `"build:consulting"` script | Consulting build | Only if you understand the file replacement flow |
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
- **Main site** uses Framework preset which runs its own `next start` → multiple workers

**Future improvement:** Switch the main site to Custom preset with standalone to reduce process count. This requires changing the Hostinger settings from "Next.js" preset to "Custom" preset with Start command: `npm run start -- -p $PORT`, and adding `output: 'standalone'` to the root `next.config.ts`.

### Process limit strategy
Current average: ~90-96 of 120. To reduce:
1. Switch main site to standalone (see above) — biggest impact
2. Monitor via Hostinger → Hosting Plan → Resources Usage → Max Processes
3. If hitting limits: consider upgrading plan or moving to VPS

### Node version
- Main site: Node 22.x (Framework preset default)
- Consulting: Node 20 (Custom preset)
- Next.js 16.x requires Node.js >= 20.9.0

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

### 2026-04-04 — Post-incident review
- **Incident:** 21 commits over several hours trying to fix deploy after design changes. Root cause: `next.config.ts` was modified to add `output: 'standalone'` but the Hostinger main site uses Framework preset which ignores the `"start"` script and expects standard `.next/` output. Additionally, 1.1GB of screenshots were accidentally committed via `git add -A`.
- **Resolution:** Reverted to `a1f592b` (last working state), re-applied design changes cleanly, flushed CDN cache.
- **Changes to this doc:** Rewrote to reflect actual Hostinger configuration (Framework preset for main, Custom for consulting). Added Critical Files table, Post-Deploy Checklist, CDN cache instructions, and process limit strategy. Clarified the asymmetry between main site and consulting deploy modes.

### 2026-04-02 — Initial standalone migration (a1f592b)
- Added `output: 'standalone'` to consulting config
- Updated build scripts to copy public/static to standalone directory
- Added `HOSTNAME=0.0.0.0` to start script
- Documented the 120 process limit rationale
