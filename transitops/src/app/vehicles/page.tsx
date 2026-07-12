import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AddVehicleButton } from './AddVehicleButton'
import { VehicleActions } from './VehicleActions'
import { VehicleFilters } from './VehicleFilters'
import { VehicleStatus, VehicleType } from '@prisma/client'

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  ON_TRIP:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  IN_SHOP:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  RETIRED:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; region?: string; search?: string; sort?: string }>
}) {
  const params = await searchParams
  const sort = params.sort ?? 'createdAt'
  const validSorts = ['registrationNumber', 'name', 'type', 'status', 'odometerKm', 'createdAt']
  const orderBy = validSorts.includes(sort) ? { [sort]: 'asc' as const } : { createdAt: 'desc' as const }

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(params.type && { type: params.type as VehicleType }),
      ...(params.status && { status: params.status as VehicleStatus }),
      ...(params.region && { region: params.region }),
      ...(params.search && {
        OR: [
          { registrationNumber: { contains: params.search, mode: 'insensitive' } },
          { name: { contains: params.search, mode: 'insensitive' } },
          { region: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy,
  })
  const regions = await prisma.vehicle.findMany({ select: { region: true }, distinct: ['region'] })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Registry</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{vehicles.length} vehicles found</p>
        </div>
        <AddVehicleButton />
      </div>

      <VehicleFilters regions={regions.map(r => r.region)} currentType={params.type} currentStatus={params.status} currentRegion={params.region} currentSearch={params.search} currentSort={params.sort} />

      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-slate-800/60">
              <TableHead className="dark:text-slate-300">Reg. No.</TableHead>
              <TableHead className="dark:text-slate-300">Name / Model</TableHead>
              <TableHead className="dark:text-slate-300">Type</TableHead>
              <TableHead className="dark:text-slate-300">Max Load (kg)</TableHead>
              <TableHead className="dark:text-slate-300">Odometer</TableHead>
              <TableHead className="dark:text-slate-300">Acq. Cost</TableHead>
              <TableHead className="dark:text-slate-300">Region</TableHead>
              <TableHead className="dark:text-slate-300">Status</TableHead>
              <TableHead className="dark:text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 dark:border-slate-800">
                <TableCell className="font-semibold text-gray-900 dark:text-white">{v.registrationNumber}</TableCell>
                <TableCell className="dark:text-slate-300">{v.name}</TableCell>
                <TableCell><span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{v.type.replace('_', ' ')}</span></TableCell>
                <TableCell className="dark:text-slate-300">{v.maxLoadCapacityKg.toLocaleString()}</TableCell>
                <TableCell className="dark:text-slate-300">{v.odometerKm.toLocaleString()} km</TableCell>
                <TableCell className="dark:text-slate-300">${v.acquisitionCost.toLocaleString()}</TableCell>
                <TableCell className="dark:text-slate-300">{v.region}</TableCell>
                <TableCell><Badge variant="outline" className={statusColors[v.status]}>{v.status.replace('_', ' ')}</Badge></TableCell>
                <TableCell><VehicleActions vehicle={v} /></TableCell>
              </TableRow>
            ))}
            {vehicles.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-gray-400 dark:text-slate-500 py-10">No vehicles found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
