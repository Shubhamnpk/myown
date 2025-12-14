"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import {
  Grip,
  Minus,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Clock,
  BookOpen,
  Music,
  BarChart,
  FileText,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TabManager } from "./TabManager"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useZIndex } from "@/hooks/useZIndex"

import { FocusTimer } from "@/components/FocusTimer"
import { ResourceLibrary } from "@/components/ResourceLibrary"
import { MusicPlayer } from "@/components/MusicPlayer"
import { ProductivityHistory } from "@/components/ProductivityHistory"
import { NotesModule } from "@/components/NotesModule"
import { GoalsModule } from "@/components/GoalsModule"
import { StudySessionScheduler } from "@/components/StudySessionScheduler"
import type React from "react"

// Custom hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

// Update the interface to include the createdInFullscreen property
interface Tab {
  id: string
  title: string
  module: string
  content: React.ReactNode
  createdInFullscreen?: boolean
}

// Update the interface for ResizablePopupProps to include the new position prop
interface ResizablePopupProps {
  children: React.ReactNode
  onClose: () => void
  onMinimize: () => void
  title: string
  zIndex: number
  onFocus: () => void
  isMinimized: boolean
  initialPosition?: { x: number; y: number }
  allActiveModules?: Array<{ id: string; name: string; content: React.ReactNode; title: string }>
  onFullscreenChange?: (isFullscreen: boolean, tabs: Tab[]) => void
}

// Update the ResizablePopup component to use the useZIndex hook
export function ResizablePopup({
  children,
  onClose,
  onMinimize,
  title,
  zIndex: initialZIndex,
  onFocus,
  isMinimized,
  initialPosition,
  allActiveModules,
  onFullscreenChange,
}: ResizablePopupProps) {
  const { theme } = useTheme()
  const windowSize = useWindowSize()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 })
  const [size, setSize] = useState({ width: 400, height: 400 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const [tabs, setTabs] = useState<Tab[]>([{ id: "1", title, module: "Default", content: children }])
  const [activeTabId, setActiveTabId] = useState("1")
  const [isModuleSelectOpen, setIsModuleSelectOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Use the z-index management system
  const { getPopupZIndex, bringToFront } = useZIndex()
  const popupId = useRef(`popup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`).current
  const [currentZIndex, setCurrentZIndex] = useState(initialZIndex)


  // Update the onFocus handler to use the z-index management system
  const handleFocus = useCallback(() => {
    if (!isFocused) {
      bringToFront(popupId)
      setCurrentZIndex(getPopupZIndex(popupId))
      setIsFocused(true)

      // Reset focus state after animation completes
      setTimeout(() => {
        setIsFocused(false)
      }, 300)

      onFocus()
    }
  }, [bringToFront, getPopupZIndex, popupId, onFocus, isFocused])

  const minWidth = 300
  const minHeight = 200

  // Keyboard shortcuts
  const toggleFullScreen = useCallback(() => {
    const newFullScreenState = !isFullScreen

    // Add visual feedback animation
    if (popupRef.current) {
      popupRef.current.classList.add("transition-all", "duration-300")

      // Remove the transition class after animation completes
      setTimeout(() => {
        if (popupRef.current) {
          popupRef.current.classList.remove("transition-all", "duration-300")
        }
      }, 300)
    }

    setIsFullScreen(newFullScreenState)

    if (newFullScreenState) {
      // Going into fullscreen
      setPosition({ x: 0, y: 0 })
      setSize({ width: windowSize.width, height: windowSize.height })

      // Only create tabs from OTHER active modules, not the current one
      if (allActiveModules && allActiveModules.length > 1) {
        // Filter out the current module to avoid duplication
        const otherModules = allActiveModules.filter((module) => module.id !== popupId)

        if (otherModules.length > 0) {
          const newTabs = otherModules.map((module) => ({
            id: module.id,
            title: module.title,
            module: module.name,
            content: module.content,
            createdInFullscreen: false, // Mark existing tabs as not created in fullscreen
          }))

          // Replace the default tab with tabs from other modules
          setTabs(newTabs)
          setActiveTabId(newTabs[0].id)

          // Notify parent component about fullscreen change
          if (onFullscreenChange) {
            onFullscreenChange(true, newTabs)
          }
        } else {
          // If no other modules, keep the current content without creating tabs
          setTabs([])
          setActiveTabId("")
        }
      } else {
        // If only one module (current one), don't create any tabs
        setTabs([])
        setActiveTabId("")
      }
    } else {
      // Exiting fullscreen
      setPosition(initialPosition || { x: 50, y: 50 })
      setSize({ width: 400, height: 400 })

      // Notify parent component to convert tabs back to popups
      if (onFullscreenChange && tabs.length > 0) {
        // Only convert tabs that were created during fullscreen mode
        const tabsToConvert = tabs.filter((tab) => tab.createdInFullscreen)
        if (tabsToConvert.length > 0) {
          onFullscreenChange(false, tabsToConvert)
        }
      }

      // Reset to default state - no tabs in normal mode
      setTabs([{ id: "1", title, module: "Default", content: children }])
      setActiveTabId("1")
    }
  }, [isFullScreen, windowSize, allActiveModules, tabs, onFullscreenChange, initialPosition, title, children, popupId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullScreen) {
          toggleFullScreen()
        } else if (!isModuleSelectOpen) {
          onMinimize()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullScreen, isModuleSelectOpen, onMinimize, toggleFullScreen])

  // Prevent body scrolling when in fullscreen mode
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullScreen])

  const handleResizeStart = useCallback(
    (handle: string) => (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      setResizeHandle(handle)
      handleFocus() // Add focus when starting resize
    },
    [handleFocus],
  )

  const handleResize = useCallback(
    (e: PointerEvent) => {
      if (!isResizing || isFullScreen) return

      const deltaX = e.clientX - (position.x + size.width)
      const deltaY = e.clientY - (position.y + size.height)

      setSize((prevSize) => {
        let newWidth = prevSize.width
        let newHeight = prevSize.height
        let newX = position.x
        let newY = position.y

        switch (resizeHandle) {
          case "right":
          case "bottom-right":
            newWidth = Math.max(minWidth, Math.min(prevSize.width + deltaX, windowSize.width - position.x))
            if (resizeHandle === "bottom-right") {
              newHeight = Math.max(minHeight, Math.min(prevSize.height + deltaY, windowSize.height - position.y))
            }
            break
          case "bottom":
            newHeight = Math.max(minHeight, Math.min(prevSize.height + deltaY, windowSize.height - position.y))
            break
          case "left":
          case "top-left": {
            const maxLeftResize = position.x + prevSize.width - minWidth
            const leftDelta = Math.max(-maxLeftResize, Math.min(e.clientX - position.x, prevSize.width - minWidth))
            newWidth = prevSize.width - leftDelta
            newX = Math.max(0, position.x + leftDelta)
            if (resizeHandle === "top-left") {
              const maxTopResize = position.y + prevSize.height - minHeight
              const topDelta = Math.max(-maxTopResize, Math.min(e.clientY - position.y, prevSize.height - minHeight))
              newHeight = prevSize.height - topDelta
              newY = Math.max(0, position.y + topDelta)
            }
            break
          }
          case "top":
          case "top-right": {
            const maxTopResize = position.y + prevSize.height - minHeight
            const topDelta = Math.max(-maxTopResize, Math.min(e.clientY - position.y, prevSize.height - minHeight))
            newHeight = prevSize.height - topDelta
            newY = Math.max(0, position.y + topDelta)
            if (resizeHandle === "top-right") {
              newWidth = Math.max(minWidth, Math.min(prevSize.width + deltaX, windowSize.width - position.x))
            }
            break
          }
        }

        setPosition({ x: newX, y: newY })
        return { width: newWidth, height: newHeight }
      })
    },
    [isResizing, isFullScreen, position, resizeHandle, windowSize, minWidth, minHeight],
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizeHandle(null)
  }, [])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("pointermove", handleResize)
      window.addEventListener("pointerup", handleResizeEnd)
      return () => {
        window.removeEventListener("pointermove", handleResize)
        window.removeEventListener("pointerup", handleResizeEnd)
      }
    }
  }, [isResizing, handleResize, handleResizeEnd])

  const startDragging = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget || isFullScreen) return

      handleFocus() // Add focus when starting drag
      setIsDragging(true)
      const dragStartX = e.clientX - position.x
      const dragStartY = e.clientY - position.y

      const handleMouseMove = (e: MouseEvent) => {
        const newX = Math.max(0, Math.min(e.clientX - dragStartX, windowSize.width - size.width))
        const newY = Math.max(0, Math.min(e.clientY - dragStartY, windowSize.height - size.height))
        setPosition({ x: newX, y: newY })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    },
    [isFullScreen, position, size, windowSize, handleFocus],
  )

  const addTab = useCallback(
    (module: string, content: React.ReactNode) => {
      const newTabId = Date.now().toString()
      setTabs((prev) => [
        ...prev,
        {
          id: newTabId,
          title: `${module} ${prev.length + 1}`,
          module,
          content,
          createdInFullscreen: isFullScreen, // Mark if created during fullscreen
        },
      ])
      setActiveTabId(newTabId)
      setIsModuleSelectOpen(false)
    },
    [isFullScreen],
  )

  const removeTab = useCallback(
    (tabId: string) => {
      if (tabs.length > 1) {
        const newTabs = tabs.filter((tab) => tab.id !== tabId)
        setTabs(newTabs)
        if (activeTabId === tabId) {
          setActiveTabId(newTabs[newTabs.length - 1].id)
        }
      }
    },
    [tabs, activeTabId],
  )

  const updateTabTitle = useCallback((tabId: string, newTitle: string) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, title: newTitle } : tab)))
  }, [])

  const getModuleContent = useCallback((module: string): React.ReactNode => {
    switch (module) {
      case "FocusTimer":
        return <FocusTimer />
      case "ResourceLibrary":
        return <ResourceLibrary />
      case "MusicPlayer":
        return <MusicPlayer />
      case "ProductivityHistory":
        return <ProductivityHistory />
      case "Notes":
        return <NotesModule />
      case "Goals":
        return <GoalsModule />
      case "StudySessions":
        return <StudySessionScheduler />
      default:
        return <div className="p-4 text-center">Module not found</div>
    }
  }, [])

  // Add this inside the ModuleSelect component
  const ModuleSelect = useCallback(
    () => (
      <Dialog open={isModuleSelectOpen} onOpenChange={setIsModuleSelectOpen}>
        <DialogContent className="modal-overlay" onMouseDown={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Select a Module</DialogTitle>
            {isFullScreen && (
              <p className="text-sm text-muted-foreground mt-1">
                Tabs created in fullscreen mode will be converted to windows when exiting fullscreen.
              </p>
            )}
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "FocusTimer", label: "Focus Timer", icon: <Clock className="h-4 w-4 mr-2" /> },
              { id: "ResourceLibrary", label: "Resource Library", icon: <BookOpen className="h-4 w-4 mr-2" /> },
              { id: "MusicPlayer", label: "Music Player", icon: <Music className="h-4 w-4 mr-2" /> },
              { id: "ProductivityHistory", label: "Productivity History", icon: <BarChart className="h-4 w-4 mr-2" /> },
              { id: "Notes", label: "Notes", icon: <FileText className="h-4 w-4 mr-2" /> },
              { id: "Goals", label: "Goals", icon: <Target className="h-4 w-4 mr-2" /> },
              { id: "StudySessions", label: "Study Sessions", icon: <BookOpen className="h-4 w-4 mr-2" /> },
            ].map((module) => (
              <Button
                key={module.id}
                onClick={() => {
                  addTab(module.id, getModuleContent(module.id))
                  // Ensure focus when adding a tab
                  handleFocus()
                }}
                className="flex items-center justify-start"
              >
                {module.icon}
                {module.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    ),
    [isModuleSelectOpen, addTab, getModuleContent, isFullScreen, handleFocus],
  )

  // Instead, modify the content container to use event capturing for focus

  // Update the render to use our wrapper function
  if (isMinimized) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={popupRef}
        className={cn(
          "fixed rounded-lg shadow-lg overflow-hidden flex flex-col",
          "bg-background/95 dark:bg-background/80 backdrop-blur-md",
          "border border-border/50 dark:border-border/30",
          isDragging ? "cursor-grabbing" : "cursor-default",
          "isolate popup-window transition-colors duration-200",
          isFocused && "popup-focus-animation ring-2 ring-primary/50",
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isFullScreen ? "100vw" : `${size.width}px`,
          height: isFullScreen ? "100vh" : `${size.height}px`,
          zIndex: currentZIndex,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseDown={handleFocus}
        onTouchStart={handleFocus}
        onClick={handleFocus}
      >
        {/* For the title bar, we need to capture clicks without interfering with existing handlers */}
        <motion.div
          className={cn(
            "flex justify-between items-center p-2",
            "bg-primary/10 dark:bg-primary/20 backdrop-blur-sm",
            "border-b border-border/50 dark:border-border/30",
          )}
          onMouseDown={(e) => {
            // First handle focus
            handleFocus()
            // Then handle dragging if the target is the title bar
            if (e.target === e.currentTarget) {
              startDragging(e)
            }
          }}
          whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-center space-x-2">
            <Grip className="h-4 w-4 text-foreground/50" />
            {isFullScreen && tabs.length > 0 && (
              <TabManager
                tabs={tabs}
                activeTabId={activeTabId}
                onTabChange={setActiveTabId}
                onTabRemove={removeTab}
                onTabTitleUpdate={updateTabTitle}
              />
            )}
          </div>
          <div className="flex items-center space-x-1">
            {isFullScreen && (
              <motion.button
                onClick={() => setIsModuleSelectOpen(true)}
                className="text-foreground/70 hover:text-foreground rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="h-3 w-3" />
              </motion.button>
            )}
            <motion.button
              onClick={onMinimize}
              className="text-foreground/70 hover:text-foreground rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              whileHover={{
                scale: 1.1,
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus className="h-3 w-3" />
            </motion.button>
            <motion.button
              onClick={toggleFullScreen}
              className="text-foreground/70 hover:text-foreground rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              whileHover={{
                scale: 1.1,
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              {isFullScreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </motion.button>
            <motion.button
              onClick={onClose}
              className="text-foreground/70 hover:text-foreground rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              whileHover={{
                scale: 1.1,
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3 w-3" />
            </motion.button>
          </div>
        </motion.div>

        {/* Instead, modify the content container to use event capturing for focus */}
        <div
          className="flex-grow overflow-auto p-4 relative"
          style={{
            height: isFullScreen ? "calc(100vh - 40px)" : "calc(100% - 40px)",
            maxHeight: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          onClick={(e) => {
            // We want to capture clicks on the content container
            if (e.currentTarget === e.target) {
              handleFocus()
            }
          }}
          onMouseDown={(e) => {
            // For mousedown events, we want to capture them at the container level
            if (e.currentTarget === e.target) {
              handleFocus()
            }
          }}
        >
          {isFullScreen
            ? tabs.length > 0
              ? tabs.find((tab) => tab.id === activeTabId)?.content || (
                  <div className="text-center text-muted-foreground">No content available</div>
                )
              : // Show original content when no tabs are created
                children
            : children}
        </div>

        {/* Add a transparent overlay to capture all clicks that bubble up */}
        {/* This ensures even clicks on child components will trigger focus */}
        {/* Add this after the content div */}
        <div
          className="absolute inset-0 pointer-events-none"
          onClick={handleFocus}
          onMouseDown={handleFocus}
          style={{ zIndex: -1 }} // Makes sure it's below all content
        />

        {!isFullScreen && (
          <>
            <motion.div
              className="absolute top-0 left-0 w-2 h-2 bg-primary/30 rounded-tl-lg cursor-nwse-resize"
              onPointerDown={handleResizeStart("top-left")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from top-left corner"
            />
            <motion.div
              className="absolute top-0 right-0 w-2 h-2 bg-primary/30 rounded-tr-lg cursor-nesw-resize"
              onPointerDown={handleResizeStart("top-right")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from top-right corner"
            />
            <motion.div
              className="absolute bottom-0 left-0 w-2 h-2 bg-primary/30 rounded-bl-lg cursor-nesw-resize"
              onPointerDown={handleResizeStart("bottom-left")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from bottom-left corner"
            />
            <motion.div
              className="absolute bottom-0 right-0 w-2 h-2 bg-primary/30 rounded-br-lg cursor-nwse-resize"
              onPointerDown={handleResizeStart("bottom-right")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from bottom-right corner"
            />
            <motion.div
              className="absolute top-0 left-2 right-2 h-1 bg-primary/30 cursor-ns-resize"
              onPointerDown={handleResizeStart("top")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from top edge"
            />
            <motion.div
              className="absolute bottom-0 left-2 right-2 h-1 bg-primary/30 cursor-ns-resize"
              onPointerDown={handleResizeStart("bottom")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from bottom edge"
            />
            <motion.div
              className="absolute left-0 top-2 bottom-2 w-1 bg-primary/30 cursor-ew-resize"
              onPointerDown={handleResizeStart("left")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from left edge"
            />
            <motion.div
              className="absolute right-0 top-2 bottom-2 w-1 bg-primary/30 cursor-ew-resize"
              onPointerDown={handleResizeStart("right")}
              whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              aria-label="Resize from right edge"
            />
          </>
        )}
        <ModuleSelect />
      </motion.div>
    </AnimatePresence>
  )
}
