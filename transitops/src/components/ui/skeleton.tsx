export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/50 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-1 w-full rounded-full" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/50 overflow-hidden">
      <div className="bg-gray-50 dark:bg-slate-800 px-6 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className={`h-4 flex-1 ${j === 0 ? 'w-32' : ''}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
