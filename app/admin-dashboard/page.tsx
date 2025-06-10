"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Store, BookMarked, CreditCard, ArrowUp } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, adminStats, adminUsers, adminVendors, bookings } = useAuth()

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // Get recent users
  const recentUsers = adminUsers.slice(0, 5)

  // Get recent vendors
  const recentVendors = adminVendors.slice(0, 5)

  // Get recent bookings
  const recentBookings = bookings.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button variant="outline">Last 30 Days</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.users.total}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.users.growth}
              </span>
              <span>{adminStats.users.newThisMonth} new this month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.vendors.total}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.vendors.growth}
              </span>
              <span>{adminStats.vendors.newThisMonth} new this month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.bookings.total}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.bookings.growth}
              </span>
              <span>{adminStats.bookings.newThisMonth} new this month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.revenue.total}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.revenue.growth}
              </span>
              <span>Platform fees: {adminStats.revenue.platformFees}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>Monthly growth statistics for the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end gap-2">
              {adminStats.monthlyData.slice(-6).map((data) => (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary/20 rounded-t-sm"
                    style={{ height: `${(data.revenue / 4250000) * 100}%` }}
                  >
                    <div
                      className="w-full bg-primary rounded-t-sm"
                      style={{ height: `${(data.revenue / 4250000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Users</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Categories</CardTitle>
            <CardDescription>Distribution of vendors by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminStats.categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.count} vendors</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="vendors">Recent Vendors</TabsTrigger>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>Latest users who joined the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Joined: {user.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/admin-dashboard/users")}>
                  View All Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vendors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Vendor Registrations</CardTitle>
              <CardDescription>Latest vendors who joined the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {vendor.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{vendor.name}</h4>
                        <p className="text-sm text-gray-500">{vendor.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            vendor.status === "Verified"
                              ? "bg-green-100 text-green-800"
                              : vendor.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Joined: {vendor.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/admin-dashboard/vendors")}>
                  View All Vendors
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest bookings made on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {booking.vendorCategory.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{booking.clientName}</h4>
                        <p className="text-sm text-gray-500">{booking.vendorName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{booking.amount}</div>
                      <div className="text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/admin-dashboard/bookings")}>
                  View All Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
