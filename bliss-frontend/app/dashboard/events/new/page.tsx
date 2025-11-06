"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Users, CalendarDays } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function NewEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const eventTypes = [
    { value: "wedding", label: "Wedding Ceremony" },
    { value: "reception", label: "Wedding Reception" },
    { value: "engagement", label: "Engagement" },
    { value: "sangeet", label: "Sangeet" },
    { value: "mehendi", label: "Mehendi" },
    { value: "birthday", label: "Birthday Party" },
    { value: "corporate", label: "Corporate Event" },
    { value: "other", label: "Other" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Event Created",
        description: "Your event has been created successfully.",
      })
      router.push("/dashboard/events")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <p className="text-gray-500 mt-1">Fill in the details for your upcoming event</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Basic information about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input id="eventName" placeholder="Enter event name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input id="eventDate" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTime">Event Time</Label>
                  <Input id="eventTime" type="time" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter event location" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestCount">Expected Guest Count</Label>
                  <Input id="guestCount" type="number" min="1" placeholder="Enter number of guests" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about your event"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Required Services</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Venue",
                    "Catering",
                    "Photography",
                    "Decoration",
                    "Music & DJ",
                    "Mehendi Artist",
                    "Makeup Artist",
                    "Wedding Cards",
                  ].map((service) => (
                    <label key={service} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 