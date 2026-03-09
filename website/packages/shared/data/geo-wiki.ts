/**
 * ShawnOS - GEO Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { WikiSection } from './clay-wiki'

/* ── types ─────────────────────────────────────────── */

export type GeoWikiCategory =
  | 'foundations'
  | 'tactics'
  | 'technical'
  | 'measurement'
  | 'case-studies'

export interface GeoWikiEntry {
  id: string // URL slug
  title: string
  subtitle: string // one-liner for cards
  category: GeoWikiCategory
  description: string // SEO meta description
  keywords: string[]
  sections: WikiSection[]
  related: string[] // other wiki entry IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/* ── category metadata ────────────────────────────── */

export const GEO_WIKI_CATEGORIES: {
  id: GeoWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'foundations',
    label: 'GEO Foundations',
    description:
      'Core concepts of how AI engines discover, evaluate, and cite content',
    prompt: '$ cd ~/geo-wiki/foundations/',
  },
  {
    id: 'tactics',
    label: 'GEO Tactics',
    description:
      'Actionable patterns for writing content AI engines want to cite',
    prompt: '$ cd ~/geo-wiki/tactics/',
  },
  {
    id: 'technical',
    label: 'Technical Implementation',
    description:
      'Schema markup, llms.txt, robots.txt, RSS, and content architecture for AI',
    prompt: '$ cd ~/geo-wiki/technical/',
  },
  {
    id: 'measurement',
    label: 'Measurement and Tools',
    description:
      'How to track AI citations, visibility, and share of voice',
    prompt: '$ cd ~/geo-wiki/measurement/',
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    description:
      'Real-world GEO implementations and playbooks',
    prompt: '$ cd ~/geo-wiki/case-studies/',
  },
]

/* ── helpers ──────────────────────────────────────── */

export function getGeoWikiEntry(
  slug: string,
): GeoWikiEntry | undefined {
  return GEO_WIKI_ENTRIES.find((e) => e.id === slug)
}

export function getGeoWikiByCategory(
  category: GeoWikiCategory,
): GeoWikiEntry[] {
  return GEO_WIKI_ENTRIES.filter((e) => e.category === category)
}

/* ── wiki entries ─────────────────────────────────── */

export const GEO_WIKI_ENTRIES: GeoWikiEntry[] = [
  /* ================================================================== */
  /*  FOUNDATIONS                                                        */
  /* ================================================================== */

  {
    id: 'what-is-geo',
    title: 'What Is Generative Engine Optimization (GEO)?',
    subtitle:
      'The discipline of getting your content cited by AI search engines',
    category: 'foundations',
    description:
      'GEO is the practice of optimizing content so AI engines like ChatGPT, Perplexity, and Gemini discover, trust, and cite it in answers.',
    keywords: [
      'generative engine optimization',
      'GEO',
      'AI search optimization',
      'AI citations',
      'LLM optimization',
    ],
    difficulty: 'beginner',
    related: [
      'geo-vs-seo',
      'what-is-aeo',
      'how-ai-engines-source-content',
      'geo-ranking-factors',
    ],
    sections: [
      {
        heading: 'GEO in Plain English',
        type: 'prose',
        content:
          "Generative Engine Optimization is the practice of structuring your content so that AI-powered search engines - ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude - can discover it, understand it, trust it, and cite it in their generated answers. Traditional SEO got you ranked in a list of ten blue links. GEO gets you woven into the answer itself. When someone asks ChatGPT a question about your domain and it cites your site by name, that is GEO working. When Perplexity pulls a statistic from your blog and links back to you in a footnote, that is GEO working. The shift is fundamental: you are no longer competing for a click on a results page. You are competing to be the source that the AI trusts enough to quote. This changes what good content looks like. Vague thought leadership that ranks for long-tail keywords but says nothing specific will get ignored by AI engines. They need extractable facts, clear claims, structured data, and authoritative signals to justify pulling from your content instead of the thousands of other pages on the same topic.",
      },
      {
        heading: 'Why GEO Matters Now',
        type: 'prose',
        content:
          "The numbers tell the story. As of early 2026, ChatGPT processes over 400 million queries per week. Perplexity handles around 15 million daily searches. Google AI Overviews appear on roughly 30 percent of search results pages. That is hundreds of millions of answers being generated every day where the AI has to decide which sources to pull from. If your content is not in that consideration set, you are invisible to a growing share of how people find information. The trajectory is clear - AI-mediated search is not replacing traditional search overnight, but it is capturing the highest-intent queries first. When someone asks a complex question, compares options, or needs a synthesized answer, they increasingly go to an AI engine instead of scrolling through search results. These are exactly the queries that drive B2B pipeline and purchasing decisions. Ignoring GEO in 2026 is like ignoring SEO in 2010 - you can survive without it for now, but the window to build authority while the field is young is closing fast.",
      },
      {
        heading: 'The Core GEO Loop',
        type: 'pattern',
        content:
          "GEO operates on a simple loop: Create content with extractable claims and clear structure. Make it discoverable through technical signals like schema markup, llms.txt, and RSS feeds. Build entity authority so AI engines associate your brand with specific topics. Measure whether you are being cited and in what contexts. Iterate based on what gets picked up and what gets ignored. Each step reinforces the others. Better structure makes discovery easier. Stronger entity authority makes AI engines more likely to cite you even when competitors cover the same topic. Measurement tells you where the loop is working and where it is leaking. The mistake most teams make is treating GEO as a one-time content optimization project. It is not. It is an ongoing system, just like SEO. The sites that win at GEO are the ones that build the infrastructure - the content architecture, the schema layer, the measurement pipeline - and then run the loop continuously.",
      },
      {
        heading: 'What GEO Is Not',
        type: 'anti-pattern',
        content:
          "GEO is not keyword stuffing for AI. It is not gaming prompts. It is not writing content specifically designed to trick language models into citing you. AI engines are trained to evaluate source quality, and they get better at it with every model update. If your content is thin, derivative, or stuffed with keywords but light on substance, no amount of schema markup will make ChatGPT cite it. GEO is also not a replacement for SEO. The two work together. Strong SEO signals - domain authority, backlinks, topical depth - feed into the signals AI engines use to evaluate trustworthiness. A site with no organic search presence is unlikely to suddenly appear in AI-generated answers. Think of GEO as the layer you build on top of solid SEO fundamentals, not a shortcut around them.",
      },
    ],
  },

  {
    id: 'geo-vs-seo',
    title: 'GEO vs SEO - What Changed and What Still Works',
    subtitle:
      'Where traditional SEO ends and generative optimization begins',
    category: 'foundations',
    description:
      'Compare GEO and SEO side by side - what carries over from traditional search, what is new, and how to run both simultaneously.',
    keywords: [
      'GEO vs SEO',
      'SEO still works',
      'AI search vs Google',
      'search optimization 2026',
      'GEO strategy',
    ],
    difficulty: 'beginner',
    related: [
      'what-is-geo',
      'what-is-aeo',
      'geo-ranking-factors',
      'google-ai-overview-optimization',
    ],
    sections: [
      {
        heading: 'What Carries Over from SEO',
        type: 'prose',
        content:
          "A lot of SEO fundamentals still matter for GEO. Domain authority is still a trust signal - AI engines prefer citing established domains over unknown ones. Topical depth still matters - a site with fifty pages on a topic carries more weight than one with a single post. Backlinks still function as a credibility signal because AI engines use the same web graph data that traditional search relies on. Page speed and crawlability still matter because AI crawlers need to access your content just like Googlebot does. Internal linking still helps because it establishes topical relationships between pages. The content quality bar that Google raised with its Helpful Content Update aligns with what AI engines look for - original, expert, experience-backed content. If you have been doing good SEO for the past five years, you have a head start on GEO. The foundational work transfers directly.",
      },
      {
        heading: 'What Changed with Generative Engines',
        type: 'pattern',
        content:
          "The biggest shift is from ranking to citation. In SEO, your goal is to rank in positions one through ten. In GEO, your goal is to be the source the AI quotes. There is no position two - either you are cited or you are not. This changes the content model. SEO rewarded comprehensive pages that covered every angle of a topic to capture long-tail queries. GEO rewards pages with clear, extractable claims that an AI can pull into an answer without having to summarize a wall of text. Structure matters more than word count. A 500-word page with clear answer blocks, specific statistics, and structured data can outperform a 3,000-word SEO pillar page in AI citations. Another key change: freshness signals carry more weight. AI engines are trained to prefer recent, updated content because their users expect current answers. A page last updated in 2022 loses to a page updated this month, even if the older page has stronger backlinks.",
      },
      {
        heading: 'Running SEO and GEO Together',
        type: 'pro-tip',
        content:
          "You do not have to choose between SEO and GEO. The winning strategy runs both simultaneously because they reinforce each other. Here is the practical approach: keep your existing SEO infrastructure - title tags, meta descriptions, header hierarchy, internal links, sitemap. Layer GEO signals on top - schema markup, llms.txt, answer blocks within your content, structured data that AI can extract. Write content that serves both audiences: humans scanning a search results page and AI engines parsing for citable claims. The format that works for both is the answer-block pattern - a clear question or heading followed by a direct, specific answer in the first paragraph, then supporting detail below. Google rewards this for featured snippets, and AI engines reward it for citations. One piece of content, two distribution channels. The teams that separate their SEO and GEO strategies end up duplicating effort. Unify them.",
      },
      {
        heading: 'Anti-Pattern: Abandoning SEO for GEO',
        type: 'anti-pattern',
        content:
          "Some marketers see AI search growing and decide to abandon traditional SEO entirely. This is a mistake. Traditional search still drives the majority of web traffic. Google processes over 8.5 billion searches per day - AI search is growing but has not replaced that volume. More importantly, SEO signals feed GEO performance. The authority you build through traditional search - domain rating, backlink profile, indexed page depth - is part of what makes AI engines trust your content in the first place. Dropping SEO to chase GEO is like stopping your marketing to focus on sales. The pipeline dries up. Run both. Measure both. Let each channel reinforce the other.",
      },
    ],
  },

  {
    id: 'what-is-aeo',
    title: 'What Is Answer Engine Optimization (AEO)?',
    subtitle:
      'Optimizing for direct answers in featured snippets and AI responses',
    category: 'foundations',
    description:
      'AEO focuses on structuring content to appear as direct answers in featured snippets, voice search, and AI-generated responses.',
    keywords: [
      'answer engine optimization',
      'AEO',
      'featured snippets',
      'voice search optimization',
      'direct answers',
      'zero-click search',
    ],
    difficulty: 'beginner',
    related: [
      'what-is-geo',
      'answer-block-pattern',
      'google-ai-overview-optimization',
      'geo-vs-seo',
    ],
    sections: [
      {
        heading: 'AEO Defined',
        type: 'prose',
        content:
          "Answer Engine Optimization is the practice of formatting content to appear as direct answers - in Google featured snippets, voice assistant responses, and AI-generated answers. AEO predates GEO by several years. It emerged when Google started showing answer boxes at the top of search results, pulling content directly from web pages to answer queries without requiring a click. Voice assistants like Alexa and Google Assistant amplified the importance of AEO because they can only read one answer - there is no scrolling through results on a voice device. The core principle is simple: structure your content so that a machine can extract a clean, complete answer to a specific question. That means clear question-and-answer formatting, concise first paragraphs that directly address the query, lists and tables that machines can parse, and schema markup that tells search engines exactly what type of content you are providing. AEO is essentially the content-formatting layer of GEO - it focuses on making individual answers extractable rather than optimizing your entire content system for AI visibility.",
      },
      {
        heading: 'AEO vs GEO - Scope Difference',
        type: 'pattern',
        content:
          "Think of AEO as a subset of GEO. AEO is about formatting individual pieces of content to be extractable as answers. GEO is the broader discipline that includes AEO plus entity authority, technical infrastructure, measurement, and content strategy. AEO asks: can an AI extract a clean answer from this page? GEO asks: does the AI trust your brand enough to cite you, can it discover your content, is your content structured for extraction, and are you measuring the results? You need AEO skills to execute GEO, but AEO alone is not enough. A perfectly formatted answer block on a site with no domain authority, no schema markup, and no freshness signals will lose to a mediocre answer on a trusted, well-structured site. AEO is necessary but not sufficient. It is the content layer of a multi-layer optimization system.",
      },
      {
        heading: 'AEO Formatting Patterns',
        type: 'pattern',
        content:
          "The patterns that win featured snippets also win AI citations. Paragraph snippets: start with a clear question as your heading, then answer it directly in the first two sentences. Keep the answer under 50 words for snippet eligibility, then expand below. List snippets: use numbered or bulleted lists with clear, parallel structure. Each item should be a complete thought. Table snippets: use comparison tables with clear headers when comparing options, pricing, or features. Definition snippets: for what-is queries, lead with a one-sentence definition, then expand. The key principle across all formats is front-loading the answer. Do not build up to your point across three paragraphs. State the answer first, then provide context and depth. AI engines and featured snippet algorithms both reward this inverted pyramid structure because it makes extraction clean and reliable.",
      },
      {
        heading: 'Pro-Tip: Question-First Headers',
        type: 'pro-tip',
        content:
          "One of the highest-leverage AEO tactics is writing your H2 and H3 headers as the exact questions your audience is asking, then answering them directly in the first sentence of that section. This works because AI engines are fundamentally answering questions - when they see a heading that matches the query and an answer that immediately follows, the extraction is trivial. Use tools like AlsoAsked, AnswerThePublic, or even the People Also Ask boxes in Google search results to find the exact question phrasing people use. Match the phrasing closely but naturally. If people ask how much does X cost, your heading should be How Much Does X Cost, not Pricing Information for X. The closer your heading matches the query, the easier the extraction for both featured snippets and AI engines.",
      },
    ],
  },

  {
    id: 'how-ai-engines-source-content',
    title: 'How AI Engines Source and Cite Content',
    subtitle:
      'Inside the pipeline from crawl to citation in AI-generated answers',
    category: 'foundations',
    description:
      'How ChatGPT, Perplexity, and Gemini discover, evaluate, and cite web content - the full pipeline from crawl to generated answer.',
    keywords: [
      'AI content sourcing',
      'how ChatGPT cites sources',
      'Perplexity citations',
      'AI crawlers',
      'RAG pipeline',
      'AI search pipeline',
    ],
    difficulty: 'intermediate',
    related: [
      'what-is-geo',
      'geo-ranking-factors',
      'robots-txt-for-ai-crawlers',
      'schema-markup-for-ai',
    ],
    sections: [
      {
        heading: 'The Three-Stage Pipeline',
        type: 'pattern',
        content:
          "AI engines follow a three-stage pipeline to go from a user query to a cited answer. Stage one is retrieval - the engine needs to find relevant content. This happens through a combination of pre-trained knowledge (what the model learned during training), real-time web search (Perplexity and ChatGPT with browsing both do this), and indexed content stores. Stage two is evaluation - once candidate sources are retrieved, the engine assesses them for relevance, authority, freshness, and extractability. Not every retrieved source makes it into the final answer. Stage three is generation - the engine synthesizes information from the top sources, generates a natural language answer, and decides which sources to cite inline or in footnotes. Each stage has different optimization levers. Retrieval depends on your technical infrastructure - can the AI find your content? Evaluation depends on your content quality and authority signals. Generation depends on how extractable and quotable your content is.",
      },
      {
        heading: 'Retrieval: How AI Finds Your Content',
        type: 'prose',
        content:
          "Different AI engines use different retrieval methods, but they converge on similar patterns. Perplexity runs a real-time web search for every query using its own search index plus Bing results. ChatGPT with browsing uses Bing search. Google Gemini and AI Overviews use Google's own search index. Claude does not browse the web in standard mode but has training data and can use tools. The retrieval step means that if your content is not indexed by search engines, it is invisible to most AI engines. All your SEO fundamentals - sitemaps, crawlability, robots.txt configuration - directly impact whether AI engines can even find your content. Beyond traditional search indexing, some AI engines also use RSS feeds, API endpoints, and direct content partnerships. Perplexity has been particularly aggressive about indexing RSS content quickly. This means your RSS feed is not just for blog subscribers anymore - it is a discovery channel for AI engines.",
      },
      {
        heading: 'Evaluation: How AI Decides What to Trust',
        type: 'pattern',
        content:
          "Once an AI engine has a set of candidate sources, it needs to decide which ones to actually cite. The evaluation criteria vary by engine but cluster around four factors. Authority: is this source recognized as an expert on this topic? Signals include domain authority, backlink profile, author credentials, and whether the source is frequently cited by other trusted sources. Relevance: does this source directly address the query? Sources that answer the question head-on beat sources that mention the topic tangentially. Freshness: was this content recently published or updated? AI engines strongly prefer recent content, especially for topics that evolve. Extractability: can the AI cleanly pull a specific claim, statistic, or answer from this source? Content that buries its key points in long paragraphs loses to content with clear, structured answer blocks. The weight of each factor varies by query type. For factual queries, authority and extractability dominate. For comparison queries, freshness and relevance matter more.",
      },
      {
        heading: 'Generation: How Citations Get Placed',
        type: 'prose',
        content:
          "The generation stage is where your content either gets cited or gets left out. AI engines have different citation styles. Perplexity uses numbered footnotes with source links - it is the most citation-heavy of the major engines. ChatGPT with browsing includes inline links and sometimes source cards at the bottom. Google AI Overviews show source cards with site name, favicon, and title. The common thread is that AI engines cite sources at the claim level, not the page level. If your page has ten facts and the AI uses one of them, it cites your page for that specific claim. This means every individual claim on your page is a potential citation opportunity. Pages with more extractable, specific claims have more surface area for citations. Generic overview pages with no specific claims rarely get cited even if they rank well in traditional search. The engine has nothing specific to attribute to them.",
      },
      {
        heading: 'Anti-Pattern: Blocking AI Crawlers Entirely',
        type: 'anti-pattern',
        content:
          "Some publishers have blocked AI crawlers like GPTBot and PerplexityBot in their robots.txt, hoping to force AI engines to license their content. While this is a legitimate business decision for large media companies with negotiating leverage, for most businesses it is self-defeating. Blocking AI crawlers does not prevent AI engines from knowing about your content - they still have training data and can access cached versions. But it does prevent them from citing you with a fresh, linked reference. You go from being a cited source to being uncredited background knowledge. For B2B companies, startups, and content-driven businesses, AI citations are free, high-intent distribution. Blocking that is like blocking Googlebot in 2005 because you did not want people finding your site through search.",
      },
    ],
  },

  {
    id: 'geo-ranking-factors',
    title: 'The Ranking Factors That Drive AI Citations',
    subtitle:
      'What actually determines whether AI engines cite your content',
    category: 'foundations',
    description:
      'The key ranking factors for AI citations - authority, extractability, freshness, specificity, and technical signals that drive GEO.',
    keywords: [
      'GEO ranking factors',
      'AI citation factors',
      'what makes AI cite you',
      'GEO signals',
      'AI search ranking',
    ],
    difficulty: 'intermediate',
    related: [
      'how-ai-engines-source-content',
      'entity-authority',
      'content-extractability',
      'citation-bait',
    ],
    sections: [
      {
        heading: 'The Five Core GEO Ranking Factors',
        type: 'pattern',
        content:
          "After analyzing thousands of AI-generated answers across ChatGPT, Perplexity, and Google AI Overviews, five ranking factors consistently determine which sources get cited. First is entity authority - does the AI engine recognize your brand or author as an authority on this topic? Second is content extractability - can the AI cleanly pull a specific answer, statistic, or claim from your page? Third is freshness - was this content recently published or updated? Fourth is specificity - does your content make concrete, citable claims rather than vague generalizations? Fifth is technical accessibility - can the AI crawler access, parse, and understand your content structure? These five factors interact with each other. A highly extractable page from an unknown entity gets fewer citations than a moderately extractable page from a recognized authority. A specific, data-rich page that was last updated in 2021 loses to a less detailed page updated last week. The winning formula is scoring high across all five.",
      },
      {
        heading: 'Entity Authority Deep Dive',
        type: 'prose',
        content:
          "Entity authority is the single most important GEO ranking factor because it acts as a multiplier on everything else. AI engines maintain an implicit knowledge graph of entities - brands, people, products, concepts - and the relationships between them. When you search ChatGPT for information about a topic it has a strong entity association for, it defaults to those associated sources. Building entity authority requires consistent, deep coverage of your topic across multiple signals: your website, social profiles, media mentions, podcast appearances, and other sites that reference you. The more contexts in which your brand appears as an authority on a specific topic, the stronger the entity association becomes. This is different from domain authority in SEO. Domain authority is a single score based primarily on backlinks. Entity authority is topic-specific and built across the entire web, not just your site.",
      },
      {
        heading: 'Freshness Signals and Update Cadence',
        type: 'pro-tip',
        content:
          "Freshness is the most underrated GEO ranking factor because it is the easiest to control. AI engines prefer recent content because their users expect current answers. A Perplexity search for best CRM for startups 2026 will heavily weight sources published or updated in 2026 over evergreen guides from 2024. The actionable play: establish an update cadence for your highest-value content. Review and update your top pages monthly. Add a visible last updated date - both in your content and in your schema markup using the dateModified property. Republish updated content through your RSS feed so AI crawlers see the fresh version. Even small updates - refreshing a statistic, adding a new example, updating a tool recommendation - signal freshness. You do not need to rewrite the entire page. The sites that dominate AI citations treat content as a living system with regular maintenance, not a publish-and-forget content calendar.",
      },
      {
        heading: 'Specificity: The Citation Differentiator',
        type: 'pattern',
        content:
          "AI engines cite specific claims, not general statements. The statement CRM adoption has increased is not citable - every competitor says the same thing. The statement CRM adoption among B2B SaaS companies with 10 to 50 employees increased 34 percent year over year according to a 2026 industry survey is citable because it is specific enough to attribute. This is the specificity factor in action. Every page on your site should contain at least three to five claims that are specific enough to cite: statistics with sources, named examples, concrete numbers, step-by-step processes with defined outcomes. Vague thought leadership - the kind that sounds smart but says nothing specific - is invisible to AI engines. They have nothing to grab onto. When you audit your content for GEO, the first question to ask about each page is: what specific claim on this page could an AI engine quote and attribute to us? If the answer is none, the page needs work regardless of how well it ranks in traditional search.",
      },
    ],
  },

  /* ================================================================== */
  /*  TACTICS                                                           */
  /* ================================================================== */

  {
    id: 'answer-block-pattern',
    title: 'The Answer Block Pattern - Write Content AI Can Extract',
    subtitle:
      'The formatting pattern that turns any page into a citation source',
    category: 'tactics',
    description:
      'The answer block pattern structures content so AI engines can extract clean, citable answers. Format, examples, and implementation.',
    keywords: [
      'answer block pattern',
      'GEO content format',
      'AI-extractable content',
      'citation-ready content',
      'featured snippet format',
    ],
    difficulty: 'intermediate',
    related: [
      'content-extractability',
      'what-is-aeo',
      'citation-bait',
      'topical-authority-for-geo',
    ],
    sections: [
      {
        heading: 'What Is an Answer Block',
        type: 'prose',
        content:
          "An answer block is a self-contained unit of content that directly answers a specific question in a way an AI engine can extract without needing surrounding context. It consists of three parts: a question-phrased heading that matches how people actually ask the question, a direct answer in the first one to two sentences that provides a complete response, and supporting detail that adds depth, examples, or caveats. The answer block works because it mirrors how AI engines process content. When Perplexity or ChatGPT retrieves your page, they are looking for the shortest path from a query to a trustworthy answer. If your page makes them parse through three paragraphs of context before reaching the actual answer, they will often use a competitor whose page front-loads the answer. The answer block removes that friction. The answer is right there, clearly structured, immediately extractable. Think of each answer block as a mini-article within your page - complete, self-contained, and optimized for extraction.",
      },
      {
        heading: 'Answer Block Formula',
        type: 'formula',
        content:
          "The formula is straightforward. Heading: use the question exactly as your audience phrases it, as an H2 or H3. First sentence: answer the question directly in under 30 words. Second sentence: add one key qualifying detail. Third sentence onward: expand with examples, data, or context. Here is a concrete example. Heading: How Long Does It Take to See GEO Results? First sentence: Most sites start seeing measurable AI citations within 60 to 90 days of implementing structured GEO practices. Second sentence: The timeline depends on your existing domain authority, content depth, and how aggressively you update content. Then expand with specifics about what the 90-day timeline looks like in practice. The key constraint is that the first two sentences must be a complete, standalone answer. If an AI engine only extracts those two sentences, the reader should still get a useful, accurate response. Everything after is bonus context.",
      },
      {
        heading: 'Stacking Answer Blocks on a Single Page',
        type: 'pattern',
        content:
          "A single page can contain multiple answer blocks, each targeting a different question within the same topic. This is one of the most powerful GEO patterns because each block is an independent citation opportunity. A page with eight answer blocks has eight chances to be cited across different queries. The structure looks like this: an H1 page title that establishes the topic, an introductory paragraph that establishes context and expertise, then a series of H2 or H3 answer blocks, each addressing a specific question. Internally link between related answer blocks on different pages to build topical clusters. The ShawnOS.ai wiki pages use this exact pattern. Each wiki entry has multiple sections, each structured as an answer block with a clear heading and a front-loaded answer. The wiki format naturally creates dozens of extractable answer blocks across a small number of pages, maximizing citation surface area without requiring hundreds of individual blog posts.",
      },
      {
        heading: 'Anti-Pattern: Burying the Answer',
        type: 'anti-pattern',
        content:
          "The most common mistake in content writing for GEO is burying the answer. You see it everywhere: a section heading that asks a question, followed by two paragraphs of context, historical background, or throat-clearing before the actual answer appears in paragraph three. Human readers might tolerate this. AI engines will not. They evaluate content by how quickly and cleanly they can extract an answer. If your answer is buried, the AI engine either skips your page for a competitor that front-loads, or it extracts the wrong sentence - one of your context paragraphs rather than your actual answer. Audit your existing content for buried answers. Read each section heading, then check: does the first sentence after the heading directly answer the implied question? If not, restructure. Move the answer to the front. Move the context behind it. This single change can dramatically increase your citation rate.",
      },
    ],
  },

  {
    id: 'entity-authority',
    title: 'Entity Authority - Make AI Recognize Your Brand',
    subtitle:
      'Build the entity signals that make AI engines trust and cite you',
    category: 'tactics',
    description:
      'Entity authority determines whether AI engines trust your brand enough to cite it. Build signals across your site and the web.',
    keywords: [
      'entity authority',
      'brand recognition AI',
      'AI trust signals',
      'knowledge graph optimization',
      'entity SEO',
    ],
    difficulty: 'intermediate',
    related: [
      'geo-ranking-factors',
      'topical-authority-for-geo',
      'schema-markup-for-ai',
      'shawnos-geo-case-study',
    ],
    sections: [
      {
        heading: 'What Entity Authority Means for AI',
        type: 'prose',
        content:
          "Entity authority is the degree to which AI engines recognize your brand, product, or author as a trusted source on specific topics. It is different from domain authority, which is a single score based on backlinks. Entity authority is topic-specific and context-dependent. You might have strong entity authority for CRM automation but no authority for supply chain management. AI engines build entity understanding from the entire web - your website, your social profiles, media mentions, podcast appearances, conference talks, guest posts, and every other context where your brand appears associated with a topic. The more consistently and deeply your brand appears connected to a specific domain of knowledge, the stronger the entity association becomes. When ChatGPT generates an answer about that topic, it is more likely to pull from sources it associates with recognized entities in that space. Entity authority is what separates a generic blog post from a citable source.",
      },
      {
        heading: 'Building Entity Signals',
        type: 'pattern',
        content:
          "Entity authority builds through consistent, multi-surface reinforcement. On your own site: implement Organization and Person schema markup. Create a comprehensive about page that clearly states what your brand specializes in. Build a content library that covers your topic cluster deeply, not broadly. Use consistent naming - your brand name, author names, product names should be identical across every page. Off your site: get mentioned in industry publications, podcasts, and roundups. Write guest posts on sites that the AI already trusts for your topic. Build a Wikipedia page if your brand qualifies. Ensure your LinkedIn, Twitter, and other social profiles use consistent branding and topic descriptions. On third-party data sources: claim your Google Business Profile, Crunchbase listing, and any industry-specific directories. These structured data sources are part of how AI engines build their knowledge graphs. Each signal alone is small. The compound effect across dozens of surfaces is what builds the entity authority that drives citations.",
      },
      {
        heading: 'The Entity Authority Audit',
        type: 'pro-tip',
        content:
          "Here is a quick audit you can run today. Open ChatGPT and ask: What is [your brand name]? Then ask: Who are the leading companies in [your space]? If your brand appears in the answers, you have some entity authority. If it does not, you know where you stand. Next, search Perplexity for a question in your core topic area and check whether your site appears in the citations. Do the same with Google AI Overviews by searching your key terms on Google. Document which queries cite you and which do not - this is your baseline. Then check the consistency of your entity signals. Google your brand name and review the first three pages. Is the information consistent across sources? Do your LinkedIn page, your website about page, your Crunchbase profile, and your Twitter bio all describe the same specialization? Inconsistency confuses AI engines. They cannot build a strong entity association when your own signals are scattered across different topic areas.",
      },
      {
        heading: 'Anti-Pattern: Trying to Be an Authority on Everything',
        type: 'anti-pattern',
        content:
          "The fastest way to have no entity authority is to try to have entity authority for everything. AI engines associate entities with specific topic clusters. A brand that publishes content on marketing, engineering, finance, wellness, and productivity has weak associations with all of them. A brand that publishes exclusively on revenue operations for B2B SaaS has a strong, specific entity association. Depth beats breadth for entity authority. Pick your topic cluster - ideally two to three closely related topics - and go deep. Cover every angle. Answer every question. Build the most comprehensive, most frequently updated resource in that space. That concentration is what makes AI engines recognize you as the authority. Once you own that territory, you can expand into adjacent topics. But if you start broad, you never build the initial density that triggers entity recognition.",
      },
    ],
  },

  {
    id: 'content-extractability',
    title: 'Structure Pages AI Engines Can Parse',
    subtitle:
      'Formatting patterns that make your content easy for AI to extract',
    category: 'tactics',
    description:
      'Make your content structurally extractable for AI engines - heading hierarchy, answer blocks, lists, tables, and semantic HTML.',
    keywords: [
      'content extractability',
      'AI-parseable content',
      'content structure GEO',
      'semantic HTML for AI',
      'structured content',
    ],
    difficulty: 'intermediate',
    related: [
      'answer-block-pattern',
      'schema-markup-for-ai',
      'citation-bait',
      'typescript-content-system-for-geo',
    ],
    sections: [
      {
        heading: 'Why Structure Matters More Than Length',
        type: 'prose',
        content:
          "AI engines do not read your content the way humans do. They parse it - breaking it into chunks based on structural signals like headings, paragraphs, lists, and semantic markup. A well-structured 800-word page with clear headings, short paragraphs, and front-loaded answers is more extractable than a 3,000-word wall of text with no structure. Length does not improve extractability; structure does. When an AI engine retrieves your page, it needs to quickly identify which section answers the query, extract the relevant content, and determine whether it is trustworthy enough to cite. Every structural element helps with that process. Headings tell the AI what each section is about. Short paragraphs isolate individual claims. Lists enumerate options or steps. Tables compare data points. Without these structural signals, the AI engine has to do more work to find the answer, and it will often choose a competitor whose page makes extraction easier.",
      },
      {
        heading: 'The Extractability Checklist',
        type: 'pattern',
        content:
          "Run this checklist against every page you want AI engines to cite. Does every section start with a descriptive H2 or H3 heading? Does the first sentence after each heading directly address what the heading promises? Are paragraphs under 100 words each? Are lists used for any content that has three or more parallel items? Are comparison or data points presented in tables rather than prose? Does the page have a logical heading hierarchy - H1 for the title, H2 for main sections, H3 for subsections - with no skipped levels? Is there a clear introductory paragraph that summarizes what the page covers? Does the page avoid burying key claims inside long paragraphs? Every item on this checklist makes a meaningful difference in how easily an AI engine can parse and extract from your content. Pages that score high on all items consistently outperform pages that score high on some but fail on others.",
      },
      {
        heading: 'Code: Semantic HTML That AI Engines Prefer',
        type: 'code',
        content:
          "The HTML elements you use matter. AI engines parse semantic HTML more reliably than div-soup with CSS classes. Use article tags to wrap your main content - this tells parsers where the real content lives versus navigation and sidebars. Use section tags to group related content blocks. Use h2 through h4 tags in proper hierarchy - never skip from h2 to h4. Use p tags for paragraphs rather than divs with text. Use ol and ul for lists rather than styled divs that look like lists. Use table, thead, tbody, th, and td for tabular data. Use blockquote for quotes you want attributed. Use strong or b for key terms and claims you want emphasized. Use time tags with datetime attributes for dates. These elements create a clear document structure that any parser can navigate. The ShawnOS.ai wiki system renders each section as a semantic article element with proper heading hierarchy, making every section independently extractable.",
      },
      {
        heading: 'Pro-Tip: One Claim Per Paragraph',
        type: 'pro-tip',
        content:
          "The single most impactful formatting rule for extractability is one claim per paragraph. When a paragraph contains multiple claims, the AI engine has to decide which claim to extract or whether to cite the entire paragraph. Paragraphs with a single, clear claim are extracted cleanly and cited accurately. Here is the difference. Bad: CRM adoption is growing rapidly, with many companies investing in automation. The average company uses 12 different SaaS tools, and integration costs have become a major concern. Meanwhile, AI-powered CRMs are gaining market share. That paragraph has three separate claims, and an AI engine quoting any one of them would misrepresent the paragraph. Good: AI-powered CRMs captured 23 percent of the market in 2025, up from 8 percent in 2023. Clean, specific, one claim. AI engines can quote it directly and accurately. Train your content team to think in single-claim paragraphs and your citation rate will increase measurably within 60 days.",
      },
    ],
  },

  {
    id: 'topical-authority-for-geo',
    title: 'Building Topical Authority for Generative Engines',
    subtitle:
      'Create the content depth that makes AI engines default to you',
    category: 'tactics',
    description:
      'Build topical authority for GEO through content clusters, internal linking, depth-over-breadth strategy, and entity reinforcement.',
    keywords: [
      'topical authority',
      'content clusters GEO',
      'AI topical authority',
      'content depth strategy',
      'pillar content GEO',
      'topic clusters',
    ],
    difficulty: 'advanced',
    related: [
      'entity-authority',
      'geo-ranking-factors',
      'monorepo-content-geo',
      'content-freshness-signals',
    ],
    sections: [
      {
        heading: 'Why Topical Authority Beats Individual Page Optimization',
        type: 'prose',
        content:
          "You can optimize a single page perfectly - answer blocks, schema markup, fresh content - and still lose the citation to a competitor. Why? Because AI engines evaluate authority at the topic level, not the page level. When Perplexity retrieves sources for a query about revenue operations, it does not just look at which page best answers the question. It also considers which source has the deepest coverage of revenue operations as a topic. A site with 40 pages covering every angle of revenue operations signals stronger topical authority than a site with 3 great pages and nothing else. This is the topical authority effect. AI engines trust sources that demonstrate comprehensive expertise on a topic because comprehensive coverage is a proxy for genuine expertise. Building topical authority requires a deliberate content strategy - not just writing good individual posts, but architecting a content system that covers your topic cluster with depth and interconnection.",
      },
      {
        heading: 'The Content Cluster Architecture',
        type: 'pattern',
        content:
          "A content cluster has three layers. The pillar page is a comprehensive overview of the main topic - your definitive guide to X. It covers every major subtopic at a summary level and links to detailed pages for each one. The cluster pages are detailed deep-dives into individual subtopics. Each one goes deeper than the pillar page could on that specific angle. The supporting content includes case studies, data reports, tools comparisons, and how-to guides that reference back to the pillar and cluster pages. Internal links connect everything - the pillar links to every cluster page, cluster pages link back to the pillar and to each other where relevant, and supporting content links to the most relevant cluster pages. This internal link structure tells AI engines that these pages are part of a coherent topic cluster, not isolated articles. The ShawnOS.ai wiki system implements this pattern through related entry cross-references - every wiki entry links to two to four related entries, creating a navigable knowledge graph that AI engines can follow.",
      },
      {
        heading: 'Depth Scoring: How AI Evaluates Topic Coverage',
        type: 'pattern',
        content:
          "AI engines implicitly evaluate topic coverage depth when deciding which sources to cite. They do this through several signals. Page count: how many indexed pages on your site address this topic and its subtopics? Subtopic coverage: do you cover the common questions, edge cases, comparisons, and implementation details, or just the overview? Internal link density: how densely are your topic pages linked to each other? Freshness spread: are multiple pages in the cluster being updated regularly, or just the pillar? Unique angle coverage: do your pages add original insights, data, or perspectives not found elsewhere? You can audit your own topical authority by listing every subtopic under your main topic and checking which ones you cover, which ones are thin, and which ones are missing entirely. Then compare against competitors. If a competitor covers subtopics you do not even mention, they have stronger topical authority regardless of how good your individual pages are.",
      },
      {
        heading: 'Pro-Tip: The Subtopic Gap Analysis',
        type: 'pro-tip',
        content:
          "Here is a fast way to find your topical authority gaps. Pick your primary topic. Ask Perplexity or ChatGPT to list every subtopic someone would need to understand to be an expert in that topic. Then check which of those subtopics you cover and which you do not. The gaps are your content roadmap. Prioritize by two factors: which subtopics get the most search volume (use traditional SEO tools for this) and which subtopics have the weakest existing coverage from competitors (use AI search to check). Subtopics with high demand and weak competitive coverage are the fastest path to topical authority gains. You can often build meaningful topical authority in 30 to 60 days by filling five to ten subtopic gaps with well-structured, answer-block-formatted content.",
      },
    ],
  },

  {
    id: 'citation-bait',
    title: 'Citation Bait - Statistics, Data, and Quotable Claims',
    subtitle:
      'Create the specific, data-backed claims AI engines want to cite',
    category: 'tactics',
    description:
      'Write content with specific statistics, original data, and quotable claims that AI engines prefer to cite over generic content.',
    keywords: [
      'citation bait',
      'AI-citable statistics',
      'original data GEO',
      'quotable claims',
      'data-driven content',
    ],
    difficulty: 'intermediate',
    related: [
      'answer-block-pattern',
      'geo-ranking-factors',
      'content-extractability',
      'measuring-ai-visibility',
    ],
    sections: [
      {
        heading: 'What Makes Content Citable',
        type: 'prose',
        content:
          "AI engines cite content that passes the attribution test - claims specific enough that the AI needs to credit a source rather than stating them as general knowledge. General knowledge does not get cited: CRM software helps companies manage customer relationships. That is a fact the AI can state on its own. Specific claims do get cited: B2B companies using Clay for enrichment reduced their average data research time from 4 hours to 12 minutes per account, according to a 2026 GTM benchmark study. The AI cannot make that claim without a source, so it needs to cite one. Citation bait is content designed with these specific, attributable claims as the primary deliverable. Every page should contain at least three to five claims that pass the attribution test. These are your citation hooks - the specific sentences that AI engines will grab when they need a source for their generated answer.",
      },
      {
        heading: 'Types of Citable Claims',
        type: 'pattern',
        content:
          "Five types of content consistently earn citations from AI engines. First, original statistics from surveys, analyses, or internal data you publish. These are the highest-value citation bait because no one else has the data. Second, specific benchmarks - concrete numbers about performance, cost, time, or outcomes. Not improvements, but specific improvements with numbers. Third, named frameworks and methodologies - if you coin a term or name a process, AI engines will attribute it to you. Fourth, expert quotes and attributed opinions - a named person making a specific claim is more citable than an unnamed assertion. Fifth, comparison data - side-by-side evaluations of tools, approaches, or outcomes with specific criteria and ratings. Each of these creates a citation opportunity because the AI engine cannot state the claim without crediting the source. Build your content calendar around producing these citable claim types rather than generic educational content.",
      },
      {
        heading: 'Creating Original Data Without a Research Team',
        type: 'pro-tip',
        content:
          "You do not need a research department to create citable data. Here are five approaches that work for small teams. First, analyze your own product data. If you run a SaaS product, you have usage data. Anonymize and aggregate it into benchmarks. Average time saved. Common configurations. Usage patterns by company size. Second, run micro-surveys. A LinkedIn poll with 200 responses is a data point AI engines can cite. Third, scrape public data and analyze it. Job posting trends, pricing page changes, technology adoption on BuiltWith - public data plus your analysis equals original insight. Fourth, track industry changes over time. Document tool pricing changes, feature launches, market shifts. Time-series data is valuable because it requires someone to have been paying attention. Fifth, benchmark your own results. If you run outbound campaigns, you have open rates, reply rates, conversion rates. Publish your anonymized benchmarks. These become citation bait because other people want to compare their numbers against yours.",
      },
      {
        heading: 'Anti-Pattern: Fake Precision',
        type: 'anti-pattern',
        content:
          "There is a difference between specific claims and made-up specificity. Stating that email open rates increased by 47.3 percent when you measured a 15-person sample is fake precision that erodes trust. AI engines are increasingly trained to evaluate source reliability, and content that makes suspiciously precise claims without credible methodology gets downweighted. The same goes for citing statistics without sources - claiming that 78 percent of companies use AI in their GTM stack without naming where that number came from is a red flag. If you publish data, include your methodology. State your sample size. Name your sources. This transparency actually increases citation likelihood because AI engines can evaluate the claim's credibility. Fabricated or unsourced statistics might get cited in the short term, but as AI engines improve their source evaluation, unreliable sources get deprioritized.",
      },
    ],
  },

  {
    id: 'content-freshness-signals',
    title: 'Content Freshness Signals AI Engines Track',
    subtitle:
      'How AI engines detect fresh content and why update cadence matters',
    category: 'tactics',
    description:
      'Content freshness signals that AI engines track - dateModified schema, RSS republishing, update patterns, and cadence strategy.',
    keywords: [
      'content freshness',
      'dateModified schema',
      'AI freshness signals',
      'content update cadence',
      'GEO freshness',
    ],
    difficulty: 'intermediate',
    related: [
      'geo-ranking-factors',
      'rss-feeds-for-ai-discovery',
      'schema-markup-for-ai',
      'topical-authority-for-geo',
    ],
    sections: [
      {
        heading: 'Why AI Engines Prioritize Fresh Content',
        type: 'prose',
        content:
          "AI engines have a strong recency bias for a practical reason: their users expect current answers. When someone asks Perplexity about the best email outreach tools in 2026, citing a roundup from 2023 would produce a bad answer. Tools change. Pricing changes. Features change. AI engines learned this the hard way through user feedback - stale answers generate complaints and reduce trust. As a result, freshness has become a heavyweight signal in AI citation decisions. This creates a strategic opportunity. If your competitor published a comprehensive guide two years ago and has not updated it, you can win the citation by publishing a less comprehensive but more current alternative. Freshness does not override quality entirely, but in a close matchup between two sources of similar depth and authority, the fresher one wins. For topics that evolve quickly - technology, pricing, tools, market trends - freshness can be the deciding factor even when the older source has significantly more backlinks.",
      },
      {
        heading: 'Freshness Signals AI Engines Read',
        type: 'pattern',
        content:
          "AI engines detect freshness through multiple signals, not just the publication date on your page. The dateModified property in your schema markup is the most explicit signal - it tells crawlers exactly when the content was last updated. Your RSS feed publication dates tell AI crawlers when content was added or republished. The last modified HTTP header on your server response tells crawlers when the file changed. In-content references to recent events, tools, or data provide implicit freshness signals - mentioning a product launched in February 2026 tells the AI this content is at least that current. Sitemap lastmod dates provide another freshness indicator. The key insight is that these signals need to be consistent. If your schema says the page was modified today but the content references tools from 2023 and the sitemap says last modified six months ago, the conflicting signals weaken your freshness credibility. Keep all freshness signals aligned and honest.",
      },
      {
        heading: 'The Update Cadence Strategy',
        type: 'formula',
        content:
          "Not all pages need the same update frequency. Use this cadence framework based on content type. Evergreen reference pages like glossaries, definitions, and concept explainers need quarterly updates - refresh examples, update links, add new related terms. How-to guides and tutorials need monthly reviews - check that steps still work, tools still exist, and screenshots are current. Tool comparisons and pricing pages need monthly updates because tools change constantly. Data and statistics pages need updating whenever new data is available, at minimum quarterly. Industry trend and prediction pages need updating every time the market shifts. News and commentary pages are one-time publications that do not need updating. For your highest-value pages - the ones driving the most AI citations - consider a biweekly review cycle. The review does not always require changes, but when you do update, push the updated dateModified across all your freshness signals: schema, RSS, sitemap, and HTTP headers simultaneously.",
      },
      {
        heading: 'Pro-Tip: The Republish Through RSS Technique',
        type: 'pro-tip',
        content:
          "When you make a meaningful update to an existing page, republish it through your RSS feed with the current date. Most RSS implementations only publish new posts, but you can configure yours to include updated posts as well. This is critical because AI crawlers like PerplexityBot actively monitor RSS feeds for fresh content. An updated page that only changes its schema dateModified might take days to get recrawled. An updated page that appears as a new item in your RSS feed gets picked up within hours. The implementation is straightforward: when you update a page, change its dateModified, update its RSS entry with the new date and an updated prefix or note, and optionally ping AI search engines through their webmaster tools. This technique is particularly effective for Perplexity, which has the most aggressive RSS-based content discovery of the major AI search engines.",
      },
    ],
  },

  {
    id: 'multi-format-geo',
    title: 'Multi-Format GEO - Text, Video, Audio, Social Signals',
    subtitle:
      'How AI engines synthesize signals from text, video, podcasts, and social',
    category: 'tactics',
    description:
      'Multi-format GEO strategy - how AI engines pull from text, video transcripts, podcasts, and social signals to build citations.',
    keywords: [
      'multi-format GEO',
      'video GEO',
      'podcast GEO optimization',
      'social signals AI search',
      'multimedia SEO',
      'content repurposing GEO',
    ],
    difficulty: 'advanced',
    related: [
      'entity-authority',
      'topical-authority-for-geo',
      'content-freshness-signals',
      'from-zero-to-cited',
    ],
    sections: [
      {
        heading: 'AI Engines Are Multimodal',
        type: 'prose',
        content:
          "Modern AI engines do not just process text. Google AI Overviews pull from YouTube video transcripts, image alt text, and structured product data. Perplexity indexes podcast transcripts and forum discussions. ChatGPT with browsing can process content from any accessible web page regardless of format. This multimodal capability means your GEO strategy cannot be limited to blog posts and landing pages. Every format you publish in is a potential citation source. A YouTube video with a well-structured transcript creates citation opportunities that a text-only page does not. A podcast appearance where you make a specific, quotable claim can surface in AI answers. Social media posts that get significant engagement create signals that reinforce your entity authority. The brands winning at GEO in 2026 are the ones that treat content as a system that spans formats, not a collection of individual blog posts.",
      },
      {
        heading: 'Video Transcripts as Citation Machines',
        type: 'pattern',
        content:
          "YouTube transcripts are indexed by Google and accessible to AI engines. This makes every video a potential citation source - but only if the transcript is structured for extraction. The default auto-generated YouTube transcript is messy - no paragraph breaks, no headings, inconsistent punctuation. To make videos work for GEO, add a structured description with timestamp-linked sections that act as headings. Create a companion blog post or page on your site with an edited, well-structured version of the transcript. Include the key claims, statistics, and insights in the video description itself. When you make a specific claim in a video - a statistic, a framework name, a benchmark - repeat it clearly and slowly so the auto-transcript captures it accurately. AI engines pull from transcripts, and if your claim is garbled by auto-transcription, it will not get cited. The companion page strategy is particularly effective because it creates two citation sources - the video and the text page - reinforcing each other.",
      },
      {
        heading: 'Podcast and Audio GEO',
        type: 'pattern',
        content:
          "Podcast appearances are underutilized for GEO because most people treat them as relationship-building, not content creation. Every podcast appearance should produce at least three GEO assets. First, a transcript page on the host's site or your own - this creates an indexable, extractable text version of the conversation. Second, pull quotes and clips shared on social media with proper attribution and links - these create entity signals and backlinks. Third, a summary post on your site that extracts the key insights, frameworks, or data you shared, formatted as answer blocks. When you appear on a podcast, plan your quotable claims in advance. Know the three to five specific things you want to say that are citable - statistics, framework names, specific recommendations. Say them clearly and repeat the key numbers. This turns a conversational podcast into a citation source.",
      },
      {
        heading: 'Social Signals and AI Discovery',
        type: 'pro-tip',
        content:
          "Social media posts do not directly become AI citations in most cases, but they play two critical supporting roles. First, they create entity reinforcement signals. When your brand consistently discusses the same topics across LinkedIn, X, and your blog, AI engines build stronger entity associations. Second, social posts drive engagement signals - shares, comments, saves - that indicate content quality to AI engines that incorporate social data. LinkedIn posts are particularly interesting for GEO because LinkedIn's content is increasingly indexed by AI engines. A LinkedIn post that makes a specific claim and links to your blog post creates both a social signal and a backlink that reinforces your site's authority. The tactical play: for every major piece of content you publish, create a LinkedIn post and an X thread that make one or two of the key claims from the full article, with a link back to the source. This creates a multi-surface citation trail that AI engines can follow.",
      },
    ],
  },

  /* ================================================================== */
  /*  TECHNICAL IMPLEMENTATION                                          */
  /* ================================================================== */

  {
    id: 'schema-markup-for-ai',
    title: 'Schema Markup for AI Citations - Complete Guide',
    subtitle:
      'Implement the structured data that AI engines use to understand your content',
    category: 'technical',
    description:
      'Complete guide to schema markup for AI citations - Article, FAQPage, HowTo, Organization, and custom schemas that drive GEO.',
    keywords: [
      'schema markup AI',
      'structured data GEO',
      'JSON-LD for AI',
      'schema.org AI search',
      'rich results AI',
      'FAQ schema',
    ],
    difficulty: 'advanced',
    related: [
      'content-extractability',
      'llms-txt-guide',
      'knowledge-graph-architecture',
      'how-ai-engines-source-content',
    ],
    sections: [
      {
        heading: 'Why Schema Matters for GEO',
        type: 'prose',
        content:
          "Schema markup is the bridge between your content and AI engines' structured understanding of it. When you add JSON-LD schema to your pages, you are giving AI engines a machine-readable layer of metadata that tells them exactly what your content is, who created it, when it was updated, and how its parts relate to each other. Without schema, AI engines have to infer all of this from your HTML, which is ambiguous. A date on your page could be the publication date, a date mentioned in the content, or a date in a sidebar widget. Schema removes that ambiguity by explicitly declaring: this is the datePublished, this is the dateModified, this is the author, this is the article body. AI engines use schema in two ways. First, they use it for content understanding - identifying what the page is about and what claims it makes. Second, they use it for trust signals - author credentials, publication dates, and organizational affiliations all feed into authority evaluation. Pages with comprehensive schema markup consistently outperform pages without it in AI citation rates.",
      },
      {
        heading: 'Essential Schema Types for GEO',
        type: 'pattern',
        content:
          "Focus on these schema types for maximum GEO impact. Article schema: use this on every content page. Include headline, description, author (as a Person with url and sameAs pointing to social profiles), datePublished, dateModified, publisher (as an Organization), image, and mainEntityOfPage. This is the foundation. FAQPage schema: use this on pages with question-and-answer content. Each question-answer pair becomes a separate extraction opportunity for AI engines. This schema directly maps to how AI engines process FAQ content. HowTo schema: use on tutorial and guide pages. Include step-by-step instructions with name, text, and optional image for each step. AI engines use this to generate step-by-step answers. Organization schema: use on your about page and homepage. Include name, url, logo, sameAs (array of social profile URLs), foundingDate, and description. This is how you declare your entity to AI engines. Person schema: use for author pages and about sections for individual contributors, linking to their credentials and social profiles.",
      },
      {
        heading: 'Schema Implementation in Next.js',
        type: 'code',
        content:
          "In a Next.js or React-based content system, implement schema as a component that generates JSON-LD in the page head. Create a reusable SchemaMarkup component that accepts a type and data props, then renders a script tag with type application/ld+json containing the serialized schema object. For the ShawnOS.ai monorepo, schema is generated at the page level in the wiki and blog templates. Each wiki entry automatically gets Article schema with the entry title as headline, the description as the schema description, the current date as dateModified (because wiki content is continuously updated), and the author as a Person entity with sameAs links. The key implementation detail: set the context to https://schema.org and the type to the appropriate schema type. Nest objects using the at-type property. Arrays of items - like FAQ questions or HowTo steps - are represented as arrays of typed objects. Validate your schema using Google's Rich Results Test or Schema.org's validator to catch errors before deploying.",
      },
      {
        heading: 'Pro-Tip: dateModified Is Your Strongest Schema Signal',
        type: 'pro-tip',
        content:
          "Of all the schema properties you can implement, dateModified has the highest impact on AI citations. AI engines use it as the definitive freshness signal for your page. If your schema says the page was modified yesterday, AI engines treat it as yesterday's content regardless of when the URL was first published. This makes dateModified a powerful lever. When you update a page, always update the dateModified in your schema. Automate this - in a Next.js system, you can set dateModified to the build date or the git commit timestamp for that file. Do not set dateModified to the current server time on every page load - that is spammy and AI engines will learn to ignore your freshness signals. Set it to the actual last meaningful update. And keep it consistent with your other freshness signals: your sitemap lastmod, your RSS feed dates, and your HTTP Last-Modified header should all align with your schema dateModified.",
      },
    ],
  },

  {
    id: 'llms-txt-guide',
    title: 'llms.txt - Give AI Assistants a Map of Your Site',
    subtitle:
      'The emerging standard for telling AI engines what your site offers',
    category: 'technical',
    description:
      'llms.txt is an emerging standard that gives AI assistants a structured overview of your site. Setup, format, and implementation guide.',
    keywords: [
      'llms.txt',
      'AI site map',
      'llms-full.txt',
      'AI content discovery',
      'LLM optimization file',
    ],
    difficulty: 'intermediate',
    related: [
      'robots-txt-for-ai-crawlers',
      'schema-markup-for-ai',
      'rss-feeds-for-ai-discovery',
      'typescript-content-system-for-geo',
    ],
    sections: [
      {
        heading: 'What Is llms.txt',
        type: 'prose',
        content:
          "llms.txt is an emerging web standard - proposed at llmstxt.org - that gives AI assistants and language models a structured, human-readable overview of your website. Think of it as a README for AI. While robots.txt tells crawlers what they can access and sitemaps tell them where pages are, llms.txt tells them what your site is about, what it offers, and where to find the most important content. The file lives at your site root - yoursite.com/llms.txt - and uses Markdown formatting with a clear structure: site name, brief description, main sections with links, and optionally a more detailed version at llms-full.txt. AI assistants that support the standard read llms.txt when they encounter your domain, giving them immediate context about your site without having to crawl and parse every page. This is particularly valuable for AI coding assistants, research tools, and chatbots that need to quickly understand what a site offers.",
      },
      {
        heading: 'llms.txt File Structure',
        type: 'pattern',
        content:
          "The format is simple Markdown with a specific structure. Start with a top-level H1 heading with your site or project name. Follow with a blockquote containing a one-line description of what the site does. Then add sections with H2 headings for different areas of your site, with bullet-pointed links using Markdown link syntax. Each link can have a colon-separated description after it. The standard also supports an extended version at llms-full.txt that includes more detail, full content excerpts, or API documentation. For a site like ShawnOS.ai with multiple properties in a monorepo - a main site, a wiki, and a blog - the llms.txt file maps out each property and its purpose, making it trivial for an AI assistant to understand the site structure. Keep the main llms.txt concise - under 100 lines. Use llms-full.txt for comprehensive documentation.",
      },
      {
        heading: 'Implementation for Multi-Site Architectures',
        type: 'code',
        content:
          "If you run multiple sites or a monorepo with multiple Next.js apps, each site should have its own llms.txt. In a Next.js app, serve llms.txt as a static file from the public directory or generate it dynamically through an API route. For the ShawnOS.ai monorepo, each app has its own llms.txt that describes that specific site, while the main domain's llms.txt links to the other properties. Dynamic generation is useful when your content changes frequently - you can build the llms.txt at build time from your content data, ensuring it always reflects the current state of your wiki entries, blog posts, and tool pages. The build script reads your content arrays, extracts titles and URLs, formats them as Markdown links with descriptions, and writes the output to public/llms.txt. This way, every deploy automatically updates your llms.txt to match your current content inventory.",
      },
      {
        heading: 'Pro-Tip: Include Your Best Content First',
        type: 'pro-tip',
        content:
          "AI assistants may not read your entire llms.txt - they might process just the first section or stop after a token limit. Structure your llms.txt with the most important content first. Lead with your core offering and highest-value pages. Put your wiki, guides, and reference content near the top. Push less critical pages - about, contact, legal - to the bottom. Think of it as an inverted pyramid, just like writing for AI extraction in general. The first 20 lines of your llms.txt should give an AI assistant enough context to understand your site and find your best content. If it reads nothing else, those 20 lines should be sufficient. This is the same front-loading principle that drives answer blocks and content extractability, applied to your site-level metadata.",
      },
    ],
  },

  {
    id: 'robots-txt-for-ai-crawlers',
    title: 'Robots.txt for AI Crawlers - Who to Allow, Who to Block',
    subtitle:
      'Configure robots.txt to control which AI engines can access your content',
    category: 'technical',
    description:
      'Robots.txt configuration for AI crawlers - GPTBot, PerplexityBot, ClaudeBot, Google-Extended, and how to allow or block each.',
    keywords: [
      'robots.txt AI',
      'GPTBot',
      'PerplexityBot',
      'AI crawler blocking',
      'robots.txt 2026',
    ],
    difficulty: 'beginner',
    related: [
      'llms-txt-guide',
      'how-ai-engines-source-content',
      'rss-feeds-for-ai-discovery',
    ],
    sections: [
      {
        heading: 'The AI Crawlers You Need to Know',
        type: 'prose',
        content:
          "As of 2026, several major AI companies operate web crawlers that access your content for different purposes. GPTBot is OpenAI's crawler, used to gather data for ChatGPT's web browsing feature and potentially for model training. ChatGPT-User is a separate OpenAI crawler that accesses pages in real-time when a user asks ChatGPT to browse a specific URL. PerplexityBot is Perplexity's crawler that indexes content for its AI search engine. ClaudeBot is Anthropic's crawler. Google-Extended is Google's crawler specifically for AI and Gemini training, separate from Googlebot which handles regular search indexing. Bytespider is ByteDance's crawler used for TikTok's AI features. CCBot is Common Crawl's bot, whose data feeds many AI training datasets. Each of these has different implications for your content strategy. Blocking some of them makes sense for certain businesses. Blocking all of them is almost always a mistake for companies that want AI visibility.",
      },
      {
        heading: 'Strategic Blocking vs Blanket Blocking',
        type: 'pattern',
        content:
          "The smart approach to robots.txt for AI is selective, not blanket. Allow crawlers that drive citations and traffic back to your site - PerplexityBot and ChatGPT-User are the most valuable because they generate cited answers with links to your pages. Consider your position on training data - Google-Extended, GPTBot, and CCBot may use your content for model training, which does not directly drive citations but contributes to your entity presence in model weights. Block crawlers from companies whose terms you disagree with or whose products do not benefit your business. The configuration is simple: User-agent lines specify the crawler, and Disallow or Allow rules control access. You can block a specific crawler from your entire site, allow it to access only certain directories, or block it from specific paths while allowing everything else. Most B2B companies benefit from allowing all major AI crawlers full access, since AI citations are a net-positive distribution channel with zero cost.",
      },
      {
        heading: 'Example robots.txt for GEO',
        type: 'code',
        content:
          "A GEO-optimized robots.txt configuration looks like this. Allow Googlebot full access to everything - this is your baseline for traditional search and Google AI Overviews. Allow PerplexityBot full access - Perplexity generates cited answers with links, which is high-value traffic. Allow ChatGPT-User full access - this is the real-time browsing crawler that drives ChatGPT citations. Allow ClaudeBot full access if you want visibility in Claude-powered tools. For GPTBot and Google-Extended, make a business decision - these are primarily training crawlers. Allowing them contributes to your entity presence in model knowledge. Blocking them withholds your content from training but does not prevent real-time citation. Block Bytespider and any crawlers from companies you do not want using your content. Always include your sitemap URL at the bottom of robots.txt. Also include a reference to your llms.txt file as a comment so AI-aware crawlers can find it.",
      },
      {
        heading: 'Anti-Pattern: Blocking Everything and Hoping for the Best',
        type: 'anti-pattern',
        content:
          "Some publishers add a blanket Disallow: / for all AI crawlers, thinking this protects their content while maintaining traditional search. This approach backfires for most businesses. Blocking AI crawlers does not prevent your content from being in AI models - training data comes from many sources including Common Crawl, cached pages, and third-party datasets. What blocking does prevent is real-time citation with links back to your site. You lose the distribution channel without gaining meaningful protection. The exception is large media companies with licensing revenue - they have genuine business reasons to block crawlers as a negotiating tactic. But for B2B companies, startups, and content-driven businesses, AI citations are free distribution to high-intent audiences. Blocking that traffic is like blocking Googlebot because you did not want people finding your site through search. Allow the crawlers that drive citations. Make blocking decisions based on business value, not fear.",
      },
    ],
  },

  {
    id: 'rss-feeds-for-ai-discovery',
    title: 'RSS Feeds as an AI Discovery Channel',
    subtitle:
      'How AI engines use RSS feeds and how to optimize yours for discovery',
    category: 'technical',
    description:
      'RSS feeds are an AI content discovery channel. Optimize your feed format, update strategy, and syndication for AI engine indexing.',
    keywords: [
      'RSS feeds AI',
      'AI content discovery',
      'RSS GEO optimization',
      'feed syndication AI',
      'Perplexity RSS',
    ],
    difficulty: 'intermediate',
    related: [
      'content-freshness-signals',
      'llms-txt-guide',
      'robots-txt-for-ai-crawlers',
      'measuring-ai-visibility',
    ],
    sections: [
      {
        heading: 'RSS Is Not Dead - AI Engines Revived It',
        type: 'prose',
        content:
          "RSS feeds had been declared dead for years - social media and email newsletters replaced them as content distribution channels for most audiences. But AI engines brought RSS back from the grave. Perplexity monitors RSS feeds as a primary content discovery mechanism, indexing new items within hours of publication. Google AI Overviews benefit from RSS because Google's existing infrastructure already processes feeds for Google News and Discover. Other AI search tools similarly use RSS as a lightweight, structured discovery channel. The reason is pragmatic: RSS is a standardized, structured format that requires no parsing ambiguity. An RSS item has a title, description, publication date, link, and content body in a well-defined XML schema. AI engines can process thousands of RSS feeds efficiently without the overhead of crawling and parsing full HTML pages. For content publishers, this means your RSS feed is no longer just for the handful of people using Feedly. It is a direct pipeline to AI engines.",
      },
      {
        heading: 'Optimizing Your RSS Feed for AI Discovery',
        type: 'pattern',
        content:
          "Default RSS configurations work, but optimized feeds work better. Include full content in your RSS items, not just excerpts. AI engines that process your feed need enough content to evaluate quality and extract claims. A truncated 200-character excerpt gives them nothing to work with. Include structured dates using proper RFC 822 formatting in the pubDate field. Include author information using the dc:creator or author element. Include category tags that map to your topic cluster using the category element. Use descriptive, keyword-rich titles - your RSS title is one of the first things an AI engine sees. Keep your feed to the most recent 50 to 100 items. Larger feeds are slower to process and may not be fully indexed. Set appropriate cache headers - a max-age of 3600 (one hour) means crawlers check frequently enough to catch updates without overwhelming your server.",
      },
      {
        heading: 'Republishing Updated Content via RSS',
        type: 'pro-tip',
        content:
          "When you make a meaningful update to an existing page, republish it through your RSS feed with the current date. Most RSS implementations only include new posts. For GEO, you want to republish updated content through your feed as well. When you make a meaningful update to an existing page - new data, new sections, refreshed examples - update the pubDate in the RSS item and push it back near the top of your feed. This signals to AI engines that the content has been refreshed without requiring them to recrawl your entire site. In a Next.js system, you can implement this by tracking content update dates separately from publication dates and using the more recent of the two as the RSS pubDate. Add an updated tag or prefix to the title for transparency. This technique is particularly effective for wiki content that gets updated incrementally over time. Each meaningful update triggers a republish, keeping your content in the fresh discovery pipeline.",
      },
      {
        heading: 'Feed Format: RSS 2.0 vs Atom vs JSON Feed',
        type: 'pattern',
        content:
          "All three major feed formats - RSS 2.0, Atom, and JSON Feed - are processed by AI engines. RSS 2.0 has the widest support and is the safest default. Atom is technically more rigorous with better date handling and content typing. JSON Feed is the newest and easiest to generate from JavaScript applications. For maximum compatibility, serve RSS 2.0 as your primary feed. If you want to offer multiple formats, host them at standard paths: /feed.xml or /rss.xml for RSS 2.0, /atom.xml for Atom, /feed.json for JSON Feed. Reference your feed in your HTML head using link rel alternate tags with the appropriate type attributes. Also reference it in your sitemap and your llms.txt file. The more places AI engines can discover your feed, the faster they will start indexing it. For the ShawnOS.ai blog, the RSS feed is auto-generated at build time from the blog post data, ensuring every new post is immediately available for AI discovery without manual intervention.",
      },
    ],
  },

  {
    id: 'knowledge-graph-architecture',
    title: 'Building a Knowledge Graph AI Engines Can Navigate',
    subtitle:
      'Architect your content as a connected graph, not isolated pages',
    category: 'technical',
    description:
      'Build a knowledge graph architecture that AI engines can navigate - entity relationships, internal linking, and structured data patterns.',
    keywords: [
      'knowledge graph',
      'content architecture GEO',
      'entity relationships',
      'internal linking AI',
      'semantic web',
      'content graph',
    ],
    difficulty: 'advanced',
    related: [
      'schema-markup-for-ai',
      'topical-authority-for-geo',
      'typescript-content-system-for-geo',
      'monorepo-content-geo',
    ],
    sections: [
      {
        heading: 'From Flat Pages to Connected Graphs',
        type: 'prose',
        content:
          "Most websites are architectured as flat collections of pages - blog posts, landing pages, product pages - connected loosely by navigation menus and occasional inline links. AI engines struggle with flat architectures because they cannot understand the relationships between your content. Is this blog post related to that product page? Does this case study validate the claims on your features page? Flat architectures make these connections invisible. A knowledge graph architecture explicitly defines entities and the relationships between them. Your brand is an entity. Your products are entities. Your blog topics are entities. Case studies, people, tools, and concepts are all entities. The relationships between them - brand created product, product solves problem, case study demonstrates solution, blog post explains concept - form a graph that AI engines can navigate. When AI engines can navigate your content graph, they can pull richer, more contextual answers. Instead of citing a single page, they can synthesize information across related pages in your graph, which results in more comprehensive citations.",
      },
      {
        heading: 'Implementing a Knowledge Graph in Content',
        type: 'pattern',
        content:
          "You do not need a graph database to implement a knowledge graph for GEO. You need three things: consistent entity naming, explicit relationships through internal links, and schema markup that declares entity types and connections. Start with entity naming. Every entity in your content should have one canonical name used consistently across all pages. Do not call it Clay on one page and Clay.com on another and the Clay enrichment platform on a third. Pick one canonical name and use it everywhere. Then add explicit relationships through internal links. When a page mentions an entity that has its own page, link to it. Every internal link is an edge in your knowledge graph. The more consistently you link between related entities, the clearer the graph becomes. Finally, layer schema markup that declares the entity types. Your product pages should have Product schema. Your people pages should have Person schema. Your organization page should have Organization schema. Use sameAs and relatedTo properties to explicitly declare relationships between entities.",
      },
      {
        heading: 'The Wiki Pattern as Knowledge Graph',
        type: 'pattern',
        content:
          "A wiki is one of the most natural implementations of a knowledge graph for content. Each wiki entry is an entity with a canonical name, a type, and explicit relationships to other entries through cross-references. The ShawnOS.ai wiki system demonstrates this pattern. Each wiki entry has an ID that serves as its canonical identifier, a category that declares its type, and a related array that explicitly lists connected entries. This structure means AI engines can start at any wiki entry and navigate to related concepts through the related links, building a comprehensive understanding of the topic cluster. The wiki format also naturally produces content with high extractability - each section within an entry is a self-contained answer block that can be cited independently. Combined with the cross-reference structure, this creates a content surface where every section on every page is both individually citable and connected to a broader knowledge context. If you are choosing between a traditional blog and a wiki structure for your core educational content, the wiki pattern is significantly stronger for GEO.",
      },
      {
        heading: 'Anti-Pattern: Orphan Pages',
        type: 'anti-pattern',
        content:
          "An orphan page is a page with no internal links pointing to it and no links pointing out to related content. In a knowledge graph, it is a disconnected node. AI engines treat orphan pages with less trust because disconnection signals low importance within your own content system - if the page were valuable, you would link to it from related content. Common causes of orphan pages include blog posts published and never linked from other content, landing pages created for paid campaigns with no organic discovery path, and old content that was relevant when published but never integrated into the site's content architecture. Audit for orphan pages regularly using a crawl tool like Screaming Frog. Any page you want AI engines to cite should have at least two internal links pointing to it from topically related pages, and it should link out to at least two related pages. These bidirectional links are what make your content a graph rather than a pile of disconnected documents.",
      },
    ],
  },

  {
    id: 'typescript-content-system-for-geo',
    title: 'Building a TypeScript Content System for GEO',
    subtitle:
      'Use typed data arrays to generate wiki pages, schema, RSS, and llms.txt from one source',
    category: 'technical',
    description:
      'Build a TypeScript content system that generates wiki pages, schema markup, RSS feeds, and llms.txt from typed data arrays.',
    keywords: [
      'TypeScript content system',
      'typed wiki data',
      'content as code',
      'Next.js wiki',
      'programmatic GEO',
      'content architecture TypeScript',
    ],
    difficulty: 'advanced',
    related: [
      'knowledge-graph-architecture',
      'schema-markup-for-ai',
      'llms-txt-guide',
      'monorepo-content-geo',
    ],
    sections: [
      {
        heading: 'Content as Code: The TypeScript Advantage',
        type: 'prose',
        content:
          "Most content systems store articles in a CMS or as Markdown files with frontmatter. This works, but it creates a disconnect between your content and the code that renders it. A TypeScript-first content system stores content as typed data arrays in .ts files. Each entry has a strict interface - title, description, keywords, sections, related entries - enforced by the TypeScript compiler. If you forget a required field, the build fails. If you reference a related entry that does not exist, you can catch it at compile time. This approach eliminates an entire category of content bugs that CMS-based systems suffer from: broken links to deleted pages, missing meta descriptions, malformed schema markup, and inconsistent field formatting. The ShawnOS.ai wiki system uses this pattern. Each wiki - Clay, Content, GEO, How-To - is a single TypeScript file exporting a typed array of entries. The wiki page component reads from these arrays, and every GEO signal - schema, RSS, llms.txt, sitemap entries - is generated from the same typed source data.",
      },
      {
        heading: 'The Entry Interface Pattern',
        type: 'pattern',
        content:
          "The core of a TypeScript content system is the entry interface. Define an interface that captures every field your content needs: an id for URL slugs and cross-references, title and subtitle for display, category for filtering and grouping, description for SEO meta tags, keywords for search targeting, a sections array of typed section objects, a related array of other entry IDs for cross-referencing, and a difficulty level for filtering. Each section has a heading, content string, and a type that determines how it renders - prose for standard content, pattern for structured frameworks, code for technical implementations, anti-pattern for what not to do, pro-tip for actionable advice, and formula for step-by-step processes. This section typing means your rendering layer can style each section type differently while your content layer remains pure data. The type system ensures every section declares its intent, and the rendering layer translates that intent into visual design.",
      },
      {
        heading: 'Generating GEO Signals from Typed Data',
        type: 'code',
        content:
          "Once your content lives in typed arrays, generating GEO signals becomes a build-time operation. Schema markup: loop through entries, generate Article JSON-LD for each entry with the title as headline, description as description, and dateModified set to the build timestamp. RSS feed: loop through entries, generate an RSS item for each with the entry title, description, URL, and build date. llms.txt: loop through entries grouped by category, output a Markdown list with titles and URLs. Sitemap: loop through entries, generate a URL entry for each with the current date as lastmod. All four signals come from the same source data. When you add a new entry to the array, all four signals update automatically at the next build. When you update an entry, all signals reflect the change. There is no manual step where someone forgets to update the RSS feed or the sitemap. The system handles it because the data flows from one typed source to every output format.",
      },
      {
        heading: 'Pro-Tip: Compile-Time Content Validation',
        type: 'pro-tip',
        content:
          "TypeScript gives you compile-time validation that no CMS can match. Add a helper that checks related entry references - iterate through all entries and verify that every ID in the related array exists as an entry ID somewhere in the array. Run this at build time. If an entry references a related entry that was deleted or renamed, the build fails with a clear error. Similarly, validate that descriptions are under 155 characters for SEO compliance, that every entry has at least three keywords, and that section content is not empty. These validations prevent content quality regressions automatically. You can also add custom linting rules - for example, checking that no section content uses banned words from your anti-slop list, or that every entry in the advanced difficulty tier has at least four sections. The TypeScript content system turns content quality into a CI check, not a manual review process.",
      },
    ],
  },

  /* ================================================================== */
  /*  MEASUREMENT AND TOOLS                                             */
  /* ================================================================== */

  {
    id: 'measuring-ai-visibility',
    title: 'How to Measure Your AI Visibility and Citation Rate',
    subtitle:
      'Track whether AI engines are citing you and how often',
    category: 'measurement',
    description:
      'Measure your AI visibility and citation rate across ChatGPT, Perplexity, and Google AI Overviews with manual and automated methods.',
    keywords: [
      'AI visibility measurement',
      'citation tracking',
      'GEO metrics',
      'AI search analytics',
      'citation rate',
    ],
    difficulty: 'intermediate',
    related: [
      'geo-tools-comparison',
      'ai-search-share-of-voice',
      'geo-ranking-factors',
      'google-ai-overview-optimization',
    ],
    sections: [
      {
        heading: 'The Measurement Problem in GEO',
        type: 'prose',
        content:
          "Measuring GEO performance is harder than measuring SEO because AI engines do not provide the equivalent of Google Search Console. There is no dashboard that shows you how many times ChatGPT cited your site or which Perplexity queries returned your content. This measurement gap is the biggest challenge in GEO today - you are optimizing for a channel you cannot easily track. But you can measure it. The methods are just different from what you are used to in SEO. You need a combination of manual monitoring, automated tracking tools, referral traffic analysis, and periodic audits. None of these individually gives you a complete picture, but together they create a usable measurement system. The teams that invest in measurement early have a significant advantage because they can iterate on what works instead of guessing. Most companies doing GEO in 2026 are still guessing.",
      },
      {
        heading: 'Manual Citation Auditing',
        type: 'pattern',
        content:
          "The simplest measurement method is manual auditing. Build a list of 20 to 30 queries that your target audience asks about your topic. Run each query through ChatGPT, Perplexity, and Google (checking AI Overviews). Document which queries return your site as a citation. Record the exact citation format - inline link, footnote, source card - and whether the AI quoted your content directly or just linked to your page. Run this audit monthly. Track your citation rate over time: citations received divided by queries tested. Also track your citation position - are you the first cited source, the second, or buried in a footnote? This manual process takes two to three hours per month but gives you the most accurate picture of your AI visibility because you see exactly how your content appears in AI-generated answers. Automate the documentation in a spreadsheet with columns for query, engine, cited (yes/no), citation format, content quoted, and date tested.",
      },
      {
        heading: 'Referral Traffic Analysis',
        type: 'pattern',
        content:
          "AI engines that cite your content with links generate referral traffic you can track in your analytics. In Google Analytics, Plausible, or whatever analytics tool you use, filter referral traffic for these domains: chat.openai.com (ChatGPT), perplexity.ai, gemini.google.com, and claude.ai. These referrals tell you which pages AI engines are linking to and how much traffic those citations drive. If you see referral traffic from perplexity.ai to a specific page, you know that page is being cited in Perplexity answers for queries related to that topic. Track this referral traffic as a dedicated channel alongside organic, social, and direct. For Perplexity specifically, you can also check your server logs for PerplexityBot user-agent crawl patterns. Frequent crawling of specific pages often indicates those pages are being cited frequently. Google AI Overviews are trickier because the clicks come through google.com and blend with regular organic traffic, but the click-through patterns differ - AI Overview clicks tend to cluster on pages that answer specific questions.",
      },
      {
        heading: 'Building a GEO Measurement Dashboard',
        type: 'pro-tip',
        content:
          "Consolidate your GEO metrics into a single dashboard you review monthly. Track five metrics: citation rate from your manual audit (what percentage of test queries cite you), AI referral traffic trend (total monthly visits from AI engine referrals), pages cited (which specific pages are getting AI citations), citation growth (month-over-month change in citation rate), and competitor citation comparison (how often competitors appear in the same queries). You do not need a fancy tool for this - a spreadsheet works fine for the first six months. The key is consistency. Run the same queries every month, track the same referral sources, compare the same competitors. Over three to six months, patterns emerge that tell you which content strategies are driving citations and which are not. This data-driven approach separates GEO practitioners from GEO speculators.",
      },
    ],
  },

  {
    id: 'geo-tools-comparison',
    title: 'GEO Tools Compared - AirOps, Otterly, HubSpot AI, Manual',
    subtitle:
      'What each GEO tool does, what it costs, and whether you need it',
    category: 'measurement',
    description:
      'Compare GEO tools - AirOps, Otterly.ai, HubSpot AI SEO, and manual methods for tracking AI citations and visibility.',
    keywords: [
      'GEO tools',
      'Otterly.ai',
      'AirOps GEO',
      'HubSpot AI SEO',
      'AI citation tools',
    ],
    difficulty: 'beginner',
    related: [
      'measuring-ai-visibility',
      'ai-search-share-of-voice',
      'what-is-geo',
      'google-ai-overview-optimization',
    ],
    sections: [
      {
        heading: 'The GEO Tools Landscape in 2026',
        type: 'prose',
        content:
          "The GEO tooling market is still early. Unlike SEO, which has mature tools like Ahrefs, Semrush, and Google Search Console, GEO tools are mostly startup-stage products or features bolted onto existing platforms. This means the tools change frequently, pricing is unstable, and no single tool does everything you need. That said, several tools have emerged as useful for different parts of the GEO workflow. The key categories are citation monitoring (tracking whether AI engines cite you), content optimization (helping you format content for AI extraction), and measurement (tracking your AI visibility over time). Most teams in 2026 use a combination of one tool plus manual monitoring because no single tool covers the full GEO measurement stack. Here is how the major options compare.",
      },
      {
        heading: 'Tool-by-Tool Comparison',
        type: 'pattern',
        content:
          "Otterly.ai focuses on AI search monitoring. It tracks your brand's appearance in ChatGPT, Perplexity, Google AI Overviews, and other AI engines across a set of queries you define. Strengths: automated monitoring replaces manual citation auditing, tracks competitors, shows trends over time. Weakness: only tracks the queries you configure, so you might miss citations for queries you did not think to monitor. AirOps provides AI content optimization at scale - it helps you generate and optimize content for AI engines using templates and workflows. Strengths: scales content production, includes GEO-aware formatting. Weakness: output quality depends on your templates and prompts, and generated content needs human review. HubSpot AI SEO tools are integrated into HubSpot's marketing platform and include AI content recommendations and some AI search visibility features. Strengths: integrated with your existing HubSpot workflow, no additional tool to learn. Weakness: GEO features are secondary to HubSpot's main SEO tooling and less specialized. Manual monitoring using spreadsheets and direct queries to AI engines costs nothing and gives you the most accurate, contextual data. Weakness: does not scale and takes time.",
      },
      {
        heading: 'When to Invest in Tools vs Stay Manual',
        type: 'pro-tip',
        content:
          "For most teams starting GEO, manual monitoring is sufficient for the first 90 days. You are learning what works, establishing baselines, and the query set you need to monitor is still small. Invest in a tool when you hit one of these thresholds: you are monitoring more than 50 queries monthly and the manual process takes more than four hours, you need competitor tracking across multiple AI engines simultaneously, or you need to report GEO metrics to stakeholders who expect a dashboard. Start with Otterly.ai or a similar monitoring tool first - measurement is the biggest gap in manual workflows. Only add a content optimization tool like AirOps if your content production volume exceeds what your team can manually format for GEO. For solo operators and small teams, the manual approach plus good templates often outperforms tool-driven workflows because you maintain direct contact with how AI engines are actually responding to your content.",
      },
      {
        heading: 'Anti-Pattern: Tool-First, Strategy-Second',
        type: 'anti-pattern',
        content:
          "A common mistake is buying a GEO tool before you have a GEO strategy. Tools amplify your strategy - they do not replace it. If you do not know which queries you want to be cited for, what topics you are building authority in, or how your content is structured for extraction, a monitoring tool will just show you zeros in a professional dashboard. Start with strategy: define your topic cluster, identify your target queries, structure your content with answer blocks, implement schema markup, and configure your technical infrastructure. Then add tools to measure and scale what you have built. The teams that get the most value from GEO tools are the ones that used manual methods first, understood the fundamentals, and then used tools to automate and scale proven workflows. Tools for the sake of tools is a budget line item that produces reports nobody acts on.",
      },
    ],
  },

  {
    id: 'ai-search-share-of-voice',
    title: 'Share of Voice in AI Search - ChatGPT, Perplexity, Gemini',
    subtitle:
      'Measure and improve your brand visibility across AI search engines',
    category: 'measurement',
    description:
      'Measure share of voice in AI search across ChatGPT, Perplexity, and Gemini - methodology, benchmarks, and competitive analysis.',
    keywords: [
      'AI share of voice',
      'AI search visibility',
      'ChatGPT brand mentions',
      'Perplexity visibility',
      'competitive GEO analysis',
    ],
    difficulty: 'intermediate',
    related: [
      'measuring-ai-visibility',
      'entity-authority',
      'geo-tools-comparison',
      'google-ai-overview-optimization',
    ],
    sections: [
      {
        heading: 'What Share of Voice Means in AI Search',
        type: 'prose',
        content:
          "In traditional SEO, share of voice measures what percentage of search results for your target keywords feature your brand. In AI search, share of voice measures how often AI engines mention or cite your brand when answering queries in your topic area. The concept is the same - it is a competitive visibility metric - but the measurement is fundamentally different because AI engines generate unique answers for every query rather than returning a static list of results. Your AI share of voice is not a single number across all queries. It varies by topic, by AI engine, and by query type. You might have 40 percent share of voice on Perplexity for queries about Clay enrichment but zero percent on ChatGPT for the same queries. Understanding these variations tells you where your GEO efforts are working and where they need attention.",
      },
      {
        heading: 'Measuring AI Share of Voice',
        type: 'formula',
        content:
          "Here is the methodology for measuring AI share of voice. Step one: define your query set. List 30 to 50 queries that your target audience asks about your topic area. Include a mix of informational queries (what is X), comparison queries (X vs Y), and recommendation queries (best tool for Z). Step two: run each query on each AI engine - ChatGPT, Perplexity, Google AI Overviews, and Gemini. Step three: for each response, record whether your brand was mentioned, whether it was cited with a link, what position the mention appeared (first source, secondary source, passing mention), and which competitors were also cited. Step four: calculate your share of voice as the percentage of queries where your brand was cited out of the total queries tested. Calculate per engine and overall. Step five: repeat monthly to track trends. The formula is straightforward: AI Share of Voice equals your citations divided by total query set size, multiplied by 100. Track this as a time series to see whether your GEO efforts are increasing your visibility.",
      },
      {
        heading: 'Engine-Specific Patterns',
        type: 'pattern',
        content:
          "Each AI engine has different citation behaviors that affect your share of voice measurement. Perplexity is the most citation-heavy - it almost always cites sources with numbered footnotes and links. This makes it the easiest engine to measure share of voice on and the best engine for driving referral traffic. ChatGPT with browsing cites selectively - it includes sources when it performs web searches but not when answering from training knowledge. Your share of voice on ChatGPT depends on whether the query triggers a web search. Google AI Overviews cite with source cards that show site name, favicon, and page title. These are prominent but limited to three to five sources per overview. Gemini cites occasionally and inconsistently - it is the hardest to measure reliably. Focus your share of voice measurement on Perplexity and Google AI Overviews first because they are the most consistent citers and the easiest to track. Add ChatGPT and Gemini as supplementary measurements once your primary tracking is established.",
      },
      {
        heading: 'Competitive Analysis in AI Search',
        type: 'pro-tip',
        content:
          "Share of voice is most valuable as a competitive metric. Do not just track your own citations - track who else gets cited for the same queries. Build a competitive citation matrix: your query set on one axis, your competitors on the other, with citation frequency in each cell. This reveals which competitors dominate which query clusters, where no one has strong authority (opportunity gaps), and where you are losing citations you should be winning. The actionable insight comes from analyzing why a competitor gets cited over you. Check their content: is it more specific? More recent? Better structured? Does their page have schema markup that yours lacks? Is their entity authority stronger for that subtopic? Each competitive loss is a diagnostic opportunity. Fix the specific gaps and monitor whether your share of voice improves in the next measurement cycle.",
      },
    ],
  },

  {
    id: 'google-ai-overview-optimization',
    title: 'Google AI Overview Optimization - Get Cited in the Box',
    subtitle:
      'Optimize specifically for Google AI Overviews that appear above search results',
    category: 'measurement',
    description:
      'Optimize content for Google AI Overviews - the AI-generated boxes above search results. Format, structure, and strategy guide.',
    keywords: [
      'Google AI Overviews',
      'AI Overview optimization',
      'Google SGE',
      'AI search box Google',
      'featured snippets AI',
    ],
    difficulty: 'intermediate',
    related: [
      'what-is-aeo',
      'answer-block-pattern',
      'geo-vs-seo',
      'ai-search-share-of-voice',
    ],
    sections: [
      {
        heading: 'What Are Google AI Overviews',
        type: 'prose',
        content:
          "Google AI Overviews are AI-generated answer boxes that appear at the top of Google search results for certain queries. Previously called Search Generative Experience or SGE during testing, AI Overviews synthesize information from multiple sources into a generated paragraph or list, with source cards linking to the pages the AI pulled from. As of 2026, AI Overviews appear on roughly 30 percent of Google searches and that percentage is growing. They appear most frequently for informational queries, how-to queries, comparison queries, and questions that benefit from synthesized answers rather than a simple link list. Being cited in an AI Overview is enormously valuable because it appears above the traditional organic results. You get prominent placement with your site name, favicon, and page title displayed as a source card. The click-through rates from AI Overview source cards are lower than traditional position one rankings but the visibility is massive.",
      },
      {
        heading: 'What Triggers an AI Overview',
        type: 'pattern',
        content:
          "Not every Google search generates an AI Overview. Understanding which queries trigger them helps you target your optimization. AI Overviews appear most frequently for informational queries that require synthesis - questions where a single search result would not fully answer the query. Examples: how does CRM integration work with marketing automation, what are the differences between outbound and inbound sales approaches, what should a small SaaS company look for in a project management tool. They appear less frequently for navigational queries (someone searching for a specific brand), transactional queries (someone ready to buy), and queries with a clear single answer. The sweet spot for AI Overview optimization is complex informational queries in your topic area - queries where the searcher needs multiple perspectives or a synthesized answer. These are also the queries where being cited as a source carries the most authority because Google selected your page as one of the trusted sources for a complex answer.",
      },
      {
        heading: 'Optimizing Content for AI Overview Citations',
        type: 'pattern',
        content:
          "Google AI Overviews favor content that scores high on the same factors that drive featured snippets, with additional emphasis on depth and authority. Structure your content with clear H2 and H3 headings that match query patterns. Front-load your answers in the first sentence after each heading. Include lists and tables for structured information - AI Overviews frequently pull formatted lists directly from source pages. Provide specific, attributable claims rather than general statements. Maintain your page with recent updates - freshness matters for AI Overviews just as it does for other AI engines. The unique factor for AI Overviews versus other AI engines is that Google has access to its full search index, including your page authority, backlink profile, and historical ranking data. Pages that already rank on page one for a query are significantly more likely to be cited in the AI Overview for that query. This means your traditional SEO foundation directly impacts your AI Overview visibility. GEO and SEO are most tightly coupled on Google.",
      },
      {
        heading: 'Pro-Tip: Monitor AI Overview Appearance for Your Keywords',
        type: 'pro-tip',
        content:
          "Use a tool like Semrush, Ahrefs, or even manual searches to check which of your target keywords trigger AI Overviews. Not all of them do, and knowing which ones generate overviews tells you where to focus your GEO optimization. For keywords that already trigger overviews, check whether you are cited as a source. If you are, note what content the overview pulled from and double down on that format and structure. If you are not cited, study the sources that are - what do they have that you do not? For keywords that do not yet trigger overviews, watch for changes - Google is steadily expanding AI Overview coverage. A keyword that shows traditional results today may trigger an overview next month. Being well-positioned with GEO-optimized content before the overview appears gives you a first-mover advantage in getting cited when it activates. Track AI Overview presence as a column in your keyword tracking spreadsheet alongside traditional rank position.",
      },
    ],
  },

  /* ================================================================== */
  /*  CASE STUDIES                                                      */
  /* ================================================================== */

  {
    id: 'shawnos-geo-case-study',
    title: 'How ShawnOS.ai Gets Cited by AI - A Case Study',
    subtitle:
      'Inside the GEO architecture of a monorepo that AI engines consistently cite',
    category: 'case-studies',
    description:
      'Case study of ShawnOS.ai GEO implementation - monorepo architecture, wiki system, schema markup, and AI citation results.',
    keywords: [
      'ShawnOS.ai case study',
      'GEO case study',
      'monorepo GEO',
      'wiki GEO implementation',
      'AI citation case study',
    ],
    difficulty: 'intermediate',
    related: [
      'typescript-content-system-for-geo',
      'monorepo-content-geo',
      'knowledge-graph-architecture',
      'entity-authority',
    ],
    sections: [
      {
        heading: 'The Architecture',
        type: 'prose',
        content:
          "ShawnOS.ai runs on a monorepo architecture with three Next.js sites sharing a common content layer. The main site hosts the wikis, blog, and landing pages. Two additional sites handle specialized content verticals. All three sites pull from the same TypeScript data layer in a shared packages directory. This architecture matters for GEO because it creates a unified content graph across multiple domains while sharing entity signals. Every wiki entry, every blog post, and every landing page is defined as a typed object in a TypeScript file. The rendering layer reads from these typed arrays, and all GEO signals - schema markup, RSS feeds, llms.txt, sitemaps - are generated from the same source data at build time. When a new wiki entry is added, it automatically appears in the RSS feed, the sitemap, the llms.txt file, and the schema markup without any manual steps.",
      },
      {
        heading: 'The Wiki System as GEO Engine',
        type: 'pattern',
        content:
          "The core GEO driver is the wiki system. Each wiki - Clay, Content, GEO, How-To - covers a specific topic cluster with 15 to 30 entries. Each entry has multiple sections, and each section is structured as an answer block with a clear heading and front-loaded content. This creates hundreds of individually citable content blocks across a relatively small number of pages. The wiki entries are cross-referenced through related arrays, creating a navigable knowledge graph. When an AI engine lands on one wiki entry, the related links let it discover connected concepts. The section type system - prose, pattern, code, anti-pattern, pro-tip, formula - means different types of content are clearly distinguished, which helps AI engines understand what kind of information each section provides. The result is a content surface area that is disproportionately large relative to the number of pages because each page contains multiple extractable, citable sections.",
      },
      {
        heading: 'Technical GEO Signals',
        type: 'code',
        content:
          "The site implements the full stack of technical GEO signals. Each page has Article schema generated from the wiki entry data - headline, description, author as a Person entity, dateModified set to the build timestamp, and publisher as an Organization entity. The llms.txt file at the site root provides AI assistants with a structured overview of the site, listing every wiki, its purpose, and links to key entries. The RSS feed at /feed.xml includes every blog post and wiki update with full content bodies, not excerpts. The robots.txt allows all major AI crawlers - PerplexityBot, ChatGPT-User, ClaudeBot, and Googlebot - full access. The sitemap includes every wiki entry and blog post with lastmod dates that update on every build. Internal links between related wiki entries and between wikis and blog posts create a dense link graph that reinforces topical associations.",
      },
      {
        heading: 'Results and Lessons',
        type: 'pro-tip',
        content:
          "The key lessons from building this system. First, TypeScript-defined content eliminates an entire class of GEO bugs - missing schema fields, broken cross-references, forgotten sitemap entries. The compiler catches mistakes before they deploy. Second, the wiki format produces more citation surface area per page than traditional blog posts because each section is an independent answer block. Third, cross-referencing between wikis and between wikis and blog posts creates the topical depth signals that AI engines use to evaluate authority. Fourth, build-time generation of all GEO signals from a single data source means every deployment is GEO-consistent - there is no drift between your content and your technical signals. Fifth, the monorepo architecture lets multiple sites share entity signals and content while maintaining distinct domains and purposes. The biggest mistake early on was treating blog posts and wiki entries as separate content systems. Unifying them under the same TypeScript data layer and cross-referencing between them dramatically improved both traditional SEO and AI citation rates.",
      },
    ],
  },

  {
    id: 'monorepo-content-geo',
    title: 'Multi-Site Content Clusters for GEO',
    subtitle:
      'Use a monorepo to build connected content across multiple domains',
    category: 'case-studies',
    description:
      'Build multi-site content clusters for GEO using a monorepo architecture - shared data, cross-domain entity signals, and unified GEO.',
    keywords: [
      'monorepo GEO',
      'multi-site content',
      'content clusters multi-domain',
      'cross-domain GEO',
      'monorepo Next.js',
      'shared content layer',
    ],
    difficulty: 'advanced',
    related: [
      'shawnos-geo-case-study',
      'typescript-content-system-for-geo',
      'topical-authority-for-geo',
      'knowledge-graph-architecture',
    ],
    sections: [
      {
        heading: 'Why Multi-Site for GEO',
        type: 'prose',
        content:
          "A single site can only cover so many topics before it loses topical focus. If you operate in a space with multiple distinct topic clusters - say GTM operations, content creation, and technical implementation - a single site that covers all three may build weaker topical authority in each than three focused sites would individually. The monorepo pattern lets you run multiple sites from a single codebase while sharing content infrastructure. Each site focuses on a specific topic cluster, building deep authority in that space. The shared layer provides common components, types, and data structures. Cross-domain links between the sites create entity relationships that reinforce your overall brand authority. This is different from running three completely separate websites. The shared codebase means every GEO improvement you make - a new schema component, an updated RSS generator, a better llms.txt template - rolls out to all sites simultaneously. You get the topical focus benefits of separate sites with the development efficiency of a single codebase.",
      },
      {
        heading: 'The Shared Content Layer',
        type: 'pattern',
        content:
          "The architectural key is the shared content layer. In a monorepo with tools like Turborepo or Nx, you create a shared package that contains your content types, data arrays, and helper functions. Each site imports from this shared package. The wiki entry interface, the section types, the helper functions for finding entries by slug or filtering by category - all of these live in the shared layer. Each site then defines its own wiki data files that use the shared types. The ShawnOS.ai monorepo has a packages/shared directory containing the WikiSection type, the entry interfaces for each wiki, and the data files with actual content. Each Next.js app in the apps directory imports from this shared package and renders the content with its own design system and layout. When you add a new content type or extend the entry interface, the change propagates to all sites. When you add a new wiki entry, it only exists in the app that owns that topic cluster.",
      },
      {
        heading: 'Cross-Domain Entity Reinforcement',
        type: 'pattern',
        content:
          "Multiple sites from the same brand create entity reinforcement opportunities that a single site cannot. When site A links to site B and both are clearly associated with the same brand through Organization schema, consistent branding, and shared author entities, AI engines build a stronger overall entity association. Each site's topical authority contributes to the brand's overall entity authority. The implementation requires consistent Organization schema across all sites with the same organization name, URL, and sameAs links. Author entities should use the same Person schema with identical sameAs arrays pointing to social profiles. Cross-domain links should use descriptive anchor text that reinforces topical associations. And each site's llms.txt should reference the other properties, telling AI assistants about the full content ecosystem. Done well, the multi-site approach creates a compound effect where each site's authority reinforces the others. Done poorly - with inconsistent branding, no cross-linking, and disconnected schema - you just have three weak sites instead of one strong one.",
      },
      {
        heading: 'Anti-Pattern: Duplicating Content Across Sites',
        type: 'anti-pattern',
        content:
          "The temptation with multi-site architectures is to duplicate popular content across sites to maximize coverage. This backfires badly for both SEO and GEO. AI engines detect duplicate content across domains and may penalize or ignore the duplicates. Even if they do not penalize, they will only cite one version, wasting the effort. Each site should have unique content that is appropriate for its topic cluster. Cross-reference between sites with links, not copies. If a concept is relevant to multiple sites, write a brief mention with a link to the canonical deep-dive on the site that owns that topic. For example, a GEO wiki entry might reference schema markup concepts but link to the technical implementation site for the full schema guide rather than duplicating the schema content. This creates genuine cross-domain links while keeping each site's content unique and focused. The shared TypeScript layer makes this easy - you can reference entry IDs across wikis without copying content.",
      },
    ],
  },

  {
    id: 'from-zero-to-cited',
    title: 'From Zero to AI-Cited in 90 Days - GEO Playbook',
    subtitle:
      'A week-by-week playbook to get your site cited by AI engines in 90 days',
    category: 'case-studies',
    description:
      'A 90-day GEO playbook to get your site cited by AI engines - week-by-week plan from technical setup to first AI citations.',
    keywords: [
      'GEO playbook',
      '90-day GEO plan',
      'AI citation strategy',
      'GEO implementation plan',
      'get cited by AI',
    ],
    difficulty: 'intermediate',
    related: [
      'what-is-geo',
      'geo-ranking-factors',
      'measuring-ai-visibility',
      'shawnos-geo-case-study',
    ],
    sections: [
      {
        heading: 'Phase 1: Foundation (Weeks 1-3)',
        type: 'pattern',
        content:
          "The first three weeks focus on technical infrastructure and baseline measurement. Week 1: audit your existing content for extractability - check heading structure, answer block formatting, and paragraph length. Implement Article schema on your top 10 pages. Set up or verify your robots.txt allows AI crawlers. Create or update your sitemap with accurate lastmod dates. Week 2: create your llms.txt file. Set up or optimize your RSS feed with full content bodies. Run your first manual citation audit - test 20 queries across ChatGPT, Perplexity, and Google AI Overviews. Document your baseline. Week 3: identify your topic cluster and run a subtopic gap analysis. List every subtopic you should cover and check which ones you already have content for. Prioritize gaps by search volume and competitive weakness. By the end of week three, your technical foundation is in place and you know exactly where you stand.",
      },
      {
        heading: 'Phase 2: Content Build (Weeks 4-8)',
        type: 'pattern',
        content:
          "Weeks four through eight are your content production phase. Week 4: write three to five new pages filling your highest-priority subtopic gaps. Use the answer block pattern for every section. Include three or more citable claims per page - specific statistics, named frameworks, or concrete benchmarks. Week 5: update your five best-performing existing pages - refresh examples, add new data points, update dateModified across schema, RSS, and sitemap. Republish through RSS. Week 6: write three more subtopic pages and create your first piece of citation bait - a data report, benchmark study, or survey-based insight that produces claims AI engines need to attribute. Week 7: build cross-references between all your new and existing content. Add related links. Check for orphan pages. Ensure every page has at least two internal links pointing to it. Week 8: run your second citation audit. Compare against your week three baseline. You should start seeing some citations appearing, especially on Perplexity which indexes new content fastest.",
      },
      {
        heading: 'Phase 3: Amplify (Weeks 9-12)',
        type: 'pattern',
        content:
          "The final phase amplifies what is working and fixes what is not. Week 9: analyze your week eight audit results. Which pages got cited? What format were the citations in? What content did the AI extract? Double down on the patterns that worked. Week 10: create a second piece of citation bait - another data point, study, or framework. Publish it with all GEO signals aligned. Share it on LinkedIn and X to build social signals and entity reinforcement. Week 11: update all content again - refresh dates, add any new data, fix any broken links. Do a technical audit - verify all schema is valid, RSS feed is complete, sitemap is accurate, llms.txt reflects current content. Week 12: run your third citation audit. Calculate your 90-day progress - citation rate change, pages cited, AI referral traffic, and competitive positioning. Document what worked and what you will iterate on in the next quarter.",
      },
      {
        heading: 'What to Expect and What Not to Expect',
        type: 'pro-tip',
        content:
          "Realistic expectations for 90 days. If you are starting from a site with some existing authority and content, you should see initial AI citations appearing by week six to eight, with measurable improvements in your citation rate by week twelve. If you are starting from a brand new domain with no existing content, the timeline extends - expect first citations around week ten to twelve. What you should not expect: overnight results. AI engines take time to crawl, index, evaluate, and start citing new sources. They also need to build entity associations, which requires repeated exposure to your brand across multiple content pieces. Do not change your strategy every two weeks because you are not seeing results yet. The 90-day playbook works because it gives the system enough time to build momentum. The compound effect of technical signals plus content depth plus entity reinforcement takes time to kick in, but once it does, citations tend to accelerate because each citation reinforces the signals that drive more citations.",
      },
      {
        heading: 'Sustaining GEO Beyond 90 Days',
        type: 'formula',
        content:
          "GEO is not a one-time project - it is an ongoing system. After the initial 90 days, establish a monthly cadence. Week one of each month: run your citation audit. Track your metrics. Identify what changed. Week two: update your top-performing pages and publish one new piece of content or citation bait. Week three: address any technical issues from your audit - broken schema, stale sitemap entries, RSS gaps. Week four: analyze competitor citations and identify any new opportunity gaps. This monthly cadence takes four to six hours total and maintains the momentum you built in the first 90 days. The goal is consistent improvement, not heroic sprints. Teams that maintain a steady GEO cadence outperform teams that do an intensive project, stop for three months, then scramble to catch up. Treat GEO like you treat SEO - an always-on practice with regular measurement and iteration, not a campaign with a start and end date.",
      },
    ],
  },
]
