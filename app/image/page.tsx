'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

import routes from '@/api/constants'
import { useInfiniteQuery } from '@tanstack/react-query'
import ImageComponent from '@/components/ImageComponent'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const MAX_FILE_SIZE = 3000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg']

const FormSchema = z.object({
  image: z
    .any()
    .refine(
      (files: FileList) => files[0]?.size <= MAX_FILE_SIZE,
      `File not selected or larger than 3MB.`
    )
    .refine(
      (files: FileList) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      'Only .jpg, .jpeg formats are supported.'
    ),
})

type FormInput = z.infer<typeof FormSchema>

const fetchItems = async ({ image }: { image: string }) => {
  return (await fetch(`/${routes.search.path}`, {
    headers: routes.search.headers,
    method: routes.search.method,
    body: JSON.stringify({ image }),
  }).then((res) => res.json())) as (typeof routes)['search']['body']
}

function useSearchApi(image: string) {
  const results = useInfiniteQuery({
    queryFn: () => fetchItems({ image }),
    queryKey: [routes.search.path, image],
    getNextPageParam: () => 0,
    enabled: !!image,
  })
  return { ...results }
}

export default function ImagePage() {
  const [image, setImage] = useState<File | null>(null)
  const [searchImage, setSearchImage] = useState<string>('')
  const { data } = useSearchApi(searchImage)
  const { register, formState, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: [] as unknown as FileList,
    },
  })
  useEffect(() => {
    const run = async () => {
      const base64 = btoa(
        new Uint8Array(
          (await image?.stream().getReader().read())?.value as ArrayBuffer
        ).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      setSearchImage(base64)
    }
    run().catch(console.error)
  }, [image])
  return (
    <>
      {image ? (
        <>
          <Button
            variant="destructive"
            className="w-fit"
            onClick={() => setImage(null)}
          >
            Search Again
          </Button>
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
        </>
      ) : (
        <h2 className="grid gap-4 border-l border-l-black/50 py-4 pl-4 text-2xl font-light dark:border-l-white/50">
          Upload an image to search similar
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void handleSubmit((data) => {
                const file = (data.image as FileList)[0]
                if (file) setImage(file)
              })(e)
            }}
          >
            <Input type="file" {...register('image')} />
            <p className="text-sm text-red-500">
              {formState.errors.image?.message?.toString()}
            </p>
            <Input
              type="submit"
              className="mt-4 w-fit cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
            />
          </form>
        </h2>
      )}
    </>
  )
}
