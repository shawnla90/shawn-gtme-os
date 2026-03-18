---
title: "Google just shipped a CLI that wraps every Workspace API"
date: "2026-03-06"
excerpt: "gws is a new CLI that turns every Google Workspace API into shell commands with 89 agent skills for Claude Code. I set it up, tested it against real GTM work, picked 27 skills worth having, and learned why you should not load them all at once."
category: "ships"
---

**tl;dr:** Google dropped a CLI called `gws` that wraps every Workspace API into shell commands with 89 agent skills for Claude Code. I tested it, picked the 27 skills worth having, and learned the hard way that loading them all at once wrecks your context window. Here's the full setup and the skills worth installing.

## what does Google's new CLI do?

Google quietly dropped a CLI called `gws` that wraps every Workspace API. Gmail, Drive, Calendar, Sheets, Docs, Tasks. all of it. one command-line tool.

but the real play is the agent skills. 89 of them. purpose-built for Claude Code. install them with `npx skills add` and suddenly your coding agent can read your inbox, check your calendar, append to sheets, and create tasks. no MCP server config. no API key copy-paste. no custom middleware.

I have been stitching together Google API access for months. OAuth flows, MCP servers, JSON parsing, scope management. it works, but it is fragile and annoying to maintain. `gws` replaces all of that with a single authenticated CLI that speaks JSON natively.

the catch: it is not an officially supported Google product. the README says so. but it works, and it is built on top of the official Google Discovery Service, so the API surface is real.

## how do you set it up?

here is the exact sequence I ran. no summarizing. these are the real commands.

**step 1: set your GCP project**

```bash
gcloud config set project gen-lang-client-0948745603
```

use whatever project you already have with APIs enabled. mine is the Gemini API project because it already had Gmail API enabled.

**step 2: enable the APIs you need**

```bash
gcloud services enable \
  drive.googleapis.com \
  sheets.googleapis.com \
  calendar-json.googleapis.com \
  docs.googleapis.com \
  tasks.googleapis.com
```

Gmail API was already enabled. the rest took one command.

**step 3: create an OAuth desktop client**

this is the one step `gws auth setup` cannot automate. you need to go to the GCP console manually:

1. configure the OAuth consent screen (External, your email, save through all screens)
2. create credentials, OAuth client ID, Desktop app type
3. download the `client_secret_*.json` file
4. drop it at `~/.config/gws/client_secret.json`

the `gws auth setup` command tries to do this for you but hits a validation error. you have to do it in the console. took 3 minutes.

**step 4: authenticate with scoped services**

```bash
gws auth login -s drive,gmail,calendar,sheets,tasks,docs
```

this opens a browser, you sign in, grant access to those 6 services. the `-s` flag is important. Google has a 25-scope limit for apps in testing mode. by scoping to only the services you use, you stay well under.

**step 5: verify**

```bash
gws auth status
```

should show credentials exist and list which services are authorized.

## what skills does the CLI include?

`gws` ships with 89 agent skills. do not install all of them. do not even install 27 of them into your active skills directory. I learned this the hard way.

every skill in `~/.claude/skills/` gets loaded into your agent's context window on every session. 27 skills is roughly 50KB of instructions that Claude reads before you even say hello. if you are editing a React component or debugging a deploy, none of that Google Workspace context is relevant. it is just noise eating tokens.

**the move: install one skill into active context. park the rest.**

install `gws-shared` into your active skills. it is the foundation layer. it teaches Claude how to authenticate, use global flags, and format output. about 2KB. that is all you need loaded by default.

```bash
npx skills add googleworkspace/cli --skill gws-shared --agent claude-code -y -g
```

then install whatever else you need into a parking directory:

```bash
# install to global skills repo (not auto-loaded)
npx skills add googleworkspace/cli --skill gws-gmail gws-calendar gws-sheets gws-drive gws-tasks gws-docs --agent claude-code -y -g

# move them out of auto-load
mkdir -p ~/.claude/skills-available
mv ~/.claude/skills/gws-gmail ~/.claude/skills-available/
mv ~/.claude/skills/gws-calendar ~/.claude/skills-available/
# ... etc for each skill
```

when you want a GWS-heavy session (inbox triage, calendar review, sheets work), symlink the ones you need back in:

```bash
ln -s ~/.claude/skills-available/gws-gmail ~/.claude/skills/gws-gmail
ln -s ~/.claude/skills-available/gws-gmail-triage ~/.claude/skills/gws-gmail-triage
```

remove them when you are done. your context window is finite. treat it like memory, not a junk drawer.

## which 27 skills are worth having available?

here is what I installed and parked. grouped by what they do.

### foundation (always loaded)

`gws-shared` - auth, global flags, output formatting. the only one that stays in `~/.claude/skills/`.

### core services (6 skills)

one skill per Workspace API: `gmail`, `calendar`, `sheets`, `drive`, `tasks`, `docs`. these give Claude Code the ability to call any endpoint on each service. generic but complete.

### helpers (9 skills)

purpose-built operations that save you from constructing raw API calls:

- `gmail-send`, `gmail-triage`, `gmail-watch` - send emails, batch-triage inbox, watch for new messages
- `calendar-agenda`, `calendar-insert` - check schedule, create events
- `sheets-read`, `sheets-append` - read ranges, append rows
- `drive-upload` - upload files
- `docs-write` - create and edit documents

these are the ones you will actually reach for. the core service skills are the fallback for anything the helpers do not cover.

### workflows (5 skills)

compound operations that chain multiple services:

- `workflow` - generic multi-step orchestration
- `standup-report` - pull calendar + tasks + gmail into a morning brief
- `meeting-prep` - gather context for upcoming meetings
- `email-to-task` - convert emails into Google Tasks
- `weekly-digest` - summarize the week across all services

### recipes (6 skills)

specific GTM-relevant automations:

- `draft-email-from-doc` - turn a Google Doc into an email draft
- `email-drive-link` - share a Drive file via email
- `find-free-time` - check calendar availability
- `create-task-list` - spin up a new task list
- `review-overdue-tasks` - surface what is slipping
- `log-deal-update` - append deal notes to a tracking sheet

### what I skipped (62 skills)

Chat, Classroom, Keep, Meet, Admin Reports, Model Armor, Slides, Forms, People, Events. and the associated helpers/recipes for all of those.

if you are a solo operator or small team doing GTM work, you do not need classroom management or admin reports. install what matches your actual workflow. you can always add more later.

## what does it look like in practice?

here is what it looks like in practice.

**check your last email:**

```bash
gws gmail users messages list --params '{"userId":"me","maxResults":1}'
```

**list your Drive files:**

```bash
gws drive files list --params '{"pageSize":5}'
```

**check today's calendar:**

```bash
gws calendar calendarList list
```

**list your task lists:**

```bash
gws tasks tasklists list
```

every command returns clean JSON. that is the point. Claude Code can parse it, reason about it, and chain it into multi-step workflows without any adapter code.

## what are the gotchas?

**OAuth scope limit.** apps in testing mode cap at 25 scopes. 6 services keeps you well under, but if you try to enable everything at once you will hit the wall.

**shell escaping.** Sheets ranges use `!` (like `Sheet1!A1:B10`). in bash, `!` triggers history expansion. wrap your params in single quotes.

**not officially supported.** the repo README says it clearly. this is not a Google product. it is a tool built on Google APIs. it works today. whether it works in 6 months depends on whether Google keeps it maintained.

**do not load 27 skills into active context.** I did this and immediately realized the problem. 50KB of Workspace instructions loaded on every session whether you need them or not. keep `gws-shared` active, park the rest in a `skills-available` directory, and symlink in what you need per session.

**npx skills add clones the repo.** each skill install pulls the full repo. it is slow the first time. accept it.

**JSON params everywhere.** every `--params` flag takes a JSON string. get comfortable with single-quoted JSON in your shell, or pipe from files.

## the honest take

`gws` solves a real problem. stitching together Google Workspace APIs for agent use has been one of the most annoying parts of building GTM infrastructure. OAuth flows, MCP server configs, scope management, token refresh. all of it is friction that does not add value.

this tool removes most of that friction. one CLI. one auth flow. JSON in, JSON out. 89 skills that plug directly into Claude Code.

the quality of the skills varies. the core service wrappers are solid. some of the workflow skills feel early. but the foundation is right, and the fact that it builds on the official Google Discovery Service means the API coverage is complete, not hand-rolled.

for a solo GTM operator running Claude Code as the primary agent, this is the cleanest path to Google Workspace integration I have found. install the skills that match your work, park them outside active context, and pull them in when you actually need them. your context window is the most expensive resource in your stack. do not fill it with instructions for services you are not using in that session.

that is what I did. and then immediately undid the part where I loaded all 27 at once.

## frequently asked questions

**what is Google's Workspace CLI?**
`gws` is an unofficial CLI tool that wraps every Google Workspace API into shell commands. Gmail, Drive, Calendar, Sheets, Docs, Tasks. it also ships 89 agent skills purpose-built for Claude Code so your AI agent can interact with Google services directly.

**is the Google CLI free?**
yes. the CLI itself is free and open source. you need a Google Cloud project with the relevant APIs enabled, and an OAuth consent screen configured. the APIs themselves are free within normal usage limits.

**what can you automate with the Google Workspace CLI?**
anything the Workspace APIs support. inbox triage, calendar management, spreadsheet updates, file uploads, document creation, task management. the workflow skills chain multiple services together for things like morning standup reports and weekly digests.

**does it work with Gmail?**
yes. Gmail is one of the six core services. the CLI includes dedicated skills for sending emails, triaging your inbox, and watching for new messages. you need to enable the Gmail API in your GCP project and include it in your auth scopes.

## keep reading

- [how I generate landing pages from the terminal in 90 seconds](https://shawnos.ai/blog/terminal-to-landing-page-90-seconds)
- [how to set up your own AI assistant through Claude Code](https://shawnos.ai/blog/how-to-setup-your-own-ai-assistant)
- [what 1M context window means for Claude Code](https://shawnos.ai/blog/claude-code-1m-context-window)

shawn ⚡
