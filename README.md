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
Three-domain publishing system powered by Turborepo:
- **shawnos.ai** — Main landing page and RPG dashboard
- **gtm.shawnos.ai** — GTM operations showcase
- **content.shawnos.ai** — Content portfolio and writing samples

All domains share a unified component library, design system, and terminal-inspired aesthetic.

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
- **Deployment**: Vercel (3 domains)
- **Automation**: Python 3.x (proprietary scripts)
- **AI/Agentic**: Claude Sonnet, Cursor IDE, MCP servers
- **Infrastructure**: GitHub Actions, Vercel CLI

## 📝 Philosophy

This repo showcases the **architecture and patterns** behind a personal AI operating system, while keeping the **core algorithms proprietary**.

The goal is to build in public, share the "how I think" without giving away the "how it works."

If you're building your own productivity OS, content engine, or agentic workflow system — use this as inspiration, not a template.

## 📄 License

Licensed under [ShawnOS Proprietary License v1.0](LICENSE).

**TL;DR**: You can view, fork, and reference for educational purposes. You cannot use this code to build competing products.

---

Built by [Shawn Tenam](https://shawnos.ai) — shipping in public, one commit at a time.
