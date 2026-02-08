# CSV Notes — SteveS Recruiting

## Master List Status

| Metric | Value | Date Updated |
|--------|-------|-------------|
| Total contacts | ~10,000 | Feb 5 |
| Mobile coverage | 9,966 (prev 6,852 + latest 3,114) | Feb 5 |
| Mobile % | ~99% | Feb 5 |
| Email coverage | In progress | Feb 7 |
| Data completeness (all fields) | TBD | — |

## Enrichment Sources Used

- **Lead Magic API** — mobile enrichment (batch 1 + batch 2)
- **Prospeo API** — mobile enrichment (maximizing coverage)
- **Validator**: Deliberately NOT run — validators create false positives that don't improve coverage or connect rates

## Known Issues

- Some rows missing full name
- Some rows missing company name
- Rarely both name AND company present when one is missing
- Previous operator (Ruadhan) built tables but everything was jumbled vs. segmented
- Steve manually separated into Excel sheets (time-consuming)
- Main Clay table: "P1-Clay and Loxo Data" — unseparated master list
- Other tables exist with TAM company information

## Enrichment Log

| Date | Action | Result |
|------|--------|--------|
| Pre-Feb | Previous operator (Ruadhan) initial build | Tables built, ~40% enriched |
| Feb 4-5 | Batch 1 mobile enrichment (Lead Magic + Prospeo) | 6,852 mobiles |
| Feb 5 | Batch 2 mobile enrichment | 3,114 of 4,225 attempted |
| Feb 5 | Total mobile | 9,966 contacts with mobile numbers |
| Feb 7+ | Email enrichment | In progress |
| Planned | Sumble enrichment (company LinkedIn + email) | Full company list |
| Planned | Semrush enrichment (recruitment signals) | Not started |

## CSV Column Mapping

<!-- Document the actual column names from Steve's CSV here when loading into Cursor -->

| CSV Column | What It Contains | Data Quality |
|------------|-----------------|-------------|
| — | — | — |

## Next Steps

1. Complete email enrichment (personal + work emails)
2. Run Sumble on full company list for recruitment tech detection
3. Data quality cleanup (name/company gap-fill, dedup)
4. Segment list by title + geography (what Steve originally wanted)
5. Build prioritization scoring for daily batching
6. Import into CRM once decision is made

> Update this file every time you work on the list. This is the running log so the next session knows where you left off.
