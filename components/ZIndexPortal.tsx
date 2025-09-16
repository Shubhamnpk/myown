"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useZIndex } from "@/hooks/useZIndex"

interface ZIndexPortalProps {
  children: ReactNode
  type: "popup" | "dropdown" | "modal" | "modal-in-popup"
  id?: string
  isOpen?: boolean
  className?: string
}

export function ZIndexPortal({ children, type, id, isOpen = true, className = "" }: ZIndexPortalProps) {
  const { getNewZIndex } = useZIndex()
  const [mounted, setMounted] = useState(false)
  const portalRef = useRef<HTMLDivElement | null>(null)
  const [zIndex, setZIndex] = useState<number | null>(null)

  useEffect(() => {
    // Create portal container
    if (!portalRef.current) {
      const div = document.createElement("div")
      div.style.position = "absolute"
      div.style.top = "0"
      div.style.left = "0"
      div.style.width = "100%"
      div.style.height = "100%"
      div.style.pointerEvents = "none"
      div.className = className
      portalRef.current = div
    }

    // Set z-index
    if (isOpen && !zIndex) {
      const newZIndex = getNewZIndex(type)
      setZIndex(newZIndex)
      if (portalRef.current) {
        portalRef.current.style.zIndex = newZIndex.toString()
      }
    }

    // Add to DOM
    if (isOpen && portalRef.current && !mounted) {
      document.body.appendChild(portalRef.current)
      setMounted(true)
    }

    return () => {
      // Clean up
      if (portalRef.current && mounted) {
        document.body.removeChild(portalRef.current)
        setMounted(false)
        setZIndex(null)
      }
    }
  }, [isOpen, mounted, type, getNewZIndex, className])

  // Don't render anything on the server
  if (!mounted || !isOpen) return null

  // Use createPortal to render children into the portal container
  return createPortal(
    <div className={`stacking-context ${type}-container`} style={{ pointerEvents: "auto" }}>
      {children}
    </div>,
    portalRef.current!,
  )
}
