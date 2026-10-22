# Brand assets

Identity board: `brandkit.png` (source: `brandkit.html`).

## Logo (`logo/`)

| File | Use |
|---|---|
| `mark-dark.svg` / `mark-dark.png` | Mark for dark backgrounds (ivory, Ion core), transparent, 1024 px |
| `mark-light.svg` / `mark-light.png` | Mark for light backgrounds (ink, Midnight core), transparent, 1024 px |
| `lockup-dark.png` / `lockup-light.png` | Mark + name, transparent, 1440×480 |
| `app-icon.png` | Ink tile with the mark, 1024 px (app icons, platforms that round corners themselves) |

## Social (`social/`)

| File | Use |
|---|---|
| `linkedin-banner-en.png` / `-es.png` | LinkedIn background photo, 1584×396 (`@2x` versions at 3168×792). Copy stays clear of the profile photo (bottom left) and the mobile side crop |
| `profile-photo.png` | Profile picture, 800×800: photo inside the mark's ring, safe for circular crops |
| `avatar-mark.png` | Logo-only avatar, 800×800 (GitHub, X, other accounts) |

## Regenerating

The PNGs are rendered from the HTML templates in `templates/` with headless Chrome:

```bash
brand/render.sh
```

Templates use the site's own fonts (`src/assets/fonts/`) and photo (`src/assets/pfp.webp`), so a change there is picked up on the next render. Banner copy lives in `templates/linkedin-banner.html`.
