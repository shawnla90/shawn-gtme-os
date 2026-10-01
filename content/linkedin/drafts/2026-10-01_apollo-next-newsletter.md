---
platform: linkedin-newsletter
pillar: release-reaction
status: draft
date: 2026-10-01
pack: reports/2026-10-01_apollo-next-pack
disclosure: creator contract with Apollo.io, Brand Affiliate label at publish
receipt: https://github.com/shawnla90/shawn-gtme-os/blob/main/scripts/apollo/title_search_workflow.py
visual: cover 1200x627 (ApolloNEXT lockup, same style as the July pack) + 1 conference photo + 1 terminal screenshot of the script summary block
---

# Title options

1. Apollo just told the builders they are the roadmap
2. the most important tool in an agency stack doubled down on the people who build with it
3. I asked Apollo's CEO if small shops still matter, then went home and wrote a script

**Subtitle:** Learnings from ApolloNEXT: initial reactions

---

[INSERT IMAGE: cover 1200x627, drop at the very top]

Disclosure first. I am on a content creator contract with Apollo. It started the organic way: I posted on Reddit about what I was doing with their API, people kept asking questions, and Apollo noticed. Nothing in this issue was reviewed by them before I wrote it. Take the opinion with that context.

**TL;DR**

- ApolloNEXT happened Sept 30 at SFJAZZ in San Francisco. Three announcements: Builder Studio, Messaging OS, and an Intelligence Layer underneath both. Apollo calls the bundle the AI GTM System.
- Builder Studio is in beta. Messaging OS is listed as available soon. I have not touched either yet. I am telling you what they announced and what I will test first.
- I met Matt Curl, asked him the small-shop question directly, and the answer matched what the company has been doing.
- Website visitor identification is now worth your time. Willy Hernandez tested it before I did.
- Workflow at the bottom: title filtering through the Apollo API, with a script you can run today. Zero credits for the search step.

## What they announced

Builder Studio is a natural-language builder on top of Apollo's data and execution layer. You describe the GTM tool you want (a scoring page, a routing automation, an enrichment sheet, a custom agent) and it writes the code and ships it inside Apollo. That is the beta. Early users are in it.

Messaging OS is the execution side. It reads buying signals and decides who gets reached, when, and on which channel, then runs the email, sequence, call, or ad audience without two reps hitting the same account the same week. Available soon per Apollo.

The Intelligence Layer is the part that makes both of those possible. It is the signal and data engine underneath. Website visits, job changes, hiring, tech stack, all feeding one place.

My honest read: I build versions of these pieces myself with Python and SQLite, and I will keep doing that for clients who need control. Builder Studio is the one that got my attention, because the people it serves are the operators who were never going to open a terminal. If it actually writes real code on real Apollo data, that is a different category of tool than a drag-and-drop workflow builder. First test when the beta opens up for me: can it reproduce my title filter workflow (below) without me writing a line?

## Apollo and agencies

Walk the floor at ApolloNEXT and count the agency logos. Outbound shops, RevOps consultancies, fractional GTM teams. That is who Apollo is building for, and it has been that way for a while. If you run an agency, Apollo is the most important tool in your stack. Data, sequencing, dialer, and now the build surface, in one bill your clients already understand.

The new announcements double down on that. Builder Studio is essentially a way for an agency to ship client-specific tooling on Apollo's rails instead of stitching four subscriptions together.

[INSERT IMAGE: conference photo, floor or panel]

## Meeting Matt Curl

Matt Curl moved from COO to CEO in February. Tim Zheng, who founded the company, is chairman now. Curl advised Apollo for years before joining full time, and he came up through go-to-market, not through a finance seat.

I got to talk to him in person. He told us the story of how the CEO move happened, and he took questions. Mine was the one a small operator asks: does a one-person shop still matter to a company at your size?

The answer was yes, and it was specific. [SHAWN: paste the exact line if you want a direct quote. Otherwise this paraphrase stands.] The mission to build for SMBs and the people who serve them is not slide-deck language for him. The way he talked about transparency with customers, about pricing, about the fact that everyone in the room is building something and needs data providers that do not get in the way, matched what I have seen from the company for two and a half years.

That matters more than any single feature. Plenty of GTM tools are run by people who have not sent a cold email in a decade. This one is not.

## The backstory, briefly

In January I left my agency. Great agency, great people. We worked very closely with one vendor that has a great product, and that closeness started to shape the work. At the end of the day I am a go-to-market engineer. I work for the client, not the vendor.

Apollo has never asked me to work for them. They have never gotten in the way of a client build or made it look like I was supposed to push something. That is the whole reason the relationship became a contract instead of ending.

For context on who is saying this: three and a half years in this industry, ten years as a plumber before that. I came in sideways. That is as close to an unbiased read as a disclosed one gets.

## The technical side

I have used Apollo heavily for two and a half years. Since January, the heavy use moved to the API through Claude Code. Filter by title, seniority, geo, company size, time in seat. Build your own intent waterfall: free web fingerprint first, Apollo on the rows worth paying for, verify, then push.

Two things I noticed this quarter. Website visitor identification got real. Company-level is free, person-level is a paid add-on, and the June release added a workflows tab and UTM attribution. The same search endpoint I already script against now exposes visitor filters (intent level, pages visited, confidence tier), which means web traffic becomes one more column in a Python script instead of a separate dashboard.

Willy Hernandez at The GTM Factory tested the visitor identification before I did and published what he found. If that is the piece you are evaluating, read his breakdown or reach out to him directly. [SHAWN: confirm spelling Willy vs. Willie, and whether to link his profile.]

## The workflow: title filtering through the API

Someone on Reddit asked how to filter for job titles in Apollo without the UI. Here is the pattern I run, and the gotcha that bites everyone the first time.

The gotcha: Apollo filters on seniority and on title keywords, but a VP of People is still a VP. Run a vp + director search for enterprise accounts and roughly a quarter of what comes back is HR, talent, engineering, or community. The API gives you the levers. The function filter is your job.

The pattern:

1. Search. POST to mixed_people/api_search with person_titles, person_seniorities, person_locations, organization_num_employees_ranges. Search costs zero credits and returns no emails. Page through, up to 100 per page.
2. Dedupe on the Apollo person id.
3. Post-filter the title. Blocklist first (recruit, people, talent, engineering, product, legal, finance), allowlist second (sales, revenue, growth, marketing, RevOps, customer success), senior prefixes last.
4. Cap contacts per domain. Ten is my default. Enterprise accounts will hand you sixty VPs if you let them.
5. Enrich the survivors only. people/bulk_match, ten ids per call. This is the step that spends credits, so it runs last on the smallest list.
6. Write to CSV or SQLite. Push to the CRM from there, after you have looked at the rows.

Example run for enterprise GTM leaders in the US:

    python3 title_search_workflow.py \
      --titles "VP Sales" "VP Revenue" "Head of Growth" "Director Revenue Operations" \
      --seniorities vp head director \
      --locations "United States" \
      --employee-ranges 1001-5000 5001-10000 10001+ \
      --pages 3 --max-per-domain 10 \
      --out enterprise_gtm.csv

Add --dry-run to see the exact JSON payload before it sends. Add --enrich when the list looks right.

[INSERT IMAGE: terminal screenshot of the summary block: raw, after dedupe, dropped by title, dropped by cap, written]

The full script is in my public repo, standard library only, no pip installs:
https://github.com/shawnla90/shawn-gtme-os/blob/main/scripts/apollo/title_search_workflow.py

If you would rather have your coding agent build your own version, paste this into Claude Code, Codex, or Cursor:

    Build a Python script that searches Apollo's People API for me.
    Endpoint: POST https://api.apollo.io/api/v1/mixed_people/api_search, header X-Api-Key from env APOLLO_API_KEY.
    CLI flags: --titles, --seniorities (owner, founder, c_suite, partner, vp, head, director, manager, senior, entry, intern), --locations, --employee-ranges as min-max strings, optional --domains-file, --pages, --per-page max 100.
    After search: dedupe on person id, post-filter titles with an editable blocklist and allowlist so HR, talent, engineering, product, legal, and finance titles are dropped, cap contacts per company domain at 10, write a CSV.
    Optional --enrich flag: call POST /api/v1/people/bulk_match in batches of 10 ids with reveal_personal_emails false, and merge email and linkedin_url back into the rows.
    Add --dry-run that prints the first request payload and exits. Retry with backoff on 429. Standard library only.
    Print a summary: raw results, after dedupe, dropped by title filter, dropped by domain cap, written.

That prompt produces something close to what I run. Edit the lists for your ICP before the first live call.

## What I am testing next

Builder Studio beta, starting with the title filter as the benchmark task. Messaging OS the day it opens. And the visitor filters inside the search API, because if pricing-page visits can sit in the same query as title and seniority, the intent waterfall gets one step shorter.

Shawn Tenam
the GTM alchemist
build the pipes, then show everyone the pipes
