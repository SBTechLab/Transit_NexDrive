'use client'

import { useState } from 'react'
import { Vehicle, VehicleType, VehicleStatus } from '@prisma/client'
import { updateVehicleAction, retireVehicleAction } from '@/app/actions/vehicle'
import { toast } from 'sonner'
import { Pencil, Archive } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function VehicleActions({ vehicle }: { vehicle: Vehicle }) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await updateVehicleAction(vehicle.id, {
      name: fd.get('name') as string,
      type: fd.get('type') as VehicleType,
      maxLoadCapacityKg: parseFloat(fd.get('maxLoadCapacityKg') as string),
      acquisitionCost: parseFloat(fd.get('acquisitionCost') as string),
      region: fd.get('region') as string,
      odometerKm: parseFloat(fd.get('odometerKm') as string),
    })
    setLoading(false)
    if (res.success) { toast.success('Vehicle updated'); setEditOpen(false) }
    else toast.error(res.error)
  }

  const handleRetire = async () => {
    if (!confirm(`Retire ${vehicle.registrationNumber}? This cannot be undone.`)) return
    const res = await retireVehicleAction(vehicle.id)
    if (res.success) toast.success('Vehicle retired')
    else toast.error(res.error)
  }

  const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setEditOpen(true)} className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Edit">
          <Pencil className="h-3.5 w-3.5 text-blue-600" />
        </button>
        {vehicle.status !== VehicleStatus.RETIRED && (
          <button onClick={handleRetire} className="h-8 w-8 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center transition-colors" title="Retire">
            <Archive className="h-3.5 w-3.5 text-gray-500 hover:text-red-500" />
          </button>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Vehicle — {vehicle.registrationNumber}</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Vehicle Name</Label>
                <Input name="name" defaultValue={vehicle.name} required />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <select name="type" defaultValue={vehicle.type} className={selectClass} required>
                  {Object.values(VehicleType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Max Load (kg)</Label>
                <Input name="maxLoadCapacityKg" type="number" defaultValue={vehicle.maxLoadCapacityKg} required />
              </div>
              <div className="space-y-1.5">
                <Label>Odometer (km)</Label>
                <Input name="odometerKm" type="number" defaultValue={vehicle.odometerKm} required />
              </div>
              <div className="space-y-1.5">
                <Label>Acquisition Cost ($)</Label>
                <Input name="acquisitionCost" type="number" defaultValue={vehicle.acquisitionCost} required />
              </div>
              <div className="space-y-1.5">
                <Label>Region</Label>
                <Input name="region" defaultValue={vehicle.region} required />
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
