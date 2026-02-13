#!/usr/bin/env python3
"""
Split comparison image for Substack launch cross-promo.
Left: "what most people build" — scattered, template-dependent.
Right: "what this gives you" — structured, identity-first, MCP-wired.
LinkedIn landscape (1200x720).
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ── Dimensions (Landscape for LinkedIn) ─────────────────────────────
WIDTH  = 1200
HEIGHT = 540
PAD    = 24
GAP    = 18

# ── Palette ─────────────────────────────────────────────────────────
BG      = (12, 13, 17)
PANEL   = (22, 24, 30)
BORDER  = (40, 44, 54)
GREEN   = (78, 195, 115)
TXT     = (185, 195, 210)
BRIGHT  = (230, 236, 245)
MUTED   = (100, 110, 128)
AMBER   = (210, 165, 60)
CYAN    = (80, 190, 210)
DIM_GREEN = (50, 130, 75)
RED_MUTED = (180, 80, 80)
DIM_RED   = (100, 50, 50)

# ── Fonts ───────────────────────────────────────────────────────────
MENLO = "/System/Library/Fonts/Menlo.ttc"

fTitle   = ImageFont.truetype(MENLO, 22, index=1)
fSub     = ImageFont.truetype(MENLO, 13, index=1)
fBody    = ImageFont.truetype(MENLO, 14, index=0)
fAnnot   = ImageFont.truetype(MENLO, 11, index=0)
fFoot    = ImageFont.truetype(MENLO, 11, index=0)
fLabel   = ImageFont.truetype(MENLO, 16, index=1)

img  = Image.new("RGB", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# ── Title ───────────────────────────────────────────────────────────
draw.text((PAD, PAD), "your system ", font=fTitle, fill=BRIGHT)
w1 = draw.textlength("your system ", font=fTitle)
draw.text((PAD + w1, PAD), "vs. everyone else's templates", font=fTitle, fill=GREEN)
draw.text((PAD, PAD + 28), "one is built on you. the other is built on someone else's voice.", font=fAnnot, fill=MUTED)

TITLE_H = 62
col_w = (WIDTH - PAD * 2 - GAP) // 2
panel_h = HEIGHT - TITLE_H - PAD * 2 - 30  # room for footer

# ── Left Panel: What Most People Build ─────────────────────────────
lx = PAD
ly = PAD + TITLE_H
draw.rounded_rectangle([lx, ly, lx + col_w, ly + panel_h], radius=10, fill=PANEL, outline=BORDER)

ix = lx + 16
iy = ly + 16

draw.text((ix, iy), "WHAT MOST PEOPLE BUILD", font=fLabel, fill=RED_MUTED)
iy += 26

items_left = [
    ("x", "someone else's prompt library", RED_MUTED),
    ("x", "generic voice (sounds like everyone)", RED_MUTED),
    ("x", "manual copy-paste between tools", RED_MUTED),
    ("x", "no version control on content", RED_MUTED),
    ("x", "breaks when the tool changes", RED_MUTED),
    ("x", "one platform, maybe two", RED_MUTED),
    ("x", "content only (no GTM wiring)", RED_MUTED),
    ("x", "templates trained on other people", RED_MUTED),
]

for marker, text, color in items_left:
    draw.text((ix, iy), marker, font=fBody, fill=DIM_RED)
    draw.text((ix + 20, iy), text, font=fBody, fill=MUTED)
    iy += 22

# scattered tools illustration
iy += 14
draw.text((ix, iy), "scattered tools:", font=fAnnot, fill=DIM_RED)
iy += 16
scattered = ["ChatGPT tab", "Notion doc", "Google Doc", "Canva", "Buffer", "random prompts"]
cx = ix
for tool in scattered:
    tw = draw.textlength(tool, font=fAnnot)
    if cx + tw + 12 > lx + col_w - 16:
        iy += 18
        cx = ix
    draw.rounded_rectangle([cx, iy, cx + tw + 10, iy + 16], radius=4, fill=BG, outline=DIM_RED)
    draw.text((cx + 5, iy + 2), tool, font=fAnnot, fill=MUTED)
    cx += tw + 16

iy += 34
draw.text((ix, iy), "no system. no voice. no connection.", font=fAnnot, fill=RED_MUTED)

# ── Right Panel: What This Gives You ───────────────────────────────
rx = PAD + col_w + GAP
ry = PAD + TITLE_H
draw.rounded_rectangle([rx, ry, rx + col_w, ry + panel_h], radius=10, fill=PANEL, outline=BORDER)

ix = rx + 16
iy = ry + 16

draw.text((ix, iy), "WHAT THIS GIVES YOU", font=fLabel, fill=GREEN)
iy += 26

items_right = [
    ("→", "voice DNA extracted from YOU", GREEN),
    ("→", "platform playbooks (LI, X, TT, Sub)", GREEN),
    ("→", "23 skills automating the reps", GREEN),
    ("→", "15+ MCPs wiring every tool", CYAN),
    ("→", "git version control on everything", GREEN),
    ("→", "6 platforms from one repo", AMBER),
    ("→", "content + outbound + ads + ops", AMBER),
    ("→", "tools are plugins. system survives.", GREEN),
]

for marker, text, color in items_right:
    draw.text((ix, iy), marker, font=fBody, fill=GREEN)
    draw.text((ix + 24, iy), text, font=fBody, fill=TXT)
    iy += 22

# structured tiers illustration
iy += 14
draw.text((ix, iy), "structured tiers:", font=fAnnot, fill=DIM_GREEN)
iy += 16

tiers = [
    ("tier 1", "voice DNA", GREEN),
    ("tier 2", "playbooks", GREEN),
    ("tier 3", "content ops", GREEN),
    ("skills", "23 active", CYAN),
    ("MCPs", "15+ connected", CYAN),
]

cx = ix
for tier_name, tier_desc, color in tiers:
    label = f"{tier_name}: {tier_desc}"
    tw = draw.textlength(label, font=fAnnot)
    if cx + tw + 12 > rx + col_w - 16:
        iy += 18
        cx = ix
    draw.rounded_rectangle([cx, iy, cx + tw + 10, iy + 16], radius=4, fill=BG, outline=DIM_GREEN)
    draw.text((cx + 5, iy + 2), label, font=fAnnot, fill=color)
    cx += tw + 16

iy += 34
draw.text((ix, iy), "one repo. your voice. every platform.", font=fAnnot, fill=GREEN)

# ── Center Divider ──────────────────────────────────────────────────
div_x = PAD + col_w + GAP // 2
div_top = PAD + TITLE_H + 20
div_bot = PAD + TITLE_H + panel_h - 20
draw.line([(div_x, div_top), (div_x, div_bot)], fill=BORDER, width=1)

# "vs" label centered on divider
vs_w = draw.textlength("vs", font=fSub)
vs_y = (div_top + div_bot) // 2 - 8
draw.rounded_rectangle([div_x - vs_w/2 - 8, vs_y - 2, div_x + vs_w/2 + 8, vs_y + 18], radius=6, fill=BG, outline=BORDER)
draw.text((div_x - vs_w/2, vs_y), "vs", font=fSub, fill=MUTED)

# ── Footer ──────────────────────────────────────────────────────────
ftxt = "built with Cursor + Claude Code"
fw   = draw.textlength(ftxt, font=fFoot)
draw.text(((WIDTH - fw) / 2, HEIGHT - 28), ftxt, font=fFoot, fill=MUTED)

# ── Save ────────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(__file__), "substack-crosspromo-split.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {WIDTH} x {HEIGHT} px (Landscape)")
