---
name: steves-recruiting
version: "1.0"
type: client
status: active
description: Lead Alchemy client project — SteveS, independent technical recruiter in Ohio. Cold call-first model, two-sided network (leads + candidates). List cleanup, enrichment, daily batching, CRM migration, tool consolidation.
---

# SteveS Recruiting — GTM Operations Skill Tree

## Client Overview

**Client**: SteveS
**Vertical**: Technical recruiting
**Geography**: Ohio (primary), Great Lakes region (Michigan, Minnesota)
**Relationship**: Lead Alchemy client project
**Model**: Independent recruiter, old-school cold call approach

## What Steve Does

Steve is an independent technical recruiter who fills technical roles (software engineers, IT, tech leaders) for companies in the Ohio region. He cold calls hiring companies directly using his own phone/direct line setup.

**Two-sided network**:
1. **Leads** (companies hiring) — companies with open technical roles in Ohio
2. **Candidates** (people who fill roles) — Steve's built network of qualified technical talent

His value prop: he connects his curated candidate pool to companies with open roles. The sale is that he already has people who can do the job.

**Working style**: Old school. Direct line cold calling. Wants to keep that approach. Ideally batches 20–50 leads per day, targets 600–800 calls/month.

## Skill Tree

### Research

| File | What it covers |
|------|---------------|
| [`research/icp.md`](research/icp.md) | Ohio tech companies hiring, role types, company signals |
| [`research/personas.md`](research/personas.md) | Who Steve calls — hiring managers, HR, engineering leads |

### Prompts

| File | What it covers |
|------|---------------|
| [`prompts/signal-retrieval.md`](prompts/signal-retrieval.md) | Job posting signals, hiring intent, tech role indicators |
| [`prompts/list-cleaning.md`](prompts/list-cleaning.md) | CSV cleanup, deduplication, name/company gap-filling |
| [`prompts/lead-prioritization.md`](prompts/lead-prioritization.md) | Scoring and batching logic for daily call lists |

### Workflows

| File | What it covers |
|------|---------------|
| [`workflows/list-management.md`](workflows/list-management.md) | CSV handling, enrichment pipeline, data quality tracking |
| [`workflows/daily-batching.md`](workflows/daily-batching.md) | 20–50 leads/day cold call batching, prioritization |
| [`workflows/tool-consolidation.md`](workflows/tool-consolidation.md) | Current tools audit, what to keep/cut, CRM decision |

### Resources

| File | What it covers |
|------|---------------|
| [`resources/contacts.md`](resources/contacts.md) | Steve's contact info, comms preferences, engagement details |
| [`resources/transcripts/session-01.md`](resources/transcripts/session-01.md) | Session 01 transcript |
| [`resources/email-thread.md`](resources/email-thread.md) | Full conversation history, timeline, goals, communication style |
| [`resources/csv-notes.md`](resources/csv-notes.md) | Notes on CSV imports, data quality issues, enrichment status |

> Add new sessions as `session-02.md`, etc. CSV files from Steve can be loaded into Cursor for cleaning/enrichment work.

## Current Status (Q1 2026)

- [x] Client intake / discovery
- [x] ICP definition (Ohio tech companies hiring)
- [x] Initial list received (~10,000 contacts, unique title-to-company)
- [x] Mobile enrichment: 60% → 90% (~9,000 mobile numbers)
- [ ] Email enrichment: in progress
- [ ] Company data enrichment with Semrush (recruitment signals)
- [ ] List data quality cleanup (missing names, missing companies, gaps)
- [ ] Daily batching workflow built
- [ ] Lead prioritization scoring built
- [ ] CRM decision: Zoho vs PipeDrive vs HubSpot (Shawn recommending HubSpot)
- [ ] CRM migration once decision is made
- [ ] Tool consolidation (Steve has too many tools, need to cut)

## Key Context

- Previous operator burned credits without much results — Steve is cautious about spend
- List has data quality issues: sometimes full name but no company, sometimes company but no name, inconsistent email/mobile coverage
- Steve wants to keep his cold call system — we're not replacing his approach, we're feeding it better data
- CRM is undecided — Zoho, PipeDrive, or HubSpot. Shawn pushing HubSpot.
- CSV handling workflows needed across the client system — Steve's list is the first use case but this pattern will repeat
