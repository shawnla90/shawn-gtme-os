---
name: idea-bank
description: Capture, organize, and track future project ideas by domain and content pillar. Stores structured entries in the idea bank with status tracking, cross-references, and breadcrumb notes for forward-referencing in current content. Use when the user types /ideabank or /parkidea or asks to park an idea, check the idea bank, or promote an idea.
---

# Idea Bank Command

Capture future project ideas and organize them by domain, pillar, and status. Ideas live in a structured markdown file and can be promoted through stages as they move from concept to reality. Each idea includes breadcrumb notes that feed into the breadcrumb protocol for forward-referencing in current content.

## Command Pattern

- `/ideabank` — list all parked ideas, grouped by domain
- `/ideabank park <idea>` — capture a new idea interactively
- `/parkidea <idea>` — shorthand for `/ideabank park <idea>`
- `/ideabank view <domain>` — filter ideas by domain (e.g., `zenos`, `shawnos`, `gtmos`, `contentos`, `general`)
- `/ideabank promote <id>` — move an idea to the next status stage

## Workflow

### Step 1: Read the Idea Bank

1. Read `skills/tier-3-content-ops/captures/idea-bank.md`
2. Parse all existing entries to understand:
   - Current idea count and IDs (avoid duplicates)
   - Status distribution (how many parked vs incubating vs ready)
   - Domain distribution (which domains have the most ideas)

### Step 2: Determine the Action

**If `/ideabank` (no args)**:
- Display all ideas grouped by domain
- Show status counts: "12 ideas: 8 parked, 3 incubating, 1 ready"
- Highlight any ideas marked `incubating` — these are the ones actively being thought about
- If breadcrumb protocol exists, note how many ideas have active breadcrumbs

**If `/ideabank park <idea>` or `/parkidea <idea>`**:
- Use the provided idea as the starting point
- Prompt the user for missing fields (or infer from context):
  - **Domain**: Which site/project? Can be existing (`shawnos`, `gtmos`, `contentos`) or future (`zenos`, `general`, or a new one)
  - **Pillar(s)**: Which content pillars does it touch? Reference the pillars in `skills/tier-3-content-ops/pillars/`
  - **Description**: 2-5 sentences capturing the idea. If the user gave a detailed description in conversation, use that.
  - **Related ideas**: Cross-references to other idea IDs in the bank. Suggest matches if obvious.
  - **Breadcrumb notes**: How could this be hinted at in current content? Optional — skip if the idea is too early for breadcrumbs.
- Generate a slug ID from the idea title (e.g., "Zen Operating System" → `zen-os`)

**If `/ideabank view <domain>`**:
- Filter and display only ideas matching the specified domain
- Show full details for each idea in that domain
- If domain has no ideas: "No ideas parked for {domain} yet."

**If `/ideabank promote <id>`**:
- Find the idea by ID
- Show current status and prompt for next status:
  - `parked` → `incubating` (actively thinking about it)
  - `incubating` → `ready` (could start building)
  - `ready` → `shipped` (done — prompt for link to result)
- If promoting to `shipped`, ask for a link or reference to the shipped result
- Update the idea bank file with the new status and date

### Step 3: Load Context References

Read these files for context when capturing new ideas:

1. `skills/tier-3-content-ops/captures/idea-bank.md` — existing ideas (avoid duplicates, find related ideas)
2. `skills/tier-3-content-ops/breadcrumb-protocol.md` — active breadcrumbs (to suggest breadcrumb notes for new ideas)
3. `skills/tier-3-content-ops/pillars/` — scan pillar filenames to suggest pillar mapping

Available pillars (for reference during capture):
- `plays-series` — GTM plays series
- `building-sharing` — narrative, reflective, personal journey
- `skill-system-shares` — frameworks, learnable systems
- `gtm-memes` — meme/humor format
- `release-reactions` — builder take on new tools
- `newsletter-editorial` — Substack deep dives
- `newsletter-growth` — growth mechanics
- `newsletter-repurpose` — social to newsletter
- `reddit-growth-seo` — Reddit growth/SEO
- `x-micro-tips` — X micro-tip posts
- `youtube-builder-systems` — YouTube long-form
- (new pillars can be proposed for ideas that don't fit existing ones)

Known domains:
- `shawnos` — shawnos.ai (personal brand, building and sharing, origin story)
- `gtmos` — thegtmos.ai (GTM systems, plays, technical walkthroughs)
- `contentos` — thecontentos.ai (content methodology, voice systems, meta-content)
- `general` — not tied to a specific domain yet
- (new domains can be created for future projects)

### Step 4: Write the Entry

**Entry format** (appended to `skills/tier-3-content-ops/captures/idea-bank.md`):

```markdown
### {id}

- **Title**: {human-readable name}
- **Domain**: {domain slug} ({note if future/existing})
- **Pillars**: {pillar name(s)}
- **Status**: {parked | incubating | ready | shipped}
- **Description**: {2-5 sentences capturing the idea}
- **Related ideas**: {comma-separated idea IDs, or "none yet"}
- **Breadcrumb notes**: {how to hint at this in current content, or "none yet"}
- **Date captured**: {YYYY-MM-DD}
- **Date promoted**: {YYYY-MM-DD — added when status changes, omit if still parked}
- **Shipped link**: {URL or path — added when shipped, omit otherwise}
```

### Step 5: Update Breadcrumb Protocol (if applicable)

If the new idea has breadcrumb notes:
1. Read `skills/tier-3-content-ops/breadcrumb-protocol.md`
2. Suggest adding the idea's breadcrumb to the "Active Breadcrumbs" section
3. Ask the user: "Want me to add this breadcrumb to the active list?"
4. If yes, append to the active breadcrumbs section

### Step 6: Save and Confirm

1. Save the updated idea bank to `skills/tier-3-content-ops/captures/idea-bank.md`
2. Display confirmation:
   ```
   Parked: {title}
   ID: {id}
   Domain: {domain}
   Status: {status}
   Saved to: skills/tier-3-content-ops/captures/idea-bank.md
   
   {if breadcrumb notes exist}
   Breadcrumb note captured. Run /ideabank to see all active breadcrumbs.
   ```

## Status Lifecycle

```
parked → incubating → ready → shipped
  |                              |
  |   (idea is just captured)    |   (project is live, link added)
  |                              |
  +--- can be archived/dropped --+
```

- **parked**: Just an idea. Out of the head, into the system. No commitment.
- **incubating**: Actively thinking about it. May be researching, sketching, or testing the concept.
- **ready**: Could start building. The idea is clear enough to act on.
- **shipped**: Done. The idea became a real thing. Link to the result.

## Output Quality Rules

- Keep entries concise. The idea bank is for quick capture, not detailed specs.
- Slugs should be short and memorable: `zen-os` not `zen-operating-system-ai-health-lifestyle-blog`
- Cross-references matter. Always check existing ideas for related entries.
- Breadcrumb notes should be subtle and natural. If it feels forced, skip it.
- Domain can be speculative. "zenos (future)" is fine — the bank tracks what doesn't exist yet.

## Error Handling

- **Idea bank file not found**: Create `skills/tier-3-content-ops/captures/idea-bank.md` with the header template from this skill.
- **Duplicate ID**: Warn the user and suggest an alternative slug (e.g., `zen-os-v2` or a more specific slug).
- **Unknown domain**: Accept it as a new domain. The bank is forward-looking — new domains are expected.
- **Breadcrumb protocol not found**: Skip Step 5. Note: "Breadcrumb protocol not found. Create it with the breadcrumb-protocol doc to enable forward-referencing."

## Integration

- **With content skills**: When `/substackpost`, `/playdraft`, `/websitepost`, or other content creation skills run, they can optionally read the idea bank to surface relevant breadcrumb notes for the current topic.
- **With breadcrumb protocol**: Ideas with breadcrumb notes feed the active breadcrumbs list in `skills/tier-3-content-ops/breadcrumb-protocol.md`.
- **With daily tracker**: The `/tracker` skill can include idea bank stats (total ideas, status counts) in the daily dashboard.
- **With workflow indexes**: When an idea is promoted to `ready`, suggest creating a workflow index entry for it.

## Examples

### Example 1: Park a new idea
```
User: /parkidea Zen Operating System -- AI health and lifestyle blog with biometric integration

→ Reads idea bank, finds 0 existing ideas
→ Generates slug: zen-os
→ Prompts: "Domain? I'd suggest a new one: zenos (future). Pillars? Building and Sharing + a new AI+Lifestyle pillar."
→ User confirms
→ Writes entry with breadcrumb notes
→ "Parked: Zen Operating System. ID: zen-os. Domain: zenos (future)."
```

### Example 2: List all ideas
```
User: /ideabank

→ Reads idea bank
→ Groups by domain:
  
  ## zenos (future) — 1 idea
  - zen-os (parked) — AI health and lifestyle blog
  
  ## general — 2 ideas
  - recursive-content-skill (incubating) — /recursiveloop repurpose command
  - gtm-acronym-series (parked) — new acronym content series
  
  3 ideas: 2 parked, 1 incubating
```

### Example 3: Promote an idea
```
User: /ideabank promote zen-os

→ Finds zen-os, current status: parked
→ "Promote zen-os from parked → incubating?"
→ User confirms
→ Updates status, adds date promoted
→ "Promoted: zen-os is now incubating."
```

### Example 4: View by domain
```
User: /ideabank view shawnos

→ Filters to shawnos domain
→ Shows all shawnos ideas with full details
→ "2 ideas for shawnos: 1 parked, 1 ready"
```
