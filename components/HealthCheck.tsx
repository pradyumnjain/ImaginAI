'use client'

import routes from '@/api/constants'
import { cn } from '@/lib/utils'
import { useQuery } from 'react-query'

export default function HealthCheck() {
  const { data } = useQuery('healthCheck', async () => {
    return (await fetch(`/${routes.healthCheck.path}`).then((res) =>
      res.json()
    )) as (typeof routes)['healthCheck']['value']
  })
  return (
    <div className="absolute right-4 top-4 flex max-w-max items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-sm dark:border-white/50 dark:bg-white/10">
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
