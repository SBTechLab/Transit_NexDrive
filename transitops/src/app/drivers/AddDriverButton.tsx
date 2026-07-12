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
import { createDriverAction } from '@/app/actions/driver'
import { toast } from 'sonner'
import { DriverStatus } from '@prisma/client'

export function AddDriverButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      licenseExpiryDate: new Date(formData.get('licenseExpiryDate') as string),
      experienceYears: parseInt(formData.get('experienceYears') as string, 10),
      status: DriverStatus.AVAILABLE,
    }

    const res = await createDriverAction(payload)
    setLoading(false)

    if (res.success) {
      toast.success('Driver added successfully')
      setOpen(false)
    } else {
      toast.error(res.error || 'Failed to add driver')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input id="licenseNumber" name="licenseNumber" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseExpiryDate">License Expiry</Label>
              <Input id="licenseExpiryDate" name="licenseExpiryDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceYears">Experience (Years)</Label>
              <Input id="experienceYears" name="experienceYears" type="number" required />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Driver'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
