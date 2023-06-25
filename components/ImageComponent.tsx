import useImageApi from '@/queries/useImageApi'
// import Image from 'next/image'

export default function ImageComponent({ url }: { url: string }) {
  const image = useImageApi({ name: url })
  if (!image?.image) return <></>
  return (
    <div className="relative h-full min-h-[4rem] w-full min-w-[4rem]">
      {/* <Image
        alt={url}
        src={`data:image/webp;base64,${image.image}`}
        unoptimized
        fill
        loading="lazy"
      /> */}
      <img src={`data:image/webp;base64,${image.image}`} alt={url} />
    </div>
  )
}
