# Content Pillar: Twitch Gaming + Discord (Dormant -- Activates Post-Build)

## Format

Live hybrid streams on Twitch -- vibe coding with AI (Cursor, Claude Code) alongside gaming (Elden Ring, retro emulation, Souls-likes). AI promotion through the gaming lens. Stream-first, clip-second. Discord is the always-on community layer between streams.

This is the personality pillar. Where LinkedIn shows the builder, and YouTube shows the systems, Twitch shows the person. Unscripted, live, competitive, reactive.

## Content Types

### Vibe Code + Game Sessions

Build something with AI, then play. The build is the content, the game is the reward.

- "I just vibe-coded a retro game clone. now let's play the original."
- "Building an Elden Ring boss tracker in Cursor, then testing it live."
- "AI-generated dungeon map. let's see if it's actually playable."
- Split format: code block first, game block second. Chat decides when to switch.

### AI-Assisted Game Dev

Live-build games, mods, and tools using Cursor and Claude. This niche is validated -- CNET covered people using AI to recreate childhood games in the browser.

- Recreate retro games from memory using vibe coding (no manual code, pure AI)
- Build game mods or overlays in real time
- Emulator configuration and setup with AI assistance
- "Can Claude build a playable game in 30 minutes?" challenge format

### Challenge Runs + Boss Fights

Pure gaming for community and engagement. The off-brand content that builds personality and attracts a different audience segment.

- Elden Ring challenge runs (no summons, specific builds, viewer-chosen constraints)
- Souls-like progression streams
- Hard mode runs where chat picks the handicap
- These are the highest clip potential for TikTok gaming content

### Community Plays

Discord-sourced content. Viewers drive the stream.

- "Chat picks what I build next" -- poll in Discord, build on stream
- Viewer-submitted code challenges: "Can AI solve this?"
- Co-op or multiplayer sessions with Discord community members
- Community game jams: everyone vibe-codes a game, show results on stream

### React + Commentary

Live reactions with chat. Low prep, high engagement.

- New AI tool drops (Claude updates, Cursor releases, new MCP servers)
- Game announcements and trailers
- Tech news that affects builders and gamers
- Reviewing community-built vibe-coded games

## Stream Structure Framework

### Cold Open (0-2 minutes)

Show today's build or game goal. Flash the end state or the challenge. Don't intro yourself for 60 seconds -- show the thing. "Here's what we're building. Here's what we're playing. Let's go."

### Code Block (20-40 minutes)

Vibe coding session with chat. Narrate your prompts, show Claude/Cursor working, debug live. This is the AI promotion layer -- viewers see AI-assisted development in real time without it feeling like a sales pitch.

**Rules for the code block**:
- Keep Cursor or Claude Code visible and centered
- Narrate what you're prompting and why
- Let chat suggest prompts or approaches
- If something breaks, fix it live. The debugging IS the content.
- Don't pre-build. The mess is the point.

### Game Block (30-60 minutes)

Play session. Could be the thing you just built, a full game, or a challenge run.

**Rules for the game block**:
- If you built something in the code block, play it first -- close the loop
- For standalone gaming, have a clear goal (boss, level, challenge)
- Chat engagement is highest here -- react to chat, let them influence decisions
- This is where the personality shows. Competitive, reactive, real.

### Wrap + Raid (5 minutes)

Recap what happened. Shout the Discord. Raid another streamer.

- "Here's what we built. Here's what we beat. Here's what's next."
- Direct to Discord for post-stream discussion
- Always raid someone -- it builds community reciprocity
- Tease next stream's plan

## Schedule Guidelines

| Phase | Frequency | Notes |
|-------|-----------|-------|
| Launch (first month) | 2x per week | Build consistency, find the rhythm |
| Growth (months 2-6) | 3x per week | Consistent days/times, Discord events |
| Established (6+) | 3-4x per week | Add special event streams, collabs |

Pick consistent days and times. Twitch rewards predictability. Viewers build habits around your schedule.

## Repurpose Paths

Every stream should produce at least 2-3 derivative pieces:

| Source | Target | Format |
|--------|--------|--------|
| Code highlight (30-60s) | TikTok / Short | Quick build clip |
| Boss fight / clutch moment | TikTok / Short | Gaming highlight |
| Build result | LinkedIn post | "I vibe-coded X on stream" |
| Full code session | YouTube video | Edited walkthrough |
| Hot take from stream | X thread | Opinion + context |
| Stream recap | Newsletter | Weekly stream digest |
| Chat-driven moment | X post | Community engagement story |
| Failed build / funny bug | TikTok / Short | Relatable dev humor |

**Automation tools for Twitch-to-TikTok**:
- **Clipbot** (free, 10k+ creators): Auto-uploads Twitch clips to TikTok and YouTube Shorts
- **Vizard**: AI-powered moment detection, auto-identifies highlights and converts to vertical clips
- **Cross Clip** ($5/mo): One-click conversion with customizable editing

Use `/tiktokscript` to refine raw clips into structured Shorts. Use `/playdraft` when a build result deserves a LinkedIn/X post.

## Discord Integration

### Server Structure

Enable Community mode. Set Medium verification level.

**Core channels**:
- `#announcements` (read-only) -- stream schedule, new content, milestones
- `#general` -- main conversation
- `#stream-chat` -- live discussion during and after streams
- `#code-share` -- share builds, vibe-coded projects, prompts that worked
- `#gaming` -- game discussion, recommendations, challenge ideas
- `#ai-tools` -- tool tips, new releases, workflow shares
- `#clips` -- best moments from streams, community-curated
- `#suggestions` -- what to build, what to play, stream ideas

**Voice channels**:
- `#live-stream` -- active during streams for overflow/co-watching
- `#hangout` -- always-on casual voice

### Role Hierarchy

| Role | Access | How to Earn |
|------|--------|-------------|
| @viewer | Base channels | Join the server |
| @regular | All channels + voice | Active for 2+ weeks |
| @subscriber | Exclusive channels, emotes | Twitch sub or equivalent |
| @builder | Code-share perks, collab access | Ships a vibe-coded project |
| @mod | Full permissions | Trusted community member |

### Community Loops

- **Pre-stream polls**: Discord vote on what to build or play
- **Post-stream discussion**: Dedicated thread after each stream
- **Weekly challenge**: Community vibe-coding challenge, results shown on stream
- **Clip leaderboard**: Best community-submitted clips get featured

## Technical Setup Notes

### Streaming Software (OBS Studio)

**Scenes**:
- `[Code]` -- Cursor/IDE full screen with webcam overlay (bottom-right, small)
- `[Game]` -- Game full screen with webcam overlay (bottom-left, small)
- `[BRB]` -- Branded away screen with music
- `[Starting Soon]` -- Pre-stream countdown with schedule
- `[Chat Focus]` -- Webcam large, chat overlay, for discussion segments
- `[Dual]` -- Split screen: code left, game right (for when you're testing what you built)

**Settings**:
- Resolution: 1080p60 (Twitch standard)
- Bitrate: 6000 kbps (Twitch max for non-Enhanced)
- Codec: H.264 (stable) or HEVC (beta, better quality at same bitrate via Twitch Enhanced Broadcasting)
- Audio: Separate tracks for mic, game, music, alerts (allows post-production flexibility)

### Dual-Screen Layout

- **Primary monitor**: Game or IDE (whatever is being captured)
- **Secondary monitor**: OBS, Twitch dashboard, chat, Discord, Stream Manager

### Stream Safety

- **30-60 second stream delay**: Gives buffer to catch sensitive info before it broadcasts
- **OBS scene switching hotkeys**: Instant switch away from sensitive tabs
- **Dedicated streaming browser profile**: No saved logins to partner dashboards or sensitive accounts
- **Pre-stream checklist**: Close all non-stream tabs, check notifications are muted, verify no partner data visible

### Simulcast (Optional)

Twitch dropped exclusivity requirements in 2025. You can multistream to YouTube, Kick, and TikTok Live simultaneously.

**Constraints**:
- Twitch stream quality must match or exceed other platforms
- Cannot actively redirect Twitch viewers to other platforms during stream
- Merged chat overlays combining multiple platforms are not allowed on Twitch
- Bandwidth doubles for each additional platform (~6000 kbps per target)

**Tools**: Restream.io (cloud-based, saves CPU) or OBS Multiple RTMP Outputs plugin (free, requires bandwidth)

## Collaborates With

- **TikTok Script Skill** (`/tiktokscript`): Refine stream clips into structured Shorts
- **Play Draft Skill** (`/playdraft`): Build screenshots from stream become LinkedIn/X posts
- **Viral Hooks Skill** (`/viralhooks`): Shape clip titles and TikTok openers
- **YouTube Builder & Systems Pillar**: Full code sessions become edited YouTube content
- **Building & Sharing Pillar**: Stream journey narrative feeds the personal brand story
- **Breadcrumb Protocol**: Stream content can carry breadcrumbs for future projects

## Output Format

When planning a stream, produce:

1. **Stream title** -- Twitch-optimized, clear about what's happening ("Vibe Coding a Retro Game Clone + Elden Ring Boss Run")
2. **Category** -- Twitch category (Software and Game Development for code blocks, specific game for game blocks)
3. **Goal** -- What you're building and/or what you're playing
4. **Discord pre-stream post** -- Announce in #announcements with the plan
5. **Clip targets** -- Which moments are likely TikTok-worthy (code wins, boss fights, funny fails)
6. **Post-stream recap** -- Quick summary for Discord + potential LinkedIn/X post

## What Makes This Pillar Work

- You're already coding daily -- the stream is the narration layer on top of what you're doing anyway
- Gaming is the personality hook that differentiates from pure dev streamers who only code on stream
- The recursive loop: stream the build, play the build, clip the stream, post the clip
- Vibe coding is trending -- CNET, HuggingFace, and major outlets are covering AI game development
- Discord gives you a 24/7 community that exists between streams -- the stream is the event, Discord is the home
- The computer build is the origin story. The stream is the next chapter. It's part of the Ark.
- Every stream produces content for 3+ other platforms with minimal additional effort

## Voice Notes

- Same core voice but looser. This is the unfiltered version.
- Stream voice = pair-programming energy. Thinking out loud, debugging out loud, reacting in real time.
- Gaming voice = competitive, reactive, genuine. Don't perform -- just play.
- Swearing is fine. Don't sanitize the experience. If a boss kills you, react like a human.
- Talk to chat like friends in a room, not an audience in a theater.
- "Let me show you" > "In this stream I'm going to show you"
- Dead air while thinking is fine. Don't fill every second.
- When something breaks or you die to a boss, the reaction is the content. Don't script emotions.

## Safety

Medium-high. Live streaming has no take-backs.

**Hard rules**:
- Never show partner data, client names, or sensitive dashboards on stream
- Use the dedicated streaming browser profile with no saved credentials
- OBS scene-switch hotkeys ready at all times to cut away
- 30-60 second stream delay as a safety buffer
- No screen sharing of Discord DMs, emails, or Slack during stream
- Pre-stream tab audit: close everything that isn't the IDE or game
- If you accidentally show something sensitive, scene-switch immediately and address it calmly

**Soft rules**:
- Don't trash competitors or other tools on stream -- the live format makes it easy to say something you'd edit out of a post
- Be mindful of other streamers' content when raiding or reacting
- Moderate chat proactively -- set up AutoMod and chat rules before launch
