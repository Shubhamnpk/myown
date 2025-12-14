"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, Trash2, Edit2, Save, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface Goal {
  id: string
  title: string
  progress: number
  description: string
  subTasks: { id: string; title: string; completed: boolean }[]
  dueDate: string
  category: string
  linkedResources: string[]
  linkedNotes: string[]
}

export function GoalWidget() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalCategory, setNewGoalCategory] = useState("")
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("")
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editGoalTitle, setEditGoalTitle] = useState("")
  const [editGoalDescription, setEditGoalDescription] = useState("")
  const [editGoalCategory, setEditGoalCategory] = useState("")

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const addNewGoal = () => {
    const newGoal: Goal = {
      id: generateUUID(),
      title: newGoalTitle || "New Goal",
      progress: 0,
      description: newGoalDescription || "Description of the new goal",
      subTasks: [],
      dueDate: new Date().toISOString(),
      category: newGoalCategory || "General",
      linkedResources: [],
      linkedNotes: []
    }
    const updatedGoals = [...goals, newGoal]
    setGoals(updatedGoals)
    localStorage.setItem("goals", JSON.stringify(updatedGoals))
    setIsDialogOpen(false)
    setNewGoalTitle("")
    setNewGoalDescription("")
    setNewGoalCategory("")
  }

  const updateGoalProgress = (id: string, progress: number) => {
    const updatedGoals = goals.map((goal) => (goal.id === id ? { ...goal, progress } : goal))
    setGoals(updatedGoals)
    localStorage.setItem("goals", JSON.stringify(updatedGoals))
  }

  const addSubTask = (goalId: string, subTaskTitle: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const newSubTask = { id: generateUUID(), title: subTaskTitle, completed: false }
        return { ...goal, subTasks: [...goal.subTasks, newSubTask] }
      }
      return goal
    })
    setGoals(updatedGoals)
    localStorage.setItem("goals", JSON.stringify(updatedGoals))
    setNewSubTaskTitle("")
  }

  const toggleSubTask = (goalId: string, subTaskId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        return {
          ...goal,
          subTasks: goal.subTasks.map((subTask) =>
            subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed } : subTask
          )
        }
      }
      return goal
    })
    setGoals(updatedGoals)
    localStorage.setItem("goals", JSON.stringify(updatedGoals))
  }

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id)
    setGoals(updatedGoals)
    localStorage.setItem("goals", JSON.stringify(updatedGoals))
  }

  const startEditingGoal = (goal: Goal) => {
    setEditingGoalId(goal.id)
    setEditGoalTitle(goal.title)
    setEditGoalDescription(goal.description)
    setEditGoalCategory(goal.category)
  }

  const saveEditedGoal = (id: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            title: editGoalTitle,
            description: editGoalDescription,
            category: editGoalCategory
          }
        : goal
    )
    setGoals(updatedGoals)
    localStorage.setItem("goals", JSON.stringify(updatedGoals))
    setEditingGoalId(null)
  }

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals))
  }, [goals])

  const toggleGoalExpansion = (id: string) => {
    setExpandedGoalId(expandedGoalId === id ? null : id)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-muted-foreground mb-6 text-lg">No goals yet. Add a new goal to get started!</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Create New Goal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="Enter goal title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      placeholder="Enter goal description"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="font-medium">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value)}
                      placeholder="Enter goal category"
                    />
                  </div>
                </div>
                <Button onClick={addNewGoal} className="w-full">
                  Create Goal
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="mb-4 last:mb-0 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleGoalExpansion(goal.id)}>
                    {expandedGoalId === goal.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <h3 className="font-semibold text-lg">{goal.title}</h3>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">{goal.category}</span>
                </div>
              </div>
              <Progress value={goal.progress} className="w-full h-2 mb-3" />
              {expandedGoalId === goal.id && (
                <div className="mt-2 text-sm">
                  {editingGoalId === goal.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editGoalTitle}
                        onChange={(e) => setEditGoalTitle(e.target.value)}
                        className="w-full"
                      />
                      <Textarea
                        value={editGoalDescription}
                        onChange={(e) => setEditGoalDescription(e.target.value)}
                        className="w-full"
                      />
                      <Input
                        value={editGoalCategory}
                        onChange={(e) => setEditGoalCategory(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => saveEditedGoal(goal.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingGoalId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-muted-foreground mb-4">{goal.description}</p>
                      <div className="flex space-x-2 mb-4">
                        <Button variant="outline" size="sm" onClick={() => startEditingGoal(goal)} className="gap-1">
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteGoal(goal.id)} className="gap-1">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Input
                          placeholder="Add sub-task"
                          value={newSubTaskTitle}
                          onChange={(e) => setNewSubTaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSubTask(goal.id, newSubTaskTitle)}
                          className="flex-grow"
                        />
                        <Button variant="outline" size="sm" onClick={() => addSubTask(goal.id, newSubTaskTitle)} className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      <ul className="space-y-2 mt-4">
                        {goal.subTasks.map((subTask) => (
                          <li key={subTask.id} className={`flex items-center space-x-2 p-2 rounded-md ${subTask.completed ? "bg-green-900/20" : "bg-gray-900/10"}`}>
                            <Checkbox
                              checked={subTask.completed}
                              onCheckedChange={() => toggleSubTask(goal.id, subTask.id)}
                            />
                            <span className={subTask.completed ? "line-through text-muted-foreground" : ""}>
                              {subTask.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
