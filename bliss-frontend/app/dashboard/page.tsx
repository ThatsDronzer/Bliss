"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { BookMarked, Heart, MessageSquare, TrendingUp, Star, Gift, Store, Calendar, MapPin, Users, BarChart } from "lucide-react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    } else if (isLoaded && isSignedIn) {
      setIsLoading(false)
    }
  }, [isSignedIn, isLoaded, router])

  // Show loading while checking authentication
  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show nothing if not authenticated (will redirect)
  if (!isSignedIn || !user) {
    return null
  }

  // Demo data for the dashboard
  const bookings = [
    {
      id: "booking-1",
      vendorName: "Royal Palace Venue",
      vendorCategory: "Venue",
      bookingDate: "2024-06-15",
      amount: "250000",
      status: "Confirmed",
    },
    {
      id: "booking-2",
      vendorName: "Capture Moments Photography",
      vendorCategory: "Photography",
      bookingDate: "2024-06-15",
      amount: "75000",
      status: "Pending",
    },
  ]

  const messages = [
    { id: "msg-1", unread: true },
    { id: "msg-2", unread: false },
    { id: "msg-3", unread: true },
  ]

  // Get recent bookings
  const recentBookings = bookings.slice(0, 3)

  // Get unread messages count
  const unreadMessages = messages.filter((msg) => msg.unread).length

  // Demo coins/rewards
  const userCoins = 1250

  // Demo upcoming events
  const upcomingEvents = [
    {
      id: "evt-1",
      title: "Wedding Ceremony",
      date: "2024-06-15",
      location: "Royal Palace Venue, Mumbai",
      guestCount: 250,
      progress: 75,
    },
    {
      id: "evt-2",
      title: "Reception Party",
      date: "2024-06-16",
      location: "Sunset Garden, Mumbai",
      guestCount: 400,
      progress: 60,
    },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {user.firstName || user.username || 'User'}</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Here's what's happening with your wedding planning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Bookings"
          value={bookings.length.toString()}
          icon={BookMarked}
          description={`${bookings.filter(b => b.status.toLowerCase() === "confirmed").length} confirmed`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg border border-pink-100">
          <CardHeader className="border-b border-pink-100 pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Upcoming Events</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500">Your scheduled wedding events</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-4 sm:space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-600 flex-shrink-0"></div>
                      <h3 className="font-medium text-sm sm:text-base text-gray-900">{event.title}</h3>
                    </div>
                    <Badge className="text-pink-600 border-pink-200 bg-pink-50 w-fit text-xs">
                      {new Date(event.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{event.guestCount} Guests</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Planning Progress</span>
                      <span className="text-pink-600 font-medium">{event.progress}%</span>
                    </div>
                    <Progress value={event.progress} className="h-2 bg-pink-100" />
                  </div>
                </div>
              ))}
              <div className="mt-4 sm:mt-6 text-center">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50"
                  onClick={() => router.push("/dashboard/bookings")}
                >
                  View All Events
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg border border-pink-100">
          <CardHeader className="border-b border-pink-100 pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Recent Bookings</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500">Latest vendor bookings and inquiries</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-3 sm:space-y-4">
              {recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-100 hover:border-pink-200 hover:bg-pink-50/5 transition-all cursor-pointer"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <h4 className="font-medium text-sm sm:text-base text-gray-900 truncate">{booking.vendorName}</h4>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "w-fit text-xs",
                          booking.status.toLowerCase() === "confirmed"
                            ? "text-green-600 border-green-200 bg-green-50"
                            : "text-yellow-600 border-yellow-200 bg-yellow-50"
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">{booking.vendorCategory}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-pink-600">₹{parseInt(booking.amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 sm:mt-6 text-center">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50"
                  onClick={() => router.push("/dashboard/bookings")}
                >
                  View All Bookings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 sm:mt-8">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg border border-pink-100">
          <CardHeader className="border-b border-pink-100 pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Referral Program</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500">Invite friends and earn rewards</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <Button 
              variant="outline" 
              className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
              onClick={() => router.push("/dashboard/referral")}
            >
              Invite Friends
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
