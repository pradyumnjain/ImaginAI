'use client'

import HealthCheck from '@/components/HealthCheck'
import ImageComponent from '@/components/ImageComponent'
import useHomeApi from '@/queries/useHomeApi'

export default function Home() {
  const { data, fetchNextPage } = useHomeApi()
  return (
    <main className="h-full w-full">
      <HealthCheck />
      <h1 className="my-16 py-10 text-center text-6xl font-bold">ImaginAI</h1>
      <div className="max-w-8xl mx-auto mb-10 grid w-full grid-cols-1 gap-4 p-5 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        {data?.pages
          .reduce(
            (acc, current) => acc.concat(current.url_list),
            [] as string[]
          )
          .map((url) => (
            <ImageComponent key={url} url={url} />
          ))}
        {!data &&
          Array.from({ length: 9 }).map((_, i) => (
            <div
              className="h-96 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800"
              key={i}
            />
          ))}
      </div>
      <button
        className="mx-auto my-6 flex max-w-max items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-sm dark:border-white/50 dark:bg-white/10"
        onClick={() => void fetchNextPage()}
      >
        Fetch More (in development)
      </button>
    </main>
  )
}
