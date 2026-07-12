import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TripStatus } from '@prisma/client'
import { AddTripButton } from './AddTripButton'
import { TripActions } from './TripActions'

import { getEligibleVehicles } from '@/services/vehicleService'
import { getEligibleDrivers } from '@/services/driverService'

const statusColors: Record<string, string> = {
  [TripStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [TripStatus.DISPATCHED]: 'bg-blue-100 text-blue-800',
  [TripStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [TripStatus.CANCELLED]: 'bg-red-100 text-red-800',
}

export default async function TripsPage() {
  const [trips, eligibleVehicles, eligibleDrivers] = await Promise.all([
    prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    getEligibleVehicles(),
    getEligibleDrivers()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Trips</h1>
        <AddTripButton vehicles={eligibleVehicles} drivers={eligibleDrivers} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trip Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">
                    {trip.source} → {trip.destination}
                  </TableCell>
                  <TableCell>{trip.vehicle.registrationNumber}</TableCell>
                  <TableCell>{trip.driver.name}</TableCell>
                  <TableCell>{new Date(trip.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[trip.status] || ''}>
                      {trip.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TripActions tripId={trip.id} status={trip.status} />
                  </TableCell>
                </TableRow>
              ))}
              {trips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No trips found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
