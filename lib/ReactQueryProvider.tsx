'use client'

import { useState, type PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function ReactQueryProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [client] = useState(
    new QueryClient({
      // 24 hours in milliseconds
      defaultOptions: { queries: { staleTime: 1000 * 60 * 60 * 24 } },
    })
  )
  return (
    // Provide the client to your App
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
