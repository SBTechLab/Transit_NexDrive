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
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      licenseCategory: formData.get('licenseCategory') as string,
      licenseExpiryDate: new Date(formData.get('licenseExpiryDate') as string),
      contactNumber: formData.get('contactNumber') as string,
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input id="licenseNumber" name="licenseNumber" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseCategory">License Category</Label>
              <Input id="licenseCategory" name="licenseCategory" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseExpiryDate">License Expiry</Label>
              <Input id="licenseExpiryDate" name="licenseExpiryDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" name="contactNumber" required />
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
