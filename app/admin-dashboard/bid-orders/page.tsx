"use client"

import {
  CheckCircle2,
  Clock,
  Eye, Filter,
  Loader2,
  Plus,
  XCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRoleAuth } from "@/hooks/use-role-auth"

interface BidOrder {
  _id: string
  orderId: string
  orderTitle: string
  orderType: string
  status: string
  biddingDeadline: string
  totalBidsReceived: number
  lowestBidAmount?: number
  highestBidAmount?: number
  createdAt: string
  requirements: {
    eventDate: string
    location: {
      city: string
      state: string
    }
  }
}

export default function AdminBidOrdersPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("admin")
  const router = useRouter()
  const [bidOrders, setBidOrders] = useState<BidOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (isAuthorized) {
      fetchBidOrders()
    }
  }, [isAuthorized, filterStatus])

  const fetchBidOrders = async () => {
    try {
      setLoading(true)
      const url = new URL("/api/admin/bids", window.location.origin)
      if (filterStatus && filterStatus !== "all") {
        url.searchParams.append("status", filterStatus)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (data.success) {
        setBidOrders(data.data)
      } else {
        toast.error(data.error || "Failed to fetch bid orders")
      }
    } catch (error) {
      console.error("Error fetching bid orders:", error)
      toast.error("Failed to fetch bid orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      open: { variant: "default", label: "Open" },
      bidding_closed: { variant: "secondary", label: "Closed" },
      assigned: { variant: "outline", label: "Assigned" },
      in_progress: { variant: "default", label: "In Progress" },
      completed: { variant: "default", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    }

    const config = statusConfig[status] || { variant: "secondary", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  if (authLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="mx-auto w-12 h-12 text-pink-600 animate-spin" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Bid Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage vendor bidding opportunities
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin-dashboard/bid-orders/create")}
          className="flex gap-2 items-center"
        >
          <Plus className="w-4 h-4" />
          Create Bid Order
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-500" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="bidding_closed">Closed</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
        </div>
      ) : bidOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col justify-center items-center py-12">
            <XCircle className="mb-4 w-12 h-12 text-gray-400" />
            <p className="mb-4 text-gray-600">No bid orders found</p>
            <Button onClick={() => router.push("/admin-dashboard/bid-orders/create")}>
              Create Your First Bid Order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bidOrders.map((order) => (
            <Card key={order._id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-2">
                      <CardTitle className="text-lg">{order.orderTitle}</CardTitle>
                      {getStatusBadge(order.status)}
                    </div>
                    <CardDescription>
                      Order ID: {order.orderId} • {order.orderType}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="font-medium">
                      {formatDate(order.requirements.eventDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">
                      {order.requirements.location.city}, {order.requirements.location.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bidding Deadline</p>
                    <div className="flex gap-1 items-center">
                      {isDeadlinePassed(order.biddingDeadline) ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-green-500" />
                      )}
                      <p className="text-sm font-medium">
                        {formatDate(order.biddingDeadline)} {formatTime(order.biddingDeadline)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Bids</p>
                    <p className="text-lg font-medium text-primary">
                      {order.totalBidsReceived}
                    </p>
                  </div>
                </div>

                {order.lowestBidAmount && order.highestBidAmount && (
                  <div className="flex gap-6 items-center p-3 mb-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Lowest Bid</p>
                      <p className="font-bold text-green-600">
                        ₹{order.lowestBidAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Highest Bid</p>
                      <p className="font-bold text-orange-600">
                        ₹{order.highestBidAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin-dashboard/bid-orders/${order._id}`)}
                    className="flex gap-1 items-center"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  {order.status === "open" && order.totalBidsReceived > 0 && (
                    <Button
                      size="sm"
                      onClick={() => router.push(`/admin-dashboard/bid-orders/${order._id}`)}
                      className="flex gap-1 items-center"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Select Winner
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
