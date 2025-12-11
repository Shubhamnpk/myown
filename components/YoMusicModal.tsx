"use client"

import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

interface YoMusicButtonProps {
  onClick: () => void
}

export function YoMusicButton({ onClick }: YoMusicButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
    >
      <Music className="mr-2 h-4 w-4" /> YoMusic
    </Button>
  )
}
