#!/usr/bin/env python3
"""
Freckle CLI workflows carousel — 8 slides, 1080x1350 (LinkedIn portrait).

SVG-based, brand dark theme:
  canvas   #050505
  grid     #16132a
  aura     #6d5ee9   (Clearbox-family violet, the accent)
  aura-lt  #8b7dff
  ink      #fafafa
  muted    #a3a3a3 / #525252

Run:  python3 _gen_freckle_carousel.py
Out:  slide-01.svg ... slide-08.svg in this directory

Export to PNG (any one of these):
  rsvg-convert -w 1080 -h 1350 slide-01.svg -o slide-01.png
  inkscape slide-01.svg --export-filename=slide-01.png -w 1080 -h 1350
  # or open in Figma / drop straight into the LinkedIn doc post as PDF
"""

from pathlib import Path

W, H = 1080, 1350

CANVAS = "#050505"
GRID = "#16132a"
AURA = "#6d5ee9"
AURA_LT = "#8b7dff"
INK = "#fafafa"
SECONDARY = "#a3a3a3"
MUTED = "#525252"
BORDER = "#262626"
CARD = "#0d0d12"

FONT = ("-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, "
        "'Helvetica Neue', Arial, sans-serif")
MONO = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace"

OUT = Path(__file__).parent


# ---------------------------------------------------------------- helpers

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def wrap(text, max_chars):
    """Greedy wrap. Approximate, but predictable at these sizes."""
    words, lines, cur = text.split(), [], ""
    for w in words:
        candidate = f"{cur} {w}".strip()
        if len(candidate) <= max_chars:
            cur = candidate
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def text(x, y, s, size=32, fill=INK, weight="400", anchor="start",
         font=FONT, spacing="0"):
    return (f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" '
            f'fill="{fill}" font-weight="{weight}" text-anchor="{anchor}" '
            f'letter-spacing="{spacing}">{esc(s)}</text>')


def block(x, y, lines, size, fill, weight="400", leading=1.28, max_chars=30,
          anchor="start", font=FONT, spacing="0"):
    """Wrapped multi-line text. Returns (svg, y_after)."""
    out, cy = [], y
    for line in lines:
        for piece in wrap(line, max_chars):
            out.append(text(x, cy, piece, size, fill, weight, anchor, font,
                            spacing))
            cy += int(size * leading)
    return "\n".join(out), cy


def backdrop(accent_glow=True):
    """Canvas, grid, and a soft aura glow in the corner."""
    parts = [f'<rect width="{W}" height="{H}" fill="{CANVAS}"/>']
    for gx in range(0, W + 1, 90):
        parts.append(f'<line x1="{gx}" y1="0" x2="{gx}" y2="{H}" '
                     f'stroke="{GRID}" stroke-width="1"/>')
    for gy in range(0, H + 1, 90):
        parts.append(f'<line x1="0" y1="{gy}" x2="{W}" y2="{gy}" '
                     f'stroke="{GRID}" stroke-width="1"/>')
    if accent_glow:
        parts.append(
            '<circle cx="880" cy="150" r="420" fill="url(#glow)" opacity="0.5"/>')
    return "\n".join(parts)


def defs():
    return f'''<defs>
  <radialGradient id="glow">
    <stop offset="0%" stop-color="{AURA}" stop-opacity="0.30"/>
    <stop offset="100%" stop-color="{AURA}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="{AURA}"/>
    <stop offset="100%" stop-color="{AURA}" stop-opacity="0"/>
  </linearGradient>
</defs>'''


def chrome(n, total=8, label="freckle cli"):
    """Top accent rule + footer."""
    return "\n".join([
        f'<rect x="80" y="96" width="180" height="4" fill="url(#rule)"/>',
        text(80, 1272, label, 24, MUTED, "500", spacing="1.5"),
        text(W - 80, 1272, f"{n:02d} / {total:02d}", 24, MUTED, "500",
             anchor="end", font=MONO),
        text(80, 1226, "shawn ⚡ the GTM alchemist", 26, SECONDARY, "500"),
    ])


def eyebrow(y, s):
    return text(80, y, s.upper(), 24, AURA_LT, "700", spacing="3")


def flow(nodes, y0, box_h=104, gap=30, x=80, w=920):
    """Vertical workflow diagram. nodes = [(step, label, caption), ...]"""
    parts, y = [], y0
    for i, (step, label, caption) in enumerate(nodes):
        parts.append(
            f'<rect x="{x}" y="{y}" width="{w}" height="{box_h}" rx="16" '
            f'fill="{CARD}" stroke="{BORDER}" stroke-width="1.5"/>')
        # step chip
        parts.append(
            f'<rect x="{x + 24}" y="{y + int(box_h/2) - 21}" width="42" '
            f'height="42" rx="11" fill="{AURA}" opacity="0.16"/>')
        parts.append(text(x + 45, y + int(box_h / 2) + 8, step, 24, AURA_LT,
                          "700", anchor="middle", font=MONO))
        if caption:
            parts.append(text(x + 90, y + 44, label, 34, INK, "600"))
            parts.append(text(x + 90, y + 78, caption, 24, SECONDARY, "400"))
        else:
            parts.append(text(x + 90, y + int(box_h / 2) + 11, label, 34, INK,
                              "600"))
        # arrow
        if i < len(nodes) - 1:
            ax, ay = x + 47, y + box_h
            parts.append(f'<line x1="{ax}" y1="{ay + 4}" x2="{ax}" '
                         f'y2="{ay + gap - 10}" stroke="{AURA}" '
                         f'stroke-width="2.5" opacity="0.6"/>')
            parts.append(
                f'<path d="M {ax - 6} {ay + gap - 14} L {ax} {ay + gap - 5} '
                f'L {ax + 6} {ay + gap - 14} Z" fill="{AURA}" opacity="0.8"/>')
        y += box_h + gap
    return "\n".join(parts), y


def svg(body, n):
    doc = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
           f'viewBox="0 0 {W} {H}">\n{defs()}\n{backdrop()}\n{body}\n'
           f'{chrome(n)}\n</svg>')
    (OUT / f"slide-{n:02d}.svg").write_text(doc)
    print(f"  slide-{n:02d}.svg")


# ---------------------------------------------------------------- slides

def slide_01():
    p = [eyebrow(180, "week one with the cli")]
    t, y = block(80, 340, ["three workflows I ran through the Freckle CLI"],
                 80, INK, "700", leading=1.18, max_chars=22)
    p.append(t)
    p.append(f'<rect x="80" y="{y + 40}" width="120" height="4" fill="{AURA}"/>')
    s, y2 = block(80, y + 148, [
        "signups out of Convex.",
        "de-masking site traffic.",
        "AI answer citations.",
    ], 42, SECONDARY, "400", leading=1.5, max_chars=34)
    p.append(s)
    p.append(text(80, y2 + 84, "the third one surprised me.", 36, AURA_LT,
                  "600"))
    svg("\n".join(p), 1)


def slide_02():
    p = [eyebrow(180, "what actually changed")]
    t, _ = block(80, 268, ["enrichment stopped being a tab I open"], 60, INK,
                 "700", leading=1.2, max_chars=26)
    p.append(t)

    p.append(f'<rect x="80" y="470" width="920" height="290" rx="18" '
             f'fill="{CARD}" stroke="{BORDER}" stroke-width="1.5"/>')
    p.append(text(120, 534, "THE OLD SHAPE", 24, MUTED, "700", spacing="2"))
    old, _ = block(120, 590, [
        "open a tab -> build a table -> wait on the run "
        "-> export a CSV -> hand it to the script that "
        "needed the data",
    ], 30, SECONDARY, "400", leading=1.4, max_chars=42)
    p.append(old)

    p.append(f'<rect x="80" y="800" width="920" height="230" rx="18" '
             f'fill="{CARD}" stroke="{AURA}" stroke-width="2" opacity="0.95"/>')
    p.append(text(120, 864, "THE NEW SHAPE", 24, AURA_LT, "700", spacing="2"))
    new, _ = block(120, 920, [
        "the agent calls enrichment mid-run, gets rows "
        "back, and keeps going",
    ], 32, INK, "500", leading=1.4, max_chars=40)
    p.append(new)

    p.append(text(80, 1110, "the table was never the point.", 34, INK, "600"))
    p.append(text(80, 1152, "the thing downstream was the point.", 34, AURA_LT,
                  "600"))
    svg("\n".join(p), 2)


def slide_03():
    p = [eyebrow(180, "workflow 01")]
    t, _ = block(80, 262, ["signups, out of Convex"], 62, INK, "700",
                 leading=1.2, max_chars=26)
    p.append(t)
    p.append(text(80, 330, "a signup is a row the second someone signs up",
                  28, SECONDARY, "400"))
    f, _ = flow([
        ("1", "pull", "new signup rows since the last run"),
        ("2", "gate", "free + personal domains to a holding table"),
        ("3", "enrich", "company domain first, person second"),
        ("4", "write back", "profile stored next to the signup row"),
        ("5", "brief", "three sentences into Notion, before the call"),
    ], 420)
    p.append(f)
    svg("\n".join(p), 3)


def slide_04():
    p = [eyebrow(180, "the cheapest step")]
    t, _ = block(80, 268, ["gate before you spend"], 68, INK, "700",
                 leading=1.2, max_chars=24)
    p.append(t)

    p.append(f'<rect x="80" y="430" width="920" height="360" rx="18" '
             f'fill="{CARD}" stroke="{BORDER}" stroke-width="1.5"/>')
    b, _ = block(124, 508, [
        "enriching a person on a gmail address costs "
        "the same as a real one and resolves about "
        "half the time.",
    ], 38, INK, "500", leading=1.42, max_chars=34)
    p.append(b)
    p.append(text(124, 742, "ten minutes of code.", 32, AURA_LT, "600"))

    p.append(text(80, 884, "it changed the cost of the whole run:", 32,
                  SECONDARY, "400"))
    rows = [
        ("free / personal domain", "holding table, no person lookup"),
        ("company domain", "enrich, then score, then route"),
    ]
    y = 930
    for label, caption in rows:
        p.append(f'<rect x="80" y="{y}" width="920" height="96" rx="14" '
                 f'fill="{CARD}" stroke="{BORDER}" stroke-width="1.5"/>')
        p.append(f'<rect x="80" y="{y}" width="5" height="96" rx="2" '
                 f'fill="{AURA}"/>')
        p.append(text(120, y + 40, label, 32, INK, "600"))
        p.append(text(120, y + 74, caption, 25, SECONDARY, "400"))
        y += 116
    svg("\n".join(p), 4)


def slide_05():
    p = [eyebrow(180, "workflow 02")]
    t, _ = block(80, 262, ["de-masking site traffic"], 62, INK, "700",
                 leading=1.2, max_chars=26)
    p.append(t)
    p.append(text(80, 330, "the reveal is the cheap part. the restraint is not.",
                  28, SECONDARY, "400"))
    f, _ = flow([
        ("1", "resolve", "anonymous session to company"),
        ("2", "filter", "pricing + docs stay, homepage bounces drop"),
        ("3", "enrich", "only the domains that survived the filter"),
        ("4", "score", "ICP fit combined with the page signal"),
        ("5", "route", "top slice to a human, the rest waits"),
    ], 420)
    p.append(f)
    svg("\n".join(p), 5)


def slide_06():
    p = [eyebrow(180, "workflow 03")]
    t, _ = block(80, 262, ["AI answer citations"], 62, INK, "700",
                 leading=1.2, max_chars=26)
    p.append(t)
    p.append(text(80, 330, "nothing to do with contact data", 28, SECONDARY,
                  "400"))
    f, _ = flow([
        ("1", "query set", "real buyer questions, not keywords"),
        ("2", "capture", "the answers, and every source they cite"),
        ("3", "extract", "the domains behind the citations"),
        ("4", "enrich", "community, publisher, review site, competitor"),
        ("5", "diff", "which repeat, and which you are absent from"),
    ], 420)
    p.append(f)
    svg("\n".join(p), 6)


def slide_07():
    p = [eyebrow(180, "where it lands")]
    t, _ = block(80, 268, ["the run writes its own docs"], 60, INK, "700",
                 leading=1.2, max_chars=26)
    p.append(t)

    p.append(f'<rect x="80" y="470" width="920" height="250" rx="18" '
             f'fill="{CARD}" stroke="{AURA}" stroke-width="2"/>')
    p.append(text(124, 540, "CONNECT -> NOTION", 26, AURA_LT, "700",
                  spacing="2"))
    b, _ = block(124, 600, [
        "the workflow lives where the team already reads. "
        "screenshots in Slack are not documentation.",
    ], 32, INK, "500", leading=1.4, max_chars=40)
    p.append(b)

    p.append(f'<rect x="80" y="770" width="920" height="250" rx="18" '
             f'fill="{CARD}" stroke="{BORDER}" stroke-width="1.5"/>')
    p.append(text(124, 840, "ENRICHMENT HOURS", 26, AURA_LT, "700",
                  spacing="2"))
    b2, _ = block(124, 900, [
        "credits price a row. hours price the work. "
        "count credits and you hoard them.",
    ], 32, INK, "500", leading=1.4, max_chars=40)
    p.append(b2)

    p.append(text(80, 1110, "gate first. enrich the survivors.", 34, INK,
                  "600"))
    p.append(text(80, 1152, "let the expensive passes run overnight.", 34,
                  AURA_LT, "600"))
    svg("\n".join(p), 7)


def slide_08():
    p = [eyebrow(180, "no gatekeeping")]
    t, y = block(80, 330, ["all three are skill files"], 70, INK, "700",
                 leading=1.2, max_chars=22)
    p.append(t)
    p.append(f'<rect x="80" y="{y + 32}" width="120" height="4" fill="{AURA}"/>')

    s, y2 = block(80, y + 128, [
        "same shape as reddit-buyer-signals. "
        "drop one into Claude Code, Codex, or Gemini and it runs.",
    ], 34, SECONDARY, "400", leading=1.42, max_chars=38)
    p.append(s)

    p.append(f'<rect x="80" y="{y2 + 60}" width="920" height="104" rx="16" '
             f'fill="{CARD}" stroke="{AURA}" stroke-width="2"/>')
    p.append(text(124, y2 + 126, "github.com/shawnla90/gtm-coding-agent", 32,
                  AURA_LT, "600", font=MONO))

    p.append(text(80, y2 + 260, "thanks to Andy at Freckle", 36, INK, "600"))
    p.append(text(80, y2 + 306, "for the first dibs on the CLI ⚡", 36,
                  SECONDARY, "400"))
    svg("\n".join(p), 8)


if __name__ == "__main__":
    print("generating freckle workflows carousel (1080x1350)")
    for fn in (slide_01, slide_02, slide_03, slide_04, slide_05, slide_06,
               slide_07, slide_08):
        fn()
    print("done. 8 slides in", OUT)
