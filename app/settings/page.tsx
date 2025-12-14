"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Palette, Shield, Eye, Info, Database, ChevronLeft } from "lucide-react"
import { getCurrentUser, isGuest } from "@/utils/userManagement"
import { Notification } from "@/components/Notification"
import { ProfileSettings } from "@/components/settings/ProfileSettings"
import { ThemeSettings } from "@/components/settings/ThemeSettings"
import { SecuritySettings } from "@/components/settings/SecuritySettings"
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings"
import { AboutSettings } from "@/components/settings/AboutSettings"
import { DataSettings } from "@/components/settings/DataSettings"

export default function SettingsPage() {
  const router = useRouter()
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [user, setUser] = useState(getCurrentUser())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
    }
  }, [router])

  if (!mounted) {
    return null
  }

  const handleNotification = (notif: { type: "success" | "error"; message: string }) => {
    setNotification(notif)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isGuest() && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                Guest Mode
              </Badge>
            )}
            <Avatar className="h-9 w-9">
              {user?.profilePic ? (
                <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.name} />
              ) : (
                <AvatarFallback>
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="profile" className="space-y-8">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid h-auto p-1">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="theme"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="accessibility"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Accessibility</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <ProfileSettings onNotification={handleNotification} />
            </motion.div>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <ThemeSettings onNotification={handleNotification} />
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <SecuritySettings onNotification={handleNotification} />
            </motion.div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <AccessibilitySettings onNotification={handleNotification} />
            </motion.div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <AboutSettings onNotification={handleNotification} />
            </motion.div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <DataSettings onNotification={handleNotification} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}
    </div>
  )
}
