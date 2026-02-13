"""
Content OS Schematic — Full pillar tree, platform stats, LinkedIn deep dive.
"""
from PIL import Image, ImageDraw, ImageFont

# ── Design System ──────────────────────────────────────────────
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

MENLO = "/System/Library/Fonts/Menlo.ttc"
fTitle   = ImageFont.truetype(MENLO, 22, index=1)
fSub     = ImageFont.truetype(MENLO, 16, index=1)
fTree    = ImageFont.truetype(MENLO, 13, index=0)
fAnnot   = ImageFont.truetype(MENLO, 11, index=0)
fStat    = ImageFont.truetype(MENLO, 28, index=1)
fStatLbl = ImageFont.truetype(MENLO, 11, index=0)
fFoot    = ImageFont.truetype(MENLO, 11, index=0)

W, H = 1200, 2100
PAD = 24
PANEL_PAD = 18
INNER = 16
RADIUS = 10

img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# ── Helpers ────────────────────────────────────────────────────
def panel(x, y, w, h, title=None, title_color=BRIGHT):
    draw.rounded_rectangle([x, y, x+w, y+h], radius=RADIUS, fill=PANEL, outline=BORDER)
    ty = y + INNER
    if title:
        draw.text((x + INNER, ty), title, font=fSub, fill=title_color)
        ty += 24
    return x + INNER, ty

def tree_line(ox, y, prefix, name, annot=None, name_color=TXT):
    cx = ox
    if prefix:
        draw.text((cx, y), prefix, font=fTree, fill=GREEN)
        cx += draw.textlength(prefix, font=fTree)
    draw.text((cx, y), name, font=fTree, fill=name_color)
    if annot:
        cx += draw.textlength(name, font=fTree) + 6
        draw.text((cx, y + 1), annot, font=fAnnot, fill=MUTED)
    return y + 18

def stat_block(cx, cy, number, label, num_color=GREEN):
    tw = draw.textlength(str(number), font=fStat)
    draw.text((cx - tw/2, cy), str(number), font=fStat, fill=num_color)
    lw = draw.textlength(label, font=fStatLbl)
    draw.text((cx - lw/2, cy + 34), label, font=fStatLbl, fill=MUTED)

def dot(x, y, color=GREEN, size=6):
    draw.ellipse([x, y, x+size, y+size], fill=color)

# ── Title ──────────────────────────────────────────────────────
draw.text((PAD, PAD), "CONTENT OS SCHEMATIC", font=fTitle, fill=BRIGHT)
draw.text((PAD, PAD + 28), "gtme-os / content + pillars + platform trees", font=fAnnot, fill=MUTED)

Y_START = PAD + 60

# ══════════════════════════════════════════════════════════════
# SECTION 1: STATS BAR (full width)
# ══════════════════════════════════════════════════════════════
sw = W - PAD*2
sx, sy = panel(PAD, Y_START, sw, 82, title=None)

stats = [
    ("10", "PILLARS"),
    ("6", "PLATFORMS"),
    ("16", "GTM PLAYS"),
    ("23", "SKILLS"),
    ("10", "LI DRAFTS"),
    ("8", "LI FINALS"),
    ("10", "X DRAFTS"),
    ("5", "X FINALS"),
]
slot_w = sw / len(stats)
for i, (num, lbl) in enumerate(stats):
    cx = PAD + slot_w * i + slot_w / 2
    stat_block(cx, Y_START + 12, num, lbl, num_color=GREEN if i < 4 else AMBER)

Y_START += 82 + PANEL_PAD

# ══════════════════════════════════════════════════════════════
# SECTION 2: PILLARS TREE (left) + PLATFORMS TREE (right)
# ══════════════════════════════════════════════════════════════
col_w = (W - PAD*2 - PANEL_PAD) // 2
panel_h = 390

# ── Left: Content Pillars ──
lx, ly = panel(PAD, Y_START, col_w, panel_h, title="CONTENT PILLARS")
ly += 4

pillars = [
    ("plays-series", "(highest performing)", GREEN),
    ("building-sharing", "(narrative, reflective)", TXT),
    ("skill-system-shares", "(frameworks, skill files)", TXT),
    ("release-reactions", "(first-hand builder takes)", TXT),
    ("gtm-memes", "(short text + meme/gif)", TXT),
    ("newsletter-editorial", "(substack structure)", CYAN),
    ("newsletter-growth", "(cross-platform CTAs)", CYAN),
    ("newsletter-repurpose", "(social -> newsletter)", CYAN),
    ("reddit-growth-seo", "(SEO + community layer)", AMBER),
    ("youtube-builder-systems", "(long-form video)", AMBER),
]

ly = tree_line(lx, ly, "  ", "skills/tier-3-content-ops/pillars/", name_color=MUTED)
ly += 2
for i, (name, desc, color) in enumerate(pillars):
    is_last = i == len(pillars) - 1
    prefix = "  └── " if is_last else "  ├── "
    ly = tree_line(lx, ly, prefix, name, desc, name_color=color)

ly += 12
draw.text((lx, ly), "  Legend:", font=fAnnot, fill=MUTED)
ly += 16
dot(lx + 14, ly + 3, GREEN); draw.text((lx + 26, ly), "LinkedIn / X primary", font=fAnnot, fill=MUTED); ly += 16
dot(lx + 14, ly + 3, CYAN); draw.text((lx + 26, ly), "Newsletter layer", font=fAnnot, fill=MUTED); ly += 16
dot(lx + 14, ly + 3, AMBER); draw.text((lx + 26, ly), "New platform expansion", font=fAnnot, fill=MUTED)

# ── Right: Platform Distribution ──
rx, ry = panel(PAD + col_w + PANEL_PAD, Y_START, col_w, panel_h, title="PLATFORM DISTRIBUTION")
ry += 4

platforms = [
    ("linkedin/", "10 drafts, 8 finals", GREEN, True),
    ("  drafts/", "Feb 9 (4) + Feb 10 (6)", None, False),
    ("  final/", "Feb 9 (3) + Feb 10 (5)", None, False),
    ("x/", "10 drafts, 5 finals", GREEN, True),
    ("  drafts/", "Feb 9 (4) + Feb 10 (6)", None, False),
    ("  final/", "Feb 9 (2) + Feb 10 (3)", None, False),
    ("substack/", "0 posts (Post 1 next)", AMBER, True),
    ("  AI Alchemy", "new era, weekly cadence", None, False),
    ("tiktok/", "0 scripts (6 series planned)", AMBER, True),
    ("  3x/week", "ramp to daily", None, False),
    ("youtube/", "pillar defined, 0 videos", AMBER, True),
    ("  12-25 min", "build walkthroughs", None, False),
    ("reddit/", "pillar defined, 0 posts", AMBER, True),
    ("  18 subs", "tier 1-3 targeting", None, False),
]

ry = tree_line(rx, ry, "  ", "content/", name_color=MUTED)
ry += 2
for name, desc, color, is_main in platforms:
    if is_main:
        ry += 4
        prefix = "  ├── "
        draw.text((rx, ry), prefix, font=fTree, fill=GREEN)
        cx = rx + draw.textlength(prefix, font=fTree)
        draw.text((cx, ry), name, font=fTree, fill=color or TXT)
        cx += draw.textlength(name, font=fTree) + 6
        draw.text((cx, ry + 1), desc, font=fAnnot, fill=MUTED)
        ry += 18
    else:
        prefix = "  │   "
        draw.text((rx, ry), prefix, font=fTree, fill=DIM_GREEN)
        cx = rx + draw.textlength(prefix, font=fTree)
        draw.text((cx, ry), name, font=fTree, fill=MUTED)
        cx += draw.textlength(name, font=fTree) + 4
        draw.text((cx, ry + 1), desc, font=fAnnot, fill=MUTED)
        ry += 16

Y_START += panel_h + PANEL_PAD

# ══════════════════════════════════════════════════════════════
# SECTION 3: LINKEDIN DEEP DIVE (full width)
# ══════════════════════════════════════════════════════════════
li_panel_h = 480
lx, ly = panel(PAD, Y_START, W - PAD*2, li_panel_h, title="LINKEDIN DEEP DIVE")
ly += 6

# Drafts column
draw.text((lx, ly), "DRAFTS (10)", font=fAnnot, fill=GREEN)
draw.text((lx + 280, ly), "STATUS", font=fAnnot, fill=MUTED)
ly += 18

li_drafts = [
    ("Feb 9", "skill-tree-repo", "published", GREEN),
    ("Feb 9", "slack-sync-context", "published", GREEN),
    ("Feb 9", "weekend-build", "published", GREEN),
    ("Feb 9", "youtube-hype", "draft", AMBER),
    ("Feb 10", "agent-context-handoff", "draft", AMBER),
    ("Feb 10", "content-os-meta", "finalized", GREEN),
    ("Feb 10", "github-safety-workflow", "finalized", GREEN),
    ("Feb 10", "heyreach-partner-handoff-v2", "finalized", GREEN),
    ("Feb 10", "skill-play", "finalized", GREEN),
    ("Feb 10", "voice-modularity", "finalized", GREEN),
]

for date, slug, status, color in li_drafts:
    prefix = "  "
    draw.text((lx, ly), prefix, font=fTree, fill=GREEN)
    cx = lx + draw.textlength(prefix, font=fTree)
    draw.text((cx, ly), date, font=fTree, fill=MUTED)
    cx += draw.textlength("Feb 10  ", font=fTree)
    draw.text((cx, ly), slug, font=fTree, fill=TXT)
    # status badge
    sx2 = lx + 280
    dot(sx2, ly + 4, color, 6)
    draw.text((sx2 + 10, ly), status, font=fAnnot, fill=color)
    ly += 17

ly += 14

# Series tracking
draw.text((lx, ly), "ACTIVE SERIES", font=fAnnot, fill=CYAN)
ly += 18

series = [
    ("GTM Plays I Use Every Day", "16 plays", "15 Clay-heavy + 1 MCP/Cursor", GREEN),
    ("Skills I Use Everyday", "3 active", "7 queued candidates", AMBER),
    ("Unnumbered Canonicals", "3 workflows", "Claygent validation, ChatGPT research", MUTED),
]

for name, count, detail, color in series:
    draw.text((lx + 4, ly), name, font=fTree, fill=BRIGHT)
    cx_s = lx + 4 + draw.textlength(name, font=fTree) + 10
    draw.text((cx_s, ly + 1), count, font=fAnnot, fill=color)
    cx_s += draw.textlength(count, font=fAnnot) + 8
    draw.text((cx_s, ly + 1), detail, font=fAnnot, fill=MUTED)
    ly += 20

ly += 14

# Tool frequency
draw.text((lx, ly), "TOOL FREQUENCY ACROSS PLAYS", font=fAnnot, fill=CYAN)
ly += 18

tools = [
    ("Clay", "every play", 16),
    ("HubSpot", "6 plays", 6),
    ("Claygents", "3 plays + validation", 4),
    ("HeyReach MCP", "play 16", 1),
    ("Cursor + recon", "play 16 (v2 era)", 1),
    ("Apify", "plays 10, 13", 2),
    ("Firecrawl", "play 12", 1),
    ("Vector + Midbound", "plays 5, 8.2", 2),
    ("Salesforce (SOQL)", "play 8", 1),
]

bar_max_w = 340
for tool_name, desc, count in tools:
    draw.text((lx + 4, ly), tool_name, font=fAnnot, fill=TXT)
    bar_x = lx + 160
    bar_w = int((count / 16) * bar_max_w)
    bar_w = max(bar_w, 16)
    draw.rounded_rectangle([bar_x, ly + 2, bar_x + bar_w, ly + 12], radius=3, fill=GREEN if count > 3 else DIM_GREEN)
    draw.text((bar_x + bar_w + 6, ly), desc, font=fAnnot, fill=MUTED)
    ly += 16

Y_START += li_panel_h + PANEL_PAD

# ══════════════════════════════════════════════════════════════
# SECTION 4: WORKFLOW SERIES & TIKTOK PIPELINE (two columns)
# ══════════════════════════════════════════════════════════════
col_w = (W - PAD*2 - PANEL_PAD) // 2
sec4_h = 360

# ── Left: TikTok Series Pipeline ──
tx, ty = panel(PAD, Y_START, col_w, sec4_h, title="TIKTOK SERIES PIPELINE")
ty += 4

tiktok_series = [
    ("Easy Wins w/ Claude Code", "5 queued", "/finalcopy, /viralhooks, /tiktokscript..."),
    ("Cursor in 15 Seconds", "5 queued", "MCP, background agents, skill files..."),
    ("Slash Commands", "5 queued", "/heyreach-export, /linkedin-recon..."),
    ("One Shortcut a Day", "5 queued", "Clay, HeyReach, n8n, Claude, Cursor"),
    ("Do This, Not That", "4 queued", "AI tool edition comparisons"),
    ("GTM Plays: 30-Sec", "5 queued", "plays 1, 5, 10, 14, 16"),
]

for name, count, detail in tiktok_series:
    dot(tx, ty + 4, AMBER)
    draw.text((tx + 12, ty), name, font=fTree, fill=BRIGHT)
    ty += 16
    draw.text((tx + 12, ty), count, font=fAnnot, fill=AMBER)
    cx_t = tx + 12 + draw.textlength(count, font=fAnnot) + 8
    draw.text((cx_t, ty), detail, font=fAnnot, fill=MUTED)
    ty += 20

ty += 6
draw.text((tx, ty), "Cadence: 3x/week -> daily", font=fAnnot, fill=MUTED)
ty += 14
draw.text((tx, ty), "Cross-post: Reels + Shorts + LI video", font=fAnnot, fill=MUTED)

# ── Right: Substack + YouTube + Reddit ──
sx, sy = panel(PAD + col_w + PANEL_PAD, Y_START, col_w, sec4_h, title="EXPANSION PLATFORMS")
sy += 4

# Substack
dot(sx, sy + 4, CYAN)
draw.text((sx + 12, sy), "SUBSTACK (AI Alchemy)", font=fTree, fill=CYAN)
sy += 18
draw.text((sx + 12, sy), "Status: Post 1 next (Content OS reveal)", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Legacy: 4 Beehiiv posts migrated", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Cadence: Weekly/biweekly", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Structures: POV Essay, Tactical,", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "            Contrarian, Curated Drop", font=fAnnot, fill=MUTED); sy += 22

# YouTube
dot(sx, sy + 4, AMBER)
draw.text((sx + 12, sy), "YOUTUBE (Builder & Systems)", font=fTree, fill=AMBER)
sy += 18
draw.text((sx + 12, sy), "Status: Pillar defined, 0 videos", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Types: Build walkthroughs, system", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "       explainers, tool comparisons", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Duration: 12-25 min", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Repurpose: -> TikTok + LI + Substack", font=fAnnot, fill=MUTED); sy += 22

# Reddit
dot(sx, sy + 4, AMBER)
draw.text((sx + 12, sy), "REDDIT (Growth & SEO)", font=fTree, fill=AMBER)
sy += 18
draw.text((sx + 12, sy), "Status: Pillar + targeting defined", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Tier 1: r/ClaudeAI, r/CursorAI,", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "        r/ChatGPT + 6 more subs", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Tier 2: r/Entrepreneur, r/SaaS...", font=fAnnot, fill=MUTED); sy += 14
draw.text((sx + 12, sy), "Goal: SEO + community credibility", font=fAnnot, fill=MUTED)

Y_START += sec4_h + PANEL_PAD

# ══════════════════════════════════════════════════════════════
# SECTION 5: SKILLS TREE (full width)
# ══════════════════════════════════════════════════════════════
skills_h = 520
kx, ky = panel(PAD, Y_START, W - PAD*2, skills_h, title="SKILLS & VOICE SYSTEM")
ky += 4

# Two sub-columns
sub_col_w = (W - PAD*2 - INNER*2) // 2

# Left: Tier 1 + Tier 2
draw.text((kx, ky), "TIER 1: VOICE DNA", font=fAnnot, fill=GREEN)
ky += 16
t1 = [
    ("core-voice.md", "identity, tone, sentence patterns"),
    ("anti-slop.md", "29-pattern AI detection scanner"),
    ("safety-filters.md", "client/partner name protection"),
    ("viral-hooks.md", "scroll-stopping openers"),
]
for name, desc in t1:
    ky = tree_line(kx, ky, "  ├── ", name, f"({desc})")
ky += 10

draw.text((kx, ky), "TIER 2: CONTEXT PLAYBOOKS", font=fAnnot, fill=GREEN)
ky += 16
t2 = [
    ("linkedin.md", "platform voice + formatting"),
    ("x-twitter.md", "compressed, punchy"),
    ("substack.md", "long-form, breathing room"),
    ("tiktok.md", "fast hooks, 16 sec format"),
    ("youtube.md", "narration, build logs"),
    ("client-comms.md", "partner tone"),
    ("internal-team.md", "ops communication"),
]
for name, desc in t2:
    ky = tree_line(kx, ky, "  ├── ", name, f"({desc})")
ky += 10

draw.text((kx, ky), "TIER 3: CONTENT OPS", font=fAnnot, fill=GREEN)
ky += 16
t3_ops = [
    ("pre-publish-checklist.md", "quality gate"),
    ("substance-requirements.md", "depth standards"),
    ("success-patterns.md", "what works"),
    ("pitfalls.md", "what to avoid"),
    ("improvement-protocol.md", "feedback loop"),
    ("captures/", "ideas, thoughts, workflow notes"),
]
for name, desc in t3_ops:
    ky = tree_line(kx, ky, "  ├── ", name, f"({desc})")

# Right column: Cursor Skills
rx2 = kx + sub_col_w + 20
ry2 = ky - (len(t1) + len(t2) + len(t3_ops)) * 18 - 10 * 3 - 16 * 3 + 4

draw.text((rx2, ry2), "CURSOR SKILLS (23 active)", font=fAnnot, fill=GREEN)
ry2 += 16

cursor_skills = [
    ("play-draft", "screenshot -> content"),
    ("skill-play", "skill -> LI + X drafts"),
    ("final-copy", "draft -> plain text + Typefully"),
    ("viral-hooks", "scroll-stopping openers"),
    ("value-pin-comments", "comment generation"),
    ("image-to-content", "image -> drafts"),
    ("content-images", "Pillow-based visuals"),
    ("tiktok-script", "TikTok script gen"),
    ("substack-post", "newsletter drafts"),
    ("agent-context-handoff", "scope/handoff docs"),
    ("heyreach-partner-handoff", "campaign -> CSV -> Slack"),
    ("heyreach-export", "leads to CSV"),
    ("heyreach-conversations", "LI chat history"),
    ("linkedin-comments", "reply generation"),
    ("linkedin-recon", "profile research"),
    ("slack-sync", "channel -> markdown"),
    ("slack-mcp", "Slack integration"),
    ("slack-reminder", "reminder posts"),
    ("email-copy", "cold email + spin text"),
    ("instantly-replies", "email reply fetch"),
    ("notion-sync", "repo -> Notion"),
    ("repo-stats", "value dashboard"),
    ("add-mcp", "MCP server install"),
]

for name, desc in cursor_skills:
    draw.text((rx2, ry2), "  -> ", font=fTree, fill=DIM_GREEN)
    cx_k = rx2 + draw.textlength("  -> ", font=fTree)
    draw.text((cx_k, ry2), name, font=fTree, fill=TXT)
    cx_k += draw.textlength(name, font=fTree) + 6
    draw.text((cx_k, ry2 + 1), desc, font=fAnnot, fill=MUTED)
    ry2 += 16

Y_START += skills_h + PANEL_PAD

# ══════════════════════════════════════════════════════════════
# SECTION 6: CONTENT FLOW DIAGRAM (full width)
# ══════════════════════════════════════════════════════════════
flow_h = 130
fx, fy = panel(PAD, Y_START, W - PAD*2, flow_h, title="CONTENT FLOW")
fy += 8

# Flow: Idea -> Draft -> Final -> Publish -> Repurpose
stages = [
    ("IDEA", "captures/", MUTED),
    ("DRAFT", "/playdraft\n/skillplay", AMBER),
    ("FINAL", "/finalcopy", GREEN),
    ("PUBLISH", "Typefully\nManual", CYAN),
    ("REPURPOSE", "-> Substack\n-> TikTok\n-> Reddit", AMBER),
]

stage_w = (W - PAD*2 - INNER*2) // len(stages)
for i, (label, detail, color) in enumerate(stages):
    cx_f = fx + i * stage_w + stage_w // 2
    # Box
    bw, bh = 130, 34
    draw.rounded_rectangle([cx_f - bw//2, fy, cx_f + bw//2, fy + bh], radius=6, fill=BG, outline=color)
    tw = draw.textlength(label, font=fSub)
    draw.text((cx_f - tw//2, fy + 8), label, font=fSub, fill=color)
    # Arrow
    if i < len(stages) - 1:
        ax = cx_f + bw//2 + 4
        ax2 = fx + (i+1) * stage_w + stage_w // 2 - bw//2 - 4
        ay = fy + bh // 2
        draw.line([(ax, ay), (ax2, ay)], fill=DIM_GREEN, width=2)
        draw.polygon([(ax2, ay-4), (ax2+6, ay), (ax2, ay+4)], fill=DIM_GREEN)
    # Detail below
    for j, line in enumerate(detail.split("\n")):
        lw = draw.textlength(line, font=fAnnot)
        draw.text((cx_f - lw//2, fy + bh + 6 + j * 13), line, font=fAnnot, fill=MUTED)

Y_START += flow_h + PANEL_PAD

# ── Footer ─────────────────────────────────────────────────────
footer = "built with Cursor + Claude Code  |  gtme-os content schematic  |  Feb 2026"
fw = draw.textlength(footer, font=fFoot)
draw.text(((W - fw) / 2, Y_START), footer, font=fFoot, fill=MUTED)

# ── Crop to actual content height ──────────────────────────────
final_h = Y_START + 30
img = img.crop((0, 0, W, final_h))

# ── Save ───────────────────────────────────────────────────────
import os
out = os.path.join(os.path.dirname(__file__), "content-os-schematic.png")
img.save(out, dpi=(144, 144))
print(f"Saved: {out}  ({W}x{final_h})")
