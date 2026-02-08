# Scoring Pipeline — Exol (GreenBox)

## Architecture: Clay → HubSpot

### Clay (Fit Scoring + Enrichment)

**Current state**: Initial phases complete

**What Clay does**:
1. Receives raw account/contact data
2. Runs Fit Score calculation (persona match, revenue, vertical, tech stack)
3. Enriches with signals (3PL provider, Shopify usage, funding status)
4. Pushes scored contacts to HubSpot

**Clay table structure**:
<!-- Document specific column setup, enrichment chains, and formulas here -->

### HubSpot (Engagement Scoring + Routing)

**Current state**: Contacts received from Clay with Fit Scores

**What HubSpot does**:
1. Receives contacts with Fit Score from Clay
2. Tracks Engagement Score (email opens, clicks, website visits, ad engagement)
3. Calculates composite score (Fit + Engagement = 200 pts max)
4. Routes to appropriate tier:
   - Tier 1 (150+) → SDR outreach
   - Tier 2 (100-149) → Nurture sequence
   - Tier 3 (<100) → Passive monitoring

**HubSpot properties to track**:
- `greenbox_fit_score` (from Clay)
- `greenbox_engagement_score` (HubSpot-calculated)
- `greenbox_composite_score` (sum)
- `greenbox_persona` (Strategic Sam / Ops Olivia / Scale-Minded Shawn)
- `greenbox_recommended_play` (3PL Switcher / Tech Stack Friction / Funding Trigger)
- `greenbox_tier` (1 / 2 / 3)

## Pipeline Flow

```
Raw data → Clay enrichment → Fit scoring → Push to HubSpot → Engagement tracking → Composite score → Tier routing → Outreach (Smartlead)
```

## Next Steps

- [ ] Document specific Clay column setup
- [ ] Define HubSpot workflow automation for tier routing
- [ ] Connect HubSpot → Smartlead for automated sequence enrollment
- [ ] Set up re-scoring cadence (monthly for Tier 3)
