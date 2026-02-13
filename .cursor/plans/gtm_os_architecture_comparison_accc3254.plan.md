---
name: GTM OS Architecture Comparison
overview: A detailed architectural comparison between Shawn's production GTM OS and Jacob Dietle's GTM Context OS Quickstart, identifying structural gaps, overlaps, and whether any concepts from his approach should be adopted.
todos:
  - id: taxonomy-yaml
    content: Consider adding a taxonomy.yaml config file mapping domains (shawnos/gtmos/contentos), content types, and status lifecycles for multi-site routing as the 3-site launch progresses
    status: pending
  - id: content-health-skill
    content: Consider building a /contenthealth skill inspired by his /graph-health -- scan for stale drafts, unused pillars, parked ideas aging out, partner sync gaps
    status: pending
  - id: ingest-skill
    content: Consider extending /parkidea or building a lightweight /ingest skill that takes raw notes (Slack syncs, call transcripts) and produces structured captures with domain/pillar tagging
    status: pending
isProject: false
---

# GTM OS vs. GTM Context OS Quickstart -- Architectural Comparison

## TL;DR Verdict

These are **fundamentally different things**. Jacob's repo is a **knowledge management starter kit** (a template for building a context graph). Yours is a **production GTM execution engine** (a living system that creates content, runs partner ops, and ships work). His is a blank canvas with a good frame. Yours is the entire studio, filled with finished and in-progress paintings.

That said, he has **one structural concept** worth considering: a formal knowledge graph layer with taxonomy/ontology governance. Everything else he has, you either already have a more advanced version of, or don't need.

---

## Architecture Side-by-Side

### Jacob's Repo (36 stars, 6 commits)

```
gtm-context-os-quickstart/
├── .claude/
│   ├── agents/ingestion-agent.md      # Raw content → structured nodes
│   ├── commands/
│   │   ├── quickstart.md              # 10-min guided setup
│   │   ├── ingest.md                  # Convert docs to knowledge nodes
│   │   └── graph-health.md            # Check tag sprawl, orphans, link health
│   └── skills/
│       ├── context-os-basics/         # What a Context OS is
│       ├── epistemic-context-grounding/  # Evidence attribution framework
│       └── context-gap-analysis/      # "Check before you build"
├── templates/
│   ├── CLAUDE_MD_STARTER.md           # Starter CLAUDE.md
│   ├── node_template.md              # Knowledge node format
│   ├── taxonomy_starter.yaml         # Blessed tags + domains
│   └── ontology_starter.yaml         # Relationship types + link rules
├── examples/
│   └── sample-transcript.md          # Demo ingestion input
├── CLAUDE.md                         # Navigation guide
├── CLAUDE_CODE_SETUP_GUIDE.md        # Claude Code install instructions
└── README.md
```

**Total**: ~15 files. 3 commands. 3 skills. Zero production content.

### Your Repo

```
shawn-gtme-os/
├── .cursor/skills/          # 31+ agent skills (MCP-integrated, production-ready)
├── .cursor/rules/           # Session rules (Instantly, prompt formatting)
├── .claude/skills/          # GitHub safety (blocklist, pre-push scan)
├── skills/
│   ├── tier-1-voice-dna/    # Core identity (voice, anti-slop, safety)
│   ├── tier-2-context-playbooks/  # Platform adaptation (LinkedIn, X, TikTok, etc.)
│   ├── tier-3-content-ops/  # Checklists, pillars, captures, idea bank
│   └── ai-pattern-detection/  # 29-flag AI content detection
├── content/                 # Multi-platform output (LinkedIn, X, Substack, Reddit, TikTok)
├── clients/                 # Per-partner ops (ICP, prompts, resources, campaigns)
├── workflows/               # Play/series indices
├── scripts/                 # Python automation (enrichment, dashboard, MX)
├── data/                    # Daily logs, skill tree, repo stats
└── SKILL.md                 # Root voice system v4.0, command-to-context mapping
```

**Total**: 31+ skills, 7+ commands, 5 content platforms, partner management, MCP integrations, image generation, daily tracking, idea bank. Hundreds of production files.

---

## What He Has That You Don't

### 1. Formal Knowledge Graph Structure (taxonomy.yaml + ontology.yaml)

Jacob's core differentiator is a **graph-based knowledge layer**:

- **taxonomy.yaml** -- Blessed tags, domains (technical/business/methodology/emergent), node types (concept/pattern/case-study/framework), status lifecycle (emergent -> validated -> canonical), quality thresholds (tag sprawl warning at 20%)
- **ontology.yaml** -- Relationship types (enables/supports/implements), linking rules (3+ links per node), attribution formats

Your equivalent: Your `skills/` tier system handles voice and context, but you don't have a **formalized tag vocabulary** or **relationship graph** between knowledge pieces. Your idea bank has domain/pillar tracking but it's flat, not graph-linked.

**Is this worth adopting?** Maybe partially. A `taxonomy.yaml` for your content pillars/domains could help as you scale to 3 sites (shawnos, gtmos, contentos). The ontology and wiki-linking is more academic than practical for your workflow.

### 2. Knowledge Node Template with Frontmatter

Jacob structures every piece of knowledge as a node with:

- name, description, domain, node_type, status, tags, topics
- `related_concepts: [[wiki-link]]` syntax
- Evidence attribution: `[VERIFIED]`, `[INFERRED]`, `[UNVERIFIABLE]`

Your equivalent: Your captures and idea bank entries have structured fields (title, domain, pillars, status, description, related ideas, breadcrumb notes), but not the full node metadata or wiki-linking.

**Is this worth adopting?** The evidence attribution is interesting for GTM research (marking whether a partner insight is verified vs. inferred), but the full node template would be over-engineering for your content workflow.

### 3. Graph Health Command

`/graph-health` checks: tag sprawl percentage, orphan nodes (no links), hub concentration, broken wiki-links, stale emergent nodes.

Your equivalent: `/repostats` and `/skilltree` cover system health from a different angle (file counts, skill progression), but you don't audit for orphaned or disconnected knowledge.

**Is this worth adopting?** Not directly. Your content isn't graph-linked, so graph health doesn't apply. A content health check (stale drafts, unused pillars, partner engagement gaps) would be more valuable.

### 4. Ingestion Pipeline

`/ingest` takes raw content (transcripts, docs, notes) and converts it into structured knowledge nodes with proper taxonomy tags, wiki-links, and placement.

Your equivalent: `/parkidea` captures ideas. Slack captures go to `captures/`. But you don't have a formal "take this raw doc and structure it into reusable knowledge" pipeline.

**Is this worth adopting?** Partially. A version of this that ingests Slack syncs, partner call notes, or Substack comments into structured learnings could be useful. But his version is designed for a knowledge graph you don't have.

### 5. Epistemic Framework (Context Sensitivity + Falsifiability)

Jacob has a formal decision framework:

- Context Sensitivity Model: `(Model : Scenario) * Context -> Output`
- Falsifiability Spectrum: STRONG / WEAK / UNVERIFIED
- "Check before you build" gap analysis

Your equivalent: Your anti-slop system, pre-publish checklist, and substance requirements serve a similar quality-gating purpose but are focused on **content quality** rather than **knowledge quality**.

**Is this worth adopting?** No. This is an academic framework for knowledge management. Your voice DNA + anti-slop + substance requirements are more practical and battle-tested for content creation.

---

## What You Have That He Doesn't (the gap is enormous)


| Capability             | Your Repo                                                | His Repo            |
| ---------------------- | -------------------------------------------------------- | ------------------- |
| Agent skills           | 31+ production skills                                    | 3 conceptual skills |
| Content pipeline       | 5 platforms, drafts -> final -> publish                  | None                |
| Voice system           | 3-tier DNA + anti-slop + 29-flag detection               | None                |
| MCP integrations       | Slack, HeyReach, Instantly, Substack, Notion, LinkedIn   | None                |
| Partner/client ops     | Full lifecycle (onboard, campaigns, web reveal, handoff) | None                |
| Image generation       | Pillow scripts for branded visuals                       | None                |
| Daily tracking         | JSON logs + PNG dashboards + letter grades               | None                |
| Content pillars        | 11 pillar templates with performance data                | None                |
| Idea bank              | Domain/pillar tracking + breadcrumb protocol             | None                |
| Lead magnet / scaffold | Teach others to build their own OS                       | None                |
| Actual shipped content | Hundreds of posts across platforms                       | 1 sample transcript |


---

## Why His Might Appeal to Others (But Isn't Better)

Jacob's repo is a **quickstart template**. It's clean, minimal, and approachable. It answers: "How do I get started with a Context OS?" His `taste.systems` link suggests he sells advanced patterns on top.

Your repo is a **production system**. It answers: "How do I run a multi-platform content operation, partner GTM business, and personal brand from a single repo?"

His is the tutorial. Yours is what someone builds after graduating from the tutorial and working for 6+ months.

---

## Recommendations (If You Want to Cherry-Pick)

### Worth considering

1. **Taxonomy file for multi-site scaling** -- As you launch shawnos/gtmos/contentos, a simple `taxonomy.yaml` mapping domains, content types, and status lifecycle across all three sites could help agents route content to the right place. Not graph-level, just a config file your skills reference.
2. **Content health audit skill** -- Inspired by his `/graph-health` but adapted to your system: scan for stale drafts, unused pillars, partner channels with no recent sync, ideas parked too long. A `/contenthealth` command.
3. **Ingestion skill for raw notes** -- A lighter version of his `/ingest`: take a Slack sync, call transcript, or screenshot text and produce a structured capture with proper domain/pillar tagging. Could extend your existing `/parkidea` flow.

### Not worth adopting

- Wiki-linking between knowledge nodes (over-engineering for content ops)
- Epistemic framework / falsifiability spectrum (academic, not practical for your workflow)
- Ontology.yaml relationship types (you don't have a knowledge graph and don't need one)
- His CLAUDE.md structure (yours with the root SKILL.md + tiered skills is superior)
- Evidence attribution tags (your anti-slop and substance checks are more effective)

---

## Final Assessment

His architecture is **not better than yours**. It's solving a different, narrower problem (knowledge management) with a template approach. Your architecture is more advanced, more operational, and more complete by a wide margin. The one area where he adds a structural concept you lack is **formal taxonomy governance** -- and even there, your tier system and pillar templates accomplish 80% of what his taxonomy/ontology does, just without the YAML config files.

If anything, his repo validates your approach: he's teaching people to build the foundation layer of what you've already built, used, and iterated on for months.