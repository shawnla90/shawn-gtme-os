---
title: "Google just shipped a CLI that wraps every Workspace API"
date: "2026-03-06"
excerpt: "gws is a new CLI that turns every Google Workspace API into shell commands with 89 agent skills for Claude Code. I set it up, tested it against real GTM work, and picked the 27 skills worth installing."
---

## what gws actually is

Google quietly dropped a CLI called `gws` that wraps every Workspace API. Gmail, Drive, Calendar, Sheets, Docs, Tasks. all of it. one command-line tool.

but the real play is the agent skills. 89 of them. purpose-built for Claude Code. install them with `npx skills add` and suddenly your coding agent can read your inbox, check your calendar, append to sheets, and create tasks. no MCP server config. no API key copy-paste. no custom middleware.

I have been stitching together Google API access for months. OAuth flows, MCP servers, JSON parsing, scope management. it works, but it is fragile and annoying to maintain. `gws` replaces all of that with a single authenticated CLI that speaks JSON natively.

the catch: it is not an officially supported Google product. the README says so. but it works, and it is built on top of the official Google Discovery Service, so the API surface is real.

## setup (the actual commands)

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

## which skills to install (and which to skip)

`gws` ships with 89 agent skills. I installed 27. here is how I picked them.

**foundation (1 skill)**

`gws-shared` is the base layer. every other skill depends on it.

**core services (6 skills)**

one skill per Workspace API: `gmail`, `calendar`, `sheets`, `drive`, `tasks`, `docs`. these give Claude Code the ability to call any endpoint on each service. generic but complete.

**helpers (9 skills)**

purpose-built operations that save you from constructing raw API calls:

- `gmail-send`, `gmail-triage`, `gmail-watch` - send emails, batch-triage inbox, watch for new messages
- `calendar-agenda`, `calendar-insert` - check schedule, create events
- `sheets-read`, `sheets-append` - read ranges, append rows
- `drive-upload` - upload files
- `docs-write` - create and edit documents

these are the ones you will actually use daily. the core service skills are the fallback for anything the helpers do not cover.

**workflows (5 skills)**

compound operations that chain multiple services:

- `workflow` - generic multi-step orchestration
- `standup-report` - pull calendar + tasks + gmail into a morning brief
- `meeting-prep` - gather context for upcoming meetings
- `email-to-task` - convert emails into Google Tasks
- `weekly-digest` - summarize the week across all services

**recipes (6 skills)**

specific GTM-relevant automations:

- `draft-email-from-doc` - turn a Google Doc into an email draft
- `email-drive-link` - share a Drive file via email
- `find-free-time` - check calendar availability
- `create-task-list` - spin up a new task list
- `review-overdue-tasks` - surface what is slipping
- `log-deal-update` - append deal notes to a tracking sheet

**what I skipped (62 skills)**

Chat, Classroom, Keep, Meet, Admin Reports, Model Armor, Slides, Forms, People, Events. and the associated helpers/recipes for all of those.

if you are a solo operator or small team doing GTM work, you do not need classroom management or admin reports. install what matches your actual workflow. you can always add more later.

## real commands

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

## gotchas

**OAuth scope limit.** apps in testing mode cap at 25 scopes. 6 services keeps you well under, but if you try to enable everything at once you will hit the wall.

**shell escaping.** Sheets ranges use `!` (like `Sheet1!A1:B10`). in bash, `!` triggers history expansion. wrap your params in single quotes.

**not officially supported.** the repo README says it clearly. this is not a Google product. it is a tool built on Google APIs. it works today. whether it works in 6 months depends on whether Google keeps it maintained.

**npx skills add clones the repo.** each skill install pulls the full repo. it is slow the first time. accept it.

**JSON params everywhere.** every `--params` flag takes a JSON string. get comfortable with single-quoted JSON in your shell, or pipe from files.

## the honest take

`gws` solves a real problem. stitching together Google Workspace APIs for agent use has been one of the most annoying parts of building GTM infrastructure. OAuth flows, MCP server configs, scope management, token refresh. all of it is friction that does not add value.

this tool removes most of that friction. one CLI. one auth flow. JSON in, JSON out. 89 skills that plug directly into Claude Code.

the quality of the skills varies. the core service wrappers are solid. some of the workflow skills feel early. but the foundation is right, and the fact that it builds on the official Google Discovery Service means the API coverage is complete, not hand-rolled.

for a solo GTM operator running Claude Code as the primary agent, this is the cleanest path to Google Workspace integration I have found. install the 27 skills that match your work. skip the rest. ship something with it before writing about it.

that is what I did.

shawn ⚡
