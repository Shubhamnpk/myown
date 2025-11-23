"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Eye, Volume2, Save } from "lucide-react"

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
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings")
    if (savedSettings) {
      setAccessibilitySettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSaveAccessibility = () => {
    localStorage.setItem("accessibilitySettings", JSON.stringify(accessibilitySettings))
    // Apply settings logic would go here
    if (accessibilitySettings.animations === false) {
      document.documentElement.style.setProperty("--animation-speed", "0.01s")
    } else {
      document.documentElement.style.removeProperty("--animation-speed")
    }
    onNotification({ type: "success", message: "Accessibility settings saved!" })
  }

  return (
    <div className="space-y-6">
      {/* Visual Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual Accessibility
          </CardTitle>
          <CardDescription>Customize visual elements for better readability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
              </div>
              <Switch
                checked={accessibilitySettings.focusIndicators}
                onCheckedChange={(checked) =>
                  setAccessibilitySettings({ ...accessibilitySettings, focusIndicators: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
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

          <div className="space-y-4">
            <div>
              <Label>Contrast Level: {accessibilitySettings.contrastLevel[0]}%</Label>
              <Slider
                value={accessibilitySettings.contrastLevel}
                onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, contrastLevel: value })}
                min={50}
                max={150}
                step={10}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Text Spacing: {accessibilitySettings.textSpacing[0]}%</Label>
              <Slider
                value={accessibilitySettings.textSpacing}
                onValueChange={(value) => setAccessibilitySettings({ ...accessibilitySettings, textSpacing: value })}
                min={100}
                max={200}
                step={10}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Cursor Size: {accessibilitySettings.cursorSize[0]}%</Label>
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

      {/* Keyboard & Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard & Navigation</CardTitle>
          <CardDescription>Enhance keyboard navigation and control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Enhanced Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">Enable advanced keyboard shortcuts</p>
            </div>
            <Switch
              checked={accessibilitySettings.keyboardNavigation}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, keyboardNavigation: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Visible Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">Show clear focus outlines on interactive elements</p>
            </div>
            <Switch
              checked={accessibilitySettings.focusIndicators}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, focusIndicators: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader & Audio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Screen Reader & Audio
          </CardTitle>
          <CardDescription>Configure text-to-speech and audio feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Screen Reader Support</Label>
              <p className="text-sm text-muted-foreground">Optimize for screen reader compatibility</p>
            </div>
            <Switch
              checked={accessibilitySettings.screenReader}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, screenReader: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Text-to-Speech</Label>
              <p className="text-sm text-muted-foreground">Enable spoken feedback for text content</p>
            </div>
            <Switch
              checked={accessibilitySettings.textToSpeech}
              onCheckedChange={(checked) =>
                setAccessibilitySettings({ ...accessibilitySettings, textToSpeech: checked })
              }
            />
          </div>
          {accessibilitySettings.textToSpeech && (
            <div>
              <Label>Voice Volume: {accessibilitySettings.voiceVolume[0]}%</Label>
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
          <Button onClick={handleSaveAccessibility} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Accessibility Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
