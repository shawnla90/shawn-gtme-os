# TAM Identification — Connext

## Purpose

Map the full Total Addressable Market of companies meeting Connext's ICP: $500M+ revenue, 100+ locations, key verticals, North America.

## Process

### Phase 1: Universe Build

**Data Sources**:
- LinkedIn Sales Navigator (company search by revenue + industry + geography)
- ZoomInfo / Apollo (firmographic filters)
- Clay enrichment (batch processing)
- Industry databases (NRF member lists, franchise directories, SEC filings for public companies)

**Initial Filters**:
- Revenue: $500M+
- Industry: Retail, QSR/Restaurant, Grocery, Pharmacy, Financial Services, Healthcare
- Geography: US, Canada, Mexico headquarters or operations
- Employee count: Proxy for scale (correlates with location count)

### Phase 2: Location Count Validation

**This is the hard gate. No shortcuts.**

- Run location count Claygent against entire universe (see prompts/location-count-validation.md)
- Pass: 100+ locations confirmed → move to Phase 3
- Fail: <100 locations → remove from TAM
- Unknown: Flag for manual research

### Phase 3: Enrichment & Scoring

For validated accounts:
- Check for high-intent signals (ESL, remodels, IT layoffs)
- Identify current deployment vendors (competitive landscape)
- Map internal IT team size (outsourcing readiness)
- Score by: signal density > location count > revenue

### Phase 4: TAL Build

- Segment validated TAM into Target Account List tiers
- Tier A: High-intent signals + 100+ locations + key vertical
- Tier B: 100+ locations + key vertical (no active signals)
- Tier C: Qualified but lower priority (edge verticals, borderline location count)

## Current Status

- [ ] Phase 1: Initial sourcing and enrichment done
- [ ] Phase 2: Location count Claygent in development
- [ ] Phase 3: Not started
- [ ] Phase 4: Not started
- [ ] Full TAM size: Unknown — key deliverable

## TAM Tracking

<!-- Document running TAM count, sources, and validation rates here as they develop -->

| Vertical | Universe Size | Validated (100+) | Qualified | TAL Tier A |
|----------|--------------|-------------------|-----------|------------|
| Retail | — | — | — | — |
| QSR | — | — | — | — |
| Grocery | — | — | — | — |
| Financial | — | — | — | — |
| Healthcare | — | — | — | — |
| **Total** | — | — | — | — |
