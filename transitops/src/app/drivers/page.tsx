import { getDrivers } from '@/services/driverService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AddDriverButton } from './AddDriverButton'
import { DriverStatus } from '@prisma/client'

const statusColors: Record<string, string> = {
  [DriverStatus.AVAILABLE]: 'bg-green-100 text-green-800',
  [DriverStatus.ON_TRIP]: 'bg-blue-100 text-blue-800',
  [DriverStatus.OFF_DUTY]: 'bg-gray-100 text-gray-800',
  [DriverStatus.SUSPENDED]: 'bg-red-100 text-red-800',
}

export default async function DriversPage() {
  const drivers = await getDrivers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
        <AddDriverButton />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Driver Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>License No.</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>License Expiry</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.licenseCategory}</TableCell>
                  <TableCell>
                    <span className={new Date(driver.licenseExpiryDate) < new Date() ? "text-destructive font-bold" : ""}>
                      {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>{driver.contactNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[driver.status] || ''}>
                      {driver.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {drivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    No drivers found.
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
