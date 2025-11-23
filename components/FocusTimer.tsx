"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, RotateCcw, Plus, Volume2, VolumeX, Link } from "lucide-react"
import { useProductivity } from "@/hooks/useProductivity"

interface TimerPreset {
  id: string
  name: string
  duration: number
  breakDuration: number
}

interface FocusSession {
  id: string
  presetId: string
  startTime: Date
  endTime: Date
  task: string
  completed: boolean
}

export function FocusTimer() {
  const [presets, setPresets] = useState<TimerPreset[]>([
    { id: "1", name: "Pomodoro", duration: 25 * 60, breakDuration: 5 * 60 },
    { id: "2", name: "Long Session", duration: 50 * 60, breakDuration: 10 * 60 },
    { id: "3", name: "Short Break", duration: 5 * 60, breakDuration: 0 },
  ])
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset>(presets[0])
  const [timeLeft, setTimeLeft] = useState(selectedPreset.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  // Task and session management state
  const [task, setTask] = useState("")
  const [sessions, setSessions] = useState<FocusSession[]>([])
  // Note: addProductivityEntry is not available in useProductivity hook; using addEntry instead or removing for now
  // const { addProductivityEntry } = useProductivity()

  // Linking state for notes and goals
  const [linkedNote, setLinkedNote] = useState<string | null>(null)
  const [linkedGoal, setLinkedGoal] = useState<string | null>(null)

  useEffect(() => {
    const storedSessions = localStorage.getItem("focusSessions")
    if (storedSessions) {
      try {
        setSessions(JSON.parse(storedSessions))
      } catch (error) {
        console.error("Failed to parse stored focus sessions:", error)
        // Optionally, clear invalid data
        localStorage.removeItem("focusSessions")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("focusSessions", JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    playNotificationSound()
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - selectedPreset.duration * 1000)
    const newSession: FocusSession = {
      id: Date.now().toString(),
      presetId: selectedPreset.id,
      startTime,
      endTime,
      task,
      completed: true,
    }
    setSessions([...sessions, newSession])
    // TODO: Add productivity entry logging here once hook is updated
    // addProductivityEntry({
    //   date: endTime.toISOString().split("T")[0],
    //   category: "focus",
    //   value: selectedPreset.duration / 60, // Convert seconds to minutes
    //   notes: `Completed ${selectedPreset.name} session: ${task}`,
    // })

    if (selectedPreset.breakDuration > 0 && !isBreak) {
      setIsBreak(true)
      setTimeLeft(selectedPreset.breakDuration)
    } else {
      setIsBreak(false)
      setTimeLeft(selectedPreset.duration)
    }
  }, [selectedPreset, task, sessions, isBreak])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(selectedPreset.duration)
    setIsBreak(false)
  }

  const handlePresetChange = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      setSelectedPreset(preset)
      setTimeLeft(preset.duration)
      setIsRunning(false)
      setIsBreak(false)
    }
  }

  const addCustomPreset = () => {
    const name = prompt("Enter preset name:")
    const duration = Number.parseInt(prompt("Enter duration in minutes:") || "0", 10) * 60
    const breakDuration = Number.parseInt(prompt("Enter break duration in minutes:") || "0", 10) * 60
    if (name && duration > 0) {
      const newPreset: TimerPreset = { id: Date.now().toString(), name, duration, breakDuration }
      setPresets([...presets, newPreset])
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const playNotificationSound = () => {
    if (!isMuted) {
      const audio = new Audio("/notification.mp3") // Replace with your sound file
      audio.volume = volume / 100
      audio.play()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Focus Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedPreset.id} onValueChange={handlePresetChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a timer preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name} ({formatTime(preset.duration)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addCustomPreset} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Custom Preset
        </Button>
        <div className="text-center">
          <div className="text-6xl font-bold mb-4">{formatTime(timeLeft)}</div>
          <div className="text-sm mb-2">{isBreak ? "Break Time" : "Focus Time"}</div>
          <div className="space-x-2">
            <Button onClick={toggleTimer}>
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={resetTimer} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Input placeholder="What are you working on?" value={task} onChange={(e) => setTask(e.target.value)} />
        <div className="flex items-center space-x-2">
          <Switch checked={!isMuted} onCheckedChange={(checked) => setIsMuted(!checked)} />
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            disabled={isMuted}
            className="flex-grow"
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Link to:</h3>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setLinkedNote(prompt("Enter note ID:"))}>
              <Link className="mr-2 h-4 w-4" /> Note
            </Button>
            <Button variant="outline" onClick={() => setLinkedGoal(prompt("Enter goal ID:"))}>
              <Link className="mr-2 h-4 w-4" /> Goal
            </Button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Recent Sessions</h3>
          <ul className="space-y-2">
            {sessions
              .slice(-5)
              .reverse()
              .map((session) => (
                <li key={session.id} className="text-sm">
                  <span className="font-medium">{presets.find((p) => p.id === session.presetId)?.name}</span>
                  <span className="mx-2">-</span>
                  <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                  <span className="mx-1">to</span>
                  <span>{new Date(session.endTime).toLocaleTimeString()}</span>
                  {session.task && <p className="text-muted-foreground">{session.task}</p>}
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
