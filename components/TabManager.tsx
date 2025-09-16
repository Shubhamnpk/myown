"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  title: string
  module: string
  createdInFullscreen?: boolean
}

interface TabManagerProps {
  tabs: Tab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
  onTabRemove: (tabId: string) => void
  onTabTitleUpdate: (tabId: string, newTitle: string) => void
}

export function TabManager({ tabs, activeTabId, onTabChange, onTabRemove, onTabTitleUpdate }: TabManagerProps) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null)

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
  }

  const handleTabDoubleClick = (tabId: string) => {
    setEditingTabId(tabId)
  }

  const handleTitleChange = (tabId: string, newTitle: string) => {
    onTabTitleUpdate(tabId, newTitle)
    setEditingTabId(null)
  }

  // Function to format tab title to avoid duplication
  const formatTabTitle = (tab: Tab) => {
    // If it's the first tab (Default), just show the title without the module prefix
    if (tab.id === "1" || tab.module === "Default") {
      return tab.title
    }
    // For other tabs, show just the title or the module name if title is the same as module
    return tab.title.includes(tab.module) ? tab.title : `${tab.title}`
  }

  return (
    <div className="flex space-x-1 overflow-x-auto">
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          className={cn(
            "flex items-center px-3 py-1 rounded-t-lg cursor-pointer",
            "text-sm font-medium",
            tab.id === activeTabId
              ? "bg-background text-foreground"
              : "bg-primary/5 text-foreground/70 hover:bg-primary/10",
            tab.createdInFullscreen ? "border-l-2 border-primary" : "", // Visual indicator for tabs created in fullscreen
          )}
          onClick={() => handleTabClick(tab.id)}
          onDoubleClick={() => handleTabDoubleClick(tab.id)}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          {editingTabId === tab.id ? (
            <input
              type="text"
              value={tab.title}
              onChange={(e) => handleTitleChange(tab.id, e.target.value)}
              onBlur={() => setEditingTabId(null)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleTitleChange(tab.id, (e.target as HTMLInputElement).value)
                }
              }}
              className="bg-transparent border-none focus:outline-none"
              autoFocus
            />
          ) : (
            <div className="flex items-center">
              {tab.createdInFullscreen && <Maximize2 className="h-3 w-3 mr-1 text-primary" />}
              <span>{formatTabTitle(tab)}</span>
            </div>
          )}
          {tabs.length > 1 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onTabRemove(tab.id)
              }}
              className="ml-2 text-foreground/50 hover:text-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>
  )
}
