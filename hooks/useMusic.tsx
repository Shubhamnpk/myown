"use client"

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react"

interface Song {
  id: string
  title: string
  artist: string
  url: string
  favorite?: boolean
  isLocalFile?: boolean
  coverArt?: string
}

interface MusicContextType {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  isShuffleOn: boolean
  isRepeatOn: boolean
  isMuted: boolean
  queue: Song[]
  playSong: (song: Song) => void
  togglePlay: () => void
  nextSong: () => void
  previousSong: () => void
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleMute: () => void
  addToQueue: (song: Song) => void
  addSong: (song: Song) => void
  removeFromQueue: (index: number) => void
  openFullPlayer: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.7)
  const [previousVolume, setPreviousVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [isRepeatOn, setIsRepeatOn] = useState(false)
  const [queue, setQueue] = useState<Song[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const storedSongs = localStorage.getItem("songs")
    const storedQueue = localStorage.getItem("queue")
    if (storedSongs) {
      const parsedSongs = JSON.parse(storedSongs)
      setSongs(parsedSongs)
    }
    if (storedQueue) {
      setQueue(JSON.parse(storedQueue))
    }
  }, [])

  useEffect(() => {
    // Only save non-local songs to avoid blob URL issues
    const songsToSave = songs.filter(song => !song.isLocalFile)
    localStorage.setItem("songs", JSON.stringify(songsToSave))
  }, [songs])

  useEffect(() => {
    localStorage.setItem("queue", JSON.stringify(queue))
  }, [queue])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error)
          setIsPlaying(false)
        })
      }
    }
  }, [currentSong])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleEnded = () => {
    if (isRepeatOn) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      nextSong()
    }
  }

  const playSong = (song: Song) => {
    setCurrentSong(song)
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error)
          setIsPlaying(false)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const shuffleArray = (array: Song[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const nextSong = () => {
    if (songs.length > 0 && currentSong) {
      if (isShuffleOn) {
        const remainingSongs = songs.filter((song) => song.id !== currentSong.id)
        const nextSong = remainingSongs[Math.floor(Math.random() * remainingSongs.length)]
        setCurrentSong(nextSong)
      } else {
        const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
        const nextIndex = (currentIndex + 1) % songs.length
        setCurrentSong(songs[nextIndex])
      }
    }
  }

  const previousSong = () => {
    if (songs.length > 0 && currentSong) {
      if (currentTime > 5) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
      } else {
        const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
        const previousIndex = (currentIndex - 1 + songs.length) % songs.length
        setCurrentSong(songs[previousIndex])
      }
    }
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn)
  }

  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn)
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume)
    } else {
      setPreviousVolume(volume)
      setVolume(0)
    }
  }

  const addToQueue = (song: Song) => {
    setQueue([...queue, song])
  }

  const addSong = (song: Song) => {
    setSongs([...songs, song])
  }

  const removeFromQueue = (index: number) => {
    setQueue(queue.filter((_, i) => i !== index))
  }

  const openFullPlayer = () => {
    // This will be handled by opening the music player module in the dashboard
    // For now, we'll emit a custom event
    window.dispatchEvent(new CustomEvent('open-music-player'))
  }

  const value: MusicContextType = {
    songs,
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffleOn,
    isRepeatOn,
    isMuted: volume === 0,
    queue,
    playSong,
    togglePlay,
    nextSong,
    previousSong,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleMute,
    addToQueue,
    addSong,
    removeFromQueue,
    openFullPlayer,
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}
