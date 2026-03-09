---
name: x-tip-image
description: Generate a canonical Post Image (PI) for X micro-tip posts. Matrix rain background, hero series number, centered tip panel. Use when the user types /xtipimage or asks to create an image for an X tip post.
---

# X Tip Post Image (PI) Generator

Generate the canonical branded post image for any X micro-tip post. Matrix-rain numerical background, green-on-black terminal aesthetic, hero series number, centered tip panel. Sized for X (1200x675).

## Command Pattern

- `/xtipimage` -- generate from the X tip post currently being discussed
- `/xtipimage <path>` -- generate from a specific X tip draft file
- Also triggers on "create an image for this tip", "tip image", "PI for this tip", "post image for the X tip"

## Workflow

### Step 1: Read the Source Tip

If a file path is given, read it. Otherwise use the tip from conversation context. Extract these **6 variables**:

| Variable | What It Is | Example (Plan Mode tip) |
|---|---|---|
| `series_prefix` | The series name (from the draft frontmatter `Series:` field) | `cursor tips 101` |
| `tip_number` | The number from the series prefix | `101` |
| `tip_slug` | Kebab-case slug for the filename | `plan-mode` |
| `tip_command` | A terminal-style command that represents the tip | `plan-mode --before-execute` |
| `tip_lines` | The tip text, broken into 2-3 centered lines (from `## Post`) | `["if you don't have a slash command", "for it yet, start in plan mode.", "that's the rule."]` |
| `result_lines` | 3 short benefit/result lines (from `## Reply`) | `["no accidental edits.", "no burned context.", "clean blueprint first."]` |

**Deriving `tip_command`**: Convert the tip's core action into a plausible CLI command. Examples:
- "start in plan mode" -> `plan-mode --before-execute`
- "name your chats" -> `name-chat --before-start`
- "use slash commands" -> `slash-cmd --register`
- "pin your context" -> `context --pin`

**Deriving `tip_lines`**: Take the post text and break it into 2-3 lines that fit centered in a 880px-wide panel at 14pt Menlo bold. Each line should be roughly 35-45 characters. The last line should be the punchline (rendered in GREEN).

**Deriving `result_lines`**: Extract 3 short benefits from the reply text. Last one is GREEN, others are MUTED.

### Step 2: Determine Boot Mode

Map the tip topic to a boot mode flag:

| Topic | Boot Mode |
|---|---|
| Plan mode, approach, strategy | `--mode=plan` |
| Naming, organization, retrieval | `--mode=organize` |
| Context, skills, slash commands | `--mode=build` |
| Debugging, errors, fixes | `--mode=debug` |
| Speed, efficiency, shortcuts | `--mode=optimize` |
| MCP, tools, integrations | `--mode=connect` |
| General/default | `--mode=tip` |

### Step 3: Write the Generator Script

Create at: `content/images/_gen_{tip_slug}.py`

Use the **exact template** below. Only change the values marked with `# VARIABLE`.

### Step 4: Generate, Verify, Open

1. Run: `python3 content/images/_gen_{tip_slug}.py`
2. Open the PNG with `open content/images/{output_filename}.png` so the user can see it
3. Confirm with user

## Generator Template

The script below is the canonical template. Copy it exactly, replacing only the `# VARIABLE` lines.

```python
#!/usr/bin/env python3
"""
X post image for {SERIES_PREFIX}: {TIP_TITLE}.
Matrix-rain numerical background with centered terminal panel.
"""

import math, os, random
from PIL import Image, ImageDraw, ImageFont

random.seed(42)  # reproducible rain

# ── Design System ────────────────────────────────────────────
BG         = (6, 7, 10)
PANEL      = (14, 16, 22)
BORDER     = (35, 40, 50)
GREEN      = (78, 195, 115)
TXT        = (185, 195, 210)
BRIGHT     = (230, 236, 245)
MUTED      = (100, 110, 128)
DIM_GREEN  = (50, 130, 75)
DARK_GREEN = (30, 85, 45)
FAINT_GREEN = (18, 55, 30)
GHOST_GREEN = (12, 38, 22)

# ── Fonts ────────────────────────────────────────────────────
MENLO = "/System/Library/Fonts/Menlo.ttc"

fBrand   = ImageFont.truetype(MENLO, 28, index=1)
fTitle   = ImageFont.truetype(MENLO, 18, index=1)
fCmd     = ImageFont.truetype(MENLO, 15, index=0)
fBody    = ImageFont.truetype(MENLO, 13, index=0)
fBold    = ImageFont.truetype(MENLO, 13, index=1)
fSmall   = ImageFont.truetype(MENLO, 11, index=0)
fSmBold  = ImageFont.truetype(MENLO, 11, index=1)
fTiny    = ImageFont.truetype(MENLO, 10, index=0)
fFoot    = ImageFont.truetype(MENLO, 10, index=0)
fPhase   = ImageFont.truetype(MENLO, 14, index=1)
fQuote   = ImageFont.truetype(MENLO, 14, index=1)
fRain    = ImageFont.truetype(MENLO, 13, index=0)
fRainSm  = ImageFont.truetype(MENLO, 10, index=0)
fHero    = ImageFont.truetype(MENLO, 72, index=1)
fSeries  = ImageFont.truetype(MENLO, 22, index=1)
fTip     = ImageFont.truetype(MENLO, 16, index=1)

# ── Canvas (X post: 1200x675) ───────────────────────────────
W, H = 1200, 675
img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)
PAD = 36

# ═══════════════════════════════════════════════════════════════
# VARIABLES — change these per tip
# ═══════════════════════════════════════════════════════════════
SERIES_LABEL   = "cursor tip"              # VARIABLE: series display name
TIP_NUMBER     = "101"                     # VARIABLE: series number
BOOT_MODE      = "--mode=plan"             # VARIABLE: boot mode flag
LOADING_MSG    = "loading cursor.tips.101..."  # VARIABLE: loading message
TIP_COMMAND    = "plan-mode --before-execute"  # VARIABLE: terminal command
SESSION_LABEL  = "CURSOR TIPS // 101"      # VARIABLE: top-right session info
DATE_LABEL     = "2026-02-11 // shawn@gtme-os"  # VARIABLE: date line

# Tip text lines (centered in panel). Last line = punchline (GREEN).
TIP_LINES = [                              # VARIABLE
    "if you don't have a slash command",
    "for it yet, start in plan mode.",
]
PUNCHLINE = "that's the rule."             # VARIABLE: rendered in GREEN

# Result/benefit lines. Last = GREEN, others = MUTED.
RESULT_LINES = [                           # VARIABLE
    "no accidental edits.",
    "no burned context.",
    "clean blueprint first.",
]

# Boot complete messages
BOOT_COMPLETE  = "AI/os plan complete."    # VARIABLE
BOOT_CLOSING   = "execute with confidence." # VARIABLE
SERIES_BOTTOM  = "CURSOR TIPS // plan mode" # VARIABLE: bottom-right label

OUTPUT_FILENAME = "cursor-tip-101-plan-mode.png"  # VARIABLE

# ═══════════════════════════════════════════════════════════════
# TEMPLATE — everything below is fixed, do not change
# ═══════════════════════════════════════════════════════════════

def text_w(text, font):
    return draw.textlength(text, font=font)

def draw_glow_dot(x, y, r, color):
    glow = tuple(max(0, c - 40) for c in color)
    draw.ellipse([x - r - 2, y - r - 2, x + r + 2, y + r + 2], fill=glow)
    draw.ellipse([x - r, y - r, x + r, y + r], fill=color)

# ── LAYER 1: Matrix Rain Background ─────────────────────────
col_spacing = 18
num_cols = W // col_spacing + 1
rain_chars = "0123456789" * 4 + "ABCDEF" + "+-=<>|:" + "01" * 6

for col in range(num_cols):
    cx = col * col_spacing + random.randint(-2, 2)
    lead_y = random.randint(-100, H + 100)
    trail_len = random.randint(8, 28)
    for row in range(0, H, 16):
        char = random.choice(rain_chars)
        dist_from_lead = abs(row - lead_y)
        if dist_from_lead < trail_len * 16:
            fade = max(0, 1.0 - dist_from_lead / (trail_len * 16))
            if fade > 0.7:
                color = GREEN; font = fRain
            elif fade > 0.4:
                color = DIM_GREEN; font = fRain
            elif fade > 0.2:
                color = FAINT_GREEN; font = fRainSm
            else:
                color = GHOST_GREEN; font = fRainSm
            if random.random() < 0.6:
                draw.text((cx, row), char, font=font, fill=color)
        else:
            if random.random() < 0.12:
                draw.text((cx, row), random.choice("01234567890"),
                          font=fRainSm, fill=GHOST_GREEN)

# ── LAYER 2: Scanlines ──────────────────────────────────────
for sy in range(0, H, 3):
    if sy % 6 == 0:
        draw.line([(0, sy), (W, sy)], fill=(10, 12, 16), width=1)

# ── LAYER 3: Central darkened zone ───────────────────────────
center_panel_x, center_panel_y = 120, 60
center_panel_w, center_panel_h = W - 240, H - 120

for i in range(40):
    alpha_pct = 0.85 - (i * 0.01)
    inset = i * 3
    x1 = center_panel_x + inset
    y1 = center_panel_y + inset
    x2 = center_panel_x + center_panel_w - inset
    y2 = center_panel_y + center_panel_h - inset
    if x1 >= x2 or y1 >= y2:
        break
    r = int(BG[0] * alpha_pct)
    g = int(BG[1] * alpha_pct)
    b = int(BG[2] * alpha_pct)
    if i < 5:
        draw.rounded_rectangle([x1, y1, x2, y2], radius=16 - i,
                               fill=None, outline=(r + 8, g + 10, b + 6), width=1)

draw.rounded_rectangle(
    [center_panel_x + 20, center_panel_y + 20,
     center_panel_x + center_panel_w - 20, center_panel_y + center_panel_h - 20],
    radius=12, fill=(8, 9, 13), outline=None
)

# ── LAYER 4: Top Bar ────────────────────────────────────────
dot_y = 18
for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
    draw.ellipse([PAD + i * 22, dot_y, PAD + 12 + i * 22, dot_y + 12], fill=c)

brand_x = PAD + 80
draw.text((brand_x, 12), "AI", font=fBrand, fill=GREEN)
slash_x = brand_x + text_w("AI", fBrand)
draw.text((slash_x, 12), "/os", font=fBrand, fill=BRIGHT)
cmd_x = slash_x + text_w("/os", fBrand) + 8
draw.text((cmd_x, 20), "command", font=fTitle, fill=DIM_GREEN)

draw.text((W - PAD - text_w(SESSION_LABEL, fSmBold), 14),
          SESSION_LABEL, font=fSmBold, fill=GREEN)
draw.text((W - PAD - text_w(DATE_LABEL, fSmall), 28),
          DATE_LABEL, font=fSmall, fill=MUTED)

draw.line([(PAD, 44), (W - PAD, 44)], fill=BORDER, width=1)

# ── LAYER 5: Boot Command ───────────────────────────────────
cy = 56
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy),
          f"AI/os boot {BOOT_MODE}", font=fCmd, fill=BRIGHT)
cy += 20
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), LOADING_MSG, font=fCmd, fill=MUTED)

# ── LAYER 6: Central Content Panel ──────────────────────────
panel_x, panel_y = 160, 120
panel_w, panel_h = W - 320, 400
draw.rounded_rectangle(
    [panel_x, panel_y, panel_x + panel_w, panel_y + panel_h],
    radius=10, fill=PANEL, outline=GREEN, width=2
)

# Series branding
iy = panel_y + 28
slw = text_w(SERIES_LABEL, fSeries)
draw.text(((W - slw - text_w(" " + TIP_NUMBER, fHero) * 0.55) / 2, iy),
          SERIES_LABEL, font=fSeries, fill=MUTED)

# Hero number with glow
iy += 30
nw = text_w(TIP_NUMBER, fHero)
nx = (W - nw) / 2
for offset in range(8, 0, -1):
    glow_alpha = max(0, 20 - offset * 2)
    glow_color = (
        int(GREEN[0] * glow_alpha / 60),
        int(GREEN[1] * glow_alpha / 60),
        int(GREEN[2] * glow_alpha / 60)
    )
    draw.text((nx - offset / 2, iy - offset / 2), TIP_NUMBER,
              font=fHero, fill=glow_color)
draw.text((nx, iy), TIP_NUMBER, font=fHero, fill=GREEN)

# Decorative line under number
iy += 82
line_w = 300
lx = (W - line_w) / 2
draw.line([(lx, iy), (lx + line_w, iy)], fill=BORDER, width=1)
draw.line([(W / 2 - 40, iy), (W / 2 + 40, iy)], fill=DIM_GREEN, width=2)

# Terminal command
iy += 20
clw = text_w("$ " + TIP_COMMAND, fTip)
cmd_draw_x = (W - clw) / 2
draw.text((cmd_draw_x, iy), "$ ", font=fTip, fill=GREEN)
draw.text((cmd_draw_x + text_w("$ ", fTip), iy),
          TIP_COMMAND, font=fTip, fill=BRIGHT)

# Tip text lines
iy += 40
for line in TIP_LINES:
    lw = text_w(line, fQuote)
    draw.text(((W - lw) / 2, iy), line, font=fQuote, fill=TXT)
    iy += 22

# Punchline (GREEN, bold)
iy += 10
pw = text_w(PUNCHLINE, fTip)
draw.text(((W - pw) / 2, iy), PUNCHLINE, font=fTip, fill=GREEN)

# Result lines
iy += 40
for idx, txt in enumerate(RESULT_LINES):
    is_last = idx == len(RESULT_LINES) - 1
    line_color = GREEN if is_last else MUTED
    prefix = "> "
    total_w = text_w(prefix + txt, fSmall)
    rx = (W - total_w) / 2
    draw.text((rx, iy), prefix, font=fSmall, fill=DIM_GREEN)
    draw.text((rx + text_w(prefix, fSmall), iy), txt, font=fSmall, fill=line_color)
    iy += 16

# ── Bottom bar ──────────────────────────────────────────────
bot_y = H - 70
draw.line([(PAD, bot_y), (W - PAD, bot_y)], fill=BORDER, width=1)
bot_y += 10

draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), BOOT_COMPLETE, font=fCmd, fill=GREEN)
bot_y += 18
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), BOOT_CLOSING, font=fCmd, fill=BRIGHT)

draw.text((W - PAD - text_w(SERIES_BOTTOM, fSmBold), H - 60),
          SERIES_BOTTOM, font=fSmBold, fill=DIM_GREEN)

footer = "built with Cursor + Claude Code  //  shawn @ the gtme alchemist"
fw_val = text_w(footer, fFoot)
draw.text(((W - fw_val) / 2, H - 22), footer, font=fFoot, fill=MUTED)

# ── Corner accents ──────────────────────────────────────────
cr = W - PAD
draw.line([(cr - 16, PAD - 12), (cr, PAD - 12)], fill=DIM_GREEN, width=1)
draw.line([(cr, PAD - 12), (cr, PAD + 4)], fill=DIM_GREEN, width=1)
draw.line([(PAD, H - PAD), (PAD, H - PAD - 16)], fill=DIM_GREEN, width=1)
draw.line([(PAD, H - PAD), (PAD + 16, H - PAD)], fill=DIM_GREEN, width=1)

# ── Save ─────────────────────────────────────────────────────
out_dir = os.path.dirname(__file__)
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, OUTPUT_FILENAME)
img.save(out, "PNG", dpi=(144, 144))
print(f"saved -> {out}")
print(f"  {W} x {H} px (X post image)")
```

## Variable Extraction Examples

### Example 1: "cursor tip 101: name your agent chats before you start"

```
SERIES_LABEL   = "cursor tip"
TIP_NUMBER     = "101"
BOOT_MODE      = "--mode=organize"
LOADING_MSG    = "loading cursor.tips.101..."
TIP_COMMAND    = "name-chat --before-start"
SESSION_LABEL  = "CURSOR TIPS // 101"
DATE_LABEL     = "2026-02-12 // shawn@gtme-os"
TIP_LINES      = ["name your agent chat before", "you type a single instruction."]
PUNCHLINE      = "future you will thank present you."
RESULT_LINES   = ["no scrolling through 50 unnamed chats.", "instant retrieval by name.", "two seconds saves ten minutes."]
BOOT_COMPLETE  = "AI/os organize complete."
BOOT_CLOSING   = "findable by default."
SERIES_BOTTOM  = "CURSOR TIPS // name your chats"
OUTPUT_FILENAME = "cursor-tip-101-name-chats.png"
```

### Example 2: "mcp tip: always test your MCP connection before building on it"

```
SERIES_LABEL   = "mcp tip"
TIP_NUMBER     = "001"
BOOT_MODE      = "--mode=connect"
LOADING_MSG    = "loading mcp.tips.001..."
TIP_COMMAND    = "mcp-test --before-build"
SESSION_LABEL  = "MCP TIPS // 001"
DATE_LABEL     = "2026-02-13 // shawn@gtme-os"
TIP_LINES      = ["always test your MCP connection", "before building workflows on it."]
PUNCHLINE      = "broken pipes waste hours."
RESULT_LINES   = ["no silent failures.", "no debugging ghost errors.", "confidence before complexity."]
BOOT_COMPLETE  = "AI/os connect complete."
BOOT_CLOSING   = "pipe verified."
SERIES_BOTTOM  = "MCP TIPS // test first"
OUTPUT_FILENAME = "mcp-tip-001-test-connection.png"
```

## Series Number Mapping

The hero number comes from the series prefix:

| Series | Number Format | Example |
|---|---|---|
| `cursor tips 101` | `101` | Always 101 for cursor tips |
| `mcp tip` | `001`, `002`, etc. | Sequential |
| `outbound tip` | `001`, `002`, etc. | Sequential |
| `gtm tip` | `001`, `002`, etc. | Sequential |

## Output

- Save PNG to `content/images/{output_filename}`
- Save generator script to `content/images/_gen_{tip_slug}.py`
- Open image with `open` command so user can preview
- Confirm with user before moving on

## Reference Implementation

- **Canonical first PI**: `content/images/_gen_cursor_tip_101_plan_mode.py` -> `cursor-tip-101-plan-mode.png`

## Dependencies

- Python 3 + Pillow (`pip install Pillow`)
- Menlo font (pre-installed macOS)

## Integration

- Pairs with the `/xtip` skill for generating the post text
- After both tip text and PI are approved, user runs `/finalcopy` to publish
- The PI gets attached to the X post manually or via Typefully media upload
