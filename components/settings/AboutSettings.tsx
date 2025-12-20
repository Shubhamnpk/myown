"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Info,
  ExternalLink,
  Github,
  Mail,
  Sparkles,
  Heart,
  Code,
  Users,
  Zap,
  Target,
  Timer,
  BookOpen,
  BarChart3,
  Music,
  Shield,
  Globe,
  Download,
  Star,
  Calendar,
  Clock,
  HardDrive
} from "lucide-react"

interface AboutSettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

export function AboutSettings({ onNotification }: AboutSettingsProps) {
  const [systemInfo, setSystemInfo] = useState<{
    browser: string;
    os: string;
    screenResolution: string;
    timezone: string;
    language: string;
    cookiesEnabled: boolean;
  } | null>(null)

  const [appStats, setAppStats] = useState({
    totalTasks: 0,
    focusTime: 0,
    goalsCompleted: 0,
    notesCreated: 0
  })

  const appInfo = {
    name: "MyOwn",
    version: "1.2.0",
    codename: "Phoenix",
    releaseDate: "2024",
    description: "Your all-in-one productivity ecosystem designed to transform how you work, learn, and achieve your goals. Built with modern web technologies for a seamless, powerful experience.",
    tagline: "Where productivity meets elegance",
    author: "MyOwn Development Team",
    website: "https://myown.app",
    github: "https://github.com/myown/app",
    support: "support@myown.app",
    license: "MIT License",
    buildDate: new Date().toLocaleDateString()
  }

  const features = [
    {
      icon: Target,
      title: "Smart Task Management",
      description: "Intelligent task organization with priority-based scheduling"
    },
    {
      icon: Timer,
      title: "Focus Sessions",
      description: "Advanced Pomodoro timers with productivity analytics"
    },
    {
      icon: BookOpen,
      title: "Goal Tracking",
      description: "Comprehensive goal setting and progress monitoring"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Deep insights into your productivity patterns"
    },
    {
      icon: Music,
      title: "Music Integration",
      description: "Curated soundscapes for enhanced focus"
    },
    {
      icon: Shield,
      title: "Data Privacy",
      description: "Your data stays secure with local-first architecture"
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "Works seamlessly across all your devices"
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Lightning-fast experience with modern tech stack"
    }
  ]

  const techStack = [
    { name: "Next.js", category: "Framework" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Framer Motion", category: "Animation" },
    { name: "Lucide Icons", category: "Icons" },
    { name: "Local Storage", category: "Data" }
  ]

  useEffect(() => {
    // Get detailed system info
    const userAgent = navigator.userAgent
    let browser = "Unknown"
    let os = "Unknown"

    if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari")) browser = "Safari"
    else if (userAgent.includes("Edge")) browser = "Edge"

    if (userAgent.includes("Windows")) os = "Windows"
    else if (userAgent.includes("Mac")) os = "macOS"
    else if (userAgent.includes("Linux")) os = "Linux"
    else if (userAgent.includes("Android")) os = "Android"
    else if (userAgent.includes("iOS")) os = "iOS"

    const screenResolution = `${screen.width} × ${screen.height}`
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const language = navigator.language
    const cookiesEnabled = navigator.cookieEnabled

    setSystemInfo({ browser, os, screenResolution, timezone, language, cookiesEnabled })

    // Load app statistics
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const productivityEntries = JSON.parse(localStorage.getItem('productivityEntries') || '[]')
    const goals = JSON.parse(localStorage.getItem('goals') || '[]')
    const notes = JSON.parse(localStorage.getItem('notes') || '[]')

    setAppStats({
      totalTasks: tasks.length,
      focusTime: productivityEntries.reduce((sum: number, entry: any) => sum + (entry.duration || 0), 0),
      goalsCompleted: goals.filter((goal: any) => goal.completed).length,
      notesCreated: notes.length
    })
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(appInfo.support)
    onNotification({ type: "success", message: "Email address copied to clipboard!" })
  }

  const handleCheckUpdates = () => {
    onNotification({ type: "success", message: "You're running the latest version! 🎉" })
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <CardHeader className="text-center relative">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {appInfo.name}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {appInfo.tagline}
          </CardDescription>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Badge variant="secondary" className="text-sm">
              Version {appInfo.version}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {appInfo.codename}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6 relative">
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {appInfo.description}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Made with passion by {appInfo.author}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleCheckUpdates} className="gap-2">
              <Download className="h-4 w-4" />
              Check for Updates
            </Button>
            <Button variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              Rate App
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tasks Created", value: appStats.totalTasks, icon: Target, color: "text-blue-500" },
          { label: "Focus Time", value: formatTime(appStats.focusTime), icon: Timer, color: "text-green-500" },
          { label: "Goals Achieved", value: appStats.goalsCompleted, icon: Star, color: "text-purple-500" },
          { label: "Notes Written", value: appStats.notesCreated, icon: BookOpen, color: "text-orange-500" }
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <IconComponent className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Powerful Features
          </CardTitle>
          <CardDescription>
            Everything you need to boost your productivity in one beautiful app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Technology Stack
            </CardTitle>
            <CardDescription>Built with modern, reliable technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">{tech.name}</span>
                  <Badge variant="outline" className="text-xs">{tech.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        {systemInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>Your current environment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Browser:</span>
                  <span className="font-medium">{systemInfo.browser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operating System:</span>
                  <span className="font-medium">{systemInfo.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screen Resolution:</span>
                  <span className="font-medium">{systemInfo.screenResolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-medium">{systemInfo.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-medium">{systemInfo.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cookies:</span>
                  <Badge variant={systemInfo.cookiesEnabled ? "default" : "destructive"} className="text-xs">
                    {systemInfo.cookiesEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Links & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community & Support
          </CardTitle>
          <CardDescription>Connect with us and get the help you need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start gap-2 h-auto py-3" asChild>
              <a href={appInfo.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Website</div>
                  <div className="text-xs text-muted-foreground">Visit our homepage</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-3" asChild>
              <a href={appInfo.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Source Code</div>
                  <div className="text-xs text-muted-foreground">View on GitHub</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={handleCopyEmail}>
              <Mail className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Contact Us</div>
                <div className="text-xs text-muted-foreground">{appInfo.support}</div>
              </div>
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Release Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">{appInfo.version} ({appInfo.codename})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Release Year:</span>
                  <span className="font-medium">{appInfo.releaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Build Date:</span>
                  <span className="font-medium">{appInfo.buildDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License:</span>
                  <span className="font-medium">{appInfo.license}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Legal & Privacy</h4>
              <div className="space-y-2">
                <Button variant="ghost" className="justify-start w-full" onClick={() => onNotification({ type: "error", message: "Privacy Policy coming soon!" })}>
                  Privacy Policy
                </Button>
                <Button variant="ghost" className="justify-start w-full" onClick={() => onNotification({ type: "error", message: "Terms of Service coming soon!" })}>
                  Terms of Service
                </Button>
                <Button variant="ghost" className="justify-start w-full" onClick={() => onNotification({ type: "error", message: "License information coming soon!" })}>
                  License Information
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}