#!/usr/bin/env python3
"""
X (Twitter) image for Build Weekend.
Compact terminal card: Shawn AI/os is now live.
Monorepo. Turborepo. Three websites. One push.

Canvas: 1200 x 675 (16:9, standard X timeline card)
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
DARK_GREEN = (30, 85, 45)

# ── Fonts ────────────────────────────────────────────────────
MENLO = "/System/Library/Fonts/Menlo.ttc"

fBrand   = ImageFont.truetype(MENLO, 24, index=1)
fTitle   = ImageFont.truetype(MENLO, 14, index=1)
fCmd     = ImageFont.truetype(MENLO, 13, index=0)
fBody    = ImageFont.truetype(MENLO, 12, index=0)
fBold    = ImageFont.truetype(MENLO, 12, index=1)
fSmall   = ImageFont.truetype(MENLO, 10, index=0)
fSmBold  = ImageFont.truetype(MENLO, 10, index=1)
fTiny    = ImageFont.truetype(MENLO, 9, index=0)
fFoot    = ImageFont.truetype(MENLO, 9, index=0)
fHero    = ImageFont.truetype(MENLO, 28, index=1)
fSite    = ImageFont.truetype(MENLO, 16, index=1)
fTag     = ImageFont.truetype(MENLO, 11, index=1)

# ── Canvas ───────────────────────────────────────────────────
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

# ── Scanlines ────────────────────────────────────────────────
for sy in range(0, H, 3):
    if sy % 6 == 0:
        draw.line([(0, sy), (W, sy)], fill=(18, 20, 24), width=1)

# ── Top Bar ──────────────────────────────────────────────────
dot_y = 16
for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
    draw.ellipse([PAD + i * 18, dot_y, PAD + 10 + i * 18, dot_y + 10], fill=c)

brand_x = PAD + 64
draw.text((brand_x, 10), "Shawn", font=fBrand, fill=MUTED)
shawn_w = text_w("Shawn", fBrand)
draw.text((brand_x + shawn_w + 8, 10), "AI", font=fBrand, fill=GREEN)
ai_w = text_w("AI", fBrand)
draw.text((brand_x + shawn_w + 8 + ai_w, 10), "/os", font=fBrand, fill=BRIGHT)
cmd_x = brand_x + shawn_w + 8 + ai_w + text_w("/os", fBrand) + 6
draw.text((cmd_x, 15), "command", font=fTitle, fill=DIM_GREEN)

draw.line([(PAD, 38), (W - PAD, 38)], fill=BORDER, width=1)

# ── Boot Command ─────────────────────────────────────────────
cy = 48
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "AI/os boot --mode=build && turbo deploy --prod", font=fCmd, fill=BRIGHT)
cy += 22
draw.line([(PAD, cy), (W - PAD, cy)], fill=BORDER, width=1)
cy += 20

# ── Hero Block: "shawn.os is now live." ──────────────────────
hero_text = "shawn.os is now live."
htw = text_w(hero_text, fHero)
draw.text(((W - htw) / 2, cy), hero_text, font=fHero, fill=GREEN)
cy += 40

sub_hero = "monorepo. turborepo. three websites. one push."
shtw = text_w(sub_hero, fTag)
draw.text(((W - shtw) / 2, cy), sub_hero, font=fTag, fill=BRIGHT)
cy += 24

draw.line([(W // 4, cy), (3 * W // 4, cy)], fill=BORDER, width=1)
cy += 16

# ── Three Sites: Horizontal list ─────────────────────────────
card_gap = 14
card_w = (W - PAD * 2 - card_gap * 2) // 3
card_h = 200

sites = [
    ("shawnos.ai", GREEN, "LIVE", "the personal OS", [
        "blog + build log",
        "RPG progression",
        "tracker prompt",
    ]),
    ("thegtmos.ai", AMBER, "v1", "the GTM engine", [
        "GTM engineering",
        "playbooks",
        "pipeline design",
    ]),
    ("thecontentos.ai", CYAN, "v1", "the content pipeline", [
        "content OS",
        "voice engine",
        "multi-channel",
    ]),
]

for idx, (domain, color, status, tagline, features) in enumerate(sites):
    cx = PAD + idx * (card_w + card_gap)
    draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=8, fill=PANEL, outline=color)

    sx, sy = cx + 14, cy + 14
    draw_glow_dot(sx + 4, sy + 8, 4, color)
    draw.text((sx + 14, sy), domain, font=fSite, fill=color)
    sy += 24
    draw.text((sx + 14, sy), status, font=fSmBold, fill=color)
    sy += 22

    draw.text((sx + 14, sy), tagline, font=fSmall, fill=TXT)
    sy += 20

    for feat in features:
        draw.text((sx + 14, sy), f"> {feat}", font=fSmall, fill=MUTED)
        sy += 16

    sy += 8
    draw.text((sx + 14, sy), "Next.js + Vercel", font=fTiny, fill=MUTED)

    # Accent bar at bottom
    draw.rectangle([cx + 1, cy + card_h - 3, cx + card_w - 1, cy + card_h - 1], fill=color)

cy += card_h + 16

# ── Stack tags centered ──────────────────────────────────────
tags = ["Turborepo", "Next.js", "Vercel", "Cursor", "Claude", "Git"]
total_tag_w = sum(text_w(t, fTag) + 24 for t in tags) + 10 * (len(tags) - 1)
tag_x = int((W - total_tag_w) / 2)
for tag in tags:
    tw = text_w(tag, fTag)
    pad_h = 4
    pad_w = 12
    draw.rounded_rectangle([tag_x, cy, tag_x + tw + pad_w * 2, cy + 20], radius=4, fill=PANEL, outline=BORDER)
    draw.text((tag_x + pad_w, cy + pad_h - 1), tag, font=fTag, fill=GREEN)
    tag_x += int(tw) + pad_w * 2 + 10

# ── Bottom bar ───────────────────────────────────────────────
bot_y = H - 48
draw.line([(PAD, bot_y), (W - PAD, bot_y)], fill=BORDER, width=1)
bot_y += 10

draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "the lab is open. dare to build.", font=fCmd, fill=BRIGHT)

series_txt = "OS.AI LABS // build weekend"
draw.text((W - PAD - text_w(series_txt, fSmBold), bot_y + 2),
          series_txt, font=fSmBold, fill=DIM_GREEN)

footer = "built with Cursor + Claude Code  //  shawn ⚡ the gtme alchemist"
fw = text_w(footer, fFoot)
draw.text(((W - fw) / 2, H - 16), footer, font=fFoot, fill=MUTED)

# ── Corner accents ───────────────────────────────────────────
cr = W - PAD
draw.line([(cr - 12, PAD - 10), (cr, PAD - 10)], fill=DIM_GREEN, width=1)
draw.line([(cr, PAD - 10), (cr, PAD + 4)], fill=DIM_GREEN, width=1)

draw.line([(PAD, H - PAD + 8), (PAD, H - PAD - 6)], fill=DIM_GREEN, width=1)
draw.line([(PAD, H - PAD + 8), (PAD + 12, H - PAD + 8)], fill=DIM_GREEN, width=1)

# ── Save ─────────────────────────────────────────────────────
out_dir = os.path.dirname(__file__)
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "build-weekend-x.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {W} x {H} px (X timeline card)")
