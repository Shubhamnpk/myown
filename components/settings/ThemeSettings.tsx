"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  MonitorSpeaker,
  Type,
  ZoomIn,
  ZoomOut,
  Globe,
  Radius,
  DonutIcon as FontIcon,
  Check,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useThemeStore } from "@/hooks/use-theme-store"

interface ThemeSettingsProps {
  onNotification?: (notification: { type: "success" | "error"; message: string }) => void
}

export function ThemeSettings({ onNotification }: ThemeSettingsProps) {
  const { theme, setTheme } = useTheme()
  const { accentColor, setAccentColor } = useThemeStore()

  const [appearanceSettings, setAppearanceSettings] = useState({
    fontSize: [16],
    radius: [0.5],
    font: "Inter",
    compactMode: false,
    reducedMotion: false,
    highContrast: false,
    colorBlind: "none",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  })

  const applySettings = (settings: typeof appearanceSettings) => {
    const root = document.documentElement

    root.style.fontSize = `${settings.fontSize[0]}px`

    root.style.setProperty("--radius", `${settings.radius[0]}rem`)

    let fontFamily = "Inter, system-ui, sans-serif"
    if (settings.font === "Serif") fontFamily = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
    if (settings.font === "Mono") fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    if (settings.font === "System")
      fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    root.style.setProperty("--font-primary", fontFamily)

    if (settings.highContrast) root.classList.add("high-contrast")
    else root.classList.remove("high-contrast")

    if (settings.compactMode) root.classList.add("compact")
    else root.classList.remove("compact")

    if (settings.reducedMotion) root.classList.add("reduce-motion")
    else root.classList.remove("reduce-motion")
  }

  useEffect(() => {
    const savedSettings = localStorage.getItem("appearanceSettings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      const merged = {
        fontSize: [16],
        radius: [0.5],
        font: "Inter",
        compactMode: false,
        reducedMotion: false,
        highContrast: false,
        colorBlind: "none",
        language: "en",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        ...parsed,
      }
      setAppearanceSettings(merged)
    }
  }, [])

  // Apply and save settings immediately when they change
  useEffect(() => {
    applySettings(appearanceSettings)
    localStorage.setItem("appearanceSettings", JSON.stringify(appearanceSettings))
  }, [appearanceSettings])

  const handleReset = () => {
    const defaults = {
      fontSize: [16],
      radius: [0.5],
      font: "Inter",
      compactMode: false,
      reducedMotion: false,
      highContrast: false,
      colorBlind: "none",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    }
    setAppearanceSettings(defaults)
    applySettings(defaults)
    localStorage.setItem("appearanceSettings", JSON.stringify(defaults))
    if (onNotification) {
      onNotification({ type: "success", message: "Theme reset to defaults" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Preference
            </CardTitle>
            <CardDescription>Customize the appearance of your workspace</CardDescription>
          </div>
          <Button variant="outline" onClick={handleReset} size="sm">
            Reset to Default
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "light", name: "Light", icon: Sun, gradient: "from-white to-gray-100" },
            { id: "dark", name: "Dark", icon: Moon, gradient: "from-gray-900 to-gray-800" },
            { id: "system", name: "System", icon: Laptop, gradient: "from-blue-500 to-purple-600" },
          ].map((themeOption) => {
            const IconComponent = themeOption.icon
            return (
              <motion.div
                key={themeOption.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  theme === themeOption.id
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setTheme(themeOption.id)}
              >
                <div
                  className={`w-full h-24 rounded-lg mb-3 bg-gradient-to-br ${themeOption.gradient} flex items-center justify-center`}
                >
                  <IconComponent className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <div className="text-center font-medium">{themeOption.name}</div>
              </motion.div>
            )
          })}
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Radius className="h-4 w-4" />
            Interface
          </h4>

          <div className="grid gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Corner Radius: {appearanceSettings.radius[0]}rem</Label>
              </div>
              <Slider
                value={appearanceSettings.radius}
                onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, radius: value })}
                min={0}
                max={1.5}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <FontIcon className="h-4 w-4" />
                Font Family
              </Label>
              <Select
                value={appearanceSettings.font}
                onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, font: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter (Default)</SelectItem>
                  <SelectItem value="System">System UI</SelectItem>
                  <SelectItem value="Serif">Serif</SelectItem>
                  <SelectItem value="Mono">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Accent Color
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'default', color: 'bg-gray-500', name: 'Default' },
              { value: 'purple', color: 'bg-purple-500', name: 'Purple' },
              { value: 'blue', color: 'bg-blue-500', name: 'Blue' },
              { value: 'green', color: 'bg-green-500', name: 'Green' },
              { value: 'red', color: 'bg-red-500', name: 'Red' },
              { value: 'orange', color: 'bg-orange-500', name: 'Orange' },
              { value: 'pink', color: 'bg-pink-500', name: 'Pink' },
              { value: 'teal', color: 'bg-teal-500', name: 'Teal' },
              { value: 'yellow', color: 'bg-yellow-500', name: 'Yellow' },
            ].map(({ value, color, name }) => (
              <motion.button
                key={value}
                onClick={() => setAccentColor(value)}
                className="group relative flex flex-col items-center gap-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={name}
              >
                <div
                  className={cn(
                    'relative w-10 h-10 rounded-lg border-2 transition-all shadow-sm',
                    color,
                    accentColor === value
                      ? 'border-foreground ring-2 ring-primary/20 scale-110'
                      : 'border-transparent hover:border-foreground/30'
                  )}
                >
                  {accentColor === value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white drop-shadow-lg" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <MonitorSpeaker className="h-4 w-4" />
            Display Settings
          </h4>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
              </div>
              <Switch
                checked={appearanceSettings.compactMode}
                onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, compactMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast</Label>
                <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
              </div>
              <Switch
                checked={appearanceSettings.highContrast}
                onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, highContrast: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize interface animations</p>
              </div>
              <Switch
                checked={appearanceSettings.reducedMotion}
                onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, reducedMotion: checked })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Color Blind Support</Label>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
              <Select
                value={appearanceSettings.colorBlind}
                onValueChange={(value) => {
                  setAppearanceSettings({ ...appearanceSettings, colorBlind: value })
                  if (value !== "none" && onNotification) {
                    onNotification({ type: "error", message: "Color blind support coming soon!" })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-weak)</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-weak)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-weak)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size: {appearanceSettings.fontSize[0]}px
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setAppearanceSettings({
                    ...appearanceSettings,
                    fontSize: [Math.max(12, appearanceSettings.fontSize[0] - 1)],
                  })
                }
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setAppearanceSettings({
                    ...appearanceSettings,
                    fontSize: [Math.min(24, appearanceSettings.fontSize[0] + 1)],
                  })
                }
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Slider
            value={appearanceSettings.fontSize}
            onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, fontSize: value })}
            min={12}
            max={24}
            step={1}
            className="w-full"
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Language & Region
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="language">Language</Label>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
              <Select
                value={appearanceSettings.language}
                onValueChange={(value) => {
                  setAppearanceSettings({ ...appearanceSettings, language: value })
                  if (value !== "en" && onNotification) {
                    onNotification({ type: "error", message: "Multi-language support coming soon!" })
                  }
                }}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select
                value={appearanceSettings.timeFormat}
                onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, timeFormat: value })}
              >
                <SelectTrigger id="timeFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                  <SelectItem value="24h">24-hour (14:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
