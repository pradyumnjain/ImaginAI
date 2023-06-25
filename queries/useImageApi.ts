'use client'

import routes from '@/api/constants'
import { useQuery } from '@tanstack/react-query'

export default function useImageApi(
  variables: (typeof routes)['image']['variables']
) {
  const { data } = useQuery({
    queryFn: async () => {
      if (!variables.name) return
      return (await fetch(`/${routes.image.path}`, {
        headers: routes.image.headers,
        method: routes.image.method,
        body: JSON.stringify(variables),
      }).then((res) => res.json())) as (typeof routes)['image']['body']
    },
    queryKey: [routes.image.path, variables],
  })

  return data
}
