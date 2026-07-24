---
platform: linkedin
type: newsletter
pillar: release-reaction
status: draft
date: 2026-07-24
source: content/blog/2026-07-24_freckle-cli-three-workflows.md
carousel: content/images/freckle-workflows/
---

**Newsletter title options:**
1. three workflows I ran through the Freckle CLI
2. enrichment stopped being a tab I open
3. signups, de-masking, and GEO, all from the terminal

**Pick:** #1

---

## Body

enrichment was the last thing in my stack that made me leave the terminal.

everything else is already a Python file, a skill file, and a SQLite table. then enrichment shows up and suddenly I'm in a browser building a table, waiting on a run, exporting a CSV, and handing it to the script that actually needed it.

the table was never the point. the thing downstream was the point.

Freckle shipped a CLI. Andy gave us first dibs on it, so I spent the week running it against Clearbox on three jobs.

**1. signups out of Convex**

Clearbox runs on Convex, so a signup lands in the app database the second someone creates an account. email, domain, timestamp, plan.

the run:

🔹 pull new signup rows since the last run
🔹 gate on domain type (free and personal go to a holding table)
🔹 enrich the company domain first, the person second
🔹 write the profile back next to the signup row
🔹 render a three-sentence brief into Notion

the gate is the whole reason this stays cheap. enriching a person on a gmail address costs the same as a real one and resolves about half the time.

the brief is three sentences on purpose. nobody reads a page before a call. I don't read my own.

what goes in it: who they are, what their buyers are posting about on Reddit right now, and one thing they'd be glad I already knew.

someone signs up Tuesday and gets on a call Thursday. that gap is where trust gets built or lost. I'd rather walk in with something useful whether or not they buy.

**2. de-masking site traffic**

anonymous traffic on the site resolves to companies. on its own that's a list of names, which is close to useless.

🔹 resolve session to company
🔹 filter on page path (pricing and docs stay, homepage bounces drop)
🔹 enrich what survives
🔹 score fit against ICP plus the page signal
🔹 route only the top slice to a human

filtering before enriching is what makes the math work. someone who read one blog post is not in market. someone who sat on pricing then opened docs is telling you something, and both cost the same to enrich.

the reveal is the cheap part. the restraint is what turns it into pipeline instead of a list nobody calls.

**3. GEO**

this one has nothing to do with contact data and it's the one I keep thinking about.

ask an AI assistant to recommend a tool in our category and it answers from what it can read. GEO is finding out what it reads.

🔹 build the query set from real buyer questions, not keywords
🔹 run it, capture the answers and the cited sources
🔹 extract every domain those answers lean on
🔹 enrich those domains with the CLI
🔹 diff: which sources repeat, and which ones we're absent from

step five is the output. a ranked list of the places worth being, pulled from what the models actually cite instead of from someone's guess.

in our case it kept landing on the same handful of communities. lines up with what I've been saying about Reddit for a year, and it's better coming out of a data run than out of my own opinion.

**where it all lands**

Connect pushes the run output into Notion, so the workflow lives where the team already reads instead of on my machine.

that matters more than it sounds. the failure mode of terminal-first work is that everything real is on one laptop and nobody else can see it. screenshots in Slack are not documentation.

**the unit**

credits price a row. hours price the work.

when you count credits you hoard them, you run smaller batches than you should, and you skip the exploratory run that would have taught you something. when you're spending time you schedule it. gate first, enrich the survivors, let the expensive passes run overnight.

**what I got wrong**

enriched people before gating domains and burned hours on addresses that were never going to resolve.

wrote a long pre-call brief nobody read.

de-masked every page instead of the two that matter.

tried to get the GEO run to tell me why the model trusts a source. it tells you which. not why.

all three are skill files in GTM Coding Agents, same shape as reddit-buyer-signals. drop one into Claude Code, Codex, or Gemini and it runs.

full write-up with the commands and the schemas is on the blog. links at the bottom, no gatekeeping.

thanks to Andy at Freckle for the early access ⚡

shawn 🧙‍♂️ | the GTM alchemist

---

## Feed teaser (post separately, drives to the newsletter + carousel)

enrichment was the last thing in my stack that made me leave the terminal.

Freckle shipped a CLI. spent the week running it against Clearbox on three jobs.

signups: Convex rows -> gate on domain type -> enrich company first, person second -> three-sentence brief in Notion before the call.

de-masking: resolve session to company -> filter on page path -> enrich what survives -> score -> route the top slice only.

GEO: run the real buyer questions -> capture which sources the AI answers cite -> enrich those domains -> find the ones we're absent from.

the pattern in all three is the same. gate before you spend. the reveal is cheap, the restraint is what makes it pipeline.

carousel has the workflow diagrams. full write-up + skill files in the newsletter 👇

no gatekeeping.

thanks Andy at Freckle for the first dibs ⚡

shawn ⚡

---

## Carousel

Slides generated from `content/images/freckle-workflows/_gen_freckle_carousel.py`
8 slides, 1080x1350, dark canvas #050505 with aura violet #6d5ee9.

## Comment plan

1. link to the blog write-up
2. link to the GTM Coding Agents starters
3. the domain-gate snippet (the ten-minute step that saved the most hours)

## Open placeholders before publishing

- `[[exact freckle CLI command + flags]]` in the blog version
- `[[exact convex query/export command]]`
- `[[de-masking data source]]`
- `[[confirm enrichment-hours definition]]`
