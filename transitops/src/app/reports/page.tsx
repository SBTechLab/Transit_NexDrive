import { prisma } from '@/lib/prisma'
import { TripStatus, VehicleStatus } from '@prisma/client'
import { ReportsCharts } from './ReportsCharts'
import { CSVExportButton } from './CSVExportButton'
import { PDFExportButton } from './PDFExportButton'
import { TrendingUp, Fuel, Activity, DollarSign } from 'lucide-react'

export default async function ReportsPage() {
  const [vehicles, fuelLogs, expenses, maintenanceLogs, trips, operationalVehicles] = await Promise.all([
    prisma.vehicle.findMany({ select: { id: true, registrationNumber: true, acquisitionCost: true, odometerKm: true } }),
    prisma.fuelLog.findMany({ include: { vehicle: { select: { registrationNumber: true } } } }),
    prisma.expense.findMany({ include: { vehicle: { select: { registrationNumber: true } } } }),
    prisma.maintenanceLog.findMany({ include: { vehicle: { select: { registrationNumber: true } } } }),
    prisma.trip.findMany({ where: { status: TripStatus.COMPLETED }, select: { vehicleId: true, actualDistanceKm: true, fuelConsumedLiters: true, revenue: true } }),
    prisma.vehicle.count({ where: { status: { not: VehicleStatus.RETIRED } } }),
  ])

  const vehicleMap = new Map(vehicles.map(v => [v.id, { reg: v.registrationNumber, acquisitionCost: v.acquisitionCost, fuel: 0, maintenance: 0, other: 0, distance: 0, fuelLiters: 0, revenue: 0 }]))

  fuelLogs.forEach(l => { const v = vehicleMap.get(l.vehicleId); if (v) { v.fuel += l.cost; v.fuelLiters += l.liters } })
  maintenanceLogs.forEach(l => { const v = vehicleMap.get(l.vehicleId); if (v) v.maintenance += l.cost })
  expenses.forEach(e => { const v = vehicleMap.get(e.vehicleId); if (v) v.other += e.amount })
  trips.forEach(t => { const v = vehicleMap.get(t.vehicleId); if (v) { v.distance += t.actualDistanceKm ?? 0; v.fuelLiters += t.fuelConsumedLiters ?? 0; v.revenue += t.revenue ?? 0 } })

  const costData = Array.from(vehicleMap.entries()).map(([, v]) => ({
    name: v.reg,
    fuel: v.fuel,
    maintenance: v.maintenance,
    other: v.other,
    totalCost: v.fuel + v.maintenance + v.other,
    fuelEfficiency: v.fuelLiters > 0 ? parseFloat((v.distance / v.fuelLiters).toFixed(2)) : 0,
    roi: v.acquisitionCost > 0 ? parseFloat(((v.revenue - (v.maintenance + v.fuel)) / v.acquisitionCost * 100).toFixed(2)) : 0,
    revenue: v.revenue,
  }))

  const totalFuel = costData.reduce((a, c) => a + c.fuel, 0)
  const totalMaintenance = costData.reduce((a, c) => a + c.maintenance, 0)
  const totalOther = costData.reduce((a, c) => a + c.other, 0)
  const totalCost = totalFuel + totalMaintenance + totalOther
  const totalRevenue = costData.reduce((a, c) => a + c.revenue, 0)
  const avgFuelEfficiency = costData.filter(c => c.fuelEfficiency > 0).reduce((a, c, _, arr) => a + c.fuelEfficiency / arr.length, 0)
  const activeVehiclesCount = await prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } })
  const fleetUtilization = operationalVehicles > 0 ? Math.round((activeVehiclesCount / operationalVehicles) * 100) : 0

  const kpis = [
    { label: 'Total Fuel Cost',      value: `$${totalFuel.toFixed(2)}`,              icon: Fuel,       color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Maintenance',    value: `$${totalMaintenance.toFixed(2)}`,        icon: TrendingUp, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Total Operating Cost', value: `$${totalCost.toFixed(2)}`,              icon: DollarSign, color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Total Revenue',        value: `$${totalRevenue.toFixed(2)}`,            icon: DollarSign, color: 'text-green-600 dark:text-green-400',   bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Avg Fuel Efficiency',  value: `${avgFuelEfficiency.toFixed(2)} km/L`,  icon: Fuel,       color: 'text-teal-600 dark:text-teal-400',     bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { label: 'Fleet Utilization',    value: `${fleetUtilization}%`,                  icon: Activity,   color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Operational insights across your fleet</p>
        </div>
        <div className="flex gap-2">
          <CSVExportButton data={costData} />
          <PDFExportButton data={costData} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${k.color}`} />
                </div>
                <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">{k.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{k.value}</div>
            </div>
          )
        })}
      </div>

      <ReportsCharts costData={costData} />

      {/* Vehicle ROI Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Vehicle ROI Analysis</h2>
          <p className="text-xs text-gray-400 mt-0.5">ROI = (Revenue − Maintenance − Fuel) / Acquisition Cost × 100</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/60">
              <tr>
                {['Vehicle','Revenue','Fuel Cost','Maintenance','Total Cost','Fuel Efficiency','ROI (%)'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {costData.map(row => (
                <tr key={row.name} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{row.name}</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">${row.revenue.toFixed(2)}</td>
                  <td className="px-4 py-3 dark:text-slate-300">${row.fuel.toFixed(2)}</td>
                  <td className="px-4 py-3 dark:text-slate-300">${row.maintenance.toFixed(2)}</td>
                  <td className="px-4 py-3 font-medium dark:text-slate-300">${row.totalCost.toFixed(2)}</td>
                  <td className="px-4 py-3 dark:text-slate-300">{row.fuelEfficiency > 0 ? `${row.fuelEfficiency} km/L` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${row.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{row.roi}%</span>
                  </td>
                </tr>
              ))}
              {costData.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
