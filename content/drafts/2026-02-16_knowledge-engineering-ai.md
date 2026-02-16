# AI Knowledge Guide

 weeks ago I didn't know what a git repo was. not really.

I'd heard the word. I knew engineers used it. but I didn't understand it. I was an SDR who built systems in my head, in scattered Notion docs, in Slack messages I'd never find again.

then I built a meme generator. broke it. fixed it. learned what npm install meant. learned what version control actually was. learned the difference between asking AI to build something for you and asking AI to show you how while you're driving.

I'm not an engineer. I'm not a developer. I'm a builder who learned these terms by breaking things and reading error messages at 2 AM.

this is what I picked up along the way. the terms that showed up when I was deploying my first website. the concepts I needed when the build failed. the vocabulary that made AI agents less confusing and more useful.

I'm not the expert here. but I'm sharing what I know, the best way I know how.

if you're building with AI agents in 2026, these are the words you'll hear. here's what they mean.

---

## Version Control

### Git

version control system that tracks changes to your code over time.

**why it matters**: I didn't understand Git until I needed to revert a broken homepage. I'd changed something, refreshed localhost:3000, and the entire layout was gone. I panicked. then realized I could just undo the commit and go back to when it worked. that's when it clicked. Git isn't just tracking changes. it's letting you time travel. every commit is a save point. every push is publishing your work.

**how I use it**: when I run `/deploy`, it stages changes, commits with a message, pushes to GitHub, and triggers Vercel. when I run the daily tracker, it scans git commits to see what I shipped. Git is the receipt for everything I build.

**related**: commits, branches, push

### Commits

a snapshot of your files at a specific point in time with a message explaining what changed.

**why it matters**: commits are your paper trail. they tell the story of how you built something. good commit messages make debugging easier. bad commit messages make you hate yourself when you're trying to figure out what broke.

**how you use it**: `git commit -m "add user authentication"`. the message should say what you did and why. not "fix stuff" or "updates". that's useless.

**related**: Git, push, revert

### Branches

separate versions of your code that let you work on features without breaking the main version.

**why it matters**: main branch is what's live. feature branches are where you experiment. you can try things, break them, fix them, and only merge to main when they're ready.

**how you use it**: create a branch for each feature. test it. merge it when it works. delete the branch when you're done. keeps main clean.

**related**: merge, pull request, Git

### Push

sending your local commits to a remote server like GitHub or Vercel.

**why it matters**: your code isn't backed up until you push. your team can't see it until you push. automated deployments don't trigger until you push. local commits are invisible.

**how you use it**: `git push origin main`. push to main triggers auto-deploys on Vercel. push to a feature branch creates a preview deployment.

**related**: commits, deploy, remote

### Merge Conflicts

when Git can't automatically combine changes from two branches because they edited the same lines.

**why it matters**: this is the tax you pay for collaboration. two people edited the same file. Git doesn't know which version to keep. you have to choose manually.

**how you use it**: open the file, look for the conflict markers (`<<<<<<<` and `>>>>>>>`), decide which code to keep, delete the markers, commit the resolution. it's annoying but necessary.

**related**: branches, merge, Git

---

## Deployment

### Vercel

hosting platform that deploys websites from Git repos with zero config.

**why it matters**: the first time I pushed to main and watched Vercel build my site in 45 seconds, I realized I'd been doing web hosting wrong for years. no FTP uploads. no manual file transfers. just push the code and it's live. three websites (shawnos.ai, thegtmos.ai, thecontentos.ai) all deploy from one push. that's not magic. that's just how modern web development works.

**how I use it**: every time I run `/deploy`, it pushes to GitHub, Vercel picks it up, builds all three sites, and they go live. I get a preview URL for every branch. if something breaks, I check the build logs. if it works, it's live in under a minute.

**related**: deploy, domains, build process

### Deploy

the process of making your local code changes live on the internet.

**why it matters**: I spent the first week editing files and wondering why my changes weren't showing up on shawnos.ai. then I realized local changes stay local until you deploy. the code on my machine and the code on the website are two different things. deploying is the bridge.

**how I use it**: I built the `/deploy` skill so I don't have to remember the steps. it stages changes, writes a commit message, pushes to GitHub, waits for Vercel to build, and confirms all three sites are live. I type `/deploy`. everything else happens automatically. that's the whole point.

**related**: Vercel, Git, push

### Build Process

the steps that transform your source code into the final website visitors see.

**why it matters**: Next.js apps need to be compiled. TypeScript needs to convert to JavaScript. dependencies need to be installed. the build process does all of this. if the build fails, your deploy fails.

**how you use it**: locally, `npm run dev` builds in development mode with hot reload. on Vercel, the build happens automatically on every push. check build logs if it fails.

**related**: Next.js, dependencies, Vercel

### Environment Variables

secret values like API keys that you don't want in your code.

**why it matters**: API keys, database passwords, MCP tokens. these can't live in your repo. they'd be public on GitHub. environment variables let you reference them without exposing them.

**how you use it**: create a `.env` file locally with `API_KEY=your_key_here`. add it to `.gitignore` so it never gets committed. on Vercel, add the same variables in the dashboard so your deployed site can access them.

**related**: API keys, secrets, .gitignore

### Domains

the web address people type to visit your site.

**why it matters**: `shawnos.ai` is more memorable than `shawnos-abc123.vercel.app`. custom domains are how you own your presence. Vercel handles DNS, SSL certificates, and routing.

**how you use it**: buy a domain from any registrar. point the nameservers to Vercel or Cloudflare. add the domain in Vercel's dashboard. it auto-configures HTTPS. takes 10 minutes.

**related**: Vercel, DNS, SSL

---

## AI Agents

### Parallel Agents

running multiple AI agents at the same time on different tasks.

**why it matters**: one agent generates LinkedIn drafts while another scans HeyReach campaigns. parallel agents cut execution time in half. sequential is one-at-a-time. parallel is all-at-once.

**how you use it**: the Task tool launches agents. when you have independent tasks (scan repo + generate content + fetch API data), launch all three agents in one message. they run concurrently.

**related**: Task tool, agent skills, context windows

### Agent Skills

pre-written instructions that teach AI agents how to perform specific workflows.

**why it matters**: skills are portable knowledge. the `/deploy` skill knows how to stage, commit, push, and verify deploys. the `/finalcopy` skill knows your voice, platform rules, and anti-slop filters. skills make agents consistent.

**how you use it**: trigger with slash commands. `/deploy` runs the deploy skill. `/tracker` runs the daily tracker. skills read your voice files, check your rules, follow your workflows. they're reusable automation.

**related**: Cursor skills, slash commands, workflows

### MCP Servers

Model Context Protocol servers that give AI agents access to external tools and data sources.

**why it matters**: MCP connects agents to Slack, HeyReach, Instantly, Browserbase, ClickUp, Substack. without MCP, agents are blind to your production systems. with MCP, they can read Slack channels, pull campaign data, and push drafts to Substack.

**how you use it**: install MCP servers in Cursor settings. each server exposes tools the agent can call. Slack MCP gives `search_messages` and `send_message`. HeyReach MCP gives `export_leads`. the agent sees these as available actions.

**related**: API integrations, Cursor, Claude

### Context Windows

the amount of text an AI model can see and remember in a single conversation.

**why it matters**: larger context = more files, more history, more continuity. Claude Sonnet 4.5 has 200k tokens. that's roughly 150k words. big enough to load your entire voice system, recent conversation history, and current task context without forgetting.

**how you use it**: the agent auto-manages context. you don't. but knowing the limit exists helps you understand why agents sometimes lose track of earlier instructions. if you hit the limit, the agent summarizes and refreshes.

**related**: token usage, model selection, memory

### Model Selection

choosing which AI model to use based on task complexity and cost.

**why it matters**: Opus is smarter but expensive. Sonnet is fast and cheap. for simple tasks (reformatting, scanning), use Sonnet. for complex reasoning (architecting, debugging), use Opus. wrong model = wasted money or bad output.

**how you use it**: the daily tracker logs model usage. Opus sessions cost $12-15. Sonnet sessions cost $3-5. track your spend. optimize your model picks. don't use Opus to count words.

**related**: token usage, cost tracking, efficiency

---

## Development Tools

### Markdown

plain text format with simple syntax for headings, lists, links, and formatting.

**why it matters**: all your content lives in markdown. blog posts, drafts, voice files, workflows, skill documentation. markdown is readable as plain text, version-controllable in Git, and renderable as HTML.

**how you use it**: `# heading`, `**bold**`, `- list item`, `[link](url)`. write in any text editor. commit to Git. render on your site. no proprietary formats. no lock-in.

**related**: content pipeline, Git, Next.js

### Python Scripts

small programs that automate tasks like scanning files, calculating scores, or generating images.

**why it matters**: the daily tracker is a Python script. the dashboard generator is a Python script. anytime you need to process files, calculate stats, or batch operations, Python is faster than doing it manually.

**how you use it**: `scripts/` folder holds all automation. `daily_scan.py` scans git and content folders. `daily_dashboard.py` generates the tracker card. run them from the terminal or from agent skills.

**related**: automation, data processing, Pillow

### Monorepo

a single Git repo that holds multiple related projects with shared code.

**why it matters**: I was planning one website. then the agent and I scoped the architecture and realized one site couldn't hold everything. the personal journey, the GTM engineering, the content methodology. three audiences, three domains. but I didn't want to manage three separate repos. so we built a monorepo. shawnos.ai, thegtmos.ai, thecontentos.ai all live in one repo. same design system, same components, one push deploys all three. I edit the TypewriterHero component once and all three sites update.

**how I use it**: Turborepo manages the orchestration. `packages/shared/` holds the components and styles all three sites use. `apps/shawnos/`, `apps/gtmos/`, `apps/contentos/` are the individual sites. when I run `/deploy`, all three build and go live. one command, three websites.

**related**: Turborepo, shared components, deploy

### Packages

reusable modules of code that other projects can import.

**why it matters**: you don't build everything from scratch. Next.js is a package. Pillow is a package. `npm install` pulls packages from the internet. they're pre-built solutions to common problems.

**how you use it**: `package.json` lists your dependencies. `npm install` downloads them. packages live in `node_modules/`. you import them into your code. they update when you run `npm update`.

**related**: dependencies, npm, node_modules

### Dependencies

external code your project relies on to function.

**why it matters**: your site depends on Next.js. your tracker depends on Pillow. if dependencies aren't installed, nothing runs. if they're outdated, things break. dependency management is invisible until it isn't.

**how you use it**: `npm install` installs all dependencies listed in `package.json`. `pip install Pillow` installs Python dependencies. dependencies are tracked in lock files. don't edit those manually.

**related**: packages, package.json, npm

---

## Automation

### Cron Jobs

scheduled tasks that run automatically at specific times.

**why it matters**: you don't manually run the tracker every night. a cron job does it. cron is how you automate recurring work. backups, deploys, reports, data syncs. set it once, forget it.

**how you use it**: cron syntax is cryptic but powerful. `0 20 * * *` means "run at 8 PM every day". you define the schedule and the command. the system handles execution.

**related**: automation, scheduling, scripts

### Webhooks

URLs that external services call when an event happens.

**why it matters**: when someone replies to your Instantly campaign, the webhook fires. when a HeyReach connection accepts, the webhook fires. webhooks turn events into triggers. real-time automation.

**how you use it**: give the external service a URL to call. when the event happens, they POST data to that URL. your system processes it. no polling. no waiting. instant.

**related**: API integrations, event-driven, triggers

### Event-Driven Workflows

automation that reacts to events instead of running on a schedule.

**why it matters**: cron jobs run on time. event-driven workflows run when something happens. push to GitHub triggers deploy. new file in content folder triggers scan. smarter than polling.

**how you use it**: Vercel auto-deploys on push events. MCP servers trigger on API calls. watchers trigger on file changes. design systems that react instead of poll.

**related**: webhooks, triggers, automation

---

## Data Formats

### JSON

JavaScript Object Notation. a text format for storing structured data.

**why it matters**: APIs return JSON. config files use JSON. your daily tracker logs are JSON. it's readable by humans, parseable by machines. key-value pairs, nested objects, arrays.

**how you use it**: `{ "name": "value", "count": 5, "tags": ["tag1", "tag2"] }`. JSON files end in `.json`. parse them with `JSON.parse()` in JavaScript or `json.load()` in Python.

**related**: API responses, config files, data storage

### CSV

Comma-Separated Values. a simple spreadsheet format.

**why it matters**: HeyReach exports CSVs. Clay imports CSVs. Instantly uploads CSVs. CSV is the universal data exchange format. every tool supports it.

**how you use it**: first row is headers. every row after is data. `name,email,company`. open in Excel or Google Sheets. import into Clay. upload to campaigns.

**related**: data imports, exports, spreadsheets

### Environment Files

files that store environment variables for local development.

**why it matters**: `.env` files keep secrets out of Git. API keys, tokens, database URLs. they're local only. each developer has their own. Vercel has its own set for production.

**how you use it**: create `.env` in your project root. add `API_KEY=value`. add `.env` to `.gitignore`. load variables with `process.env.API_KEY` in code.

**related**: environment variables, secrets, .gitignore

### Configuration Files

files that define how tools should behave.

**why it matters**: `next.config.ts` tells Next.js how to build. `tsconfig.json` tells TypeScript how to compile. `.gitignore` tells Git what to ignore. config files control behavior without code changes.

**how you use it**: read the docs for each tool. copy starter configs. tweak settings as needed. commit config files to Git so everyone uses the same setup.

**related**: next.config, tsconfig, .gitignore

---

## the vibe coder toolkit

version control → Git, commits, branches, push  
deployment → Vercel, domains, environment variables  
AI agents → skills, MCP, context windows, parallel execution  
development → markdown, Python, monorepos, packages  
automation → cron, webhooks, event-driven workflows  
data → JSON, CSV, config files, environment files

you don't need a CS degree. you need to know what these words mean. you need to recognize them in error messages. you need to know when to use which tool.

the rest is just building. and if you get stuck, the agent knows all of this already. you're not alone.

go build something.

shawn ⚡ the gtme alchemist 🧙‍♂️
