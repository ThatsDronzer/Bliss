"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { BookMarked, Star, MessageSquare, BarChart, Users } from "lucide-react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function VendorDashboardPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  // Get user role from Clerk metadata
  const userRole = user?.unsafeMetadata?.role as string || "user"

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    } else if (isLoaded && isSignedIn && userRole === "vendor") {
      setIsLoading(false)
    }
  }, [isSignedIn, isLoaded, userRole, router])

  // Show loading while checking authentication
  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendor dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show nothing if not authenticated or not a vendor (will redirect)
  if (!isSignedIn || !user || userRole !== "vendor") {
    return null
  }

  // Mock vendor data - in a real app, you'd fetch this from your database
  const vendorData = {
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Vendor",
    email: user.emailAddresses[0]?.emailAddress || "vendor@example.com",
    category: "Wedding Services",
    location: "Delhi NCR",
    status: "Verified",
    joinDate: "2024-01-15",
  }

  // Mock analytics data
  const analytics = {
    totalBookings: 24,
    bookingGrowth: 12,
    averageRating: 4.8,
    ratingGrowth: 5,
    unreadMessages: 3,
    messageGrowth: -2,
    monthlyRevenue: 485000,
    revenueGrowth: 18,
    bookingCompletionRate: 95,
    avgResponseTime: 2,
    customerSatisfaction: 92,
    recentBookings: [
      {
        id: "1",
      clientName: "Priya Sharma",
        service: "Wedding Photography",
        date: "2024-01-20",
        amount: 25000,
        status: "confirmed"
      },
      {
        id: "2",
        clientName: "Rahul Verma",
        service: "Venue Booking",
        date: "2024-01-25",
        amount: 150000,
        status: "pending"
      },
      {
        id: "3",
        clientName: "Anjali Patel",
        service: "Catering Services",
        date: "2024-01-30",
        amount: 75000,
        status: "confirmed"
      }
    ]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {vendorData.name}</p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Bookings"
          value={analytics.totalBookings}
          change={analytics.bookingGrowth}
          icon={BookMarked}
          trend="up"
        />
        <StatsCard
          title="Average Rating"
          value={analytics.averageRating}
          change={analytics.ratingGrowth}
          icon={Star}
          trend="up"
        />
        <StatsCard
          title="Unread Messages"
          value={analytics.unreadMessages}
          change={analytics.messageGrowth}
          icon={MessageSquare}
          trend="neutral"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${analytics.monthlyRevenue.toLocaleString()}`}
          change={analytics.revenueGrowth}
          icon={BarChart}
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
          <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest booking requests and confirmations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {analytics.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-pink-600" />
                    </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.clientName}</p>
                        <p className="text-sm text-gray-500">{booking.service}</p>
                        <p className="text-xs text-gray-400">{booking.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{booking.amount.toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Bookings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Profile */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-600">
                    {vendorData.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{vendorData.name}</h3>
                  <p className="text-sm text-gray-500">{vendorData.category}</p>
                  <p className="text-xs text-gray-400">{vendorData.location}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-green-600">{vendorData.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Joined:</span>
                  <span className="font-medium">{vendorData.joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating:</span>
                  <span className="font-medium">⭐ {analytics.averageRating}</span>
                </div>
            </div>
          </CardContent>
        </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <BookMarked className="mr-2 h-4 w-4" />
                View Bookings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Messages
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="mr-2 h-4 w-4" />
                View Reviews
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
        <Card>
          <CardHeader>
              <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Booking Completion</span>
                    <span>{analytics.bookingCompletionRate}%</span>
                  </div>
                  <Progress value={analytics.bookingCompletionRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span>{analytics.avgResponseTime}h</span>
              </div>
                  <Progress value={100 - (analytics.avgResponseTime / 24) * 100} className="h-2" />
                      </div>
                      <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Customer Satisfaction</span>
                    <span>{analytics.customerSatisfaction}%</span>
                  </div>
                  <Progress value={analytics.customerSatisfaction} className="h-2" />
                </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
