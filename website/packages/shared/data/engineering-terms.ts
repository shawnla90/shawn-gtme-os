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
]
