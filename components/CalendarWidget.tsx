"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal } from "lucide-react"

interface Event {
  id: string
  title: string
  date: Date
  color: string
}

export function CalendarWidget() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    date: new Date(),
    color: "blue",
  })

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { ...newEvent, id: Date.now().toString() }])
      setIsAddEventOpen(false)
      setNewEvent({ title: "", date: new Date(), color: "blue" })
    }
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const eventsForSelectedDate = events.filter((event) => event.date.toDateString() === selectedDate?.toDateString())

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Calendar</CardTitle>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date.toISOString().split("T")[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Color
                  </Label>
                  <Select value={newEvent.color} onValueChange={(color) => setNewEvent({ ...newEvent, color })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addEvent}>Add Event</Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <div className="flex-1">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Events for {selectedDate?.toDateString()}</h3>
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground">No events for this date.</p>
            ) : (
              <ul className="space-y-2">
                {eventsForSelectedDate.map((event) => (
                  <li key={event.id} className="flex items-center justify-between">
                    <span className={`w-3 h-3 rounded-full bg-${event.color}-500 mr-2`}></span>
                    <span className="flex-1">{event.title}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{event.title}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Date: {event.date.toDateString()}</p>
                          <p>Color: {event.color}</p>
                        </div>
                        <Button variant="destructive" onClick={() => deleteEvent(event.id)}>
                          Delete Event
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
