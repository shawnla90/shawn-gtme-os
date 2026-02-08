# Signal Retrieval — Elauwit

## Purpose

Key signals to enrich and monitor for Elauwit target accounts. Used in Clay tables, Claygent enrichments, and ongoing monitoring.

## Company-Level Signals

### Must-Have Signals
- **Total unit count**: Portfolio size across all properties
- **Property list**: Individual properties with unit counts and addresses
- **Asset class**: Class A vs Class B (vintage year if available)
- **Ownership structure**: Privately held confirmation
- **Geographic footprint**: States/markets where they operate

### High-Value Signals
- **Current WiFi/internet provider**: Existing contracts, pain signals
- **Resident complaints**: Reviews mentioning WiFi, internet, connectivity issues
- **Recent acquisitions**: New properties = new infrastructure decisions
- **Construction/development pipeline**: New builds = Managed WiFi opportunity
- **Technology investments**: Smart building initiatives, IoT mentions

## Person-Level Signals

### For Enrichment
- **Job title match**: Against persona query groups (see personas.md)
- **LinkedIn activity**: Recent posts about property tech, infrastructure, resident experience
- **Tenure**: How long in role (new = more likely to make changes)
- **Decision authority signals**: "oversees," "manages," "responsible for" in bio

### For Campaign Personalization
- **Specific property names**: For hyper-relevant outreach (e.g., "The Mark at CityPlace, 268 units")
- **Unit counts per property**: Proves research, not bulk blast
- **Event attendance**: Industry conferences, multifamily expos
- **Company news**: Acquisitions, expansions, leadership changes

## Monitoring Signals (Ongoing)

- Job changes among qualified contacts (champion tracking)
- New properties added to portfolio
- Resident review sentiment shifts (WiFi/internet complaints)
- Competitor contract expirations (if discoverable)
- Event registrations in priority markets

## Clay Table Structure Notes

<!-- Document specific Clay column setups, enrichment chains, and formula logic here as they're built -->
