/**
 * ShawnOS — How-To Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { WikiSection } from './clay-wiki'

/* ── types ─────────────────────────────────────────── */

export type HowToWikiCategory =
  | 'ide-fundamentals'
  | 'cli-tools'
  | 'mcp-servers'
  | 'cost-efficiency'
  | 'security'
  | 'parallel-agents'

export type CanonicalSite = 'shawnos' | 'gtmos' | 'contentos'

export interface HowToWikiEntry {
  id: string
  title: string
  subtitle: string
  category: HowToWikiCategory
  description: string
  keywords: string[]
  sections: WikiSection[]
  related: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  canonicalSite: CanonicalSite
}

/* ── category metadata ────────────────────────────── */

export const HOW_TO_WIKI_CATEGORIES: {
  id: HowToWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'ide-fundamentals',
    label: 'IDE Fundamentals',
    description:
      'How to work with any AI IDE — Cursor, Windsurf, VS Code + Continue. Principles that apply everywhere: context windows, file references, rules, skills, composer vs inline.',
    prompt: '$ cd ~/how-to/ide-fundamentals/',
  },
  {
    id: 'cli-tools',
    label: 'CLI Tools',
    description:
      'Claude Code standalone, Claude Code inside Cursor, OpenClaw, repo-level context engines. The "cron job" stability model.',
    prompt: '$ cd ~/how-to/cli-tools/',
  },
  {
    id: 'mcp-servers',
    label: 'MCP Servers',
    description:
      'What MCPs are, how to add and manage them, stack-specific setups for GTM, content, and full-stack workflows.',
    prompt: '$ cd ~/how-to/mcp-servers/',
  },
  {
    id: 'cost-efficiency',
    label: 'Cost Efficiency',
    description:
      'Model selection strategy, credit management, token budgeting. How to get maximum output without burning through your subscription.',
    prompt: '$ cd ~/how-to/cost-efficiency/',
  },
  {
    id: 'security',
    label: 'Security',
    description:
      'Fact-based security guidance: .gitignore, env vars, context engines, public vs private repo strategy. Debunking the fear.',
    prompt: '$ cd ~/how-to/security/',
  },
  {
    id: 'parallel-agents',
    label: 'Parallel Agents',
    description:
      'How to run parallel agents, orchestration patterns, when to split vs sequence, real examples from the OS.',
    prompt: '$ cd ~/how-to/parallel-agents/',
  },
]

/* ── helpers ──────────────────────────────────────── */

export function getHowToWikiEntry(
  slug: string,
): HowToWikiEntry | undefined {
  return HOW_TO_WIKI_ENTRIES.find((e) => e.id === slug)
}

export function getHowToWikiEntriesByCategory(
  category: HowToWikiCategory,
): HowToWikiEntry[] {
  return HOW_TO_WIKI_ENTRIES.filter((e) => e.category === category)
}

export function getHowToWikiEntriesBySite(
  site: CanonicalSite,
): HowToWikiEntry[] {
  return HOW_TO_WIKI_ENTRIES.filter((e) => e.canonicalSite === site)
}

export function getHowToWikiCrossLinks(
  site: CanonicalSite,
): HowToWikiEntry[] {
  return HOW_TO_WIKI_ENTRIES.filter((e) => e.canonicalSite !== site)
}

/* ── wiki entries ─────────────────────────────────── */

export const HOW_TO_WIKI_ENTRIES: HowToWikiEntry[] = [
  /* ================================================================== */
  /*  IDE FUNDAMENTALS                                                    */
  /* ================================================================== */

  {
    id: 'getting-started-with-cursor',
    title: 'Getting Started with Cursor',
    subtitle: 'Install, configure, and ship your first AI-assisted edit in under 10 minutes',
    category: 'ide-fundamentals',
    description:
      'Step-by-step guide to getting started with Cursor IDE. Installation, initial configuration, your first AI edit, and the mental model that makes everything click.',
    keywords: [
      'cursor IDE setup',
      'getting started cursor',
      'cursor AI IDE tutorial',
      'install cursor IDE',
      'cursor IDE beginner guide',
      'how to use cursor',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'ide-principles-that-transfer',
      'rules-skills-context',
      'claude-code-inside-cursor',
    ],
    sections: [
      {
        heading: 'What Cursor Is',
        type: 'prose',
        content:
          'Cursor is a code editor with AI built into every layer. It is a fork of VS Code, so if you have ever used VS Code, the interface is identical. Same extensions, same shortcuts, same settings. The difference is that Cursor has an AI agent baked in. You can talk to it, give it tasks, and it reads and writes files in your project. Think of it as VS Code with a brilliant co-pilot who can see your entire codebase. You do not need to be a developer to use Cursor. I was not one when I started. I used it to build three websites, 40+ automation skills, and an entire GTM operating system. The tool meets you where you are.',
      },
      {
        heading: 'Installation and First Launch',
        type: 'code',
        content:
          'Download Cursor from cursor.com. Install it like any Mac or Windows app. On first launch, it will ask if you want to import VS Code settings. Say yes if you have existing settings. If this is your first code editor, skip it.\n\nOpen a folder. That is your project. Everything Cursor does happens inside the context of that folder. File > Open Folder, point it at your project directory. If you do not have one yet, create one: mkdir ~/my-project && cd ~/my-project.\n\nThe first thing you will see is the file explorer on the left and an empty editor on the right. That is normal. The magic starts when you open the chat panel (Cmd+L on Mac, Ctrl+L on Windows). That is where you talk to the AI.',
      },
      {
        heading: 'Your First AI Edit',
        type: 'pattern',
        content:
          'Create a file called README.md in your project. Type a few lines of text. Now highlight a sentence and press Cmd+K (inline edit). Type "make this more concise" and hit enter. Watch the AI rewrite your sentence in place. That is the simplest interaction: select text, tell the AI what to do, accept or reject the change.\n\nNext, open the chat panel (Cmd+L). Type "create a Python script that prints hello world and the current date." The agent will create the file, write the code, and you can run it from the terminal. You just went from zero to working code without writing a line yourself.\n\nThis is the loop: describe what you want, let the AI build it, review the output, adjust if needed. Every complex workflow you build later is just this loop repeated with more context.',
      },
      {
        heading: 'The Mental Model',
        type: 'pro-tip',
        content:
          'Cursor is not autocomplete on steroids. It is a teammate. The difference matters. Autocomplete suggests the next word. A teammate understands the whole project and makes decisions. When you give Cursor a task, it reads relevant files, understands the patterns you have established, and produces output that fits your codebase. But like any teammate, it only works well if it has context. A new teammate with no onboarding produces generic work. A teammate who has read your docs, your style guide, and your past work produces excellent work. That is why the next entries in this guide matter so much. Rules, skills, and context configuration are the onboarding that makes Cursor go from helpful to indispensable.',
      },
    ],
  },

  {
    id: 'ide-principles-that-transfer',
    title: 'IDE Principles That Transfer',
    subtitle: 'Learn once, apply everywhere — Cursor, Windsurf, VS Code, and beyond',
    category: 'ide-fundamentals',
    description:
      'Core AI IDE principles that work across Cursor, Windsurf, VS Code with Continue, and future tools. Context windows, file references, inline vs chat, and the patterns that never change.',
    keywords: [
      'AI IDE principles',
      'cursor vs windsurf',
      'AI coding principles',
      'IDE agnostic AI',
      'context window IDE',
      'AI IDE comparison',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'getting-started-with-cursor',
      'rules-skills-context',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'Why Principles Beat Products',
        type: 'prose',
        content:
          'AI IDEs are moving fast. Cursor ships updates weekly. Windsurf launched and iterated rapidly. VS Code added Copilot Chat. New tools appear every month. If you learn Cursor-specific tricks, those break when Cursor changes or when you switch tools. If you learn the underlying principles, those transfer everywhere. The principle of loading context before asking for output works in Cursor, Windsurf, Claude Code, and any future AI tool. The principle of reviewing AI output before accepting works everywhere. The principle of breaking complex tasks into smaller steps works everywhere. Learn the principles. The product-specific buttons are just implementation details.',
      },
      {
        heading: 'Principle 1: Context Window Is Everything',
        type: 'pattern',
        content:
          'Every AI IDE has a context window. That is the total amount of text the AI can see at once. Files you have open, files you reference with @mentions, the chat history, your rules and settings. All of it competes for space in the context window. The principle: put the right information in the context window before you ask for output. In Cursor, you do this with @file references and rules. In Windsurf, with Cascade context. In VS Code + Continue, with file attachments. The mechanism differs. The principle is identical. If the AI does not have the right context, the output will be generic regardless of which IDE you use.',
      },
      {
        heading: 'Principle 2: Inline vs Chat Serves Different Purposes',
        type: 'pattern',
        content:
          'Every AI IDE has two interaction modes. Inline editing (select code, tell the AI to change it) and chat (describe a task, let the AI figure out which files to touch). Inline is surgical. Use it when you know exactly what needs to change and where. Rewrite this function. Fix this bug. Refactor this block. Chat is strategic. Use it when the task spans multiple files or when you need the AI to make decisions about approach. Build a new page. Add authentication. Refactor the data layer. This distinction is the same in every AI IDE. Cursor calls them Cmd+K and Cmd+L. Other tools use different shortcuts. The principle is identical: use inline for precision, chat for scope.',
      },
      {
        heading: 'Principle 3: Review Before You Accept',
        type: 'pro-tip',
        content:
          'AI output is a draft, not a deliverable. Every AI IDE shows you a diff of proposed changes. Green lines are additions. Red lines are deletions. Read the diff before you accept. This feels slow at first. It is not. It is the quality gate that prevents compounding errors. If you accept a bad change in step 1, step 2 builds on it, step 3 extends it, and by step 5 you have a mess that is harder to fix than starting over. The review step takes 10 seconds. The debugging step after accepting bad changes takes 10 minutes. This principle applies to Cursor, Windsurf, VS Code, Claude Code, and every future tool that proposes code changes.',
      },
      {
        heading: 'Principle 4: Specificity Scales',
        type: 'formula',
        content:
          'The quality of AI output is directly proportional to the specificity of your input. "Make the site look better" produces random changes. "Change the hero background to #0a0a0a, set the heading to 3rem font-size with 600 weight, and add 2rem vertical padding" produces exactly what you want. This scales to every interaction in every AI IDE. Specific prompts produce specific output. Vague prompts produce vague output. The formula: describe the WHAT (what to change), the WHERE (which file or component), and the HOW (specific values, patterns, or references). Skip any of those three and the AI fills in the gap with a guess.',
      },
    ],
  },

  {
    id: 'rules-skills-context',
    title: 'Rules, Skills, and Context Files',
    subtitle: 'The three layers that turn a generic AI into your AI',
    category: 'ide-fundamentals',
    description:
      'How to configure rules, build skills, and structure context files for AI IDEs. The three-layer system that makes Claude work like a teammate who has read all your docs.',
    keywords: [
      'cursor rules',
      'AI IDE skills',
      'context files AI',
      'cursor skills setup',
      '.cursorrules',
      'AI IDE configuration',
      'rules skills context engineering',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'getting-started-with-cursor',
      'ide-principles-that-transfer',
      'claude-code-quickstart',
    ],
    sections: [
      {
        heading: 'The Three Layers',
        type: 'prose',
        content:
          'There are three layers of configuration that shape how AI behaves in your IDE. Each layer loads at a different time and serves a different purpose. Rules load automatically based on what files you are editing. They enforce patterns without you thinking about them. Skills load when you invoke them with a slash command or keyword. They execute specific workflows step by step. Context files (like CLAUDE.md) load at the start of every session and set the baseline for everything else. Together, these three layers replace the need to re-explain your preferences, workflows, and constraints every session. You set them up once. They work every time.',
      },
      {
        heading: 'Rules: Automatic Pattern Enforcement',
        type: 'pattern',
        content:
          'Rules are files that load based on glob patterns. When you open a TypeScript file, the TypeScript rule loads. When you edit a blog post, the blog formatting rule loads. You never invoke them manually. They activate based on what you are touching.\n\nIn Cursor, rules live in .cursor/rules/ as .mdc files with frontmatter that specifies the glob pattern. In Claude Code, they live in .claude/rules/ or are defined in the CLAUDE.md file. The format differs. The concept is identical.\n\nGood rules are narrow and specific. "When editing files in content/drafts/, enforce the date-prefix naming convention and voice guide adherence." Bad rules are broad and generic. "Always write good code." Narrow rules produce consistent behavior. Broad rules produce inconsistent results because the AI interprets "good" differently every session.',
      },
      {
        heading: 'Skills: On-Demand Workflow Execution',
        type: 'pattern',
        content:
          'Skills are markdown files that define step-by-step workflows. You invoke them explicitly. Type /deploy and the deploy skill loads. Type /tracker and the tracker skill loads. Each skill contains everything the agent needs to execute that workflow: what files to read, what commands to run, what output to produce, and how to handle errors.\n\nThe skill file is the entire workflow in plain English. You are not writing code. You are writing instructions that an AI agent follows. "Step 1: Check for unstaged changes. Step 2: Stage all modified files. Step 3: Generate a commit message from the diff." The agent reads these steps and executes them.\n\nSkills compound. Every time you use a skill and notice an edge case, you fix the skill. After 20 uses, the skill handles scenarios you never planned for. That is the cast iron skillet pattern. The skill gets more seasoned with use.',
      },
      {
        heading: 'Context Files: Session Baseline',
        type: 'pro-tip',
        content:
          'Context files like CLAUDE.md load before anything else. They set the defaults for every session. Environment information (OS, shell, language preferences), code style rules, and behavioral constraints. Keep context files lean. Only put things here that apply to EVERY session. If a rule only applies when editing blog posts, it belongs in a rule file, not CLAUDE.md. If a workflow only runs when you type /deploy, it belongs in a skill file, not CLAUDE.md.\n\nThe hierarchy: CLAUDE.md sets the floor. Rules adjust for file types. Skills execute specific workflows. Each layer adds context without overloading the context window with irrelevant information. The agent gets exactly what it needs for the current task.',
      },
      {
        heading: 'Common Setup Mistakes',
        type: 'anti-pattern',
        content:
          'Putting everything in CLAUDE.md. Your CLAUDE.md becomes 500 lines and the agent reads all of it every session, even when 90% is irrelevant. Move workflow instructions to skills. Move file-specific patterns to rules. Keep CLAUDE.md under 50 lines.\n\nWriting skills that are too vague. "Deploy the website" is not a skill. It is a wish. Write specific steps with specific commands and specific success criteria.\n\nNot using rules at all. If you find yourself repeating the same instruction across sessions ("use TypeScript, not JavaScript"), that should be a rule. Rules automate the repeated instructions so you never have to type them again.',
      },
    ],
  },

  /* ================================================================== */
  /*  CLI TOOLS                                                           */
  /* ================================================================== */

  {
    id: 'claude-code-quickstart',
    title: 'Claude Code Quickstart',
    subtitle: 'Install Claude Code and run your first terminal agent session',
    category: 'cli-tools',
    description:
      'How to install and use Claude Code as a standalone CLI tool. Installation, first session, CLAUDE.md configuration, and the mental model for terminal-based AI agents.',
    keywords: [
      'claude code install',
      'claude code CLI',
      'claude code tutorial',
      'claude code quickstart',
      'install claude code',
      'claude code terminal',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-inside-cursor',
      'repo-context-engine',
      'getting-started-with-cursor',
    ],
    sections: [
      {
        heading: 'What Claude Code Is',
        type: 'prose',
        content:
          'Claude Code is a terminal-based AI agent. No GUI. No editor. Just your terminal and Claude. You type a task, Claude reads your files, writes code, runs commands, and builds things. It lives in your terminal alongside git, npm, and every other CLI tool you use. The advantage over an IDE-based agent: Claude Code operates at the repo level. It is not scoped to a single file or a single editor tab. It sees your entire project and works across files naturally. The disadvantage: no visual editor, no inline diffs, no click-to-accept. Everything happens through text. For some workflows, that is a feature. For others, you want the IDE. That is why Claude Code inside Cursor exists.',
      },
      {
        heading: 'Installation',
        type: 'code',
        content:
          'Install Claude Code globally via npm:\n\nnpm install -g @anthropic-ai/claude-code\n\nIf you hit permission errors on Mac, fix ownership first:\n\nsudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}\n\nThen run the install again without sudo. After installation, run hash -r to clear the shell cache, or open a new terminal. Verify with: claude --version.\n\nOn first launch, Claude Code will prompt you to authenticate with your Anthropic account. Follow the browser flow. Once authenticated, you are ready. Navigate to any project folder and type claude to start a session.',
      },
      {
        heading: 'Your First Session',
        type: 'pattern',
        content:
          'Navigate to your project folder. Type claude. You are now in an interactive session. Claude can see every file in the current directory and subdirectories.\n\nTry: "Read the README and summarize what this project does." Claude will read the file and give you a summary. That verifies it can see your project.\n\nTry: "Create a Python script called hello.py that prints the current date and time." Claude will create the file and write the code. You can run it with python hello.py.\n\nTry: "What files are in this project and how are they organized?" Claude will scan the directory tree and describe the structure. This is useful when you are exploring an unfamiliar codebase.\n\nThe interaction model: you describe intent, Claude executes. You review output, Claude adjusts. Each task builds on the context of the session.',
      },
      {
        heading: 'CLAUDE.md for CLI Sessions',
        type: 'pro-tip',
        content:
          'Create a CLAUDE.md file in your project root. Claude Code reads this file at the start of every session. Put your environment defaults here: OS, shell, primary languages, package management rules, code style preferences. Keep it short. Under 50 lines. Everything in CLAUDE.md consumes context window space for the entire session.\n\nYou can also create a ~/.claude/CLAUDE.md for global defaults that apply to every project. Project-level CLAUDE.md overrides global settings. This lets you set universal preferences (language defaults, git rules) globally while keeping project-specific settings in each repo.',
      },
      {
        heading: 'Shift+Tab: Plan Before You Execute',
        type: 'pattern',
        content:
          'Press Shift+Tab in a Claude Code session to toggle between plan mode and execution mode. Plan mode is read-only. Claude explores, reads files, and maps out steps without changing anything. Execution mode is where Claude actually writes files and runs commands.\n\nThe workflow: start in plan mode for complex tasks. Let Claude analyze the codebase, identify the files involved, and propose a step-by-step plan. Review the plan. If it looks right, switch to execution mode and tell Claude to proceed. If it looks wrong, adjust the plan before any code gets written.\n\nThis is the single most underused feature of Claude Code. People jump straight to execution and wonder why Claude makes wrong assumptions. Plan mode prevents those assumptions by forcing exploration before action.',
      },
    ],
  },

  {
    id: 'claude-code-inside-cursor',
    title: 'Claude Code Inside Cursor',
    subtitle: 'Run Claude Code as a terminal agent inside your IDE',
    category: 'cli-tools',
    description:
      'How to use Claude Code inside the Cursor IDE terminal. Combining the power of a CLI agent with the visual feedback of an editor. When to use the terminal agent vs the IDE agent.',
    keywords: [
      'claude code cursor',
      'claude code in cursor',
      'cursor terminal agent',
      'claude code IDE',
      'cursor CLI agent',
      'claude code inside cursor tutorial',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'getting-started-with-cursor',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'Why Run Claude Code Inside Cursor',
        type: 'prose',
        content:
          'Cursor has its own AI agent. Claude Code is a separate AI agent. Running Claude Code inside the Cursor terminal gives you both. The Cursor agent handles inline edits, chat-based file changes, and visual diffs. Claude Code in the terminal handles repo-wide tasks, complex multi-file operations, and workflows that need the CLI. You pick the right tool for the task. Simple inline edit? Cmd+K in Cursor. Build a new feature across 5 files? Claude Code in the terminal. The terminal is already there in Cursor. You are just running a different agent in it.',
      },
      {
        heading: 'Setup',
        type: 'code',
        content:
          'If Claude Code is already installed globally (npm install -g @anthropic-ai/claude-code), it works inside the Cursor terminal immediately. Open a terminal in Cursor (Ctrl+` or Terminal > New Terminal). Type claude. You are now running Claude Code inside Cursor.\n\nYour CLAUDE.md file applies to both agents. The Cursor agent reads it. Claude Code reads it. Rules files in .cursor/rules/ only apply to the Cursor agent. Skills in .cursor/skills/ apply to the Cursor agent. Claude Code has its own skill and rule system. Keep this separation in mind when configuring.\n\nPro tip: open a split terminal. One pane for Claude Code, one for manual commands. You can run Claude Code on a complex task in one pane while running git status or checking logs in the other.',
      },
      {
        heading: 'When to Use Which Agent',
        type: 'pattern',
        content:
          'Use the Cursor agent (Cmd+L chat) for tasks scoped to one or a few files. Editing a component, fixing a bug in a specific function, refactoring a single module. The visual diff makes reviewing easy.\n\nUse Claude Code (terminal) for tasks that span the whole repo. Building a new feature that creates multiple files. Running a workflow that involves git operations, API calls, and file generation. Anything where the terminal output matters.\n\nUse both in parallel for maximum speed. The Cursor agent edits the frontend while Claude Code in the terminal handles the data layer. They do not conflict because they work on different files. This is the poor man\'s parallel agent setup. Two agents, one IDE, different scopes.',
      },
      {
        heading: 'The Cron Job Stability Model',
        type: 'pro-tip',
        content:
          'Claude Code is more stable for long-running, multi-step tasks than IDE chat. The Cursor agent works within the editor\'s lifecycle. If the editor refreshes, the context can shift. Claude Code in the terminal maintains a persistent session. It does not lose context mid-task.\n\nThis makes Claude Code ideal for tasks that feel like cron jobs: sequential, multi-step workflows that need to run to completion without interruption. Deploy scripts, data migrations, bulk file operations, campaign setup workflows. If the task has more than 5 steps and you do not want to babysit it, run it in Claude Code, not the IDE agent.',
      },
    ],
  },

  {
    id: 'openclaw-setup',
    title: 'OpenClaw Setup',
    subtitle: 'Open-source alternative to Claude Code for budget-conscious builders',
    category: 'cli-tools',
    description:
      'How to install and configure OpenClaw as an open-source Claude Code alternative. Setup, model configuration, and when OpenClaw makes sense vs the official CLI.',
    keywords: [
      'openclaw setup',
      'openclaw install',
      'open source claude code',
      'claude code alternative',
      'openclaw tutorial',
      'openclaw AI CLI',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'claude-code-inside-cursor',
      'credit-management',
    ],
    sections: [
      {
        heading: 'Status: February 2026',
        type: 'anti-pattern',
        content:
          'OpenClaw is actively evolving and so is the ecosystem around it. The information on this page reflects my hands-on experience as of February 20, 2026. Provider integrations, pricing, and OAuth support are changing fast. What works today may change next week. I will keep this page updated as things shift, but treat every recommendation here as a snapshot in time, not a permanent answer. If something feels off when you try it, check the OpenClaw docs and provider changelogs first.',
      },
      {
        heading: 'What OpenClaw Is',
        type: 'prose',
        content:
          'OpenClaw is an open-source CLI tool that replicates much of the Claude Code experience but lets you bring your own API key and choose your model. Instead of paying for the Claude Code subscription, you pay per token through your own Anthropic API key. For light usage, this can be cheaper. For heavy usage, the subscription is usually the better deal. The interface is similar: navigate to a project, start a session, describe tasks, and the agent reads and writes files. The key difference is flexibility. OpenClaw supports multiple model providers, so you can use cheaper models for simple tasks and expensive models for complex ones.',
      },
      {
        heading: 'OAuth vs API Key: The Cost Reality',
        type: 'pro-tip',
        content:
          'This is the single most important decision when setting up OpenClaw: how you authenticate determines how fast you burn money. There are two paths. API key means you pay per token, directly from your wallet, every single call. OAuth means you authenticate through a provider\'s existing subscription and use their models within your plan limits.\n\nThe API key path will drain your wallet. I learned this the hard way. Running Opus 4.6 through an Anthropic API key, I was spending over $50 a day for three consecutive days. That is not a typo. Heavy agentic usage with a top-tier model burns through tokens at a rate that makes your credit card cry. If you are experimenting, exploring, iterating on prompts, or running multi-step agent workflows, the tokens add up astronomically.\n\nThe free and cheap models available through API keys are not great either. You save money but the output quality drops so much that you end up re-running tasks, which costs more time and sometimes more tokens than just using the good model once.\n\nMy current recommendation as of February 2026: set up OpenClaw with ChatGPT via OAuth. OpenAI supports OAuth connections with OpenClaw, which means you authenticate through your existing ChatGPT subscription instead of paying per token. You get access to GPT models within your plan. It is not perfect, but it is dramatically more cost-effective for daily driver usage.\n\nAnthropic, unfortunately, does not currently support OAuth with OpenClaw. They have said no to this integration path. That means if you want to use Claude models through OpenClaw, you are stuck on the API key path with per-token billing. This may change in the future, but as of today, that is the reality. I will update this page if and when Anthropic opens up OAuth support.',
      },
      {
        heading: 'Installation',
        type: 'code',
        content:
          'Install via npm:\n\nnpm install -g openclaw\n\nSet your API key as an environment variable:\n\nexport ANTHROPIC_API_KEY=your-key-here\n\nAdd that to your .zshrc or .bashrc so it persists across sessions. Navigate to any project folder and type openclaw to start.\n\nFor alternative model providers, set the appropriate environment variable. OpenClaw supports OpenAI, Anthropic, and local model endpoints. Check the OpenClaw docs for provider-specific configuration.',
      },
      {
        heading: 'When OpenClaw Makes Sense',
        type: 'pattern',
        content:
          'OpenClaw makes sense in three scenarios. First, you want to try the CLI agent workflow without committing to a Claude Code subscription. Install OpenClaw, use your existing API key, and see if terminal-based agents fit your workflow.\n\nSecond, you want model flexibility. OpenClaw lets you switch between providers and models per session. Use a cheap model for scanning files and a capable model for writing code. Claude Code locks you into Anthropic models.\n\nThird, you are building automation that calls the CLI programmatically. OpenClaw\'s open-source nature means you can inspect the source, modify behavior, and integrate it into custom pipelines.\n\nOpenClaw does NOT make sense if you are a heavy daily user. The Claude Code subscription includes generous usage limits. Per-token pricing at heavy volumes costs more than the subscription.',
      },
      {
        heading: 'Limitations vs Claude Code',
        type: 'anti-pattern',
        content:
          'OpenClaw replicates the core experience but misses some Claude Code features. The tool integration is less polished. MCP server support may lag behind. The session management is simpler. And you lose the Anthropic-hosted infrastructure that handles authentication, rate limiting, and model routing.\n\nThe biggest gap: Claude Code has deep integration with the Anthropic model ecosystem. Features like extended thinking, tool use optimization, and context window management are tuned specifically for Claude models. OpenClaw works with Claude models through the API, but the integration is not as tight.\n\nStart with OpenClaw to learn the workflow. Upgrade to Claude Code when the terminal agent becomes a core part of your daily process.',
      },
    ],
  },

  {
    id: 'repo-context-engine',
    title: 'Repo as Context Engine',
    subtitle: 'Your repo is not just code storage — it is the brain your AI reads from',
    category: 'cli-tools',
    description:
      'How to structure your repository as a context engine for AI agents. Folder taxonomy, naming conventions, CLAUDE.md, skills, rules, and the compounding effect of organized knowledge.',
    keywords: [
      'repo context engine',
      'AI context repository',
      'context engineering repo',
      'repo structure AI',
      'AI repo organization',
      'context repo setup',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'rules-skills-context',
      'constraints-and-context-engines',
    ],
    sections: [
      {
        heading: 'The Repo Is the Context',
        type: 'prose',
        content:
          'Most people think of a repo as code storage. Files go in. Version control tracks changes. That is half the story. A repo is also the primary context source for every AI agent that touches your project. When Claude starts a session, it reads your repo. When you reference a file with @, it loads that file into the context window. When a skill runs, it reads files from the repo. The repo IS the context engine. How you organize it determines how well AI works for you. A messy repo produces messy AI output. A structured repo produces structured AI output. The repo structure is context engineering.',
      },
      {
        heading: 'The Taxonomy',
        type: 'pattern',
        content:
          'Every folder should have a clear purpose. Every file should have a predictable name. When Claude needs partner research, it looks in partners/{name}/research/. When it needs a skill, it looks in .cursor/skills/{name}/SKILL.md. When it needs a content draft, it looks in content/drafts/.\n\nUse date prefixes for content: 2026-02-18_topic-name.md. This sorts chronologically and tells Claude when something was written. Use lowercase slugs for folders: partners/acme/, skills/deploy/. Use SKILL.md (uppercase) for skill files so they stand out in directory listings.\n\nThe taxonomy is not about aesthetics. It is about predictability. Predictable structure means Claude spends zero time searching and zero time guessing file paths. It goes directly to the file it needs because the structure is always the same.',
      },
      {
        heading: 'What Goes Where',
        type: 'formula',
        content:
          'CLAUDE.md in the root: environment defaults, language preferences, code style. Under 50 lines.\n\n.cursor/skills/ or skills/: one SKILL.md per workflow. Deploy, tracker, content publishing, partner onboarding.\n\n.cursor/rules/: file-specific patterns. Blog formatting rules, TypeScript conventions, voice enforcement.\n\ncontent/: everything you produce. Drafts, published posts, images, indexes.\n\npartners/ or clients/: per-entity folders with research, prompts, workflows, resources.\n\nworkflows/: content indexes, pipeline tracking, editorial calendars.\n\ndata/: generated assets, stats, exports. Usually gitignored for sensitive data.\n\nscripts/: Python automation, batch processing, data transformations. Usually gitignored.\n\nThis is not the only valid structure. But whatever structure you choose, be consistent. One structure across every partner, every content type, every workflow. Consistency is what makes the context engine work.',
      },
      {
        heading: 'The Compounding Effect',
        type: 'pro-tip',
        content:
          'A context repo compounds. Every file you add makes future AI sessions better. A voice guide you wrote in month one makes every content piece from month two onward sound like you. A partner research folder you created for client A becomes the template for clients B through Z. A skill you wrote for deploying one site evolves into a skill that deploys three sites with error handling and verification.\n\nMy repo started with a CLAUDE.md and three skills. Six months later it has 40+ skills, a full voice system, partner workflows, an RPG progression system, and automated dashboards. I did not set aside time to build the context engine. I built it by doing the work and capturing the patterns. Every day the repo gets better. Every day AI works better with it. That is the compounding effect.',
      },
    ],
  },

  /* ================================================================== */
  /*  MCP SERVERS                                                         */
  /* ================================================================== */

  {
    id: 'what-are-mcps',
    title: 'What Are MCPs?',
    subtitle: 'Model Context Protocol explained — the bridge between AI and your tools',
    category: 'mcp-servers',
    description:
      'What Model Context Protocol servers are, how they work, and why they change everything about AI-assisted workflows. The bridge that turns Claude from a code editor into an operating system.',
    keywords: [
      'what are MCP servers',
      'model context protocol explained',
      'MCP tutorial',
      'MCP servers beginner',
      'what is MCP',
      'MCP AI tools',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'mcp-gtm-stack',
      'mcp-content-stack',
      'managing-mcp-servers',
    ],
    sections: [
      {
        heading: 'The Problem MCPs Solve',
        type: 'prose',
        content:
          'Without MCP, your AI agent is trapped inside the code editor. It can read files, write code, and run terminal commands. That is it. It cannot see your Slack messages. It cannot pull leads from your CRM. It cannot push a draft to your newsletter platform. It cannot check your campaign analytics. Every time you need information from an external tool, you have to manually copy it and paste it into the chat. That is the problem. MCP is the solution. Model Context Protocol servers are bridges between your AI agent and your production tools. Each MCP server connects to one external tool and gives the agent a set of actions it can take. Read a Slack channel. Export HeyReach leads. Create a Substack draft. Deploy to Vercel. The agent can now reach outside the editor and interact with the real world.',
      },
      {
        heading: 'How They Work',
        type: 'pattern',
        content:
          'An MCP server is a small process that runs in the background when your IDE starts. It connects to an external service using API credentials you provide. It exposes a set of tools (actions) that the AI agent can call.\n\nWhen you tell Claude "check the partner Slack channel," Claude sees the Slack MCP server in its tool list, calls the appropriate tool (read channel messages), and gets the results back. You never interact with the MCP server directly. You interact with Claude. Claude interacts with the MCP server. The MCP server interacts with Slack.\n\nThink of it as giving Claude hands. Without MCP, Claude can think and speak. With MCP, Claude can reach out and do things in the tools you already use.',
      },
      {
        heading: 'The Setup Pattern',
        type: 'code',
        content:
          'Every MCP server follows the same setup pattern:\n\n1. Get an API key from the external tool (Slack bot token, HeyReach API key, etc.)\n2. Add a config entry to your MCP config file (.cursor/mcp.json for Cursor, ~/.claude/mcp.json for Claude Code)\n3. The config specifies the server name, the command to start it, and the API key as an environment variable\n4. Restart your editor. The server starts automatically.\n5. Test it by asking Claude to perform an action with that tool.\n\nThe config format is JSON. Each server gets a block with a command (usually npx), arguments (the npm package name), and environment variables (your API keys). You never commit this file to Git because it contains secrets. Add it to .gitignore.',
      },
      {
        heading: 'Start With Two or Three',
        type: 'pro-tip',
        content:
          'Do not install 15 MCP servers on day one. Each server adds startup time and consumes resources. Start with the two or three tools you use most. If you run outbound campaigns, start with your outreach tool (Instantly or HeyReach) and Slack. If you publish content, start with your publishing platform (Typefully or Substack) and your analytics tool.\n\nBuild workflows around those first MCPs. Get comfortable with the pattern of telling Claude to interact with external tools. Then add more as your workflows demand it. My setup grew organically. I started with GitHub and Slack. Then added HeyReach. Then Substack. Then Browserbase. Each one was added because a specific workflow needed it, not because I was collecting servers.',
      },
    ],
  },

  {
    id: 'mcp-gtm-stack',
    title: 'MCP for the GTM Stack',
    subtitle: 'Connect your outbound, CRM, and revenue tools to your AI agent',
    category: 'mcp-servers',
    description:
      'How to set up MCP servers for go-to-market workflows. Instantly for email, HeyReach for LinkedIn, Slack for comms, Google Sheets for data, and Firecrawl for enrichment.',
    keywords: [
      'MCP GTM stack',
      'MCP outbound tools',
      'MCP sales tools',
      'MCP instantly',
      'MCP heyreach',
      'MCP revenue operations',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'what-are-mcps',
      'mcp-content-stack',
      'managing-mcp-servers',
    ],
    sections: [
      {
        heading: 'The GTM MCP Stack',
        type: 'prose',
        content:
          'If you run pipeline, outbound, or revenue operations, your core MCP stack connects your campaign tools to your AI agent. The goal is zero tab-switching. Instead of jumping between Instantly, HeyReach, Slack, and Sheets to check campaign status, you ask Claude. Claude pulls the data, analyzes it, and gives you a summary. The GTM stack is not about connecting everything. It is about connecting the tools that sit in your daily workflow loop: the ones you check repeatedly, export from manually, and copy-paste between.',
      },
      {
        heading: 'Instantly: Email Campaigns',
        type: 'pattern',
        content:
          'Instantly manages email sequences, deliverability, and domain warming. The MCP server lets Claude check campaign analytics, pull reply lists, manage leads, and monitor deliverability scores without opening the Instantly dashboard.\n\nSetup: Get your API key from Instantly settings. Add it to your MCP config. The server exposes tools for listing campaigns, fetching analytics, and managing leads.\n\nReal workflow: /instantlyreplies_acme pulls all replies from the Acme campaign, saves them to the partner resources folder, and flags positive replies for follow-up. Zero manual export. Zero CSV downloads. Claude reads the replies and categorizes them.',
      },
      {
        heading: 'HeyReach: LinkedIn Automation',
        type: 'pattern',
        content:
          'HeyReach manages LinkedIn connection requests, messaging sequences, and campaign analytics. The MCP server lets Claude export accepted connections, pull campaign stats, and check message status.\n\nSetup: API key from the HeyReach dashboard. HTTP-based MCP server.\n\nReal workflow: /heyreach-export accepted exports all accepted connections from a campaign as a CSV. /heyreach-conversations pulls the full LinkedIn message history for accepted connections. The handoff workflow exports both accepted and unaccepted leads, runs deep research on accepted ones, and routes everything to the caller with a Slack notification.',
      },
      {
        heading: 'Slack, Sheets, and Firecrawl',
        type: 'pattern',
        content:
          'Slack MCP reads channels, sends messages, and searches history. Essential for partner comms. The /slacksync skill pulls the full channel history and extracts action items, decisions, and deliverables into a structured markdown file.\n\nGoogle Sheets MCP reads and writes spreadsheets. Bridges your repo with team data. Push enrichment results to a shared sheet. Pull lead lists for campaign setup.\n\nFirecrawl MCP scrapes websites as clean markdown. Critical for enrichment workflows. Pull a prospect\'s website, extract positioning, identify pain points. Claude processes the raw HTML into structured data your qualification prompts can use.\n\nEach of these serves a specific purpose in the GTM loop: Slack for communication, Sheets for shared data, Firecrawl for research.',
      },
      {
        heading: 'The Full Loop',
        type: 'formula',
        content:
          'The GTM MCP stack creates a closed loop. Firecrawl scrapes prospect websites for research. The research feeds into Clay qualification prompts. Qualified leads route to Instantly (email) or HeyReach (LinkedIn). Reply data flows back through the MCP. Slack notifications alert the team. Sheets track the pipeline.\n\nEvery step in this loop used to require manual work: export, download, upload, copy, paste. With MCPs, Claude handles the data movement. You handle the strategy and the conversations. The MCP stack does not replace your judgment. It replaces the grunt work between your judgment calls.',
      },
    ],
  },

  {
    id: 'mcp-content-stack',
    title: 'MCP for the Content Stack',
    subtitle: 'Connect your publishing, scheduling, and distribution tools',
    category: 'mcp-servers',
    description:
      'How to set up MCP servers for content creation workflows. Typefully for social scheduling, Substack for newsletters, ElevenLabs for audio, and Notion for knowledge sync.',
    keywords: [
      'MCP content stack',
      'MCP typefully',
      'MCP substack',
      'MCP content creation',
      'MCP ElevenLabs',
      'MCP content workflow',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'contentos',
    related: [
      'what-are-mcps',
      'mcp-gtm-stack',
      'managing-mcp-servers',
    ],
    sections: [
      {
        heading: 'The Content MCP Stack',
        type: 'prose',
        content:
          'If you publish content across platforms, your MCP stack connects your repo to your publishing tools. The goal is draft-to-publish without leaving the IDE. Write a post in markdown. Finalize it with a skill. Push it to the platform. All from the same terminal session. No switching tabs. No copying and pasting. No reformatting for each platform. The content MCP stack turns your repo into a publishing pipeline.',
      },
      {
        heading: 'Typefully: Social Publishing',
        type: 'pattern',
        content:
          'Typefully schedules and publishes posts to LinkedIn and X. The MCP server lets Claude push finalized drafts directly to your Typefully queue.\n\nThe workflow: write a LinkedIn post in content/drafts/. Run /finalcopy to normalize the voice, strip formatting, and produce platform-ready text. The skill pushes the final copy to Typefully as a draft. You review it in the Typefully editor and schedule it.\n\nThis eliminates the copy-paste step between your repo and your publishing queue. The draft goes from markdown to scheduled post in one command. Voice normalization, platform formatting, and queue placement all happen automatically.',
      },
      {
        heading: 'Substack: Newsletter Publishing',
        type: 'pattern',
        content:
          'Substack MCP creates draft posts on your Substack publication. The /finalsubstack skill normalizes the voice, extracts publishable content, saves it locally, and creates the draft on Substack.\n\nThe workflow: write a newsletter draft in content/substack/drafts/. Iterate with Claude until it sounds right. Run /finalsubstack. Claude formats the post, creates the draft on Substack, and generates LinkedIn and X cross-promo snippets. You open Substack, review the draft, add images if needed, and publish.\n\nThe MCP handles the entire handoff. You never copy 2,000 words from your editor to the Substack web editor. Claude does it. And because the skill also generates cross-promo snippets, your distribution plan is ready before the post goes live.',
      },
      {
        heading: 'ElevenLabs and Notion',
        type: 'pattern',
        content:
          'ElevenLabs MCP generates audio from text. Turn a blog post into a voiceover. Create TikTok narration from a script. Generate voice tests for different character profiles. The MCP handles text-to-speech, voice cloning, and audio isolation without leaving the IDE.\n\nNotion MCP syncs repo content to a Notion knowledge base. The /notionsync skill pushes skills, workflows, and content indexes to Notion pages so your team or audience can browse them in a visual interface. The repo stays the source of truth. Notion is the presentation layer.\n\nBoth serve the same purpose: extending your content beyond markdown files. ElevenLabs turns text into audio. Notion turns text into visual pages. The repo is the engine. MCPs are the output channels.',
      },
      {
        heading: 'The Content Pipeline',
        type: 'formula',
        content:
          'The content MCP stack creates a pipeline: Idea > Draft > Finalize > Publish > Distribute.\n\nIdea capture: /ideabank parks ideas with tags and cross-references.\nDraft: write in content/drafts/ with Claude assistance and voice guide enforcement.\nFinalize: /finalcopy or /finalsubstack normalizes voice, formats for platform, and pushes to the publishing tool.\nPublish: review in the platform editor, schedule or publish.\nDistribute: cross-promo snippets auto-generate for other platforms.\n\nEach step in this pipeline used to be a manual handoff. Open a new tab. Copy the text. Reformat it. Paste it. Schedule it. With MCPs, the handoffs are automated. You focus on the writing and the strategy. The pipeline handles the mechanics.',
      },
    ],
  },

  {
    id: 'managing-mcp-servers',
    title: 'Managing MCP Servers',
    subtitle: 'Add, debug, update, and organize your MCP server configurations',
    category: 'mcp-servers',
    description:
      'How to manage MCP server configurations across Cursor and Claude Code. Adding new servers, debugging connection issues, rotating API keys, and keeping your setup clean.',
    keywords: [
      'manage MCP servers',
      'MCP server configuration',
      'MCP debugging',
      'MCP API keys',
      'MCP server management',
      'MCP troubleshooting',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'what-are-mcps',
      'mcp-gtm-stack',
      'mcp-content-stack',
    ],
    sections: [
      {
        heading: 'Where Configs Live',
        type: 'code',
        content:
          'MCP server configurations live in JSON files. The location depends on your tool:\n\nCursor (project-level): .cursor/mcp.json in your project root\nCursor (global): ~/.cursor/mcp.json in your home directory\nClaude Code: ~/.claude/mcp.json or project-level .claude/mcp.json\n\nProject-level configs override global configs. Use global configs for servers you need in every project (GitHub, Slack). Use project-level configs for servers specific to one project.\n\nBoth files share the same format: a JSON object with a "mcpServers" key containing one block per server. Each block has a "command" (how to start the server), "args" (arguments to the command), and "env" (environment variables, usually API keys).',
      },
      {
        heading: 'Adding a New Server',
        type: 'pattern',
        content:
          'The /addmcp skill automates this, but understanding the manual process helps when things break.\n\n1. Find the npm package for the MCP server. Most are published on npm with names like @company/mcp-server or mcp-server-toolname.\n2. Get the API key from the tool\'s settings or dashboard.\n3. Add a new block to your mcp.json with the server name, command (usually "npx"), args (the package name with "-y" flag), and env (your API key).\n4. Restart your editor so it picks up the new config.\n5. Test by asking Claude to use the tool. "List my Slack channels" or "Show my HeyReach campaigns."\n\nIf the test fails, the issue is almost always the API key (wrong or expired) or the package name (typo or wrong version).',
      },
      {
        heading: 'Debugging Connection Issues',
        type: 'pro-tip',
        content:
          'When an MCP server stops working, check these in order:\n\n1. API key: Has it expired? Did you rotate it? Check the tool\'s dashboard.\n2. Config syntax: Is the JSON valid? A missing comma or bracket breaks the entire config file, not just one server.\n3. Package availability: Can you run the npx command manually in the terminal? If it fails there, it fails in the IDE too.\n4. Network: Is the external service up? Check the tool\'s status page.\n5. Rate limits: Did you hit the API rate limit? Some services throttle after too many requests. Add delays between calls or reduce batch sizes.\n\nThe most common issue by far is expired API keys. If a server worked yesterday and fails today, check the key first. Save yourself 20 minutes of debugging by starting with the obvious.',
      },
      {
        heading: 'Keeping Configs Clean',
        type: 'anti-pattern',
        content:
          'Do not add MCP servers you do not actively use. Each server adds startup time. Some servers run background processes that consume memory. If you are not using the Figma MCP daily, remove it. You can always add it back in 30 seconds.\n\nDo not hardcode API keys in files that get committed. The mcp.json file should be in your .gitignore. If you share a project with collaborators, create an mcp.json.example with placeholder values and add the real mcp.json to .gitignore.\n\nDo not install every MCP server from a "top 50 MCP servers" list. Install the ones that remove friction from workflows you already do. The value of an MCP server is measured by how many manual steps it eliminates from your daily process. Zero manual steps eliminated means zero value, regardless of how cool the tool is.',
      },
    ],
  },

  /* ================================================================== */
  /*  COST EFFICIENCY                                                     */
  /* ================================================================== */

  {
    id: 'model-selection-strategy',
    title: 'Model Selection Strategy',
    subtitle: 'Match the model to the task — stop overpaying for simple work',
    category: 'cost-efficiency',
    description:
      'How to choose between AI models based on task complexity and cost. When to use fast models vs capable models. The framework for maximizing output quality while minimizing spend.',
    keywords: [
      'AI model selection',
      'claude model cost',
      'opus vs sonnet',
      'AI model strategy',
      'choose AI model task',
      'model selection cost optimization',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'credit-management',
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
    ],
    sections: [
      {
        heading: 'The Core Principle',
        type: 'prose',
        content:
          'Not every task needs the most capable model. Using a capable model (Opus tier) on a simple reformatting task is like hiring a senior architect to paint a wall. Using a fast model (Sonnet tier) on a complex architecture decision is like hiring a junior intern to design the building. The core principle: match the model to the task. Simple tasks get fast models. Complex tasks get capable models. Everything in between is a judgment call, and the framework below helps you make it.',
      },
      {
        heading: 'The Matching Framework',
        type: 'pattern',
        content:
          'Fast models work for: reformatting content, scanning files, simple code edits, copy-paste-and-adapt tasks, straightforward data transformations, building pages that mirror existing patterns. These tasks have clear inputs, clear outputs, and low ambiguity.\n\nCapable models work for: architecture decisions, complex debugging, creative writing with nuanced voice, multi-step reasoning chains, research synthesis, and anything where the agent needs to make judgment calls. These tasks have ambiguity, tradeoffs, and require the model to think deeply.\n\nThe dividing line: does this task require judgment or is it mechanical? Judgment tasks get the capable model. Mechanical tasks get the fast model. If you are unsure, start with the fast model. If the output is bad, escalate. It is cheaper to try fast and upgrade than to default to expensive on everything.',
      },
      {
        heading: 'Model Selection for Parallel Agents',
        type: 'pro-tip',
        content:
          'When running parallel agents, assign models per task. The orchestrating agent uses the capable model because it needs to reason about dependencies, context, and sequencing. Sub-agents doing straightforward work (mirror an existing page, update a config, run a build check) use fast models. Sub-agents doing heavy creative work (writing 17 wiki entries, architecting a new feature) use the capable model.\n\nThis is not about being cheap. It is about being efficient. A fast model that completes in 30 seconds on a simple task is better than a capable model that takes 2 minutes on the same task with identical quality. Speed compounds across parallel agents. Five fast agents on simple tasks finish before one capable agent on the same five tasks.',
      },
      {
        heading: 'The Daily Tracking Method',
        type: 'formula',
        content:
          'Track your model usage for one week. At the end of each day, note which tasks used which model and whether the output quality was sufficient. Look for two patterns:\n\n1. Capable model sessions where a fast model would have produced the same quality. These are overspend. Switch those task types to fast models.\n2. Fast model sessions where the output was bad and you had to redo the work. These are false economy. Switch those task types to capable models.\n\nAfter one week, you will have a clear map of which tasks need which model. Apply that map going forward. Revisit quarterly as models improve (today\'s capable model becomes tomorrow\'s fast model).',
      },
    ],
  },

  {
    id: 'credit-management',
    title: 'Credit and Token Management',
    subtitle: 'Understand what you are spending and where the tokens go',
    category: 'cost-efficiency',
    description:
      'How to manage AI credits and tokens across Cursor, Claude Code, and API usage. Understanding what costs money, where tokens go, and practical strategies to maximize your budget.',
    keywords: [
      'AI credit management',
      'claude tokens cost',
      'cursor credits',
      'AI token budget',
      'claude code cost',
      'manage AI spend',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'model-selection-strategy',
      'parallel-agent-patterns',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'What Costs Money',
        type: 'prose',
        content:
          'Every AI interaction costs tokens. Tokens are roughly four characters of text. Every file Claude reads costs tokens (input). Every response Claude generates costs tokens (output). Every tool call Claude makes costs tokens (input and output). The context window is the total token budget for a single interaction. Files you load, chat history, rules, skills, system instructions — all of it competes for tokens. Understanding this changes how you interact with AI. Long chat histories burn tokens on context that might not be relevant anymore. Loading 10 files when you need 2 wastes tokens on irrelevant context. A 500-line CLAUDE.md consumes tokens every single session.',
      },
      {
        heading: 'Where Tokens Go',
        type: 'pattern',
        content:
          'System instructions and configuration: CLAUDE.md, rules, skill files that load automatically. This is your baseline cost per session.\n\nFile reads: every file the agent reads to understand your codebase. Larger files cost more. Reading a 2,000-line data file costs more than reading a 50-line config.\n\nChat history: every previous message in the conversation. Long conversations accumulate context. Eventually the context window fills and older messages get truncated.\n\nAgent output: code generation, explanations, tool calls. Longer outputs cost more tokens.\n\nThe biggest token sinks are usually file reads (loading large files) and chat history (long conversations). Keep files focused and start new sessions for new tasks rather than continuing a single session for hours.',
      },
      {
        heading: 'Practical Strategies',
        type: 'pro-tip',
        content:
          'Start new sessions for new tasks. A session about deploying your website does not need the chat history from your earlier session about writing a blog post. Fresh context means fewer wasted tokens.\n\nKeep CLAUDE.md lean. Every line in CLAUDE.md costs tokens in every session. Move workflow instructions to skills (loaded on demand) and file patterns to rules (loaded conditionally).\n\nReference specific files instead of asking Claude to search. Saying "read website/packages/shared/data/clay-wiki.ts" costs less than saying "find the clay wiki data file" because the search requires reading multiple files.\n\nUse fast models for simple tasks. Fast models cost roughly 3-5x less per token than capable models. If the task is mechanical, the cheaper model produces identical results.',
      },
      {
        heading: 'The 80/20 of Token Budget',
        type: 'formula',
        content:
          'Eighty percent of your token budget goes to three things: file reads, chat history, and system context. Optimizing those three is the highest-leverage move.\n\nFile reads: be specific about which files to load. Do not say "read the entire data folder." Say "read how-to-wiki.ts."\n\nChat history: start fresh sessions for new topics. One focused session beats one marathon session.\n\nSystem context: keep always-loaded context (CLAUDE.md, auto-rules) minimal. Move everything else to on-demand loading (skills, manual file references).\n\nThe remaining 20% is agent output. You cannot control how many tokens Claude uses to generate a response, but you can control how much context it has to process before generating. Less irrelevant context means faster, cheaper, and often better output.',
      },
    ],
  },

  /* ================================================================== */
  /*  SECURITY                                                            */
  /* ================================================================== */

  {
    id: 'ai-security-myths',
    title: 'AI Security Myths Debunked',
    subtitle: 'Separating real risks from fear-based misunderstanding',
    category: 'security',
    description:
      'Debunking common AI security myths. What is actually risky, what is not, and how to think about security as an engineering practice rather than a fear response.',
    keywords: [
      'AI security myths',
      'AI code safety',
      'is AI coding safe',
      'claude security',
      'AI IDE security risks',
      'AI security debunked',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'constraints-and-context-engines',
      'rules-skills-context',
      'repo-context-engine',
    ],
    sections: [
      {
        heading: 'The Fear vs The Reality',
        type: 'prose',
        content:
          'The most common objection to AI-assisted development is security. "What if the AI leaks my code?" "What if it sends my API keys to the cloud?" "What if it commits something sensitive?" These are valid questions. But most of the fear comes from misunderstanding how these tools work, not from actual vulnerabilities. Let me separate the real risks from the myths so you can make informed decisions instead of fear-based ones.',
      },
      {
        heading: 'Myth: The AI Sends Your Code to External Servers',
        type: 'pattern',
        content:
          'When you use Cursor or Claude Code, your code does leave your machine — it goes to Anthropic or OpenAI servers for processing. This is how cloud-based AI works. The model needs to see the code to help with it. But this is not "leaking." It is the same model as using Google Docs (your documents go to Google servers) or Slack (your messages go to Slack servers). The relevant question is not "does my code leave my machine?" It is "what does the provider do with it?" Anthropic and OpenAI have clear data policies: they do not train on your code from paid API and IDE subscriptions. Read the terms of service for your specific plan. Enterprise plans typically include stronger data handling guarantees.',
      },
      {
        heading: 'Myth: AI Will Commit Your Secrets',
        type: 'pattern',
        content:
          'AI agents can run git commands. If you tell Claude to commit everything, it will commit everything — including .env files with your API keys. But this is not an AI problem. It is a .gitignore problem. The same risk exists if a human developer runs git add . without checking what is staged. The fix is the same for AI and humans: configure your .gitignore correctly, use pre-commit hooks that scan for secrets, and review what is being committed before pushing.\n\nThe /deploy skill in my repo includes a pre-push scan that checks for sensitive content. That is an engineering solution, not a fear response.',
      },
      {
        heading: 'What Is Actually Risky',
        type: 'anti-pattern',
        content:
          'The real risks are boring and preventable:\n\n1. Committing .env files to a public repo. Fix: .gitignore and pre-commit hooks.\n2. Hardcoding API keys in source files. Fix: use environment variables.\n3. Pushing client names or partner data to a public repo. Fix: keep sensitive folders gitignored.\n4. Using a free-tier AI service that trains on your input. Fix: use paid plans with clear data policies.\n5. Not rotating API keys that were accidentally exposed. Fix: rotate immediately if any key touches version control.\n\nNone of these are unique to AI. They are standard security hygiene. AI agents do not introduce new attack vectors. They follow the same rules as any other tool in your development workflow.',
      },
      {
        heading: 'The Engineering Mindset',
        type: 'pro-tip',
        content:
          'Security is not a reason to avoid AI tools. It is a set of engineering practices to implement alongside them. You do not avoid driving because cars can crash. You wear a seatbelt, follow traffic rules, and maintain your vehicle. Same approach here. Configure .gitignore before your first commit. Use environment variables for every secret. Keep sensitive data in gitignored folders. Review git diffs before pushing. Use pre-push scripts that scan for sensitive content. These are one-time setup tasks. Once they are in place, you work at full speed with AI tools without worrying about security. The 30 minutes of setup saves infinite anxiety.',
      },
    ],
  },

  {
    id: 'constraints-and-context-engines',
    title: 'Constraints and Context Engines',
    subtitle: '.gitignore, env vars, and the architecture that keeps your repo safe',
    category: 'security',
    description:
      'Practical security guide for AI-powered repos. .gitignore configuration, environment variables, folder-level protection, pre-push scanning, and the public vs private repo strategy.',
    keywords: [
      'gitignore AI',
      'env vars AI security',
      'AI repo security',
      'pre-push security scan',
      'context engine security',
      'public private repo AI',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'ai-security-myths',
      'repo-context-engine',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: '.gitignore: Your First Line of Defense',
        type: 'code',
        content:
          'Set up your .gitignore before your first commit. Not after. Before.\n\nThe essentials:\n*.env and .env.* — API keys, tokens, passwords. One leaked key can cost thousands.\nclients/ and partners/ — real names, deals, conversations.\ndata/ — CSVs and JSONs with real email addresses, company names, lead lists.\nscripts/ — automation scripts often embed API keys or reference internal systems.\nscreenshots/ — may capture sensitive dashboards or client names in browser tabs.\n.cursor/mcp.json — contains your API keys for every connected tool.\nnode_modules/ — thousands of dependency files that do not belong in version control.\n\nTest your .gitignore with git status. If a file you expect to be ignored shows up in the status, the ignore rule is not working. Fix it before you commit.',
      },
      {
        heading: 'Environment Variables',
        type: 'pattern',
        content:
          'Never hardcode API keys in files. Use environment variables.\n\nCreate a .env file in your project root. Add your keys: INSTANTLY_API_KEY=your-key-here. Reference them in code with process.env.INSTANTLY_API_KEY. The .env file is gitignored, so it stays local.\n\nCreate a .env.example file (without real values) that you DO commit. This documents which environment variables your system needs without exposing actual keys. When a collaborator clones the repo, they see .env.example and know which keys to add.\n\nFor Vercel deployments: add environment variables in the Vercel dashboard. The deployed app reads from Vercel\'s environment. Your local app reads from .env. The keys never touch version control.',
      },
      {
        heading: 'Folder-Level Protection',
        type: 'pattern',
        content:
          'Structure your repo so sensitive data has a clear home that is always gitignored. Skills, content, and workflows are safe to share. Clients, partners, data exports, and scripts with credentials are not.\n\nThe pattern: shareable content (frameworks, templates, published posts) lives in tracked folders. Sensitive content (client data, API configurations, internal scripts) lives in gitignored folders. The boundary is clear and enforced by .gitignore, not by memory.\n\nMy repo has both a private working repo (contains everything) and a public GitHub repo (contains only shareable content). The /update-github skill runs a pre-push scan that checks for sensitive partner names using a local blocklist before pushing to the public repo.',
      },
      {
        heading: 'Pre-Push Scanning',
        type: 'pro-tip',
        content:
          'A .gitignore prevents accidental commits of entire folders. But what about a partner name that slips into a commit message or a blog post? Pre-push scanning catches those.\n\nThe /update-github skill scans tracked files for sensitive content using a blocklist of partner and client names. It audits the .gitignore to confirm all sensitive folders are excluded. It checks commit messages for leaked names. Only after all scans pass does it push.\n\nYou can build a simpler version with a git pre-push hook. The hook runs a script that greps for patterns you define (company names, email domains, key prefixes). If it finds a match, the push is rejected with a warning. This is a safety net, not a replacement for good .gitignore configuration.',
      },
      {
        heading: 'Public vs Private Strategy',
        type: 'formula',
        content:
          'Keep two repos or use branch-based separation.\n\nOption A (two repos): Your private repo contains everything — skills, content, partner data, scripts. Your public repo is a cleaned subset. A pre-push script ensures nothing sensitive crosses over.\n\nOption B (branch-based): Your main branch is public. Sensitive work happens in private branches that never merge to main. This is simpler but riskier because one wrong merge exposes everything.\n\nI use Option A. The private repo is the full operating system. The public GitHub repo is the showcase version with frameworks, published content, and skill examples. The /update-github skill automates the sync with safety scanning. The key: the public repo is NEVER the primary working copy. It is a curated export of the private repo.',
      },
    ],
  },

  /* ================================================================== */
  /*  PARALLEL AGENTS                                                     */
  /* ================================================================== */

  {
    id: 'parallel-agent-patterns',
    title: 'Parallel Agent Patterns',
    subtitle: 'Identify independent tasks, launch concurrent agents, avoid conflicts',
    category: 'parallel-agents',
    description:
      'How to identify tasks that can run in parallel, the independence test, model assignment, and the patterns that turn 45-minute builds into 10-minute builds.',
    keywords: [
      'parallel AI agents',
      'concurrent AI agents',
      'parallel agents pattern',
      'multi agent AI workflow',
      'parallel execution AI',
      'parallel agent independence test',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'orchestrating-multi-agent-workflows',
      'model-selection-strategy',
      'credit-management',
    ],
    sections: [
      {
        heading: 'What Parallel Agents Are',
        type: 'prose',
        content:
          'Parallel agents means running multiple AI agents at the same time on different tasks. Not one after another. All at once. The key word is independent. If Agent A needs the output of Agent B, they cannot run in parallel. If they touch different files, different data, different concerns — launch them simultaneously. This is the single biggest speed multiplier in AI-assisted development. A task that takes 45 minutes sequentially can finish in under 10 minutes with parallel agents. The speed gain is not theoretical. I build wiki pages, data files, and site routes in parallel every week.',
      },
      {
        heading: 'The Independence Test',
        type: 'pattern',
        content:
          'Before launching parallel agents, check three things for each pair of tasks:\n\n1. Do they write to the same files? If yes, they cannot run in parallel. File conflicts corrupt output.\n2. Does one need the output of the other? If yes, they must run sequentially. The dependent task runs after the dependency completes.\n3. Do they import from something that does not exist yet? This is the subtle one. If Agent A creates a data file and Agent B imports from it, they seem dependent. But if Agent B copies a known pattern (like mirroring an existing wiki page), it can run in parallel because the import structure is predictable.\n\nIf all three checks pass, launch them in parallel. If any fail, sequence them. Do not force parallelism on dependent tasks. That creates more work, not less.',
      },
      {
        heading: 'The Wave Pattern',
        type: 'pattern',
        content:
          'Complex features decompose into waves. Each wave contains tasks that can run in parallel. Waves run sequentially because later waves depend on earlier ones.\n\nWave 1: Foundation — data files, shared components, type definitions. These have no dependencies on each other but everything downstream depends on them.\nWave 2: Consumers — pages, routes, components that import from Wave 1 output. Multiple consumers can run in parallel because they touch different files.\nWave 3: Integration — navigation updates, cross-links, export updates. These connect the Wave 2 outputs together.\nWave 4: Verification — build, test, deploy. Sequential because each step depends on the previous.\n\nMapping your feature into waves before you start is the planning step that makes parallel execution possible.',
      },
      {
        heading: 'Model Assignment Per Agent',
        type: 'pro-tip',
        content:
          'Not every parallel agent needs the same model. Assign models based on task complexity, not uniformly.\n\nThe orchestrating agent (the one that plans and launches the others) uses the capable model. It needs to reason about dependencies, context, and sequencing.\n\nSub-agents doing copy-paste-and-adapt work use fast models. Building a route that mirrors an existing one. Updating a config file. Running a build check. These are mechanical tasks.\n\nSub-agents doing creative work use the capable model. Writing 17 wiki entries with rich content. Architecting a new component. Anything that requires judgment or nuance.\n\nThe result: you get speed (fast models complete quickly) and quality (capable models handle the hard parts) simultaneously.',
      },
      {
        heading: 'Anti-Pattern: Parallelizing Dependent Tasks',
        type: 'anti-pattern',
        content:
          'The most common mistake is launching agents on tasks that depend on each other. Agent A creates the type definitions. Agent B creates a component that uses those types. If they run in parallel, Agent B guesses the types instead of reading them. Sometimes the guess is right. Often it is not. And the debugging time wipes out any speed gain from parallelism.\n\nAnother mistake: five agents all editing the same config file. Merge conflicts, overwritten changes, corrupted output. Each agent\'s changes look correct in isolation but break when combined.\n\nThe fix: plan first. Map the dependencies. Group independent tasks into parallel waves. Sequence dependent tasks into separate waves. The planning takes 5 minutes. The debugging from bad parallelism takes 30.',
      },
    ],
  },

  {
    id: 'orchestrating-multi-agent-workflows',
    title: 'Orchestrating Multi-Agent Workflows',
    subtitle: 'Plan the waves, assign the models, launch the agents, verify the output',
    category: 'parallel-agents',
    description:
      'Step-by-step guide to orchestrating multi-agent workflows. Planning waves, writing agent prompts, managing context handoffs, and verifying combined output.',
    keywords: [
      'multi agent workflow',
      'orchestrate AI agents',
      'agent workflow orchestration',
      'multi agent AI tutorial',
      'parallel agent orchestration',
      'agent workflow planning',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'model-selection-strategy',
      'credit-management',
    ],
    sections: [
      {
        heading: 'The Orchestration Mental Model',
        type: 'prose',
        content:
          'You are the orchestrator. Claude is the workforce. Your job is not to write code. Your job is to plan the work, assign the agents, provide the context, and verify the output. Think of yourself as a project manager who happens to have an infinite supply of capable workers available instantly. The bottleneck is not labor. It is planning. A well-planned multi-agent workflow finishes in minutes. A poorly planned one finishes in hours (or not at all) because agents step on each other, produce conflicting output, or miss requirements that were not in their instructions.',
      },
      {
        heading: 'Step 1: Plan in Read-Only Mode',
        type: 'pattern',
        content:
          'Start every multi-agent workflow in plan mode. Ask Claude to analyze the task, identify all the files that need to be created or modified, map the dependencies between them, and group independent tasks into parallel waves.\n\nThe plan should include: files to create (with full paths), files to modify (with specific changes), the wave structure (which tasks run in parallel, which run sequentially), model recommendations per agent, and verification steps.\n\nReview the plan before executing. If a dependency is wrong, fix it now. If a task grouping does not make sense, adjust it now. Changes to the plan cost nothing. Changes after agents have started cost time and context.',
      },
      {
        heading: 'Step 2: Write Agent-Specific Prompts',
        type: 'pattern',
        content:
          'Each agent gets its own prompt with its own context. Agents do not share context with each other. Agent B does not know what Agent A is doing. That is a feature, not a bug. It means you have full control over what each agent sees and does.\n\nA good agent prompt includes: the specific task ("Create the file website/packages/shared/data/how-to-wiki.ts"), the pattern to follow ("Mirror the structure of clay-wiki.ts"), the specific data or content to include, references to files it should read for context, and the success criteria ("The file should export a typed array of 17 entries with full WikiSection content").\n\nBad agent prompts are vague. "Build the wiki." Good agent prompts are specific. "Create how-to-wiki.ts with the HowToWikiEntry interface, 6 categories, 17 entries, and helper functions following the exact pattern of context-wiki.ts."',
      },
      {
        heading: 'Step 3: Launch, Monitor, Verify',
        type: 'formula',
        content:
          'Launch Wave 1 agents in parallel. Monitor their progress. When all Wave 1 agents complete, verify their output before launching Wave 2. Verification between waves catches errors early.\n\nVerification checklist per wave:\n- Do the created files exist at the expected paths?\n- Do the types and interfaces match what downstream consumers expect?\n- Does the build still pass after the wave\'s changes?\n- Are there any TypeScript or linting errors?\n\nOnly after verification passes do you launch the next wave. If an agent produced bad output, fix it before proceeding. A bad foundation from Wave 1 means every Wave 2 agent builds on broken assumptions.\n\nFinal verification after all waves: build the entire project, check all routes render, verify cross-links resolve, confirm SEO metadata is correct. This is the last quality gate before the feature ships.',
      },
      {
        heading: 'Real Example: Building a Wiki Feature',
        type: 'pro-tip',
        content:
          'When I built the Clay Wiki, the orchestration was: Wave 1 — one agent wrote the data file (all 17 entries, types, helpers). Wave 2 — three agents ran in parallel: hub page component, detail page component, and ShawnOS route setup. Wave 3 — two agents ran in parallel: navigation updates and cross-link backfills. Wave 4 — one agent ran the build and verified all routes.\n\nTotal time: under 15 minutes. Sequential time estimate: over 45 minutes. The speed difference came from planning. Identifying which tasks were independent. Grouping them into waves. Giving each agent exactly the context it needed. The actual execution was fast. The planning is what made the execution possible.',
      },
    ],
  },
]
