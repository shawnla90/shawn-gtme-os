# Campaign Monitoring — Exol (GreenBox)

## Email Tool: Smartlead (Not Instantly)

GreenBox uses Smartlead for outbound campaigns. Monitoring setup differs from Elauwit/Connext (Instantly).

### Key Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Open rate | >50% | <30% |
| Reply rate | >5% | <2% |
| Bounce rate | <3% | >5% |
| Spam complaints | <0.1% | >0.3% |

### Play-Specific Monitoring

| Play | Primary KPI | Secondary KPI |
|------|-----------|--------------|
| 3PL Switcher | Reply rate from Strategic Sam | Meeting conversion |
| Tech Stack Friction | Click rate (Shopify-matched leads) | WISMO-related replies |
| Funding Trigger | Reply rate within 30 days of funding | Executive meeting rate |

### Scoring Pipeline Monitoring

- **Clay→HubSpot sync**: Verify scores are pushing correctly
- **Tier distribution**: Track % of leads in each tier over time
- **Score-to-meeting correlation**: Do higher-scored leads convert better?
- **Re-score effectiveness**: Are Tier 3 leads upgrading after engagement?

## Paid Media Monitoring (Atlanta Launch)

- **Google Ads**: CPC, CTR, conversion rate by keyword
- **LinkedIn Ads**: CPL, engagement rate by targeting segment
- **Waitlist growth**: Sign-ups for Atlanta facility

## Reporting Cadence

- **Daily**: Smartlead deliverability + reply monitoring
- **Weekly**: Play performance comparison + scoring pipeline health
- **Monthly**: Full funnel analysis + paid media ROI + TAM coverage

## MCP Server Integration

<!-- Document Smartlead MCP server setup and monitoring queries here when configured -->
