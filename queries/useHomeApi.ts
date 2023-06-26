'use client'

import routes from '@/api/constants'
import { useInfiniteQuery } from '@tanstack/react-query'

const fetchItems = async ({ cursor }: { cursor: number }) => {
  return (await fetch(`/${routes.home.path}`, {
    headers: routes.home.headers,
    method: routes.home.method,
    body: JSON.stringify({ cursor }),
  }).then((res) => res.json())) as (typeof routes)['home']['body']
}

export default function useHomeApi() {
  const results = useInfiniteQuery({
    queryFn: (v) => fetchItems({ cursor: Number(v.pageParam) || 0 }),
    queryKey: [routes.home.path],
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  })

  return { ...results }
}
