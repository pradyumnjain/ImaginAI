'use client'

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
    <>
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
          className="mx-auto my-8 w-full text-center"
        >
          Load more
        </button>
      </div>
    </>
  )
}
