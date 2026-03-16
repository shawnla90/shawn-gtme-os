# Crypto OS — AI Operating Instructions

> AI-powered signal analysis for crypto markets. Cyborg model: AI analyzes, human decides, human executes.

## Identity

**Who:** Shawn Tenam — builder, not trader. Learning crypto with $100 and a system.
**What:** A signal analysis pipeline that fetches free market data, generates conservative signals, and surfaces them for human review. No automated trading. Ever.
**Method:** Recursive Drift applied to markets — the system builds itself in public, each loop adds context.

## Tool Inventory

| Tool | Role | Status | API Key? |
|------|------|--------|----------|
| **CoinGecko** | Prices, market cap, BTC dominance | Active | No (free) |
| **Fear & Greed Index** | Sentiment gauge (alternative.me) | Active | No (free) |
| **Reddit (PRAW)** | Community sentiment from crypto subs | Active | Yes (.env) |
| **Python + requests** | Data fetching & analysis | Active | No |

## The Cyborg Rule

```
AI analyzes. I decide. I execute.
```

- The script generates signals. It does NOT place trades.
- Every signal includes a confidence score and reasoning.
- Default action is always "hold" — the system has conservative bias.
- No exchange API keys. No wallet connections. No automated execution.
- The human reviews every signal before taking any action.

## Data Flow

```
┌───────────┐     ┌───────────┐     ┌──────────────┐
│ CoinGecko │────>│  Signal    │────>│ JSON Log     │
│ prices    │     │  Analyzer  │     │ agent-logs/  │
├───────────┤     │            │     │ crypto/      │
│ Fear &    │────>│ (Python)   │     └──────┬───────┘
│ Greed     │     │            │            │
├───────────┤     │  rules +   │     ┌──────▼───────┐
│ Reddit    │────>│  thresholds│     │ Human Review  │
│ sentiment │     └────────────┘     │ (Shawn)       │
└───────────┘                        └──────┬───────┘
                                            │
                                     ┌──────▼───────┐
                                     │ Manual Trade  │
                                     │ (if any)      │
                                     └──────────────┘
```

## Signal Types

| Signal | Meaning | When |
|--------|---------|------|
| `hold` | Do nothing | Default. No significant signals. |
| `watch` | Pay attention | One indicator triggered (fear/greed extreme OR big move) |
| `consider_buy` | Worth researching | Fear + dip convergence. NOT a buy order. |
| `consider_sell` | Worth evaluating | Greed + pump convergence. NOT a sell order. |

## Folder Map

```
crypto-os/
├── CLAUDE.md              ← you are here
├── status.md              ← portfolio state
├── log.md                 ← append-only session journal
├── engine/
│   ├── coingecko.md       ← API docs, endpoints, rate limits
│   ├── fear-greed.md      ← alternative.me API
│   ├── reddit.md          ← subreddit targets, engagement rules
│   └── architecture.md    ← data flow diagram, component design
├── strategy/
│   └── rules.md           ← budget rules, position limits
├── signals/
│   └── definitions.md     ← signal type definitions
└── scripts → ../scripts/crypto  (symlink)
```

## Automation Schedule (Mac Mini)

| Time | Job | Script |
|------|-----|--------|
| 07:00 | Morning signal | `signal_analyzer.py` |
| 19:00 | Evening signal | `signal_analyzer.py` |

Activated via `launchctl load` on Mac Mini after `git pull`.

## Safety

- **Never commit** `.env`, wallet addresses, exchange API keys, or actual P&L data
- **No automated trading** — the script is read-only market analysis
- **Conservative bias** — system defaults to "hold" unless multiple indicators converge
- **Public vs private** — methodology and sanitized examples are public; actual signals, thresholds, and strategy stay private
