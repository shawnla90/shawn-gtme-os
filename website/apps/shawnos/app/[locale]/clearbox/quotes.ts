export type ClearboxCategory = 'lead' | 'competitor' | 'engager'

export interface ClearboxQuote {
  id: string
  category: ClearboxCategory
  text: string
  author: {
    name: string
    role: string
    avatar: string
  }
}

function avatar(seed: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=171717&radius=50`
}

export const inlineQuotes: ClearboxQuote[] = [
  {
    id: 'q-lead-01',
    category: 'lead',
    text: "anyone know a tool that actually tracks brand mentions inside chatgpt and perplexity answers without me writing 40 prompts a week? client meeting next thursday and i have nothing.",
    author: { name: 'agency_seo_lead', role: 'SEO Lead, boutique agency', avatar: avatar('agency_seo_lead') },
  },
  {
    id: 'q-lead-02',
    category: 'lead',
    text: "looking for software that pulls buying signals out of public conversations (reddit, hn, linkedin comments) and pings me when someone in my ICP is shopping. does this even exist or am i building it myself again.",
    author: { name: 'founder_b2b', role: 'Founder, vertical SaaS', avatar: avatar('founder_b2b') },
  },
  {
    id: 'q-lead-03',
    category: 'lead',
    text: "need a tool that watches subreddits in my niche and surfaces threads where people are actually asking for what we sell. tried setting up alerts, drowning in noise, none of it is filtered by intent.",
    author: { name: 'growth_eng_42', role: 'Growth Engineer, Series A SaaS', avatar: avatar('growth_eng_42') },
  },
  {
    id: 'q-lead-04',
    category: 'lead',
    text: "is there a tool that monitors trending threads on linkedin + x and tells me which ones a vendor in my space could actually add value to? not auto-reply slop, just a feed of conversations worth showing up in.",
    author: { name: 'demand_gen_anon', role: 'Demand Gen, B2B platform', avatar: avatar('demand_gen_anon') },
  },
  {
    id: 'q-comp-01',
    category: 'competitor',
    text: "burned $800 on phone credits in [CompetitorTool] last week and ~24% came back wrong. the pricing is atrocious and everyone in tech is under mind control thinking i need to keep paying for it. actively shopping anything else.",
    author: { name: 'rev_ops_anon', role: 'RevOps, mid-market SaaS', avatar: avatar('rev_ops_anon') },
  },
  {
    id: 'q-comp-02',
    category: 'competitor',
    text: "we are 6 months into [CompetitorCRM] and the workflow is sdr opens contact, jumps to outbound tool, jumps to linkedin, jumps back to crm notes. half our follow-ups die because reps forget which tab the conversation lives in. open to anything that kills the tab gymnastics.",
    author: { name: 'sdr_lead_22', role: 'Head of SDR, B2B SaaS', avatar: avatar('sdr_lead_22') },
  },
  {
    id: 'q-comp-03',
    category: 'competitor',
    text: "[CompetitorAEO] charges enterprise prices for what is basically an openai api call wrapped in a dashboard. i can build the scraper in a weekend. show me something that actually links a citation to pipeline or i'm out.",
    author: { name: 'aeo_skeptic', role: 'Head of Growth, Series A SaaS', avatar: avatar('aeo_skeptic') },
  },
  {
    id: 'q-comp-04',
    category: 'competitor',
    text: "we ran [CompetitorOutbound] + [CompetitorEnrichment] stitched together for two quarters. spend was $2.1k/mo and the only signal it gave us was firmographic. comparing alternatives that start from a real intent moment instead of a stale title filter.",
    author: { name: 'gtm_engineer_x', role: 'GTM Engineer, scaleup', avatar: avatar('gtm_engineer_x') },
  },
  {
    id: 'q-eng-01',
    category: 'engager',
    text: "how are you all handling attribution when the first touch is a chatgpt referral with no utm and the second touch is a reddit DM 11 days later? our crm thinks it's all direct traffic and our cmo is losing it.",
    author: { name: 'analytics_lead_b2b', role: 'Analytics Lead, mid-market SaaS', avatar: avatar('analytics_lead_b2b') },
  },
  {
    id: 'q-eng-02',
    category: 'engager',
    text: "genuine question for the gtm crowd: when you spot a thread where someone is clearly mid-evaluation, what's your actual rule for showing up? we keep debating between never-comment, founder-only comments, or just dm. nothing feels right yet.",
    author: { name: 'pmm_anon_88', role: 'PMM, dev tools company', avatar: avatar('pmm_anon_88') },
  },
  {
    id: 'q-eng-03',
    category: 'engager',
    text: "anyone else find that the highest-intent prospects never fill out a form? our best closed-won deals last quarter all came from inbound reddit DMs after someone saw us help in a thread. trying to figure out how to make that repeatable without it feeling gross.",
    author: { name: 'founder_devtools', role: 'Founder, dev tools startup', avatar: avatar('founder_devtools') },
  },
  {
    id: 'q-eng-04',
    category: 'engager',
    text: "how do you decide which competitor mentions are worth replying to vs ignoring? we get pinged on every brand mention but maybe 1 in 20 is actually a buyer comparing us. the rest is journalists, students, and one guy who hates our pricing page.",
    author: { name: 'brand_ops_lead', role: 'Brand & Comms, Series B SaaS', avatar: avatar('brand_ops_lead') },
  },
]
