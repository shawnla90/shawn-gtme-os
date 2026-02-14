# Twitch Playbook

> Inherits from: `tier-1-voice-dna/core-voice.md`

## Platform DNA

Twitch is the live layer. LinkedIn tells the story after the fact. YouTube edits the story for clarity. Twitch IS the story, happening in real time. No edits, no second takes, no polish. The audience watches you think, build, fail, and figure it out. That's the value proposition.

For this OS, Twitch serves a hybrid purpose: AI-assisted coding (vibe coding with Cursor and Claude) and gaming (Elden Ring, retro emulation, challenge runs). The coding demonstrates AI tools through action. The gaming builds personality and community. Together they create a content type that doesn't exist in pure dev streaming or pure gaming streaming.

## Tone

Loosest version of the core voice. Still builder-first, still casual competence, but with the volume turned up. Live means reactive. Gaming means competitive. Code means thinking out loud. The combination means personality shows through in ways that written content can't capture.

No tutorial energy. No "welcome to the stream, make sure to follow." Just start building or playing. Chat joins the room, not the lecture hall.

## Twitch-Specific Features

### Clips

Short highlights (up to 60 seconds) that viewers or you can capture from the stream. These are the raw material for TikTok, Shorts, and Reels. Encourage chat to clip moments -- it's free content creation by your community.

### Raids

At the end of every stream, raid another streamer. Send your viewers to someone else's channel. This builds reciprocity, grows your network, and is the primary organic discovery mechanism on Twitch.

**Raid strategy**:
- Raid streamers in adjacent niches (dev streamers, AI builders, Souls-like gamers)
- Rotate targets -- don't raid the same person every time
- Announce the raid in Discord so your community follows

### Channel Points

Twitch's built-in loyalty currency. Viewers earn points by watching and engage by spending them on custom rewards.

**Reward ideas for this channel**:
- "Pick the next game" -- viewer chooses what you play
- "Pick the next build" -- viewer suggests what to vibe-code
- "Challenge mode" -- add a constraint to the current run
- "Code review" -- you look at a viewer's code on stream
- "Song request" -- control the stream music

### Predictions

Built-in betting system. Viewers predict outcomes using channel points.

- "Will the boss die this attempt?" (gaming)
- "Will this code compile on first try?" (coding)
- "Over/under 10 minutes to get this feature working?" (coding)
- Drives engagement and makes chat invested in outcomes

### Co-Streaming

Twitch's 2025 co-streaming feature allows multiple streamers to broadcast the same event simultaneously with individual commentary. Useful for:

- Co-coding sessions with other dev streamers
- Watching AI tool announcements together
- Community events where multiple builders work on the same challenge

## Simulcast Strategy

Twitch dropped exclusivity for Partners and Affiliates in 2025. You can now broadcast to multiple platforms simultaneously.

### Where to Simulcast

| Platform | Why | Notes |
|----------|-----|-------|
| Twitch | Primary home, best chat, best community tools | Always the primary stream |
| YouTube Live | SEO value, VOD discovery, different audience | Great for code-heavy streams |
| Kick | Growing gaming audience, better rev share | Optional, evaluate after launch |
| TikTok Live | Clip discovery, younger audience | Requires 1000+ followers first |

### Simulcast Rules

- Twitch stream quality must match or exceed other platforms
- Cannot actively redirect Twitch viewers to another platform during stream
- No merged multi-platform chat overlays visible on the Twitch stream
- Each additional platform roughly doubles bandwidth requirements

### Tools

- **Restream.io** (cloud-based): Saves local CPU/bandwidth, handles multi-platform routing
- **OBS Multiple RTMP Outputs** (free plugin): Direct from OBS, requires upload bandwidth for each target
- **Recommended**: Start Twitch-only. Add simulcast after the stream format is dialed in.

## Growth Mechanics

### Discovery

Twitch organic discovery is weaker than YouTube or TikTok. Growth comes from:

1. **Raids and hosting**: Active community networking
2. **Clips on TikTok/Shorts**: Stream highlights that go viral bring viewers back to the source
3. **Discord community**: Members invite friends, word-of-mouth
4. **Cross-platform content**: LinkedIn and X posts about stream moments drive traffic
5. **Twitch Discovery Feed**: Algorithmically surfaced clips -- make sure clips are enabled

### Retention

Getting a viewer is hard. Keeping them is harder.

- **Consistent schedule**: Same days, same times. Viewers build habits.
- **Discord as the glue**: Keep community engaged between streams
- **Series format**: "Elden Ring Challenge Run" or "Vibe Code Fridays" -- recurring formats viewers anticipate
- **Chat interaction**: Respond to chat by name. Acknowledge regulars. Make people feel seen.
- **Raids bring viewers; community keeps them**: A raid gets someone to your channel. The vibe keeps them coming back.

### Milestones

| Milestone | Typical Timeline | What It Unlocks |
|-----------|------------------|-----------------|
| Twitch Affiliate | 50 followers, 500 min streamed, 7 unique days, 3 avg viewers (30 days) | Subs, bits, emotes, channel points |
| 100 concurrent | Varies (3-12 months) | Sponsor interest, raid value, community critical mass |
| Twitch Partner | 75 avg viewers + consistency | Better rev share, priority support, verified badge |

## Monetization Path (Future)

This pillar is dormant until post-build. Monetization comes later, but the structure should be in place from day one.

| Revenue Stream | When | Notes |
|----------------|------|-------|
| Twitch subs | After Affiliate | $2.50-$3.50 per sub (tiered) |
| Bits / cheers | After Affiliate | Micro-donations from viewers |
| Sponsorships | After consistent audience | AI tool sponsors (natural fit for the content) |
| Merch | After community | Discord/Twitch community merch |
| YouTube ad revenue | When VODs are edited and posted | Repurposed stream content |

## Metrics to Track

### Per-Stream Metrics

- **Average Concurrent Viewers (ACV)**: The core health metric. Track week-over-week.
- **Peak viewers**: Highest simultaneous count. Identifies which content spikes interest.
- **Chat messages per minute**: Engagement velocity. Higher = more engaged audience.
- **New followers**: Growth per stream.
- **Clips created**: Both by you and viewers. High clip count = memorable moments.
- **Raid incoming/outgoing**: Network building tracker.

### Weekly/Monthly Metrics

- **Returning viewer rate**: What percentage of viewers come back? This is the retention signal.
- **Stream hours**: Consistency tracking.
- **Clip views (TikTok/Shorts)**: How well stream content performs when repurposed.
- **Discord active members**: Community health between streams.
- **Subscriber count**: Loyalty metric.

### Tools

- **Twitch Stream Manager**: Built-in analytics dashboard
- **StreamElements / Streamlabs**: Overlay, alerts, and extended analytics
- **SullyGnome**: Third-party Twitch analytics (historical data, category performance)

## Discord Integration

Discord is not separate from the Twitch strategy -- it's the other half. Twitch is the event. Discord is the home.

### Stream Notifications

- Set up a bot (StreamElements or MEE6) to auto-post in `#announcements` when you go live
- Include stream title, category, and a one-line description
- Pin the weekly schedule in `#announcements`

### Post-Stream Flow

1. Stream ends with a raid
2. Post a recap in `#stream-chat` (what you built, what you played, highlights)
3. Community discusses in the thread
4. Best clips get posted in `#clips` by viewers
5. Next stream poll goes up in `#suggestions`

### Always-On Engagement

- Weekly vibe-coding challenge: posted Monday, results shared on stream Friday
- Code-share channel stays active between streams
- Gaming discussion doesn't require your presence -- community self-sustains

## Content Calendar Template

| Day | Stream Type | Duration | Notes |
|-----|-------------|----------|-------|
| Tuesday | Vibe Code + Game | 2-3 hours | Primary coding stream. Build something, then play. |
| Thursday | Gaming Focus | 2-3 hours | Challenge runs, community plays, pure gaming. |
| Saturday | Special / Collab | 2-4 hours | Longer session. Community events, co-streams, react content. |

This is a starting template. Adjust based on what performs and what feels sustainable.

## Avoid

- "Welcome to the stream, make sure to follow and subscribe" energy. Just start.
- Over-produced overlays and alerts that distract from the content
- Reading every donation/sub message live (acknowledge briefly, don't derail)
- Playing games you don't actually enjoy just because they're trending
- Streaming without a goal. Have a plan even if you deviate from it.
- Checking analytics during the stream. Focus on the content.
- Comparing viewer counts to established streamers. Growth is slow and compound.

## References

- `tier-1-voice-dna/core-voice.md` -- Voice foundation (loosened for live)
- `tier-3-content-ops/pillars/twitch-gaming-discord.md` -- Pillar definition
- `tier-3-content-ops/pillars/youtube-builder-systems.md` -- YouTube repurpose target
- `tier-2-context-playbooks/tiktok.md` -- TikTok repurpose playbook
- `.cursor/skills/tiktok-script/SKILL.md` -- Agent skill for clip-to-Short conversion
- `.cursor/skills/play-draft/SKILL.md` -- Agent skill for stream moments to social posts
