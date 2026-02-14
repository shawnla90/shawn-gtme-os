---
name: RPG Deploy Checklist — Local View → Deploy
overview: Full trackable checklist to get RPG preview running locally and deployed to Vercel. Covers avatar assets, gitignore, dev server, and deploy.
todos:
  - id: preflight-deps
    content: Run npm install in website/ and verify node_modules exist
    status: pending
  - id: add-avatar-assets
    content: Create data/progression/avatars/ and add placeholder PNG/GIF files for tier 1-6
    status: pending
  - id: fix-gitignore
    content: Update .gitignore to allow data/progression and data/progression/avatars
    status: pending
  - id: run-local-preview
    content: Start dev server (cd website && npm run dev), open localhost:3000/rpg-preview
    status: pending
  - id: verify-route-path
    content: Verify progression route AVATAR_DIR path resolves correctly for cwd
    status: pending
  - id: deploy-to-vercel
    content: Run /deploy to commit, push, and trigger Vercel deployment
    status: pending
isProject: true
---

# RPG Deploy Checklist — Local View → Deploy

Full trackable setup. Run tasks in order. All 6 tasks must complete for local preview + live deploy.

---

## Execution Order

```
Time ─────────────────────────────────────────────────────────────────────────────>

Track 1 (sequential — do in order):
  [1: Preflight deps]     ──>
  [2: Avatar assets]     ──────────>
  [3: Fix gitignore]      ──>
  [4: Run local preview]  ──────>
  [5: Verify route path]  ──>
  [6: Deploy]             ──────────>
```

**Summary:** Run 1–6 in order. Task 2 blocks 4 (no images without assets). Task 3 blocks 6 (assets won't deploy without gitignore fix).

---

## Task Assignments

### 1. Preflight — Dependencies

**What to do:**

- In terminal: `cd /Users/shawntenam/Desktop/shawn-gtme-os/website && npm install`
- Verify: `ls website/node_modules/.package-lock.json` exists (or `node_modules` is populated)
- If install fails: check Node version (`node -v`), ensure npm has write access

**Agent recommendation:** Fast model — single command, no code changes.

---

### 2. Add Avatar Assets

**Files:** `data/progression/avatars/` (create dir + assets)

**What to do:**

1. Create directory: `mkdir -p data/progression/avatars`
2. Add placeholder or real sprite files. Required filenames per [rpg.ts](website/packages/shared/lib/rpg.ts):
   - `tier-1-idle.gif`, `tier-1-idle-advanced.gif`
   - `tier-1-action.gif`, `tier-1-action-advanced.gif`
   - `tier-1-static.png`, `tier-1-static-advanced.png`
   - Repeat for tiers 2–6.
3. **Placeholder option:** Create 72x72px solid-color PNGs (e.g. with Pillow or ImageMagick) for each `tier-{n}-static.png`. Copy as `.gif` if needed for idle/action (same image is fine as placeholder).
4. **Minimal test:** At least add `tier-1-static.png`, `tier-1-idle.gif`, `tier-1-action.gif` so tier 1 renders.

**Agent recommendation:** Sonnet — directory creation, optional image generation, file naming.

---

### 3. Fix .gitignore

**File:** [.gitignore](.gitignore)

**What to do:**

- Add exceptions so `data/progression/` and avatar assets are tracked:
  ```
  !data/progression/
  !data/progression/avatars/
  ```
- Place after the existing `data/*` and `!data/daily-log/` lines.
- Ensure `data/progression/avatars/*.png` and `*.gif` are not excluded by other rules.

**Agent recommendation:** Fast model — 2-line edit.

---

### 4. Run Local Preview

**What to do:**

1. Start dev server: `cd website && npm run dev`
2. Wait for "ready" from Next.js (3–5 seconds).
3. Open in browser: `http://localhost:3000/rpg-preview`
4. Verify: 11 tier cards render with images (not broken). Class showcase and raw data table visible.
5. Optional: also check `http://localhost:3000/log` and `http://localhost:3000/log/2026-02-14` for AvatarBadge on hero.

**Agent recommendation:** Fast model — terminal commands, visual check.

---

### 5. Verify Route Path

**File:** [website/apps/shawnos/app/progression/avatars/[[...path]]/route.ts](website/apps/shawnos/app/progression/avatars/[[...path]]/route.ts)

**What to do:**

- Current: `path.join(process.cwd(), '../../../data/progression/avatars')`
- When Next.js runs from `website/`, cwd may be `website/`. Use `../../data/progression/avatars` (2 levels up from website to repo root).
- When Next.js runs from `website/apps/shawnos`, use `../../../../data/progression/avatars` (4 levels up).
- Test: if `/rpg-preview` shows broken images and assets exist in `data/progression/avatars/`, adjust the path. From Turborepo root `website/`, `../../` = repo root, so: `path.join(process.cwd(), '../../data/progression/avatars')` if cwd is `website/`.

**Agent recommendation:** Fast model — path logic, 1-line edit.

---

### 6. Deploy to Vercel

**What to do:**

1. Ensure tasks 2 and 3 are done (assets exist, gitignore updated).
2. Stage and commit: `git add data/progression/ .gitignore` (and any other changed files).
3. Run `/deploy` or: `git commit -m "feat: add RPG avatar assets and progression for deploy" && git push origin HEAD`
4. Vercel auto-deploys from main. Check [Vercel dashboard](https://vercel.com/dashboard) or MCP for status.
5. Verify live: `https://shawnos.ai/rpg-preview`

**Agent recommendation:** Use `/deploy` skill — handles staging, commit, push, verification.

---

## Model Recommendations Summary

| Task | Complexity | Model | Why |
|------|-------------|-------|-----|
| 1: Preflight deps | Low | Fast | Single npm command |
| 2: Avatar assets | Medium | Sonnet | Dir creation, optional image gen |
| 3: Fix gitignore | Low | Fast | 2-line edit |
| 4: Run local preview | Low | Fast | Commands + visual check |
| 5: Verify route path | Low | Fast | Path logic, 1-line fix |
| 6: Deploy | Low | /deploy skill | Commit, push, verify |

No heavyweight model needed. Task 2 is the only one that may require image generation.

---

## Quick Reference — Commands

```bash
# 1. Preflight
cd website && npm install

# 2. Create avatars dir (then add files)
mkdir -p data/progression/avatars

# 4. Run local
cd website && npm run dev
# → http://localhost:3000/rpg-preview
```

---

## Where to See RPG UI

| Page | URL | What |
|------|-----|------|
| RPG preview | `http://localhost:3000/rpg-preview` | All tiers, classes, data table |
| Log home | `http://localhost:3000/log` | AvatarBadge on hero |
| Log date | `http://localhost:3000/log/2026-02-14` | Full log + avatar |
| Skill guide | `http://localhost:3000/log/skill-guide` | RPG overview, title table |

*rpg-preview is not in nav — go directly to `/rpg-preview`.*
