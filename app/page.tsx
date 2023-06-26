'use client'

import HealthCheck from '@/components/HealthCheck'
import ImageComponent from '@/components/ImageComponent'
import useHomeApi from '@/queries/useHomeApi'

export default function Home() {
  const { data } = useHomeApi()
  return (
    <main className="h-full w-full">
      <HealthCheck />
      <h1 className="my-16 py-10 text-center text-6xl font-bold">ImaginAI</h1>
      <div className="mx-auto mb-10 w-full max-w-5xl columns-3 gap-5 space-y-5 p-5 pb-10">
        {data?.url_list?.map((url) => (
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
    </main>
  )
}
