'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function LicenseCheckButton() {
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cron/license-check')
      const data = await res.json()
      if (data.success) {
        toast.success(
          data.emailsSent > 0
            ? `${data.emailsSent} reminder email${data.emailsSent > 1 ? 's' : ''} sent`
            : data.message ?? 'No expiring licenses found'
        )
      } else {
        toast.error(data.error || 'License check failed')
      }
    } catch {
      toast.error('Failed to run license check')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleCheck} disabled={loading}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
      Check License Expiry
    </Button>
  )
}
