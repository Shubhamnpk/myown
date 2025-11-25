"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProductivity } from "@/hooks/useProductivity"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Download, Upload, Trash2, TrendingUp, Target, Clock } from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  activities: string
  interests: string
  goalsScore: number
  learningScore: number
  prosConsScore: number
  totalScore: number
}

export function ProductivityHistory() {
  const { entries, addEntry, updateEntry, deleteEntry } = useProductivity()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "totalScore">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"list" | "chart">("list")
  const [chartType, setChartType] = useState<"line" | "bar">("line")

  const filteredAndSortedEntries = entries
    .filter(
      (entry) =>
        (!startDate || entry.date >= startDate) &&
        (!endDate || entry.date <= endDate),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
      } else {
        return sortOrder === "asc" ? a.totalScore - b.totalScore : b.totalScore - a.totalScore
      }
    })


  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "productivity_history.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === "string") {
          try {
            const importedData = JSON.parse(content)
            importedData.forEach((entry: JournalEntry) => addEntry(entry))
            alert("Data imported successfully!")
          } catch (error) {
            alert("Error importing data. Please ensure the file is valid JSON.")
          }
        }
      }
      reader.readAsText(file)
    }
  }

  const getProductivityInsights = () => {
    if (entries.length === 0) return "No data available for insights."

    const averageProductivity = entries.reduce((sum, entry) => sum + entry.totalScore, 0) / entries.length
    const mostProductiveDay = entries.reduce((max, entry) => (entry.totalScore > max.totalScore ? entry : max))
    const leastProductiveDay = entries.reduce((min, entry) => (entry.totalScore < min.totalScore ? entry : min))

    return `
      Average Total Score: ${averageProductivity.toFixed(2)}
      Most Productive Day: ${mostProductiveDay.date} (${mostProductiveDay.totalScore.toFixed(2)})
      Least Productive Day: ${leastProductiveDay.date} (${leastProductiveDay.totalScore.toFixed(2)})
    `
  }

  const renderChart = () => {
    const ChartComponent = chartType === "line" ? LineChart : BarChart
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={filteredAndSortedEntries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {chartType === "line" ? (
            <Line type="monotone" dataKey="totalScore" stroke="#8884d8" activeDot={{ r: 8 }} />
          ) : (
            <Bar dataKey="totalScore" fill="#8884d8" />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Productivity History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "totalScore")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="totalScore">Total Score</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setViewMode(viewMode === "list" ? "chart" : "list")}>
            {viewMode === "list" ? "Show Chart" : "Show List"}
          </Button>
          {viewMode === "chart" && (
            <Select value={chartType} onValueChange={(value) => setChartType(value as "line" | "bar")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        {viewMode === "chart" ? (
          renderChart()
        ) : (
          <div className="space-y-4">
            {filteredAndSortedEntries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{entry.date}</h3>
                      <p className="text-sm text-muted-foreground">Activities: {entry.activities}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{entry.totalScore.toFixed(2)}</span>
                      {entry.totalScore > 0 ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <Target className="text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="mt-2">Interests: {entry.interests}</p>
                  <div className="mt-2 text-sm">
                    <p>Goals Score: {entry.goalsScore}</p>
                    <p>Learning Score: {entry.learningScore}</p>
                    <p>Pros/Cons Score: {entry.prosConsScore}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Productivity Insights</h3>
          <pre className="whitespace-pre-wrap bg-secondary p-4 rounded-md">{getProductivityInsights()}</pre>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("import-data")?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </Button>
          <input title="hello" id="import-data" type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
        </div>
      </CardContent>
    </Card>
  )
}
