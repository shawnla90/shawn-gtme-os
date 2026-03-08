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
  | 'geo-seo'
  | 'comparisons'
  | 'abm-pipeline'
  | 'deployment-tools'
  | 'tool-evaluation'

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
  {
    id: 'comparisons',
    label: 'Comparisons',
    description:
      'Head-to-head breakdowns of AI coding tools, workflows, and concepts. Practitioner perspective from someone who uses them all daily.',
    prompt: '$ diff --tool-a --tool-b',
  },
  {
    id: 'abm-pipeline',
    label: 'ABM Pipeline',
    description:
      'Account-based marketing automation, personalized landing pages, analytics tracking, and the full ABM motion from signal to conversion.',
    prompt: '$ cd ~/how-to/abm-pipeline/',
  },
  {
    id: 'deployment-tools',
    label: 'Deployment Tools',
    description:
      'Hosting platforms, agent deployment, SDK kits, and infrastructure tools for shipping agents and services beyond static sites.',
    prompt: '$ cd ~/how-to/deployment-tools/',
  },
  {
    id: 'tool-evaluation',
    label: 'Tool Evaluation',
    description:
      'Independent evaluation frameworks for go-to-market tools, vendors, and agencies.',
    prompt: '$ cd ~/how-to/tool-evaluation/',
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
    id: 'nio-workspace-knowledge-graph-example',
    title: 'Nio Workspace Knowledge Graph (Live Example)',
    subtitle: 'Real production workspace showing how 7 core files + 42 skills create an AI ops layer',
    category: 'cli-tools',
    description:
      'Live example of a production OpenClaw knowledge graph from February 2026. Shows the actual file structure, boot sequence, and relationships that power the Nio AI ops layer. Use this as a template for your own advanced setup.',
    keywords: [
      'nio workspace example',
      'openclaw knowledge graph example',
      'production AI setup example',
      'nio file structure',
      'AI ops workspace example',
      'openclaw production example',
      'knowledge graph template',
      'nio system architecture',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'openclaw-setup',
      'repo-context-engine',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'The Knowledge Graph (Visual)',
        type: 'pattern',
        content:
          '<p style="margin-bottom:16px">This is the actual relationship map between every file in the Nio workspace as of February 21, 2026. Every arrow is a real reference. Every box is a real file.</p>' +
          '<pre style="font-family:var(--font-mono);font-size:12px;line-height:1.5;color:#e2e8f0;background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:24px;overflow-x:auto;white-space:pre">' +
          '                              ┌─────────────┐\n' +
          '                              │  AGENTS.md  │ ← BOOT CONTROLLER\n' +
          '                              │ (boot seq)  │\n' +
          '                              └──────┬──────┘\n' +
          '                                     │\n' +
          '                    boot order: 1→2→3→4→5→6 (+7 main only)\n' +
          '                                     │\n' +
          '          ┌──────────┬───────────┬────┼───┬──────────┬──────────┐\n' +
          '          ▼          ▼           ▼    ▼   ▼          ▼          ▼\n' +
          '     ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐\n' +
          '     │ SOUL.md │ │IDENTITY  │ │USER.md │ │BRAIN.md │ │HEART   │ │VOICE.md │\n' +
          '     │  (1)    │ │  .md (2) │ │  (3)   │ │  (4)    │ │BEAT(5) │ │  (6)    │\n' +
          '     └────┬────┘ └──────────┘ └───┬────┘ └────┬────┘ └────────┘ └────┬────┘\n' +
          '          │                       │            │                      │\n' +
          '          │ voice DNA,            │            │ "if empty,           │ distilled from\n' +
          '          │ model routing,        │ refs       │  read HEARTBEAT"     │\n' +
          '          │ blog structure        ▼            │                      ▼\n' +
          '          │                 ┌──────────┐       │        ┌──────────────────────┐\n' +
          '          │                 │CLIENTS.md│       │        │skills/tier-1-voice-  │\n' +
          '          │                 └─────┬────┘       │        │dna/core-voice.md     │\n' +
          '          │                       │            │        │    + anti-slop.md     │\n' +
          '          ▼                       ▼            │        └──────────────────────┘\n' +
          '  ┌───────────────┐    5 client SKILL.md       │\n' +
          '  │skills/tier-1  │    directories              │              ┌──────────┐\n' +
          '  │  voice-dna/   │◄───────────────────────────────────────── │MEMORY.md │\n' +
          '  │skills/tier-3  │                             │              │  (7)     │\n' +
          '  │  pillars/     │                             │              │main only │\n' +
          '  └───────────────┘                             │              └──────────┘\n' +
          '                                                │\n' +
          '          ┌─────────────────────────────────────┘\n' +
          '          │\n' +
          '          │          ┌──────────────┐         ┌──────────────┐\n' +
          '          │          │  TOOLS.md    │────────▶│MISSION-      │\n' +
          '          │          │ (infra map)  │         │CONTROL.md    │\n' +
          '          │          └──────┬───────┘         └──────┬───────┘\n' +
          '          │                 │                        │\n' +
          '          │     ┌───────────┼────────────┐           │ THE PIPELINE\n' +
          '          │     ▼           ▼            ▼           ▼\n' +
          '          │  Discord    WhatsApp     9 MCP      ┌────────────────────────┐\n' +
          '          │  channel    +1347..      tools      │ 4 scripts (in order): │\n' +
          '          │  1474..                              │ 1. updater.py → /tmp/ │\n' +
          '          │                                     │ 2. gen-dashboard.js   │\n' +
          '          │                                     │ 3. gen-metrics.js     │\n' +
          '          │                                     │ 4. validate.js        │\n' +
          '          │                                     └─────────┬──────────────┘\n' +
          '          │                                               │\n' +
          '          │                                               ▼\n' +
          '          │                                     6 output files:\n' +
          '          │                                     metrics.json, tasks,\n' +
          '          │                                     calendar, memories,\n' +
          '          │                                     team, status\n' +
          '          │\n' +
          '          ▼\n' +
          '   ┌──────────────┐\n' +
          '   │ PLAYBOOK.md  │──────────────────────────────────────────┐\n' +
          '   │  (decisions) │                                          │\n' +
          '   └──────┬───────┘                                          │\n' +
          '          │ references:                                      │\n' +
          '          ├──▶ SOUL.md (blog structure)                      │\n' +
          '          ├──▶ VOICE.md (anti-slop)                          │\n' +
          '          ├──▶ MISSION-CONTROL.md (pipeline)                 │\n' +
          '          │                                                  │\n' +
          '          ▼                                                  ▼\n' +
          '   ┌──────────────────────────────────────────────────────────────┐\n' +
          '   │                    skills/ (4 SKILL.md)                      │\n' +
          '   ├─────────────────┬────────────────┬──────────────┬───────────┤\n' +
          '   │ blog-pipeline/  │ website-ops/   │content-      │ cron-ops/ │\n' +
          '   │                 │                │pipeline/     │           │\n' +
          '   │ refs:           │ refs:          │ refs:        │ refs:     │\n' +
          '   │ • SOUL.md       │ • MISSION-     │ • VOICE.md   │ • jobs   │\n' +
          '   │ • VOICE.md      │   CONTROL.md   │ • Typefully  │   .json  │\n' +
          '   │ • Discord ch    │ • 5 apps       │ • Substack   │ • 3 on   │\n' +
          '   │ • nio-blog/     │ • shared pkg   │ • pillars/   │ • 8 off  │\n' +
          '   └─────────────────┴────────────────┴──────────────┴───────────┘\n' +
          '</pre>' +
          '<p style="margin-top:16px;font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">Boot flow:</strong> AGENTS loads 7 files (~3,125 tokens) → Nio has full identity, context, voice. TOOLS, PLAYBOOK, MISSION-CONTROL, CLIENTS, and skills are loaded on-demand when needed for a specific task.</p>',
      },
      {
        heading: 'Boot Sequence: What Loads and Why',
        type: 'code',
        content:
          '<p style="margin-bottom:16px">AGENTS.md is the boot controller. It loads 7 files in order, every session. Total cost: ~3,125 tokens (about 12% of the context window).</p>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">' +
          '<tr style="border-bottom:1px solid #30363d">' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Order</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">File</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Purpose</th>' +
          '<th style="text-align:right;padding:8px 12px;color:#e2e8f0">Tokens</th>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">1</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">SOUL.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Core identity, voice DNA, decision rules, model routing, blog structure</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~952</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">2</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">IDENTITY.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Role definition, personality constraints, avatar paths</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~161</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">3</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">USER.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Who Shawn is, preferences, pet peeves, system overview</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~283</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">4</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">BRAIN.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Live session scratchpad. If empty, fall back to HEARTBEAT.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~44</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">5</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">HEARTBEAT.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Active TODOs, rotating checks, quiet rules</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~244</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">6</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">VOICE.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Delivery constraints distilled from tier-1 voice DNA</td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~380</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#facc15">7</td>' +
          '<td style="padding:8px 12px;color:#e2e8f0">MEMORY.md</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Long-term curated memory. <em>Main session only</em></td>' +
          '<td style="padding:8px 12px;color:#8b949e;text-align:right">~774</td>' +
          '</tr>' +
          '</table>' +
          '<p style="font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">How the files connect:</strong> SOUL.md sets behavior. VOICE.md enforces delivery. USER.md anchors the human. MEMORY.md anchors continuity. HEARTBEAT.md prevents drift by forcing a check of what is actually active. BRAIN.md holds temporary state so it does not pollute long-term memory.</p>',
      },
      {
        heading: 'Infrastructure and Pipeline Integration',
        type: 'code',
        content:
          '<p style="margin-bottom:16px">This workspace is not just notes. It is wired into real infrastructure.</p>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Messaging Channels</h4>' +
          '<ul style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li><strong style="color:#e2e8f0">Discord:</strong> channel 1474174694025330919 (nio-terminal)</li>' +
          '<li><strong style="color:#e2e8f0">WhatsApp:</strong> +13474520467</li>' +
          '</ul>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">MCP Tools (9 via OpenClaw)</h4>' +
          '<p style="color:#8b949e;margin-bottom:16px">Typefully (social scheduling) · GitHub (repo/PR ops) · Slack x2 (lead-alchemy + revpartners) · Firecrawl (web scraping) · Reddit (browsing) · HeyReach (outreach) · ElevenLabs (TTS) · Substack (newsletters) · Browserbase (browser automation)</p>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Mission Control Data Pipeline</h4>' +
          '<p style="color:#8b949e;margin-bottom:8px">These 4 scripts run in sequence. All 4 must complete. Skipping any step produces incomplete data.</p>' +
          '<ol style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li><code style="color:#79c0ff">mission_control_updater.py</code> → writes /tmp/mission_control_enhanced.json</li>' +
          '<li><code style="color:#79c0ff">generate-dashboard-data.js</code> → writes 5 files to public/data/</li>' +
          '<li><code style="color:#79c0ff">generate-metrics.js</code> → writes public/metrics.json</li>' +
          '<li><code style="color:#79c0ff">validate-mission-control-data.js</code> → validates all 6 output files</li>' +
          '</ol>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Output Artifacts (6 files Mission Control reads)</h4>' +
          '<p style="color:#8b949e">metrics.json · tasks.json · calendar.json · memories.json · team.json · status.json</p>',
      },
      {
        heading: 'Skills Architecture and Decision Flow',
        type: 'pattern',
        content:
          '<p style="margin-bottom:16px">Skills are the execution layer. Playbooks are the decision layer. They connect through shared references.</p>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Decision Layer: PLAYBOOK.md</h4>' +
          '<p style="color:#8b949e;margin-bottom:8px">The switchboard. It routes to the rules that matter for the current task:</p>' +
          '<ul style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li>SOUL.md for blog structure and behavior constraints</li>' +
          '<li>VOICE.md for anti-slop enforcement</li>' +
          '<li>MISSION-CONTROL.md for the dashboard pipeline</li>' +
          '</ul>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Execution Layer: 4 Workspace Skills</h4>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">' +
          '<tr style="border-bottom:1px solid #30363d">' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Skill</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">References</th>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">blog-pipeline/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">SOUL.md, VOICE.md, Discord channel, nio-blog/</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">website-ops/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">MISSION-CONTROL.md, 5 apps, shared packages</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#4ade80">content-pipeline/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">VOICE.md, Typefully, Substack, content pillars</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#60a5fa">cron-ops/</td>' +
          '<td style="padding:8px 12px;color:#8b949e">jobs.json (3 enabled, 8 disabled)</td>' +
          '</tr>' +
          '</table>' +
          '<p style="font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">Cleanup note:</strong> older one-off workflow files got deleted (WORKFLOW_AUTO.md, mission-control-status.md). The system converges toward fewer, sharper sources of truth.</p>',
      },
      {
        heading: 'Model Routing and Fallback Chain',
        type: 'pro-tip',
        content:
          '<p style="margin-bottom:16px">Different tasks route to different models based on cost and capability. If the primary model hits a rate limit or billing cap, the system automatically falls through the chain.</p>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">' +
          '<tr style="border-bottom:1px solid #30363d">' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Task</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Model</th>' +
          '<th style="text-align:left;padding:8px 12px;color:#e2e8f0">Why</th>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">Chat / quick ops</td>' +
          '<td style="padding:8px 12px;color:#4ade80">GPT-5.2</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Free via OAuth</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">Content creation</td>' +
          '<td style="padding:8px 12px;color:#c084fc">Opus</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Non-negotiable for quality</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">High-freq crons</td>' +
          '<td style="padding:8px 12px;color:#facc15">Qwen 2.5 14B (local)</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Free, runs on Ollama</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid #21262d">' +
          '<td style="padding:8px 12px;color:#8b949e">Code / reasoning</td>' +
          '<td style="padding:8px 12px;color:#60a5fa">Sonnet → Opus</td>' +
          '<td style="padding:8px 12px;color:#8b949e">Cost-efficient escalation</td>' +
          '</tr>' +
          '</table>' +
          '<h4 style="font-size:14px;color:#e2e8f0;margin:20px 0 8px">Automatic Fallback Chain</h4>' +
          '<p style="color:#8b949e;margin-bottom:8px">If the primary model fails (rate limit, billing, timeout), OpenClaw walks down the chain automatically:</p>' +
          '<ol style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li><strong style="color:#c084fc">Opus</strong> (primary, Anthropic API)</li>' +
          '<li><strong style="color:#60a5fa">Sonnet</strong> (same provider, cheaper tier)</li>' +
          '<li><strong style="color:#4ade80">GPT-5.3-codex</strong> (free OAuth, strongest OpenAI reasoning)</li>' +
          '<li><strong style="color:#4ade80">GPT-5.2</strong> (free OAuth, general-purpose)</li>' +
          '<li><strong style="color:#facc15">Gemini 3 Pro</strong> (Google API, last resort)</li>' +
          '</ol>' +
          '<p style="font-size:13px;color:#8b949e">No more dead stops mid-task. The agent keeps working regardless of which provider is available.</p>',
      },
      {
        heading: 'Using This as Your Template',
        type: 'pattern',
        content:
          '<p style="margin-bottom:16px">To implement this structure in your own OpenClaw workspace:</p>' +
          '<ol style="margin:0 0 16px 20px;color:#8b949e">' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Start with AGENTS.md</strong> — define your boot sequence and file loading order</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Create the core 7 files</strong> — SOUL, IDENTITY, USER, BRAIN, HEARTBEAT, VOICE, MEMORY</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Set up infrastructure files</strong> — TOOLS, PLAYBOOK, MISSION-CONTROL, CLIENTS</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Build skills incrementally</strong> — start with 3-4 skills, grow to your operational needs</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Establish the pipeline</strong> — connect to your tools (Discord, messaging, dashboards)</li>' +
          '<li style="margin-bottom:8px"><strong style="color:#e2e8f0">Implement memory systems</strong> — daily logs that promote to long-term memory</li>' +
          '</ol>' +
          '<p style="font-size:13px;color:#8b949e"><strong style="color:#e2e8f0">The key insight:</strong> this is not file organization. It is an operational system where each file serves a specific function in the AI decision-making process. The structure creates institutional memory that compounds over time.</p>',
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

  {
    id: 'claude-code-power-features',
    title: 'Claude Code Power Features',
    subtitle: 'Memory, hooks, custom skills, cost tracking, and worktrees',
    category: 'cli-tools',
    description:
      'The features that turn Claude Code from a terminal chatbot into a persistent, customizable AI operating system. Memory that persists across sessions, hooks that automate behavior, custom slash commands, cost visibility, and isolated worktrees.',
    keywords: [
      'claude code memory',
      'claude code hooks',
      'claude code skills',
      'claude code slash commands',
      'claude code cost tracking',
      'claude code worktrees',
      'claude code advanced features',
      'claude code power user',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'claude-code-inside-cursor',
      'rules-skills-context',
      'agent-teams-claude-code',
    ],
    sections: [
      {
        heading: 'Beyond the Quickstart',
        type: 'prose',
        content:
          'The Claude Code quickstart gets you installed and running. This guide covers the features that make it stick. Memory that remembers what you taught it last Tuesday. Hooks that run shell commands when Claude touches specific tools. Custom slash commands that execute your workflows with a single keystroke. Cost tracking so you know where your tokens go. And worktrees for running parallel sessions without file conflicts. These are the features I use daily. Most of them I discovered by accident, weeks after I started using Claude Code. You should not have to wait weeks.',
      },
      {
        heading: 'Memory: Your Agent Remembers',
        type: 'pattern',
        content:
          'Claude Code has a persistent memory system. It writes notes to a directory at ~/.claude/projects/<project-hash>/memory/ and reads them back at the start of every session. The index file is MEMORY.md. The first 200 lines load automatically into every session. Additional topic files (debugging.md, patterns.md, whatever you need) get created as the repo evolves.\n\nWhat gets saved: stable patterns confirmed across multiple sessions, architectural decisions, important file paths, user preferences, solutions to recurring problems. What does not get saved: session-specific context, in-progress work, unverified guesses from a single file read.\n\nYou can also tell Claude to remember things explicitly. Say "always use bun instead of npm" and it writes that to memory. Say "forget about using bun" and it removes it. The memory compounds. After a few weeks, Claude starts a session already knowing your repo structure, your naming conventions, your preferred tools, and the mistakes it made before. That is the difference between a blank agent and a teammate.',
      },
      {
        heading: 'Hooks: Automating Agent Behavior',
        type: 'code',
        content:
          'Hooks are shell commands that fire on Claude Code lifecycle events. There are 14 hook events: PreToolUse, PostToolUse, SessionStart, Stop, and more. You configure them in .claude/settings.json (project level) or ~/.claude/settings.json (global).\n\nThe format:\n\n"hooks": {\n  "PreToolUse": [\n    {\n      "matcher": "Bash",\n      "hooks": [\n        {\n          "type": "command",\n          "command": "./hooks/validate.sh",\n          "timeout": 600\n        }\n      ]\n    }\n  ]\n}\n\nThree hook types exist. Command hooks run shell scripts. Prompt hooks send context to Claude for a yes/no decision. Agent hooks spawn a subagent with read-only tools for complex verification.\n\nPractical uses: block dangerous rm commands before they execute. Run a linter after every file write. Send a Slack notification when a session ends. Validate commit messages before they go through. The /hooks command gives you an interactive menu to manage them without editing JSON by hand.',
      },
      {
        heading: 'Custom Skills and Slash Commands',
        type: 'pattern',
        content:
          'Skills are markdown files in .claude/skills/ that define reusable workflows. Each skill folder contains a SKILL.md file with YAML frontmatter and step-by-step instructions. When you type /skill-name in a Claude Code session, the skill loads and Claude follows the instructions.\n\nThe frontmatter controls behavior. The basics: name (becomes the slash command), description (Claude uses this to auto-invoke when relevant), and allowed-tools (tools Claude can use without asking permission). The advanced fields: model (override which model runs this skill), context: fork (run in an isolated subagent context instead of the main conversation), disable-model-invocation: true (only the user can trigger it, useful for deploy and commit skills), and argument-hint (autocomplete hint like [issue-number]). You can also embed dynamic context with the !command syntax, which runs a shell command before the skill content is sent to Claude.\n\nMy repo has four custom skills: /handoff generates a context handoff document for the next session. /sync-main handles git divergence from automated machines. /update-github runs a pre-push safety scan before pushing to the public repo. /restart-openclaw diagnoses and restarts the OpenClaw gateway. Each one started simple and got more robust through actual use.\n\nThe skill file is plain English. You are not writing code. You are writing instructions that an AI agent follows step by step. Skills load on demand, so they do not consume context window space until invoked. That is the key difference between skills and CLAUDE.md. Put always-needed context in CLAUDE.md. Put workflow-specific instructions in skills. Skill descriptions are loaded into context at startup (capped at about 2% of your context window), so Claude knows which skills exist and can suggest them.',
      },
      {
        heading: 'Cost Tracking and Insights',
        type: 'pro-tip',
        content:
          'Type /cost in a session to see your token spend. It shows total cost, API duration, wall duration, and code changes. Type /context to see what is consuming your context window. Type /model to switch models mid-session.\n\nThe power move is /insights. It generates an interactive HTML report at ~/.claude/usage-data/report.html that analyzes up to 50 recent sessions. The report includes a statistics dashboard (session counts, messages, duration, tokens, git commits, activity streaks, peak hours), daily activity charts, tool usage distribution, language breakdown, friction points with specific examples, and recommended CLAUDE.md additions. It runs your transcripts through Haiku for facet extraction and caches results so subsequent runs are fast. If you want to understand how you actually use Claude Code versus how you think you use it, /insights shows you the data.\n\nThe biggest cost lever is model selection. Sonnet handles most daily work. Opus is for complex architecture and judgment calls. Haiku works well for subagents doing mechanical tasks. Defaulting to Opus on everything is like hiring a senior architect to paint walls.\n\nOther cost reducers: /clear between unrelated tasks starts a fresh context window. Move workflow instructions from CLAUDE.md to skills so they only load when invoked. Reference specific file paths instead of asking Claude to search. Short, focused sessions beat marathon conversations where context accumulates and old messages get compressed.\n\nAverage cost runs about $6 per developer per day. 90% of users stay under $12. If you are above that, check what is loading into every session and move it to on-demand skills.',
      },
      {
        heading: 'Worktrees: Isolated Parallel Work',
        type: 'code',
        content:
          'Worktrees let you run parallel Claude Code sessions without file conflicts. Each worktree gets its own branch and working directory while sharing the same git history.\n\nCreate one with: claude -w feature-name\n\nThis creates a worktree at .claude/worktrees/feature-name with a branch called worktree-feature-name. Start Claude in that directory and work on whatever you need. The main working tree stays untouched.\n\nWhen you exit, Claude asks whether to keep or remove the worktree. If you had no changes, it cleans up automatically. The /resume command shows sessions from all worktrees in the same repo, so you can switch between parallel work easily.\n\nWorktrees are good for isolated experiments and feature branches. For coordinated parallel work where agents need to talk to each other, Agent Teams are the better tool. Worktrees are solo lanes. Teams are a coordinated fleet.',
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
      'mcp-cli-litmus-test',
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
      'mcp-cli-litmus-test',
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
      'should-you-get-clay',
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
      'credit-transparency-gtm-tools',
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

  {
    id: 'agent-teams-claude-code',
    title: 'Agent Teams in Claude Code',
    subtitle: 'Multi-agent coordination with shared task lists, messaging, and management layers',
    category: 'parallel-agents',
    description:
      'How to use Claude Code Agent Teams for coordinated parallel work. Creating teams, assigning tasks, inter-agent messaging, the management layer that prevents chaos, and real examples from production.',
    keywords: [
      'claude code agent teams',
      'claude code multi agent',
      'agent teams tutorial',
      'claude code team coordination',
      'multi agent orchestration claude',
      'agent teams experimental',
      'claude code teammates',
      'claude code task management',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
      'claude-code-power-features',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'What Agent Teams Are',
        type: 'prose',
        content:
          'Agent Teams are Claude Code sessions that can talk to each other. The earlier parallel agent entries in this guide cover subagents, which are fire-and-forget. You launch a subagent, it does its task, it reports back to the parent. That is it. No communication between subagents. No shared task tracking. No coordination beyond what the parent orchestrates.\n\nAgent Teams add three things subagents do not have. First, a shared task list that every teammate can read and update. Second, direct messaging between agents, not just parent-to-child but peer-to-peer. Third, lifecycle management so the team lead can spawn, assign, monitor, and shut down teammates from a single session.\n\nThe practical difference: subagents are good for independent parallel tasks where no agent needs to know what another agent is doing. Teams are good for coordinated parallel tasks where agents need to hand off context, check each other\'s work, or adapt based on what a teammate discovered. If you have ever managed a small team of people, the mental model is identical. You assign tasks, people work in parallel, they message you with questions, you review output, and you decide when the work is done.',
      },
      {
        heading: 'Enabling and Creating a Team',
        type: 'code',
        content:
          'Agent Teams are experimental as of February 2026. Enable them by adding the environment variable to your Claude Code settings:\n\nIn ~/.claude/settings.json:\n{\n  "env": {\n    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"\n  }\n}\n\nRestart Claude Code after adding this. The feature will not activate until the next session.\n\nOnce enabled, you can ask Claude to create a team naturally or it happens through the TeamCreate tool. A team gets a name, a description, and a config file at ~/.claude/teams/{team-name}/config.json. The config tracks team members with their names, agent IDs, and roles.\n\nEach team gets a corresponding task list at ~/.claude/tasks/{team-name}/. This is the shared work tracker that every teammate can read and write to.\n\nDisplay modes matter. The default is in-process, where all teammates run in the main terminal and you use Shift+Down to cycle between them. If you have tmux or iTerm2, set "teammateMode": "tmux" in settings.json and each teammate gets its own split pane. The pane view makes it easier to monitor parallel work. You can also pass --teammate-mode on the command line for one-off sessions.',
      },
      {
        heading: 'Task Lists and Assignment',
        type: 'pattern',
        content:
          'Tasks are the coordination backbone. Every piece of work gets a task with a subject, description, status (pending, in_progress, completed), and optional dependencies.\n\nDependencies are the key feature. Task 4 can be blocked by tasks 2 and 3. That means no one picks up task 4 until both 2 and 3 are done. This enforces wave discipline automatically. You do not need to babysit the sequencing. The task list enforces it.\n\nThe workflow: the team lead creates tasks, sets dependencies, and assigns owners. Teammates check the task list after completing each piece of work to find what is available next. They claim unblocked tasks, work them, mark them complete, and check for the next one.\n\nTip: prefer assigning tasks in ID order (lowest first) when multiple are available. Earlier tasks often set up context that later tasks depend on. This is the same wave pattern from the parallel agents guide, just formalized into a task system instead of manual orchestration.',
      },
      {
        heading: 'Inter-Agent Communication',
        type: 'pattern',
        content:
          'Teammates communicate through SendMessage. Three message types exist.\n\nDirect messages go to one specific teammate by name. The researcher sends findings to the team lead. The writer asks the reviewer a question. These are the most common and cheapest messages.\n\nBroadcasts go to every teammate at once. Use these sparingly because each broadcast sends a separate message to every agent, which means N teammates equals N API calls. Valid use: a critical blocker that affects everyone. Invalid use: a status update that only the lead cares about.\n\nShutdown requests tell a teammate to wrap up and exit. The teammate can approve (and terminate) or reject with a reason. This is how you cleanly end a team session without killing processes.\n\nMessages are delivered automatically. You do not need to poll an inbox. When a teammate sends a message, it arrives in your conversation as a new turn. If you are busy mid-turn, messages queue and deliver when your turn ends.',
      },
      {
        heading: 'The Management Layer',
        type: 'pro-tip',
        content:
          'The agents are not the breakthrough. The management layer is. Without constraints, parallel agents create chaos. Two agents edit the same file and the last write wins silently. An agent makes an architectural decision that conflicts with another agent\'s assumption. A deploy goes out before all agents finish.\n\nThe management layer is a constraints file that every teammate reads before making any change. My TEAM-CONSTRAINTS.md enforces six rules:\n\n1. File ownership. One writer per file per wave. No two agents touch the same file simultaneously.\n2. Decision logging. When an agent makes a choice (naming convention, import path, data structure), it messages the team lead with a [DECISION] prefix. That decision becomes available to all teammates.\n3. Read before write. Every agent reads an existing example of whatever it is about to create. The existing code IS the style guide.\n4. Wave discipline. Foundation tasks first, consumers second, integration third, validation last. No skipping ahead.\n5. Build gate. No deploy until the build passes clean and the team lead confirms.\n6. Context before action. Every teammate gets the constraints file, a specific task description, file references, and ownership boundaries. If any are missing, the agent asks before proceeding.\n\nYou do not need my exact constraints file. You need A constraints file. The specific rules matter less than having rules at all. Without them, agents drift. With them, agents coordinate.',
      },
      {
        heading: 'Teams vs Subagents: When to Use Which',
        type: 'formula',
        content:
          'Use subagents (the Task tool) when tasks are fully independent. No agent needs output from another agent. No agent needs to check another agent\'s work. Each task has a clear input and clear output with no cross-dependencies. Example: three agents each writing a separate wiki page that does not reference the others.\n\nUse teams when tasks are coordinated. Agents need to hand off context. One agent\'s output feeds another agent\'s input. Someone needs to review before the next step starts. Example: a researcher gathers data, a writer turns it into content, a reviewer checks voice compliance, and a deploy agent pushes the result.\n\nThe cost difference matters. Teams use roughly 7x more tokens than a single session because each teammate runs its own context window. Keep teams small (2 to 4 agents), keep tasks focused, and clean up when done. Do not spin up a team for a task that one focused agent can handle.\n\nCurrent limitations to know: one team per session, no nested teams (teammates cannot spawn their own teams), the lead role is fixed (cannot transfer leadership mid-session), and session resumption does not work with in-process teammates. These are experimental constraints that will likely improve.\n\nThe decision framework: if you can describe the task in one prompt and the agent can finish without asking anyone a question, use a subagent. If the task involves handoffs, reviews, or multi-step coordination, use a team.',
      },
    ],
  },

  {
    id: 'testing-ai-features-recursive-method',
    title: 'Testing New AI Features with Recursive Drift',
    subtitle:
      'The build-test-interrogate-codify loop for staying current without getting overwhelmed',
    category: 'cli-tools',
    description:
      'A systematic method for evaluating new AI tool features using the Recursive Drift framework. Two-terminal workflow, interrogation-as-debugging, and codifying validated knowledge into reusable skills.',
    keywords: [
      'testing AI updates',
      'claude code new features',
      'AI CLI updates',
      'recursive testing method',
      'AI feature evaluation',
      'claude code testing workflow',
      'staying current with AI tools',
      'AI tool evaluation framework',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-power-features',
      'agent-teams-claude-code',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'The Problem: Feature Velocity',
        type: 'prose',
        content:
          'AI tools ship updates faster than you can learn them. Claude Code, Cursor, ChatGPT, Windsurf — they all push new features weekly. Sometimes daily. And every feature could change how you work.\n\nThe natural reaction is one of two extremes. Ignore everything and keep doing what works until it breaks. Or chase every update and never finish anything because you\'re always learning something new.\n\nBoth lose. The first person misses the feature that would have saved them 3 hours a day. The second person never ships because they\'re perpetually onboarding.\n\nYou need a middle path. A systematic way to triage, test, and integrate new features without derailing your actual work.',
      },
      {
        heading: 'The Four-Step Loop',
        type: 'pattern',
        content:
          'Build it. Test it. Interrogate it. Codify it.\n\nThese four steps are Recursive Drift applied to feature evaluation. Each step produces output that feeds the next, and the final step feeds back into your system so the next evaluation starts smarter.\n\nBuild: actually use the feature. Don\'t read the changelog and form an opinion. Open a terminal and try it. Build something real with it, not a toy example. You don\'t know if a feature works until you\'ve shipped something with it.\n\nTest: evaluate what you built. Did it work? Was it faster? Did it introduce problems? This isn\'t "does it run without errors." This is "does it make my existing workflow better or worse." Use a second context to evaluate — a different terminal, a different session, a fresh perspective.\n\nInterrogate: ask the AI about what just happened. What did the feature actually do under the hood? What are the edge cases? What did it get wrong? Copy your build output into a new session and ask it to critique itself. The AI\'s self-assessment reveals limitations the build step missed.\n\nCodify: turn validated knowledge into reusable context. Write a skill. Update a workflow. Add it to your memory files. If the feature is worth using, it\'s worth documenting in a form your future sessions can access automatically.',
      },
      {
        heading: 'The Two-Terminal Method',
        type: 'formula',
        content:
          'Terminal 1 is the builder. Terminal 2 is the evaluator. They never merge.\n\nThe split is the method. When you build and evaluate in the same session, confirmation bias takes over. The AI that built the thing will defend the thing it built. A fresh context has no attachment to the output.\n\nWorkflow:\n1. Terminal 1: start building with the new feature. Give it a real task from your actual work.\n2. Let it run. Don\'t interrupt.\n3. Terminal 2: open a new session. Paste the output from Terminal 1. Ask: "What does this do well? What are the limitations? What would break this?"\n4. Take Terminal 2\'s findings and paste them back into Terminal 1. Ask it to address the concerns.\n5. Repeat until you have a clear picture of what works and what doesn\'t.\n\nThis is the freefall-break-ask loop from Recursive Drift, externalized across two contexts. The builder freefalls. The evaluator breaks. The back-and-forth is the ask state. The separation forces honesty.',
      },
      {
        heading: 'Interrogation as Debugging',
        type: 'pro-tip',
        content:
          'The interrogation step is where most people stop too early. They test the feature, decide "it works" or "it doesn\'t," and move on. That\'s a binary when you need a spectrum.\n\nAsk the AI about what it just built. Not "did this work?" but "what assumptions did you make? what would happen if the input was 10x larger? what did you choose not to do?"\n\nCopy outputs from one session into another. Terminal 2 doesn\'t have Terminal 1\'s context, which is the point. It reads the output cold. It catches things the builder\'s context window buried.\n\nThe pattern: build in context A, evaluate in context B, synthesize in context A. This cross-pollination surfaces edge cases, performance limits, and failure modes you\'d miss in a single-context workflow.\n\nReal example: testing Agent Teams in Claude Code. Terminal 1 built a team, ran tasks, exercised the messaging system. Terminal 2 received the full output and identified that the task was actually too simple for teams — subagents would have been cheaper and faster. That evaluation became the agent-routing skill. The test of the feature produced the guardrail against its misuse.',
      },
      {
        heading: 'From Evaluation to Skill',
        type: 'pattern',
        content:
          'The interrogation phase produces raw knowledge. The codification phase turns it into infrastructure.\n\nWhen you validate that a feature works, you have three options. You can remember it and forget it by next week. You can bookmark the docs and never read them again. Or you can write it into your system — a skill file, a CLAUDE.md rule, a workflow document, a how-to entry.\n\nThe third option is the only one that compounds. Every feature you codify makes your system denser. The next session starts with that knowledge already loaded. You don\'t re-learn. You build on top of what the last session discovered.\n\nThe codification template:\n- What the feature does (one sentence)\n- When to use it vs when not to (the triage output)\n- The workflow that worked (the two-terminal findings)\n- Known limitations (from interrogation)\n- Related skills it connects to\n\nThis template is itself a product of the recursive loop. It was refined across multiple feature evaluations until the pattern stabilized.',
      },
      {
        heading: 'Triage: What Deserves the Full Loop',
        type: 'anti-pattern',
        content:
          'Not every update deserves the full loop. The goal is selective depth, not comprehensive coverage.\n\nRun the full loop when:\n- A feature maps to a known pain point in your workflow. You\'ve been working around something manually. The update might automate it.\n- A feature changes behavior you depend on. Breaking changes need immediate attention. Your existing skills and workflows may stop working.\n- A feature enables something previously impossible. New capabilities expand what you can build. These are the highest-ROI evaluations.\n\nSkip when:\n- The feature is for a use case you don\'t have. Not every update is relevant.\n- The change is cosmetic or minor. UI tweaks rarely affect output.\n- You\'re mid-sprint on a deadline. Schedule the evaluation, don\'t let it interrupt production work.\n\nThe triage takes 5 minutes. Scan the changelog. Match against your active pain points. If nothing maps, move on. If something does, run the loop. Over time you develop an instinct for which updates matter. That instinct is itself a compound skill built from running the loop enough times.',
      },
    ],
  },

  /* ================================================================== */
  /*  GEO & SEO                                                          */
  /* ================================================================== */

  {
    id: 'optimize-for-ai-citations',
    title: 'How to Optimize Your Content for AI Citations',
    subtitle: 'Structure content so ChatGPT, Perplexity, and Google AI Overviews cite you by name',
    category: 'geo-seo',
    description:
      'Step-by-step guide to Generative Engine Optimization (GEO). How to structure content so AI platforms cite your brand in generated responses, with the Answer Block pattern and entity authority strategies.',
    keywords: [
      'generative engine optimization',
      'GEO optimization',
      'AI citations',
      'how to get cited by ChatGPT',
      'AI search optimization',
      'perplexity SEO',
      'google AI overview optimization',
      'AEO optimization',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'build-content-knowledge-graph',
      'schema-markup-for-geo',
      'create-llms-txt',
      'build-content-engineering-system',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'What GEO Is and Why It Matters Now',
        type: 'prose',
        content:
          'Generative Engine Optimization is structuring your content so AI platforms cite your brand in their generated responses. Not rank your link in a list of ten. Cite you by name inside the answer. This is a fundamentally different game than traditional SEO. AI referral traffic is up 527% year over year. Gartner projects 25% of organic search traffic shifting to AI chatbots by 2026. The stat that rewired my entire content strategy: 47% of AI Overview citations come from pages ranking below position 5 in traditional search. Domain Authority correlation dropped to r=0.18 for AI citations. That means content quality and structure beat brand size. A well-built page on a small site can outperform enterprise content. This is the window.',
      },
      {
        heading: 'The Answer Block Pattern — Write for Extraction',
        type: 'pattern',
        content:
          'Every section on every page should open with a 40-60 word self-contained answer that stands alone without surrounding context. This is the answer block. AI engines scan for passages they can extract and cite verbatim. If your opening paragraph answers the question completely, you give the engine exactly what it needs.\n\nThe supporting detail follows the answer block and adds depth for human readers. But the answer block is what gets cited. Self-contained passages of 134-167 words hit the extraction sweet spot. Pages with semantic completeness scores above 8.5 out of 10 are 4.2x more likely to be cited. Adding statistics and cited sources boosts AI visibility 30-40%. Every knowledge term, how-to guide, and wiki entry on ShawnOS follows this pattern. The definition field is an answer block. The first paragraph of every section is an answer block. It is baked into the data structures, not bolted on afterward.',
      },
      {
        heading: 'Entity Authority — Make Your Brand Recognizable to AI',
        type: 'pattern',
        content:
          'Entity authority is how well AI engines recognize your brand as a known entity across the web. Sites with 15 or more recognized entities have a 4.8x higher citation probability. Building entity authority means consistent brand presence across multiple contexts: your own sites, third-party mentions, Reddit discussions, LinkedIn posts, guest contributions, and podcast appearances.\n\nThe ShawnOS approach: three sites (shawnos.ai, thegtmos.ai, thecontentos.ai) all reinforce the same entity with consistent expertise signals. Cross-site linking, shared RSS feeds, consistent author schema on every page. Every piece of content adds another node to the entity graph. The monorepo architecture makes this seamless — one shared data layer, one push, three sites updated simultaneously. You do not need three sites. You need consistent, recognizable presence across multiple surfaces.',
      },
      {
        heading: 'Measuring Your AI Visibility',
        type: 'pro-tip',
        content:
          'You cannot optimize what you cannot measure. Track AI citations manually by searching your brand name and key topics across ChatGPT, Perplexity, Google AI Overviews, and Claude. Tools like AirOps provide automated citation monitoring and share-of-voice tracking across AI engines. Their MCP server integrates directly into your development workflow for real-time visibility data.\n\nThe metrics that matter: citation rate (how often you are cited when your topic is discussed), citation accuracy (whether the AI attributes correctly), and citation freshness (whether it cites your latest content or a stale version). Track these monthly. Content not refreshed quarterly is 3x more likely to lose its AI citations. Freshness is not optional — it is a ranking signal.',
      },
    ],
  },

  {
    id: 'build-content-knowledge-graph',
    title: 'How to Build a Content Knowledge Graph',
    subtitle: 'Turn scattered content into an interconnected system that compounds authority',
    category: 'geo-seo',
    description:
      'How to architect a content knowledge graph using the Keyword Nugget Pattern and topic clusters. Turn individual pages into an interconnected system where every piece strengthens every other piece.',
    keywords: [
      'content knowledge graph',
      'keyword nugget pattern',
      'topic cluster architecture',
      'internal linking strategy',
      'content architecture',
      'SEO content structure',
      'content engineering system',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'optimize-for-ai-citations',
      'build-content-engineering-system',
      'schema-markup-for-geo',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'What a Content Knowledge Graph Is',
        type: 'prose',
        content:
          'A content knowledge graph is a structured network of content where every piece is a node and every cross-reference is an edge. It is the opposite of a flat blog where posts exist in isolation. In a knowledge graph, a definition page links to a how-to guide that links to a blog post that links to a comparison page that links back to the definition. Every node strengthens every other node. AI engines love this because it signals comprehensive coverage and topical authority.\n\nIn ShawnOS, the knowledge graph is literal. TypeScript data objects in engineering-terms.ts, how-to-wiki.ts, content-wiki.ts, and context-wiki.ts are the nodes. The related arrays are the edges. Template-driven pages render the graph into HTML. Programmatic internal linking connects every mention of a term to its definition page automatically. The graph is not a metaphor. It is the data structure.',
      },
      {
        heading: 'The Keyword Nugget Pattern — One Concept Becomes Five Pages',
        type: 'pattern',
        content:
          'Take one concept. Create five or more interconnected pages from it. A knowledge term defines it. A how-to guide teaches it. A blog post tells the story of building it. A wiki entry provides the complete reference. A comparison page positions it against alternatives. Each page targets different search intents for the same underlying concept.\n\nExample: "Lead Scoring" becomes a knowledge term (definition and why it matters), a how-to guide (how to build a lead scoring model), a blog post (why we rebuilt our lead scoring in 2026), a wiki entry (complete reference guide), and a comparison page (lead scoring vs intent data). All five pages cross-link to each other. The knowledge term accumulates authority from every piece that references it. This is a self-reinforcing loop that compounds over time.',
      },
      {
        heading: 'Topic Cluster Architecture — Three Pillars',
        type: 'pattern',
        content:
          'Topic clusters organize your knowledge graph into pillars. Each pillar covers a broad topic. Supporting cluster pages go deep on subtopics. Every cluster page links back to the pillar and to sibling pages.\n\nShawnOS runs three pillars for GEO and content engineering:\n\n1. GEO (Generative Engine Optimization) — what GEO is, GEO vs SEO vs AEO, how AI engines source content, ranking factors, content extractability, entity authority, schema markup for GEO, monitoring tools.\n\n2. Content Engineering — what it is, knowledge graph architecture, topic cluster design, internal linking, the keyword nugget pattern, content types hierarchy, programmatic content systems, building your own content OS.\n\n3. SEO in the AI Era — technical SEO foundation, schema markup guide, RSS and feed optimization, robots.txt for AI crawlers, llms.txt implementation, content freshness signals.\n\nEach pillar has 8-10 supporting pages. The pillar page links to all of them. They all link back.',
      },
      {
        heading: 'Internal Linking That Creates Authority Loops',
        type: 'formula',
        content:
          'The formula: every mention of a defined term anywhere on your site should link to that term\'s definition page. Every definition page should link to the how-to guide, the wiki entry, and any blog post that covers the same concept. Every how-to guide should reference the terms it teaches. This creates loops where authority flows continuously between pages.\n\nIn a monorepo with shared data, this is programmatic. A component scans page content for term names and auto-links them. The related array on every data entry defines explicit connections. Cross-site links between shawnos.ai, thegtmos.ai, and thecontentos.ai extend the graph across domains. The result: adding one new knowledge term automatically creates links from every page that mentions that term. The graph grows itself.',
      },
    ],
  },

  {
    id: 'schema-markup-for-geo',
    title: 'How to Set Up Schema Markup for GEO',
    subtitle: 'Tell AI engines exactly what your content is with structured data',
    category: 'geo-seo',
    description:
      'How to implement schema markup that helps AI engines extract and cite your content. DefinedTerm, HowTo, FAQPage, BlogPosting, and the JSON-LD patterns that increase AI citation likelihood.',
    keywords: [
      'schema markup GEO',
      'JSON-LD for AI',
      'structured data SEO',
      'DefinedTerm schema',
      'HowTo schema markup',
      'FAQPage schema',
      'schema markup Next.js',
      'structured data for AI citations',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'optimize-for-ai-citations',
      'create-llms-txt',
      'build-content-knowledge-graph',
    ],
    sections: [
      {
        heading: 'Why Schema Matters for AI Engines',
        type: 'prose',
        content:
          'Schema markup is structured data embedded in your pages using JSON-LD that tells machines what kind of content they are looking at. Without schema, an AI engine has to guess whether a page is a definition, a tutorial, a blog post, or a product page. With schema, you tell it explicitly. Pages with 3 or more schema types have roughly 13% higher citation likelihood from AI engines. 96% of AI Overview citations come from sources with strong E-E-A-T signals, and schema is how you make those signals machine-readable. This is not optional for GEO. It is infrastructure.',
      },
      {
        heading: 'Schema Types by Content Type',
        type: 'code',
        content:
          'Match your schema to your content type. Knowledge terms and glossary entries use DefinedTerm or Article plus FAQPage plus BreadcrumbList. How-to guides use HowTo with step elements plus BreadcrumbList. Wiki entries use TechArticle or Article plus FAQPage. Blog posts use BlogPosting with author and datePublished. Every page on every site should also include Organization, Person (for the author), and WebSite schemas.\n\nThe schema-dts npm package gives you TypeScript types for all schema.org vocabulary. Install it and you get autocomplete and type checking for every schema property. No more guessing whether it is datePublished or publishDate. The types enforce correctness at build time.',
      },
      {
        heading: 'Implementing Schema in Next.js with JSON-LD',
        type: 'code',
        content:
          'In Next.js, inject JSON-LD schema as a script tag in your page or layout component. Create a reusable component that takes typed schema data and renders the script tag. In ShawnOS, the schema is generated from the same TypeScript data objects that render the page content. The knowledge term data object contains the name, definition, and related terms. The schema component reads those same fields and outputs a DefinedTerm JSON-LD block.\n\nThis means schema and content can never drift apart. When you update a definition in engineering-terms.ts, the schema updates automatically on the next build. No manual sync. No separate CMS field for schema data. One source of truth rendered two ways: once as visible content, once as invisible structured data.',
      },
      {
        heading: 'Testing and Validating Your Schema',
        type: 'pro-tip',
        content:
          'Use Google\'s Rich Results Test to validate individual pages. Use the Schema Markup Validator for comprehensive checks against the schema.org specification. Run both after every deploy that changes content structure. Common mistakes: missing required fields (HowTo needs at least one step element), mismatched types (using Article when DefinedTerm is more specific), and orphaned schema (structured data that does not match visible page content). Google explicitly warns against schema that does not reflect what users see on the page. Schema should describe your content, not invent content that does not exist.',
      },
    ],
  },

  {
    id: 'create-llms-txt',
    title: 'How to Create an llms.txt File',
    subtitle: 'Give AI assistants a machine-readable map of your site content',
    category: 'geo-seo',
    description:
      'How to create an llms.txt file that helps LLMs and AI assistants discover and understand your site content. Format, structure, placement, and best practices.',
    keywords: [
      'llms.txt',
      'llms txt file',
      'LLM site discovery',
      'AI content discovery',
      'llms.txt format',
      'how to create llms.txt',
      'AI assistant site map',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'optimize-for-ai-citations',
      'schema-markup-for-geo',
      'build-content-engineering-system',
    ],
    sections: [
      {
        heading: 'What llms.txt Is and Why It Exists',
        type: 'prose',
        content:
          'llms.txt is a machine-readable file that sits at your site root and helps LLMs and AI assistants understand what your site contains and how it is organized. Think of it as robots.txt for AI comprehension. robots.txt tells crawlers what they can access. llms.txt tells AI assistants what is actually there and what it is about. When an AI assistant encounters your domain, llms.txt gives it instant context — site description, content types, feed URLs, key topics. It is a small text file with outsized impact on AI discoverability. The format is simple markdown with a few conventions.',
      },
      {
        heading: 'The llms.txt Format and Structure',
        type: 'code',
        content:
          'The file follows a simple markdown structure. Start with a level-one heading containing your site name. Add a blockquote with a one-sentence description. Then use level-two headings to organize sections: About (author, tech stack, network), Content Types (paths and descriptions for each content type), Feeds (RSS and other feed URLs), and Key Topics (bulleted list of what your site covers).\n\nKeep it concise. This is not a full sitemap. It is a high-level content map that helps AI assistants decide whether your site is relevant to a query and where to look for specific types of information. Each content type entry should include the URL path and a brief description of what lives there. Feed URLs help AI assistants discover your latest content without crawling every page.',
      },
      {
        heading: 'Where to Put It and How to Test It',
        type: 'pattern',
        content:
          'Place llms.txt in your public directory so it is served at yourdomain.com/llms.txt. In a Next.js app, that means the public/ folder at the app root. In ShawnOS, each of the three sites has its own llms.txt tailored to that site\'s content. shawnos.ai/llms.txt maps the blog, knowledge base, how-to wiki, daily logs, and all wiki sections. thegtmos.ai/llms.txt maps the GTM knowledge base and Clay wiki. thecontentos.ai/llms.txt maps the content wiki.\n\nTest it by navigating to the URL in your browser. You should see the raw markdown text. Then test it by asking an AI assistant about your site and checking whether it references the content types and structure described in your llms.txt. The file is not widely standardized yet, but early adoption means you are indexed before the standard becomes crowded.',
      },
    ],
  },

  {
    id: 'build-content-engineering-system',
    title: 'How to Build Your Own Content Engineering System',
    subtitle: 'Own the pipeline end to end — no CMS, no vendor lock-in, total control',
    category: 'geo-seo',
    description:
      'How to build a content engineering system you fully control. Monorepo architecture, TypeScript data objects as content graph, programmatic RSS feeds, automated schema, and hyper-speed iteration.',
    keywords: [
      'content engineering system',
      'build your own CMS',
      'monorepo content architecture',
      'programmatic content',
      'content pipeline automation',
      'TypeScript content management',
      'content OS',
      'content engineering vs CMS',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'build-content-knowledge-graph',
      'optimize-for-ai-citations',
      'schema-markup-for-geo',
      'create-llms-txt',
      'build-sqlite-content-index',
      'build-remotion-video-system',
    ],
    sections: [
      {
        heading: 'Why Owning the System Beats Using a Platform',
        type: 'prose',
        content:
          'The win is not any single tool. It is building a system you fully control that gives you complete refinement over your content engineering pipeline at hyper speed. A CMS gives you a form and a publish button. A content engineering system gives you a codebase where every content type is a TypeScript interface, every page is a template, every link is programmatic, and every deploy updates three sites simultaneously. You change one data file and the knowledge base, RSS feeds, sitemaps, and schema markup all update in one push. No manual steps. No platform limitations. No vendor lock-in. Your knowledge graph is an asset you own, stored in version-controlled TypeScript files, not trapped in a SaaS database you cannot export from.',
      },
      {
        heading: 'The Monorepo Architecture — Shared Packages Across Three Sites',
        type: 'pattern',
        content:
          'ShawnOS is a Turborepo monorepo with three Next.js apps (shawnos.ai, thegtmos.ai, thecontentos.ai) and a shared package. The shared package holds everything that crosses site boundaries: components, data files, RSS feed infrastructure, type definitions, and utility functions. Each app imports from the shared package. One component library, one data layer, one set of types.\n\nThis means a new knowledge term added to engineering-terms.ts is immediately available on all three sites. A schema component update propagates everywhere. An RSS feed enhancement works across all feeds. The monorepo eliminates duplication and ensures consistency. You do not need three sites to benefit from this pattern. Even a single site gains from separating data, components, and app configuration into distinct packages.',
      },
      {
        heading: 'Data Files as Content Graph — TypeScript Objects Not CMS',
        type: 'code',
        content:
          'Every piece of content in ShawnOS is a TypeScript object in a data file. Knowledge terms are objects with name, definition, whyItMatters, howYouUseIt, and related fields. Wiki entries have id, title, subtitle, category, description, keywords, sections, and related fields. The TypeScript interfaces enforce structure at build time. You cannot publish a knowledge term without a definition. You cannot create a wiki entry without sections.\n\nThis is the content graph. The data files are the nodes. The related arrays and cross-references are the edges. Template-driven pages read the data and render HTML. You never write HTML directly. You write data and the system renders it. Adding a new content type means defining a new interface and a new template. The system scales horizontally without complexity growth.',
      },
      {
        heading: 'RSS Feed Infrastructure — Seven Feeds Auto-Generated',
        type: 'pattern',
        content:
          'The RSS infrastructure lives in packages/shared/lib/rss/. It uses the feed npm package to generate RSS 2.0, Atom 1.0, and JSON Feed 1.1 from the same data objects that render pages. Content source functions convert each data type (blog posts, wiki entries, knowledge terms, daily logs) into standardized FeedItem objects. A merge utility deduplicates and sorts items by date.\n\nshawnos.ai serves seven feeds: blog, all content, knowledge terms, how-to guides, daily logs, Nio terminal logs, and updates. Each feed is a Next.js route handler that calls getFeedConfig, converts the relevant data to feed items, and returns a Response with correct Content-Type and Cache-Control headers. Adding a new feed takes five lines of code. The entire feed infrastructure regenerates on every deploy because the data files are the source of truth.',
      },
      {
        heading: 'The Result: Hyper-Speed Iteration with Complete Control',
        type: 'pro-tip',
        content:
          'The end state is a system where adding content is adding data, not navigating a CMS. I open engineering-terms.ts, add a new term object, save the file, and push. On deploy, that term appears on the knowledge page, gets its own anchor link, appears in the RSS feed, gets schema markup, shows up in the sitemap, and is available for programmatic internal linking from every page that mentions it. Total time: under two minutes.\n\nThis is the competitive advantage tools like AirOps complement but cannot replace. AirOps is excellent for competitive intelligence, citation monitoring, and share-of-voice tracking. Use it for visibility into how your content performs across AI engines. But the system itself — the content graph, the templates, the automation, the feeds, the schema pipeline — that is yours. Own the system. Use tools to monitor it. The system is the moat.',
      },
    ],
  },

  /* ================================================================== */
  /*  CLI TOOLS — VIDEO + INDEX                                          */
  /* ================================================================== */

  {
    id: 'build-remotion-video-system',
    title: 'How to Build a React Video Rendering System with Remotion',
    subtitle:
      'No GPU, no After Effects — React components that render to MP4 inside your monorepo',
    category: 'cli-tools',
    description:
      'How to build a programmatic video rendering pipeline using Remotion and React. Scene-based architecture, multi-aspect-ratio output, deterministic animation with Perlin noise, and monorepo integration with shared design tokens.',
    keywords: [
      'remotion react video',
      'programmatic video rendering',
      'react video system',
      'remotion monorepo',
      'multi-aspect-ratio video',
      'deterministic animation',
      'react video pipeline',
      'remotion tutorial',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'build-content-engineering-system',
      'build-sqlite-content-index',
    ],
    sections: [
      {
        heading: 'What Remotion Is and Why It Fits',
        type: 'prose',
        content:
          'Remotion is a React framework that renders video frame by frame. You write JSX components. Remotion evaluates each frame at your target FPS and encodes the result to MP4, WebM, or GIF. No GPU required. No timeline editor. No After Effects. The entire pipeline runs in Node.js on a standard laptop. The key advantage for a monorepo setup is that video components can import the same shared packages as your websites. Design tokens, data objects, color palettes, and type definitions are shared across the entire codebase. Change a hex value in the shared package and the websites and videos all update on the next build.',
      },
      {
        heading: 'Multi-Aspect-Ratio Architecture',
        type: 'pattern',
        content:
          'Define aspect ratio presets as a constant object: linkedin (1080x1350, 4:5), reels (1080x1920, 9:16), landscape (1920x1080, 16:9). Create a useScale() hook that normalizes all rendering to a base resolution (1080x1350) and scales proportionally. Each brand gets three compositions in Root.tsx — one per aspect ratio — sharing the same component tree. Nine total compositions from one codebase: three brands times three formats. The composition registry is the single source of truth for what gets rendered. Adding a new brand means adding three lines to Root.tsx, not rebuilding any components.',
      },
      {
        heading: 'Scene-Based Composition with TransitionSeries',
        type: 'code',
        content:
          'Each video is a sequence of scenes connected by TransitionSeries from @remotion/transitions. Each scene is a React component with a fixed frame count defined in a central timing config file. The V3 timing config defines four scenes totaling 310 frames at 30fps (roughly 10 seconds): Hook (36 frames), BootWikiBlitz (110 frames), Progression (100 frames), CtaNetwork (94 frames), with 10-frame overlaps between scenes for smooth transitions. The timing file is the single control point for video rhythm. Changing one number changes the entire pacing without touching any component code.',
      },
      {
        heading: 'Deterministic Animation with Perlin Noise',
        type: 'pattern',
        content:
          'Remotion requires deterministic rendering. Math.random() produces different values per frame and breaks the render. The solution is Perlin noise from @remotion/noise. The noise2D function takes a seed string, x, and y coordinates and returns a deterministic float. Seed the noise by component instance (column index, particle index) and drive it with the frame number. MatrixRain uses noise for character selection, column drift, and opacity shimmer. ParticleField uses two independent noise streams for x and y drift plus a third for pulse. TypewriterText uses simple frame math for character reveal. Same seed, same output, every render. Organic animation that is fully reproducible.',
      },
      {
        heading: 'SceneWrapper and Visual Treatment',
        type: 'pattern',
        content:
          'A SceneWrapper component applies consistent visual treatment to every scene: dark canvas background, radial vignette for edge darkening, accent color wash at low opacity, ambient particle field, film grain via SVG feTurbulence, and scanline overlay for a CRT aesthetic. The wrapper accepts an accent color prop that tints the entire scene. The BootWikiBlitz scene cycles through the brand palette as wiki cards flip — green, teal, amber, purple — giving each card a distinct feel while maintaining visual consistency. Design tokens live in a tokens.ts file that maps brand names to colors and defines the shared font stack.',
      },
      {
        heading: 'Rendering and Deployment Pipeline',
        type: 'pro-tip',
        content:
          'Run npm run render:all to generate all nine variants. Remotion renders each composition to frames then encodes to MP4. Outputs go to website/apps/video/out/ and get deployed to each site public/video/ directory. The SQLite content index tracks all video files with their brand, aspect ratio, format, and deployment status. The entire pipeline runs locally on a MacBook. No cloud render farm. No external service. The monorepo CI can trigger renders on push if needed, but for iteration speed, local rendering at 30fps for 10-second videos takes seconds, not minutes.',
      },
    ],
  },

  {
    id: 'build-sqlite-content-index',
    title: 'How to Build a SQLite Content Index for Your Repo',
    subtitle:
      'Turn your file system into a queryable database with zero external dependencies',
    category: 'cli-tools',
    description:
      'How to build a SQLite content index that makes your entire repo queryable. Multi-platform content parsing, cross-reference detection, asset inventory, and a CLI query interface — all with Python stdlib only.',
    keywords: [
      'sqlite content index',
      'repo content database',
      'content management sqlite',
      'query content files',
      'content index cli',
      'cross-platform content links',
      'dead page detection',
      'content audit tool',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'build-content-engineering-system',
      'build-remotion-video-system',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'Why a SQLite Index for Content',
        type: 'prose',
        content:
          'A repo with 100+ content files across 6 platforms becomes opaque. The file system organizes files by path but cannot answer questions like: how many posts went final this week, which content has cross-platform siblings, or what is the total word count for February. A SQLite database sitting alongside the repo gives you SQL queries over your content without changing the source of truth. The index is derived data — rebuilt from git-tracked files on every run. Delete the database, run the script, get the same result. Zero external dependencies. Python stdlib only: json, sqlite3, pathlib, re.',
      },
      {
        heading: 'Schema Design — Nine Tables',
        type: 'code',
        content:
          'The schema covers every content type in the repo. The content table holds every draft and final across all platforms with fields for platform, stage, title, slug, date, pillar, arc, series, and word count. daily_logs tracks performance metrics. sessions is append-only and survives index rebuilds — historical records, not derived data. skills indexes the Claude and Cursor skill registry. content_links stores the relationship graph with two link types: series_sibling (auto-detected) and cross_platform_note (parsed from content). assets catalogs visual assets with structured metadata parsed from filenames. videos and thumbnails track the video pipeline. The schema design principle: every table maps to a content type, every row is derived from a file, every rebuild is idempotent.',
      },
      {
        heading: 'Metadata Parsing — Two Formats',
        type: 'pattern',
        content:
          'Content files use two metadata formats. Most platforms use blockquote syntax: > **Key**: Value at the top of the file. Website posts use YAML frontmatter between --- delimiters. The parser detects the format automatically and extracts structured fields. Title is extracted from metadata or falls back to the first # heading. Word count strips frontmatter before counting. The dual-format parser means you do not need to standardize your entire content repo to one format. Meet the content where it is.',
      },
      {
        heading: 'Cross-Platform Link Detection',
        type: 'pattern',
        content:
          'The index discovers relationships between content files automatically. Implicit sibling detection matches files with identical (date, slug) across platforms and creates series_sibling links. If you have linkedin/final/2026-02-17_build-your-own-os.md and substack/final/2026-02-17_build-your-own-os.md, the index links them without manual annotation. Explicit cross-reference detection parses Cross-Platform Notes sections, looks for platform keywords with aliases, and matches to existing content by date and platform. This creates a queryable content graph showing how pieces relate across your publishing pipeline.',
      },
      {
        heading: 'Asset and Video Inventory',
        type: 'code',
        content:
          'Filename patterns encode structured metadata. The asset parser extracts type, tier, class, variant, and size from filenames like tier-3-idle-256.gif or class-alchemist-static.png. The video parser extracts brand, aspect ratio, and format from filenames like contentos-landscape or gtmos-linkedin-4x5. Brand aliases handle variations — lead-magnet maps to shawnos, for example. The result is a queryable inventory of every visual asset in the repo without manual cataloging. Run a query to find all tier-3 idle animations for shawnos. Run another to find deployed videos missing from a specific site.',
      },
      {
        heading: 'Dead Page Detection and Content Gaps',
        type: 'pro-tip',
        content:
          'Query the content table for files with zero inbound links from content_links — those are orphans, content that exists but nothing points to. Query for files with zero outbound links — those are dead ends that do not connect forward. The most powerful use is gap detection: query for expected topics that have zero coverage. This is how the index revealed its own gap. Three major systems shipped with no blog coverage. The tool that finds content gaps found content gaps about the tool. Use the index as a content audit instrument, not just a catalog. Run it weekly. Let the queries tell you what to write next.',
      },
    ],
  },

  {
    id: 'content-cluster-strategy',
    title: 'How to Design a Content Cluster Strategy Across Multiple Sites',
    subtitle:
      'Hub-and-spoke topology, canonical routing, and cross-site linking that compounds authority',
    category: 'geo-seo',
    description:
      'How to design a content cluster strategy that spans multiple websites. Hub-and-spoke topology, taxonomy-driven routing, canonical site designation, bidirectional cross-linking, and breadcrumb schema that tells AI engines exactly how your content connects.',
    keywords: [
      'content cluster strategy',
      'hub and spoke content',
      'multi-site content architecture',
      'cross-site linking SEO',
      'content topology',
      'canonical site routing',
      'breadcrumb schema markup',
      'topic cluster architecture',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'build-content-knowledge-graph',
      'build-content-engineering-system',
      'optimize-for-ai-citations',
    ],
    sections: [
      {
        heading: 'What a Content Cluster Topology Is',
        type: 'prose',
        content:
          'A content cluster topology is the deliberate architecture of how content connects within and across websites. Individual pages are nodes. Cross-references and internal links are edges. The topology determines how authority flows through the graph. A flat blog with no internal links is a collection of disconnected nodes — each page starts from zero. A cluster topology with bidirectional links, shared vocabulary, and explicit hierarchy creates a graph where every new page strengthens every existing page. AI engines evaluate topical authority by measuring this graph. Sites with comprehensive, interconnected coverage of a topic get preferential citation.',
      },
      {
        heading: 'Hub-and-Spoke Model',
        type: 'pattern',
        content:
          'Define one parent concept as the hub. Branch specialized verticals as spokes. The hub site covers the meta-narrative — the process of building. Spoke sites cover the outputs — what the process produces. In a three-site architecture: the hub (shawnos.ai) covers building with AI and the system-building journey. Spoke one (thegtmos.ai) covers the GTM workflows the system produces. Spoke two (thecontentos.ai) covers the content methodology the system demonstrates. The recursive structure is the point. Each site content proves the other two sites thesis. The act of building IS the hub content. The workflows produced ARE spoke one content. The methodology of creating content IS spoke two content.',
      },
      {
        heading: 'Taxonomy-Driven Routing',
        type: 'code',
        content:
          'Define the topology in a version-controlled taxonomy file, not in someone head. Map every content pillar to a domain. Map routing rules explicitly: personal stories route to the hub, GTM systems route to spoke one, content strategy routes to spoke two. Cross-domain posts get a primary domain plus cross-links to siblings. The taxonomy file becomes the single source of truth for content placement. Any team member, any AI agent, any automation skill can read the file and know where content belongs. Status lifecycle (draft, review, final, published, archived) applies uniformly across all domains.',
      },
      {
        heading: 'Canonical Site Designation',
        type: 'pattern',
        content:
          'Every shared content entry gets a canonicalSite field designating which domain renders it natively. When a how-to guide has canonicalSite set to gtmos, it renders on thegtmos.ai and generates a redirect from shawnos.ai. The hub does not duplicate spoke content — it routes to it. This prevents duplicate content penalties while maintaining the cross-site graph. All three sites import the same TypeScript data package. The canonical designation is a field on the data object, not a DNS or CMS configuration. Adding a new cross-site entry means setting one field. The monorepo handles the rest.',
      },
      {
        heading: 'Bidirectional Cross-Linking',
        type: 'pattern',
        content:
          'Every new entry must link to existing related entries. Every existing entry that relates to the new one must link back. This creates bidirectional edges in the content graph. No dead ends, no orphans. The implementation is simple: related arrays on every data object. When you add a new how-to guide, populate its related array with existing guide IDs. Then update those existing guides to include the new ID in their related arrays. The template pages render these arrays as clickable links. Programmatic internal linking handles mention-level connections. The result is a graph where you can reach any node from any other node within two or three clicks.',
      },
      {
        heading: 'Breadcrumb Schema for AI Engines',
        type: 'pro-tip',
        content:
          'Breadcrumbs are not just navigation — they are topology signals. BreadcrumbList schema markup in JSON-LD tells search engines and AI engines exactly where a page sits in your hierarchy. A how-to guide on gtmos gets breadcrumbs: GTMOS, How-To, Content Cluster Strategy. This communicates that gtmos is the authority site for this topic. Cross-site breadcrumbs tell AI engines that the hub and spokes are part of one entity. Combined with sameAs schema connecting the three domains, the breadcrumb hierarchy signals a multi-site cluster, not three independent blogs. AI engines with 15 or more recognized entities have 4.8x higher citation probability. The cluster architecture is how you build entity count.',
      },
    ],
  },

  {
    id: 'parallel-session-handoffs',
    title: 'Parallel-Safe Session Handoffs',
    subtitle: 'Stop losing context when multiple terminals write at the same time',
    category: 'parallel-agents',
    description:
      'How to upgrade from a single context handoff file to a parallel-safe directory-based system. Timestamped writes, read-all-on-start, mark-done consumption, and auto-cleanup. The pattern that makes 6 simultaneous Claude Code sessions stop overwriting each other.',
    keywords: [
      'parallel context handoffs',
      'claude code handoff system',
      'parallel agent context',
      'session handoff architecture',
      'context handoff race condition',
      'multi-terminal claude code',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
      'agent-teams-claude-code',
    ],
    sections: [
      {
        heading: 'The Problem with One Handoff File',
        type: 'prose',
        content:
          'The default context handoff pattern is a single file at a known path. ~/.claude/context-handoff.md or similar. Every session reads it on start and writes it on end. This works when you run one terminal at a time. It silently breaks the moment you run two. Terminal A writes its handoff. Terminal B overwrites it 30 seconds later. Terminal A\'s context is gone and you never notice because the file still exists. It just has the wrong content. This is a last-write-wins race condition. If you run 4 to 6 terminals like I do, you lose 3 to 5 sessions of context every day. The system looks healthy because a handoff file is always there. The damage is invisible until a morning session picks up with half the context missing.',
      },
      {
        heading: 'Setting Up the Handoffs Directory',
        type: 'code',
        content:
          'Step 1: Create the directory.\n\nmkdir -p ~/.claude/handoffs\n\nStep 2: Add the naming convention. Every handoff file uses this format:\n\n~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md\n\nThe timestamp is second-precise. The slug is a short description of the session work. Examples:\n\n2026-02-27_143022_blog-pipeline-fix.md\n2026-02-27_143055_wiki-entry-batch.md\n2026-02-27_144501_deploy-verification.md\n\nStep 3: Update your CLAUDE.md with the new instructions. Add these rules to the session workflow section:\n\nOn session start: read all unconsumed handoffs from ~/.claude/handoffs/. Skip any file ending in _done.md. After reading, rename each file from .md to _done.md.\n\nOn session end: write a new handoff to ~/.claude/handoffs/ using the timestamp naming convention. Never overwrite another file.',
      },
      {
        heading: 'Reading and Consuming Handoffs',
        type: 'pattern',
        content:
          'On session start, the agent does three things in order.\n\nFirst, list all unconsumed handoffs:\nls ~/.claude/handoffs/*.md 2>/dev/null | grep -v \'_done.md$\'\n\nSecond, read each file and merge the context. If there are three unconsumed handoffs from three different terminals, the new session gets all three. Nothing is lost.\n\nThird, mark each file as consumed by renaming it:\nmv file.md file_done.md\n\nThe _done.md suffix is the consumption marker. Future sessions skip these files. The original content stays on disk for reference. No data is deleted during consumption, only renamed.\n\nThis pattern means it does not matter how many terminals wrote handoffs overnight. The morning session reads every single one. Context from all parallel sessions merges into one starting point.',
      },
      {
        heading: 'Auto-Cleanup',
        type: 'code',
        content:
          'Consumed handoffs accumulate. Without cleanup, the directory grows forever. Add a cleanup step that runs on session start, after reading and consuming:\n\nfind ~/.claude/handoffs -name \'*_done.md\' -mtime +7 -delete 2>/dev/null\n\nThis deletes consumed handoffs older than 7 days. Unconsumed handoffs are never deleted. The 7-day window gives you enough history to debug if something went wrong. Adjust the window based on how often you reference old handoffs.\n\nThe full CLAUDE.md instruction block:\n\nOn Session Start:\n1. Read all unconsumed handoffs: ls ~/.claude/handoffs/*.md 2>/dev/null | grep -v \'_done.md$\'\n2. Also check legacy location: ~/.claude/context-handoff.md\n3. After reading, mark each consumed: rename file.md to file_done.md\n4. Clean up old consumed handoffs: find ~/.claude/handoffs -name \'*_done.md\' -mtime +7 -delete\n\nOn Session End:\nWrite handoff to ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md. Never overwrite another session\'s handoff.',
      },
      {
        heading: 'Upgrading Your Memory Files',
        type: 'pro-tip',
        content:
          'While upgrading handoffs, upgrade your memory files too. The same flat-file problem applies. A single MEMORY.md that every session reads and writes will grow until it hits the context window limit. At 200+ lines, the model starts ignoring the bottom half.\n\nThe fix is an index pattern. Keep MEMORY.md as a lean index under 200 lines. It has section headers and one-line summaries. Detailed notes live in topic files: identity.md, voice-rules.md, infrastructure.md, completed-work.md. MEMORY.md links to them. Sessions only load a topic file when the current task is relevant.\n\nThis mirrors how the handoff directory works. Instead of one file that does everything, you have structured files that load on demand. The index is always in context. The details load when needed. Both upgrades follow the same principle: stop putting everything in one file and start using structure to manage scale.',
      },
    ],
  },

  /* ================================================================== */
  /*  SECURITY                                                           */
  /* ================================================================== */

  {
    id: 'env-files-explained',
    title: 'Environment Files Explained',
    subtitle: 'What .env files are, why they matter, and how to set them up without leaking secrets',
    category: 'security',
    description:
      'Complete guide to .env files for developers and builders. What environment variables are, how to create and manage .env files, security best practices, and the mistakes that get secrets leaked to GitHub.',
    keywords: [
      'env file',
      '.env file',
      '.env files',
      'environment files',
      'what is env file',
      'what is a .env file',
      'environment variables',
      'env file setup',
      'dotenv',
      'env file security',
      'env file gitignore',
      'how to use env files',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'constraints-and-context-engines',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'What an .env File Actually Is',
        type: 'prose',
        content:
          'An .env file is a plain text file that stores configuration values your application needs to run. API keys, database passwords, service URLs, feature flags. One key-value pair per line. No quotes needed (though some parsers accept them). No special syntax.\n\nThe file sits in your project root and never gets committed to Git. Your code reads from it using process.env.VARIABLE_NAME in Node.js or os.environ in Python. The values exist only on your machine. Your teammate has their own .env with their own keys. Production has its own set on the hosting platform.\n\nThe name starts with a dot, which makes it a hidden file on Mac and Linux. That is intentional. It should not be visible by default because it contains secrets.',
      },
      {
        heading: 'Why You Need One',
        type: 'pattern',
        content:
          'Three problems .env files solve.\n\nFirst, security. API keys hardcoded in source files end up on GitHub. Bots scrape public repos for exposed keys within minutes of a push. AWS keys get stolen. Stripe keys get stolen. It happens constantly. .env files keep secrets out of version control entirely.\n\nSecond, portability. Your local machine, your staging server, and your production server all need different database URLs, different API endpoints, different feature flags. Same codebase, different environment variables. You deploy the same code everywhere and the .env file tells it how to behave.\n\nThird, collaboration. Your teammate uses their own API keys. Your CI pipeline uses service account keys. Nobody shares credentials through Slack or email. Everyone has their own .env file with their own values.',
      },
      {
        heading: 'Setting One Up',
        type: 'code',
        content:
          'Step 1: Create the file in your project root.\n\ntouch .env\n\nStep 2: Add your variables. One per line. No spaces around the equals sign.\n\nAPI_KEY=sk_live_abc123\nDATABASE_URL=postgres://user:pass@localhost:5432/mydb\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\nDEBUG=true\n\nStep 3: Add .env to your .gitignore immediately. This is non-negotiable.\n\necho ".env" >> .gitignore\necho ".env.local" >> .gitignore\necho ".env*.local" >> .gitignore\n\nStep 4: Install a loader if your framework does not have one built in. Next.js loads .env files automatically. For other Node.js projects, use dotenv:\n\nnpm install dotenv\n\nThen at the top of your entry file:\n\nrequire(\'dotenv\').config()\n\nStep 5: Access variables in your code.\n\nNode.js: process.env.API_KEY\nPython: os.environ.get(\'API_KEY\')\nNext.js (client-side): process.env.NEXT_PUBLIC_SITE_URL\n\nThe NEXT_PUBLIC_ prefix in Next.js means the variable is exposed to the browser. Without that prefix, it stays server-side only. This matters. Do not put secret keys behind NEXT_PUBLIC_.',
      },
      {
        heading: 'The .env File Hierarchy',
        type: 'pattern',
        content:
          'Most frameworks support multiple .env files with a loading priority. Next.js loads them in this order, with later files overriding earlier ones:\n\n.env (base defaults, committed to repo if no secrets)\n.env.local (local overrides, never committed)\n.env.development (only in dev mode)\n.env.development.local (local dev overrides)\n.env.production (only in production builds)\n.env.production.local (local production overrides)\n\nThe .local files always override non-local files. The environment-specific files override the base .env. This lets you commit safe defaults in .env while keeping secrets in .env.local.\n\nA common pattern: .env has NEXT_PUBLIC_SITE_URL=https://yoursite.com as the production default. .env.local overrides it to http://localhost:3000 for local development. No code changes needed to switch between environments.',
      },
      {
        heading: 'The Mistakes That Leak Secrets',
        type: 'pro-tip',
        content:
          'Mistake 1: Forgetting to add .env to .gitignore before the first commit. Once a file is tracked by Git, adding it to .gitignore later does not remove it from history. You need git rm --cached .env to untrack it, then force push. If you already pushed to a public repo, rotate every key in that file immediately. The old keys are in Git history forever.\n\nMistake 2: Using NEXT_PUBLIC_ prefix on secret keys. NEXT_PUBLIC_STRIPE_SECRET_KEY is visible in the browser bundle. Anyone can inspect it. Only use the public prefix for values that are safe to expose, like your site URL or a public API key.\n\nMistake 3: Sharing .env files through Slack or email. Use a password manager, a secrets vault, or a secure sharing tool. .env files in chat histories get indexed, cached, and backed up in places you cannot control.\n\nMistake 4: Not creating a .env.example file. This is a template showing which variables your app expects, without the actual values. Commit this to the repo so new developers know what to fill in.\n\nAPI_KEY=\nDATABASE_URL=\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n\nMistake 5: Logging environment variables during debugging and forgetting to remove the log statements. console.log(process.env) dumps every secret to whatever logging service you use.',
      },
      {
        heading: 'Production Environment Variables',
        type: 'pattern',
        content:
          'In production, you do not use .env files. You set environment variables directly on your hosting platform.\n\nVercel: Settings > Environment Variables. Add each key-value pair. Choose which environments it applies to (Production, Preview, Development).\n\nRailway: Variables tab in your service settings.\n\nAWS: Parameter Store or Secrets Manager.\n\nThe principle is the same everywhere. Secrets live in the platform, not in files. Your code reads from process.env regardless of where the values come from. Locally they come from .env. In production they come from the platform. Your code does not need to know the difference.',
      },
    ],
  },

  /* ================================================================== */
  /*  MCP SERVERS                                                        */
  /* ================================================================== */

  {
    id: 'heyreach-linkedin-automation',
    title: 'HeyReach LinkedIn Automation',
    subtitle: 'Set up HeyReach for multi-sender LinkedIn outreach with proper warming and campaign structure',
    category: 'mcp-servers',
    description:
      'Complete guide to HeyReach for LinkedIn outreach automation. Multi-sender architecture, campaign setup, connection request sequences, warming strategy, and integration with Clay and Instantly for full-funnel GTM.',
    keywords: [
      'heyreach',
      'heyreach setup',
      'heyreach linkedin automation',
      'heyreach campaigns',
      'linkedin automation tool',
      'heyreach guide',
      'linkedin outreach automation',
      'heyreach multi sender',
      'heyreach clay integration',
      'heyreach mcp',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'What HeyReach Is',
        type: 'prose',
        content:
          'HeyReach is a LinkedIn automation tool built for multi-sender outreach. The core idea: connect multiple LinkedIn accounts to one workspace and run campaigns across all of them simultaneously. One person can manage 5, 10, 20 sender accounts from a single dashboard.\n\nWhy multi-sender matters: LinkedIn limits each account to roughly 100 connection requests per week and 150 profile views per day. One account caps out fast. Five accounts running the same campaign hit 500 connections per week. The math is straightforward. More senders means more pipeline.\n\nHeyReach handles the rotation automatically. You build a campaign, assign senders, upload a lead list, and it distributes the outreach across accounts. It also manages warming, connection request limits, and response tracking per account.',
      },
      {
        heading: 'Account Setup and Sender Configuration',
        type: 'code',
        content:
          'Step 1: Create your HeyReach workspace at app.heyreach.io. One workspace per team or agency.\n\nStep 2: Connect LinkedIn accounts. HeyReach uses a browser extension or cookie-based auth to link accounts. Each account becomes a "sender" in the workspace.\n\nWarming rules for new senders:\nWeek 1: 10 connection requests per day, 30 profile views\nWeek 2: 15 connection requests per day, 50 profile views\nWeek 3: 20 connection requests per day, 80 profile views\nWeek 4+: 25 connection requests per day, 100 profile views\n\nDo not skip warming. LinkedIn flags accounts that go from zero activity to 100 requests overnight. The warming period builds a natural activity pattern that keeps accounts safe.\n\nStep 3: Set daily limits per sender in Settings > Sender Limits. Be conservative. 20-25 connection requests per day per account is the safe ceiling. Some accounts can handle more, but the risk of restriction goes up past 30.',
      },
      {
        heading: 'Campaign Architecture',
        type: 'pattern',
        content:
          'A HeyReach campaign has three components: the lead list, the sequence, and the sender pool.\n\nLead list: CSV upload or CRM sync. Each row needs a LinkedIn profile URL at minimum. Name, company, and title help with personalization variables. HeyReach deduplicates across campaigns automatically, so the same person does not get hit twice.\n\nSequence: The message flow. A typical outbound sequence:\n\nStep 1: View profile (day 0)\nStep 2: Send connection request with note (day 1)\nStep 3: If accepted, send first message (day 2-3 after acceptance)\nStep 4: Follow-up message if no reply (day 5-7 after first message)\nStep 5: Final touch (day 10-14 after second message)\n\nConnection request notes: keep them under 300 characters. Lead with why you are reaching out, not who you are. "Saw your team is scaling the SDR org - we built something for exactly that" beats "Hi, I am Shawn from GTMe OS and I would love to connect."\n\nSender pool: Assign 3-5 senders per campaign. HeyReach rotates which sender contacts which lead. This distributes the volume and makes the outreach pattern look more natural to LinkedIn.',
      },
      {
        heading: 'Integrating with Clay',
        type: 'pattern',
        content:
          'The real power is Clay feeding HeyReach. Clay enriches your lead list with company data, technographics, hiring signals, and custom scores. Then you push qualified leads directly to HeyReach campaigns.\n\nThe flow:\n\n1. Clay table with enriched leads (company, title, LinkedIn URL, score)\n2. Filter to qualified leads (score above threshold, title match, company fit)\n3. Push to HeyReach via webhook or CSV export\n4. HeyReach runs the LinkedIn sequence\n5. Responses sync back to your CRM\n\nFor the webhook approach, Clay has an HTTP action that can POST to HeyReach API endpoints. Map the Clay columns to HeyReach lead fields: linkedin_url, first_name, last_name, company_name, title.\n\nFor the CSV approach: export from Clay, upload to HeyReach campaign. Less automated but works for batch campaigns where you want to review the list before launching.',
      },
      {
        heading: 'Multi-Channel with Instantly',
        type: 'pattern',
        content:
          'HeyReach handles LinkedIn. Instantly handles email. Running both on the same lead list creates a multi-channel sequence.\n\nThe routing logic depends on the lead. If you have a verified email, they go to Instantly for email outreach AND HeyReach for LinkedIn. If you only have a LinkedIn URL and no email, they go to HeyReach only. If the email domain uses aggressive spam filtering (Proofpoint, Mimecast), lead with LinkedIn through HeyReach and use email as the follow-up channel.\n\nTiming matters. Do not blast both channels on the same day. Stagger them. LinkedIn connection request on day 1. Email on day 3. LinkedIn follow-up on day 7. Email follow-up on day 10. The prospect sees your name across two channels without feeling spammed.\n\nTrack which channel gets the response. Over time you will see patterns. Some industries respond better on LinkedIn. Some respond better to email. Let the data drive your channel allocation.',
      },
      {
        heading: 'Safety and Account Health',
        type: 'pro-tip',
        content:
          'LinkedIn restricts accounts that behave like bots. HeyReach mitigates this with built-in limits and warming, but you still need to be smart about it.\n\nNever exceed 25 connection requests per day per account. The hard limit from LinkedIn is around 100 per week, but spreading them across 5 days at 20 each is safer than doing 50 on Monday and 50 on Friday.\n\nUse the accounts manually too. Post content, comment on posts, engage in groups. LinkedIn tracks overall activity patterns. An account that only sends connection requests and messages looks automated. An account that also posts and comments looks human.\n\nRotate senders periodically. If an account gets a temporary restriction, pull it from campaigns for 1-2 weeks. Let it cool down. Use the remaining senders to maintain campaign volume.\n\nMonitor acceptance rates. A healthy acceptance rate is 30-50% for targeted outreach. Below 20% means your messaging or targeting is off. Below 10% and LinkedIn may start flagging the account.\n\nKeep connection request notes genuine. Templates that sound like templates get ignored. Personalize the first line with something specific to the person or their company. HeyReach supports variables like {first_name}, {company_name}, and custom fields from your CSV.',
      },
    ],
  },

  /* ================================================================== */
  /*  COMPARISONS — SEO-targeted head-to-head breakdowns                  */
  /* ================================================================== */

  {
    id: 'claude-code-vs-cursor',
    title: 'Claude Code vs Cursor',
    subtitle: 'Terminal agent vs IDE copilot - when to use each and when to use both',
    category: 'comparisons',
    description:
      'Practitioner comparison of Claude Code and Cursor from someone who uses both daily. Architecture differences, real workflow examples, cost breakdown, and the hybrid setup that ships faster than either tool alone.',
    keywords: [
      'claude code vs cursor',
      'cursor vs claude code',
      'claude code or cursor',
      'best AI coding tool 2026',
      'claude code cursor comparison',
      'AI coding assistant comparison',
      'terminal vs IDE AI coding',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'claude-code-power-features',
      'getting-started-with-cursor',
      'ide-principles-that-transfer',
    ],
    sections: [
      {
        heading: 'The Short Answer',
        type: 'prose',
        content:
          'Claude Code is a terminal-native agent. You describe what you want, it drives. Cursor is an IDE with AI woven into every surface. You drive, it assists. The question is not which is better - it is which mode matches the work you are doing right now.\n\nI use both every day. Claude Code handles multi-file refactors, infrastructure automation, deployment pipelines, and anything that benefits from autonomous execution. Cursor handles inline edits, visual debugging, component tweaking, and anything where I want tight control over each change.\n\nThe best setup is both. Claude Code for delegation, Cursor for precision. The rest of this page explains exactly when and why.',
      },
      {
        heading: 'Architecture: Agent vs Assistant',
        type: 'pattern',
        content:
          'Claude Code runs in your terminal. No GUI. You type what you want, it reads your codebase, plans an approach, and executes - creating files, running commands, editing code. It operates like a senior developer you hand tasks to. The CLAUDE.md file in your repo is its onboarding doc. Skills, hooks, and rules shape its behavior. It can spawn subagents and agent teams for parallel work.\n\nCursor is a VS Code fork with AI at every layer. Tab completions predict your next edit. Cmd+K does inline rewrites. Cmd+L opens chat for multi-file tasks. Composer mode plans and executes across files with diff review at each step. It operates like a pair programmer sitting next to you.\n\nThe architecture difference matters. Claude Code has no GUI overhead - it reads and writes files directly, runs shell commands, and chains operations. Cursor shows you every change visually and waits for approval. Claude Code is faster for autonomous work. Cursor is safer for exploratory work where you want to see every diff before it lands.',
      },
      {
        heading: 'When Claude Code Wins',
        type: 'pattern',
        content:
          'Claude Code is the better choice when the task can be described upfront and executed autonomously. Specific scenarios:\n\nMulti-file refactors. "Rename the UserProfile component to AccountProfile everywhere, update all imports, fix all references." Claude Code finds every file, makes every change, runs the build to verify. In Cursor, you would review each file change individually.\n\nInfrastructure and automation. "Set up a new cron job that runs the daily sync script at midnight, create the launchd plist, and verify it loads." Claude Code executes the shell commands directly. Cursor would need you to copy-paste terminal commands.\n\nLarge codebase navigation. Claude Code reads your entire repo structure, follows imports, understands relationships between modules. It does not need you to manually open files or add @references. It finds what it needs.\n\nBackground execution. You can run Claude Code sessions in the background while you work in Cursor on something else. Two parallel workflows. Try that with two Cursor instances and your machine is fighting for GPU resources.\n\nCI/CD and deployment. Claude Code can run builds, check logs, fix errors, and retry - all autonomously. It handles the full deploy pipeline without you watching each step.',
      },
      {
        heading: 'When Cursor Wins',
        type: 'pattern',
        content:
          'Cursor is the better choice when you want visual control and rapid iteration on specific code. Specific scenarios:\n\nUI and component work. You are tweaking a React component, adjusting styles, moving elements around. Cursor shows you the code, the preview, and the AI suggestions all in one view. Claude Code would be doing this blind - writing code without seeing the visual result.\n\nInline precision edits. Highlight three lines, Cmd+K, "convert this to a ternary." Done in two seconds with visual confirmation. Claude Code would need a full prompt describing the file, the location, and the change.\n\nTab completions. Cursor predicts your next line as you type. This is pure speed for writing new code when you know the pattern but want AI to fill in the boilerplate. Claude Code does not have inline completions - it is not an editor.\n\nExploration and learning. When you are in an unfamiliar codebase, Cursor lets you click through files, hover for types, and ask the AI about specific functions. The visual feedback loop is faster for understanding code you did not write.\n\nSmall, surgical fixes. A typo, a missing import, a wrong variable name. Open the file, fix it, move on. Claude Code is overkill for a one-line change.',
      },
      {
        heading: 'Cost Comparison',
        type: 'formula',
        content:
          'Claude Code pricing: Claude Max subscription at $100/month for heavy usage (Opus-level model, unlimited within reason) or $20/month Pro plan with usage limits. API pricing is also available for programmatic use.\n\nCursor pricing: $20/month Pro plan includes 500 fast premium requests. Beyond that, you hit slow mode or pay overages. $40/month Business plan for teams.\n\nThe real cost calculation is not subscription price - it is time saved. Claude Code at $100/month that saves 2 hours daily on refactors and automation pays for itself in the first week. Cursor at $20/month that prevents bugs through visual diff review pays for itself in the first day.\n\nIf you are budget-constrained: start with Cursor Pro at $20/month. It covers 80% of use cases. Add Claude Code when you hit tasks that need autonomous multi-file execution.\n\nIf you are optimizing for output: run both. Use Claude Code for the heavy lifting and Cursor for the finish work. The combined $120/month is still cheaper than one hour of a contractor.',
      },
      {
        heading: 'The Hybrid Setup I Actually Use',
        type: 'pro-tip',
        content:
          'My daily workflow uses both tools in a specific pattern.\n\nMorning: Open Claude Code terminal. Run /morning to get the daily brief. Claude Code reads yesterday\'s handoff, checks git status, surfaces priority tasks. It handles the planning and context loading.\n\nBuilding: If the task is a new feature or refactor, Claude Code drives. I describe what I want, it plans, I approve the plan, it executes. If the task is UI polish or component work, I open Cursor and work interactively.\n\nDeployment: Claude Code handles the full pipeline. Build check, git commit, push, verify. It runs pre-push safety scans, checks for sensitive data, and handles the deploy sequence.\n\nDebugging: Depends on the bug. If it is a logic error in backend code, Claude Code reads the logs, traces the issue, and fixes it. If it is a visual bug in the UI, Cursor is better because I can see the component while editing.\n\nEnd of session: Claude Code writes the context handoff document. This is not just a summary - it is a structured briefing that the next Claude Code session reads to pick up exactly where I left off. Cursor does not have this concept.\n\nThe key insight: they are not competing tools. They are complementary tools that serve different interaction modes. Use both and you move faster than either tool alone.',
      },
    ],
  },

  {
    id: 'claude-code-vs-github-copilot',
    title: 'Claude Code vs GitHub Copilot',
    subtitle: 'Autonomous agent vs inline assistant - the fundamental difference',
    category: 'comparisons',
    description:
      'Side-by-side comparison of Claude Code and GitHub Copilot. Agent-first vs completion-first, agentic capabilities, pricing, and which tool fits which developer workflow.',
    keywords: [
      'claude code vs github copilot',
      'github copilot vs claude code',
      'claude code copilot comparison',
      'best AI coding assistant',
      'copilot alternative 2026',
      'github copilot vs anthropic',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-vs-cursor',
      'claude-code-quickstart',
      'claude-code-power-features',
      'ide-principles-that-transfer',
    ],
    sections: [
      {
        heading: 'Fundamental Difference',
        type: 'prose',
        content:
          'GitHub Copilot started as autocomplete and grew into an assistant. Claude Code started as an agent and stayed an agent. That origin story shapes everything about how they work.\n\nCopilot predicts your next line of code based on context. It is reactive - it waits for you to type and then suggests what comes next. Copilot Chat added conversational features, and Copilot Workspace added multi-file planning. But the core product is still an inline suggestion engine that lives in your editor.\n\nClaude Code takes a task description and executes it end-to-end. It reads your codebase, plans an approach, writes code, runs commands, checks results, and iterates. It does not wait for you to type. You delegate and it delivers.\n\nCopilot enhances your typing speed. Claude Code replaces entire categories of manual work.',
      },
      {
        heading: 'Capabilities Head-to-Head',
        type: 'pattern',
        content:
          'Tab completion: Copilot is best-in-class. It trains on your current file and repository to predict completions with high accuracy. Claude Code does not offer inline completions - it is not an editor.\n\nChat: Both have conversational interfaces. Copilot Chat runs inside VS Code, JetBrains, and the CLI. Claude Code chat runs in the terminal. Copilot Chat answers questions and makes single-file edits. Claude Code chat makes multi-file changes and runs shell commands.\n\nAutonomous execution: Claude Code can run builds, execute tests, check logs, fix errors, and retry - all without human intervention. Copilot Workspace plans multi-file changes but requires manual approval at each step. Claude Code operates at a higher autonomy level.\n\nContext understanding: Claude Code reads your entire repo, follows imports, understands CLAUDE.md instructions, and loads skills on demand. Copilot uses repository indexing and the open file context. Claude Code has deeper project awareness for complex codebases.\n\nMulti-agent: Claude Code supports subagents and agent teams for parallel execution. Multiple Claude instances can work on different parts of your codebase simultaneously. Copilot does not have multi-agent capabilities.\n\nCustomization: Claude Code has CLAUDE.md, skills, hooks, and rules that deeply customize its behavior per project. Copilot has .github/copilot-instructions.md for basic project instructions. Claude Code is significantly more configurable.',
      },
      {
        heading: 'Pricing Breakdown',
        type: 'formula',
        content:
          'GitHub Copilot Individual: $10/month. Includes tab completions, chat, and basic agentic features. Best value entry point for any AI coding tool.\n\nGitHub Copilot Business: $19/month per user. Adds organization-level policies, audit logs, IP indemnity.\n\nClaude Code Pro: $20/month. Includes Claude Code in terminal, IDE extensions, and web access. Usage-limited on Opus model.\n\nClaude Code Max: $100/month or $200/month tiers. Higher usage limits, priority access to Opus 4 model, ideal for power users who run Claude Code as their primary development workflow.\n\nThe math: Copilot at $10/month is unbeatable for pure tab completions. If all you need is faster typing, start there. Claude Code at $20-100/month is for developers who want task automation, not just code suggestions. If you spend more time orchestrating work than typing code, Claude Code delivers more value per dollar.',
      },
      {
        heading: 'Which Is Right for You',
        type: 'pro-tip',
        content:
          'Choose GitHub Copilot if: you spend most of your time writing new code in an editor, you want the best inline suggestions, your work is primarily single-file edits, or your team uses GitHub and wants integrated AI across the platform.\n\nChoose Claude Code if: you spend most of your time on multi-file operations, you want autonomous task execution, you run complex builds and deployments, you work in large monorepos with deep dependency chains, or you want to customize AI behavior extensively with skills and hooks.\n\nChoose both if: you want tab completions while typing (Copilot) AND autonomous multi-file agents (Claude Code). They do not conflict. Copilot runs in your editor. Claude Code runs in your terminal. Many developers run Cursor (with its own completions) plus Claude Code and get the benefits of both worlds.\n\nThe honest answer: most serious developers in 2026 use more than one AI tool. The tools have different strengths and the combination is more powerful than any single tool.',
      },
    ],
  },

  {
    id: 'context-engineering-vs-prompt-engineering',
    title: 'Context Engineering vs Prompt Engineering',
    subtitle: 'Why the right information matters more than the right words',
    category: 'comparisons',
    description:
      'Context engineering vs prompt engineering explained. What changed, why prompt engineering hit a ceiling, and how context engineering builds reliable AI systems by controlling what information the model sees rather than how you phrase requests.',
    keywords: [
      'context engineering vs prompt engineering',
      'prompt engineering vs context engineering',
      'what is context engineering',
      'context engineering explained',
      'context engineering 2026',
      'prompt engineering dead',
      'context engineering AI agents',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'repo-context-engine',
      'constraints-and-context-engines',
      'parallel-session-handoffs',
      'rules-skills-context',
    ],
    sections: [
      {
        heading: 'The Shift',
        type: 'prose',
        content:
          'Prompt engineering optimizes how you ask. Context engineering optimizes what information the model sees when you ask. That is not a subtle difference - it changes the entire approach to building with AI.\n\nIn 2023-2024, prompt engineering was the skill. Craft the perfect instruction. Add chain-of-thought reasoning. Use few-shot examples. Phrase your request precisely and the model performs better. This worked when AI interactions were single-turn question-and-answer.\n\nIn 2025-2026, the ceiling became obvious. Models got better at following instructions regardless of phrasing. A well-structured prompt and a casual request produce nearly identical output on modern models. The bottleneck moved from instruction quality to information quality. It does not matter how perfectly you phrase "refactor this module" if the model cannot see the module, its dependencies, or the coding standards it should follow.\n\nContext engineering is the response. Instead of optimizing the prompt, you optimize the context window - the total information the model processes before generating a response.',
      },
      {
        heading: 'Prompt Engineering: What It Actually Means',
        type: 'pattern',
        content:
          'Prompt engineering is the craft of writing instructions that produce desired outputs from language models. Core techniques include:\n\nRole assignment: "You are a senior TypeScript developer." Gives the model a perspective to reason from.\n\nChain-of-thought: "Think step by step before answering." Forces the model to show its reasoning, which improves accuracy on complex tasks.\n\nFew-shot examples: "Here are three examples of the format I want..." Demonstrates the expected output pattern.\n\nConstraints: "Respond in JSON. Use only the provided data. Do not make assumptions." Bounds the output space.\n\nThese techniques still work. They are still useful. But they operate at the instruction layer. They tell the model how to process information. They do not control what information is available to process.',
      },
      {
        heading: 'Context Engineering: What It Actually Means',
        type: 'pattern',
        content:
          'Context engineering is the practice of controlling what information the model sees, when it sees it, and how it is structured. Core techniques include:\n\nDynamic context selection: Loading only the files, documents, and data relevant to the current task. Not everything - the right things. A refactoring task needs the target file, its imports, its tests, and the coding standards. Loading the entire repo adds noise that degrades performance.\n\nMemory architecture: Deciding what the model remembers across sessions. CLAUDE.md files persist project context. Handoff documents carry state between sessions. Knowledge bases provide domain reference. Each serves a different memory function.\n\nContext compression: Summarizing or structuring information to fit within token limits while preserving what matters. Raw logs are context-expensive. A structured error summary with file, line, and message is context-efficient.\n\nTool and retrieval integration: Giving the model access to search, file reading, API calls, and databases so it can pull information on demand instead of needing everything preloaded.\n\nSchema and structure: Organizing context with clear headings, typed schemas, and predictable formats so the model processes it efficiently. Structured data outperforms unstructured data consistently.',
      },
      {
        heading: 'Why This Matters for Practitioners',
        type: 'pro-tip',
        content:
          'If you are building AI features, automating workflows, or using AI coding tools daily, context engineering is the skill that moves the needle.\n\nA practical example: I run a monorepo with three Next.js sites, 40+ automation skills, and daily cron jobs. Every Claude Code session starts by reading a CLAUDE.md file that contains project structure, coding conventions, deployment steps, and safety rules. It reads the context handoff from the previous session. It loads relevant skills based on the task.\n\nThis is context engineering. The model sees the right information before it writes a single line of code. The prompts I type are casual - "add a new how-to wiki entry about MCP servers" - because the context does the heavy lifting. The CLAUDE.md tells it the file format. The existing entries show it the pattern. The skills tell it the workflow.\n\nCompare that to prompt engineering alone: "You are an expert TypeScript developer. Please create a new how-to wiki entry in the HowToWikiEntry format defined in how-to-wiki.ts with id, title, subtitle, category, description, keywords array, difficulty level, canonicalSite, related entries, and sections array with heading, type, and content fields..." You are spending tokens on instruction that context handles automatically.\n\nThe takeaway: prompt engineering is a technique. Context engineering is a system. Techniques hit ceilings. Systems compound.',
      },
    ],
  },

  {
    id: 'claude-md-vs-agents-md-vs-cursorrules',
    title: 'CLAUDE.md vs AGENTS.md vs .cursorrules',
    subtitle: 'Three config file formats for AI coding tools - compared',
    category: 'comparisons',
    description:
      'Comparison of CLAUDE.md, AGENTS.md, and .cursorrules configuration files. What each does, how they overlap, the key differences, and how to maintain all three in one repo without duplicating content.',
    keywords: [
      'CLAUDE.md vs AGENTS.md',
      'cursorrules vs CLAUDE.md',
      'AGENTS.md vs cursorrules',
      'AI agent config files',
      'CLAUDE.md file guide',
      'AGENTS.md file guide',
      'cursorrules file guide',
      'AI IDE configuration comparison',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'rules-skills-context',
      'claude-code-quickstart',
      'getting-started-with-cursor',
      'how-to-write-claude-md',
    ],
    sections: [
      {
        heading: 'Three Files, One Goal',
        type: 'prose',
        content:
          'CLAUDE.md is for Claude Code. AGENTS.md is a cross-tool standard. .cursorrules is for Cursor IDE. All three serve the same purpose: give the AI tool project-specific context and instructions so it produces better output. The difference is scope and format.\n\nIf you only use one AI tool, use that tool\'s config file. If you use multiple tools - and most serious practitioners do - you need a strategy for keeping them in sync without tripling your maintenance burden.',
      },
      {
        heading: 'CLAUDE.md in Detail',
        type: 'pattern',
        content:
          'CLAUDE.md is Anthropic\'s config file for Claude Code. It loads automatically at session start and stays in context for the entire conversation.\n\nPlacement: repo root for project-level, ~/.claude/CLAUDE.md for global, and nested directories for module-level. Claude Code merges all applicable levels.\n\nFormat: plain Markdown. Headers, bullets, code blocks, tables. No special syntax needed. Claude reads it like any other document.\n\nUnique features: supports @path/to/file imports that expand inline. Supports multiple levels (global, project, directory). Has a dedicated /init command that auto-generates a starter file from your codebase.\n\nBest for: coding conventions, build/test commands, safety rules, project architecture, deployment steps, and behavioral instructions like "never commit .env files" or "run tests before marking a task complete."\n\nThe best CLAUDE.md files are under 200 lines. They use specific, verifiable instructions ("use 2-space indentation" not "format code properly"). They point to files instead of copying content ("see docs/ARCHITECTURE.md for the full system diagram" not pasting the diagram inline).',
      },
      {
        heading: 'AGENTS.md in Detail',
        type: 'pattern',
        content:
          'AGENTS.md is an emerging open standard intended to work across AI coding tools - not just Claude Code. It was designed by the community as a tool-agnostic config file.\n\nPlacement: repo root, similar to CLAUDE.md.\n\nFormat: Markdown with structured sections. Typically includes: project description, architecture overview, coding standards, testing instructions, and tool-specific configurations.\n\nPhilosophy: write your instructions once, have every AI tool read them. Instead of maintaining separate files for Claude Code, Cursor, Copilot, and Windsurf, maintain one AGENTS.md and let each tool parse it.\n\nReality check: adoption is still early. Claude Code reads CLAUDE.md natively. Cursor reads .cursorrules natively. AGENTS.md support varies. Some tools honor it, others ignore it. The standard is promising but not yet universal.\n\nBest for: teams that use multiple AI tools and want a single source of truth for project instructions.',
      },
      {
        heading: '.cursorrules in Detail',
        type: 'pattern',
        content:
          '.cursorrules is Cursor IDE\'s project-level instruction file. It loads when you open a project in Cursor.\n\nPlacement: repo root as .cursorrules (single file) or .cursor/rules/ directory for multiple rule files with glob patterns.\n\nFormat: plain text or Markdown. The .cursor/rules/ approach uses .mdc files with YAML frontmatter that specifies which file patterns trigger the rule.\n\nUnique features: glob-based rule activation (rules only load when you edit matching files), agent-requested rules that load on demand, and integration with Cursor\'s composer and chat modes.\n\nBest for: Cursor-specific workflows, file-pattern-based rules (load TypeScript conventions only when editing .ts files), and teams that standardize on Cursor as their IDE.\n\nLimitation: .cursorrules only works in Cursor. If anyone on your team uses a different tool, they get no benefit from these files.',
      },
      {
        heading: 'The Practical Strategy: One Source of Truth',
        type: 'pro-tip',
        content:
          'Maintaining three separate config files with the same information is a maintenance nightmare. Here is the approach that works:\n\nCLAUDE.md is your primary config. It is the most detailed because Claude Code is the most capable at following complex, multi-step instructions. Write your full project context, conventions, and workflows here.\n\nAGENTS.md is a simplified cross-reference. Link to CLAUDE.md for details. Include only the universal instructions that every tool should follow: coding standards, testing requirements, architecture overview.\n\n.cursorrules handles Cursor-specific rules. File-pattern activation, inline edit preferences, composer mode instructions. Do not duplicate what is already in CLAUDE.md.\n\nThe structure:\n\nCLAUDE.md - Full project config (200 lines)\nAGENTS.md - Universal subset + links to CLAUDE.md (50 lines)\n.cursor/rules/*.mdc - Cursor-specific file-pattern rules (per-rule files)\n\nThis way, when conventions change, you update CLAUDE.md. AGENTS.md points to it. .cursorrules only contains Cursor-specific behavior that does not apply elsewhere.\n\nIf you use only Claude Code: just maintain CLAUDE.md. Skip the others until you need them.',
      },
    ],
  },

  {
    id: 'subagents-vs-agent-teams',
    title: 'Subagents vs Agent Teams in Claude Code',
    subtitle: 'When to spawn helpers vs when to orchestrate a full team',
    category: 'comparisons',
    description:
      'Practical guide to choosing between subagents and agent teams in Claude Code. How each works, real use cases, cost implications, and the decision framework for parallel AI development workflows.',
    keywords: [
      'claude code subagents vs agent teams',
      'agent teams claude code',
      'claude code subagents',
      'parallel agents claude code',
      'multi-agent claude code',
      'claude code agent teams tutorial',
      'when to use agent teams',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
      'agent-teams-claude-code',
      'claude-code-power-features',
    ],
    sections: [
      {
        heading: 'Two Models of Parallelism',
        type: 'prose',
        content:
          'Claude Code offers two ways to run multiple AI instances on your codebase. Subagents are lightweight workers spawned from your current session. Agent teams are full Claude Code instances that coordinate with each other. The difference is communication and autonomy.\n\nSubagents report back to the parent. They cannot talk to each other. They execute a focused task and return results. Think of them as functions you call in parallel.\n\nAgent teams communicate with each other. They claim tasks from a shared list. They can message teammates, share discoveries, and coordinate without a central orchestrator. Think of them as an actual team working on the same project.',
      },
      {
        heading: 'Subagents: How They Work',
        type: 'pattern',
        content:
          'Subagents are spawned using the Agent tool within a Claude Code session. You specify the task, the agent type (Explore, Plan, general-purpose), and optionally an isolation mode (worktree for separate git branches).\n\nEach subagent gets its own context window. It can read files, run commands, search code, and return results. When it finishes, the result comes back to the parent session.\n\nKey characteristics:\n\nOne-way communication. The parent sends a task, the subagent returns a result. No back-and-forth negotiation.\n\nShared filesystem. Subagents see the same repo (unless using worktree isolation). Changes from one subagent are visible to others.\n\nParent orchestration. The main session decides what to delegate, when to spawn, and how to combine results.\n\nCost: each subagent consumes tokens proportional to its task. A quick file search might use 5K tokens. A deep exploration might use 50K. The parent session bears the cost.\n\nBest for: parallel research, independent file searches, generating content in parallel, any task where you need speed through parallelism but the tasks are independent.',
      },
      {
        heading: 'Agent Teams: How They Work',
        type: 'pattern',
        content:
          'Agent teams are an experimental feature (enable via CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1). One session acts as team lead. It creates tasks in a shared task list. Teammates claim tasks, work on them, and communicate results to each other.\n\nKey characteristics:\n\nPeer-to-peer communication. Teammates message each other directly. The team lead does not need to relay every piece of information.\n\nShared task system. Tasks are posted to a shared list. Teammates claim tasks based on availability and capability. No central assignment required.\n\nIndependent context windows. Each teammate has its own full context. They can hold different mental models of the codebase and share discoveries through messages.\n\nHigher autonomy. Teammates can discover issues, create new tasks, and coordinate solutions without the team lead directing every step.\n\nCost: each teammate is a full Claude instance. A 3-person team uses roughly 3x the tokens. A 5-person team uses 5x. This adds up fast.\n\nBest for: complex multi-module features, parallel code reviews with different focus areas, debugging with competing hypotheses, and any task where agents need to react to each other\'s findings.',
      },
      {
        heading: 'Decision Framework',
        type: 'formula',
        content:
          'Use subagents when:\n- Tasks are independent (no task depends on another task\'s output)\n- Communication is one-way (send task, get result)\n- You want the parent session to maintain full control\n- Budget is a concern (subagents are cheaper)\n- Tasks are well-defined with clear completion criteria\n\nUse agent teams when:\n- Tasks interact (frontend changes affect backend, shared interfaces)\n- Agents need to react to each other\'s discoveries\n- The problem space is ambiguous and requires exploration\n- You want agents to challenge each other\'s approaches\n- The work would take a single session too long and benefits from true parallelism\n\nUse a single session when:\n- The task is sequential (each step depends on the previous)\n- The codebase is small enough for one context window\n- You need tight control over every decision\n- Cost matters more than speed\n\nReal example from my workflow: I use subagents daily for parallel research - "explore the auth module," "find all API endpoints," "check test coverage." These are independent queries. I use agent teams for multi-day features - "build the new dashboard" where one agent handles the API layer, another handles the UI components, and a third writes tests. They need to coordinate on the interface contract between layers.',
      },
      {
        heading: 'Cost Reality Check',
        type: 'pro-tip',
        content:
          'Subagents are cheap. A typical explore subagent uses 10-50K tokens. At current pricing, that is pennies. You can spawn 5-10 subagents in parallel without thinking about cost.\n\nAgent teams are expensive. Each teammate maintains a full context window that grows with every message and file read. A 3-person team working for an hour can burn through 500K-1M tokens. On API pricing, that is dollars. On Max subscription, it counts against your usage limits.\n\nThe rule: start with subagents. Upgrade to agent teams only when you hit a real coordination problem that subagents cannot solve. Most tasks do not need agent teams. The single-session-with-subagents pattern handles 90% of parallel work.\n\nAnother option: multiple terminal tabs, each running an independent Claude Code session on different parts of the codebase. This gives you parallelism without the agent teams overhead. The tradeoff is that sessions cannot communicate - you are the orchestrator.',
      },
    ],
  },

  /* ================================================================== */
  /*  HOW-TO GUIDES — SEO-targeted tutorials                             */
  /* ================================================================== */

  {
    id: 'how-to-write-claude-md',
    title: 'How to Write a CLAUDE.md File',
    subtitle: 'The complete guide to configuring Claude Code for your project',
    category: 'cli-tools',
    description:
      'Step-by-step guide to writing an effective CLAUDE.md file. What to include, what to skip, file placement, import syntax, and real examples from a production monorepo with three Next.js sites.',
    keywords: [
      'how to write CLAUDE.md',
      'CLAUDE.md guide',
      'CLAUDE.md file',
      'CLAUDE.md tutorial',
      'CLAUDE.md example',
      'CLAUDE.md best practices',
      'claude code configuration',
      'write CLAUDE.md file',
      'CLAUDE.md template',
    ],
    difficulty: 'beginner',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'rules-skills-context',
      'claude-md-vs-agents-md-vs-cursorrules',
      'claude-code-power-features',
    ],
    sections: [
      {
        heading: 'What CLAUDE.md Does',
        type: 'prose',
        content:
          'CLAUDE.md is a plain Markdown file that Claude Code reads at the start of every session. It is the onboarding document for your AI teammate. Everything in this file becomes part of the context window - Claude sees it before you type your first message.\n\nWithout a CLAUDE.md, Claude Code operates generically. It does not know your project structure, your coding conventions, your build commands, or your deployment process. With a CLAUDE.md, it operates as a teammate who has read all your docs.\n\nThe file lives in your repo root. It gets version-controlled with your code. When the project evolves, the CLAUDE.md evolves with it. When a new developer joins, they get Claude Code pre-configured for your project automatically.',
      },
      {
        heading: 'File Placement and Hierarchy',
        type: 'pattern',
        content:
          'Claude Code loads CLAUDE.md from multiple locations, merging them in order:\n\n1. ~/.claude/CLAUDE.md - Global config. Applies to every project. Put your personal preferences here: editor settings, commit style, communication preferences.\n\n2. /project-root/CLAUDE.md - Project config. Applies to this repo. Put project-specific instructions here: build commands, coding standards, architecture overview.\n\n3. /project-root/src/CLAUDE.md - Directory config. Applies when working in the src/ directory. Put module-specific instructions here: API conventions for the API module, component patterns for the UI module.\n\nEach level adds to the context. Global plus project plus directory. Use this to avoid repetition: global handles your personal style, project handles the codebase, directory handles the module.\n\nFor monorepos: put shared conventions in the root CLAUDE.md. Put app-specific instructions in each app\'s directory. For example, website/apps/dashboard/CLAUDE.md might say "this app uses Tailwind CSS and shadcn/ui components" while the root CLAUDE.md covers the shared TypeScript config.',
      },
      {
        heading: 'What to Include',
        type: 'pattern',
        content:
          'The most effective CLAUDE.md files cover six areas:\n\n1. Build and test commands. The exact commands to build, test, lint, and deploy. Not "run the tests" but "npm run test" or "pytest -x tests/". Claude Code uses these directly.\n\n2. Project structure. A brief map of the codebase. Where the source code lives, where tests go, where config files are. Two to five lines, not an entire directory tree.\n\n3. Coding conventions. Indentation, naming patterns, import ordering, file naming. Specific and verifiable: "use 2-space indentation" not "format code nicely."\n\n4. Safety rules. What to never do. "Never commit .env files." "Never push to main without tests passing." "Never delete migration files." These are guardrails that prevent costly mistakes.\n\n5. Workflow instructions. How you want Claude Code to operate. "Run tests before marking a task complete." "Write a context handoff at the end of every session." "Enter plan mode for tasks with 3+ steps."\n\n6. Key references. Pointers to important docs. "See docs/ARCHITECTURE.md for system design." "See .cursor/rules/ for file-pattern rules." Pointers, not copies - this keeps the CLAUDE.md lean.',
      },
      {
        heading: 'What to Skip',
        type: 'anti-pattern',
        content:
          'Common mistakes that make CLAUDE.md files worse:\n\nDo not paste large code blocks. They become stale when the code changes. Point to the file instead: "see src/lib/auth.ts for the authentication pattern."\n\nDo not exceed 200 lines. Every line consumes context tokens. A 500-line CLAUDE.md eats into the space available for actual code and conversation. If you need more detail, use the @import syntax to load files on demand.\n\nDo not write vague instructions. "Write good code" and "follow best practices" are meaningless to an AI. They get interpreted differently every session. "Use early returns instead of nested if-else" is specific and consistent.\n\nDo not duplicate documentation. If you have a CONTRIBUTING.md, point to it. Do not copy its contents into CLAUDE.md. One source of truth.\n\nDo not include secrets or environment variables. CLAUDE.md is version-controlled. If your build needs API keys, say "set OPENAI_API_KEY in .env" not the actual key value.',
      },
      {
        heading: 'Import Syntax for Large Projects',
        type: 'code',
        content:
          'CLAUDE.md supports importing other files with the @path/to/file syntax. Imported files expand inline when Claude Code loads the context.\n\nUse imports for:\n- Architecture docs: @docs/ARCHITECTURE.md\n- Team conventions: @docs/CONVENTIONS.md\n- API documentation: @docs/API.md\n\nThis keeps the root CLAUDE.md lean (under 200 lines) while giving Claude access to detailed references when needed. The imported files only load when the CLAUDE.md is processed, so they do not consume tokens until a session starts.\n\nA pattern that works: keep the CLAUDE.md as the table of contents and use imports for the chapters. The CLAUDE.md says "For deployment instructions, see @docs/DEPLOY.md." Claude sees the full deployment doc when it needs it.',
      },
      {
        heading: 'Getting Started in 60 Seconds',
        type: 'pro-tip',
        content:
          'The fastest path: open Claude Code in your project and run /init. It generates a starter CLAUDE.md based on your project structure, package.json, and existing config files. Review it, trim the generic stuff, and add your project-specific instructions.\n\nIf you want to start from scratch, create a CLAUDE.md at your project root with these three sections:\n\n## Build Commands\nnpm install\nnpm run dev\nnpm run test\nnpm run build\n\n## Project Structure\n- src/ - Application source code\n- tests/ - Test files\n- docs/ - Documentation\n\n## Rules\n- Run tests before committing\n- Use TypeScript strict mode\n- Never commit .env files\n\nThat is enough to make Claude Code significantly more useful. You can expand it over time as you notice patterns - every time Claude Code does something wrong, add a rule. Every time you re-explain something, add it to the file. The CLAUDE.md seasons with use, like a cast iron skillet.',
      },
    ],
  },

  {
    id: 'how-to-setup-claude-code-hooks',
    title: 'How to Set Up Claude Code Hooks',
    subtitle: 'Automate workflows at every stage of the agent lifecycle',
    category: 'cli-tools',
    description:
      'Practical guide to Claude Code hooks. How to set up pre-edit, post-edit, pre-command, and notification hooks with real examples for formatting, security scanning, and workflow automation.',
    keywords: [
      'claude code hooks',
      'claude code hooks tutorial',
      'claude code hooks setup',
      'how to use claude code hooks',
      'claude code automation',
      'claude code pre-commit hook',
      'claude code workflow automation',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-power-features',
      'claude-code-quickstart',
      'rules-skills-context',
      'how-to-write-claude-md',
    ],
    sections: [
      {
        heading: 'What Hooks Are',
        type: 'prose',
        content:
          'Hooks are shell commands that run automatically at specific points in Claude Code\'s lifecycle. They give you deterministic control over the agent\'s behavior. Instead of hoping Claude remembers to format code after an edit, a hook guarantees it.\n\nThe key word is deterministic. CLAUDE.md instructions are suggestions - the model usually follows them but might not. Hooks are guarantees. A pre-command hook that blocks rm -rf will always block it. A post-edit hook that runs Prettier will always format the file.\n\nHooks run your code, not Claude\'s. They execute shell commands on your machine. This makes them powerful (you can do anything a shell script can do) and dangerous (a bad hook can break your workflow). Start simple, add complexity as needed.',
      },
      {
        heading: 'Hook Types and Lifecycle',
        type: 'pattern',
        content:
          'Claude Code supports hooks at these lifecycle points:\n\nPreToolUse: Runs before Claude executes a tool (file edit, bash command, etc.). Use this to block dangerous commands, validate file paths, or inject context. If your hook returns a non-zero exit code, the tool call is blocked.\n\nPostToolUse: Runs after Claude executes a tool. Use this to format edited files, run linters, send notifications, or log changes. The tool call has already happened - you are reacting to it.\n\nNotification: Runs when Claude needs human input or wants to notify you. Use this to send Slack messages, play sounds, or trigger system notifications when Claude is waiting for approval.\n\nStop: Runs when Claude finishes a response. Use this for cleanup, logging, or triggering post-response workflows.\n\nEach hook receives context about what triggered it: the tool name, the file path, the command, or the notification message. You use this context to decide what your hook should do.',
      },
      {
        heading: 'Setting Up Your First Hook',
        type: 'code',
        content:
          'Run /hooks in Claude Code to open the interactive hook configuration. Or edit your settings directly.\n\nHooks live in your Claude Code settings (either project-level in .claude/settings.json or user-level in ~/.claude/settings.json). The format is a JSON object mapping hook types to arrays of hook configurations.\n\nEach hook has: a matcher (which tool or event triggers it), a command (what to run), and optionally a timeout.\n\nExample: a PostToolUse hook that formats TypeScript files after edits.\n\nThe matcher checks if the tool was "Edit" or "Write" and the file ends in .ts or .tsx. The command runs Prettier on the edited file. Every time Claude edits a TypeScript file, it gets auto-formatted.\n\nExample: a PreToolUse hook that blocks dangerous bash commands.\n\nThe matcher checks if the tool is "Bash" and the command contains "rm -rf" or "drop table" or "force push." If matched, the hook exits with code 1 and blocks the command. Claude sees the block and adjusts its approach.\n\nStart with these two patterns: auto-format after edits and block dangerous commands. They provide immediate value with minimal complexity.',
      },
      {
        heading: 'Real-World Hook Patterns',
        type: 'pattern',
        content:
          'Security scanning: A PreToolUse hook that checks edited files for hardcoded secrets (API keys, passwords, tokens) before the edit lands. Uses a simple grep pattern against the new content. Blocks the edit if secrets are detected.\n\nNotification on idle: A Notification hook that sends a macOS notification or Slack message when Claude is waiting for approval. Useful when running long tasks - you can work on something else and get pinged when Claude needs you.\n\nAuto-testing: A PostToolUse hook that runs the relevant test file after any source file edit. If you edit src/auth.ts, the hook runs tests/auth.test.ts automatically. Claude sees the test results in its next turn.\n\nGit safety: A PreToolUse hook that prevents Claude from running git push --force, git reset --hard, or git checkout . without explicit confirmation. These are the destructive git commands that can lose work.\n\nContext injection: A PreToolUse hook that runs at session start and appends today\'s date, current git branch, and recent commit messages to the context. Claude starts every session with fresh situational awareness.',
      },
      {
        heading: 'Debugging and Gotchas',
        type: 'pro-tip',
        content:
          'Hooks run synchronously. A slow hook blocks Claude from proceeding. Keep hooks fast - under 2 seconds. If you need to run something slow (a full test suite, a build), do it in the background and report results asynchronously.\n\nHook errors are visible to Claude. If your hook prints to stderr or exits with a non-zero code, Claude sees it as feedback. This is useful: a hook that blocks a command and prints "Blocked: never force push to main" teaches Claude to avoid that command in future turns.\n\nTest hooks outside Claude Code first. Write the shell command, run it manually, verify it works. Then add it as a hook. Debugging a broken hook inside an active Claude Code session is frustrating.\n\nMatchers are string matches, not regex (in the basic configuration). Use the command field for complex matching logic. Your hook script can inspect the full context and decide whether to act or pass through.\n\nHook order matters. Hooks of the same type run in array order. If you have two PreToolUse hooks, the first one runs first. If it blocks the tool, the second one never runs.',
      },
    ],
  },

  {
    id: 'how-to-build-persistent-ai-memory',
    title: 'How to Build AI Agent Memory That Persists Across Sessions',
    subtitle: 'Session handoffs, memory files, and the architecture that makes AI remember',
    category: 'cli-tools',
    description:
      'How to build persistent memory for AI coding agents. Context handoffs, structured memory files, knowledge bases, and the practical system that carries state across Claude Code sessions without losing context.',
    keywords: [
      'AI agent memory',
      'persistent AI memory',
      'claude code memory',
      'context handoff AI',
      'AI session memory',
      'claude code session handoff',
      'AI agent state management',
      'how to make AI remember',
      'AI memory across sessions',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'parallel-session-handoffs',
      'repo-context-engine',
      'constraints-and-context-engines',
      'how-to-write-claude-md',
    ],
    sections: [
      {
        heading: 'The Problem',
        type: 'prose',
        content:
          'Every AI session starts with amnesia. Claude Code opens, reads your CLAUDE.md, and knows your project conventions. But it does not know what you worked on yesterday, what decisions were made, what is blocked, or what the next step is. You re-explain the context every session. This wastes time and tokens.\n\nThe fix is a memory system - structured documents that carry state between sessions. Not a chat history dump. Not a vague summary. A system that gives each new session exactly the context it needs to continue where the last one left off.',
      },
      {
        heading: 'The Three Memory Layers',
        type: 'pattern',
        content:
          'A production-grade AI memory system has three layers. Each serves a different purpose and persists differently.\n\nLayer 1: Session Handoffs (episodic memory). What happened in the last session. What was built, what decisions were made, what is the current state, what should happen next. Written at the end of every session. Read at the start of the next. Short-lived - yesterday\'s handoff matters, last week\'s does not.\n\nLayer 2: Auto-Memory (semantic memory). Stable facts about the project and the user. Preferences, conventions, key architectural decisions, important file paths. Persists indefinitely. Updated when new facts are confirmed across multiple sessions. This is the MEMORY.md file that Claude Code manages in its projects directory.\n\nLayer 3: Knowledge Base (procedural memory). How to do things. Skills, workflows, patterns, templates. The CLAUDE.md, skills files, and wiki entries. Persists as long as the project exists. Evolves slowly through deliberate updates.\n\nLayer 1 changes daily. Layer 2 changes weekly. Layer 3 changes monthly. Each layer loads at a different time and serves a different function in the context window.',
      },
      {
        heading: 'Building Session Handoffs',
        type: 'code',
        content:
          'A session handoff is a structured Markdown document written at the end of every Claude Code session. It answers five questions:\n\n1. What was done? - List of completed work with specific files changed\n2. What is the current state? - Git branch, uncommitted changes, build status\n3. What decisions were made? - Key choices and their reasoning\n4. What is blocked? - Dependencies, waiting on external input, open questions\n5. What should happen next? - Prioritized list of next steps\n\nThe handoff goes to a timestamped file: ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md. Timestamped names prevent conflicts when multiple sessions run in parallel.\n\nAt session start, Claude Code reads all unconsumed handoffs (files not ending in _done.md), processes them, then renames each to file_done.md. Old consumed handoffs get cleaned up after 7 days.\n\nThis is parallel-safe. Two Claude Code sessions in different terminals can both write handoffs without overwriting each other. The next session reads all of them and gets the combined context.',
      },
      {
        heading: 'Auto-Memory That Actually Works',
        type: 'pattern',
        content:
          'Claude Code has a built-in auto-memory system. It writes to a MEMORY.md file in its project config directory. This file loads into context at session start.\n\nRules for effective auto-memory:\n\nSave stable patterns confirmed across multiple interactions. Not every one-off fact - patterns you see recurring. "User prefers 2-space indentation" is stable. "User is working on the auth module today" is session-specific and belongs in a handoff, not memory.\n\nOrganize by topic, not chronology. Create separate files for different domains (debugging.md, infrastructure.md, voice-rules.md) and link to them from MEMORY.md. This keeps the root memory file lean.\n\nKeep MEMORY.md under 200 lines. Lines after 200 get truncated when loaded into context. Put the most important facts first. Move details to topic files.\n\nUpdate or remove stale memories. If a convention changes, update the memory. If a decision was reversed, delete the old memory. Stale memories cause more harm than no memories because the AI follows outdated instructions with confidence.\n\nSave explicit user requests immediately. If the user says "always use bun instead of npm," save it now. Do not wait for multiple confirmations.',
      },
      {
        heading: 'The Full System in Practice',
        type: 'pro-tip',
        content:
          'Here is how the three layers work together in a real daily workflow.\n\n9 AM: Open Claude Code. It reads CLAUDE.md (Layer 3 - knows the project). It reads MEMORY.md (Layer 2 - knows my preferences). It reads yesterday\'s handoff (Layer 1 - knows what happened yesterday). In 10 seconds, Claude has the context of a teammate who was here yesterday.\n\nDuring the session: Claude uses Layer 3 to follow project conventions. It uses Layer 2 to match my preferences. It uses Layer 1 to continue the previous session\'s work without me re-explaining anything.\n\nEnd of session: Claude writes a new handoff (Layer 1). If any stable patterns were discovered, it updates MEMORY.md (Layer 2). If a workflow changed, the relevant skill gets updated (Layer 3).\n\nThe compound effect: after a week of this, the system knows my project deeply. After a month, it handles 80% of routine work without me providing context. After three months, a new Claude session is more productive in its first minute than a new human developer in their first day.\n\nThe key insight: memory is not a single file. It is three layers that serve different time horizons. Build all three and the compounding effect is dramatic.',
      },
    ],
  },

  /* ================================================================== */
  /*  LISTS — SEO-targeted curated content                               */
  /* ================================================================== */

  {
    id: 'top-10-claude-code-tips',
    title: 'Top 10 Claude Code Tips for Power Users',
    subtitle: 'Practical tips from daily use - not the obvious ones',
    category: 'cli-tools',
    description:
      'Ten Claude Code tips that go beyond the basics. Skills, hooks, parallel sessions, context management, and the workflows that 10x your output. From a practitioner who runs Claude Code as their primary development tool.',
    keywords: [
      'claude code tips',
      'claude code tricks',
      'claude code power user',
      'claude code best practices',
      'claude code advanced tips',
      'claude code productivity',
      'claude code guide 2026',
      'top claude code tips',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-power-features',
      'claude-code-quickstart',
      'how-to-write-claude-md',
      'how-to-setup-claude-code-hooks',
    ],
    sections: [
      {
        heading: '1. Use Plan Mode for Anything Non-Trivial',
        type: 'pattern',
        content:
          'Before Claude Code writes a single line of code, enter plan mode. Type /plan or ask Claude to plan the approach. It explores the codebase, identifies affected files, considers edge cases, and presents an implementation strategy for your approval.\n\nWithout plan mode: Claude starts coding immediately, realizes halfway through that the approach does not work, backtracks, and produces messy results.\n\nWith plan mode: Claude spends 30 seconds mapping the problem, you approve or adjust the approach, then it executes cleanly. The 30-second investment saves 10 minutes of debugging.\n\nThe rule: any task touching 3 or more files gets plan mode. No exceptions.',
      },
      {
        heading: '2. Write Skills for Repeating Workflows',
        type: 'pattern',
        content:
          'If you do something more than twice, it should be a skill. A skill is a Markdown file in .claude/skills/ that defines a step-by-step workflow Claude follows when triggered.\n\nExamples of skills worth building: /deploy (build, test, commit, push, verify), /morning (read handoffs, check git status, surface priorities), /draft-email (gather context, write email, push to drafts folder). Each skill replaces 5-10 manual instructions with a single command.\n\nSkills compound. Every time the skill runs and you notice an edge case, fix the skill. After 20 uses, it handles scenarios you never planned for. After 50 uses, it runs flawlessly without intervention.\n\nThe skill directory structure: .claude/skills/skill-name/SKILL.md. The SKILL.md file contains the trigger description, the step-by-step instructions, and any context the skill needs.',
      },
      {
        heading: '3. Run Parallel Sessions in Separate Terminals',
        type: 'pattern',
        content:
          'Open three terminal tabs. Run Claude Code in each. Give each session a different task. You just tripled your throughput.\n\nTab 1: Refactoring the API layer. Tab 2: Writing tests for the new feature. Tab 3: Updating documentation. All three run concurrently on the same codebase.\n\nWatch for conflicts: if two sessions edit the same file, the second write wins. Scope your parallel sessions to different directories or modules. API work in one session, UI work in another, docs in a third.\n\nFor maximum safety, use git worktrees. Each session gets its own branch and working directory. No conflicts possible. Merge when done.',
      },
      {
        heading: '4. Use Subagents for Research, Not Just Coding',
        type: 'pattern',
        content:
          'Subagents are not just for parallel code changes. They are research assistants. When Claude Code needs to understand a complex module before making changes, spawn an Explore subagent.\n\n"Before we refactor, I want to understand the auth module. Spawn an explore agent to map all authentication flows, find every place tokens are validated, and identify any hardcoded secrets."\n\nThe subagent digs through the code, returns a structured summary, and the main session makes decisions with full context. This keeps the main context window clean - the research happens in the subagent\'s context, and only the summary comes back.',
      },
      {
        heading: '5. Set Up a Morning Routine Skill',
        type: 'pattern',
        content:
          'The first five minutes of a coding session set the tone. Instead of manually checking status, build a /morning skill that does it automatically.\n\nA good morning skill: reads the context handoff from yesterday, runs git status, checks for unmerged PRs, surfaces the top three priority tasks, and prints a clean summary. You open Claude Code, type /morning, and get a full situational brief.\n\nThis one skill saves 10 minutes every morning and ensures you never start a session without context. Over a month, that is 3+ hours saved on just status checking.',
      },
      {
        heading: '6. Use /compact Before Context Gets Long',
        type: 'pro-tip',
        content:
          'Claude Code conversations consume context window space. After 20-30 turns, the context fills up and performance degrades. The /compact command summarizes the conversation so far and frees up space.\n\nThe trick: use /compact proactively, not reactively. After completing a major chunk of work, compact before starting the next chunk. This gives Claude fresh context space for the new task while preserving a summary of what was already done.\n\nDo not wait until Claude starts forgetting things or repeating itself. That means the context is already saturated. Compact early, compact often.',
      },
      {
        heading: '7. Write Context Handoffs at Session End',
        type: 'pattern',
        content:
          'Never close a Claude Code session without writing a handoff. The handoff captures what was done, what is the current state, and what should happen next. The next session reads it and starts with full context.\n\nAutomate this with a skill or a hook. A Stop hook can prompt Claude to write a handoff before exiting. A /handoff skill can generate a structured handoff document on demand.\n\nThe handoff is the bridge between sessions. Without it, every session starts from scratch. With it, sessions build on each other. After a week of handoffs, Claude knows your project as well as you do.',
      },
      {
        heading: '8. Use Hooks for Safety, Not Just Convenience',
        type: 'pattern',
        content:
          'The highest-value hooks are not formatters or notifiers. They are safety gates.\n\nA PreToolUse hook that blocks git push --force has prevented data loss more than once. A hook that scans edited files for API keys before they are written catches secrets before they hit disk. A hook that prevents edits to migration files avoids breaking the database.\n\nSafety hooks are set-and-forget insurance. You configure them once and they protect you forever. The 30 minutes to set them up saves hours of crisis response.',
      },
      {
        heading: '9. Keep CLAUDE.md Under 200 Lines',
        type: 'anti-pattern',
        content:
          'A 500-line CLAUDE.md is worse than a 100-line CLAUDE.md. It consumes context space that Claude needs for actual code. It buries important instructions under walls of detail. The model\'s adherence to instructions drops as the file grows.\n\nThe fix: keep CLAUDE.md lean. Use @imports for detailed docs. Point to files instead of copying content. Cut any instruction that Claude already follows by default.\n\nEvery line in CLAUDE.md should earn its place. If Claude would do the right thing without the instruction, delete the instruction. Only include rules that override defaults or enforce project-specific conventions.',
      },
      {
        heading: '10. Build a Lessons File for Self-Improvement',
        type: 'pro-tip',
        content:
          'Every time Claude Code makes a mistake and you correct it, add the lesson to a file. I use tasks/lessons.md. The CLAUDE.md tells Claude to read this file at session start.\n\nFormat: date, context, rule. "2026-03-01: MCP create_note double-escapes newlines. Rule: Never use MCP create_note for multi-line content. Use the REST API directly."\n\nOver time, this file becomes a custom knowledge base of project-specific gotchas. Claude reads it, avoids the same mistakes, and your error rate drops to near zero. The lessons file is the fastest path to a Claude Code instance that feels like it has months of experience on your project.\n\nThe meta-lesson: AI agents do not learn between sessions unless you build the mechanism. The lessons file is that mechanism.',
      },
    ],
  },

  {
    id: 'best-mcp-servers-2026',
    title: 'Best MCP Servers for Developers in 2026',
    subtitle: 'The MCP servers worth setting up - and the ones to skip',
    category: 'mcp-servers',
    description:
      'Curated list of the best Model Context Protocol servers for developers in 2026. What each does, setup complexity, daily utility, and honest assessment of which MCP servers actually improve your workflow.',
    keywords: [
      'best MCP servers',
      'MCP servers 2026',
      'model context protocol servers',
      'MCP server list',
      'best MCP servers for developers',
      'MCP server recommendations',
      'top MCP servers',
      'claude code MCP servers',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'what-are-mcps',
      'managing-mcp-servers',
      'mcp-gtm-stack',
      'claude-code-power-features',
    ],
    sections: [
      {
        heading: 'How to Evaluate MCP Servers',
        type: 'prose',
        content:
          'Not all MCP servers are worth the setup time. An MCP server connects an external service to your AI agent - but that only matters if you use that service frequently enough to benefit from AI integration.\n\nThe evaluation criteria: How often do you use this service? How much friction does the MCP server remove? How reliable is the server? Is the alternative (browser tab, CLI tool) actually worse?\n\nI have tested 30+ MCP servers over six months. Some became daily essentials. Some were cool demos that I removed after a week. Here are the ones that stuck.',
      },
      {
        heading: 'Tier 1: Daily Essentials',
        type: 'pattern',
        content:
          'Playwright (browser automation): The most useful MCP server for any developer. It gives Claude Code a real browser. Navigate pages, click buttons, fill forms, take screenshots, read page content. Use cases: testing deployments, scraping data, verifying UI changes, interacting with web services. Setup is one command. Reliability is excellent.\n\nFilesystem (enhanced file access): Extends Claude Code\'s file access beyond the current project. Read from any directory on your machine. Useful when your workflow spans multiple repos or you need to reference files outside the project root.\n\nGitHub (repository operations): Pull request management, issue tracking, code review - all from the terminal. Create PRs, comment on issues, check CI status, merge branches. Eliminates the browser round-trip for common GitHub operations.\n\nPostHog (analytics): Query your analytics data directly from Claude Code. "How many users visited the dashboard this week?" becomes a natural language query instead of logging into PostHog, navigating to the dashboard, and building a query. Essential if you make data-driven development decisions.',
      },
      {
        heading: 'Tier 2: High Value for Specific Workflows',
        type: 'pattern',
        content:
          'Supabase (database operations): Run SQL queries, manage migrations, deploy edge functions, generate TypeScript types. If Supabase is your backend, this MCP server replaces the dashboard for most operations. Claude can query your database, understand the schema, and write migrations that actually work.\n\nAttio or HubSpot (CRM): Look up contacts, create records, update deal stages - all from Claude Code. Valuable for GTM teams that need CRM data alongside code. Caveat: CRM MCP servers have reliability quirks. Some operations work perfectly. Others silently mangle data. Test thoroughly before trusting it with production records.\n\nTypefully (social media scheduling): Draft and schedule posts from Claude Code. If you publish content regularly, this eliminates the context switch to the Typefully UI. Claude can draft a post, you review it, and it gets scheduled without leaving the terminal.\n\nExa or Perplexity (web search): Give Claude Code web access. It can search for documentation, check current prices, find code examples, or verify facts. Useful for development sessions where you need real-time information.',
      },
      {
        heading: 'Tier 3: Nice to Have',
        type: 'pattern',
        content:
          'Slack (messaging): Send and read Slack messages from Claude Code. Useful for automated notifications (deploy complete, tests failing) but limited for actual conversations. The MCP interface is not great for threaded discussions.\n\nLinear or Jira (project management): Create issues, update status, query backlogs. Useful if your task management lives in these tools. But most developers find it faster to just open the web UI for project management tasks.\n\nNotion (documentation): Read and write Notion pages. Useful for teams that keep their docs in Notion and want Claude to reference them. Setup can be finicky with permissions.\n\nSentry (error monitoring): Query errors, check error rates, investigate stack traces. Valuable during debugging sessions. Less useful for routine development.',
      },
      {
        heading: 'MCP Servers to Skip',
        type: 'anti-pattern',
        content:
          'Some MCP servers are more trouble than they are worth:\n\nAnything that duplicates existing Claude Code capabilities. Claude Code can already read files, run commands, and search code. An MCP server that provides "enhanced file reading" adds overhead without meaningful improvement.\n\nServers with poor error handling. If an MCP server fails silently or returns cryptic errors, it creates more work than it saves. Before committing to any MCP server, test error cases: what happens when the service is down, when auth expires, when rate limits hit?\n\nServers for services you use once a week. The overhead of maintaining MCP server configuration, handling auth token refreshes, and debugging connection issues is only worth it for services you use daily. If you check your Stripe dashboard once a week, just open a browser tab.\n\nServers that require complex local infrastructure. Some MCP servers need Docker, local databases, or background processes. Unless the value is enormous, the maintenance cost outweighs the convenience.',
      },
      {
        heading: 'Setup Advice',
        type: 'pro-tip',
        content:
          'Start with Playwright. It is the most universally useful MCP server. One npm install, one config entry, and Claude Code can interact with any website.\n\nAdd GitHub next if you use GitHub daily. The gh CLI MCP server is battle-tested and reliable.\n\nThen add your stack-specific servers. Supabase if you use Supabase. PostHog if you use PostHog. Match MCP servers to your daily tools.\n\nKeep your MCP config clean. Unused servers consume startup time and context tokens. Remove any server you have not used in the past week. You can always re-add it.\n\nPro tip: document your MCP setup in CLAUDE.md. List which servers are configured and what they are for. This helps Claude Code use them appropriately and helps teammates replicate your setup.',
      },
    ],
  },

  /* ================================================================== */
  /*  PHASE 2: GTMe OS — GTM/Lead Gen/Email SEO pages                    */
  /* ================================================================== */

  {
    id: 'clay-vs-apollo-vs-zoominfo',
    title: 'Clay vs Apollo vs ZoomInfo',
    subtitle: 'Lead enrichment platforms compared - from someone who runs all three',
    category: 'comparisons',
    description:
      'Practitioner comparison of Clay, Apollo, and ZoomInfo for B2B lead enrichment. Pricing, data quality, workflow flexibility, and the real tradeoffs when building outbound infrastructure at startup scale.',
    keywords: [
      'clay vs apollo',
      'clay vs zoominfo',
      'apollo vs zoominfo',
      'clay vs apollo vs zoominfo',
      'best lead enrichment tool',
      'clay.com comparison',
      'B2B data enrichment tools 2026',
      'lead enrichment platform comparison',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'heyreach-linkedin-automation',
      'mcp-gtm-stack',
      'content-cluster-strategy',
    ],
    sections: [
      {
        heading: 'The Quick Version',
        type: 'prose',
        content:
          'Apollo is your starter kit. Good database, built-in sequencing, free tier that actually works. ZoomInfo is the enterprise standard. Massive database, intent data, premium pricing. Clay is the orchestration layer. It does not own a database - it connects to 150+ providers including Apollo and ZoomInfo and lets you build custom enrichment workflows.\n\nThe mistake most teams make: picking one and going all-in. The right answer for most startups is Apollo for the contact database, Clay for the enrichment logic, and maybe ZoomInfo later when you need intent signals at scale.\n\nI run Apollo as my primary contact source, Clay as my enrichment and scoring engine, and pipe everything into Attio CRM. Here is how each tool actually performs in production.',
      },
      {
        heading: 'Apollo: The Swiss Army Knife',
        type: 'pattern',
        content:
          'What Apollo does well: 275M+ contact database, built-in email sequences, LinkedIn integration, decent intent data, and a free tier with 60 credits/month. For a startup that needs to go from zero to outbound in a day, Apollo is the fastest path.\n\nThe contact data is solid for North American B2B. Email accuracy sits around 85-90% on verified emails. Phone numbers are hit-or-miss - maybe 60% accurate for direct dials. Company data (revenue, employee count, tech stack) is generally reliable for companies with 50+ employees.\n\nWhere Apollo falls short: enrichment is a black box. You get whatever Apollo has. No waterfall logic, no fallback providers, no custom enrichment chains. If Apollo does not have the data point you need, you are stuck. The email sequencer is functional but basic - no A/B testing on send times, limited personalization variables, and the analytics are surface-level.\n\nPricing: Free tier is genuinely useful for testing. Paid plans start at $49/user/month. The per-credit model means heavy enrichment users burn through allowances fast. Budget $100-200/month for a solo operator doing serious prospecting.',
      },
      {
        heading: 'ZoomInfo: The Enterprise Standard',
        type: 'pattern',
        content:
          'What ZoomInfo does well: the largest proprietary B2B database in the market. Intent data that actually predicts buying behavior. Company hierarchy data that maps decision-making units. Phone numbers that work. If you sell to enterprises and need the deepest possible data on target accounts, ZoomInfo is unmatched.\n\nThe intent data is the real differentiator. ZoomInfo tracks content consumption signals across its network - when a company starts researching topics related to your product, you see it. This is gold for ABM. Instead of spray-and-pray outbound, you target companies actively looking for solutions like yours.\n\nWhere ZoomInfo falls short: price. Annual contracts start at $15,000+. That is enterprise budget, not startup budget. The platform is also heavy - the UI assumes a RevOps team managing complex workflows. Solo operators find it overwhelming. And the contract structure is rigid - annual commitments with auto-renewal that is notoriously hard to cancel.\n\nReality check: most startups do not need ZoomInfo. Apollo covers 80% of the same data at 10% of the cost. ZoomInfo becomes worth it when you are doing enterprise ABM at scale and the intent data drives measurable pipeline.',
      },
      {
        heading: 'Clay: The Orchestration Layer',
        type: 'pattern',
        content:
          'Clay is fundamentally different from Apollo and ZoomInfo. It is not a database - it is a data orchestration platform. You build tables, pull data from 150+ providers, enrich records through waterfall logic, score leads with custom formulas, and push qualified leads to your outreach tools.\n\nWhat Clay does well: waterfall enrichment. Instead of relying on one provider for email addresses, Clay tries Provider A, then Provider B, then Provider C until it gets a match. This typically yields 20-30% more valid emails than any single provider. Custom scoring formulas let you define exactly what "qualified" means for your ICP. And Claygent (Clay\'s AI agent) can research prospects by crawling their websites, LinkedIn profiles, and news mentions.\n\nWhere Clay falls short: learning curve. Clay thinks in spreadsheets and formulas. If you are not comfortable with structured data operations, the first week is painful. Credits burn fast on complex enrichment chains - a single row might use 5-10 credits if you are running multiple enrichments. And Clay does not have its own outreach tools - you need Instantly, Lemlist, or HeyReach for the actual sending.\n\nPricing: starts at $149/month for 2,000 credits. Serious users need the $349/month plan (10,000 credits) minimum. Pro tip: connect your own API keys for providers like Prospeo or BuiltWith directly in Clay to bypass credit costs on those enrichments.',
      },
      {
        heading: 'The Stack I Actually Run',
        type: 'pro-tip',
        content:
          'My production outbound stack uses all three tools in specific roles:\n\nApollo: contact sourcing. I pull leads from Apollo based on ICP filters (title, company size, industry, tech stack). Apollo is the starting point - the raw lead list.\n\nClay: enrichment and scoring. Apollo leads flow into Clay where they get waterfall email enrichment (Apollo email, then Prospeo, then Dropcontact), company enrichment (revenue, tech stack, hiring signals), and custom ICP scoring. Leads scoring above threshold get pushed to outreach.\n\nInstantly: email delivery. Qualified leads from Clay go to Instantly for cold email sequences. Instantly handles domain rotation, warmup, and deliverability.\n\nHeyReach: LinkedIn delivery. The same qualified leads also go to HeyReach for LinkedIn outreach. Connection requests, follow-up messages, and profile views run in parallel with email.\n\nAttio: CRM. Everything flows into Attio for pipeline tracking. Deal stages, notes, activities - all centralized.\n\nThe total cost: Apollo ($49/mo) + Clay ($349/mo) + Instantly ($47/mo) + HeyReach ($79/mo) + Attio (free tier) = roughly $525/month for a complete outbound infrastructure. Compare that to ZoomInfo alone at $15,000+/year.\n\nThis stack generates more qualified pipeline than ZoomInfo would alone because the waterfall enrichment and custom scoring produce better-targeted outreach. Volume with precision beats premium data with spray-and-pray.',
      },
    ],
  },

  {
    id: 'instantly-vs-smartlead-vs-lemlist',
    title: 'Instantly vs Smartlead vs Lemlist',
    subtitle: 'Cold email platforms compared - deliverability, pricing, and what actually matters',
    category: 'comparisons',
    description:
      'Practitioner comparison of Instantly, Smartlead, and Lemlist for cold email outreach. Deliverability, pricing models, scaling limits, and the honest breakdown of which tool fits which use case.',
    keywords: [
      'instantly vs smartlead',
      'instantly vs lemlist',
      'smartlead vs lemlist',
      'instantly vs smartlead vs lemlist',
      'best cold email tool 2026',
      'cold email software comparison',
      'instantly review',
      'smartlead review',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'cold-email-infrastructure',
      'heyreach-linkedin-automation',
      'outbound-sales-stack-2026',
    ],
    sections: [
      {
        heading: 'What Matters in Cold Email Tools',
        type: 'prose',
        content:
          'Three things determine whether a cold email tool works: deliverability, scalability, and workflow fit. Everything else - AI features, fancy templates, multi-channel add-ons - is secondary. If your emails land in spam, nothing else matters. If you cannot scale past 100 emails/day without burning domains, the tool is a bottleneck. If the workflow does not match how your team operates, adoption dies.\n\nI have used all three in production. Instantly is my primary. Here is the honest comparison.',
      },
      {
        heading: 'Instantly: Best for Volume + Deliverability',
        type: 'pattern',
        content:
          'Instantly is built around one insight: cold email at scale requires infrastructure, not just software. The platform includes unlimited sending accounts on a flat fee, built-in warmup, automatic domain rotation, and deliverability monitoring.\n\nStrengths: Unlimited email accounts on the $47/month Growth plan. That is the killer feature. You can connect 20, 50, or 100 sending domains and Instantly rotates between them automatically. The warmup system is solid - it sends and receives emails across its network to build sender reputation. The B2B lead database (450M+ contacts) is a nice addition if you do not have Clay.\n\nWeaknesses: The email editor is basic. No advanced personalization beyond merge fields. Analytics are improving but still lag behind Lemlist. The UI can feel cluttered if you run many campaigns. Customer support is responsive but sometimes slow on complex technical issues.\n\nBest for: volume senders who prioritize deliverability and cost efficiency. If you are sending 500+ emails/day across multiple domains, Instantly is the most cost-effective option.',
      },
      {
        heading: 'Smartlead: Best for Agencies + Technical Users',
        type: 'pattern',
        content:
          'Smartlead is the API-first cold email platform. It is built for agencies managing multiple clients and technical users who want granular control over sending behavior.\n\nStrengths: Unlimited mailboxes starting at $39/month - even cheaper than Instantly. White-label client portals for agencies. The most granular sending controls: custom send windows, per-account limits, intelligent throttling. Dedicated IP options for enterprise senders. The sub-account system for agencies is best-in-class.\n\nWeaknesses: the UI is rougher than Instantly or Lemlist. Setup takes longer because there are more knobs to turn. Documentation assumes technical comfort. The lead database is not as comprehensive as Instantly or Apollo. Some advanced features require higher-tier plans.\n\nBest for: agencies running campaigns for 5+ clients, technical operators who want fine-grained control, and teams sending at very high volume (1000+ emails/day) who need dedicated infrastructure.',
      },
      {
        heading: 'Lemlist: Best for Personalization + Multi-Channel',
        type: 'pattern',
        content:
          'Lemlist started as a cold email tool and evolved into a multi-channel outreach platform. Its differentiator is personalization depth - dynamic images, custom landing pages, and LinkedIn steps integrated into email sequences.\n\nStrengths: the best personalization engine in cold email. Dynamic images that insert the prospect\'s name, company logo, or website screenshot into visuals. Built-in LinkedIn steps (profile visits, connection requests, messages) alongside email. Landing page creation for each prospect. The warmup tool (Lemwarm) is effective.\n\nWeaknesses: pricing per user at $69/month adds up fast. Each team member needs their own seat. No unlimited sending accounts - you pay per account. This makes Lemlist expensive at scale compared to Instantly or Smartlead. The LinkedIn automation is good but not as robust as a dedicated tool like HeyReach.\n\nBest for: teams that sell high-ACV deals where personalization drives response rates. If each reply is worth $1,000+ in pipeline, the extra personalization investment pays off. Less ideal for high-volume, low-touch outbound.',
      },
      {
        heading: 'Decision Framework',
        type: 'formula',
        content:
          'Choose Instantly if: you prioritize deliverability and volume, you want unlimited accounts on a flat fee, you are a solo operator or small team, and your outreach is primarily email-first.\n\nChoose Smartlead if: you run an agency managing multiple clients, you want maximum control over sending behavior, you need white-label client portals, or you are highly technical and want API-first workflows.\n\nChoose Lemlist if: you sell high-ACV deals where personalization matters, you want native multi-channel (email + LinkedIn) in one tool, you create visual/personalized campaigns, or your team is small enough that per-seat pricing is manageable.\n\nThe budget math:\n- 1 user, 5 sending accounts, 200 emails/day: Instantly ($47/mo) or Smartlead ($39/mo)\n- 3 users, 15 accounts, 500 emails/day: Instantly ($47/mo) vs Lemlist ($207/mo) vs Smartlead ($39/mo)\n- Agency, 10 clients, 50 accounts: Smartlead ($79/mo) is the clear winner\n\nMy recommendation for most startups: Instantly for email + HeyReach for LinkedIn. Lemlist if you are doing enterprise ABM where each prospect gets a custom experience. Smartlead if you are an agency.',
      },
    ],
  },

  {
    id: 'heyreach-vs-dripify-vs-expandi',
    title: 'HeyReach vs Dripify vs Expandi',
    subtitle: 'LinkedIn automation tools compared - account safety, scaling, and real performance',
    category: 'comparisons',
    description:
      'Comparison of HeyReach, Dripify, and Expandi for LinkedIn automation. Account rotation, safety features, pricing models, and which tool fits solo operators vs agencies vs enterprise teams.',
    keywords: [
      'heyreach vs dripify',
      'heyreach vs expandi',
      'dripify vs expandi',
      'best linkedin automation tool 2026',
      'linkedin automation comparison',
      'heyreach review',
      'linkedin outreach tools',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'heyreach-linkedin-automation',
      'instantly-vs-smartlead-vs-lemlist',
      'clay-vs-apollo-vs-zoominfo',
      'outbound-sales-stack-2026',
    ],
    sections: [
      {
        heading: 'Why LinkedIn Automation Matters',
        type: 'prose',
        content:
          'Email deliverability gets harder every year. LinkedIn is the counterbalance. Connection requests and messages land in the inbox with near-100% delivery. The response rates on LinkedIn outreach are 3-5x higher than cold email for B2B. The tradeoff: LinkedIn limits how much you can send, and they restrict accounts that look automated.\n\nA good LinkedIn automation tool maximizes your outreach volume while keeping your accounts safe. A bad one gets your LinkedIn profile restricted in a week. The three tools worth considering are HeyReach, Dripify, and Expandi.',
      },
      {
        heading: 'HeyReach: Unlimited Accounts, One Price',
        type: 'pattern',
        content:
          'HeyReach is the only LinkedIn automation tool that lets you connect unlimited accounts on a single subscription. This is the killer feature. You connect 5, 10, or 20 LinkedIn accounts, create one campaign, and HeyReach automatically rotates sending across all of them.\n\nWhy account rotation matters: LinkedIn limits each account to roughly 25 connection requests per day. One account = 125 requests per week. Five accounts = 625 requests per week. Twenty accounts = 2,500 per week. HeyReach scales linearly with accounts.\n\nStrengths: flat pricing regardless of account count (starting at $79/month). Unified inbox across all accounts. Campaign-level analytics that aggregate across senders. Smart rotation that distributes volume evenly and pauses accounts approaching limits.\n\nWeaknesses: the UI is functional but not polished. Campaign setup has a learning curve. The multi-channel features (email integration) are basic compared to Lemlist. Reporting could be more granular.\n\nBest for: agencies managing outreach across multiple client accounts, teams with 3+ senders, and anyone doing high-volume LinkedIn outreach.',
      },
      {
        heading: 'Dripify: Simple and Affordable',
        type: 'pattern',
        content:
          'Dripify is the most approachable LinkedIn automation tool. Clean interface, straightforward campaign builder, and pricing that works for solo operators.\n\nStrengths: easy setup - you can launch your first campaign in 15 minutes. The drip sequence builder is intuitive with conditional logic (if accepted, send message A; if not, wait and try again). Built-in email finder for multichannel follow-up. Analytics are clear and actionable. Pricing starts at $39/user/month on the Basic plan.\n\nWeaknesses: each LinkedIn account requires a separate subscription. At $39-79/user/month, a 5-person team costs $195-395/month - more than HeyReach\'s flat rate. No account rotation across profiles. Limited API access for custom integrations. The automation mimics human behavior but does not have the same sophisticated safety features as Expandi.\n\nBest for: solo operators and small teams (1-2 people) who want LinkedIn automation without complexity. If you have one LinkedIn account and want to automate your outreach, Dripify is the fastest path to results.',
      },
      {
        heading: 'Expandi: Enterprise Safety and Control',
        type: 'pattern',
        content:
          'Expandi is built for users who cannot afford to lose their LinkedIn account. Dedicated IP addresses, smart timing algorithms, and the most sophisticated safety features in the category.\n\nStrengths: dedicated IP per account (your activity does not share infrastructure with other users). Smart timing that mimics human usage patterns - varying send times, adding random delays, respecting business hours in the prospect\'s timezone. Advanced personalization with dynamic GIFs and images. Webhook integrations for CRM sync. The safety track record is the best in the industry.\n\nWeaknesses: most expensive option at $99/account/month. Each account is a separate subscription. The interface is powerful but complex - more knobs and settings than most users need. Setup time is longer than Dripify. The learning curve is steeper.\n\nBest for: enterprise sellers with high-authority LinkedIn profiles they cannot risk. If your LinkedIn profile is a core business asset (high follower count, established network, personal brand), Expandi\'s safety features justify the premium price.',
      },
      {
        heading: 'My Recommendation',
        type: 'pro-tip',
        content:
          'For most teams building outbound: HeyReach. The unlimited account rotation at a flat price is the most scalable model. Connect your team\'s LinkedIn accounts, build campaigns that rotate across all of them, and scale your LinkedIn outreach without scaling your costs linearly.\n\nFor solo operators on a budget: Dripify. Simple, affordable, gets the job done. Upgrade to HeyReach when you add a second LinkedIn sender.\n\nFor enterprise sellers protecting high-value profiles: Expandi. The dedicated IP and safety features are worth the premium if a LinkedIn restriction would cost you more than $99/month in lost pipeline.\n\nThe combination I run: HeyReach for LinkedIn outreach paired with Instantly for email. Clay feeds both tools with enriched, scored leads. This multi-channel approach typically generates 2-3x the response rate of single-channel outbound because prospects see your name on LinkedIn and email within the same week.',
      },
    ],
  },

  {
    id: 'gtm-engineer-vs-sdr-vs-revops',
    title: 'GTM Engineer vs SDR vs RevOps',
    subtitle: 'Three roles, one revenue goal - what each actually does',
    category: 'comparisons',
    description:
      'Clear breakdown of the GTM Engineer, SDR, and RevOps roles. What each does, where they overlap, career progression, compensation, and why GTM Engineering is the fastest-growing role in B2B.',
    keywords: [
      'GTM engineer vs SDR',
      'GTM engineer vs RevOps',
      'what is a GTM engineer',
      'GTM engineer role',
      'GTM engineer salary',
      'GTM engineer job description',
      'SDR to GTM engineer',
      'revenue operations vs GTM engineering',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'outbound-sales-stack-2026',
      'cold-email-infrastructure',
    ],
    sections: [
      {
        heading: 'The 30-Second Version',
        type: 'prose',
        content:
          'SDRs do the outreach manually. RevOps builds the systems that SDRs work inside. GTM Engineers automate the outreach itself so that fewer SDRs do more with less manual work.\n\nSDR: "I am going to send 50 emails today and make 30 calls." RevOps: "I am going to build the Salesforce workflow that routes these leads to the right SDR." GTM Engineer: "I am going to build the pipeline that sources, enriches, scores, and sequences leads automatically so the SDR only talks to qualified prospects."\n\nThese are not competing roles. They are layers. Most growing companies need all three. But if you are building a team from scratch with limited budget, a GTM Engineer gives you the highest leverage.',
      },
      {
        heading: 'SDR: The Human Outreach Layer',
        type: 'pattern',
        content:
          'What SDRs do: prospect research, cold calling, cold emailing, LinkedIn outreach, booking meetings for account executives. They are the front line of revenue generation.\n\nTypical day: research 20 accounts, send 50 personalized emails, make 30 cold calls, send 15 LinkedIn messages, book 2-3 meetings. Most work happens inside a CRM (Salesforce, HubSpot) and a sales engagement platform (Outreach, Salesloft, Apollo).\n\nCompensation: base salary $45,000-65,000 with OTE (on-target earnings) of $70,000-90,000. Top performers in tech hubs push $100,000+ OTE.\n\nCareer path: SDR to Senior SDR (12-18 months), then to Account Executive, Sales Manager, or - increasingly - GTM Engineer.\n\nThe reality: SDR work is largely manual and repetitive. The best SDRs naturally start automating their own workflows. They build email templates, create prospecting spreadsheets, find tools that speed up research. That instinct to automate is the seed of GTM Engineering.',
      },
      {
        heading: 'RevOps: The Systems Architect',
        type: 'pattern',
        content:
          'What RevOps does: owns the tech stack, builds CRM workflows, creates reporting dashboards, manages data hygiene, designs the lead routing logic, and ensures marketing, sales, and customer success are operating on the same data.\n\nTypical day: fix a broken Salesforce automation, build a lead scoring model, audit data quality in the CRM, create a pipeline report for leadership, evaluate a new tool vendor, configure HubSpot workflows for a new campaign.\n\nCompensation: $90,000-150,000 base. Senior RevOps and Director-level roles push $150,000-200,000+.\n\nSkillset: CRM administration (Salesforce, HubSpot), data analysis, workflow automation, tool evaluation, cross-functional coordination. RevOps lives at the intersection of sales, marketing, and customer success.\n\nThe gap: RevOps builds the systems but rarely builds the outbound pipeline itself. They configure the CRM. They do not source the leads. They set up the email sequences. They do not write the enrichment logic. This gap is where GTM Engineering lives.',
      },
      {
        heading: 'GTM Engineer: The Automation Builder',
        type: 'pattern',
        content:
          'What GTM Engineers do: build automated pipelines that source, enrich, score, and sequence leads with minimal manual intervention. They combine the outbound knowledge of an SDR with the technical skills of an engineer and the systems thinking of RevOps.\n\nTypical day: build a Clay enrichment workflow that pulls from 5 data providers, write a Python script that validates email addresses via MX record lookup, configure an Instantly campaign with domain rotation, set up a Playwright scraper that extracts pricing data from competitor websites, build a scoring formula that ranks leads by ICP fit.\n\nCompensation: $130,000-200,000+ base. The role is new enough that compensation varies widely. Top GTM Engineers at well-funded startups command $200,000+ total comp. The 205% year-over-year increase in job postings means demand far outpaces supply.\n\nSkillset: Clay, Apollo, Instantly, Python scripting, API integrations, data enrichment, email deliverability, CRM configuration, AI/automation tools. The best GTM Engineers also understand sales methodology - they know what makes a qualified lead because they have done the outreach themselves.\n\nWhy it is the fastest-growing role: one GTM Engineer can replace 3-5 SDRs in terms of pipeline output. Not because they work harder, but because they build machines that work 24/7. Companies report 7x higher conversion rates and 80% lower pipeline costs when GTM Engineers build the outbound infrastructure.',
      },
      {
        heading: 'The Career Path from SDR to GTM Engineer',
        type: 'pro-tip',
        content:
          'The fastest path to GTM Engineering starts in an SDR seat. Here is why: SDRs understand outbound at the ground level. They know which emails get responses, which call scripts work, which LinkedIn messages get accepted. That domain knowledge is irreplaceable.\n\nThe transition: start automating your own SDR workflow. Learn Clay to enrich your own lead lists. Learn Instantly to scale your email outreach. Learn basic Python to script the repetitive parts. Within 6 months of deliberate skill-building, you have the foundation.\n\nThe skills to stack: Clay (data orchestration), Python (scripting and automation), API literacy (connecting tools), email deliverability (SPF, DKIM, DMARC, warmup), and AI tools (Claude Code, ChatGPT for research and content generation).\n\nI made this transition myself. Started in manual outbound, learned the tools, started automating, and now run a full GTM operating system. The manual experience matters - you cannot automate what you do not understand.\n\nThe market reality: companies are actively converting their best SDRs into GTM Engineers. If you are an SDR who can build Clay tables and write Python scripts, you are in the top 1% of candidates for the highest-paid role in revenue operations.',
      },
    ],
  },

  {
    id: 'cold-email-infrastructure',
    title: 'How to Build Cold Email Infrastructure from Scratch',
    subtitle: 'Domains, DNS, warmup, and the deliverability stack that actually lands in inboxes',
    category: 'comparisons',
    description:
      'Step-by-step guide to building cold email infrastructure. Domain purchasing, SPF/DKIM/DMARC setup, mailbox warmup, sending rotation, and the deliverability practices that keep you out of spam in 2026.',
    keywords: [
      'cold email infrastructure',
      'cold email setup guide',
      'SPF DKIM DMARC cold email',
      'email deliverability setup',
      'cold email domain setup',
      'how to set up cold email',
      'cold email warmup',
      'email sending infrastructure 2026',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'instantly-vs-smartlead-vs-lemlist',
      'outbound-sales-stack-2026',
      'clay-vs-apollo-vs-zoominfo',
    ],
    sections: [
      {
        heading: 'Why Infrastructure Matters More Than Copy',
        type: 'prose',
        content:
          'Everyone obsesses over email copy. The subject line. The opening hook. The CTA. None of that matters if the email lands in spam. Deliverability is the foundation. Build it right and mediocre copy still generates replies. Build it wrong and the best copy in the world goes unread.\n\nCold email infrastructure has three layers: domains (your sending identity), authentication (proving you are legitimate), and reputation (earning trust over time). Skip any layer and your emails hit spam within weeks.',
      },
      {
        heading: 'Step 1: Domain Strategy',
        type: 'code',
        content:
          'Never send cold email from your primary domain. If your company is acme.com, buy secondary domains for outbound: tryacme.com, getacme.com, acmehq.com, useacme.com. If one domain gets burned, your main domain stays clean.\n\nHow many domains: start with 3-5. Each domain gets 2-3 mailboxes. That gives you 6-15 sending accounts to rotate. For every 50 emails/day you want to send, plan for one domain with 2-3 mailboxes.\n\nDomain purchasing rules: buy .com only (other TLDs have lower trust). Keep the name close to your brand (prospects should recognize it). Avoid hyphens, numbers, or random words. Register through Google Domains, Namecheap, or Cloudflare.\n\nMailbox setup: use Google Workspace ($6/user/month) or Microsoft 365 ($6/user/month) for your sending accounts. These have the best inbox placement rates. Avoid custom SMTP or cheap email providers - major inbox providers trust Google and Microsoft senders more.',
      },
      {
        heading: 'Step 2: DNS Authentication (SPF, DKIM, DMARC)',
        type: 'code',
        content:
          'Every sending domain needs three DNS records. These prove to inbox providers that your emails are legitimate.\n\nSPF (Sender Policy Framework): tells inbox providers which servers are authorized to send email from your domain. Add a TXT record to your DNS:\n\nFor Google Workspace: v=spf1 include:_spf.google.com ~all\nFor Microsoft 365: v=spf1 include:spf.protection.outlook.com ~all\n\nDKIM (DomainKeys Identified Mail): cryptographically signs your emails so inbox providers can verify they were not modified in transit. Google Workspace and Microsoft 365 both have DKIM setup in their admin panels. Generate the key, add the CNAME or TXT records to your DNS.\n\nDMARC (Domain-based Message Authentication): tells inbox providers what to do when SPF or DKIM fails. Start with a monitoring policy:\n\nv=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com\n\nAfter 2-4 weeks of monitoring with no issues, upgrade to:\n\nv=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com\n\nEventually move to p=reject for maximum trust. This tells inbox providers to reject any email from your domain that fails authentication.\n\nVerification: use MXToolbox or mail-tester.com to verify all three records are configured correctly before sending a single email.',
      },
      {
        heading: 'Step 3: Warmup',
        type: 'pattern',
        content:
          'New domains have zero reputation. Inbox providers treat unknown senders as suspicious. Warmup builds your sender reputation gradually.\n\nHow warmup works: your sending accounts exchange emails with other accounts in a warmup network. These emails get opened, replied to, and marked as important. This signals to Gmail, Outlook, and Yahoo that your domain sends email that people want to read.\n\nTimeline: minimum 14 days before sending any cold emails. 21-30 days is better. During warmup, your accounts should send and receive 20-40 warmup emails per day with engagement (opens, replies, clicks).\n\nBuilt-in warmup tools: Instantly includes warmup in every plan. Smartlead includes it. Lemlist has Lemwarm. If your cold email tool does not include warmup, use a standalone tool like Warmbox or Mailreach.\n\nNever stop warmup. Keep warmup running even after you start cold campaigns. The ongoing warmup emails maintain your sender reputation alongside your cold outreach. Most tools let you run both simultaneously.\n\nSigns warmup is working: open rates above 60% in the warmup network, zero spam folder placements, and your domain passes all authentication checks on mail-tester.com (score 9/10 or higher).',
      },
      {
        heading: 'Step 4: Sending Strategy',
        type: 'formula',
        content:
          'The rules that keep you out of spam:\n\nVolume per account: never exceed 30 cold emails per day per account. 20-25 is safer. Combined with warmup emails, each account should send 40-60 total emails daily (20-25 cold + 20-30 warmup).\n\nRamp schedule: week 1 after warmup: 5 cold emails/day per account. Week 2: 10/day. Week 3: 15/day. Week 4: 20-25/day. Do not jump to full volume immediately.\n\nDomain rotation: distribute your daily send volume across all domains. If you send 100 cold emails/day, use 5 accounts across 3 domains. Your cold email tool handles this rotation automatically.\n\nSend timing: business hours in the prospect\'s timezone. Tuesday through Thursday are highest-performing days. Avoid Monday mornings and Friday afternoons.\n\nBounce management: keep bounce rate below 3%. If a campaign exceeds 5% bounces, pause it and clean the list. High bounce rates destroy sender reputation fast.\n\nSpam complaint rate: stay below 0.1%. Gmail\'s hard limit is 0.3% - above that, your domain gets flagged. Monitor this in Google Postmaster Tools.\n\nUnsubscribe compliance: include an unsubscribe link in every cold email. This is legally required (CAN-SPAM, GDPR) and reduces spam complaints because annoyed recipients unsubscribe instead of reporting spam.',
      },
    ],
  },

  {
    id: 'how-to-build-abm-pipeline-with-ai',
    title: 'How to Build an ABM Pipeline with AI',
    subtitle: 'The automated account-based pipeline from ICP to booked meeting',
    category: 'comparisons',
    description:
      'How to build an AI-powered ABM pipeline for small teams. Account sourcing, enrichment, scoring, personalized outreach, and the automation stack that runs account-based marketing without a 10-person team.',
    keywords: [
      'ABM pipeline automation',
      'account based marketing AI',
      'ABM for startups',
      'automated ABM pipeline',
      'how to build ABM',
      'ABM tools small team',
      'account based marketing automation',
      'AI ABM pipeline',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'cold-email-infrastructure',
      'instantly-vs-smartlead-vs-lemlist',
      'heyreach-linkedin-automation',
      'data-lake-for-gtm',
    ],
    sections: [
      {
        heading: 'ABM Without the Enterprise Budget',
        type: 'prose',
        content:
          'Traditional ABM requires Demandbase ($50K+/year), a dedicated ABM manager, a content team, and months of setup. That is enterprise ABM. Most startups cannot afford it and do not need it.\n\nAI-powered ABM flips the model. Instead of expensive intent platforms and manual account research, you use Clay for enrichment, AI for personalization, and automation for execution. A solo operator can run a targeted ABM program that outperforms enterprise teams by being more precise and faster to iterate.\n\nThe pipeline I built generates qualified meetings from target accounts at roughly $525/month in tooling costs. Here is the complete system.',
      },
      {
        heading: 'Step 1: Define Your ICP as a Scoring Formula',
        type: 'pattern',
        content:
          'Most teams define their ICP in a slide deck: "Mid-market SaaS companies, 50-500 employees, Series A-C, North America." That is too vague to automate.\n\nAn automatable ICP is a scoring formula. Every attribute gets a point value:\n\nCompany size: 50-200 employees = 10 points, 200-500 = 8 points, 500-1000 = 5 points.\nFunding stage: Series A = 10, Series B = 8, Seed = 5, Bootstrapped = 3.\nIndustry: SaaS = 10, Fintech = 8, E-commerce = 5.\nTech stack signals: uses Salesforce = 5, uses HubSpot = 3, uses Outreach = 5.\nHiring signals: posted SDR/BDR jobs in last 90 days = 10 points.\nGrowth signals: headcount grew 20%+ in last 6 months = 8 points.\n\nTotal score determines tier: 40+ = Tier 1 (priority outreach), 25-39 = Tier 2 (standard outreach), below 25 = skip.\n\nThis formula goes directly into Clay. Every account gets scored automatically. No human judgment needed for the initial sort.',
      },
      {
        heading: 'Step 2: Automated Account Sourcing and Enrichment',
        type: 'code',
        content:
          'The enrichment pipeline runs in Clay with waterfall logic:\n\n1. Source accounts from Apollo by ICP filters (industry, size, location, tech stack)\n2. Enrich company data: revenue (from Apollo), tech stack (from BuiltWith via Clay), funding (from Crunchbase), headcount growth (from LinkedIn via Clay)\n3. Score each account using the ICP formula\n4. For Tier 1 and Tier 2 accounts, find contacts: pull decision-makers by title (VP Sales, Head of Revenue, CRO, VP Marketing)\n5. Waterfall email enrichment: try Apollo email, then Prospeo, then Dropcontact until verified\n6. Validate emails: MX record check to confirm the domain accepts email\n7. AI research: use Claygent to visit each company\'s website and extract one relevant personalization datapoint (recent product launch, hiring surge, funding round, partnership announcement)\n\nThe entire pipeline runs in one Clay table. New accounts flow in, enrichment happens automatically, and qualified leads with verified emails and personalization data flow out to your outreach tools.\n\nCost per enriched lead: roughly $0.50-1.50 in Clay credits depending on how many enrichment steps fire. For 500 leads/month, budget $250-750 in Clay credits.',
      },
      {
        heading: 'Step 3: Multi-Channel Outreach Sequences',
        type: 'pattern',
        content:
          'Qualified leads from Clay get pushed to two outreach channels simultaneously:\n\nEmail via Instantly: 4-step sequence over 14 days. Email 1: personalized cold email referencing the Claygent research. Email 2 (day 3): value-add follow-up with relevant insight. Email 3 (day 7): social proof or case study reference. Email 4 (day 14): breakup email.\n\nLinkedIn via HeyReach: parallel 3-step sequence. Day 0: profile view. Day 1: connection request with personalized note. Day 3 (if accepted): direct message expanding on the email.\n\nThe timing is deliberate. Email hits first, LinkedIn reinforces. The prospect sees your name in two places within the same week. This multi-channel approach typically generates 2-3x the response rate of email alone.\n\nPersonalization at scale: the Claygent research from Step 2 feeds into both email and LinkedIn templates as merge variables. Each prospect gets a unique first line that references something specific to their company. This is not "Hi {first_name}, I noticed {company_name} is growing" - it is "Saw your team just launched the enterprise tier and posted 3 SDR roles this month. That scaling pattern is exactly where our automation fits."\n\nResponse handling: positive replies go to the CRM (Attio) as new deals. Meetings booked via Calendly link in the email. Negative replies trigger automatic removal from all sequences.',
      },
      {
        heading: 'The Full Stack and Cost',
        type: 'pro-tip',
        content:
          'The complete ABM stack:\n\nClay ($349/mo) - enrichment, scoring, personalization research\nApollo ($49/mo) - contact database and initial sourcing\nInstantly ($47/mo) - email delivery and domain rotation\nHeyReach ($79/mo) - LinkedIn automation and account rotation\nAttio (free) - CRM and pipeline tracking\nGoogle Workspace ($6/mo per mailbox x 6 = $36/mo) - sending infrastructure\n\nTotal: roughly $560/month\n\nWhat this produces: 500-1000 enriched, scored, personalized outbound contacts per month. Multi-channel sequences running automatically. 24/7 pipeline generation with minimal daily maintenance (30 minutes for reply handling and sequence optimization).\n\nCompare to: one SDR costs $70,000-90,000/year ($6,000-7,500/month). This automated pipeline produces comparable or higher meeting volume at 8% of the cost. And it scales with tooling costs, not headcount.\n\nThe human element: you still need someone to handle positive replies, run discovery calls, and close deals. The automation handles everything before the first human conversation. That is the 80% of the sales process that used to require manual SDR work.',
      },
    ],
  },

  {
    id: 'how-to-use-clay-enrichment',
    title: 'How to Use Clay for Lead Enrichment',
    subtitle: 'Waterfall enrichment, scoring formulas, and the Clay workflows that actually work',
    category: 'comparisons',
    description:
      'Practical tutorial for using Clay.com for B2B lead enrichment. Table setup, waterfall enrichment logic, Claygent AI research, credit optimization, and real workflow examples from a production pipeline.',
    keywords: [
      'how to use clay',
      'clay enrichment tutorial',
      'clay.com guide',
      'clay waterfall enrichment',
      'clay lead enrichment',
      'claygent tutorial',
      'clay workflow examples',
      'clay.com tutorial 2026',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'how-to-build-abm-pipeline-with-ai',
      'outbound-sales-stack-2026',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'What Clay Actually Is',
        type: 'prose',
        content:
          'Clay is a spreadsheet that can call APIs. That is the simplest mental model. Each row is a lead or company. Each column is a data point. The difference from Google Sheets: Clay columns can pull data from 150+ providers automatically. Type a company name, and Clay can fetch the revenue, employee count, tech stack, funding history, hiring activity, and social profiles - all without you leaving the table.\n\nThe power is in the workflow, not any single data point. You chain enrichments together: source leads from Apollo, enrich company data from multiple providers, score them against your ICP, find contacts, verify emails, generate personalized opening lines, and push to outreach. One table replaces a 10-step manual process.',
      },
      {
        heading: 'Setting Up Your First Enrichment Table',
        type: 'code',
        content:
          'Start with a source. The easiest: paste a list of company domains or import from a CSV. Clay also connects directly to Apollo, LinkedIn Sales Navigator, and other databases.\n\nColumn 1: Company domain (your input)\nColumn 2: Company name (auto-enriched from domain)\nColumn 3: Employee count (Clay enrichment from multiple providers)\nColumn 4: Industry (Clay enrichment)\nColumn 5: Revenue estimate (Clay enrichment)\nColumn 6: Tech stack (BuiltWith integration - add your own API key to save credits)\n\nFor each column, click the + button and select an enrichment action. Clay shows you which providers can fill that column and what it costs in credits. Start with the cheapest provider. If it returns empty, add a fallback provider.\n\nThis is waterfall enrichment: try Provider A (cheapest or most accurate). If no result, try Provider B. If still no result, try Provider C. You define the priority order. Clay runs through them automatically for each row.\n\nCredit tip: every enrichment action costs credits. A single row with 5 enrichments might use 5-15 credits. At $349/month for 10,000 credits, that is 650-2,000 rows per month. Plan your enrichment depth based on your credit budget.',
      },
      {
        heading: 'Waterfall Email Enrichment',
        type: 'pattern',
        content:
          'Finding verified email addresses is the highest-value Clay workflow. The waterfall approach yields 20-30% more valid emails than any single provider.\n\nSet up three email enrichment columns in order:\n\n1. Apollo email lookup (cheapest, good coverage for US contacts)\n2. Prospeo email finder (strong for European contacts, connect your own API key)\n3. Dropcontact email enrichment (GDPR-compliant, good for contacts Apollo misses)\n\nEach column has a condition: only run if the previous column returned empty. This prevents wasting credits on leads that already have a verified email.\n\nAfter the waterfall, add an MX validation column. This checks whether the email domain actually accepts email. It catches defunct domains, typos, and honeypot addresses. MX validation costs almost nothing in credits and saves you from bounce-rate damage.\n\nResults: a waterfall with 3 providers and MX validation typically yields 70-85% valid email coverage on a B2B contact list. Single-provider enrichment gets you 50-60%. That 20% difference is hundreds of extra contacts per month reaching real inboxes.',
      },
      {
        heading: 'Claygent: AI Research at Scale',
        type: 'pattern',
        content:
          'Claygent is Clay\'s built-in AI agent. Give it a prompt and a URL, and it researches the target and returns structured data. This is how you generate personalization at scale without manually researching each prospect.\n\nExample prompt: "Visit this company\'s website and find: 1) Their most recent product launch or major announcement 2) Whether they are hiring for sales or marketing roles 3) One specific data point that shows they are growing."\n\nClaygent visits the website, reads the content, and returns the findings in your specified format. This runs on every row automatically.\n\nUse cases beyond personalization:\n\nCompetitor analysis: "Visit this company\'s pricing page and extract their pricing tiers and feature lists."\nTech stack detection: "Visit this website and identify which analytics, CRM, and marketing tools they use based on page source and visible integrations."\nContent research: "Find this company\'s most recent blog post and summarize its main topic."\n\nCredit cost: Claygent uses more credits than standard enrichments (typically 5-10 credits per row). Use it selectively - run Claygent only on Tier 1 accounts that passed your scoring threshold, not on every lead.',
      },
      {
        heading: 'Credit Optimization Tricks',
        type: 'pro-tip',
        content:
          'Clay credits are the main cost driver. Here is how to get maximum value:\n\nBring your own API keys. For providers like BuiltWith, Prospeo, Dropcontact, and Hunter - connect your own API keys in Clay settings. These enrichments use your provider subscription instead of Clay credits. If you already pay for Prospeo ($39/month for 5,000 lookups), route those lookups through your key instead of burning Clay credits.\n\nFilter before enriching. Do not enrich every row in your table. Add filter conditions: only enrich companies with 50+ employees, only find contacts with VP or Director in the title, only run Claygent on accounts scoring 40+. Every filter saves credits on low-value leads.\n\nBatch processing. Upload your full lead list, run the cheap enrichments first (company name, industry, size), filter to qualified accounts, then run the expensive enrichments (email waterfall, Claygent research) only on the filtered set.\n\nTemplate tables. Build your enrichment workflow once, save it as a template. New campaigns start from the template instead of rebuilding from scratch. This prevents mistakes that waste credits on misconfigured enrichments.\n\nMonitor credit usage. Clay shows credit consumption per column. If one enrichment is burning credits without adding value (low fill rate, data you do not use), remove it from the waterfall.',
      },
    ],
  },

  {
    id: 'outbound-sales-stack-2026',
    title: 'The Complete Outbound Sales Stack for Startups in 2026',
    subtitle: 'Every tool you need - and the ones you can skip',
    category: 'comparisons',
    description:
      'The full outbound sales technology stack for startups in 2026. Data sourcing, enrichment, email, LinkedIn, CRM, and automation - with pricing, alternatives, and the build order that gets you to pipeline fastest.',
    keywords: [
      'outbound sales stack 2026',
      'best outbound sales tools',
      'sales tech stack startups',
      'cold outreach tools 2026',
      'outbound sales tools comparison',
      'B2B sales stack',
      'startup sales tools',
      'GTM tech stack 2026',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'instantly-vs-smartlead-vs-lemlist',
      'heyreach-vs-dripify-vs-expandi',
      'cold-email-infrastructure',
    ],
    sections: [
      {
        heading: 'The Stack at a Glance',
        type: 'prose',
        content:
          'You need five layers to run outbound: data (who to target), enrichment (what you know about them), email delivery (how to reach their inbox), LinkedIn delivery (how to reach their feed), and CRM (where to track everything). Every other tool is optional.\n\nMost startups over-buy. They sign up for 15 tools, spend months integrating them, and generate zero pipeline. Start with the minimum stack that produces meetings. Add tools only when a specific bottleneck demands it.',
      },
      {
        heading: 'Layer 1: Data Sourcing',
        type: 'pattern',
        content:
          'What it does: finds the companies and contacts that match your ICP.\n\nRecommended: Apollo ($49/month). 275M+ contacts, decent company data, built-in ICP filters. The free tier (60 credits/month) is enough to validate your ICP before paying.\n\nAlternative: LinkedIn Sales Navigator ($99/month). Better for account-based targeting where you need to find specific people at specific companies. The search filters are more granular than Apollo for seniority, function, and company attributes.\n\nSkip for now: ZoomInfo ($15,000+/year). Enterprise pricing for enterprise needs. Apollo covers 80% of the same data at 3% of the cost.\n\nBudget option: Apollo free tier + manual LinkedIn research. You can build a meaningful pipeline with zero data sourcing costs if you are willing to invest time instead of money.',
      },
      {
        heading: 'Layer 2: Enrichment and Scoring',
        type: 'pattern',
        content:
          'What it does: adds data points to your leads (email, phone, company details, tech stack, hiring signals) and scores them against your ICP.\n\nRecommended: Clay ($149-349/month). Waterfall enrichment from 150+ providers. Custom scoring formulas. Claygent AI research. This is the highest-leverage tool in the stack - it turns raw contact lists into qualified, personalized outbound.\n\nAlternative: Apollo built-in enrichment (included in subscription). Limited to Apollo\'s own data. No waterfall logic, no custom scoring. Works if your needs are basic.\n\nSkip for now: Clearbit, Lusha, or standalone enrichment tools. Clay subsumes them by connecting to all of them through a single interface.\n\nBudget option: skip dedicated enrichment entirely. Use Apollo data as-is and focus on volume over personalization. This works for lower-ACV products where response rate per email matters less than total volume.',
      },
      {
        heading: 'Layer 3: Email Delivery',
        type: 'pattern',
        content:
          'What it does: sends cold email sequences with proper deliverability infrastructure.\n\nRecommended: Instantly ($47/month). Unlimited sending accounts, built-in warmup, domain rotation. Best balance of deliverability and cost for most startups.\n\nAlternative: Smartlead ($39/month). Slightly cheaper, more technical, better for agencies. Lemlist ($69/user/month) if you need advanced personalization for high-ACV deals.\n\nThe infrastructure you need regardless of tool: 3-5 secondary domains, Google Workspace or Microsoft 365 mailboxes, SPF/DKIM/DMARC configured on every domain, 14-21 days of warmup before first cold send.\n\nSkip for now: Outreach, Salesloft, or HubSpot sequences for cold outbound. These are designed for warm sequences to existing leads, not cold prospecting at scale. Their deliverability features lag behind dedicated cold email tools.',
      },
      {
        heading: 'Layer 4: LinkedIn Delivery',
        type: 'pattern',
        content:
          'What it does: automates LinkedIn connection requests, messages, and profile engagement.\n\nRecommended: HeyReach ($79/month). Unlimited LinkedIn accounts on a flat fee. Account rotation across your team. Best value for multi-sender LinkedIn outreach.\n\nAlternative: Dripify ($39/user/month) for solo operators who want simplicity. Expandi ($99/account/month) for enterprise sellers who need maximum account safety.\n\nWhy you need LinkedIn alongside email: email open rates in cold outbound average 40-50%. LinkedIn connection acceptance rates average 30-40%. Running both channels on the same prospects means they see your name in two places. Multi-channel response rates are typically 2-3x single-channel.\n\nSkip for now: LinkedIn Sales Navigator InMail. The response rates on InMail are poor compared to connection requests with personalized notes. Save the $99/month unless you specifically need the advanced search filters.',
      },
      {
        heading: 'Layer 5: CRM',
        type: 'pattern',
        content:
          'What it does: tracks pipeline, deals, activities, and customer relationships.\n\nRecommended: Attio (free tier to start, $29/user/month for paid). Modern CRM with excellent API, flexible data model, and native integrations with Clay and common outbound tools. The free tier handles everything a small team needs.\n\nAlternative: HubSpot CRM (free tier). The most popular free CRM. Heavier than Attio, more features for marketing automation, larger ecosystem of integrations.\n\nSkip for now: Salesforce. Enterprise CRM for enterprise teams. If you are a startup with under 10 sales reps, Salesforce adds complexity without proportional value. You can always migrate later when you outgrow Attio or HubSpot.\n\nThe total stack cost:\nApollo ($49) + Clay ($349) + Instantly ($47) + HeyReach ($79) + Attio (free) + domains and mailboxes ($50) = approximately $575/month.\n\nThat is the price of one junior SDR\'s monthly coffee budget for infrastructure that generates pipeline 24/7.',
      },
      {
        heading: 'Build Order: What to Set Up First',
        type: 'pro-tip',
        content:
          'Week 1: Apollo (free tier) + email infrastructure (buy domains, set up DNS, start warmup). Cost: $50 for domains and mailboxes.\n\nWeek 2: Instantly (connect warmed accounts, build first email sequence). Start with your best ICP segment. 50 emails/day to test messaging. Cost: add $47/month.\n\nWeek 3: Clay (build enrichment workflow, start scoring leads). Replace manual Apollo research with automated enrichment. Cost: add $149-349/month.\n\nWeek 4: HeyReach (add LinkedIn to your multi-channel outreach). Same leads getting email now also get LinkedIn touches. Cost: add $79/month.\n\nWeek 5: CRM (Attio or HubSpot, move pipeline tracking from spreadsheets). Cost: free.\n\nThis build order means you are sending outbound by week 2 (14 days), not week 8. Start generating pipeline immediately with basic infrastructure, then layer on sophistication. Do not wait until the whole stack is perfect to start reaching out.\n\nThe one rule: never launch outbound without warmed domains and proper DNS. Two weeks of warmup is non-negotiable. Everything else can be iterated on while the pipeline is running.',
      },
    ],
  },

  {
    id: 'clay-vs-manual-enrichment',
    title: 'Clay vs Manual Enrichment',
    subtitle: 'When Clay pays for itself and when a spreadsheet is fine',
    category: 'comparisons',
    description:
      'Honest comparison of Clay automated enrichment vs manual research. When Clay is worth the investment, when manual works, the breakeven calculation, and how to decide based on your outbound volume and ICP complexity.',
    keywords: [
      'is clay worth it',
      'clay.com review',
      'clay pricing worth it',
      'do I need clay',
      'clay vs spreadsheet',
      'manual lead research vs clay',
      'clay ROI',
      'clay.com cost benefit',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'clay-vs-apollo-vs-zoominfo',
      'how-to-use-clay-enrichment',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'The Honest Answer',
        type: 'prose',
        content:
          'Clay is not for everyone. If you send 50 cold emails a week to an obvious ICP (all SaaS companies, all with 100+ employees, all in North America), Apollo alone handles your sourcing and enrichment. You do not need Clay.\n\nClay becomes essential when: your ICP requires multiple data points to qualify (tech stack + funding stage + hiring signals + company size), you need personalization that goes beyond "Hi {first_name}", or your volume exceeds what one person can manually research in a day.\n\nThe breakeven: if manual research takes you 5 minutes per lead and Clay takes 30 seconds, Clay saves 4.5 minutes per lead. At 200 leads/month, that is 15 hours saved. At $349/month for Clay, you are paying $23/hour for the time savings. If your time is worth more than $23/hour, Clay pays for itself.',
      },
      {
        heading: 'When Manual Works Fine',
        type: 'pattern',
        content:
          'Manual research with a spreadsheet beats Clay in these scenarios:\n\nLow volume: under 100 leads per month. The time savings do not justify the subscription cost. Spend the $349/month on something else.\n\nSimple ICP: if your qualification criteria are basic (title + company size + industry), Apollo or LinkedIn Sales Navigator gives you everything you need without Clay.\n\nHighly targeted ABM: if you are reaching out to 10 specific enterprise accounts per month, each one deserves 30 minutes of deep manual research. No automation can match the quality of a human reading the CEO\'s latest conference talk and referencing it in the opening line.\n\nBootstrapped budget: when you are spending $0 on tooling and every dollar counts, your time is the cheapest resource. Trade time for money until revenue justifies the investment.\n\nA good manual workflow: LinkedIn Sales Navigator for sourcing, Apollo free tier for email lookup, Google for company research, a Google Sheet for tracking. Cost: $99/month for Sales Navigator. Output: 50-100 well-researched leads per month.',
      },
      {
        heading: 'When Clay Becomes Essential',
        type: 'pattern',
        content:
          'Clay is worth every penny in these scenarios:\n\nVolume above 200 leads/month: manual research at this volume takes 15+ hours/month. Clay does it in minutes. The time savings alone justify the cost.\n\nComplex ICP scoring: when qualification requires combining 5+ data points (employee count + funding + tech stack + hiring signals + growth rate), building this in a spreadsheet is fragile. Clay formulas handle it elegantly and consistently.\n\nWaterfall enrichment needs: if a single email provider gives you 55% coverage but you need 80%+, Clay\'s waterfall across 3-4 providers is the only scalable solution. Manually checking multiple providers for each contact is soul-crushing.\n\nPersonalization at scale: when every outbound email needs a custom first line referencing something specific to the company, Claygent automates what would take 3-5 minutes per lead manually.\n\nMulti-channel routing: Clay can push qualified leads to both Instantly (email) and HeyReach (LinkedIn) automatically. Manual routing between tools is error-prone and slow.\n\nThe signal: if you find yourself spending more time preparing outreach than actually sending it, Clay solves that bottleneck.',
      },
      {
        heading: 'The Migration Path',
        type: 'pro-tip',
        content:
          'You do not need to go all-in on Clay immediately. Here is the gradual path:\n\nMonth 1: Manual workflow with Apollo + spreadsheet. Learn your ICP, test messaging, understand what data points actually predict qualified leads. Cost: $49/month.\n\nMonth 2: Add Clay at the $149/month tier (2,000 credits). Build one enrichment workflow for your highest-value ICP segment. Keep manual research for everything else. Prove the ROI on a small scale.\n\nMonth 3: If Clay is producing better-qualified leads (higher response rates, more meetings booked), upgrade to the $349/month tier. Move all enrichment to Clay. Kill the spreadsheet.\n\nMonth 4+: Optimize Clay workflows. Add Claygent for personalization. Connect your own API keys to reduce credit usage. Build template tables for different campaign types.\n\nThe key metric to track: meetings booked per 100 outbound contacts. If Clay-enriched leads book meetings at 2x the rate of manually-researched leads, the tool has paid for itself 10x over.',
      },
    ],
  },

  {
    id: 'email-deliverability-checklist-2026',
    title: 'Email Deliverability Checklist for 2026',
    subtitle: 'The 15-point checklist that keeps cold email out of spam',
    category: 'comparisons',
    description:
      'Complete email deliverability checklist for cold outreach in 2026. DNS setup, warmup, sending limits, content rules, and monitoring - the step-by-step checklist used on a production outbound stack.',
    keywords: [
      'email deliverability checklist',
      'cold email deliverability 2026',
      'email deliverability best practices',
      'avoid spam folder cold email',
      'email warmup checklist',
      'SPF DKIM DMARC checklist',
      'cold email spam prevention',
      'email deliverability guide',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'cold-email-infrastructure',
      'instantly-vs-smartlead-vs-lemlist',
      'outbound-sales-stack-2026',
    ],
    sections: [
      {
        heading: 'Before You Send a Single Email',
        type: 'code',
        content:
          'The pre-launch checklist. Do not skip any step.\n\n1. Buy 3-5 secondary domains (never send cold email from your primary domain)\n2. Set up Google Workspace or Microsoft 365 mailboxes on each domain (2-3 per domain)\n3. Add SPF record to DNS for each domain\n4. Enable DKIM signing in your email provider admin panel and add DKIM records to DNS\n5. Add DMARC record to DNS (start with p=none, upgrade to p=quarantine after 2 weeks)\n6. Verify all records at MXToolbox.com or mail-tester.com (score should be 9/10 or higher)\n7. Start warmup on every mailbox (minimum 14 days, ideally 21-30 days)\n8. Set up Google Postmaster Tools for each domain to monitor reputation\n9. Create a custom tracking domain for your cold email tool (avoids shared tracking domain blacklists)\n10. Test send to your own Gmail, Outlook, and Yahoo accounts to verify inbox placement',
      },
      {
        heading: 'Sending Rules',
        type: 'formula',
        content:
          'These limits keep your domains healthy:\n\n11. Maximum 25-30 cold emails per mailbox per day (plus 20-30 warmup emails)\n12. Ramp volume gradually: 5/day week 1, 10/day week 2, 15/day week 3, 20-25/day week 4\n13. Rotate across all domains and mailboxes (your cold email tool handles this automatically)\n14. Keep bounce rate below 3% (above 5% = pause and clean your list immediately)\n15. Keep spam complaint rate below 0.1% (Gmail hard limit is 0.3%)',
      },
      {
        heading: 'Content Rules That Affect Deliverability',
        type: 'pattern',
        content:
          'What you write affects where it lands. Content rules:\n\nAvoid spam trigger words in subject lines: "free", "guaranteed", "act now", "limited time", "click here." These are not automatic spam triggers, but they increase spam filter sensitivity.\n\nKeep emails short. 50-125 words performs best for cold email. Long emails signal marketing rather than personal communication.\n\nLimit links. One link maximum in the email body (your CTA). Zero links in the first email of a sequence performs even better. Spam filters flag emails with multiple links.\n\nNo images in cold email. Images trigger spam filters and look like marketing emails. Pure text looks like a real person writing to another person.\n\nPlain text format. No HTML formatting, no bold, no colors. If your cold email looks like a newsletter, it gets filtered like a newsletter.\n\nInclude an unsubscribe mechanism. A simple line at the bottom: "If this is not relevant, let me know and I will not follow up." This is legally required and reduces spam complaints.\n\nAvoid URL shorteners. bit.ly and similar services are abused by spammers. Use your full domain URL or a custom tracking domain.',
      },
      {
        heading: 'Ongoing Monitoring',
        type: 'pattern',
        content:
          'Deliverability degrades if you stop paying attention. Weekly checks:\n\nGoogle Postmaster Tools: check domain reputation (should be "High" or "Medium"). If it drops to "Low", pause cold sending immediately and investigate.\n\nBounce rate by campaign: any campaign above 3% bounce rate needs list cleaning. Pull the bounced addresses, identify the pattern (all from one company? old data source? specific domain?), and fix the source.\n\nSpam complaint monitoring: check in your cold email tool. Even one complaint per 1,000 emails (0.1%) is a warning sign. Investigate which emails triggered complaints.\n\nOpen rates as deliverability proxy: if your open rates drop below 30%, you likely have a deliverability problem. Healthy cold email open rates are 45-65%. Below 30% means emails are landing in spam.\n\nWarmup health: check that warmup is still running on all accounts. Some tools pause warmup automatically when sending volume is high. Keep warmup running continuously.\n\nDomain age: track how old each domain is. Domains under 30 days old should send at reduced volume. Domains under 90 days old should not exceed 20 emails/day.',
      },
      {
        heading: 'Emergency Recovery',
        type: 'pro-tip',
        content:
          'If a domain gets flagged or inbox placement drops:\n\n1. Pause all cold sending from the affected domain immediately\n2. Keep warmup running (or increase warmup volume slightly)\n3. Check Google Postmaster Tools for specific issues\n4. Review recent campaigns for high bounce rates, spam complaints, or content issues\n5. Wait 7-14 days with only warmup (no cold email) to rebuild reputation\n6. Resume cold sending at 50% volume and ramp back up gradually over 2 weeks\n\nIf a domain is fully burned (reputation stays "Bad" after 30 days of rest), retire it. Remove all mailboxes, stop warmup, and replace with a new domain. Domain burning is normal in cold outbound - treat domains as consumable infrastructure, not permanent assets.\n\nThe prevention: rotate domains before they burn. If you have 5 domains, use 3 actively and keep 2 on warmup-only as backups. Rotate the active set every 60-90 days. This keeps every domain fresh and prevents any single domain from accumulating too much cold sending history.',
      },
    ],
  },

  /* ================================================================== */
  /*  PHASE 3: Content OS — Content/Social/Growth SEO pages              */
  /* ================================================================== */

  {
    id: 'linkedin-vs-twitter-vs-reddit-b2b',
    title: 'LinkedIn vs X vs Reddit for B2B Content',
    subtitle: 'Where to post, what works on each, and how to run all three without burning out',
    category: 'comparisons',
    description:
      'Comparison of LinkedIn, X/Twitter, and Reddit for B2B content distribution. Audience differences, algorithm behavior, content formats that work, and the multi-platform strategy that compounds.',
    keywords: [
      'linkedin vs twitter for B2B',
      'linkedin vs reddit content',
      'best platform B2B content 2026',
      'linkedin vs x vs reddit',
      'B2B content distribution',
      'where to post B2B content',
      'linkedin reddit twitter comparison',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'mcp-content-stack',
      'how-to-grow-on-reddit',
      'how-to-repurpose-content',
      'content-stack-solo-builders',
    ],
    sections: [
      {
        heading: 'Three Platforms, Three Audiences',
        type: 'prose',
        content:
          'LinkedIn is where professionals perform. X is where builders argue. Reddit is where practitioners help. Same person, three different modes. The executive who posts polished thought leadership on LinkedIn is the same person upvoting raw technical takes on Reddit at 11pm.\n\nThe mistake: picking one platform and ignoring the others. The opportunity: the same core idea plays differently on each platform. A LinkedIn post about AI automation gets professional engagement. The same idea as a Reddit comment gets technical credibility. The same idea as an X thread gets builder community reach.\n\nI run all three. They serve different purposes in the same funnel.',
      },
      {
        heading: 'LinkedIn: Professional Signal',
        type: 'pattern',
        content:
          'What works on LinkedIn: personal experience stories, contrarian takes on industry trends, specific results with numbers, and frameworks that people can screenshot and share.\n\nAlgorithm behavior: LinkedIn rewards early engagement. The first 60-90 minutes determine your reach. Posts that get comments (not just likes) within the first hour get pushed to the broader network. The algorithm favors text-only posts and carousels over links (external links get suppressed).\n\nFormat that performs: short paragraphs, one idea per line, 150-300 words. Start with a hook that stops the scroll. End with a question or CTA that invites comments. Avoid hashtags in 2026 - they add clutter without meaningful reach benefit.\n\nWho you reach: decision-makers, executives, VPs, hiring managers. LinkedIn audience skews senior. If your content targets founders, VPs of Sales, or CTOs, LinkedIn is the primary channel.\n\nPosting cadence: 3-5 posts per week. Consistency matters more than perfection. A mediocre post that goes out beats a perfect post sitting in your drafts.',
      },
      {
        heading: 'X/Twitter: Builder Community',
        type: 'pattern',
        content:
          'What works on X: real-time takes, building in public, technical insights, hot takes on tools and trends, thread breakdowns of complex topics.\n\nAlgorithm behavior: X rewards engagement velocity. The first 30-60 minutes are critical. Replies, retweets, and bookmarks signal value. X Premium gives an algorithmic boost - serious creators need it. Threads get 3x more engagement than single tweets.\n\nFormat that performs: single tweets for hot takes (under 280 characters, punchy). Threads for depth (5-15 tweets, each one standalone-valuable). Quote tweets with added commentary. Avoid generic takes - X rewards specificity and conviction.\n\nWho you reach: builders, engineers, indie hackers, startup founders. X audience skews technical and opinionated. If your content targets developers, product builders, or early-stage founders, X is a primary channel.\n\nPosting cadence: 2-5 original tweets/threads per week plus 10-20 replies to other people. Replies build your network faster than original posts. Reply to people bigger than you with substantive takes, not "great post" comments.',
      },
      {
        heading: 'Reddit: Practitioner Credibility',
        type: 'pattern',
        content:
          'What works on Reddit: genuine help, specific technical answers, personal experience shared without self-promotion, and honest opinions backed by evidence.\n\nAlgorithm behavior: Reddit is community-driven, not algorithm-driven. Upvotes determine visibility within a subreddit. Moderators control quality. Posts and comments that provide genuine value get upvoted. Self-promotion gets downvoted and removed.\n\nFormat that performs: detailed comments answering specific questions (200-500 words with real examples). Personal experience posts ("I built X, here is what I learned"). Comparison posts with honest pros and cons. Avoid anything that reads like marketing.\n\nWho you reach: practitioners, hands-on operators, people actively solving problems. Reddit audience skews toward people doing the work, not managing the work. If your content targets people who use the tools daily, Reddit builds the deepest credibility.\n\nPosting cadence: 5-10 comments per week across 3-5 relevant subreddits. Focus on helping people with specific problems. Do not drop links. Do not mention your product unless directly asked. Build karma through genuine contribution first.',
      },
      {
        heading: 'The Multi-Platform Strategy',
        type: 'pro-tip',
        content:
          'Here is how to run all three without tripling your workload:\n\nCore content creation: write one substantial piece per week. A blog post, a detailed guide, or a documented experience. This is your source material.\n\nLinkedIn: extract the key insight and personal angle. Write it as a 200-word personal post. Lead with the contrarian take or surprising result. Post Tuesday-Thursday between 8-10am.\n\nX: extract the sharpest take. Write it as a single tweet or a 5-tweet thread. Be more direct and opinionated than LinkedIn. Post any day, engage in replies throughout the day.\n\nReddit: find subreddit threads where people are asking about your topic. Write detailed, helpful comments that draw on your experience. Do not link to your blog. Just help. The credibility compounds over time.\n\nThe flywheel: LinkedIn builds professional authority. X builds builder community. Reddit builds practitioner credibility. Together, they create a presence that no single platform can match. And all three feed SEO - Reddit content gets indexed by Google, LinkedIn profiles rank, X threads get cited by AI engines.\n\nTime investment: 3-4 hours per week total. 1 hour for core content. 30 minutes for LinkedIn adaptation. 30 minutes for X adaptation. 1-2 hours for Reddit commenting throughout the week.',
      },
    ],
  },

  {
    id: 'ai-content-vs-human-content',
    title: 'AI Content vs Human Content',
    subtitle: 'When AI writes better, when humans write better, and how to use both',
    category: 'comparisons',
    description:
      'Honest comparison of AI-generated content vs human-written content. Where AI excels, where it falls flat, the anti-slop framework for quality control, and the hybrid workflow that produces better output than either alone.',
    keywords: [
      'AI content vs human content',
      'AI writing vs human writing',
      'AI generated content quality',
      'is AI content good enough',
      'AI content detection',
      'AI slop content',
      'how to avoid AI slop',
      'AI content best practices',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'contentos',
    related: [
      'how-to-use-ai-content-creation',
      'how-to-build-voice-system',
      'content-stack-solo-builders',
    ],
    sections: [
      {
        heading: 'The Real Difference',
        type: 'prose',
        content:
          'AI writes faster. Humans write with lived experience. That is the fundamental difference, and it determines when to use each.\n\nAI can generate a 2,000-word comparison of cold email tools in 3 minutes. It will be accurate, well-structured, and comprehensive. But it will read like a research report - thorough but impersonal. No real stories. No "I tried this and it failed at 3am." No earned opinions.\n\nHumans write slower but embed experience into every sentence. The developer who spent three months debugging a deployment pipeline writes differently about deployment than an AI summarizing documentation. The difference is felt, not always measurable.\n\nThe best content in 2026 is neither pure AI nor pure human. It is AI-assisted human content - the human provides the experience, opinions, and voice; the AI handles structure, research, and first-draft generation.',
      },
      {
        heading: 'Where AI Wins',
        type: 'pattern',
        content:
          'AI is better than most humans at:\n\nStructured reference content. Documentation, glossaries, comparison tables, checklists. AI organizes information cleanly and does not forget to cover edge cases.\n\nFirst drafts. Getting from blank page to structured draft is where AI saves the most time. The first draft is never the final product, but having a structure to react to is faster than writing from scratch.\n\nVolume. If you need 50 product descriptions, 20 email variants, or 10 landing pages, AI handles volume that would take a human team weeks.\n\nResearch synthesis. Combining information from multiple sources into a coherent summary. AI reads 10 articles and synthesizes the key points faster and more comprehensively than a human skimming the same articles.\n\nSEO-optimized structure. AI naturally produces well-structured content with clear headings, keyword integration, and logical flow. This is what search engines want.',
      },
      {
        heading: 'Where Humans Win',
        type: 'pattern',
        content:
          'Humans are better than any AI at:\n\nOriginal experience. "I shipped this feature at 2am while my dog Broly slept on my keyboard" cannot be generated. Lived experiences are the content moat that AI cannot replicate.\n\nContrarian takes. AI optimizes for consensus. It gives you the average opinion. Humans form strong, sometimes wrong, opinions based on personal experience. "Everyone says Cursor is better. I think Claude Code is better for X reason." Those opinions drive engagement.\n\nVoice and personality. AI writes in a competent, generic voice. Humans have quirks, patterns, preferences. "Lowercase energy. Substance over polish." That is a voice. AI can mimic it with enough examples, but the voice originates from a human.\n\nEmotional resonance. The career pivot story. The struggle narrative. The honest failure post. These connect because readers feel the human behind the words.\n\nCultural context. AI misses nuance, timing, and the unwritten rules of specific communities. A Reddit comment that lands perfectly in r/ClaudeAI requires understanding the community culture, not just the topic.',
      },
      {
        heading: 'The Anti-Slop Framework',
        type: 'formula',
        content:
          'AI slop is content that reads like it was generated without human editing. It has telltale patterns:\n\nGeneric phrases: "In the ever-evolving landscape of..." "It is worth noting that..." "At the end of the day..." "Let us dive deeper into..." If you see these in your draft, the AI is filling space without adding substance.\n\nEmpty transitions: "Furthermore..." "Additionally..." "Moreover..." These are padding words. Cut them and the content gets tighter.\n\nHedging: "It could potentially be argued that..." "There are various considerations to keep in mind..." Just say the thing. Make a claim. Back it up.\n\nNo specifics: "Many companies find success with..." Which companies? What success? AI defaults to vague generalizations. Human content names names and cites numbers.\n\nThe 3-flag rule: if a piece of content triggers 3 or more anti-slop patterns, rewrite it from scratch. Do not patch. Patching AI slop leaves artifacts that readers sense even if they cannot articulate why. Start over with the human experience as the foundation and use AI to structure around it.',
      },
      {
        heading: 'The Hybrid Workflow',
        type: 'pro-tip',
        content:
          'The workflow that produces the best content:\n\n1. Human brainstorm. You identify the topic from your actual experience. Not "what should I write about" but "what did I learn this week that others would find useful."\n\n2. AI research and structure. Use AI to gather supporting data, identify angles you might miss, and produce a structural outline.\n\n3. Human first draft. Write the opening, the key arguments, and the conclusion yourself. Use your voice, your examples, your opinions. This is where the content gets its soul.\n\n4. AI expansion. Let AI fill in the supporting sections, add context, improve transitions, and handle the parts that need thoroughness but not personality.\n\n5. Human edit and voice pass. Read the full piece aloud. Does it sound like you? Cut anything that sounds generic. Add specifics where the AI was vague. Inject the personality.\n\n6. Anti-slop audit. Run through the anti-slop checklist. Three or more flags means another edit pass.\n\nThis produces content that is comprehensive (AI contribution), authentic (human contribution), and polished (iterative editing). It takes 60-90 minutes instead of the 3 hours of pure human writing or the 10 minutes of pure AI generation that nobody wants to read.',
      },
    ],
  },

  {
    id: 'building-in-public-as-gtm',
    title: 'Building in Public as a GTM Channel',
    subtitle: 'Why your build log is your best marketing and how to do it without cringing',
    category: 'comparisons',
    description:
      'Building in public as a go-to-market strategy. Why documentation beats advertising, what to share and what to keep private, platform-specific tactics, and the compound effect of transparent building.',
    keywords: [
      'building in public',
      'build in public strategy',
      'building in public marketing',
      'build in public GTM',
      'transparent building',
      'build in public content strategy',
      'ship in public',
      'building in public tips',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'how-to-repurpose-content',
      'ai-content-vs-human-content',
    ],
    sections: [
      {
        heading: 'Why Building in Public Works',
        type: 'prose',
        content:
          'Traditional marketing says: "Here is our product. Here is why it is great. Buy it." Building in public says: "Here is what I built today. Here is what broke. Here is what I learned. Here is what I am building next."\n\nThe second approach builds more trust, faster. People trust process over claims. When you show the messy middle - the 3am debugging session, the failed deploy, the pivot when the first approach did not work - you demonstrate competence through evidence, not assertions.\n\nBuilding in public works as a GTM channel because it attracts your ideal customers through specificity. A post about "how I automated my outbound pipeline with Clay and Instantly" only resonates with people who care about outbound automation. Those are exactly the people you want finding you. The content self-selects the audience.',
      },
      {
        heading: 'What to Share',
        type: 'pattern',
        content:
          'The content that works in build-in-public:\n\nShipping updates. "Shipped 3 new features this week: X, Y, Z. Here is how they work and why we built them." Short, specific, shows velocity.\n\nTechnical decisions. "We chose SQLite over Postgres for our content index. Here is why." Teaches your audience while positioning your expertise.\n\nFailure post-mortems. "Our email deliverability tanked last week. Here is what went wrong and how we fixed it." These get the highest engagement because they are rare. Everyone posts wins. Few post losses.\n\nNumbers. Revenue, user counts, traffic, costs - whatever you are comfortable sharing. Specific numbers build credibility. "377 impressions in 2 months with zero deliberate SEO" is more interesting than "growing steadily."\n\nStack breakdowns. The tools you use and why. "$525/month runs my entire outbound infrastructure" is content that your ICP actively searches for.\n\nDaily/weekly logs. What you built, what you learned, what is next. Consistency is the key. A weekly build log for 12 months creates a body of work that compounds into authority.',
      },
      {
        heading: 'What to Keep Private',
        type: 'anti-pattern',
        content:
          'Not everything should be public:\n\nClient names and details. Never share who you work with without explicit permission. Patterns are fine ("we helped a Series B fintech"). Specifics are not.\n\nUnvalidated opinions about people. Critique approaches, never individuals. "This architecture has scaling problems" is fine. "This person&#39;s code is bad" is not.\n\nSecurity details. Your deployment setup, API keys, internal URLs, server configurations. Share what you built, not how to break into it.\n\nRevenue from specific clients. Aggregate numbers are fine. Per-client revenue is private.\n\nIn-progress negotiations. Do not share deals, partnerships, or business discussions before they close. Premature announcement creates pressure and can kill deals.',
      },
      {
        heading: 'Platform-Specific Build-in-Public Tactics',
        type: 'pattern',
        content:
          'LinkedIn: polish the story slightly. Frame the build as a professional insight. "Built a multi-agent AI workflow this week. The key insight: delegation beats optimization." Business professionals engage with takeaways they can apply to their own work.\n\nX/Twitter: raw and real-time. "Just shipped. 3 sites deployed from one monorepo in 20 seconds. The CI pipeline took longer to build than the sites themselves." X rewards speed and authenticity.\n\nReddit: help first, share second. Answer questions in relevant subreddits with your build experience. "I had this exact problem. Here is how I solved it: [detailed technical answer]." Building credibility in communities that trust practitioners over promoters.\n\nBlog: the archive. Everything you share on social platforms is ephemeral. The blog post is the permanent record. Write a weekly or monthly recap of what you shipped, what you learned, and what changed. This is your SEO play - blog posts rank in Google long after social posts disappear from feeds.\n\nGitHub: the proof. A public repo with commit history is the ultimate build-in-public artifact. People can see what you actually built, not just what you claim to have built.',
      },
      {
        heading: 'The Compound Effect',
        type: 'pro-tip',
        content:
          'Building in public is a slow burn that suddenly compounds. Month 1-3: you feel like you are shouting into the void. Low engagement. Few followers. This is normal. Keep posting.\n\nMonth 3-6: people start recognizing your name. You get replies from people who have been silently reading. Inbound DMs start. "I have been following your build log and I have a question about..."\n\nMonth 6-12: you are the reference person for your niche. People tag you in conversations. You get inbound leads from your content. Your build log is doing the selling without you ever making a sales pitch.\n\nThe key: consistency beats intensity. One post per week for a year (52 posts) beats a burst of 20 posts in one month followed by silence. The audience builds trust through repeated exposure, not volume.\n\nThe hidden benefit: building in public forces you to think clearly about what you are building. Explaining your work to an audience clarifies your own thinking. The content is not just marketing - it is a feedback loop on your product and strategy.',
      },
    ],
  },

  {
    id: 'how-to-grow-on-reddit',
    title: 'How to Grow on Reddit Without Getting Banned',
    subtitle: 'Karma-first strategy, subreddit culture, and authentic engagement that compounds',
    category: 'comparisons',
    description:
      'Practical Reddit growth guide for builders and creators. How to build karma, choose subreddits, write comments that get upvoted, and turn Reddit credibility into real business outcomes without violating community rules.',
    keywords: [
      'how to grow on reddit',
      'reddit growth strategy',
      'reddit karma strategy',
      'reddit marketing 2026',
      'how to get upvotes reddit',
      'reddit for business',
      'reddit engagement strategy',
      'reddit for B2B',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'how-to-repurpose-content',
      'building-in-public-as-gtm',
    ],
    sections: [
      {
        heading: 'Reddit Is Not Social Media',
        type: 'prose',
        content:
          'Reddit does not work like LinkedIn or X. On those platforms, you build a personal brand and broadcast to followers. On Reddit, you earn credibility within communities by providing value. There are no followers that see your posts (practically). Every post and comment succeeds or fails on its own merit within the specific subreddit.\n\nThis is why most marketing strategies fail on Reddit. If you approach Reddit with a LinkedIn mindset - polished posts with a CTA - you get downvoted and banned. Reddit users have zero tolerance for self-promotion. The entire culture is built around genuine contribution.\n\nThe good news: if you actually have expertise and share it generously, Reddit is the highest-trust platform on the internet. A Reddit comment from a verified practitioner carries more credibility than a LinkedIn post from a CMO.',
      },
      {
        heading: 'The Karma-First Strategy',
        type: 'pattern',
        content:
          'Before you post anything about your work, build karma through pure contribution. This serves two purposes: you learn the community culture, and you establish credibility that makes your future contributions welcome.\n\nWeek 1-2: Comment only. No posts. Find 3-5 subreddits relevant to your expertise. Sort by New. Find questions you can answer with genuine depth. Write 200-500 word comments that actually solve problems. Aim for 5-10 comments per day.\n\nWeek 3-4: Continue commenting. Start to notice which comment styles get upvoted vs ignored. Each subreddit has its own voice. r/ClaudeAI rewards technical specificity. r/Entrepreneur rewards practical, numbers-backed advice. r/SaaS rewards honest product feedback. Match the voice.\n\nMonth 2: You should have 500+ karma. Now you can start posts. But the posts should still be 90% value, 10% personal. "Here is how I solved X problem" beats "Check out my tool that solves X." The former gets upvoted. The latter gets removed.\n\nOngoing: maintain a 10:1 ratio. For every time you mention your work, provide value 10 times without mentioning it. This ratio keeps you in good standing with moderators and the community.',
      },
      {
        heading: 'Choosing the Right Subreddits',
        type: 'pattern',
        content:
          'Subreddit selection determines your results. Tier your target subreddits:\n\nTier 1 - High relevance, active community (post and comment frequently): subreddits where your exact ICP hangs out. For AI builders: r/ClaudeAI, r/CursorAI, r/LocalLLaMA. For GTM: r/sales, r/coldemail, r/SaaS. For content: r/content_marketing, r/Entrepreneur.\n\nTier 2 - Adjacent relevance (comment when relevant): subreddits where your audience exists but the topic is broader. r/webdev, r/startups, r/SideProject, r/selfhosted.\n\nTier 3 - Occasional engagement (comment on viral threads only): large subreddits where viral threads occasionally touch your expertise. r/technology, r/artificial, r/programming.\n\nRead each subreddit\'s rules before participating. Many have strict self-promotion rules (zero tolerance), content type restrictions (no link posts, text only), and karma minimums for posting. Violating rules gets your post removed and can get you banned.\n\nAvoid subreddits with under 5,000 members (too small to drive meaningful results) or over 5 million members (too broad, your expertise gets lost).',
      },
      {
        heading: 'Comments That Get Upvoted',
        type: 'formula',
        content:
          'The anatomy of a high-performing Reddit comment:\n\nLead with the answer. Do not build up to it. Reddit users scan. Put the most valuable information first.\n\nAdd personal experience. "I ran into this exact issue last week" immediately establishes credibility. Follow with the specific solution.\n\nInclude specific details. Tool names, version numbers, exact steps, code snippets, config settings. Vague advice gets ignored. Specific advice gets saved and upvoted.\n\nAcknowledge limitations. "This worked for my use case but might not if you are doing X" shows intellectual honesty. Reddit upvotes nuanced answers over confident-but-incomplete ones.\n\nFormat for scanning. Use line breaks between paragraphs. Bold key points. Use numbered lists for steps. Reddit comments are read on mobile - walls of text get skipped.\n\nDo not hedge everything. Have an opinion. "Honestly, Instantly is better than Smartlead for solo operators. Here is why." Strong opinions backed by experience get engagement. Diplomatic non-answers get ignored.\n\nTiming: sort by New and comment early on rising posts. The first 5-10 comments get the most visibility. A great comment on a 12-hour-old post gets buried.',
      },
      {
        heading: 'Turning Credibility into Outcomes',
        type: 'pro-tip',
        content:
          'After 2-3 months of consistent Reddit contribution, you start seeing business results:\n\nInbound DMs. People who read your comments send direct messages asking for help. These are pre-qualified prospects - they already know your expertise.\n\nProfile clicks. Your Reddit profile is your landing page. Keep it clean. Pin your best post. Add a brief bio that mentions what you do. Include a link to your website. Every good comment drives profile views.\n\nGoogle juice. Reddit threads rank in Google search. Your detailed technical comment about "how to set up Clay for waterfall enrichment" gets indexed and drives traffic for months. This is the SEO play that most people miss - Reddit comments become permanent search results.\n\nAI citation. LLMs like ChatGPT and Claude consume Reddit content as training data and as retrieval sources. Your expert comments become reference material in AI-generated responses. This is the GEO (Generative Engine Optimization) angle.\n\nThe rule: never sacrifice credibility for a lead. The moment you get pushy or self-promotional, you lose the trust you spent months building. Let the inbound come to you. Reddit rewards patience and genuine expertise more than any other platform.',
      },
    ],
  },

  {
    id: 'how-to-repurpose-content',
    title: 'How to Repurpose One Piece of Content Across 5 Platforms',
    subtitle: 'Write once, adapt everywhere - the content multiplication system',
    category: 'comparisons',
    description:
      'How to take one piece of content and adapt it for LinkedIn, X/Twitter, Reddit, your blog, and email. Platform-specific formatting rules, tone shifts, and the workflow that produces 5 pieces from 1 idea.',
    keywords: [
      'content repurposing strategy',
      'repurpose content across platforms',
      'content multiplication',
      'one content multiple platforms',
      'content repurposing 2026',
      'how to repurpose blog posts',
      'cross platform content strategy',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'building-in-public-as-gtm',
      'content-stack-solo-builders',
      'ai-content-vs-human-content',
    ],
    sections: [
      {
        heading: 'The Core Idea',
        type: 'prose',
        content:
          'You do not need 5 content ideas per week. You need 1 good idea and 5 adaptations. Every platform has different formatting rules, audience expectations, and engagement patterns. The same insight presented differently on each platform reaches different audiences and reinforces your message.\n\nThe key insight: repurposing is not copying. Pasting the same text on LinkedIn, X, Reddit, your blog, and email is lazy and performs poorly. Each platform needs a version crafted for its specific audience and format. The idea stays the same. The packaging changes.',
      },
      {
        heading: 'Step 1: Start with the Blog Post',
        type: 'code',
        content:
          'The blog post is your long-form source material. Write it once with full depth: 800-1500 words, personal experience, specific examples, and actionable takeaways. This is the canonical version that lives permanently on your website.\n\nWhy start with the blog: it is the most detailed format. Every other adaptation strips out detail. It is easier to compress than to expand. Writing the full version first ensures you have all the material you need for every platform.\n\nSEO bonus: the blog post ranks in Google. Social posts do not. Starting with the blog means your best content lives where search engines can find it. Social posts drive attention. The blog captures the search traffic those social posts generate.\n\nExample: you built a new feature this week. The blog post covers the problem, the solution, the technical approach, what you learned, and what is next. 1200 words. This becomes the source for everything else.',
      },
      {
        heading: 'Step 2: LinkedIn Version (Professional Insight)',
        type: 'pattern',
        content:
          'Extract the key insight and personal angle. Strip the technical depth. Add professional framing.\n\nFormat: 150-250 words. Short paragraphs (1-2 sentences each). White space between lines. Hook in the first line. Personal story or surprising result. End with a question that invites comments.\n\nTone shift: LinkedIn wants "what I learned" not "how I did it." The blog says "here is the technical implementation." LinkedIn says "here is the business insight from building this."\n\nExample adaptation: Blog says "We built waterfall email enrichment in Clay with 3 providers and MX validation, yielding 82% email coverage." LinkedIn says "Most teams settle for 55% email coverage from a single provider. We hit 82% by stacking 3 providers in sequence. The extra 27% translates to 270 more qualified conversations per 1,000 leads. That is the difference between a tool and a system."\n\nNo links in the post body. LinkedIn suppresses posts with external links. Put the blog link in the first comment if you want to share it.',
      },
      {
        heading: 'Step 3: X/Twitter Version (Sharp Take)',
        type: 'pattern',
        content:
          'Extract the most opinionated or surprising point. Make it punchy.\n\nSingle tweet format: one sharp take, under 280 characters. "Single-provider email enrichment gives you 55% coverage. Waterfall enrichment gives you 82%. Most teams leave 27% of their pipeline on the table."\n\nThread format: 5-10 tweets breaking down the insight. Each tweet should work standalone. Start with the hook, build the argument, end with the actionable takeaway.\n\nTone shift: X wants conviction. No hedging. No "it depends." Take a position. "Waterfall enrichment is non-negotiable in 2026. Here is why:" The specificity and confidence is what earns engagement on X.\n\nEngage in replies after posting. The thread performs better when you respond to every reply in the first hour. This signals engagement to the algorithm.',
      },
      {
        heading: 'Steps 4 and 5: Reddit Comment + Email',
        type: 'pattern',
        content:
          'Reddit: do not post your content as a standalone Reddit post (unless you have significant karma in that subreddit). Instead, find threads where people are discussing the same problem your blog post solves. Write a detailed comment sharing your experience and solution. No link to the blog. Just the insight, formatted for Reddit with line breaks and specific details.\n\nReddit tone: humble, specific, helpful. "We ran into this same problem. Here is what worked for us:" followed by the practical details. Reddit rewards genuine help, not content promotion.\n\nEmail newsletter: the full blog post or a condensed version sent to your subscriber list. Email format allows for more personal framing - "This week I built something that surprised me..." Email readers have already opted in, so you can be more direct about your work.\n\nEmail tone: conversational, like writing to a friend. Less formal than LinkedIn, less punchy than X, more personal than the blog. Include the CTA you cannot put elsewhere - "reply to this email if you want the Clay template."\n\nThe total time: 60-90 minutes to write the blog. 15 minutes for LinkedIn adaptation. 10 minutes for X adaptation. 15 minutes for Reddit comments. 15 minutes for email formatting. Under 2.5 hours for 5 pieces of content across 5 platforms.',
      },
    ],
  },

  {
    id: 'how-to-build-voice-system',
    title: 'How to Build a Voice System for AI Content',
    subtitle: 'Teach your AI to write like you - not like everyone else',
    category: 'comparisons',
    description:
      'How to build a voice system that makes AI-generated content sound like you. Voice DNA files, anti-slop filters, platform-specific playbooks, and the quality gates that prevent generic AI output.',
    keywords: [
      'AI voice system',
      'AI writing voice',
      'AI content voice',
      'teach AI your voice',
      'AI content personalization',
      'AI writing style',
      'brand voice AI',
      'anti-slop AI content',
    ],
    difficulty: 'advanced',
    canonicalSite: 'contentos',
    related: [
      'ai-content-vs-human-content',
      'how-to-repurpose-content',
      'mcp-content-stack',
    ],
    sections: [
      {
        heading: 'Why Voice Matters for AI Content',
        type: 'prose',
        content:
          'AI writes in a default voice. It is competent, polished, and completely generic. Every AI-generated blog post, email, and social media post sounds the same because the models optimize for the average of their training data.\n\nA voice system overrides the default. Instead of generic AI output, you get content that sounds like a specific person with specific opinions, specific vocabulary, and specific patterns. Your audience cannot tell whether you wrote it or your AI wrote it because the AI has been trained on your voice.\n\nThis is not prompt engineering. A prompt says "write in a casual tone." A voice system provides 50 specific patterns, 29 anti-patterns, platform-specific rules, and a quality gate process that catches deviations. The difference is the gap between "be casual" and a comprehensive style guide.',
      },
      {
        heading: 'Layer 1: Core Voice DNA',
        type: 'pattern',
        content:
          'The foundation is a voice DNA file - a document that captures your writing patterns. Not abstract descriptions ("warm and friendly") but specific, concrete patterns:\n\nSentence structure: "Use short sentences. 8-12 words average. Break complex ideas into multiple short statements. Never compound sentences with three or more clauses."\n\nVocabulary preferences: "Say \'ship\' not \'deliver.\' Say \'build\' not \'develop.\' Say \'works\' not \'functions.\' Say \'breaks\' not \'encounters errors.\'"\n\nOpening patterns: "Start with a statement, not a question. No rhetorical questions. Lead with the most specific claim, not the broadest context."\n\nPunctuation habits: "Use dashes for asides - like this. No semicolons. No parenthetical statements. No em dashes in customer-facing copy, use spaced hyphens instead."\n\nAbstraction level: "Always include a specific example within 2 sentences of any claim. No abstract statements without concrete proof."\n\nBuild this by analyzing 20+ pieces of your own writing. Find the patterns. Write them as explicit rules the AI can follow.',
      },
      {
        heading: 'Layer 2: Anti-Slop Filters',
        type: 'formula',
        content:
          'The anti-slop layer catches AI patterns that do not match your voice. Every AI model has default behaviors that leak through if unchecked:\n\nBanned phrases: maintain a list of phrases you never use that AI loves to generate. "In today\'s fast-paced world." "It is worth noting." "At the end of the day." "Let us dive in." "Leverage." "Utilize." "Harness." Each banned phrase is a red flag that the AI has fallen back to its default voice.\n\nStructural anti-patterns: "Never start 3+ consecutive paragraphs with the same word." "Never use a list where a paragraph works better." "Never use transition words like Furthermore, Additionally, Moreover."\n\nSubstance requirements: "Every claim needs at least 2 of these 5: specific example, technical detail, reasoning shown, concrete result, or lesson learned." This prevents the AI from making vague assertions.\n\nThe 3-flag rule: if a draft triggers 3 or more anti-slop flags, rewrite it from scratch. Do not patch. Patching creates Frankenstein content that reads as half-human, half-AI.\n\nMaintain the anti-slop list as a living document. Every time you spot a new AI-ism in your drafts, add it to the list. After 3 months, you have a comprehensive filter that catches almost everything.',
      },
      {
        heading: 'Layer 3: Platform Playbooks',
        type: 'pattern',
        content:
          'Your voice adapts per platform. You write differently on LinkedIn than on Reddit. Capture those adaptations in platform-specific playbooks:\n\nLinkedIn playbook: professional tone, insight-first structure, business outcomes framing, no jargon without explanation, CTA as a question.\n\nX playbook: punchy, opinionated, conviction over nuance, one idea per tweet, no hedging language.\n\nReddit playbook: humble, specific, helpful, community-aware, no self-promotion framing, technical depth welcome.\n\nBlog playbook: comprehensive, structured with clear headings, SEO-aware keyword integration, personal narrative woven through technical content.\n\nEmail playbook: conversational, direct, first-person, include context the reader needs to act.\n\nEach playbook is a one-page document that the AI reads before generating content for that platform. The core voice stays consistent. The presentation adapts.',
      },
      {
        heading: 'Putting It All Together',
        type: 'pro-tip',
        content:
          'The full voice system loads in sequence:\n\n1. Core voice DNA file loads first (foundation patterns)\n2. Anti-slop filters load second (quality gates)\n3. Platform playbook loads third (adaptation rules)\n4. Content is generated\n5. Quality gate process runs: slop check, specificity check, depth check, voice check\n\nStore these files in your repo so every AI session has access. In Claude Code, reference them from your CLAUDE.md or load them as skills. In other tools, include them in the system prompt or project context.\n\nThe compound effect: after 3 months of using the voice system, your AI-generated content is indistinguishable from your human-written content. Readers cannot tell. Engagement rates are the same. But you are producing 5x the volume at 20% of the time investment.\n\nThe maintenance: review the voice system monthly. Your voice evolves. New patterns emerge. Old patterns fade. Update the DNA file to match your current voice, not the voice you had 6 months ago.\n\nStart simple: a 50-line voice DNA file, a 30-item anti-slop list, and one platform playbook. Expand from there as you notice patterns the system misses.',
      },
    ],
  },

  {
    id: 'content-stack-solo-builders',
    title: 'The Complete Content Stack for Solo Builders in 2026',
    subtitle: 'Every tool you need to create, publish, and distribute content alone',
    category: 'comparisons',
    description:
      'The full content technology stack for solo builders in 2026. Writing, scheduling, analytics, SEO, and distribution tools with pricing and the build order that gets you publishing fastest.',
    keywords: [
      'content stack solo builder',
      'content tools 2026',
      'solo creator tools',
      'content creation stack',
      'best tools for content creators 2026',
      'content publishing tools',
      'content distribution tools',
      'solo builder content strategy',
    ],
    difficulty: 'beginner',
    canonicalSite: 'contentos',
    related: [
      'linkedin-vs-twitter-vs-reddit-b2b',
      'how-to-repurpose-content',
      'ai-content-vs-human-content',
      'how-to-build-voice-system',
    ],
    sections: [
      {
        heading: 'The Minimum Viable Stack',
        type: 'prose',
        content:
          'You need four layers: create (write the content), publish (put it on your website), distribute (get it on social platforms), and measure (know what is working). Most solo builders over-tool. They sign up for 10 apps, spend a month configuring them, and publish nothing.\n\nThe rule: start with the cheapest tool that works. Upgrade when you hit a real bottleneck, not when you see a shiny demo. Every tool you add is maintenance you carry.',
      },
      {
        heading: 'Layer 1: Creation',
        type: 'pattern',
        content:
          'Writing: Claude Code or ChatGPT for AI-assisted drafting, plus your code editor for the final product. If your content lives in markdown files in a repo (and it should), your code editor is your CMS.\n\nDesign: Figma (free tier) for graphics, OG images, and social cards. Canva as a simpler alternative. For programmatic image generation, Remotion or Satori generate images from React components at build time.\n\nVideo: Remotion if you are a developer (React-based video rendering). CapCut for quick edits. Loom for screen recordings. Most solo builders do not need video - start with text and add video when there is demand.\n\nVoice system: your voice DNA file + anti-slop filters (text files in your repo, loaded into AI context). Zero cost. Maximum impact on content quality.\n\nTotal creation layer cost: $0-20/month. AI tools are the only potential cost, and Claude Pro at $20/month covers everything.',
      },
      {
        heading: 'Layer 2: Publishing',
        type: 'pattern',
        content:
          'Website: Next.js deployed on Vercel (free tier handles most solo builder traffic). Your blog lives in markdown files. Pages are generated at build time. No CMS needed - your Git repo is your CMS.\n\nAlternative: Substack if you want to skip the technical setup entirely. Built-in audience, email delivery, and discovery. The trade-off: you do not own the platform and SEO control is limited.\n\nSEO infrastructure: next-sitemap for automatic sitemap generation. Schema markup (JSON-LD) for rich snippets. Robots.txt with AI crawler allowlisting. RSS feeds for content syndication. Google Search Console for indexing and performance tracking.\n\nDomain and hosting: one domain ($12/year), DNS on Cloudflare (free), hosting on Vercel (free tier). Total: $1/month.\n\nThe key decision: own your publishing or rent it. Substack is easy but rented. A Next.js site is harder but owned. If you are building long-term, own your platform. The SEO benefits alone are worth the setup time.',
      },
      {
        heading: 'Layer 3: Distribution',
        type: 'pattern',
        content:
          'LinkedIn: post directly from the app. No scheduling tool needed when you are posting 3-5 times per week manually. If you want scheduling: Typefully ($12/month) or Buffer (free tier for 3 channels).\n\nX/Twitter: Typefully for scheduling threads and single tweets. The draft system is better than native X for composing threads. Free tier works for getting started.\n\nReddit: manual only. No automation tools. Reddit detects and bans automated posting. Open the subreddit, find relevant threads, write genuine comments. 15-30 minutes per day.\n\nEmail newsletter: Substack (free), Buttondown (free tier), or Beehiiv (free tier). If your blog is your primary platform, send a weekly digest linking to new posts. Keep the email list warm even if the numbers are small.\n\nContent scheduling: Typefully handles LinkedIn and X in one tool. That covers the two schedulable platforms. Reddit and email are manual.\n\nTotal distribution layer cost: $0-12/month.',
      },
      {
        heading: 'Layer 4: Measurement',
        type: 'pattern',
        content:
          'Website analytics: PostHog (free tier, 1M events/month) or Plausible ($9/month). Google Analytics works but is heavier than most solo builders need. PostHog gives you event tracking, funnels, and session recordings in one tool.\n\nSEO tracking: Google Search Console (free). Track impressions, clicks, average position, and which queries drive traffic. Check weekly. This tells you which content to create more of.\n\nSocial analytics: each platform has built-in analytics. LinkedIn shows impressions and engagement per post. X shows impressions, engagement rate, and profile visits. Reddit shows karma and comment views.\n\nWhat to track weekly: total website visitors, top 5 pages by traffic, top 5 search queries driving traffic, best-performing social posts, and email open rate. That is it. Do not over-measure.\n\nTotal measurement layer cost: $0-9/month.\n\nFull stack cost: $0-41/month. That is the cost of content infrastructure that competes with teams spending $5,000+/month on tools. The advantage of being a solo builder: you do not need enterprise tools. You need focus and consistency.',
      },
    ],
  },

  {
    id: 'how-to-use-ai-content-creation',
    title: 'How to Use AI for Content Creation Without Sounding Like AI',
    subtitle: 'The workflow that produces authentic content at 5x the speed',
    category: 'comparisons',
    description:
      'Practical guide to using AI for content creation while maintaining authenticity. The input-output method, voice loading, editing workflows, and the specific techniques that make AI content indistinguishable from human writing.',
    keywords: [
      'AI content creation',
      'how to use AI for content',
      'AI writing tips',
      'AI content without sounding like AI',
      'authentic AI content',
      'AI content workflow',
      'AI writing workflow 2026',
      'AI content creation guide',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'contentos',
    related: [
      'ai-content-vs-human-content',
      'how-to-build-voice-system',
      'content-stack-solo-builders',
      'how-to-repurpose-content',
    ],
    sections: [
      {
        heading: 'The Input-Output Method',
        type: 'prose',
        content:
          'AI content quality is a function of input quality. Generic input ("write a blog post about AI tools") produces generic output. Specific input produces specific output.\n\nThe method: give the AI three things before asking it to write. First, your experience - the specific story, result, or insight from your actual work. Second, your voice - the patterns, vocabulary, and style you want. Third, the format - the platform, length, structure, and audience.\n\nWith all three inputs, AI produces content that reads as yours. Without them, it produces content that reads as everyone else\'s.',
      },
      {
        heading: 'Step 1: Feed Your Experience',
        type: 'pattern',
        content:
          'The most common AI content failure: asking it to write about something you have not done. AI can research and synthesize, but it cannot fabricate authentic experience. The fix is to provide your experience as input.\n\nBefore generating content, write a rough brain dump. Not polished writing - just notes. "This week I tried waterfall enrichment in Clay. Used Apollo, Prospeo, and Dropcontact in sequence. Got 82% email coverage vs 55% from Apollo alone. Took 2 hours to set up. Credits cost about $1.50 per lead. The gotcha was MX validation - without it, 8% of emails were bad domains."\n\nThat brain dump is 60 words of raw experience. The AI turns it into a polished 500-word blog section with your specific numbers, your specific tools, and your specific gotcha. It cannot make up the 82% figure or the MX validation insight. Those come from you.\n\nRule: never publish AI content about something you have not personally done. Use AI as a writing accelerator, not a writing replacement.',
      },
      {
        heading: 'Step 2: Load Your Voice',
        type: 'pattern',
        content:
          'Before the AI writes, load your voice system into the conversation context. In Claude Code, this means the CLAUDE.md references your voice DNA file, or you explicitly load it at the start of a content session.\n\nMinimum viable voice loading: "Write in short sentences. Average 10 words. No hedging language. No phrases like \'it is worth noting\' or \'in today\'s landscape.\' Use specific numbers over vague qualifiers. Start with claims, then prove them. Lowercase energy - no exclamation marks, no hype."\n\nThat is 50 words of voice instruction that dramatically changes the output quality. The AI stops writing in its default polished-but-generic voice and starts writing in your patterns.\n\nFor better results: load your full voice DNA file with 30+ specific rules. The more patterns you provide, the closer the output matches your natural writing. The sweet spot is 50-100 rules that cover vocabulary, sentence structure, formatting preferences, and content patterns.',
      },
      {
        heading: 'Step 3: Edit Like a Human, Not a Reviewer',
        type: 'pattern',
        content:
          'The AI gives you a draft. Now make it yours. The editing pass is where AI content becomes authentic content.\n\nFirst pass - truth check: is every claim accurate? Did the AI add details you did not provide? AI sometimes confabulates - adds plausible but false specifics. Remove anything you cannot verify.\n\nSecond pass - voice check: read it aloud. Does it sound like you? Mark every sentence that sounds like "AI wrote this" and rewrite it. Usually it is the transitions and the opening/closing sentences that need the most human touch.\n\nThird pass - add the texture: inject the details only you know. The unexpected difficulty. The tool that almost worked but had a deal-breaking bug. The metric that surprised you. These textures are what make content feel human.\n\nFourth pass - cut the fat: AI writes more than necessary. It explains things readers already know. It adds caveats that weaken the argument. Cut 20-30% of the draft. Tighter content performs better on every platform.\n\nThe editing takes 15-30 minutes per piece. The writing took 3 minutes. Total time: 20-35 minutes for a piece that would take 90-120 minutes to write from scratch.',
      },
      {
        heading: 'The Authenticity Test',
        type: 'pro-tip',
        content:
          'Before publishing, run the authenticity test. Three questions:\n\n1. Could anyone else have written this? If yes, it needs more personal experience. Add your specific results, your specific tools, your specific failures. Make it impossible for someone who has not done your work to produce this content.\n\n2. Would you say this out loud to a colleague? If the language feels stiff or formal, it still has AI residue. Rewrite the stiff sentences in the way you would actually explain it in conversation.\n\n3. Does it make a claim you would defend? If there is a statement you would hedge on in a live conversation, either strengthen it with evidence or remove it. AI loves to make broad claims. Your content should only make claims you have earned through experience.\n\nIf the piece passes all three, publish it. If not, one more editing pass focusing on the questions it failed.\n\nThe goal is not to hide that you used AI. The goal is to produce content that reflects your actual expertise, delivered faster than you could write it manually. When the experience is real and the voice is yours, the tool used to produce it is irrelevant.',
      },
    ],
  },

  /* ================================================================== */
  /*  CLI TOOLS (new entries)                                             */
  /* ================================================================== */

  {
    id: 'cli-ecosystem-overview',
    title: 'The CLI Ecosystem',
    subtitle: 'Why CLI access is king and how every major GTM tool is converging on terminal-first workflows',
    category: 'cli-tools',
    description:
      'Overview of the CLI ecosystem for GTM engineers. HubSpot CLI, Salesforce CLI, Attio CLI, Vercel CLI, and why natural language CLI through Claude Code changes everything.',
    keywords: [
      'cli tools for gtm',
      'hubspot cli',
      'salesforce cli',
      'vercel cli',
      'claude code cli',
      'terminal tools for sales',
      'natural language cli',
      'cli vs gui',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'cli-vs-mcp-tools',
      'claude-code-quickstart',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Why CLI Access Is the Most Important Thing',
        type: 'prose',
        content:
          'Every major platform is shipping a CLI. HubSpot has hs. Salesforce has sf. Vercel has vercel. Attio is building one. Cargo.ai exposes its pipeline through CLI commands. The pattern is clear: the future of tool access is the terminal, not the browser.\n\nWhy this matters for GTM engineers: CLI access means scriptability. Anything you can type once, you can automate forever. A CLI command to pull pipeline data becomes a cron job that runs every morning. A CLI command to create a contact becomes a bulk import script. A CLI command to check campaign status becomes a Slack bot.\n\nMCPs gave us the first wave of programmatic access. But MCPs drain context windows. Every MCP tool definition eats tokens. A HubSpot MCP with 30 tool definitions burns context before you ask your first question. A CLI binary sitting on your machine costs zero context. You call it when you need it and it returns results.',
      },
      {
        heading: 'The CLI Landscape Right Now',
        type: 'pattern',
        content:
          'HubSpot CLI (hs): manage CRM objects, list deals, create contacts, pull reports. Still maturing but functional for basic operations.\n\nSalesforce CLI (sf): the most mature GTM CLI. Deploy metadata, query SOQL, manage orgs, run tests. Enterprise-grade and battle-tested.\n\nVercel CLI (vercel): deploy sites, manage environment variables, check build status, tail logs. Essential for anyone deploying on Vercel.\n\nAttio CLI: early stage but promising. CRM operations from the terminal. Read and write records, manage lists, search contacts.\n\nClaude Code: this is the meta-CLI. It wraps every other CLI. Instead of memorizing sf data query "SELECT Id FROM Account", you tell Claude Code "pull all accounts created this week from Salesforce" and it writes and runs the sf command for you. Natural language CLI access to every tool that has a CLI.',
      },
      {
        heading: 'Natural Language CLI Through Claude Code',
        type: 'pro-tip',
        content:
          'This is the insight that changes everything. You do not need to memorize CLI syntax. Claude Code reads the docs, constructs the command, runs it, and interprets the output. Your job is to describe intent. The agent translates intent to commands.\n\n"Check if our Vercel deployment succeeded" becomes vercel ls --json | jq. "Find all HubSpot contacts added yesterday" becomes hs contacts list --created-after. "Query Salesforce for open opportunities over 50k" becomes the right SOQL query piped through sf.\n\nThe compound effect: every new CLI that ships instantly becomes accessible through Claude Code. No learning curve. No docs to read. Describe what you want, let the agent figure out the syntax. This is why CLI access matters more than GUI access. GUIs require human eyes and clicks. CLIs require text in and text out. AI agents are built for text in and text out.',
      },
      {
        heading: 'Setting Up Your CLI Stack',
        type: 'code',
        content:
          'Start with the CLIs you actually use. Do not install everything at once.\n\nbrew install vercel - if you deploy on Vercel\nnpm install -g @hubspot/cli - if you use HubSpot\nnpm install -g @salesforce/cli - if you use Salesforce\npip install attio-cli - when available\n\nEach CLI has an auth step. Usually oauth or an API key. Run the auth command once and it stores credentials locally. After that, every command authenticates automatically.\n\nThe test: open Claude Code and say "use the Vercel CLI to show me my recent deployments." If it works, your CLI stack is connected. If it fails, check that the CLI is in your PATH and authenticated.',
      },
    ],
  },

  {
    id: 'posthog-for-gtm',
    title: 'PostHog for GTM Engineers',
    subtitle: 'Open-source analytics with more precision than GA or HubSpot for ABM tracking',
    category: 'cli-tools',
    description:
      'How to use PostHog for GTM analytics. Event-based ABM tracking, natural language dashboard creation through PostHog MCP, funnel analysis, and why PostHog gives you precision traditional tools cannot match.',
    keywords: [
      'posthog gtm',
      'posthog abm tracking',
      'posthog analytics',
      'posthog mcp',
      'posthog claude code',
      'product analytics for sales',
      'abm analytics',
      'posthog vs google analytics',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'cli-ecosystem-overview',
      'abm-personalization-architecture',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Why PostHog for GTM',
        type: 'prose',
        content:
          'Google Analytics tells you "50 people visited your pricing page." PostHog tells you "3 people from Acme Corp visited your /for/acme landing page, read 80% of the case study section, clicked the ROI calculator twice, and left without booking. One came back the next day from a LinkedIn ad."\n\nThat level of detail changes how you run ABM. You stop guessing which accounts are engaged and start knowing. PostHog is event-based. Every interaction is a structured event with properties. You define what matters and PostHog captures it with full context.\n\nThe open-source angle matters too. Your analytics data stays yours. No vendor lock-in. Self-host if data sovereignty is a requirement. The cloud version is free up to 1 million events per month, which covers most GTM operations.',
      },
      {
        heading: 'ABM Event Architecture',
        type: 'pattern',
        content:
          'Define events that map to your ABM funnel stages:\n\nabm_page_view - someone hits a personalized landing page. Properties: company slug, referral source, UTM parameters.\n\nabm_section_read - scroll depth on key sections. Properties: section name, time spent, percentage viewed.\n\nabm_cta_click - any call-to-action interaction. Properties: CTA type (book demo, download, contact), page location.\n\nabm_form_submit - form completions. Properties: form type, company, lead score at time of submission.\n\nWith these four events, you build a complete ABM engagement funnel. Filter by company. Filter by time period. See exactly which accounts are warming up and which went cold.',
      },
      {
        heading: 'Claude Code + PostHog MCP',
        type: 'pro-tip',
        content:
          'The PostHog MCP connects Claude Code directly to your analytics instance. This means natural language queries against your data.\n\n"Show me which companies visited our ABM landing pages this week" - Claude queries PostHog, aggregates by company slug, returns a ranked list.\n\n"Build a funnel from abm_page_view to abm_cta_click to abm_form_submit" - Claude creates the funnel in PostHog and returns conversion rates at each stage.\n\n"Which landing page sections get the most engagement?" - Claude queries scroll depth events, groups by section, and ranks by average time spent.\n\nNo SQL. No dashboard builder. Describe the question, get the answer. This is the natural language analytics layer that makes PostHog accessible to GTM engineers who are not data analysts.',
      },
      {
        heading: 'Setup in 15 Minutes',
        type: 'code',
        content:
          'Step 1: Create a PostHog account at posthog.com. Free tier covers 1M events/month.\n\nStep 2: Add the PostHog snippet to your site. For Next.js, use the posthog-js package. Initialize in your app layout with your project API key.\n\nStep 3: Define custom events. In your ABM landing page components, add posthog.capture("abm_page_view", { company: slug, source: utm_source }). Do the same for scroll depth, CTA clicks, and form submissions.\n\nStep 4: Connect PostHog MCP to Claude Code. Add the PostHog MCP server configuration with your API key. Test with "list my recent PostHog events."\n\nStep 5: Build your first dashboard. Tell Claude Code "create a PostHog dashboard showing ABM landing page visits by company this month." It builds the dashboard through the MCP. Done.',
      },
    ],
  },

  {
    id: 'claude-code-co-work',
    title: 'Claude Code Co-Work Sessions',
    subtitle: 'Drop a folder session with workflows, scripts, and shared context across team members',
    category: 'cli-tools',
    description:
      'How Claude Code co-work sessions change team collaboration. Shared folder context, active playbooks vs passive docs, and why the repo becomes the onboarding.',
    keywords: [
      'claude code co-work',
      'claude code team',
      'ai pair programming',
      'shared context ai',
      'claude code collaboration',
      'co-work sessions',
      'claude code folder sessions',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'claude-code-quickstart',
      'parallel-session-handoffs',
      'agent-teams-claude-code',
    ],
    sections: [
      {
        heading: 'What Co-Work Sessions Are',
        type: 'prose',
        content:
          'A co-work session is a Claude Code instance pointed at a shared folder. Everyone on the team gets the same context: the same CLAUDE.md rules, the same skills, the same data files, the same voice system. It is not a chat room. It is a shared operating environment where the AI has already read your playbooks.\n\nThe difference from traditional collaboration: Notion docs sit in a browser tab nobody has open. A Confluence page gets written once and forgotten. A co-work folder is active. The AI reads it on every session start. Every workflow is executable, not just documented. Every playbook runs, it does not just explain.',
      },
      {
        heading: 'How SDRs Should Be Working Now',
        type: 'pattern',
        content:
          'Drop a folder with: CLAUDE.md (team rules, voice, anti-slop filters), scripts/ (enrichment crons, lead scoring, campaign automation), skills/ (outreach generation, research compilation, pipeline review), data/ (target accounts, enrichment results, campaign metrics).\n\nNew SDR joins. They open Claude Code in the folder. The CLAUDE.md loads automatically. They say "research Acme Corp for outbound" and the agent runs the research skill, pulls from Exa, enriches through Apollo, checks Attio for existing history, and produces a research brief. The SDR did not read a single doc. The folder was the onboarding.\n\nThis is the active playbook model. Documentation that executes. Context that compounds. Every session builds on previous sessions through handoff files and memory.',
      },
      {
        heading: 'Setting Up a Team Folder',
        type: 'code',
        content:
          'Create a repo. Structure it:\n\nCLAUDE.md - team rules, model preferences, voice system\n.claude/skills/ - one skill per workflow (research, outreach, reporting)\nscripts/ - automation scripts that skills invoke\ndata/ - shared data files (target lists, enrichment results)\ntasks/ - task tracking and lessons learned\n\nEach team member clones the repo and runs Claude Code from the root. The CLAUDE.md establishes shared context. Skills provide consistent workflows. Data files keep everyone working from the same source of truth.\n\nThe key insight: the repo IS the team knowledge base. Not a separate wiki. Not a Notion workspace. The same folder that runs the automation also documents the automation. Code and documentation live together.',
      },
      {
        heading: 'Active Playbooks vs Passive Docs',
        type: 'pro-tip',
        content:
          'Passive doc: "To research a prospect, check LinkedIn, look at their recent funding, review their tech stack on BuiltWith, and summarize findings in a Google Doc."\n\nActive playbook: a skill file that Claude Code reads and executes. It checks LinkedIn via the browser, pulls funding data from Exa, queries BuiltWith through the API, and writes the summary to the research folder in the repo. Same workflow. One requires a human to follow steps. The other requires a human to say "research this company."\n\nEvery passive doc in your org is a candidate for an active playbook. The conversion process: identify the steps, write them as a skill, test the skill, deploy to the shared folder. The documentation becomes the automation.',
      },
    ],
  },

  {
    id: 'github-repo-evaluation',
    title: 'How to Evaluate GitHub Repos',
    subtitle: 'Never just install someone\'s repo. Use Claude Code to interrogate, compare, and cherry-pick.',
    category: 'cli-tools',
    description:
      'The recursive drift approach to evaluating GitHub repositories. How to use Claude Code to compare repos against your stack, identify useful patterns, and cherry-pick without blind installation.',
    keywords: [
      'evaluate github repo',
      'github repo evaluation',
      'claude code repo review',
      'how to evaluate open source',
      'github repo comparison',
      'cherry pick code patterns',
      'recursive drift evaluation',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'cli-ecosystem-overview',
      'claude-code-quickstart',
      'context-engineering-vs-prompt-engineering',
    ],
    sections: [
      {
        heading: 'Never Just Install',
        type: 'prose',
        content:
          'Someone shares a GitHub link. The default move: clone it, npm install, hope it works. The recursive drift move: ask Claude Code to read it first.\n\nMost repos you encounter are 80% irrelevant to your use case. They solve a broader problem than you have, use a different stack, or make architectural choices that conflict with yours. Installing blindly means inheriting their dependencies, their patterns, and their technical debt.\n\nThe better approach: read the code, understand the patterns, take what serves you, leave the rest. Claude Code makes this fast. Point it at a repo and it reads the entire thing in seconds.',
      },
      {
        heading: 'The Three Questions',
        type: 'pattern',
        content:
          'When you find a repo, ask Claude Code three things:\n\n1. "How does this compare to what I already have?" Claude reads both your codebase and theirs. It identifies overlap, gaps, and conflicts. Maybe they solved a problem you are still solving manually. Maybe they use a library that is better than yours. Maybe their approach is worse. You need the comparison before you decide anything.\n\n2. "How can this help me? What should I cherry-pick?" Not "install the whole thing" but "which specific patterns, functions, or approaches are worth adopting?" Maybe their error handling is better. Maybe their data fetching pattern is cleaner. Cherry-pick those specific things.\n\n3. "What are the risks of adopting this?" Dependencies that conflict with yours. License restrictions. Maintenance status - is this actively maintained or abandoned? Claude checks the commit history, open issues, and dependency versions.',
      },
      {
        heading: 'Learning by Reading Code',
        type: 'pro-tip',
        content:
          'The hidden benefit of repo evaluation: you learn faster by reading real code than by reading tutorials. A tutorial shows you the happy path. A production repo shows you the edge cases, the error handling, the performance optimizations, and the architectural trade-offs.\n\nMake it a habit. When someone mentions a tool or framework, find a repo that uses it. Ask Claude Code to walk you through the interesting parts. You absorb patterns without the overhead of building a toy project.\n\nThe compound effect: after evaluating 20 repos, you have a mental library of patterns. You start recognizing good architecture by sight. You know which libraries are worth adopting because you have seen them in production code. Reading code is the fastest path to writing better code.',
      },
    ],
  },

  {
    id: 'cron-jobs-for-scraping',
    title: 'Cron Jobs for Job Scraping',
    subtitle: 'Python scripts as cron jobs for job board scraping and signal detection',
    category: 'cli-tools',
    description:
      'How to build Python cron jobs that scrape job boards for signal detection. launchd scheduling, feeding scraped data into ABM targeting, and building a hiring signal pipeline.',
    keywords: [
      'cron job scraping',
      'job board scraping',
      'python cron job',
      'launchd cron',
      'signal detection abm',
      'hiring signal pipeline',
      'job scraping automation',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'cli-ecosystem-overview',
      'abm-personalization-architecture',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'Why Job Boards Are Signals',
        type: 'prose',
        content:
          'A company posting "Head of RevOps" is a signal. They are building a revenue operations function. A company posting "SDR Manager" is a signal. They are scaling outbound. A company posting "Data Engineer" with "Clay" in the requirements is a signal. They are building GTM data infrastructure.\n\nJob postings are public intent data. The company is telling the world exactly what they are building and what skills they need. If your product or service aligns with what they are hiring for, that is a warm signal. The problem: job boards have thousands of new postings daily. Manual monitoring does not scale. Cron jobs do.',
      },
      {
        heading: 'The Scraping Pipeline',
        type: 'pattern',
        content:
          'Step 1: Python script that queries job board APIs or scrapes listings. Target boards relevant to your ICP: LinkedIn Jobs API, Indeed, Greenhouse board pages, Lever board pages. Filter by keywords that indicate buying intent for your product.\n\nStep 2: Parse and normalize the results. Extract company name, role title, posting date, key requirements. Store in a structured format - JSON or SQLite.\n\nStep 3: Enrich. Match company names against your existing Attio records. Check if they are already in your pipeline. If new, run through Apollo for firmographic data.\n\nStep 4: Score and route. Companies posting 3+ relevant roles in 30 days get a higher score than one-off postings. Route high-scoring signals to your ABM target list.',
      },
      {
        heading: 'launchd Scheduling',
        type: 'code',
        content:
          'On macOS, cron is deprecated in favor of launchd. Create a plist file in ~/Library/LaunchAgents/ that runs your Python script on a schedule.\n\nThe plist defines: which script to run (ProgramArguments), when to run it (StartCalendarInterval or StartInterval), where to log output (StandardOutPath, StandardErrorPath), and whether to run at load (RunAtLoad).\n\nA typical setup: run the scraper every 6 hours. That catches new postings without hammering the source. The script writes results to data/signals/job-postings.json. A separate daily cron reads that file, deduplicates, enriches new entries, and pushes qualified signals to Attio.\n\nKeep the scraping and the enrichment as separate jobs. If the scraper fails, you do not lose yesterday\'s enrichment results. If enrichment fails, you do not lose today\'s scraping results. Decoupled pipelines are resilient pipelines.',
      },
      {
        heading: 'Feeding Signals into ABM',
        type: 'pro-tip',
        content:
          'Raw job postings are noise. Enriched and scored job postings are signals. The enrichment step transforms "Acme Corp posted a Head of RevOps role" into "Acme Corp (Series B, 150 employees, using Salesforce and Outreach, $12M ARR) is building a RevOps function. They posted 3 GTM roles in the last 2 weeks. No existing relationship in Attio."\n\nThat enriched signal feeds directly into your ABM targeting. Build a personalized landing page referencing their RevOps buildout. Draft outreach that connects your solution to their specific hiring pattern. The job posting gave you the opening. The enrichment gave you the context. The ABM pipeline turns both into a conversation.',
      },
    ],
  },

  /* ================================================================== */
  /*  DEPLOYMENT TOOLS                                                    */
  /* ================================================================== */

  {
    id: 'agent-building-tools',
    title: 'Tools for Building and Deploying Agents',
    subtitle: 'Cargo.ai, LangChain, Railway, Trigger.dev - the agent infrastructure stack',
    category: 'deployment-tools',
    description:
      'Overview of the tools for building and deploying AI agents. Cargo.ai for GTM orchestration, LangChain for agent frameworks, Railway for hosting, Trigger.dev for background jobs, and how SDK kits accelerate deployment.',
    keywords: [
      'ai agent deployment',
      'agent building tools',
      'langchain deployment',
      'railway ai agents',
      'trigger.dev agents',
      'cargo ai gtm',
      'agent hosting',
      'agent infrastructure',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'cli-ecosystem-overview',
      'parallel-agent-patterns',
      'orchestrating-multi-agent-workflows',
    ],
    sections: [
      {
        heading: 'The Agent Infrastructure Stack',
        type: 'prose',
        content:
          'Building an agent is the easy part. Making it run reliably in production is the hard part. Four tools cover the stack:\n\nCargo.ai handles GTM orchestration. Multi-agent workflows for enrichment, scoring, and routing. 50+ integrations out of the box. If your agent pipeline involves moving data between GTM tools, Cargo.ai provides the plumbing.\n\nLangChain provides the agent framework. Chains, memory, tool use, retrieval. Build your agent logic in Python or JavaScript using battle-tested patterns instead of raw API calls.\n\nRailway provides the hosting. Long-running processes, databases, background workers. Your agent lives here and runs as long as it needs to.\n\nTrigger.dev provides the orchestration. Scheduled runs, event-driven triggers, retries, failure handling. The reliability layer that ensures your agent actually runs when it should.',
      },
      {
        heading: 'Choosing the Right Tool',
        type: 'pattern',
        content:
          'If you need GTM data orchestration (enrichment waterfalls, lead routing, CRM sync): start with Cargo.ai. It is purpose-built for this and saves you months of custom development.\n\nIf you need custom agent logic (research compilation, content generation, complex reasoning chains): use LangChain. It gives you the building blocks for any agent pattern.\n\nIf you need persistent hosting (always-on agents, databases, APIs): use Railway. Deploy from a GitHub push, scale as needed.\n\nIf you need reliable scheduling (cron-like jobs with retries and monitoring): use Trigger.dev. It adds the reliability layer that bare cron jobs lack.\n\nMost production agent deployments use 2-3 of these together. LangChain agent logic, deployed on Railway, orchestrated by Trigger.dev. Or Cargo.ai for the data pipeline, with custom LangChain agents for the research steps that Cargo.ai does not cover natively.',
      },
      {
        heading: 'SDK Kits and Quick Starts',
        type: 'code',
        content:
          'Every hosting provider ships SDK kits that cut deployment time. Railway has templates for LangChain agents, FastAPI backends, and cron workers. Trigger.dev has starter kits for common job patterns. Cargo.ai has pre-built workflow templates for enrichment and routing.\n\nThe pattern: pick a template that matches your use case. Fork it. Customize the logic. Deploy. You skip the boilerplate (Dockerfile, process management, health checks, logging) and focus on the agent logic that is unique to your use case.\n\nFor GTM engineers who are not DevOps specialists, SDK kits are the difference between "I could build this in a weekend" and "I could build this in an afternoon." The infrastructure is solved. Your job is the business logic.',
      },
      {
        heading: 'Production Checklist',
        type: 'pro-tip',
        content:
          'Before deploying an agent to production:\n\n1. Error handling: what happens when an API call fails? The agent should retry, log the failure, and continue with the next item. Never let one bad API response crash the whole run.\n\n2. Rate limiting: respect API limits. Add delays between calls. Use exponential backoff on retries. Getting rate-limited and retrying immediately makes it worse.\n\n3. Observability: log every step. When the agent runs at 3 AM and something goes wrong, logs are the only way to debug it. Trigger.dev gives you this for free. On Railway, use structured logging.\n\n4. Cost controls: set spending limits on API keys. A bug in a loop can burn through your Apollo credits in minutes. Cap the spend at the API level, not just in your code.\n\n5. Idempotency: running the agent twice should produce the same result. If it enriches a lead that is already enriched, it should skip, not duplicate.',
      },
    ],
  },

  /* ================================================================== */
  /*  ABM PIPELINE                                                        */
  /* ================================================================== */

  {
    id: 'abm-landing-pages',
    title: 'Building ABM Landing Pages with Claude Code',
    subtitle: 'The /landing-page skill: research, build, deploy at /for/{slug}',
    category: 'abm-pipeline',
    description:
      'How to build personalized ABM landing pages with Claude Code. The /landing-page skill workflow, CRM-fed personalization, bidirectional SEO linking, and deploying at /for/{slug}.',
    keywords: [
      'abm landing page',
      'personalized landing page',
      'claude code landing page',
      'abm personalization',
      '/for/ landing page',
      'hubspot landing page ai',
      'ai landing page builder',
      'abm page builder',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'abm-personalization-architecture',
      'posthog-for-gtm',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'The Landing Page Skill',
        type: 'prose',
        content:
          'The /landing-page skill does three things: research the target company, build a custom page, and deploy it. The output is a live page at /for/{company-slug} on thegtmos.ai.\n\nThe research phase pulls data from Exa (web intelligence), Apollo (firmographics), and Attio (existing CRM history). The build phase generates a React component with the company\'s specific pain points, relevant case studies, and tailored value propositions. The deploy phase pushes to GitHub, triggers a Vercel build, and the page is live in under 2 minutes.\n\nThis is not a template with a logo swap. Each page has unique content based on actual research. The company\'s tech stack, recent funding, hiring patterns, and competitive landscape inform every section. A human could build this page in 4-6 hours. The skill builds it in 5 minutes.',
      },
      {
        heading: 'CRM-Fed Personalization',
        type: 'pattern',
        content:
          'The next evolution: connecting Claude Code to HubSpot or Attio so landing pages pull from CRM data. If you already have deal notes, conversation history, and engagement data on an account, the landing page should reflect that context.\n\nPatterns that work:\n- Account with an open deal: landing page emphasizes the specific use case they discussed with your sales team.\n- Account that went cold: landing page addresses the likely objections with updated proof points.\n- Account from an event: landing page references the event and the specific topic they showed interest in.\n- Net new account: landing page uses industry-level personalization based on firmographic data.\n\nThe CRM data determines the personalization depth. More data, more specific pages. Less data, more industry-level pages. Both outperform generic landing pages by 3-5x on engagement metrics.',
      },
      {
        heading: 'SEO Value of ABM Pages',
        type: 'pro-tip',
        content:
          'ABM landing pages are not throwaway assets. They generate SEO value through bidirectional linking.\n\nEach /for/{slug} page links back to your main product pages, how-to guides, and case studies. Those pages link forward to relevant landing pages. The internal link graph grows with every new account page.\n\nThe pages also target long-tail keywords naturally. "/for/acme" targets "acme + your product category" searches. When Acme employees Google your product, they find a page built specifically for them. That page has more relevant content than your generic homepage.\n\nThe backlink value compounds. 50 ABM pages create 50 new nodes in your site graph, each with 5-10 internal links. That is 250-500 new internal links strengthening your overall domain authority.',
      },
    ],
  },

  {
    id: 'abm-personalization-architecture',
    title: 'ABM Personalization Architecture',
    subtitle: 'Signal-driven personalization from first touch to conversion',
    category: 'abm-pipeline',
    description:
      'The full ABM personalization architecture. Signal detection, RAG for due diligence, bidirectional link graphs, and the funnel from signal to conversion.',
    keywords: [
      'abm architecture',
      'abm personalization',
      'signal driven marketing',
      'abm funnel',
      'account based marketing architecture',
      'abm signal detection',
      'personalization pipeline',
      'abm conversion funnel',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'abm-landing-pages',
      'posthog-for-gtm',
      'cron-jobs-for-scraping',
      'agency-evaluation-checklist',
    ],
    sections: [
      {
        heading: 'The ABM Movement',
        type: 'prose',
        content:
          'ABM is not a tool. It is an architectural decision. Instead of broadcasting to everyone and hoping the right people respond, you identify specific accounts, research them deeply, and build personalized experiences for each one.\n\nThe traditional approach: marketing generates MQLs, sales qualifies them, most are garbage. The ABM approach: sales and marketing agree on target accounts upfront, build personalized content and outreach for each, and measure engagement at the account level.\n\nThe architecture that supports this has four layers: signal detection (who to target), research and enrichment (what to say), personalized delivery (how to say it), and engagement tracking (did it work). Each layer is automated. Each layer feeds data to the next.',
      },
      {
        heading: 'Signal Detection Layer',
        type: 'pattern',
        content:
          'Signals tell you when to engage. Types of signals:\n\nHiring signals: job postings that indicate budget and intent. "Hiring a RevOps Manager" means they are building infrastructure you might support.\n\nFunding signals: recent raises mean budget exists. Series A companies are building. Series B companies are scaling. Both need different things.\n\nTech stack signals: companies adopting tools adjacent to yours are natural buyers. If they just adopted Salesforce and you sell Salesforce integrations, the timing is right.\n\nEngagement signals: website visits, content downloads, social interactions. PostHog tracks these with precision. A company visiting your site 5 times in a week without converting needs personalized outreach, not another nurture email.\n\nCron jobs scan for signals daily. Job board scrapers, Exa web intelligence queries, PostHog engagement alerts. Fresh signals every morning.',
      },
      {
        heading: 'RAG for Due Diligence',
        type: 'pattern',
        content:
          'Once you have a signal, you need context. RAG turns raw signals into actionable research.\n\nThe pipeline: pull the company\'s website content (Exa), recent news (Exa), job postings (scraper), tech stack (BuiltWith or similar), firmographic data (Apollo), and any existing CRM history (Attio). Feed all of it into Claude context. Ask for a due diligence brief.\n\nThe output: a structured research document with company overview, relevant pain points, buying signals, potential objections, and recommended approach. This brief feeds the personalized landing page builder and the outreach generation skill.\n\nWithout RAG, outreach is generic. "I noticed you are growing and thought..." With RAG, outreach is specific. "Your 3 new RevOps hires and recent Salesforce adoption suggest you are building the data infrastructure to support your Series B growth targets. Here is how we helped a similar company cut their pipeline build time by 60%."',
      },
      {
        heading: 'The Bidirectional Link Graph',
        type: 'formula',
        content:
          'Every ABM asset creates connections:\n\nLanding page at /for/{slug} links to: relevant how-to guides, case studies, product pages, blog posts.\n\nHow-to guides link to: related landing pages, other guides, knowledge terms.\n\nBlog posts link to: landing pages for companies mentioned, how-to guides for tools discussed, knowledge terms for concepts explained.\n\nKnowledge terms link to: how-to guides, blog posts, landing pages.\n\nEvery new asset strengthens every existing asset. The graph compounds. 50 landing pages, 30 how-to guides, 20 blog posts, and 80 knowledge terms create a web of thousands of internal links. AI engines see comprehensive coverage. Search engines see topical authority. Visitors find relevant content on every page.\n\nThis is not link building. This is content architecture. The links emerge naturally from the data relationships. The TypeScript data objects define the connections. The templates render the links. No manual linking required.',
      },
    ],
  },

  /* ================================================================== */
  /*  SECURITY (new entry)                                                */
  /* ================================================================== */

  {
    id: 'team-security-cloud-guardrails',
    title: 'Security Guardrails for Cloud Teams',
    subtitle: 'Branch protection, secrets management, and access control for teams deploying agents',
    category: 'security',
    description:
      'Security guardrails for teams deploying AI agents on cloud infrastructure. Local vs cloud for sensitive operations, repo management, Claude Code as a security layer, and protecting production systems.',
    keywords: [
      'ai agent security',
      'cloud security guardrails',
      'branch protection ai',
      'secrets management ai',
      'claude code security',
      'team security cloud',
      'agent deployment security',
      'ai security best practices',
    ],
    difficulty: 'advanced',
    canonicalSite: 'shawnos',
    related: [
      'ai-security-myths',
      'constraints-and-context-engines',
      'env-files-explained',
    ],
    sections: [
      {
        heading: 'The Security Architecture',
        type: 'prose',
        content:
          'AI agents with access to production systems need guardrails. Not paranoid restrictions that make them useless, but practical boundaries that prevent catastrophic mistakes.\n\nThe architecture has three layers. First, what runs locally vs what runs in the cloud. Sensitive operations - API key management, database migrations, secrets rotation - stay on local machines where you have physical control. Agent workloads that process data and generate output run in the cloud where they scale.\n\nSecond, repo-level protections. Branch protection rules prevent agents from pushing directly to main. Required reviews ensure a human sees every change before it hits production. Pre-push hooks scan for secrets, API keys, and partner-identifiable data before anything leaves your machine.\n\nThird, runtime guardrails in Claude Code itself. CLAUDE.md rules define what the agent can and cannot do. The agent respects these rules because they are loaded into context at session start.',
      },
      {
        heading: 'Local vs Cloud for Sensitive Ops',
        type: 'pattern',
        content:
          'Keep local: .env files, API key rotation, database credentials, SSH keys, partner data, anything that would be catastrophic if leaked.\n\nPush to cloud: agent code, workflow definitions, processed (anonymized) data, generated content, deployment artifacts.\n\nThe rule: if the data exists in one place (your machine) and leaking it means calling every client, keep it local. If the data is generated or derived and losing it means re-running a script, it can go to the cloud.\n\nFor agents on Railway or similar: pass secrets as environment variables in the hosting dashboard. Never commit them. Never log them. Never include them in error messages. The agent code references process.env.API_KEY, not the actual key.',
      },
      {
        heading: 'Branch Protection and Review',
        type: 'code',
        content:
          'GitHub branch protection settings for teams with AI agents:\n\n1. Require pull request reviews before merging to main. Even if the agent wrote the code, a human reviews it.\n\n2. Require status checks to pass. Run your test suite and security scan before any merge.\n\n3. Require branches to be up to date before merging. No stale branch merges that create conflicts.\n\n4. Restrict who can push to main. Agents push to feature branches. Humans merge to main.\n\nPre-push hooks add another layer. The Husky pre-push hook scans every commit for patterns that should never be pushed: API keys (strings matching key patterns), partner names (from a local blocklist), .env file contents, and large binary files. The push fails if any pattern matches.',
      },
      {
        heading: 'Claude Code as a Security Layer',
        type: 'pro-tip',
        content:
          'Claude Code itself enforces security through CLAUDE.md rules. This is underappreciated.\n\nAdd rules like: "Never commit .env files. Never log API keys. Never include partner names in commit messages. Always check .gitignore before adding files. Run the pre-push blocklist scan before every push."\n\nThe agent follows these rules because they are in its context. It becomes a security-conscious collaborator. When you tell it to push code, it runs the scan first. When you tell it to add a file, it checks .gitignore first. When you tell it to log debug info, it redacts sensitive values.\n\nThis is not foolproof. It is a layer in a defense-in-depth strategy. Combined with branch protection, pre-push hooks, and secret management, it covers the common failure modes where teams accidentally leak credentials or push sensitive data.',
      },
    ],
  },

  /* ================================================================== */
  /*  COMPARISONS (new entry)                                             */
  /* ================================================================== */

  {
    id: 'cli-vs-mcp-tools',
    title: 'CLI Tools vs MCP Integrations',
    subtitle: 'When to use CLI access vs MCP and why the answer matters for context windows',
    category: 'comparisons',
    description:
      'Head-to-head comparison of CLI tools and MCP integrations. Context window cost, capability differences, which tools have CLIs vs MCPs vs both, and the convergence trend.',
    keywords: [
      'cli vs mcp',
      'mcp vs cli',
      'claude code cli mcp',
      'context window cost mcp',
      'mcp integration comparison',
      'cli tools ai',
      'mcp server cost',
      'cli mcp convergence',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'shawnos',
    related: [
      'cli-ecosystem-overview',
      'what-are-mcps',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'The Core Tradeoff',
        type: 'prose',
        content:
          'MCPs give AI agents direct access to external services. The agent calls a tool, the MCP server handles the API request, and the result comes back into context. Seamless. But every MCP server loads its tool definitions into the context window. A HubSpot MCP with 30 tools burns tokens just by existing.\n\nCLI tools sit on your machine. Zero context cost until you use them. When you need to query HubSpot, Claude Code runs the hs CLI command and reads the output. The tool definitions are not in context - the agent constructs the command from its training knowledge.\n\nThe tradeoff: MCPs are more integrated but expensive on context. CLIs are leaner but require the agent to know the CLI syntax. For simple operations, CLIs win. For complex multi-step workflows where the agent needs to discover available tools, MCPs win.',
      },
      {
        heading: 'Context Window Cost Comparison',
        type: 'formula',
        content:
          'A rough comparison:\n\nMCP server with 10 tools: ~2,000-4,000 tokens loaded into every session. That is context you pay for whether you use those tools or not.\n\nMCP server with 30 tools: ~8,000-12,000 tokens. A meaningful chunk of your context window spent on tool definitions.\n\n5 MCP servers simultaneously: 20,000-50,000 tokens. That is 10-25% of a 200k context window consumed before you ask a single question.\n\nCLI equivalent: 0 tokens until invoked. When Claude Code runs a CLI command, the command and its output enter context. A typical CLI interaction costs 200-500 tokens. You pay per use, not per load.\n\nThe math is clear for tools you use occasionally. If you query HubSpot once per session, the CLI saves 3,500 tokens over the MCP. If you query HubSpot 20 times per session, the MCP amortizes its cost and the integration advantage wins.',
      },
      {
        heading: 'Which Tools Have What',
        type: 'pattern',
        content:
          'CLI only: Vercel, Salesforce (sf), Homebrew, Git, most Unix tools.\n\nMCP only: Slack, Attio (currently), PostHog, Browserbase, Substack.\n\nBoth CLI and MCP: HubSpot, GitHub (gh CLI + GitHub MCP), potentially Attio (CLI in development).\n\nThe trend: tools are shipping both. The CLI for power users and automation scripts. The MCP for AI agent integration. The tools that ship both give you the flexibility to choose based on your use case.\n\nFor GTM stacks: the enrichment layer (Apollo, Clearbit, ZoomInfo) mostly uses API keys directly. The CRM layer (HubSpot, Salesforce, Attio) is moving to both CLI and MCP. The outreach layer (Instantly, Lemlist, HeyReach) is mostly MCP or API only.',
      },
      {
        heading: 'The Convergence',
        type: 'pro-tip',
        content:
          'The distinction between CLI and MCP is dissolving. Claude Code wraps both. When you say "check my Vercel deployments," it uses the CLI. When you say "search my Slack channels," it uses the MCP. You do not care which mechanism it uses. You care about the result.\n\nThe future is probably a unified tool layer where Claude Code picks the best access method for each request. CLI for simple queries. MCP for complex interactions. Direct API calls for everything else. The agent handles the routing.\n\nFor now, the practical advice: install CLIs for tools you use heavily (saves context). Set up MCPs for tools where you need the agent to discover capabilities (complex tools with many operations). Use both when available and let Claude Code pick the right one per request.',
      },
    ],
  },

  /* ================================================================== */
  /*  TOOL EVALUATION                                                     */
  /* ================================================================== */

  {
    id: 'should-you-get-clay',
    title: "Should You Get Clay? A Go-to-Market Engineer's Independent Evaluation",
    subtitle: 'An honest framework for deciding if Clay is right for your GTM stack',
    category: 'tool-evaluation',
    description:
      'Independent evaluation of Clay for enrichment and qualification. When it is worth the investment, when cheaper alternatives work, and the questions a go-to-market engineer asks before recommending it.',
    keywords: [
      'clay enrichment review',
      'should I use clay',
      'clay alternative',
      'go-to-market engineer clay evaluation',
      'clay vs manual enrichment',
      'clay pricing evaluation',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'mcp-cli-litmus-test',
      'data-lake-for-gtm',
      'credit-transparency-gtm-tools',
      'model-selection-strategy',
    ],
    sections: [
      {
        heading: 'What Clay Actually Does',
        type: 'prose',
        content:
          'Clay is a data enrichment platform that waterfalls across 50+ data providers to build complete lead profiles. You give it a company name or domain, and it pulls firmographics, technographics, job postings, funding data, contact info, and more. The waterfall approach means if Provider A does not have the data, it tries Provider B, then C. You get better coverage than any single provider.\n\nThe real power is the table interface. You build workflows visually - enrichment columns feed into qualification formulas, which feed into routing logic, which pushes to your outbound tools. A go-to-market engineer uses Clay the way a developer uses a database: structured data in, qualified leads out.\n\nBut that power comes at a cost. Clay credits are consumed per enrichment, per provider hit. A single lead can burn 5-15 credits depending on how many columns you run. At scale, this adds up fast.',
      },
      {
        heading: 'When Clay is Worth It',
        type: 'pattern',
        content:
          'Clay makes sense when three conditions are true. First, you are processing more than 100 leads per month. Below that volume, manual research or a single enrichment provider is faster and cheaper. Second, you need multi-source enrichment - not just email lookup but firmographic scoring, technographic signals, and intent data combined. Third, you have someone who will build and maintain the tables. Clay is not a set-it-and-forget-it tool. It is a platform that requires a go-to-market engineer to operate.\n\nThe sweet spot is teams doing 200-2000 leads per month with complex ICP criteria. You are qualifying on multiple dimensions - company size, tech stack, funding stage, hiring signals - and need those signals aggregated before outbound. That is where Clay saves hours of manual research per day.\n\nIf you are sending cold emails to a bought list with no enrichment beyond email verification, Clay is overkill. A $50/month email finder gets you there.',
      },
      {
        heading: 'When to Skip Clay',
        type: 'anti-pattern',
        content:
          'Do not buy Clay if you do not have someone to build the tables. Clay without a builder is like Salesforce without an admin - expensive shelfware. This is the number one mistake companies make. They see the demo, get excited by the waterfall enrichment, sign up, and then realize nobody on the team can build the workflows.\n\nDo not buy Clay if your lead volume is under 100/month. The platform fee plus credit consumption does not justify itself at low volume. Use Apollo, Clearbit, or even manual LinkedIn research instead.\n\nDo not buy Clay if you are not measuring credit consumption. Clay burns credits per enrichment column, per provider hit. Without tracking, a single table refresh can consume your entire monthly credit budget. A go-to-market engineer tracks credits per lead, per campaign, and per provider. If nobody is watching the meter, you will overspend.',
      },
      {
        heading: 'The Independent Evaluation Framework',
        type: 'pro-tip',
        content:
          'Before recommending Clay to any client, a go-to-market engineer asks five questions. How many leads do you process monthly? What enrichment do you currently have? Who will build and maintain the workflows? What is your budget for data enrichment? And what does your current qualification process look like?\n\nThe answers determine the recommendation. If volume is low, skip Clay. If they already have good enrichment from their CRM, layer Clay on top for gap-filling only. If nobody can build tables, recommend an agency or consultant engagement first to build the foundation, then transfer ownership.\n\nThe point of an independent evaluation is that the answer might be "you do not need Clay." An agency selling Clay licenses will never tell you that. A go-to-market engineer consultant working independently has no incentive to push the tool. The recommendation matches the situation.',
      },
    ],
  },

  {
    id: 'mcp-cli-litmus-test',
    title: 'The MCP + CLI Litmus Test for Go-to-Market Tools',
    subtitle: 'If your tools cannot be automated programmatically, you are paying for clicks',
    category: 'tool-evaluation',
    description:
      'The litmus test every go-to-market engineer applies to GTM tools: can they be automated via MCP servers and CLI access? A framework for evaluating tool maturity and automation readiness.',
    keywords: [
      'MCP server litmus test',
      'CLI automation GTM',
      'go-to-market engineer tool evaluation',
      'GTM tool automation',
      'MCP server evaluation',
      'programmatic GTM tools',
    ],
    difficulty: 'advanced',
    canonicalSite: 'gtmos',
    related: [
      'should-you-get-clay',
      'credit-transparency-gtm-tools',
      'workspace-red-flag',
      'mcp-gtm-stack',
    ],
    sections: [
      {
        heading: 'Why Programmatic Access Matters',
        type: 'prose',
        content:
          'Every GTM tool has a GUI. Click here, drag there, export CSV. That is table stakes. The real question is whether the tool can be operated without the GUI. Can an agent call it? Can a script trigger it? Can a cron job run it at 2 AM while nobody is watching?\n\nThis is the MCP + CLI litmus test. MCP (Model Context Protocol) servers expose tool functionality to AI agents. CLI (command line interface) access lets scripts and automation trigger operations. A tool that has both can be embedded in pipelines, orchestrated by agents, and scaled without human clicks.\n\nA tool that only has a GUI requires a human in the loop for every operation. That is fine for 10 leads. It breaks at 1000. A go-to-market engineer evaluates tools by their automation ceiling, not their demo.',
      },
      {
        heading: 'The Three-Level Test',
        type: 'pattern',
        content:
          'Level 1 - API access. Does the tool have a documented REST API with proper authentication? Can you make a curl request and get structured data back? Most modern tools pass this. If they do not, that is an immediate red flag.\n\nLevel 2 - CLI tooling. Is there an official command-line interface? Can you run operations from a terminal without opening a browser? This is rarer. HubSpot has it. Vercel has it. Most outreach tools do not.\n\nLevel 3 - MCP server. Does the tool ship an MCP server or have a community-maintained one? Can an AI agent like Claude Code interact with it natively? This is the cutting edge. PostHog, Attio, Slack, and GitHub have MCP servers. Most GTM tools are still at Level 1 only.\n\nThe go-to-market engineer scores every tool in the stack on these three levels. A tool at Level 3 is fully automatable. A tool stuck at Level 1 requires custom integration work. A tool with no API access at all is a liability.',
      },
      {
        heading: 'Tools That Pass vs. Tools That Fail',
        type: 'anti-pattern',
        content:
          'Tools that pass the test: HubSpot (API + CLI + MCP), Apollo (API + MCP), GitHub (API + CLI + MCP), Vercel (API + CLI), PostHog (API + MCP). These tools can be fully embedded in automated pipelines.\n\nTools that partially pass: Clay (API but limited - most power is in the GUI table builder), Instantly (API for campaign management but not for analytics), HeyReach (API for basic operations, no CLI or MCP).\n\nTools that fail: any tool where the only way to operate is through the web interface. If you cannot export data programmatically, if you cannot trigger campaigns via API, if you cannot pull analytics without logging in - you are locked into manual operations. That does not scale.\n\nThe failing grade does not mean the tool is bad. It means the tool has an automation ceiling. A go-to-market engineer factors that ceiling into the stack decision.',
      },
      {
        heading: 'Applying the Test to Your Stack',
        type: 'pro-tip',
        content:
          'Run the test on your current stack right now. List every tool. For each one, check: does it have an API? Is there a CLI? Is there an MCP server? Score each tool 0-3.\n\nThen look at the pattern. If your enrichment tool scores 3 but your outreach tool scores 0, you have a bottleneck. The pipeline is only as automated as its weakest link. A go-to-market engineer identifies these bottlenecks and either replaces the tool, builds custom integrations to bridge the gap, or documents the manual steps so the team knows where human intervention is required.\n\nThe goal is not to eliminate all manual work. The goal is to make manual work a choice, not a constraint. You should be clicking because it adds value, not because the tool gives you no other option.',
      },
    ],
  },

  {
    id: 'data-lake-for-gtm',
    title: "What is a Data Lake for GTM? When Clay Isn't the Answer",
    subtitle: 'Store enrichment results instead of re-running lookups every campaign',
    category: 'tool-evaluation',
    description:
      'What a data lake means in the context of go-to-market operations. Why re-enriching the same leads wastes money, how to build institutional knowledge, and when a go-to-market engineer recommends a data lake over Clay.',
    keywords: [
      'data lake GTM',
      'enrichment data lake',
      'go-to-market engineer data strategy',
      'clay vs data lake',
      'lead enrichment storage',
      'GTM data architecture',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'should-you-get-clay',
      'credit-transparency-gtm-tools',
      'mcp-cli-litmus-test',
      'how-to-build-abm-pipeline-with-ai',
    ],
    sections: [
      {
        heading: 'The Re-Enrichment Problem',
        type: 'prose',
        content:
          'Every time you run a new campaign, you enrich leads. Company data, contact info, technographics, intent signals. If you processed 500 leads last quarter and 200 of them overlap with this quarter, you just paid to enrich 200 leads twice. Do that across four quarters and you have paid for the same data four times.\n\nThis is the re-enrichment problem. Most GTM teams treat enrichment as a per-campaign expense instead of a compounding asset. The data from last month is gone - buried in an old Clay table, an exported CSV on someone\'s desktop, or a campaign that was archived.\n\nA go-to-market engineer sees this pattern in almost every stack audit. The company has been running outbound for two years and has zero institutional knowledge about their market. Every campaign starts from scratch. That is not a tool problem. It is an architecture problem.',
      },
      {
        heading: 'What a GTM Data Lake Looks Like',
        type: 'pattern',
        content:
          'A GTM data lake is a persistent store of every enrichment result, every qualification score, and every engagement signal your team has ever generated. It does not have to be fancy. A well-structured database or even a managed spreadsheet works at small scale.\n\nThe structure: one record per company domain. Every enrichment result appends to that record. If you enriched acme.com in January and again in March, both results are stored with timestamps. You can see how the company changed over time. Did they hire three new SDRs? Did their tech stack change? Did their funding status update?\n\nThe query pattern: before enriching a lead, check the data lake first. If the company was enriched within the last 90 days, use the cached data. Only re-enrich if the data is stale or missing. This alone can cut enrichment costs by 40-60% for teams with overlapping target lists.\n\nA go-to-market engineer builds this as the foundation before plugging in Clay, Apollo, or any enrichment provider. The provider is the faucet. The data lake is the reservoir.',
      },
      {
        heading: 'When Clay is Not the Answer',
        type: 'anti-pattern',
        content:
          'Clay is an enrichment engine, not a data store. Tables in Clay are workflow artifacts - they exist to process leads through a pipeline. Once the campaign ships, the table is done. Most teams archive it and start fresh.\n\nThat is Clay working as designed. But it means Clay is not your system of record for enrichment data. If you delete a Clay table, that data is gone. If you re-run the same lead list, Clay charges you again. There is no built-in deduplication across tables.\n\nThe answer is not to stop using Clay. The answer is to layer a data lake underneath it. Clay enriches. The data lake stores. Next time you build a table, pre-populate it from the data lake and only enrich the gaps. Your Clay bill drops. Your institutional knowledge grows. That is the architecture a go-to-market engineer recommends.',
      },
      {
        heading: 'Building Your First GTM Data Lake',
        type: 'pro-tip',
        content:
          'Start simple. A PostgreSQL database or even Airtable with a structured schema. Core tables: companies (keyed by domain), contacts (keyed by email), enrichment_results (timestamped), engagement_signals (email opens, replies, LinkedIn responses).\n\nEvery time a campaign runs, the pipeline does two things: query the data lake for existing data, then enrich only the gaps. After enrichment, write the results back to the data lake. Over time, your data lake becomes the most valuable asset in your GTM stack - more valuable than any single tool.\n\nThe ROI calculation is straightforward. If you are spending $2000/month on Clay credits and 40% of your leads were already enriched in a previous campaign, a data lake saves $800/month. Over a year that is $9600 in credit savings alone, plus the compounding value of institutional knowledge. That is the math a go-to-market engineer shows during a stack audit.',
      },
    ],
  },

  {
    id: 'agency-evaluation-checklist',
    title: "Is Your GTM Agency Doing You Right? A Go-to-Market Engineer's Checklist",
    subtitle: 'Eight questions to evaluate whether your agency is building or billing',
    category: 'tool-evaluation',
    description:
      'An independent checklist for evaluating GTM agencies. What a go-to-market engineer looks for during an audit, red flags that signal misalignment, and the questions agencies do not want you to ask.',
    keywords: [
      'GTM agency evaluation',
      'agency audit checklist',
      'go-to-market engineer agency review',
      'is my agency good',
      'agency vs consultant GTM',
      'outbound agency evaluation',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'workspace-red-flag',
      'credit-transparency-gtm-tools',
      'should-you-get-clay',
      'abm-personalization-architecture',
    ],
    sections: [
      {
        heading: 'Why Most Agency Relationships Go Stale',
        type: 'prose',
        content:
          'The agency engagement starts strong. New team, fresh campaign ideas, promises of pipeline growth. Three months in, the campaigns are running but the results plateau. Six months in, you are paying the same retainer for the same playbook. The agency is not doing anything wrong exactly - they are just optimizing for campaigns shipped, not pipeline generated.\n\nThis is the structural misalignment. Agencies bill for activity. You pay for outcomes. Their incentive is to keep campaigns running. Your incentive is to generate revenue. These two things are correlated but not identical. A go-to-market engineer spots this gap during the first audit call.',
      },
      {
        heading: 'The Eight-Question Checklist',
        type: 'pattern',
        content:
          '1. Who owns the tool logins? If the agency controls your Clay, Instantly, or CRM credentials, you are locked in. You should own every login.\n\n2. Can you see credit consumption? Ask for a monthly breakdown of enrichment credits, email sends, and LinkedIn connection requests. If they cannot produce it, they are not tracking it.\n\n3. What happens if you leave? Can you export all workflows, templates, and data? Or does it stay in their accounts? The answer reveals how portable your investment is.\n\n4. How many other clients share your GTM engineer? If the answer is 8-10, your campaigns are getting maintenance, not engineering. An engineer managing 10 workspaces cannot optimize any of them.\n\n5. Are they building infrastructure or running campaigns? Campaigns are one-time. Infrastructure compounds. Ask what assets you will own in 6 months that you do not own today.\n\n6. Can they explain why each tool was chosen? If the answer is "we use Clay for all clients," that is a default, not a recommendation. Each tool choice should be justified by your specific needs.\n\n7. What is their testing methodology? A/B testing subject lines, send times, audience segments? Or running the same playbook every month?\n\n8. Are they measuring leading or lagging indicators? Reply rates are leading. Revenue is lagging. If they only report on vanity metrics (emails sent, open rates), they are not connected to your outcomes.',
      },
      {
        heading: 'Red Flags That Signal Trouble',
        type: 'anti-pattern',
        content:
          'The agency will not share tool logins. This is the biggest red flag. If you are paying for tools through the agency and cannot access them directly, your data and workflows are hostage.\n\nReporting only on activity metrics. "We sent 5000 emails this month" is not a result. "We generated 12 qualified meetings from 5000 emails" is a result. If the agency reports on volume without conversion context, they are billing for busywork.\n\nIdentical playbook across clients. Your ICP is different from their other clients. Your messaging should be different. Your qualification criteria should be different. If every client gets the same 3-email sequence template, the agency is running a factory, not a service.\n\nResistance to audits. A good agency welcomes an independent evaluation because it validates their work. An agency that pushes back on audits has something to hide. That resistance alone tells you what the audit would find.',
      },
      {
        heading: 'What Good Looks Like',
        type: 'pro-tip',
        content:
          'The best agency engagements look like partnerships, not vendor relationships. You own all the tools and logins. The agency builds in your accounts. They produce monthly reports with credit consumption, conversion rates, and ROI analysis. They test hypotheses, not just run campaigns.\n\nA go-to-market engineer who audits agencies is not trying to replace them. Sometimes the audit conclusion is "your agency is doing excellent work - here are three things to optimize." Other times the conclusion is "you need to restructure this relationship." Either way, you have an independent assessment from someone with no stake in the outcome.\n\nThe checklist above is not about finding fault. It is about aligning incentives. When both sides are measured on the same outcomes, the relationship works. When incentives diverge, results plateau.',
      },
    ],
  },

  {
    id: 'credit-transparency-gtm-tools',
    title: 'Why Credit Transparency Matters in Go-to-Market Tools',
    subtitle: 'If you cannot answer what each enrichment costs, someone else is deciding your ROI',
    category: 'tool-evaluation',
    description:
      'Why credit transparency is a non-negotiable requirement for GTM tools. How a go-to-market engineer tracks credit consumption, the hidden costs most teams miss, and frameworks for budget accountability.',
    keywords: [
      'credit transparency GTM',
      'clay credit tracking',
      'go-to-market engineer cost management',
      'enrichment credit monitoring',
      'GTM tool ROI tracking',
      'credit consumption audit',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'should-you-get-clay',
      'data-lake-for-gtm',
      'agency-evaluation-checklist',
      'credit-management',
    ],
    sections: [
      {
        heading: 'The Hidden Cost of Opaque Credits',
        type: 'prose',
        content:
          'Most GTM tools use credit-based pricing. Clay charges per enrichment. Apollo charges per contact lookup. Instantly charges per email sent. The credits are the fuel. But most teams have no idea how much fuel they are burning per lead, per campaign, or per pipeline dollar generated.\n\nThis opacity is expensive. A single Clay table with 10 enrichment columns processing 500 leads can burn 5000-7500 credits in one run. If your plan includes 10000 credits per month, that is half your budget on one campaign. Without tracking, you do not know until you hit your limit and enrichments stop mid-pipeline.\n\nA go-to-market engineer treats credit tracking the same way a CFO treats expense tracking. Every credit spent should be attributable to a campaign, a lead segment, or a test. If you cannot trace the spend, you cannot optimize it.',
      },
      {
        heading: 'What Credit Transparency Looks Like',
        type: 'pattern',
        content:
          'At minimum, you should know four things at all times. Credits consumed this billing cycle. Credits consumed per campaign. Average credits per lead (total credits divided by total leads processed). Cost per qualified meeting (total credit spend divided by meetings booked).\n\nThe first two are available in most tool dashboards. The second two require you to connect credit data to pipeline outcomes. That connection is where most teams fall short. They can tell you how many credits Clay burned last month but not what those credits produced.\n\nA go-to-market engineer builds a simple tracking layer: a spreadsheet or database that logs credit consumption per campaign alongside pipeline outcomes. Campaign A used 2000 credits and generated 8 meetings. Campaign B used 3000 credits and generated 2 meetings. Now you know which campaign to double down on and which to kill. That is credit transparency driving decisions.',
      },
      {
        heading: 'Tools That Hide the Meter',
        type: 'anti-pattern',
        content:
          'Some tools make credit tracking intentionally difficult. Credits are consumed in the background with no per-action breakdown. The dashboard shows total consumption but not per-workflow or per-column usage. There is no export or API endpoint for credit audit data.\n\nThis is not accidental. Opaque credit systems benefit the vendor. You cannot optimize what you cannot measure. You consume more credits than necessary. You upgrade your plan when you hit limits instead of investigating why consumption spiked.\n\nThe red flag: if a tool cannot tell you exactly how many credits a specific workflow consumed, the pricing model is designed to obscure, not inform. A go-to-market engineer will recommend tools with transparent, auditable credit reporting over tools with higher feature counts but opaque pricing.',
      },
      {
        heading: 'Building Credit Accountability',
        type: 'pro-tip',
        content:
          'Step one: export credit consumption data weekly. Most tools provide this through their dashboard or API. If they do not, that is a red flag worth evaluating.\n\nStep two: tag every campaign with a unique identifier. When you process leads through Clay or Apollo, the campaign tag travels with the credit consumption.\n\nStep three: calculate cost per qualified lead for each campaign. Total credits used multiplied by your cost per credit, divided by qualified leads generated. This number tells you whether the campaign is economically viable.\n\nStep four: set credit budgets per campaign before launch. If you estimate 500 leads at 10 credits each, budget 5000 credits. If the campaign exceeds the budget, pause and investigate before continuing.\n\nThis framework takes 30 minutes per week to maintain. It saves thousands per quarter. A go-to-market engineer implements this in the first week of any engagement because it is the foundation for every optimization decision that follows.',
      },
    ],
  },

  {
    id: 'sdrs-learning-ai-tools',
    title: "SDRs Should Be Learning AI Tools: A Go-to-Market Engineer's Take",
    subtitle: 'The SDR role is evolving - and the ones who build skills now will lead the next era',
    category: 'tool-evaluation',
    description:
      'Why SDRs should be learning AI tools now. The go-to-market engineer role evolved from SDR foundations. How to start building technical skills without becoming a developer.',
    keywords: [
      'SDR AI tools',
      'go-to-market engineer career path',
      'SDR learning automation',
      'SDR to GTM engineer',
      'AI tools for sales development',
      'SDR career evolution',
    ],
    difficulty: 'beginner',
    canonicalSite: 'gtmos',
    related: [
      'mcp-cli-litmus-test',
      'agency-evaluation-checklist',
      'workspace-red-flag',
      'should-you-get-clay',
    ],
    sections: [
      {
        heading: 'The SDR Role is Changing',
        type: 'prose',
        content:
          'The traditional SDR model - 200 cold calls a day, copy-paste email templates, manual LinkedIn outreach - is being automated. Not eliminated, but transformed. The tools that used to require a team of SDRs can now be orchestrated by one person with the right stack.\n\nThis is not a threat to SDRs. It is an opportunity. The SDRs who learn to operate these tools become the go-to-market engineers that companies desperately need. The SDR who can set up a Clay enrichment table, configure an Instantly campaign, and analyze reply rates in PostHog is more valuable than five SDRs doing manual outreach.\n\nI know this because I was an SDR. I sent the emails. I made the calls. I learned that the work was repetitive and the tools were primitive. So I started automating. First with spreadsheet formulas. Then with basic scripts. Then with full pipelines. The SDR experience gave me the domain knowledge. The tools gave me leverage.',
      },
      {
        heading: 'Where to Start',
        type: 'pattern',
        content:
          'You do not need to learn programming. You need to learn tool orchestration. Start with these three skills.\n\nFirst, learn Clay. Build one enrichment table from scratch. Pull in a list of 50 companies, add enrichment columns, write a qualification formula, and export the qualified leads. This takes one afternoon and teaches you more about data enrichment than six months of manual research.\n\nSecond, learn prompt engineering. Not for chatbots - for data workflows. Write a Clay research prompt that generates personalized icebreakers from company data. Write a prompt that extracts pain points from job postings. These prompts are the bridge between raw data and outbound copy.\n\nThird, learn analytics. Set up a PostHog dashboard that tracks reply rates, bounce rates, and conversion by campaign. Understanding what the numbers mean is more important than generating the numbers. An SDR who can explain why Campaign A outperformed Campaign B is operating at a go-to-market engineer level.',
      },
      {
        heading: 'What Not to Do',
        type: 'anti-pattern',
        content:
          'Do not try to become a software engineer. The goal is not to write Python scripts or deploy infrastructure. The goal is to operate tools that already exist. The abstractions are built. You need to use them, not rebuild them.\n\nDo not automate before you understand the manual process. Automating bad outbound faster just produces bad outbound faster. Master the craft first - what makes a good email, what signals a qualified lead, when to follow up vs. when to let go. Then automate the parts that are repetitive.\n\nDo not wait for your company to train you. Most companies are still figuring out their AI strategy. The SDRs who learn independently - on their own time, with free tier tools - will be the ones companies hire to lead the transition. When your manager asks who understands Clay, you want to be the person who raises their hand.',
      },
      {
        heading: 'The Career Path',
        type: 'pro-tip',
        content:
          'The career ladder from SDR to go-to-market engineer is not well defined yet because the role is new. But the pattern is clear. SDRs who learn AI tools become the person on the team who builds the workflows. That person becomes the de facto GTM operations lead. That lead either grows into a GTM engineer role internally or goes independent as a consultant.\n\nThe independent path is particularly interesting. An independent go-to-market engineer consultant brings the SDR domain knowledge (what works in outbound) plus the technical skills (how to build and automate) plus the independence (no vendor allegiance). That combination is rare and valuable.\n\nThe SDRs reading this who start learning today will have a 12-18 month head start on their peers. The tools are available. The documentation is public. The only barrier is initiative.',
      },
    ],
  },

  {
    id: 'workspace-red-flag',
    title: '9-10 Workspaces is a Red Flag: What Go-to-Market Engineers Know',
    subtitle: 'When your GTM engineer is managing too many clients, nobody gets engineering',
    category: 'tool-evaluation',
    description:
      'Why 9-10 client workspaces per go-to-market engineer is a red flag. The difference between engineering and maintenance, what you lose at scale, and how independent consultants approach capacity differently.',
    keywords: [
      'GTM engineer workload',
      'agency capacity red flag',
      'go-to-market engineer consultant',
      'GTM agency workspace limit',
      'outbound agency quality',
      'GTM engineer burnout',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'agency-evaluation-checklist',
      'sdrs-learning-ai-tools',
      'mcp-cli-litmus-test',
    ],
    sections: [
      {
        heading: 'The Math Does Not Work',
        type: 'prose',
        content:
          'A go-to-market engineer at an agency managing 9-10 client workspaces has roughly 4 hours per week per client. That is 40 hours divided by 10 clients. In reality, it is less - meetings, internal syncs, reporting, and context-switching eat another 20-30% of the time.\n\nFour hours per week is enough to maintain existing campaigns. Check the dashboards. Swap a subject line. Reply to "looks good, let us set up a call" messages. But it is not enough to engineer. Engineering means building new enrichment workflows, testing qualification hypotheses, analyzing reply patterns, optimizing send timing, and iterating on ICP criteria.\n\nThe result is predictable. Campaigns plateau at month 3 because nobody has time to optimize them. The agency reports activity metrics (emails sent, open rates) because outcome metrics (qualified meetings, pipeline generated) require deeper analysis that 4 hours per week does not support.',
      },
      {
        heading: 'Engineering vs. Maintenance',
        type: 'pattern',
        content:
          'Maintenance is checking dashboards, pausing underperformers, and launching the next campaign from the same template. It is necessary but it does not compound. Month 6 looks like month 1 with different lead lists.\n\nEngineering is analyzing why Campaign A generated 3x the meetings of Campaign B, isolating the variable (was it the ICP segment? the messaging angle? the send cadence?), and building that insight into every future campaign. Engineering means the system gets smarter over time.\n\nAt 3-4 clients, a go-to-market engineer has enough time to do both. Maintain the running campaigns and engineer improvements. At 9-10 clients, there is only time for maintenance. The agency bills the same rate regardless.\n\nThis is not a criticism of the engineers. They are doing the best they can with the capacity they have. It is a criticism of the model. The agency optimizes for revenue per engineer (more clients = more revenue). The client needs depth per engagement (fewer clients = better results).',
      },
      {
        heading: 'How to Spot the Red Flag',
        type: 'anti-pattern',
        content:
          'Ask your agency: how many clients does my go-to-market engineer manage? If they dodge the question or say "we have a team model," push harder. Someone is responsible for your campaigns. How many other campaigns are they responsible for?\n\nOther signals: your campaigns have not been meaningfully updated in weeks. Reporting is templated - same metrics, same format, same insights every month. When you ask for a new campaign type, the turnaround is weeks, not days. Your go-to-market engineer cannot recall specific details about your ICP without checking notes.\n\nThese are not signs of a bad engineer. They are signs of an overloaded one. The capacity constraint manifests as generic work, slow iteration, and plateau-level performance. If you are paying premium rates for maintenance-level output, the workspace ratio is probably why.',
      },
      {
        heading: 'The Independent Alternative',
        type: 'pro-tip',
        content:
          'An independent go-to-market engineer consultant typically works with 2-4 clients maximum. That is a deliberate capacity constraint. Fewer clients means deeper engagement. Each client gets 10-15 hours per week of engineering attention, not 4 hours of maintenance.\n\nThe tradeoff is cost. An independent consultant charges more per hour than an agency allocates per client. But the output-per-dollar is higher because the work compounds. Month 3 is not a repeat of month 1 - it is building on three months of iterative optimization.\n\nThe other advantage is ownership. An independent consultant builds in your accounts, documents everything, and transfers ownership. When the engagement ends, you have infrastructure that runs independently. You do not start from zero. The question to ask yourself: do you want 4 hours of maintenance per week from a shared resource, or 10-15 hours of engineering from a dedicated one? The answer depends on your pipeline goals and budget, but at least now you know the tradeoff exists.',
      },
    ],
  },

  /* ================================================================== */
  /*  PARALLEL AGENTS                                                     */
  /* ================================================================== */

  {
    id: 'autonomous-agent-loops',
    title: 'Autonomous Agent Loops: The Autoresearch Pattern',
    subtitle:
      'How Karpathy\'s autoresearch repo reveals the architecture behind self-improving AI agents',
    category: 'parallel-agents',
    description:
      'Autonomous agent loops let AI agents run experiments, evaluate results, and iterate without human intervention. The pattern behind Karpathy\'s autoresearch applies far beyond ML research - to content pipelines, GTM automation, and any domain with a clear success metric.',
    keywords: [
      'autonomous agent loops',
      'karpathy autoresearch',
      'self-improving AI agents',
      'AI agent architecture',
      'agent feedback loops',
      'autonomous AI research',
    ],
    difficulty: 'intermediate',
    canonicalSite: 'gtmos',
    related: [
      'claude-code-quickstart',
      'parallel-agent-orchestration',
    ],
    sections: [
      {
        heading: 'What Autoresearch Is',
        type: 'prose',
        content:
          'In March 2026, Andrej Karpathy released <a href="https://github.com/karpathy/autoresearch" target="_blank" rel="noopener">autoresearch</a> (<a href="https://x.com/karpathy/status/2030371219518931079" target="_blank" rel="noopener">announcement on X</a>). Three files. One GPU. An AI agent that modifies training code, runs a 5-minute experiment, evaluates whether the result improved, keeps or discards the change, and repeats. Around 12 experiments per hour, roughly 100 overnight, with zero human intervention.\n\nThe repo itself is a demo - a small GPT model training on a single NVIDIA GPU. But the pattern it demonstrates is the real contribution. Autonomous agent loops with a clear metric, a constrained action space, and indefinite iteration.',
      },
      {
        heading: 'The Three-File Architecture',
        type: 'pattern',
        content:
          'The entire system is three files. prepare.py is locked - utilities for data loading and evaluation that the agent cannot touch. train.py is the only file the agent modifies - contains the model, optimizer, and training loop. program.md is where humans write instructions for the agent.\n\nThat last file is the paradigm shift. You do not program Python. You program a markdown file that tells the agent what to explore. The agent writes the Python. Karpathy calls this "programming the program.md." The human provides strategy. The agent provides execution. The loop provides compounding.',
      },
      {
        heading: 'The Pattern Applied to GTM',
        type: 'pattern',
        content:
          'The autoresearch loop has four steps: modify, test, evaluate, keep-or-discard. This pattern applies to any domain where you can define a clear success metric and give an agent a constrained action space.\n\nContent pipelines: read previous output, generate new content, validate against quality rules, score the output, retry if below threshold. The output becomes input for the next cycle. Voice consistency improves with every iteration because the agent studies what it already produced.\n\nEmail campaigns: generate a variant, send to a test segment, measure reply rate, keep or discard the variant. The campaign optimizes itself over time.\n\nEnrichment workflows: run an enrichment sequence, score the data quality, flag gaps, modify the sequence, run again. Each pass fills holes the previous pass missed.\n\nThe principle is the same everywhere: define the metric, constrain the action space, let the loop run.',
      },
      {
        heading: 'Constraint Is the Feature',
        type: 'pro-tip',
        content:
          'Autoresearch works because the problem space is deliberately narrow. One file the agent can edit. One number to optimize. Five-minute experiments. If you give an agent unlimited scope, it wanders. If you give it one file and one number, it optimizes.\n\nThis is the single most transferable lesson. When designing autonomous agent workflows, the temptation is to give the agent maximum flexibility. The opposite produces better results. Narrow the action space. Pick one metric. Set a time budget per iteration. Let the loop compound.\n\nKarpathy\'s system reached 10,000+ generations because each generation is cheap, fast, and clearly evaluated. An agent that tries to optimize everything at once reaches zero generations because it never finishes a single experiment.',
      },
      {
        heading: 'How to Build Your Own Loop',
        type: 'code',
        content:
          'The recipe is four components:\n\n1. Action space - what can the agent modify? Keep it as narrow as possible. One file. One template. One configuration block.\n\n2. Evaluation metric - how do you know if the change helped? Must be numeric and automated. Validation loss, anti-slop score, reply rate, data completeness percentage. If a human has to judge, the loop cannot run autonomously.\n\n3. Time budget - how long does each experiment run? Short enough to iterate fast (Karpathy uses 5 minutes). Long enough to produce a meaningful signal.\n\n4. Memory - what does the agent carry between iterations? The output from iteration N becomes context for iteration N+1. This is the recursive property that makes the loop compound rather than repeat.\n\nYou do not need an H100 or a custom framework. A Claude Code session with a markdown instruction file, a script to run, and a scoring function is enough to run this pattern on a single machine.',
      },
    ],
  },
]
