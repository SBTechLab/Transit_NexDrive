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
import { createTripAction } from '@/app/actions/trip'
import { toast } from 'sonner'
import { TripStatus, Vehicle, Driver } from '@prisma/client'

export function AddTripButton({ vehicles, drivers }: { vehicles: Vehicle[], drivers: Driver[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      vehicleId: formData.get('vehicleId') as string,
      driverId: formData.get('driverId') as string,
      source: formData.get('source') as string,
      destination: formData.get('destination') as string,
      cargoWeightKg: parseFloat(formData.get('cargoWeightKg') as string),
      plannedDistanceKm: parseFloat(formData.get('plannedDistanceKm') as string),
      status: TripStatus.DRAFT,
    }

    const res = await createTripAction(payload)
    setLoading(false)

    if (res.success) {
      toast.success('Trip scheduled successfully')
      setOpen(false)
    } else {
      toast.error(res.error || 'Failed to schedule trip')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Schedule Trip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule New Trip</DialogTitle>
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
                  <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverId">Driver</Label>
              <select 
                id="driverId" 
                name="driverId" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Select a driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input id="source" name="source" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" name="destination" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargoWeightKg">Cargo Weight (kg)</Label>
              <Input id="cargoWeightKg" name="cargoWeightKg" type="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedDistanceKm">Planned Distance (km)</Label>
              <Input id="plannedDistanceKm" name="plannedDistanceKm" type="number" required />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Schedule Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
