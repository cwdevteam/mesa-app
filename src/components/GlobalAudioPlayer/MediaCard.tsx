'use client'

import React, { useState } from 'react'
import { useMedia } from '@/context/MediaContext'
import { Icons } from '@/components/Icons'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { useRouter } from 'next/router'

interface MediaProps {
  url: string
  avatar: string
  name: string
  localUrl?: string
  duration?: number
}

const imageArray = [
  'music_image (1).jpg',
  'music_image (2).jpg',
  'music_image (3).jpg',
  'music_image (4).jpg',
]

export function MediaCard({ media }: { media: MediaType }) {
  const { handleAddMedia, medias } = useMedia()

  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  const handlePlay = () => {
    const audio = new Audio(media.upload.url)
    const randomIndex = Math.floor(Math.random() * imageArray.length)

    audio.onloadedmetadata = function () {
      const duration = audio.duration

      handleAddMedia({
        avatar: `/${imageArray[randomIndex]}`,
        duration: duration,
        name: media.upload.name,
        url: media.upload.url,
        localUrl: media.upload.url,
      } as MediaProps)
    }
  }

  const handleSubmit = async () => {
    try {
      const pathname: any = new URL(media.upload.url).pathname
      const filename = pathname.match(/\/([^/]+)$/)[1]

      setLoading(true)
      const { data } = await axios.post('/api/upload/remove', {
        id: media.upload.id,
        name: filename,
      })

      if (data && data.status) {
        toast({
          title: 'Success',
          description: 'Successfully deleted',
          variant: 'default',
        })
        router.reload()
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast({
        title: 'Error',
        description: 'Something went wrong!',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-full max-w-[250px] px-5 py-3 border-2 border-zinc-500 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            {media.upload.name.length > 15
              ? media.upload.name.slice(0, 14) + '...'
              : media.upload.name}
          </div>

          <button onClick={handlePlay}>
            <Icons.voiceplay />
          </button>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        <Icons.circlecross className="w-5 h-5" />
      </button>
    </div>
  )
}
