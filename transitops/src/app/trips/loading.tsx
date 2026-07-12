import { TableSkeleton, Skeleton } from '@/components/ui/skeleton'

export default function TripsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1"><Skeleton className="h-7 w-44"/><Skeleton className="h-4 w-28"/></div>
        <Skeleton className="h-9 w-36 rounded-xl"/>
      </div>
      <div className="flex gap-3">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-9 w-32 rounded-xl"/>)}</div>
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 overflow-hidden">
        <TableSkeleton rows={10} cols={8}/>
        <div className="flex items-center justify-between px-2 py-3 border-t border-gray-100 dark:border-slate-800">
          <Skeleton className="h-4 w-40"/>
          <div className="flex gap-1.5"><Skeleton className="h-8 w-24 rounded-md"/><Skeleton className="h-8 w-20 rounded-md"/></div>
        </div>
      </div>
    </div>
  )
}
