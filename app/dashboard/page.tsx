"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BookMarked, Heart, MessageSquare, TrendingUp, Star, Gift, Store, Calendar, MapPin, Users, BarChart } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, bookings, favorites, messages } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your wedding planning</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/vendors")}
            className="dashboard-button-outline"
          >
            Browse Vendors
          </Button>
          <Button
            onClick={() => router.push("/dashboard/events/new")}
            className="dashboard-button"
          >
            Plan New Event
          </Button>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatsCard
          title="Total Bookings"
          value={bookings.length.toString()}
          icon={BookMarked}
          description={`${bookings.filter(b => b.status.toLowerCase() === "confirmed").length} confirmed`}
          className="dashboard-stat-card"
        />
        <StatsCard
          title="Total Spent"
          value={`₹${bookings.reduce((sum, b) => sum + parseInt(b.amount), 0).toLocaleString()}`}
          icon={BarChart}
          description="Wedding budget utilized"
          className="dashboard-stat-card"
        />
        <StatsCard
          title="Saved Vendors"
          value={favorites.length.toString()}
          icon={Heart}
          trend={{ value: "+5 this week", positive: true }}
          className="dashboard-stat-card"
        />
        <StatsCard
          title="Unread Messages"
          value={unreadMessages.toString()}
          icon={MessageSquare}
          className="dashboard-stat-card"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="dashboard-card">
          <CardHeader className="dashboard-card-header">
            <CardTitle className="dashboard-card-title">Upcoming Events</CardTitle>
            <CardDescription className="dashboard-card-description">Your scheduled wedding events</CardDescription>
          </CardHeader>
          <CardContent className="dashboard-card-content">
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-600"></div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                    </div>
                    <Badge className="dashboard-badge">
                      {new Date(event.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{event.guestCount} Guests</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Planning Progress</span>
                      <span className="text-pink-600 font-medium">{event.progress}%</span>
                    </div>
                    <Progress value={event.progress} className="dashboard-progress" />
                  </div>
                </div>
              ))}
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  className="dashboard-button-outline"
                  onClick={() => router.push("/dashboard/events")}
                >
                  View All Events
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="dashboard-card-header">
            <CardTitle className="dashboard-card-title">Recent Bookings</CardTitle>
            <CardDescription className="dashboard-card-description">Latest vendor bookings and inquiries</CardDescription>
          </CardHeader>
          <CardContent className="dashboard-card-content">
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-pink-200 hover:bg-pink-50/5 transition-all cursor-pointer"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <div className="dashboard-icon-container">
                    <Store className="dashboard-icon" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{booking.vendorName}</h4>
                      <Badge 
                        variant="outline" 
                        className={
                          booking.status.toLowerCase() === "confirmed"
                            ? "dashboard-badge-success"
                            : "dashboard-badge-warning"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{booking.vendorCategory}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <span className="text-xs font-medium text-pink-600">₹{parseInt(booking.amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  className="dashboard-button-outline"
                  onClick={() => router.push("/dashboard/bookings")}
                >
                  View All Bookings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="dashboard-card">
          <CardHeader className="dashboard-card-header">
            <CardTitle className="dashboard-card-title">Rewards & Referrals</CardTitle>
            <CardDescription className="dashboard-card-description">Your rewards and referral program status</CardDescription>
          </CardHeader>
          <CardContent className="dashboard-card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="dashboard-icon-container">
                    <Gift className="dashboard-icon" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bliss Coins</p>
                    <p className="text-2xl font-bold text-gray-900">{userCoins}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="dashboard-button-outline w-full"
                  onClick={() => router.push("/dashboard/rewards")}
                >
                  Redeem Coins
                </Button>
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="dashboard-icon-container">
                    <Users className="dashboard-icon" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Referrals</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="dashboard-button-outline w-full"
                  onClick={() => router.push("/dashboard/referral")}
                >
                  Invite Friends
                </Button>
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="dashboard-icon-container">
                    <Star className="dashboard-icon" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reviews Given</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="dashboard-button-outline w-full"
                  onClick={() => router.push("/dashboard/reviews")}
                >
                  Write Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
