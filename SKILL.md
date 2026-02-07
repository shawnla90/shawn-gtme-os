---
name: gtme-marketing-voice
description: Marketing voice and content evaluation for GTME/builder-focused content. Checks for authenticity, substance, anti-AI-slop patterns, and brand safety for Shawn's Lead Alchemy brand and LinkedIn presence.
---

# GTME Marketing Voice & Content Evaluation

## The Core Problem This Solves

You're a **builder-first GTME with ADHD pattern recognition** who creates content that performs well when it's authentic and tactical. Your voice is an asset (casual, competent, technical, builder energy), but you have specific risks:

1. **AI slop detection**: You can spot it in others but sometimes miss it in your drafts
2. **Over-optimization**: Can spend hours perfecting posts instead of shipping
3. **Substance vs. performance**: Risk of sounding like content instead of a person
4. **Technical depth calibration**: Finding the right level for your mixed audience

**This skill helps you create authentic, high-performing content that builds your GTME brand while staying true to your builder voice.**

---

## Core Voice Principles

### Foundation: Practitioner Authority + Tactical Substance

Content performs best when written from first-person builder perspective with specific details. **Your 1000+ character tactical posts with real Clay/CRM examples significantly outperform short abstract advice.**

**Priority hierarchy:**
1. **Substance** (specific, detailed, usable)
2. **Authenticity** (messy, organic, builder voice)
3. **Interesting** (pattern recognition, conviction)
4. **Polish** (last, not first)

### Voice Characteristics

- **Builder-first**: Sound like you're sharing from the trenches, not consulting from theory
- **Casual competence**: Confident without corporate formality
- **Pattern articulation**: Your superpower - name patterns others haven't seen
- **Technical but accessible**: Clay column names + why they matter
- **Self-aware**: Acknowledge the messy reality of production builds
- **Conviction-driven**: Lead with belief, not benefits

### The Builder Code

**You can:**
- Challenge GTM approaches and strategies
- Share mistakes and lessons learned
- Critique systems and processes
- Call out bad practices (generic, not named)

**You don't:**
- Call out specific companies or people
- Position yourself as industry judge
- Criticize potential clients or partners
- Make claims about guaranteed results

---

## Content Archetypes That Work

### Archetype 1: Tactical System Breakdowns (Highest Performing)

**What it is**: Long-form (1000+ chars) posts explaining how you built something in Clay/HubSpot/n8n with specific details.

**Why it works for you**:
- Leverages your practitioner authority
- Shows actual work, not theory
- Provides usable information
- Builds credibility through specifics

**Template**:
1. Start with the problem/use case
2. Show the system architecture (source → enrichment → scoring → CRM)
3. Include specific column names, formulas, or prompt structures
4. Share gotchas or lessons learned
5. Offer to share more details (engagement CTA)

**Example structure**:
```
just finished building an alumni champion tracker for a client.

the play: track closed-won contacts as they move companies, then surface new buying opportunities.

here's how it works:

source: hubspot closed-won contacts with champion tag
enrichment: clearbit for current company, prospeo for new job title
logic: formula to detect company changes (old_domain ≠ new_domain)
scoring: claygent prompt rates new company fit (industry match + size + tech stack)
push: http api creates company record with has_alumni_champion flag

the gotcha: you need domain normalization BEFORE the comparison or you'll get false positives (www vs non-www, http vs https).

also learned: cap this at max 50 enrichments per run or costs explode.

table took 3 hours to build + debug. now it runs weekly automated.

[specific results or what this enables]

happy to share the exact claygent prompt if anyone's building similar.
```

**Safety**: High - you're sharing your work, no external targets

---

### Archetype 2: Pattern Recognition Insights

**What it is**: Articulating patterns you see in GTM systems, CRMs, or outbound that others haven't named.

**Why it works**:
- Your pattern recognition is your edge
- Educational and thought-provoking
- Positions you as systems thinker

**Template**:
1. Name the pattern clearly
2. Show why it matters (consequences)
3. Provide specific example or scenario
4. Connect to broader GTM principle
5. Avoid naming companies unless huge/public

**Example structure**:
```
pattern i keep seeing: companies treat their crm like a database instead of a system.

they dump enriched data in, but never build the views, filters, and workflows that make it actionable.

result: sales has 10k contacts and no way to know who to call first.

here's what actually works:
- custom properties for ICP fit (1-10)
- views by score + last engagement
- workflows that route by buying committee role

your crm should tell sales WHAT to do, not just store data.

if your reps are building their own lists in crm every morning, your data architecture is broken.
```

**Safety check**: Pattern vs. person - is this about behavior everyone recognizes, or calling out a specific client?

---

### Archetype 3: Behind-The-Scenes Build Process

**What it is**: Showing the messy reality of building GTM systems, including failures and iterations.

**Why it works**:
- Authentic, not performative
- Relatable to other builders
- Shows real work, not highlight reel

**Template**:
1. Show what you're actually working on
2. Include the unsexy parts
3. Share a specific challenge or lesson
4. Your direct style works perfectly here
5. No need to polish - authenticity is the point

**Example structure**:
```
spent 6 hours yesterday debugging a clay table that should've taken 90 minutes.

the issue: claygent was returning "null" for company descriptions on 40% of rows.

tried 3 different providers. same result.

finally realized: my source list had domains without http/https.

enrichment providers couldn't resolve them, so they returned null instead of erroring.

the fix: one formula column to add "https://" before domain enrichment.

saved the table. also added a QA view to catch this earlier next time.

moral: always normalize your data BEFORE enrichment, not after.

boring lesson but it cost me half a day.
```

**Safety**: Highest - you're the subject, no external critique

---

### Archetype 4: Lessons From Client Work (Anonymized)

**What it is**: Sharing insights from client engagements without naming names.

**Why it works**:
- Real examples carry weight
- Shows your experience
- Educational value

**Template**:
1. Set context (company stage/situation)
2. Describe the problem you found
3. Explain what you built/fixed
4. Share the result or lesson
5. Keep it fully anonymous

**Example structure**:
```
client had 50k contacts in hubspot but sales said they had "no one to call."

looked at the data: 
- no ICP scoring
- no engagement tracking
- no buying committee roles
- everyone tagged "prospect"

built a simple fit score (1-10) based on:
- industry match
- employee count
- tech stack
- geo

then created views:
- score 8-10 with activity in last 30 days
- score 6-7 with open opps
- score 4-5 for nurture

sales went from "no one to call" to "these are our Q1 targets" in a week.

the data was fine. the architecture was broken.
```

**Safety check**: Fully anonymized? No identifying details?

---

### Archetype 5: Tool/Technique Deep Dives

**What it is**: Explaining how to use specific Clay features, Claygent prompts, or HubSpot workflows.

**Why it works**:
- High practical value
- Establishes technical authority
- Searchable and shareable

**Template**:
1. Name the tool/technique
2. Explain when to use it
3. Show exact implementation
4. Include gotchas or tips
5. Offer to share templates

**Example structure**:
```
how to write claygent prompts that actually return structured data:

most people write prompts like chatgpt conversations. that's wrong.

claygent needs:
1. explicit json schema
2. clear scoring rubric (if scoring)
3. rules for edge cases
4. examples of good outputs

here's my template:

#CONTEXT
[what you're analyzing]

#OBJECTIVE  
[what you want to know]

#OUTPUT_JSON_SCHEMA
{
  "field_name": "type",
  "score": "integer 1-10"
}

#OUTPUT_RULES
- only return valid json
- if unsure, default to null
- include reasoning field

this structure cuts my prompt iteration time by 70%.

happy to share my full prompt library.
```

**Safety**: High - pure tactical education

---

## Substance Requirements

### What Qualifies as Substance

**Insufficient (sugar rush):**
"Most GTM teams don't use their data well."

**Sufficient (substance):**
"Worked with a client last month who had 30k enriched contacts in HubSpot. Sales complained they had no one to call. Looked at the CRM - zero ICP scoring, no engagement tracking, everything tagged 'prospect.' Built a simple 1-10 fit score based on industry, employee count, tech stack, and geo. Created three views: 8-10 with recent activity, 6-7 with open opps, 4-5 for nurture. Sales went from 'no targets' to 'here's our Q1 list' in a week. The data was fine. The views were missing."

### Substance Checklist

Every substantive claim needs at least 2 of:
- [ ] Specific example with concrete details (numbers, tools, timeframes)
- [ ] Technical implementation (column names, formulas, prompts)
- [ ] Reasoning shown (not just conclusions)
- [ ] Consequences or results (what happened?)
- [ ] Gotchas or lessons learned

---

## Anti-AI-Slop Patterns (Critical)

### Prohibited Patterns - Never Use

1. **Em-dashes** (—): Delete all. Use periods, commas, or restructure.

2. **Authority Signaling Phrases**:
   - "The uncomfortable truth"
   - "Let me be clear"
   - "Here's what nobody tells you"
   - "The hard truth is"
   - "Here's the reality"

3. **False Dichotomies**: "It's not X, it's Y" structures. Just state what it IS.

4. **Self-Branded Concepts**: "This is what I call..." Just explain it.

5. **Three Parallel Examples**: Real thinking produces 1-2 examples, then moves on.

6. **Artificial Drama Sentences**: "The shift sounds simple. It's not."

7. **Engagement Bait Endings**: "So here's my question for you..."

8. **Bullets for Arguments**: Arguments belong in prose. Bullets only for reference lists.

9. **Bold Headers as Transitions**: Headers for navigation only.

---

## LinkedIn-Specific Rules

### Opening Line Style

- **Always lowercase first word** (unless proper noun)
- Strong hook in first 2 lines
- No generic greetings

**Good**: "just finished a 6-hour clay table build that should've taken 90 minutes."

**Bad**: "I wanted to share something interesting that happened today."

### Paragraph Structure

- 1-2 sentences maximum per paragraph
- Lots of whitespace for mobile scrolling
- Short punchy lines create rhythm

### CTA Style

Your CTAs should invite co-building, not worship:

**Good**:
- "happy to share the exact prompt"
- "dm me if you're building something similar"
- "stealing this for your stack is encouraged"

**Bad**:
- "What do you think? Comment below!"
- "Agree? Hit that like button!"
- "Follow me for more tips!"

---

## Voice Calibration by Context

### For Clients (Email, Decks, Recaps)

**Tone**: Clear, confident, collaborative

**Structure**:
- Diagnosis (what we observed)
- Impact (what it's costing/limiting)
- Next step (specific, actionable)

**Avoid**:
- Sounding frantic or uncertain
- Over-selling results
- Shifting blame
- Generic recommendations

**Example**:
```
Quick status update on the Alumni Champion build:

What's done:
- Clay table pulling 150 closed-won contacts with champion tags
- Enrichment running weekly to detect job changes
- HubSpot properties created for champion tracking

What's live:
- 12 champions identified at new companies this week
- Companies flagged with has_alumni_champion property
- View created for sales to filter by champion accounts

What's next:
- Setting up automated Slack alerts for high-value changes
- Building lookalike scoring for champion's new buying committees

Blocker:
- Need confirmation on whether to auto-create deals or keep manual for now

Let me know which direction you prefer.
```

---

### For Internal Team (Slack, Notion)

**Tone**: Operational, clear, low ego

**Format**:
- What was done
- What's live  
- What's blocked
- What's next

**Avoid**:
- Walls of text
- Vague updates
- Asking open-ended questions without context

---

### For LinkedIn (Public Content)

**Tone**: Casual, builder, competent

**Format**:
- Lowercase first line
- Short paragraphs
- Technical details mixed with accessible context
- Specific examples and numbers

**Avoid**:
- Corporate speak
- Generic advice
- Performing expertise
- Over-polished content

---

## Safety Filters

### Pattern vs. Person Test

**Safe to critique**:
- CRM architectures (generic)
- GTM approaches (methodologies)
- Common mistakes (patterns)
- Tools/platforms (in general terms)

**Not safe to critique**:
- Specific clients (even anonymized if recognizable)
- Named competitors
- Individual practitioners
- Companies in your ecosystem

---

## Pre-Publication Checklist

Before posting, verify:

**Structure & Style**:
- [ ] Lowercase first line (unless proper noun)
- [ ] 1-2 sentence paragraphs max
- [ ] No em-dashes
- [ ] No authority signaling phrases
- [ ] Natural rhythm (not artificial)

**Substance**:
- [ ] At least one specific example with details
- [ ] Technical specifics (column names, tools, numbers)
- [ ] Reasoning or consequences shown
- [ ] Practical value or lesson

**Safety**:
- [ ] No named companies or people criticized
- [ ] Pattern vs. person test passed
- [ ] No ecosystem players targeted

**Voice**:
- [ ] Sounds like you, not a content machine
- [ ] Builder tone, not thought leader
- [ ] Casual but competent
- [ ] No generic B2B speak

---

## Content Improvement Protocol

When improving drafts:

1. **Remove AI slop first**: Em-dashes, authority phrases, false dichotomies
2. **Add specificity**: Replace "a client" with concrete details
3. **Show technical depth**: Column names, formulas, actual implementations
4. **Trim performance**: Delete anything that sounds like "content"
5. **Check safety**: Pattern vs. person, ecosystem protection
6. **Verify voice**: Does this sound like builder Shawn or corporate Shawn?

---

## Common Pitfalls to Avoid

### The "Thought Leader" Trap

- Performing wisdom instead of sharing lessons
- Abstract principles without concrete examples
- Three perfect parallel examples
- Branding concepts instead of explaining them

### The "Generic Advice" Trap

- "Use data to make better decisions"
- "Focus on your ICP"
- "Optimize your CRM"

These are worthless without specifics. Always add: how, why, what exactly?

### The "Over-Polish" Trap

- Spending 4 hours on a post that should take 30 minutes
- Optimizing language instead of adding substance
- Making it "perfect" instead of shipping it

### The "Too Technical" Trap

- Using jargon without context
- Assuming everyone knows Clay/HubSpot deeply
- Skipping the "why this matters" framing

Balance: Be specific enough to be useful, accessible enough to be interesting.

---

## Success Patterns From Your Best Content

### What Works

1. **Long tactical posts** (1000+ chars) with specific Clay/CRM implementations
2. **Behind-the-scenes** build processes with gotchas
3. **Anonymized client lessons** with real problems and solutions
4. **Pattern recognition** posts that name something others haven't
5. **Self-deprecating** builder humor (messy room post)

### What Doesn't Work

1. Short abstract advice without examples
2. Generic "here's a tip" posts
3. Over-polished corporate content
4. Posts without technical substance
5. Content that sounds like everyone else

---

## Remember

**Your authentic voice is your asset.**

The lowercase-first-line style, the casual builder energy, the pattern recognition, the technical depth, the messy honesty - this is what makes your content perform.

**The goal isn't to be safe and boring.** It's to be strategically authentic and substantive.

**Your specific strengths**:
- Practitioner authority (you actually build this stuff)
- Technical specificity (column names, formulas, real implementations)
- Pattern articulation (seeing systems others miss)
- Authentic voice (casual, competent, not corporate)

**Your specific risks**:
- Over-optimization (spending hours perfecting)
- AI slop patterns (especially em-dashes and authority phrases)
- Too technical (losing accessibility)
- Criticizing ecosystem players (limiting business opportunities)

**Ship > Perfect**: Done and authentic beats perfect and delayed.

**Build in public**: Your content should invite co-building, not position you as guru.

There's huge space between "generic advice" and "over-technical". Live in that space.

You don't need to sound like a thought leader. You need to sound like the builder you are.

---

## When to Use This Skill

**Trigger on**:
- Creating LinkedIn posts
- Reviewing content before publishing
- Writing client emails or status updates
- Drafting SOPs or documentation
- Any time you're creating public-facing GTM content
- Brand positioning questions
- "Does this sound like me?" checks

**Output**:
- Evaluated content with specific improvements
- Rewritten content following voice principles
- Risk assessment for brand/business implications
- Pattern recognition about recurring issues
- Substance checks with concrete suggestions
