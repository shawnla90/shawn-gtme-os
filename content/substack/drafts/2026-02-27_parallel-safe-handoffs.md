---
platform: substack
structure: narrative-evolution
series_post: 6
status: draft
source: original
date: 2026-02-27
---

## Subject Line
the morning I realized my AI was forgetting everything

## Preview Text
I run 4-6 Claude Code terminals at once. the context handoff system worked for months. then it silently broke. 30-minute fix. here is the whole architecture.

---

the single-file era started in January.

I had been running Claude Code sessions that started cold every time. open a terminal, re-explain the project, re-explain what I was working on, re-explain the decisions from yesterday. 10 minutes of onboarding before any real work happened.

so I added a context handoff file. `~/.claude/context-handoff.md`. simple instruction in CLAUDE.md: read this file on session start, write it on session end. done.

overnight, everything changed. sessions stopped resetting. the morning terminal knew what the evening terminal had built. decisions persisted. architectural choices stuck. instead of re-explaining my monorepo structure every morning, the model just... knew.

this worked for weeks. I thought I had solved the problem.

---

## then I opened a second terminal

the GTM OS grew. content pipelines in one terminal. infrastructure fixes in another. wiki builds in a third. debugging in a fourth. on a heavy build day, I had six Claude Code sessions running simultaneously.

all of them reading from the same handoff file on start. all of them writing to the same handoff file on end.

I did not think about what that meant.

---

## the morning I lost two sessions

a Tuesday morning. I opened Claude Code, ran through the handoff, and started working. something felt off. the handoff mentioned a blog pipeline fix but nothing about the wiki entries I had spent two hours on the night before. and nothing about the infrastructure migration that ran in a third terminal.

I checked the handoff file. it had the blog pipeline context. that was it. one session out of three.

the last terminal to close had written its handoff and overwritten the other two. classic last-write-wins race condition. the wiki context was gone. the infrastructure context was gone. no error. no warning. just a file that looked normal but was missing 66% of the actual work.

I went back through the previous week. same pattern every day. 4-6 terminals, one file, last writer wins. I had been losing context for days without noticing because the file was always populated. it was just the wrong content.

---

## the fix took 30 minutes

the architecture change is embarrassingly simple.

stop writing one file. write timestamped files to a directory.

`~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md`

every session writes its own file. the timestamp guarantees uniqueness. no collisions.

on session start, read ALL unconsumed handoffs. not one file. every file in the directory that has not been marked as consumed. merge all the context.

after reading, rename each file from `.md` to `_done.md`. consumed. future sessions skip it. a cleanup job deletes consumed handoffs older than 7 days.

that is the entire system. four operations: write, read-all, mark-done, clean.

```
Session Start:
  ls ~/.claude/handoffs/*.md (skip *_done.md)
  --> read all unconsumed handoffs
  --> rename each to _done.md
  --> merge context

Session End:
  --> write YYYY-MM-DD_HHMMSS_slug.md
  --> never touch another session's file

Cleanup:
  find ~/.claude/handoffs -name '*_done.md' -mtime +7 -delete
```

no database. no lock files. no coordination between terminals. each session is independent. the directory structure handles the merge.

30 minutes from idea to working system. the CLAUDE.md update was 15 lines.

---

## the real lesson

the recursive thing is what got me.

I build context engineering systems. the entire GTM OS is a context engineering system. CLAUDE.md, skills, voice files, partner folders, memory architecture. every piece exists to get the right information into the context window at the right time.

and the tool that managed context between sessions... was itself broken by a context problem.

the handoff system was losing context because I did not engineer the handoff system's own context architecture. I applied single-file thinking to a parallel problem. the same mistake I tell other people to avoid.

context engineering is recursive. the infrastructure that manages context needs context engineering too. you cannot exempt your own tooling from the principles you apply everywhere else.

---

## what I changed alongside it

while upgrading handoffs, I hit the same problem with memory files.

MEMORY.md had grown to 400+ lines. Claude loads the first 200 lines of auto-memory. everything past 200 was invisible. preferences, decisions, architectural notes - silently truncated for weeks.

same fix, same principle. MEMORY.md becomes a lean index under 200 lines. one-line summaries and links to topic files. `identity.md`, `voice-rules.md`, `infrastructure.md`, `completed-work.md`. the index always loads. the details load on demand.

two upgrades. same pattern. stop putting everything in one file. use structure and naming conventions to manage scale.

the parallel handoff system has been running clean for a week now. six terminals. simultaneous sessions. zero lost context. the morning session reads 3-5 handoffs from the previous day and starts with full awareness of everything.

the full architecture with copy-paste CLAUDE.md snippets is on the blog: shawnos.ai/blog/parallel-safe-context-handoffs

build in public. break things. fix them in 30 minutes. write about it.

- shawn
