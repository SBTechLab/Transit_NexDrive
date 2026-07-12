'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { DriverStatus } from '@prisma/client'
import { Search } from 'lucide-react'

export function DriverFilters({ currentStatus, currentSearch, currentSort }: {
  currentStatus?: string
  currentSearch?: string
  currentSort?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/drivers?${params.toString()}`)
  }

  const selectClass = "h-9 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-gray-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search drivers..."
          defaultValue={currentSearch ?? ''}
          onChange={e => update('search', e.target.value)}
          className="h-9 pl-8 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select className={selectClass} value={currentStatus ?? ''} onChange={e => update('status', e.target.value)}>
        <option value="">All Statuses</option>
        {Object.values(DriverStatus).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
      </select>
      <select className={selectClass} value={currentSort ?? ''} onChange={e => update('sort', e.target.value)}>
        <option value="">Sort: Default</option>
        <option value="name">Sort: Name</option>
        <option value="safetyScore">Sort: Safety Score</option>
        <option value="licenseExpiryDate">Sort: License Expiry</option>
        <option value="status">Sort: Status</option>
      </select>
      {(currentStatus || currentSearch) && (
        <button onClick={() => router.push('/drivers')} className="h-9 px-3 rounded-xl text-sm text-red-500 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors">Clear</button>
      )}
    </div>
  )
}
