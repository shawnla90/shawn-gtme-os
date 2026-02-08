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

<!-- Document Instantly MCP server setup, API endpoints, and automated monitoring queries here as they're configured -->

### Monitoring Queries (Planned)
- Pull campaign stats by sequence
- Flag domains dropping below deliverability threshold
- Surface positive replies for immediate sales routing
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
