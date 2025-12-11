"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useProductivity } from "@/hooks/useProductivity"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus, Sparkles, Target, BookOpen, Scale, Heart } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TomorrowsGoalsDialog } from "@/components/TomorrowsGoalsDialog"

interface Goal {
  id: string
  text: string
  completed: boolean
}

interface JournalEntry {
  date: string
  main: string
  location: string
  time: string
  mood: string
  specialDay: string
  monthlyGoals: Goal[]
  dailyGoals: Goal[]
  learnings: string
  learningScore: number
  gratitude: string[]
  gratitudeScore: number
  pros: string[]
  cons: string[]
  prosConsScore: number
  goalsScore: number
  finalSummary: string
}

const DEFAULT_MONTHLY_GOALS: Goal[] = [
  { id: "m1", text: "do one page of any one language (Sanskrit, Nepali, English)", completed: false },
  { id: "m2", text: "Try to beat 75 hard", completed: false },
  { id: "m3", text: "Do some fun activities", completed: false },
]

const DEFAULT_DAILY_GOALS: Goal[] = [
  { id: "d1", text: "Drink 4 liters", completed: false },
  { id: "d2", text: "Sleep minimum 5 h", completed: false },
  { id: "d3", text: "Spend sometimes with nature", completed: false },
  { id: "d4", text: "Read 10 pages of books", completed: false },
  { id: "d5", text: "Practice your skills", completed: false },
  { id: "d6", text: "At least once move out from comfort zone", completed: false },
  { id: "d7", text: "Do journal regularly", completed: false },
  { id: "d8", text: "Do some exercise", completed: false },
]

const getTipForScore = (score: number): string => {
  if (score >= 4) return "Outstanding day! Keep this momentum going!"
  if (score >= 2) return "Good progress! Try to build on these positive habits."
  if (score >= 0) return "Steady progress. Focus on small improvements each day."
  if (score >= -2) return "Remember, every day is a new opportunity to improve."
  return "Tomorrow is a new day. Reset and try again with renewed energy."
}

export function ProductivityModule() {
  const { addEntry, streak } = useProductivity()
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Load saved goals from localStorage or use defaults
  const loadSavedGoals = () => {
    const saved = localStorage.getItem("savedGoals")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Error parsing saved goals:", e)
      }
    }
    return { monthly: DEFAULT_MONTHLY_GOALS, daily: DEFAULT_DAILY_GOALS }
  }

  const [journalEntry, setJournalEntry] = useState<JournalEntry>({
    date: new Date().toISOString().split("T")[0],
    main: "",
    location: "",
    time: "",
    mood: "",
    specialDay: "",
    monthlyGoals: loadSavedGoals().monthly,
    dailyGoals: loadSavedGoals().daily,
    learnings: "",
    learningScore: 0,
    gratitude: [""],
    gratitudeScore: 0,
    pros: [""],
    cons: [""],
    prosConsScore: 0,
    goalsScore: 0,
    finalSummary: "",
  })

  const calculateTotalScore = (): number => {
    const weightedGoals = journalEntry.goalsScore * 0.4
    const weightedLearning = journalEntry.learningScore * 0.3
    const weightedProsCons = journalEntry.prosConsScore * 0.2
    const weightedGratitude = journalEntry.gratitudeScore * 0.1
    return Number((weightedGoals + weightedLearning + weightedProsCons + weightedGratitude).toFixed(2))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJournalEntry((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayItemChange = (type: "gratitude" | "pros" | "cons", index: number, value: string) => {
    setJournalEntry((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (type: "gratitude" | "pros" | "cons") => {
    setJournalEntry((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }))
  }

  const removeArrayItem = (type: "gratitude" | "pros" | "cons", index: number) => {
    setJournalEntry((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const toggleGoal = (type: "monthly" | "daily", id: string) => {
    const goalsKey = type === "monthly" ? "monthlyGoals" : "dailyGoals"
    setJournalEntry((prev) => ({
      ...prev,
      [goalsKey]: prev[goalsKey].map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)),
    }))
  }

  const handleSubmit = async () => {
    const totalScore = calculateTotalScore()
    addEntry({
      date: journalEntry.date,
      totalScore,
      activities: journalEntry.main,
      interests: journalEntry.learnings,
      goalsScore: journalEntry.goalsScore,
      learningScore: journalEntry.learningScore,
      prosConsScore: journalEntry.prosConsScore,
    })

    const shouldUpdateGoals = window.confirm("Would you like to update your goals for tomorrow?")
    if (shouldUpdateGoals) {
      setShowGoalDialog(true)
    } else {
      setShowSuccess(true)
    }
  }

  const handleGoalUpdate = (goals: { monthly: Goal[]; daily: Goal[] }) => {
    // Update the current journal entry with the new goals for tomorrow
    setJournalEntry(prev => ({
      ...prev,
      monthlyGoals: goals.monthly,
      dailyGoals: goals.daily
    }))
  }

  const resetForm = () => {
    setJournalEntry({
      date: new Date().toISOString().split("T")[0],
      main: "",
      location: "",
      time: "",
      mood: "",
      specialDay: "",
      monthlyGoals: loadSavedGoals().monthly,
      dailyGoals: loadSavedGoals().daily,
      learnings: "",
      learningScore: 0,
      gratitude: [""],
      gratitudeScore: 0,
      pros: [""],
      cons: [""],
      prosConsScore: 0,
      goalsScore: 0,
      finalSummary: "",
    })
    setShowSuccess(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Daily Reflection Journal
        </CardTitle>
        <CardDescription>Track your journey and celebrate your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" name="date" value={journalEntry.date} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input type="time" id="time" name="time" value={journalEntry.time} onChange={handleInputChange} />
          </div>
          <div className="col-span-2">
            <Label htmlFor="main">Main Focus</Label>
            <Input
              id="main"
              name="main"
              value={journalEntry.main}
              onChange={handleInputChange}
              placeholder="What's your primary focus today?"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={journalEntry.location}
              onChange={handleInputChange}
              placeholder="Where are you?"
            />
          </div>
          <div>
            <Label htmlFor="mood">Mood</Label>
            <Input
              id="mood"
              name="mood"
              value={journalEntry.mood}
              onChange={handleInputChange}
              placeholder="How are you feeling?"
            />
          </div>
        </motion.div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goals Progress (40%)
            </h3>
            <div className="flex items-center gap-2">
              <Label>Score:</Label>
              <Slider
                className="w-[200px]"
                value={[journalEntry.goalsScore]}
                min={-5}
                max={5}
                step={1}
                onValueChange={([value]) => setJournalEntry((prev) => ({ ...prev, goalsScore: value }))}
              />
              <span className="min-w-[2ch]">{journalEntry.goalsScore}</span>
            </div>
          </div>

          {/* Monthly Goals */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4">
                Monthly Goals ({journalEntry.monthlyGoals.filter((g) => g.completed).length}/
                {journalEntry.monthlyGoals.length})
              </h4>
              <div className="space-y-2">
                {journalEntry.monthlyGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox checked={goal.completed} onCheckedChange={() => toggleGoal("monthly", goal.id)} />
                    <Label className="flex-1">{goal.text}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Goals */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4">
                Daily Goals ({journalEntry.dailyGoals.filter((g) => g.completed).length}/
                {journalEntry.dailyGoals.length})
              </h4>
              <div className="space-y-2">
                {journalEntry.dailyGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox checked={goal.completed} onCheckedChange={() => toggleGoal("daily", goal.id)} />
                    <Label className="flex-1">{goal.text}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Learning & Growth (30%)
            </h3>
            <div className="flex items-center gap-2">
              <Label>Score:</Label>
              <Slider
                className="w-[200px]"
                value={[journalEntry.learningScore]}
                min={-5}
                max={5}
                step={1}
                onValueChange={([value]) => setJournalEntry((prev) => ({ ...prev, learningScore: value }))}
              />
              <span className="min-w-[2ch]">{journalEntry.learningScore}</span>
            </div>
          </div>
          <Textarea
            name="learnings"
            value={journalEntry.learnings}
            onChange={handleInputChange}
            placeholder="What did you learn today? Share your insights and discoveries..."
            className="h-32"
          />
        </motion.div>

        {/* Pros & Cons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Pros & Cons (20%)
            </h3>
            <div className="flex items-center gap-2">
              <Label>Score:</Label>
              <Slider
                className="w-[200px]"
                value={[journalEntry.prosConsScore]}
                min={-5}
                max={5}
                step={1}
                onValueChange={([value]) => setJournalEntry((prev) => ({ ...prev, prosConsScore: value }))}
              />
              <span className="min-w-[2ch]">{journalEntry.prosConsScore}</span>
            </div>
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label className="text-green-600 dark:text-green-400">Pros</Label>
            {journalEntry.pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={pro}
                  onChange={(e) => handleArrayItemChange("pros", index, e.target.value)}
                  placeholder={`Pro ${index + 1}`}
                />
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem("pros", index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addArrayItem("pros")} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Pro
            </Button>
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label className="text-red-600 dark:text-red-400">Cons</Label>
            {journalEntry.cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={con}
                  onChange={(e) => handleArrayItemChange("cons", index, e.target.value)}
                  placeholder={`Con ${index + 1}`}
                />
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem("cons", index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addArrayItem("cons")} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Con
            </Button>
          </div>
        </motion.div>

        {/* Gratitude Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Gratitude (10%)
            </h3>
            <div className="flex items-center gap-2">
              <Label>Score:</Label>
              <Slider
                className="w-[200px]"
                value={[journalEntry.gratitudeScore]}
                min={-5}
                max={5}
                step={1}
                onValueChange={([value]) => setJournalEntry((prev) => ({ ...prev, gratitudeScore: value }))}
              />
              <span className="min-w-[2ch]">{journalEntry.gratitudeScore}</span>
            </div>
          </div>

          {journalEntry.gratitude.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => handleArrayItemChange("gratitude", index, e.target.value)}
                placeholder={`I'm grateful for...`}
              />
              <Button variant="ghost" size="icon" onClick={() => removeArrayItem("gratitude", index)}>
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addArrayItem("gratitude")} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Gratitude
          </Button>
        </motion.div>

        {/* Final Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Label htmlFor="finalSummary">Final Thoughts</Label>
          <Input
            id="finalSummary"
            name="finalSummary"
            value={journalEntry.finalSummary}
            onChange={handleInputChange}
            placeholder="Sum up your day in a few words..."
          />
        </motion.div>

        {/* Productivity Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Productivity Score</h3>
                  <p className="text-sm text-muted-foreground">Current Streak: {streak} days</p>
                </div>
                <div className="text-4xl font-bold text-primary">{calculateTotalScore()}</div>
              </div>
              <Alert className="mt-4">
                <AlertDescription>{getTipForScore(calculateTotalScore())}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {!showSuccess ? (
          <Button onClick={handleSubmit} className="w-full" size="lg">
            Save Journal Entry
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <AlertDescription className="text-green-800 dark:text-green-200">
                🎉 Journal entry saved successfully! Keep up the great work!
              </AlertDescription>
            </Alert>
            <Button onClick={resetForm} className="w-full" size="lg" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Entry
            </Button>
          </motion.div>
        )}
      </CardContent>

      <TomorrowsGoalsDialog
        open={showGoalDialog}
        onOpenChange={setShowGoalDialog}
        onSave={(goals) => {
          handleGoalUpdate(goals)
          setShowGoalDialog(false)
          setShowSuccess(true)
        }}
      />
    </Card>
  )
}
