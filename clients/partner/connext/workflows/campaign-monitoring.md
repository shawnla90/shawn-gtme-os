# Campaign Monitoring — Connext

## Current State

Pre-campaign. Monitoring workflows to be activated when campaigns launch.

## Planned Monitoring (Same Framework as Elauwit)

### Key Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Open rate | >50% | <30% |
| Reply rate | >5% | <2% |
| Bounce rate | <3% | >5% |
| Spam complaints | <0.1% | >0.3% |

### Connext-Specific Monitoring

- **Solution Play conversion**: Which of the 5 plays generates most meetings?
- **Vertical performance**: Which verticals respond best?
- **Signal-triggered vs. cold**: Compare response rates
- **Persona tier response**: Which tier engages most (Tier 1 vs Tier 2)?
- **Location count correlation**: Do larger companies (500+ sites) respond differently than 100-site companies?

## MCP Server Integration

<!-- Document Instantly MCP server setup when campaigns go live -->

## Reporting Cadence

- **Daily**: Deliverability monitoring (once live)
- **Weekly**: Campaign performance by Solution Play and vertical
- **Monthly**: Full funnel analysis — sends → meetings → pipeline

## Reference

See [`../../elauwit/workflows/campaign-monitoring.md`](../elauwit/workflows/campaign-monitoring.md) for the full monitoring framework and escalation triggers.
