'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function DashboardAutoRefresh() {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 30_000)
    return () => clearInterval(id)
  }, [router])

  return null
}
