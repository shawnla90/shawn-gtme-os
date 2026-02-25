import { GitCommit } from 'lucide-react'

interface Commit {
  hash: string
  message: string
  date: string
  author: string
}

interface CommitLogProps {
  commits: Commit[]
}

export default function CommitLog({ commits }: CommitLogProps) {
  if (commits.length === 0) {
    return <div className="text-center py-8 text-gray-500 text-sm">No commits found</div>
  }

  return (
    <div className="space-y-1">
      {commits.map((commit) => (
        <div key={commit.hash} className="flex items-start gap-3 py-2 border-b border-green-900/30 last:border-0">
          <GitCommit className="w-3 h-3 text-green-600 mt-1 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-green-500">{commit.hash}</span>
              <span className="text-xs text-green-300 truncate">{commit.message}</span>
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">
              {commit.date?.split(' ')[0]} &middot; {commit.author}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
