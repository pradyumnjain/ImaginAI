import useImageApi from '@/queries/useImageApi'
import Image from 'next/image'
import { useState } from 'react'

export default function ImageComponent({ url }: { url: string }) {
  const image = useImageApi({ name: url })
  const [paddingTop, setPaddingTop] = useState('0')
  if (!image?.image) return <></>
  return (
    <div className="relative overflow-clip rounded-xl" style={{ paddingTop }}>
      <Image
        alt={url}
        src={`data:image/webp;base64,${image.image}`}
        fill
        style={{
          objectFit: 'contain',
        }}
        onLoad={({ target }) => {
          const { naturalWidth, naturalHeight } = target as HTMLImageElement
          setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`)
        }}
        // loading="lazy"
      />
    </div>
  )
}
