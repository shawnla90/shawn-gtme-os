#!/usr/bin/env python3
"""
Substack article header image for Post 2: The Awakening.
Terminal-style boot sequence showing the identity shift from
"tool guy" to "system builder" — told as an AI/os boot process.

Black + green terminal aesthetic matching the brand theme.
"""

import math, os
from PIL import Image, ImageDraw, ImageFont

# ── Design System (matches existing brand) ───────────────────
BG        = (12, 13, 17)
PANEL     = (22, 24, 30)
BORDER    = (40, 44, 54)
GREEN     = (78, 195, 115)
TXT       = (185, 195, 210)
BRIGHT    = (230, 236, 245)
MUTED     = (100, 110, 128)
AMBER     = (210, 165, 60)
CYAN      = (80, 190, 210)
DIM_GREEN = (50, 130, 75)
RED_MUTED = (180, 80, 80)
DIM_RED   = (100, 50, 50)
DARK_GREEN = (30, 85, 45)

# ── Fonts ─────────────────────────────────────────────────────
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

# ── Canvas (Substack header: wide landscape) ─────────────────
W, H = 1456, 816
img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

PAD = 40

# ── Helpers ───────────────────────────────────────────────────
def text_w(text, font):
    return draw.textlength(text, font=font)

def draw_scanline(y, alpha=12):
    """Subtle horizontal scanline for CRT feel."""
    for x in range(0, W, 2):
        draw.point((x, y), fill=(78, 195, 115, alpha))

def draw_progress_bar(x, y, w, fill_pct, color, bg_color=BORDER):
    """Draw a terminal-style progress bar."""
    bar_h = 10
    draw.rectangle([x, y, x + w, y + bar_h], fill=bg_color)
    fill_w = int(w * fill_pct)
    if fill_w > 0:
        draw.rectangle([x, y, x + fill_w, y + bar_h], fill=color)

def draw_glow_dot(x, y, r, color):
    """Draw a dot with a subtle glow."""
    # Outer glow
    glow = tuple(max(0, c - 40) for c in color)
    draw.ellipse([x - r - 2, y - r - 2, x + r + 2, y + r + 2], fill=glow)
    # Core
    draw.ellipse([x - r, y - r, x + r, y + r], fill=color)

# ── Subtle scanlines across entire image ─────────────────────
for sy in range(0, H, 3):
    if sy % 6 == 0:
        draw.line([(0, sy), (W, sy)], fill=(18, 20, 24), width=1)

# ── Top Bar: AI/os Branding ──────────────────────────────────
# Terminal window dots
dot_y = 18
for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
    draw.ellipse([PAD + i * 22, dot_y, PAD + 12 + i * 22, dot_y + 12], fill=c)

# AI/os branding
brand_x = PAD + 80
draw.text((brand_x, 12), "AI", font=fBrand, fill=GREEN)
slash_x = brand_x + text_w("AI", fBrand)
draw.text((slash_x, 12), "/os", font=fBrand, fill=BRIGHT)
cmd_x = slash_x + text_w("/os", fBrand) + 8
draw.text((cmd_x, 20), "command", font=fTitle, fill=DIM_GREEN)

# Session info on right
session_txt = "OS.AI LABS // POST 2"
draw.text((W - PAD - text_w(session_txt, fSmBold), 14), session_txt, font=fSmBold, fill=CYAN)
date_txt = "2026-02-11 // shawn@gtme-os"
draw.text((W - PAD - text_w(date_txt, fSmall), 28), date_txt, font=fSmall, fill=MUTED)

# Divider
draw.line([(PAD, 44), (W - PAD, 44)], fill=BORDER, width=1)

# ── Boot Command ─────────────────────────────────────────────
cy = 58

draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "AI/os boot --mode=awakening", font=fCmd, fill=BRIGHT)
cy += 22
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "loading identity.config...", font=fCmd, fill=MUTED)
cy += 28

draw.line([(PAD, cy), (W - PAD, cy)], fill=BORDER, width=1)
cy += 16

# ═══════════════════════════════════════════════════════════════
# MAIN CONTENT: 4 phases in 2x2 grid layout
# ═══════════════════════════════════════════════════════════════

col_w = (W - PAD * 3) // 2
row_h = 260
gap = 20

# ── PHASE 1: THE LABEL (top-left) ───────────────────────────
px, py = PAD, cy
draw.rounded_rectangle([px, py, px + col_w, py + row_h], radius=10, fill=PANEL, outline=BORDER)

ix = px + 20
iy = py + 16

# Phase header
draw.text((ix, iy), "[PHASE 1]", font=fPhase, fill=RED_MUTED)
iy_after = ix + text_w("[PHASE 1]", fPhase) + 8
draw.text((iy_after, iy), "THE LABEL", font=fPhase, fill=BRIGHT)
iy += 26

# Status indicator - red dot
draw_glow_dot(ix + 4, iy + 6, 4, RED_MUTED)
draw.text((ix + 14, iy), "identity locked to external tool", font=fSmall, fill=MUTED)
iy += 22

draw.text((ix, iy), "$ whoami", font=fBody, fill=GREEN)
iy += 18
draw.text((ix + 16, iy), "> the_clay_guy", font=fBody, fill=RED_MUTED)
iy += 22

draw.text((ix, iy), "foundation:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("foundation:", fSmall) + 6, iy), "someone_else.platform", font=fSmall, fill=RED_MUTED)
iy += 16
draw.text((ix, iy), "risk_level: ", font=fSmall, fill=MUTED)
# Progress bar for risk
draw_progress_bar(ix + text_w("risk_level: ", fSmall) + 4, iy + 1, 180, 0.92, RED_MUTED, DIM_RED)
draw.text((ix + text_w("risk_level: ", fSmall) + 190, iy), "CRITICAL", font=fSmall, fill=RED_MUTED)
iy += 18

draw.text((ix, iy), "status:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("status:", fSmall) + 6, iy), "one acquisition from rebuild", font=fSmall, fill=RED_MUTED)
iy += 18
draw.text((ix, iy), "ceiling:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("ceiling:", fSmall) + 6, iy), "filtering all ideas thru one tool", font=fSmall, fill=MUTED)
iy += 22

# The key line
draw.text((ix, iy), "# building ceilings. calling them floors.", font=fSmall, fill=AMBER)

# ── PHASE 2: THE FEAR (top-right) ───────────────────────────
px2 = PAD * 2 + col_w
draw.rounded_rectangle([px2, py, px2 + col_w, py + row_h], radius=10, fill=PANEL, outline=BORDER)

ix = px2 + 20
iy = py + 16

draw.text((ix, iy), "[PHASE 2]", font=fPhase, fill=AMBER)
draw.text((ix + text_w("[PHASE 2]", fPhase) + 8, iy), "THE FEAR", font=fPhase, fill=BRIGHT)
iy += 26

draw_glow_dot(ix + 4, iy + 6, 4, AMBER)
draw.text((ix + 14, iy), "risk assessment running...", font=fSmall, fill=MUTED)
iy += 22

draw.text((ix, iy), "$ risk-audit --identity", font=fBody, fill=GREEN)
iy += 20

threats = [
    ("acquisition_risk:", "rebuild entire positioning", RED_MUTED),
    ("api_change_risk:", "content stops working", RED_MUTED),
    ("competitor_risk:", "tool becomes yesterday", RED_MUTED),
    ("creative_risk:", "ideas filtered thru one lens", AMBER),
]

for label, val, color in threats:
    draw.text((ix + 16, iy), label, font=fSmall, fill=MUTED)
    lw = text_w(label, fSmall)
    draw.text((ix + 16 + lw + 6, iy), val, font=fSmall, fill=color)
    iy += 16

iy += 10
draw.text((ix, iy), "diagnosis:", font=fSmall, fill=MUTED)
iy += 16
draw.text((ix + 8, iy), "\"the system was me.", font=fSmBold, fill=AMBER)
iy += 14
draw.text((ix + 8, iy), " and that was the problem.\"", font=fSmBold, fill=AMBER)

# ── Arrow between top and bottom rows ────────────────────────
arrow_cy = py + row_h + gap // 2
# Central downward arrow
acx = W // 2
for i in range(5):
    draw.ellipse([acx - 1, arrow_cy - 4 + i * 3, acx + 1, arrow_cy - 2 + i * 3], fill=DIM_GREEN)
draw.polygon([(acx - 5, arrow_cy + 10), (acx + 5, arrow_cy + 10), (acx, arrow_cy + 16)], fill=GREEN)

# Label
draw.text((acx + 16, arrow_cy + 2), "AWAKENING", font=fTiny, fill=DIM_GREEN)

# ── PHASE 3: THE SHIFT (bottom-left) ────────────────────────
py2 = py + row_h + gap
draw.rounded_rectangle([PAD, py2, PAD + col_w, py2 + row_h], radius=10, fill=PANEL, outline=BORDER)

ix = PAD + 20
iy = py2 + 16

draw.text((ix, iy), "[PHASE 3]", font=fPhase, fill=CYAN)
draw.text((ix + text_w("[PHASE 3]", fPhase) + 8, iy), "THE SHIFT", font=fPhase, fill=BRIGHT)
iy += 26

draw_glow_dot(ix + 4, iy + 6, 4, CYAN)
draw.text((ix + 14, iy), "externalizing system from memory...", font=fSmall, fill=MUTED)
iy += 22

draw.text((ix, iy), "$ git init brain/ && commit -m 'extract'", font=fBody, fill=GREEN)
iy += 20

tree_lines = [
    ("├── ", "voice/", "core-voice.md, anti-slop.md", GREEN),
    ("├── ", "skills/", "23 active automations", CYAN),
    ("├── ", "playbooks/", "6 platform strategies", GREEN),
    ("├── ", "pipeline/", "draft → published", GREEN),
    ("└── ", "mcps/", "15+ tool connections", CYAN),
]

for prefix, folder, desc, color in tree_lines:
    draw.text((ix + 16, iy), prefix, font=fBody, fill=GREEN)
    pw = text_w(prefix, fBody)
    draw.text((ix + 16 + pw, iy), folder, font=fBold, fill=color)
    fw = text_w(folder, fBold)
    draw.text((ix + 16 + pw + fw + 4, iy), desc, font=fSmall, fill=MUTED)
    iy += 18

iy += 10
draw.text((ix, iy), "memory_dependency:", font=fSmall, fill=MUTED)
# Decreasing progress bar
bar_x = ix + text_w("memory_dependency:", fSmall) + 6
draw_progress_bar(bar_x, iy + 1, 180, 0.18, GREEN, DIM_GREEN)
draw.text((bar_x + 186, iy), "LOW", font=fSmall, fill=GREEN)
iy += 18
draw.text((ix, iy), "# the repo is the container.", font=fSmall, fill=DIM_GREEN)
iy += 13
draw.text((ix, iy), "# having a container changed everything.", font=fSmall, fill=DIM_GREEN)

# ── PHASE 4: THE AWAKENING (bottom-right) ───────────────────
draw.rounded_rectangle([px2, py2, px2 + col_w, py2 + row_h], radius=10, fill=PANEL, outline=GREEN, width=2)

ix = px2 + 20
iy = py2 + 16

draw.text((ix, iy), "[PHASE 4]", font=fPhase, fill=GREEN)
draw.text((ix + text_w("[PHASE 4]", fPhase) + 8, iy), "THE AWAKENING", font=fPhase, fill=GREEN)

# Checkmark
check_x = ix + text_w("[PHASE 4]", fPhase) + 8 + text_w("THE AWAKENING", fPhase) + 10
draw.text((check_x, iy), "✓", font=fPhase, fill=GREEN)
iy += 26

draw_glow_dot(ix + 4, iy + 6, 4, GREEN)
draw.text((ix + 14, iy), "identity reconfigured", font=fSmall, fill=GREEN)
iy += 22

draw.text((ix, iy), "$ whoami", font=fBody, fill=GREEN)
iy += 18
draw.text((ix + 16, iy), "> the_system_builder", font=fBody, fill=GREEN)
iy += 22

# Plugin list
plugins = ["clay", "instantly", "cursor", "hubspot"]
for p in plugins:
    draw.text((ix, iy), f"  {p}", font=fSmall, fill=MUTED)
    pw = text_w(f"  {p}", fSmall)
    draw.text((ix + pw + 4, iy), "=", font=fSmall, fill=DIM_GREEN)
    draw.text((ix + pw + 4 + text_w("=", fSmall) + 4, iy), "plugin", font=fSmall, fill=CYAN)
    iy += 14

iy += 6
draw.text((ix, iy), "  system", font=fSmall, fill=BRIGHT)
draw.text((ix + text_w("  system", fSmall) + 4, iy), "=", font=fSmall, fill=DIM_GREEN)
draw.text((ix + text_w("  system", fSmall) + 4 + text_w("=", fSmall) + 4, iy), "YOU", font=fSmBold, fill=GREEN)
iy += 22

# The thesis quote — the key line of the post
draw.text((ix, iy), "\"your identity is not your tool.", font=fQuote, fill=GREEN)
iy += 18
draw.text((ix, iy), " your system is not your memory.\"", font=fQuote, fill=GREEN)

# ── Connecting flow arrows between phases ────────────────────
# Phase 1 → Phase 2 (horizontal arrow, top row)
arr_y_top = py + row_h // 2
arr_x1 = PAD + col_w + 4
arr_x2 = px2 - 4
for i in range(4):
    dot_x = arr_x1 + (arr_x2 - arr_x1) * (i + 1) / 5
    draw.ellipse([dot_x - 1.5, arr_y_top - 1.5, dot_x + 1.5, arr_y_top + 1.5], fill=DIM_GREEN)
draw.polygon([(arr_x2 - 6, arr_y_top - 4), (arr_x2 - 6, arr_y_top + 4), (arr_x2, arr_y_top)], fill=AMBER)

# Phase 3 → Phase 4 (horizontal arrow, bottom row)
arr_y_bot = py2 + row_h // 2
for i in range(4):
    dot_x = arr_x1 + (arr_x2 - arr_x1) * (i + 1) / 5
    draw.ellipse([dot_x - 1.5, arr_y_bot - 1.5, dot_x + 1.5, arr_y_bot + 1.5], fill=DIM_GREEN)
draw.polygon([(arr_x2 - 6, arr_y_bot - 4), (arr_x2 - 6, arr_y_bot + 4), (arr_x2, arr_y_bot)], fill=GREEN)

# ── Bottom bar ───────────────────────────────────────────────
bot_y = py2 + row_h + 16
draw.line([(PAD, bot_y), (W - PAD, bot_y)], fill=BORDER, width=1)
bot_y += 10

# Boot complete message
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "AI/os awakening complete.", font=fCmd, fill=GREEN)
bot_y += 20
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "the lab is open.", font=fCmd, fill=BRIGHT)

# Series info on right
draw.text((W - PAD - text_w("OS.AI LABS // the awakening", fSmBold), bot_y - 10),
          "OS.AI LABS // the awakening", font=fSmBold, fill=DIM_GREEN)

# Footer
footer = "built with Cursor + Claude Code  //  shawn ⚡ the gtme alchemist"
fw = text_w(footer, fFoot)
draw.text(((W - fw) / 2, H - 22), footer, font=fFoot, fill=MUTED)

# ── Subtle corner accents (terminal window feel) ─────────────
# Top-right corner bracket
cr = W - PAD
draw.line([(cr - 16, PAD - 12), (cr, PAD - 12)], fill=DIM_GREEN, width=1)
draw.line([(cr, PAD - 12), (cr, PAD + 4)], fill=DIM_GREEN, width=1)

# Bottom-left corner bracket
draw.line([(PAD, H - PAD), (PAD, H - PAD - 16)], fill=DIM_GREEN, width=1)
draw.line([(PAD, H - PAD), (PAD + 16, H - PAD)], fill=DIM_GREEN, width=1)

# ── Save ──────────────────────────────────────────────────────
out_dir = os.path.dirname(__file__)
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "identity-awakening.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {W} x {H} px (Substack header)")
