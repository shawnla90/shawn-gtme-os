#!/usr/bin/env python3
"""
Website Value Scanner — scores the website/ monorepo by code depth,
features, and technical complexity.

Output: data/website-stats.json

Usage:
    python scripts/website_scanner.py          # full scan
    python scripts/website_scanner.py --pretty # pretty-print JSON
"""

import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

REPO_ROOT = Path(__file__).resolve().parent.parent
WEBSITE_ROOT = REPO_ROOT / "website"
OUTPUT_PATH = REPO_ROOT / "data" / "website-stats.json"

# ── Language weights (points per 10 lines) ────────────────────────
LANG_WEIGHTS = {
    ".ts": 1.0,
    ".tsx": 1.0,
    ".py": 1.5,
    ".css": 0.5,
    ".json": 0.25,
    ".mjs": 1.0,
    ".js": 1.0,
    ".jsx": 1.0,
}

LANG_LABELS = {
    ".ts": "ts",
    ".tsx": "tsx",
    ".py": "py",
    ".css": "css",
    ".json": "json",
    ".mjs": "ts",
    ".js": "ts",
    ".jsx": "tsx",
}

# ── Points per category ──────────────────────────────────────────
PTS_PER_ROUTE = 50
PTS_PER_SHARED_COMPONENT = 30
PTS_PER_API_ENDPOINT = 100

# ── Technical features to detect ─────────────────────────────────
TECHNICAL_FEATURES = [
    {
        "name": "RPG Progression Engine",
        "description": "XP, levels, milestones, class system",
        "points": 75,
        "patterns": [r"rpg", r"progression", r"xp", r"level"],
        "paths": ["rpg-preview", "rpg.ts", "rpg.server.ts", "progression"],
    },
    {
        "name": "Pixel Art Avatar System",
        "description": "Multi-tier 32x32 sprites with idle/action animations",
        "points": 75,
        "patterns": [r"avatar", r"sprite", r"AvatarBadge"],
        "paths": ["rpg_sprites.py", "avatar_generator.py", "AvatarBadge"],
    },
    {
        "name": "Avatar Animations",
        "description": "Animated GIF sprite sequences with idle frames",
        "points": 75,
        "patterns": [r"idle.*anim", r"\.gif", r"animation.*frame"],
        "paths": ["avatars", "idle"],
    },
    {
        "name": "Sound Effects System",
        "description": "In-browser audio feedback for UI interactions",
        "points": 75,
        "patterns": [r"sounds?\.", r"audio", r"new Audio"],
        "paths": ["sounds.ts"],
    },
    {
        "name": "RPG Loading Screen",
        "description": "Themed loading experience with progress animation",
        "points": 75,
        "patterns": [r"loading", r"RPGLoadingScreen"],
        "paths": ["RPGLoadingScreen"],
    },
    {
        "name": "Typewriter Effects",
        "description": "Character-by-character text reveal animations",
        "points": 75,
        "patterns": [r"typewriter", r"TypewriterHero", r"scramble"],
        "paths": ["TypewriterHero", "ScrambleCycler"],
    },
    {
        "name": "Pillow Image Generation",
        "description": "Server-side image generation with Python Pillow",
        "points": 75,
        "patterns": [r"from PIL", r"Image\.new", r"ImageDraw"],
        "paths": ["daily_dashboard.py", "rpg_sprites.py"],
    },
    {
        "name": "Design Token System",
        "description": "Centralized CSS custom properties for theming",
        "points": 75,
        "patterns": [r"tokens\.css", r"--canvas", r"--accent"],
        "paths": ["tokens.css"],
    },
    {
        "name": "RSS Feed",
        "description": "XML syndication feed for blog content",
        "points": 50,
        "patterns": [r"feed\.xml", r"rss", r"<channel>"],
        "paths": ["feed.xml"],
    },
    {
        "name": "OG Image Generation",
        "description": "Dynamic Open Graph images for social sharing",
        "points": 75,
        "patterns": [r"og.*route", r"ImageResponse", r"opengraph"],
        "paths": ["og"],
    },
    {
        "name": "Terminal Chrome UI",
        "description": "Terminal-style window chrome component",
        "points": 75,
        "patterns": [r"TerminalChrome", r"terminal"],
        "paths": ["TerminalChrome"],
    },
    {
        "name": "Knowledge Base",
        "description": "Structured knowledge guide pages",
        "points": 75,
        "patterns": [r"knowledge", r"KnowledgeGuide"],
        "paths": ["knowledge", "KnowledgeGuidePage"],
    },
    {
        "name": "Quest Board System",
        "description": "Interactive quest/mission tracking interface",
        "points": 75,
        "patterns": [r"quest", r"QuestBoard"],
        "paths": ["quests", "QuestBoardPage"],
    },
    {
        "name": "Daily Build Log",
        "description": "Date-indexed build activity log with detail views",
        "points": 75,
        "patterns": [r"daily.*log", r"DailyLogView", r"LogCard"],
        "paths": ["log", "DailyLogView", "LogCard"],
    },
    {
        "name": "Network Banner",
        "description": "Cross-site network navigation banner",
        "points": 75,
        "patterns": [r"NetworkBanner", r"network"],
        "paths": ["NetworkBanner"],
    },
]

INFRA_BONUSES = {
    "turborepo_monorepo": {
        "name": "Turborepo Monorepo",
        "description": "Multi-app build orchestration with Turborepo",
        "points": 200,
    },
    "vercel_deployment": {
        "name": "Vercel Deployment",
        "description": "Production deployment on Vercel edge network",
        "points_per_site": 100,
    },
    "shared_package": {
        "name": "Shared Package Architecture",
        "description": "Cross-app component/utility sharing via workspace packages",
        "points": 150,
    },
}

# ── Tier thresholds for Nio avatar ────────────────────────────────
NIO_TIERS = [
    (0, "Spark"),
    (10000, "Blade"),
    (20000, "Warden"),
    (35000, "Sentinel"),
    (50000, "Ascended"),
]


def nio_tier(score: int) -> Tuple[int, str]:
    """Return (tier_number, tier_name) for a given score."""
    tier = 1
    name = NIO_TIERS[0][1]
    for threshold, label in NIO_TIERS:
        if score >= threshold:
            tier = NIO_TIERS.index((threshold, label)) + 1
            name = label
    return tier, name


# ── File scanning helpers ─────────────────────────────────────────

def get_tracked_files() -> Set[str]:
    """Return git-tracked files under website/ as relative paths from REPO_ROOT."""
    try:
        out = subprocess.run(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard", "website/"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        return set(out.stdout.strip().splitlines()) if out.stdout.strip() else set()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return set()


def count_lines(filepath: Path) -> int:
    """Count non-empty lines in a file."""
    try:
        if not filepath.is_file():
            return 0
        with open(filepath, "r", errors="replace") as f:
            return sum(1 for line in f if line.strip())
    except OSError:
        return 0


def is_code_file(rel: str) -> bool:
    """Check if a file is a code file we care about."""
    ext = Path(rel).suffix.lower()
    return ext in LANG_WEIGHTS


def skip_path(rel: str) -> bool:
    """Skip node_modules, dist, .next, .turbo, lockfiles."""
    skip_dirs = {"node_modules", ".next", ".turbo", "dist", ".git"}
    parts = Path(rel).parts
    for p in parts:
        if p in skip_dirs:
            return True
    name = Path(rel).name
    if name in {"package-lock.json", ".DS_Store"}:
        return True
    return False


# ── Site detection ────────────────────────────────────────────────

SITE_MAP = {
    "shawnos": {
        "name": "ShawnOS.ai",
        "app_dir": "website/apps/shawnos",
        "accent": "#4EC373",
    },
    "gtmos": {
        "name": "TheGTMOS.ai",
        "app_dir": "website/apps/gtmos",
        "accent": "#F5A623",
    },
    "contentos": {
        "name": "TheContentOS.ai",
        "app_dir": "website/apps/contentos",
        "accent": "#A855F7",
    },
}


def classify_file(rel: str) -> Optional[str]:
    """Return site key or 'shared' or None."""
    for key, info in SITE_MAP.items():
        if rel.startswith(info["app_dir"]):
            return key
    if rel.startswith("website/packages/shared"):
        return "shared"
    if rel.startswith("website/packages/"):
        return "shared"
    return None


# ── Route / component detection ───────────────────────────────────

def detect_routes(tracked: Set[str], app_dir: str) -> List[str]:
    """Detect unique routes from page.tsx and route.ts files."""
    routes = []
    prefix = app_dir + "/app/"
    for rel in sorted(tracked):
        if not rel.startswith(prefix):
            continue
        name = Path(rel).name
        if name in ("page.tsx", "route.ts", "route.tsx"):
            route_path = rel[len(prefix):]
            route_dir = str(Path(route_path).parent)
            if route_dir == ".":
                route_dir = "/"
            else:
                route_dir = "/" + route_dir
            if route_dir not in routes:
                routes.append(route_dir)
    return routes


def detect_api_endpoints(tracked: Set[str], app_dir: str) -> List[str]:
    """Detect API route handlers."""
    endpoints = []
    prefix = app_dir + "/app/api/"
    for rel in sorted(tracked):
        if not rel.startswith(prefix):
            continue
        name = Path(rel).name
        if name in ("route.ts", "route.tsx"):
            route_path = rel[len(prefix):]
            route_dir = str(Path(route_path).parent)
            endpoint = "/api/" + (route_dir if route_dir != "." else "")
            if endpoint not in endpoints:
                endpoints.append(endpoint)
    return endpoints


def detect_shared_components(tracked: Set[str]) -> List[str]:
    """List shared components by scanning the components directory."""
    components = []
    prefix = "website/packages/shared/components/"
    for rel in sorted(tracked):
        if not rel.startswith(prefix):
            continue
        name = Path(rel).name
        if name == "index.ts":
            continue
        stem = Path(rel).stem
        if stem not in components:
            components.append(stem)
    # Also count shared pages
    page_prefix = "website/packages/shared/pages/"
    for rel in sorted(tracked):
        if not rel.startswith(page_prefix):
            continue
        stem = Path(rel).stem
        if stem not in components:
            components.append(stem)
    return components


# ── Feature detection ─────────────────────────────────────────────

def detect_features_for_site(tracked: Set[str], app_dir: str) -> List[dict]:
    """Detect which technical features are present in a site."""
    found = []
    site_files = [r for r in tracked if r.startswith(app_dir)]

    for feature in TECHNICAL_FEATURES:
        detected = False
        # Check path fragments
        for path_frag in feature["paths"]:
            for rel in site_files:
                if path_frag in rel:
                    detected = True
                    break
            if detected:
                break
        if not detected:
            # Check file content patterns (only for site-local files)
            for rel in site_files:
                if not is_code_file(rel):
                    continue
                filepath = REPO_ROOT / rel
                if not filepath.is_file():
                    continue
                try:
                    content = filepath.read_text(errors="replace")
                    for pat in feature["patterns"]:
                        if re.search(pat, content, re.IGNORECASE):
                            detected = True
                            break
                except OSError:
                    pass
                if detected:
                    break

        if detected:
            found.append({
                "name": feature["name"],
                "description": feature["description"],
                "points": feature["points"],
            })
    return found


def detect_features_global(tracked: Set[str]) -> List[dict]:
    """Detect features across the entire website/ and scripts/ directories."""
    found = []
    all_files = list(tracked)
    # Also add scripts/*.py for Pillow detection
    scripts_dir = REPO_ROOT / "scripts"
    if scripts_dir.is_dir():
        for f in scripts_dir.iterdir():
            if f.suffix == ".py":
                rel = f"scripts/{f.name}"
                if rel not in all_files:
                    all_files.append(rel)

    for feature in TECHNICAL_FEATURES:
        detected = False
        for path_frag in feature["paths"]:
            for rel in all_files:
                if path_frag in rel:
                    detected = True
                    break
            if detected:
                break
        if not detected:
            for rel in all_files:
                filepath = REPO_ROOT / rel
                ext = filepath.suffix.lower()
                if ext not in LANG_WEIGHTS and ext != ".py":
                    continue
                if not filepath.is_file():
                    continue
                try:
                    content = filepath.read_text(errors="replace")
                    for pat in feature["patterns"]:
                        if re.search(pat, content, re.IGNORECASE):
                            detected = True
                            break
                except OSError:
                    pass
                if detected:
                    break
        if detected:
            found.append({
                "name": feature["name"],
                "description": feature["description"],
                "points": feature["points"],
            })
    return found


# ── LOC counting ──────────────────────────────────────────────────

def count_loc_by_lang(tracked: Set[str], prefix: Optional[str] = None) -> Dict[str, int]:
    """Count lines of code grouped by language label, optionally filtered by prefix."""
    loc: Dict[str, int] = {}
    for rel in tracked:
        if prefix and not rel.startswith(prefix):
            continue
        if skip_path(rel):
            continue
        ext = Path(rel).suffix.lower()
        if ext not in LANG_WEIGHTS:
            continue
        label = LANG_LABELS.get(ext, ext.lstrip("."))
        lines = count_lines(REPO_ROOT / rel)
        loc[label] = loc.get(label, 0) + lines
    return loc


# ── Score computation ─────────────────────────────────────────────

def compute_loc_score(loc: Dict[str, int]) -> float:
    """Compute weighted LOC score."""
    label_to_weight = {
        "ts": 1.0,
        "tsx": 1.0,
        "py": 1.5,
        "css": 0.5,
        "json": 0.25,
    }
    score = 0.0
    for label, lines in loc.items():
        weight = label_to_weight.get(label, 0.5)
        score += (lines / 10) * weight
    return score


def compute_site_score(
    loc: Dict[str, int],
    routes: List[str],
    api_endpoints: List[str],
    features: List[dict],
) -> int:
    """Compute total value score for a site."""
    score = compute_loc_score(loc)
    score += len(routes) * PTS_PER_ROUTE
    score += len(api_endpoints) * PTS_PER_API_ENDPOINT
    score += sum(f["points"] for f in features)
    return int(round(score))


# ── Grade letter ──────────────────────────────────────────────────

def score_grade(score: int) -> str:
    if score >= 15000:
        return "S"
    elif score >= 10000:
        return "A"
    elif score >= 5000:
        return "B"
    elif score >= 2000:
        return "C"
    elif score >= 500:
        return "D"
    return "F"


# ── Main ──────────────────────────────────────────────────────────

def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Scan website and compute value scores")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output")
    args = parser.parse_args()

    tracked = get_tracked_files()
    if not tracked:
        # Fallback: walk the filesystem if git isn't available
        for root, _dirs, files in os.walk(WEBSITE_ROOT):
            _dirs[:] = [d for d in _dirs if d not in {"node_modules", ".next", ".turbo", "dist", ".git"}]
            for f in files:
                full = Path(root) / f
                rel = str(full.relative_to(REPO_ROOT))
                tracked.add(rel)

    # ── Per-site stats ────────────────────────────────────────────
    sites: Dict[str, dict] = {}
    for key, info in SITE_MAP.items():
        app_dir = info["app_dir"]
        loc = count_loc_by_lang(tracked, prefix=app_dir)
        routes = detect_routes(tracked, app_dir)
        api_endpoints = detect_api_endpoints(tracked, app_dir)
        features = detect_features_for_site(tracked, app_dir)

        site_score = compute_site_score(loc, routes, api_endpoints, features)

        sites[key] = {
            "name": info["name"],
            "accent": info["accent"],
            "score": site_score,
            "grade": score_grade(site_score),
            "loc": loc,
            "routes": len(routes),
            "route_list": routes,
            "components": 0,  # filled after shared scan
            "api_endpoints": len(api_endpoints),
            "api_endpoint_list": api_endpoints,
            "features": [f["name"] for f in features],
            "feature_count": len(features),
        }

    # ── Shared package stats ──────────────────────────────────────
    shared_loc = count_loc_by_lang(tracked, prefix="website/packages/")
    shared_components = detect_shared_components(tracked)

    shared = {
        "components": len(shared_components),
        "component_list": shared_components,
        "design_tokens": any("tokens.css" in r for r in tracked),
        "loc": shared_loc,
    }

    # Assign shared component count to each site
    for key in sites:
        sites[key]["components"] = shared["components"]

    # ── Infrastructure ────────────────────────────────────────────
    total_loc: Dict[str, int] = {}
    for loc_dict in [s["loc"] for s in sites.values()] + [shared_loc]:
        for lang, lines in loc_dict.items():
            total_loc[lang] = total_loc.get(lang, 0) + lines
    total_lines = sum(total_loc.values())

    # Detect languages present
    lang_label_to_name = {
        "ts": "TypeScript",
        "tsx": "TypeScript (JSX)",
        "py": "Python",
        "css": "CSS",
        "json": "JSON",
    }
    languages = [lang_label_to_name.get(k, k) for k in sorted(total_loc.keys()) if total_loc[k] > 0]

    # Vercel deployments
    vercel_count = sum(
        1 for key in SITE_MAP
        if (REPO_ROOT / SITE_MAP[key]["app_dir"] / "vercel.json").exists()
    )

    # Detect all technical features globally
    global_features = detect_features_global(tracked)

    # Infrastructure score
    infra_score = 0
    infra_features: List[dict] = []

    # Turborepo
    if (WEBSITE_ROOT / "turbo.json").exists():
        bonus = INFRA_BONUSES["turborepo_monorepo"]
        infra_score += bonus["points"]
        infra_features.append({
            "name": bonus["name"],
            "description": bonus["description"],
            "points": bonus["points"],
        })

    # Vercel deployments
    if vercel_count > 0:
        pts = vercel_count * INFRA_BONUSES["vercel_deployment"]["points_per_site"]
        infra_score += pts
        infra_features.append({
            "name": INFRA_BONUSES["vercel_deployment"]["name"],
            "description": f"{vercel_count} sites deployed on Vercel edge network",
            "points": pts,
        })

    # Shared package architecture
    if (WEBSITE_ROOT / "packages" / "shared").is_dir():
        bonus = INFRA_BONUSES["shared_package"]
        infra_score += bonus["points"]
        infra_features.append({
            "name": bonus["name"],
            "description": bonus["description"],
            "points": bonus["points"],
        })

    infra = {
        "monorepo": (WEBSITE_ROOT / "turbo.json").exists(),
        "vercel_sites": vercel_count,
        "total_loc": total_lines,
        "loc_by_language": total_loc,
        "languages": languages,
        "technical_features": global_features + infra_features,
    }

    # ── Total score ───────────────────────────────────────────────
    site_scores = sum(s["score"] for s in sites.values())
    shared_score = int(round(compute_loc_score(shared_loc))) + shared["components"] * PTS_PER_SHARED_COMPONENT
    total_score = site_scores + shared_score + infra_score

    # ── Visitor score (future: Vercel Analytics API) ───────────────
    # Once Vercel Web Analytics has accumulated traffic data, plug in
    # visitor-based scoring here.  The integration will:
    #
    #   1. Fetch pageview / visitor counts from the Vercel Analytics API
    #      (requires VERCEL_API_TOKEN env var + project IDs).
    #   2. Compute a visitor_score using a tiered formula, e.g.:
    #        visitor_score  = unique_visitors * PTS_PER_VISITOR
    #        visitor_score += pageviews       * PTS_PER_PAGEVIEW
    #        visitor_score += bounce_rate_bonus(bounce_rate)
    #   3. Add visitor_score to total_score before tier calculation:
    #        total_score += visitor_score
    #   4. Include a "visitors" key in the output payload with raw
    #      metrics (unique_visitors, pageviews, top_pages, period).
    #
    # API reference: https://vercel.com/docs/analytics/api
    # Free tier: 2,500 events/month per project.
    # ───────────────────────────────────────────────────────────────

    tier_num, tier_name = nio_tier(total_score)

    # Progress to next tier
    next_tier_threshold = None
    for threshold, _ in NIO_TIERS:
        if threshold > total_score:
            next_tier_threshold = threshold
            break
    progress_to_next = None
    if next_tier_threshold is not None:
        current_threshold = NIO_TIERS[tier_num - 1][0]
        range_size = next_tier_threshold - current_threshold
        progress_to_next = {
            "current": total_score - current_threshold,
            "needed": range_size,
            "percent": round(((total_score - current_threshold) / range_size) * 100, 1),
            "next_tier": tier_num + 1,
            "next_tier_name": NIO_TIERS[tier_num][1] if tier_num < len(NIO_TIERS) else None,
        }

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_score": total_score,
        "grade": score_grade(total_score),
        "nio_tier": tier_num,
        "nio_tier_name": tier_name,
        "nio_progress": progress_to_next,
        "sites": sites,
        "shared": shared,
        "infra": infra,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    indent = 2 if args.pretty else None
    with open(OUTPUT_PATH, "w") as f:
        json.dump(payload, f, indent=indent)

    # ── Summary ───────────────────────────────────────────────────
    print(f"{'='*50}")
    print(f"  Website Value Score: {total_score:,}  [{score_grade(total_score)}]")
    print(f"  Nio Tier: {tier_num} — {tier_name}")
    if progress_to_next:
        print(f"  Progress: {progress_to_next['percent']}% to Tier {progress_to_next['next_tier']}")
    print(f"{'='*50}")
    for key, site in sites.items():
        print(f"  {site['name']:20s}  {site['score']:>6,} pts  [{site['grade']}]  "
              f"{site['routes']} routes  {site['feature_count']} features")
    print(f"  {'Shared':20s}  {shared_score:>6,} pts  "
          f"{shared['components']} components")
    print(f"  {'Infrastructure':20s}  {infra_score:>6,} pts  "
          f"{vercel_count} deploys")
    print(f"{'='*50}")
    print(f"  Total LOC: {total_lines:,} across {len(languages)} languages")
    print(f"  Technical features: {len(global_features)}")
    print(f"{'='*50}")
    print(f"\n  Wrote {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
