import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MaintenanceStatus, VehicleStatus } from '@prisma/client'
import { AddMaintenanceButton } from './AddMaintenanceButton'
import { MaintenanceActions } from './MaintenanceActions'

export default async function MaintenancePage() {
  const [logs, availableVehicles] = await Promise.all([
    prisma.maintenanceLog.findMany({
      include: {
        vehicle: true,
      },
      orderBy: { startDate: 'desc' }
    }),
    prisma.vehicle.findMany({
      where: {
        status: {
          notIn: [VehicleStatus.RETIRED, VehicleStatus.IN_SHOP]
        }
      }
    })
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
        <AddMaintenanceButton vehicles={availableVehicles} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Cost ($)</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.vehicle.registrationNumber}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>${log.cost.toFixed(2)}</TableCell>
                  <TableCell>{new Date(log.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'OPEN' ? 'destructive' : 'outline'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <MaintenanceActions logId={log.id} status={log.status} />
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No maintenance records found.
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
