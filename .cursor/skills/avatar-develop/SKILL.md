---
name: avatar-develop
description: Alter avatar sprites and animations — edit → generate → preview → approve. Use when the user types /avatardev or asks to alter, edit, update, or tweak avatars.
---

# Avatar Development — Edit, Generate, Preview, Approve

Modify the RPG pixel-art avatar system: palette changes, body-part edits, animation transforms, and advanced-variant particles. Follows an edit → generate → preview → approve loop.

## Command Patterns

- `/avatardev` — enter the avatar editing workflow (prompts for what to change)
- `/avatardev <instruction>` — jump straight to editing (e.g. `/avatardev make tier 3 orb pulse faster`)
- Also triggers on: "alter avatar", "edit sprite", "change avatar", "update avatar", "tweak sprite", "avatar colors", "avatar animation"

## Architecture

### Core Files

| File | Purpose |
| ---- | ------- |
| `scripts/rpg_sprites.py` | Palettes, body parts, transforms, animation specs |
| `scripts/avatar_generator.py` | CLI — renders sprites to GIF/PNG at multiple sizes |
| `website/packages/shared/lib/rpg.ts` | Tier metadata, avatar URL helpers, XP thresholds |
| `website/packages/shared/components/AvatarBadge.tsx` | Renders avatar on the website |
| `website/apps/shawnos/app/rpg-preview/page.tsx` | Visual preview of all tiers and variants |
| `data/progression/avatars/` | Generated output — GIFs, PNGs, sprite sheets |

### rpg_sprites.py Internals

**PALETTES** (dict, tiers 1–6) — each tier maps to:

```python
{
    "primary": (r, g, b),
    "secondary": (r, g, b),
    "dark": (r, g, b),
    "highlight": (r, g, b),
    "glow": (r, g, b),
    "accent": (r, g, b),   # red-family, used by advanced transforms
}
```

**Body-part functions** — `_tierN_sprite()` returns a `Sprite` (dict of named body parts with pixel data and z-order):

| Tier | Class | Key Parts |
| ---- | ----- | --------- |
| 1 | Hooded Figure | hood, robe, staff_shaft, cursor_block |
| 2 | Adventurer | headband, tunic, scroll |
| 3 | Mage | hat, robe, sleeves, staff_shaft, orb |
| 4 | Armored Alchemist | circlet, armor, cape, belt_vials, flask |
| 5 | Knight | helmet, armor, cape, sword_blade, sword_hilt, shield |
| 6 | Grand Master | crown, armor, wings, aura |

All tiers share `_base_body()` (head, body, arms, legs).

**Transform functions** — called per-frame to animate:

- Standard: `tierN_idle(sprite, frame, total)`, `tierN_action(sprite, frame, total)`
- Advanced: `tierN_idle_advanced(sprite, frame, total)`, `tierN_action_advanced(sprite, frame, total)`
- Advanced variants add extra particles, glow effects, and use `p["accent"]` for red-tinted pixels.

**Animation dicts:**

- `TIER_ANIMATIONS` — standard (early) variant specs
- `TIER_ANIMATIONS_ADVANCED` — advanced variant specs
- Each entry: `{ "idle": AnimationSpec, "action": AnimationSpec }`
- `AnimationSpec`: `transform` function, `frames` count (idle 8–12, action 12–16), `duration_ms` (idle ~150ms, action ~80ms)

**Helper functions:**

| Function | What It Does |
| -------- | ------------ |
| `brighten_part(part, amount)` | Shift brightness of all colors in a body part |
| `add_pixels(part, pixels)` | Append pixel primitives to a part |
| `brightness(color, amount)` | Clamp-shift an RGB tuple's brightness |
| `pulse_color(color, frame, total, amplitude)` | Sinusoidal brightness pulse over animation frames |
| `shift_part(part, dx, dy)` | Translate a body part by offset |
| `shift_all(sprite, dx, dy)` | Translate all parts in a sprite |
| `deep_copy_sprite(sprite)` | Deep copy for safe per-frame mutation |
| `remove_part(sprite, name)` | Remove a named part from the sprite |

### avatar_generator.py CLI

```bash
# Generate all tiers, both variants, all sizes
python3 scripts/avatar_generator.py --variant both

# Generate a single tier (advanced only)
python3 scripts/avatar_generator.py --tier 3 --variant advanced

# Generate with custom sizes
python3 scripts/avatar_generator.py --tier 1 --sizes 64,128

# Generate and set as current avatar
python3 scripts/avatar_generator.py --tier 2 --current

# Generate all + sprite sheet
python3 scripts/avatar_generator.py --variant both --sheet
```

**Arguments:**

| Flag | Default | Purpose |
| ---- | ------- | ------- |
| `--tier N` | all | Generate specific tier (1–6) |
| `--variant` | `early` | `early`, `advanced`, or `both` |
| `--sizes` | `64,128,256,512` | Comma-separated output sizes |
| `--outdir` | `data/progression/avatars/` | Output directory |
| `--sheet` | off | Also generate sprite sheet |
| `--current` | off | Set generated tier as current (needs `--tier`) |
| `--all-current` | off | Generate all and set `--tier` as current |
| `-q, --quiet` | off | Suppress per-tier output |

### Output File Naming

```
data/progression/avatars/
├── tier-{N}-idle.gif                    # default size (128), early
├── tier-{N}-idle-{size}.gif             # specific size, early
├── tier-{N}-idle-advanced.gif           # default size, advanced
├── tier-{N}-idle-advanced-{size}.gif    # specific size, advanced
├── tier-{N}-action.gif                  # same pattern for action
├── tier-{N}-action-advanced.gif
├── tier-{N}-static.png                  # first-frame PNG, early
├── tier-{N}-static-advanced.png         # first-frame PNG, advanced
├── current-idle.gif                     # copy of active tier
├── current-action.gif
├── current.png
├── idle-sprite-sheet.png                # all tiers side-by-side
└── sprite-sheet.png
```

Sizes: 64, 128, 256, 512. Files without a size suffix are the default (128px).

## Editing Patterns

### Palette change

Edit the `PALETTES` dict in `rpg_sprites.py`. Each tier's palette drives all colors for that tier.

```python
# Example: make Tier 2's accent brighter
PALETTES[2]["accent"] = (240, 50, 50)
```

### New particles or glow effects

Edit the `tierN_*_advanced()` transform functions. Use `add_pixels()` to place new pixels and `p["accent"]` for red-family coloring.

```python
# Example: add a particle in tier3_idle_advanced
add_pixels(sprite["particles"], [
    ((x, y), p["accent"]),
    ((x+1, y), brightness(p["accent"], 30)),
])
```

### Body-part edits

Edit the `_tierN_sprite()` functions. Each body part is a dict with pixel data and z-order.

### Animation timing

Edit `TIER_ANIMATIONS` or `TIER_ANIMATIONS_ADVANCED` dicts — change `frames` count or `duration_ms`.

### New tier or class

1. Add a palette entry in `PALETTES`
2. Create `_tierN_sprite()` body-part function
3. Create `tierN_idle()`, `tierN_action()` transforms
4. Optionally create `tierN_idle_advanced()`, `tierN_action_advanced()`
5. Register in `TIER_ANIMATIONS` and/or `TIER_ANIMATIONS_ADVANCED`

## Workflow: Edit → Generate → Preview → Approve

### Step 1: Edit

Make changes in `scripts/rpg_sprites.py` based on the user's request. Common edits:

- Palette colors → `PALETTES` dict
- New particles → `tierN_*_advanced()` functions
- Body parts → `_tierN_sprite()` functions
- Animation timing → `TIER_ANIMATIONS` / `TIER_ANIMATIONS_ADVANCED`

### Step 2: Generate

Run the avatar generator to produce updated assets:

```bash
# Full regeneration (both variants, all tiers)
python3 scripts/avatar_generator.py --variant both

# Single tier for quick iteration
python3 scripts/avatar_generator.py --tier 3 --variant both
```

Verify the expected number of files:
- Per tier: 18 files (2 animations × 2 variants × 4 sizes + 2 static × 2 variants + default-size copies)
- Full set: 36 tier files + current + sprite sheets

### Step 3: Preview

Start the dev server and open the preview page:

```bash
cd website && npm run dev
```

Open `http://localhost:3000/rpg-preview` in the browser (or use `/preview` skill for side-by-side).

The preview page shows all tiers with both early and advanced variants. Check:
- Colors render as intended
- Animations are smooth (no flickering frames)
- Advanced variants visually differ from early variants
- Red accents appear on advanced variants where expected

### Step 4: Approve

Show the user the preview (screenshot or browser panel). Wait for approval before proceeding. If changes are requested, loop back to Step 1.

Once approved:
- Commit updated `rpg_sprites.py` and generated assets
- Deploy with `/deploy` if requested

## Error Handling

- **Pillow not installed**: Run `pip3 install Pillow`
- **Generation fails on a tier**: Check that `PALETTES[N]` exists and the tier's sprite/transform functions are registered in `TIER_ANIMATIONS`
- **Colors look wrong**: Verify RGB tuples are `(0–255, 0–255, 0–255)` — no floats
- **Animation stutters**: Check `frames` count and `duration_ms` in animation spec — too few frames or too-short duration causes jitter
- **Preview page blank**: Confirm dev server is running and avatar URLs resolve (check `rpg.ts` `getTierAvatarUrls()`)

## Integration

- **`/deploy`**: Commit and deploy after approved changes
- **`/tracker`**: Avatar changes count toward daily output score
- **`/preview` / `/website`**: Use for side-by-side browser preview during editing
- **`rpg.ts` + `AvatarBadge.tsx`**: Website components that consume the generated assets
