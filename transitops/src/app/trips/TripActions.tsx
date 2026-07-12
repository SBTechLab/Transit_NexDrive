'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TripStatus } from '@prisma/client'
import { dispatchTripAction, completeTripAction, cancelTripAction } from '@/app/actions/trip'
import { toast } from 'sonner'
import { Play, CheckCircle, XCircle } from 'lucide-react'

export function TripActions({ tripId, status }: { tripId: string, status: string }) {
  const [loading, setLoading] = useState(false)

  const handleDispatch = async () => {
    setLoading(true)
    const res = await dispatchTripAction(tripId)
    setLoading(false)
    if (res.success) toast.success('Trip dispatched successfully')
    else toast.error(res.error)
  }

  const handleComplete = async () => {
    // In a real app, you'd open a modal to capture actual distance and fuel
    const actualDistance = prompt('Enter actual distance (km):')
    const fuelConsumed = prompt('Enter fuel consumed (liters):')
    
    if (actualDistance && fuelConsumed) {
      setLoading(true)
      const res = await completeTripAction(tripId, parseFloat(actualDistance), parseFloat(fuelConsumed))
      setLoading(false)
      if (res.success) toast.success('Trip completed successfully')
      else toast.error(res.error)
    }
  }

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this trip?')) {
      setLoading(true)
      const res = await cancelTripAction(tripId)
      setLoading(false)
      if (res.success) toast.success('Trip cancelled')
      else toast.error(res.error)
    }
  }

  if (status === TripStatus.SCHEDULED) {
    return (
      <div className="flex space-x-2">
        <Button size="sm" onClick={handleDispatch} disabled={loading}>
          <Play className="mr-1 h-3 w-3" /> Dispatch
        </Button>
        <Button size="sm" variant="destructive" onClick={handleCancel} disabled={loading}>
          <XCircle className="mr-1 h-3 w-3" /> Cancel
        </Button>
      </div>
    )
  }

  if (status === TripStatus.IN_PROGRESS) {
    return (
      <div className="flex space-x-2">
        <Button size="sm" variant="secondary" onClick={handleComplete} disabled={loading}>
          <CheckCircle className="mr-1 h-3 w-3" /> Complete
        </Button>
        <Button size="sm" variant="destructive" onClick={handleCancel} disabled={loading}>
          <XCircle className="mr-1 h-3 w-3" /> Cancel
        </Button>
      </div>
    )
  }

  return <span className="text-sm text-muted-foreground">No actions available</span>
}
