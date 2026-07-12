'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { Suspense } from 'react'

function PaginationInner({
  page, total, pageSize, pageParam = 'page',
}: {
  page: number; total: number; pageSize: number; pageParam?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  if (totalPages <= 1) return null

  const go = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(pageParam, String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-gray-100 dark:border-slate-800">
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
        <span className="ml-2 text-gray-400">({total} total)</span>
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={() => go(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(page + 1)} disabled={page >= totalPages}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function Pagination(props: { page: number; total: number; pageSize: number; pageParam?: string }) {
  return (
    <Suspense fallback={null}>
      <PaginationInner {...props} />
    </Suspense>
  )
}
