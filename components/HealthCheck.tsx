'use client'

import { cn } from '@/lib/utils'
import useHealthCheckApi from '@/queries/useHealthCheckApi'

export default function HealthCheck() {
  const { data } = useHealthCheckApi()
  return (
    <div className="absolute right-8 top-4 flex max-w-max items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-sm dark:border-white/50 dark:bg-white/10">
      API Health{' '}
      <div
        className={cn(
          'h-2 w-2 animate-pulse rounded-full bg-gray-500',
          data?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
        )}
      />
    </div>
  )
}
