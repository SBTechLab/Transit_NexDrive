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
import { openMaintenanceAction } from '@/app/actions/maintenance'
import { toast } from 'sonner'
import { Vehicle } from '@prisma/client'

export function AddMaintenanceButton({ vehicles }: { vehicles: Vehicle[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const vehicleId = formData.get('vehicleId') as string
    const description = formData.get('description') as string
    const cost = parseFloat(formData.get('cost') as string)

    const res = await openMaintenanceAction(vehicleId, description, cost)
    setLoading(false)

    if (res.success) {
      toast.success('Maintenance record created')
      setOpen(false)
    } else {
      toast.error(res.error || 'Failed to create record')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Log Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log New Maintenance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
            <Label htmlFor="description">Description of Work</Label>
            <Input id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Estimated/Actual Cost ($)</Label>
            <Input id="cost" name="cost" type="number" step="0.01" required />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Log Maintenance'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
