"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BookMarked, Star, MessageSquare, BarChart, Users } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function VendorDashboardPage() {
  const router = useRouter()
  const { vendor, isAuthenticated, isVendor, bookings, messages, vendorAnalytics, vendorReviews } = useAuth()

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      router.push("/")
    }
  }, [isAuthenticated, isVendor, router])

  if (!isAuthenticated || !isVendor || !vendor) {
    return null
  }

  // Get upcoming bookings
  const upcomingBookings = bookings
    .filter((booking) => booking.vendorId === "venue-example" && new Date(booking.bookingDate) >= new Date())
    .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
    .slice(0, 3)

  // Get unread messages count
  const unreadMessages = messages.filter((msg) => msg.vendorId === "venue-example" && msg.unread).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {vendor.name}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your business today</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => router.push("/vendor-dashboard/listings/new")}>Add New Listing</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Bookings"
          value={vendorAnalytics.bookings.total.toString()}
          icon={BookMarked}
          description={`${vendorAnalytics.bookings.confirmed} confirmed, ${vendorAnalytics.bookings.pending} pending`}
        />
        <StatsCard
          title="Total Revenue"
          value={vendorAnalytics.revenue.total}
          icon={BarChart}
          description={`${vendorAnalytics.revenue.received} received`}
        />
        <StatsCard
          title="Profile Views"
          value={vendorAnalytics.profileViews.total.toString()}
          icon={Users}
          trend={{ value: "+12% this month", positive: true }}
        />
        <StatsCard title="Unread Messages" value={unreadMessages.toString()} icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.vendorName}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{booking.clientName}</h4>
                      <p className="text-sm text-gray-500">{booking.eventDetails}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{booking.bookingDate}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{booking.amount}</div>
                      <div
                        className={`text-xs ${booking.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {booking.paymentStatus}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming bookings</p>
                </div>
              )}
              <Button variant="outline" className="w-full" onClick={() => router.push("/vendor-dashboard/bookings")}>
                View All Bookings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>What your clients are saying</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Average Rating</span>
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>

              <div className="space-y-3">
                {vendorReviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={review.clientImage || "/placeholder.svg"}
                          alt={review.clientName}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.clientName}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 ml-auto">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{review.review}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full" onClick={() => router.push("/vendor-dashboard/reviews")}>
                View All Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Analytics</CardTitle>
            <CardDescription>Monthly booking trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-2">
              {vendorAnalytics.bookings.monthlyData.map((data) => (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary/20 rounded-t-sm"
                    style={{ height: `${(data.bookings / 4) * 100}%` }}
                  >
                    <div
                      className="w-full bg-primary rounded-t-sm"
                      style={{ height: `${(data.bookings / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => router.push("/vendor-dashboard/analytics")}>
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest client inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages
                .filter((msg) => msg.vendorId === "venue-example")
                .slice(0, 3)
                .map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center gap-4 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push("/vendor-dashboard/messages")}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={message.clientImage || "/placeholder.svg"}
                        alt={message.clientName}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{message.clientName}</h4>
                        {message.unread && <span className="ml-2 w-2 h-2 rounded-full bg-primary"></span>}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{message.lastMessage}</p>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</div>
                  </div>
                ))}
              <Button variant="outline" className="w-full" onClick={() => router.push("/vendor-dashboard/messages")}>
                View All Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
