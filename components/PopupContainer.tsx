"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useZIndex } from "@/hooks/useZIndex"

interface PopupContainerProps {
  children: ReactNode
  id: string
  isOpen: boolean
  onFocus?: () => void
  className?: string
}

export function PopupContainer({ children, id, isOpen, onFocus, className = "" }: PopupContainerProps) {
  const { registerPopup, unregisterPopup, getPopupZIndex, bringToFront } = useZIndex()
  const zIndexRef = useRef<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Register the popup when it opens
      zIndexRef.current = registerPopup(id)
    }

    return () => {
      // Unregister the popup when it closes or unmounts
      if (zIndexRef.current) {
        unregisterPopup(id)
        zIndexRef.current = null
      }
    }
  }, [id, isOpen, registerPopup, unregisterPopup])

  const handleFocus = () => {
    bringToFront(id)
    onFocus?.()
  }

  if (!isOpen) return null

  return (
    <motion.div
      className={`stacking-context popup-window ${className}`}
      style={{ zIndex: getPopupZIndex(id) }}
      onClick={handleFocus}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}
