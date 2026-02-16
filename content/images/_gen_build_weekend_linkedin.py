#!/usr/bin/env python3
"""
LinkedIn image for Build Weekend cross-promo.
Terminal aesthetic announcing Shawn AI/os is live.
Three websites, monorepo, one push deploys all.

Canvas: 1200 x 720 (5:3 landscape, standard LinkedIn feed)
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

fBrand   = ImageFont.truetype(MENLO, 26, index=1)
fTitle   = ImageFont.truetype(MENLO, 16, index=1)
fCmd     = ImageFont.truetype(MENLO, 14, index=0)
fBody    = ImageFont.truetype(MENLO, 12, index=0)
fBold    = ImageFont.truetype(MENLO, 12, index=1)
fSmall   = ImageFont.truetype(MENLO, 10, index=0)
fSmBold  = ImageFont.truetype(MENLO, 10, index=1)
fTiny    = ImageFont.truetype(MENLO, 9, index=0)
fFoot    = ImageFont.truetype(MENLO, 9, index=0)
fPhase   = ImageFont.truetype(MENLO, 13, index=1)
fHero    = ImageFont.truetype(MENLO, 22, index=1)
fSite    = ImageFont.truetype(MENLO, 18, index=1)

# ── Canvas ───────────────────────────────────────────────────
W, H = 1200, 720
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
    draw.ellipse([PAD + i * 20, dot_y, PAD + 11 + i * 20, dot_y + 11], fill=c)

brand_x = PAD + 72
draw.text((brand_x, 10), "Shawn", font=fBrand, fill=MUTED)
shawn_w = text_w("Shawn", fBrand)
draw.text((brand_x + shawn_w + 8, 10), "AI", font=fBrand, fill=GREEN)
ai_w = text_w("AI", fBrand)
draw.text((brand_x + shawn_w + 8 + ai_w, 10), "/os", font=fBrand, fill=BRIGHT)
cmd_x = brand_x + shawn_w + 8 + ai_w + text_w("/os", fBrand) + 6
draw.text((cmd_x, 17), "command", font=fTitle, fill=DIM_GREEN)

session_txt = "OS.AI LABS // POST 3"
draw.text((W - PAD - text_w(session_txt, fSmBold), 12), session_txt, font=fSmBold, fill=CYAN)

draw.line([(PAD, 40), (W - PAD, 40)], fill=BORDER, width=1)

# ── Boot Command ─────────────────────────────────────────────
cy = 52
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "AI/os boot --mode=build", font=fCmd, fill=BRIGHT)
cy += 20
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "deploying monorepo...", font=fCmd, fill=MUTED)
cy += 26
draw.line([(PAD, cy), (W - PAD, cy)], fill=BORDER, width=1)
cy += 18

# ── Hero Announcement ────────────────────────────────────────
hero_panel_w = W - PAD * 2
hero_h = 60
draw.rounded_rectangle([PAD, cy, PAD + hero_panel_w, cy + hero_h], radius=10, fill=PANEL, outline=GREEN, width=2)

hero_text = "shawn.os is live."
htw = text_w(hero_text, fHero)
draw.text(((W - htw) / 2, cy + 18), hero_text, font=fHero, fill=GREEN)
cy += hero_h + 14

# ── Three Site Cards (horizontal) ────────────────────────────
card_gap = 16
card_w = (W - PAD * 2 - card_gap * 2) // 3
card_h = 250

sites = [
    ("shawnos.ai", GREEN, "LIVE", [
        "blog engine",
        "daily build log",
        "RPG progression",
        "skill guide",
        "tracker prompt",
        "nothing gated.",
    ]),
    ("thegtmos.ai", AMBER, "v1", [
        "GTM engineering",
        "playbooks",
        "methodology",
        "pipeline design",
        "architecture ready",
        "content incoming.",
    ]),
    ("thecontentos.ai", CYAN, "v1", [
        "content OS",
        "voice engine",
        "platform plays",
        "multi-channel",
        "6 platforms",
        "draft to published.",
    ]),
]

for idx, (domain, color, status, features) in enumerate(sites):
    cx = PAD + idx * (card_w + card_gap)
    draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=8, fill=PANEL, outline=color)

    sx, sy = cx + 16, cy + 14
    draw_glow_dot(sx + 4, sy + 7, 4, color)
    draw.text((sx + 14, sy), domain, font=fSite, fill=color)
    sy += 26
    draw.text((sx + 14, sy), status, font=fSmBold, fill=color)
    sy += 24

    for feat in features:
        draw.text((sx + 14, sy), f"> {feat}", font=fBody, fill=TXT)
        sy += 18

    # Accent color bar at bottom
    draw.rectangle([cx + 1, cy + card_h - 4, cx + card_w - 1, cy + card_h - 1], fill=color)

cy += card_h + 16

# ── Stack Line ───────────────────────────────────────────────
stack_text = "Turborepo  +  Next.js  +  Vercel  //  one push deploys all three"
stw = text_w(stack_text, fPhase)
draw.text(((W - stw) / 2, cy), stack_text, font=fPhase, fill=BRIGHT)
cy += 20

sub_text = "monorepo  //  shared design system  //  three accent colors"
subtw = text_w(sub_text, fSmall)
draw.text(((W - subtw) / 2, cy), sub_text, font=fSmall, fill=MUTED)

# ── Bottom bar ───────────────────────────────────────────────
bot_y = H - 58
draw.line([(PAD, bot_y), (W - PAD, bot_y)], fill=BORDER, width=1)
bot_y += 10

draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "AI/os build complete.", font=fCmd, fill=GREEN)
bot_y += 18
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "the lab is open. dare to build.", font=fCmd, fill=BRIGHT)

series_txt = "OS.AI LABS // build weekend"
draw.text((W - PAD - text_w(series_txt, fSmBold), bot_y - 8),
          series_txt, font=fSmBold, fill=DIM_GREEN)

footer = "built with Cursor + Claude Code  //  shawn ⚡ the gtme alchemist"
fw = text_w(footer, fFoot)
draw.text(((W - fw) / 2, H - 18), footer, font=fFoot, fill=MUTED)

# ── Corner accents ───────────────────────────────────────────
cr = W - PAD
draw.line([(cr - 14, PAD - 10), (cr, PAD - 10)], fill=DIM_GREEN, width=1)
draw.line([(cr, PAD - 10), (cr, PAD + 4)], fill=DIM_GREEN, width=1)

draw.line([(PAD, H - PAD), (PAD, H - PAD - 14)], fill=DIM_GREEN, width=1)
draw.line([(PAD, H - PAD), (PAD + 14, H - PAD)], fill=DIM_GREEN, width=1)

# ── Save ─────────────────────────────────────────────────────
out_dir = os.path.dirname(__file__)
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "build-weekend-linkedin.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {W} x {H} px (LinkedIn landscape)")
