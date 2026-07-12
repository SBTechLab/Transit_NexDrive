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
import { createVehicleAction } from '@/app/actions/vehicle'
import { toast } from 'sonner'
import { VehicleType, VehicleStatus } from '@prisma/client'

export function AddVehicleButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      registrationNumber: formData.get('registrationNumber') as string,
      name: formData.get('name') as string,
      type: formData.get('type') as VehicleType,
      maxLoadCapacityKg: parseFloat(formData.get('maxLoadCapacityKg') as string),
      acquisitionCost: parseFloat(formData.get('acquisitionCost') as string),
      region: formData.get('region') as string,
      status: VehicleStatus.AVAILABLE,
    }

    const res = await createVehicleAction(payload)
    setLoading(false)

    if (res.success) {
      toast.success('Vehicle added successfully')
      setOpen(false)
    } else {
      toast.error(res.error || 'Failed to add vehicle')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration No.</Label>
              <Input id="registrationNumber" name="registrationNumber" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <select 
                id="type" 
                name="type" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="BUS">Bus</option>
                <option value="TRUCK">Truck</option>
                <option value="VAN">Van</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoadCapacityKg">Max Load Capacity (Kg)</Label>
              <Input id="maxLoadCapacityKg" name="maxLoadCapacityKg" type="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
              <Input id="acquisitionCost" name="acquisitionCost" type="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input id="region" name="region" required />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Vehicle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
