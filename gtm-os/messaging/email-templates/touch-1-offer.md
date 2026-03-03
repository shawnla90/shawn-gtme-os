# Touch 1: The Offer

The landing page IS the value. Lead with the strongest insight from their research.

## Subject Lines

- A: `{{companyName}} - we built something for you`
- B: `Quick question about {{companyName}}'s GTM`
- C: `{{firstName}}, saw this about {{companyName}}`

## Body

```
{{firstName}},

We've been studying {{companyName}}'s growth motion. Found something worth sharing.

We built a page for you: {{pageUrl}}

It covers what we see as your top challenge - {{topChallenge}} - and maps out exactly what we'd do about it. Timeline, deliverables, the whole picture.

Take a look. If it resonates, reply. If not, no follow-up.

Shawn
Lead Alchemy
```

## Variables

| Variable | Source |
|----------|--------|
| `{{firstName}}` | contacts.first_name |
| `{{companyName}}` | accounts.name |
| `{{pageUrl}}` | thegtmos.ai/for/{slug} |
| `{{topChallenge}}` | landing_pages.page_data.challenges[0] |

## Notes

- No fluff, no "hope you're well"
- The page does the selling - email just gets them there
- CTA is reply-based, not calendar link (lower friction)
