"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  BarChart,
  Clock,
  Target,
  Calendar,
  TrendingUp,
  Heart,
  Star,
  Filter,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Layout,
  Move,
  Maximize2,
  CheckSquare,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardWidget {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  category: string
  size: "small" | "medium" | "large"
  popularity: number
  isVisible: boolean
  isFavorite: boolean
  position: { x: number; y: number }
  dimensions: { width: number; height: number }
  content: React.ReactNode
}

interface CustomizationModuleProps {
  displayedWidgets: string[]
  onUpdateDashboard: (widgets: string[]) => void
}

const createWidgetContent = (widgetId: string) => {
  switch (widgetId) {
    case "lastScore":
      return (
        <div className="p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">8.5</div>
          <div className="text-sm text-muted-foreground">Last Score</div>
        </div>
      )
    case "streak":
      return (
        <div className="p-4 text-center">
          <div className="text-3xl font-bold text-green-600">12</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
      )
    case "tip":
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Daily Tip</span>
          </div>
          <p className="text-xs text-muted-foreground">Take regular breaks to maintain focus and productivity.</p>
        </div>
      )
    case "chart":
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Progress Chart</span>
          </div>
          <div className="h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded flex items-end justify-around p-2">
            {[40, 65, 80, 55, 90, 75, 85].map((height, i) => (
              <div key={i} className="bg-blue-500 rounded-t" style={{ height: `${height}%`, width: "8px" }} />
            ))}
          </div>
        </div>
      )
    case "time":
      return (
        <div className="p-4 text-center">
          <div className="text-2xl font-bold">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</div>
        </div>
      )
    case "todo":
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Todo List</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 border rounded" />
              <span>Review project proposal</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="line-through text-muted-foreground">Complete daily standup</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 border rounded" />
              <span>Update documentation</span>
            </div>
          </div>
        </div>
      )
    case "goals":
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Goals</span>
          </div>
          <div className="space-y-2">
            <div className="text-xs">
              <div className="flex justify-between mb-1">
                <span>Learn React</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            <div className="text-xs">
              <div className="flex justify-between mb-1">
                <span>Exercise Daily</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>
      )
    case "calendar":
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Calendar</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-center font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className={cn("text-center p-1 rounded", i === 15 ? "bg-blue-500 text-white" : "hover:bg-muted")}
              >
                {i < 31 ? i + 1 : ""}
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return <div className="p-4 text-center text-muted-foreground">Widget Content</div>
  }
}

const availableWidgets: DashboardWidget[] = [
  {
    id: "lastScore",
    name: "Last Score",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Display your most recent productivity score",
    category: "productivity",
    size: "small",
    popularity: 95,
    isVisible: true,
    isFavorite: false,
    position: { x: 0, y: 0 },
    dimensions: { width: 200, height: 120 },
    content: createWidgetContent("lastScore"),
  },
  {
    id: "streak",
    name: "Streak Counter",
    icon: <Target className="h-4 w-4" />,
    description: "Track your consecutive productive days",
    category: "productivity",
    size: "small",
    popularity: 88,
    isVisible: true,
    isFavorite: false,
    position: { x: 220, y: 0 },
    dimensions: { width: 200, height: 120 },
    content: createWidgetContent("streak"),
  },
  {
    id: "tip",
    name: "Daily Tip",
    icon: <Lightbulb className="h-4 w-4" />,
    description: "Get personalized productivity tips",
    category: "motivation",
    size: "medium",
    popularity: 76,
    isVisible: true,
    isFavorite: false,
    position: { x: 440, y: 0 },
    dimensions: { width: 300, height: 150 },
    content: createWidgetContent("tip"),
  },
  {
    id: "chart",
    name: "Progress Chart",
    icon: <BarChart className="h-4 w-4" />,
    description: "Visualize your productivity trends",
    category: "analytics",
    size: "large",
    popularity: 92,
    isVisible: true,
    isFavorite: false,
    position: { x: 0, y: 140 },
    dimensions: { width: 400, height: 200 },
    content: createWidgetContent("chart"),
  },
  {
    id: "time",
    name: "Current Time",
    icon: <Clock className="h-4 w-4" />,
    description: "Display current time and date",
    category: "utility",
    size: "small",
    popularity: 65,
    isVisible: true,
    isFavorite: false,
    position: { x: 420, y: 140 },
    dimensions: { width: 200, height: 120 },
    content: createWidgetContent("time"),
  },
  {
    id: "todo",
    name: "Todo List",
    icon: <CheckSquare className="h-4 w-4" />,
    description: "Quick access to your tasks",
    category: "productivity",
    size: "medium",
    popularity: 89,
    isVisible: true,
    isFavorite: false,
    position: { x: 0, y: 360 },
    dimensions: { width: 300, height: 180 },
    content: createWidgetContent("todo"),
  },
  {
    id: "goals",
    name: "Goals Widget",
    icon: <Target className="h-4 w-4" />,
    description: "Track your personal goals",
    category: "productivity",
    size: "medium",
    popularity: 84,
    isVisible: true,
    isFavorite: false,
    position: { x: 320, y: 360 },
    dimensions: { width: 300, height: 180 },
    content: createWidgetContent("goals"),
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: <Calendar className="h-4 w-4" />,
    description: "View upcoming events and dates",
    category: "utility",
    size: "large",
    popularity: 78,
    isVisible: true,
    isFavorite: false,
    position: { x: 640, y: 140 },
    dimensions: { width: 280, height: 300 },
    content: createWidgetContent("calendar"),
  },
]

export function CustomizationModule({ displayedWidgets, onUpdateDashboard }: CustomizationModuleProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(availableWidgets)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")
  const [previewDevice, setPreviewDevice] = useState("desktop")
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [resizingWidget, setResizingWidget] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const previewRef = useRef<HTMLDivElement>(null)

  const categories = ["all", "productivity", "analytics", "motivation", "utility"]

  useEffect(() => {
    setWidgets((prev) =>
      prev.map((widget) => ({
        ...widget,
        isVisible: displayedWidgets.includes(widget.id),
        content: createWidgetContent(widget.id),
      })),
    )
  }, [displayedWidgets])

  const filteredWidgets = widgets
    .filter((widget) => {
      const matchesSearch = widget.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "popularity":
          return b.popularity - a.popularity
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const toggleWidget = (widgetId: string) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === widgetId ? { ...widget, isVisible: !widget.isVisible } : widget,
    )
    setWidgets(updatedWidgets)

    const visibleWidgetIds = updatedWidgets.filter((w) => w.isVisible).map((w) => w.id)
    onUpdateDashboard(visibleWidgetIds)
  }

  const toggleFavorite = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((widget) => (widget.id === widgetId ? { ...widget, isFavorite: !widget.isFavorite } : widget)),
    )
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, widgetId: string, action: "drag" | "resize") => {
      e.preventDefault()
      const widget = widgets.find((w) => w.id === widgetId)
      if (!widget) return

      if (action === "drag") {
        setDraggedWidget(widgetId)
        setDragOffset({
          x: e.clientX - widget.position.x,
          y: e.clientY - widget.position.y,
        })
      } else if (action === "resize") {
        setResizingWidget(widgetId)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: widget.dimensions.width,
          height: widget.dimensions.height,
        })
      }
    },
    [widgets],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggedWidget) {
        const previewRect = previewRef.current?.getBoundingClientRect()
        if (!previewRect) return

        const newX = Math.max(0, Math.min(e.clientX - previewRect.left - dragOffset.x, previewRect.width - 200))
        const newY = Math.max(0, Math.min(e.clientY - previewRect.top - dragOffset.y, previewRect.height - 120))

        setWidgets((prev) =>
          prev.map((widget) => (widget.id === draggedWidget ? { ...widget, position: { x: newX, y: newY } } : widget)),
        )
      }

      if (resizingWidget) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newWidth = Math.max(150, resizeStart.width + deltaX)
        const newHeight = Math.max(100, resizeStart.height + deltaY)

        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === resizingWidget ? { ...widget, dimensions: { width: newWidth, height: newHeight } } : widget,
          ),
        )
      }
    },
    [draggedWidget, resizingWidget, dragOffset, resizeStart],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedWidget(null)
    setResizingWidget(null)
  }, [])

  useEffect(() => {
    if (draggedWidget || resizingWidget) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedWidget, resizingWidget, handleMouseMove, handleMouseUp])

  const getSizeColor = (size: string) => {
    switch (size) {
      case "small":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "large":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "text-green-500"
    if (popularity >= 80) return "text-yellow-500"
    return "text-gray-500"
  }

  const getPreviewScale = () => {
    switch (previewDevice) {
      case "mobile":
        return 0.4
      case "tablet":
        return 0.6
      default:
        return 0.8
    }
  }

  const getPreviewDimensions = () => {
    switch (previewDevice) {
      case "mobile":
        return { width: 375, height: 667 }
      case "tablet":
        return { width: 768, height: 1024 }
      default:
        return { width: 1200, height: 800 }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Studio</h2>
            <p className="text-blue-100 mt-1">Design your perfect workspace with drag & drop</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold">{widgets.filter((w) => w.isVisible).length}</div>
              <div className="text-blue-200">Active</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{widgets.filter((w) => w.isFavorite).length}</div>
              <div className="text-blue-200">Favorites</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="designer" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4">
          <TabsTrigger value="designer" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Designer
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Live Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="designer" className="flex-1 px-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Widget Library */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Widget Library</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filters */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search widgets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Widget List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredWidgets.map((widget) => (
                      <motion.div
                        key={widget.id}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all",
                          widget.isVisible ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50",
                        )}
                        onClick={() => toggleWidget(widget.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-1 bg-primary/10 rounded">{widget.icon}</div>
                            <div>
                              <div className="font-medium text-sm">{widget.name}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className={getSizeColor(widget.size)}>
                                  {widget.size}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  <Star className={cn("h-3 w-3", getPopularityColor(widget.popularity))} />
                                  <span className="text-xs text-muted-foreground">{widget.popularity}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(widget.id)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Heart
                                className={cn(
                                  "h-3 w-3 transition-colors",
                                  widget.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400",
                                )}
                              />
                            </Button>
                            {widget.isVisible ? (
                              <Eye className="h-3 w-3 text-green-500" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Design Canvas</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={previewDevice === "desktop" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("desktop")}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "tablet" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("tablet")}
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "mobile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("mobile")}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="relative h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                    <div
                      ref={previewRef}
                      className="relative bg-white dark:bg-gray-800 shadow-lg mx-auto"
                      style={{
                        width: `${getPreviewDimensions().width * getPreviewScale()}px`,
                        height: `${getPreviewDimensions().height * getPreviewScale()}px`,
                        transform: `scale(${getPreviewScale()})`,
                        transformOrigin: "top center",
                        marginTop: "20px",
                      }}
                    >
                      {widgets
                        .filter((w) => w.isVisible)
                        .map((widget) => (
                          <motion.div
                            key={widget.id}
                            className={cn(
                              "absolute bg-white dark:bg-gray-700 border rounded-lg shadow-sm overflow-hidden group",
                              draggedWidget === widget.id && "shadow-lg ring-2 ring-blue-500",
                              resizingWidget === widget.id && "ring-2 ring-purple-500",
                            )}
                            style={{
                              left: widget.position.x * getPreviewScale(),
                              top: widget.position.y * getPreviewScale(),
                              width: widget.dimensions.width * getPreviewScale(),
                              height: widget.dimensions.height * getPreviewScale(),
                              cursor: draggedWidget === widget.id ? "grabbing" : "grab",
                            }}
                            whileHover={{ scale: 1.02 }}
                            onMouseDown={(e) => handleMouseDown(e, widget.id, "drag")}
                          >
                            {/* Widget Content */}
                            <div
                              className="h-full overflow-hidden"
                              style={{ transform: `scale(${getPreviewScale()})`, transformOrigin: "top left" }}
                            >
                              {widget.content}
                            </div>

                            {/* Drag Handle */}
                            <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="p-1 bg-blue-500 text-white rounded cursor-grab">
                                <Move className="h-3 w-3" />
                              </div>
                            </div>

                            {/* Resize Handle */}
                            <div
                              className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-nw-resize"
                              onMouseDown={(e) => {
                                e.stopPropagation()
                                handleMouseDown(e, widget.id, "resize")
                              }}
                            >
                              <div className="p-1 bg-purple-500 text-white rounded">
                                <Maximize2 className="h-3 w-3" />
                              </div>
                            </div>

                            {/* Widget Info */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Badge variant="secondary" className="text-xs">
                                {widget.name}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}

                      {widgets.filter((w) => w.isVisible).length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Layout className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">Start Designing</h3>
                            <p className="text-sm">Click widgets from the library to add them to your dashboard</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="theme" className="flex-1 px-4 pb-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Theme options will be available in future updates.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 px-4 pb-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Dashboard Preview</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewDevice === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="relative h-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto">
                <div
                  className="relative bg-white dark:bg-gray-800 shadow-xl mx-auto my-8 rounded-lg overflow-hidden"
                  style={{
                    width: `${getPreviewDimensions().width}px`,
                    height: `${getPreviewDimensions().height}px`,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  {widgets
                    .filter((w) => w.isVisible)
                    .map((widget) => (
                      <div
                        key={widget.id}
                        className="absolute bg-white dark:bg-gray-700 border rounded-lg shadow-sm overflow-hidden"
                        style={{
                          left: widget.position.x,
                          top: widget.position.y,
                          width: widget.dimensions.width,
                          height: widget.dimensions.height,
                        }}
                      >
                        {widget.content}
                      </div>
                    ))}

                  {widgets.filter((w) => w.isVisible).length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Monitor className="h-24 w-24 mx-auto mb-6 opacity-50" />
                        <h3 className="text-2xl font-medium mb-4">Your Dashboard Preview</h3>
                        <p className="text-lg">Add widgets from the Designer tab to see them here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
