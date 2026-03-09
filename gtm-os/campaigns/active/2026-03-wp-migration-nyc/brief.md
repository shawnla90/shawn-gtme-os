# WordPress Migration - NYC SMBs

## Campaign ID
`2026-03-wp-migration-nyc`

## Segment
`wp-migration-nyc`

## Thesis
Same as Miami campaign - NYC SMBs running WordPress are leaving performance on the table. Migrate to Next.js for faster pages, better Core Web Vitals, modern stack.

## Results
- **Sourced:** 14 confirmed WordPress accounts (2026-03-09)
- **Discovery pool:** 50 Apollo candidates with WP technographic
- **Hit rate:** 28% - lower than Miami (59%) because many NYC companies flagged as WP in Apollo have since migrated
- **Next step:** Consider broader discovery (without tech filter) to find more NYC WordPress sites

## Verification
```sql
SELECT count(*) FROM accounts WHERE tags @> '["wp-migration-nyc"]';

SELECT domain, tech_stack, exa_research->'wp_detection'->'confidence'
FROM accounts WHERE tags @> '["wp-migration-nyc"]' LIMIT 10;
```
