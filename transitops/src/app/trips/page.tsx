import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { TripStatus } from '@prisma/client'
import { AddTripButton } from './AddTripButton'
import { TripActions } from './TripActions'
import { TripFilters } from './TripFilters'
import { getEligibleVehicles } from '@/services/vehicleService'
import { getEligibleDrivers } from '@/services/driverService'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 10

const statusColors: Record<string, string> = {
  DRAFT:      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  DISPATCHED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; sort?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const sort = params.sort ?? 'createdAt'
  const validSorts = ['source', 'destination', 'status', 'createdAt', 'cargoWeightKg']
  const orderBy = validSorts.includes(sort) ? { [sort]: 'desc' as const } : { createdAt: 'desc' as const }

  const where = {
    ...(params.status && { status: params.status as TripStatus }),
    ...(params.search && {
      OR: [
        { source: { contains: params.search, mode: 'insensitive' as const } },
        { destination: { contains: params.search, mode: 'insensitive' as const } },
        { driver: { name: { contains: params.search, mode: 'insensitive' as const } } },
        { vehicle: { registrationNumber: { contains: params.search, mode: 'insensitive' as const } } },
      ],
    }),
  }

  const [trips, total, eligibleVehicles, eligibleDrivers] = await Promise.all([
    prisma.trip.findMany({
      where,
      include: { vehicle: true, driver: true },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.trip.count({ where }),
    getEligibleVehicles(),
    getEligibleDrivers(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{total} trips found</p>
        </div>
        <AddTripButton vehicles={eligibleVehicles} drivers={eligibleDrivers} />
      </div>

      <TripFilters currentStatus={params.status} currentSearch={params.search} currentSort={params.sort} />

      <Suspense fallback={<TableSkeleton rows={PAGE_SIZE} cols={8} />}>
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-slate-800/60">
                {['Route','Vehicle','Driver','Cargo (kg)','Planned Dist.','Created','Status','Actions'].map(h => (
                  <TableHead key={h} className="dark:text-slate-300">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 dark:border-slate-800">
                  <TableCell className="font-semibold text-gray-900 dark:text-white">{trip.source} → {trip.destination}</TableCell>
                  <TableCell className="dark:text-slate-300">{trip.vehicle.registrationNumber}</TableCell>
                  <TableCell className="dark:text-slate-300">{trip.driver.name}</TableCell>
                  <TableCell className="dark:text-slate-300">{trip.cargoWeightKg} kg</TableCell>
                  <TableCell className="dark:text-slate-300">{trip.plannedDistanceKm} km</TableCell>
                  <TableCell className="dark:text-slate-400 text-xs">{new Date(trip.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[trip.status]}>{trip.status}</Badge></TableCell>
                  <TableCell><TripActions tripId={trip.id} status={trip.status} /></TableCell>
                </TableRow>
              ))}
              {trips.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-gray-400 dark:text-slate-500 py-10">No trips found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} />
        </div>
      </Suspense>
    </div>
  )
}
