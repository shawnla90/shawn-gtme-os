# Clients & Partners

## How This Works

Each partner or client gets their own directory with operational skill files: research, prompts, and workflows scoped to their business.

## Directory Layout

```
clients/
├── partner/           ← Companies you do GTM engineering for
│   ├── elauwit/       ← Multifamily WiFi/NaaS (Nasdaq: ELWT)
│   ├── connext/       ← [TBD]
│   └── exol/          ← [TBD]
│
└── client/            ← Lead Alchemy side projects
    └── steves/        ← SteveS recruiting
```

## Partner vs. Client

**Partners** are companies you work for as a GTM engineer. They have ICPs, campaigns, domains, and workflows you operate. Each partner directory contains research (ICP, personas), prompts (qualification, signals, copy), and workflows (campaign patterns, domain management, monitoring).

**Clients** are your own Lead Alchemy business engagements. Separate projects you run independently.

## Per-Partner Structure

```
partner-name/
├── SKILL.md                          ← Entry point + overview + status
├── research/
│   ├── icp.md                        ← Target accounts, geography, product fit
│   └── personas.md                   ← Buyer tiers + Clay/Claygent query formats
├── prompts/
│   ├── web-reveal-qualification.md   ← Qualify web reveal hits against ICP
│   ├── signal-retrieval.md           ← Key signals to enrich and monitor
│   └── campaign-copy.md             ← Proven sequences and templates
├── workflows/
│   ├── campaign-patterns.md          ← Validated plays and iteration notes
│   ├── domain-management.md          ← Mailbox rotation, warmup, sunsetting
│   └── campaign-monitoring.md        ← Instantly/Smartlead analysis, MCP monitoring
└── resources/
    └── transcripts/                  ← Call transcripts referenced by prompts + research
        ├── kickoff.md                ← Kickoff call
        ├── pre-call.md              ← Pre-call
        ├── roadmap.md               ← Roadmap call (updated as it evolves)
        └── session-01.md            ← Numbered sessions (add session-02, 03, etc.)
```

## Onboarding a New Partner or Client

1. Create directory: `mkdir -p clients/partner/new-name/{research,prompts,workflows}`
2. Start with `SKILL.md` — capture company overview and relationship context
3. Build `research/icp.md` and `research/personas.md` from discovery
4. Add prompts as qualification/signal/copy needs emerge
5. Document workflows as campaigns go live

## Naming Convention

Lowercase, hyphenated: `clients/partner/company-name/`
