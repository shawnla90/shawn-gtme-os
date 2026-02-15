import React from 'react'
import Link from 'next/link'

/* ── Quest data ──────────────────────────────────── */

interface Quest {
  id: number
  title: string
  difficulty: 'Beginner' | 'Beginner-Intermediate' | 'Intermediate' | 'Advanced'
  tools: string[]
  learns: string
  description: string
  aiGuidance: string[]
  cta?: { label: string; href: string }
}

const QUESTS: Quest[] = [
  {
    id: 1,
    title: 'Boot Sequence',
    difficulty: 'Beginner',
    tools: ['Python', 'git', 'Cursor IDE'],
    learns: 'File scanning, git integration, structured JSON output, your first automated workflow',
    description:
      'Set up the daily tracker. Write a Python script that scans your repo, detects what you worked on, and outputs a structured JSON log. Run it. See your work quantified for the first time. This is the foundation everything else builds on. If you skip this, nothing after it makes sense.',
    aiGuidance: [
      'Open Cursor. Start in plan mode. Describe what you want: "a script that scans git commits and file changes from today, classifies them, and outputs JSON."',
      "Review the plan. Don't accept it blindly. Understand the file structure it proposes.",
      'Switch to agent mode. Let it build. When it breaks (it will), read the error before you ask it to fix it.',
      'Run the script. Check the JSON. Iterate.',
    ],
    cta: { label: 'grab the starter prompt', href: '/log/build-your-own' },
  },
  {
    id: 2,
    title: 'First Pixel',
    difficulty: 'Beginner-Intermediate',
    tools: ['Python', 'Pillow', 'Cursor IDE'],
    learns: 'Image generation with code, coordinate systems, font rendering, layout logic',
    description:
      "Render your first Pillow-generated image. Take the JSON from Quest 1 and turn it into a visual dashboard card. Colors, layout, fonts, all generated from data. This is where it clicks. The image isn't a screenshot. It's computed. Every pixel has a reason.",
    aiGuidance: [
      'Ask mode first: "how does Pillow handle text rendering and coordinate placement?"',
      'Plan mode: sketch the layout. Top bar, stat boxes, body grid, footer. Get the structure before the code.',
      'Agent mode: build it. The first render will look wrong. The text will be cut off or placed at (0,0). That\'s normal.',
      "Iterate on coordinates. Pillow's origin is top-left. Y increases downward. If you don't understand this, your layout will fight you.",
    ],
  },
  {
    id: 3,
    title: 'The Progression Layer',
    difficulty: 'Intermediate',
    tools: ['Python', 'JSON', 'math'],
    learns: 'XP formulas, level scaling, state persistence, scoring engines',
    description:
      "Add XP, levels, and titles on top of your tracker. Take daily output scores and convert them into RPG progression. Accumulate XP across days. Trigger level-ups. Unlock titles. This is the bridge between \"I shipped today\" and \"my character evolved.\"",
    aiGuidance: [
      'Plan mode: map out the XP formula, the level curve, the title table. Get the math right on paper before writing code.',
      'Ask mode: "what are the tradeoffs between linear and exponential XP curves?"',
      "Agent mode: build the engine. Test it with fake data first. Edge cases matter. What happens at level 0? What happens at XP = 0? What happens when someone ships nothing for a week?",
    ],
    cta: { label: 'see how I structured mine', href: '/log/skill-guide' },
  },
  {
    id: 4,
    title: 'Ship It Live',
    difficulty: 'Intermediate',
    tools: ['Vercel', 'Next.js', 'API routes', 'Python'],
    learns: 'Deployment, API design, server-rendered images, production debugging',
    description:
      "Deploy your tracker to a live URL. Build an API endpoint that serves your progression data as JSON. Add an OG image route that renders your dashboard card on the fly. Ship it so anyone can see your stats at a URL. This is where it stops being a local script and becomes infrastructure.",
    aiGuidance: [
      'Plan mode: "I have a Python script that generates a dashboard image and a JSON progression file. I want to serve both from a Next.js app deployed on Vercel. Plan the architecture."',
      "The hardest part is bridging Python and Next.js. You have options: pre-generate and serve static, run Python in an API route, or rewrite the renderer in JS/Canvas. Each has tradeoffs. Plan mode is where you figure that out.",
      "Deploy early. Don't wait until it's perfect. Ship the JSON endpoint first. Add the image route after. Iterate in production.",
    ],
  },
  {
    id: 5,
    title: 'Come At Me',
    difficulty: 'Advanced',
    tools: ['Everything'],
    learns: "That's up to you",
    description:
      "Fork the approach. Build something I haven't built yet. A better avatar system. A different class hierarchy. A multiplayer leaderboard. A CLI that generates the dashboard from the terminal. A Discord bot that posts your daily stats. I don't know what you'll build. That's the point.",
    aiGuidance: [
      'It has to be real. Working code, deployed somewhere, doing something.',
      'Show your work. The iteration count matters more than the final result.',
      'Tag me when you ship. Best forks get featured on this page.',
    ],
    cta: { label: 'read the API docs', href: '/api' },
  },
]

const difficultyColor: Record<string, string> = {
  'Beginner': 'text-green-400 border-green-500/30 bg-green-500/10',
  'Beginner-Intermediate': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  'Intermediate': 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  'Advanced': 'text-red-400 border-red-500/30 bg-red-500/10',
}

/* ── Component ───────────────────────────────────── */

export function QuestBoardPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Hero Section */}
      <section className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-4 font-mono text-sm text-gray-500">
            <span className="text-green-400">$</span> ./quest-board --list-available
          </div>
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            Quest Board
          </h1>
          <p className="mb-8 text-xl text-gray-300">
            Challenges for Builders
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-4 font-mono text-sm leading-relaxed text-gray-400">
            <p>
              the API gives you the endpoints. the build-your-own page gives you
              the prompt. this page gives you the challenge.
            </p>
            <p>
              fair warning: these aren&apos;t weekend hacks. you&apos;re going to learn
              Python, Pillow, git, plan mode, ask mode. you&apos;re going to fail.
              you&apos;re going to read errors you don&apos;t understand, debug things that
              worked five minutes ago, and wonder why your image renders at 0x0 pixels.
            </p>
            <p className="text-gray-300">
              that&apos;s the point.
            </p>
            <p>
              every quest here is something I built myself. the daily tracker, the
              dashboard, the progression engine, the avatar. none of it was generated
              in one shot. all of it was planned, tested, broken, fixed, and shipped.
            </p>
            <p className="text-green-400">
              if you want to actually learn how to build with AI, this is where you start.
            </p>
          </div>
        </div>
      </section>

      {/* Quests */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 font-mono text-2xl font-bold text-green-400">
            Available Quests
          </h2>

          <div className="space-y-6">
            {QUESTS.map((quest) => (
              <div
                key={quest.id}
                className="rounded-lg border border-gray-800 bg-gray-900/30 transition-all hover:border-green-500/30"
              >
                {/* Quest header */}
                <div className="border-b border-gray-800 p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-gray-600">
                      QUEST {quest.id}
                    </span>
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-xs font-semibold ${difficultyColor[quest.difficulty]}`}
                    >
                      {quest.difficulty}
                    </span>
                  </div>
                  <h3 className="mb-3 font-mono text-xl font-bold text-gray-100">
                    {quest.title}
                  </h3>

                  {/* Tools + learns */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {quest.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded bg-gray-800 px-2 py-1 font-mono text-xs text-gray-400"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="font-mono text-xs text-gray-500">
                    <span className="text-green-400">LEARN:</span>{' '}
                    {quest.learns}
                  </div>
                </div>

                {/* Quest body */}
                <div className="p-6">
                  <p className="mb-6 font-mono text-sm leading-relaxed text-gray-300">
                    {quest.description}
                  </p>

                  {/* AI Guidance */}
                  <div className="rounded-lg border border-gray-800 bg-black/50 p-5">
                    <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-green-400">
                      How to actually do this with AI
                    </div>
                    <div className="space-y-3">
                      {quest.aiGuidance.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="mt-0.5 flex-shrink-0 font-mono text-xs text-green-400">
                            {i + 1}.
                          </span>
                          <span className="font-mono text-xs leading-relaxed text-gray-400">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  {quest.cta && (
                    <div className="mt-5">
                      <Link
                        href={quest.cta.href}
                        className="inline-block rounded border border-green-500/30 bg-green-500/10 px-4 py-2 font-mono text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/20"
                      >
                        {quest.cta.label} &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Real Quest */}
      <section className="border-t border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            The Real Quest
          </h2>

          <div className="space-y-4 font-mono text-sm leading-relaxed text-gray-400">
            <p>
              the quests above teach you Python, Pillow, deployment, API design.
              but the actual skill you&apos;re building is something else.
            </p>
            <p className="text-gray-300">
              you&apos;re learning how to build with AI without losing your ability
              to think.
            </p>
            <p>
              plan mode forces you to understand the problem before you write code.
              ask mode forces you to learn when something breaks instead of just
              asking for a fix. sub-agents teach you parallel execution when you&apos;re
              ready for it.
            </p>
            <p>
              the people who get the most from AI aren&apos;t the ones who prompt the
              fastest. they&apos;re the ones who understand what they&apos;re building well
              enough to direct the AI effectively.
            </p>
            <p className="text-green-400">
              stop when you fail. read the error. understand it. then fix it.
            </p>
            <p className="text-gray-500">
              that&apos;s the real progression system.
            </p>
          </div>
        </div>
      </section>

      {/* Built Something? */}
      <section className="border-t border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-8 text-center">
            <h2 className="mb-3 font-mono text-xl font-bold text-green-400">
              Built something?
            </h2>
            <p className="mb-6 font-mono text-sm text-gray-400">
              tag me. best forks get featured.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://linkedin.com/in/shawntenam"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-green-500/30 px-4 py-2 font-mono text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/10"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/shawntenam"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-green-500/30 px-4 py-2 font-mono text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/10"
              >
                X / Twitter
              </a>
              <a
                href="https://github.com/shawnla90"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-green-500/30 px-4 py-2 font-mono text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/10"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <section className="border-t border-gray-800 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-between gap-4 px-6">
          <Link
            href="/log"
            className="font-mono text-sm font-semibold text-green-400 hover:text-green-300"
          >
            &larr; back to the log
          </Link>
          <Link
            href="/log/build-your-own"
            className="font-mono text-sm font-semibold text-green-400 hover:text-green-300"
          >
            build your own &rarr;
          </Link>
        </div>
      </section>
    </div>
  )
}
