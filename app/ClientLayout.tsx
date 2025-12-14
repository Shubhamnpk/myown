"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/utils/userManagement"
import { ThemeProvider } from "next-themes"
import { Notification } from "@/components/Notification"
import { ZIndexProvider } from "@/hooks/useZIndex"
import { MusicProvider } from "@/hooks/useMusic"
import { MusicQuickActions } from "@/components/MusicQuickActions"
import { useThemeStore } from "@/hooks/use-theme-store"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const { accentColor } = useThemeStore()

  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser()
      if (!user && pathname !== "/" && pathname !== "/login" && pathname !== "/register") {
        router.push("/")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  useEffect(() => {
    // Remove all accent classes
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('accent-')) {
        document.documentElement.classList.remove(cls)
      }
    })
    // Add current accent class
    document.documentElement.classList.add(`accent-${accentColor}`)
  }, [accentColor])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MusicProvider>
        <ZIndexProvider>
          {children}
          {notification && (
            <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
          )}
          <MusicQuickActions />
        </ZIndexProvider>
      </MusicProvider>
    </ThemeProvider>
  )
}
