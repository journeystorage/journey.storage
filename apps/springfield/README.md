# Springfield deck (SGF11)

Pre-built static export of the Journey.Direct™ SGF11 deck, served by a tiny
zero-dependency Node http server.

## Why static and not Next.js source?

The deck was originally built outside this repo and only the compiled output
was available when it was integrated.  See `DEPLOYMENT.md` → "Springfield"
section for the full Hostinger setup.  When the deck source is eventually
ported into `apps/investors/src/app/deck/springfield/`, this app can be
retired.

## Local dev

```bash
# from repo root
npm run dev:springfield
# → http://localhost:3004
```

(or from this directory: `node server.mjs`)

## Updating the bundle

1. Make changes in the upstream deck project.
2. Build the static export.
3. Replace `apps/springfield/public/` with the new bundle.
4. Commit the diff and push.

The bundle includes 130+ MB of property photos; expect large diffs when
images change.
