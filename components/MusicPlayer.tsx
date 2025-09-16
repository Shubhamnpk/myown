"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music2,
  Plus,
  Shuffle,
  Repeat,
  MoreHorizontal,
  Trash2,
  Heart,
  Share2,
  VolumeX,
  ListMusic,
  MinimizeIcon,
  MaximizeIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Song {
  id: string
  title: string
  artist: string
  url: string
  favorite?: boolean
}

export function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [previousVolume, setPreviousVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isAddingNewSong, setIsAddingNewSong] = useState(false)
  const [newSong, setNewSong] = useState({ title: "", artist: "", url: "" })
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [isRepeatOn, setIsRepeatOn] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [queue, setQueue] = useState<Song[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const storedSongs = localStorage.getItem("songs")
    const storedQueue = localStorage.getItem("queue")
    if (storedSongs) {
      setSongs(JSON.parse(storedSongs))
    }
    if (storedQueue) {
      setQueue(JSON.parse(storedQueue))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("songs", JSON.stringify(songs))
  }, [songs])

  useEffect(() => {
    localStorage.setItem("queue", JSON.stringify(queue))
  }, [queue])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume)
    } else {
      setPreviousVolume(volume)
      setVolume(0)
    }
    setIsMuted(!isMuted)
  }

  const handlePlay = () => {
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleSeek = (newTime: number[]) => {
    if (audioRef.current && newTime[0] >= 0) {
      audioRef.current.currentTime = newTime[0]
      setCurrentTime(newTime[0])
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

  const handlePrevious = () => {
    if (currentSong && songs.length > 0) {
      if (currentTime > 5) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
      } else {
        const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
        const previousIndex = (currentIndex - 1 + songs.length) % songs.length
        setCurrentSong(songs[previousIndex])
      }
      setIsPlaying(true)
    }
  }

  const handleNext = () => {
    if (currentSong && songs.length > 0) {
      if (isShuffleOn) {
        const remainingSongs = songs.filter((song) => song.id !== currentSong.id)
        const nextSong = remainingSongs[Math.floor(Math.random() * remainingSongs.length)]
        setCurrentSong(nextSong)
      } else {
        const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
        const nextIndex = (currentIndex + 1) % songs.length
        setCurrentSong(songs[nextIndex])
      }
      setIsPlaying(true)
    }
  }

  const toggleFavorite = (songId: string) => {
    setSongs(songs.map((song) => (song.id === songId ? { ...song, favorite: !song.favorite } : song)))
  }

  const deleteSong = (songId: string) => {
    setSongs(songs.filter((song) => song.id !== songId))
    if (currentSong?.id === songId) {
      setCurrentSong(null)
      setIsPlaying(false)
    }
  }

  const addToQueue = (song: Song) => {
    setQueue([...queue, song])
  }

  const addSong = () => {
    if (newSong.title && newSong.url) {
      const song = { ...newSong, id: Date.now().toString(), favorite: false }
      setSongs([...songs, song])
      if (!currentSong) {
        setCurrentSong(song)
      }
      setNewSong({ title: "", artist: "", url: "" })
      setIsAddingNewSong(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }
  return (
    <TooltipProvider>
      <Card className={`w-full transition-all duration-300 ${isMinimized ? "max-w-md" : "max-w-2xl"} mx-auto`}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-2xl font-bold">Music Player</CardTitle>
              {currentSong?.favorite && (
                <Badge variant="secondary">
                  <Heart className="h-3 w-3 fill-current text-red-500" />
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? <MaximizeIcon className="h-4 w-4" /> : <MinimizeIcon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isMinimized ? "Maximize" : "Minimize"}</TooltipContent>
              </Tooltip>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ListMusic className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Queue</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                    {queue.map((song, index) => (
                      <div key={`${song.id}-${index}`} className="flex items-center justify-between p-2">
                        <div>
                          <p className="font-medium">{song.title}</p>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQueue(queue.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {!isMinimized && <CardDescription>Your personal music collection</CardDescription>}
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              {currentSong ? (
                <>
                  <h3 className="text-xl font-bold truncate">{currentSong.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                  <Music2 className="h-12 w-12" />
                  <p>No song selected</p>
                </div>
              )}
            </div>

            {!isMinimized && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsShuffleOn(!isShuffleOn)}
                        className={isShuffleOn ? "bg-accent" : ""}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isShuffleOn ? "Disable Shuffle" : "Enable Shuffle"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handlePrevious} disabled={!currentSong}>
                        <SkipBack className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" onClick={handlePlay} disabled={!currentSong} className="h-12 w-12">
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleNext} disabled={!currentSong}>
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsRepeatOn(!isRepeatOn)}
                        className={isRepeatOn ? "bg-accent" : ""}
                      >
                        <Repeat className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isRepeatOn ? "Disable Repeat" : "Enable Repeat"}</TooltipContent>
                  </Tooltip>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} className="w-full" />
                </div>

                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={toggleMute}>
                        {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
                  </Tooltip>
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    className="w-32"
                  />
                </div>
              </div>
            )}
            {isAddingNewSong && !isMinimized && (
              <div className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Song title"
                  value={newSong.title}
                  onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                />
                <Input
                  placeholder="Artist name"
                  value={newSong.artist}
                  onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                />
                <Input
                  placeholder="Audio URL"
                  value={newSong.url}
                  onChange={(e) => setNewSong({ ...newSong, url: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingNewSong(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addSong}>Add Song</Button>
                </div>
              </div>
            )}

            {!isMinimized && (
              <ScrollArea className="h-48 rounded-md border p-2">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                      currentSong?.id === song.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-grow"
                        onClick={() => {
                          setCurrentSong(song)
                          setIsPlaying(true)
                        }}
                      >
                        <p className="font-semibold truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(song.id)
                          }}
                        >
                          <Heart className={`h-4 w-4 ${song.favorite ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => addToQueue(song)}>Add to Queue</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteSong(song.id)} className="text-red-500">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>

          <audio
            ref={audioRef}
            src={currentSong?.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              if (isRepeatOn) {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0
                  audioRef.current.play()
                }
              } else {
                handleNext()
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={(e) => {
              console.error("Audio playback error:", e)
              setIsPlaying(false)
            }}
          />
        </CardContent>

        <CardFooter className="flex justify-between">
          {!isMinimized && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsAddingNewSong(!isAddingNewSong)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Song
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentSong) {
                    navigator
                      .share({
                        title: currentSong.title,
                        text: `Check out ${currentSong.title} by ${currentSong.artist}`,
                        url: currentSong.url,
                      })
                      .catch(console.error)
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}

export default MusicPlayer
