---
name: RPG Scoring, Sprites, Avatar Wiring
overview: Fix scoring thresholds (300 not S), rpg-preview every-other broken sprite, and wire profile+avatar to Home/Log so leveled sprite shows instead of terminal blink.
todos:
  - id: scoring-thresholds
    content: Raise S threshold 300→350 in daily_scan.py, update SKILL + build-your-own
    status: completed
  - id: rescore-optional
    content: Run rescore_logs.py to recompute grades for existing JSON (optional)
    status: completed
  - id: rpg-preview-variant
    content: Use early variant only in rpg-preview until -advanced assets exist
    status: pending
  - id: wire-home-avatar
    content: Home page — load profile, resolve avatar URLs, pass to AvatarBadge
    status: pending
  - id: wire-log-avatar
    content: Log page — load profile, resolve avatar URLs, pass to LogHero
    status: pending
isProject: false
---

# RPG Scoring, Sprites, and Avatar Wiring

---

## Execution Diagram

```
Time ─────────────────────────────────────────────────────────────────────>

Track A (parallel):
  [T1: Scoring thresholds]   ──────────>
  [T2: Rescore optional]    ──>
  [T3: rpg-preview variant] ──────────>

Track B (parallel, different files):
  [T4: Wire home avatar]    ──────────>
  [T5: Wire log avatar]     ──────────>
```

**Summary:** T1, T2, T3 can run in parallel (scripts vs website). T4 and T5 can run in parallel (different pages: page.tsx vs log/page.tsx). No dependencies between tracks.

---

## Task Assignments

### T1. Raise S Threshold (300 → 350)

**Files:** [scripts/daily_scan.py](scripts/daily_scan.py), [.cursor/skills/daily-tracker/SKILL.md](.cursor/skills/daily-tracker/SKILL.md), [website/apps/shawnos/app/log/build-your-own/page.tsx](website/apps/shawnos/app/log/build-your-own/page.tsx), [website/apps/gtmos/app/log/build-your-own/page.tsx](website/apps/gtmos/app/log/build-your-own/page.tsx), [website/apps/contentos/app/log/build-your-own/page.tsx](website/apps/contentos/app/log/build-your-own/page.tsx)

**What to do:**

- In `daily_scan.py` line 115: Change `(300, "S")` to `(350, "S")` in `GRADE_THRESHOLDS`
- Update embedded threshold table in SKILL.md and all 3 build-your-own pages: S 350–500 (not 300–500)

**Agent recommendation:** Fast model — find-and-replace in 5 files.

---

### T2. Rescore Existing Logs (Optional)

**File:** Run `python3 scripts/rescore_logs.py` from repo root

**What to do:**

- After T1: Run rescore to recompute `letter_grade` for all daily-log JSON files
- User may skip if they prefer manual re-runs of daily_scan

**Agent recommendation:** Fast model — single command. Optional task.

---

### T3. rpg-preview Use Early Variant Only

**File:** [website/apps/shawnos/app/rpg-preview/page.tsx](website/apps/shawnos/app/rpg-preview/page.tsx)

**What to do:**

- Line 184: Replace `const variant = idx % 2 === 1 || tier.avatar_tier === 6 ? 'advanced' : 'early'`
- With `const variant = 'early' as const`
- Add comment: `// Use early until tier-N-*-advanced.gif assets exist`

**Agent recommendation:** Fast model — one-line change.

---

### T4. Wire Profile + Avatar to Home Page

**File:** [website/apps/shawnos/app/page.tsx](website/apps/shawnos/app/page.tsx)

**What to do:**

- Import `getRPGProfile` from `@shawnos/shared/lib` (rpg.server), `getAvatarUrlsForProfile` from `rpg`
- Resolve at top of component: `dataRoot = path.join(process.cwd(), '../../../data')`, `profile = getRPGProfile(dataRoot)`, `urls = profile && profile.level > 0 ? getAvatarUrlsForProfile(profile) : null`
- Replace `<AvatarBadge size="compact" />` with `<AvatarBadge size="compact" profile={profile ?? undefined} avatarSrc={urls?.static ?? undefined} avatarIdleSrc={urls?.idle ?? undefined} avatarActionSrc={urls?.action ?? undefined} />`

**Agent recommendation:** Fast model — add resolver block and prop passing.

---

### T5. Wire Profile + Avatar to Log Page

**Files:** [website/apps/shawnos/app/log/page.tsx](website/apps/shawnos/app/log/page.tsx), [website/packages/shared/components/LogHero.tsx](website/packages/shared/components/LogHero.tsx)

**What to do:**

- Same resolver as T4: `dataRoot`, `profile`, `urls`
- LogHero currently accepts only `avatarSrc`. Extend LogHero props: add `avatarIdleSrc` and `avatarActionSrc`, forward all three to AvatarBadge
- In log/page.tsx: pass `profile={profile} avatarSrc={urls?.static} avatarIdleSrc={urls?.idle} avatarActionSrc={urls?.action}` to LogHero

**Agent recommendation:** Fast model — extend LogHero props, wire resolver in log page.

---

## Model/Agent Recommendations Summary


| Task                    | Complexity | Recommended Model | Why                                    |
| ----------------------- | ---------- | ----------------- | -------------------------------------- |
| T1: Scoring thresholds  | Low        | Fast              | Find-and-replace in 5 files            |
| T2: Rescore             | Low        | Fast              | Single command, optional               |
| T3: rpg-preview variant | Low        | Fast              | One-line change                        |
| T4: Wire home avatar    | Low        | Fast              | Resolver + props                       |
| T5: Wire log avatar     | Low        | Fast              | Same pattern as T4; may extend LogHero |


You do NOT need Sonnet for any of these. All files are small; largest is page.tsx.