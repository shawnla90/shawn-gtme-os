---
title: "Content Clusters and the Breadcrumb Protocol"
date: "2026-02-22"
excerpt: "Three sites, one parent keyword, and a deliberate topology that tells search engines and AI platforms exactly how everything connects."
---

## the topology problem

three websites. shawnos.ai, thegtmos.ai, thecontentos.ai. each one has its own content. blog posts, knowledge terms, how-to guides, wiki entries. individually they're solid. but search engines and AI platforms don't see individual pages — they see a graph. and a graph without explicit edges is just a collection of disconnected nodes.

the question isn't what content do you have. it's how does your content connect.

## hub and spoke

the topology is hub-and-spoke. one parent concept — "building with AI" — with three specialized verticals branching off it.

**shawnos.ai** is the hub. the builder's personal brand. the system-building process itself.

**thegtmos.ai** is spoke one. GTM workflows, partner playbooks, outreach automation. the GTM systems produced by the hub's toolkit.

**thecontentos.ai** is spoke two. content methodology, voice DNA, AI-assisted writing. the content pipeline and methodology demonstrated by the hub.

the recursive structure is the point. the act of building the system IS the content for shawnos. the GTM workflows produced by the system ARE the content for gtmos. the methodology of creating content with the system IS the content for contentos. each site's content proves the other two sites' thesis.

## taxonomy.yaml

the topology is defined in `website/taxonomy.yaml`. not in someone's head. not in a Notion doc. in a version-controlled YAML file that machines can read.

the file maps every content pillar to a domain:

- building-sharing → shawnos
- plays-series → gtmos
- skill-system-shares → gtmos
- release-reactions → shawnos
- newsletter-editorial → shawnos
- newsletter-growth → contentos
- reddit-growth-seo → contentos

routing rules are explicit: personal stories go to shawnos. GTM systems go to gtmos. content strategy goes to contentos. cross-domain posts get a primary domain plus cross-links to siblings.

## the breadcrumb protocol

breadcrumbs on websites are usually an afterthought. Home > Blog > Post Title. basic hierarchy. the breadcrumb protocol in this system is different — it's a forward-referencing cross-site navigation system.

every page knows its position in the topology. a how-to guide on shawnos knows it belongs to the `geo-seo` category. it knows related guides exist on gtmos. the breadcrumb schema markup (BreadcrumbList in JSON-LD) communicates this hierarchy to search engines.

but the forward-referencing part is what matters. when a new how-to entry has `canonicalSite: 'gtmos'`, it renders natively on thegtmos.ai and creates a redirect from shawnos.ai. the breadcrumb on gtmos shows `GTMOS > How-To > Content Cluster Strategy`. the redirect on shawnos tells search engines this content lives on the spoke, not the hub.

this is deliberate topology. not just navigation.

## the data layer

the cross-site linking architecture lives in three TypeScript data files in `website/packages/shared/data/`:

**how-to-wiki.ts** — every entry has a `canonicalSite` field and a `related` array. the canonical site determines which domain renders the page. the related array creates bidirectional links to other entries.

**engineering-terms.ts** — knowledge terms with `related` arrays that link to other terms. programmatic internal linking connects every mention of a term to its definition page automatically.

**content-wiki.ts** — wiki entries for ContentOS with their own related arrays.

the `related` arrays are the edges of the content graph. every time you add a new entry with related links, you're adding edges. every time an existing entry adds a back-link to a new entry, you're making the edge bidirectional. no dead ends. no orphans.

## canonical routing

the `canonicalSite` field on how-to entries is the mechanism for cross-site content placement. when an entry has `canonicalSite: 'gtmos'`, the shawnos.ai how-to page generates a redirect to `thegtmos.ai/how-to/[slug]`. the gtmos site imports the same data from `@shawnos/shared` and renders it natively.

one data file. three sites. automatic routing. the monorepo makes this seamless because all three sites share the same package. there's no API call, no content sync, no CMS replication. it's one TypeScript import.

## why clusters matter for AI citations

AI engines don't just index individual pages. they evaluate topical authority. sites with comprehensive coverage of a topic — multiple pages cross-linked, different content types covering different angles — get preferential citation.

a topic cluster is the explicit version of this. one pillar page covers the broad topic. supporting cluster pages go deep on subtopics. all of them cross-link. the cluster signals to AI engines: this site owns this subject.

the three-site architecture amplifies this. shawnos, gtmos, and contentos each build authority in their vertical. the cross-site links connect the verticals. the `sameAs` schema markup tells search engines these three sites represent one entity. the cluster isn't just within one site — it spans the entire network.

## the compound effect

every new piece of content strengthens the cluster. a new knowledge term gets a definition page, appears in RSS feeds, gets schema markup, and is available for programmatic internal linking from every page that mentions it. a new how-to guide links to related terms, related guides, and related wiki entries — creating new edges in the graph.

the SQLite content index tracks all of it. the taxonomy routes it. the breadcrumbs navigate it. the schema markup describes it. and every piece is a TypeScript data object in a version-controlled file.

the system doesn't just hold content. it is content architecture.

`$ cat website/taxonomy.yaml | head -20`
