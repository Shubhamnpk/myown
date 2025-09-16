"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductivityModule } from "@/components/ProductivityModule"
import { CustomizationModule } from "@/components/CustomizationModule"
import { StudySessionScheduler } from "@/components/StudySessionScheduler"
import { useProductivity } from "@/hooks/useProductivity"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Download, Upload, Trash2, Palette, Maximize2 } from "lucide-react"

interface MoreInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateDashboard: (widgets: string[], colorScheme: string, widgetSize: string) => void
  displayedWidgets: string[]
  initialTab?: string
}

export function MoreInfoModal({
  isOpen,
  onClose,
  onUpdateDashboard,
  displayedWidgets,
  initialTab = "productivity",
}: MoreInfoModalProps) {
  const { exportData, importData, clearAllData, setReminder } = useProductivity()
  const [reminderTime, setReminderTime] = useState("")
  const [activeTab, setActiveTab] = useState(initialTab)
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("en")
  const [colorScheme, setColorScheme] = useState("default")
  const [widgetSize, setWidgetSize] = useState("medium")

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const handleSetReminder = useCallback(() => {
    setReminder(reminderTime)
  }, [reminderTime, setReminder])

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result
          if (typeof content === "string") {
            importData(content)
          }
        }
        reader.readAsText(file)
      }
    },
    [importData],
  )

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
    console.log("Language changed to:", newLanguage)
  }, [])

  const handleSaveChanges = useCallback(() => {
    onUpdateDashboard(displayedWidgets, colorScheme, widgetSize)
    onClose()
  }, [displayedWidgets, colorScheme, widgetSize, onUpdateDashboard, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DialogHeader>
          <DialogTitle>Dashboard settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-lg bg-muted p-1">
            <TabsTrigger value="customize" className="data-[state=active]:bg-background">
              Customize
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-background">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="productivity">
            <ProductivityModule />
          </TabsContent>

          <TabsContent value="study-sessions">
            <StudySessionScheduler />
          </TabsContent>

          <TabsContent value="customize">
            <CustomizationModule displayedWidgets={displayedWidgets} onUpdateDashboard={onUpdateDashboard} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="reminderTime">Daily Reminder</Label>
                    <div className="flex gap-2">
                      <Input
                        id="reminderTime"
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="max-w-[200px]"
                      />
                      <Button onClick={handleSetReminder} variant="secondary">
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <Button onClick={exportData} variant="outline" className="w-full sm:w-auto">
                      Export Data
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="importData">Import Data</Label>
                      <Input
                        id="importData"
                        type="file"
                        onChange={handleImport}
                        accept=".json"
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                    <Button onClick={clearAllData} variant="destructive" className="w-full sm:w-auto">
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme" className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="colorScheme">Color Scheme</Label>
                      <Select value={colorScheme} onValueChange={setColorScheme}>
                        <SelectTrigger id="colorScheme" className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Select color scheme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Maximize2 className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="widgetSize">Widget Size</Label>
                      <Select value={widgetSize} onValueChange={setWidgetSize}>
                        <SelectTrigger id="widgetSize" className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Select widget size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  )
}
