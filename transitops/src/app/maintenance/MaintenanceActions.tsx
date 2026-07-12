'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { closeMaintenanceAction } from '@/app/actions/maintenance'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

export function MaintenanceActions({ logId, status }: { logId: string, status: string }) {
  const [loading, setLoading] = useState(false)

  const handleClose = async () => {
    if (confirm('Are you sure this maintenance is complete and the vehicle is ready?')) {
      setLoading(true)
      const res = await closeMaintenanceAction(logId)
      setLoading(false)
      if (res.success) toast.success('Maintenance closed successfully')
      else toast.error(res.error)
    }
  }

  if (status === 'OPEN') {
    return (
      <Button size="sm" variant="secondary" onClick={handleClose} disabled={loading}>
        <CheckCircle className="mr-1 h-3 w-3" /> Complete
      </Button>
    )
  }

  return <span className="text-sm text-muted-foreground">Closed</span>
}
