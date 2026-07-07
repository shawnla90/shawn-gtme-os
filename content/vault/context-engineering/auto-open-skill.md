---
title: The auto-open skill
description: After an agent produces something you're meant to look at, it opens it for you automatically instead of printing a path. The small skill that kills the "now go find the file" step.
source: ~/.claude/skills/auto-open/SKILL.md
updated: 2026-07-06
order: 5
---

# auto-open — reveal the deliverable, don't just print a path

## What this is
When an agent finishes something you're meant to look at, it should open it for you automatically — not print a path and wait. On a Mac that's `open <path>` for a file, or `open <folder>` (or reveal in Finder) for a set. It kills the "now go dig for the file" step, which is real friction when you run multiple sessions across a dozen folders.

## When it fires — viewable deliverables
- images, slides, diagrams
- video and audio renders
- PDFs
- rendered HTML or a local preview URL
- exported sheets / CSVs
- screenshots
- final rendered outputs and generated docs you asked for

## When it does NOT fire — working files
Never auto-open the stuff you're not reviewing:
- scripts and source code (unless you explicitly ask to see it)
- configs, env files, lockfiles, JSON
- logs, temp and scratch files

## Rules
- Open **once per deliverable at the end of the step** — never spam it mid-render or on every intermediate file.
- For a **batch**, open the containing **folder** (or reveal in Finder), not each file.
- **Still print the path** in text, so it stays clickable and on record.

## How (macOS)
```bash
open "deliverable.mp4"        # open a file in its default app
open "output-folder"          # open a folder of outputs in Finder
open -R "file"                # reveal + highlight a file in Finder
open "http://localhost:3000"  # open a local preview in the browser
```
Other platforms: Linux `xdg-open`, Windows `start`.

## The idea
Finder isn't great, and when you're multi-session across many folders, one skill that puts the output in front of you saves friction every single time. Small skill, constant payoff.
