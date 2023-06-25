'use client'

import routes from '@/api/constants'
import { useQuery } from '@tanstack/react-query'

export default function useHealthCheckApi() {
  const { data } = useQuery({
    queryFn: async () => {
      return (await fetch(`/${routes.healthCheck.path}`).then((res) =>
        res.json()
      )) as (typeof routes)['healthCheck']['body']
    },
    queryKey: [routes.healthCheck.path],
    // 30 seconds in miliseconds
    staleTime: 1000 * 30,
  })

  return data
}
