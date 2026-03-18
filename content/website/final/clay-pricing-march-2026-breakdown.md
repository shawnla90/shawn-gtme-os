---
title: "clay changed their pricing. here's what it actually means for builders"
date: "2026-03-11"
excerpt: "Clay's March 2026 pricing overhaul - dual currency, cheaper data, feature reshuffling. A practitioner breakdown of who wins, who loses, and what to do about it."
category: "gtm-engineering"
featured: true
---

**tl;dr:** Clay split credits into two currencies (Actions and Data Credits), killed the Explorer tier, and reshuffled features across plans. Data got cheaper, but orchestration is now metered. If you're on a legacy plan, do the math before switching. You have until April 10, 2026.

## the timing

Clay dropped new pricing today. not a tweak. a full restructure. new plan names, new currency system, features moving between tiers. they even published their internal pricing memo, which is either very confident or very calculated. probably both.

I've been building in Clay daily for over a year. tables, Claygents, HTTP API integrations, enrichment architectures. I documented 60+ patterns in the [Clay Wiki](https://thegtmos.ai/clay-wiki). I'm not a Clay partner. I'm not an affiliate. I don't get paid when you buy Clay.

so here's the breakdown from someone who actually uses the tool every day and has zero incentive to spin this in any direction.

## what actually changed in Clay's March 2026 pricing?

the old model was simple. one currency: credits. everything you did in Clay burned credits. enrichments, AI calls, HTTP columns, the works. plans went: Free, Starter ($149), Explorer ($349), Pro ($800), Enterprise (custom).

the new model splits that single currency into two:

**Data Credits** for enrichments. the marketplace stuff. Apollo lookups, email finders, firmographic data. Clay says they've cut data costs by 50-90% across the top 20 enrichments.

**Actions** for everything else. every time Clay does orchestration work, that's an Action. enrichment runs, Claygent calls, HTTP API executions, CRM pushes, webhook triggers. formulas and imports don't count. but basically anything that involves Clay doing work on your behalf costs an Action now.

the new tiers: Free, Launch ($185/mo), Growth ($495/mo), Enterprise (custom).

## what does Clay's old vs new pricing look like side by side?

**old world:**

- Starter: $149/mo, 2,000-3,000 credits, no CRM, no HTTP API
- Explorer: $349/mo, 10,000-20,000 credits, HTTP API + webhooks, no CRM
- Pro: $800/mo, 50,000-150,000 credits, CRM integrations, 5 team seats

**new world:**

- Launch: $185/mo, 15,000 Actions, 2,500-20,000 Data Credits
- Growth: $495/mo, 40,000 Actions, 6,000-100,000 Data Credits, CRM sync, HTTP API, webhooks, Web Intent
- Enterprise: custom, 100K+ Actions, 100K+ Data Credits, data warehouse sync, SSO, bulk enrichment

the entry price went up from $149 to $185. but the feature set at each tier shifted significantly. you can't do a straight dollar comparison without looking at what each tier now includes.

## who wins under Clay's new pricing?

### the team stuck at $800 just for CRM sync

this is the clearest win. CRM integrations (HubSpot, Salesforce) used to require the Pro plan at $800/mo. now they're on Growth at $495. if you were paying $800 primarily because you needed Clay to sync with your CRM, you just saved $305/mo by switching.

that's $3,660/year. for a lot of small teams, that's meaningful.

### heavy enrichment users

if you run large enrichment volumes, the 50-90% data cost reduction is real money. Clay's internal memo says they expect to lose revenue on this move in the short term. that means the savings are actual, not marketing math.

the account-first enrichment pattern I teach in the [Clay Wiki](https://thegtmos.ai/clay-wiki/account-first-enrichment) already saves credits by deduplicating at the company level. cheaper per-enrichment costs on top of good architecture means your unit economics improve twice over.

### builders who want Web Intent and Ads

Clay bundled their newer products (Web Intent signals, Clay Ads) into the Growth tier. these used to be enterprise-only or separate add-ons. if you're building intent-based workflows, the Growth plan now gives you more surface area to work with.

## who loses under Clay's new pricing?

### Explorer users who relied on HTTP API

this is the most painful change and nobody's talking about it enough.

the old Explorer plan gave you HTTP API access at $349/mo. HTTP columns were how builders connected Clay to external services, custom APIs, and automation tools. it was the builder's plan.

under the new pricing, HTTP API requires the Growth plan at $495/mo. that's a $146/mo increase just to keep doing what you were already doing. and here's the kicker: HTTP API calls now also consume Actions. they used to be free (beyond the credit cost). now they're a metered resource.

if you built your entire GTM stack around Clay's HTTP column at the Explorer tier, this change hits twice: higher plan cost and a new consumption charge on every API call.

### light users who don't need 15,000 Actions

the old Starter plan at $149/mo was genuinely lightweight. import some contacts, run a few enrichments, export. no API access needed, no CRM sync, just basic Clay.

the new Launch plan at $185/mo gives you 15,000 Actions. if you're only running 2,000 enrichments a month, you're paying $36 more for capacity you'll never use. Clay says 90% of customers won't hit their Actions limit. but that means 10% will. and the light users are subsidizing a higher floor.

### anyone who liked simple pricing

one currency was clean. you knew what things cost. the dual currency adds cognitive overhead. now you have to think about both Data Credits (how much enrichment data costs) and Actions (how much Clay's orchestration costs). two numbers to track, two limits to monitor, two things that can run out mid-workflow.

for experienced builders this is manageable. for teams just getting started with Clay, it's one more thing to learn before you can even evaluate whether the tool is working for you.

## what the builder should actually do

### if you're on a legacy plan: don't panic, do math

Clay is grandfathering existing plans. you don't have to switch. but you have until April 10, 2026 to do a one-time switch between legacy plans if a different legacy tier makes more sense for you.

pull your last 3 months of credit usage. look at what you actually consume vs. what you pay for. then model it against the new tiers. the math is different for every team.

### if HTTP API is your lifeline: run the numbers carefully

map how many HTTP API calls you make per month. under the new model, each call is an Action. Growth gives you 40,000 Actions. if you're running 5,000 HTTP calls plus 10,000 enrichment runs plus Claygent calls, add up whether 40,000 Actions covers it. the Actions meter includes everything, not just HTTP.

### if you're new to Clay: start on Growth

the Growth plan at $495/mo is the new sweet spot for serious builders. CRM sync, HTTP API, webhooks, Web Intent, 40,000 Actions, up to 100,000 Data Credits. that used to require the $800 Pro plan for just the CRM piece.

if you're building production GTM workflows, Growth is where the tooling lives.

### if you barely use Clay: consider whether you need it

I say this as someone who uses Clay daily. if you're running 1,000-2,000 enrichments a month with no API integrations and no CRM sync, you're now paying $185/mo for what amounts to a fancy spreadsheet with enrichment columns. that might still be worth it. but it also might be worth running those enrichments directly through [Apollo's API](https://shawnos.ai/blog/why-apollo-should-be-your-first-sourcing-run-not-clay) or Prospeo's API and saving the platform cost entirely.

Clay's value is in orchestration, not individual enrichments. if you're not using the orchestration, you're paying for the platform without using the platform.

## what's the bigger picture behind Clay's pricing shift?

Clay published their internal pricing memo. they explicitly said they expect a ~10% short-term revenue decline. that's a real bet. they're saying: we'll make less money now because we believe cheaper data plus accessible features will make people build more complex workflows, which will drive Actions consumption.

it's a platform play. they want you to go deep into Clay. more Claygents, more HTTP columns, more CRM syncs, more automations. every one of those burns Actions. the data is cheaper but the orchestration is now metered.

this isn't good or bad. it's a business model shift from "pay for data" to "pay for what the platform does for you." understanding that shift is the difference between the pricing working for you or working against you.

## what I'm updating in the Clay Wiki

I'm adding a full pricing model entry to the [Clay Wiki](https://thegtmos.ai/clay-wiki) covering the new dual-currency system, tier comparison, and migration decision framework. the existing [credit system guide](https://thegtmos.ai/clay-wiki/credit-system) still applies for understanding how individual enrichments cost credits. the new entry covers the structural change on top of that. for a deep dive on how the two currencies interact, see the [Actions vs Data Credits guide](https://thegtmos.ai/clay-wiki/actions-credits-dual-system).

this is also why the free audit matters more now than last week. if you're evaluating whether to switch plans, stay on legacy, or restructure your Clay architecture to optimize for the new model, [that 30-minute conversation](https://shawnos.ai/blog/before-you-hire-a-clay-agency) could save you thousands in misallocated spend.

## my take

Clay is becoming more of a platform and less of a data tool. the pricing reflects that. if you're a builder who uses Clay as orchestration infrastructure (CRM sync, HTTP API, Claygent workflows, multi-step enrichment), the new pricing probably works in your favor. cheaper data, more features at lower tiers.

if you're a lightweight user who just wants enrichment without the platform, the floor just got higher and the complexity just increased. the [evolution from SDR to GTM engineer](https://shawnos.ai/blog/sdr-to-solo-gtm-engineer) means learning to build outside any single tool's constraints.

and if you're on Explorer at $349 using HTTP API heavily, run your numbers before switching. your legacy plan might be the better deal.

no vendor is going to tell you that last part. that's why I'm telling you.

## frequently asked questions

### what are Clay Actions vs Data Credits?
Data Credits pay for enrichment data from Clay's marketplace (Apollo lookups, email finders, firmographic data). Actions pay for everything else Clay does on your behalf: orchestration, Claygent calls, HTTP API executions, CRM pushes, webhook triggers. Two separate meters, two separate budgets.

### is the old Clay pricing still available?
If you're already on a legacy plan, yes. Clay is grandfathering existing plans. You have until April 10, 2026 to do a one-time switch between legacy tiers. New signups only see the new pricing.

### should I switch from my legacy plan to the new pricing?
Pull your last 3 months of credit usage and model it against the new tiers. If you were on Explorer at $349 for HTTP API access, your legacy plan is likely the better deal. If you were on Pro at $800 mainly for CRM sync, switching to Growth at $495 saves $305/mo.

### how many Actions do I actually need?
Add up your monthly enrichment runs, Claygent calls, HTTP API executions, CRM pushes, and webhook triggers. Growth gives you 40,000 Actions. Clay says 90% of users won't hit their limit, but if you're running heavy HTTP API workflows, the meter adds up fast.

### did Clay data credits get cheaper?
Yes. Clay claims 50-90% cost reduction across the top 20 enrichments. Their internal memo says they expect short-term revenue loss from this change, which suggests the savings are real.

shawn ⚡ GTM Engineer
