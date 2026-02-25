'use client'

import { useState } from 'react'

interface Field {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea'
  required?: boolean
  options?: { label: string; value: string }[]
  placeholder?: string
}

interface CrmFormProps {
  fields: Field[]
  onSubmit: (data: Record<string, string>) => Promise<void>
  submitLabel?: string
  onCancel?: () => void
}

export default function CrmForm({ fields, onSubmit, submitLabel = 'Save', onCancel }: CrmFormProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(values)
      setValues({})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-xs text-gray-400 mb-1">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {field.type === 'select' ? (
            <select
              value={values[field.name] || ''}
              onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
              className="w-full bg-gray-900 border border-green-800 rounded px-3 py-2 text-sm text-green-300 focus:outline-none focus:border-green-500"
              required={field.required}
            >
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={values[field.name] || ''}
              onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-gray-900 border border-green-800 rounded px-3 py-2 text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-green-500 min-h-[80px]"
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              value={values[field.name] || ''}
              onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-gray-900 border border-green-800 rounded px-3 py-2 text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-green-500"
              required={field.required}
            />
          )}
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn text-sm disabled:opacity-50"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
