# NioBot V2 — Planning Prompt

Paste this into a new Claude Code session to enter plan mode:

---

read the following files first, in this order:

1. ~/.claude/context-handoff.md
2. ~/.claude/projects/-Users-shawnos-ai-shawn-gtme-os-website-apps-nio-chat/memory/MEMORY.md
3. ~/.openclaw/workspace/MEMORY.md
4. website/apps/nio-chat/ (scan the full app structure)
5. content/linkedin/about-me-update.md

then enter plan mode for NioBot V2. here's the vision:

## what NioBot is

Nio is an AI ops agent with its own IP. pixel robot avatar (owned), personality (built), memory system (live), and a production website at shawnos.ai. Nio is not a generic chatbot. Nio is a site guardian, system operator, and public-facing mascot for the GTMe OS.

the current version (v1) is a Claude Code CLI session with:
- persistent memory (MEMORY.md loaded every session)
- context handoffs between sessions
- browser control (Playwright + native Chrome)
- Typefully integration for social posting
- SQLite database access
- full monorepo file system access
- voice rules and anti-slop enforcement

## what V2 needs to solve

1. **productization**: turn the CLI workflow into something packageable. a developer connects their repo, adds their API key, configures a soul file, and they have their own Nio. the scaffolding should be repeatable.

2. **app experience**: the nio-chat app (website/apps/nio-chat/) is the phone-friendly interface. v2 should make this the primary interaction layer, not just WhatsApp or CLI. custom UI, not someone else's platform.

3. **context window management**: design a system for mid-session checkpoints. the CLI loses everything on close. v2 needs automatic memory flushes at token thresholds (like OpenClaw's 40k flush), plus structured session logs that feed back into the memory system.

4. **multi-agent routing**: Nio is the brain. but some tasks should route to cheaper/faster models. plan how agent routing works within the Claude Code framework. what stays on Opus, what drops to Haiku or Sonnet, what runs locally on Ollama.

5. **guard rails**: the CLI has raw system access. for a productized version, define what's sandboxed vs open. file access scoping, command allowlists, destructive action gates.

6. **IP and brand**: Nio has a pixel avatar with tier progression (Spark → Blade → etc). the avatar, name, and personality are owned IP. plan how this shows up in the app UI, marketing site (potentially niobot.ai), and developer experience.

7. **website guardian role**: Nio should actively monitor shawnos.ai, thegtmos.ai, thecontentos.ai. uptime checks, content freshness, broken links, deploy status. not just reactive ops, proactive site health.

## what to plan

- architecture for v2 (what changes from v1, what stays)
- the developer setup flow (repo → config → key → soul → running)
- memory system v2 (auto-flush, session logs, cross-session knowledge graph)
- agent routing table (which models handle what)
- nio-chat app v2 features (UI, auth, session persistence, agent switching)
- guard rail framework (permissions, sandboxing, action gates)
- niobot.ai marketing site scope (what goes there vs shawnos.ai)
- monetization angle (is this a product? a framework? a template? all three?)

output a structured plan with phases, dependencies, and what can be parallelized. don't build anything yet. just plan.

---
