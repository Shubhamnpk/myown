"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Settings,
  Palette,
  Bell,
  Shield,
  Database,
  Moon,
  Sun,
  Volume2,
  Globe,
  Lock,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  HardDrive,
  FileText,
  BarChart3,
  Calendar,
  Target,
} from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [currentUser, setCurrentUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=80&width=80",
  })

  const [settings, setSettings] = useState({
    theme: "system",
    language: "en",
    timezone: "UTC",
    notifications: {
      push: true,
      email: true,
      desktop: false,
      sound: true,
    },
    privacy: {
      analytics: true,
      crashReports: true,
      autoSave: true,
    },
    appearance: {
      compactMode: false,
      highContrast: false,
      animations: true,
      fontSize: [14],
      sidebarWidth: [280],
    },
    audio: {
      masterVolume: [75],
      notificationVolume: [50],
      muted: false,
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [dataRetention, setDataRetention] = useState([30])

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const getStorageInfo = () => {
    return {
      total: "2.4 GB",
      used: "1.2 GB",
      breakdown: [
        { name: "Productivity Data", size: "450 MB", icon: BarChart3, color: "bg-blue-500" },
        { name: "Notes & Documents", size: "320 MB", icon: FileText, color: "bg-green-500" },
        { name: "Calendar Events", size: "180 MB", icon: Calendar, color: "bg-purple-500" },
        { name: "Goals & Tasks", size: "150 MB", icon: Target, color: "bg-orange-500" },
        { name: "Settings & Cache", size: "100 MB", icon: Settings, color: "bg-gray-500" },
      ],
    }
  }

  const storageInfo = getStorageInfo()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gradient-to-b from-blue-600 to-purple-700 text-white p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-white">Settings</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="account" orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-2">
                <TabsTrigger
                  value="account"
                  className="w-full justify-start bg-white/10 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <User className="h-4 w-4 mr-3" />
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="w-full justify-start bg-white/10 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <Palette className="h-4 w-4 mr-3" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="w-full justify-start bg-white/10 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="w-full justify-start bg-white/10 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger
                  value="data"
                  className="w-full justify-start bg-white/10 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <Database className="h-4 w-4 mr-3" />
                  Data
                </TabsTrigger>
              </TabsList>

              {/* Content */}
              <div className="flex-1 bg-white text-gray-900 overflow-y-auto">
                <TabsContent value="account" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Account Settings</h3>

                    {/* Profile Section */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                            <AvatarFallback className="text-2xl">
                              {currentUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-xl font-semibold">{currentUser.name}</h4>
                            <p className="text-muted-foreground">{currentUser.email}</p>
                            <Badge variant="secondary" className="mt-1">
                              Premium Member
                            </Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={currentUser.name}
                              onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={currentUser.email}
                              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600">Update Profile</Button>
                      </CardContent>
                    </Card>

                    {/* Security Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="h-5 w-5" />
                          Security & Authentication
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="password">Change Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Login Notifications</h4>
                            <p className="text-sm text-muted-foreground">Get notified of new sign-ins</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Appearance Settings</h3>

                    {/* Theme Selection */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Theme Preference</CardTitle>
                        <CardDescription>Choose how the interface looks and feels</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: "light", name: "Light", icon: Sun, preview: "bg-white border-2" },
                            { id: "dark", name: "Dark", icon: Moon, preview: "bg-gray-900 border-2" },
                            {
                              id: "system",
                              name: "System",
                              icon: Settings,
                              preview: "bg-gradient-to-br from-white to-gray-900 border-2",
                            },
                          ].map((theme) => {
                            const IconComponent = theme.icon
                            return (
                              <motion.div
                                key={theme.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                                  settings.theme === theme.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => handleSettingChange("", "theme", theme.id)}
                              >
                                <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview}`} />
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  <span className="font-medium">{theme.name}</span>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Interface Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Interface Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Compact Mode</Label>
                              <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                            </div>
                            <Switch
                              checked={settings.appearance.compactMode}
                              onCheckedChange={(value) => handleSettingChange("appearance", "compactMode", value)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>High Contrast</Label>
                              <p className="text-sm text-muted-foreground">Improve readability with higher contrast</p>
                            </div>
                            <Switch
                              checked={settings.appearance.highContrast}
                              onCheckedChange={(value) => handleSettingChange("appearance", "highContrast", value)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Animations</Label>
                              <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                            </div>
                            <Switch
                              checked={settings.appearance.animations}
                              onCheckedChange={(value) => handleSettingChange("appearance", "animations", value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Font Size: {settings.appearance.fontSize[0]}px</Label>
                            <Slider
                              value={settings.appearance.fontSize}
                              onValueChange={(value) => handleSettingChange("appearance", "fontSize", value)}
                              min={12}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label>Sidebar Width: {settings.appearance.sidebarWidth[0]}px</Label>
                            <Slider
                              value={settings.appearance.sidebarWidth}
                              onValueChange={(value) => handleSettingChange("appearance", "sidebarWidth", value)}
                              min={200}
                              max={400}
                              step={20}
                              className="mt-2"
                            />
                          </div>
                        </div>

                        {/* Audio Settings */}
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <Volume2 className="h-4 w-4" />
                            Audio Settings
                          </h4>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Mute All Sounds</Label>
                              <p className="text-sm text-muted-foreground">Disable all audio feedback</p>
                            </div>
                            <Switch
                              checked={settings.audio.muted}
                              onCheckedChange={(value) => handleSettingChange("audio", "muted", value)}
                            />
                          </div>

                          <div>
                            <Label>Master Volume: {settings.audio.masterVolume[0]}%</Label>
                            <Slider
                              value={settings.audio.masterVolume}
                              onValueChange={(value) => handleSettingChange("audio", "masterVolume", value)}
                              min={0}
                              max={100}
                              step={5}
                              className="mt-2"
                              disabled={settings.audio.muted}
                            />
                          </div>

                          <div>
                            <Label>Notification Volume: {settings.audio.notificationVolume[0]}%</Label>
                            <Slider
                              value={settings.audio.notificationVolume}
                              onValueChange={(value) => handleSettingChange("audio", "notificationVolume", value)}
                              min={0}
                              max={100}
                              step={5}
                              className="mt-2"
                              disabled={settings.audio.muted}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Notification Settings</h3>

                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          Push Notifications
                        </CardTitle>
                        <CardDescription>Control how and when you receive notifications</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">Push Notifications</h4>
                              <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.notifications.push}
                            onCheckedChange={(value) => handleSettingChange("notifications", "push", value)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-green-500" />
                            <div>
                              <h4 className="font-medium">Email Notifications</h4>
                              <p className="text-sm text-muted-foreground">Get updates via email</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.notifications.email}
                            onCheckedChange={(value) => handleSettingChange("notifications", "email", value)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Volume2 className="h-5 w-5 text-purple-500" />
                            <div>
                              <h4 className="font-medium">Sound Notifications</h4>
                              <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.notifications.sound}
                            onCheckedChange={(value) => handleSettingChange("notifications", "sound", value)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Language</Label>
                            <Select
                              value={settings.language}
                              onValueChange={(value) => handleSettingChange("", "language", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                                <SelectItem value="zh">中文</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Timezone</Label>
                            <Select
                              value={settings.timezone}
                              onValueChange={(value) => handleSettingChange("", "timezone", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UTC">UTC</SelectItem>
                                <SelectItem value="EST">Eastern Time</SelectItem>
                                <SelectItem value="PST">Pacific Time</SelectItem>
                                <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                                <SelectItem value="CET">Central European Time</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Privacy & Security</h3>

                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Data Collection
                        </CardTitle>
                        <CardDescription>Control what data we collect to improve your experience</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Analytics & Usage Data</h4>
                            <p className="text-sm text-muted-foreground">
                              Help us improve the app with anonymous usage data
                            </p>
                          </div>
                          <Switch
                            checked={settings.privacy.analytics}
                            onCheckedChange={(value) => handleSettingChange("privacy", "analytics", value)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Crash Reports</h4>
                            <p className="text-sm text-muted-foreground">
                              Automatically send crash reports to help fix bugs
                            </p>
                          </div>
                          <Switch
                            checked={settings.privacy.crashReports}
                            onCheckedChange={(value) => handleSettingChange("privacy", "crashReports", value)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Auto-save Data</h4>
                            <p className="text-sm text-muted-foreground">
                              Automatically save your work and preferences
                            </p>
                          </div>
                          <Switch
                            checked={settings.privacy.autoSave}
                            onCheckedChange={(value) => handleSettingChange("privacy", "autoSave", value)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Data Retention</CardTitle>
                        <CardDescription>Control how long we keep your data</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label>Delete data older than: {dataRetention[0]} days</Label>
                            <Slider
                              value={dataRetention}
                              onValueChange={setDataRetention}
                              min={7}
                              max={365}
                              step={7}
                              className="mt-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>1 week</span>
                              <span>1 year</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="data" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Data Management</h3>

                    {/* Storage Overview */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HardDrive className="h-5 w-5" />
                          Storage Overview
                        </CardTitle>
                        <CardDescription>
                          Using {storageInfo.used} of {storageInfo.total} available storage
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                              style={{ width: "50%" }}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {storageInfo.breakdown.map((item, index) => {
                              const IconComponent = item.icon
                              return (
                                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                  <div className={`p-2 rounded-lg ${item.color}`}>
                                    <IconComponent className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.size}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Data Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Export Data</h4>
                              <p className="text-sm text-muted-foreground">Download all your data in JSON format</p>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-transparent" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export All Data
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                              <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Import Data</h4>
                              <p className="text-sm text-muted-foreground">Restore data from a backup file</p>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-transparent" variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Import Data
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                              <Save className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Create Backup</h4>
                              <p className="text-sm text-muted-foreground">Save a complete backup of your data</p>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-transparent" variant="outline">
                            <Save className="h-4 w-4 mr-2" />
                            Create Backup
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200 dark:border-red-800">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-600 dark:text-red-400">Clear All Data</h4>
                              <p className="text-sm text-muted-foreground">Permanently delete all your data</p>
                            </div>
                          </div>
                          <Button className="w-full mt-4" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All Data
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
