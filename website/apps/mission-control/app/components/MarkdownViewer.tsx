interface MarkdownViewerProps {
  html: string
  className?: string
}

export default function MarkdownViewer({ html, className = '' }: MarkdownViewerProps) {
  return (
    <div
      className={`prose-terminal ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
