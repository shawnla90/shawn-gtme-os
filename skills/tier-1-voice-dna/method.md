# Recursive Drift

> the non-linear method for building with AI.

## What It Is

Recursive Drift is a state machine with feedback loops. You move between modes in no fixed order, but each pass compounds on the last. The output of one loop becomes the context for the next. There's no step 1. There's no finish line. There's just the next pass through the system.

The method isn't a framework you follow. It's a pattern you recognize after the fact — when you look at what you built and realize the plan rewrote itself three times during execution, the documentation documented itself, and the content about the system became part of the system.

## The States

Six modes. No fixed order. You enter whichever one the work demands.

### Freefall

Explore without structure. Let ideas collide. No outline, no destination, no rules about what belongs where. This is where unexpected connections surface — GTM campaigns next to avatar sprites next to newsletter drafts. The mess is the point. Freefall produces raw material that every other state refines.

**Repo example:** The idea bank (`skills/tier-3-content-ops/captures/idea-bank.md`) captures freefall output — unstructured sparks parked across domains with no obligation to ship.

### Plan

Crystallize freefall into parallel tracks. Multi-plan, not single-plan. Stack work that can run concurrently, identify dependencies, assign execution order. Plans are living documents — they rewrite themselves during execution as the build reveals what the plan got wrong.

**Repo example:** The weekend three-site launch plan replaced a previous plan mid-execution. Same destination, restructured as a Turborepo monorepo after the build revealed the original architecture wouldn't scale.

### Build

Delegate to AI with full context and ship fast. Context is the differentiator — skill files, voice playbooks, partner research, prior outputs all loaded before a single line gets written. The build isn't "tell AI what to do." It's give AI everything it needs and get out of the way.

**Repo example:** 42 invokable skills in `.cursor/skills/` — each one a context payload that turns a slash command into a full workflow. `/playdraft` takes a screenshot and produces LinkedIn + X drafts. `/substackpost` takes a topic and produces a newsletter. The build runs because the context was set up first.

### Break

Stop mid-flow. Question assumptions. Redirect. Break is the state most people skip, and it's the one that prevents the most wasted work. When the output feels wrong, when the plan feels stale, when you're three hours into something that should have taken one — that's Break telling you to stop building and start questioning.

**Repo example:** The content OS meta post (`content/linkedin/drafts/2026-02-10_content-os-meta.md`) came from breaking mid-workflow to ask why the content creation process felt slow — then rebuilding the process and documenting the rebuild as the content itself.

### Ask

Interrogate the system. Ask the AI about itself. Ask the plan about the plan. Ask the content about the content. This isn't prompting — it's using the system's self-awareness as a debugging tool. When you ask an agent what it doesn't know, you find the gaps the build missed.

**Repo example:** The `/arc` page on shawnos.ai was built by asking the system to describe itself — "I don't prompt once and ship whatever comes back. I use plan mode before I write a single line. I use ask mode when something breaks." The page explains the methodology by interrogating it.

### Seed

Plant breadcrumbs and forward-references for future loops. Seeds are one-sentence asides dropped into current content that tease future work. They create pull — the reader barely notices them now, but when the full piece ships later, the seeds make it feel inevitable instead of sudden.

**Repo example:** The screen teaser post (`content/linkedin/drafts/2026-02-13_screen-teaser.md`) includes internal notes: "Comment 2 seeds the Mac Mini / Neobots arc without naming them. Full reveal comes later. this is the breadcrumb drop."

## The Recursive Property

Output feeds back as input. That's the core mechanic.

The skill-play command (`/skillplay`) was run on itself for its first execution. The post about the command that creates posts about skills was written by running that command on itself. The screenshot was the prompt being typed in real time. Recursion isn't a trick — it's a design constraint that forces generality. When your documentation tool has to document itself, you're forced to make it general enough to document anything.

More examples of the loop:

- **The website explains the system that built the website.** The `/about` page says: "every skill, every post, every campaign runs through a single codebase. the site you're on right now is the proof of work." The page is output. The system is input. They're the same thing.

- **Plans rewrite themselves during execution.** The weekend launch plan replaced a previous plan, kept the same goals, restructured the architecture. The plan's output (what worked, what didn't) became the input for the next plan.

- **Content becomes infrastructure.** Posts about the content OS led to codifying those workflows as reusable skills. The `/playdraft` skill exists because a post about shipping content faster revealed the pattern. The post was the prototype. The skill was the production version.

- **Skills produce content that documents the skills.** The `slack-sync` skill includes a "Content-from-Skill Workflow" section — every skill execution is a potential content draft. The system documents itself because it's already running when you need the documentation.

The recursive property means the system gets denser over time without getting heavier. Each pass adds context that makes the next pass faster. The 42nd skill is easier to build than the 1st because 41 skills worth of patterns, voice playbooks, and workflow templates already exist as input.

## Anti-Patterns: What This Is Not

**Not vibe coding.** Freefall has intent. You explore to find connections, not to avoid planning. If nothing useful surfaces, you switch states. Freefall without eventual crystallization is just procrastination.

**Not prompt engineering.** Prompt engineering optimizes the interface between human and AI. Recursive Drift optimizes the entire system — context payloads, feedback loops, documentation that compounds. A better prompt gets you a better response. A better system gets you a better system next time.

**Not "let AI do everything."** The human decides when to switch states. The human recognizes when Break is needed. The human plants seeds. AI executes within states. The human navigates between them.

**Not linear.** There's no Phase 1 → Phase 2 → Phase 3 pipeline. You might Build, then Break, then Freefall, then Seed, then Plan, then Build again. The sequence is determined by the work, not by the method.

**Not a productivity hack.** This isn't about shipping faster (though it does). It's about shipping things that compound — where each output makes the next build easier, the next piece of content more grounded, the next plan more informed.

## How It Differs

**From prompt engineering methodologies** (chain-of-thought, tree-of-thought, few-shot): Those optimize a single interaction. Recursive Drift optimizes across interactions. The unit of work isn't a prompt — it's a loop.

**From linear build frameworks** (design → build → test → ship): Those assume the plan survives execution. Recursive Drift assumes the plan will rewrite itself and builds that rewriting into the method.

**From "building in public" as content strategy**: Building in public treats the build as content source material. Recursive Drift treats the build and the content as the same artifact. The post isn't about the build. The post IS part of the build.

**From agent orchestration patterns** (AutoGPT, CrewAI-style delegation): Those automate the loop. Recursive Drift keeps the human in the loop as the state-switcher. The AI doesn't decide when to Break or Seed. You do.

## The Paradox

An unstructured process that produces structured output.

No fixed order. No required sequence. No checklist. And yet: 42 skills, 4 voice playbooks, 3 websites, 93 content files, 15 proprietary scripts, a progression engine, an avatar system, and an IP registry — all from the same recursive loop.

The structure emerges from the recursion. Each pass adds a little more form. Freefall produces raw ideas. Plan gives them shape. Build makes them real. Break prevents drift (the bad kind). Ask reveals what's missing. Seed creates pull for the next loop.

The output is structured because the loop ran enough times. Not because the process was.

## Collaborates With

- **Voice system** (`core-voice.md`): Recursive Drift produces the raw material. Voice shapes how it ships.
- **Anti-slop filters** (`anti-slop.md`): The Break state catches AI patterns. Anti-slop catches AI language.
- **Skill framework** (`.cursor/skills/`): Each skill is a crystallized Build state — context + workflow + output, ready for the next loop.
- **Content pillars** (`skills/tier-3-content-ops/pillars/`): The Seed state feeds forward into content planning. Pillars organize what Freefall produces.

## The Principle

If a system can't describe itself, it's not general enough.

Recursive Drift describes itself. This document was written by the method it documents — freefall produced the initial concept, plan mode structured the phases, build mode delegated the writing, break mode questioned whether the name was right, ask mode interrogated what made it different, and seed mode planted forward-references in Monday's launch content before this page existed.

The method is the proof. The proof is the method.
