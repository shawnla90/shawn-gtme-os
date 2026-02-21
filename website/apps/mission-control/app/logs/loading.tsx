export default function LogsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-24 bg-green-900/50 rounded" />
      <div>
        <div className="h-8 w-40 bg-green-900/40 rounded mb-2" />
        <div className="h-3 w-48 bg-green-900/20 rounded" />
      </div>
      <div className="card grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-7 w-12 bg-green-900/30 rounded mx-auto mb-1" />
            <div className="h-3 w-16 bg-green-900/20 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card border-l-4 border-green-900/30">
            <div className="flex justify-between mb-2">
              <div className="h-4 w-36 bg-green-900/30 rounded" />
              <div className="h-5 w-12 bg-green-900/30 rounded-full" />
            </div>
            <div className="flex gap-5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-3 w-16 bg-green-900/20 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
