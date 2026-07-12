'use client'

import { Download } from 'lucide-react'

export function CSVExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    const headers = ['Vehicle', 'Revenue', 'Fuel Cost', 'Maintenance', 'Other', 'Total Cost', 'Fuel Efficiency (km/L)', 'ROI (%)']
    const rows = data.map(r => [r.name, r.revenue.toFixed(2), r.fuel.toFixed(2), r.maintenance.toFixed(2), r.other.toFixed(2), r.totalCost.toFixed(2), r.fuelEfficiency, r.roi])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fleet-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleExport} className="flex items-center gap-2 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm">
      <Download className="h-4 w-4" /> Export CSV
    </button>
  )
}
