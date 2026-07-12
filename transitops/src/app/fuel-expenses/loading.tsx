import { TableSkeleton, Skeleton } from '@/components/ui/skeleton'

export default function FuelExpensesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1"><Skeleton className="h-7 w-44"/><Skeleton className="h-4 w-40"/></div>
        <div className="flex gap-2"><Skeleton className="h-9 w-32 rounded-xl"/><Skeleton className="h-9 w-36 rounded-xl"/></div>
      </div>
      <div className="flex gap-2"><Skeleton className="h-9 w-24 rounded-lg"/><Skeleton className="h-9 w-32 rounded-lg"/></div>
      <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <TableSkeleton rows={10} cols={4}/>
        <div className="flex items-center justify-between px-2 py-3 border-t border-gray-100 dark:border-slate-800">
          <Skeleton className="h-4 w-40"/>
          <div className="flex gap-1.5"><Skeleton className="h-8 w-24 rounded-md"/><Skeleton className="h-8 w-20 rounded-md"/></div>
        </div>
      </div>
    </div>
  )
}
