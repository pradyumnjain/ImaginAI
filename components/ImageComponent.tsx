import useImageApi from '@/queries/useImageApi'
import Image from 'next/image'
import { useState } from 'react'

export default function ImageComponent({ url }: { url: string }) {
  const { data } = useImageApi({ name: url })
  const [paddingTop, setPaddingTop] = useState('0')
  if (!data?.image)
    return <div className="h-96 w-full animate-pulse rounded-xl bg-gray-200" />
  return (
    <>
      <div
        className={'relative overflow-clip rounded-xl'}
        style={{ paddingTop }}
      >
        <Image
          alt={url}
          src={`data:image/webp;base64,${data.image}`}
          fill
          style={{
            objectFit: 'contain',
          }}
          onLoad={({ target }) => {
            const { naturalWidth, naturalHeight } = target as HTMLImageElement
            setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`)
          }}
        />
      </div>
    </>
  )
}
