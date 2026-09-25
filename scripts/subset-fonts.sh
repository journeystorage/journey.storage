#!/usr/bin/env bash
#
# Regenerate the self-hosted Lato subset in src/fonts/.
#
# WHY THIS EXISTS
# ---------------
# Journey's type system (BRAND_GUIDELINES.md § The Heading Pattern) sets every
# heading in Lato Light 300 with the payload phrase in Lato Heavy 800. Google
# Fonts serves Lato in 300/400/700/900 ONLY — requesting wght@500;600;800
# returns HTTP 400 — so weight 800 cannot come from next/font/google. Lato must
# be self-hosted. It is SIL OFL 1.1 licensed, so this is permitted.
#
# The upstream faces ship with Cyrillic and Greek (2170 codepoints, ~190KB each,
# ~1.5MB total). Journey publishes in English and Spanish. This script subsets to
# the Latin range, which covers English, Spanish, Portuguese, French, German and
# Italian, bringing the family to ~260KB across 9 faces.
#
# Latin Extended (Polish, Czech, Turkish, Romanian, Vietnamese) is deliberately
# excluded — it costs ~72KB per face for markets Journey does not serve. If that
# changes, add the latin-ext ranges to LATIN below and re-run.
#
# USAGE
# -----
#   Put the full unsubset Lato faces in a source directory, then:
#     ./scripts/subset-fonts.sh path/to/raw-fonts
#
#   Requires fonttools + brotli + skia-pathops. If not installed:
#     python3 -m venv /tmp/fontvenv && /tmp/fontvenv/bin/pip install fonttools brotli skia-pathops
#     PYTHON=/tmp/fontvenv/bin/python ./scripts/subset-fonts.sh path/to/raw-fonts
#
set -euo pipefail

SRC_DIR="${1:-}"
OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src/fonts"
PYTHON="${PYTHON:-python3}"

if [[ -z "$SRC_DIR" || ! -d "$SRC_DIR" ]]; then
  echo "usage: $0 <source-font-dir>" >&2
  echo "       directory containing the full Lato-*.woff2 / .ttf faces" >&2
  exit 1
fi

if ! "$PYTHON" -c "import fontTools, brotli, pathops" 2>/dev/null; then
  echo "error: fonttools, brotli and skia-pathops are required." >&2
  echo "  python3 -m venv /tmp/fontvenv" >&2
  echo "  /tmp/fontvenv/bin/pip install fonttools brotli skia-pathops" >&2
  echo "  PYTHON=/tmp/fontvenv/bin/python $0 $SRC_DIR" >&2
  exit 1
fi

# Google Fonts' "latin" unicode-range. Covers ASCII + Latin-1 Supplement, which
# includes every accented character used in Spanish and Portuguese.
LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

# Kerning and ligatures are required for the display sizes. tnum keeps figures
# aligned in pricing and size tables.
FEATURES="kern,liga,clig,calt,ccmp,locl,mark,mkmk,rlig,tnum"

mkdir -p "$OUT_DIR"
echo "subsetting → $OUT_DIR"

count=0
shopt -s nullglob
for src in "$SRC_DIR"/Lato-*.woff2 "$SRC_DIR"/Lato-*.ttf "$SRC_DIR"/Lato-*.otf; do
  base="$(basename "$src")"
  base="${base%.*}"
  "$PYTHON" -m fontTools.subset "$src" \
    --output-file="$OUT_DIR/${base}.woff2" \
    --flavor=woff2 \
    --unicodes="$LATIN" \
    --layout-features="$FEATURES" \
    --notdef-outline \
    --recommended-glyphs
  # Remove overlapping contours. The Lato 3.x (CFF) faces draw ~half their
  # glyphs from overlapping pieces (R = bowl + leg, T = stem + bar, ...).
  # macOS fills those correctly, but other rasterizers (Windows machines were
  # where it was reported) render the overlap as a hole, leaving notches at
  # every stroke junction across the whole site. Flattening the overlaps
  # makes every renderer agree. This also drops the CFF hints, which is fine.
  "$PYTHON" -m fontTools.ttLib.removeOverlaps "$OUT_DIR/${base}.woff2" "$OUT_DIR/${base}.woff2"
  size=$(( $(wc -c < "$OUT_DIR/${base}.woff2") / 1024 ))
  printf '  %-30s %4d KB\n' "${base}.woff2" "$size"
  count=$((count + 1))
done

if [[ $count -eq 0 ]]; then
  echo "error: no Lato-*.{woff2,ttf,otf} found in $SRC_DIR" >&2
  exit 1
fi

total=$(( $(cat "$OUT_DIR"/*.woff2 | wc -c) / 1024 ))
echo "done — $count faces, ${total} KB total"
echo
echo "Faces are wired up in src/app/layout.tsx. If you added or removed one,"
echo "update the localFont() src array there to match."
