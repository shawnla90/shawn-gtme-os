# ShawnOS — IP Asset Registry

Last Updated: 2026-02-15

## Tier 1: Core Proprietary Algorithms (All Rights Reserved)

| Asset | Location | Protection | Value Driver |
|-------|----------|------------|--------------|
| XP Calculation Engine | scripts/progression_engine.py | Gitignored | Gamification system |
| Output Scoring Algorithm | scripts/daily_scan.py | Gitignored | Letter grade + efficiency rating |
| Avatar Generation System | scripts/avatar_generator.py | Gitignored | Visual progression |
| Dashboard Card Generator | scripts/daily_dashboard.py | Gitignored | Shareable output assets |
| Lead Enrichment Pipeline | scripts/enrich_vector_leads.py | Gitignored | GTM automation |
| MX Domain Validator | scripts/mx_check.py | Gitignored | Email deliverability |
| Clay Integration Scripts | scripts/push_enrichment_to_sheet.py, scripts/push_remaining_enrichment.py | Gitignored | Partner workflow automation |
| Touch Point Generators | scripts/find_missing_touch2.py, scripts/gen_touch2_updates.py | Gitignored | Campaign orchestration |

**Total Proprietary Scripts**: 15 Python files (all gitignored)

## Tier 2: Architectural Patterns (View Source Only License)

| Asset | Location | Protection | Value Driver |
|-------|----------|------------|--------------|
| Mono-repo 3-domain architecture | website/ | Public + licensed | Scalable multi-site system |
| RPG data model & types | website/packages/shared/lib/rpg.ts | Public + licensed | Game state management |
| Log & progression API | website/packages/shared/lib/logs.ts | Public + licensed | Analytics backend |
| Server-side RPG loader | website/packages/shared/lib/rpg.server.ts | Public + licensed | SSR state hydration |
| Skill framework | .cursor/skills/ (42 skills) | Public + licensed | Agentic workflow library |
| Voice modularity system | skills/tier-1-voice-dna/ (4 playbooks) | Public + licensed | Brand voice architecture |
| Plan formatting framework | .cursor/skills/plan-format/ | Public + licensed | Structured planning methodology |

**Total Skills**: 42 invokable skills across .cursor/skills/

**Voice Playbooks**: 4 (core-voice, anti-slop, viral-hooks, safety-filters)

## Tier 3: Design & Brand Assets (Attribution Required)

| Asset | Location | Protection | Value Driver |
|-------|----------|------------|--------------|
| Terminal UI design system | website/packages/shared/components/ (12 components) | Public + licensed | Visual brand identity |
| Avatar sprite assets | data/progression/avatars/ (227 files) | All Rights Reserved | Character progression visuals |
| ShawnOS/GTMOS/ContentOS branding | N/A | Trademark claim | Brand differentiation |
| TypewriterHero component | website/packages/shared/components/TypewriterHero.tsx | Public + licensed | Signature UI pattern |
| LogHero & AvatarBadge | website/packages/shared/components/LogHero.tsx, AvatarBadge.tsx | Public + licensed | Progression display components |
| Terminal Chrome wrapper | website/packages/shared/components/TerminalChrome.tsx | Public + licensed | Retro-terminal aesthetic |

**Total Components**: 12 React/TSX components

**Total Avatar Assets**: 227 sprite variations (gitignored, protected)

## Tier 4: Content & Documentation (Creative Commons or Proprietary)

| Asset | Location | Protection | Value Driver |
|-------|----------|------------|--------------|
| Blog posts & newsletters | content/substack/final/ (2 published) | CC BY-NC 4.0 | Thought leadership |
| LinkedIn drafts | content/drafts/ (20 posts) | Proprietary (pre-publish) | Content pipeline |
| X/Twitter drafts | content/drafts/ (19 posts) | Proprietary (pre-publish) | Content pipeline |
| Finalized social posts | content/finals/ (19 posts) | CC BY-NC 4.0 | Published content |
| Skill playbooks & guides | .cursor/skills/ | Proprietary (selective) | Operational knowledge |
| Partner workflows | clients/ & partners/ (4 partners) | All Rights Reserved (gitignored) | Client deliverables |
| Voice playbooks | skills/tier-1-voice-dna/ (37 files) | Proprietary | Brand DNA documentation |

**Total Content Files**: 93 (drafts: 39, finalized: 19, published: 2)

**Protected Partner Data**: 4 active partners (fully gitignored)

## Repository Metrics (Baseline — 2026-02-15)

**Volume**:
- Total tracked files: 218
- Markdown files: 168
- Python files: 8 (public/tracked) + 15 (gitignored/proprietary)
- JSON files: 21
- Total lines (md+py+json): 36,937

**Git History**:
- Total commits: 49
- All commits since 2025: 49

**Protected Directories** (gitignored):
- `clients/` — All client work
- `partners/` — All partner integrations
- `scripts/` — All Python automation (15 files)
- `data/*` — Progression data (except allowlisted public dirs)
- `data/progression/avatars/` — 227 sprite files
- `.claude/blocklist.txt` — Sensitive term scanner
- `screenshots/` — Work artifacts
- `content/internal/` — Internal drafts
- `*.csv` — Lead exports and enrichment data

**Public Directories** (showcased):
- `.cursor/skills/` — 42 agent skills
- `skills/tier-1-voice-dna/` — Voice framework
- `website/` — Full mono-repo UI/UX
- `content/drafts/` & `content/finals/` — Published content
- `data/daily-log/` — Public progression logs (images gitignored)

## Quarterly IP Audit Schedule

- **Next Audit**: May 15, 2026
- **Audit Cadence**: Every 3 months (Feb, May, Aug, Nov)

### Audit Workflow:
1. Run `/repostats` to refresh file counts
2. Review new scripts in `scripts/` — document in this registry
3. Review new architectural patterns in `website/` — add license headers (Phase 1.3)
4. Check for accidental exposure: run `/update-github` blocklist scan
5. Update this registry with new assets
6. Update "Last Updated" timestamp at top

## IP Innovation Categories (Decision Tree)

When building new systems, categorize immediately:

| Category | Protection Level | Action |
|----------|------------------|--------|
| **Core Engine** | Full proprietary | Move to `scripts/` (gitignored) |
| **Architecture** | View-source licensed | Keep in `website/` with license header |
| **Skill/Workflow** | Selectively open | `.cursor/skills/` (public) or `clients/` (private) |
| **Content/Brand** | Attribution required | `content/` (CC BY-NC 4.0) |

**Decision Tree**:
- Does it give competitors a **functional advantage**? → Gitignore it (`scripts/`, `data/`, `clients/`)
- Does it showcase **how you think** but not implementation? → Public + license (`website/`, `skills/`)
- Is it **educational value** that builds brand? → Public, permissive (`content/finals/`, `.cursor/skills/`)
- Is it **partner-specific**? → Gitignored (`clients/` or `partners/`)

## Notes

- **Repository visibility**: Public at `github.com/shawnla90/shawn-gtme-os`
- **Strategy**: Public code is the "what" (UI, patterns). Private code is the "how" (algorithms, logic).
- **IP parking lot**: Not yet implemented (see Phase 3.3 in protection plan)
- **License files**: Not yet added (pending Phase 1 implementation)

---

*This registry is a living document. Update after any major feature additions or quarterly reviews.*
