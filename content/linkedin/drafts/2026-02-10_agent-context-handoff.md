# Agent Context Handoff — Handoff Docs So the Next Agent Knows Exactly What to Do

> **Platform**: LinkedIn
> **Pillar**: Skill/System Shares
> **Series**: Skills I use everyday, Part 3
> **Date**: 2026-02-10
> **Status**: draft
> **Skill**: .cursor/skills/agent-context-handoff/SKILL.md
> **Screenshot**: optional

---

## Version 1: The System Reveal

every time you switch threads or start a fresh chat, the new agent has no idea what you just did.

context window resets. everything you built, decided, and shipped — gone.

skills I use everyday, part 3 ⚡ agent-context-handoff

built a skill that produces a scope document on demand. you say full scope of this chat or handoff to new thread and it spits out:
- partner and context (who, what project)
- what we accomplished (deliverables, decisions)
- key files (paths so the new agent can read without guessing)
- open questions and blocked items
- next steps (specific actions for the next agent)
- workflow hooks (skills and commands to invoke)

the principles: standalone (no prior context needed), token-efficient (every section earns its place), actionable (ends with what to do next), file-anchored (real paths, not vibes).

I use it when changing workflow pillars, handing off to someone else, or starting a new content batch and want the agent to pick up exactly where things left off.

the meta bit: this post was written from a handoff document. the handoff skill produced a scope doc that got pasted into a new thread. that thread wrote this post. recursion in action.

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Version 2: The Meta Take

a skill that hands off context… handing off its own context… to create content about itself.

yeah.

skills I use everyday, part 3 ⚡ agent-context-handoff

the problem: you're deep in a build. you switch threads because you hit a limit or want a fresh agent for a different task. the new agent starts from zero. no partner context, no key files, no next steps. you waste tokens re-explaining or worse — the new agent guesses wrong.

the fix: a skill that produces a scope document. partner and context. accomplishments. key files with paths. open questions. next steps. workflow hooks.

all in one paste. no prior conversation required.

why it matters for anyone building with AI: your systems should hand off cleanly. not just between humans. between agents, between threads, between you-at-morning and you-at-midnight. the handoff doc is the baton pass.

this post exists because the handoff skill wrote a scope doc. that doc got pasted into a new chat. the new agent read it and drafted this. the skill documented itself into existence.

that's the kind of recursion that actually ships.

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Version 3: The Invitation

here's the structure that made handoffs actually work for me:

partner and context (who, what)
what we accomplished (decisions, deliverables)
key files (paths, not descriptions)
open questions and blocked
next steps (what the next agent should do)
workflow hooks (skills, commands)

skills I use everyday, part 3 ⚡ agent-context-handoff

that's it. no preamble. no fluff. a new agent pastes this into a fresh thread and knows exactly what to do.

the principles I baked in: standalone (no prior context needed), token-efficient (every line earns its place), actionable (ends with next actions), file-anchored (real paths so the agent can read_file without guessing).

if you're running multi-thread workflows or handing off builds to teammates or just switching between content pillars and build work — steal this structure. the skill file lives in my content OS. adapt the sections to your stack. the logic works in any system: Cursor, Claude, custom GPTs, internal docs.

the framework matters more than my specific implementation.

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Comment Thread Content

**How it triggers:**
full scope of this chat
context for new agent
handoff to new thread
thread into new context
what the next agent needs to know

**On token efficiency:**
the doc stays under ~200 lines unless the conversation was genuinely large. every section has a job. partner/context = orientation. accomplishments = what's done. key files = where to read. open questions = what's stuck. next steps = what to do. no redundancy.

**On the meta recursion:**
this post is proof. handoff doc produced → pasted into new chat → new agent read it → drafted this post about the handoff skill. the skill documented itself. that's the kind of self-referential system that actually works in production.

**Steal the structure:**
the sections are generic. swap partner for project, client, or sprint. the file-anchored principle (real paths) is the unlock. agents can read_file. they can't read vibes.

---

## Notes

Skill: agent-context-handoff. Part 3 in series. Meta play — handoff skill producing handoff doc that handed off to content agent to create content about the handoff skill. Partner context: Elauwit (Katie via Contax). Version 1 = system reveal (what it does, how it works). Version 2 = meta take (why building handoff systems matters, recursion in action). Version 3 = invitation (here's the framework, make it yours). No P.S. (Part 1 only).
