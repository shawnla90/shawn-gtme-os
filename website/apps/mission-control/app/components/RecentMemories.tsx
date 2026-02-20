'use client'

import { useState, useEffect } from 'react'
import { Brain, Search, FileText, Calendar } from 'lucide-react'

interface Memory {
  id: string
  title: string
  content: string
  date: string
  type: 'daily' | 'long-term' | 'project'
  tags: string[]
}

export default function RecentMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('/api/enhanced-data')
        const data = await res.json()
        if (data.success && data.data?.memories?.length > 0) {
          setMemories(data.data.memories)
        }
      } catch (e) {
        console.error('Failed to fetch memories:', e)
      }
    }
    fetchMemories()
    const interval = setInterval(fetchMemories, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'daily' | 'long-term' | 'project'>('all')

  const filteredMemories = memories
    .filter(memory => selectedType === 'all' || memory.type === selectedType)
    .filter(memory => 
      searchTerm === '' || 
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  const typeColors = {
    daily: 'bg-blue-900 text-blue-300',
    'long-term': 'bg-green-900 text-green-300',
    project: 'bg-purple-900 text-purple-300'
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-bold text-green-300">RECENT MEMORIES</h2>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-green-700 rounded text-green-300 placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-1">
          {['all', 'daily', 'long-term', 'project'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-2 py-1 text-xs rounded ${
                selectedType === type 
                  ? 'bg-green-800 text-green-300' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {type.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Memory List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredMemories.map(memory => (
          <div key={memory.id} className="bg-gray-800 p-3 rounded border-l-2 border-green-600">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-green-200 text-sm">{memory.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${typeColors[memory.type]}`}>
                  {memory.type.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">
              {memory.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {memory.tags.map(tag => (
                  <span key={tag} className="text-xs px-1 py-0.5 bg-gray-700 rounded text-gray-300">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{memory.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-green-800">
        <div className="flex items-center gap-4 text-xs text-green-500">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{filteredMemories.length} memories</span>
          </div>
          <div>Last updated: Today</div>
        </div>
      </div>
    </div>
  )
}