'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Icons } from '@/components/Icons'
import { PlayMode, useMedia } from '@/context/MediaContext'
import { useAuth } from '@/context/AuthProvider'
import SheetDemo from '../SheetDemo/SheetDemo'
export interface MediaControllerProps {
  musicMockup: {
    avatar: string
    name: string
    url: string
  }[]
}

interface useAudioPlayerProps {
  audio: HTMLAudioElement | null
  currentTime: number
  setCurrentTime: (currentTime: number) => void
}

export default function MediaController() {
  const intoClass =
    'w-full sticky bottom-0 dark:bg-black bg-white text-white p-3 z-50 border-t-[1px] border-zinc-500'
  const iconClass =
    'w-4 h-4 text-zinc-400 dark:hover:text-white hover:text-black'

  const { user } = useAuth()
  const [volume, setVolume] = useState<number>(1)
  const [isMute, setIsMute] = useState<boolean>(false)
  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [currentTime, setCurrentTime] = useState<number>(0)
  const {
    currentMedia,
    medias,
    isPlaying,
    setIsPlaying,
    setCurrentMedia,
    playStatus,
    setPlayStatus,
    handleSongEnded,
  } = useMedia()

  useEffect(() => {
    const newAudio = new Audio(medias[currentMedia]?.url)
    setAudio(newAudio)

    return () => {
      newAudio.pause()
      newAudio.src = ''
    }
  }, [currentMedia, medias])

  useEffect(() => {
    if (audio) {
      audio.pause()
      audio.src = medias[currentMedia]?.url
      audio.load()
      audio.currentTime = currentTime
      audio.volume = volume

      const handleLoadedMetadata = () => {
        if (isPlaying) {
          audio.play()
        }
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleEnded = () => {
        setCurrentTime(0)
        handleSongEnded()
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [
    audio,
    medias,
    currentMedia,
    currentTime,
    volume,
    isPlaying,
    setIsPlaying,
    handleSongEnded,
  ])

  useEffect(() => {
    if (audio) {
      audio.volume = volume
    }
  }, [volume, audio])

  const formatTime = (time: number | undefined) => {
    if (time || time === 0) {
      const hours = Math.floor(time / 3600)
      const minutes = Math.floor((time % 3600) / 60)
      const seconds = Math.floor(time % 60)
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    return '00:00:00'
  }

  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play()
      } else {
        audio.pause()
      }
    }
  }, [isPlaying, audio])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    if (audio) {
      if (isMute) {
        setVolume(1)
        audio.volume = 1
      } else {
        setVolume(0)
        audio.volume = 0
      }
      setIsMute(!isMute)
    }
  }

  const handleNext = (index: number) => {
    if (medias.length === index + 1) {
      setCurrentMedia(0)
    } else {
      setCurrentMedia(index + 1)
    }
    setIsPlaying(true)
  }

  const handleBack = (index: number) => {
    if (index === 0) {
      setCurrentMedia(medias.length - 1)
    } else {
      setCurrentMedia(index - 1)
    }
    setIsPlaying(true)
  }

  const handleVolumeChange = (e: any) => {
    const newVolume = parseFloat(e.target.value)
    if (newVolume > 0) {
      setIsMute(false)
    } else {
      setIsMute(true)
    }
    setVolume(newVolume)
    if (audio) {
      audio.volume = newVolume
    }
  }

  const handleSliderChange = (e: any) => {
    if (audio) {
      const newTime = e.target.value
      audio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  return (
    <>
      {user?.id ? (
        <div className={intoClass}>
          <div className="flex items-center gap-2 h-[8%] bottom-0 flex-wrap">
            <div className="flex-1 flex gap-3">
              {/* <Icons.radio /> */}
              <Image
                src={'/audio.png'}
                alt="audioplayer"
                width={50}
                height={50}
              />
              <div className="flex justify-center items-center flex-col">
                <div className="dark:text-white text-zinc-900 text-md font-sans hover:underline">
                  <b>{medias[currentMedia]?.name}</b>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-center items-center gap-5">
                <button onClick={() => handleBack(currentMedia)}>
                  <Icons.voiceback className={iconClass} />
                </button>
                {isPlaying ? (
                  <button onClick={handlePlayPause} aria-label="Pause">
                    <Icons.voicepause className="w-7 h-7 text-zinc-500 hover:text-black dark:hover:text-white" />
                  </button>
                ) : (
                  <button onClick={handlePlayPause} aria-label="Play">
                    <Icons.voiceplay className="w-7 h-7 text-zinc-500 hover:text-black dark:hover:text-white" />
                  </button>
                )}
                <button onClick={() => handleNext(currentMedia)}>
                  <Icons.voicenext className={iconClass} />
                </button>
                <button onClick={() => setPlayStatus((playStatus + 1) % 3)}>
                  {playStatus === PlayMode.CYCLE && (
                    <Icons.voicerepeat className="iconsClass" />
                  )}
                  {playStatus === PlayMode.INFINITE && <Icons.voiceinfinite />}
                  {playStatus === PlayMode.RANDOM && (
                    <Icons.voicesuffle className="iconsClass" />
                  )}
                </button>
              </div>
              <div className="flex justify-center items-center gap-2">
                <p className="text-xs text-zinc-500">
                  {formatTime(currentTime)}
                </p>
                <input
                  type="range"
                  min="0"
                  max={medias[currentMedia]?.duration}
                  minLength={0}
                  step="0.01"
                  value={currentTime}
                  onChange={handleSliderChange}
                  onMouseUp={handleSliderChange}
                  onKeyUp={handleSliderChange}
                  className="h-[3px] w-full bg-zinc-700"
                />
                <p className="text-xs text-zinc-500">
                  {formatTime(medias[currentMedia]?.duration)}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-end gap-3">
              <div className="flex items-center justify-center gap-2 mr-4 sm:mr-0">
                {isMute ? (
                  <button onClick={handleMute}>
                    <Icons.voicemute className={iconClass} />
                  </button>
                ) : (
                  <button onClick={handleMute}>
                    <Icons.voiceunmute className={iconClass} />
                  </button>
                )}
                <input
                  type="range"
                  min="0"
                  max={1}
                  minLength={0}
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="hidden sm:block w-[120px] h-[3px]"
                />
                <SheetDemo />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
