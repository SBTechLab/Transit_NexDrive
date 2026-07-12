import { CardSkeleton, TableSkeleton, Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="flex gap-3">
        {Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-9 w-32 rounded-xl"/>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({length:8}).map((_,i)=><CardSkeleton key={i}/>)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><TableSkeleton rows={5} cols={3}/></div>
        <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/50 p-6 space-y-4">
          {Array.from({length:4}).map((_,i)=><div key={i} className="space-y-1.5"><Skeleton className="h-4 w-full"/><Skeleton className="h-2 w-full rounded-full"/></div>)}
        </div>
      </div>
    </div>
  )
}
