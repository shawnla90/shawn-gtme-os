# Campaign Monitoring — Elauwit

## Instantly Monitoring

### Key Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Open rate | >50% | <30% |
| Reply rate | >5% | <2% |
| Bounce rate | <3% | >5% |
| Spam complaints | <0.1% | >0.3% |
| Unsubscribe rate | <1% | >2% |

### Daily Checks
- [ ] Deliverability scores across all active domains
- [ ] Bounce rate spikes (bad data or burned domain signal)
- [ ] Reply sentiment (positive replies vs. "remove me")
- [ ] Warmup domain progress (for new domains in pipeline)

### Weekly Analysis
- [ ] Sequence performance comparison (which plays are converting)
- [ ] Persona tier performance (Tier 1 vs Tier 2 response patterns)
- [ ] Geographic performance (priority markets vs. rest)
- [ ] Domain health across the pool

## MCP Server Integration

Instantly MCP server is configured and connected. Use the following commands for monitoring:

### Reply Management Command

**`/instantlyreplies_elauwit`** — Fetch all email replies from the last 24 hours and save them to `resources/replies/` for analysis.

- **Usage**: Type `/instantlyreplies_elauwit` in Cursor chat
- **Output**: Saves each reply as a markdown file with full details
- **Location**: `clients/partner/elauwit/resources/replies/`
- **Use case**: Daily reply capture, reply analysis, sales routing

See [`replies-management.md`](replies-management.md) for full documentation.

### Monitoring Queries (Planned)
- Pull campaign stats by sequence
- Flag domains dropping below deliverability threshold
- Surface positive replies for immediate sales routing (use `/instantlyreplies_elauwit` to capture)
- Track "quote the switch" CTA conversion specifically

## Reporting Cadence

- **Daily**: Deliverability + reply monitoring (automated where possible)
- **Weekly**: Campaign performance review with Elauwit team
- **Monthly**: Full funnel analysis — sends → opens → replies → meetings → pipeline

## Escalation Triggers

- Domain deliverability drops below 80% → immediately pause and rotate
- Bounce rate spikes above 5% → check data source quality
- Positive reply not routed within 4 hours → flag to sales
- Campaign reply rate below 2% for 7 days → review copy and targeting
