"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Define z-index ranges for different UI elements
const Z_INDEX_RANGES = {
  BASE: 1,
  POPUP_MIN: 50,
  DROPDOWN: 100,
  POPUP_CONTENT: 200,
  MODAL_IN_POPUP: 300,
  GLOBAL_MODAL: 9999,
}

interface ZIndexContextType {
  getNewZIndex: (type: "popup" | "dropdown" | "modal" | "modal-in-popup") => number
  bringToFront: (id: string) => void
  registerPopup: (id: string) => number
  unregisterPopup: (id: string) => void
  getPopupZIndex: (id: string) => number
  isTopMostPopup: (id: string) => boolean
}

interface ZIndexProviderProps {
  children: ReactNode
}

const ZIndexContext = createContext<ZIndexContextType | undefined>(undefined)

export function ZIndexProvider({ children }: ZIndexProviderProps) {
  // Track all active popups and their z-indices
  const [popups, setPopups] = useState<Map<string, number>>(new Map())
  // Track the highest z-index used so far
  const [highestZIndex, setHighestZIndex] = useState(Z_INDEX_RANGES.POPUP_MIN)

  // Register a new popup and assign it a z-index
  const registerPopup = useCallback(
    (id: string) => {
      const newZIndex = highestZIndex + 1
      setPopups((prev) => {
        const newMap = new Map(prev)
        newMap.set(id, newZIndex)
        return newMap
      })
      setHighestZIndex(newZIndex)
      return newZIndex
    },
    [highestZIndex],
  )

  // Unregister a popup when it's closed
  const unregisterPopup = useCallback((id: string) => {
    setPopups((prev) => {
      const newMap = new Map(prev)
      newMap.delete(id)
      return newMap
    })
  }, [])

  // Get the z-index for a specific popup
  const getPopupZIndex = useCallback(
    (id: string) => {
      return popups.get(id) || Z_INDEX_RANGES.POPUP_MIN
    },
    [popups],
  )

  // Enhance the bringToFront function to provide better z-index management
  const bringToFront = useCallback(
    (id: string) => {
      if (!popups.has(id)) return

      // Calculate the new z-index to be higher than all existing popups
      const allZIndices = Array.from(popups.values())
      const newZIndex = Math.max(...allZIndices, highestZIndex) + 1

      setPopups((prev) => {
        const newMap = new Map(prev)
        newMap.set(id, newZIndex)
        return newMap
      })
      setHighestZIndex(newZIndex)

      return newZIndex
    },
    [popups, highestZIndex],
  )

  // Get a new z-index for a specific type of UI element
  const getNewZIndex = useCallback(
    (type: "popup" | "dropdown" | "modal" | "modal-in-popup") => {
      let baseZIndex: number

      switch (type) {
        case "popup":
          baseZIndex = Z_INDEX_RANGES.POPUP_MIN
          break
        case "dropdown":
          baseZIndex = Z_INDEX_RANGES.DROPDOWN
          break
        case "modal-in-popup":
          baseZIndex = Z_INDEX_RANGES.MODAL_IN_POPUP
          break
        case "modal":
          baseZIndex = Z_INDEX_RANGES.GLOBAL_MODAL
          break
        default:
          baseZIndex = Z_INDEX_RANGES.BASE
      }

      return Math.max(baseZIndex, highestZIndex + 1)
    },
    [highestZIndex],
  )

  // Add a new function to check if a popup is the top-most one
  const isTopMostPopup = useCallback(
    (id: string) => {
      if (!popups.has(id)) return false

      const thisZIndex = popups.get(id) || 0
      const maxZIndex = Math.max(...Array.from(popups.values()))

      return thisZIndex === maxZIndex
    },
    [popups],
  )

  // Add the new function to the context value
  return (
    <ZIndexContext.Provider
      value={{
        getNewZIndex,
        bringToFront,
        registerPopup,
        unregisterPopup,
        getPopupZIndex,
        isTopMostPopup, // Add the new function
      }}
    >
      {children}
    </ZIndexContext.Provider>
  )
}

export function useZIndex() {
  const context = useContext(ZIndexContext)
  if (context === undefined) {
    throw new Error("useZIndex must be used within a ZIndexProvider")
  }
  return context
}
