---
platform: reddit
draft_for: 2026-07-24
target_subreddit: r/GTMbuilders (primary, the workflow/skill-file audience)
alt_subreddits:
  - r/gtmengineering (same body, lead harder on the CLI-vs-UI point)
  - r/RevOps (cut the GEO section, lead with de-masking and the scoring gate)
status: draft
source: content/blog/2026-07-24_freckle-cli-three-workflows.md
---

**Title options (r/GTMbuilders):**
1. ran an enrichment CLI against three different jobs this week: signups, visitor de-masking, and AI answer citations
2. moving enrichment out of a UI and into the terminal changed how I sequence the whole run
3. three workflows from a week with an enrichment CLI, including one that has nothing to do with contact data

**Pick:** #1

**Body:**

enrichment was the last thing in my stack that still made me leave the terminal.

everything else is a Python file plus a skill file plus a SQLite table. then enrichment shows up and I'm in a browser building a table, waiting on a run, exporting a CSV, and handing it to the script that needed the data in the first place.

Freckle shipped a CLI and I got early access, so I spent the week pointing it at three different jobs for my own product. Writing up what worked and what I got wrong, since the third one surprised me.

**1. enriching signups out of the app database**

The product runs on Convex, so a signup lands as a row the moment someone creates an account. Email, domain, timestamp, plan.

The run is: pull new rows since last run, gate on domain type, enrich the company domain, then enrich the person, write the profile back next to the signup row, render a short brief.

The gate is the part I'd skip if I were you and shouldn't have. Free and personal email domains go to a holding table and never get a person lookup. Enriching a person on a gmail address costs the same as a real one and resolves maybe half the time. That's ten minutes of code that changed the cost of the whole run.

The brief is three sentences. First version was a full page and I didn't read my own output, which is a pretty clear signal.

What's in it: who they are, what their buyers are actually posting about, and one thing they'd be glad I already knew before the call.

Someone signs up Tuesday, gets on a call Thursday. That gap is the whole opportunity. Showing up with something they can use whether or not they buy is a different conversation than showing up with a demo.

**2. de-masking site traffic**

Anonymous traffic resolves to companies. By itself that's a list of company names, which is not a list of people who want to talk, and I think this is where most reveal tooling quietly loses people.

The run: resolve session to company, filter on page path, enrich what survives, score fit against ICP combined with the page signal, route only the top slice to a human.

Filtering before enriching is what makes the math work. Someone who read one blog post is not in market. Someone who sat on the pricing page and then opened docs is telling you something. Both cost the same to enrich and only one of them pays.

I ran it the dumb way first and enriched everything including homepage bounces. Don't.

**3. AI answer citations (the one I didn't expect)**

This has nothing to do with contact data.

Ask an assistant to recommend a tool in a category and it answers from what it can read. So: build a query set out of the questions buyers actually ask, run it, capture the answers and the sources cited, extract every domain in those citations, then enrich those domains.

Enriched, a citation list stops being strings and starts telling you whether the model is leaning on a community, a publisher, a review site, or a competitor's own content. Each of those implies a completely different response.

Then diff it: which sources repeat across the query set, and which of them are you absent from. That's a ranked list of where to show up, derived from what the models cite instead of from somebody's guess.

For my category it kept landing on the same few communities. That matches an argument I've been making for a while, and honestly it's better arriving as an output than as my own opinion.

**things I got wrong**

- enriched people before gating domains, burned hours on addresses that were never going to resolve
- wrote a pre-call brief long enough that I skipped reading it
- de-masked every page instead of the two that indicate anything
- spent a pass trying to get the citation run to tell me *why* a model trusts a source. it tells you which. not why.

**the thing I actually took away**

Moving enrichment behind a CLI didn't add a tool, it removed a step. The work I was doing in a table was always feeding a script, so putting it in the script meant the whole run became one file I can diff in git. When a run goes weird I look at what changed instead of guessing which UI setting somebody toggled last week.

Also changed how I sequence. When you're counting credits you hoard them and run smaller batches than you should. When the unit is time you just schedule it, gate hard, and let the expensive passes run overnight.

All three are written up as skill files, ungated, same shape as the Reddit research one I posted a while back. Happy to drop the link if mods are fine with it, or DM.

Curious whether anyone here is doing the citation-enrichment thing already. Feels underexplored and I'd rather not be the only person testing it.

---

**Comment hooks (post after submission):**

1. The domain gate, since it's the cheapest change with the biggest effect:
   split rows on MX/domain type before any person lookup, personal domains to a holding table, company domains continue. Ten minutes of code.

2. On the citation run: the query set matters more than the tooling. Real buyer questions, not keywords. Best X for small teams and frustrated with Y both surface, and only one has your keyword in it.

3. Link drop (only if the thread asks or mods allow): blog write-up + skill files.

**Subreddit notes:**

- **r/GTMbuilders**: home audience, they want the workflow and the gotchas. Full body works as-is.
- **r/gtmengineering**: lead with the CLI-vs-UI framing, since that's the debate they already have. Trim section 3 slightly.
- **r/RevOps**: cut the GEO section entirely, lead with de-masking + scoring gate, frame the whole thing as routing discipline rather than tooling.

**Rules check:**
- no link in body (link in comments only, and only if allowed)
- no product pitch, the product is context not the subject
- self-deprecating on the mistakes, which is the part that earns the thread
