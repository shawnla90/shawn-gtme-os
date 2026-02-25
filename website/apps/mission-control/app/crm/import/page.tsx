'use client'

import { useState } from 'react'
import { Download, CheckCircle, AlertCircle } from 'lucide-react'

interface ImportResult {
  accounts: number
  contacts: number
  activities: number
  errors: string[]
}

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  const runImport = async () => {
    setImporting(true)
    setResult(null)
    const res = await fetch('/api/crm/import/', { method: 'POST' })
    const data = await res.json()
    setResult(data)
    setImporting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">IMPORT DATA</h1>
        <p className="text-sm text-gray-500">Import partner data into CRM</p>
      </div>

      <div className="card">
        <h2 className="text-sm font-bold text-green-400 mb-3">Partner-Alpha Import</h2>
        <p className="text-xs text-gray-400 mb-4">
          Imports email replies and research documents from <code className="bg-gray-800 px-1 rounded">clients/partner/partner-alpha/resources/</code> into the CRM.
          Creates an Partner-Alpha account, contacts from email addresses, and activity entries for each reply.
        </p>

        <button
          onClick={runImport}
          disabled={importing}
          className="btn text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {importing ? 'Importing...' : 'Run Partner-Alpha Import'}
        </button>
      </div>

      {result && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            {result.errors.length === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <h2 className="text-sm font-bold text-green-400">Import Complete</h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{result.accounts}</div>
              <div className="text-[10px] text-gray-500 uppercase">Accounts Created</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{result.contacts}</div>
              <div className="text-[10px] text-gray-500 uppercase">Contacts Created</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{result.activities}</div>
              <div className="text-[10px] text-gray-500 uppercase">Activities Created</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="border-t border-green-800/50 pt-3">
              <h3 className="text-xs font-bold text-red-400 mb-2">Errors ({result.errors.length})</h3>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {result.errors.map((err, i) => (
                  <div key={i} className="text-xs text-red-300">{err}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
