'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { VehicleType, VehicleStatus } from '@prisma/client'

export function DashboardFilters({ regions, currentType, currentStatus, currentRegion }: {
  regions: string[]
  currentType?: string
  currentStatus?: string
  currentRegion?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/dashboard?${params.toString()}`)
  }

  const selectClass = "h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-500">Filter by:</span>
      <select className={selectClass} value={currentType ?? ''} onChange={e => update('type', e.target.value)}>
        <option value="">All Types</option>
        {Object.values(VehicleType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
      </select>
      <select className={selectClass} value={currentStatus ?? ''} onChange={e => update('status', e.target.value)}>
        <option value="">All Statuses</option>
        {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
      </select>
      <select className={selectClass} value={currentRegion ?? ''} onChange={e => update('region', e.target.value)}>
        <option value="">All Regions</option>
        {regions.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      {(currentType || currentStatus || currentRegion) && (
        <button onClick={() => router.push('/dashboard')} className="h-9 px-3 rounded-xl text-sm text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
          Clear filters
        </button>
      )}
    </div>
  )
}
