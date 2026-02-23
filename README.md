# ShawnOS

**An AI-powered operating system for content creation and GTM automation — built in public.**

ShawnOS is a personal productivity and content operating system that gamifies daily output with an RPG progression system. Think of it as a "quantified self" meets "game engine" for professional work — where commits, content, and campaigns earn XP, unlock achievements, and level up your avatar.

## 🎮 Core Features

### RPG Progression System
- **XP & Leveling**: Automatically tracks commits, content posts, and GTM deliverables to calculate daily XP
- **Dynamic Titles**: Level-based titles that evolve as you progress (Terminal Initiate → Repo Architect → Codebase Sovereign)
- **Avatar Tiers**: Visual character progression with 6 distinct tiers and class-based variations
- **Milestones & Achievements**: Unlock achievements for hitting specific output targets (100 commits, 50 posts, etc.)
- **Letter Grades**: Daily output scored with efficiency ratings (S, A, B, C, D, F)

### Mono-Repo Architecture
Three-domain publishing system + mobile chat interface, powered by Turborepo:
- **shawnos.ai** — Main landing page and RPG dashboard
- **thegtmos.ai** — GTM operations showcase
- **thecontentos.ai** — Content portfolio and writing samples
- **ShawnOS Chat (NioBot V3)** — Multi-agent mobile PWA: DNA evolution system, chime packs, tamagotchi progression, zero API cost

All domains share a unified component library, design system, and terminal-inspired aesthetic.

### ShawnOS Chat — NioBot V3 (Multi-Agent Mobile AI)
A Next.js PWA that wraps the Claude CLI (`claude -p`) in an SSE API route. The recursive flywheel: Claude builds the system that Claude powers. Zero API cost (Max subscription).
- **Multi-agent platform**: 3 agents (Nio/Architect/Writer) with per-agent soul files, accent themes, session isolation
- **DNA system**: Server-authoritative evolution with SQLite persistence — XP, skills, streaks, and memory tracked server-side via `/api/dna` endpoints, with optimistic client-side updates and server reconciliation
- **Tamagotchi evolution**: 5 tiers (Spark → Ascended), 3 agent-mapped skills, XP from real usage, streak multipliers, avatar evolution, level-up notifications with floating +XP animations
- **Chime system**: 8-bit synth + MP3 sound packs (8-Bit, Halo, FMA), toggleable with volume control, event-driven playback from chat state transitions, iOS Safari audio unlock
- **iMessage-style chat UI** with markdown rendering, streaming responses, and per-agent bubble colors
- **Full tool access**: Bash, file ops, web search, Playwright browser control, MCP integrations
- **Session memory** via Claude CLI `--resume` flag with file-based memory snapshots
- **PWA**: Installable on iOS/Android, service worker with offline support, safe area handling
- **Security hardened**: HMAC-signed session tokens (24h TTL), sliding-window rate limiting, JSONL audit logging, CSP middleware
- **Cloudflare Tunnel** for secure remote access from any device

### Agent Skills Library
42+ invokable skills for Claude/Cursor IDE automation:
- Content generation workflows (`/finalcopy`, `/substackpost`, `/xtip`)
- GTM operations (`/heyreach-export`, `/instantly-replies`, `/campaign-copy-workflow`)
- Visual asset generation (`/aiosimage`, `/contentimage`, `/xtipimage`)
- Browser automation (`/linkedin-recon`, `/linkedin-comments`)
- Developer tooling (`/deploy`, `/webfix`, `/repostats`)

See `.cursor/skills/` for the full library.

### Voice Modularity System
Structured brand voice framework with 4 core playbooks:
- **Core Voice DNA** — Foundational writing style guide
- **Anti-Slop Filters** — Prohibited patterns and NPC-speak blocklist
- **Viral Hooks** — High-engagement opener templates
- **Safety Filters** — Partnership and IP protection rules

## 🏗️ Architecture Highlights

**Public Showcase** (this repo):
- UI/UX components and design system
- RPG data models and progression types
- Agent skills and workflow automation
- Content pipeline and publishing tools

**Proprietary Systems** (gitignored):
- Core XP calculation algorithms (`scripts/progression_engine.py`)
- Output scoring and grading logic (`scripts/daily_scan.py`)
- Avatar generation system (`scripts/avatar_generator.py`)
- GTM automation and enrichment pipelines (`scripts/`)
- Partner/client deliverables and workflows (`clients/`, `partners/`)

## 📊 Project Stats

- **42** agent skills
- **12** React/TSX components
- **227** avatar sprite variations
- **3** domain websites
- **15** proprietary Python scripts (gitignored)
- **93** content files (drafts + finals + published)

## 🛡️ IP Protection

This repo uses a dual-license structure:

- **Public code** (UI, components, design patterns): [Licensed for educational use](LICENSE)
- **Proprietary algorithms** (scoring, XP, business logic): All Rights Reserved (not publicly accessible)

See [IP_REGISTRY.md](IP_REGISTRY.md) for a full asset inventory and protection strategy.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Build**: Turborepo (mono-repo orchestration)
- **Deployment**: Vercel (3 domains), Cloudflare Tunnel (nio-chat)
- **Automation**: Python 3.x (proprietary scripts)
- **AI/Agentic**: Claude Opus 4.6, Claude CLI (Max), Playwright MCP, MCP servers
- **Infrastructure**: GitHub Actions, Vercel CLI, Cloudflare Tunnel

## 📝 Philosophy

This repo showcases the **architecture and patterns** behind a personal AI operating system, while keeping the **core algorithms proprietary**.

The goal is to build in public, share the "how I think" without giving away the "how it works."

If you're building your own productivity OS, content engine, or agentic workflow system — use this as inspiration, not a template.

## 📄 License

Licensed under [ShawnOS Proprietary License v1.0](LICENSE).

**TL;DR**: You can view, fork, and reference for educational purposes. You cannot use this code to build competing products.

---

Built by [Shawn Tenam](https://shawnos.ai) — shipping in public, one commit at a time.
