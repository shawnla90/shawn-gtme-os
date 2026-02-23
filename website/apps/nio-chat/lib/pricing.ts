// NioBot V2 — Model pricing lookup and cost calculation

export interface ModelPricing {
  inputPricePer1M: number
  outputPricePer1M: number
}

// Prices in USD per 1M tokens
const PRICING: Record<string, ModelPricing> = {
  'claude-opus-4-6': { inputPricePer1M: 15, outputPricePer1M: 75 },
  'claude-sonnet-4-6': { inputPricePer1M: 3, outputPricePer1M: 15 },
  'claude-haiku-4-5': { inputPricePer1M: 0.8, outputPricePer1M: 4 },
  'ollama/qwen2.5:14b': { inputPricePer1M: 0, outputPricePer1M: 0 },
}

export function getModelPricing(model: string): ModelPricing | null {
  return PRICING[model] || null
}

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = getModelPricing(model)
  if (!pricing) return 0

  const inputCost = (inputTokens / 1_000_000) * pricing.inputPricePer1M
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPricePer1M
  return inputCost + outputCost
}

export function formatCost(dollars: number): string {
  if (dollars < 0.01) return '<$0.01'
  return `~$${dollars.toFixed(2)}`
}

export function formatTokens(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`
  return String(count)
}
