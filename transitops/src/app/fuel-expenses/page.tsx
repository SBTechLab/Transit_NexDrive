import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pagination } from '@/components/ui/pagination'
import { AddFuelLogButton } from './AddFuelLogButton'
import { AddExpenseButton } from './AddExpenseButton'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 10

export default async function FuelExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ fuelPage?: string; expensePage?: string }>
}) {
  const params = await searchParams
  const fuelPage = Math.max(1, parseInt(params.fuelPage ?? '1', 10))
  const expensePage = Math.max(1, parseInt(params.expensePage ?? '1', 10))

  const [fuelLogs, fuelTotal, expenses, expenseTotal, vehicles] = await Promise.all([
    prisma.fuelLog.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' },
      skip: (fuelPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.fuelLog.count(),
    prisma.expense.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' },
      skip: (expensePage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.expense.count(),
    prisma.vehicle.findMany(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fuel & Expenses</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{fuelTotal} fuel logs · {expenseTotal} expenses</p>
        </div>
        <div className="flex space-x-2">
          <AddFuelLogButton vehicles={vehicles} />
          <AddExpenseButton vehicles={vehicles} />
        </div>
      </div>

      <Tabs defaultValue="fuel" className="w-full">
        <TabsList>
          <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
          <TabsTrigger value="expenses">Other Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="fuel">
          <Suspense fallback={<TableSkeleton rows={PAGE_SIZE} cols={4} />}>
            <Card>
              <CardHeader>
                <CardTitle>Fuel Log History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Volume (L)</TableHead>
                      <TableHead>Cost ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                        <TableCell>{log.vehicle.registrationNumber}</TableCell>
                        <TableCell>{log.liters.toFixed(2)}</TableCell>
                        <TableCell>${log.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {fuelLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">No fuel logs found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="px-4">
                  <Pagination page={fuelPage} total={fuelTotal} pageSize={PAGE_SIZE} pageParam="fuelPage" />
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </TabsContent>

        <TabsContent value="expenses">
          <Suspense fallback={<TableSkeleton rows={PAGE_SIZE} cols={5} />}>
            <Card>
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Amount ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>{expense.vehicle.registrationNumber}</TableCell>
                        <TableCell>{expense.type}</TableCell>
                        <TableCell>{expense.notes}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {expenses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">No expenses found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="px-4">
                  <Pagination page={expensePage} total={expenseTotal} pageSize={PAGE_SIZE} pageParam="expensePage" />
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
