"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, BookMarked, MessageSquare, Users, CreditCard } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VendorAnalyticsPage() {
  const router = useRouter()
  const { isAuthenticated, isVendor, vendorAnalytics } = useAuth()

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      router.push("/")
    }
  }, [isAuthenticated, isVendor, router])

  if (!isAuthenticated || !isVendor) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your business performance and insights</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 12 Months
          </Button>
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
          icon={CreditCard}
          description={`${vendorAnalytics.revenue.received} received`}
        />
        <StatsCard
          title="Profile Views"
          value={vendorAnalytics.profileViews.total.toString()}
          icon={Users}
          trend={{ value: "+12% this month", positive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value={vendorAnalytics.inquiries.conversionRate}
          icon={MessageSquare}
          description={`${vendorAnalytics.inquiries.converted} bookings from ${vendorAnalytics.inquiries.total} inquiries`}
        />
      </div>

      <Tabs defaultValue="bookings" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="views">Profile Views</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Monthly booking statistics for the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end gap-2">
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
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.bookings.total}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Confirmed</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.bookings.confirmed}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.bookings.pending}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.bookings.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Monthly revenue statistics for the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end gap-2">
                {vendorAnalytics.revenue.monthlyData.map((data) => (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-primary/20 rounded-t-sm"
                      style={{ height: `${(data.revenue / 1000000) * 100}%` }}
                    >
                      <div
                        className="w-full bg-primary rounded-t-sm"
                        style={{ height: `${(data.revenue / 1000000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.revenue.total}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Received</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.revenue.received}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.revenue.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Profile Views</CardTitle>
              <CardDescription>Monthly profile view statistics for the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end gap-2">
                {vendorAnalytics.profileViews.monthlyData.map((data) => (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-primary/20 rounded-t-sm"
                      style={{ height: `${(data.views / 150) * 100}%` }}
                    >
                      <div
                        className="w-full bg-primary rounded-t-sm"
                        style={{ height: `${(data.views / 150) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.profileViews.total}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Average Monthly</p>
                  <p className="text-2xl font-bold">{Math.round(vendorAnalytics.profileViews.total / 12)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Growth</p>
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Conversion</CardTitle>
              <CardDescription>Monthly inquiry statistics for the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end gap-2">
                {vendorAnalytics.inquiries.monthlyData.map((data) => (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-primary/20 rounded-t-sm"
                      style={{ height: `${(data.inquiries / 12) * 100}%` }}
                    >
                      <div
                        className="w-full bg-primary rounded-t-sm"
                        style={{ height: `${(data.inquiries / 12) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Inquiries</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.inquiries.total}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Converted to Bookings</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.inquiries.converted}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-bold">{vendorAnalytics.inquiries.conversionRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Your most booked services and packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Main Hall</span>
                </div>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Garden Area</span>
                </div>
                <span className="font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Banquet Hall</span>
                </div>
                <span className="font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription>Insights about your client base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Age Groups</h3>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">25-34</span>
                  </div>
                  <span className="text-sm font-medium ml-auto">65%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm">35-44</span>
                  </div>
                  <span className="text-sm font-medium ml-auto">25%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Other</span>
                  </div>
                  <span className="text-sm font-medium ml-auto">10%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Top Locations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Delhi NCR</span>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mumbai</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Jaipur</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Others</span>
                    <span className="text-sm font-medium">7%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
