"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useEffect, useState } from "react"
import { Trophy, XCircle, Loader2, Award, TrendingDown } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Bid {
  _id: string
  totalPrice: number
  status: string
  isWinner: boolean
  submittedAt: string
  bidOrder: {
    orderTitle: string
    orderType: string
    status: string
    requirements: {
      eventDate: string
    }
  }
}

export default function VendorMyBidsPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("vendor")
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchMyBids()
    }
  }, [isAuthorized])

  const fetchMyBids = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vendor/my-bids")
      const data = await response.json()

      if (data.success) {
        setBids(data.data)
      } else {
        toast.error(data.error || "Failed to fetch bids")
      }
    } catch (error) {
      console.error("Error fetching bids:", error)
      toast.error("Failed to fetch bids")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, isWinner: boolean) => {
    if (isWinner) {
      return <Badge className="bg-green-600"><Award className="w-3 h-3 mr-1" />Winner</Badge>
    }

    const config: Record<string, { variant: any; label: string }> = {
      submitted: { variant: "secondary", label: "Submitted" },
      won: { variant: "default", label: "Won" },
      lost: { variant: "outline", label: "Lost" },
      withdrawn: { variant: "destructive", label: "Withdrawn" },
    }
    const { variant, label } = config[status] || config.submitted
    return <Badge variant={variant}>{label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    )
  }

  if (!isAuthorized) return null

  const wonBids = bids.filter((b) => b.isWinner || b.status === "won")
  const activeBids = bids.filter((b) => b.status === "submitted" && !b.isWinner)
  const lostBids = bids.filter((b) => b.status === "lost")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Bids</h1>
        <p className="text-sm text-gray-600 mt-1">Track all your submitted bids</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              Won Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{wonBids.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{activeBids.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-gray-600" />
              Lost Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{lostBids.length}</p>
          </CardContent>
        </Card>
      </div>

      {bids.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No bids submitted yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Visit <a href="/vendor-dashboard/bid-opportunities" className="text-primary underline">Bid Opportunities</a> to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <Card key={bid._id} className={bid.isWinner ? "border-2 border-green-500" : ""}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{bid.bidOrder.orderTitle}</h3>
                      {getStatusBadge(bid.status, bid.isWinner)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Event Date: {formatDate(bid.bidOrder.requirements.eventDate)}</p>
                      <p>Submitted: {formatDate(bid.submittedAt)}</p>
                      <p className="capitalize">Order Status: {bid.bidOrder.status.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{bid.totalPrice.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Your Bid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
