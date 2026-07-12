import { CardSkeleton, TableSkeleton, Skeleton } from '@/components/ui/skeleton'

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1"><Skeleton className="h-7 w-48"/><Skeleton className="h-4 w-36"/></div>
        <div className="flex gap-2"><Skeleton className="h-9 w-28 rounded-xl"/><Skeleton className="h-9 w-28 rounded-xl"/></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({length:6}).map((_,i)=><CardSkeleton key={i}/>)}
      </div>
      <Skeleton className="h-72 w-full rounded-2xl"/>
      <TableSkeleton rows={6} cols={7}/>
    </div>
  )
}
