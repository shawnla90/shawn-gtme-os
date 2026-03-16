# Architecture

## System Design

```
                    ┌─────────────────────────────┐
                    │     LaunchD (7AM + 7PM)      │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │    signal_analyzer.py         │
                    │                               │
                    │  1. Fetch market data          │
                    │  2. Fetch sentiment            │
                    │  3. Fetch reddit posts         │
                    │  4. Apply rule-based signals   │
                    │  5. Output JSON                │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                     │
    ┌─────────▼──────┐  ┌────────▼───────┐  ┌─────────▼──────┐
    │ CoinGecko      │  │ Fear & Greed   │  │ Reddit (PRAW)  │
    │ - prices       │  │ - index value  │  │ - hot posts    │
    │ - market cap   │  │ - classification│ │ - scores       │
    │ - 24h change   │  │                │  │ - sentiment    │
    │ - BTC dominance│  │                │  │                │
    └────────────────┘  └────────────────┘  └────────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │  data/agent-logs/crypto/      │
                    │  YYYY-MM-DD_HHMM.json        │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │  Human Review (Shawn)         │
                    │  - Read signals               │
                    │  - Check reasoning             │
                    │  - Decide action               │
                    │  - Execute manually if any     │
                    └─────────────────────────────┘
```

## Components

### Signal Analyzer (`scripts/crypto/signal_analyzer.py`)
- Rule-based analysis (no ML model — simple, auditable)
- Conservative bias: defaults to "hold"
- Confidence scores reflect signal strength
- Every output includes disclaimer

### Config (`scripts/crypto/config.py`)
- API endpoints
- Tracked assets (BTC, ETH, SOL)
- Signal thresholds
- Budget rules

## Future Evolution
1. **v1 (now):** Rule-based signals from free data
2. **v2:** Add AI summarization of Reddit sentiment (Claude API)
3. **v3:** Historical trend analysis, pattern detection
4. **v4:** Multi-timeframe analysis (1h, 4h, 1d)
