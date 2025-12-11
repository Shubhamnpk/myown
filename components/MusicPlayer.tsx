"use client"

import { useState } from "react"
import { parseBlob } from "music-metadata-browser" // Install: npm install music-metadata-browser
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
  Upload,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMusic } from "@/hooks/useMusic"

interface Song {
  id: string
  title: string
  artist: string
  url: string
  favorite?: boolean
  isLocalFile?: boolean
  coverArt?: string
}

export function MusicPlayer() {
  const [isAddingNewSong, setIsAddingNewSong] = useState(false)
  const [newSong, setNewSong] = useState({ title: "", artist: "", url: "" })
  const [isMinimized, setIsMinimized] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null)

  const {
    songs,
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffleOn,
    isRepeatOn,
    queue,
    playSong,
    togglePlay,
    nextSong,
    previousSong,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    addSong,
  } = useMusic()

  const {
    isMuted,
    toggleMute,
  } = useMusic()

  const handleSeek = (newTime: number[]) => {
    seekTo(newTime[0])
  }

  const toggleFavorite = (songId: string) => {
    // This would need to be added to the music context
    // For now, we'll implement it locally
    console.log("Toggle favorite for:", songId)
  }

  const deleteSong = (songId: string) => {
    // This would need to be added to the music context
    // For now, we'll implement it locally
    console.log("Delete song:", songId)
  }

  const handleAddSong = async () => {
    if (!((uploadedFile || newSong.url) && newSong.title)) return

    let url: string
    let coverArt: string | undefined

    if (uploadedFile) {
      url = URL.createObjectURL(uploadedFile)

      // Try to extract cover art from audio file if no cover art uploaded
      if (!coverArtFile) {
        coverArt = await extractCoverArt(uploadedFile)
      }
    } else {
      url = newSong.url
    }

    if (coverArtFile) {
      coverArt = URL.createObjectURL(coverArtFile)
    }

    const title = uploadedFile
      ? (newSong.title || uploadedFile.name.replace(/\.[^/.]+$/, ""))
      : newSong.title

    const song: Song = {
      id: Date.now().toString(),
      title,
      artist: newSong.artist || "Unknown Artist",
      url,
      favorite: false,
      isLocalFile: !!uploadedFile,
      coverArt
    }

    addSong(song)
    if (!currentSong) {
      playSong(song)
    }

    if (uploadedFile) {
      alert("Note: Uploaded files are temporary and will be lost when you refresh the page. For permanent storage, use URL-based songs.")
    }

    setNewSong({ title: "", artist: "", url: "" })
    setUploadedFile(null)
    setCoverArtFile(null)
    setIsAddingNewSong(false)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = error => reject(error)
    })
  }

  const extractCoverArt = async (file: File): Promise<string | undefined> => {
    try {
      const metadata = await parseBlob(file)
      const picture = metadata.common.picture?.[0]
      if (picture) {
        const data = picture.data instanceof Buffer ? new Uint8Array(picture.data) : picture.data
        const blob = new Blob([data], { type: picture.format })
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
      }
      return undefined
    } catch (error) {
      console.error('Error extracting cover art:', error)
      return undefined
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
                          onClick={() => console.log("Remove from queue:", index)}
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
                  {currentSong.coverArt && (
                    <img
                      src={currentSong.coverArt}
                      alt={`${currentSong.title} cover`}
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                  )}
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
                        onClick={toggleShuffle}
                        className={isShuffleOn ? "bg-accent" : ""}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isShuffleOn ? "Disable Shuffle" : "Enable Shuffle"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={previousSong} disabled={!currentSong}>
                        <SkipBack className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" onClick={togglePlay} disabled={!currentSong} className="h-12 w-12">
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={nextSong} disabled={!currentSong}>
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
                        onClick={toggleRepeat}
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
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground">Audio: {uploadedFile.name}</p>
                )}
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverArtFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">Cover Art (optional)</span>
                </div>
                {coverArtFile && (
                  <p className="text-sm text-muted-foreground">Cover: {coverArtFile.name}</p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddingNewSong(false)
                    setUploadedFile(null)
                    setCoverArtFile(null)
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSong} disabled={(!uploadedFile && !newSong.url) || !newSong.title}>
                    Add Song
                  </Button>
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
                        className="flex items-center space-x-3 flex-grow"
                        onClick={() => {
                          playSong(song)
                        }}
                      >
                        {song.coverArt && (
                          <img
                            src={song.coverArt}
                            alt={`${song.title} cover`}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-grow">
                          <p className="font-semibold truncate">{song.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        </div>
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
                            <DropdownMenuItem onClick={() => {
                              addToQueue(song)
                            }}>Add to Queue</DropdownMenuItem>
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
