import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReportsCharts } from './ReportsCharts'

export default async function ReportsPage() {
  const [fuelLogs, expenses, maintenanceLogs] = await Promise.all([
    prisma.fuelLog.findMany({ include: { vehicle: true } }),
    prisma.expense.findMany({ include: { vehicle: true } }),
    prisma.maintenanceLog.findMany({ include: { vehicle: true } }),
  ])

  // Aggregate costs by vehicle
  const costDataMap = new Map<string, { name: string, fuel: number, maintenance: number, other: number }>()

  const getOrInit = (regNo: string) => {
    if (!costDataMap.has(regNo)) {
      costDataMap.set(regNo, { name: regNo, fuel: 0, maintenance: 0, other: 0 })
    }
    return costDataMap.get(regNo)!
  }

  fuelLogs.forEach(log => {
    getOrInit(log.vehicle.registrationNumber).fuel += log.cost
  })

  maintenanceLogs.forEach(log => {
    getOrInit(log.vehicle.registrationNumber).maintenance += log.cost
  })

  expenses.forEach(exp => {
    getOrInit(exp.vehicle.registrationNumber).other += exp.amount
  })

  const costData = Array.from(costDataMap.values())

  const totalFuel = costData.reduce((acc, curr) => acc + curr.fuel, 0)
  const totalMaintenance = costData.reduce((acc, curr) => acc + curr.maintenance, 0)
  const totalOther = costData.reduce((acc, curr) => acc + curr.other, 0)
  
  const totalCost = totalFuel + totalMaintenance + totalOther

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFuel.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Maintenance Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMaintenance.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operating Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <ReportsCharts costData={costData} />
    </div>
  )
}
