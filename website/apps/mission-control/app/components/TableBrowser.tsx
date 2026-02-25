'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TableBrowserProps {
  database: string
  table: string
}

export default function TableBrowser({ database, table }: TableBrowserProps) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const limit = 50

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/db/${database}/${table}/?limit=${limit}&offset=${offset}`)
    const data = await res.json()
    setRows(data.rows || [])
    setColumns(data.columns || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [database, table, offset])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const pages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1

  const formatCell = (value: unknown): string => {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'string' && value.length > 80) return value.slice(0, 80) + '…'
    return String(value)
  }

  const isJsonLike = (value: unknown): boolean => {
    if (typeof value !== 'string') return false
    const s = value.trim()
    return (s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading table data...</div>
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500">
        {total.toLocaleString()} rows &middot; {columns.length} columns
      </div>

      <div className="overflow-x-auto border border-green-800 rounded-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-900">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left text-green-400 font-bold whitespace-nowrap border-b border-green-800"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <Fragment key={i}>
                <tr
                  className="hover:bg-gray-900/50 cursor-pointer border-b border-green-900/30"
                  onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                >
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-2 text-gray-300 whitespace-nowrap max-w-[300px] truncate">
                      {isJsonLike(row[col]) ? (
                        <span className="text-purple-400">{formatCell(row[col])}</span>
                      ) : (
                        formatCell(row[col])
                      )}
                    </td>
                  ))}
                </tr>
                {expandedRow === i && (
                  <tr>
                    <td colSpan={columns.length} className="bg-gray-900 px-4 py-3 border-b border-green-800">
                      <pre className="text-xs text-green-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                        {JSON.stringify(row, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="btn text-xs flex items-center gap-1 disabled:opacity-30"
          >
            <ChevronLeft className="w-3 h-3" /> Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {currentPage} of {pages}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="btn text-xs flex items-center gap-1 disabled:opacity-30"
          >
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
