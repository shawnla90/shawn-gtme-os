google just shipped a CLI that wraps every Workspace API into one tool.

it is called `gws`. Gmail, Drive, Calendar, Sheets, Docs, Tasks. all accessible from your terminal. JSON in, JSON out.

but the real play is the 89 agent skills it ships with. purpose-built for Claude Code. install them with `npx skills add` and your coding agent can triage your inbox, check your calendar, append rows to sheets, and create tasks. no MCP server setup. no API key dance.

I set it up today and tested it against real GTM work. here is the honest take:

⚡ what works:
- one OAuth flow covers all 6 services
- every command returns clean JSON that Claude Code can parse natively
- the helper skills (gmail-send, calendar-agenda, sheets-append) save you from raw API calls
- workflow skills chain multiple services into compound operations

🔧 what to know:
- not an officially supported Google product (the README says so)
- you need to create an OAuth desktop client manually in GCP console
- 89 skills is too many. I installed 27 and skipped the rest
- shell escaping with Sheets ranges is annoying (the ! character)

I wrote up the full setup guide with every command, which 27 skills to install, and the gotchas I hit.

link in the comments. no gatekeeping.

shawn ⚡ GTM Engineer
