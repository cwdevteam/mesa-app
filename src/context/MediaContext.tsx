'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'

const MediaContext = createContext<
  | { currentMedia: MediaProps; setCurrentMedia: (value: MediaProps) => void }
  | undefined
>(undefined)

interface MediaProps {
  url: string
  avatar: string
  name: string
  creator: string
}

interface MediaProviderProps {
  children: ReactNode
}

export const MediaProvider = ({ children }: MediaProviderProps) => {
  const [currentMedia, setCurrentMedia] = useState<MediaProps>({
    avatar:
      'https://static.vecteezy.com/system/resources/previews/000/638/151/large_2x/realistic-headphones-with-sound-waves-vector.jpg',
    url: '',
    name: '',
    creator: '',
  })

  return (
    <MediaContext.Provider value={{ currentMedia, setCurrentMedia }}>
      {children}
    </MediaContext.Provider>
  )
}

export const useMedia = () => {
  const context = useContext(MediaContext)
  if (typeof context === 'undefined') {
    throw new Error('useMedia must be used within a MediaProvider')
  }
  return context
}

export default MediaProvider
