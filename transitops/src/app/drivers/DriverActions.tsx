'use client'

import { useState } from 'react'
import { Driver, DriverStatus } from '@prisma/client'
import { updateDriverAction } from '@/app/actions/driver'
import { toast } from 'sonner'
import { Pencil, ShieldOff, ShieldCheck } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function DriverActions({ driver }: { driver: Driver }) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await updateDriverAction(driver.id, {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      licenseCategory: fd.get('licenseCategory') as string,
      licenseExpiryDate: new Date(fd.get('licenseExpiryDate') as string),
      contactNumber: fd.get('contactNumber') as string,
      safetyScore: parseFloat(fd.get('safetyScore') as string),
    })
    setLoading(false)
    if (res.success) { toast.success('Driver updated'); setEditOpen(false) }
    else toast.error(res.error)
  }

  const handleToggleSuspend = async () => {
    const isSuspended = driver.status === DriverStatus.SUSPENDED
    const msg = isSuspended ? `Reinstate ${driver.name}?` : `Suspend ${driver.name}?`
    if (!confirm(msg)) return
    const res = await updateDriverAction(driver.id, {
      status: isSuspended ? DriverStatus.AVAILABLE : DriverStatus.SUSPENDED,
    })
    if (res.success) toast.success(isSuspended ? 'Driver reinstated' : 'Driver suspended')
    else toast.error(res.error)
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setEditOpen(true)} className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Edit">
          <Pencil className="h-3.5 w-3.5 text-blue-600" />
        </button>
        <button onClick={handleToggleSuspend} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${driver.status === DriverStatus.SUSPENDED ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`} title={driver.status === DriverStatus.SUSPENDED ? 'Reinstate' : 'Suspend'}>
          {driver.status === DriverStatus.SUSPENDED
            ? <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
            : <ShieldOff className="h-3.5 w-3.5 text-red-500" />}
        </button>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Driver — {driver.name}</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input name="name" defaultValue={driver.name} required />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input name="email" type="email" defaultValue={driver.email} required />
              </div>
              <div className="space-y-1.5">
                <Label>License Category</Label>
                <Input name="licenseCategory" defaultValue={driver.licenseCategory} required />
              </div>
              <div className="space-y-1.5">
                <Label>License Expiry</Label>
                <Input name="licenseExpiryDate" type="date" defaultValue={new Date(driver.licenseExpiryDate).toISOString().split('T')[0]} required />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Number</Label>
                <Input name="contactNumber" defaultValue={driver.contactNumber} required />
              </div>
              <div className="space-y-1.5">
                <Label>Safety Score (0–100)</Label>
                <Input name="safetyScore" type="number" min="0" max="100" defaultValue={driver.safetyScore} required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
