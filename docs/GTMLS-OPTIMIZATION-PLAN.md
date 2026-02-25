# GTMLS Optimization Plan

> **Goal**: Transform the GTM Lexicon from a glossary (27 thin definitions) into a showcase of real GTM engineering — with MCP use cases, Exa workflows, code examples, and new React components. Every term backed by something Shawn actually built.
>
> **Current state (post-Sprint 1)**: 43 terms, 8 categories. MCP Server, Exa, Smartlead, Orchestration, Parallel Agents, Enrichment Pipeline, Rate Limiting, Batch Processing, Deduplication, Find Similar added. Icebreaker, Poke the Bear, Pain Point Signal, Signals, Enrichment, and Scoring expanded with real Exa use cases. SEO keywords updated. Build verified.
>
> **Target state**: 43+ terms, 8 categories, with code showcase components, use-case blocks, tool integration maps, and cross-linking to How-To guides and playbooks.

---

## Phase 1: Data Layer — New Terms & Categories

### 1A. Add "AI & MCP" Category

New category in `gtm-terms.ts`:

```typescript
{
  id: 'ai-mcp',
  name: 'AI & MCP',
  prompt: '$ ls ~/gtm-os/ai-mcp/',
  terms: [...]
}
```

**New terms to add:**

| Term ID | Name | Why It Matters for GTMLS |
|---------|------|--------------------------|
| `mcp-server` | MCP Server | Core concept — connects AI agents to tools. Every GTM workflow runs through MCPs. |
| `exa` | Exa | People search, company research, TAM expansion. We just saved hours with SDK scripts. |
| `smartlead` | Smartlead | Missing entirely — it's Exol's email tool, different from Instantly. |
| `parallel-agents` | Parallel Agents | Running multiple AI tasks simultaneously. Key to the "hours saved" story. |
| `orchestration` | Orchestration | How Clay, Exa, MCPs, and email tools chain together. The meta-pattern. |

### 1B. Add "Automation & Scripts" Category

```typescript
{
  id: 'automation',
  name: 'Automation & Scripts',
  prompt: '$ ls ~/gtm-os/automation/',
  terms: [...]
}
```

**New terms:**

| Term ID | Name | Why |
|---------|------|-----|
| `enrichment-pipeline` | Enrichment Pipeline | The full flow: raw data → Exa/Clay → scored, personalized, routed. |
| `rate-limiting` | Rate Limiting | Every API script needs this. Real pattern from Exa scripts. |
| `batch-processing` | Batch Processing | Processing 73 companies in one run. CSV in, enriched CSV out. |
| `deduplication` | Deduplication | Every enrichment script checks for existing records. Prevents double-work. |
| `find-similar` | Find Similar | Exa's `find_similar()` for TAM expansion. Unique SDK technique. |

### 1C. Expand Existing Terms

These existing terms are too thin. Expand with real use cases:

| Term | Current State | What to Add |
|------|--------------|-------------|
| `icebreaker` | Generic definition | Add Exa-powered icebreaker generation workflow. Code snippet from `exa_icebreaker_enrichment.py`. |
| `poke-the-bear` | Definition only | Add the 3-variable model context, bucket-specific examples, prompt template. |
| `pain-point-signal` | Definition only | Add signal detection workflow, Exa script pattern, 6 signal types. |
| `signals` | Generic | Add Exa `exa_signal_detection.py` as real implementation. |
| `enrichment` | Clay-focused | Add Exa SDK as second enrichment path. Show how they chain. |
| `scoring` | Basic | Reference the 200-point composite model. |
| `icp` | Basic | Reference the multi-partner ICP framework pattern. |

---

## Phase 2: New React Components

### 2A. `UseCaseBlock` Component

A new component type that renders inside term cards. Shows a real use case with context.

```
┌─────────────────────────────────────────────┐
│  USE CASE: Exa Icebreaker Search             │
│  ─────────────────────────────               │
│  Problem: Needed icebreakers for 73           │
│  partner-play companies before ShopTalk.      │
│                                               │
│  Solution: Python script using Exa SDK        │
│  that crawls each domain for case studies,    │
│  news, and thought leadership.                │
│                                               │
│  Result: 73 companies enriched, 150KB of      │
│  contextual research, ~4 hours saved.         │
│                                               │
│  Tools: Exa SDK · Python · CSV pipeline       │
│  ┌─────────────────────────────────────┐      │
│  │ → See the full playbook             │      │
│  └─────────────────────────────────────┘      │
└─────────────────────────────────────────────┘
```

**Data structure addition to `GTMTerm`:**

```typescript
interface UseCase {
  title: string
  problem: string
  solution: string
  result: string
  tools: string[]
  playbookLink?: string  // links to /playbooks/ or /how-to/
}

// Add optional field to GTMTerm:
useCases?: UseCase[]
```

### 2B. `CodeShowcase` Component

Renders real code snippets from actual scripts. Terminal-styled to match the site aesthetic.

```
┌─────────────────────────────────────────────┐
│  $ cat exa_icebreaker_enrichment.py          │
│  ─────────────────────────────               │
│  from exa_py import Exa                      │
│                                              │
│  exa = Exa(api_key=os.environ["EXA_KEY"])    │
│  results = exa.search_and_contents(          │
│      f"site:{domain} case study OR           │
│        customer story OR results",           │
│      num_results=3,                          │
│      text=True,                              │
│      use_autoprompt=False                    │
│  )                                           │
│                                              │
│  # Clean HTML entities, strip nav            │
│  # boilerplate, extract key insights         │
│  ─────────────────────────────               │
│  73 companies · 150KB · 4 hours saved        │
└─────────────────────────────────────────────┘
```

**Data structure:**

```typescript
interface CodeExample {
  filename: string
  language: 'python' | 'typescript' | 'bash'
  code: string           // sanitized snippet (not full file)
  caption?: string       // "73 companies · 150KB · 4 hours saved"
}

// Add optional field to GTMTerm:
codeExamples?: CodeExample[]
```

### 2C. `ToolIntegrationMap` Component

Visual showing how tools chain together. For terms like `orchestration`, `enrichment-pipeline`.

```
┌─────────────────────────────────────────────┐
│  TOOL CHAIN: Signal-Triggered Outbound       │
│  ─────────────────────────────               │
│                                              │
│  [Exa SDK] ──→ [Clay] ──→ [Instantly]       │
│  search &      enrich &    send &            │
│  qualify       score       personalize       │
│       │            │            │             │
│       ▼            ▼            ▼             │
│  73 companies  200-pt score  3-email seq     │
│  found         per lead      with variables  │
└─────────────────────────────────────────────┘
```

**Data structure:**

```typescript
interface ToolChainStep {
  tool: string
  action: string
  output: string
}

interface ToolChain {
  title: string
  steps: ToolChainStep[]
}

// Add optional field to GTMTerm:
toolChain?: ToolChain
```

### 2D. `MCPShowcase` Component

Dedicated component for MCP terms. Shows the MCP config, what it connects, and a real use case.

```
┌─────────────────────────────────────────────┐
│  MCP: Exa Search                             │
│  ─────────────────────────────               │
│  Connects: Claude Code ↔ Exa API             │
│  Auth: EXA_API_KEY env variable              │
│                                              │
│  What it does:                               │
│  - Company research (domain-based)           │
│  - People search (title + company)           │
│  - TAM expansion (find_similar)              │
│  - Signal detection (news, funding, hiring)  │
│                                              │
│  Real usage:                                 │
│  "Enriched 73 companies for ShopTalk         │
│   in one session. Icebreakers, signals,      │
│   and 122 new contacts found."              │
│                                              │
│  ┌─ config snippet ─────────────────┐        │
│  │ "exa": {                         │        │
│  │   "command": "npx",              │        │
│  │   "args": ["-y","@anthropic/..."]│        │
│  │   "env": { "EXA_API_KEY": "..." }│        │
│  │ }                                │        │
│  └──────────────────────────────────┘        │
└─────────────────────────────────────────────┘
```

---

## Phase 3: SEO & Cross-Linking

### 3A. Internal Link Architecture

Every new GTMLS term should link to 2-3 other resources on the site:

```
GTMLS Term Page (/knowledge/exa)
  ├── Related GTMLS terms (enrichment, signals, find-similar)
  ├── "Go deeper" → How-To guide (/how-to)
  ├── "See the playbook" → Playbook page (new route)
  └── Breadcrumb: Knowledge > GTM > AI & MCP > Exa
```

**Implementation**: Extend the existing `contentTermMap` pattern in `[term]/page.tsx` to include playbook links.

### 3B. New Backlink Patterns

Add to the `[term]/page.tsx` component:

```typescript
// Playbook backlinks (new)
const playbookTermMap: Record<string, string> = {
  'exa': '/playbooks/enrichment',
  'icebreaker': '/playbooks/personalization',
  'poke-the-bear': '/playbooks/personalization',
  'pain-point-signal': '/playbooks/personalization',
  'mcp-server': '/playbooks/infrastructure',
  'enrichment-pipeline': '/playbooks/enrichment',
  'scoring': '/playbooks/qualification',
}
```

### 3C. SEO Keyword Expansion

Update `knowledge/gtm/page.tsx` metadata:

```typescript
keywords: [
  // existing
  'clay', 'heyreach', 'instantly', 'email deliverability',
  'icp', 'persona', 'gtm engineering', 'outbound sales',
  // new
  'exa api', 'exa sdk', 'mcp server', 'smartlead',
  'model context protocol', 'ai enrichment', 'parallel agents',
  'lead scoring model', 'icebreaker prompt', 'poke the bear email',
  'signal based outbound', 'tam expansion', 'enrichment pipeline',
]
```

### 3D. Structured Data Expansion

Add `HowTo` schema for terms with code examples:

```json
{
  "@type": "HowTo",
  "name": "How to use Exa SDK for icebreaker research",
  "step": [
    { "@type": "HowToStep", "text": "Install Exa SDK..." },
    { "@type": "HowToStep", "text": "Configure API key..." },
    { "@type": "HowToStep", "text": "Run domain search..." }
  ]
}
```

---

## Phase 4: Cross-Site Breadcrumb Trail

### Link Everything Together

```
theGTMOS.ai                    theContentOS.ai
├── /knowledge/gtm              ├── /content-wiki
│   ├── exa ──────────────────────── content-mcps
│   ├── mcp-server ───────────────── typefully-mcp
│   ├── icebreaker                │
│   ├── poke-the-bear             │
│   └── orchestration ────────────── recursive-content-flow
│
├── /how-to
│   ├── exa-enrichment-guide
│   └── mcp-setup-guide ─────────── mcp-servers (content-wiki)
│
├── /playbooks (NEW)
│   ├── /enrichment
│   │   ├── exa-icebreaker-search
│   │   ├── exa-signal-detection
│   │   ├── exa-persona-widening
│   │   └── exa-tam-expansion
│   └── /personalization
│       └── 3-variable-model
│
└── /clay-wiki
    └── enrichment entries ←──── GTMLS enrichment term
```

---

## Execution Order

### Sprint 1: Data + Terms (Session 1) -- COMPLETE
1. ~~Add 10 new terms to `gtm-terms.ts` (AI & MCP category + Automation category)~~ DONE — 10 new terms added
2. ~~Expand 7 existing thin terms with real use cases~~ DONE — 6 terms expanded (icebreaker, poke-the-bear, pain-point-signal, signals, enrichment, scoring)
3. ~~Update metadata/keywords on GTM guide page~~ DONE — 13 new SEO keywords added
4. **Deliverable**: 43 terms, 8 categories -- SHIPPED

### Sprint 2: Use Case Component (Session 2)
1. Build `UseCaseBlock` component
2. Add `useCases` field to `GTMTerm` interface
3. Populate Exa terms with real use case data
4. Populate icebreaker/poke-the-bear with use case data
5. **Deliverable**: Terms with embedded real-world showcases

### Sprint 3: Code Showcase Component (Session 3)
1. Build `CodeShowcase` component (terminal-styled)
2. Add `codeExamples` field to `GTMTerm` interface
3. Extract sanitized code snippets from Exa scripts
4. Add to relevant terms (exa, enrichment-pipeline, batch-processing)
5. **Deliverable**: Terms with live code examples

### Sprint 4: MCP Showcase + Tool Chain (Session 4)
1. Build `MCPShowcase` component
2. Build `ToolIntegrationMap` component
3. Add to mcp-server, orchestration, enrichment-pipeline terms
4. Wire up tool chain visualizations
5. **Deliverable**: Visual tool chain maps on MCP/orchestration terms

### Sprint 5: SEO + Cross-Linking (Session 5)
1. Add playbook backlinks to `[term]/page.tsx`
2. Expand structured data (HowTo schema for code terms)
3. Update breadcrumb patterns for new categories
4. Cross-link to ContentOS wiki entries
5. Build `/playbooks` route on the website (new page)
6. **Deliverable**: Full cross-site link architecture

---

## Files That Will Change

| File | What Changes |
|------|-------------|
| `website/packages/shared/data/gtm-terms.ts` | New categories, new terms, expanded existing terms, new interface fields |
| `website/packages/shared/pages/GTMKnowledgeGuidePage.tsx` | Render UseCaseBlock, CodeShowcase, ToolChain, MCPShowcase components |
| `website/apps/gtmos/app/knowledge/gtm/page.tsx` | Updated metadata, keywords, structured data |
| `website/apps/gtmos/app/knowledge/[term]/page.tsx` | Playbook backlinks, HowTo schema, new component rendering |
| `website/packages/shared/components/UseCaseBlock.tsx` | NEW — use case display component |
| `website/packages/shared/components/CodeShowcase.tsx` | NEW — terminal-styled code block |
| `website/packages/shared/components/ToolIntegrationMap.tsx` | NEW — tool chain visualization |
| `website/packages/shared/components/MCPShowcase.tsx` | NEW — MCP config + use case display |
| `website/apps/gtmos/app/playbooks/` | NEW — playbook route/page |

---

## Success Criteria

- [ ] GTMLS has 37+ terms (up from 27)
- [ ] 2 new categories: "AI & MCP" and "Automation & Scripts"
- [ ] Every new term has at least one real use case (not hypothetical)
- [ ] At least 5 terms have code examples from actual scripts
- [ ] MCP terms show real config snippets and usage stats
- [ ] Cross-links exist between GTMLS ↔ How-To ↔ Playbooks ↔ Clay Wiki
- [ ] Updated SEO keywords capture "exa", "mcp", "enrichment pipeline" search intent
- [ ] `/playbooks` route exists on the website
- [ ] Structured data includes HowTo schema for code-heavy terms
