---
title: "Turn one podcast recording into a month of distribution"
date: "2026-07-29"
excerpt: "The episode does not exist on YouTube yet. The distribution machine for it has been running for a week: a word-timestamped transcript, 17 clips, 33 Buffer API drafts, a Notion posting board, and the long-form layer you are reading."
category: "gtm-engineering"
featured: true
keywords: ["podcast distribution workflow", "podcast clips pipeline", "buffer api scheduling", "claude code gtm", "reddit gtm channel", "content repurposing", "generative engine optimization", "geo seo content"]
---

I recorded a podcast with the LeanScale team this week. Me and my co-founder Lila Rest, on the mic with Anthony Enrico, going deep on Reddit as a B2B channel and what AI is doing to the way we sell and build.

The episode hits their YouTube channel in about two weeks. I am not waiting for it.

![We never pitched this podcast](/blog/leanscale-embrace-cover.png)

<!-- TODO when the episode drops: replace this comment with {{youtube:VIDEO_ID}} -->

## The podcast came from the same system

Nobody pitched anybody. Joe at LeanScale found Clearbox through the content I was already publishing. When I reached out, I sent him more of the work, not a deck. A call became an episode, and the episode became two teams working together past the recording.

That motion is the embrace. You share the work in public, the right person steps toward you, and you meet them all the way. It is the same thing I do with every Clearbox signup: I have the keys, so I chase down every new user with the same message. I want you to win with this tool.

Credit where it belongs: [LeanScale](https://www.leanscale.team) ran this like a production, and it shows in everything downstream. There was a real brief and a storyboard before we ever hit record. Anthony opened the session by taking the pressure off, pause whenever you need, podcasting is a forgiving format, and his editing team cuts anything that does not need to be there. It is one thing to get invited on a podcast. A host who preps the brief, makes you comfortable on the mic, and hands you that opportunity is what makes everything below possible.

Distribution built the relationship. So when the recording wrapped, the only question was how much distribution one hour of tape could carry.

## The pipeline

One rule made all of this possible: get the raw files. Riverside hands every guest their own iso track, and that raw video plus a transcript is the whole raw material.

**Transcribe with word-level timestamps.** Whisper runs locally and gives you every word with a start and end time. That file is the index for everything downstream.

**Cut clips where stories peak.** I ran the transcript through Claude Code and cut 17 vertical clips, each built around one complete story: the $10,000 Reddit API surprise, the AI that picked my camera lens from four Reddit citations, my co-founder texting me from his grandma's place that he had quantized a Google model. Word-level timestamps mean the cut lands on the word, not near it.

**Render with a real caption system.** Each clip got a kicker, a two-line hook, word-timed caption pills, and a CTA, rendered at 1080x1920. The hooks are written like scroll-stoppers because that is the entire job of the first second.

Day 1 of the series, straight from the machine:

{{video:https://uohlxmupujhxhbffspzs.supabase.co/storage/v1/object/public/leanscale-podcast-shorts/clip_01_plumber-to-claude-code_v3e.mp4 poster=https://uohlxmupujhxhbffspzs.supabase.co/storage/v1/object/public/leanscale-podcast-shorts/clip01_poster_v1.jpg}}

**Host the masters at public URLs.** Ours sit in Supabase storage. One JSON file maps every clip slug to its URL. That map is what every other system reads.

**Draft through the Buffer API.** 11 clips times three platforms, TikTok, Instagram Reels, YouTube Shorts, staged as 33 drafts with one script. Drafts on purpose: a human reviews everything in the Buffer UI before any times get set. One clip goes out per day, every day, until the episode drops.

**Run the daily series from a board.** The LinkedIn layer is a Notion database: day, date, post text, master download, status. Every morning is paste, attach, post, flip the status. Four minutes.

## Long-form from the same transcript

The same hour of tape became a LinkedIn newsletter, this blog post, a Beehiiv issue, and a Reddit post for r/GTMbuilders. Different surfaces, different formats, one story: you do not have to sell yourself to get to the right people. The clips are the surface layer. The transcript is the asset.

This is also the SEO and GEO play. When I asked an AI which lens to buy for my Fujifilm, all four citations were Reddit threads, and I bought the lens off that answer. Answer engines read public conversations back to the next buyer. A transcript full of real questions and real numbers, republished where buyers and engines both read, is how you become the thing that gets cited.

One recording session. Seventeen clips, eleven daily posts, four long-form pieces, a month of cadence. The episode is one asset. The transcript is thirty.

## Run it yourself

Record on a platform that gives you iso tracks. Transcribe with Whisper, keep the word timestamps. Have a coding agent find the story peaks and cut there. Render captions from the same timestamps. Host masters publicly, keep a slug-to-URL map. Draft to every platform through the Buffer API and review by hand. Stage the daily copy somewhere phone-you can operate. Then write the long-form layer from the transcript while the clips carry the daily beat.

The tools in my version: Riverside for raws, Whisper for timestamps, Claude Code for the cutting and the scripts, Supabase for hosting, Buffer for scheduling, Notion for the board. Swap any of them. The shape is the point.

One more thing I owe them. I knew people on the LeanScale team before any of this started, which is half of why I was excited to work with them, and the way they run their process confirmed it. If you are a RevOps or GTM team looking for an agency, I could not recommend [LeanScale](https://www.leanscale.team) enough.

The episode lands on their YouTube channel in two weeks. By then this story will have been compounding for a month, and if it brought you here early: [clearbox.to](https://clearbox.to) is the tool half of it.
