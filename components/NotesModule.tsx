"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trash2, Pencil, Star, Link, Tag } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isFavorite: boolean
  createdAt: number
  updatedAt: number
  linkedResources: string[]
  linkedGoals: string[]
}

const CATEGORIES = ["Personal", "Work", "Study", "Ideas", "Other"]

export function NotesModule() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState<Omit<Note, "id" | "createdAt" | "updatedAt">>({
    title: "",
    content: "",
    category: CATEGORIES[0],
    tags: [],
    isFavorite: false,
    linkedResources: [],
    linkedGoals: [],
  })
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [linkType, setLinkType] = useState<"resource" | "goal">("resource")
  const [linkId, setLinkId] = useState("")

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addOrUpdateNote = () => {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") {
      alert("Title and content cannot be empty")
      return
    }

    if (editingNoteId) {
      setNotes(notes.map((note) => (note.id === editingNoteId ? { ...note, ...newNote, updatedAt: Date.now() } : note)))
      setEditingNoteId(null)
    } else {
      const newNoteWithId: Note = {
        ...newNote,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setNotes([...notes, newNoteWithId])
    }

    setNewNote({
      title: "",
      content: "",
      category: CATEGORIES[0],
      tags: [],
      isFavorite: false,
      linkedResources: [],
      linkedGoals: [],
    })
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const editNote = (note: Note) => {
    setEditingNoteId(note.id)
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
      isFavorite: note.isFavorite,
      linkedResources: note.linkedResources,
      linkedGoals: note.linkedGoals,
    })
  }

  const toggleFavorite = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, isFavorite: !note.isFavorite } : note)))
  }

  const addLink = () => {
    if (editingNoteId && linkId) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                [linkType === "resource" ? "linkedResources" : "linkedGoals"]: [
                  ...note[linkType === "resource" ? "linkedResources" : "linkedGoals"],
                  linkId,
                ],
              }
            : note,
        ),
      )
      setIsAddingLink(false)
      setLinkId("")
    }
  }

  const removeLink = (noteId: string, linkToRemove: string, type: "resource" | "goal") => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              [type === "resource" ? "linkedResources" : "linkedGoals"]: note[
                type === "resource" ? "linkedResources" : "linkedGoals"
              ].filter((link) => link !== linkToRemove),
            }
          : note,
      ),
    )
  }

  const filteredNotes = notes.filter(
    (note) =>
      (filterCategory === "all" || note.category === filterCategory) &&
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!showFavoritesOnly || note.isFavorite),
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className="h-4 w-4 mr-2" />
            Favorites
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Note title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <Textarea
            placeholder="Write your note here..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            rows={5}
          />
          <Select value={newNote.category} onValueChange={(category) => setNewNote({ ...newNote, category })}>
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
          <Input
            placeholder="Add tags (comma-separated)"
            value={newNote.tags.join(", ")}
            onChange={(e) => setNewNote({ ...newNote, tags: e.target.value.split(",").map((tag) => tag.trim()) })}
          />
          <Button onClick={addOrUpdateNote} className="w-full">
            {editingNoteId ? "Update Note" : "Add Note"}
          </Button>
        </div>
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleFavorite(note.id)}>
                      <Star className={`h-4 w-4 ${note.isFavorite ? "text-yellow-400 fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editNote(note)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{note.category}</span>
                  <span>Last updated: {new Date(note.updatedAt).toLocaleString()}</span>
                </div>
                {(note.linkedResources.length > 0 || note.linkedGoals.length > 0) && (
                  <div className="mt-2 space-y-1">
                    {note.linkedResources.length > 0 && (
                      <div>
                        <span className="font-semibold">Linked Resources:</span>
                        {note.linkedResources.map((resourceId) => (
                          <span
                            key={resourceId}
                            className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {resourceId}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 p-0 h-4 w-4"
                              onClick={() => removeLink(note.id, resourceId, "resource")}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </span>
                        ))}
                      </div>
                    )}
                    {note.linkedGoals.length > 0 && (
                      <div>
                        <span className="font-semibold">Linked Goals:</span>
                        {note.linkedGoals.map((goalId) => (
                          <span
                            key={goalId}
                            className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {goalId}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 p-0 h-4 w-4"
                              onClick={() => removeLink(note.id, goalId, "goal")}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingNoteId(note.id)
                      setIsAddingLink(true)
                    }}
                  >
                    <Link className="h-4 w-4 mr-2" /> Add Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={linkType} onValueChange={(value) => setLinkType(value as "resource" | "goal")}>
              <SelectTrigger>
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resource">Resource</SelectItem>
                <SelectItem value="goal">Goal</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder={`Enter ${linkType} ID`} value={linkId} onChange={(e) => setLinkId(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={addLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
