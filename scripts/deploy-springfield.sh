#!/usr/bin/env bash
# Stage and commit the Springfield deck app for Hostinger deployment.
#
# Run this from your terminal in the repo root.  It does NOT push — review
# the diff and then push manually:  git push origin main
#
# Per CLAUDE.md: this script stages SPECIFIC files only.  No "git add -A".

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "==> Clearing any stale git lock files"
rm -f .git/index.lock .git/objects/maintenance.lock 2>/dev/null || true

echo "==> Fast-forwarding to origin/main"
git fetch origin main
git pull --ff-only origin main

echo "==> Staging Springfield app files (explicit paths only)"
git add DEPLOYMENT.md
git add package.json
git add apps/springfield/README.md
git add apps/springfield/package.json
git add apps/springfield/server.mjs
git add apps/springfield/public

echo "==> Staged summary"
git diff --cached --stat | tail -20
echo
echo "==> Total staged size:"
git diff --cached --stat | tail -1

echo
echo "==> Files staged (count by directory):"
git diff --cached --name-only | awk -F/ '{print $1"/"$2}' | sort | uniq -c | sort -rn

echo
echo "==> Untracked files NOT staged (verify nothing important is missed):"
git status --short | grep '^??' || echo "  (none)"

cat <<'EOF'

==> NEXT STEPS

1. Review the staged diff:
     git diff --cached -- DEPLOYMENT.md package.json
     git diff --cached --stat apps/springfield/

2. If it looks right, commit:
     git commit -m "feat(springfield): add SGF11 deck as 4th monorepo app

   - apps/springfield/public/ — patched static export (alt text + mobile fixes applied)
   - apps/springfield/server.mjs — zero-dep static server (single-process for Hostinger)
   - apps/springfield/package.json + README
   - Root package.json: dev:springfield, build:springfield (no-op), start:springfield
   - DEPLOYMENT.md: Springfield section with Hostinger Custom-preset config
   "

3. Then push:
     git push origin main

   Heads up: this commit is ~136 MB (property photos in apps/springfield/public/images/).
   Push will take several minutes over HTTPS.

4. THEN set up the new Hostinger instance.  See DEPLOYMENT.md → Springfield section
   for the exact Custom-preset settings.  After the instance is created and the
   Hostinger CDN cache is flushed (Performance → CDN → Flush cache), the SGF11
   deck will be live at whatever domain you bind to it.

EOF
