import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { VehicleStatus } from '@prisma/client'
import { AddMaintenanceButton } from './AddMaintenanceButton'
import { MaintenanceActions } from './MaintenanceActions'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 10

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  const [logs, total, availableVehicles] = await Promise.all([
    prisma.maintenanceLog.findMany({
      include: { vehicle: true },
      orderBy: { startDate: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.maintenanceLog.count(),
    prisma.vehicle.findMany({
      where: { status: { notIn: [VehicleStatus.RETIRED, VehicleStatus.IN_SHOP] } },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{total} records</p>
        </div>
        <AddMaintenanceButton vehicles={availableVehicles} />
      </div>

      <Suspense fallback={<TableSkeleton rows={PAGE_SIZE} cols={7} />}>
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-slate-800/60">
                {['Vehicle','Description','Cost','Start Date','End Date','Status','Actions'].map(h => (
                  <TableHead key={h} className="dark:text-slate-300">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 dark:border-slate-800">
                  <TableCell className="font-semibold text-gray-900 dark:text-white">{log.vehicle.registrationNumber}</TableCell>
                  <TableCell className="dark:text-slate-300">{log.description}</TableCell>
                  <TableCell className="dark:text-slate-300">${log.cost.toFixed(2)}</TableCell>
                  <TableCell className="dark:text-slate-300">{new Date(log.startDate).toLocaleDateString()}</TableCell>
                  <TableCell className="dark:text-slate-400">{log.endDate ? new Date(log.endDate).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'OPEN' ? 'destructive' : 'outline'} className={log.status === 'CLOSED' ? 'dark:border-slate-600 dark:text-slate-400' : ''}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell><MaintenanceActions logId={log.id} status={log.status} /></TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-gray-400 dark:text-slate-500 py-10">No maintenance records found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} />
        </div>
      </Suspense>
    </div>
  )
}
