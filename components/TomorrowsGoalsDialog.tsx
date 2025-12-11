"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, Calendar, Plus, Trash2, X } from "lucide-react"
import { motion } from "framer-motion"

interface Goal {
  id: string
  text: string
  completed: boolean
}

interface TomorrowsGoalsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (goals: { monthly: Goal[]; daily: Goal[] }) => void
}

export function TomorrowsGoalsDialog({ open, onOpenChange, onSave }: TomorrowsGoalsDialogProps) {
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
    return {
      monthly: [
        { id: "m1", text: "do one page of any one language (Sanskrit, Nepali, English)", completed: false },
        { id: "m2", text: "Try to beat 75 hard", completed: false },
        { id: "m3", text: "Do some fun activities", completed: false },
      ],
      daily: [
        { id: "d1", text: "Drink 4 liters", completed: false },
        { id: "d2", text: "Sleep minimum 5 h", completed: false },
        { id: "d3", text: "Spend sometimes with nature", completed: false },
        { id: "d4", text: "Read 10 pages of books", completed: false },
        { id: "d5", text: "Practice your skills", completed: false },
        { id: "d6", text: "At least once move out from comfort zone", completed: false },
        { id: "d7", text: "Do journal regularly", completed: false },
        { id: "d8", text: "Do some exercise", completed: false },
      ]
    }
  }

  const [goals, setGoals] = useState(loadSavedGoals())

  const addMonthlyGoal = () => {
    const newGoal: Goal = { id: `m${Date.now()}`, text: "", completed: false }
    setGoals((prev: { monthly: Goal[]; daily: Goal[] }) => ({ ...prev, monthly: [...prev.monthly, newGoal] }))
  }

  const addDailyGoal = () => {
    const newGoal: Goal = { id: `d${Date.now()}`, text: "", completed: false }
    setGoals((prev: { monthly: Goal[]; daily: Goal[] }) => ({ ...prev, daily: [...prev.daily, newGoal] }))
  }

  const removeMonthlyGoal = (index: number) => {
    setGoals((prev: { monthly: Goal[]; daily: Goal[] }) => ({
      ...prev,
      monthly: prev.monthly.filter((_, i) => i !== index)
    }))
  }

  const removeDailyGoal = (index: number) => {
    setGoals((prev: { monthly: Goal[]; daily: Goal[] }) => ({
      ...prev,
      daily: prev.daily.filter((_, i) => i !== index)
    }))
  }

  const updateMonthlyGoal = (index: number, text: string) => {
    setGoals((prev: { monthly: Goal[]; daily: Goal[] }) => ({
      ...prev,
      monthly: prev.monthly.map((goal, i) => i === index ? { ...goal, text } : goal)
    }))
  }

  const updateDailyGoal = (index: number, text: string) => {
    setGoals((prev: { monthly: Goal[]; daily: Goal[] }) => ({
      ...prev,
      daily: prev.daily.map((goal, i) => i === index ? { ...goal, text } : goal)
    }))
  }

  const handleSave = () => {
    localStorage.setItem("savedGoals", JSON.stringify(goals))
    onSave(goals)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Plan Tomorrow's Goals</DialogTitle>
              <p className="text-sm text-muted-foreground">Set your intentions for a productive tomorrow</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Monthly Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold text-lg">Monthly Goals</h4>
                <span className="text-sm text-muted-foreground">({goals.monthly.length})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addMonthlyGoal}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </div>

            <div className="space-y-3">
              {goals.monthly.map((goal: Goal, index: number) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="flex-1">
                    <Input
                      value={goal.text}
                      onChange={(e) => updateMonthlyGoal(index, e.target.value)}
                      placeholder="Enter your monthly goal..."
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMonthlyGoal(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Daily Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold text-lg">Daily Goals</h4>
                <span className="text-sm text-muted-foreground">({goals.daily.length})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addDailyGoal}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </div>

            <div className="space-y-3">
              {goals.daily.map((goal: Goal, index: number) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="flex-1">
                    <Input
                      value={goal.text}
                      onChange={(e) => updateDailyGoal(index, e.target.value)}
                      placeholder="Enter your daily goal..."
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDailyGoal(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="min-w-[120px]">
            <Target className="h-4 w-4 mr-2" />
            Save Goals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}