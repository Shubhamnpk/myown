"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Info, ExternalLink, Github, Mail, Sparkles, Heart, Code, Users } from "lucide-react"

interface AboutSettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

export function AboutSettings({ onNotification }: AboutSettingsProps) {
  const [systemInfo, setSystemInfo] = useState<{ browser: string; os: string } | null>(null)

  const appInfo = {
    name: "MyOwn",
    version: "1.2.0",
    description: "Your all-in-one productivity solution for seamless task management, resource organization, and performance tracking.",
    author: "MyOwn Team",
    website: "https://",
    github: "https://",
    support: "N/A",
  }

  const features = [
    "Task Management",
    "Focus Timers",
    "Goal Tracking",
    "Resource Library",
    "Productivity Analytics",
    "Music Integration",
    "Notes & Study Sessions",
  ]

  useEffect(() => {
    // Get system info
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

    setSystemInfo({ browser, os })
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(appInfo.support)
    onNotification({ type: "success", message: "Email copied to clipboard!" })
  }

  const handleCheckUpdates = () => {
    onNotification({ type: "success", message: "You are running the latest version!" })
  }

  return (
    <div className="space-y-6">
      {/* Main About Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{appInfo.name}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            Version <Badge variant="secondary">{appInfo.version}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{appInfo.description}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            Developed with love by {appInfo.author}
          </div>
          <Button onClick={handleCheckUpdates} variant="outline" size="sm">
            Check for Updates
          </Button>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      {systemInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Browser:</span> {systemInfo.browser}
              </div>
              <div>
                <span className="font-medium">Operating System:</span> {systemInfo.os}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connect & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start gap-2" asChild>
              <a href={appInfo.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            </Button>
            <Button variant="outline" className="justify-start gap-2" asChild>
              <a href={appInfo.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                View Source
              </a>
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Need Help?</h4>
            <Button variant="outline" className="justify-start gap-2 w-full" onClick={handleCopyEmail}>
              <Mail className="h-4 w-4" />
              {appInfo.support}
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Legal</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); onNotification({ type: "error", message: "Privacy Policy coming soon!" }) }}>
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); onNotification({ type: "error", message: "Terms of Service coming soon!" }) }}>
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); onNotification({ type: "error", message: "License information coming soon!" }) }}>
                License
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}