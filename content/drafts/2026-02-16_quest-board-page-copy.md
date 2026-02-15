# Quest Board Page Copy

> Route: `/log/quests`
> Component: `website/packages/shared/pages/QuestBoardPage.tsx`
> Routes into: shawnos, gtmos, contentos at `/log/quests/`
> Terminal header: `$ ./quest-board --list-available`

---

## Intro Block

the API gives you the endpoints. the build-your-own page gives you the prompt. this page gives you the challenge.

fair warning: these aren't weekend hacks. you're going to learn Python, Pillow, git, plan mode, ask mode. you're going to fail. you're going to read errors you don't understand, debug things that worked five minutes ago, and wonder why your image renders at 0x0 pixels.

that's the point.

every quest here is something I built myself. the daily tracker, the dashboard, the progression engine, the avatar. none of it was generated in one shot. all of it was planned, tested, broken, fixed, and shipped.

if you want to actually learn how to build with AI, this is where you start.

---

## Quest 1: Boot Sequence

**Difficulty:** Beginner
**Tools:** Python, git, Cursor IDE
**What you'll learn:** File scanning, git integration, structured JSON output, your first automated workflow

set up the daily tracker. write a Python script that scans your repo, detects what you worked on, and outputs a structured JSON log. run it. see your work quantified for the first time.

this is the foundation everything else builds on. if you skip this, nothing after it makes sense.

**Start here:** [build your own](/log/build-your-own) — the prompt that gets you from zero to your first scan.

**How to actually do this with AI:**
- open Cursor. start in plan mode. describe what you want: "a script that scans git commits and file changes from today, classifies them, and outputs JSON."
- review the plan. don't accept it blindly. understand the file structure it proposes.
- switch to agent mode. let it build. when it breaks (it will), read the error before you ask it to fix it.
- run the script. check the JSON. iterate.

---

## Quest 2: First Pixel

**Difficulty:** Beginner — Intermediate
**Tools:** Python, Pillow, Cursor IDE
**What you'll learn:** Image generation with code, coordinate systems, font rendering, layout logic

render your first Pillow-generated image. take the JSON from Quest 1 and turn it into a visual dashboard card. colors, layout, fonts, all generated from data.

this is where it clicks. the image isn't a screenshot. it's computed. every pixel has a reason.

**What to customize:**
- background color and accent palette
- layout grid (how many columns, what goes where)
- font choices (monospace vs. sans, sizes, weights)
- what data gets surfaced (commits? files? scores?)

**How to actually do this with AI:**
- ask mode first: "how does Pillow handle text rendering and coordinate placement?"
- plan mode: sketch the layout. top bar, stat boxes, body grid, footer. get the structure before the code.
- agent mode: build it. the first render will look wrong. the text will be cut off or placed at (0,0). that's normal.
- iterate on coordinates. Pillow's origin is top-left. y increases downward. if you don't understand this, your layout will fight you.

---

## Quest 3: The Progression Layer

**Difficulty:** Intermediate
**Tools:** Python, JSON, math
**What you'll learn:** XP formulas, level scaling, state persistence, scoring engines

add XP, levels, and titles on top of your tracker. take daily output scores and convert them into RPG progression. accumulate XP across days. trigger level-ups. unlock titles.

this is the bridge between "I shipped today" and "my character evolved."

**Design decisions you'll make:**
- how much XP per output point? (I use 10:1)
- what's the level curve? (linear? exponential? I use `floor(sqrt(xp / 100))`)
- how many title tiers? what are the thresholds?
- do you want a class system? what triggers class assignment?

**How to actually do this with AI:**
- plan mode: map out the XP formula, the level curve, the title table. get the math right on paper before writing code.
- ask mode: "what are the tradeoffs between linear and exponential XP curves?"
- agent mode: build the engine. test it with fake data first. edge cases matter. what happens at level 0? what happens at XP = 0? what happens when someone ships nothing for a week?
- check the [skill guide](/log/skill-guide) to see how I structured mine.

---

## Quest 4: Ship It Live

**Difficulty:** Intermediate
**Tools:** Vercel, Next.js, API routes, Python
**What you'll learn:** Deployment, API design, server-rendered images, production debugging

deploy your tracker to a live URL. build an API endpoint that serves your progression data as JSON. add an OG image route that renders your dashboard card on the fly. ship it so anyone can see your stats at a URL.

this is where it stops being a local script and becomes infrastructure.

**What you're building:**
- a Next.js app (or add routes to an existing one)
- `/api/progression` — returns your RPG stats as JSON
- `/og` — renders your dashboard card as a server-generated PNG
- deployment on Vercel (free tier works)

**How to actually do this with AI:**
- plan mode: "I have a Python script that generates a dashboard image and a JSON progression file. I want to serve both from a Next.js app deployed on Vercel. plan the architecture."
- the hardest part is bridging Python and Next.js. you have options: pre-generate and serve static, run Python in an API route, or rewrite the renderer in JS/Canvas. each has tradeoffs. plan mode is where you figure that out.
- deploy early. don't wait until it's perfect. ship the JSON endpoint first. add the image route after. iterate in production.

---

## Quest 5: Come At Me

**Difficulty:** Advanced
**Tools:** Everything
**What you'll learn:** That's up to you

fork the approach. build something I haven't built yet.

a better avatar system. a different class hierarchy. a multiplayer leaderboard. a CLI that generates the dashboard from the terminal. a Discord bot that posts your daily stats. a mobile view. a skill tree that actually branches.

I don't know what you'll build. that's the point.

**The rules:**
- it has to be real. working code, deployed somewhere, doing something
- show your work. the iteration count matters more than the final result
- tag me when you ship. best forks get featured on this page

**Where to start:**
- read the [API docs](/api) — all the data is available
- read the [skill guide](/log/skill-guide) — understand how the system works
- open Cursor. plan mode. go.

---

## The Real Quest

the quests above teach you Python, Pillow, deployment, API design. but the actual skill you're building is something else.

you're learning how to build with AI without losing your ability to think.

plan mode forces you to understand the problem before you write code. ask mode forces you to learn when something breaks instead of just asking for a fix. sub-agents teach you parallel execution when you're ready for it.

the people who get the most from AI aren't the ones who prompt the fastest. they're the ones who understand what they're building well enough to direct the AI effectively.

stop when you fail. read the error. understand it. then fix it.

that's the real progression system.

---

## Built Something?

tag me. best forks get featured.

- [LinkedIn](https://linkedin.com/in/shawntenam) — post your build receipt
- [X / Twitter](https://x.com/shawntenam) — screenshot the dashboard
- [GitHub](https://github.com/shawnla90) — open a PR if you're bold

---

## Implementation Notes

- Shared component: `website/packages/shared/pages/QuestBoardPage.tsx`
- Route pages: `app/log/quests/page.tsx` in shawnos, gtmos, contentos
- Matches SkillGuidePage aesthetic: terminal chrome, card-based layout, section prompts
- Each quest is a card with: title, difficulty badge, tools list, description, AI guidance section
- Difficulty badges: color-coded (green=beginner, yellow=intermediate, red=advanced)
- "how to actually do this with AI" sections are collapsible or visually distinct (muted background, smaller text)
- Navigation: add "quests" to log sub-nav alongside skill-guide and build-your-own
- Back/forward nav at bottom: ← back to the log | build your own →
