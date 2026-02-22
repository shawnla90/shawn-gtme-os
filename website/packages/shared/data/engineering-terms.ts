/* ── types ─────────────────────────────────────────── */

export interface KnowledgeTerm {
  name: string
  definition: string
  whyItMatters: string
  howYouUseIt: string
  related: string[]
}

export interface KnowledgeCategory {
  name: string
  prompt: string
  terms: KnowledgeTerm[]
}

/* ── slug helper ──────────────────────────────────── */

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* ── data: Engineering / AI ───────────────────────── */

export const ENGINEERING_CATEGORIES: KnowledgeCategory[] = [
  {
    name: 'Version Control',
    prompt: '$ cd ~/version-control',
    terms: [
      {
        name: 'Git',
        definition:
          'Version control system that tracks changes to your code over time.',
        whyItMatters:
          "I didn't understand Git until I needed to revert a broken homepage. I'd changed something, refreshed localhost:3000, and the entire layout was gone. I panicked. Then realized I could just undo the commit and go back to when it worked. That's when it clicked. Git isn't just tracking changes. It's letting you time travel. Every commit is a save point. Every push is publishing your work.",
        howYouUseIt:
          'When I run /deploy, it stages changes, commits with a message, pushes to GitHub, and triggers Vercel. When I run the daily tracker, it scans git commits to see what I shipped. Git is the receipt for everything I build.',
        related: ['Commits', 'Branches', 'Push'],
      },
      {
        name: 'Commits',
        definition:
          'A snapshot of your files at a specific point in time with a message explaining what changed.',
        whyItMatters:
          "Commits are your paper trail. They tell the story of how you built something. Good commit messages make debugging easier. Bad commit messages make you hate yourself when you're trying to figure out what broke.",
        howYouUseIt:
          'git commit -m "add user authentication". The message should say what you did and why. Not "fix stuff" or "updates". That\'s useless.',
        related: ['Git', 'Push'],
      },
      {
        name: 'Branches',
        definition:
          'Separate versions of your code that let you work on features without breaking the main version.',
        whyItMatters:
          "Main branch is what's live. Feature branches are where you experiment. You can try things, break them, fix them, and only merge to main when they're ready.",
        howYouUseIt:
          "Create a branch for each feature. Test it. Merge it when it works. Delete the branch when you're done. Keeps main clean.",
        related: ['Merge Conflicts', 'Git'],
      },
      {
        name: 'Push',
        definition:
          'Sending your local commits to a remote server like GitHub or Vercel.',
        whyItMatters:
          "Your code isn't backed up until you push. Your team can't see it until you push. Automated deployments don't trigger until you push. Local commits are invisible.",
        howYouUseIt:
          'git push origin main. Push to main triggers auto-deploys on Vercel. Push to a feature branch creates a preview deployment.',
        related: ['Commits', 'Deploy'],
      },
      {
        name: 'Merge Conflicts',
        definition:
          "When Git can't automatically combine changes from two branches because they edited the same lines.",
        whyItMatters:
          "This is the tax you pay for collaboration. Two people edited the same file. Git doesn't know which version to keep. You have to choose manually.",
        howYouUseIt:
          "Open the file, look for the conflict markers (<<<<<<< and >>>>>>>), decide which code to keep, delete the markers, commit the resolution. It's annoying but necessary.",
        related: ['Branches', 'Git'],
      },
    ],
  },
  {
    name: 'Deployment',
    prompt: '$ cd ~/deployment',
    terms: [
      {
        name: 'Vercel',
        definition:
          'Hosting platform that deploys websites from Git repos with zero config.',
        whyItMatters:
          "The first time I pushed to main and saw Vercel build my site in 45 seconds, it felt like skipping straight to the good part. No FTP uploads, no manual file transfers \u2014 just push the code and it's live. Three websites (shawnos.ai, thegtmos.ai, thecontentos.ai) all deploy from one push. That's not magic. That's just how modern web development works.",
        howYouUseIt:
          "Every time I run /deploy, it pushes to GitHub, Vercel picks it up, builds all three sites, and they go live. I get a preview URL for every branch. If something breaks, I check the build logs. If it works, it's live in under a minute.",
        related: ['Deploy', 'Domains', 'Build Process'],
      },
      {
        name: 'Deploy',
        definition:
          'The process of making your local code changes live on the internet.',
        whyItMatters:
          "I spent the first week editing files and wondering why my changes weren't showing up on shawnos.ai. Then I realized local changes stay local until you deploy. The code on my machine and the code on the website are two different things. Deploying is the bridge.",
        howYouUseIt:
          "I built the /deploy skill so I don't have to remember the steps. It stages changes, writes a commit message, pushes to GitHub, waits for Vercel to build, and confirms all three sites are live. I type /deploy. Everything else happens automatically.",
        related: ['Vercel', 'Git', 'Push'],
      },
      {
        name: 'Build Process',
        definition:
          'The steps that transform your source code into the final website visitors see.',
        whyItMatters:
          'Next.js apps need to be compiled. TypeScript needs to convert to JavaScript. Dependencies need to be installed. The build process does all of this. If the build fails, your deploy fails.',
        howYouUseIt:
          'Locally, npm run dev builds in development mode with hot reload. On Vercel, the build happens automatically on every push. Check build logs if it fails.',
        related: ['Dependencies', 'Vercel'],
      },
      {
        name: 'Environment Variables',
        definition:
          "Secret values like API keys that you don't want in your code.",
        whyItMatters:
          "API keys, database passwords, MCP tokens. These can't live in your repo. They'd be public on GitHub. Environment variables let you reference them without exposing them.",
        howYouUseIt:
          "Create a .env file locally with API_KEY=your_key_here. Add it to .gitignore so it never gets committed. On Vercel, add the same variables in the dashboard so your deployed site can access them.",
        related: ['Environment Files'],
      },
      {
        name: 'Domains',
        definition:
          'The web address people type to visit your site.',
        whyItMatters:
          "shawnos.ai is more memorable than shawnos-abc123.vercel.app. Custom domains are how you own your presence. Vercel handles DNS, SSL certificates, and routing.",
        howYouUseIt:
          "Buy a domain from any registrar. Point the nameservers to Vercel or Cloudflare. Add the domain in Vercel's dashboard. It auto-configures HTTPS. Takes 10 minutes.",
        related: ['Vercel'],
      },
    ],
  },
  {
    name: 'AI Agents',
    prompt: '$ cd ~/ai-agents',
    terms: [
      {
        name: 'Parallel Agents',
        definition:
          'Running multiple AI agents at the same time on different tasks.',
        whyItMatters:
          'One agent generates LinkedIn drafts while another scans HeyReach campaigns. Parallel agents cut execution time in half. Sequential is one-at-a-time. Parallel is all-at-once.',
        howYouUseIt:
          'The Task tool launches agents. When you have independent tasks (scan repo + generate content + fetch API data), launch all three agents in one message. They run concurrently.',
        related: ['Agent Skills', 'Context Windows'],
      },
      {
        name: 'Agent Skills',
        definition:
          'Pre-written instructions that teach AI agents how to perform specific workflows.',
        whyItMatters:
          'Skills are portable knowledge. The /deploy skill knows how to stage, commit, push, and verify deploys. The /finalcopy skill knows your voice, platform rules, and anti-slop filters. Skills make agents consistent.',
        howYouUseIt:
          "Trigger with slash commands. /deploy runs the deploy skill. /tracker runs the daily tracker. Skills read your voice files, check your rules, follow your workflows. They're reusable automation.",
        related: ['MCP Servers', 'Parallel Agents'],
      },
      {
        name: 'MCP Servers',
        definition:
          'Model Context Protocol servers that give AI agents access to external tools and data sources.',
        whyItMatters:
          "MCP connects agents to Slack, HeyReach, Instantly, Browserbase, ClickUp, Substack. Without MCP, agents are blind to your production systems. With MCP, they can read Slack channels, pull campaign data, and push drafts to Substack.",
        howYouUseIt:
          'Install MCP servers in Cursor settings. Each server exposes tools the agent can call. Slack MCP gives search_messages and send_message. HeyReach MCP gives export_leads. The agent sees these as available actions.',
        related: ['Agent Skills'],
      },
      {
        name: 'Context Windows',
        definition:
          'The amount of text an AI model can see and remember in a single conversation.',
        whyItMatters:
          "Larger context = more files, more history, more continuity. Claude Sonnet 4.5 has 200k tokens. That's roughly 150k words. Big enough to load your entire voice system, recent conversation history, and current task context without forgetting.",
        howYouUseIt:
          "The agent auto-manages context. You don't. But knowing the limit exists helps you understand why agents sometimes lose track of earlier instructions. If you hit the limit, the agent summarizes and refreshes.",
        related: ['Model Selection', 'Parallel Agents'],
      },
      {
        name: 'Model Selection',
        definition:
          'Choosing which AI model to use based on task complexity and cost.',
        whyItMatters:
          'Opus is smarter but expensive. Sonnet is fast and cheap. For simple tasks (reformatting, scanning), use Sonnet. For complex reasoning (architecting, debugging), use Opus. Wrong model = wasted money or bad output.',
        howYouUseIt:
          "The daily tracker logs model usage. Opus sessions cost $12-15. Sonnet sessions cost $3-5. Track your spend. Optimize your model picks. Don't use Opus to count words.",
        related: ['Context Windows'],
      },
    ],
  },
  {
    name: 'Development Tools',
    prompt: '$ cd ~/dev-tools',
    terms: [
      {
        name: 'Markdown',
        definition:
          'Plain text format with simple syntax for headings, lists, links, and formatting.',
        whyItMatters:
          'All your content lives in markdown. Blog posts, drafts, voice files, workflows, skill documentation. Markdown is readable as plain text, version-controllable in Git, and renderable as HTML.',
        howYouUseIt:
          '# heading, **bold**, - list item, [link](url). Write in any text editor. Commit to Git. Render on your site. No proprietary formats. No lock-in.',
        related: ['Git'],
      },
      {
        name: 'Python Scripts',
        definition:
          'Small programs that automate tasks like scanning files, calculating scores, or generating images.',
        whyItMatters:
          'The daily tracker is a Python script. The dashboard generator is a Python script. Anytime you need to process files, calculate stats, or batch operations, Python is faster than doing it manually.',
        howYouUseIt:
          'The scripts/ folder holds all automation. daily_scan.py scans git and content folders. daily_dashboard.py generates the tracker card. Run them from the terminal or from agent skills.',
        related: ['Monorepo'],
      },
      {
        name: 'Monorepo',
        definition:
          'A single Git repo that holds multiple related projects with shared code.',
        whyItMatters:
          "I was planning one website. Then the agent and I scoped the architecture and realized one site couldn't hold everything. Three audiences, three domains. But I didn't want to manage three separate repos. So we built a monorepo. shawnos.ai, thegtmos.ai, thecontentos.ai all live in one repo. Same design system, same components, one push deploys all three.",
        howYouUseIt:
          'Turborepo manages the orchestration. packages/shared/ holds the components and styles all three sites use. apps/shawnos/, apps/gtmos/, apps/contentos/ are the individual sites. When I run /deploy, all three build and go live. One command, three websites.',
        related: ['Packages', 'Deploy'],
      },
      {
        name: 'Packages',
        definition:
          'Reusable modules of code that other projects can import.',
        whyItMatters:
          "You don't build everything from scratch. Next.js is a package. Pillow is a package. npm install pulls packages from the internet. They're pre-built solutions to common problems.",
        howYouUseIt:
          'package.json lists your dependencies. npm install downloads them. Packages live in node_modules/. You import them into your code. They update when you run npm update.',
        related: ['Dependencies', 'Monorepo'],
      },
      {
        name: 'Dependencies',
        definition:
          'External code your project relies on to function.',
        whyItMatters:
          "Your site depends on Next.js. Your tracker depends on Pillow. If dependencies aren't installed, nothing runs. If they're outdated, things break. Dependency management is invisible until it isn't.",
        howYouUseIt:
          "npm install installs all dependencies listed in package.json. pip install Pillow installs Python dependencies. Dependencies are tracked in lock files. Don't edit those manually.",
        related: ['Packages', 'Build Process'],
      },
    ],
  },
  {
    name: 'Automation',
    prompt: '$ cd ~/automation',
    terms: [
      {
        name: 'Cron Jobs',
        definition:
          'Scheduled tasks that run automatically at specific times.',
        whyItMatters:
          "You don't manually run the tracker every night. A cron job does it. Cron is how you automate recurring work. Backups, deploys, reports, data syncs. Set it once, forget it.",
        howYouUseIt:
          'Cron syntax is cryptic but powerful. 0 20 * * * means "run at 8 PM every day". You define the schedule and the command. The system handles execution.',
        related: ['Webhooks', 'Event-Driven Workflows'],
      },
      {
        name: 'Webhooks',
        definition:
          'URLs that external services call when an event happens.',
        whyItMatters:
          'When someone replies to your Instantly campaign, the webhook fires. When a HeyReach connection accepts, the webhook fires. Webhooks turn events into triggers. Real-time automation.',
        howYouUseIt:
          'Give the external service a URL to call. When the event happens, they POST data to that URL. Your system processes it. No polling. No waiting. Instant.',
        related: ['Event-Driven Workflows', 'Cron Jobs'],
      },
      {
        name: 'Event-Driven Workflows',
        definition:
          'Automation that reacts to events instead of running on a schedule.',
        whyItMatters:
          'Cron jobs run on time. Event-driven workflows run when something happens. Push to GitHub triggers deploy. New file in content folder triggers scan. Smarter than polling.',
        howYouUseIt:
          'Vercel auto-deploys on push events. MCP servers trigger on API calls. Watchers trigger on file changes. Design systems that react instead of poll.',
        related: ['Webhooks', 'Cron Jobs'],
      },
    ],
  },
  {
    name: 'Terminal and CLI',
    prompt: '$ cd ~/terminal',
    terms: [
      {
        name: 'Terminal',
        definition:
          'A text-based interface to your computer where you type commands instead of clicking icons.',
        whyItMatters:
          'Every skill, every deploy, every script, every package install runs through the terminal. It is the execution layer under everything else. When you type /deploy, git commands run in the terminal. When you run the daily tracker, a Python script executes in the terminal. It looks intimidating but it is just typing commands and reading output.',
        howYouUseIt:
          'Open Terminal on Mac (or the integrated terminal in Cursor). Type commands. Read the output. If something errors, read the error message. Most of the time the error tells you exactly what went wrong. The terminal is where everything actually happens.',
        related: ['Bash', 'CLI Commands', 'Homebrew'],
      },
      {
        name: 'Bash',
        definition:
          'A shell language that interprets the commands you type in the terminal. Zsh is the modern Mac default and is Bash-compatible.',
        whyItMatters:
          'When you type a command in the terminal, Bash (or Zsh) is the program that interprets it and tells the computer what to do. Bash scripts automate sequences of commands. The .zshrc file configures your shell environment. Understanding that a shell exists between you and the computer explains why things like PATH and permissions work the way they do.',
        howYouUseIt:
          'Mac uses Zsh by default but Bash scripts still work. Shell scripts start with #!/bin/bash or #!/bin/zsh. You write scripts to automate repeated command sequences. Most of the time you do not write shell scripts directly. You let Claude write them.',
        related: ['Terminal', 'CLI Commands', 'PATH'],
      },
      {
        name: 'Homebrew',
        definition:
          'The Mac package manager. An app store for developer tools that runs from the terminal.',
        whyItMatters:
          'Homebrew installs Git, Python, Node, and everything else developer tools depend on. Instead of downloading installers from websites, you type brew install and the tool appears. I learned Homebrew during my Mac Mini migration. Did not know what it was. Installed it anyway. Then installed Git, Python, Node. That experience became content. The learning was the content.',
        howYouUseIt:
          'brew install git installs Git. brew install python installs Python. brew update refreshes the package list. brew list shows installed packages. brew upgrade updates everything. Five commands cover 90% of Homebrew usage.',
        related: ['Terminal', 'Dependencies', 'PATH'],
      },
      {
        name: 'CLI Commands',
        definition:
          'The core terminal commands for navigating folders and manipulating files. pwd, ls, cd, mkdir, cp, mv, rm, cat, chmod, echo.',
        whyItMatters:
          'These 10 commands cover 90% of what you need in the terminal. Navigate folders, create files, copy things, delete things, read contents. No GUI needed. Once you know these, you can move through your file system faster than clicking through Finder.',
        howYouUseIt:
          'pwd shows where you are. ls lists files. cd changes directory. mkdir creates folders. cp copies. mv moves or renames. rm deletes. cat shows file contents. chmod changes permissions. Pipe commands together with | to chain operations.',
        related: ['Terminal', 'Bash', 'Permissions'],
      },
      {
        name: 'PATH',
        definition:
          'An environment variable that tells the terminal where to find executable programs.',
        whyItMatters:
          'When you type git or python or node, the terminal searches the folders listed in PATH to find that program. If a command returns "not found" even though you installed it, the problem is almost always PATH. The terminal does not know where the program lives. Understanding PATH saves hours of debugging "command not found" errors.',
        howYouUseIt:
          'echo $PATH shows your current PATH. Each folder is separated by a colon. When you install something with Homebrew, it adds the install location to your PATH. If you get "command not found" after installing something, run hash -r to refresh the shell cache or open a new terminal session.',
        related: ['Terminal', 'Bash', 'Homebrew'],
      },
      {
        name: 'Permissions',
        definition:
          'File-level access rules that control who can read, write, or execute a file.',
        whyItMatters:
          'When you see "permission denied" in the terminal, permissions are the reason. Files have read, write, and execute flags for the owner, group, and everyone else. sudo runs a command as the administrator. chmod changes permissions. npm install errors, Homebrew ownership conflicts, script execution failures. All permissions issues.',
        howYouUseIt:
          'chmod +x script.sh makes a script executable. sudo npm install -g runs the install with admin privileges. If Homebrew gives permission errors, fix ownership with sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}. Read the error message. It usually tells you exactly which permission is missing.',
        related: ['Terminal', 'CLI Commands', 'Homebrew'],
      },
    ],
  },
  {
    name: 'Data Formats',
    prompt: '$ cd ~/data-formats',
    terms: [
      {
        name: 'JSON',
        definition:
          'JavaScript Object Notation. A text format for storing structured data.',
        whyItMatters:
          "APIs return JSON. Config files use JSON. Your daily tracker logs are JSON. It's readable by humans, parseable by machines. Key-value pairs, nested objects, arrays.",
        howYouUseIt:
          '{ "name": "value", "count": 5, "tags": ["tag1", "tag2"] }. JSON files end in .json. Parse them with JSON.parse() in JavaScript or json.load() in Python.',
        related: ['CSV', 'Configuration Files'],
      },
      {
        name: 'CSV',
        definition:
          'Comma-Separated Values. A simple spreadsheet format.',
        whyItMatters:
          'HeyReach exports CSVs. Clay imports CSVs. Instantly uploads CSVs. CSV is the universal data exchange format. Every tool supports it.',
        howYouUseIt:
          'First row is headers. Every row after is data. name,email,company. Open in Excel or Google Sheets. Import into Clay. Upload to campaigns.',
        related: ['JSON'],
      },
      {
        name: 'Environment Files',
        definition:
          'Files that store environment variables for local development.',
        whyItMatters:
          ".env files keep secrets out of Git. API keys, tokens, database URLs. They're local only. Each developer has their own. Vercel has its own set for production.",
        howYouUseIt:
          'Create .env in your project root. Add API_KEY=value. Add .env to .gitignore. Load variables with process.env.API_KEY in code.',
        related: ['Environment Variables'],
      },
      {
        name: 'Configuration Files',
        definition:
          'Files that define how tools should behave.',
        whyItMatters:
          'next.config.ts tells Next.js how to build. tsconfig.json tells TypeScript how to compile. .gitignore tells Git what to ignore. Config files control behavior without code changes.',
        howYouUseIt:
          'Read the docs for each tool. Copy starter configs. Tweak settings as needed. Commit config files to Git so everyone uses the same setup.',
        related: ['JSON', 'Environment Files'],
      },
    ],
  },
  {
    name: 'GEO & Content Engineering',
    prompt: '$ cd ~/geo-content-engineering',
    terms: [
      {
        name: 'GEO (Generative Engine Optimization)',
        definition:
          'Structuring content so AI platforms like ChatGPT, Perplexity, Google AI Overviews, and Claude cite your brand in their generated responses.',
        whyItMatters:
          "I ignored GEO for months because I thought traditional SEO was enough. Then I saw the data: AI referral traffic is up 527% year over year. 25% of organic search traffic is shifting to AI chatbots by 2026. The stat that broke my brain — 47% of AI Overview citations come from pages ranking below position 5 in traditional search. Domain Authority correlation dropped to r=0.18 for AI citations. That means a well-structured page on a small site can outperform a Fortune 500 blog. Content quality and extractability beat brand size. That changed how I build every page.",
        howYouUseIt:
          'Every page on ShawnOS follows GEO principles. Self-contained answer blocks at the top of each section. Factual density with specific numbers. Schema markup on every content type. The three sites are structured so AI engines can extract and cite any concept without needing surrounding context.',
        related: [
          'AEO (Answer Engine Optimization)',
          'Content Extractability',
          'Entity Authority',
        ],
      },
      {
        name: 'AEO (Answer Engine Optimization)',
        definition:
          'A subset of GEO focused specifically on the answer-extraction layer — making your content the source AI engines pull from when generating direct answers.',
        whyItMatters:
          "AEO is where GEO gets tactical. It's not enough to be visible to AI engines. You need to be the answer they extract. The pattern is simple: lead every section with a 40-60 word self-contained response that answers a specific question. Then add supporting evidence. AI engines are lazy in the best way — they grab the cleanest, most complete answer block they can find. If your content is structured for extraction, you win.",
        howYouUseIt:
          "Every knowledge term, how-to guide, and wiki entry on ShawnOS starts with an answer block. The definition field in engineering-terms.ts is an answer block. The first paragraph of every wiki section is an answer block. It's baked into the data structure, not bolted on after the fact.",
        related: [
          'GEO (Generative Engine Optimization)',
          'The Answer Block Pattern',
          'Content Extractability',
        ],
      },
      {
        name: 'Content Extractability',
        definition:
          'How easily an AI engine can pull a self-contained, citable passage from your content without needing surrounding context.',
        whyItMatters:
          "This is the single most actionable GEO metric. Self-contained passages of 134-167 words hit the sweet spot. Pages with semantic completeness scores above 8.5 out of 10 are 4.2x more likely to be cited by AI engines. I tested this on ShawnOS knowledge terms. The ones that read like standalone explanations get cited. The ones that depend on context from other sections don't. The fix is structural, not creative. Write passages that make sense if you rip them out of the page entirely.",
        howYouUseIt:
          'The KnowledgeTerm interface enforces extractability by design. Each term has a standalone definition, a standalone whyItMatters, and a standalone howYouUseIt. Three extractable passages per term. The wiki sections work the same way. Every heading introduces a self-contained block.',
        related: [
          'The Answer Block Pattern',
          'GEO (Generative Engine Optimization)',
          'Content Freshness Scoring',
        ],
      },
      {
        name: 'Entity Authority',
        definition:
          'How well AI engines recognize your brand as a known entity across the web — measured by mentions, citations, and contextual associations.',
        whyItMatters:
          "Domain Authority used to be the king metric for SEO. For AI citations, it barely matters — correlation dropped to r=0.18. What matters now is entity authority. Does the AI engine know who you are? Sites with 15 or more recognized entities have a 4.8x higher citation probability. Entity authority comes from being mentioned across the web in consistent contexts. Third-party articles, Reddit discussions, LinkedIn posts, guest contributions. The more places your brand appears with consistent expertise signals, the more AI engines trust you as a source.",
        howYouUseIt:
          'Three sites, one brand, consistent expertise. shawnos.ai, thegtmos.ai, and thecontentos.ai all reinforce the same entity — Shawn Tenam building GTM engineering. Cross-site linking, shared RSS feeds, consistent author schema. Every page builds entity recognition.',
        related: [
          'GEO (Generative Engine Optimization)',
          'Schema Markup for AI',
          'Topic Clusters',
        ],
      },
      {
        name: 'The Answer Block Pattern',
        definition:
          'A content structure where every section opens with a 40-60 word self-contained answer, followed by supporting evidence and detail.',
        whyItMatters:
          "This is the atomic unit of GEO content. AI engines scan for passages they can extract and cite verbatim. If your opening paragraph answers the question completely in 40-60 words, you give the AI exactly what it needs. The supporting detail that follows builds depth for human readers, but the answer block is what gets cited. I started applying this pattern across all ShawnOS content and the structure clicked immediately. It forces clarity. If you can't summarize a section in 50 words, you don't understand it well enough.",
        howYouUseIt:
          'Every definition field in engineering-terms.ts is an answer block. Every first paragraph in wiki sections is an answer block. The pattern is baked into the TypeScript data structures so contributors can\'t skip it. The template enforces the discipline.',
        related: [
          'Content Extractability',
          'AEO (Answer Engine Optimization)',
          'The Keyword Nugget Pattern',
        ],
      },
      {
        name: 'The Keyword Nugget Pattern',
        definition:
          'A content multiplication strategy where one concept becomes five or more interconnected pages: a knowledge term, a how-to guide, a blog post, a wiki entry, a framework, and a comparison page.',
        whyItMatters:
          "One concept. Six pages. All cross-linked. The knowledge term page defines it. The how-to guide teaches it. The blog post tells the story of building it. The wiki entry provides the reference. The framework gives it structure. The comparison page positions it against alternatives. Every page links to every other page. The term page accumulates authority from every piece that references it. It's a self-reinforcing loop. I used this pattern for every major concept in ShawnOS and it's why the knowledge base grows faster than the effort suggests.",
        howYouUseIt:
          'engineering-terms.ts holds the knowledge terms. how-to-wiki.ts holds the guides. content-wiki.ts holds the wiki entries. Blog posts live in the content directory. Each data file cross-references entries from other files through the related array. Programmatic internal linking connects everything automatically.',
        related: [
          'Topic Clusters',
          'Content Engineering',
          'The Answer Block Pattern',
        ],
      },
      {
        name: 'Topic Clusters',
        definition:
          'A content architecture where a pillar page covers a broad topic and links to supporting cluster pages that go deep on subtopics, all cross-linked to build collective authority.',
        whyItMatters:
          'Topic clusters are how you signal to both search engines and AI engines that you own a subject. One pillar page on GEO links to supporting pages on content extractability, entity authority, answer blocks, schema markup, AI crawlers. Each supporting page links back to the pillar and to each other. ShawnOS runs three pillars: GEO, Content Engineering, and SEO in the AI Era. Each pillar has 8-10 supporting pages. The cluster structure tells AI engines this site has comprehensive coverage of the topic.',
        howYouUseIt:
          'The data files are the cluster. engineering-terms.ts categories are natural clusters. The related array on every entry creates the cross-links. Wiki entries link to knowledge terms. How-to guides reference wiki entries. The monorepo makes cross-site linking between shawnos, gtmos, and contentos seamless.',
        related: [
          'The Keyword Nugget Pattern',
          'Content Engineering',
          'Entity Authority',
          'Content Cluster Topology',
        ],
      },
      {
        name: 'Content Engineering',
        definition:
          'The systems approach to content: TypeScript data objects as the content graph, template-driven rendering, programmatic internal linking, automated feeds, and schema pipelines — owning the entire system end to end.',
        whyItMatters:
          "This is the core thesis. The win is not any single tool. It's building a system you fully control that gives you complete refinement over your content pipeline at hyper speed. A CMS gives you a form and a publish button. Content engineering gives you a codebase where every content type is a TypeScript interface, every page is a template, every link is programmatic, and every deploy updates three sites simultaneously. I change one data file and the knowledge base, RSS feeds, sitemaps, and schema markup all update in one push. That level of control is the competitive advantage.",
        howYouUseIt:
          'The monorepo is the system. packages/shared/data/ holds the content graph as TypeScript objects. packages/shared/pages/ holds the templates. packages/shared/lib/rss/ generates feeds automatically from the data. One push to main deploys all three sites through Vercel. No CMS. No vendor lock-in. The knowledge graph is an asset I own.',
        related: [
          'The Keyword Nugget Pattern',
          'Topic Clusters',
          'Content Freshness Scoring',
          'Monorepo',
          'SQLite Content Index',
          'Remotion',
        ],
      },
      {
        name: 'AI Crawlers',
        definition:
          'Specialized web crawlers that AI companies use to discover and index content for their models and search features — including GPTBot, PerplexityBot, ClaudeBot, and Google-Extended.',
        whyItMatters:
          "Each AI engine has its own crawler with its own quirks. GPTBot can't execute JavaScript — if your site isn't server-side rendered, OpenAI can't see it. OAI-SearchBot handles real-time citations for ChatGPT search. PerplexityBot curates sources and cites by default. ClaudeBot uses the Brave Search index. Google-Extended feeds AI Overviews. If you block any of these in robots.txt, you're invisible to that engine. I explicitly allow all of them.",
        howYouUseIt:
          "All three ShawnOS sites have robots.txt files that explicitly allow every AI crawler: GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Applebot-Extended, Google-Extended, OAI-SearchBot. The sites are server-side rendered with Next.js so JavaScript-blind crawlers can still read everything. No JavaScript-only content.",
        related: [
          'llms.txt',
          'GEO (Generative Engine Optimization)',
          'Schema Markup for AI',
        ],
      },
      {
        name: 'llms.txt',
        definition:
          'A machine-readable file at your site root that helps LLMs and AI assistants discover and understand your content structure, like robots.txt but designed for AI comprehension.',
        whyItMatters:
          "robots.txt tells crawlers what they can access. llms.txt tells AI assistants what your site actually contains and how it's organized. It's a content map written for machines — site description, content types, feed URLs, key topics. When an AI assistant encounters your domain, llms.txt gives it instant context about what kind of information lives here. It's a small file with outsized impact on AI discoverability.",
        howYouUseIt:
          'Each of the three sites has an llms.txt in the public directory. shawnos.ai/llms.txt maps the blog, knowledge base, how-to wiki, daily logs, content wiki, and context wiki. thegtmos.ai/llms.txt maps the GTM knowledge base and Clay wiki. thecontentos.ai/llms.txt maps the content wiki. Each file lists feed URLs and key topics.',
        related: [
          'AI Crawlers',
          'Content Engineering',
          'Configuration Files',
        ],
      },
      {
        name: 'Schema Markup for AI',
        definition:
          'Structured data embedded in your pages using JSON-LD that helps AI engines extract typed information — DefinedTerm for glossary entries, HowTo for guides, FAQPage for Q&A, BlogPosting for articles.',
        whyItMatters:
          "Pages with 3 or more schema types have roughly 13% higher citation likelihood from AI engines. 96% of AI Overview citations come from sources with strong E-E-A-T signals, and schema markup is how you make those signals machine-readable. Schema tells AI engines not just what your content says, but what kind of content it is. A DefinedTerm tells the engine this is a definition worth citing. A HowTo tells it these are steps worth following. Without schema, AI engines have to guess. With schema, you're telling them explicitly.",
        howYouUseIt:
          'Every content type in ShawnOS has a corresponding schema type. Knowledge terms get DefinedTerm. How-to guides get HowTo with step elements. Wiki entries get TechArticle. Blog posts get BlogPosting with author and datePublished. Every page also gets Organization, Person, WebSite, and BreadcrumbList. The schema is generated from the same TypeScript data objects that render the pages.',
        related: [
          'GEO (Generative Engine Optimization)',
          'Entity Authority',
          'Content Extractability',
        ],
      },
      {
        name: 'Content Freshness Scoring',
        definition:
          'Tracking and signaling how recently content was updated — critical because pages not refreshed quarterly are 3x more likely to lose AI citations.',
        whyItMatters:
          'AI engines penalize stale content. Not with a manual penalty, but by naturally preferring fresher sources when multiple pages answer the same question. Pages not refreshed in 90 days are 3x more likely to lose their AI citations to competitors who updated more recently. Freshness signals include dateModified in schema, Last-Modified HTTP headers, sitemap lastmod timestamps, and actual content changes. You need all four to signal freshness effectively.',
        howYouUseIt:
          'The daily tracker logs content changes. RSS feeds auto-update with new entries. Sitemaps regenerate on every deploy. The system tracks freshness by design because every deploy is a content refresh. Adding a single knowledge term updates the RSS feed, the sitemap, and the schema dateModified across all pages that reference it.',
        related: [
          'Content Engineering',
          'Content Extractability',
          'Cron Jobs',
        ],
      },
      {
        name: 'Remotion',
        definition:
          'A React framework that renders video frame by frame — write JSX components, render at target FPS, encode to MP4. No GPU, no timeline editor, no After Effects.',
        whyItMatters:
          'Video is a content type that was always disconnected from the rest of the system. After Effects exports live on a hard drive. Canva projects live in a SaaS database. Neither shares design tokens, data, or deploy pipelines with your websites. Remotion changes that by making video a React component that lives in your codebase. Same shared package, same color palette, same monorepo CI. When I change a brand color, the websites and the videos all update on the next build. Video stopped being a separate workflow and became another content type in the system.',
        howYouUseIt:
          'The video app lives at website/apps/video/ inside the Turborepo monorepo. Nine compositions in Root.tsx — three brands times three aspect ratios. A useScale() hook handles responsive sizing. Scenes use Perlin noise from @remotion/noise for deterministic animation. npm run render:all generates all variants. The SQLite content index tracks every video file with brand, format, and deployment status.',
        related: ['Content Engineering', 'Monorepo'],
      },
      {
        name: 'SQLite Content Index',
        definition:
          'A derived SQLite database that makes your entire content repo queryable — multi-platform content parsing, cross-reference detection, asset inventory, and dead page detection, built with zero external dependencies.',
        whyItMatters:
          'Once the repo passed 100 content files across 6 platforms, the file system became opaque. I could not answer basic questions: how many LinkedIn posts went final this week? Which content has cross-platform siblings? What is the total word count for February? A SQLite index sitting alongside the repo gives you SQL queries over your content. The index is derived data — rebuilt from git-tracked files on every run. Delete the database, run the script, same result. It revealed its own gap: three major systems had shipped with zero blog coverage. The tool that finds content gaps found content gaps about the tool.',
        howYouUseIt:
          'python3 scripts/build_index.py walks the repo and loads 9 tables into data/index.db. python3 scripts/query_index.py provides 8 subcommands for filtering by platform, stage, date, pillar, series, and more. Output modes include table, JSON, and count. Cross-platform link detection finds sibling content automatically by matching date and slug across platforms. Run it weekly to audit content coverage and find gaps.',
        related: [
          'Content Engineering',
          'Topic Clusters',
          'Content Freshness Scoring',
        ],
      },
      {
        name: 'Content Cluster Topology',
        definition:
          'The deliberate architecture of how content connects within and across websites — hub-and-spoke model, taxonomy-driven routing, canonical site designation, and bidirectional cross-linking that compounds topical authority.',
        whyItMatters:
          'Individual pages are nodes. Internal links are edges. AI engines evaluate topical authority by measuring the graph, not just individual pages. A flat blog with no internal links means every page starts from zero. A cluster topology with bidirectional links creates a graph where every new page strengthens every existing page. The three-site architecture amplifies this — shawnos, gtmos, and contentos each build authority in their vertical, and cross-site links connect the verticals. sameAs schema markup tells search engines these three sites represent one entity. Sites with 15 or more recognized entities have a 4.8x higher citation probability.',
        howYouUseIt:
          'The topology is defined in website/taxonomy.yaml. Every content pillar maps to a domain. How-to entries have a canonicalSite field that determines which site renders the page and which sites redirect. Bidirectional related arrays on every data object create the cross-links. Breadcrumb schema markup communicates the hierarchy to AI engines. The system compounds: every new entry creates new edges, every new edge strengthens every connected node.',
        related: [
          'Topic Clusters',
          'Entity Authority',
          'Content Engineering',
          'The Keyword Nugget Pattern',
        ],
      },
    ],
  },
]
