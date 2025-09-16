"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Star, Share2, Link, Paperclip, X, FileText } from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  url: string
  tags: string[]
  rating: number
  attachments: { name: string; url: string }[]
  createdAt: number
  updatedAt: number
  category: string
  linkedNotes: string[]
}

const CATEGORIES = ["Article", "Video", "Book", "Course", "Tool", "Other"]

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([])
  const [newResource, setNewResource] = useState<Omit<Resource, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    url: "",
    tags: [],
    rating: 0,
    attachments: [],
    category: CATEGORIES[0],
    linkedNotes: [],
  })
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "rating">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const savedResources = localStorage.getItem("resources")
    if (savedResources) {
      setResources(JSON.parse(savedResources))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources))
  }, [resources])

  const addResource = () => {
    if (newResource.title && newResource.url) {
      const resourceWithId: Resource = {
        ...newResource,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setResources([...resources, resourceWithId])
      setNewResource({
        title: "",
        description: "",
        url: "",
        tags: [],
        rating: 0,
        attachments: [],
        category: CATEGORIES[0],
        linkedNotes: [],
      })
      setIsAddingResource(false)
    }
  }

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(
      resources.map((resource) => (resource.id === id ? { ...resource, ...updates, updatedAt: Date.now() } : resource)),
    )
  }

  const deleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real application, you would upload the file to a server and get a URL back
      // For this example, we'll just use a fake URL
      const fakeUrl = URL.createObjectURL(file)
      setNewResource({
        ...newResource,
        attachments: [...newResource.attachments, { name: file.name, url: fakeUrl }],
      })
    }
  }

  const removeAttachment = (index: number) => {
    setNewResource({
      ...newResource,
      attachments: newResource.attachments.filter((_, i) => i !== index),
    })
  }

  const shareResource = (resource: Resource) => {
    // In a real application, you would implement sharing functionality here
    // For this example, we'll just copy the resource URL to the clipboard
    navigator.clipboard.writeText(resource.url).then(() => {
      alert("Resource URL copied to clipboard!")
    })
  }

  const linkNote = (resourceId: string) => {
    const noteId = prompt("Enter note ID to link:")
    if (noteId) {
      setResources(
        resources.map((resource) =>
          resource.id === resourceId ? { ...resource, linkedNotes: [...resource.linkedNotes, noteId] } : resource,
        ),
      )
    }
  }

  const filteredAndSortedResources = resources
    .filter(
      (resource) =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterTag === "all" || resource.tags.includes(filterTag)) &&
        (filterCategory === "all" || resource.category === filterCategory),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt
      } else {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      }
    })

  const allTags = Array.from(new Set(resources.flatMap((resource) => resource.tags)))

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Resource Library</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "rating")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
        <Button onClick={() => setIsAddingResource(true)}>Add New Resource</Button>
        <div className="space-y-4">
          {filteredAndSortedResources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center mb-2"
                >
                  <Link className="h-4 w-4 mr-1" />
                  {resource.url}
                </a>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= resource.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      onClick={() => updateResource(resource.id, { rating: star })}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium">{resource.category}</span>
                </div>
                {resource.attachments.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold mb-1">Attachments:</h4>
                    <ul className="list-disc list-inside">
                      {resource.attachments.map((attachment, index) => (
                        <li key={index} className="text-sm">
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {attachment.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => shareResource(resource)}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => linkNote(resource.id)}>
                    <FileText className="h-4 w-4 mr-1" />
                    Link Note
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteResource(resource.id)}>
                    <X className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="Resource title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                placeholder="Resource description"
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="Resource URL"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newResource.category}
                onValueChange={(category) => setNewResource({ ...newResource, category })}
              >
                <SelectTrigger id="category">
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
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={newResource.tags.join(", ")}
                onChange={(e) =>
                  setNewResource({ ...newResource, tags: e.target.value.split(",").map((tag) => tag.trim()) })
                }
                placeholder="Tags (comma-separated)"
              />
            </div>
            <div>
              <Label htmlFor="file-upload">Attachments</Label>
              <Input id="file-upload" type="file" onChange={handleFileUpload} />
              {newResource.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center mt-2">
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span className="text-sm">{attachment.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addResource}>Add Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
