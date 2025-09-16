"use client"

import { useState, useEffect } from "react"

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

export function useProductivity() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [lastScore, setLastScore] = useState(0)
  const [lastScoreDate, setLastScoreDate] = useState("")
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const storedEntries = localStorage.getItem("productivityEntries")
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries)
      setEntries(parsedEntries)
      updateLastScore(parsedEntries)
      updateStreak(parsedEntries)
    }
  }, [])

  const updateLastScore = (currentEntries: JournalEntry[]) => {
    if (currentEntries.length > 0) {
      const lastEntry = currentEntries[currentEntries.length - 1]
      setLastScore(lastEntry.totalScore)
      setLastScoreDate(lastEntry.date)
    }
  }

  const updateStreak = (currentEntries: JournalEntry[]) => {
    let currentStreak = 0
    const today = new Date().toISOString().split("T")[0]

    for (let i = currentEntries.length - 1; i >= 0; i--) {
      const entryDate = new Date(currentEntries[i].date)
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - currentStreak)

      if (entryDate.toISOString().split("T")[0] === expectedDate.toISOString().split("T")[0]) {
        currentStreak++
      } else {
        break
      }
    }

    setStreak(currentStreak)
  }

  const addEntry = (newEntry: Omit<JournalEntry, "id">) => {
    const entryWithId: JournalEntry = {
      ...newEntry,
      id: Date.now().toString(),
    }
    const updatedEntries = [...entries, entryWithId]
    setEntries(updatedEntries)
    localStorage.setItem("productivityEntries", JSON.stringify(updatedEntries))
    updateLastScore(updatedEntries)
    updateStreak(updatedEntries)
  }

  const updateEntry = (updatedEntry: JournalEntry) => {
    const updatedEntries = entries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    setEntries(updatedEntries)
    localStorage.setItem("productivityEntries", JSON.stringify(updatedEntries))
    updateLastScore(updatedEntries)
    updateStreak(updatedEntries)
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("productivityEntries", JSON.stringify(updatedEntries))
    updateLastScore(updatedEntries)
    updateStreak(updatedEntries)
  }

  const analyzeData = () => {
    if (entries.length === 0) {
      alert("No data available for analysis.")
      return
    }

    const totalScores = entries.map((entry) => entry.totalScore)
    const averageScore = (totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length).toFixed(2)
    const highestScore = Math.max(...totalScores).toFixed(2)
    const lowestScore = Math.min(...totalScores).toFixed(2)

    const mostProductiveDay = entries.reduce((max, entry) => (entry.totalScore > max.totalScore ? entry : max))
    const leastProductiveDay = entries.reduce((min, entry) => (entry.totalScore < min.totalScore ? entry : min))

    const analysisResults = `
      Average Score: ${averageScore}
      Highest Score: ${highestScore}
      Lowest Score: ${lowestScore}
      Most Productive Day: ${mostProductiveDay.date} (Score: ${mostProductiveDay.totalScore.toFixed(2)})
      Least Productive Day: ${leastProductiveDay.date} (Score: ${leastProductiveDay.totalScore.toFixed(2)})
    `

    alert(analysisResults)
  }

  const getTip = () => {
    const tips = [
      "Reflect on your activities and how they contribute to your goals.",
      "Try to identify patterns in your most productive days.",
      "Consider how your interests align with your daily activities.",
      "Balance your efforts across goals, learning, and overall well-being.",
      "Use your journal to track both achievements and areas for improvement.",
      "Set specific, measurable goals for the next day based on today's reflections.",
      "Experiment with different routines and note their impact on your productivity.",
      "Pay attention to how your mood affects your productivity and vice versa.",
      "Use your interests to fuel motivation for less enjoyable tasks.",
      "Regularly review your journal entries to gain insights into your long-term progress.",
    ]
    return tips[Math.floor(Math.random() * tips.length)]
  }

  const getRecentEntries = (days: number) => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return sortedEntries.slice(0, days)
  }

  const applyFilters = (startDate: string, endDate: string, scoreFilter: number, sortOrder: string) => {
    const filtered = entries.filter(
      (entry) =>
        (!startDate || entry.date >= startDate) &&
        (!endDate || entry.date <= endDate) &&
        entry.totalScore >= scoreFilter,
    )

    const sortFunctions = {
      newest: (a: JournalEntry, b: JournalEntry) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      oldest: (a: JournalEntry, b: JournalEntry) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      highest: (a: JournalEntry, b: JournalEntry) => b.totalScore - a.totalScore,
      lowest: (a: JournalEntry, b: JournalEntry) => a.totalScore - b.totalScore,
    }

    filtered.sort(sortFunctions[sortOrder as keyof typeof sortFunctions])
    return filtered
  }

  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "productivity_journal.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importData = (jsonData: string) => {
    try {
      const importedData = JSON.parse(jsonData)
      if (Array.isArray(importedData)) {
        setEntries(importedData)
        localStorage.setItem("productivityEntries", JSON.stringify(importedData))
        updateLastScore(importedData)
        updateStreak(importedData)
        alert("Journal entries imported successfully!")
      } else {
        throw new Error("Invalid data format")
      }
    } catch (error) {
      alert("Error importing data. Please ensure the file is a valid JSON.")
    }
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all journal entries? This action cannot be undone.")) {
      setEntries([])
      setLastScore(0)
      setLastScoreDate("")
      setStreak(0)
      localStorage.removeItem("productivityEntries")
      alert("All journal entries have been cleared.")
    }
  }

  return {
    entries,
    lastScore,
    lastScoreDate,
    streak,
    addEntry,
    updateEntry,
    deleteEntry,
    analyzeData,
    getTip,
    getRecentEntries,
    applyFilters,
    exportData,
    importData,
    clearAllData,
  }
}
