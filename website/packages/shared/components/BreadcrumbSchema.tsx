export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Renders BreadcrumbList JSON-LD structured data.
 * Pass an array of breadcrumb items from root to current page.
 * A "Home" root is always prepended automatically.
 */
export function BreadcrumbSchema({ items, siteUrl }: { items: BreadcrumbItem[]; siteUrl?: string }) {
  const resolvedUrl = siteUrl
    || (items.length > 0 ? new URL(items[0].url).origin : 'https://shawnos.ai')

  const allItems: BreadcrumbItem[] = [
    { name: 'Home', url: resolvedUrl },
    ...items,
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
