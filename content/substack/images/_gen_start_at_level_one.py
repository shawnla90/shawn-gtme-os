#!/usr/bin/env python3
"""
Substack article header image for Post 5: Start at Level One.
Terminal-style boot sequence showing the RPG progression from
"import someone else's endgame gear" to "your repo IS the system."

2x2 phase grid: Temptation → Audit → Specificity → The Lesson

Canvas: 1456 x 1048 (Substack-optimized for post cover + social preview)
Branding: Shawn AI/os command
"""

import os
from PIL import Image, ImageDraw, ImageFont

# ── Design System ────────────────────────────────────────────
BG         = (12, 13, 17)
PANEL      = (22, 24, 30)
BORDER     = (40, 44, 54)
GREEN      = (78, 195, 115)
TXT        = (185, 195, 210)
BRIGHT     = (230, 236, 245)
MUTED      = (100, 110, 128)
AMBER      = (210, 165, 60)
CYAN       = (80, 190, 210)
DIM_GREEN  = (50, 130, 75)
RED_MUTED  = (180, 80, 80)
DIM_RED    = (100, 50, 50)
DARK_GREEN = (30, 85, 45)

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

# ── Canvas (Substack optimized: 14:10 for post cover + social cards) ──
W, H = 1456, 1048
img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

PAD = 40

# ── Helpers ──────────────────────────────────────────────────
def text_w(text, font):
    return draw.textlength(text, font=font)

def draw_progress_bar(x, y, w, fill_pct, color, bg_color=BORDER):
    bar_h = 10
    draw.rectangle([x, y, x + w, y + bar_h], fill=bg_color)
    fill_w = int(w * fill_pct)
    if fill_w > 0:
        draw.rectangle([x, y, x + fill_w, y + bar_h], fill=color)

def draw_glow_dot(x, y, r, color):
    glow = tuple(max(0, c - 40) for c in color)
    draw.ellipse([x - r - 2, y - r - 2, x + r + 2, y + r + 2], fill=glow)
    draw.ellipse([x - r, y - r, x + r, y + r], fill=color)

# ── Scanlines ────────────────────────────────────────────────
for sy in range(0, H, 3):
    if sy % 6 == 0:
        draw.line([(0, sy), (W, sy)], fill=(18, 20, 24), width=1)

# ── Top Bar: Shawn AI/os Branding ────────────────────────────
dot_y = 18
for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
    draw.ellipse([PAD + i * 22, dot_y, PAD + 12 + i * 22, dot_y + 12], fill=c)

brand_x = PAD + 80
draw.text((brand_x, 12), "Shawn", font=fBrand, fill=MUTED)
shawn_w = text_w("Shawn", fBrand)
draw.text((brand_x + shawn_w + 10, 12), "AI", font=fBrand, fill=GREEN)
ai_w = text_w("AI", fBrand)
draw.text((brand_x + shawn_w + 10 + ai_w, 12), "/os", font=fBrand, fill=BRIGHT)
cmd_x = brand_x + shawn_w + 10 + ai_w + text_w("/os", fBrand) + 8
draw.text((cmd_x, 20), "command", font=fTitle, fill=DIM_GREEN)

# Session info right
session_txt = "OS.AI LABS // POST 5"
draw.text((W - PAD - text_w(session_txt, fSmBold), 14), session_txt, font=fSmBold, fill=CYAN)
date_txt = "2026-02-24 // shawn@gtme-os"
draw.text((W - PAD - text_w(date_txt, fSmall), 28), date_txt, font=fSmall, fill=MUTED)

# Divider
draw.line([(PAD, 44), (W - PAD, 44)], fill=BORDER, width=1)

# ── Boot Command ─────────────────────────────────────────────
cy = 58

draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "AI/os boot --mode=audit", font=fCmd, fill=BRIGHT)
cy += 22
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "loading skill-tree.config...", font=fCmd, fill=MUTED)
cy += 32

draw.line([(PAD, cy), (W - PAD, cy)], fill=BORDER, width=1)
cy += 20

# ═════════════════════════════════════════════════════════════
# MAIN CONTENT: 4 phases in 2x2 grid (taller panels for 1048 canvas)
# ═════════════════════════════════════════════════════════════

col_w = (W - PAD * 3) // 2
row_h = 350
gap = 40

# ── PHASE 1: THE TEMPTATION (top-left) ──────────────────────
px, py = PAD, cy
draw.rounded_rectangle([px, py, px + col_w, py + row_h], radius=10, fill=PANEL, outline=BORDER)

ix = px + 24
iy = py + 20

draw.text((ix, iy), "[PHASE 1]", font=fPhase, fill=RED_MUTED)
draw.text((ix + text_w("[PHASE 1]", fPhase) + 8, iy), "THE TEMPTATION", font=fPhase, fill=BRIGHT)
iy += 30

draw_glow_dot(ix + 4, iy + 6, 4, RED_MUTED)
draw.text((ix + 14, iy), "browsing external skill packs...", font=fSmall, fill=MUTED)
iy += 26

draw.text((ix, iy), "$ ls /store/skill-packs/", font=fBody, fill=GREEN)
iy += 20
draw.text((ix + 16, iy), "> frontend-design.md", font=fBody, fill=RED_MUTED)
iy += 18
draw.text((ix + 16, iy), "> canvas-design.md", font=fBody, fill=RED_MUTED)
iy += 18
draw.text((ix + 16, iy), "> seo-review.md", font=fBody, fill=RED_MUTED)
iy += 26

draw.text((ix, iy), "look:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("look:", fSmall) + 6, iy), "polished. packaged. tempting.", font=fSmall, fill=AMBER)
iy += 18
draw.text((ix, iy), "level:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("level:", fSmall) + 6, iy), "starter gear", font=fSmall, fill=RED_MUTED)
iy += 18
draw.text((ix, iy), "target:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("target:", fSmall) + 6, iy), "characters without a system", font=fSmall, fill=MUTED)
iy += 26

draw.text((ix, iy), "# throwing a level-one character", font=fSmall, fill=AMBER)
iy += 14
draw.text((ix, iy), "# into endgame content.", font=fSmall, fill=AMBER)
iy += 20
draw.text((ix, iy), "# you get killed in seconds.", font=fSmall, fill=RED_MUTED)

# ── PHASE 2: THE AUDIT (top-right) ──────────────────────────
px2 = PAD * 2 + col_w
draw.rounded_rectangle([px2, py, px2 + col_w, py + row_h], radius=10, fill=PANEL, outline=BORDER)

ix = px2 + 24
iy = py + 20

draw.text((ix, iy), "[PHASE 2]", font=fPhase, fill=AMBER)
draw.text((ix + text_w("[PHASE 2]", fPhase) + 8, iy), "THE AUDIT", font=fPhase, fill=BRIGHT)
iy += 30

draw_glow_dot(ix + 4, iy + 6, 4, AMBER)
draw.text((ix + 14, iy), "comparing external vs internal...", font=fSmall, fill=MUTED)
iy += 26

draw.text((ix, iy), "$ diff external.md internal.md", font=fBody, fill=GREEN)
iy += 22

# Side-by-side comparison lines
comparisons = [
    ("external:", "\"use modern fonts\"", RED_MUTED),
    ("internal:", "Menlo.ttc, size=28, index=1", GREEN),
    ("", "", None),
    ("external:", "\"clean layout\"", RED_MUTED),
    ("internal:", "radius=10, PANEL=(22,24,30)", GREEN),
    ("", "", None),
    ("external:", "\"good color choices\"", RED_MUTED),
    ("internal:", "GREEN=(78,195,115), 12 tokens", GREEN),
]

for label, val, color in comparisons:
    if not label:
        iy += 6
        continue
    draw.text((ix + 16, iy), label, font=fSmall, fill=MUTED)
    lw = text_w(label, fSmall)
    draw.text((ix + 16 + lw + 6, iy), val, font=fSmall, fill=color)
    iy += 17

iy += 14
draw.text((ix, iy), "conflict_risk:", font=fSmall, fill=MUTED)
bar_x = ix + text_w("conflict_risk:", fSmall) + 6
draw_progress_bar(bar_x, iy + 1, 180, 0.88, RED_MUTED, DIM_RED)
draw.text((bar_x + 186, iy), "HIGH", font=fSmall, fill=RED_MUTED)
iy += 22
draw.text((ix, iy), "# they solve problems you already solved.", font=fSmall, fill=AMBER)
iy += 14
draw.text((ix, iy), "# purple gradients don't belong in", font=fSmall, fill=AMBER)
iy += 14
draw.text((ix, iy), "#   a monospace terminal aesthetic.", font=fSmall, fill=AMBER)

# ── Arrow between top and bottom rows ────────────────────────
arrow_cy = py + row_h + gap // 2
acx = W // 2
for i in range(7):
    draw.ellipse([acx - 1, arrow_cy - 6 + i * 3, acx + 1, arrow_cy - 4 + i * 3], fill=DIM_GREEN)
draw.polygon([(acx - 6, arrow_cy + 14), (acx + 6, arrow_cy + 14), (acx, arrow_cy + 22)], fill=GREEN)

draw.text((acx + 18, arrow_cy + 6), "LEVEL UP", font=fTiny, fill=DIM_GREEN)

# ── PHASE 3: THE SYSTEM (bottom-left) ───────────────────────
py2 = py + row_h + gap
draw.rounded_rectangle([PAD, py2, PAD + col_w, py2 + row_h], radius=10, fill=PANEL, outline=BORDER)

ix = PAD + 24
iy = py2 + 20

draw.text((ix, iy), "[PHASE 3]", font=fPhase, fill=CYAN)
draw.text((ix + text_w("[PHASE 3]", fPhase) + 8, iy), "THE SYSTEM", font=fPhase, fill=BRIGHT)
iy += 30

draw_glow_dot(ix + 4, iy + 6, 4, CYAN)
draw.text((ix + 14, iy), "scanning existing skill tree...", font=fSmall, fill=MUTED)
iy += 26

draw.text((ix, iy), "$ cat skills/aios-image/SKILL.md", font=fBody, fill=GREEN)
iy += 22

tree_lines = [
    ("├── ", "palette:", "12 named RGB tokens", CYAN),
    ("├── ", "fonts:", "Menlo.ttc, 11 size variants", CYAN),
    ("├── ", "anti-patterns:", "6 explicit violations", GREEN),
    ("├── ", "layouts:", "5 content-type mappings", GREEN),
    ("├── ", "scanlines:", "CRT texture at 3px intervals", GREEN),
    ("└── ", "enforcement:", "Python scripts, not vibes", GREEN),
]

for prefix, folder, desc, color in tree_lines:
    draw.text((ix + 16, iy), prefix, font=fBody, fill=GREEN)
    pw = text_w(prefix, fBody)
    draw.text((ix + 16 + pw, iy), folder, font=fBold, fill=color)
    fw = text_w(folder, fBold)
    draw.text((ix + 16 + pw + fw + 4, iy), desc, font=fSmall, fill=MUTED)
    iy += 20

iy += 12
draw.text((ix, iy), "specificity:", font=fSmall, fill=MUTED)
bar_x = ix + text_w("specificity:", fSmall) + 6
draw_progress_bar(bar_x, iy + 1, 200, 0.95, GREEN, DIM_GREEN)
draw.text((bar_x + 206, iy), "MAX", font=fSmall, fill=GREEN)
iy += 22
draw.text((ix, iy), "# more constraints than the entire", font=fSmall, fill=DIM_GREEN)
iy += 14
draw.text((ix, iy), "#   external skill pack combined.", font=fSmall, fill=DIM_GREEN)

# ── PHASE 4: THE LESSON (bottom-right) ──────────────────────
draw.rounded_rectangle([px2, py2, px2 + col_w, py2 + row_h], radius=10, fill=PANEL, outline=GREEN, width=2)

ix = px2 + 24
iy = py2 + 20

draw.text((ix, iy), "[PHASE 4]", font=fPhase, fill=GREEN)
draw.text((ix + text_w("[PHASE 4]", fPhase) + 8, iy), "THE LESSON", font=fPhase, fill=GREEN)
check_x = ix + text_w("[PHASE 4]", fPhase) + 8 + text_w("THE LESSON", fPhase) + 10
draw.text((check_x, iy), "✓", font=fPhase, fill=GREEN)
iy += 30

draw_glow_dot(ix + 4, iy + 6, 4, GREEN)
draw.text((ix + 14, iy), "organic growth protocol active", font=fSmall, fill=GREEN)
iy += 26

draw.text((ix, iy), "$ ./level-up --organic", font=fBody, fill=GREEN)
iy += 22

steps = [
    ("build:", "one skill at a time", GREEN),
    ("constrain:", "one lesson at a time", GREEN),
    ("grow:", "from what you actually do", CYAN),
    ("never:", "from what someone packaged", MUTED),
]

for label, val, color in steps:
    draw.text((ix + 16, iy), label, font=fSmall, fill=MUTED)
    lw = text_w(label, fSmall)
    draw.text((ix + 16 + lw + 6, iy), val, font=fSmall, fill=color)
    iy += 18

iy += 14
draw.text((ix, iy), "your repo", font=fSmall, fill=MUTED)
draw.text((ix + text_w("your repo", fSmall) + 4, iy), "=", font=fSmall, fill=DIM_GREEN)
draw.text((ix + text_w("your repo", fSmall) + 4 + text_w("=", fSmall) + 4, iy), "THE SYSTEM", font=fSmBold, fill=GREEN)
iy += 18
draw.text((ix, iy), "external skills", font=fSmall, fill=MUTED)
draw.text((ix + text_w("external skills", fSmall) + 4, iy), "=", font=fSmall, fill=DIM_GREEN)
draw.text((ix + text_w("external skills", fSmall) + 4 + text_w("=", fSmall) + 4, iy), "starter gear", font=fSmBold, fill=RED_MUTED)
iy += 28

# Thesis quote — centered in vertical band for social card visibility
draw.text((ix, iy), "\"the character you leveled yourself", font=fQuote, fill=GREEN)
iy += 20
draw.text((ix, iy), " is always stronger than the one", font=fQuote, fill=GREEN)
iy += 20
draw.text((ix, iy), " you bought.\"", font=fQuote, fill=GREEN)

# ── Horizontal flow arrows ───────────────────────────────────
# Phase 1 → Phase 2 (top row)
arr_y_top = py + row_h // 2
arr_x1 = PAD + col_w + 4
arr_x2 = px2 - 4
for i in range(4):
    dot_x = arr_x1 + (arr_x2 - arr_x1) * (i + 1) / 5
    draw.ellipse([dot_x - 1.5, arr_y_top - 1.5, dot_x + 1.5, arr_y_top + 1.5], fill=DIM_GREEN)
draw.polygon([(arr_x2 - 6, arr_y_top - 4), (arr_x2 - 6, arr_y_top + 4), (arr_x2, arr_y_top)], fill=AMBER)

# Phase 3 → Phase 4 (bottom row)
arr_y_bot = py2 + row_h // 2
for i in range(4):
    dot_x = arr_x1 + (arr_x2 - arr_x1) * (i + 1) / 5
    draw.ellipse([dot_x - 1.5, arr_y_bot - 1.5, dot_x + 1.5, arr_y_bot + 1.5], fill=DIM_GREEN)
draw.polygon([(arr_x2 - 6, arr_y_bot - 4), (arr_x2 - 6, arr_y_bot + 4), (arr_x2, arr_y_bot)], fill=GREEN)

# ── Bottom bar ───────────────────────────────────────────────
bot_y = py2 + row_h + 24
draw.line([(PAD, bot_y), (W - PAD, bot_y)], fill=BORDER, width=1)
bot_y += 14

draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "AI/os audit complete.", font=fCmd, fill=GREEN)
bot_y += 22
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "start at level one. or don't start at all.", font=fCmd, fill=BRIGHT)

# Series info right
series_txt = "OS.AI LABS // start at level one"
draw.text((W - PAD - text_w(series_txt, fSmBold), bot_y - 10),
          series_txt, font=fSmBold, fill=DIM_GREEN)

# Footer
footer = "built with Cursor + Claude Code  //  shawn ⚡ the gtme alchemist"
fw = text_w(footer, fFoot)
draw.text(((W - fw) / 2, H - 28), footer, font=fFoot, fill=MUTED)

# ── Corner accents ───────────────────────────────────────────
cr = W - PAD
draw.line([(cr - 16, PAD - 12), (cr, PAD - 12)], fill=DIM_GREEN, width=1)
draw.line([(cr, PAD - 12), (cr, PAD + 4)], fill=DIM_GREEN, width=1)

draw.line([(PAD, H - PAD), (PAD, H - PAD - 16)], fill=DIM_GREEN, width=1)
draw.line([(PAD, H - PAD), (PAD + 16, H - PAD)], fill=DIM_GREEN, width=1)

# ── Save ─────────────────────────────────────────────────────
out_dir = os.path.dirname(__file__)
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "start-at-level-one.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {W} x {H} px (Substack article – 14:10 optimized)")
