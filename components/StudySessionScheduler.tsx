"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, BookOpen, Calendar as CalendarIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Enhanced TypeScript types
type Subject = "Math" | "Science" | "History" | "Literature" | "Language" | "Other"
type FilterType = "all" | "upcoming" | "completed" | "today"

interface StudySession {
  id: string
  date: Date
  title: string
  duration: number
  subject: Subject
  notes: string
  completed: boolean
  createdAt: Date
  lastModified: Date
}

interface FormErrors {
  title?: string
  duration?: string
  subject?: string
  date?: string
}

const DEFAULT_DURATION = 60
const SUBJECTS: Subject[] = ["Math", "Science", "History", "Literature", "Language", "Other"]

export function StudySessionScheduler() {
  // State management
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [sessionTitle, setSessionTitle] = useState("")
  const [sessionDuration, setSessionDuration] = useState(DEFAULT_DURATION)
  const [sessionSubject, setSessionSubject] = useState<Subject | "">("")
  const [sessionNotes, setSessionNotes] = useState("")
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load sessions from localStorage with error handling
  useEffect(() => {
    try {
      setIsLoading(true)
      const savedSessions = localStorage.getItem("studySessions")
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions)
        setSessions(
          parsed.map((session: StudySession) => ({
            ...session,
            date: new Date(session.date),
            createdAt: new Date(session.createdAt),
            lastModified: new Date(session.lastModified),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save sessions to localStorage with debouncing
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem("studySessions", JSON.stringify(sessions))
        setLastSaved(new Date())
      } catch (error) {
        console.error("Error saving sessions:", error)
      }
    }, 500)

    return () => clearTimeout(saveTimeout)
  }, [sessions])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!sessionTitle.trim()) {
      newErrors.title = "Title is required"
    }

    if (!sessionSubject) {
      newErrors.subject = "Subject is required"
    }

    if (!sessionDuration || sessionDuration <= 0) {
      newErrors.duration = "Duration must be greater than 0"
    }

    if (!selectedDate) {
      newErrors.date = "Date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [sessionTitle, sessionSubject, sessionDuration, selectedDate])

  // Session handlers
  const handleAddSession = useCallback(() => {
    if (!validateForm()) return

    const newSession: StudySession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: selectedDate!,
      title: sessionTitle.trim(),
      duration: sessionDuration,
      subject: sessionSubject as Subject,
      notes: sessionNotes.trim(),
      completed: false,
      createdAt: new Date(),
      lastModified: new Date(),
    }

    setSessions((prev) => [...prev, newSession])

    // Reset form
    setSessionTitle("")
    setSessionDuration(DEFAULT_DURATION)
    setSessionSubject("")
    setSessionNotes("")
    setErrors({})
  }, [selectedDate, sessionTitle, sessionDuration, sessionSubject, sessionNotes, validateForm])

  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id))
  }, [])

  const handleToggleComplete = useCallback((id: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, completed: !session.completed, lastModified: new Date() } : session,
      ),
    )
  }, [])

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (filter) {
      case "upcoming":
        return sessionDate >= today && !session.completed
      case "completed":
        return session.completed
      case "today":
        return (
          sessionDate.getDate() === today.getDate() &&
          sessionDate.getMonth() === today.getMonth() &&
          sessionDate.getFullYear() === today.getFullYear()
        )
      default:
        return true
    }
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
            {errors.date && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.date}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Add Study Session
            </CardTitle>
            <CardDescription>Plan your study session with the details below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sessionTitle">Session Title</Label>
                <Input
                  id="sessionTitle"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g., Math Review"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="sessionSubject">Subject</Label>
                <Select value={sessionSubject} onValueChange={setSessionSubject}>
                  <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="sessionDuration" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration (minutes)
                </Label>
                <Input
                  id="sessionDuration"
                  type="number"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  min={1}
                  className={errors.duration ? "border-red-500" : ""}
                />
                {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration}</p>}
              </div>

              <div>
                <Label htmlFor="sessionNotes">Notes</Label>
                <Textarea
                  id="sessionNotes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Add any additional notes or topics to cover"
                  className="h-24"
                />
              </div>

              <Button onClick={handleAddSession} className="w-full" disabled={isLoading}>
                Add Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Sessions</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={() => setFilter("all")} variant={filter === "all" ? "default" : "outline"} size="sm">
              All
            </Button>
            <Button onClick={() => setFilter("today")} variant={filter === "today" ? "default" : "outline"} size="sm">
              Today
            </Button>
            <Button
              onClick={() => setFilter("upcoming")}
              variant={filter === "upcoming" ? "default" : "outline"}
              size="sm"
            >
              Upcoming
            </Button>
            <Button
              onClick={() => setFilter("completed")}
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
            >
              Completed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading sessions...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No sessions found</div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-secondary rounded-lg transition-colors hover:bg-secondary/80"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{session.title}</span>
                      <Badge variant="outline">{session.subject}</Badge>
                      <Badge variant={session.completed ? "success" : "secondary"} className="capitalize">
                        {session.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.date.toLocaleDateString()} - {session.duration} minutes
                    </p>
                    {session.notes && <p className="text-sm italic text-muted-foreground">{session.notes}</p>}
                    <p className="text-xs text-muted-foreground">
                      Last modified: {session.lastModified.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleToggleComplete(session.id)}>
                      {session.completed ? "Mark Incomplete" : "Mark Complete"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSession(session.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudySessionScheduler
