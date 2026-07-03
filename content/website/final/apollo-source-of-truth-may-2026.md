---
title: "Apollo Is the Source of Truth: Filling the Gaps in Per-Scrape VC Portfolio Databases"
date: "2026-05-14"
excerpt: "I've been scraping VC portfolios (a16z, YC, Sequoia) into a master database with per-scrape segments. Apollo's API is the gap-fill engine that makes each segment usable without merging them."
category: "gtm-engineering"
featured: false
---

# Apollo Is the Source of Truth: Filling the Gaps in Per-Scrape VC Portfolio Databases

Over the past few weeks I've been scraping VC portfolios into a master prospect database. a16z's portfolio page, Y Combinator's founder directory, Sequoia's investments list. Each scrape lands in the same SQLite database, but each one keeps its own segment marker. They never get merged into a single blended list.

Apollo's API is what makes each segment actually usable, because every scrape leaves gaps that the source site never gave me.

## Why per-scrape segmentation, not a blended master list

The standard move is to scrape a bunch of sources, dump them into one giant contacts table, run scoring on top, and pick the top N. That works if you're going to run one campaign with one piece of copy.

I'm not. The whole point of scraping by source is that the source itself is the personalization layer. A YC founder five months out of Demo Day is a different conversation than a Series B operator inside an a16z portfolio company is a different conversation than a growth-stage exec at a Sequoia-backed business. If I blend the list, I throw away the only signal that's actually unique per row, which is where they came from.

So the database keeps a `source` column on every row, and the per-source segment never gets dissolved. Future campaign copy is written per segment, not per scored quintile.

## What each scrape gives you, and what it doesn't

The shape of what comes back from each VC's public surface:

- **YC's directory** returns company slugs, names, batches, and short descriptions. No LinkedIn URLs for the founders. No email patterns. Sometimes a Twitter handle.
- **a16z's portfolio page** returns company names + domains, occasionally a founder name surfaced in the press tile. No structured contact data.
- **Sequoia's investments list** returns companies sorted by stage, but the operator names mostly need to be backfilled from elsewhere.

None of those give me what I actually need to run outbound: verified LinkedIn URLs, current email patterns, accurate seniority, and a confidence flag on whether the person is still in the seat.

That gap is what Apollo's API fills.

## The Apollo endpoints doing the work

Apollo's API recently enforced a two-step pattern for bulk enrichment. The old direct-name-match shortcut is gone. The current shape:

- `mixed_people/api_search` is the discovery call. Filter by current_organization, title, seniority, geo, or whatever partial keys you have from the scrape. It returns Apollo's internal person IDs for every match.
- `people/bulk_match` is the enrichment call. Hand it those person IDs (max ten per call, that's a hard cap on Apollo's side) and get back the canonical record: LinkedIn URL, verified email, function, seniority, location, employment history.
- `organizations/enrich` runs separately for the company-only rows. Takes a domain or company name, returns size band, revenue band, industry, tech stack.

If you wrote a pipeline against Apollo's older direct-match path and your match rate dropped recently, the search-step-in-front pattern is the fix.

Two principles guide how I run the workflow.

First, the gap-fill is per-segment, in place. I do not pull data out of the segment table, enrich it in a staging area, and then push it back into a different table. The enriched fields get written back to the same row in the segment table they came from. Nothing about the row's provenance changes.

Second, Apollo's `current_organization` field is the most reliable indicator of where the person actually works today. For any row where the scraped company doesn't match what Apollo says the person currently does, I tag the row as "moved" and branch a copy into a movers list inside the same segment. That mover row keeps its YC-or-a16z-or-Sequoia provenance because the relationship to the original source is what makes the outreach copy work.

A note on credits. `bulk_match` consumes plan credits (data / export / mobile, depending on what you're pulling). The right plan covers normal segment-cycle volume, but it's worth eyeing your credit pool before kicking off a multi-segment run so you don't stall mid-run. If you need waterfall behavior for harder email or phone lookups, Apollo exposes a parameter on the enrichment call that returns demographic fields synchronously and pipes the async lookups to a webhook. For my workflow the synchronous response is enough.

## The workflow

For each segment:

1. **Scrape the source into its segment table.** Whatever columns the source surface gives me, in their raw form, plus a `source` tag.
2. **Disposition pass.** Classify each row as person, company, handle, or ambiguous. Skip everything below the person-confidence threshold so Apollo batch slots aren't wasted on garbage.
3. **`mixed_people/api_search` to resolve person IDs.** Filter on the keys you have from the scrape, page through results, collect the Apollo IDs.
4. **`people/bulk_match` against those IDs, in batches of ten.** Ten is the hard cap per call, so the batching is non-negotiable. Sleep a quarter-second between calls. Write the returned fields back to the same row in the segment table.
5. **`organizations/enrich` for company-only rows.** Fill size, revenue band, tech stack.
6. **`claude -p` subprocess for any reasoning that needs to happen per row.** ICP tagging, a one-line memo on context, a movement flag with a note on where the person went. The subprocess pattern is what keeps the per-row reasoning effectively free.
7. **Write back, segment-preserved.** YC rows stay flagged as YC. a16z rows stay flagged as a16z. Sequoia stays Sequoia.

Twenty minutes per segment for a few thousand rows. Rate limits are not a problem if you batch in tens and don't try to parallelize aggressively.

## `claude -p` carries the reasoning load

I run the orchestration in Python, and every step that requires reasoning gets handed to a subprocess call into `claude -p`.

```python
import subprocess

result = subprocess.run(
    ["claude", "-p", "--model", "opus",
     f"Given this Apollo record:\n{record_json}\n"
     f"Source segment: {source}\n"
     f"Return JSON: {{icp_fit: 1-5, segment_note: str, moved: bool, mover_memo: str|null}}"],
    capture_output=True, text=True, timeout=60,
)
```

The reasoning step runs against my Max subscription. No API token spend, no budget watch.

One thing to plan for if you wire `claude -p` into a tight loop. On June 15, 2026, Claude Code's session limits change. The subprocess pattern still works after the change. You just want longer cooldowns between batches so a long-running enrichment doesn't crash into the new cap mid-run.

## Where Apollo's UI plus their MCP takes over

The API is for verification and gap-fill on the data. That happens once per segment when the scrape lands, and then on a refresh cadence after that.

For the actual campaign side, the surface I'm moving to is Apollo's Campaign Setter, fed by their MCP server when I want it wired into Claude Cowork for the team. The operator describes a campaign in chat, points at a segment, picks a sender, and the connector executes inside Apollo. Each segment gets its own campaign, with copy that matches where the rows came from. YC founders get copy that speaks to early-stage founders. a16z portfolio operators get copy that speaks to operators. Sequoia growth-stage rows get a different motion again.

That is the layer I'm wiring next. Today's piece is about the database underneath it.

## The order, for founders and builders

If you're running outbound as a side function of building product, Apollo earns the slot of first connected source in your stack. The API is the most direct way to take a scrape that has gaps and turn it into a segment that's ready to act on. The UI handles the campaign side later, once the data is trusted.

The shape of the play is:

- Scrape your sources into per-source segments.
- Use Apollo's API to fill the gaps each segment leaves.
- Keep the segments intact so the source becomes the personalization layer.
- Run the campaigns through Apollo's UI or via Cowork plus MCP when you have a team.

That sequence is how you stop buying lists and start running campaigns against data you actually trust.

## What's next

The next post in this thread is the Campaign Setter side. One campaign per scrape source, copy that lives off the segment label, cadence that fits the persona. I'll share that workflow once the a16z and YC campaigns are running.

If you've been hand-merging scrapes into one big list, the move to per-source segmentation plus API gap-fill is the cheapest improvement available right now.

---

PS: Clearbox soft-launches this week. Same per-segment thinking, applied to Reddit instead of VC portfolios: see your market before you move on it. clearbox.to.

Repo: github.com/shawnla90/gtm-coding-agent. 100+ stars across the work.

---

Shawn Tenam
the GTM alchemist
"Verification before enrichment."
