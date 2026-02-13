#!/usr/bin/env python3
"""
Branching architecture image for Substack launch cross-promo.
Shows: voice DNA → skills → MCPs → platforms in a clean tree layout.
LinkedIn 4:5 portrait (1080x1350).
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ── Dimensions (4:5 Portrait for LinkedIn) ──────────────────────────
WIDTH  = 1080
HEIGHT = 1350
PAD    = 30

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

# ── Fonts ───────────────────────────────────────────────────────────
MENLO = "/System/Library/Fonts/Menlo.ttc"

fTitle   = ImageFont.truetype(MENLO, 26, index=1)   # bold title
fSub     = ImageFont.truetype(MENLO, 14, index=1)   # subtitle
fTree    = ImageFont.truetype(MENLO, 16, index=0)   # tree text
fAnnot   = ImageFont.truetype(MENLO, 12, index=0)   # annotations
fFoot    = ImageFont.truetype(MENLO, 12, index=0)   # footer
fSection = ImageFont.truetype(MENLO, 13, index=1)   # section headers

img  = Image.new("RGB", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# ── Helpers ─────────────────────────────────────────────────────────
TREE_CHARS = set("│├└─ ")

def draw_tree_line(ox, y, prefix, name, annot=None, name_color=TXT, lh=20):
    cx = ox
    if prefix:
        draw.text((cx, y), prefix, font=fTree, fill=GREEN)
        cx += draw.textlength(prefix, font=fTree)
    draw.text((cx, y), name, font=fTree, fill=name_color)
    if annot:
        cx += draw.textlength(name, font=fTree) + 6
        draw.text((cx, y + 2), annot, font=fAnnot, fill=MUTED)
    return y + lh

def draw_section_label(x, y, text, color=GREEN):
    draw.text((x, y), text, font=fSection, fill=color)
    return y + 18

def draw_panel(x, y, w, h):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=12, fill=PANEL, outline=BORDER)

# ── Title Area ──────────────────────────────────────────────────────
ty = PAD
draw.text((PAD, ty), "one repo. ", font=fTitle, fill=BRIGHT)
w1 = draw.textlength("one repo. ", font=fTitle)
draw.text((PAD + w1, ty), "your voice. ", font=fTitle, fill=GREEN)
w2 = draw.textlength("your voice. ", font=fTitle)
draw.text((PAD + w1 + w2, ty), "every platform.", font=fTitle, fill=BRIGHT)
ty += 34
draw.text((PAD, ty), "not a template database. a system built on you.", font=fSub, fill=MUTED)
ty += 30

# ── Panel: Voice DNA ───────────────────────────────────────────────
pw = WIDTH - PAD * 2
ph1 = 120
draw_panel(PAD, ty, pw, ph1)
ix = PAD + 18
iy = ty + 14

iy = draw_section_label(ix, iy, "VOICE DNA", GREEN)
iy = draw_tree_line(ix, iy, "├── ", "core-voice.md", "(YOUR patterns, YOUR tone)")
iy = draw_tree_line(ix, iy, "├── ", "anti-slop.md", "(29-flag AI detection)")
iy = draw_tree_line(ix, iy, "├── ", "viral-hooks.md", "(scroll-stopping openers)")
iy = draw_tree_line(ix, iy, "└── ", "safety-filters.md", "(client/partner protection)")

ty += ph1 + 14

# ── Panel: Skills ──────────────────────────────────────────────────
ph2 = 190
draw_panel(PAD, ty, pw, ph2)
ix = PAD + 18
iy = ty + 14

iy = draw_section_label(ix, iy, "23 SKILLS", GREEN)
iy += 2
iy = draw_tree_line(ix, iy, "├── ", "content/", "(play-draft, final-copy, viral-hooks, tiktok-script)")
iy = draw_tree_line(ix, iy, "├── ", "outbound/", "(heyreach-export, instantly-replies, email-copy)")
iy = draw_tree_line(ix, iy, "├── ", "ops/", "(slack-sync, notion-sync, repo-stats)")
iy = draw_tree_line(ix, iy, "├── ", "recon/", "(linkedin-recon, heyreach-conversations)")
iy = draw_tree_line(ix, iy, "└── ", "publishing/", "(final-copy, substack-post, content-images)")

iy += 8
draw.text((ix, iy), "wire it for content. or outbound. or ads. or product.", font=fAnnot, fill=AMBER)
iy += 14
draw.text((ix, iy), "same architecture. different skills.", font=fAnnot, fill=AMBER)

ty += ph2 + 14

# ── Panel: MCPs ────────────────────────────────────────────────────
ph3 = 235
draw_panel(PAD, ty, pw, ph3)
ix = PAD + 18
iy = ty + 14

iy = draw_section_label(ix, iy, "15+ MCP CONNECTIONS", CYAN)
iy += 2

mcps = [
    ("Instantly", "email campaigns + deliverability"),
    ("HeyReach", "LinkedIn automation + exports"),
    ("Typefully", "scheduling + cross-posting"),
    ("Substack", "newsletter drafts + publishing"),
    ("Reddit", "community posts + search"),
    ("Slack", "channel sync + reminders"),
    ("Notion", "repo-to-Notion sync"),
    ("Firecrawl", "web scraping as markdown"),
    ("Google Sheets", "enrichment + lead lists"),
    ("ElevenLabs", "TTS for TikTok/YouTube"),
]

for i, (name, desc) in enumerate(mcps):
    prefix = "└── " if i == len(mcps) - 1 else "├── "
    # MCP name in cyan, description in muted
    cx = ix
    draw.text((cx, iy), prefix, font=fTree, fill=CYAN)
    cx += draw.textlength(prefix, font=fTree)
    draw.text((cx, iy), name, font=fTree, fill=BRIGHT)
    cx += draw.textlength(name, font=fTree)
    draw.text((cx, iy), " → ", font=fTree, fill=DIM_GREEN)
    cx += draw.textlength(" → ", font=fTree)
    draw.text((cx, iy + 2), desc, font=fAnnot, fill=MUTED)
    iy += 20

ty += ph3 + 14

# ── Panel: Platforms ───────────────────────────────────────────────
ph4 = 180
draw_panel(PAD, ty, pw, ph4)
ix = PAD + 18
iy = ty + 14

iy = draw_section_label(ix, iy, "6 PLATFORMS", AMBER)
iy += 2

platforms = [
    ("LinkedIn", "plays, building & sharing, skills, memes", GREEN),
    ("X / Twitter", "compressed threads, micro-tips", GREEN),
    ("Substack", "long-form POV essays, tactical breakdowns", CYAN),
    ("TikTok", "16-sec hooks, 6 series queued", AMBER),
    ("YouTube", "12-25 min build walkthroughs", AMBER),
    ("Reddit", "SEO + community across 18 subs", AMBER),
]

for i, (name, desc, color) in enumerate(platforms):
    prefix = "└── " if i == len(platforms) - 1 else "├── "
    cx = ix
    draw.text((cx, iy), prefix, font=fTree, fill=GREEN)
    cx += draw.textlength(prefix, font=fTree)
    draw.text((cx, iy), name, font=fTree, fill=color)
    cx += draw.textlength(name, font=fTree) + 6
    draw.text((cx, iy + 2), desc, font=fAnnot, fill=MUTED)
    iy += 22

ty += ph4 + 14

# ── Connecting Lines Between Panels ─────────────────────────────────
# Draw vertical connector arrows between panels
arrow_x = WIDTH // 2
connectors = [
    PAD + 120,          # bottom of voice DNA panel
    PAD + 120 + 14,     # top of skills panel
    PAD + 120 + 14 + 190,
    PAD + 120 + 14 + 190 + 14,
    PAD + 120 + 14 + 190 + 14 + 235,
    PAD + 120 + 14 + 190 + 14 + 235 + 14,
]

# Calculate actual panel positions for connectors
panel_bottoms = [
    PAD + 30 + 34 + 120,                    # voice DNA bottom
    PAD + 30 + 34 + 120 + 14 + 190,         # skills bottom
    PAD + 30 + 34 + 120 + 14 + 190 + 14 + 235,  # MCPs bottom
]
panel_tops = [
    PAD + 30 + 34 + 120 + 14,               # skills top
    PAD + 30 + 34 + 120 + 14 + 190 + 14,    # MCPs top
    PAD + 30 + 34 + 120 + 14 + 190 + 14 + 235 + 14,  # platforms top
]

for bot, top in zip(panel_bottoms, panel_tops):
    mid_y = (bot + top) // 2
    draw.line([(arrow_x, bot), (arrow_x, top)], fill=DIM_GREEN, width=2)
    # Arrow head
    draw.polygon([(arrow_x - 4, top - 6), (arrow_x + 4, top - 6), (arrow_x, top)], fill=DIM_GREEN)

# ── Footer ──────────────────────────────────────────────────────────
ftxt = "built with Cursor + Claude Code"
fw   = draw.textlength(ftxt, font=fFoot)
draw.text(((WIDTH - fw) / 2, HEIGHT - 34), ftxt, font=fFoot, fill=MUTED)

# ── Save ────────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(__file__), "substack-crosspromo-branch.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {WIDTH} x {HEIGHT} px (4:5 Portrait)")
