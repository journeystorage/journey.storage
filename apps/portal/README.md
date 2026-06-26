# Journey.storage — Internal Portal (front-end)

Static front-end for **portal.journey.storage**. Lives in the `journey.storage` monorepo at
`apps/portal/` and auto-deploys to Hostinger via FTP whenever files here change on `main`
(see `.github/workflows/deploy-portal.yml` at the repo root). It is **not** a Next.js app —
it is plain static HTML, deployed independently of the marketing sites.

## What's tracked
Only the front-end: `index.html`, `config.js`, `.htaccess`, and `fonts/`.
The PHP backend (`extract.php`, `queue.php`, `sheets.php`) and the SQL files are **intentionally not tracked** — they hold secrets (OpenAI key) and live on the server only. See `.gitignore`.

## Auto-deploy (GitHub Actions → FTP)
`.github/workflows/deploy-portal.yml` syncs `apps/portal/` to Hostinger over FTPS, only when
files here change. The deploy **excludes** the server-only files above, so it never overwrites
or deletes them. Add the 4 FTP secrets below to the **journey.storage** repo.

### One-time setup — add 4 repository secrets
GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**.
Get the FTP values from hPanel → **Files → FTP Accounts** (create one if needed):

| Secret name | Value | Notes |
|---|---|---|
| `FTP_SERVER` | e.g. `ftp.journey.storage` or the server IP | hostname only, no `ftp://` |
| `FTP_USERNAME` | the FTP account username | |
| `FTP_PASSWORD` | the FTP account password | stored encrypted; never shared in chat |
| `FTP_SERVER_DIR` | e.g. `/public_html/portal/` | **must end with a slash** |

If FTPS fails to connect, change `protocol: ftps` to `protocol: ftp` in the workflow (Hostinger usually supports FTPS on port 21).

### After setup
Edit → commit → push to `main`. The Action publishes in ~30s. Watch runs in the **Actions** tab.
Then purge the LiteSpeed/CDN cache in hPanel if changes don't appear immediately.
