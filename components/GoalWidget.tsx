"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Goal {
  id: string
  title: string
  progress: number
  description: string
  subGoals: string[]
}

export function GoalWidget() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete Project A",
      progress: 75,
      description: "Finish all tasks related to Project A",
      subGoals: ["Design UI", "Implement backend"],
    },
    {
      id: "2",
      title: "Learn New Technology",
      progress: 30,
      description: "Master React and TypeScript",
      subGoals: ["Complete online course", "Build a project"],
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null)

  const handleEditGoal = (goal: Goal) => {
    setCurrentGoal(goal)
    setIsDialogOpen(true)
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  const handleSaveGoal = (updatedGoal: Goal) => {
    setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)))
    setIsDialogOpen(false)
  }

  const toggleGoalExpansion = (id: string) => {
    setExpandedGoalId(expandedGoalId === id ? null : id)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.map((goal) => (
          <div key={goal.id} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => toggleGoalExpansion(goal.id)}>
                  {expandedGoalId === goal.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <span className="font-medium">{goal.title}</span>
              </div>
              <div>
                <Button variant="ghost" size="sm" onClick={() => handleEditGoal(goal)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Progress value={goal.progress} className="w-full" />
            {expandedGoalId === goal.id && (
              <div className="mt-2 text-sm">
                <p>{goal.description}</p>
                <ul className="list-disc list-inside mt-2">
                  {goal.subGoals.map((subGoal, index) => (
                    <li key={index}>{subGoal}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Make changes to your goal here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {currentGoal && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={currentGoal.title}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="progress" className="text-right">
                    Progress
                  </Label>
                  <Input
                    id="progress"
                    type="number"
                    value={currentGoal.progress}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, progress: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={currentGoal.description}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleSaveGoal(currentGoal)}>Save changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
