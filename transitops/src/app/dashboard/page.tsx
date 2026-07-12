import { prisma } from '@/lib/prisma'
import { VehicleStatus, TripStatus, DriverStatus, VehicleType } from '@prisma/client'
import { Truck, Map, Wrench, AlertTriangle, Users, CheckCircle, TrendingUp, Fuel, Clock, Activity } from 'lucide-react'
import { DashboardFilters } from './DashboardFilters'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; region?: string }>
}) {
  const params = await searchParams
  const typeFilter = params.type as VehicleType | undefined
  const statusFilter = params.status as VehicleStatus | undefined
  const regionFilter = params.region

  const vehicleWhere = {
    ...(typeFilter && { type: typeFilter }),
    ...(statusFilter && { status: statusFilter }),
    ...(regionFilter && { region: regionFilter }),
  }

  const [
    totalVehicles,
    activeVehicles,
    availableVehicles,
    vehiclesInShop,
    retiredVehicles,
    activeTrips,
    pendingTrips,
    completedTrips,
    totalDrivers,
    driversOnDuty,
    pendingMaintenance,
    recentTrips,
    totalRevenue,
    regions,
  ] = await Promise.all([
    prisma.vehicle.count({ where: vehicleWhere }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.ON_TRIP } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.AVAILABLE } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.IN_SHOP } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.RETIRED } }),
    prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
    prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
    prisma.trip.count({ where: { status: TripStatus.COMPLETED } }),
    prisma.driver.count(),
    prisma.driver.count({ where: { status: DriverStatus.ON_TRIP } }),
    prisma.maintenanceLog.count({ where: { status: 'OPEN' } }),
    prisma.trip.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { driver: { select: { name: true } }, vehicle: { select: { registrationNumber: true } } },
    }),
    prisma.trip.aggregate({ _sum: { revenue: true }, where: { status: TripStatus.COMPLETED } }),
    prisma.vehicle.findMany({ select: { region: true }, distinct: ['region'] }),
  ])

  const operationalVehicles = totalVehicles - retiredVehicles
  const fleetUtilization = operationalVehicles > 0 ? Math.round((activeVehicles / operationalVehicles) * 100) : 0

  const stats = [
    { label: 'Active Vehicles', value: activeVehicles, sub: 'Currently on trip', icon: Truck, gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Available Vehicles', value: availableVehicles, sub: `${totalVehicles} total fleet`, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'In Maintenance', value: vehiclesInShop, sub: `${pendingMaintenance} open issues`, icon: Wrench, gradient: 'from-orange-500 to-orange-700', bg: 'bg-orange-50', text: 'text-orange-600' },
    { label: 'Active Trips', value: activeTrips, sub: 'Dispatched & running', icon: Map, gradient: 'from-violet-500 to-violet-700', bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'Pending Trips', value: pendingTrips, sub: 'Draft — awaiting dispatch', icon: Clock, gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-600' },
    { label: 'Drivers On Duty', value: driversOnDuty, sub: `${totalDrivers} total drivers`, icon: Users, gradient: 'from-pink-500 to-pink-700', bg: 'bg-pink-50', text: 'text-pink-600' },
    { label: 'Fleet Utilization', value: `${fleetUtilization}%`, sub: 'Active / Operational', icon: Activity, gradient: fleetUtilization >= 70 ? 'from-green-500 to-green-700' : 'from-red-500 to-red-700', bg: fleetUtilization >= 70 ? 'bg-green-50' : 'bg-red-50', text: fleetUtilization >= 70 ? 'text-green-600' : 'text-red-600' },
    { label: 'Total Revenue', value: `$${(totalRevenue._sum.revenue ?? 0).toLocaleString()}`, sub: 'From completed trips', icon: TrendingUp, gradient: 'from-teal-500 to-teal-700', bg: 'bg-teal-50', text: 'text-teal-600' },
  ]

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-700',
    DISPATCHED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 40%)' }} />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Truck className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Fleet Overview</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">TransitOps Dashboard</h1>
            <p className="mt-2 text-slate-400 text-sm">Real-time fleet management at a glance</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{completedTrips}</div>
              <div className="text-xs text-slate-400">Completed Trips</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{fleetUtilization}%</div>
              <div className="text-xs text-slate-400">Fleet Utilization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <DashboardFilters regions={regions.map(r => r.region)} currentType={typeFilter} currentStatus={statusFilter} currentRegion={regionFilter} />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`absolute top-0 right-0 h-20 w-20 rounded-full -translate-y-6 translate-x-6 bg-gradient-to-br ${s.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${s.text}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.sub}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-0.5">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
                <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${s.gradient} opacity-50`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trips */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900">Recent Trips</h2>
            </div>
            <a href="/trips" className="text-xs text-blue-600 hover:underline font-medium">View all →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTrips.length === 0 && <div className="px-6 py-8 text-center text-gray-400 text-sm">No trips yet</div>}
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Map className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{trip.source} → {trip.destination}</p>
                  <p className="text-xs text-gray-400">{trip.driver?.name} · {trip.vehicle?.registrationNumber}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[trip.status] ?? 'bg-gray-100 text-gray-600'}`}>{trip.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <Fuel className="h-5 w-5 text-emerald-500" />
            <h2 className="font-semibold text-gray-900">Fleet Breakdown</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Available', value: availableVehicles, total: totalVehicles, color: 'bg-emerald-500' },
              { label: 'On Trip', value: activeVehicles, total: totalVehicles, color: 'bg-blue-500' },
              { label: 'In Shop', value: vehiclesInShop, total: totalVehicles, color: 'bg-orange-500' },
              { label: 'Retired', value: retiredVehicles, total: totalVehicles, color: 'bg-gray-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="font-bold text-gray-900">{item.value} <span className="text-gray-400 font-normal">/ {item.total}</span></span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Utilization Rate</div>
                  <div className="text-2xl font-bold text-gray-900">{fleetUtilization}%</div>
                </div>
                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-sm font-bold ${fleetUtilization >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {fleetUtilization >= 70 ? '✓' : '!'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
