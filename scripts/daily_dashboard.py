#!/usr/bin/env python3
"""
Daily dashboard image generator v3 — renders a Pillow card from data/daily-log/YYYY-MM-DD.json.
Follows the content-images design system (flat dark, Menlo, no AI slop).

v3: Letter grade badge, scoring breakdown, cache-aware token costs, source labels.

Usage:
    python3 scripts/daily_dashboard.py              # render today
    python3 scripts/daily_dashboard.py --date 2026-02-11   # render specific date
"""

import argparse
import json
import math
from datetime import datetime, timedelta
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ── Paths ────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_DIR = REPO_ROOT / "data" / "daily-log"
PROGRESSION_DIR = REPO_ROOT / "data" / "progression"
AVATAR_DIR = PROGRESSION_DIR / "avatars"

# ── Design System (matches .cursor/skills/content-images) ───────────

BG      = (12, 13, 17)
PANEL   = (22, 24, 30)
BORDER  = (40, 44, 54)
GREEN   = (78, 195, 115)
TXT     = (185, 195, 210)
BRIGHT  = (230, 236, 245)
MUTED   = (100, 110, 128)
AMBER   = (220, 170, 60)
RED_DIM = (180, 70, 70)
CYAN    = (80, 190, 220)
PURPLE  = (160, 120, 220)
GOLD    = (255, 200, 60)

WIDTH  = 1400
HEIGHT = 960
PAD    = 24
INNER  = 20
PANEL_GAP = 14
RADIUS = 10
LH     = 18  # line height for body text

# ── RPG Tier Colors (match AvatarBadge.tsx / plan spec) ──────────────

TIER_COLORS = {
    1: (136, 146, 164),   # Muted gray  #8892A4
    2: (78, 195, 115),    # Green       #4EC373
    3: (80, 190, 220),    # Cyan        #50BEDC
    4: (220, 170, 60),    # Amber       #DCAA3C
    5: (160, 120, 220),   # Purple      #A078DC
    6: (255, 200, 60),    # Gold        #FFC83C
}

# ── Fonts ────────────────────────────────────────────────────────────

MENLO = "/System/Library/Fonts/Menlo.ttc"

try:
    fTitle  = ImageFont.truetype(MENLO, 22, index=1)   # bold
    fGrade  = ImageFont.truetype(MENLO, 28, index=1)   # grade badge
    fHead   = ImageFont.truetype(MENLO, 15, index=1)   # panel headers
    fBody   = ImageFont.truetype(MENLO, 12, index=0)   # body text
    fSmall  = ImageFont.truetype(MENLO, 10, index=0)   # annotations
    fTiny   = ImageFont.truetype(MENLO, 9, index=0)    # timestamps
    fFooter = ImageFont.truetype(MENLO, 10, index=0)   # footer
    fStat   = ImageFont.truetype(MENLO, 20, index=1)   # big stat numbers
    fStatLbl = ImageFont.truetype(MENLO, 10, index=0)  # stat labels
except OSError:
    fTitle  = ImageFont.load_default()
    fGrade  = fTitle
    fHead   = fTitle
    fBody   = fTitle
    fSmall  = fTitle
    fTiny   = fTitle
    fFooter = fTitle
    fStat   = fTitle
    fStatLbl = fTitle

# ── Token pricing (cache-aware, per million tokens) ──────────────────

TOKEN_PRICING = {
    "opus":   {"input": 15.00, "output": 75.00, "cache_read": 1.50,  "cache_write": 18.75},
    "sonnet": {"input": 3.00,  "output": 15.00, "cache_read": 0.30,  "cache_write": 3.75},
    "haiku":  {"input": 0.25,  "output": 1.25,  "cache_read": 0.025, "cache_write": 0.3125},
    "gpt4o":  {"input": 2.50,  "output": 10.00, "cache_read": 0.25,  "cache_write": 3.125},
    "cursor": {"input": 0.00,  "output": 0.00,  "cache_read": 0.00,  "cache_write": 0.00},
}

# ── RPG / Avatar helpers ─────────────────────────────────────────────

def compute_streak(log_dir, current_date_str):
    """Count consecutive days (including today) with grade B+ or better.
    Reads last 7 JSON files, walks backward from current date.
    """
    try:
        current = datetime.strptime(current_date_str, "%Y-%m-%d")
    except ValueError:
        return 0
    good_grades = {"S+", "S", "A+", "A", "B"}
    streak = 0
    for day_offset in range(7):
        dt = current - timedelta(days=day_offset)
        path = log_dir / f"{dt.strftime('%Y-%m-%d')}.json"
        if not path.exists():
            break
        try:
            data = json.loads(path.read_text())
            grade = data.get("stats", {}).get("letter_grade", "")
            if grade not in good_grades:
                break
            streak += 1
        except (json.JSONDecodeError, IOError):
            break
    return streak


def load_rpg_profile():
    """Load RPG profile from data/progression/profile.json."""
    profile_path = PROGRESSION_DIR / "profile.json"
    if not profile_path.exists():
        return None
    try:
        return json.loads(profile_path.read_text())
    except (json.JSONDecodeError, IOError):
        return None


def load_avatar_image(size=64):
    """Load current.png and resize for dashboard embed (nearest-neighbor for pixel art)."""
    avatar_path = AVATAR_DIR / "current.png"
    if not avatar_path.exists():
        return None
    try:
        img = Image.open(str(avatar_path)).convert("RGBA")
        img = img.resize((size, size), Image.NEAREST)
        return img
    except Exception:
        return None


def draw_xp_bar(draw, x, y, width, height, xp_current, xp_next, fill_color):
    """Draw an XP progress bar with rounded ends."""
    r = height // 2
    # Background track
    bar_bg = tuple(min(c + 8, 255) for c in PANEL)
    draw.rounded_rectangle([x, y, x + width, y + height], radius=r, fill=bar_bg, outline=BORDER)
    # Fill
    pct = min(xp_current / xp_next, 1.0) if xp_next > 0 else 0
    fill_w = max(int((width - 4) * pct), 0)
    if fill_w > 0:
        inner_r = max((height - 4) // 2, 1)
        draw.rounded_rectangle(
            [x + 2, y + 2, x + 2 + fill_w, y + height - 2],
            radius=inner_r, fill=fill_color,
        )


# ── Drawing helpers ──────────────────────────────────────────────────

def draw_panel(draw, x, y, w, h):
    """Draw a rounded-rect panel with border."""
    draw.rounded_rectangle([x, y, x + w, y + h], radius=RADIUS, fill=PANEL, outline=BORDER)


def truncate(text, font, max_width, draw):
    """Truncate text with ellipsis if it exceeds max_width."""
    if draw.textlength(text, font=font) <= max_width:
        return text
    while len(text) > 0 and draw.textlength(text + "...", font=font) > max_width:
        text = text[:-1]
    return text + "..."


def format_type(type_code):
    """Convert type_code to short display label."""
    labels = {
        "substack_draft": "SUB draft",
        "substack_final": "SUB FINAL",
        "linkedin_draft": "LI draft",
        "linkedin_final": "LI FINAL",
        "x_draft": "X draft",
        "x_final": "X FINAL",
        "tiktok_draft": "TT draft",
        "tiktok_final": "TT FINAL",
        "reddit_draft": "RD draft",
        "reddit_final": "RD FINAL",
        "lead_magnet": "Lead magnet",
        "skill_created": "New skill",
        "skill_updated": "Skill",
        "workflow_updated": "Workflow",
        "script": "Script",
        "manual": "Manual",
        "monorepo_build": "Monorepo",
        "feature_system": "Feature",
        "landing_page": "Landing",
        "system_engine": "Engine",
        "feature_script": "System",
        "complex_script": "Script+",
        "code_infra": "Infra",
        "website_page": "Page",
        "website_component": "Component",
        "website_lib": "Lib",
        "website_config": "Config",
    }
    return labels.get(type_code, type_code.replace("_", " "))


def type_color(type_code):
    """Return accent color for accomplishment type."""
    if "final" in type_code:
        return GREEN
    if type_code == "manual":
        return AMBER
    return TXT


def draw_stat_box(draw, x, y, w, h, value, label, color):
    """Draw a stat card with big number + small label."""
    draw.rounded_rectangle([x, y, x + w, y + h], radius=6, fill=PANEL, outline=BORDER)
    val_str = str(value)
    vw = draw.textlength(val_str, font=fStat)
    draw.text((x + (w - vw) / 2, y + 8), val_str, font=fStat, fill=color)
    lw = draw.textlength(label, font=fStatLbl)
    draw.text((x + (w - lw) / 2, y + h - 20), label, font=fStatLbl, fill=MUTED)


def format_cost(cost_usd):
    """Format a cost value nicely."""
    if cost_usd < 0.01:
        return f"${cost_usd:.4f}"
    if cost_usd < 1.0:
        return f"${cost_usd:.3f}"
    return f"${cost_usd:.2f}"


def format_tokens(n):
    """Format token count as human-readable."""
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
    return str(n)


def compute_token_cost(entry):
    """Compute cost for a token_usage entry using cache-aware pricing."""
    if entry.get("cost") is not None:
        return entry["cost"]

    model = entry.get("model", "sonnet").lower()
    pricing = TOKEN_PRICING.get(model, TOKEN_PRICING["sonnet"])

    inp = entry.get("input_tokens", 0)
    out = entry.get("output_tokens", 0)
    cache_read = entry.get("cache_read_tokens", 0)
    cache_write = entry.get("cache_write_tokens", 0)

    cost = (
        (inp / 1_000_000 * pricing["input"])
        + (out / 1_000_000 * pricing["output"])
        + (cache_read / 1_000_000 * pricing["cache_read"])
        + (cache_write / 1_000_000 * pricing["cache_write"])
    )
    return cost


ORANGE = (255, 107, 53)  # S+ grade color


def grade_color(grade):
    """Return color for a letter grade."""
    if grade == "S+":
        return ORANGE
    if grade == "S":
        return GOLD
    if grade in ("A+", "A"):
        return GREEN
    if grade == "B":
        return CYAN
    if grade == "C":
        return AMBER
    return RED_DIM


def draw_grade_badge(draw, x, y, grade):
    """Draw a rounded pill badge with the letter grade."""
    gc = grade_color(grade)
    gw = draw.textlength(grade, font=fGrade)
    pill_w = int(gw + 24)
    pill_h = 36
    # Pill background (slightly brighter than panel)
    pill_bg = tuple(min(c + 15, 255) for c in PANEL)
    draw.rounded_rectangle(
        [x, y, x + pill_w, y + pill_h],
        radius=pill_h // 2, fill=pill_bg, outline=gc, width=2
    )
    # Grade text centered
    draw.text((x + (pill_w - gw) / 2, y + 3), grade, font=fGrade, fill=gc)
    return pill_w


# ── Main render ──────────────────────────────────────────────────────

def render_dashboard(data, output_path):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    d = ImageDraw.Draw(img)

    date_str = data.get("date", "unknown")
    accomplishments = data.get("accomplishments", [])
    todos = data.get("todos", [])
    pipeline = data.get("pipeline", {})
    git = data.get("git_summary", {})
    stats = data.get("stats", {})
    token_usage = data.get("token_usage", [])
    drafts_active = pipeline.get("drafts_active", [])
    finalized_today = pipeline.get("finalized_today", [])

    # ── Load RPG avatar data ─────────────────────────────────────────
    rpg_profile = load_rpg_profile()
    avatar_img = load_avatar_image(64)

    # ── Header with avatar panel + grade badge ───────────────────────
    y = PAD
    header_left = PAD  # x offset for title (shifts right if avatar present)

    if rpg_profile and avatar_img:
        avatar_size = 64
        border_pad = 3
        tier = rpg_profile.get("avatar_tier", 1)
        tier_color = TIER_COLORS.get(tier, MUTED)

        # Avatar border rectangle
        ax, ay = PAD, PAD
        d.rounded_rectangle(
            [ax - border_pad, ay - border_pad,
             ax + avatar_size + border_pad, ay + avatar_size + border_pad],
            radius=6, fill=PANEL, outline=tier_color, width=2,
        )

        # Paste avatar sprite onto the dashboard (handle RGBA → RGB)
        avatar_rgb = Image.new("RGB", avatar_img.size, BG)
        avatar_rgb.paste(avatar_img, mask=avatar_img.split()[3] if avatar_img.mode == "RGBA" else None)
        img.paste(avatar_rgb, (ax, ay))

        # RPG info to the right of avatar
        info_x = ax + avatar_size + border_pad + 12

        level = rpg_profile.get("level", 0)
        rpg_title = rpg_profile.get("title", "Terminal Initiate")
        rpg_class = rpg_profile.get("class", "Builder")
        xp_total = rpg_profile.get("xp_total", 0)
        xp_next = rpg_profile.get("xp_next_level", 100)

        # Line 1: Level + Title
        level_text = f"Lv.{level}"
        d.text((info_x, ay + 4), level_text, font=fHead, fill=tier_color)
        lv_w = d.textlength(level_text, font=fHead)
        d.text((info_x + lv_w + 8, ay + 5), rpg_title, font=fHead, fill=BRIGHT)

        # Line 2: Class tag
        class_text = f"[{rpg_class}]"
        d.text((info_x, ay + 24), class_text, font=fSmall, fill=MUTED)

        # Line 3: XP progress bar + XP text
        xp_bar_y = ay + 42
        xp_bar_w = 180
        xp_bar_h = 10
        draw_xp_bar(d, info_x, xp_bar_y, xp_bar_w, xp_bar_h, xp_total, xp_next, tier_color)
        xp_text = f"{xp_total:,}/{xp_next:,} XP"
        d.text((info_x + xp_bar_w + 8, xp_bar_y - 1), xp_text, font=fSmall, fill=MUTED)

        # Shift header title to the right of the avatar block
        header_left = info_x + xp_bar_w + d.textlength(xp_text, font=fSmall) + 32

    # ── Title + grade badge ──────────────────────────────────────────
    d.text((header_left, y), "DAILY TRACKER", font=fTitle, fill=GREEN)
    title_w = d.textlength("DAILY TRACKER", font=fTitle)

    # Grade badge next to title
    letter_grade = stats.get("letter_grade", "")
    output_score = stats.get("output_score", 0)
    badge_x = header_left + title_w + 16
    if letter_grade:
        badge_w = draw_grade_badge(d, badge_x, y - 4, letter_grade)
        # Score text next to badge
        score_text = f"{output_score} pts"
        d.text((badge_x + badge_w + 10, y + 6), score_text, font=fSmall, fill=grade_color(letter_grade))

    date_display = datetime.strptime(date_str, "%Y-%m-%d").strftime("%A, %b %d %Y") if date_str != "unknown" else date_str
    date_w = d.textlength(date_display, font=fTitle)
    d.text((WIDTH - PAD - date_w, y), date_display, font=fTitle, fill=BRIGHT)

    # Streak indicator (consecutive B+ days)
    streak = compute_streak(LOG_DIR, date_str) if date_str != "unknown" else 0
    if streak >= 2:
        streak_text = f"{streak}-day streak"
        sw = d.textlength(streak_text, font=fSmall)
        d.text((WIDTH - PAD - date_w - sw - 12, y + 8), streak_text, font=fSmall, fill=GREEN)

    # y advances past the avatar block or the title, whichever is taller
    if rpg_profile and avatar_img:
        y = PAD + 64 + 6 + 12  # avatar height + border padding + gap
    else:
        y += 36

    # ── Stat boxes row ───────────────────────────────────────────────
    pending_count = len([t for t in todos if t.get("status") == "pending"])
    words_today = stats.get("words_today", 0)
    finals_count = stats.get("finals_count", len(finalized_today))
    commits = git.get("commits_today", 0)
    files_touched = len(git.get("files_added", [])) + len(git.get("files_modified", []))

    # Token totals (cache-aware)
    total_input_tokens = sum(e.get("input_tokens", 0) for e in token_usage)
    total_output_tokens = sum(e.get("output_tokens", 0) for e in token_usage)
    total_cache_read = sum(e.get("cache_read_tokens", 0) for e in token_usage)
    total_cache_write = sum(e.get("cache_write_tokens", 0) for e in token_usage)
    total_all_tokens = total_input_tokens + total_output_tokens + total_cache_read + total_cache_write
    total_cost = sum(compute_token_cost(e) for e in token_usage)

    stat_items = [
        (len(accomplishments), "shipped", GREEN),
        (finals_count, "finalized", GREEN if finals_count > 0 else MUTED),
        (pending_count, "pending", AMBER if pending_count > 0 else MUTED),
        (len(drafts_active), "in pipeline", TXT),
        (f"{words_today:,}", "words today", CYAN),
        (commits, "commits", MUTED),
        (files_touched, "files touched", MUTED),
    ]

    # ROI, ship rate, dev-equivalent value (before token stats)
    roi = stats.get("roi_multiplier", 0)
    ship_rate = stats.get("ship_rate", 0)
    dev_equiv = stats.get("dev_equivalent_cost") or stats.get("dev_equivalent_breakdown", {}).get("total")
    if roi > 0:
        stat_items.append((f"{roi:,.0f}x", "ROI", GOLD))
    if ship_rate > 0:
        stat_items.append((f"{ship_rate*100:.0f}%", "ship rate", GREEN))
    if dev_equiv and dev_equiv >= 100:
        val_str = f"~${dev_equiv/1000:.1f}K" if dev_equiv >= 1000 else f"~${dev_equiv:.0f}"
        stat_items.append((val_str, "value", GREEN))

    # Add token stats if any usage logged
    if token_usage:
        stat_items.append((format_tokens(total_all_tokens), "tokens", PURPLE))
        stat_items.append((format_cost(total_cost), "est. cost", PURPLE))

    box_count = len(stat_items)
    box_gap = 10
    box_w = (WIDTH - PAD * 2 - box_gap * (box_count - 1)) // box_count
    box_h = 58
    for i, (val, label, color) in enumerate(stat_items):
        bx = PAD + i * (box_w + box_gap)
        draw_stat_box(d, bx, y, box_w, box_h, val, label, color)

    y += box_h + 12

    # ── Activity range + score summary ───────────────────────────────
    first_act = stats.get("first_activity")
    last_act = stats.get("last_activity")
    if first_act and last_act:
        range_text = f"active {first_act} – {last_act}"
    elif first_act:
        range_text = f"active from {first_act}"
    else:
        range_text = ""

    # Score summary on the right (e.g. "10+10+5+5+2+2 = 34 pts  A")
    score_breakdown = stats.get("score_breakdown", [])
    if score_breakdown and output_score > 0:
        pts_parts = [str(sb["points"]) for sb in score_breakdown]
        # Limit displayed parts to avoid overflow
        if len(pts_parts) > 8:
            shown = pts_parts[:7]
            score_summary = "+".join(shown) + f"+... = {output_score} pts"
        else:
            score_summary = "+".join(pts_parts) + f" = {output_score} pts"
        sw = d.textlength(score_summary, font=fSmall)
        d.text((WIDTH - PAD - sw, y), score_summary, font=fSmall, fill=grade_color(letter_grade))
    elif range_text:
        rw = d.textlength(range_text, font=fSmall)
        d.text((WIDTH - PAD - rw, y), range_text, font=fSmall, fill=MUTED)

    # Platform breakdown bar (left side)
    breakdown = stats.get("platform_breakdown", {})
    if breakdown:
        plat_parts = []
        plat_colors = {"linkedin": CYAN, "x": TXT, "substack": GREEN, "reddit": AMBER, "tiktok": PURPLE, "website": GREEN, "other": MUTED}
        for plat, count in sorted(breakdown.items(), key=lambda x: -x[1]):
            plat_parts.append((f"{plat[:3].upper()}:{count}", plat_colors.get(plat, TXT)))
        sx = PAD
        for label, color in plat_parts:
            d.text((sx, y), label, font=fSmall, fill=color)
            sx += d.textlength(label, font=fSmall) + 16

        # Activity range after platform breakdown if score summary took the right side
        if score_breakdown and range_text:
            d.text((sx + 8, y), range_text, font=fSmall, fill=MUTED)
    y += 18

    # ── Separator line ───────────────────────────────────────────────
    d.line([(PAD, y), (WIDTH - PAD, y)], fill=BORDER, width=1)
    y += PANEL_GAP

    # ── Panel dimensions ─────────────────────────────────────────────
    panel_top = y
    # Three-column layout: Accomplishments | TODOs+Pipeline | Token Usage
    if token_usage:
        panel_w_left = int((WIDTH - PAD * 2 - PANEL_GAP * 2) * 0.40)
        panel_w_mid = int((WIDTH - PAD * 2 - PANEL_GAP * 2) * 0.32)
        panel_w_right = WIDTH - PAD * 2 - PANEL_GAP * 2 - panel_w_left - panel_w_mid
    else:
        panel_w_left = (WIDTH - PAD * 2 - PANEL_GAP) // 2
        panel_w_mid = panel_w_left
        panel_w_right = 0

    panel_h = HEIGHT - panel_top - 40  # room for footer

    # ── LEFT PANEL: Accomplishments ──────────────────────────────────
    lx = PAD
    draw_panel(d, lx, panel_top, panel_w_left, panel_h)

    iy = panel_top + INNER
    d.text((lx + INNER, iy), "ACCOMPLISHMENTS", font=fHead, fill=BRIGHT)
    acc_count_label = f" ({len(accomplishments)})"
    hw = d.textlength("ACCOMPLISHMENTS", font=fHead)
    d.text((lx + INNER + hw, iy), acc_count_label, font=fSmall, fill=MUTED)
    iy += 24

    if not accomplishments:
        d.text((lx + INNER + 16, iy), "No activity detected yet.", font=fBody, fill=MUTED)
    else:
        # Top 3 contributors by value_score (for star highlight)
        acc_with_pts = [(i, acc.get("value_score", 0) or acc.get("points", 0)) for i, acc in enumerate(accomplishments)]
        acc_with_pts.sort(key=lambda x: -x[1])
        top_indices = {acc_with_pts[j][0] for j in range(min(3, len(acc_with_pts))) if acc_with_pts[j][1] > 0}

        for idx, acc in enumerate(accomplishments):
            if iy > panel_top + panel_h - 26:
                remaining = len(accomplishments) - idx
                d.text((lx + INNER + 16, iy), f"... +{remaining} more", font=fSmall, fill=MUTED)
                break

            tc = type_color(acc.get("type", ""))

            # Timestamp on the left edge
            ts = acc.get("timestamp", "")
            if ts:
                d.text((lx + INNER, iy + 1), ts, font=fTiny, fill=MUTED)
                ts_offset = d.textlength("00:00 ", font=fTiny) + 4
            else:
                ts_offset = 0

            tag = format_type(acc.get("type", ""))
            star = " ★" if idx in top_indices else ""
            tag_text = f"[{tag}]{star}"
            d.text((lx + INNER + ts_offset, iy), tag_text, font=fSmall, fill=GOLD if idx in top_indices else MUTED)
            tag_w = d.textlength(tag_text + " ", font=fSmall)

            title = acc.get("title", "untitled")
            # Show word count if available
            wc = acc.get("words")
            suffix = f" ({wc}w)" if wc and wc > 0 else ""
            title_full = title + suffix
            avail_w = panel_w_left - INNER * 2 - ts_offset - tag_w - 10
            title_full = truncate(title_full, fBody, avail_w, d)
            d.text((lx + INNER + ts_offset + tag_w, iy), title_full, font=fBody, fill=tc)
            iy += LH + 3

    # ── MIDDLE PANEL: TODOs + Pipeline ───────────────────────────────
    rx = lx + panel_w_left + PANEL_GAP
    draw_panel(d, rx, panel_top, panel_w_mid, panel_h)

    ry = panel_top + INNER
    d.text((rx + INNER, ry), "NEXT UP", font=fHead, fill=BRIGHT)
    ry += 24

    max_mid_w = panel_w_mid - INNER * 2 - 20

    # TODOs section
    pending_todos = [t for t in todos if t.get("status") == "pending"]
    done_todos = [t for t in todos if t.get("status") == "done"]

    # High priority first
    pending_todos.sort(key=lambda t: 0 if t.get("priority") == "high" else 1)

    if pending_todos:
        for todo in pending_todos:
            if ry > panel_top + panel_h - 60:
                break
            priority = todo.get("priority", "normal")
            pc = AMBER if priority == "high" else TXT
            marker = ">" if priority == "high" else "-"
            d.text((rx + INNER, ry), marker, font=fBody, fill=pc)
            task_text = truncate(todo.get("task", ""), fBody, max_mid_w, d)
            d.text((rx + INNER + 14, ry), task_text, font=fBody, fill=pc)
            ry += LH + 3

    if done_todos:
        for todo in done_todos:
            if ry > panel_top + panel_h - 60:
                break
            d.text((rx + INNER, ry), "+", font=fBody, fill=GREEN)
            task_text = truncate(todo.get("task", ""), fBody, max_mid_w, d)
            d.text((rx + INNER + 14, ry), task_text, font=fBody, fill=MUTED)
            ry += LH + 3

    # Divider between TODOs and Pipeline
    if pending_todos or done_todos:
        ry += 4
        d.line([(rx + INNER, ry), (rx + panel_w_mid - INNER, ry)], fill=BORDER, width=1)
        ry += 8

    # Pipeline section header
    if ry < panel_top + panel_h - 30:
        total_pw = sum(dr.get("words", 0) for dr in drafts_active)
        pipe_label = f"PIPELINE ({len(drafts_active)} drafts"
        if total_pw > 0:
            pipe_label += f", {total_pw:,}w"
        pipe_label += ")"
        d.text((rx + INNER, ry), pipe_label, font=fSmall, fill=MUTED)
        ry += 16

        # Sort drafts by target_date (soonest first), undated last
        dated = [dr for dr in drafts_active if dr.get("target_date")]
        undated = [dr for dr in drafts_active if not dr.get("target_date")]
        dated.sort(key=lambda x: x["target_date"])
        sorted_drafts = dated + undated

        for draft_idx, draft in enumerate(sorted_drafts):
            if ry > panel_top + panel_h - 24:
                remaining = len(sorted_drafts) - draft_idx
                d.text((rx + INNER + 14, ry), f"... +{remaining} more drafts", font=fSmall, fill=MUTED)
                break

            plat = draft.get("platform", "?")[:3].upper()
            target = draft.get("target_date", "")
            title = draft.get("title", "untitled")
            wc = draft.get("words", 0)

            # Platform tag
            plat_tag = f"[{plat}]"
            d.text((rx + INNER, ry), plat_tag, font=fSmall, fill=MUTED)
            plat_w = d.textlength(plat_tag + " ", font=fSmall)

            # Date if present
            date_suffix = ""
            if target:
                try:
                    dt = datetime.strptime(target, "%Y-%m-%d")
                    date_suffix = dt.strftime(" (%b %d)")
                except ValueError:
                    pass

            # Word count suffix
            wc_suffix = f" {wc}w" if wc > 0 else ""

            label = truncate(title + date_suffix + wc_suffix, fBody, max_mid_w - plat_w, d)
            d.text((rx + INNER + plat_w, ry), label, font=fBody, fill=TXT)
            ry += LH + 1

    # ── RIGHT PANEL: Economics + Token Usage (only if data exists) ───
    if token_usage and panel_w_right > 0:
        tx = rx + panel_w_mid + PANEL_GAP
        draw_panel(d, tx, panel_top, panel_w_right, panel_h)

        ty = panel_top + INNER
        max_tok_w = panel_w_right - INNER * 2 - 10

        # ── ECONOMICS section ────────────────────────────────────────
        agent_cost_val = stats.get("agent_cost", 0)
        dev_eq = stats.get("dev_equivalent_cost", 0)
        cost_savings = stats.get("cost_savings", 0)
        roi_val = stats.get("roi_multiplier", 0)

        if dev_eq > 0 or agent_cost_val > 0:
            d.text((tx + INNER, ty), "ECONOMICS", font=fHead, fill=GOLD)
            ty += 24

            d.text((tx + INNER, ty), f"Agent cost:     {format_cost(agent_cost_val)}", font=fBody, fill=AMBER)
            ty += LH + 2
            d.text((tx + INNER, ty), f"Dev equivalent: ${dev_eq:,.0f}", font=fBody, fill=BRIGHT)
            ty += LH + 2
            d.text((tx + INNER, ty), f"Savings:        ${cost_savings:,.0f}", font=fBody, fill=GREEN)
            ty += LH + 2
            d.text((tx + INNER, ty), f"ROI:            {roi_val:,.0f}x", font=fBody, fill=GOLD)
            ty += LH + 6

            # LOC breakdown
            breakdown = stats.get("dev_equivalent_breakdown", {})
            code_loc_val = breakdown.get("code_loc", 0)
            code_cost_val = breakdown.get("code_cost", 0)
            content_words_val = breakdown.get("content_words", 0)
            content_cost_val = breakdown.get("content_cost", 0)
            data_loc_val = stats.get("data_loc", 0)

            if code_loc_val > 0 or content_words_val > 0 or data_loc_val > 0:
                d.text((tx + INNER, ty), f"Code LOC:    {code_loc_val:,}  (${code_cost_val:,.0f} dev equiv)", font=fTiny, fill=CYAN)
                ty += LH - 2
                d.text((tx + INNER, ty), f"Content:     {content_words_val:,}w (${content_cost_val:,.0f} dev equiv)", font=fTiny, fill=CYAN)
                ty += LH - 2
                d.text((tx + INNER, ty), f"Data LOC:    {data_loc_val:,}  (not valued)", font=fTiny, fill=MUTED)
                ty += LH + 2

            # Divider
            d.line([(tx + INNER, ty), (tx + panel_w_right - INNER, ty)], fill=BORDER, width=1)
            ty += 8

        # ── EFFICIENCY section ───────────────────────────────────────
        shipped_count = stats.get("shipped_count", 0)
        draft_count = stats.get("draft_count", 0)
        ship_rate_val = stats.get("ship_rate", 0)
        lines_added_val = stats.get("lines_added", 0)
        words_val = stats.get("words_today", 0)

        has_efficiency = (ship_rate_val > 0 or (total_cost > 0 and output_score > 0))
        if has_efficiency:
            d.text((tx + INNER, ty), "EFFICIENCY", font=fSmall, fill=MUTED)
            ty += 16

            if ship_rate_val > 0:
                total_items = shipped_count + draft_count
                d.text((tx + INNER, ty), f"Ship rate: {ship_rate_val*100:.0f}% ({shipped_count}/{total_items})", font=fBody, fill=GREEN)
                ty += LH + 2

            efficiency = stats.get("efficiency_rating")
            if efficiency is not None:
                d.text((tx + INNER, ty), f"{efficiency} pts/$", font=fBody, fill=grade_color(letter_grade))
                ty += LH + 2

            if words_val > 0 and total_cost > 0:
                words_per_dollar = words_val / total_cost
                d.text((tx + INNER, ty), f"{words_per_dollar:,.0f} words/$", font=fBody, fill=CYAN)
                ty += LH + 2

            if lines_added_val > 0 and total_cost > 0:
                loc_per_dollar = lines_added_val / total_cost
                d.text((tx + INNER, ty), f"{loc_per_dollar:,.0f} LOC/$", font=fBody, fill=CYAN)
                ty += LH + 2

            if len(accomplishments) > 0 and total_cost > 0:
                cost_per_item = total_cost / len(accomplishments)
                d.text((tx + INNER, ty), f"{format_cost(cost_per_item)}/item", font=fBody, fill=MUTED)
                ty += LH + 2

            ty += 4
            # Divider
            d.line([(tx + INNER, ty), (tx + panel_w_right - INNER, ty)], fill=BORDER, width=1)
            ty += 8

        # ── TOKEN USAGE section ──────────────────────────────────────
        d.text((tx + INNER, ty), "TOKEN USAGE", font=fHead, fill=PURPLE)
        ty += 24

        # Source breakdown label
        auto_count = len([e for e in token_usage if e.get("source") == "claude-code"])
        est_count = len([e for e in token_usage if e.get("source") == "cursor-estimate"])
        manual_count = len([e for e in token_usage if e.get("source") not in ("claude-code", "cursor-estimate")])
        source_parts = []
        if auto_count > 0:
            source_parts.append(f"{auto_count} exact")
        if est_count > 0:
            source_parts.append(f"{est_count} est")
        if manual_count > 0:
            source_parts.append(f"{manual_count} manual")
        source_label = " | ".join(source_parts) if source_parts else ""
        if source_label:
            d.text((tx + INNER, ty), source_label, font=fTiny, fill=MUTED)
            ty += LH - 2

        # Summary stats
        session_count = len(token_usage)
        d.text((tx + INNER, ty), f"Sessions: {session_count}", font=fBody, fill=TXT)
        ty += LH + 2
        d.text((tx + INNER, ty), f"Input:  {format_tokens(total_input_tokens)}", font=fBody, fill=CYAN)
        ty += LH + 2
        d.text((tx + INNER, ty), f"Output: {format_tokens(total_output_tokens)}", font=fBody, fill=CYAN)
        ty += LH + 2

        # Show cache breakdown if any
        if total_cache_read > 0 or total_cache_write > 0:
            d.text((tx + INNER, ty), f"Cache:  {format_tokens(total_cache_read)}r / {format_tokens(total_cache_write)}w", font=fBody, fill=MUTED)
            ty += LH + 2

        d.text((tx + INNER, ty), f"Total:  {format_tokens(total_all_tokens)}", font=fBody, fill=BRIGHT)
        ty += LH + 2
        d.text((tx + INNER, ty), f"Cost:   {format_cost(total_cost)}", font=fBody, fill=AMBER)
        ty += LH + 6

        # Model breakdown
        model_totals = {}
        for entry in token_usage:
            model = entry.get("model", "unknown")
            prev = model_totals.get(model, {"input": 0, "output": 0, "cache_r": 0, "cache_w": 0, "cost": 0, "count": 0})
            prev["input"] += entry.get("input_tokens", 0)
            prev["output"] += entry.get("output_tokens", 0)
            prev["cache_r"] += entry.get("cache_read_tokens", 0)
            prev["cache_w"] += entry.get("cache_write_tokens", 0)
            prev["cost"] += compute_token_cost(entry)
            prev["count"] += 1
            model_totals[model] = prev

        if model_totals:
            d.line([(tx + INNER, ty), (tx + panel_w_right - INNER, ty)], fill=BORDER, width=1)
            ty += 8
            d.text((tx + INNER, ty), "BY MODEL", font=fSmall, fill=MUTED)
            ty += 16

            model_colors = {"opus": PURPLE, "sonnet": CYAN, "haiku": GREEN, "gpt4o": AMBER}
            for model, totals in sorted(model_totals.items(), key=lambda x: -x[1]["cost"]):
                if ty > panel_top + panel_h - 40:
                    break
                mc = model_colors.get(model.lower(), TXT)
                d.text((tx + INNER, ty), model.upper(), font=fSmall, fill=mc)
                ty += LH - 2
                all_tok = totals["input"] + totals["output"] + totals["cache_r"] + totals["cache_w"]
                detail = f"  {totals['count']}x  {format_tokens(all_tok)}  {format_cost(totals['cost'])}"
                d.text((tx + INNER, ty), detail, font=fTiny, fill=MUTED)
                ty += LH + 2

        # Per-session log (most recent first)
        if ty < panel_top + panel_h - 60:
            ty += 4
            d.line([(tx + INNER, ty), (tx + panel_w_right - INNER, ty)], fill=BORDER, width=1)
            ty += 8
            d.text((tx + INNER, ty), "SESSION LOG", font=fSmall, fill=MUTED)
            ty += 16

            for entry in reversed(token_usage):
                if ty > panel_top + panel_h - 24:
                    break
                ctx = entry.get("context", "session")[:18]
                model = entry.get("model", "?")[:6]
                cost = compute_token_cost(entry)
                # Source indicator
                src = entry.get("source", "")
                src_tag = "~" if src == "cursor-estimate" else ""
                line_text = f"{src_tag}{ctx}  {model}  {format_cost(cost)}"
                line_text = truncate(line_text, fTiny, max_tok_w, d)
                d.text((tx + INNER, ty), line_text, font=fTiny, fill=TXT)
                ty += LH - 2

    # ── Footer ───────────────────────────────────────────────────────
    gen_time = datetime.now().strftime("%H:%M")
    words = stats.get("words_today", 0)
    loc = stats.get("code_loc", 0)
    agent_cost_val = stats.get("agent_cost", 0)
    dev_eq = stats.get("dev_equivalent_cost", 0)
    roi_val = stats.get("roi_multiplier", 0)

    if dev_eq > 0 and agent_cost_val > 0:
        footer_text = f"{words:,}w + {loc:,} LOC + {output_score} pts for ${agent_cost_val:.2f} (dev equiv: ${dev_eq:,.0f} | {roi_val:,.0f}x ROI)"
    else:
        footer_text = f"{words:,}w + {loc:,} LOC + {output_score} pts ({letter_grade})"
    fw = d.textlength(footer_text, font=fFooter)
    d.text(((WIDTH - fw) / 2, HEIGHT - 28), footer_text, font=fFooter, fill=MUTED)

    # ── Save ─────────────────────────────────────────────────────────
    img.save(str(output_path), "PNG", dpi=(144, 144))
    print(f"Dashboard saved: {output_path.relative_to(REPO_ROOT)}")
    return output_path


# ── CLI ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Daily dashboard image generator")
    parser.add_argument("--date", type=str, help="Date to render (YYYY-MM-DD). Defaults to today.")
    args = parser.parse_args()

    if args.date:
        date_str = args.date
    else:
        date_str = datetime.now().strftime("%Y-%m-%d")

    log_path = LOG_DIR / f"{date_str}.json"
    if not log_path.exists():
        print(f"No daily log found at {log_path.relative_to(REPO_ROOT)}")
        print("Run the scanner first: python3 scripts/daily_scan.py")
        return

    data = json.loads(log_path.read_text())
    output_path = LOG_DIR / f"{date_str}.png"
    render_dashboard(data, output_path)


if __name__ == "__main__":
    main()
