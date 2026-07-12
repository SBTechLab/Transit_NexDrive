import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddFuelLogButton } from './AddFuelLogButton'
import { AddExpenseButton } from './AddExpenseButton'

export default async function FuelExpensesPage() {
  const [fuelLogs, expenses, vehicles] = await Promise.all([
    prisma.fuelLog.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' }
    }),
    prisma.expense.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' }
    }),
    prisma.vehicle.findMany()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fuel & Expenses</h1>
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
          <Card>
            <CardHeader>
              <CardTitle>Fuel Log History</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                        No fuel logs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense History</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                        No expenses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
