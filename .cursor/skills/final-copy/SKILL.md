---
name: final-copy
description: Converts an approved markdown draft into platform-ready plain text and optionally pushes to Typefully as a draft. Use when the user types /finalcopy or /finalcopy <path> or asks to finalize a post for publishing.
---

# Final Copy Command

When the user types `/finalcopy`, convert the current or specified draft from markdown into clean plain text ready to paste into LinkedIn (or other platforms). Optionally apply last-minute adjustments before converting. Can push directly to Typefully as a draft for final editing and scheduling.

## Command Pattern

- `/finalcopy` -- converts the draft currently being discussed in conversation
- `/finalcopy <path>` -- converts a specific draft file (e.g., `/finalcopy content/linkedin/drafts/2026-02-09_weekend-build.md`)
- `/finalcopy` with adjustment notes in the same message -- apply adjustments, then convert
- `/finalcopy --typefully` -- convert and push the post body to Typefully as a draft
- `/finalcopy --typefully --schedule "next-free-slot"` -- convert and schedule via Typefully
- `/finalcopy --typefully --schedule "2026-02-10T09:00:00Z"` -- convert and schedule for a specific time

**Default behavior**: When no flags are provided, the command converts and saves locally + displays inline. Add `--typefully` to also push to Typefully.

## Workflow

### Step 1: Identify the Draft

1. If a path argument is provided, use that file
2. If no path, use the draft most recently discussed in conversation or currently open in the editor
3. Read the full markdown file
4. If the file doesn't exist or can't be found: "Couldn't find a draft to finalize. Try `/finalcopy content/linkedin/drafts/your-file.md`"

### Step 2: Final Review Pass (Optional)

Check the user's message for adjustment notes:

- **If the user included specific changes** (e.g., "change the opener to..." or "remove the last line"):
  - Apply the adjustments to the draft markdown file first
  - Save the updated markdown draft
  - Then proceed to conversion
- **If the user said "it's good", "let's go", "approved", "ship it"** or similar:
  - Skip adjustments, proceed directly to conversion
- **If adjustments reveal a pattern worth capturing** (e.g., a new anti-pattern, a voice rule, a structural preference):
  - Flag it at the end: "Noticed a pattern worth adding to [specific skill file]. Want me to update it?"
  - Do NOT auto-update skill files. Always ask first.

### Step 3: Strip Markdown to Plain Text

Transform the markdown draft into clean plain text by removing:

1. **YAML frontmatter**: Everything between the opening `---` and closing `---` at the top (including the `# Title` line above it)
2. **Markdown headers**: Lines starting with `#`, `##`, `###` (remove the `#` symbols and the line)
3. **Bold markers**: Remove `**` wrapper characters, keep the text inside
4. **Section labels**: Remove structural labels like `## Post Body`, `## Comment Thread Content`, `## Notes`
5. **Horizontal rules**: Remove `---` separator lines
6. **Blockquotes**: Remove `>` prefix characters

**Preserve**:
- All emoji (⚡, 🧙‍♂️, ✌, etc.)
- Arrow markers (→)
- Line breaks and whitespace rhythm
- The actual content and its structure
- Sign-off line

### Step 4: Split into Sections

Separate the output into clearly labeled sections:

```
[POST BODY - the main post, ready to paste into LinkedIn's post composer]

=== COMMENT 1 ===
[first comment text]

=== COMMENT 2 ===
[second comment text]

=== COMMENT 3 ===
[third comment text]
```

- Extract post body: everything between `## Post Body` and the first `---` separator after it
- Extract comments: each `**Comment N:**` block becomes its own section
- Remove the `**Comment N:**` label itself -- just keep the content
- Drop the `## Notes` section entirely (internal only, not for publishing)

### Step 5: Save and Display

1. **Determine platform** from the draft's frontmatter or file path:
   - `content/linkedin/drafts/...` -> platform is `linkedin`
   - `content/x/drafts/...` -> platform is `x`
2. **Save to**: `content/{platform}/final/{original-filename-without-extension}.txt`
   - Example: `content/linkedin/drafts/2026-02-09_weekend-build.md` -> `content/linkedin/final/2026-02-09_weekend-build.txt`
   - Create the `final/` directory if it doesn't exist
3. **Display the full plain text inline** in the chat response so the user can copy-paste immediately
4. **Show confirmation**: `Ready to paste. Post body + {n} comments saved to {path}`
5. **Update draft status**: Change `**Status**: draft` to `**Status**: final` in the original markdown file's frontmatter

### Step 6: Push to Typefully (if `--typefully` flag is set)

If the user included `--typefully` in the command, push the post to Typefully as a draft using the Typefully MCP server.

1. **Push the post body** using `mcp_typefully_create_draft`:
   - `content`: The stripped plain text post body (NOT the comments -- those are posted separately on the platform)
   - `schedule_date`: If `--schedule` was provided, use that value. Accepts ISO 8601 timestamps or `"next-free-slot"`
   - `share`: Set to `true` to get a shareable preview link back

2. **Handle comments**: Comments are NOT pushed to Typefully (LinkedIn comments are posted manually or via a separate flow after the main post goes live). Display them inline in the chat for manual posting.

3. **Display confirmation**:
   ```
   Pushed to Typefully as draft.
   - Post body: sent to Typefully
   - Schedule: {schedule_date or "unscheduled -- edit in Typefully"}
   - Comments (post manually after publish):
     - Comment 1: {first 50 chars}...
     - Comment 2: {first 50 chars}...
     - Comment 3: {first 50 chars}...
   
   Open Typefully to review and publish: https://typefully.com
   ```

4. **If Typefully MCP is not connected**: Fall back gracefully. Show: "Typefully MCP not connected. Saved locally to {path}. Add the Typefully MCP server to push drafts directly."

**Typefully MCP Tool Reference**:
- `create_draft` -- creates a new draft. Parameters:
  - `content` (required): The post text
  - `schedule_date` (optional): ISO timestamp or `"next-free-slot"`
  - `threadify` (optional): Auto-split into thread (useful for X threads)
  - `share` (optional): Include shareable URL in response
  - `auto_retweet_enabled` (optional): Enable AutoRT
  - `auto_plug_enabled` (optional): Enable AutoPlug

## Output Format Example

```
this weekend i built two operating systems inside Cursor. not apps. not dashboards. operating systems for how i run GTM and how i create content.

let me show you what's in them.

⚡ the Go-To-Market Operating System

a git repo that holds everything i need to run outbound for any client:

→ client folders with ICP research, personas, prompt libraries, and campaign workflows
→ 15 documented plays running daily (Clay + HubSpot + Instantly + the full stack)
→ MCP server automations -- Instantly reply fetching, LinkedIn recon via Browserbase, HeyReach campaign exports, Slack alerts
→ every workflow versioned, every prompt documented, every pattern captured

one repo. four active clients. zero tribal knowledge.

[...rest of post...]

shawn ⚡ the gtme alchemist 🧙‍♂️

=== COMMENT 1 ===
that tree in the image? that's the actual repo structure...

=== COMMENT 2 ===
people keep asking what tools i'm using, so here's the stack...

=== COMMENT 3 ===
if you want to build something like this, start with one skill file...
```

## Error Handling

- **No draft found**: "No draft found in the current conversation or at the specified path. Try `/finalcopy content/linkedin/drafts/your-file.md`"
- **File isn't a draft**: "This file doesn't look like a content draft (no `## Post Body` section found). Are you sure this is the right file?"
- **No comments section**: That's fine -- just output the post body alone. Not every post has comment threads.
- **Already finalized**: If the draft status is already `final`, warn: "This draft was already finalized. Want to re-export anyway?"
- **Typefully MCP not available**: If `--typefully` flag is set but the MCP server isn't connected, save locally and show: "Typefully MCP not connected. Saved locally to {path}. Check your MCP settings or remove the --typefully flag."
- **Typefully push fails**: Save locally (always works) and show the error: "Saved locally but Typefully push failed: {error}. You can copy-paste from the local file."

## Examples

### Example 1: Approve and finalize the current draft
```
User: /finalcopy
Response:
  1. Reads the draft from current conversation context
  2. Strips markdown
  3. Displays plain text inline
  4. Saves to content/linkedin/final/2026-02-09_weekend-build.txt
  5. "Ready to paste. Post body + 3 comments saved to content/linkedin/final/2026-02-09_weekend-build.txt"
```

### Example 2: Finalize with last-minute adjustments
```
User: /finalcopy -- change "four active clients" to "multiple active clients"
Response:
  1. Applies the edit to the markdown draft
  2. Saves updated markdown
  3. Strips markdown to plain text
  4. Displays and saves final copy
  5. "Ready to paste. Applied 1 adjustment. Post body + 3 comments saved to ..."
```

### Example 3: Finalize a specific file
```
User: /finalcopy content/x/drafts/2026-02-09_x-comeback.md
Response:
  1. Reads the specified file
  2. Strips markdown
  3. Saves to content/x/final/2026-02-09_x-comeback.txt
  4. Displays inline + confirmation
```

### Example 4: Finalize and push to Typefully
```
User: /finalcopy --typefully
Response:
  1. Reads the draft from current conversation context
  2. Strips markdown to plain text
  3. Saves locally to content/linkedin/final/2026-02-09_weekend-build.txt
  4. Pushes post body to Typefully via create_draft
  5. Displays inline text + Typefully confirmation
  6. "Pushed to Typefully as draft. Open Typefully to review and publish."
```

### Example 5: Finalize, push, and schedule
```
User: /finalcopy --typefully --schedule "next-free-slot"
Response:
  1. Strips markdown, saves locally
  2. Pushes to Typefully with schedule_date: "next-free-slot"
  3. "Pushed to Typefully and queued for next free slot."
```

### Example 6: Finalize with adjustments and push
```
User: /finalcopy --typefully -- change "four active clients" to "multiple clients"
Response:
  1. Applies edit to markdown draft
  2. Strips markdown
  3. Saves locally + pushes to Typefully
  4. "Applied 1 adjustment. Pushed to Typefully as draft."
```
