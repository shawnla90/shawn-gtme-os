# GTM-OS - AI Operating Instructions

> This is a self-contained GTM operations folder. If you're an AI assistant opening this folder, everything you need is here.

## Identity

**Who:** [Your name / company]
**What:** [What your GTM operation does - one sentence]
**Product:** [What you sell and how]

## Tool Inventory

| Tool | Role | Status | MCP? | Config |
|------|------|--------|------|--------|
| [CRM] | Pipeline management | Active | | |
| [Enrichment] | Contact data | Active | | |
| [Sequencing] | Email campaigns | Active | | |
| [Analytics] | Tracking | Active | | |
| [Research] | Company discovery | Active | | |

## Data Flow

```
[Discovery] -> [Enrichment] -> [Content Generation] -> [Database]
                                                          |
                                    +---------+-----------+
                                    |                     |
                               [CRM Sync]          [Landing Pages]
                                    |                     |
                               [Sequencing]          [Analytics]
                                    |
                               [Sending]
```

## Key Conventions

### Architecture Split
- **Database = the warehouse.** Every record ever created. Full universe. Raw data. Logs.
- **CRM = the workbench.** Only records actively being worked. Clean, curated, human-usable.

## Workflow Rules

### Safety
- Never commit `.env` files or API keys
- Outreach is always explicit (never automated without confirmation)
- Always dry-run before sending
- Pre-push scan for sensitive data

## Folder Map

```
gtm-os/
├── CLAUDE.md              <- you are here
├── status.md              <- current pipeline health
├── log.md                 <- append-only session log
├── demand/                <- WHO buys (ICP, positioning, competitors)
├── segments/              <- target groups within ICP
├── messaging/             <- WHAT we say (angles, proof points, templates)
├── campaigns/             <- HOW we execute (active + archived)
├── engine/                <- THE MACHINE (one doc per tool)
└── content/               <- publishing side-effects
```

## Getting Started

1. Fill in `demand/icp.md` with your ideal customer profile
2. Document your tools in `engine/` (one file per tool)
3. Write your first segment in `segments/`
4. Create a campaign in `campaigns/active/`
5. Update `status.md` as you go
