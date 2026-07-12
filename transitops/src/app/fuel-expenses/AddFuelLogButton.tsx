'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addFuelLogAction } from '@/app/actions/expenses'
import { toast } from 'sonner'
import { Vehicle } from '@prisma/client'

export function AddFuelLogButton({ vehicles }: { vehicles: Vehicle[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      vehicleId: formData.get('vehicleId') as string,
      date: new Date(formData.get('date') as string),
      volumeLiters: parseFloat(formData.get('volumeLiters') as string),
      cost: parseFloat(formData.get('cost') as string),
      odometerReading: parseInt(formData.get('odometerReading') as string, 10),
    }

    const res = await addFuelLogAction(payload)
    setLoading(false)

    if (res.success) {
      toast.success('Fuel log added')
      setOpen(false)
    } else {
      toast.error(res.error || 'Failed to add log')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="mr-2 h-4 w-4" /> Add Fuel Log
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Fuel Log</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle</Label>
              <select 
                id="vehicleId" 
                name="vehicleId" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volumeLiters">Volume (Liters)</Label>
              <Input id="volumeLiters" name="volumeLiters" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Total Cost ($)</Label>
              <Input id="cost" name="cost" type="number" step="0.01" required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="odometerReading">Odometer Reading (km)</Label>
              <Input id="odometerReading" name="odometerReading" type="number" required />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Log'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
