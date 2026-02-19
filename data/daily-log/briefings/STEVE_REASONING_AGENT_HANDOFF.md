# Steve Candidate Marketing Workflow — Reasoning Agent Handoff

**Purpose:** Handoff for a reasoning agent to produce a full execution plan, timeline, pricing proposal, and option(s) for Steve Switzer's candidate email marketing workflow.

---

## 1. Partner / Context

| Field | Value |
|-------|-------|
| **Client** | Steve Switzer (steves-recruiting) |
| **Contact** | sswitzer@legacyrecruiting.com |
| **Project** | Candidate email marketing workflow: Clay enrichment → MX routing → Instantly / HeyReach |
| **Previous rate** | Shawn charged Steve **$80/hr** for basic Clay work |
| **Meeting** | Feb 17, 2026 — 48 min — Fathom recording ID 123137793 |

---

## 2. Inputs Available

| Input | Path / Source |
|-------|---------------|
| **Fathom transcript** | `data/daily-log/briefings/steves-recruiting-transcript-2026-02-17.md` (key takeaways + excerpts) |
| **Full verbatim transcript** | `.cursor/projects/.../agent-tools/9436538e-9fa2-46b9-8cca-81dfcd63785b.txt` (or Fathom MCP `get_meeting` recording_id 123137793) |
| **Existing plan** | `.cursor/plans/steve_candidate_marketing_workflow_a7fa0e95.plan.md` |
| **Steve's email** | *Gmail MCP failed to fetch.* User may provide manually. Goal summarized in plan Section 2. |

---

## 3. Steve's Goal (from Transcript + Plan)

- **Use case:** Market **candidates** (technical talent) to companies with open roles — not typical web-reveal ICP.
- **Immediate campaign:** 312 companies, 2–3 hiring managers each → ~900 leads.
- **Flow:** Companies list → Clay find contacts → enrich (Prospio API, bypass Clay credits) → MX check → route by platform.
- **Routing:** Google → Instantly; Microsoft → Instantly; Proofpoint / high-security → HeyReach (email won't reach inbox).
- **Style:** Repeatable, plug-and-play; Steve handles copy; human gates on inclusion.
- **Target:** Thursday morning, Feb 20 — campaign live.

**Instantly:** 28 mailboxes (13 Google, 15 Microsoft), ~700 sends/day capacity. Warm-up complete.

---

## 4. Pricing Context (Shawn's Input)

| Factor | Detail |
|--------|--------|
| **Baseline** | Steve paid **$80/hr** for basic Clay work |
| **New scope** | More time, execution, AI usage — warrants higher package |
| **Target range** | **$1,500 – $5,000** depending on time and difficulty |
| **Principle** | Give **option(s) first** — then get draft/approval. Package should feel worth it, not hourly nickel-and-diming |
| **Deliverable** | Worth-it package with clear timeline and fixed (or range) price |

---

## 5. What the Reasoning Agent Must Produce

1. **Full execution plan**
   - Phases with concrete steps (Clay setup, routing, Instantly, HeyReach, documentation)
   - Dependencies (Steve's inputs, accounts, API access)

2. **Timeline**
   - From Steve's approval → campaign live (Thursday Feb 20 target)
   - Realistic milestones; call out if Thursday is tight

3. **Pricing proposal**
   - 1–3 option(s) in **$1,500 – $5,000** range
   - Tie to scope (e.g., one campaign vs full reusable system)
   - Consider: build hours, AI costs, Prospio usage, documentation, runbook

4. **Present option(s) first**
   - Structure so Steve can choose (e.g., "Option A: single campaign + basic runbook"; "Option B: full reusable system + advanced routing")
   - Then produce draft proposal for handoff back to Shawn

---

## 6. Open Questions / Blocked

- **Steve's email:** Not pulled (Gmail MCP error). If user provides it, add to context.
- **Routing nuance:** 2-way (Google→Instantly, non-Google→HeyReach) vs 3-way (Google/Microsoft/Neither). Transcript implies 3-way. Confirm with Steve's written requirements.

---

## 7. Next Steps for Reasoning Agent

1. Read transcript (`steves-recruiting-transcript-2026-02-17.md`) and plan (`steve_candidate_marketing_workflow_a7fa0e95.plan.md`)
2. Synthesize scope, timeline, and pricing constraints
3. Produce:
   - **Execution plan** (phases, steps, dependencies)
   - **Timeline** (with Thursday target)
   - **1–3 pricing options** ($1.5k–$5k, option-first)
4. Output a **draft proposal** Shawn can share with Steve (option-first, then numbers)

---

## 8. File Paths for Reference

```
data/daily-log/briefings/steves-recruiting-transcript-2026-02-17.md
.cursor/plans/steve_candidate_marketing_workflow_a7fa0e95.plan.md
```
