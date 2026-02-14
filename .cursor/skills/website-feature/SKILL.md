---
name: website-feature
description: Spin up the local dev environment and open a side-by-side browser preview for hybrid website editing. Start local servers, open the browser panel, and enter an interactive edit loop where you can visually inspect changes and direct the agent to make edits. Use when the user types /preview, /website, /livedit, or asks to edit the website, preview changes, work on the landing page, or tweak the UI.
---

# Website Feature — Hybrid Live Edit Mode

Spin up the local dev servers, open the Cursor browser side-by-side, and enter an interactive edit loop. You see every change in real-time. You can hand-edit code OR direct the agent — both reflect instantly in the browser preview.

## Command Patterns

- `/preview` — start dev servers + open browser preview (default: shawnos on port 3000)
- `/preview gtmos` — start dev servers + open browser preview for gtmos (port 3001)
- `/preview contentos` — start dev servers + open browser preview for contentos (port 3002)
- `/website` — alias for `/preview`
- `/livedit` — alias for `/preview`
- `/livedit <site> -- <instructions>` — start preview AND immediately apply edits

## Site Map

| App | Package Name | Port | URL |
|-----|-------------|------|-----|
| shawnos | `@shawnos/web` | 3000 | `http://localhost:3000` |
| gtmos | `@shawnos/gtmos` | 3001 | `http://localhost:3001` |
| contentos | `@shawnos/contentos` | 3002 | `http://localhost:3002` |

## Step 1: Check for Running Dev Server

Before starting anything, check if the dev server is already running:

1. **Scan terminal files** in the terminals folder — look for any terminal whose output contains `next dev`, `turbo run dev`, `ready started server on`, or `localhost:300`
2. **If a dev server is already running**: skip to Step 3. Report: "Dev server already running. Connecting to preview."
3. **If no dev server found**: proceed to Step 2

## Step 2: Start the Dev Server

1. **Check dependencies** — verify `node_modules` exists in `website/`:
   ```bash
   ls website/node_modules/.package-lock.json
   ```
   If missing, run `npm install` in the `website/` directory first (requires network permission).

2. **Start the Turbo dev server** in a backgrounded terminal:
   ```bash
   cd website && npm run dev
   ```
   - Use `block_until_ms: 0` to background it immediately — this is a long-running process
   - Wait 3-5 seconds, then read the terminal output to confirm servers are ready
   - Look for the "ready" messages from Next.js (one per app)
   - If after 15 seconds the servers haven't started, check for errors in the terminal output

3. **Report startup**:
   ```
   Dev Servers Started
   ───────────────────
   ✓ shawnos     → http://localhost:3000
   ✓ gtmos       → http://localhost:3001
   ✓ contentos   → http://localhost:3002
   
   All three apps are hot-reloading. Edits appear instantly.
   ```

## Step 3: Open Browser Preview

1. **Determine which site to preview**:
   - If user specified a site (e.g., `/preview gtmos`), use that site's port
   - Default: `http://localhost:3000` (shawnos)

2. **Open the Cursor built-in browser in the side panel**:
   - Use `browser_navigate` with the correct localhost URL
   - Set `position: "side"` to open it beside the code editor
   - Take a screenshot after navigation to confirm it loaded

3. **If the page shows an error or blank screen**:
   - The dev server might still be compiling. Wait 3 seconds and reload
   - If still broken, check the terminal output for build errors
   - Report the error to the user with the relevant terminal output

4. **Confirm the preview is live**:
   ```
   Live Preview Active
   ───────────────────
   Previewing: shawnos (localhost:3000)
   Browser: side panel (right)
   
   You can now:
   • Edit code — changes appear instantly in the preview
   • Tell me what to change — I'll edit and you'll see it live
   • Navigate the site in the browser to test different pages
   • Say "switch to gtmos" or "switch to contentos" to change sites
   ```

## Step 4: Interactive Edit Loop

Once the preview is live, enter the hybrid edit mode. The agent responds to instructions in real-time:

### Handling Edit Requests

When the user describes a change they want:

1. **Identify the target** — which file(s) need to change:
   - Page content → `website/apps/<site>/app/page.tsx` or the specific route
   - Shared components → `website/packages/shared/components/<Component>.tsx`
   - Styles/layout → check if it's Tailwind classes in the component
   - Site-specific components → `website/apps/<site>/components/`

2. **Make the edit** using StrReplace or Write tools

3. **Wait 1-2 seconds** for hot reload to process

4. **Take a screenshot** of the browser preview to show the result:
   - Use `browser_take_screenshot` to capture the current state
   - If the change is below the fold, scroll to it first with `browser_scroll`

5. **Report the change**:
   ```
   Applied: [description of change]
   Preview updated — check the side panel.
   ```

6. **If the user says "that's not right" or wants adjustments**: iterate immediately. Don't restart the server — just edit and let hot reload do its thing.

### Handling Navigation Requests

- "scroll down" → `browser_scroll` direction: down
- "go to /log" → `browser_navigate` to `http://localhost:<port>/log`
- "check mobile" → `browser_resize` to 390x844 (iPhone viewport)
- "back to desktop" → `browser_resize` to 1280x800
- "switch to gtmos" → `browser_navigate` to `http://localhost:3001`
- "switch to contentos" → `browser_navigate` to `http://localhost:3002`

### Handling Visual Feedback

If the user references something visual ("that button looks off", "the spacing is weird", "the text is too small"):

1. **Take a snapshot** with `browser_snapshot` to understand the current DOM state
2. **Identify the component** responsible for the visual issue
3. **Read the component file** to find the relevant Tailwind classes or styles
4. **Propose the fix** — describe what you'll change and why
5. **Apply it** and screenshot the result

## Step 5: Wrapping Up

When the user is done editing (signals like "looks good", "that's it", "done", "ship it"):

1. **Summarize all changes made** during the session:
   ```
   Session Summary
   ───────────────
   Files modified: 3
   • website/packages/shared/components/TypewriterHero.tsx — updated heading size
   • website/apps/shawnos/app/page.tsx — added new CTA section
   • website/packages/shared/components/LogHero.tsx — adjusted spacing
   
   All changes are local. The dev server is still running.
   ```

2. **Offer next steps**:
   - "Run `/deploy` to push these changes live to all three sites."
   - "Or keep editing — the preview is still active."

3. **Do NOT stop the dev server** — leave it running so the user can continue hand-editing if they want. The server will stop when they close the terminal.

## Site Switching

If the user wants to preview a different site mid-session:

1. Navigate the browser to the other site's localhost port
2. No need to restart the dev server — all three are already running via Turbo
3. Report: "Switched to gtmos (localhost:3001). Preview updated."

## Responsive Testing

Support quick responsive checks without leaving the preview:

| Command | Viewport | Device |
|---------|----------|--------|
| "check mobile" | 390 x 844 | iPhone 14 |
| "check tablet" | 768 x 1024 | iPad |
| "check desktop" | 1280 x 800 | Laptop |
| "full width" | 1920 x 1080 | Desktop |

After resizing, take a screenshot so the user can see the result.

## Error Handling

- **Port already in use**: Another process is using the port. Run `lsof -ti:3000 | xargs kill` (with user confirmation) then retry
- **Module not found**: Run `npm install` in `website/` directory
- **Build error in terminal**: Read the error, identify the file and line, report it to the user with a fix suggestion
- **Browser shows 404**: The route doesn't exist. Check `website/apps/<site>/app/` for the correct page structure
- **Hot reload not working**: Suggest the user save the file (Cmd+S). If still stuck, reload the browser with `browser_reload`

## Architecture Reference

```
website/
├── apps/
│   ├── shawnos/      → localhost:3000 → shawnos.ai
│   ├── gtmos/        → localhost:3001 → thegtmos.ai
│   └── contentos/    → localhost:3002 → thecontentos.ai
├── packages/
│   └── shared/       → shared components, lib, styles
│       ├── components/  → TypewriterHero, LogHero, AvatarBadge, etc.
│       └── lib/         → utilities, rpg helpers, etc.
└── turbo.json        → orchestrates all three apps
```

Shared components auto-propagate — editing a shared component updates all three sites simultaneously in the preview.
