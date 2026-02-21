export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-green-900/50 rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card">
            <div className="h-8 bg-green-900/30 rounded mb-2" />
            <div className="h-3 w-20 bg-green-900/20 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="h-6 w-40 bg-green-900/30 rounded mb-4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-green-900/20 rounded mb-2" />
          ))}
        </div>
        <div className="space-y-6">
          <div className="card h-48 bg-green-900/20 rounded" />
          <div className="card h-32 bg-green-900/20 rounded" />
        </div>
      </div>
    </div>
  )
}
