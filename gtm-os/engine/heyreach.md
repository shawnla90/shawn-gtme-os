# HeyReach - LinkedIn Automation

> Multi-sender LinkedIn outreach with campaign management, warming, and response tracking.

## Status: Active (Planning Phase)

HeyReach handles LinkedIn connection requests, messaging sequences, and sender rotation. Multi-sender architecture means one workspace can manage 5-20 LinkedIn accounts running campaigns simultaneously.

## Core Architecture

- **Workspace-based, not per-seat.** One workspace, multiple senders. Add LinkedIn accounts without multiplying cost.
- **Multi-sender rotation.** Campaigns distribute outreach across assigned senders automatically. 5 senders = 5x the connection request volume from one dashboard.
- **Warming built-in.** New accounts follow a 4-week warming ramp before joining campaigns at full volume.

## Campaign Components

Each campaign has three parts:

1. **Lead list** - CSV with LinkedIn profile URLs (required), names, company, custom fields for personalization
2. **Sequence** - Message flow: profile view → connection request → first message → follow-ups → final touch
3. **Sender pool** - 3-5 LinkedIn accounts assigned to the campaign, rotating outreach automatically

## Integration Points

### Inbound (lead lists)
- CSV export from Clay (enriched, scored, qualified leads)
- CSV export from Apollo (contact data with LinkedIn URLs)
- CSV export from Sales Navigator (raw prospect lists)
- HeyReach API endpoint for webhook-based pushing from Clay HTTP columns

### Outbound (response data)
- Response tracking per campaign and per sender
- Acceptance rate monitoring per account
- Export to CRM (manual or via integration)

## Routing Logic

When to route to HeyReach vs email (Instantly/Lemlist):

| Signal | HeyReach (LinkedIn) | Instantly (Email) |
|--------|---------------------|-------------------|
| MX Record | Microsoft 365, Proofpoint, Mimecast | Google Workspace |
| Seniority | C-suite, VP | Manager, IC |
| Channel Affinity | Active LinkedIn poster | Responds to email |
| Multi-channel | Day 1, Day 5, Day 10 | Day 3, Day 7, Day 14 |

## Sender Limits

Conservative daily limits per account:

| Week | Connection Requests/Day | Profile Views/Day |
|------|------------------------|-------------------|
| 1 (warming) | 10 | 30 |
| 2 (warming) | 15 | 50 |
| 3 (warming) | 20 | 80 |
| 4+ (active) | 25 | 100 |

LinkedIn hard limit: ~100 connection requests per week per account. Never exceed 25/day even on warmed accounts.

## Safety Rules

- Never skip warming for new accounts
- Pull restricted accounts from campaigns immediately, cooldown 1-2 weeks
- Monitor acceptance rates: below 20% = pause and review targeting/copy
- Diversify activity: post, comment, engage (not just automated requests)
- Rotate senders: if one gets restricted, campaign continues on remaining senders

## Connection Request Copy

Under 300 characters. Lead with relevance, not introduction.

**Works:** "Saw your team just opened a Dubai office. We help companies nail GTM in new markets."
**Fails:** "Hi, I'm Shawn from Lead Alchemy and I'd love to connect."

## Multi-Channel Coordination

Stagger LinkedIn and email. Never hit both channels same day.

```
Day 1:  LinkedIn connection request (HeyReach)
Day 3:  Cold email (Instantly/Lemlist)
Day 5:  LinkedIn follow-up if accepted (HeyReach)
Day 7:  Email follow-up (Instantly/Lemlist)
Day 10: LinkedIn final touch (HeyReach)
Day 14: Email final touch (Instantly/Lemlist)
```

## Metrics to Track

- **Acceptance rate:** 30-50% healthy, below 10% = danger
- **Reply rate:** 15-25% of accepted connections
- **Meeting conversion:** 5-10% of conversations
- **Sender health:** per-account acceptance rate and restriction history

## Known Considerations

- LinkedIn detection algorithms change regularly. Any automation carries inherent risk.
- Product is younger than Dripify/Expandi. Some features still catching up.
- Reporting depth improving but not as mature as email automation tools.
- No native MCP server yet. Integration via API endpoints and CSV.

## Related Docs

- Wiki: HeyReach LinkedIn Automation (thegtmos.ai/how-to/heyreach-linkedin-automation)
- Wiki: Campaign Setup, Messaging Templates, Routing Logic, Sender Warming
- Blog: Why I Believe in HeyReach (shawnos.ai/blog/why-i-believe-in-heyreach)
- Blog: LinkedIn Messaging Best Practices 2026 (thegtmos.ai/blog/linkedin-messaging-best-practices-2026)
