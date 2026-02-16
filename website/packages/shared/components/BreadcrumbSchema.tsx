const SITE_URL = 'https://shawnos.ai'

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Renders BreadcrumbList JSON-LD structured data.
 * Pass an array of breadcrumb items from root to current page.
 * A "Home" root is always prepended automatically.
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', url: SITE_URL },
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
