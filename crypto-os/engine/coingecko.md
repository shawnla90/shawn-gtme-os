# CoinGecko API

## Overview
Free cryptocurrency data API. No API key required for basic endpoints.

## Endpoints Used

### Simple Price
```
GET https://api.coingecko.com/api/v3/simple/price
?ids=bitcoin,ethereum,solana
&vs_currencies=usd
&include_24hr_change=true
&include_market_cap=true
```

### Global Market Data
```
GET https://api.coingecko.com/api/v3/global
```
Returns: BTC dominance, total market cap, active cryptocurrencies count.

## Rate Limits
- Free tier: 10-30 calls/minute (varies)
- Our usage: 2 calls per run × 2 runs/day = 4 calls/day (well within limits)

## Response Format
```json
{
  "bitcoin": {
    "usd": 67000,
    "usd_24h_change": -2.5,
    "usd_market_cap": 1300000000000
  }
}
```
