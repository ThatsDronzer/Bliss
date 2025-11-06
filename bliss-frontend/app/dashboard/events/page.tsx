"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Search, Calendar, MapPin, Users, Filter } from "lucide-react";

import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EventsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Demo events data
  const events = [
    {
      id: "evt-1",
      title: "Wedding Ceremony",
      type: "Wedding",
      date: "2024-06-15",
      location: "Royal Palace Venue, Mumbai",
      guestCount: 250,
      progress: 75,
      status: "Planning",
      image: "/events/wedding.jpg",
      tasks: {
        total: 24,
        completed: 18
      },
      budget: {
        allocated: "₹15,00,000",
        spent: "₹11,25,000"
      }
    },
    {
      id: "evt-2",
      title: "Reception Party",
      type: "Reception",
      date: "2024-06-16",
      location: "Sunset Garden, Mumbai",
      guestCount: 400,
      progress: 60,
      status: "Planning",
      image: "/events/reception.jpg",
      tasks: {
        total: 18,
        completed: 11
      },
      budget: {
        allocated: "₹10,00,000",
        spent: "₹6,00,000"
      }
    },
    {
      id: "evt-3",
      title: "Mehndi Ceremony",
      type: "Mehndi",
      date: "2024-06-14",
      location: "Green Valley Resort, Mumbai",
      guestCount: 150,
      progress: 85,
      status: "Planning",
      image: "/events/mehndi.jpg",
      tasks: {
        total: 12,
        completed: 10
      },
      budget: {
        allocated: "₹5,00,000",
        spent: "₹4,25,000"
      }
    }
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Filter events based on search and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-gray-500 mt-1">Manage all your events in one place</p>
        </div>
        <Button onClick={() => router.push("/dashboard/events/new")} className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-gray-500">Active events in planning</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, event) => sum + event.guestCount, 0)}
            </div>
            <p className="text-xs text-gray-500">Across all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(events.reduce((sum, event) => sum + event.progress, 0) / events.length)}%
            </div>
            <p className="text-xs text-gray-500">Average completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={400}
                height={225}
                className="object-cover w-full h-full"
              />
              <Badge
                className="absolute top-3 right-3"
                variant={event.status === "Completed" ? "success" : "secondary"}
              >
                {event.status}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Event Date: {event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{event.guestCount} Guests</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Planning Progress</span>
                    <span>{event.progress}%</span>
                  </div>
                  <Progress value={event.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-gray-500">Tasks</p>
                    <p className="font-medium">
                      {event.tasks.completed}/{event.tasks.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">{event.budget.spent}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-4 bg-gray-50 flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push(`/dashboard/events/${event.id}`)}>
                View Details
              </Button>
              <Button onClick={() => router.push(`/dashboard/events/${event.id}/checklist`)}>
                Checklist
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 