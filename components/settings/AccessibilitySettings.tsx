"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Volume2,
  RotateCcw,
  Keyboard,
  Type,
  Palette,
  MousePointer,
  Zap,
  Headphones,
  Monitor,
  Accessibility,
  Settings,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface AccessibilitySettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

export function AccessibilitySettings({ onNotification }: AccessibilitySettingsProps) {
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    textToSpeech: false,
    voiceVolume: [75],
    contrastLevel: [100],
    textSpacing: [100],
    cursorSize: [100],
    animations: true,
    highContrast: false,
    dyslexiaFont: false,
    colorBlindMode: "none",
    autoPlay: false,
    soundEffects: true,
    tabNavigation: true,
    skipLinks: true,
    fontSize: [16],
    lineHeight: [1.5],
    wordSpacing: [0],
    letterSpacing: [0],
  })

  const applyAccessibilitySettings = (settings: typeof accessibilitySettings) => {
    const root = document.documentElement

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Animations
    if (!settings.animations) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Dyslexia-friendly font
    if (settings.dyslexiaFont) {
      root.classList.add("dyslexia-font")
    } else {
      root.classList.remove("dyslexia-font")
    }

    // Color blind mode
    if (settings.colorBlindMode !== "none") {
      root.classList.add(`colorblind-${settings.colorBlindMode}`)
    } else {
      root.classList.remove("colorblind-deuteranopia", "colorblind-protanopia", "colorblind-tritanopia")
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add("enhanced-focus")
    } else {
      root.classList.remove("enhanced-focus")
    }

    // Skip links
    if (settings.skipLinks) {
      root.classList.add("skip-links-enabled")
    } else {
      root.classList.remove("skip-links-enabled")
    }

    // Screen reader optimizations
    if (settings.screenReader) {
      root.setAttribute("aria-live", "polite")
      root.setAttribute("aria-label", "Screen reader mode enabled")
    } else {
      root.removeAttribute("aria-live")
      root.removeAttribute("aria-label")
    }

    // Typography settings
    root.style.setProperty("--contrast-level", `${settings.contrastLevel[0]}%`)
    root.style.setProperty("--font-size", `${settings.fontSize[0]}px`)
    root.style.setProperty("--line-height", `${settings.lineHeight[0]}`)
    root.style.setProperty("--word-spacing", `${settings.wordSpacing[0]}px`)
    root.style.setProperty("--letter-spacing", `${settings.letterSpacing[0]}px`)

    // Text spacing
    const spacing = settings.textSpacing[0] / 100
    root.style.setProperty("--text-spacing", `${spacing}`)

    // Cursor size
    root.style.setProperty("--cursor-size", `${settings.cursorSize[0]}%`)
  }

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      const merged = {
        screenReader: false,
        keyboardNavigation: true,
        focusIndicators: true,
        textToSpeech: false,
        voiceVolume: [75],
        contrastLevel: [100],
        textSpacing: [100],
        cursorSize: [100],
        animations: true,
        highContrast: false,
        dyslexiaFont: false,
        colorBlindMode: "none",
        autoPlay: false,
        soundEffects: true,
        tabNavigation: true,
        skipLinks: true,
        fontSize: [16],
        lineHeight: [1.5],
        wordSpacing: [0],
        letterSpacing: [0],
        ...parsed,
      }
      setAccessibilitySettings(merged)
      applyAccessibilitySettings(merged)
    }
  }, [])

  // Apply settings immediately and save to localStorage
  useEffect(() => {
    applyAccessibilitySettings(accessibilitySettings)
    localStorage.setItem("accessibilitySettings", JSON.stringify(accessibilitySettings))
  }, [accessibilitySettings])

  const handleReset = () => {
    const defaults = {
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      textToSpeech: false,
      voiceVolume: [75],
      contrastLevel: [100],
      textSpacing: [100],
      cursorSize: [100],
      animations: true,
      highContrast: false,
      dyslexiaFont: false,
      colorBlindMode: "none",
      autoPlay: false,
      soundEffects: true,
      tabNavigation: true,
      skipLinks: true,
      fontSize: [16],
      lineHeight: [1.5],
      wordSpacing: [0],
      letterSpacing: [0],
    }
    setAccessibilitySettings(defaults)
    applyAccessibilitySettings(defaults)
    localStorage.setItem("accessibilitySettings", JSON.stringify(defaults))
    onNotification({ type: "success", message: "Accessibility settings reset to defaults!" })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Accessibility className="h-6 w-6 text-primary" />
                Accessibility Settings
              </CardTitle>
              <CardDescription className="text-base">
                Customize your experience to match your accessibility needs
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset All
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Visual & Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual & Display
          </CardTitle>
          <CardDescription>Customize visual elements for better readability and comfort</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-medium">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">Increase contrast for better visibility and readability</p>
              </div>
              <Switch
                checked={accessibilitySettings.highContrast}
                onCheckedChange={(checked) =>
                  setAccessibilitySettings({ ...accessibilitySettings, highContrast: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-medium">Dyslexia-Friendly Font</Label>
                <p className="text-sm text-muted-foreground">Use OpenDyslexic font for better reading experience</p>
              </div>
              <Switch
                checked={accessibilitySettings.dyslexiaFont}
                onCheckedChange={(checked) =>
                  setAccessibilitySettings({ ...accessibilitySettings, dyslexiaFont: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-medium">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions for vestibular disorders</p>
              </div>
              <Switch
                checked={!accessibilitySettings.animations}
                onCheckedChange={(checked) =>
                  setAccessibilitySettings({ ...accessibilitySettings, animations: !checked })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <h4 className="font-medium flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography & Spacing
            </h4>
            <div className="grid gap-6">
              <div>
                <Label className="text-sm font-medium">Font Size: {accessibilitySettings.fontSize[0]}px</Label>
                <Slider
                  value={accessibilitySettings.fontSize}
                  onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, fontSize: value })}
                  min={12}
                  max={24}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Line Height: {accessibilitySettings.lineHeight[0]}</Label>
                <Slider
                  value={accessibilitySettings.lineHeight}
                  onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, lineHeight: value })}
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Letter Spacing: {accessibilitySettings.letterSpacing[0]}px</Label>
                <Slider
                  value={accessibilitySettings.letterSpacing}
                  onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, letterSpacing: value })}
                  min={0}
                  max={5}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Word Spacing: {accessibilitySettings.wordSpacing[0]}px</Label>
                <Slider
                  value={accessibilitySettings.wordSpacing}
                  onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, wordSpacing: value })}
                  min={0}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color & Vision Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color & Vision
          </CardTitle>
          <CardDescription>Settings for color vision deficiencies and visual preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Color Blind Support</Label>
              <p className="text-sm text-muted-foreground">Adjust colors for different types of color blindness</p>
            </div>
            <select
              value={accessibilitySettings.colorBlindMode}
              onChange={(e) => setAccessibilitySettings({ ...accessibilitySettings, colorBlindMode: e.target.value })}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="none">None</option>
              <option value="deuteranopia">Deuteranopia (Green-blind)</option>
              <option value="protanopia">Protanopia (Red-blind)</option>
              <option value="tritanopia">Tritanopia (Blue-blind)</option>
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium">Contrast Level: {accessibilitySettings.contrastLevel[0]}%</Label>
            <Slider
              value={accessibilitySettings.contrastLevel}
              onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, contrastLevel: value })}
              min={50}
              max={200}
              step={10}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Higher contrast helps with low vision</p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation & Interaction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Navigation & Interaction
          </CardTitle>
          <CardDescription>Enhance keyboard navigation and interaction methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Enhanced Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">Enable comprehensive keyboard shortcuts and navigation</p>
            </div>
            <Switch
              checked={accessibilitySettings.keyboardNavigation}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, keyboardNavigation: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Tab Navigation</Label>
              <p className="text-sm text-muted-foreground">Improve tab order and keyboard navigation flow</p>
            </div>
            <Switch
              checked={accessibilitySettings.tabNavigation}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, tabNavigation: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Visible Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">Show clear focus outlines on all interactive elements</p>
            </div>
            <Switch
              checked={accessibilitySettings.focusIndicators}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, focusIndicators: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Skip Links</Label>
              <p className="text-sm text-muted-foreground">Allow skipping to main content for screen readers</p>
            </div>
            <Switch
              checked={accessibilitySettings.skipLinks}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, skipLinks: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Pointer & Cursor Settings
            </Label>
            <div>
              <Label className="text-sm font-medium">Cursor Size: {accessibilitySettings.cursorSize[0]}%</Label>
              <Slider
                value={accessibilitySettings.cursorSize}
                onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, cursorSize: value })}
                min={100}
                max={300}
                step={25}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio & Speech */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Audio & Speech
          </CardTitle>
          <CardDescription>Configure audio feedback and speech-related features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Screen Reader Support</Label>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Optimize interface for screen reader compatibility</p>
            </div>
            <Switch
              checked={accessibilitySettings.screenReader}
              onCheckedChange={(checked) => {
                setAccessibilitySettings({ ...accessibilitySettings, screenReader: checked })
                if (checked) {
                  onNotification({ type: "error", message: "Advanced screen reader optimizations coming soon!" })
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Text-to-Speech</Label>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Enable spoken feedback for text content</p>
            </div>
            <Switch
              checked={accessibilitySettings.textToSpeech}
              onCheckedChange={(checked) => {
                setAccessibilitySettings({ ...accessibilitySettings, textToSpeech: checked })
                if (checked) {
                  onNotification({ type: "error", message: "Text-to-speech feature coming soon!" })
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Enable audio feedback for actions and notifications</p>
            </div>
            <Switch
              checked={accessibilitySettings.soundEffects}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, soundEffects: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Auto-play Media</Label>
              <p className="text-sm text-muted-foreground">Allow videos and audio to play automatically</p>
            </div>
            <Switch
              checked={accessibilitySettings.autoPlay}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, autoPlay: checked })
              }
            />
          </div>

          {accessibilitySettings.textToSpeech && (
            <div>
              <Label className="text-sm font-medium">Voice Volume: {accessibilitySettings.voiceVolume[0]}%</Label>
              <Slider
                value={accessibilitySettings.voiceVolume}
                onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, voiceVolume: value })}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accessibility Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Accessibility Information
          </CardTitle>
          <CardDescription>Learn about accessibility features and keyboard shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Current Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Enhanced Focus Indicators:</span>
                <Badge variant={accessibilitySettings.focusIndicators ? "default" : "secondary"}>
                  {accessibilitySettings.focusIndicators ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>High Contrast Mode:</span>
                <Badge variant={accessibilitySettings.highContrast ? "default" : "secondary"}>
                  {accessibilitySettings.highContrast ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Reduced Motion:</span>
                <Badge variant={!accessibilitySettings.animations ? "default" : "secondary"}>
                  {!accessibilitySettings.animations ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              Keyboard Shortcuts
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div><kbd className="px-2 py-1 bg-background border rounded text-xs">Tab</kbd> Navigate forward</div>
              <div><kbd className="px-2 py-1 bg-background border rounded text-xs">Shift + Tab</kbd> Navigate backward</div>
              <div><kbd className="px-2 py-1 bg-background border rounded text-xs">Enter</kbd> Activate focused element</div>
              <div><kbd className="px-2 py-1 bg-background border rounded text-xs">Space</kbd> Toggle switches and checkboxes</div>
              <div><kbd className="px-2 py-1 bg-background border rounded text-xs">Esc</kbd> Close dialogs and menus</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
