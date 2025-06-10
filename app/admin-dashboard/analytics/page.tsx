"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart, LineChart, PieChart, ArrowUp, Users, Store, CreditCard } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, adminStats } = useAuth()

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <Select defaultValue="30">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.vendors.total}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.vendors.growth}
              </span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.revenue.total}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                {adminStats.revenue.growth}
              </span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
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

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New Users</p>
                  <p className="text-2xl font-bold">{adminStats.users.newThisMonth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold">{adminStats.users.active}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Retention Rate</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Top Rated</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <div>
                  <p className="text-sm font-medium">New Vendors</p>
                  <p className="text-2xl font-bold">{adminStats.vendors.newThisMonth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold">4.5</p>
                </div>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 