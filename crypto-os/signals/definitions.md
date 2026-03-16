# Signal Definitions

## Signal Types

### `hold`
**Meaning:** Do nothing. Default state.
**Triggers:** No significant indicators. Market in normal range.
**Confidence:** 0.3 (baseline)
**Action:** None required. Check back next signal run.

### `watch`
**Meaning:** Something is happening. Pay attention but don't act.
**Triggers:** One indicator fired:
- Fear & Greed at extreme (≤20 or ≥80)
- 24h price move beyond threshold (≤-8% or ≥+10%)
**Confidence:** 0.4-0.5
**Action:** Read the signal reasoning. Check the news. No trade.

### `consider_buy`
**Meaning:** Multiple indicators suggest a potential buying opportunity. NOT a buy order.
**Triggers:** Fear + dip convergence:
- Fear & Greed ≤20 AND 24h drop ≤-8%
**Confidence:** 0.5-0.7
**Action:** Research further. Check if the drop has a fundamental reason. If it's just market fear, consider a small position per strategy rules.

### `consider_sell`
**Meaning:** Multiple indicators suggest taking profit or reducing exposure. NOT a sell order.
**Triggers:** Greed + pump convergence:
- Fear & Greed ≥80 AND 24h pump ≥+10%
**Confidence:** 0.5-0.7
**Action:** Evaluate existing positions. If in profit, consider taking some off. If no position, don't FOMO in.

## Confidence Scale
| Range | Meaning |
|-------|---------|
| 0.0-0.3 | Noise / baseline |
| 0.3-0.5 | Weak signal |
| 0.5-0.7 | Moderate signal |
| 0.7+ | Reserved for future multi-factor analysis |

## Disclaimer
All signals are informational. The system has a conservative bias by design. When in doubt, the answer is "hold."
