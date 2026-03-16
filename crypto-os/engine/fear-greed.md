# Fear & Greed Index

## Overview
Crypto Fear & Greed Index from alternative.me. Free, no API key.

## Endpoint
```
GET https://api.alternative.me/fng/?limit=1
```

## Response
```json
{
  "data": [{
    "value": "25",
    "value_classification": "Extreme Fear",
    "timestamp": "1710460800"
  }]
}
```

## Scale
| Range | Classification |
|-------|---------------|
| 0-24 | Extreme Fear |
| 25-49 | Fear |
| 50 | Neutral |
| 51-74 | Greed |
| 75-100 | Extreme Greed |

## How We Use It
- Extreme Fear (≤20) + price dip → `consider_buy` signal
- Extreme Greed (≥80) + price pump → `consider_sell` signal
- Middle range → contributes to `hold` default
