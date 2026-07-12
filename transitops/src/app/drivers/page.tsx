import { getDrivers } from '@/services/driverService'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AddDriverButton } from './AddDriverButton'
import { DriverActions } from './DriverActions'
import { DriverStatus } from '@prisma/client'

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ON_TRIP: 'bg-blue-100 text-blue-800',
  OFF_DUTY: 'bg-gray-100 text-gray-700',
  SUSPENDED: 'bg-red-100 text-red-800',
}

export default async function DriversPage() {
  const drivers = await getDrivers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{drivers.length} drivers registered</p>
        </div>
        <AddDriverButton />
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>License No.</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Safety Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => {
              const expired = new Date(driver.licenseExpiryDate) < new Date()
              return (
                <TableRow key={driver.id} className="hover:bg-gray-50">
                  <TableCell className="font-semibold text-gray-900">{driver.name}</TableCell>
                  <TableCell className="text-gray-600">{driver.email}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell><span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{driver.licenseCategory}</span></TableCell>
                  <TableCell>
                    <span className={expired ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                      {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                      {expired && <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Expired</span>}
                    </span>
                  </TableCell>
                  <TableCell>{driver.contactNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${driver.safetyScore >= 80 ? 'bg-green-500' : driver.safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${driver.safetyScore}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{driver.safetyScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[driver.status]}>{driver.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>
                    <DriverActions driver={driver} />
                  </TableCell>
                </TableRow>
              )
            })}
            {drivers.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-gray-400 py-10">No drivers found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
