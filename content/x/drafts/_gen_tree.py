#!/usr/bin/env python3
"""Generate the GTME OS tree visualization – v3 (LinkedIn 4:5 Vertical)."""

from PIL import Image, ImageDraw, ImageFont
import os

# ── Dimensions (4:5 Portrait for LinkedIn) ──────────────────────────
WIDTH  = 1080
HEIGHT = 1350
PAD    = 30
GAP    = 30

# ── Palette ─────────────────────────────────────────────────────────
BG      = (12, 13, 17)
PANEL   = (22, 24, 30)
BORDER  = (40, 44, 54)
GREEN   = (78, 195, 115)
TXT     = (185, 195, 210)
BRIGHT  = (230, 236, 245)
MUTED   = (100, 110, 128)

# ── Fonts ───────────────────────────────────────────────────────────
MENLO = "/System/Library/Fonts/Menlo.ttc"

fTitle = ImageFont.truetype(MENLO, 28, index=1)   # bold, slightly smaller to save space
fTree  = ImageFont.truetype(MENLO, 18, index=0)   # regular, adjusted for fit
fAnnot = ImageFont.truetype(MENLO, 14, index=0)   # small / muted
fFoot  = ImageFont.truetype(MENLO, 14, index=0)

# ── Data (Define first to calculate heights) ────────────────────────
left_tree = [
    "shawn-gtme-os/",
    "├── clients/",
    "│   └── partner/",
    "│       ├── northbeam/",
    "│       ├── ridgeline/",
    "│       ├── vektora/",
    "│           ├── prompts/",
    "│           ├── research/",
    "│           ├── resources/",
    "│           └── workflows/",
    "├── workflows/",
    "│   └── plays-index.md (15 active plays)",
    "├── .cursor/skills/",
    "│   ├── instantly-replies/",
    "│   ├── heyreach-export/",
    "│   ├── heyreach-conversations/",
    "│   ├── linkedin-recon/",
    "│   └── slack-mcp/",
]

right_tree = [
    "skills/",
    "├── tier-1-voice-dna/",
    "│   ├── core-voice.md",
    "│   ├── anti-slop.md",
    "│   └── safety-filters.md",
    "├── tier-2-context-playbooks/",
    "│   ├── linkedin.md",
    "│   ├── x-twitter.md",
    "│   └── youtube.md",
    "├── tier-3-content-ops/",
    "│   ├── pillars/",
    "│   │   ├── plays-series.md",
    "│   │   ├── building-sharing.md",
    "│   │   ├── gtm-memes.md",
    "│   │   ├── release-reactions.md",
    "│   │   └── skill-system-shares.md",
    "│   ├── captures/",
    "│   └── pre-publish-checklist.md",
    "content/",
    "├── linkedin/drafts/",
    "├── linkedin/final/",
    "└── x/drafts/",
    ".cursor/skills/",
    "└── final-copy/ (draft → Typefully)",
]

# ── Layout Calculations ─────────────────────────────────────────────
img  = Image.new("RGB", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

footer_h = 40
avail_h = HEIGHT - 2 * PAD - GAP - footer_h

# Calculate proportional heights
# Content height ~ Title + (Lines * LineHeight) + Padding
lh = 26
tree_y_off = 60
pad_bottom = 20

h1_req = tree_y_off + len(left_tree) * lh + pad_bottom
h2_req = tree_y_off + len(right_tree) * lh + pad_bottom
total_req = h1_req + h2_req

# Allocate space proportionally, but ensure it fills the canvas nicely
# We have avail_h to split between h1 and h2
# Let's split avail_h based on ratio of h1_req / total_req
ratio = h1_req / total_req
ph1 = int(avail_h * ratio)
ph2 = avail_h - ph1

# Panel dimensions
pw = WIDTH - 2 * PAD
x1, y1 = PAD, PAD
x2, y2 = PAD, PAD + ph1 + GAP

# Draw panels
draw.rounded_rectangle([x1, y1, x1 + pw, y1 + ph1], radius=16, fill=PANEL, outline=BORDER)
draw.rounded_rectangle([x2, y2, x2 + pw, y2 + ph2], radius=16, fill=PANEL, outline=BORDER)

# ── Titles ──────────────────────────────────────────────────────────
ty_off = 20
ix = 32 

def draw_title(bx, by, t1, t2):
    draw.text((bx + ix, by + ty_off), t1, font=fTitle, fill=BRIGHT)
    w = draw.textlength(t1, font=fTitle)
    draw.text((bx + ix + w, by + ty_off), t2, font=fTitle, fill=GREEN)

draw_title(x1, y1, "Go-To-Market ", "Operating System")
draw_title(x2, y2, "Content ", "Operating System")

# ── Tree renderer ───────────────────────────────────────────────────
TREE_CHARS = set("│├└─ ")

def render_tree(lines, ox, oy):
    for i, raw in enumerate(lines):
        cx = ox
        y  = oy + i * lh

        j = 0
        while j < len(raw) and raw[j] in TREE_CHARS:
            j += 1
        prefix = raw[:j]
        rest   = raw[j:]

        if prefix:
            draw.text((cx, y), prefix, font=fTree, fill=GREEN)
            cx += draw.textlength(prefix, font=fTree)

        if "(" in rest:
            k     = rest.index("(")
            name  = rest[:k]
            annot = rest[k:]
            draw.text((cx, y), name, font=fTree, fill=TXT)
            cx += draw.textlength(name, font=fTree)
            draw.text((cx, y + 2), annot, font=fAnnot, fill=MUTED)
        else:
            draw.text((cx, y), rest, font=fTree, fill=TXT)

# Render Trees
render_tree(left_tree,  x1 + ix, y1 + tree_y_off)
render_tree(right_tree, x2 + ix, y2 + tree_y_off)

# ── Footer ──────────────────────────────────────────────────────────
ftxt = "built with Cursor + Claude Code"
fw   = draw.textlength(ftxt, font=fFoot)
draw.text(((WIDTH - fw) / 2, HEIGHT - 36), ftxt, font=fFoot, fill=MUTED)

# ── Save ────────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(__file__), "gtme-os-tree-visualization.png")
img.save(out, "PNG", dpi=(144, 144))
print(f"saved → {out}")
print(f"  {WIDTH} x {HEIGHT} px (4:5 Portrait)")
