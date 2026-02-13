---
name: partner-onboard
description: Scaffold a new GTM partner in the repo by extracting data from ClickUp MCP and the partner's public website. Creates the full folder structure (SKILL.md, research, prompts, workflows, resources) and populates ICP, personas, and web reveal qualification prompts. Optionally prompts for GDrive doc downloads. Use when the user types /partneronboard or asks to add/onboard a new partner.
---

# Partner Onboard

## Trigger

User says `/partneronboard <partner-name>` or asks to add/set up a new partner.

## Prerequisites

- ClickUp MCP connected (for extracting partner folder data)
- Internet access (for fetching partner website)
- Partner must exist as a folder in ClickUp (typically in a pod space like ComPODres, Pod Racers, or Pod of Gold)

## Workflow

### Step 1: Find the Partner in ClickUp

1. Search ClickUp for the partner name:
   ```
   clickup_search(keywords="<partner-name>")
   ```
2. If not found, try partial name or ask user for correct spelling.
3. Locate the **partner folder** (type: folder) — this is the main operational folder, typically inside a pod space.
4. Note the folder ID and space name.

### Step 2: Extract ClickUp Data

Pull the following from the partner folder:

**From folder hierarchy** (get_workspace_hierarchy with space_ids filter):
- All lists within the partner folder (Product Roadmap, Onboarding, Quick Wins, etc.)
- Sprint lists (count and date range)

**From task search** (search within the folder using location.categories filter):
- All tasks with names, statuses, assignees, time estimates
- Group by list to understand work areas

**Key data to extract:**
- Assignees → contacts.md (strategist, tech lead, etc.)
- List names → work areas for SKILL.md status section
- Task statuses → active vs completed work areas
- Task names → infer company characteristics (e.g., "Kantata <> HubSpot" = uses Kantata)

**Also search for:**
- ClickUp docs mentioning the partner (clickup_search with asset_types: ["doc"])
- Comments on key tasks (kickoff, GTM survey, RED presentation)

### Step 3: Fetch the Partner's Website

Use WebSearch and WebFetch to pull:
- Company overview (what they sell, to whom)
- Products/services breakdown
- Target verticals and customer logos
- Key differentiators and competitive positioning
- Locations and geography
- About/company page for founding date, team size, awards

This is critical for building the ICP — ClickUp has operational data, the website has what the company actually does.

### Step 4: Prompt for GDrive Downloads (Optional)

Tell the user:

> **Optional: GDrive Documents**
>
> If you have access to the partner's Google Drive folder, download these docs and share the file paths:
> 1. **GTM Survey** (.xlsx or Google Doc) — contains ICP, products, revenue segments, deal info
> 2. **RED (Revenue Engine Diagnostic) deck** — benchmarking, process flow, roadmap
> 3. **Kickoff deck / recap** — engagement scope and partner context
> 4. **Revenue Mapping Miro** — customer journey (if exported)
>
> You can download from Chrome: File > Download > PDF or .xlsx
> Then share the path like: `@/Users/shawntenam/Downloads/filename.xlsx`
>
> If you don't have access or can't download, we'll proceed with ClickUp + website data only.

If the user provides files, read them:
- For .xlsx: use pandas `pd.read_excel(path, sheet_name=None)` to read all sheets
- For .pdf: use the Read tool directly
- Extract ICP, personas, products, revenue data, deal info

### Step 5: Create the Folder Scaffold

```bash
mkdir -p clients/partner/<partner-name>/{research,prompts,workflows,resources/transcripts}
```

### Step 6: Write the Files

Use the templates below. Replace all `{{PLACEHOLDER}}` values with extracted data.

**Files to create:**

| File | Source | Priority |
|------|--------|----------|
| `SKILL.md` | Website + ClickUp + GDrive | Required |
| `research/icp.md` | Website + GDrive GTM Survey | Required |
| `research/personas.md` | Website + GDrive + user Clay queries | Required |
| `prompts/web-reveal-qualification.md` | ICP data | Required |
| `prompts/signal-retrieval.md` | ICP + industry research | Required |
| `prompts/campaign-copy.md` | Placeholder | Skeleton |
| `workflows/campaign-patterns.md` | Placeholder | Skeleton |
| `workflows/campaign-monitoring.md` | Placeholder | Skeleton |
| `resources/contacts.md` | ClickUp assignees | Required |

### Step 7: Update README

Add the new partner to `clients/README.md` directory layout section.

### Step 8: Summary

Print a summary of:
- What was created
- What data sources were used (ClickUp, website, GDrive)
- What TODOs remain (marked in files)
- ClickUp reference IDs for future queries

## File Templates

### SKILL.md Template

```markdown
---
name: {{partner-slug}}-gtm-ops
version: "1.0"
type: partner
status: active
description: GTM engineering operations for {{Partner Name}}. {{One-line description from website}}.
---

# {{Partner Name}} — GTM Operations Skill Tree

## Company Overview

**{{Partner Name}}** ({{website}}) — {{2-3 sentence overview from website}}.

**Core services/products**:
1. {{Product/Service 1}}: {{description}}
2. {{Product/Service 2}}: {{description}}

**Key differentiators**: {{from website}}

**Tech stack (internal)**: {{inferred from ClickUp — CRM, PSA, integrations}}

**GTM channels**: {{from ClickUp or GDrive}}

## Skill Tree

### Research
| File | What it covers |
|------|---------------|
| [`research/icp.md`](research/icp.md) | Target accounts, verticals, qualification criteria |
| [`research/personas.md`](research/personas.md) | Buyer tiers + Clay/Claygent query formats |

### Prompts
| File | What it covers |
|------|---------------|
| [`prompts/web-reveal-qualification.md`](prompts/web-reveal-qualification.md) | Qualify web reveal hits against ICP |
| [`prompts/signal-retrieval.md`](prompts/signal-retrieval.md) | Key signals to enrich and monitor |
| [`prompts/campaign-copy.md`](prompts/campaign-copy.md) | Sequences and templates |

### Workflows
| File | What it covers |
|------|---------------|
| [`workflows/campaign-patterns.md`](workflows/campaign-patterns.md) | Plays and iteration notes |
| [`workflows/campaign-monitoring.md`](workflows/campaign-monitoring.md) | Campaign analysis and monitoring |

### Resources
| File | What it covers |
|------|---------------|
| [`resources/contacts.md`](resources/contacts.md) | Key contacts |
| [`resources/transcripts/`](resources/transcripts/) | Call transcripts |

## Current Status

### RevPartners Engagement
- **Strategist**: {{from ClickUp assignees}}
- **Tech Lead**: {{from ClickUp assignees}}

### Active Work Areas (from ClickUp)
- **In Progress**: {{list items with "in progress" status}}
- **Not Started**: {{list items with "not started" status}}
- **Completed**: {{list items with "delivered" status}}

### ClickUp Reference
- **Space**: {{space name}} (id: {{space_id}})
- **Folder**: {{partner name}} (id: {{folder_id}})
```

### research/icp.md Template

See `clients/partner/elauwit/research/icp.md` or `clients/partner/praecipio/research/icp.md` for format. Key sections:
- What the partner sells
- Target accounts (company type, revenue, employee count, geography)
- Key verticals (table with vertical + why they fit)
- Qualification criteria (checklist)
- Disqualifiers

### research/personas.md Template

See `clients/partner/praecipio/research/personas.md` for format. Key sections:
- Persona tiers (Economic Buyer, Technical Decision Maker, Operational Buyer, etc.)
- Clay/Claygent queries — full query + by-tier bracketed format + outreach priority groups
- Query usage notes

If the user has a preferred Clay query for this partner's personas, use that. Otherwise, build from the ICP verticals and typical buyer roles.

### prompts/web-reveal-qualification.md Template

See `clients/partner/elauwit/prompts/web-reveal-qualification.md` for format. Key sections:
- Purpose
- Qualification Prompt (template with {placeholders} for company data)
- Scoring Logic table (signal + points)
- Routing rules (Qualified / Needs Research / Not Qualified → next action)

The PRIMARY GATE in scoring should be the partner's most critical qualification criterion (e.g., location count for Connext, Atlassian footprint for Praecipio, portfolio size for Elauwit).

## ClickUp Reference

### Finding Partner Folders

Partner folders typically live in pod spaces:
- **ComPODres** (id: 43658551)
- **Pod Racers** (id: 43658548)
- **Pod of Gold** (id: 43658556)

Search strategy:
1. `clickup_search(keywords="<partner-name>")` — find any tasks/docs
2. Check result hierarchy for folder name and ID
3. `clickup_get_folder(folder_id="<id>")` — confirm folder and space
4. `clickup_get_workspace_hierarchy(space_ids=["<space_id>"], max_depth=2)` — get full list structure
5. Search within folder: `clickup_search(filters={location: {categories: ["<folder_id>"]}})` — get all tasks

### Extracting Contacts from Assignees

ClickUp assignees on partner tasks reveal the RP team:
- Look for recurring assignees across multiple lists
- Primary strategist = most assigned across roadmap/sprint tasks
- Tech lead = assigned to technical setup / integration tasks
- Check the Onboarding list for "Strategist:" prefixed tasks
