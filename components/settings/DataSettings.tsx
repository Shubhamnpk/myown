"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Database, Download, Upload, HardDrive, PieChart, FileText, CloudUpload, CloudDownload, BarChart3, ChevronDown, ChevronUp } from "lucide-react"

interface DataSettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

interface DataCategory {
  name: string
  keys: string[]
  size: number
  description: string
}

export function DataSettings({ onNotification }: DataSettingsProps) {
  const [totalSize, setTotalSize] = useState(0)
  const [categories, setCategories] = useState<DataCategory[]>([])
  const [exportSelections, setExportSelections] = useState<Record<string, boolean>>({})
  const [importSelections, setImportSelections] = useState<Record<string, boolean>>({})
  const [isExportExpanded, setIsExportExpanded] = useState(false)
  const [isImportExpanded, setIsImportExpanded] = useState(false)
  const [isStorageDistributionExpanded, setIsStorageDistributionExpanded] = useState(false)

  useEffect(() => {
    calculateStorageData()
  }, [])

  const calculateStorageData = () => {
    const allKeys = Object.keys(localStorage)
    let total = 0
    const categoryMap: Record<string, string[]> = {
      user: [],
      settings: [],
      productivity: [],
      other: [],
    }

    allKeys.forEach(key => {
      const value = localStorage.getItem(key) || ""
      const size = (key.length + value.length) * 2 // Rough byte estimate
      total += size

      if (key.includes("user") || key.includes("currentUser")) {
        categoryMap.user.push(key)
      } else if (key.includes("settings") || key.includes("theme") || key.includes("appearance") || key.includes("accessibility")) {
        categoryMap.settings.push(key)
      } else if (key.includes("productivity") || key.includes("entries") || key.includes("streak")) {
        categoryMap.productivity.push(key)
      } else {
        categoryMap.other.push(key)
      }
    })

    const categoryData: DataCategory[] = [
      {
        name: "User Data",
        keys: categoryMap.user,
        size: categoryMap.user.reduce((sum, key) => sum + (localStorage.getItem(key)?.length || 0) * 2, 0),
        description: "Profile information and account data"
      },
      {
        name: "Settings",
        keys: categoryMap.settings,
        size: categoryMap.settings.reduce((sum, key) => sum + (localStorage.getItem(key)?.length || 0) * 2, 0),
        description: "Theme, accessibility, and app preferences"
      },
      {
        name: "Productivity Data",
        keys: categoryMap.productivity,
        size: categoryMap.productivity.reduce((sum, key) => sum + (localStorage.getItem(key)?.length || 0) * 2, 0),
        description: "Tasks, timers, and performance records"
      },
      {
        name: "Other",
        keys: categoryMap.other,
        size: categoryMap.other.reduce((sum, key) => sum + (localStorage.getItem(key)?.length || 0) * 2, 0),
        description: "Miscellaneous app data"
      },
    ]

    setTotalSize(total)
    setCategories(categoryData)

    // Initialize selections
    const allSelected = categoryData.reduce((acc, cat) => {
      acc[cat.name] = true
      return acc
    }, {} as Record<string, boolean>)
    setExportSelections(allSelected)
    setImportSelections({ ...allSelected })
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleExport = () => {
    const selectedCategories = categories.filter(cat => exportSelections[cat.name])
    const exportData: Record<string, any> = {}

    selectedCategories.forEach(cat => {
      cat.keys.forEach(key => {
        const value = localStorage.getItem(key)
        if (value) {
          exportData[key] = JSON.parse(value)
        }
      })
    })

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `myown-data-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    onNotification({ type: "success", message: "Data exported successfully!" })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string)
        const selectedCategories = categories.filter(cat => importSelections[cat.name])

        selectedCategories.forEach(cat => {
          cat.keys.forEach(key => {
            if (importData[key] !== undefined) {
              localStorage.setItem(key, JSON.stringify(importData[key]))
            }
          })
        })

        onNotification({ type: "success", message: "Data imported successfully! Please refresh the page." })
        calculateStorageData() // Recalculate after import
      } catch (error) {
        onNotification({ type: "error", message: "Invalid file format" })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Storage Overview
          </CardTitle>
          <CardDescription>Monitor your app's local storage usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">{formatBytes(totalSize)}</p>
              <p className="text-sm text-muted-foreground">Total storage used</p>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <HardDrive className="h-12 w-12 text-primary/60 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Local Storage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Distribution */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg"
          onClick={() => setIsStorageDistributionExpanded(!isStorageDistributionExpanded)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Storage Distribution
            </div>
            {isStorageDistributionExpanded ? (
              <ChevronUp className="h-5 w-5 text-primary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-primary" />
            )}
          </CardTitle>
          <CardDescription>Breakdown by data category</CardDescription>
        </CardHeader>
        {isStorageDistributionExpanded && (
          <CardContent className="space-y-6">
            {/* Category List */}
            <div className="space-y-2">
              {categories.map((category, index) => {
                const percentage = totalSize > 0 ? (category.size / totalSize) * 100 : 0
                const colors = [
                  { accent: "bg-slate-100 dark:bg-slate-900/50", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-800" },
                  { accent: "bg-gray-100 dark:bg-gray-900/50", text: "text-gray-700 dark:text-gray-300", border: "border-gray-200 dark:border-gray-800" },
                  { accent: "bg-zinc-100 dark:bg-zinc-900/50", text: "text-zinc-700 dark:text-zinc-300", border: "border-zinc-200 dark:border-zinc-800" },
                  { accent: "bg-stone-100 dark:bg-stone-900/50", text: "text-stone-700 dark:text-stone-300", border: "border-stone-200 dark:border-stone-800" },
                ]
                const colorScheme = colors[index % colors.length]
                
                return (
                  <div
                    key={category.name}
                    className={`p-4 ${colorScheme.accent} ${colorScheme.border} border rounded-lg hover:bg-muted/30 transition-all duration-200 group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-muted-foreground/60 group-hover:bg-primary/60 transition-colors`} />
                        <div>
                          <h4 className={`font-medium ${colorScheme.text}`}>{category.name}</h4>
                          <p className="text-xs text-muted-foreground/70">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${colorScheme.text}`}>
                          {formatBytes(category.size)}
                        </div>
                        <div className="text-xs text-muted-foreground/60">
                          {percentage.toFixed(1)}% • {category.keys.length} items
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Export and Import Data in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Data */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
          <CardHeader
            className="cursor-pointer hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-colors rounded-t-lg"
            onClick={() => setIsExportExpanded(!isExportExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-green-700 dark:text-green-400">
              <div className="flex items-center gap-2">
                <CloudDownload className="h-5 w-5" />
                Export Data
              </div>
              {isExportExpanded ? (
                <ChevronUp className="h-5 w-5 text-green-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-green-600" />
              )}
            </CardTitle>
            <CardDescription>Download your data as a JSON file for backup</CardDescription>
          </CardHeader>
          {isExportExpanded && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select categories to export:</Label>
                <div className="grid gap-3">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`export-${category.name}`}
                        checked={exportSelections[category.name] || false}
                        onCheckedChange={(checked) =>
                          setExportSelections({ ...exportSelections, [category.name]: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <Label htmlFor={`export-${category.name}`} className="font-medium cursor-pointer">
                          {category.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{formatBytes(category.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleExport} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4" />
                Export Selected Data
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Import Data */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardHeader
            className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors rounded-t-lg"
            onClick={() => setIsImportExpanded(!isImportExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-blue-700 dark:text-blue-400">
              <div className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Import Data
              </div>
              {isImportExpanded ? (
                <ChevronUp className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-600" />
              )}
            </CardTitle>
            <CardDescription>Upload and restore data from a JSON file</CardDescription>
          </CardHeader>
          {isImportExpanded && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select categories to import:</Label>
                <div className="grid gap-3">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`import-${category.name}`}
                        checked={importSelections[category.name] || false}
                        onCheckedChange={(checked) =>
                          setImportSelections({ ...importSelections, [category.name]: checked as boolean })
                        }
                      />
                      <Label htmlFor={`import-${category.name}`} className="font-medium cursor-pointer flex-1">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="import-file" className="text-sm font-medium">Select JSON file:</Label>
                <div className="relative">
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="w-full p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <FileText className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}