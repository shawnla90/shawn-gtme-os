# TikTok Talking-Head Scripts — 90 Seconds Each

## Format
- **Split-screen vertical (1080x1920):** face cam on top, live terminal on bottom
- **Shawn talks AND prompts Claude Code live** — viewers see real output
- **Pacing:** ~2.5 words/sec spoken, terminal commands timed to match
- **Structure:** Hook (0-3s) → Pain (3-20s) → Fix (20-50s) → Live Demo (50-80s) → CTA (80-90s)
- **Recording:** OBS Studio (vertical canvas) + DaVinci Resolve (edit/captions)

---

## Script 1: "If you're using AI with APIs, you're draining your wallet"

**Hook (0-3s)**
> *[Lean into camera]*
> "I was spending over a thousand dollars a month on AI. Here's how I got it to two fifteen."

**Pain (3-20s)**
> "If you're running an AI assistant — OpenAI, Anthropic, whatever — and you're paying per token, you're doing it wrong. Every message costs money. Every retry costs money. I had days where I'd burn fifteen, twenty bucks just iterating on a blog post. And the worst part? Wrapper tools charge you a markup ON TOP of the API fees. You're paying twice."

**Fix (20-50s)**
> "The fix was stupid simple. Claude Code Max. Two hundred dollars flat. Unlimited messages. Same Opus model. No token meter running in the background. I still keep a fifteen dollar API budget for my cron jobs — that's Nio posting blogs, running SEO scans, doing the stuff I don't touch. But my actual working sessions? Flat rate. I sent eighty-seven messages yesterday. Cost me zero extra."

**Live Demo (50-80s)**
> *[Switch focus to terminal]*
> "Watch — I'm going to ask Claude to refactor an entire file right now."
> *[Type a real prompt, show the response streaming]*
> "That would've been like two bucks on the API. Right now? Already included. And I can keep going all day."
> *[Show another prompt, fast]*
> "No meter. No anxiety. Just building."

**CTA (80-90s)**
> "Full cost breakdown on my blog — shawnos.ai. Link in bio. Every number is real, no affiliate links."

---

## Script 2: "You're using Claude Code wrong"

**Hook (0-3s)**
> *[Shake head at camera]*
> "If you're using Claude Code like ChatGPT, you're using it wrong."

**Pain (3-20s)**
> "Most people open Claude Code, type a question, get an answer, and close it. That's a chatbot. That's not what this thing is built for. You're leaving ninety percent of the power on the table. No memory between sessions. No automation. No tools connected. Just vibes and copy-paste."

**Fix (20-50s)**
> "Here's what mine does. I have an AI assistant named Nio. He has MCP servers wired into Slack, Discord, GitHub, ClickUp. He has cron jobs that run while I sleep — blog posts go live at eight AM, Discord announcements five minutes later. He has a CLAUDE.md file that tells him how I work, what I care about, what not to do. And he has skills — slash commands I built that do multi-step workflows in one shot."

**Live Demo (50-80s)**
> *[Terminal focus]*
> "Watch this. I just type: deploy the blog."
> *[Run the command, show Nio building, indexing, pushing]*
> "He pulled latest, built the site, indexed forty-seven posts into SQLite, pushed to GitHub, and it's live. I didn't click anything. I didn't open a browser. One sentence."
> *[Show the live site briefly]*
> "That's not a chatbot. That's an operating system."

**CTA (80-90s)**
> "Full setup guide — every config file, every MCP server — shawnos.ai slash blog. Link in bio."

---

## Script 3: "Stop wasting fifteen bucks a message on AI wrappers"

**Hook (0-3s)**
> *[Hold up hand, counting gesture]*
> "Fifteen dollars. That's what some AI platforms charge you per message. Let me show you the alternative."

**Pain (3-20s)**
> "There's this whole industry of AI wrappers right now. They take the same Claude or GPT model you could call directly, slap a UI on it, and charge you five to fifteen X what the API costs. Some of them are literally reselling the same model with a chatbot skin. You're paying for a middleman to forward your messages."

**Fix (20-50s)**
> "Cut them out. Claude Code runs in your terminal. Direct to the model. No wrapper. No markup. You write a prompt, it hits Claude, you get the response. And here's the thing people miss — you can give it tools. MCP servers let you connect it to anything. Slack. GitHub. Your database. Your deploy pipeline. No wrapper gives you that. They give you a text box."

**Live Demo (50-80s)**
> *[Terminal focus]*
> "Same prompt. Let me show you what this looks like in practice."
> *[Type a prompt that uses an MCP tool — like checking GitHub PRs or reading ClickUp tasks]*
> "That just pulled my open pull requests from GitHub, summarized them, and told me which ones have failing checks. Try doing that in a chat wrapper."
> *[Type another quick one]*
> "And that just checked my ClickUp tasks for today. All from the same terminal. Zero UI switching."

**CTA (80-90s)**
> "Direct API setup guide — shawnos.ai. No affiliate links. Just the config files. Link in bio."

---

## Script 4: "9 MCP servers, one CLI — your AI can't do this"

**Hook (0-3s)**
> *[Tap desk twice]*
> "Nine MCP servers. One terminal. Let me show you what that actually looks like."

**Pain (3-20s)**
> "Everyone's got five tabs open. Slack in one. GitHub in another. ClickUp, Discord, email. And you're the human router between all of them. Copy from here, paste over there, check this, update that. Your AI assistant can answer questions. Cool. But can it actually DO anything? Can it post to Discord? Can it check your deploy status? Can it read your project board?"

**Fix (20-50s)**
> "MCP — Model Context Protocol. It's an open standard that lets your AI call real tools. Not plugins. Not API wrappers. Actual tool calls that your model executes mid-conversation. I have nine of them running. GitHub for PRs and issues. Slack for messaging teams. Discord for community posts. ClickUp for task management. Firecrawl for web scraping. And they all talk through one CLI — Claude Code. My agent doesn't just know things. It does things."

**Live Demo (50-80s)**
> *[Terminal focus]*
> "Let me run a real workflow. Watch."
> *[Type something like: "check if any PRs need review, then post a summary to Discord"]*
> *[Show Claude calling GitHub MCP, getting PR data, then calling Discord MCP to post]*
> "It just checked GitHub, found two PRs waiting on me, summarized them, and posted the summary to my Discord channel. Two tools. One prompt. Zero tab switching."

**CTA (80-90s)**
> "Full MCP setup — every server config, JSON files included — shawnos.ai slash blog. Link in bio."

---

## Script 5: "I render TikToks from React code"

**Hook (0-3s)**
> *[Smirk at camera]*
> "This TikTok was rendered from React code. Let me show you how."

**Meta Note:** *This one is self-referential. You're literally showing the tool that made the slideshows they might have already seen.*

**Pain (3-20s)**
> "If you're spending an hour in CapCut or Premiere editing a fifteen-second TikTok, there's a better way. Especially if you're a dev. Dragging text boxes around a timeline is not it. And if you're making educational content where the format is the same every time — slides, transitions, text — you're doing repetitive manual work that should be automated."

**Fix (20-50s)**
> "Remotion. It turns React components into video. Same JSX you already know. Spring animations, transitions, audio — all in code. I have a TikTok slideshow system where a new video is literally just five lines of data — headline, body, color, icon. I change the data, run one command, and I have a new TikTok. Nine-sixteen vertical. Sixteen seconds. Slide transitions. Background music. Particle effects. All from a JSON-like array."

**Live Demo (50-80s)**
> *[Terminal focus]*
> "Here's the data for one of my TikToks."
> *[Open slideshow-data.ts, scroll through a slide array]*
> "Five objects. That's it. Now watch."
> *[Run `npm run render:tiktok-all`]*
> "That's rendering six TikToks right now. While I'm talking to you."
> *[Show the render progress]*
> "Six videos. One command. Zero editing."

**CTA (80-90s)**
> "Remotion setup guide — tokens, components, render scripts — shawnos.ai slash blog. Link in bio."

---

## Production Notes

- **Tone:** Direct, no-BS, slightly flexing but backed by live proof. Not salesy — just showing the work.
- **Wardrobe:** Keep it casual. Tech founder energy, not influencer energy.
- **Terminal font:** JetBrains Mono, dark theme (match the ShawnOS brand).
- **Captions:** Always on. White text, dark background pill. TikTok's auto-captions work but custom is better.
- **First-comment strategy:** Post hashtag overflow as first comment (not in caption).
- **Hashtag bank:** #claudecode #anthropic #mcpservers #aitools #buildinpublic #devtools #remotion #reactjs #aicoding #techfounders
- **Post timing:** Tue/Thu/Sat, 11 AM - 1 PM ET (TikTok dev audience peak)
- **Music:** Optional light lo-fi under voice, cut during demo sections for clarity.

## Recording Checklist

1. OBS vertical canvas (1080x1920)
2. Webcam source — top 50% of frame
3. Terminal window capture — bottom 50%
4. Audio: external mic preferred, OBS noise suppression filter ON
5. Pre-stage all terminal commands (have them ready to paste, don't fumble live)
6. Record in one take if possible — raw > overproduced for TikTok
7. DaVinci: trim dead air, add text overlays for key stats, export 1080x1920 H.264
