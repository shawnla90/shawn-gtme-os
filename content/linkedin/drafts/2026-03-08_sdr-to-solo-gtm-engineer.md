---
platform: linkedin
pillar: building-and-sharing
status: draft
date: 2026-03-08
source: reddit-repackage
---

four weeks ago I started using Claude Code heavy.

since then I've shipped four full stack websites, built 42 reusable skill files, created a voice system for content, and wired up a progression engine. all one monorepo. one Mac Mini.

I run 4 to 6 concurrent terminal sessions daily. around week two I realized I wasn't just using AI. I was developing patterns for how the human and the agent work together.

so I started documenting it as I built it.

the documentation documented itself. the content about the system became part of the system. a writeup about context handoffs became the actual handoff protocol. a post about the content workflow became the skill file that automates it.

I'm calling it recursive drift. six states you move between:

⚡ freefall - explore without structure
⚡ plan - crystallize into parallel tracks
⚡ build - delegate with full context
⚡ break - stop and question assumptions
⚡ ask - interrogate the system itself
⚡ seed - plant breadcrumbs for future loops

no fixed order. the work decides.

the hardest part was managing memory across concurrent sessions. initially one handoff file. sessions kept overwriting each other. so I built a parallel-safe system - timestamped files, no shared state, each session reads all unconsumed handoffs on start.

simple pattern. wouldn't have found it without breaking the naive approach first.

I open sourced the whole methodology. skill files, context system, templates, all of it. not polished. looking for builders who are already deep in AI tooling and want patterns, not polish.

especially solo operators or small teams punching above their weight.

full breakdown on the blog ⚡ link in comments

shawn 🧙‍♂️ the gtme alchemist

---

**Comment 1 (link):**
full blog post with the concurrent session architecture, compounding patterns, and getting started paths: [link to substack/blog]

repo: github.com/shawnla90/recursive-drift

no gatekeeping ✌
