'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TripStatus } from '@prisma/client'
import { dispatchTripAction, completeTripAction, cancelTripAction } from '@/app/actions/trip'
import { toast } from 'sonner'
import { Play, CheckCircle, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function TripActions({ tripId, status }: { tripId: string; status: string }) {
  const [loading, setLoading] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)

  const handleDispatch = async () => {
    setLoading(true)
    const res = await dispatchTripAction(tripId)
    setLoading(false)
    if (res.success) toast.success('Trip dispatched successfully')
    else toast.error(res.error)
  }

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    const res = await completeTripAction(tripId, parseFloat(fd.get('distance') as string), parseFloat(fd.get('fuel') as string))
    setLoading(false)
    if (res.success) { toast.success('Trip completed'); setCompleteOpen(false) }
    else toast.error(res.error)
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this trip?')) return
    setLoading(true)
    const res = await cancelTripAction(tripId)
    setLoading(false)
    if (res.success) toast.success('Trip cancelled')
    else toast.error(res.error)
  }

  if (status === TripStatus.COMPLETED || status === TripStatus.CANCELLED) {
    return <span className="text-xs text-gray-400 italic">—</span>
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        {status === TripStatus.DRAFT && (
          <button onClick={handleDispatch} disabled={loading} className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors">
            <Play className="h-3 w-3" /> Dispatch
          </button>
        )}
        {status === TripStatus.DISPATCHED && (
          <button onClick={() => setCompleteOpen(true)} className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium transition-colors">
            <CheckCircle className="h-3 w-3" /> Complete
          </button>
        )}
        {(status === TripStatus.DRAFT || status === TripStatus.DISPATCHED) && (
          <button onClick={handleCancel} disabled={loading} className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-colors">
            <XCircle className="h-3 w-3" /> Cancel
          </button>
        )}
      </div>

      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Complete Trip</DialogTitle></DialogHeader>
          <form onSubmit={handleComplete} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Actual Distance (km)</Label>
              <Input name="distance" type="number" step="0.1" min="0" required placeholder="e.g. 105" />
            </div>
            <div className="space-y-1.5">
              <Label>Fuel Consumed (liters)</Label>
              <Input name="fuel" type="number" step="0.1" min="0" required placeholder="e.g. 15.5" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCompleteOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Mark Complete'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
