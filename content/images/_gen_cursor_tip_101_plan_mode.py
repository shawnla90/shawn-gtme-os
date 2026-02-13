#!/usr/bin/env python3
"""
X post image for Cursor Tip 101: Plan Mode First.
Matrix-rain numerical background with centered terminal panel.
Dark black canvas, falling green digits, monospace branding.

Canonical PI template for the "cursor tips 101" series.
"""

import math, os, random
from PIL import Image, ImageDraw, ImageFont

random.seed(42)  # reproducible rain

# ── Design System ────────────────────────────────────────────
BG         = (6, 7, 10)         # deeper black for matrix feel
PANEL      = (14, 16, 22)       # dark panel fill
BORDER     = (35, 40, 50)       # subtle panel outline
GREEN      = (78, 195, 115)     # primary accent
TXT        = (185, 195, 210)    # body text
BRIGHT     = (230, 236, 245)    # titles, emphasis
MUTED      = (100, 110, 128)    # annotations, secondary
DIM_GREEN  = (50, 130, 75)      # background green
DARK_GREEN = (30, 85, 45)       # very subtle green
FAINT_GREEN = (18, 55, 30)      # barely visible rain chars
GHOST_GREEN = (12, 38, 22)      # almost invisible rain chars

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

# Matrix rain fonts
fRain    = ImageFont.truetype(MENLO, 13, index=0)
fRainSm  = ImageFont.truetype(MENLO, 10, index=0)

# Hero number font
fHero    = ImageFont.truetype(MENLO, 72, index=1)
fSeries  = ImageFont.truetype(MENLO, 22, index=1)
fTip     = ImageFont.truetype(MENLO, 16, index=1)
fTipBody = ImageFont.truetype(MENLO, 15, index=0)

# ── Canvas (X post: 16:9 ish) ───────────────────────────────
W, H = 1200, 675
img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

PAD = 36

# ── Helpers ──────────────────────────────────────────────────
def text_w(text, font):
    return draw.textlength(text, font=font)

def draw_glow_dot(x, y, r, color):
    glow = tuple(max(0, c - 40) for c in color)
    draw.ellipse([x - r - 2, y - r - 2, x + r + 2, y + r + 2], fill=glow)
    draw.ellipse([x - r, y - r, x + r, y + r], fill=color)

def center_text(text, font, color, cy):
    tw = draw.textlength(text, font=font)
    draw.text(((W - tw) / 2, cy), text, font=font, fill=color)

# ── LAYER 1: Matrix Rain Background ─────────────────────────
# Columns of falling numbers/chars across the whole image
col_spacing = 18
num_cols = W // col_spacing + 1

# Characters: mostly numbers, some operators, some hex
rain_chars = "0123456789" * 4 + "ABCDEF" + "+-=<>|:" + "01" * 6

for col in range(num_cols):
    cx = col * col_spacing + random.randint(-2, 2)
    # Each column has a random "lead" position and length
    lead_y = random.randint(-100, H + 100)
    trail_len = random.randint(8, 28)
    
    for row in range(0, H, 16):
        char = random.choice(rain_chars)
        dist_from_lead = abs(row - lead_y)
        
        if dist_from_lead < trail_len * 16:
            # Brightness fades with distance from lead
            fade = max(0, 1.0 - dist_from_lead / (trail_len * 16))
            
            if fade > 0.7:
                color = GREEN  # brightest near lead
                font = fRain
            elif fade > 0.4:
                color = DIM_GREEN
                font = fRain
            elif fade > 0.2:
                color = FAINT_GREEN
                font = fRainSm
            else:
                color = GHOST_GREEN
                font = fRainSm
            
            # Add some randomness to which chars appear
            if random.random() < 0.6:
                draw.text((cx, row), char, font=font, fill=color)
        else:
            # Very faint background digits
            if random.random() < 0.12:
                draw.text((cx, row), random.choice("01234567890"), 
                          font=fRainSm, fill=GHOST_GREEN)

# ── LAYER 2: Subtle scanlines ───────────────────────────────
for sy in range(0, H, 3):
    if sy % 6 == 0:
        draw.line([(0, sy), (W, sy)], fill=(10, 12, 16), width=1)

# ── LAYER 3: Central darkened zone for readability ───────────
# Gradient fade from edges to center (darken center area)
center_panel_x = 120
center_panel_y = 60
center_panel_w = W - 240
center_panel_h = H - 120

# Draw semi-transparent dark overlay in center
# We'll use multiple rectangles with slight opacity simulation
for i in range(40):
    alpha_pct = 0.85 - (i * 0.01)
    inset = i * 3
    x1 = center_panel_x + inset
    y1 = center_panel_y + inset
    x2 = center_panel_x + center_panel_w - inset
    y2 = center_panel_y + center_panel_h - inset
    if x1 >= x2 or y1 >= y2:
        break
    # Blend toward BG
    r = int(BG[0] * alpha_pct + 0 * (1 - alpha_pct))
    g = int(BG[1] * alpha_pct + 0 * (1 - alpha_pct))
    b = int(BG[2] * alpha_pct + 0 * (1 - alpha_pct))
    if i < 5:
        draw.rounded_rectangle([x1, y1, x2, y2], radius=16 - i, 
                               fill=None, outline=(r + 8, g + 10, b + 6), width=1)

# Solid dark center
draw.rounded_rectangle(
    [center_panel_x + 20, center_panel_y + 20,
     center_panel_x + center_panel_w - 20, center_panel_y + center_panel_h - 20],
    radius=12, fill=(8, 9, 13), outline=None
)

# ── LAYER 4: Top Bar ────────────────────────────────────────
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
session_txt = "CURSOR TIPS // 101"
draw.text((W - PAD - text_w(session_txt, fSmBold), 14), 
          session_txt, font=fSmBold, fill=GREEN)
date_txt = "2026-02-11 // shawn@gtme-os"
draw.text((W - PAD - text_w(date_txt, fSmall), 28), 
          date_txt, font=fSmall, fill=MUTED)

# Divider
draw.line([(PAD, 44), (W - PAD, 44)], fill=BORDER, width=1)

# ── LAYER 5: Boot Command ───────────────────────────────────
cy = 56
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "AI/os boot --mode=plan", font=fCmd, fill=BRIGHT)
cy += 20
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "loading cursor.tips.101...", font=fCmd, fill=MUTED)

# ── LAYER 6: Central Content Panel ──────────────────────────
panel_x = 160
panel_y = 120
panel_w = W - 320
panel_h = 400
draw.rounded_rectangle(
    [panel_x, panel_y, panel_x + panel_w, panel_y + panel_h],
    radius=10, fill=PANEL, outline=GREEN, width=2
)

# ── Inside panel: Series branding ────────────────────────────
iy = panel_y + 28

# "cursor tip" label top
series_label = "cursor tip"
slw = text_w(series_label, fSeries)
draw.text(((W - slw - text_w(" 101", fHero) * 0.55) / 2, iy), 
          series_label, font=fSeries, fill=MUTED)

# "101" hero number
iy += 30
num_str = "101"
nw = text_w(num_str, fHero)
nx = (W - nw) / 2

# Glow behind the number
for offset in range(8, 0, -1):
    glow_alpha = max(0, 20 - offset * 2)
    glow_color = (
        int(GREEN[0] * glow_alpha / 60),
        int(GREEN[1] * glow_alpha / 60),
        int(GREEN[2] * glow_alpha / 60)
    )
    draw.text((nx - offset/2, iy - offset/2), num_str, font=fHero, fill=glow_color)

draw.text((nx, iy), num_str, font=fHero, fill=GREEN)

# Decorative line under 101
iy += 82
line_w = 300
lx = (W - line_w) / 2
draw.line([(lx, iy), (lx + line_w, iy)], fill=BORDER, width=1)
# Green accent in center of line
draw.line([(W/2 - 40, iy), (W/2 + 40, iy)], fill=DIM_GREEN, width=2)

# ── The tip command ──────────────────────────────────────────
iy += 20
cmd_line = "$ plan-mode --before-execute"
clw = text_w(cmd_line, fTip)
cmd_draw_x = (W - clw) / 2
draw.text((cmd_draw_x, iy), "$ ", font=fTip, fill=GREEN)
draw.text((cmd_draw_x + text_w("$ ", fTip), iy), "plan-mode --before-execute", font=fTip, fill=BRIGHT)

# ── The actual tip text (hero quote) ─────────────────────────
iy += 40

line1 = "if you don't have a slash command"
line2 = "for it yet, start in plan mode."
line3 = "that's the rule."

l1w = text_w(line1, fQuote)
l2w = text_w(line2, fQuote)
l3w = text_w(line3, fTip)

draw.text(((W - l1w) / 2, iy), line1, font=fQuote, fill=TXT)
iy += 22
draw.text(((W - l2w) / 2, iy), line2, font=fQuote, fill=TXT)
iy += 32
draw.text(((W - l3w) / 2, iy), line3, font=fTip, fill=GREEN)

# ── Output/result block ─────────────────────────────────────
iy += 40
result_lines = [
    ("> ", "no accidental edits.", MUTED),
    ("> ", "no burned context.", MUTED),
    ("> ", "clean blueprint first.", GREEN),
]

for prefix, txt, color in result_lines:
    total_w = text_w(prefix + txt, fSmall)
    rx = (W - total_w) / 2
    draw.text((rx, iy), prefix, font=fSmall, fill=DIM_GREEN)
    draw.text((rx + text_w(prefix, fSmall), iy), txt, font=fSmall, fill=color)
    iy += 16

# ── Bottom bar ──────────────────────────────────────────────
bot_y = H - 70
draw.line([(PAD, bot_y), (W - PAD, bot_y)], fill=BORDER, width=1)
bot_y += 10

# Boot complete
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "AI/os plan complete.", font=fCmd, fill=GREEN)
bot_y += 18
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "execute with confidence.", font=fCmd, fill=BRIGHT)

# Series label bottom-right
series_r = "CURSOR TIPS // plan mode"
draw.text((W - PAD - text_w(series_r, fSmBold), H - 60), 
          series_r, font=fSmBold, fill=DIM_GREEN)

# Footer
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
out = os.path.join(out_dir, "cursor-tip-101-plan-mode.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved -> {out}")
print(f"  {W} x {H} px (X post image)")
