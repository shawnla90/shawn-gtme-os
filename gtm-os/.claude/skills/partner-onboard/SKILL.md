---
name: partner-onboard
description: Scaffold a new GTM partner in the repo from ClickUp + website data. Creates folder structure, SKILL.md, ICP, personas, prompts. Use when the user types /partneronboard <partner>.
---

# Partner Onboard

## Trigger

`/partneronboard <partner-name>`

## Prerequisites

ClickUp MCP connected, internet access for website fetch.

## Workflow

1. **Find in ClickUp**: `clickup_search(keywords="<partner>")`, locate partner folder
2. **Extract ClickUp data**: folder hierarchy, tasks (names/statuses/assignees), docs
3. **Fetch website**: company overview, products, verticals, differentiators, team size
4. **Prompt for GDrive** (optional): GTM Survey, RED deck, kickoff deck, revenue mapping
5. **Create scaffold**:
   ```bash
   mkdir -p clients/partner/<name>/{research,prompts,workflows,resources/transcripts}
   ```
6. **Write files**:
   - `SKILL.md` - company overview, skill tree, current status, ClickUp refs
   - `research/icp.md` - target accounts, verticals, qualification criteria
   - `research/personas.md` - buyer tiers, Clay queries
   - `prompts/web-reveal-qualification.md` - ICP-based qualification prompt
   - `prompts/signal-retrieval.md` - enrichment signals
   - `prompts/campaign-copy.md` - skeleton
   - `workflows/campaign-patterns.md` - skeleton
   - `workflows/campaign-monitoring.md` - skeleton
   - `resources/contacts.md` - from ClickUp assignees
7. **Update** `clients/README.md`
8. **Summary**: what was created, data sources used, remaining TODOs

## ClickUp Search Strategy

Pod spaces: ComPODres (43658551), Pod Racers (43658548), Pod of Gold (43658556). Search -> find folder -> get hierarchy -> search tasks within folder.
