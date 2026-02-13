---
name: skill-tree
description: Generate an RPG-style skill tree visualization of the full GTM OS ecosystem. Scans content, GTM operations, voice system, agent skills, and infrastructure. Use when the user types /skilltree or asks to see their skill tree, progression map, or OS status.
---

# RPG Skill Tree Generator (v2 — Full Ecosystem)

Generate a full-page RPG skill tree image showing progression across the ENTIRE GTM OS — not just content, but partner ops, workflows, voice system, agent skills, MCP integrations, and infrastructure. Sector nodes glow green when mastered, dim when locked. Saves weekly snapshots for progression tracking.

## Command Pattern

- `/skilltree` -- generate/refresh the skill tree image
- Also triggers on "show skill tree", "update my skill tree", "progression check", "content map", "ecosystem map"

## Workflow

### Step 1: Run the Generator

```bash
python3 data/skill-tree/_gen_skill_tree.py
```

The script auto-scans the entire repo:

| Sector | What It Scans |
|---|---|
| **Content Engine** | `content/{platform}/final/` and `drafts/` for LinkedIn, X, Substack, Reddit, TikTok, YouTube, Web |
| **GTM Operations** | `clients/partner/` and `clients/client/` — counts entities, prompts, research, workflows, plays |
| **Voice System** | `skills/tier-1-voice-dna/`, `tier-2-context-playbooks/`, `tier-3-content-ops/`, `ai-pattern-detection/` |
| **Agent Skills** | `.cursor/skills/` — categorized into content, image, GTM ops, automation, meta |
| **Infrastructure** | `~/.cursor/mcp.json` (MCP servers), `scripts/`, `data/`, git safety, daily tracker, cron status |

Also reads: `data/daily-log/*.json` for output score + letter grade, and `data/skill-tree/*.json` for delta computation.

### Step 2: Open the Output

```bash
open data/skill-tree/YYYY-MM-DD.png
```

Files generated per run:
- `data/skill-tree/YYYY-MM-DD.png` -- the rendered skill tree image
- `data/skill-tree/YYYY-MM-DD.json` -- snapshot data for future delta tracking

### Step 3: Report to User

Show the image and summarize:
- Which sectors are MASTERED / ACTIVE / UNLOCKING / LOCKED
- Sub-node breakdown per sector
- Any deltas since last snapshot
- Suggested next unlock

## 5 Ecosystem Sectors

### 1. Content Engine
Platforms: LinkedIn, X/Twitter, Substack, Reddit, TikTok, YouTube, Web/Site.
State based on active platform count and total finals shipped.

### 2. GTM Operations
Sub-nodes: Partners (onboarded entities), Web Reveal, Campaigns, Outreach (HeyReach/Instantly), Enrichment, Plays.
State based on entity count, prompt coverage, and play documentation.

### 3. Voice System
Sub-nodes: Core Voice (Tier 1), Playbooks (Tier 2), Content Ops (Tier 3), Anti-Slop.
State based on file counts across all three tiers.

### 4. Agent Skills
Sub-nodes by category: Content, Image Gen, GTM Ops, Automation, Meta/Utility.
State based on total skill count (35 = MASTERED).

### 5. Infrastructure
Sub-nodes: MCP Stack, Daily Tracker, Git Safety, Scripts, Data Pipeline, Cron Jobs.
State based on how many infrastructure pieces are in place.

## Node States (RPG Tiers)

| State | Visual | General Criteria |
|---|---|---|
| **MASTERED** | Bright green glow + border, filled dots | Sector fully built out |
| **ACTIVE** | Green border, green text | Core functionality working |
| **UNLOCKING** | Amber dashed border | Started but incomplete |
| **LOCKED** | Grey dotted border, "???" or "LOCKED" | Not started |

## Delta Tracking

On each run, the script loads the most recent previous `data/skill-tree/*.json` snapshot (excluding today) and computes deltas. Positive growth renders as green badges.

## Visual Design

- **Canvas**: 1600 x 1200 px, `#0C0D11` background, CRT scanlines, Menlo font
- **Layout**: Central GTM OS hub with 5 sector branches radiating outward, sub-nodes fanning from each sector
- **Terminal chrome**: Three dots, "Shawn AI/os skill tree" branding, `--full-ecosystem` boot command
- **Connection lines**: Solid green (mastered/active), dashed amber (unlocking), dotted grey (locked)
- **Footer**: Ecosystem summary + "next unlock" suggestion

## Dependencies

- Python 3 + Pillow (`pip install Pillow`)
- Menlo font (pre-installed macOS)
- Generator script at `data/skill-tree/_gen_skill_tree.py`

## Output

- `data/skill-tree/YYYY-MM-DD.png` -- skill tree image (1600x1200, retina DPI)
- `data/skill-tree/YYYY-MM-DD.json` -- snapshot data (v2 schema with all 5 sectors)
