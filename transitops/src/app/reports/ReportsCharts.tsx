'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

export function ReportsCharts({ costData }: { costData: any[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Operating Costs by Vehicle</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="fuel" name="Fuel" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#f97316" />
              <Bar dataKey="other" name="Other" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Fuel Efficiency by Vehicle (km/L)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData.filter(d => d.fuelEfficiency > 0)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => `${Number(v).toFixed(2)} km/L`} />
              <Bar dataKey="fuelEfficiency" name="Fuel Efficiency" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 lg:col-span-2">
        <h2 className="font-semibold text-gray-900 mb-4">Revenue vs Operating Cost</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalCost" name="Total Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
