'use client'

interface MetaLike {
  current_ascending_chain: number
  longest_chain: number
  momentum_mult?: number
  chain_multiplier?: number
  current_streak?: number
  longest_streak?: number
}

interface ScoringEntry {
  date: string
  chain_length?: number
  ascending_chain?: number
  streak_days?: number
}

interface ProgressionChainVizProps {
  meta: MetaLike
  scoringLog: ScoringEntry[]
  isV3?: boolean
}

export default function ProgressionChainViz({ meta, scoringLog, isV3 }: ProgressionChainVizProps) {
  const getChain = (e: ScoringEntry) => isV3 ? (e.ascending_chain ?? 0) : (e.chain_length ?? 0)
  const maxChain = Math.max(...scoringLog.map(getChain), 1)

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">
        {isV3 ? 'Momentum' : 'Ascending Chains'}
      </h3>

      {/* Stats */}
      <div className={`grid ${isV3 ? 'grid-cols-4' : 'grid-cols-3'} gap-4 mb-4`}>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{meta.current_ascending_chain}</div>
          <div className="text-[11px] text-gray-500 uppercase">Chain</div>
        </div>
        {isV3 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{meta.current_streak ?? 0}</div>
            <div className="text-[11px] text-gray-500 uppercase">Streak</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {(isV3 ? meta.momentum_mult : meta.chain_multiplier)?.toFixed(2) ?? '1.00'}x
          </div>
          <div className="text-[11px] text-gray-500 uppercase">{isV3 ? 'Momentum' : 'Mult'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{meta.longest_chain}</div>
          <div className="text-[11px] text-gray-500 uppercase">Best</div>
        </div>
      </div>

      {/* Chain bars */}
      <div className="flex items-end gap-1" style={{ height: '80px' }}>
        {scoringLog.map((entry) => {
          const chain = getChain(entry)
          const heightPct = (chain / maxChain) * 100
          const isAscending = chain > 1
          return (
            <div
              key={entry.date}
              className="flex-1 flex flex-col items-center justify-end"
              style={{ height: '100%' }}
            >
              <div
                className={`w-full rounded-t ${isAscending ? 'bg-green-500' : 'bg-gray-700'}`}
                style={{ height: `${heightPct}%`, minHeight: '4px' }}
              />
              <div className="text-[11px] text-gray-600 mt-1">{entry.date.slice(8)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
