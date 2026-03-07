google just shipped a CLI that wraps every Workspace API.

one tool. Gmail, Drive, Calendar, Sheets, Docs, Tasks. JSON in, JSON out. 89 agent skills for Claude Code.

this is `gws` and it replaces the entire MCP/API copy-paste nightmare ⚡

---

what it actually does:

`gws gmail users messages list --params '{"userId":"me","maxResults":1}'`

that returns your last email as clean JSON. same pattern for every service. Claude Code parses it natively and chains operations.

no middleware. no custom adapters. one auth flow.

---

I installed 27 of the 89 skills. skipped Chat, Classroom, Keep, Meet, Slides, Forms, and 56 others.

the helpers are the real value. gmail-send, calendar-agenda, sheets-append, drive-upload. they save you from constructing raw API calls.

the workflow skills (standup-report, meeting-prep, email-to-task) are early but usable.

---

full setup guide with every command and the exact 27 skills worth installing:

[blog link]

not officially supported by Google. works today. built on the official Discovery Service so the API surface is real.

- shawn ⚡
