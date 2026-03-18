import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

// Extend default schema to allow syntax-highlighted code classes
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
  },
}

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Extracts FAQ question/answer pairs from raw markdown content.
 * Supports two patterns:
 *   - **question?** followed by answer paragraph
 *   - ### question? followed by answer paragraph
 * Both under a ## FAQ / ## frequently asked questions heading.
 */
export function extractFAQs(markdown: string): FAQItem[] {
  // Find the FAQ section - match "## frequently asked questions" or "## FAQ"
  const faqMatch = markdown.match(/^## (?:frequently asked questions|faq)\s*$/im)
  if (!faqMatch || faqMatch.index === undefined) return []

  // Get content after the FAQ heading until next ## heading or end
  const afterFaq = markdown.slice(faqMatch.index + faqMatch[0].length)
  const nextH2 = afterFaq.search(/^## /m)
  const faqSection = nextH2 >= 0 ? afterFaq.slice(0, nextH2) : afterFaq

  const items: FAQItem[] = []

  // Pattern 1: **bold question?**\nanswer paragraph
  // Pattern 2: ### heading question?\nanswer paragraph
  const lines = faqSection.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // Check for bold question: **question text?**
    const boldMatch = line.match(/^\*\*(.+?)\*\*$/)
    // Check for H3 question: ### question text?
    const h3Match = line.match(/^###\s+(.+)$/)

    const question = boldMatch?.[1] || h3Match?.[1]

    if (question) {
      // Collect answer lines until next question, heading, separator, or end
      const answerLines: string[] = []
      i++
      while (i < lines.length) {
        const next = lines[i].trim()
        // Stop at next question (bold or H3), separator, or section heading
        if (
          next.match(/^\*\*.+\*\*$/) ||
          next.match(/^###\s+/) ||
          next.match(/^## /) ||
          next === '---'
        ) {
          break
        }
        if (next.length > 0) {
          answerLines.push(next)
        }
        i++
      }

      const answer = answerLines.join(' ').trim()
      if (answer.length > 0) {
        items.push({ question: question.replace(/\?$/, '?'), answer })
      }
    } else {
      i++
    }
  }

  return items
}

/**
 * Converts a markdown string to sanitized HTML using a unified remark/rehype pipeline.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}
