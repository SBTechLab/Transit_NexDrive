import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AddVehicleButton } from './AddVehicleButton'
import { VehicleActions } from './VehicleActions'
import { VehicleFilters } from './VehicleFilters'
import { VehicleStatus, VehicleType } from '@prisma/client'

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ON_TRIP: 'bg-blue-100 text-blue-800',
  IN_SHOP: 'bg-yellow-100 text-yellow-800',
  RETIRED: 'bg-gray-100 text-gray-600',
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; region?: string }>
}) {
  const params = await searchParams
  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(params.type && { type: params.type as VehicleType }),
      ...(params.status && { status: params.status as VehicleStatus }),
      ...(params.region && { region: params.region }),
    },
    orderBy: { createdAt: 'desc' },
  })
  const regions = await prisma.vehicle.findMany({ select: { region: true }, distinct: ['region'] })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Registry</h1>
          <p className="text-sm text-gray-500 mt-0.5">{vehicles.length} vehicles found</p>
        </div>
        <AddVehicleButton />
      </div>

      <VehicleFilters regions={regions.map(r => r.region)} currentType={params.type} currentStatus={params.status} currentRegion={params.region} />

      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Reg. No.</TableHead>
              <TableHead>Name / Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Max Load (kg)</TableHead>
              <TableHead>Odometer</TableHead>
              <TableHead>Acq. Cost</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id} className="hover:bg-gray-50">
                <TableCell className="font-semibold text-gray-900">{v.registrationNumber}</TableCell>
                <TableCell>{v.name}</TableCell>
                <TableCell><span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{v.type.replace('_', ' ')}</span></TableCell>
                <TableCell>{v.maxLoadCapacityKg.toLocaleString()}</TableCell>
                <TableCell>{v.odometerKm.toLocaleString()} km</TableCell>
                <TableCell>${v.acquisitionCost.toLocaleString()}</TableCell>
                <TableCell>{v.region}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[v.status]}>{v.status.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <VehicleActions vehicle={v} />
                </TableCell>
              </TableRow>
            ))}
            {vehicles.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-gray-400 py-10">No vehicles found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
