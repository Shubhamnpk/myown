"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { X, Maximize2 } from "lucide-react"

interface MinimizedWindow {
  id: string
  title: string
  onRestore: () => void
  onClose: () => void
  onReopen: () => void
}

interface MinimizedWindowsBarProps {
  windows: MinimizedWindow[]
}

export function MinimizedWindowsBar({ windows }: MinimizedWindowsBarProps) {
  if (windows.length === 0) return null

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-2 flex justify-center space-x-2"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {windows.map((window) => (
          <motion.div
            key={window.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={window.onRestore}
                    className="px-3 py-1 text-sm font-medium truncate max-w-[150px] hover:bg-primary/10"
                  >
                    {window.title}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{window.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  window.onReopen()
                }}
                className="h-6 w-6 rounded-full bg-background border border-border shadow-sm"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  window.onClose()
                }}
                className="h-6 w-6 rounded-full bg-background border border-border shadow-sm ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
