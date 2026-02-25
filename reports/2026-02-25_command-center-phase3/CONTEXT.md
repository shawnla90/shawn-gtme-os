# Command Center Phase 3 — Decision Lock

**Date:** 2026-02-25
**Scope:** Xcode Command Center live updates + markdown editor. Includes: expanded FileWatcher, live git commit streaming, visual markdown editor (read/render/edit/save), Nio status heartbeat widget, new file toast notifications. Does NOT include: web Mission Control changes, public/private split, CRM features, or new module creation.
**Domains:** Visual/UI, API/Data, Operations

---

## Decisions

1. **FileWatcher scope:** Expand from `content/` + `data/` to also watch `reports/` and `souls/`. Do NOT watch `website/` or `ShawnOSCommandCenter/Sources/` — too noisy.

2. **Live refresh mechanism:** Central refresh bus via AppState. `FileWatcher.lastChange` already publishes — views use `.onChange(of: appState.fileWatcher.lastChange)` to re-fetch from their own stores. No per-module watcher instances.

3. **Git streaming:** Watch `.git/refs/heads/main` via FileWatcher (add this path to watched directories). When the file changes, GitStore re-runs `git log`. Zero polling — event-driven only.

4. **Markdown editor — write path:** Direct Swift `FileManager` writes in `FileSystemStore`. Use `.atomicWrite` option. No shell scripts, no intermediate layer.

5. **Markdown editor — editable directories:** Restrict writes to `content/`, `souls/`, `data/nio-memory/` only. All other `.md` files are read-only in the UI. Editor must check the file path before enabling edit mode.

6. **Nio heartbeat display:** Persistent small widget in the sidebar, visible across all modules. Shows: status, mood, current task, last_active timestamp. Reads from `niobot.db` via NioBotStore. Refreshes on FileWatcher trigger (when niobot.db changes).

7. **New file notifications:** Toast/banner notification when FileWatcher detects a new file (not just modification). Shows filename + "Jump to" action that navigates to the relevant module. Dismisses after 5 seconds or on click.

## Deferred Ideas

- [ ] Web Mission Control public/private split — separate `/discuss` session needed
- [ ] Nio status write API — Nio needs to write status/mood/task to niobot.db (requires Nio-side changes, not CC)
- [ ] CRM module in Xcode CC — low priority, web MC already has it
- [ ] Live terminal/build output panel — would be cool but not this phase
- [ ] Two-way sync between web MC and Xcode CC — future bridge work

## Claude's Discretion

- Toast notification styling: will use a floating overlay anchored top-right, dark background with accent border, matching `Theme.swift` tokens
- FileWatcher debounce: will keep existing ~1 second debounce for modifications, but fire immediately for new file creation events (differentiate via FSEvent flags)
- Git commit detail in live stream: will reuse existing `CommitTrackerView` and `CommitDetailView` — no new views needed, just wire the refresh
- Markdown editor toggle: will use a segmented control (View | Edit) in the toolbar of `ContentDetailView`, not a separate editor view
