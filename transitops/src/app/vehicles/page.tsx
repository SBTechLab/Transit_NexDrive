import { getVehicles } from '@/services/vehicleService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AddVehicleButton } from './AddVehicleButton'
import { VehicleStatus } from '@prisma/client'

const statusColors: Record<string, string> = {
  [VehicleStatus.AVAILABLE]: 'bg-green-100 text-green-800',
  [VehicleStatus.ON_TRIP]: 'bg-blue-100 text-blue-800',
  [VehicleStatus.IN_SHOP]: 'bg-yellow-100 text-yellow-800',
  [VehicleStatus.RETIRED]: 'bg-gray-100 text-gray-800',
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <AddVehicleButton />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fleet Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity (kg)</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.maxLoadCapacityKg}</TableCell>
                  <TableCell>{vehicle.odometerKm} km</TableCell>
                  <TableCell>{vehicle.region}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[vehicle.status] || ''}>
                      {vehicle.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {vehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    No vehicles found.
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
