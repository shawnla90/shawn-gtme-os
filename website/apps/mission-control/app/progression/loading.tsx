export default function ProgressionLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-green-900/50 rounded" />
        <div className="h-4 w-32 bg-green-900/50 rounded" />
      </div>
      <div>
        <div className="h-8 w-48 bg-green-900/40 rounded mb-2" />
        <div className="h-3 w-36 bg-green-900/20 rounded" />
      </div>
      {/* Profile hero skeleton */}
      <div className="card flex items-start gap-6">
        <div className="w-24 h-24 bg-green-900/30 rounded" />
        <div className="flex-1">
          <div className="h-6 w-40 bg-green-900/30 rounded mb-3" />
          <div className="h-4 w-24 bg-green-900/20 rounded mb-3" />
          <div className="h-3 bg-green-900/10 rounded" />
        </div>
      </div>
      {/* XP graph skeleton */}
      <div className="card">
        <div className="h-4 w-32 bg-green-900/30 rounded mb-4" />
        <div className="flex items-end gap-1" style={{ height: '160px' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex-1 bg-green-900/20 rounded-t" style={{ height: `${30 + Math.random() * 70}%` }} />
          ))}
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card h-48 bg-green-900/10 rounded" />
        <div className="card h-48 bg-green-900/10 rounded" />
      </div>
    </div>
  )
}
