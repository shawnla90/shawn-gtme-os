# Exa - Discovery + Deep Research

> AI-powered semantic search. Understands ICP queries, not just keywords.

## Discovery Phase

- 20 ICP search queries for initial company discovery
- Semantic queries like "B2B SaaS companies struggling with sales enablement" return actual companies
- Filters: reject LinkedIn, article headlines, domains >80 chars
- Stores results in `accounts.exa_research` (JSONB)

## Deep Dive Phase

4 follow-up queries per company:
1. Blog / content
2. Press / news
3. Job postings
4. About page / company info

Used by `generate.py` to give Grok enough context for page generation.

## Script

`research.py` - runs discovery queries, stores raw JSONB in Supabase.

## MCP Available

Exa MCP is active. Use for ad-hoc research queries.

## Rate Limits

- 1-second delay between queries (built-in)
- Pipeline continues on per-query failures - partial research is stored
- Check `EXA_API_KEY` validity if all queries fail

## Known Issues

- Junk leaks through: articles, blog posts, aggregator pages end up in accounts table
- `slugify()` rejects slugs >40 chars (catches most Exa blog URL pollution)
- 5+ current accounts are not companies (LinkedIn profiles, Crunchbase articles, etc.)
