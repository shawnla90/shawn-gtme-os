# Daily Tracker — Content OS Accountability System

> **Platform**: LinkedIn
> **Pillar**: Skill/System Shares
> **Date**: 2026-02-11
> **Status**: draft
> **Screenshot**: data/daily-log/2026-02-11.png

---

## Hook Options (5 alternatives for first line)

1. your content OS can't tell you what you shipped today. mine can.
2. most builders track their work in Notion. I built a tracker inside my code editor.
3. 13 accomplishments. 36 drafts in pipeline. 1 finalized post. all auto-detected from git.
4. you can't improve a system you don't measure. so I built a system that measures itself.
5. if your content system can't show you what you did today in one screenshot, it's not a system.

---

## Version 1: The System Reveal

your content OS can't tell you what you shipped today. mine can.

I built a daily activity tracker directly into my content operating system repo.

not a Notion board. not a spreadsheet. not a habit app.

a Python scanner that reads git commits, detects new drafts by filename date prefix, walks the content directories, and merges everything into a structured JSON log — automatically.

here's what it captured today (screenshot attached):

⚡ 13 accomplishments auto-detected
📋 36 active drafts across LinkedIn, X, Substack, Reddit
✅ 1 finalized Substack post (highlighted green)
🔧 2 pending TODOs with priority markers
📊 1 git commit tracked

the whole thing runs on two scripts:

`daily_scan.py` — stdlib-only Python. reads git log, scans untracked files, walks content/*/drafts/ and content/*/final/, merges with any manual entries you've added. never deletes what you wrote by hand.

`daily_dashboard.py` — Pillow image generator that renders a 1200x720 card following the same design system as every other image in the repo. dark flat background, Menlo font, green accent for completed items, muted gray for pipeline.

the scanner is the real magic. it knows the difference between auto-detected accomplishments and manual entries. re-run it 10 times and your hand-typed TODOs survive every scan. your done items stay done.

JSON-per-day format means clean git diffs, easy date queries, and no merge conflicts when multiple sessions touch the same day.

designed and built the full system — schema, scanner, dashboard, skill file — in a single session.

the best part: I type `/tracker` in Cursor and it shows me exactly what I shipped, what's next, and how deep the pipeline is. one command. one screenshot. full accountability.

no gatekeeping. the architecture breakdown is in the comments 👇

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Version 2: The Meta Take

you can't improve a system you don't measure. so I built a system that measures itself.

here's what I realized building content every day inside a code editor:

I had no idea what I actually shipped on any given day. drafts scattered across directories. commits buried in git log. TODOs living in my head or random chat threads.

the content OS was producing. but it couldn't tell me what it produced.

so I built a daily tracker directly into the repo.

a Python scanner that auto-detects activity from git commits + untracked files + content directory state. merges it all into a JSON log. renders a Pillow dashboard card that looks like it belongs in the system.

today's scan (screenshot attached):

⚡ 13 accomplishments — not hand-typed, auto-detected
📋 36 drafts in pipeline across 4 platforms
✅ 1 finalized Substack post highlighted in green
🔧 2 pending TODOs carried forward from manual entry

this is the part nobody talks about when they say build in public.

the system that tracks the building IS part of the build.

JSON-per-day format. stdlib-only scanner. manual entries survive re-scans. dashboard follows the same flat dark design system as every other generated image in the repo. Menlo font. green accents. no AI slop gradients.

the tracker doesn't just tell me what happened. it tells me what's stacking up, what's falling behind, and where the pipeline has gaps.

it turned my repo from a production system into an accountability system.

one `/tracker` command. one screenshot. full picture.

the meta lesson: if you're building a system but can't see what it's doing, you're flying blind. build the instrumentation. build it early.

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Version 3: The Invitation

if your content system can't show you what you did today in one screenshot, it's not a system yet.

I just built the missing piece of my content operating system.

a daily activity tracker that:
→ auto-detects accomplishments from git history
→ scans content directories for new drafts and finalized posts
→ preserves manual entries and TODO status across re-runs
→ renders a dashboard card matching the repo's design system
→ runs from a single Cursor command: `/tracker`

here's what today looked like (screenshot attached):

13 accomplishments auto-detected. 36 drafts in pipeline. 1 finalized Substack. 2 pending TODOs. 1 commit.

all captured in a JSON file that sits in `data/daily-log/2026-02-11.json`.

the design decisions matter more than the code:

🔹 JSON per day — not a single growing file. clean diffs, no merge conflicts
🔹 scanner never deletes manual entries — `source: "manual"` entries and TODOs survive every re-scan
🔹 auto-detection from git + filenames — committed files via git log, untracked files matched by YYYY-MM-DD prefix
🔹 stdlib only — no pip dependencies for the scanner. Pillow only for the dashboard image
🔹 same design system — dark flat, Menlo, green accent, 1200x720. matches every other generated image in the repo

the framework is simple enough to rebuild in an afternoon.

you need: a scanner that reads your version control + file system, a merge strategy that respects manual input, a schema that's one-file-per-day, and a renderer that makes it visual.

swap git for whatever tracks your work. swap content directories for whatever you produce. the structure transfers.

built the whole thing in one session. schema, scanner, dashboard, skill file. now every day has receipts.

if you're building a content system or any kind of daily production workflow — steal this pattern. make it yours.

breakdown of the architecture + schema in the comments 👇

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## Comment Thread Content

**Comment 1:**
architecture breakdown:

the tracker is two scripts + one skill file.

`daily_scan.py` handles detection:
- git log --since/--until for committed changes
- git ls-files --others for untracked files with date prefixes
- os.walk on content/*/drafts/ and content/*/final/
- merge logic that preserves source: "manual" entries and TODO done status

`daily_dashboard.py` handles rendering:
- reads the day's JSON
- left panel: accomplishments (color-coded by type)
- right panel: TODOs (green = done, yellow = high priority) + pipeline list
- overflow handling: truncates with "... +N more" when content exceeds panel height
- 1200x720, 144 DPI, flat dark palette, Menlo font

all invoked through `/tracker` commands in Cursor.

**Comment 2:**
the schema is intentionally simple — here's the full structure:

```
{
  "date": "YYYY-MM-DD",
  "accomplishments": [{ "type", "title", "path", "source" }],
  "pipeline": { "drafts_active": [...], "finalized_today": [...] },
  "todos": [{ "id", "task", "status", "priority" }],
  "git_summary": { "commits_today", "files_added", "files_modified" }
}
```

one file per day in data/daily-log/. the scanner writes it. the dashboard reads it. clean separation.

**Comment 3:**
if you want to build your own version — start with the scanner. that's where the value lives.

the dashboard is just presentation. the scanner is the intelligence layer that turns your existing workflow artifacts into structured data.

every builder already has the raw signal. git history, file timestamps, directory structure. the scanner just reads what's already there.

no gatekeeping. full skill file and scripts documented in the repo.

---

## Notes

- Screenshot: data/daily-log/2026-02-11.png — the generated Pillow dashboard card
- Key data from screenshot: 13 done, 2 pending, 36 drafts, 1 commit, dark flat design with green accents
- Pillar: Skill/System Shares — sharing the tracker framework + architecture for others to rebuild
- The dashboard image itself serves as the visual proof — built with the same design system as all repo images
- System was designed and built in a single session, which is a strong build-in-public moment
