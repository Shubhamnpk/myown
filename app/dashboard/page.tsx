"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { useProductivity } from "@/hooks/useProductivity"
import { MoreInfoModal } from "@/app/dashboard/dashsettings"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Settings, PlusCircle, BarChart, Clock, BookOpen, Music, FileText, Target } from "lucide-react"
import { Notification } from "@/components/Notification"
import { TodoList } from "@/components/TodoList"
import { FocusTimer } from "@/components/FocusTimer"
import { ResourceLibrary } from "@/components/ResourceLibrary"
import { MusicPlayer } from "@/components/MusicPlayer"
import { ResizablePopup } from "@/components/ResizablePopup"
import { ProductivityHistory } from "@/components/ProductivityHistory"
import { ProductivityModule } from "@/components/ProductivityModule"
import { getCurrentUser, isGuest } from "@/utils/userManagement"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { NotesModule } from "@/components/NotesModule"
import { GoalsModule } from "@/components/GoalsModule"
import { GoalWidget } from "@/components/GoalWidget"
import { CalendarWidget } from "@/components/CalendarWidget"
import { StudySessionScheduler } from "@/components/StudySessionScheduler"
import LoadingScreen from "@/components/LoadingScreen"
import { MinimizedWindowsBar } from "@/components/MinimizedWindowsBar"
import { useZIndex } from "@/hooks/useZIndex"
import { YoMusic } from "@/components/YoMusic"
import { YoMusicButton } from "@/components/YoMusicModal"

interface ActiveModule {
  id: string
  name: string
  zIndex: number
  isMinimized?: boolean
  position?: { x: number; y: number }
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeModules, setActiveModules] = useState<ActiveModule[]>([])
  const { lastScore, lastScoreDate, streak, getTip, getRecentEntries, addEntry } = useProductivity()
  const tip = useMemo(() => getTip(), [])
  const [displayedWidgets, setDisplayedWidgets] = useState([
    "lastScore",
    "streak",
    "tip",
    "chart",
    "time",
    "todo",
    "goals",
    "calendar",
  ])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeZone, setTimeZone] = useState("")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [userName, setUserName] = useState("")
  const [isGuestUser, setIsGuestUser] = useState(false)
  const router = useRouter()
  const [minimizedWindows, setMinimizedWindows] = useState<{ id: string; title: string }[]>([])
  const [fullscreenState, setFullscreenState] = useState<{
    fullscreenModuleId: string | null
    minimizedModules: string[]
  }>({ fullscreenModuleId: null, minimizedModules: [] })
  const getNewPopupPosition = useCallback((index: number) => {
    const basePosition = { x: 50, y: 50 }
    const offset = 30

    return {
      x: basePosition.x + index * offset,
      y: basePosition.y + index * offset,
    }
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const user = getCurrentUser()
      setIsGuestUser(isGuest())
      if (user) {
        setUserName(user.name)
        setIsLoading(false)
      } else {
        router.push("/")
      }
    }

    checkUser()

    const storedTimeZone = localStorage.getItem("timeZone")
    setTimeZone(storedTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone)

    const timer = setInterval(() => {
      const now = new Date()
      const options = { timeZone: storedTimeZone || undefined }
      setCurrentTime(new Date(now.toLocaleString("en-US", options)))
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const recentEntries = getRecentEntries(7)

  const handleAddEntry = (newEntry: any) => {
    addEntry(newEntry)
    setNotification({ type: "success", message: "New entry added successfully!" })
  }

  const { getNewZIndex, registerPopup, unregisterPopup } = useZIndex()

  // Update the bringToFront function to use the z-index management system
  const bringToFront = useCallback(
    (id: string) => {
      setActiveModules((prev) => {
        const moduleToUpdate = prev.find((module) => module.id === id)
        if (moduleToUpdate) {
          const newZIndex = getNewZIndex("popup")
          return prev.map((module) => ({
            ...module,
            zIndex: module.id === id ? newZIndex : module.zIndex,
          }))
        }
        return prev
      })
    },
    [getNewZIndex],
  )

  const openModule = useCallback(
    (moduleName: string, initialPosition?: { x: number; y: number }) => {
      const existingModule = activeModules.find((module) => module.name === moduleName)
      if (existingModule) {
        bringToFront(existingModule.id)
        setActiveModules((prev) => prev.map((module) =>
          module.id === existingModule.id ? { ...module, isMinimized: false } : module,
        ))
      } else {
        const newPosition = initialPosition || getNewPopupPosition(activeModules.length)
        const moduleId = `${moduleName}-${Date.now()}`
        const newZIndex = registerPopup(moduleId)
        setActiveModules((prev) => [
          ...prev,
          {
            id: moduleId,
            name: moduleName,
            zIndex: newZIndex,
            isMinimized: false,
            position: newPosition,
          },
        ])
      }
    },
    [activeModules, getNewPopupPosition, registerPopup, bringToFront],
  )

  // Listen for open-music-player event
  useEffect(() => {
    const handleOpenMusicPlayer = () => {
      openModule("musicPlayer")
    }

    window.addEventListener('open-music-player', handleOpenMusicPlayer)
    return () => window.removeEventListener('open-music-player', handleOpenMusicPlayer)
  }, [openModule])

  // Update the closeModule function to unregister the popup
  const closeModule = useCallback(
    (id: string) => {
      setActiveModules((prev) => prev.filter((module) => module.id !== id))
      unregisterPopup(id)
    },
    [unregisterPopup],
  )


  const handleMinimize = useCallback((id: string, title: string) => {
    setActiveModules((prev) => prev.map((module) => (module.id === id ? { ...module, isMinimized: true } : module)))
    setMinimizedWindows((prev) => {
      if (prev.find((window) => window.id === id)) {
        return prev
      }
      return [...prev, { id, title }]
    })
  }, [])

  const handleRestore = useCallback(
    (id: string) => {
      setActiveModules((prev) => prev.map((module) => (module.id === id ? { ...module, isMinimized: false } : module)))
      setMinimizedWindows((prev) => prev.filter((window) => window.id !== id))
      bringToFront(id)
    },
    [bringToFront],
  )

  const handleReopen = useCallback(
    (id: string) => {
      setActiveModules((prev) => prev.map((module) => (module.id === id ? { ...module, isMinimized: false } : module)))
      setMinimizedWindows((prev) => prev.filter((window) => window.id !== id))
      bringToFront(id)
    },
    [bringToFront],
  )

  const handleCloseMinimized = useCallback((id: string) => {
    setActiveModules((prev) => prev.filter((module) => module.id !== id))
    setMinimizedWindows((prev) => prev.filter((window) => window.id !== id))
  }, [])

  const getGreetingAndTip = () => {
    const hour = currentTime.getHours()
    let greeting, tip

    if (hour < 12) {
      greeting = "Good morning"
      tip = "Start your day with a positive mindset!"
    } else if (hour < 18) {
      greeting = "Good afternoon"
      tip = "Stay focused and productive!"
    } else {
      greeting = "Good evening"
      tip = "Time to wind down and reflect on your day."
    }

    return { greeting, tip }
  }

  const widgets = {
    calendar: (
      <motion.div
        key="calendar"
        className="col-span-2 row-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CalendarWidget />
      </motion.div>
    ),
    lastScore: (
      <motion.div
        key="lastScore"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Last Productivity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{lastScore !== undefined ? lastScore.toFixed(2) : "N/A"}</p>
            <p className="text-sm mt-2">{lastScoreDate || "No date"}</p>
          </CardContent>
        </Card>
      </motion.div>
    ),
    streak: (
      <motion.div
        key="streak"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{streak || 0}</p>
            <p className="text-sm mt-2">days</p>
          </CardContent>
        </Card>
      </motion.div>
    ),
    tip: (
      <motion.div
        key="tip"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tip of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic">{tip}</p>
          </CardContent>
        </Card>
      </motion.div>
    ),
    chart: (
      <motion.div
        key="chart"
        className="col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentEntries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[-5, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalScore" stroke="#8884d8" name="Total Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    time: (
      <motion.div
        key="time"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Current Time ({timeZone})</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentTime.toLocaleTimeString()}</p>
            <p className="text-sm mt-2">{currentTime.toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </motion.div>
    ),
    todo: (
      <motion.div
        key="todo"
        className="col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <TodoList />
        </Card>
      </motion.div>
    ),
    goals: (
      <motion.div
        key="goals"
        className="col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <GoalWidget />
      </motion.div>
    ),
  }

  // Update the handleFullscreenChange function to position new popups in a cascading manner
  const handleFullscreenChange = useCallback(
    (moduleId: string, isFullscreen: boolean, tabs: any[]) => {
      if (isFullscreen) {
        const modulesToMinimize = activeModules.filter((module) => module.id !== moduleId && !module.isMinimized)
        setFullscreenState({
          fullscreenModuleId: moduleId,
          minimizedModules: modulesToMinimize.map((m) => m.id),
        })
        setActiveModules((prev) =>
          prev.map((module) =>
            module.id !== moduleId && !module.isMinimized ? { ...module, isMinimized: true } : module,
          ),
        )
      } else {
        if (fullscreenState.minimizedModules.length > 0) {
          setActiveModules((prev) =>
            prev.map((module) =>
              fullscreenState.minimizedModules.includes(module.id) ? { ...module, isMinimized: false } : module,
            ),
          )
        }
        if (tabs && tabs.length > 0) {
          const maxZIndex = Math.max(...activeModules.map((module) => module.zIndex), 999)
          const tabsToConvert = tabs.filter((tab) => tab.createdInFullscreen || tab.id !== tabs[0]?.id)
          const newModules = tabsToConvert.map((tab, index) => {
            const position = getNewPopupPosition(index)
            return {
              id: `${tab.module}-${Date.now()}-${index}`,
              name: tab.module,
              zIndex: maxZIndex + index + 1,
              isMinimized: false,
              position,
            }
          })

          if (newModules.length > 0) {
            setActiveModules((prev) => [...prev, ...newModules])
            setNotification({
              type: "success",
              message: `${newModules.length} tab${newModules.length > 1 ? "s" : ""} converted to popup windows`,
            })
          }
        }
        setFullscreenState({ fullscreenModuleId: null, minimizedModules: [] })
      }
    },
    [activeModules, fullscreenState, setNotification, getNewPopupPosition],
  )

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-8 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {getGreetingAndTip().greeting}, {userName}!
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{getGreetingAndTip().tip}</p>
            {isGuestUser && (
              <p className="text-sm text-yellow-500 mt-1">
                You are using a guest account. Your data will be erased when you log out.
              </p>
            )}
          </div>
          <div className="space-x-2 flex items-center">
            <Button onClick={() => openModule("addEntry")} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Settings className="mr-2 h-4 w-4" /> Customize
            </Button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedWidgets.map((widgetKey) => widgets[widgetKey as keyof typeof widgets])}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 space-y-4 mb-16"
        >
          <h3 className="text-2xl font-semibold text-foreground">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => openModule("focusTimer")} variant="outline">
              <Clock className="mr-2 h-4 w-4" /> Focus Timer
            </Button>
            <Button onClick={() => openModule("resourceLibrary")} variant="outline">
              <BookOpen className="mr-2 h-4 w-4" /> Resource Library
            </Button>
            <Button onClick={() => openModule("musicPlayer")} variant="outline">
              <Music className="mr-2 h-4 w-4" /> Music Player
            </Button>
            <YoMusicButton onClick={() => openModule("yomusic")} />
            <Button onClick={() => openModule("productivityHistory")} variant="outline">
              <BarChart className="mr-2 h-4 w-4" /> Productivity History
            </Button>
            <Button onClick={() => openModule("notes")} variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Notes
            </Button>
            <Button onClick={() => openModule("goals")} variant="outline">
              <Target className="mr-2 h-4 w-4" /> Goals
            </Button>
            <Button onClick={() => openModule("studySessions")} variant="outline">
              <BookOpen className="mr-2 h-4 w-4" /> Study Sessions
            </Button>
          </div>
        </motion.div>
        <AnimatePresence>
          {activeModules.map((module) => (
            <ResizablePopup
              key={module.id}
              onClose={() => closeModule(module.id)}
              onMinimize={() => handleMinimize(module.id, getModuleTitle(module.name))}
              title={getModuleTitle(module.name)}
              zIndex={module.zIndex}
              onFocus={() => bringToFront(module.id)}
              isMinimized={module.isMinimized ?? false}
              initialPosition={module.position}
              allActiveModules={activeModules.map((m) => ({
                id: m.id,
                name: m.name,
                content: getModuleContent(m.name),
                title: getModuleTitle(m.name),
              }))}
              onFullscreenChange={(isFullscreen, tabs) => handleFullscreenChange(module.id, isFullscreen, tabs)}
            >
              {getModuleContent(module.name)}
            </ResizablePopup>
          ))}
        </AnimatePresence>
      </main>
      <MoreInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateDashboard={(widgets) => setDisplayedWidgets(widgets)}
        displayedWidgets={displayedWidgets}
      />
      <MinimizedWindowsBar
        windows={minimizedWindows.map((window) => ({
          ...window,
          onRestore: () => handleRestore(window.id),
          onClose: () => handleCloseMinimized(window.id),
          onReopen: () => handleReopen(window.id),
        }))}
      />
      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}
    </div>
  )
}

function getModuleTitle(moduleName: string): string {
  switch (moduleName) {
    case "addEntry":
      return "Add New Entry"
    case "focusTimer":
      return "Focus Timer"
    case "resourceLibrary":
      return "Resource Library"
    case "musicPlayer":
      return "Music Player"
    case "yomusic":
      return "YoMusic"
    case "productivityHistory":
      return "Productivity History"
    case "notes":
      return "Notes"
    case "goals":
      return "Goals"
    case "studySessions":
      return "Study Sessions"
    default:
      return "Module"
  }
}

function getModuleContent(moduleName: string): React.ReactNode {
  switch (moduleName) {
    case "addEntry":
      return <ProductivityModule />
    case "focusTimer":
      return <FocusTimer />
    case "resourceLibrary":
      return <ResourceLibrary />
    case "musicPlayer":
      return <MusicPlayer />
    case "yomusic":
      return <YoMusic />
    case "productivityHistory":
      return <ProductivityHistory />
    case "notes":
      return <NotesModule />
    case "goals":
      return <GoalsModule />
    case "studySessions":
      return <StudySessionScheduler />
    default:
      return null
  }
}
