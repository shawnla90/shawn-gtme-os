---
name: webfix
description: Quick CSS, component, and styling fixes for the website with instant dev server preview. Handles dev server restarts, port conflicts, and provides immediate visual feedback. Use when the user wants to make quick edits to the website and see them live, or when they type /webfix.
---

# WebFix — Agile Website Editing

Fast, surgical edits to website components, styles, and pages with instant browser preview. Handles dev server lifecycle automatically.

## Command Patterns

- `/webfix` — edit the website and preview changes live
- `/webfix <instructions>` — apply specific changes and preview
- "fix the spacing on the blog" → trigger webfix
- "change the header color" → trigger webfix
- "preview this change" → trigger webfix

## When to Use This Skill

Use webfix for:
- Quick CSS/styling changes (spacing, colors, fonts, margins)
- Component text edits (headings, copy, CTAs)
- Layout tweaks (padding, alignment, responsive fixes)
- Any edit where you want immediate visual feedback

**Don't** use for:
- Large features or new pages (use `/preview` or `website-feature` skill)
- Complex multi-file refactors (use regular edit workflow)

---

## Step 1: Pre-Flight Check

Before making any edits:

1. **Ask what needs to change**
   - If the user gave clear instructions, proceed
   - If vague ("fix the blog"), ask: "What specifically should I change? (spacing, colors, layout, text, etc.)"

2. **Identify target files**
   
   **CRITICAL - Blog Post Edits:**
   - Blog posts render from: `content/website/final/*.md` ← **EDIT THIS**
   - Draft files at `content/drafts/*.md` are NOT rendered on the website
   - If user says "edit the blog post", they mean the file in `content/website/final/`
   
   **Other Website Files:**
   - Page-specific: `website/apps/<site>/app/**/*.tsx`
   - Shared components: `website/packages/shared/components/*.tsx`
   - Styles: `website/apps/<site>/app/globals.css` or component-level Tailwind
   - Blog prose styles: `website/apps/shawnos/app/globals.css` → `.prose` class

3. **Read the file** to understand current state before editing

---

## Step 2: Apply the Edit

1. **Make the change** using StrReplace
   - For CSS: Show the before/after lines clearly
   - For components: Flag what changed and why
   
2. **Common Edit Patterns**:

   **Add paragraph spacing** (blog posts):
   ```css
   .prose p {
     margin-bottom: 1.25em;
   }
   ```

   **Adjust component spacing**:
   ```tsx
   // Before
   <div style={{ marginBottom: 32 }}>
   
   // After
   <div style={{ marginBottom: 48 }}>
   ```

   **Change colors**:
   ```css
   :root {
     --accent: #4EC373;
   }
   ```

---

## Step 3: Dev Server Lifecycle

### Check Server Status

1. **Look for running dev server** — scan terminals folder for active Next.js process:
   ```bash
   grep -l "npm run dev" /path/to/terminals/*.txt
   ```
   Check the most recent terminal file for:
   - `Ready in` → server is running
   - `EADDRINUSE` → port conflict
   - Error messages → server failed

2. **Determine action**:
   - **Server running & healthy** → skip to Step 4
   - **Server running but on wrong port** → kill and restart
   - **No server running** → start fresh
   - **Server errored** → diagnose and restart

### Handle Port Conflicts

If you see `EADDRINUSE: address already in use :::3000`:

1. **Kill the existing process**:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```
   Use `required_permissions: ["all"]` for the kill command

2. **Wait 1 second** for the port to free up

3. **Proceed to start server**

### Start Dev Server (if needed)

Only if no healthy server is running:

```bash
cd website/apps/shawnos && npm run dev
```

**Critical settings**:
- `block_until_ms: 0` — background the process immediately
- `required_permissions: ["all"]` — avoid sandbox network errors
- `working_directory: "/Users/shawntenam/Desktop/shawn-gtme-os/website/apps/shawnos"`

**Wait for ready**:
1. Sleep 4-5 seconds after starting
2. Read the terminal output file to confirm:
   ```
   ✓ Ready in 1183ms
   - Local:        http://localhost:3000
   ```
3. If you see errors, report them and troubleshoot

### Common Server Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `EADDRINUSE: address already in use` | Port 3000 taken | Kill process with `lsof -ti:3000 \| xargs kill -9` |
| `uv_interface_addresses returned Unknown system error` | Sandbox network block | Use `required_permissions: ["all"]` |
| `Module not found` | Missing deps | Run `npm install` in `website/` |
| Server hangs / no "Ready" message | Build error | Read terminal output, find error, fix file |

---

## Step 4: Verify the Change

After the edit is applied and the server is confirmed running:

1. **Wait 2 seconds** for hot reload to process the change

2. **Open or refresh the browser** (optional but helpful):
   - If you want visual confirmation, navigate to `http://localhost:3000` (or the relevant page)
   - Take a screenshot to show the result
   - **Don't force this** — only if the user asked for visual preview or you need to verify

3. **Report the change**:
   ```
   Applied: Added paragraph spacing to .prose class
   
   Dev server: running at localhost:3000
   File edited: website/apps/shawnos/app/globals.css
   
   Changes are live. Refresh your browser to see the update.
   ```

4. **If the user says "it didn't work" or "still looks wrong"**:
   - Ask them to describe what they see
   - Take a browser snapshot or screenshot if needed
   - Iterate on the fix immediately — no need to restart the server

---

## Step 5: Iteration Loop

The dev server is **hot-reloading**. Edits appear instantly. Don't restart the server between changes.

**User feedback patterns**:

| User Says | Action |
|-----------|--------|
| "That's not quite right" | Ask what they see vs. what they want → edit again |
| "Can you make it bigger?" | Adjust the value → save → confirm in 2 seconds |
| "Perfect" / "Looks good" | Done → leave server running |
| "Show me" / "Preview" | Open browser, take screenshot |
| "Undo that" | Revert the last change using StrReplace |

**Leave the server running** at the end unless the user explicitly says to stop it.

---

## Step 6: Wrap-Up

When the user signals they're done ("that's it", "looks good", "done"):

1. **Summarize edits**:
   ```
   Session Summary
   ───────────────
   Files modified: 1
   • website/apps/shawnos/app/globals.css — added .prose p spacing
   
   Dev server: still running (localhost:3000)
   Changes: local only (not deployed)
   ```

2. **Next steps**:
   - "Run `/deploy` to push changes live to all three sites."
   - "Or keep editing — the server is still running."
   - "Say `/webfix` again to make more changes."

3. **Do NOT kill the server** — let it keep running so the user can hand-edit or run `/webfix` again

---

## Architecture Quick Reference

```
website/
├── apps/
│   ├── shawnos/           → localhost:3000 → shawnos.ai
│   │   ├── app/
│   │   │   ├── page.tsx   → landing page
│   │   │   ├── globals.css → site-wide styles + .prose for blog
│   │   │   ├── blog/
│   │   │   ├── log/
│   │   │   └── rpg-preview/
│   ├── gtmos/             → localhost:3001 → thegtmos.ai
│   └── contentos/         → localhost:3002 → thecontentos.ai
├── packages/
│   └── shared/
│       ├── components/    → TypewriterHero, LogHero, AvatarBadge
│       └── styles/        → shared CSS variables
└── turbo.json             → orchestrates all apps
```

**Key files for quick edits**:
- **Blog post content**: `content/website/final/<slug>.md` ← actual rendered content
- **Blog post styles**: `website/apps/shawnos/app/globals.css` → `.prose` class
- Landing page: `website/apps/shawnos/app/page.tsx`
- Shared hero component: `website/packages/shared/components/TypewriterHero.tsx`
- Color accents: `website/apps/shawnos/app/globals.css` → `:root --accent`

**DO NOT edit** `content/drafts/*.md` when the user asks to change the blog post — those are not rendered on the website.

---

## Examples

### Blog post text edit
```
User: In the blog post, change "partner operations" to just "operations"

1. Read content/website/final/hello-world.md (NOT content/drafts/)
2. Find the line: "outreach campaigns, partner operations, and..."
3. Replace with: "outreach campaigns, operations, and..."
4. Check dev server (running)
5. Wait 2s for hot reload
6. Report: "Edit applied. Refresh localhost:3000/blog/hello-world"
```

### Quick CSS spacing fix
```
User: The blog paragraphs are too close together

1. Read website/apps/shawnos/app/globals.css
2. Find .prose class (no p spacing defined)
3. Add: .prose p { margin-bottom: 1.25em; }
4. Check dev server status (already running)
5. Wait 2s, report: "Added paragraph spacing. Refresh to see."
```

### Change accent color
```
User: /webfix make the green lighter

1. Read website/apps/shawnos/app/globals.css
2. Find :root { --accent: #4EC373; }
3. Change to: --accent: #5FD485;
4. Server is running, no restart needed
5. Report: "Lightened accent color. Check localhost:3000."
```

### Server was down
```
User: /webfix add more spacing to the hero

1. Read TypewriterHero.tsx
2. Identify spacing prop to change
3. Apply edit
4. Check for running server → none found
5. Start dev server: cd website/apps/shawnos && npm run dev
6. Wait 5s, confirm "Ready in 1183ms"
7. Report: "Edit applied. Dev server started at localhost:3000."
```

### Port conflict
```
User: /webfix

1. Start dev server
2. See error: EADDRINUSE :::3000
3. Run: lsof -ti:3000 | xargs kill -9 (with permissions: ["all"])
4. Wait 1s
5. Retry: npm run dev
6. Success → report ready
```

---

## Success Criteria

A webfix session is successful when:
- ✓ The edit was applied correctly to the right file
- ✓ The dev server is running and healthy (localhost:3000 shows "Ready")
- ✓ Hot reload processed the change (wait 2s after edit)
- ✓ User confirms the change looks correct OR you took a screenshot to verify
- ✓ Server remains running for next iteration or manual edits

---

## Skill Maintenance Notes

**If this skill fails repeatedly on server restarts**:
- Check if the sandbox network restrictions changed
- Verify `required_permissions: ["all"]` is set for npm commands
- Confirm the working directory is absolute path to `website/apps/shawnos`

**If hot reload isn't working**:
- User may need to manually save the file (Cmd+S)
- Try browser_reload tool to force refresh
- Check terminal output for build errors

**If port conflicts persist**:
- Multiple dev servers might be running (check all terminals)
- User may have manually started a server in iTerm (check external terminals)
- Nuclear option: `killall node` then restart (requires user approval)
