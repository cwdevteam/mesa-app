import { MediaCard } from './MediaCard'

export function MediaList({ medias }: { medias: any }) {
  return (
    <div className="flex flex-col gap-4">
      {medias.map((item: MediaType, index: number) => (
        <MediaCard media={item} key={index} />
      ))}
    </div>
  )
}
