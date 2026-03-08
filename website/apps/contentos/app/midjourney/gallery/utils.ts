/* ── Gallery Utilities ───────────────────────────────── */

import type { Recipe } from './gallery-data'

/** Copy text to clipboard, returns success boolean */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Assemble a prompt from recipe base template + wizard selections */
export function assemblePrompt(
  recipe: Recipe,
  selections: Record<string, string>,
): string {
  let prompt = recipe.basePrompt

  recipe.steps.forEach((step) => {
    const selected = step.options.find((o) => o.value === selections[step.id])
    if (selected) {
      prompt = prompt.replace(`{${step.id}}`, selected.promptFragment)
    }
  })

  return `${prompt} ${recipe.defaultParams}`
}

/** Render prompt text with --params highlighted in blue */
export function splitPromptParts(
  text: string,
): { text: string; isParam: boolean }[] {
  const parts = text.split(/(--\w+\s+\S+)/g)
  return parts
    .filter((p) => p.length > 0)
    .map((part) => ({
      text: part,
      isParam: part.startsWith('--'),
    }))
}
