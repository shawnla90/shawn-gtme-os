---
platform: x
type: thread
angle: release-reaction
status: draft
date: 2026-07-24
source: content/blog/2026-07-24_freckle-cli-three-workflows.md
schedule: 1-2 days after the LinkedIn newsletter
---

## Thread (9 tweets)

1/

enrichment was the last thing in my stack that made me leave the terminal.

Freckle shipped a CLI. spent the week running it against Clearbox on three jobs.

signups, visitor de-masking, and AI answer citations.

the third one surprised me ⚡

---

2/

the old shape:

open a tab
build a table
wait on the run
export a CSV
hand it to the script that needed the data

the table was never the point. the thing downstream was the point.

---

3/

workflow 1: signups

Clearbox runs on Convex, so a signup is a row the second someone creates an account.

pull new rows
gate on domain type
enrich company first, person second
write back next to the signup
three-sentence brief in Notion

---

4/

the gate is the whole reason it stays cheap.

free and personal domains never get a person lookup.

enriching a person on a gmail address costs the same as a real one and resolves about half the time.

ten minutes of code.

---

5/

the brief is 3 sentences on purpose.

who they are.
what their buyers are posting about right now.
one thing they'd be glad I already knew.

first version was a full page and I skipped reading my own output.

---

6/

workflow 2: de-masking

anonymous traffic resolves to companies. that alone is a list of names, which is useless.

resolve -> filter on page path -> enrich survivors -> score fit + page signal -> route the top slice only

pricing + docs stay. homepage bounces drop.

---

7/

filter before you enrich.

someone who read one blog post is not in market.
someone who sat on pricing then opened docs is telling you something.

both cost the same to enrich. one of them pays.

---

8/

workflow 3: AI answer citations

nothing to do with contact data.

run the real buyer questions
capture which sources the answers cite
extract those domains
enrich them
diff which ones repeat and which you're absent from

a ranked list of where to show up, from what the models actually cite.

---

9/

credits price a row. hours price the work.

count credits and you hoard them. spend time and you schedule it.

all three are skill files in GTM Coding Agents. ungated.

thanks to Andy at Freckle for the first dibs.

full write-up 👇

---

## Standalone singles (space these out, don't post same day as the thread)

**Single A (the gate)**

gate on domain type before any person lookup.

free and personal domains go to a holding table. company domains continue.

enriching a person on a gmail address costs the same as a real one and resolves about half the time.

ten minutes of code, changed the cost of the whole run.

---

**Single B (the CLI take)**

moving enrichment behind a CLI didn't add a tool. it removed a step.

the work I was doing in a table was always feeding a script.

now the whole run is one file I can diff in git instead of guessing which UI setting somebody toggled.

---

**Single C (the brief)**

nobody reads a page before a call. I don't read my own.

three sentences:
who they are
what their buyers are posting about
one thing they'd be glad I already knew

that's the difference between a demo and a useful conversation.

---

**Single D (GEO, quote-tweetable)**

ask an AI assistant to recommend a tool in your category.

it answers from what it can read.

so go find out what it reads, enrich the domains behind every citation, and see which ones you're completely absent from.

that's the list.

---

## Attachments

- thread: slide 2 (signups diagram) from `content/images/freckle-workflows/`
- single A: terminal screenshot of the gate output `[[screenshot]]`
- single D: slide 4 (GEO diagram)

## Open placeholders

- `[[screenshot]]` for single A
- confirm blog URL before posting tweet 9
