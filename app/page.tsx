'use client'

import HealthCheck from '@/components/HealthCheck'
import ImageComponent from '@/components/ImageComponent'
import useHomeApi from '@/queries/useHomeApi'

export default function Home() {
  const data = useHomeApi()
  return (
    <main className="h-full w-full">
      <HealthCheck />
      <div className="mx-auto mb-10 w-full max-w-5xl columns-3 gap-5 space-y-5 p-5 pb-10">
        <h1 className="py-10 text-4xl font-bold">ImaginAI</h1>
        {data?.url_list?.map((url) => (
          <ImageComponent key={url} url={url} />
        ))}
      </div>
    </main>
  )
}
