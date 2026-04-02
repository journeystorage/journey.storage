# Deployment Guide — Journey.Storage

## Project Structure

```
/ (root)              ← Web app (journey.storage main site)
├── src/              ← Web source code
├── public/           ← Web static assets
├── next.config.ts    ← Web Next.js config
├── package.json      ← Root package with all scripts
├── apps/
│   ├── consulting/   ← Consulting landing page (self-contained Next.js app)
│   └── investors/    ← Investors page (self-contained Next.js app)
```

The **web app** lives at the root. Consulting and investors live inside `apps/`.
Each app is deployed as a **separate Hostinger instance** from the same GitHub repo.

---

## Hosting Provider: Hostinger

- Platform: Node.js hosting with native Next.js support
- Deploy method: Git push (automatic) — connected to `main` branch
- Hostinger does NOT allow customizing the root directory — always `/`
- Hostinger runs `npm install` → build command → `next start` automatically

---

## Hostinger Settings Per App

### Web (main site)

| Field            | Value                                  |
|------------------|----------------------------------------|
| Install command  | `npm ci`                               |
| Build command    | `npm run build`                        |
| Start command    | `npm run start -- -p $PORT`            |
| Node version     | 20                                     |

How it works: `npm run build` runs `next build` with `output: 'standalone'`, then copies `public/` and `.next/static/` into `.next/standalone/`. The start command runs the standalone server (`node .next/standalone/server.js`) which is a single lightweight Node.js process — no worker spawning.

### Consulting

| Field            | Value                                  |
|------------------|----------------------------------------|
| Install command  | `npm ci`                               |
| Build command    | `npm run build:consulting`             |
| Start command    | `npm run start -- -p $PORT`            |
| Node version     | 20                                     |

How it works: `build:consulting` replaces `src/`, `public/`, and `next.config.ts` at the root with consulting's files, then runs `next build` with standalone output, then copies assets into `.next/standalone/`.

### Investors (when ready)

| Field            | Value                                  |
|------------------|----------------------------------------|
| Install command  | `npm ci`                               |
| Build command    | `npm run build:investors`              |
| Start command    | `npm run start -- -p $PORT`            |
| Node version     | 20                                     |

Note: `build:investors` script needs to be added to `package.json` following the same pattern as consulting.

---

## Important Notes

### Auto-deploy triggers on every push
Every `git push` to `main` triggers a redeploy on **all** Hostinger instances connected to this repo. A commit that only changes consulting files will also redeploy web (and vice versa). This is expected and **inofensivo** — each instance rebuilds with its own build command, producing the same output if nothing changed for that app.

#### Can I deploy only one app at a time?
Not with the current setup. Possible alternatives and trade-offs:

| Approach | Isolation | Downside |
|----------|-----------|----------|
| **Separate branches** (`main` → web, `deploy/consulting` → consulting) | Per-branch deploy | Must keep branches in sync; manual merge to deploy |
| **Separate repos** | Full isolation | Loses shared monorepo; duplicated config |
| **Accept shared deploys (current)** | None | Extra rebuild takes ~30s but changes nothing |

Current recommendation: **accept shared deploys**. The rebuild is fast and produces identical output when the app's files haven't changed. The complexity of maintaining separate branches does not pay off for 2-3 apps.

### Why the web app is at the root
Hostinger's Next.js preset expects `next.config.ts`, `src/`, `public/`, and `.next/` at the repository root. There is no option to change the root directory. Moving the web app to the root was the only way to achieve a clean deploy.

### Why consulting uses file replacement
Since Hostinger always builds from the root, `build:consulting` temporarily replaces the root's `src/`, `public/`, and `next.config.ts` with consulting's files before running `next build`. Each Hostinger instance is an isolated clone, so this does not affect other instances.

### Why standalone output
Hostinger's shared hosting has a **120 process limit** shared across all sites on the plan. The default `next start` spawns multiple workers, which can easily exceed this limit with 2+ sites. `output: 'standalone'` generates a single `server.js` that runs as one process, keeping usage well below the limit.

### Node version
Next.js 16.x requires Node.js >= 20.9.0. Use Node 20 (Hostinger's recommended version for Next.js).

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

1. Create the app in `apps/<name>/` with its own `src/`, `public/`, `package.json`
2. Add a build script to root `package.json`:
   ```
   "build:<name>": "rm -rf src public .next && cp -r apps/<name>/src src && cp -r apps/<name>/public public && cp apps/<name>/next.config.ts next.config.ts && next build && cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static"
   ```
3. Create a new Hostinger instance connected to the same GitHub repo
4. Set build command to `npm run build:<name>`, start command to `npm run start -- -p $PORT`
