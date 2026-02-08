# Signal Retrieval — Exol (GreenBox)

## Purpose

Key signals to enrich and monitor for GreenBox target accounts. Used in Clay tables, Claygent enrichments, and ongoing monitoring.

## High-Intent Signals (By Play)

### 3PL Switcher Signals
- **Negative 3PL reviews**: Complaints about ShipBob, Flexe, or similar providers on G2, Trustpilot, Reddit
- **Fulfillment hiring**: Job postings for fulfillment, warehouse, or logistics roles (trying to solve in-house)
- **3PL RFPs**: Procurement activity for new fulfillment partners
- **OTIF compliance issues**: Retail partner chargebacks, compliance mentions in earnings calls
- **Peak season failures**: Post-holiday complaints about fulfillment capacity

### Tech Stack Friction Signals
- **Shopify usage**: Confirmed Shopify store (especially Shopify Plus)
- **Gorgias / support tools**: Using customer support tools → likely has WISMO issues
- **Integration complaints**: Forum posts, job postings mentioning fulfillment integration challenges
- **ERP mentions**: NetSuite, SAP — indicates operational maturity, potential integration need
- **Multi-channel presence**: Selling on Shopify + Amazon + retail → omni-channel complexity

### Funding Trigger Signals
- **Recent funding**: Series B, C, D announced (Crunchbase, press releases)
- **Rapid headcount growth**: LinkedIn employee count trending up
- **Scale-up job postings**: Hiring for ops, logistics, supply chain leadership
- **Revenue growth mentions**: Press, investor updates indicating rapid scale

## Company-Level Signals

### Must-Have
- **Vertical confirmation**: CPG, F&B, Retail, Wholesale/Distribution
- **Revenue band**: $50M+ (validate against mid-market sweet spot)
- **Physical product**: Confirmed they ship physical goods
- **Current fulfillment model**: 3PL name, in-house, hybrid

### Enrichment Signals
- **Current 3PL provider**: Who they use now (displacement opportunity)
- **Fulfillment volume**: Order volume indicators (SKU count, shipping volume mentions)
- **Technology stack**: Shopify, ERP, WMS, OMS in use
- **Retail partners**: Which retailers they sell to (OTIF exposure)
- **Geographic distribution**: Where they ship from/to

## Person-Level Signals

- **Job title match**: Against 3 persona archetypes (see personas.md)
- **LinkedIn activity**: Posts about fulfillment challenges, 3PL frustration, automation interest
- **Tenure**: New supply chain leaders = more likely to make vendor changes
- **Tech-forward indicators**: Posts about Shopify, automation, AI in supply chain

## Monitoring Signals (Ongoing)

- 3PL provider changes or contract expirations
- Funding announcements in target verticals
- OTIF compliance news in retail-facing CPG
- Shopify ecosystem growth signals
- Atlanta-area companies (proximity to new facility)
