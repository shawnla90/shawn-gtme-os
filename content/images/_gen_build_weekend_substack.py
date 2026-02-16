#!/usr/bin/env python3
"""
Substack article header image for Post 3: Build Weekend.
Vertical boot-sequence layout showing the build arc from
meme generator → git → skill tree → monorepo → three sites LIVE.

Canvas: 1456 x 816 (matches Post 1 which displayed best)
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
fHero    = ImageFont.truetype(MENLO, 16, index=1)

# ── Canvas ───────────────────────────────────────────────────
W, H = 1456, 816
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

session_txt = "OS.AI LABS // POST 3"
draw.text((W - PAD - text_w(session_txt, fSmBold), 14), session_txt, font=fSmBold, fill=CYAN)
date_txt = "2026-02-16 // shawn@gtme-os"
draw.text((W - PAD - text_w(date_txt, fSmall), 28), date_txt, font=fSmall, fill=MUTED)

draw.line([(PAD, 44), (W - PAD, 44)], fill=BORDER, width=1)

# ── Boot Command ─────────────────────────────────────────────
cy = 58
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "AI/os boot --mode=build", font=fCmd, fill=BRIGHT)
cy += 22
draw.text((PAD, cy), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), cy), "loading monorepo.config...", font=fCmd, fill=MUTED)
cy += 28
draw.line([(PAD, cy), (W - PAD, cy)], fill=BORDER, width=1)
cy += 16

# ═════════════════════════════════════════════════════════════
# LEFT COLUMN: Build arc (vertical boot sequence)
# RIGHT COLUMN: Three-site deployment panel
# ═════════════════════════════════════════════════════════════

left_w = (W - PAD * 3) * 0.42
right_w = (W - PAD * 3) - left_w
panel_h = H - cy - 70

# ── LEFT: Build Arc Panel ────────────────────────────────────
lx = PAD
draw.rounded_rectangle([lx, cy, lx + left_w, cy + panel_h], radius=10, fill=PANEL, outline=BORDER)

ix = lx + 20
iy = cy + 16

draw.text((ix, iy), "[BUILD ARC]", font=fPhase, fill=GREEN)
draw.text((ix + text_w("[BUILD ARC]", fPhase) + 8, iy), "2 WEEKS", font=fPhase, fill=BRIGHT)
iy += 28

# Timeline milestones
milestones = [
    ("$ ./init", "meme-generator.py", "week 0", RED_MUTED, "broke it. fixed it. broke it again."),
    ("$ git init", "brain/", "week 0.5", AMBER, "version control = thinking in systems"),
    ("$ ./build", "--scaffold skill-tree", "week 1", CYAN, "RPG scoring engine. 11 tiers."),
    ("$ turbo", "init --monorepo", "week 1.5", CYAN, "one repo. shared design system."),
    ("$ vercel", "deploy --prod", "week 2", GREEN, "three sites. one push. all live."),
]

for cmd, args, week, color, note in milestones:
    draw_glow_dot(ix + 4, iy + 7, 3, color)
    draw.text((ix + 14, iy), week, font=fTiny, fill=MUTED)
    iy += 14

    draw.text((ix + 14, iy), cmd, font=fBody, fill=GREEN)
    cw = text_w(cmd, fBody)
    draw.text((ix + 14 + cw + 4, iy), args, font=fBody, fill=color)
    iy += 16

    draw.text((ix + 14, iy), f"> {note}", font=fSmall, fill=MUTED)
    iy += 22

    if cmd != "$ vercel":
        draw.line([(ix + 4, iy - 6), (ix + 4, iy + 2)], fill=DIM_GREEN, width=1)
        iy += 6

# Progress bar at bottom of left panel
iy += 4
draw.text((ix, iy), "ownership:", font=fSmall, fill=MUTED)
bar_x = ix + text_w("ownership:", fSmall) + 6
draw_progress_bar(bar_x, iy + 1, 200, 1.0, GREEN, DIM_GREEN)
draw.text((bar_x + 206, iy), "FULL", font=fSmall, fill=GREEN)

# ── RIGHT: Three-Site Deployment Panel ───────────────────────
rx = PAD * 2 + left_w
draw.rounded_rectangle([rx, cy, rx + right_w, cy + panel_h], radius=10, fill=PANEL, outline=GREEN, width=2)

ix = rx + 24
iy = cy + 16

draw.text((ix, iy), "[DEPLOY]", font=fPhase, fill=GREEN)
draw.text((ix + text_w("[DEPLOY]", fPhase) + 8, iy), "THREE SITES LIVE", font=fPhase, fill=GREEN)
draw.text((ix + text_w("[DEPLOY]", fPhase) + 8 + text_w("THREE SITES LIVE", fPhase) + 10, iy), "✓", font=fPhase, fill=GREEN)
iy += 30

draw.text((ix, iy), "$ turbo deploy --filter=apps/*", font=fBody, fill=GREEN)
iy += 22

# Site 1: shawnos.ai (GREEN)
site_panel_w = right_w - 48
site_h = 100
draw.rounded_rectangle([ix, iy, ix + site_panel_w, iy + site_h], radius=8, fill=BG, outline=GREEN)
sx, sy = ix + 16, iy + 12
draw_glow_dot(sx + 4, sy + 6, 4, GREEN)
draw.text((sx + 14, sy), "shawnos.ai", font=fHero, fill=GREEN)
draw.text((sx + 14 + text_w("shawnos.ai", fHero) + 10, sy + 2), "LIVE", font=fSmBold, fill=GREEN)
sy += 22
draw.text((sx + 14, sy), "blog + daily build log + RPG progression", font=fSmall, fill=TXT)
sy += 16
draw.text((sx + 14, sy), "the personal OS. receipts public.", font=fSmall, fill=MUTED)
sy += 16
draw.text((sx + 14, sy), "accent:", font=fTiny, fill=MUTED)
draw.rectangle([sx + 14 + text_w("accent:", fTiny) + 6, sy, sx + 14 + text_w("accent:", fTiny) + 46, sy + 10], fill=GREEN)
iy += site_h + 12

# Site 2: thegtmos.ai (AMBER)
draw.rounded_rectangle([ix, iy, ix + site_panel_w, iy + site_h], radius=8, fill=BG, outline=AMBER)
sx, sy = ix + 16, iy + 12
draw_glow_dot(sx + 4, sy + 6, 4, AMBER)
draw.text((sx + 14, sy), "thegtmos.ai", font=fHero, fill=AMBER)
draw.text((sx + 14 + text_w("thegtmos.ai", fHero) + 10, sy + 2), "v1", font=fSmBold, fill=AMBER)
sy += 22
draw.text((sx + 14, sy), "GTM engineering methodology + playbooks", font=fSmall, fill=TXT)
sy += 16
draw.text((sx + 14, sy), "the system that builds pipelines.", font=fSmall, fill=MUTED)
sy += 16
draw.text((sx + 14, sy), "accent:", font=fTiny, fill=MUTED)
draw.rectangle([sx + 14 + text_w("accent:", fTiny) + 6, sy, sx + 14 + text_w("accent:", fTiny) + 46, sy + 10], fill=AMBER)
iy += site_h + 12

# Site 3: thecontentos.ai (CYAN)
draw.rounded_rectangle([ix, iy, ix + site_panel_w, iy + site_h], radius=8, fill=BG, outline=CYAN)
sx, sy = ix + 16, iy + 12
draw_glow_dot(sx + 4, sy + 6, 4, CYAN)
draw.text((sx + 14, sy), "thecontentos.ai", font=fHero, fill=CYAN)
draw.text((sx + 14 + text_w("thecontentos.ai", fHero) + 10, sy + 2), "v1", font=fSmBold, fill=CYAN)
sy += 22
draw.text((sx + 14, sy), "content operating system + voice engine", font=fSmall, fill=TXT)
sy += 16
draw.text((sx + 14, sy), "the pipeline that ships everywhere.", font=fSmall, fill=MUTED)
sy += 16
draw.text((sx + 14, sy), "accent:", font=fTiny, fill=MUTED)
draw.rectangle([sx + 14 + text_w("accent:", fTiny) + 6, sy, sx + 14 + text_w("accent:", fTiny) + 46, sy + 10], fill=CYAN)
iy += site_h + 16

# Stack info
draw.text((ix, iy), "stack:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("stack:", fSmall) + 6, iy), "Turborepo + Next.js + Vercel", font=fSmall, fill=BRIGHT)
iy += 16
draw.text((ix, iy), "deploy:", font=fSmall, fill=MUTED)
draw.text((ix + text_w("deploy:", fSmall) + 6, iy), "one push. all three.", font=fSmall, fill=GREEN)

# ── Bottom bar ───────────────────────────────────────────────
bot_y = cy + panel_h + 12
draw.line([(PAD, bot_y), (W - PAD, bot_y)], fill=BORDER, width=1)
bot_y += 10

draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "AI/os build complete.", font=fCmd, fill=GREEN)
bot_y += 20
draw.text((PAD, bot_y), "> ", font=fCmd, fill=GREEN)
draw.text((PAD + text_w("> ", fCmd), bot_y), "the lab is open. shawn.os is live. dare to build.", font=fCmd, fill=BRIGHT)

series_txt = "OS.AI LABS // build weekend"
draw.text((W - PAD - text_w(series_txt, fSmBold), bot_y - 10),
          series_txt, font=fSmBold, fill=DIM_GREEN)

footer = "built with Cursor + Claude Code  //  shawn ⚡ the gtme alchemist"
fw = text_w(footer, fFoot)
draw.text(((W - fw) / 2, H - 22), footer, font=fFoot, fill=MUTED)

# ── Corner accents ───────────────────────────────────────────
cr = W - PAD
draw.line([(cr - 16, PAD - 12), (cr, PAD - 12)], fill=DIM_GREEN, width=1)
draw.line([(cr, PAD - 12), (cr, PAD + 4)], fill=DIM_GREEN, width=1)

draw.line([(PAD, H - PAD), (PAD, H - PAD - 16)], fill=DIM_GREEN, width=1)
draw.line([(PAD, H - PAD), (PAD + 16, H - PAD)], fill=DIM_GREEN, width=1)

# ── Save ─────────────────────────────────────────────────────
out_dir = os.path.dirname(__file__)
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "build-weekend-substack.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {W} x {H} px (Substack header)")
