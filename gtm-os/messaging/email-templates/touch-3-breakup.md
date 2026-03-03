# Touch 3: The Breakup

Short, direct. TTL creates natural urgency.

## Subject Lines

- A: `{{firstName}} - your page comes down soon`
- B: `Last note from us`
- C: `Closing the loop on {{companyName}}`

## Body

```
{{firstName}},

Your page is still live: {{pageUrl}}

It comes down in about 2 weeks. After that, the personalized content depersonalizes automatically.

If it's useful, reply and we'll keep it up. If not, no hard feelings - it'll clean itself up.

Shawn
```

## Variables

| Variable | Source |
|----------|--------|
| `{{firstName}}` | contacts.first_name |
| `{{companyName}}` | accounts.name |
| `{{pageUrl}}` | thegtmos.ai/for/{slug} |

## Notes

- Shortest email in the sequence
- No pressure - the TTL IS the urgency
- Honest tone: "no hard feelings" is real
- One clear CTA: reply to keep it live
