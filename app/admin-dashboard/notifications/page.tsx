"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function AdminNotificationsPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuth()
  const [filter, setFilter] = useState("all")

  // Demo notifications data
  const notifications = [
    {
      id: "1",
      title: "New Vendor Registration",
      message: "Royal Palace has registered as a new vendor.",
      type: "info",
      status: "unread",
      createdAt: "2024-03-15T10:30:00Z",
    },
    {
      id: "2",
      title: "Payment Failed",
      message: "Payment for booking #BK002 has failed. Action required.",
      type: "error",
      status: "unread",
      createdAt: "2024-03-15T09:45:00Z",
    },
    {
      id: "3",
      title: "Booking Confirmed",
      message: "Booking #BK001 has been confirmed successfully.",
      type: "success",
      status: "read",
      createdAt: "2024-03-14T15:20:00Z",
    },
    {
      id: "4",
      title: "System Update",
      message: "System maintenance scheduled for tonight at 2 AM.",
      type: "warning",
      status: "read",
      createdAt: "2024-03-14T11:00:00Z",
    },
  ]

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const handleMarkAllAsRead = () => {
    toast({
      title: "Success",
      description: "All notifications marked as read.",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    return notification.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button onClick={handleMarkAllAsRead}>Mark All as Read</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter((n) => n.status === "unread").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Read</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter((n) => n.status === "read").length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={notification.status === "unread" ? "bg-gray-50" : ""}>
            <CardContent className="flex items-start gap-4 p-6">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-600">{notification.message}</p>
              </div>
              {notification.status === "unread" && (
                <Button variant="ghost" size="sm">
                  Mark as Read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 