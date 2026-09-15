#!/usr/bin/env bash
# Downloads the reference images the new /smartentry page uses into
# public/images/smartentry/. Run from the repo root on a normal network:
#
#   bash scripts/fetch-smartentry-assets.sh
#
# Files already in public/images/smartentry/ are kept. Delete a file first to re-fetch it.
# The versions committed on 15 Sep 2026 were captured at reduced resolution;
# (shot-*.png, rollup-*-ink.png, app-icon.png, qr-*.svg, door-photo.*) are
# left alone. Everything below is Janus / App Store material, hot-linked in
# the mockup and saved locally here so next/image can serve it. Replace with
# the originals from Janus (Marketing@JanusIntl.com) or your own Granbury
# photos as they arrive; keep the filenames and the page needs no changes.

set -euo pipefail
DEST="public/images/smartentry"
mkdir -p "$DEST"

fetch () {
  local name="$1" url="$2"
  if [ -s "$DEST/$name" ] && [ "${FORCE:-0}" != "1" ]; then echo "keep   $name  (FORCE=1 to overwrite)"; return; fi
  curl -fsSL -A "Mozilla/5.0" -o "$DEST/$name" "$url" && echo "saved  $name" || echo "FAILED $name  ($url)"
}

# Hero (Janus Europe, 2560x1920). Saved as JPEG; the page references .jpg.
fetch hero-corridor.jpg   "https://januseurope.com/wp-content/uploads/2025/11/Noke-Ion-and-corridor-scaled.webp"

# Gate sequence (step 3 uses door-photo.webp, already in the folder)
fetch gate-1-open-app.jpg "https://januseurope.com/wp-content/uploads/2025/10/Container-1-1.png"

# Unit sequence (Janus Europe ION photos)
fetch unit-1-tap.jpg      "https://januseurope.com/wp-content/uploads/2025/10/Frame-1597884648-2.png"
fetch unit-2-latch.jpg    "https://januseurope.com/wp-content/uploads/2025/10/Container-3.png"
fetch unit-3-lift.jpg     "https://januseurope.com/wp-content/uploads/2025/11/Goymsla-2025.jpg"

# Share flow (Janus Help Center): the duration picker
fetch share-2-duration.png "https://www.janusintl.com/hs-fs/hubfs/IMG_2351-PNG.png"

# Share flow step 1 (Janus Help Center) and the current app UI from the App Store
# listing (id1241055944). Fetched 15 Sep 2026 and re-encoded to 600px-wide webp with
# sharp; the page references the .webp names. Re-run this and re-encode to refresh.
fetch share-1-number.png  "https://www.janusintl.com/hs-fs/hubfs/IMG_2349-PNG-1.png"
fetch app-home.png        "https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/18/1e/b0/181eb0b8-c457-4acb-206e-8ee8fe0e7593/pr_source.png/1242x2208bb.png"
fetch app-entries.png     "https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/b6/f7/06/b6f706f3-2ae4-c82c-f8f0-216676bc06bc/pr_source.png/1242x2208bb.png"

echo
echo "Note: hero and gate/unit files are saved with the original bytes (webp/png) under .jpg names;"
echo "next/image sniffs the real format, so this is fine. Re-encode to real JPEG if you prefer."
echo "Done. Check $DEST, then: npm run dev and open http://localhost:3000/smartentry"
