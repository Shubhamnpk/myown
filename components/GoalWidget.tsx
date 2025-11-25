"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp } from "lucide-react"

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

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

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
                <span className="text-sm text-muted-foreground">{goal.category}</span>
              </div>
            </div>
            <Progress value={goal.progress} className="w-full" />
            {expandedGoalId === goal.id && (
              <div className="mt-2 text-sm">
                <p>{goal.description}</p>
                <ul className="list-disc list-inside mt-2">
                  {goal.subTasks.map((subTask) => (
                    <li key={subTask.id} className={subTask.completed ? "line-through text-muted-foreground" : ""}>
                      {subTask.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
