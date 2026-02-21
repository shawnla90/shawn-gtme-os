export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-green-900/50 rounded" />
        <div className="h-4 w-28 bg-green-900/50 rounded" />
      </div>
      <div>
        <div className="h-8 w-40 bg-green-900/40 rounded mb-2" />
        <div className="h-3 w-56 bg-green-900/20 rounded" />
      </div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card text-center">
            <div className="h-8 w-20 bg-green-900/30 rounded mx-auto mb-2" />
            <div className="h-3 w-16 bg-green-900/20 rounded mx-auto" />
          </div>
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="card h-56 bg-green-900/10 rounded" />
      <div className="card h-40 bg-green-900/10 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card h-40 bg-green-900/10 rounded" />
        <div className="card h-40 bg-green-900/10 rounded" />
      </div>
    </div>
  )
}
