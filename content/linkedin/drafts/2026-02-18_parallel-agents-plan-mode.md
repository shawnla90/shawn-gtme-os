# Parallel Agents + Plan Mode — The Master Unlock

> **Platform**: LinkedIn
> **Pillar**: Skill/System Shares
> **Date**: 2026-02-18
> **Status**: draft
> **Screenshot**: parallel-agent-execution-plan.png

---

## Hook Options (2–5 alternatives for first line)

1. most people using Cursor agents are burning money and context on the wrong approach.
2. I run 7 agents in parallel to build one website feature. here's why it actually works.
3. the single biggest unlock I can give you for Cursor: don't start in agent mode.
4. plan mode is the most underrated feature in Cursor. and it's not close.
5. before I let a single agent touch my code, I already know every file it's going to create.

---

## Version 1: The System Reveal

the single biggest unlock I can give you for Cursor: don't start in agent mode.

start in plan mode. every time.

here's what I mean. I needed to add how-to wiki pages across three websites in my monorepo. three Next.js apps. shared components. cross-site redirects. SEO metadata. backlinks to existing wiki entries.

if I just opened agent mode and said "add how-to pages to all three sites" — it would hallucinate half the file paths, miss the shared component pattern, and burn through context trying to figure out the architecture.

instead I switched to plan mode first. no files get touched. no code gets written. it just thinks.

what came back was a parallel agent execution plan with 4 waves:

⚡ wave 1 — two agents in parallel. one builds the data file with 15-18 entries. the other scaffolds the shared page component against the known interface.

🔧 wave 2 — three agents in parallel. each one creates /how-to routes for a different site. ShawnOS gets full metadata. theGTMOS and theContentOS get cross-site redirects for non-canonical slugs.

🔗 wave 3 — two agents in parallel. one updates all three layout.tsx nav configs. the other adds backlinks from existing wiki entries.

✅ wave 4 — sequential. turbo build across all three apps. verify routes render, cross-links resolve, SEO is correct.

7 agents. 4 waves. 8 tasks. one plan.

here's what plan mode actually gives you that agent mode doesn't:

→ execution order. what can run in parallel vs what has dependencies.
→ model recommendations. which engine fits which task — you don't need the most expensive model for every job.
→ cost awareness. you see the scope before you spend tokens.
→ learning. you understand the architecture before code starts flying. that's where the real skill compounds.

the plan is the blueprint. agent mode is the construction crew. you don't send the crew in without a blueprint.

this is the thing nobody talks about. the people getting the best outputs from AI aren't prompting harder. they're planning first.

I've been building my entire website infrastructure this way. three sites. one repo. every feature starts in plan mode, gets decomposed into parallel waves, then executed.

screenshot of the actual plan in the comments 👇

no gatekeeping ✌

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Version 2: The Meta Take

most people using Cursor agents are burning money and context on the wrong approach.

they open agent mode. dump a vague prompt. watch it spin for 90 seconds. get a half-broken result. try again. burn more context. repeat.

I used to do this too.

the unlock was embarrassingly simple: plan mode first.

plan mode doesn't touch files. doesn't write code. it just thinks. and what it gives you back is the single most valuable artifact in the whole workflow — the execution plan.

yesterday I needed to add how-to wiki pages across three Next.js sites in a Turborepo monorepo. shared components. cross-site routing. SEO structured data. backlinks into existing wiki systems.

plan mode gave me a 4-wave parallel agent execution plan:

wave 1: two agents build the data layer and shared component simultaneously.
wave 2: three agents create routes across all three sites in parallel.
wave 3: two agents handle nav updates and cross-linking.
wave 4: sequential build and verification.

7 agents. 8 tasks. zero wasted context.

but here's the part that actually matters — plan mode doesn't just organize work. it teaches you.

every plan shows you:
→ what depends on what (execution order)
→ which models fit which tasks (not everything needs the heaviest engine)
→ the full scope before a single token is spent on code
→ the architecture of the thing you're building, explained back to you

that last one is the master unlock. you learn your own codebase faster by reading plans than by reading code.

I run every website feature through this loop now. plan → decompose → parallel execute → verify. the screenshot shows yesterday's actual plan output.

the agents are the hands. the plan is the brain. stop skipping the brain.

screenshot in the comments 👇

no gatekeeping ✌

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Version 3: The Invitation

I run 7 agents in parallel to build one website feature. and the thing that makes it work has nothing to do with prompting.

it's plan mode.

here's the setup. I have a Turborepo monorepo with three Next.js sites — ShawnOS, theGTMOS, theContentOS. one repo deploys all three. when I add a feature, it needs to land across all of them.

yesterday the feature was how-to wiki pages. 15-18 entries. shared components. site-specific routes. cross-site redirects. SEO metadata. backlinks into existing wiki systems.

I used to try to do this in one long agent session. it would get confused by the third site, lose track of shared files, and I'd spend more time fixing than building.

now I start every feature in plan mode. here's what changes:

plan mode reads the codebase, understands the dependency graph, and gives you a structured execution plan. mine came back with 4 waves:

⚡ wave 1 (parallel): data file + shared page component
🔧 wave 2 (parallel): all three site routes built simultaneously
🔗 wave 3 (parallel): nav config updates + wiki backlinks
✅ wave 4 (sequential): turbo build + verification

each wave tells you what can run at the same time and what has to wait. each task is scoped tight enough that an agent can execute it without losing context.

but the real reason I'm sharing this — plan mode makes you a better builder. fast.

you see the architecture before code gets written. you learn which models are right for which tasks. you catch scope creep before it eats your tokens. you understand your own system better every time.

if you're using Cursor and you haven't tried the plan → parallel execute → verify loop: try it on your next feature. start in plan mode. let it decompose the work. then fire the agents.

screenshot of yesterday's plan in the comments 👇

no gatekeeping ✌

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Comment Thread Content

**Comment 1:**
here's the actual plan mode output. 4 waves. 7 agents. 8 tasks. one feature deployed across three sites.

the key insight: wave 1 and wave 2 agents run simultaneously because they don't depend on each other's output. wave 4 is sequential because you need everything built before you verify.

plan mode figures this out for you. you don't have to map the dependency graph yourself.

[screenshot]

**Comment 2:**
the model recommendation piece is underrated. not every task needs the most capable model. a data file with 18 entries? fast model works fine. a complex shared component with cross-site routing logic? that needs more horsepower.

plan mode surfaces this. you stop overspending on simple tasks and underspending on complex ones.

**Comment 3:**
if you want to try this: open Cursor. switch to plan mode (it's in the mode selector). describe what you want to build. don't ask it to build it — ask it to plan the build.

then take that plan, open agent mode in a fresh chat, and execute wave by wave. the context stays clean because each agent gets a scoped task, not the whole project.

---

## Notes

- Screenshot shows the parallel agent execution plan from Cursor plan mode
- Feature: adding how-to wiki pages across three Next.js sites in a Turborepo monorepo
- 4 waves, 7 agents (A through G), 8 total tasks
- Key selling points: execution order, model recommendations, cost awareness, learning acceleration
- Pillar: Skill/System Shares — sharing the plan mode → parallel agents workflow as a reusable framework
- Version 1 is the most tactical (step-by-step reveal of the waves)
- Version 2 is the most meta (why planning > prompting)
- Version 3 is the most inviting (try this yourself)
