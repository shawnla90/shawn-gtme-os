# Touch 2: The Gap Analysis

Mini audit results. Specific gaps found - not generic advice.

## Subject Lines

- A: `3 things we found on {{companyName}}'s site`
- B: `{{firstName}}, quick audit of {{companyName}}`
- C: `Your site score: {{gapScore}}/100`

## Body

```
{{firstName}},

Following up on the page we built for {{companyName}}.

We also ran a quick analysis of your current setup. Found a few things:

{{topIssues}}

This is phase 1 of what's mapped out on your page: {{pageUrl}}

Want the full breakdown?

Shawn
```

## Variables

| Variable | Source |
|----------|--------|
| `{{firstName}}` | contacts.first_name |
| `{{companyName}}` | accounts.name |
| `{{gapScore}}` | gap_analysis.score |
| `{{topIssues}}` | gap_analysis.top_issues (formatted as numbered list) |
| `{{pageUrl}}` | thegtmos.ai/for/{slug} |

## Notes

- Data-driven, not salesy
- Every issue must be specific and evidenced
- "Want the full breakdown?" is the CTA - implies more value behind the reply
