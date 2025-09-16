"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

type NotificationType = "success" | "error"

interface NotificationProps {
  type: NotificationType
  message: string
  duration?: number
  onClose: () => void
}

export function Notification({ type, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 flex items-center p-4 mb-4 text-sm rounded-lg",
        type === "success"
          ? "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400"
          : "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400",
      )}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => {
          setIsVisible(false)
          onClose()
        }}
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
