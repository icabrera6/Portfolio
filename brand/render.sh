#!/usr/bin/env bash
# Renders the brand assets in brand/templates/ to PNG with headless Chrome.
#   brand/social/  LinkedIn banners (EN/ES), profile photo, logo avatar
#   brand/logo/    mark (dark/light, transparent), app icon, horizontal lockup (dark/light)
# Usage: brand/render.sh   (needs Google Chrome and python3)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT=5310
BASE="http://127.0.0.1:$PORT/brand/templates"
OUT_SOCIAL="$ROOT/brand/social"
OUT_LOGO="$ROOT/brand/logo"
mkdir -p "$OUT_SOCIAL" "$OUT_LOGO"

# Templates load ES modules and fonts, which Chrome won't do from file://
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for _ in $(seq 1 20); do curl -s -o /dev/null "http://127.0.0.1:$PORT/" && break; sleep .2; done

# shot <url> <width> <height> <scale> <output> [transparent]
shot() {
    local bg=()
    [ "${6:-}" = transparent ] && bg=(--default-background-color=00000000)
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars ${bg[@]+"${bg[@]}"} \
        --window-size="$2,$3" --force-device-scale-factor="$4" --virtual-time-budget=6000 \
        --screenshot="$5" "$1" >/dev/null 2>&1
    echo "  $(basename "$5")  $(sips -g pixelWidth -g pixelHeight "$5" | awk '/pixel/ {printf "%s ", $2}')"
}

echo "Social"
for lang in en es; do
    shot "$BASE/linkedin-banner.html?lang=$lang" 1584 396 2 "$OUT_SOCIAL/linkedin-banner-$lang@2x.png"
    sips -z 396 1584 "$OUT_SOCIAL/linkedin-banner-$lang@2x.png" --out "$OUT_SOCIAL/linkedin-banner-$lang.png" >/dev/null
    echo "  linkedin-banner-$lang.png  1584 396"
done
shot "$BASE/profile-photo.html" 800 800 1 "$OUT_SOCIAL/profile-photo.png"
shot "$BASE/mark.html?variant=avatar" 800 800 1 "$OUT_SOCIAL/avatar-mark.png"

echo "Logo"
shot "$BASE/mark.html?variant=dark" 512 512 2 "$OUT_LOGO/mark-dark.png" transparent
shot "$BASE/mark.html?variant=light" 512 512 2 "$OUT_LOGO/mark-light.png" transparent
shot "$BASE/mark.html?variant=tile" 512 512 2 "$OUT_LOGO/app-icon.png"
shot "$BASE/lockup.html?variant=dark" 720 240 2 "$OUT_LOGO/lockup-dark.png" transparent
shot "$BASE/lockup.html?variant=light" 720 240 2 "$OUT_LOGO/lockup-light.png" transparent

# Site favicons, at stable URLs in public/. Google only uses favicons that are a multiple of 48 px
# square (or SVG), so: favicon.ico (16/32/48), favicon-96x96.png, favicon.svg and the 180 px touch icon.
echo "Favicons"
PUBLIC="$ROOT/public"
TMP="$(mktemp -d)"
shot "$BASE/mark.html?variant=favicon" 512 512 1 "$TMP/favicon-512.png" transparent
for s in 16 32 48 96; do sips -z "$s" "$s" "$TMP/favicon-512.png" --out "$TMP/favicon-$s.png" >/dev/null; done
cp "$TMP/favicon-96.png" "$PUBLIC/favicon-96x96.png"
shot "$BASE/mark.html?variant=tile" 540 540 1 "$TMP/touch-540.png"
sips -z 180 180 "$TMP/touch-540.png" --out "$PUBLIC/apple-touch-icon.png" >/dev/null
python3 - "$TMP" "$PUBLIC/favicon.ico" <<'PY'
# ICO container with PNG-encoded 16, 32 and 48 px images
import struct, sys
tmp, out = sys.argv[1], sys.argv[2]
images = [(s, open(f'{tmp}/favicon-{s}.png', 'rb').read()) for s in (16, 32, 48)]
offset = 6 + 16 * len(images)
header = struct.pack('<HHH', 0, 1, len(images))
entries, data = b'', b''
for size, png in images:
    entries += struct.pack('<BBBBHHII', size, size, 0, 0, 1, 32, len(png), offset + len(data))
    data += png
open(out, 'wb').write(header + entries + data)
PY
echo "  favicon.ico  16 32 48"
echo "  favicon-96x96.png  96 96"
echo "  apple-touch-icon.png  180 180"
rm -rf "$TMP"
