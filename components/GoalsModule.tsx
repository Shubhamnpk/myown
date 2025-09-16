"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit2, Link, Calendar } from "lucide-react"

interface SubTask {
  id: string;\
  title:: string
completed: boolean
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  dueDate: string
  category: string
  subTasks: SubTask[]
  linkedResources: string[]
  linkedNotes: string[]
}

const CATEGORIES = ["Personal", "Work", "Health", "Finance", "Education", "Other"]

export function GoalsModule() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    title: "",
    description: "",
    progress: 0,
    dueDate: "",
    category: CATEGORIES[0],
    subTasks: [],
    linkedResources: [],
    linkedNotes: [],
  })
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals))
  }, [goals])

  const addOrUpdateGoal = () => {
    if (newGoal.title.trim() === "") {
      alert("Goal title cannot be empty")
      return
    }

    if (editingGoalId) {
      setGoals(goals.map((goal) => (goal.id === editingGoalId ? { ...goal, ...newGoal } : goal)))
      setEditingGoalId(null)
    } else {
      const newGoalWithId: Goal = {
        ...newGoal,
        id: Date.now().toString(),
      }
      setGoals([...goals, newGoalWithId])
    }

    setNewGoal({
      title: "",
      description: "",
      progress: 0,
      dueDate: "",
      category: CATEGORIES[0],
      subTasks: [],
      linkedResources: [],
      linkedNotes: [],
    })
  }

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, progress } : goal)))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  const editGoal = (goal: Goal) => {
    setEditingGoalId(goal.id)
    setNewGoal(goal)
  }

  const addSubTask = (goalId: string, subTaskTitle: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              subTasks: [...goal.subTasks, { id: Date.now().toString(), title: subTaskTitle, completed: false }],
            }
          : goal,
      ),
    )
  }

  const toggleSubTask = (goalId: string, subTaskId: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              subTasks: goal.subTasks.map((subTask) =>
                subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed } : subTask,
              ),
            }
          : goal,
      ),
    )
  }

  const deleteSubTask = (goalId: string, subTaskId: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, subTasks: goal.subTasks.filter((subTask) => subTask.id !== subTaskId) } : goal,
      ),
    )
  }

  const linkResource = (goalId: string) => {
    const resourceId = prompt("Enter resource ID to link:")
    if (resourceId) {
      setGoals(
        goals.map((goal) =>
          goal.id === goalId ? { ...goal, linkedResources: [...goal.linkedResources, resourceId] } : goal,
        ),
      )
    }
  }

  const linkNote = (goalId: string) => {
    const noteId = prompt("Enter note ID to link:")
    if (noteId) {
      setGoals(
        goals.map((goal) => (goal.id === goalId ? { ...goal, linkedNotes: [...goal.linkedNotes, noteId] } : goal)),
      )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Goal title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <Input
            placeholder="Goal description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          />
          <Select value={newGoal.category} onValueChange={(category) => setNewGoal({ ...newGoal, category })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <Input
              type="date"
              value={newGoal.dueDate}
              onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
            />
          </div>
          <Button onClick={addOrUpdateGoal} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> {editingGoalId ? "Update Goal" : "Add Goal"}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="text-lg">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">{goal.category}</span>
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{goal.dueDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[goal.progress]}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateGoalProgress(goal.id, value[0])}
                  />
                  <span>{goal.progress}%</span>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Sub-tasks:</h4>
                  {goal.subTasks.map((subTask) => (
                    <div key={subTask.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={subTask.completed}
                        onCheckedChange={() => toggleSubTask(goal.id, subTask.id)}
                      />
                      <span className={subTask.completed ? "line-through" : ""}>{subTask.title}</span>
                      <Button variant="ghost" size="sm" onClick={() => deleteSubTask(goal.id, subTask.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      placeholder="New sub-task"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addSubTask(goal.id, e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="New sub-task"]') as HTMLInputElement
                        if (input.value) {
                          addSubTask(goal.id, input.value)
                          input.value = ""
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => linkResource(goal.id)}>
                    <Link className="h-4 w-4 mr-2" /> Link Resource
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => linkNote(goal.id)}>
                    <Link className="h-4 w-4 mr-2" /> Link Note
                  </Button>
                </div>
                {(goal.linkedResources.length > 0 || goal.linkedNotes.length > 0) && (
                  <div className="mt-2">
                    {goal.linkedResources.length > 0 && (
                      <div>
                        <span className="font-semibold">Linked Resources:</span>
                        {goal.linkedResources.map((resourceId) => (
                          <span
                            key={resourceId}
                            className="ml-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                          >
                            {resourceId}
                          </span>
                        ))}
                      </div>
                    )}
                    {goal.linkedNotes.length > 0 && (
                      <div>
                        <span className="font-semibold">Linked Notes:</span>
                        {goal.linkedNotes.map((noteId) => (
                          <span
                            key={noteId}
                            className="ml-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                          >
                            {noteId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => editGoal(goal)}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
