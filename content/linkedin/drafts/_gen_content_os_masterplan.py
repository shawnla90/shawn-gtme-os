"""
Content OS Master Plan — Hub-and-spoke radial diagram.
Center hub (Git Repo) radiating to 6 platforms, with Voice DNA ring,
Skills dots ring, side panels for architecture + skills list.
"""
import math, os
from PIL import Image, ImageDraw, ImageFont

# ── Design System ──────────────────────────────────────────────
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

MENLO  = "/System/Library/Fonts/Menlo.ttc"
fTitle = ImageFont.truetype(MENLO, 20, index=1)
fHub   = ImageFont.truetype(MENLO, 15, index=1)
fPlatf = ImageFont.truetype(MENLO, 13, index=1)
fBody  = ImageFont.truetype(MENLO, 12, index=0)
fLabel = ImageFont.truetype(MENLO, 11, index=1)
fSmall = ImageFont.truetype(MENLO, 10, index=0)
fTiny  = ImageFont.truetype(MENLO, 9,  index=0)
fFoot  = ImageFont.truetype(MENLO, 10, index=0)

W, H = 1200, 720
img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# ── Helpers ────────────────────────────────────────────────────
def center_text(text, font, color, cx, cy):
    tw = draw.textlength(text, font=font)
    draw.text((cx - tw / 2, cy), text, font=font, fill=color)

# ── Title Bar ──────────────────────────────────────────────────
draw.text((24, 14), "CONTENT OS MASTER PLAN", font=fTitle, fill=BRIGHT)
draw.text((24, 40), "one repo  /  one voice  /  six platforms  /  26 skills",
          font=fBody, fill=MUTED)
draw.line([(24, 60), (W - 24, 60)], fill=BORDER, width=1)

# ── Diagram Center ─────────────────────────────────────────────
CX, CY = 600, 380
HUB_R   = 48
VOICE_R = 96
SKILL_R = 155
PLAT_R  = 232

# ── Hub Circle ─────────────────────────────────────────────────
draw.ellipse([CX - HUB_R - 3, CY - HUB_R - 3,
              CX + HUB_R + 3, CY + HUB_R + 3],
             outline=DIM_GREEN, width=1)
draw.ellipse([CX - HUB_R, CY - HUB_R,
              CX + HUB_R, CY + HUB_R],
             fill=PANEL, outline=GREEN, width=2)

center_text("GIT REPO", fHub, GREEN, CX, CY - 14)
center_text("1 hub", fTiny, MUTED, CX, CY + 4)
center_text("1 voice", fTiny, MUTED, CX, CY + 15)

# ── Voice DNA Ring (dotted) ────────────────────────────────────
for a in range(0, 360, 4):
    rad = math.radians(a)
    x = CX + VOICE_R * math.cos(rad)
    y = CY + VOICE_R * math.sin(rad)
    draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=DIM_GREEN)

# Label at right side of ring
draw.text((CX + VOICE_R + 6, CY - 6), "VOICE DNA", font=fSmall, fill=DIM_GREEN)

# ── Skills Dots Ring (26 dots) ─────────────────────────────────
for i in range(26):
    rad = math.radians(i * (360 / 26))
    sx = CX + SKILL_R * math.cos(rad)
    sy = CY + SKILL_R * math.sin(rad)
    draw.ellipse([sx - 2.5, sy - 2.5, sx + 2.5, sy + 2.5], fill=DIM_GREEN)

# Label in gap between TikTok spoke (150) and Reddit spoke (90) — bottom-left
center_text("26 SKILLS", fLabel, MUTED, CX - 60, CY + SKILL_R + 4)

# ── Platform Nodes + Spokes ────────────────────────────────────
platforms = [
    {"name": "LinkedIn",  "count": "11+ drafts", "color": GREEN, "angle": 270,
     "skills": "play-draft / final-copy / linkedin-comments"},
    {"name": "X",         "count": "12+ drafts", "color": GREEN, "angle": 330,
     "skills": "x-tip / viral-hooks / skill-play"},
    {"name": "Substack",  "count": "4 posts",    "color": CYAN,  "angle": 30,
     "skills": "substack-post / final-substack"},
    {"name": "Reddit",    "count": "2 posts",    "color": AMBER, "angle": 90,
     "skills": "repo-stats / image-to-content"},
    {"name": "TikTok",    "count": "scripts",    "color": AMBER, "angle": 150,
     "skills": "tiktok-script"},
    {"name": "YouTube",   "count": "planned",    "color": AMBER, "angle": 210,
     "skills": "content-images / agent-handoff"},
]

BOX_W, BOX_H = 108, 42

for p in platforms:
    rad = math.radians(p["angle"])
    px = CX + PLAT_R * math.cos(rad)
    py = CY + PLAT_R * math.sin(rad)

    # Spoke line: hub edge → platform center
    hx = CX + (HUB_R + 6) * math.cos(rad)
    hy = CY + (HUB_R + 6) * math.sin(rad)
    draw.line([(hx, hy), (px, py)], fill=DIM_GREEN, width=1)

    # Flow dots along the spoke (suggest data flowing outward)
    for t in [0.22, 0.40, 0.58, 0.76]:
        dx = hx + t * (px - hx)
        dy = hy + t * (py - hy)
        draw.ellipse([dx - 1.5, dy - 1.5, dx + 1.5, dy + 1.5], fill=DIM_GREEN)

    # Platform box
    draw.rounded_rectangle(
        [px - BOX_W / 2, py - BOX_H / 2, px + BOX_W / 2, py + BOX_H / 2],
        radius=8, fill=PANEL, outline=p["color"], width=2)

    # Platform name + count
    center_text(p["name"], fPlatf, p["color"], px, py - 13)
    center_text(p["count"], fSmall, MUTED, px, py + 5)

    # Skill subtitle below box
    sub_y = py + BOX_H / 2 + 4
    # Adjust placement for top/bottom nodes to avoid collision
    if p["angle"] == 270:          # LinkedIn at top — put skills above
        sub_y = py - BOX_H / 2 - 14
    elif p["angle"] == 90:         # Reddit at bottom — keep below but tight
        sub_y = py + BOX_H / 2 + 3

    center_text(p["skills"], fTiny, MUTED, px, sub_y)

# ── Cross-platform repurpose arcs (subtle dotted) ──────────────
# LinkedIn → X, LinkedIn → Substack, X → Reddit
arcs = [
    (270, 330),   # LinkedIn → X
    (330, 30),    # X → Substack
    (30, 90),     # Substack → Reddit
]
ARC_R = PLAT_R + 28  # slightly outside platform ring

for a1, a2 in arcs:
    # Draw dotted arc between two angle positions
    step = 2 if a2 > a1 else 2
    start = a1
    end = a2 if a2 > a1 else a2 + 360
    for a in range(start, end, 3):
        rad = math.radians(a)
        ax = CX + ARC_R * math.cos(rad)
        ay = CY + ARC_R * math.sin(rad)
        draw.ellipse([ax - 0.8, ay - 0.8, ax + 0.8, ay + 0.8], fill=BORDER)

# ── Left Panel: Voice Architecture ─────────────────────────────
LPX, LPY = 28, 76

draw.text((LPX, LPY), "VOICE ARCHITECTURE", font=fLabel, fill=GREEN)
LPY += 20

voice_tiers = [
    ("Tier 1: Voice DNA", [
        "core-voice.md",
        "viral-hooks.md",
        "anti-slop.md",
        "safety-filters.md",
    ]),
    ("Tier 2: Playbooks", [
        "linkedin.md",
        "x-twitter.md",
        "substack.md",
        "tiktok.md",
        "youtube.md",
    ]),
    ("Tier 3: Content Ops", [
        "pre-publish-checklist",
        "substance-requirements",
        "success-patterns",
        "10 content pillars",
    ]),
]

for tier_name, items in voice_tiers:
    draw.text((LPX, LPY), tier_name, font=fSmall, fill=TXT)
    LPY += 14
    for item in items:
        draw.text((LPX + 8, LPY), "-> " + item, font=fTiny, fill=MUTED)
        LPY += 12
    LPY += 8

# ── Right Panel: Active Skills ─────────────────────────────────
RPX, RPY = 938, 76

draw.text((RPX, RPY), "ACTIVE SKILLS (26)", font=fLabel, fill=GREEN)
RPY += 20

skills_list = [
    ("play-draft",          "screenshot->content"),
    ("final-copy",          "draft->publish"),
    ("substack-post",       "newsletter drafts"),
    ("final-substack",      "publish pipeline"),
    ("x-tip",               "micro-tip posts"),
    ("tiktok-script",       "short-form video"),
    ("viral-hooks",         "scroll-stop openers"),
    ("image-to-content",    "image->drafts"),
    ("content-images",      "Pillow visuals"),
    ("daily-tracker",       "auto-detect output"),
    ("skill-play",          "skill->content"),
    ("value-pin-comments",  "comment gen"),
    ("linkedin-comments",   "reply gen"),
    ("agent-context-handoff","scope docs"),
    ("heyreach-export",     "leads to CSV"),
    ("heyreach-handoff",    "campaign handoff"),
    ("heyreach-convos",     "LI chat history"),
    ("linkedin-recon",      "profile research"),
    ("slack-sync",          "channel->markdown"),
    ("slack-mcp",           "Slack integration"),
    ("slack-reminder",      "reminders"),
    ("email-copy",          "cold email copy"),
    ("instantly-replies",   "reply fetch"),
    ("notion-sync",         "repo->Notion"),
    ("repo-stats",          "value dashboard"),
    ("add-mcp",             "MCP install"),
]

for name, desc in skills_list:
    draw.text((RPX, RPY), name, font=fTiny, fill=TXT)
    cx_r = RPX + draw.textlength(name, font=fTiny) + 4
    avail = W - 24 - cx_r
    # Truncate description if needed
    if draw.textlength(desc, font=fTiny) <= avail:
        draw.text((cx_r, RPY), desc, font=fTiny, fill=MUTED)
    RPY += 11

# ── Stats Bar ──────────────────────────────────────────────────
STATS_Y = 662
draw.line([(24, STATS_Y - 8), (W - 24, STATS_Y - 8)], fill=BORDER, width=1)

stats = [
    ("26",  "SKILLS",           GREEN),
    ("10",  "PILLARS",          GREEN),
    ("6",   "PLATFORMS",        CYAN),
    ("36",  "ACTIVE DRAFTS",    AMBER),
    ("3",   "VOICE TIERS",      TXT),
    ("2",   "OPERATING SYSTEMS", BRIGHT),
]

stat_w = (W - 48) / len(stats)
for i, (num, label, color) in enumerate(stats):
    scx = 24 + stat_w * i + stat_w / 2
    tw = draw.textlength(num, font=fPlatf)
    draw.text((scx - tw / 2, STATS_Y), num, font=fPlatf, fill=color)
    tw2 = draw.textlength(label, font=fTiny)
    draw.text((scx - tw2 / 2, STATS_Y + 17), label, font=fTiny, fill=MUTED)

# ── Footer ─────────────────────────────────────────────────────
footer = "built with Cursor + Claude Code"
fw = draw.textlength(footer, font=fFoot)
draw.text(((W - fw) / 2, H - 16), footer, font=fFoot, fill=MUTED)

# ── Save ───────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(__file__),
                   "content-os-masterplan.png")
img.save(out, dpi=(144, 144))
print(f"Saved: {out}  ({W}x{H})")
