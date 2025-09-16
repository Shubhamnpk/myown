"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit2, Save } from "lucide-react"

type Priority = "low" | "normal" | "high" | "urgent"

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
}

const priorityColors: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-800",
  normal: "bg-green-100 text-green-800",
  high: "bg-yellow-100 text-yellow-800",
  urgent: "bg-red-100 text-red-800",
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [newPriority, setNewPriority] = useState<Priority>("normal")
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editedText, setEditedText] = useState("")
  const [editedPriority, setEditedPriority] = useState<Priority>("normal")

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos")
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false, priority: newPriority }])
      setNewTodo("")
      setNewPriority("normal")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id)
    setEditedText(todo.text)
    setEditedPriority(todo.priority)
  }

  const saveEdit = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editedText, priority: editedPriority } : todo)))
    setEditingTodo(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
          />
          <Select value={newPriority} onValueChange={(value: Priority) => setNewPriority(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTodo}>Add</Button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className={`flex items-center space-x-2 p-2 rounded-md ${priorityColors[todo.priority]}`}>
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
              {editingTodo === todo.id ? (
                <>
                  <Input value={editedText} onChange={(e) => setEditedText(e.target.value)} className="flex-grow" />
                  <Select value={editedPriority} onValueChange={(value: Priority) => setEditedPriority(value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => saveEdit(todo.id)}>
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className={`flex-grow ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.text}</span>
                  <Button variant="ghost" size="sm" onClick={() => startEditing(todo)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
