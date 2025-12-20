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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Share2,
  Link,
  Paperclip,
  X,
  FileText,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ExternalLink,
  MoreHorizontal,
  BookOpen,
  Video,
  File,
  Wrench,
  GraduationCap,
  MoreVertical
} from "lucide-react"

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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Article": return FileText
    case "Video": return Video
    case "Book": return BookOpen
    case "Course": return GraduationCap
    case "Tool": return Wrench
    default: return File
  }
}

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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-6 w-6 text-primary" />
                Resource Library
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Organize and manage your learning resources
              </p>
            </div>
            <Button onClick={() => setIsAddingResource(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
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
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Tag" />
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
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "rating")}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-10"
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedResources.map((resource) => {
          const CategoryIcon = getCategoryIcon(resource.category)
          return (
            <Card key={resource.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CategoryIcon className="h-4 w-4 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 cursor-pointer ${
                          star <= resource.rating
                            ? "text-yellow-400 fill-current"
                            : "text-muted-foreground/30 hover:text-yellow-400/50"
                        }`}
                        onClick={() => updateResource(resource.id, { rating: star })}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-semibold text-base mb-2 line-clamp-2">{resource.title}</h3>

                {resource.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                )}

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-3 group"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate max-w-[200px]">{resource.url}</span>
                </a>

                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {resource.attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Paperclip className="h-3 w-3" />
                    <span>{resource.attachments.length} attachment{resource.attachments.length > 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(resource.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => shareResource(resource)}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => linkNote(resource.id)}
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteResource(resource.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAndSortedResources.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterTag !== "all" || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Start building your resource library"}
            </p>
            <Button onClick={() => setIsAddingResource(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Resource
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Resource
            </DialogTitle>
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
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newResource.category}
                  onValueChange={(category) => setNewResource({ ...newResource, category })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
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
                  placeholder="tag1, tag2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="file-upload">Attachments</Label>
              <Input id="file-upload" type="file" onChange={handleFileUpload} />
              {newResource.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between mt-2 p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{attachment.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingResource(false)}>
              Cancel
            </Button>
            <Button onClick={addResource} disabled={!newResource.title || !newResource.url}>
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
