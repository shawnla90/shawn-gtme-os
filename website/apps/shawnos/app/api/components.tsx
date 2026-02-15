'use client'

/**
 * Client-side interactive components for the API documentation page
 */

export function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
      }}
      className="rounded border border-gray-700 bg-gray-800 px-3 py-1 font-mono text-xs text-gray-400 transition-colors hover:border-green-500 hover:text-green-400"
    >
      {label}
    </button>
  )
}

export function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-gray-500">{language}</span>
        <CopyButton text={code} label="Copy" />
      </div>
      <pre className="overflow-x-auto font-mono text-sm text-green-400">
        <code>{code}</code>
      </pre>
    </div>
  )
}
