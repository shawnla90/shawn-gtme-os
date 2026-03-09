# Content Captures

This directory contains content captured from Slack, the idea bank, and organized by category.

## Categories

- **content-ideas.md** - LinkedIn post ideas, content concepts, article ideas
- **idea-bank.md** - Structured future project ideas organized by domain and pillar (see below)
- **workflow-notes.md** - Workflow improvements, process optimizations, operational insights
- **thoughts.md** - Random thoughts, observations, ideas captured on the go
- **improvements.md** - System improvements, feature requests, technical enhancements

## Idea Bank

The idea bank (`idea-bank.md`) is a structured system for capturing future project ideas. Unlike the other files in this directory which are flat chronological captures, the idea bank organizes entries by domain and tracks them through a status lifecycle.

**Skill**: Use `/ideabank` or `/parkidea` to interact with the idea bank. See `.cursor/skills/idea-bank/SKILL.md` for the full command reference.

**Entry format**: Each idea includes an ID, title, domain, pillars, status, description, related ideas, breadcrumb notes, and capture date.

**Status lifecycle**: `parked` → `incubating` → `ready` → `shipped`

**Domains**: Ideas can map to existing sites (`shawnos`, `gtmos`, `contentos`) or future projects (`zenos`, `general`, or anything new).

**Breadcrumb protocol**: Ideas with breadcrumb notes feed into the forward-referencing strategy documented in `skills/tier-3-content-ops/breadcrumb-protocol.md`. Content creation skills can reference active breadcrumbs to suggest subtle hints about future projects in current content.

## How to Add Content

### Via Cursor Skill

For structured ideas with domain/pillar tracking:

```
/parkidea Zen Operating System -- AI health blog with biometric integration
```

or

```
/ideabank park <your idea>
```

### Via Slack

For quick captures (content ideas, thoughts, workflow notes):

Send a message to the GTM OS Bot:

```
@gtm-bot content-idea: Your idea here
```

Or use the slash command:

```
/capture content-idea Your idea here
```

### Supported Categories (Slack)

- `content-idea` / `content-ideas` / `content` → content-ideas.md
- `workflow` / `workflow-note` / `workflow-notes` → workflow-notes.md
- `thought` / `thoughts` → thoughts.md
- `improvement` / `improvements` / `improve` → improvements.md

## File Format

### Quick captures (Slack)

Each capture is automatically timestamped:

```markdown
## 2026-02-07 14:30

Your captured content here

---
```

### Idea bank entries

Each idea is a structured markdown section:

```markdown
### idea-slug

- **Title**: Human-readable name
- **Domain**: domain-slug (existing or future)
- **Pillars**: Content pillars it touches
- **Status**: parked | incubating | ready | shipped
- **Description**: 2-5 sentences
- **Related ideas**: Cross-references to other idea IDs
- **Breadcrumb notes**: How to hint at this in current content
- **Date captured**: YYYY-MM-DD
```

## Usage Tips

- Use `/parkidea` for structured future project ideas that need domain/pillar tracking
- Use Slack captures for quick content ideas and fleeting thoughts
- Review the idea bank periodically with `/ideabank` to see what's parked
- Promote ideas with `/ideabank promote <id>` as they mature
- Breadcrumb notes in the idea bank feed the breadcrumb protocol for forward-referencing in content
