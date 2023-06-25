'use client'

import routes from '@/api/constants'
import { useQuery } from '@tanstack/react-query'

export default function useHomeApi(
  variables: (typeof routes)['home']['variables'] = {
    cursor: 0,
  }
) {
  const { data } = useQuery({
    queryFn: async () => {
      return (await fetch(`/${routes.home.path}`, {
        headers: routes.home.headers,
        method: routes.home.method,
        body: JSON.stringify(variables),
      }).then((res) => res.json())) as (typeof routes)['home']['body']
    },
    queryKey: [routes.home.path, variables],
  })

  return data
}
