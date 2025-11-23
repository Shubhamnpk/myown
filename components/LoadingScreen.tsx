"use client"

import { useState, useEffect } from "react"
import { Loader2, Sparkles, Coffee, Brain, Zap, Mouse, Rocket, Smile } from "lucide-react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [hover, setHover] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  const productivityTips = [
    { icon: Coffee, text: "Take regular breaks - they boost productivity!" },
    { icon: Brain, text: "Try the Pomodoro Technique: 25 min work, 5 min rest" },
    { icon: Zap, text: "Tackle your hardest task first thing in the morning" },
    { icon: Rocket, text: "Set only 3 main goals for each day" },
    { icon: Smile, text: "Remember to stay hydrated! 💧" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 50)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % productivityTips.length)
    }, 3000)
    return () => clearInterval(tipInterval)
  }, [])

  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1)
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 1000)
  }

  const getClickMessage = () => {
    if (clickCount === 0) return ""
    if (clickCount < 5) return "Keep clicking! 🎯"
    if (clickCount < 10) return "You're getting there! 🚀"
    if (clickCount < 15) return "Almost unlocked a secret! ✨"
    return "You found the secret! 🎉 You're really productive at clicking!"
  }

  const gradientStyle = hover
    ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
    : "bg-gradient-to-br from-gray-900 via-gray-800 to-black"

  interface TipProps {
    tip: {
      icon: React.ComponentType<{ className?: string }>
      text: string
    }
  }

  const Tip: React.FC<TipProps> = ({ tip }) => {
    if (!tip || !tip.icon || !tip.text) {
      return null
    }

    const { icon: Icon, text } = tip

    return (
      <div className="flex items-center justify-center space-x-2 text-white/80 text-sm">
        <Icon className="w-4 h-4" />
        <span>{text}</span>
      </div>
    )
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${gradientStyle} transition-colors duration-700`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="text-center px-4 max-w-md">
        <div className="relative mb-8 cursor-pointer select-none" onClick={handleLogoClick}>
          <Sparkles
            className={`absolute -top-6 -right-6 w-8 h-8 text-yellow-300 opacity-0 transition-opacity duration-500 ${
              hover ? "opacity-100" : ""
            }`}
          />
          <h1
            className={`text-4xl font-bold text-white tracking-tight transition-transform duration-300 ${
              isSpinning ? "rotate-360" : ""
            }`}
          >
            myown
          </h1>
          <div className="text-white/60 text-xs mt-2">{getClickMessage()}</div>
        </div>

        <div className="flex justify-center items-center space-x-3 mb-8">
          <Loader2 className={`w-5 h-5 text-white animate-spin ${clickCount > 10 ? "animate-bounce" : ""}`} />
          <span className="text-white/80 text-sm font-medium">Loading your workspace</span>
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-lg backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
          <Tip tip={productivityTips[currentTip]} />
        </div>

        <div className="relative w-64 mx-auto">
          <div
            className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onMouseEnter={() => setIsSpinning(true)}
            onMouseLeave={() => setIsSpinning(false)}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-white/60">{progress}%</span>
        </div>

        <div className="mt-8 space-y-1">
          {[
            { label: "Gathering productivity boosters...", complete: progress > 30 },
            { label: "Optimizing your workflow...", complete: progress > 60 },
            { label: "Preparing for maximum efficiency...", complete: progress > 90 },
          ].map((step, index) => (
            <div
              key={index}
              className={`text-sm transition-opacity duration-500 ${step.complete ? "text-white/80" : "text-white/20"}`}
            >
              {step.label}
            </div>
          ))}
        </div>

        <Mouse className={`w-6 h-6 text-white/40 mx-auto mt-6 ${hover ? "animate-bounce" : ""}`} />
      </div>
    </div>
  )
}
