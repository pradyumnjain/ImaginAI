'use client'

import HealthCheck from '@/components/HealthCheck'
import ImageComponent from '@/components/ImageComponent'
import useElementOnScreen from '@/lib/useElementOnScreen'
import useHomeApi from '@/queries/useHomeApi'
import { useEffect } from 'react'

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

export default function Home() {
  const { data, fetchNextPage } = useHomeApi()
  const { containerRef, isVisible } = useElementOnScreen<HTMLDivElement>({
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  })
  useEffect(() => {
    if (isVisible) void fetchNextPage()
  }, [fetchNextPage, isVisible])
  return (
    <main className="flex h-full w-full flex-col px-8">
      <HealthCheck />
      <h1 className="my-16 py-10 text-center text-6xl font-bold">ImaginAI</h1>
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 1,
          750: 2,
          900: 3,
          1200: 4,
          1680: 6,
          2160: 8,
        }}
        className="max-w-8xl"
      >
        <Masonry gutter="2rem">
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
        </Masonry>
      </ResponsiveMasonry>
      <div ref={containerRef} className="h-32 w-full">
        <button
          onClick={() => void fetchNextPage()}
          className="mx-auto flex max-w-max items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-sm dark:border-white/50 dark:bg-white/10"
        >
          Load more
        </button>
      </div>
    </main>
  )
}
