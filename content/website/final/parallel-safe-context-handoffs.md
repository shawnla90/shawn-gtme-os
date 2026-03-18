---
title: "parallel-safe context handoffs for Claude Code"
date: "2026-02-27"
excerpt: "I run 4-6 Claude Code terminals at once. The single handoff file worked until it didn't. Here's the parallel-safe architecture I replaced it with."
category: "methodology"
---

**tl;dr:** if you run multiple Claude Code terminals, a single handoff file silently loses context every day. the fix is a directory-based system with timestamped files, read-all-on-start, and mark-done consumption. took 30 minutes to implement and eliminated all context loss across parallel sessions.

## what problem do parallel handoffs solve?

every Claude Code session starts from zero. close the terminal, the context is gone. no memory of what you built, what broke, what decisions you made, what is half-finished.

context handoffs fix this. at the end of every session, write a structured document. at the start of the next session, read it. now the new session has full context.

the first version is always a single file. `~/.claude/context-handoff.md`. every session reads it on start, writes it on end. simple. effective.

until you open a second terminal.

terminal A finishes and writes its handoff. terminal B finishes 30 seconds later and overwrites it. terminal A's context is gone. you never notice because the file is still there. it just has the wrong content inside.

this is a last-write-wins race condition. and it gets worse as you scale. I run 4 to 6 Claude Code terminals simultaneously. with a single file, 3 to 5 sessions of context get silently destroyed every day. the system looks healthy because a handoff file always exists. you just do not see what is missing from it.

## how did I get here?

the evolution went like this:

**no handoffs.** every session starts cold. re-explain everything. waste the first 10 minutes getting the model oriented. this is where most people are.

**single file.** `~/.claude/context-handoff.md`. CLAUDE.md tells the model to read it on start and write it on end. sessions compound instead of resetting. massive upgrade. worked great for months.

**the break.** I started running parallel terminals. content in one. infrastructure in another. debugging in a third. wiki builds in a fourth. all writing to the same file. context started vanishing. I did not notice for weeks because the handoff file was always populated. it was just missing 80% of the sessions.

**the fix.** directory-based parallel writes. timestamped files. read-all-on-start. mark-done consumption. took 30 minutes to implement.

the frustrating part is how obvious the fix was in retrospect. I spent weeks losing context before I realized the architecture was the problem, not the model.

## how do parallel-safe handoffs work?

the full parallel-safe handoff system has 4 operations.

**write.** each session writes to `~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md`. the timestamp guarantees uniqueness. no two sessions collide. the slug describes what the session was working on.

**read.** on session start, list all files that do not end in `_done.md`. read every single one. merge all context into the current session.

**consume.** after reading, rename each file from `file.md` to `file_done.md`. future sessions skip consumed files. the original content stays on disk for reference.

**clean.** periodically delete consumed handoffs older than 7 days. unconsumed handoffs are never deleted.

here is the full lifecycle:

```
Session Start:
  ls ~/.claude/handoffs/*.md (skip *_done.md)
  --> read each unconsumed handoff
  --> rename file.md to file_done.md
  --> merge all context into current session

Session End:
  --> write ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md
  --> never overwrite another session's file

Cleanup (periodic):
  find ~/.claude/handoffs -name '*_done.md' -mtime +7 -delete
```

that is the entire system. no database. no lock files. no coordination between sessions. each session operates independently and the directory handles the merge.

## how does the memory upgrade work?

while fixing handoffs, I hit the same problem with memory files.

MEMORY.md was a single file that every session loaded. it started at 30 lines. after a few weeks of every session appending to it, it was 400+ lines. Claude loads the first 200 lines of auto-memory files. everything after line 200 was invisible. decisions, preferences, architectural notes - all silently truncated.

the fix follows the same pattern. stop putting everything in one file.

**MEMORY.md** becomes a lean index. under 200 lines. section headers, one-line summaries, and links to topic files.

**topic files** hold the details. `identity.md` for identity and profile data. `voice-rules.md` for voice system quick reference. `infrastructure.md` for models, crons, key paths. `completed-work.md` for finished initiatives.

MEMORY.md always loads. topic files load on demand when the task is relevant. the index stays under the truncation limit. the details are available when needed.

same principle as the handoff directory. structure replaces a single overloaded file.

## what changed before and after?

**before:**
- one handoff file at `~/.claude/context-handoff.md`
- last terminal to write wins, all other context lost
- one MEMORY.md file growing without limit
- content past line 200 silently invisible
- sessions randomly missing context with no visible errors

**after:**
- handoff directory at `~/.claude/handoffs/`
- every session writes a uniquely-named file
- all unconsumed handoffs merge on session start
- MEMORY.md is a 200-line index linking to topic files
- topic files load on demand, never truncated
- zero context loss across parallel terminals

the parallel handoff system has been running for a week. six terminals, simultaneous sessions, no lost context. the morning session reads 3-5 handoffs from the previous day and starts with full awareness of everything that happened.

## steal the architecture

here is the CLAUDE.md block you need. copy it into your project.

```markdown
## Context Handoff System

Handoffs are parallel-safe. Multiple terminals can write handoffs
without overwriting each other.

### On Session Start
1. Read all unconsumed handoffs:
   ls ~/.claude/handoffs/*.md 2>/dev/null | grep -v '_done.md$'
2. Also check legacy location: ~/.claude/context-handoff.md
3. After reading, mark each consumed:
   rename file.md to file_done.md
4. Clean up old consumed handoffs:
   find ~/.claude/handoffs -name '*_done.md' -mtime +7 -delete

### On Session End
Write handoff to ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md
Never overwrite another session's handoff.
```

the directory structure:

```
~/.claude/
  handoffs/
    2026-02-27_091522_blog-pipeline.md        (unconsumed)
    2026-02-27_093401_wiki-entries.md          (unconsumed)
    2026-02-26_201145_deploy-fix_done.md       (consumed)
    2026-02-26_184230_content-batch_done.md    (consumed)
```

every handoff document has 5 sections:

1. **session summary.** one paragraph. what was the goal and what happened.
2. **what changed.** files created, modified, deleted. specific paths.
3. **what still needs work.** unfinished tasks, known bugs, next steps.
4. **key decisions.** architectural choices, tradeoffs, things the next session should not revisit.
5. **active context.** branch name, running processes, environment state.

keep handoffs factual. no commentary. a session reading it at 6 AM needs file paths and status, not opinions about the refactor.

the recursive insight is worth naming. context engineering infrastructure needs its own context engineering. the handoff system that manages session context was itself broken by a context problem - sessions overwriting each other because the architecture did not account for parallelism. the fix was applying the same principles I use for everything else: structure, naming conventions, and never putting all your state in one file.

## frequently asked questions

**what are parallel-safe context handoffs?**
a system where multiple Claude Code terminals can write session context simultaneously without overwriting each other. each session writes to a uniquely timestamped file in a directory. on session start, all unconsumed handoffs get read and merged. no race conditions, no lost context.

**how do you prevent session conflicts in Claude Code?**
use a directory instead of a single file. each session writes to `~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md`. the timestamp guarantees uniqueness. sessions read all unconsumed files on start and rename them with a `_done` suffix after reading. no coordination between sessions required.

**what is a context handoff file?**
a structured markdown document with 5 sections: session summary, what changed (specific file paths), what still needs work, key decisions, and active context (branch, environment). it captures everything a future session needs to continue the work without re-explanation.

---

**related posts:** [the context handoff engine](https://shawnos.ai/blog/context-handoff-engine-open-source) | [recursive drift](https://shawnos.ai/blog/recursive-drift) | [6 weeks of building with Claude Code](https://shawnos.ai/blog/6-weeks-of-building-with-claude-code)

*related: [context handoffs wiki](/context-wiki/context-handoffs) - [parallel session handoffs how-to](/how-to/parallel-session-handoffs) - [how to set up your own AI assistant](/blog/how-to-setup-your-own-ai-assistant)*
