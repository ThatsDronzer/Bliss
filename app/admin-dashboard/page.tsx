"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { Users, Store, BookMarked, CreditCard, ArrowUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboardPage() {
  const { isAuthorized, isLoading, user } = useRoleAuth("admin");

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show nothing if not authorized (will redirect)
  if (!isAuthorized || !user) {
    return null
  }

  // Demo admin stats data
  const adminStats = {
    users: {
      total: 1250,
      growth: "+12% this month",
      newThisMonth: 85,
    },
    vendors: {
      total: 320,
      growth: "+8% this month",
      newThisMonth: 18,
    },
    bookings: {
      total: 3450,
      growth: "+15% this month",
      newThisMonth: 210,
    },
    revenue: {
      total: "₹4,25,00,000",
      growth: "+18% this month",
      platformFees: "₹42,50,000",
    },
    categories: [
      { name: "Venue", count: 85, percentage: 26 },
      { name: "Photography", count: 65, percentage: 20 },
      { name: "Catering", count: 45, percentage: 14 },
      { name: "Decoration", count: 40, percentage: 12 },
      { name: "Music", count: 35, percentage: 11 },
    ],
    monthlyData: [
      { month: "Jan", revenue: 3200000 },
      { month: "Feb", revenue: 3500000 },
      { month: "Mar", revenue: 3800000 },
      { month: "Apr", revenue: 4000000 },
      { month: "May", revenue: 4200000 },
      { month: "Jun", revenue: 4250000 },
    ],
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Dashboard Overview</h1>
        <Button variant="outline" className="w-full sm:w-auto text-sm">Last 30 Days</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{adminStats.users.total}</div>
            <p className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center mt-1 gap-0.5">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.users.growth}
              </span>
              <span className="sm:ml-1">{adminStats.users.newThisMonth} new this month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Vendors</CardTitle>
            <Store className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{adminStats.vendors.total}</div>
            <p className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center mt-1 gap-0.5">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.vendors.growth}
              </span>
              <span className="sm:ml-1">{adminStats.vendors.newThisMonth} new this month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Bookings</CardTitle>
            <BookMarked className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{adminStats.bookings.total}</div>
            <p className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center mt-1 gap-0.5">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.bookings.growth}
              </span>
              <span className="sm:ml-1">{adminStats.bookings.newThisMonth} new this month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{adminStats.revenue.total}</div>
            <p className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center mt-1 gap-0.5">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.revenue.growth}
              </span>
              <span className="sm:ml-1 break-words">Platform fees: {adminStats.revenue.platformFees}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Platform Growth</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Monthly growth statistics for the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px] lg:h-[300px] flex items-end gap-1 sm:gap-2">
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
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary"></div>
                <span className="text-xs">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Users</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Vendor Categories</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribution of vendors by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {adminStats.categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-medium truncate">{category.name}</span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{category.count} vendors</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
