"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function VendorBookingsPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("upcoming")

  // Get user role from Clerk metadata
  const userRole = user?.unsafeMetadata?.role as string || "user"

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null
  }

  // Mock bookings data - in a real app, you'd fetch this from your database
  const bookings = {
    upcoming: [
      {
        id: "1",
        clientName: "Priya Sharma",
        clientEmail: "priya@example.com",
        clientPhone: "+91 98765 43210",
        service: "Wedding Photography",
        date: "2024-02-15",
        time: "10:00 AM",
        location: "Taj Palace, Delhi",
        amount: 25000,
        status: "confirmed",
        clientAvatar: "/placeholder-user.jpg"
      },
      {
        id: "2",
        clientName: "Rahul Verma",
        clientEmail: "rahul@example.com",
        clientPhone: "+91 98765 43211",
        service: "Venue Booking",
        date: "2024-02-20",
        time: "2:00 PM",
        location: "Leela Palace, Mumbai",
        amount: 150000,
        status: "pending",
        clientAvatar: "/placeholder-user.jpg"
      }
    ],
    completed: [
      {
        id: "3",
        clientName: "Anjali Patel",
        clientEmail: "anjali@example.com",
        clientPhone: "+91 98765 43212",
        service: "Catering Services",
        date: "2024-01-30",
        time: "6:00 PM",
        location: "Hyatt Regency, Bangalore",
        amount: 75000,
        status: "completed",
        clientAvatar: "/placeholder-user.jpg"
      }
    ],
    cancelled: [
      {
        id: "4",
        clientName: "Suresh Kumar",
        clientEmail: "suresh@example.com",
        clientPhone: "+91 98765 43213",
        service: "Decoration Services",
        date: "2024-01-25",
        time: "4:00 PM",
        location: "ITC Maurya, Delhi",
        amount: 45000,
        status: "cancelled",
        clientAvatar: "/placeholder-user.jpg"
      }
    ]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <ClockIcon className="h-4 w-4 text-yellow-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={booking.clientAvatar} alt={booking.clientName} />
              <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
            </Avatar>
        <div>
              <CardTitle className="text-lg">{booking.clientName}</CardTitle>
              <CardDescription>{booking.service}</CardDescription>
        </div>
      </div>
          <div className="text-right">
            <div className="text-lg font-semibold">₹{booking.amount.toLocaleString()}</div>
            {getStatusBadge(booking.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span>{booking.date}</span>
        </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-gray-400" />
              <span>{booking.time}</span>
      </div>
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              <span>{booking.location}</span>
                </div>
              </div>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-gray-400" />
              <span>{booking.clientName}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-gray-400" />
              <span>{booking.clientEmail}</span>
                  </div>
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-gray-400" />
              <span>{booking.clientPhone}</span>
                  </div>
                  </div>
                </div>
        <Separator className="my-4" />
        <div className="flex justify-end space-x-2">
          {booking.status === "pending" && (
            <>
              <Button variant="outline" size="sm">Decline</Button>
              <Button size="sm">Accept</Button>
                  </>
                )}
          {booking.status === "confirmed" && (
            <>
              <Button variant="outline" size="sm">Reschedule</Button>
              <Button size="sm">Mark Complete</Button>
            </>
          )}
          <Button variant="outline" size="sm">View Details</Button>
                      </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
        <p className="text-gray-600">Manage your service bookings and appointments</p>
                    </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.upcoming.length + bookings.completed.length + bookings.cancelled.length}
                        </p>
                      </div>
              <Calendar className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.upcoming.length}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-600" />
                        </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.completed.length}</p>
                        </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.cancelled.length}</p>
                      </div>
              <XCircle className="h-8 w-8 text-red-600" />
                    </div>
          </CardContent>
        </Card>
                  </div>

      {/* Bookings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({bookings.upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({bookings.completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({bookings.cancelled.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {bookings.upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
                <p className="text-gray-500">You don't have any upcoming bookings at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            bookings.upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {bookings.completed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed bookings</h3>
                <p className="text-gray-500">You haven't completed any bookings yet.</p>
              </CardContent>
            </Card>
          ) : (
            bookings.completed.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {bookings.cancelled.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cancelled bookings</h3>
                <p className="text-gray-500">You don't have any cancelled bookings.</p>
              </CardContent>
            </Card>
          ) : (
            bookings.cancelled.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
