/**
 * ShawnOS - Context Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

/* ── types (mirror Clay Wiki) ──────────────────────── */

export interface WikiSection {
  heading: string
  content: string
  type: 'prose' | 'pattern' | 'code' | 'anti-pattern' | 'pro-tip' | 'formula'
}

export type ContextWikiCategory =
  | 'foundations'
  | 'modes'
  | 'infrastructure'
  | 'code'

export interface ContextWikiEntry {
  id: string
  title: string
  subtitle: string
  category: ContextWikiCategory
  description: string
  keywords: string[]
  sections: WikiSection[]
  related: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/* ── category metadata ────────────────────────────── */

export const CONTEXT_WIKI_CATEGORIES: {
  id: ContextWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description:
      'What context engineering is, how to build a context repo, and how to organize knowledge so AI actually uses it',
    prompt: '$ cd ~/context-wiki/foundations/',
  },
  {
    id: 'modes',
    label: 'Modes and Workflows',
    description:
      'How to think about plan mode, agent mode, parallel execution, skills, and model selection',
    prompt: '$ cd ~/context-wiki/modes/',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    description:
      'Git, GitHub, deployments, monorepos, and scheduled automation for GTM engineers',
    prompt: '$ cd ~/context-wiki/infrastructure/',
  },
  {
    id: 'code',
    label: 'Code and Automation',
    description:
      'Python scripts, MCP servers, project configuration, and skill tree visualization',
    prompt: '$ cd ~/context-wiki/code/',
  },
]

/* ── helpers ──────────────────────────────────────── */

export function getContextWikiEntry(
  slug: string
): ContextWikiEntry | undefined {
  return CONTEXT_WIKI_ENTRIES.find((e) => e.id === slug)
}

/* ── wiki entries ─────────────────────────────────── */

export const CONTEXT_WIKI_ENTRIES: ContextWikiEntry[] = [
  /* ================================================================== */
  /*  FOUNDATIONS                                                        */
  /* ================================================================== */

  {
    id: 'context-engineering',
    title: 'Context Engineering',
    subtitle:
      'The art of filling the context window with the right information',
    category: 'foundations',
    description:
      'What context engineering is, how it differs from prompt engineering, and why it changes everything about working with AI agents. The foundational concept behind the entire GTM OS.',
    keywords: [
      'context engineering',
      'context engineering claude code',
      'ai context window',
      'prompt engineering vs context engineering',
      'context engineering gtm',
      'karpathy context engineering',
    ],
    difficulty: 'intermediate',
    related: ['context-repository', 'grounding', 'taxonomy', 'claude-md'],
    sections: [
      {
        heading: 'What Context Engineering Actually Is',
        type: 'prose',
        content:
          'Andrej Karpathy called it "the art of filling the context window with just the right information for the next step." That is the best one-sentence definition I have found. Context engineering is not about writing better prompts. It is about architecting what the AI has access to before it ever sees your prompt. Same AI model plus bad context equals generic garbage. Same AI model plus rich, structured context equals output that sounds like you, knows your business, and executes your workflows without hand-holding. Most people skip this entirely. They open Claude, re-explain their whole business from scratch, and wonder why the output feels shallow. That is not an AI problem. That is a context problem.',
      },
      {
        heading: 'Context Engineering vs Prompt Engineering',
        type: 'pattern',
        content:
          'Prompt engineering is crafting the question. Context engineering is architecting what the AI knows before you ask. Think of it this way. Prompt engineering: "Write me a cold email for a VP of Sales at a SaaS company." Context engineering: loading your ICP definition, persona tiers, voice guide, messaging framework, and three examples of emails that got replies. Then asking "write the cold email." The prompt is one sentence. The context is everything else. Most people focus on the prompt and ignore the context. That is like giving a new hire perfect instructions but zero onboarding. The instructions do not help if they do not understand your business.',
      },
      {
        heading: 'How I Practice It Daily',
        type: 'pro-tip',
        content:
          "My entire GTM OS repo is a context engineering system. CLAUDE.md loads environment defaults. Skills load workflow instructions. Rules load file-specific patterns. Partner folders load ICP, personas, and messaging for each client. When I type /deploy, Claude already knows the git workflow, the Vercel setup, the three domains, and the build verification steps. I did not explain any of that in the prompt. It was already in the context window. That is the difference between using AI and engineering AI. If you are explaining the same things to Claude every session, you are doing the opposite of context engineering.",
      },
      {
        heading: 'The Compounding Effect',
        type: 'pattern',
        content:
          "Context engineering compounds. Every voice file you write makes future content better. Every skill you build makes future workflows faster. Every partner folder you structure makes future onboarding cleaner. You are not just building for today's session. You are building a system that gets smarter every time you use it. My repo started with a CLAUDE.md and three skills. Now it has 40+ skills, a full voice system, partner workflows, RPG progression, and automated dashboards. Each piece makes every other piece work better. That is the compounding effect of context engineering. The first month is slow. The sixth month is absurd.",
      },
    ],
  },

  {
    id: 'context-repository',
    title: 'Context Repository',
    subtitle:
      'Markdown files in a GitHub repo that give AI everything it needs',
    category: 'foundations',
    description:
      'How to build and maintain a context repository. Markdown files for products, personas, messaging, and voice that all AI systems can access. The single source of truth for your GTM motion.',
    keywords: [
      'context repository',
      'ai context repo',
      'gtm context repository',
      'markdown ai context',
      'context repo github',
      'ai knowledge base',
    ],
    difficulty: 'beginner',
    related: ['context-engineering', 'taxonomy', 'github-repos', 'claude-md'],
    sections: [
      {
        heading: 'What a Context Repository Is',
        type: 'prose',
        content:
          "A context repository is a collection of markdown files in a GitHub repo that contain everything your AI systems need to know. Products, personas, messaging frameworks, voice guides, workflow documentation, partner details. You update these files once, and every AI agent that touches your repo gets the latest version automatically. No copy-pasting context into chat windows. No re-explaining your business every session. The repo IS the context. My entire GTM OS repo is a context repository. Every skill file, every voice guide, every partner research folder. It is not a separate thing I maintain alongside the work. It is the work itself.",
      },
      {
        heading: 'The Four Stages of AI Collaboration',
        type: 'pattern',
        content:
          "Stage 1: I do, AI helps with drafting. You write the content, AI suggests edits. Most people live here.\nStage 2: AI monitors and surfaces drift. AI watches your repo for inconsistencies. Messaging changed but the email templates did not update? AI flags it.\nStage 3: AI makes changes, I approve via PR. AI proposes updates, you review and merge. This is the sweet spot. 90% efficiency with 100% control. You are not handing over the keys. You are reviewing the work.\nStage 4: AI does everything, no human review. Full autopilot. Risky for anything customer-facing. Useful for internal automation like dashboards and data syncs.\n\nI operate at Stage 3 for most workflows. Claude writes the code, the content, the campaign copy. I review it, adjust it, approve it. The context repository makes Stage 3 possible because Claude has enough context to produce work worth reviewing.",
      },
      {
        heading: 'What Goes in the Repo',
        type: 'pattern',
        content:
          "At minimum: a CLAUDE.md (environment defaults and code style), a voice guide (how you sound), product docs (what you sell), ICP definitions (who you sell to), persona tiers (who you talk to), and workflow documentation (how you operate). Beyond the minimum: partner folders with research, skills for every repeated workflow, rules files for file-specific patterns, content drafts and published archives, and campaign copy templates. The more you put in, the less you have to explain. The less you explain, the faster you move. My repo has 40+ skills, a full voice system, and research folders for every partner. Claude does not need a briefing. It reads the files.",
      },
      {
        heading: 'Why Markdown',
        type: 'pro-tip',
        content:
          "Markdown is plain text with simple formatting. It is readable by humans, parseable by AI, version-controllable in Git, and renderable as HTML. There is no proprietary format to worry about. No lock-in to a platform. No conversion step. You write it in any text editor, commit it to Git, and every AI tool can read it natively. I have seen teams try to use Notion or Google Docs as their context layer. The problem is access. AI agents cannot easily read Notion pages mid-workflow. They can read a markdown file in your repo instantly. Keep it simple. Keep it in the repo.",
      },
    ],
  },

  {
    id: 'grounding',
    title: 'Grounding',
    subtitle: 'How to stop AI from guessing and start it executing',
    category: 'foundations',
    description:
      'Grounding techniques for AI agents. Context sensitivity, assumption enumeration, and domain knowledge queries. How to prevent hallucinations and get reliable output from Claude.',
    keywords: [
      'ai grounding',
      'claude hallucination prevention',
      'ai grounding techniques',
      'context sensitivity ai',
      'stop ai hallucinating',
      'grounding claude code',
    ],
    difficulty: 'advanced',
    related: [
      'context-engineering',
      'context-repository',
      'claude-md',
      'skills',
    ],
    sections: [
      {
        heading: 'What Grounding Means',
        type: 'prose',
        content:
          "Grounding is how you stop AI from making things up. When Claude does not have enough context, it fills the gaps with plausible-sounding guesses. Sometimes those guesses are right. Often they are not. Grounding means giving the model enough real, specific information that it does not need to guess. It is the difference between \"write me a cold email\" (ungrounded, Claude invents your value prop) and \"here is my ICP, my persona tiers, my messaging framework, and three examples of emails that got replies, now write the cold email\" (grounded, Claude works from real data).",
      },
      {
        heading: 'Three Core Practices',
        type: 'pattern',
        content:
          "Context Sensitivity: Before you give Claude a task, ask yourself how hard this is and how much unique information the model needs. A simple reformatting task needs almost no context. Writing a partner onboarding workflow needs your full ICP, personas, and messaging. Match the context to the complexity.\n\nAssumption Enumeration: Make the model list what it is assuming before it executes. Ask Claude to state its assumptions explicitly. Implicit assumptions become explicit. Explicit assumptions become addressable. You catch the wrong ones before they pollute the output.\n\nDomain Knowledge Query: Give Claude the specific information it needs for the task. Do not make it guess your product positioning. Do not make it infer your ICP. Load the files. Point to the data. The model is only as good as what you put in the context window.",
      },
      {
        heading: 'How I Ground Claude',
        type: 'pro-tip',
        content:
          "I ground Claude by loading my whole repo as context. My CLAUDE.md sets the defaults. My skills define the workflows. My rules files enforce patterns per file type. My voice guide controls tone. My partner folders contain ICP, personas, and messaging for each client. Claude does not guess because everything it needs is already in the context window. When I run /partneronboard, Claude reads the partner's research folder, extracts ICP criteria, builds qualification prompts, and scaffolds the entire workflow. It does not invent criteria. It reads the file. That is grounding in practice.",
      },
      {
        heading: 'When Grounding Fails',
        type: 'anti-pattern',
        content:
          "Grounding fails when you assume the model knows things it does not. Common failures: asking Claude to write in your voice without loading the voice guide. Asking it to qualify leads without loading the ICP definition. Asking it to follow a workflow without loading the skill file. Each of these forces Claude to guess. And Claude is very good at guessing confidently, which makes the failures harder to catch. If the output looks plausible but feels off, the problem is almost always missing context. Not a bad prompt. Not a bad model. Missing context.",
      },
      {
        heading: 'The Grounding Checklist',
        type: 'formula',
        content:
          "Before giving Claude any non-trivial task, check these five boxes:\n1. Does Claude have the domain-specific data it needs? (ICP, personas, product docs)\n2. Does Claude know what voice or tone to use? (voice guide loaded)\n3. Does Claude know the output format? (examples or schema provided)\n4. Has Claude stated its assumptions? (ask it before it executes)\n5. Is the task complexity matched to the context depth? (simple task = light context, complex task = full context)\n\nIf you check all five, the output will be grounded. If you skip any, you are gambling on Claude's guesses.",
      },
    ],
  },

  {
    id: 'taxonomy',
    title: 'Taxonomy',
    subtitle: 'How you organize files IS context engineering',
    category: 'foundations',
    description:
      'Why file organization and naming conventions are foundational to context engineering. How folder structure, predictable naming, and consistent patterns make AI agents dramatically more effective.',
    keywords: [
      'ai taxonomy',
      'repo organization ai',
      'file structure context engineering',
      'naming conventions ai',
      'folder structure ai agents',
      'taxonomy context repo',
    ],
    difficulty: 'beginner',
    related: [
      'context-repository',
      'context-engineering',
      'github-repos',
      'grounding',
    ],
    sections: [
      {
        heading: 'Structure Is Context',
        type: 'prose',
        content:
          "How you organize files is context engineering. If your repo is a mess, your AI outputs will be a mess. Not because the model is confused by messy folders. Because messy folders mean the model cannot find what it needs, loads the wrong files, or skips context entirely. Predictable structure means predictable results. When every partner folder has the same subfolders (research/, prompts/, workflows/, resources/), Claude knows exactly where to look for ICP definitions, campaign copy, and qualification prompts. It does not search. It does not guess. It goes to the predictable location and reads the file.",
      },
      {
        heading: "My Repo's Taxonomy",
        type: 'pattern',
        content:
          "content/drafts/ holds work in progress. content/published/ holds shipped posts with date prefixes. partners/{name}/research/ holds ICP, personas, and competitive intel. partners/{name}/prompts/ holds Clay qualification and research prompts. partners/{name}/workflows/ holds campaign sequences and routing logic. skills/ holds every reusable workflow as a SKILL.md file. data/ holds generated assets like dashboards and progression stats. scripts/ holds Python automation.\n\nEvery folder has a purpose. Every file has a predictable name. When I tell Claude to \"check the partner research,\" it knows exactly where to look because the structure is the same for every partner. That consistency is the taxonomy.",
      },
      {
        heading: 'Naming Conventions Matter',
        type: 'pro-tip',
        content:
          "Date-prefixed drafts: 2026-02-16_topic-name.md. This sorts chronologically and tells Claude when something was written. Partner folders use lowercase slugs: partners/acme/, partners/contax/. Skill files are always SKILL.md inside a named folder: skills/deploy/SKILL.md, skills/tracker/SKILL.md. Scripts use snake_case: daily_scan.py, rpg_sprites.py.\n\nThe naming convention is not about aesthetics. It is about predictability. When Claude needs to find the deploy skill, it looks for skills/deploy/SKILL.md. Not deploy-skill.md. Not DeploySkill.md. Not deploy.skill. One pattern. Every time. Predictability eliminates search time and hallucinated file paths.",
      },
      {
        heading: 'Anti-Pattern: Flat File Dumps',
        type: 'anti-pattern',
        content:
          "The worst thing you can do is dump everything in one folder. I have seen repos with 200 files in the root directory. No subfolders. No naming convention. File names like \"final_v2_ACTUAL.md\" and \"notes_old_backup.txt\". Claude cannot make sense of that. Neither can you. If you cannot find a file in under 5 seconds by navigating the folder tree, your taxonomy is broken. Fix the structure before you add more content. A clean repo with 20 files will outperform a messy repo with 200.",
      },
    ],
  },

  /* ================================================================== */
  /*  MODES                                                              */
  /* ================================================================== */

  {
    id: 'plan-mode',
    title: 'Plan Mode',
    subtitle:
      'Read-only mode where Claude thinks before it touches anything',
    category: 'modes',
    description:
      'How to use plan mode in Claude Code and Cursor. Read-only exploration, research, and step mapping before execution. The key to complex task success.',
    keywords: [
      'claude plan mode',
      'cursor plan mode',
      'ai plan before execute',
      'claude code plan mode',
      'plan mode context engineering',
    ],
    difficulty: 'beginner',
    related: ['agent-mode', 'parallel-agents', 'model-selection', 'skills'],
    sections: [
      {
        heading: 'What Plan Mode Is',
        type: 'prose',
        content:
          "Plan mode is read-only mode. Claude explores your codebase, reads files, researches patterns, and maps out steps before touching anything. No file edits. No code changes. No commands that modify state. Just thinking. In Cursor, you can switch to plan mode to force the agent to analyze before it acts. In Claude Code, Shift+Tab toggles it. The key insight: in plan mode, Claude asks clarifying questions instead of making assumptions. That alone makes it worth using for anything complex.",
      },
      {
        heading: 'When to Use Plan Mode',
        type: 'pattern',
        content:
          "Use plan mode for anything with multiple valid approaches or significant tradeoffs. Building a new feature that touches many files. Refactoring a data model. Architecting a campaign workflow from scratch. Debugging a problem you do not fully understand yet.\n\nDo not use plan mode for simple, well-defined tasks. If you know exactly what needs to change and where, skip straight to agent mode. Renaming a variable, fixing a typo, adding a single field. Those do not need a plan.\n\nThe rule of thumb: if the task could go wrong in more than one way, plan first. If it is straightforward, execute directly.",
      },
      {
        heading: 'How I Use Plan Mode',
        type: 'pro-tip',
        content:
          "I use plan mode for anything complex. But I do not just say \"make a plan.\" I specifically instruct Claude to tell me which agents it will use, what context each agent needs, what order to run them, and which tasks can run in parallel. That is context engineering in action. You are engineering the plan that engineers the context. When I built the Clay Wiki, the plan mode output told me exactly which files each agent would create, which existing files needed edits, and confirmed that all four agents could run in parallel because they touched different files. Without that plan, I would have launched agents that stepped on each other.",
      },
      {
        heading: 'Plan Mode Output Format',
        type: 'pattern',
        content:
          "A good plan mode output includes: (1) Files to create, with full paths. (2) Files to modify, with what changes are needed. (3) Dependencies between tasks. Which must run first? Which can run in parallel? (4) Model recommendations for each task. Heavy creative work gets the default model. Copy-paste-and-adapt gets a fast model. (5) Verification steps. How do you confirm everything worked after execution?\n\nIf your plan mode output is just a numbered list of vague steps, you did not give Claude enough context. Load the relevant files, explain the architecture, and ask again. The quality of the plan depends on the context you provide. Plans are context engineering too.",
      },
    ],
  },

  {
    id: 'agent-mode',
    title: 'Agent Mode',
    subtitle: 'The execution mode where Claude reads, writes, and builds',
    category: 'modes',
    description:
      'How agent mode works in Claude Code and Cursor. The default execution mode where AI reads files, writes code, runs commands, and builds features. How to get the most out of it.',
    keywords: [
      'claude agent mode',
      'cursor agent mode',
      'ai agent execution',
      'claude code agent',
      'agent mode context engineering',
    ],
    difficulty: 'beginner',
    related: ['plan-mode', 'parallel-agents', 'skills', 'model-selection'],
    sections: [
      {
        heading: 'What Agent Mode Is',
        type: 'prose',
        content:
          "Agent mode is the default execution mode. Claude reads files, writes code, runs terminal commands, creates new files, modifies existing ones, and builds features end to end. It is the mode where work actually gets done. Joe Rhew described it as a \"teammate that needs onboarding.\" That is the right mental model. You would not throw a new hire into your GTM motion without context about your product, personas, and messaging. Same goes for agents. The quality of agent mode output depends entirely on the context you provide before execution starts.",
      },
      {
        heading: 'The Onboarding Mental Model',
        type: 'pattern',
        content:
          "Think of every agent mode session as onboarding a new teammate. What do they need to know? Your product (what you sell and to whom). Your voice (how you communicate). Your workflows (how things get done). Your constraints (what to avoid, what formats to follow). If you skip the onboarding, the agent will make assumptions. Some will be right. Many will not. And the worst part is that agent mode assumptions look confident. The output reads well. It just does not match your reality. Front-load the context. Let the agent execute from a position of knowledge, not guesswork.",
      },
      {
        heading: 'Agent Mode Depends on What Came Before',
        type: 'pro-tip',
        content:
          "If you skipped plan mode on something complex, agent mode will charge ahead and make assumptions. It will pick an approach without evaluating alternatives. It will create files without checking if similar ones exist. It will write code that works but does not match your architecture. If you planned first, agent mode executes clean. It follows the plan. It creates the right files in the right locations. It uses the patterns you already established. The planning is not wasted time. It is the context that makes agent mode effective.",
      },
      {
        heading: 'Common Mistakes in Agent Mode',
        type: 'anti-pattern',
        content:
          "Giving vague instructions and expecting specific output. \"Make the site look better\" is not actionable. \"Change the hero section background to dark, increase heading font size to 3rem, and add 2rem padding\" is actionable.\n\nNot loading relevant files before asking for changes. If you want Claude to match your existing code patterns, make sure it has read the existing code first.\n\nLetting agent mode run too long without checking output. Review after each major step. Course-correct early. A small misunderstanding in step 1 compounds into a big mess by step 10.",
      },
    ],
  },

  {
    id: 'parallel-agents',
    title: 'Parallel Agents',
    subtitle:
      'Run multiple AI agents at the same time on independent tasks',
    category: 'modes',
    description:
      'How to run parallel AI agents for maximum speed. Identifying independent tasks, launching concurrent agents, and avoiding conflicts. The pattern that turns 45-minute builds into 10-minute builds.',
    keywords: [
      'parallel agents ai',
      'concurrent ai agents',
      'parallel agents claude',
      'multi agent ai',
      'parallel execution ai',
      'parallel agents context engineering',
    ],
    difficulty: 'intermediate',
    related: ['plan-mode', 'agent-mode', 'skills', 'model-selection'],
    sections: [
      {
        heading: 'What Parallel Agents Are',
        type: 'prose',
        content:
          "Parallel agents means running multiple AI agents at the same time on different tasks. Not sequentially. Not one after another. All at once. The key word is independent. If Agent A needs the output of Agent B, they cannot run in parallel. If they touch different files, different data, different concerns, launch them all at once. This is the single biggest speed multiplier in AI-assisted development. A task that takes 45 minutes sequentially can finish in under 10 minutes with parallel agents.",
      },
      {
        heading: 'The Independence Test',
        type: 'pattern',
        content:
          "Before launching parallel agents, check three things for each pair of tasks:\n\n1. Do they write to the same files? If yes, they cannot run in parallel. File conflicts will corrupt output.\n2. Does one need the output of the other? If yes, they must run sequentially. The dependent task runs after the first completes.\n3. Do they import from something that does not exist yet? This is trickier. If Agent A creates a data file and Agent B imports from it, they seem dependent. But if Agent B is copying a known pattern (like mirroring an existing wiki page), it can run in parallel because the import structure is predictable even before the file exists.\n\nIf all three checks pass, launch them in parallel. If any fail, sequence them.",
      },
      {
        heading: 'How I Built the Clay Wiki in Parallel',
        type: 'pro-tip',
        content:
          "When I built the Clay Wiki, I ran 5 parallel agents. Agent 1 wrote the data file (the heavy lift, all the content). Agent 2 built the hub page (list of all entries). Agent 3 built the entry page (individual wiki articles). Agent 4 updated exports, navigation, and cross-links. Agent 5 verified the build. They all worked on different files. None of them needed to wait for another. Agents 2 and 3 imported from the data file that Agent 1 was creating, but they mirrored a known pattern (the existing knowledge pages) so the import structure was predictable. That cut a 45-minute sequential task to under 10 minutes. Five agents, five files, one build.",
      },
      {
        heading: 'Model Selection for Parallel Agents',
        type: 'pattern',
        content:
          "Not every parallel agent needs the same model. The orchestration agent (the one that launched the others) should use the default model for coordination and complex reasoning. Sub-agents doing straightforward copy-paste-and-adapt work can use fast models. Sub-agents doing the heavy creative lift (writing 17 wiki entries, for example) should use the default or more capable model.\n\nThe formula: complexity of the individual task determines the model. Parallelism determines the speed. Combine fast models on simple tasks with capable models on hard tasks, and you get both speed and quality.",
      },
      {
        heading: 'Anti-Pattern: Parallelizing Everything',
        type: 'anti-pattern',
        content:
          "Not everything should run in parallel. If you launch 5 agents and 3 of them need to modify the same file, you get merge conflicts and corrupted output. If you launch an agent to build a page before the data file exists and the agent cannot predict the structure, it will hallucinate the imports and fail at build time.\n\nParallel agents work when tasks are truly independent. When they are not, sequencing is not slow. It is correct. The speed gain from parallelism is real, but only when the independence test passes. Forcing parallelism on dependent tasks creates more work, not less.",
      },
      {
        heading: 'The Parallel Agent Checklist',
        type: 'formula',
        content:
          "1. Plan first. Use plan mode to identify all tasks and their dependencies.\n2. Group independent tasks. These are your parallel candidates.\n3. Sequence dependent tasks. These run after their dependencies complete.\n4. Assign models. Fast model for simple tasks, default model for complex tasks.\n5. Give each agent specific context. Do not assume they share context with each other. Each agent gets its own instructions and file references.\n6. Verify after all agents complete. Run the build. Check the output. Parallel agents can each succeed individually but fail collectively if the plan was wrong.",
      },
    ],
  },

  {
    id: 'skills',
    title: 'Skills',
    subtitle:
      'Markdown files that teach AI agents how to execute your workflows',
    category: 'modes',
    description:
      'How to build and maintain AI agent skills. Reusable markdown workflows that Claude follows every time. The cast iron skillet pattern for continuous improvement.',
    keywords: [
      'ai agent skills',
      'claude skills',
      'cursor skills',
      'reusable ai workflows',
      'skill files ai',
      'skills context engineering',
    ],
    difficulty: 'intermediate',
    related: [
      'context-engineering',
      'claude-md',
      'plan-mode',
      'agent-mode',
    ],
    sections: [
      {
        heading: 'What a Skill Is',
        type: 'prose',
        content:
          "A skill is a markdown file that captures HOW you do something. Write it once in plain English. Claude follows it every time. The /deploy skill knows how to stage, commit, push, and verify deploys across three websites. The /finalcopy skill knows your voice guide, platform rules, and anti-slop filters. The /tracker skill knows how to scan git commits, count content pieces, calculate output scores, and generate a dashboard image. Skills are portable knowledge. They turn tribal knowledge into executable automation.",
      },
      {
        heading: 'The Cast Iron Skillet Pattern',
        type: 'pattern',
        content:
          "Joe Rhew nailed this analogy. A skill is like a cast iron skillet. You are not doing anything special. You are just cooking. But every time you use the skillet, it gets more seasoned. A skill you have refined 20 times is dramatically better than the one you wrote on day one. And you never set aside time to improve it. You just use it, notice an edge case, fix the edge case, and the skill gets better.\n\nMy /deploy skill started as 10 lines: stage, commit, push. Now it handles commit message generation, build verification across three sites, error recovery, and post-deploy confirmation. I never scheduled time to improve it. I just deployed 50 times and fixed what broke.",
      },
      {
        heading: 'SOPs Are Dead',
        type: 'pro-tip',
        content:
          "Standard Operating Procedures were written for humans to follow step by step. They go stale. People skip steps. Nobody updates them. Skills replace SOPs entirely. Instead of writing a document that a human reads and follows (with errors), you write a skill that an agent executes (without errors). The skill is the SOP, the executor, and the quality check all in one file.\n\nI have 40+ skills in my repo. /deploy, /tracker, /finalcopy, /substackpost, /partneronboard, /webreveal, /heyreach-export, /linkedin-recon, /daily-tracker. Every workflow I repeat more than twice becomes a skill. Every skill I use more than five times gets refined. The result is a library of automation that runs my entire GTM operation.",
      },
      {
        heading: 'Anatomy of a Good Skill File',
        type: 'pattern',
        content:
          "A SKILL.md file needs five things:\n\n1. Trigger description. What activates this skill? Slash commands, keywords, phrases.\n2. Context requirements. What files, data, or state does the agent need before executing? List them explicitly.\n3. Step-by-step instructions. Written in plain English. Numbered steps. Clear enough that a new agent with no prior conversation context can follow them.\n4. Output expectations. What does success look like? A deployed site? A generated file? A posted draft?\n5. Edge case handling. What could go wrong? Port conflicts, build failures, missing data. How should the agent recover?\n\nIf your skill file is missing any of these, the agent will improvise. And improvisation is where things break.",
      },
      {
        heading: 'Anti-Pattern: Skills That Are Too Vague',
        type: 'anti-pattern',
        content:
          "A skill file that says \"deploy the website\" is not a skill. It is a wish. A real skill says: check for unstaged changes, stage all modified files, generate a commit message from the diff, commit with that message, push to origin main, wait for the Vercel build to complete, check all three deployment URLs, confirm 200 status codes, and report results. Vague skills produce inconsistent results. Specific skills produce reliable results. Write the skill as if you are onboarding a contractor who has never seen your codebase. Because that is exactly what every new agent session is.",
      },
    ],
  },

  {
    id: 'model-selection',
    title: 'Model Selection',
    subtitle: 'Choosing the right AI model for the task and the budget',
    category: 'modes',
    description:
      'How to choose between AI models based on task complexity and cost. When to use fast models vs capable models. How to optimize spend without sacrificing quality.',
    keywords: [
      'ai model selection',
      'claude model selection',
      'opus vs sonnet',
      'ai model cost optimization',
      'model selection context engineering',
      'choose ai model',
    ],
    difficulty: 'beginner',
    related: ['parallel-agents', 'plan-mode', 'agent-mode', 'skills'],
    sections: [
      {
        heading: 'Why Model Selection Matters',
        type: 'prose',
        content:
          "Not all AI models are the same. Some are faster and cheaper. Some are smarter and more expensive. Using the wrong model for the task wastes money or produces bad output. A capable model on a simple reformatting task is like hiring a senior architect to paint a wall. A fast model on a complex architecture task is like hiring a junior intern to design the building. Match the model to the task. That is the entire strategy.",
      },
      {
        heading: 'The Model Matching Framework',
        type: 'pattern',
        content:
          "Fast models (Sonnet tier) work for: reformatting content, scanning files for patterns, simple code edits, copy-paste-and-adapt tasks, and straightforward data transformations. These tasks have clear inputs, clear outputs, and low ambiguity.\n\nCapable models (Opus tier) work for: architecture decisions, complex debugging, deep research synthesis, creative content with nuanced voice requirements, and multi-step reasoning where each step depends on the previous one. These tasks have ambiguity, tradeoffs, and require judgment.\n\nThe daily tracker logs my model usage so I can see where I am overspending. If I see Opus sessions on tasks that Sonnet could handle, I adjust. If I see Sonnet sessions that produced garbage, I know I needed a more capable model.",
      },
      {
        heading: 'Model Selection for Parallel Sub-Agents',
        type: 'pro-tip',
        content:
          "When I launch parallel agents, I assign models per task. The orchestrating agent (the one coordinating everything) uses the default capable model because it needs to reason about dependencies and context. Sub-agents doing straightforward work (build a page that mirrors an existing one, update a config file, run a build check) use fast models. Sub-agents doing the heavy creative lift (writing 17 wiki entries in my voice, architecting a new feature) use the capable model.\n\nThis is not about being cheap. It is about being efficient. A fast model that completes in 30 seconds on a simple task is better than a capable model that takes 2 minutes on the same task. Speed matters when you have 5 agents running in parallel.",
      },
      {
        heading: 'Track Your Spend',
        type: 'formula',
        content:
          "Capable model sessions cost roughly 3-5x more than fast model sessions. Over a full day of building, that difference compounds. The daily tracker calculates my model usage and flags outliers. The formula is simple: for each task, ask two questions. (1) Does this task require reasoning or judgment? If yes, use the capable model. (2) Is this task mechanical or pattern-based? If yes, use the fast model. If you are unsure, start with the fast model. If the output is bad, escalate to capable. Better to try cheap and upgrade than to default to expensive on everything.",
      },
    ],
  },

  /* ================================================================== */
  /*  INFRASTRUCTURE                                                     */
  /* ================================================================== */

  {
    id: 'git-for-gtm',
    title: 'Git for GTM Engineers',
    subtitle: 'Version control as packing, labeling, and shipping boxes',
    category: 'infrastructure',
    description:
      'Git fundamentals for GTM engineers. Staging, committing, pushing, and reverting explained through practical analogies. Why version control matters for context engineering.',
    keywords: [
      'git for gtm',
      'git basics non-developers',
      'git staging committing pushing',
      'version control gtm',
      'git context engineering',
    ],
    difficulty: 'beginner',
    related: ['github-repos', 'deployments-vercel', 'monorepos', 'taxonomy'],
    sections: [
      {
        heading: 'The Box Analogy',
        type: 'prose',
        content:
          "Think of Git like packing and shipping boxes. git add is putting items in the box. You pick which files go in this shipment. git commit is sealing the box and writing a label that describes what is inside. git push is shipping the sealed box to the warehouse (GitHub). Until you push, nobody else can see your work and your code is not backed up. It is just sitting on your local machine in sealed boxes.\n\nI did not understand Git until I needed to revert a broken homepage. I changed something, refreshed the page, and the entire layout was gone. Then I realized I could undo the commit and go back to when it worked. That is when it clicked. Git is not just tracking changes. It is letting you time travel.",
      },
      {
        heading: 'Why Staging Matters',
        type: 'pattern',
        content:
          "Staging lets you control what goes into each commit. If you update your persona doc and that triggers changes to campaign angles and pain points, you want all of those in the same box. That way you can roll back the whole thing if your hypothesis was wrong.\n\nBad practice: committing everything at once with a message like \"updates\". You cannot isolate what changed or why.\n\nGood practice: staging related changes together with a descriptive message. \"Update acme persona tiers and adjust campaign angles for tier 2\" tells you exactly what happened and why. When something breaks, you know which box to open.",
      },
      {
        heading: 'The Three Commands You Need',
        type: 'code',
        content:
          "git add . (stage all changed files for the next commit)\ngit commit -m \"your message here\" (seal the box with a label)\ngit push origin main (ship to GitHub)\n\nThat is it. Three commands cover 90% of daily Git usage. The /deploy skill runs all three automatically, plus build verification and deploy confirmation. You do not need to memorize Git. You need to understand the concept and let the skill handle the execution.",
      },
      {
        heading: 'Time Travel with Revert',
        type: 'pro-tip',
        content:
          "Every commit is a save point. If you break something, you can go back. git log shows your history. git revert undoes a specific commit without erasing history. git checkout lets you look at old versions of files. This is why commit messages matter. When you are scrolling through git log trying to find where things broke, \"fix stuff\" tells you nothing. \"Add hero section animation\" tells you exactly which commit introduced the change. Good messages are not for Git. They are for future you at 11 PM trying to figure out what went wrong.",
      },
    ],
  },

  {
    id: 'github-repos',
    title: 'GitHub Repos',
    subtitle:
      'Cloud backup and collaboration for your code and context',
    category: 'infrastructure',
    description:
      'GitHub repository fundamentals for GTM engineers. Cloud storage, collaboration, public vs private repos, and .gitignore. Why GitHub is the backbone of a context engineering system.',
    keywords: [
      'github repos gtm',
      'github basics',
      'github private repos',
      'gitignore secrets',
      'github context engineering',
      'github cloud backup code',
    ],
    difficulty: 'beginner',
    related: [
      'git-for-gtm',
      'deployments-vercel',
      'context-repository',
      'monorepos',
    ],
    sections: [
      {
        heading: 'What GitHub Does',
        type: 'prose',
        content:
          "GitHub stores your Git repo in the cloud. That is the core function. Your code is not backed up until you push to GitHub. Your team cannot see your work until you push. Automated deployments do not trigger until you push. GitHub is the warehouse where your sealed boxes (commits) live.\n\nYou can pick up your work from any machine. Clone the repo, and you have the entire history, every file, every commit. If my laptop dies tomorrow, I clone the repo on a new machine and I am back in 5 minutes. That is not paranoia. That is infrastructure.",
      },
      {
        heading: 'Public vs Private',
        type: 'pattern',
        content:
          "Public repos are visible to everyone on the internet. Anyone can read your code, clone it, and learn from it. Good for open source projects, portfolios, and educational content.\n\nPrivate repos are locked down. Only people you invite can see them. Good for client work, proprietary code, and anything with sensitive data.\n\nMy GTM OS repo is on GitHub. Every skill, every voice file, every partner workflow. It is the single source of truth. I keep it private because it contains partner-specific research and campaign strategies. But the website code deploys from it publicly. The repo is private. The deployed sites are public. GitHub and Vercel handle that separation automatically.",
      },
      {
        heading: 'Keeping Secrets Out',
        type: 'pro-tip',
        content:
          ".gitignore is a file that tells Git what to ignore. Add .env to your .gitignore and Git will never track your environment variables. Add node_modules/ and Git skips your dependency folder (which can be thousands of files). This is critical for security. API keys, database passwords, MCP tokens. These cannot live in your repo. If your .env file gets committed to a public repo, those keys are exposed to the entire internet. Bots scan GitHub constantly for leaked credentials.\n\nThe rule: if it is a secret, it goes in .env. If it is in .env, it goes in .gitignore. No exceptions.",
      },
      {
        heading: 'GitHub as Context Infrastructure',
        type: 'pattern',
        content:
          "GitHub is not just storage. It is the backbone of your context engineering system. Your context repository lives on GitHub. Your CI/CD pipeline triggers from GitHub pushes. Your deployment previews generate from GitHub branches. Your commit history documents what you built and when.\n\nWhen I run the daily tracker, it scans git commits to count what I shipped. When I run /deploy, it pushes to GitHub and Vercel auto-deploys. When I onboard a new partner, the research goes into a GitHub folder that every future agent session can access. GitHub is the infrastructure that makes context persistent across sessions, machines, and agents.",
      },
    ],
  },

  {
    id: 'deployments-vercel',
    title: 'Deployments and Vercel',
    subtitle:
      'Push to GitHub, Vercel builds, your site goes live. Under a minute.',
    category: 'infrastructure',
    description:
      'How Vercel deployments work for GTM engineers. Git-triggered builds, preview URLs, environment variables, and the /deploy skill. Three websites from one push.',
    keywords: [
      'vercel deployment',
      'vercel gtm',
      'deploy next.js vercel',
      'vercel preview urls',
      'vercel environment variables',
      'deploy context engineering',
    ],
    difficulty: 'intermediate',
    related: [
      'git-for-gtm',
      'github-repos',
      'monorepos',
      'cron-jobs',
    ],
    sections: [
      {
        heading: 'How Deployment Works',
        type: 'prose',
        content:
          "Deployment is making your local code changes live on the internet. Push to GitHub. Vercel picks it up. Builds the site. Deploys it. Done. The first time I pushed to main and saw Vercel build my site in 45 seconds, it felt like skipping straight to the good part. No FTP uploads. No manual file transfers. Just push the code and it is live. Three websites (shawnos.ai, thegtmos.ai, thecontentos.ai) all deploy from one push. That is not magic. That is just how modern deployment works.",
      },
      {
        heading: 'Preview URLs',
        type: 'pattern',
        content:
          "Every branch gets its own preview URL. Push a feature branch to GitHub and Vercel generates a unique URL where you can see your changes before they go live. This is huge for testing. You can share the preview URL with a collaborator, check it on your phone, or just verify that your changes look right before merging to main.\n\nThe workflow: create a branch, make changes, push the branch, check the preview URL, fix issues if needed, merge to main when it looks good, main auto-deploys to production. You never deploy broken code to production because you caught it in preview first.",
      },
      {
        heading: 'Environment Variables',
        type: 'pattern',
        content:
          "Secrets live on Vercel, not in your code. API keys, database URLs, MCP tokens. You add them in the Vercel dashboard for each project. Your deployed site accesses them through process.env. They never appear in your repo, never get committed to Git, never show up in build logs.\n\nLocally, you create a .env file with the same variables. Add .env to .gitignore so it never gets committed. Vercel has its own copy for production. This separation means you can have different values for local development and production without any conflicts.",
      },
      {
        heading: 'The /deploy Skill',
        type: 'pro-tip',
        content:
          "I built the /deploy skill so I never have to remember the deployment steps. It stages all changed files. Generates a commit message from the diff. Commits. Pushes to GitHub. Waits for Vercel to start the build. Monitors build progress. Confirms all three sites are live with 200 status codes. Reports results. I type /deploy. Everything else happens automatically. Three websites from one push. Under a minute.\n\nThis is the skill pattern applied to infrastructure. I could run the commands manually. But why? The skill is faster, more consistent, and catches errors I would miss. It also logs the deployment for the daily tracker.",
      },
      {
        heading: 'When Deploys Fail',
        type: 'anti-pattern',
        content:
          "Deploys fail for three common reasons. Build errors: TypeScript complaints, missing imports, broken dependencies. Fix the error locally, push again. Environment variable issues: a variable exists locally but not on Vercel. Check the Vercel dashboard and add the missing variable. Dependency conflicts: your lock file is out of sync with your package.json. Delete node_modules, reinstall, push the updated lock file.\n\nThe /deploy skill checks build status and reports failures with the relevant error. But if you skip the skill and push manually, check the Vercel dashboard for build logs. The error is always in the logs. Read them before guessing.",
      },
    ],
  },

  {
    id: 'monorepos',
    title: 'Monorepos',
    subtitle:
      'One repo, multiple projects, shared code, one push deploys all',
    category: 'infrastructure',
    description:
      'How monorepos work for GTM engineers. Turborepo, shared packages, multi-site architecture, and why one repo beats three separate repos. The architecture behind three websites from one push.',
    keywords: [
      'monorepo gtm',
      'turborepo',
      'monorepo shared code',
      'monorepo multiple websites',
      'monorepo context engineering',
      'monorepo vercel',
    ],
    difficulty: 'intermediate',
    related: [
      'deployments-vercel',
      'github-repos',
      'git-for-gtm',
      'taxonomy',
    ],
    sections: [
      {
        heading: 'Why a Monorepo',
        type: 'prose',
        content:
          "I was planning one website. Then the agent and I scoped the architecture and realized one site could not hold everything. Three audiences, three domains. shawnos.ai for my personal brand. thegtmos.ai for GTM engineers. thecontentos.ai for content creators. But I did not want three separate repos with three sets of dependencies, three deployment pipelines, and three copies of the same design system. So we built a monorepo. One repo that holds all three sites with shared code between them. One push deploys all three. One design system. One source of truth.",
      },
      {
        heading: 'How the Architecture Works',
        type: 'pattern',
        content:
          "Turborepo manages the orchestration. It knows which projects depend on which packages and builds them in the right order.\n\napps/shawnos/ is the shawnos.ai site.\napps/gtmos/ is the thegtmos.ai site.\napps/contentos/ is the thecontentos.ai site.\npackages/shared/ holds components, styles, data files, and utilities that all three sites use.\n\nWhen I update a shared component, all three sites get the update. When I add a new data file (like this wiki), I put it in packages/shared/data/ and any site can import it. The shared package is the bridge. Sites import from it. They never duplicate code.",
      },
      {
        heading: 'Benefits Over Separate Repos',
        type: 'pro-tip',
        content:
          "One commit can update all three sites. If I fix a bug in the shared navigation component, all three sites get the fix in one push. No syncing across repos.\n\nShared types and data. The wiki data files, the RPG progression system, the voice components. All live in packages/shared/. Write once, use everywhere.\n\nConsistent dependencies. All three sites use the same version of Next.js, React, and every other package. No drift between repos.\n\nOne deployment pipeline. Push to main, Vercel builds all three, all three go live. The /deploy skill handles one repo, not three.",
      },
      {
        heading: 'The Cost of a Monorepo',
        type: 'anti-pattern',
        content:
          "Monorepos are not free. Build times are longer because Turborepo builds multiple projects. The initial setup is more complex than a single-site repo. Package imports need to be configured correctly (exports in package.json, TypeScript path resolution). And if you break the shared package, you break all three sites at once.\n\nThe tradeoff is worth it if you have shared code between projects. If your projects are truly independent with no shared components or data, separate repos are simpler. My three sites share a design system, data files, components, and utilities. The monorepo saves me hours every week. If they shared nothing, I would use three repos.",
      },
    ],
  },

  {
    id: 'cron-jobs',
    title: 'Cron Jobs',
    subtitle: 'Scheduled automation that runs while you sleep',
    category: 'infrastructure',
    description:
      'How cron jobs work for GTM engineers. Scheduled tasks, cron syntax, and real examples. Daily tracker, auto-deploys, content refresh, and the pattern of automating recurring work.',
    keywords: [
      'cron jobs gtm',
      'cron schedule automation',
      'cron syntax explained',
      'scheduled tasks ai',
      'cron jobs context engineering',
      'automated deploys cron',
    ],
    difficulty: 'intermediate',
    related: [
      'deployments-vercel',
      'python-for-gtm',
      'github-repos',
      'skills',
    ],
    sections: [
      {
        heading: 'What Cron Jobs Are',
        type: 'prose',
        content:
          "Cron jobs are scheduled tasks that run automatically at specific times. Set it once, forget it. You define a schedule and a command. The system executes it on that schedule without any manual intervention. No alarms. No reminders. No \"I forgot to run the tracker.\" The system handles it. The pattern is simple: automate the thing you keep forgetting to do manually.",
      },
      {
        heading: 'Cron Syntax Decoded',
        type: 'code',
        content:
          "Cron syntax looks cryptic but follows a simple pattern. Five fields: minute, hour, day-of-month, month, day-of-week.\n\n0 20 * * * means \"run at 8:00 PM every day.\"\n0 9 * * 1 means \"run at 9:00 AM every Monday.\"\n*/30 * * * * means \"run every 30 minutes.\"\n0 0 1 * * means \"run at midnight on the 1st of every month.\"\n\nThe asterisk means \"every.\" The number means \"at this value.\" The slash means \"every N intervals.\" Once you read a few, the pattern clicks. You do not need to memorize it. You need to know enough to read existing cron schedules and ask Claude to write new ones.",
      },
      {
        heading: 'My Real Cron Jobs',
        type: 'pro-tip',
        content:
          "Daily tracker runs every night at 8 PM. It scans git commits, counts content pieces, calculates output scores, generates a dashboard image, and logs everything. I never run it manually. I just check the results in the morning.\n\nWebsite content auto-updates on a schedule. Blog posts, log entries, and vitals refresh without manual deploys. New content gets committed and pushed automatically.\n\nScheduled pushes to Vercel. A cron job triggers a git push, Vercel picks it up, and the sites rebuild. Content changes go live without me touching anything.\n\nEach of these used to be a manual task I would forget. Now they just happen.",
      },
      {
        heading: 'Where Cron Jobs Live',
        type: 'pattern',
        content:
          "Cron jobs can run in multiple places. On your local machine (crontab). On a server. On Vercel (vercel.json cron configuration). On GitHub Actions (scheduled workflows).\n\nFor web-related automation, Vercel cron and GitHub Actions are the most reliable. They run even when your laptop is closed. Local crontab is fine for development and testing but not for production automation.\n\nThe Vercel approach: add a cron configuration to vercel.json, create an API route that handles the job, and Vercel triggers it on schedule. The GitHub Actions approach: create a workflow YAML with a schedule trigger, define the steps, and GitHub runs it. Both work. Vercel is simpler for web projects. GitHub Actions is more flexible for general automation.",
      },
    ],
  },

  {
    id: 'terminal-and-cli',
    title: 'Terminal and CLI',
    subtitle:
      'The black screen with text that runs everything under the hood',
    category: 'infrastructure',
    description:
      'What the terminal is, how to use it, and why it matters for non-developers doing context engineering. Homebrew, bash commands, and the recursive content pattern of learning the tool while using the tool.',
    keywords: [
      'terminal',
      'bash',
      'homebrew',
      'cli',
      'command line',
      'shell',
      'terminal commands gtm',
      'brew install',
      'mac terminal',
    ],
    difficulty: 'beginner',
    related: ['git-for-gtm', 'python-for-gtm', 'cron-jobs', 'deployments-vercel'],
    sections: [
      {
        heading: 'What the Terminal Is',
        type: 'prose',
        content:
          "The terminal is a text-based interface to your computer. No icons, no buttons, no drag and drop. You type commands, hit enter, and the computer does things. It looks intimidating. Black screen, blinking cursor, no clue what to type. I get it. I was there. But here is the thing: every skill you run, every deploy you trigger, every script you execute, every package you install runs through the terminal. It is the execution layer under everything else in this knowledge base. When you type /deploy, that skill runs git commands in the terminal. When you run the daily tracker, it executes a Python script in the terminal. When you install a tool with Homebrew, that is the terminal. You do not need to be a terminal power user. You need to understand that it exists, what it does, and how to not panic when you see it.",
      },
      {
        heading: 'Homebrew: Your First Package Manager',
        type: 'pattern',
        content:
          "Homebrew is the Mac equivalent of an app store for developer tools. Instead of downloading installers from websites, you type brew install and the tool appears. brew install git installs Git. brew install python installs Python. brew install node installs Node.js. One command, done. I learned Homebrew during my Mac Mini migration. I was setting up a new machine from scratch, and every guide said \"install Homebrew first.\" I did not know what it was. I did not know what a package manager meant. I just ran the install script, typed brew install git, and it worked. Then I installed Python. Then Node. Then everything else. That experience became content. The process of not knowing what Homebrew was, learning it by using it, and then explaining it to others. That is the recursive pattern. The learning is the content. brew install is the command. brew update refreshes the package list. brew list shows everything you have installed. brew upgrade updates your installed packages. That covers 90% of what you will ever need from Homebrew.",
      },
      {
        heading: 'Bash Commands You Will Actually Use',
        type: 'code',
        content:
          "You do not need to memorize 200 commands. You need 10 that cover 90% of terminal usage.\n\npwd prints where you are right now. Think of it as \"show me the address of this folder.\"\nls lists the files in the current folder. ls -la shows hidden files and details.\ncd changes directory. cd ~/Desktop moves to your Desktop. cd .. goes up one level.\nmkdir creates a new folder. mkdir my-project.\ncp copies a file. cp file.txt backup.txt.\nmv moves or renames a file. mv old-name.txt new-name.txt.\nrm deletes a file. rm file.txt. Be careful. There is no trash can in the terminal.\ncat shows the contents of a file. cat README.md.\nchmod changes permissions. chmod +x script.sh makes a script executable.\necho prints text. echo $PATH shows your PATH variable.\n\nPiping connects commands. ls | grep .md lists only markdown files. The pipe symbol (|) sends the output of one command into another. This is how you chain small tools into powerful workflows.",
      },
      {
        heading: 'How Terminal Connects to Everything Else',
        type: 'pro-tip',
        content:
          "The terminal is where everything in this knowledge base actually executes. git push runs in the terminal. python daily_scan.py runs in the terminal. npm run dev starts your dev server in the terminal. brew install adds tools through the terminal. vercel deploy triggers from the terminal. Every other knowledge base entry depends on the terminal existing. Git is a terminal tool. Python scripts run in the terminal. Cron jobs execute terminal commands on a schedule. Deployments push through terminal commands. Understanding the terminal is not a separate skill. It is the foundation that every other skill stands on. You do not need to master it. You need to know it is there and not be afraid of it.",
      },
      {
        heading: 'The Recursive Content Pattern',
        type: 'pattern',
        content:
          "Here is the meta point. I migrated to a Mac Mini. I had to install Homebrew. I did not know what Homebrew was. I installed it anyway because every setup guide said to. I learned what a package manager is by using one. Then I wrote about that experience as content. The process of learning became the content. The terminal is both the tool and the topic. This pattern repeats across everything in the GTM OS. I did not know Git when I started. I learned it by breaking things and reverting. That became the Git for GTM article. I did not know Python. I learned it by asking Claude to write scripts and reading the output. That became the Python for GTM article. The terminal is the same story. You do not wait until you are an expert to write about something. You write about it while you learn it. The learning process is the most relatable content because your audience is going through the same thing.",
      },
    ],
  },

  /* ================================================================== */
  /*  CODE                                                               */
  /* ================================================================== */

  {
    id: 'python-for-gtm',
    title: 'Python for GTM Engineers',
    subtitle: 'The glue language for automation. Claude writes it, you run it.',
    category: 'code',
    description:
      'Python fundamentals for GTM engineers. You do not need to be a developer. You need to know enough to read scripts and tell Claude what to build. Real examples from the GTM OS.',
    keywords: [
      'python gtm engineers',
      'python automation gtm',
      'python scripts ai',
      'learn python gtm',
      'python context engineering',
      'python pillow automation',
    ],
    difficulty: 'beginner',
    related: ['mcp-servers', 'cron-jobs', 'skills', 'skill-trees', 'terminal-and-cli'],
    sections: [
      {
        heading: 'Why Python',
        type: 'prose',
        content:
          "Python is the glue language for automation. It connects things. It processes files. It generates images. It calculates stats. It runs on every operating system. And most importantly, Claude is excellent at writing it. You do not need to be a Python developer. You need to know enough to read scripts, understand what they do at a high level, and tell Claude what to build or fix. That is a different skill than writing Python from scratch. It is the difference between being a chef and being someone who can read a recipe and tell the chef what to change.",
      },
      {
        heading: 'My Real Python Scripts',
        type: 'pattern',
        content:
          "daily_scan.py scans git commits and content folders to calculate what I shipped today. It counts blog posts, drafts, published pieces, and partner deliverables. The output feeds into the daily tracker.\n\ndaily_dashboard.py takes the scan results and generates a Pillow image card with stats, grades, pipeline info, and visual formatting. It creates the dashboard card that gets posted to track progress.\n\nrpg_sprites.py generates pixel art avatars for the RPG progression system. It creates idle animations, static sprites, and tool-specific character variants. 2,900 lines of Python that Claude wrote entirely from my descriptions.\n\nbatch_rename.py processes files in bulk. Renaming, moving, reformatting. Anything that touches more than 10 files at once gets a script instead of manual work.",
      },
      {
        heading: 'The Pattern: Describe, Build, Test, Fix',
        type: 'pro-tip',
        content:
          "Every Python script I use was built by Claude. The pattern is always the same. I describe what I want in plain English. Claude writes the code. I run it. If it works, done. If it breaks, I paste the error back to Claude and say \"this broke, here is the error.\" Claude fixes it. I run it again. The script gets better with each iteration.\n\nThis is the skill pattern applied to code. You do not need to debug Python yourself. You need to recognize when output is wrong and communicate what went wrong. Claude handles the actual programming. You handle the intent and the verification.",
      },
      {
        heading: 'Common Python Patterns in GTM',
        type: 'pattern',
        content:
          "File processing: reading CSVs, parsing markdown, scanning directories. Every data pipeline starts with reading files.\n\nImage generation with Pillow: creating dashboard cards, branded images, social media assets. Pillow turns data into visuals without Photoshop.\n\nAPI calls with requests: hitting external APIs for data enrichment, posting to webhooks, pulling campaign stats.\n\nJSON manipulation: reading config files, transforming data structures, generating structured output for other tools.\n\nThese four patterns cover 90% of the Python I use. If you understand what each does at a high level, you can direct Claude to build anything in the GTM automation space.",
      },
    ],
  },

  {
    id: 'mcp-servers',
    title: 'MCP Servers',
    subtitle:
      'The bridge between your AI agent and your production tools',
    category: 'code',
    description:
      'Model Context Protocol servers explained. How to give AI agents access to Slack, HeyReach, Substack, Vercel, and other production tools. The hands that let Claude interact with the real world.',
    keywords: [
      'mcp servers',
      'model context protocol',
      'mcp claude',
      'mcp cursor',
      'mcp slack integration',
      'mcp servers context engineering',
    ],
    difficulty: 'intermediate',
    related: [
      'claude-md',
      'skills',
      'python-for-gtm',
      'deployments-vercel',
    ],
    sections: [
      {
        heading: 'What MCP Is',
        type: 'prose',
        content:
          "Model Context Protocol is the bridge between your AI agent and your production tools. Without MCP, Claude is blind. It can read files in your repo and run terminal commands, but it cannot see Slack messages, pull campaign data from HeyReach, or push drafts to Substack. It is stuck inside the code editor. With MCP, Claude has hands. Each MCP server connects Claude to an external tool and exposes a set of actions the agent can take. Read a Slack channel. Export leads from HeyReach. Create a draft on Substack. Deploy to Vercel. MCP turns Claude from a coding assistant into an operating system.",
      },
      {
        heading: 'My MCP Setup',
        type: 'pattern',
        content:
          "Slack MCP: read channels, send messages, search message history. When I run /slacksync, Claude reads the partner Slack channel and extracts action items, decisions, and deliverables.\n\nHeyReach MCP: export leads, track connections, pull campaign stats. When I run /heyreach-export, Claude pulls accepted and unaccepted connections and generates CSVs.\n\nSubstack MCP: push draft posts. When I run /finalsubstack, Claude formats the content and creates the draft directly in Substack.\n\nBrowserbase MCP: browser automation for LinkedIn recon. Claude visits LinkedIn profiles, extracts recent posts, and generates personalization hooks.\n\nVercel MCP: deploy, check build logs, monitor deployments. The /deploy skill uses this to confirm sites are live after pushing.",
      },
      {
        heading: 'How to Install MCP Servers',
        type: 'code',
        content:
          "MCP servers are configured in your Cursor settings or Claude Code config. Each server needs: a name (how the agent references it), a command to start the server (usually npx or node), and any authentication tokens (API keys, OAuth tokens).\n\nThe server starts when you launch a session. It runs in the background. The agent sees the server's tools as available actions in its tool list. You do not call MCP directly. You use skills or prompts that trigger MCP actions. The agent handles the actual API calls.\n\nInstallation is usually one config block plus an API key. The /addmcp skill automates this for common servers. You type /addmcp slack and it researches the server, adds the config, and verifies the connection.",
      },
      {
        heading: 'MCP Changes Everything',
        type: 'pro-tip',
        content:
          "Before MCP, my workflow was: open Claude, write content, copy it, switch to Substack, paste it, format it, publish. With MCP: /finalsubstack and the draft appears in Substack. Before MCP: export HeyReach data manually, download CSV, open in Sheets, filter. With MCP: /heyreach-export accepted and the CSV is generated in my repo.\n\nEvery manual step between AI output and production action is friction. MCP eliminates that friction. The agent goes from generating output to taking action in one step. That is the difference between AI as a tool and AI as an operator.",
      },
      {
        heading: 'When MCP Servers Fail',
        type: 'anti-pattern',
        content:
          "MCP servers fail for predictable reasons. Authentication expired: API tokens have TTLs. If the server suddenly stops working, check the token first. Rate limits: hitting the external API too fast. Add delays between calls or reduce batch sizes. Server not starting: the command in your config is wrong, or a dependency is missing. Check the config path and run the command manually to see the error.\n\nThe biggest anti-pattern is adding MCP servers you do not use. Each server adds startup time and context. Only install what you actively use in your workflows. Five focused MCP servers beat fifteen unused ones.",
      },
    ],
  },

  {
    id: 'claude-md',
    title: 'CLAUDE.md',
    subtitle:
      'The onboarding doc your AI teammate reads before every session',
    category: 'code',
    description:
      'How to write an effective CLAUDE.md file. The project root configuration that sets environment defaults, code style, and behavior rules for every AI session.',
    keywords: [
      'claude md file',
      'claude.md',
      'claude code configuration',
      'ai onboarding document',
      'claude md context engineering',
      'project root ai config',
    ],
    difficulty: 'beginner',
    related: [
      'context-repository',
      'skills',
      'grounding',
      'context-engineering',
    ],
    sections: [
      {
        heading: 'What CLAUDE.md Does',
        type: 'prose',
        content:
          "The CLAUDE.md file lives in your project root. It is the first thing Claude reads when it starts a session. Think of it as the onboarding doc for your AI teammate. Before Claude reads any other file, before it processes your prompt, before it looks at your code, it reads CLAUDE.md. That makes it the highest-priority context in your entire system. Whatever you put here shapes every interaction that follows.",
      },
      {
        heading: 'The Configuration Hierarchy',
        type: 'pattern',
        content:
          "There are three layers of AI configuration, and they load in order.\n\nCLAUDE.md loads first. Environment defaults, package management rules, code style preferences, language defaults. This is the foundation. It applies to every session regardless of what you are working on.\n\nSkills load when invoked. When you type /deploy, the deploy skill file loads into context. When you type /tracker, the tracker skill loads. Skills are workflow-specific. They do not load unless you trigger them.\n\nRules load when you touch matching files. If you open a blog post, the blog formatting rule loads. If you edit a component, the component pattern rule loads. Rules are file-specific. They activate based on what you are editing.\n\nThe hierarchy matters. CLAUDE.md sets the baseline. Skills add workflow context. Rules add file-specific context. Together they give Claude a complete picture without you explaining anything.",
      },
      {
        heading: 'What Goes in CLAUDE.md',
        type: 'pro-tip',
        content:
          "Keep CLAUDE.md focused on things that apply to EVERY session. Environment details: OS, shell, primary languages. Package management rules: how to install, how to handle permissions, how to verify versions. Code style defaults: TypeScript over JavaScript, formatting preferences, import conventions.\n\nDo NOT put workflow-specific instructions in CLAUDE.md. Those belong in skill files. Do NOT put file-specific patterns in CLAUDE.md. Those belong in rules files. CLAUDE.md should be short and universal. If a rule only applies sometimes, it does not belong here.\n\nMy CLAUDE.md is a few paragraphs. Environment info. Package management rules. Language defaults. That is it. Everything else lives in skills and rules where it can load on demand instead of consuming context window space every session.",
      },
      {
        heading: 'Common Mistake: Overloading CLAUDE.md',
        type: 'anti-pattern',
        content:
          "I have seen people put entire workflow documentation, coding standards, style guides, and project architecture into CLAUDE.md. The file becomes 500+ lines. The problem: Claude reads all of it every session, even when 90% is irrelevant to the current task. That wastes context window space and can actually confuse the model when instructions for different workflows contradict each other.\n\nKeep CLAUDE.md lean. Universal defaults only. Move everything else to skills (for workflows) and rules (for file patterns). This way Claude gets exactly the context it needs for the current task, not a firehose of everything you have ever documented.",
      },
    ],
  },

  {
    id: 'skill-trees',
    title: 'Skill Trees',
    subtitle:
      'RPG-style visualization of everything you have built',
    category: 'code',
    description:
      'How to build an RPG-style skill tree that maps your entire GTM OS. Scanning repos, categorizing capabilities, and making the invisible visible. Not for AI. For you.',
    keywords: [
      'skill tree ai',
      'rpg skill tree gtm',
      'skill tree visualization',
      'ai capabilities map',
      'skill tree context engineering',
      'gamification gtm',
    ],
    difficulty: 'advanced',
    related: ['python-for-gtm', 'skills', 'context-repository', 'taxonomy'],
    sections: [
      {
        heading: 'Why Build a Skill Tree',
        type: 'prose',
        content:
          "I built a skill tree that scans my entire repo. Content pieces, GTM operations, voice system, agent skills, infrastructure. It maps everything to an RPG progression tree. Not because it is useful for AI. Because it is useful for me. Seeing your capabilities mapped out as a tree shows you where you are strong and where you have gaps. It also makes the whole system tangible. You can show someone your skill tree and they immediately understand the scope of what you have built. It turns an abstract repo of markdown files into a visual inventory of capabilities.",
      },
      {
        heading: 'How the Scan Works',
        type: 'pattern',
        content:
          "The /skilltree skill scans the repo and categorizes everything it finds. Content is counted by type: blog posts, LinkedIn drafts, X posts, Substack articles. GTM operations are counted by workflow: partner onboards, campaign launches, web reveal setups. Skills are counted and listed by category: content skills, deployment skills, partner skills, data skills. Infrastructure is assessed: monorepo structure, deployment pipeline, cron jobs, MCP integrations.\n\nEach category gets a level based on volume and depth. 0-5 pieces of content might be Level 1. 50+ pieces with multiple formats might be Level 10. The levels are not scientific. They are motivational. Seeing \"Content: Level 7\" makes you want to hit Level 8.",
      },
      {
        heading: 'Making the Invisible Visible',
        type: 'pro-tip',
        content:
          "The biggest value of a skill tree is making your progress visible to yourself. When you are building every day, it is easy to lose track of how much you have actually created. The repo grows. The skills multiply. The content stacks up. But unless you visualize it, it all feels like background noise.\n\nThe skill tree turns that noise into signal. 40+ skills. 100+ content pieces. 5 MCP integrations. 3 websites. RPG progression with animated sprites. When I look at the tree, I see the system I have built. When someone else looks at it, they see the system they could build. That is the real value. Not the data. The visibility.",
      },
    ],
  },
]
