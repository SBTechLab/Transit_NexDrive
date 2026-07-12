'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export function ReportsCharts({ costData }: { costData: any[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Operating Costs by Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={costData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="fuel" name="Fuel Cost" stackId="a" fill="#3b82f6" />
              <Bar dataKey="maintenance" name="Maintenance Cost" stackId="a" fill="#ef4444" />
              <Bar dataKey="other" name="Other Expenses" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
