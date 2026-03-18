---
title: "why apollo should be your first sourcing run, not clay"
date: "2026-03-12"
excerpt: "People search is the biggest bottleneck in GTM engineering. Apollo's API gives you the richest B2B data for free. Here's the architecture for hackers and SDRs."
category: "gtm-engineering"
featured: true
---

**tl;dr:** Apollo's free API returns the richest B2B data in the space. one API call replaces 30 minutes of manual sourcing. run it on a cron and wake up to qualified contacts every morning.

people search is step one in every GTM pipeline. it should be automated first, not last.

## what's the real bottleneck in GTM pipelines?

Every GTM pipeline starts the same way. You need to find people. Specific people at specific companies with specific titles. And for most teams, that step is still manual. Open LinkedIn Sales Navigator. Scroll. Click. Export. Import. Start enriching.

The downstream stuff gets all the attention. Enrichment waterfall. ICP scoring. Email personalization. CRM routing. Those are the steps everyone automates first because they feel like the "hard" part.

They're not. The hard part is sourcing. Finding the right 500 people out of 275 million. And most teams are still doing it by hand.

## why should you use Apollo before Clay?

Apollo has the richest people database in B2B SaaS. 275M+ contacts. 73M+ companies. Verified emails. Direct dials. Seniority levels. Company technographics. And the API is free for the first 10,000 credits per month.

That changes the economics of the whole pipeline.

The old way looks like this: open Apollo's browser UI, run a search, export a CSV, import it to Clay, run enrichment waterfall, push to CRM. Four manual steps before outreach even starts.

The new way: one API call returns structured JSON with people + company data. A script writes it to Supabase. Enrichment runs on the delta. CRM sync happens automatically. The sourcing step went from 30 minutes of clicking to a single API call. And it runs on a cron, not on your calendar.

Apollo is not replacing Clay. They solve different problems. Apollo handles people search. Clay handles enrichment and routing. Supabase handles storage. Each tool does what it does best.

## how do you build an Apollo sourcing pipeline?

There are two ways to build this depending on your technical comfort level.

**The hacker track** is for technical operators who want full control. Supabase as your data warehouse. Apollo API for sourcing. Claude Code for writing and iterating on scripts. A Mac Mini (or any always-on machine) running cron jobs.

Total monthly cost: Apollo free tier ($0) + Supabase free tier ($0) + electricity (~$5). The code lives in your repo. The data lives in your database. The pipeline runs while you sleep.

The batching pattern matters here. Never search Apollo for everything at once. Batch by persona. VP/Director of Marketing first. Then Sales. Then RevOps. Each batch gets its own title filter pass and its own dedup check against existing contacts. This prevents credit waste and keeps your data organized from the start.

**The SDR enablement track** is for teams that don't have a GTM engineer on staff. Claude Co-work with folder systems. Three folders: Raw Data (Apollo CSV exports), Research (company briefs, tech stack analyses), Output (icebreakers, email sequences, CRM import files).

Drop an Apollo export into Raw Data. Ask Claude to research each company. Ask Claude to generate icebreakers based on title + company research. Output goes to a CSV ready for CRM import. The whole flow takes 10 minutes for 50 contacts. An SDR doing this manually would spend 2-3 hours.

## what is title leakage and how do you fix it?

The one thing that will wreck your pipeline quality if you don't solve it early: title leakage. You search for "VP of Marketing" and get back HR leaders, engineering managers at martech companies, and interns with "Marketing" in their LinkedIn headline.

Apollo's seniority filters help but they're not enough. You need an allowlist/blocklist pattern. The title MUST contain certain strings ("marketing", "growth", "demand gen"). The title MUST NOT contain others ("intern", "assistant", "HR", "recruiter", "engineering").

Run allowlist first, then blocklist. Log the drops so you can tune the lists over time. Keep the lists in a config file, not hardcoded. That way non-technical team members can adjust targeting without touching the sourcing script.

## what infrastructure do you need?

This whole thing runs on a Mac Mini. Always-on. $599 once, $5/month electricity. If you can send a MacBook to a remote employee, you can run an always-on GTM server.

The cron runs every night. Pull new contacts from Apollo. Title filter. Dedupe against Supabase. Insert new contacts. Run enrichment on the delta. Sync to CRM. By the time you sit down in the morning, your pipeline has new qualified contacts waiting.

The Mac Mini is not the point though. The point is that the infrastructure is simple enough that a single machine handles everything. No cloud orchestration. No Kubernetes. No monthly SaaS bills that scale with usage. Just a machine running scripts on a schedule.

## how do you use Apollo for conference prospecting?

This is where the architecture really pays off. A mid-size SaaS conference has 500-2,000 attendees. The attendee list drops 2-4 weeks before the event. Most sales teams manually qualify 20-30 people before giving up.

Run the entire list through Apollo. Match by name + company. Title filter. ICP score. Tier the results: Tier 1 (must meet, schedule pre-event), Tier 2 (find at the event), Tier 3 (badge scan and nurture).

From an 800-attendee conference: Apollo matched 620 (77% match rate). Title filter passed 340. ICP scoring produced 85 Tier 1, 120 Tier 2, 135 Tier 3. Pre-event outreach booked 12 meetings before the event started. Total pipeline: 3x what the team produced at their previous conference with manual qualification.

## go deeper

The [Apollo Wiki on theGTMOS.ai](https://thegtmos.ai/apollo-wiki) has the full breakdown. API architecture, title filtering patterns, the Supabase warehouse schema, and step-by-step workflows for both tracks. Eight entries across four categories. All the patterns from production pipelines.

People search is step one. It should be automated first, not last.

## frequently asked questions

**is Apollo's API really free?**
yes. Apollo offers 10,000 credits per month on the free tier. that's enough to run meaningful sourcing for a solo operator or small team. credits refresh monthly. you don't need a paid plan to build a working pipeline.

**how many contacts can you pull from Apollo per month?**
on the free tier, 10,000 credits per month. each people search API call costs credits based on the data returned. batching by persona and deduping against your existing database keeps credit usage efficient. most solo operators can source 2,000-5,000 net new contacts per month on the free tier.

**should I use Apollo or Clay for sourcing?**
Apollo for sourcing, Clay for enrichment. they solve different problems. Apollo has the people database. Clay has the enrichment waterfall and workflow builder. use Apollo to find people, then Clay to enrich and route them. trying to use Clay for sourcing is like using a Swiss Army knife to cut lumber. for the full comparison, see [Clay pricing opinion](https://shawnos.ai/blog/clay-pricing-opinion).

**what's the best way to avoid title leakage in Apollo?**
use an allowlist/blocklist pattern. define strings the title must contain and strings it must not contain. run allowlist first, then blocklist. keep the lists in a config file so non-technical teammates can tune targeting without editing code. log every drop so you can review and adjust over time.

---

*related reading: [Clay pricing opinion](https://shawnos.ai/blog/clay-pricing-opinion) · [what a go-to-market engineer actually does](https://shawnos.ai/blog/what-a-go-to-market-engineer-does)*
