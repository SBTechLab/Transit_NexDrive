import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AddDriverButton } from './AddDriverButton'
import { DriverActions } from './DriverActions'
import { DriverFilters } from './DriverFilters'
import { DriverStatus } from '@prisma/client'

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  ON_TRIP:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  OFF_DUTY:  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  SUSPENDED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; sort?: string }>
}) {
  const params = await searchParams
  const sort = params.sort ?? 'createdAt'
  const validSorts = ['name', 'safetyScore', 'licenseExpiryDate', 'status', 'createdAt']
  const orderBy = validSorts.includes(sort) ? { [sort]: sort === 'safetyScore' ? 'desc' as const : 'asc' as const } : { createdAt: 'desc' as const }

  const drivers = await prisma.driver.findMany({
    where: {
      ...(params.status && { status: params.status as DriverStatus }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
          { licenseNumber: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{drivers.length} drivers registered</p>
        </div>
        <AddDriverButton />
      </div>

      <DriverFilters currentStatus={params.status} currentSearch={params.search} currentSort={params.sort} />

      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-slate-800/60">
              {['Name','Email','License No.','Category','License Expiry','Contact','Safety Score','Status','Actions'].map(h => (
                <TableHead key={h} className="dark:text-slate-300">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => {
              const expired = new Date(driver.licenseExpiryDate) < new Date()
              return (
                <TableRow key={driver.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 dark:border-slate-800">
                  <TableCell className="font-semibold text-gray-900 dark:text-white">{driver.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-slate-400">{driver.email}</TableCell>
                  <TableCell className="dark:text-slate-300">{driver.licenseNumber}</TableCell>
                  <TableCell><span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{driver.licenseCategory}</span></TableCell>
                  <TableCell>
                    <span className={expired ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-700 dark:text-slate-300'}>
                      {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                      {expired && <span className="ml-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">Expired</span>}
                    </span>
                  </TableCell>
                  <TableCell className="dark:text-slate-300">{driver.contactNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                        <div className={`h-full rounded-full ${driver.safetyScore >= 80 ? 'bg-green-500' : driver.safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${driver.safetyScore}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{driver.safetyScore}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[driver.status]}>{driver.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell><DriverActions driver={driver} /></TableCell>
                </TableRow>
              )
            })}
            {drivers.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-gray-400 dark:text-slate-500 py-10">No drivers found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
