"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Loader2,
  Trophy,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Bid {
  _id: string
  vendor: {
    _id: string
    service_name: string
    ownerName: string
    owner_contactNo: string[]
    ownerEmail: string
    isVerified: boolean
    biddingStats?: {
      wonBids: number
      totalBids: number
      winRate: number
    }
  }
  totalPrice: number
  additionalServices: Array<{
    name: string
    description: string
    included: boolean
  }>
  proposalNotes?: string
  deliveryTimeline?: string
  submittedAt: string
  status: string
  isWinner: boolean
}

interface BidOrder {
  _id: string
  orderId: string
  orderTitle: string
  orderType: string
  orderDescription: string
  status: string
  biddingDeadline: string
  totalBidsReceived: number
  lowestBidAmount?: number
  highestBidAmount?: number
  requirements: any
  winningBid?: any
  assignedVendor?: any
}

export default function BidOrderDetailsPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("admin")
  const router = useRouter()
  const params = useParams()
  const orderId = params?.orderId as string

  const [bidOrder, setBidOrder] = useState<BidOrder | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [selectingWinner, setSelectingWinner] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [prebookingAmount, setPrebookingAmount] = useState("")

  useEffect(() => {
    if (isAuthorized && orderId) {
      fetchBidOrderDetails()
    }
  }, [isAuthorized, orderId])

  const fetchBidOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/bids/${orderId}`)
      const data = await response.json()

      if (data.success) {
        setBidOrder(data.data.bidOrder)
        setBids(data.data.bids)
      } else {
        toast.error(data.error || "Failed to fetch bid order details")
      }
    } catch (error) {
      console.error("Error fetching bid order details:", error)
      toast.error("Failed to fetch bid order details")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectWinner = async () => {
    try {
      setSelectingWinner(true)
      const response = await fetch(`/api/admin/bids/${orderId}/select-winner`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Lowest bid selected as winner!")
        fetchBidOrderDetails() // Refresh data
      } else {
        toast.error(data.error || "Failed to select winner")
      }
    } catch (error) {
      console.error("Error selecting winner:", error)
      toast.error("Failed to select winner")
    } finally {
      setSelectingWinner(false)
    }
  }

  const handleAssignOrder = async () => {
    try {
      setAssigning(true)
      const response = await fetch(`/api/admin/bids/${orderId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prebookingAmount: prebookingAmount ? parseFloat(prebookingAmount) : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Order assigned to vendor successfully!")
        setShowAssignDialog(false)
        fetchBidOrderDetails()
      } else {
        toast.error(data.error || "Failed to assign order")
      }
    } catch (error) {
      console.error("Error assigning order:", error)
      toast.error("Failed to assign order")
    } finally {
      setAssigning(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      open: { variant: "default", label: "Open for Bidding" },
      bidding_closed: { variant: "secondary", label: "Bidding Closed" },
      assigned: { variant: "outline", label: "Assigned" },
      completed: { variant: "default", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    }

    const config = statusConfig[status] || { variant: "secondary", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
        </div>
      </div>
    )
  }

  if (!isAuthorized || !bidOrder) {
    return null
  }

  const lowestBid = bids.length > 0 ? bids[0] : null
  const hasWinner = bidOrder.winningBid !== null && bidOrder.winningBid !== undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl lg:text-3xl font-bold">{bidOrder.orderTitle}</h1>
            {getStatusBadge(bidOrder.status)}
          </div>
          <p className="text-sm text-gray-600">Order ID: {bidOrder.orderId}</p>
        </div>
        {bidOrder.status === "open" && bids.length > 0 && !hasWinner && (
          <Button onClick={handleSelectWinner} disabled={selectingWinner}>
            {selectingWinner ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Selecting...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Select Winner (Lowest Bid)
              </>
            )}
          </Button>
        )}
        {hasWinner && bidOrder.status === "bidding_closed" && (
          <Button onClick={() => setShowAssignDialog(true)}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Assign Order to Vendor
          </Button>
        )}
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Type</p>
              <p className="font-medium capitalize">{bidOrder.orderType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Event Date</p>
              <p className="font-medium">
                {new Date(bidOrder.requirements.eventDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bidding Deadline</p>
              <p className="font-medium">{formatDate(bidOrder.biddingDeadline)}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-sm">{bidOrder.orderDescription}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Location</p>
            <p className="text-sm">
              {bidOrder.requirements.location.address}, {bidOrder.requirements.location.city},{" "}
              {bidOrder.requirements.location.state} - {bidOrder.requirements.location.pinCode}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bidding Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{bidOrder.totalBidsReceived}</p>
          </CardContent>
        </Card>
        {bidOrder.lowestBidAmount && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-500" />
                Lowest Bid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                ₹{bidOrder.lowestBidAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}
        {bidOrder.highestBidAmount && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Highest Bid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                ₹{bidOrder.highestBidAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bids List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bids ({bids.length})</CardTitle>
          <CardDescription>Sorted by price (lowest to highest)</CardDescription>
        </CardHeader>
        <CardContent>
          {bids.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bids received yet. Waiting for vendors to submit their quotes.
            </div>
          ) : (
            <div className="space-y-4">
              {bids.map((bid, index) => (
                <Card
                  key={bid._id}
                  className={`${
                    bid.isWinner
                      ? "border-2 border-green-500 bg-green-50"
                      : index === 0 && !hasWinner
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {bid.vendor.service_name || bid.vendor.ownerName}
                          </h3>
                          {bid.isWinner && (
                            <Badge className="bg-green-600">
                              <Award className="w-3 h-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                          {index === 0 && !hasWinner && (
                            <Badge variant="secondary">Lowest Bid</Badge>
                          )}
                          {bid.vendor.isVerified && (
                            <Badge variant="outline">Verified</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Contact: {bid.vendor.owner_contactNo?.[0]}</p>
                          <p>Email: {bid.vendor.ownerEmail}</p>
                          {bid.vendor.biddingStats && (
                            <p>
                              Win Rate: {bid.vendor.biddingStats.wonBids}/
                              {bid.vendor.biddingStats.totalBids} ({bid.vendor.biddingStats.winRate?.toFixed(1)}%)
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          ₹{bid.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {formatDate(bid.submittedAt)}
                        </p>
                      </div>
                    </div>

                    {bid.additionalServices && bid.additionalServices.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Additional Services:</p>
                        <ul className="text-sm space-y-1">
                          {bid.additionalServices.map((service, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                              <span>
                                {service.name} {service.included && "(Free)"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {bid.proposalNotes && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Proposal Notes:</p>
                        <p className="text-sm text-gray-600">{bid.proposalNotes}</p>
                      </div>
                    )}

                    {bid.deliveryTimeline && (
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="font-medium">Delivery Timeline:</span>{" "}
                          {bid.deliveryTimeline}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Order Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Order to Vendor</DialogTitle>
            <DialogDescription>
              Confirm order assignment and set prebooking amount (if required)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {lowestBid && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Winner Vendor:</p>
                <p className="font-semibold text-lg">{lowestBid.vendor.service_name}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ₹{lowestBid.totalPrice.toLocaleString()}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="prebookingAmount">
                Prebooking Amount (Optional)
              </Label>
              <Input
                id="prebookingAmount"
                type="number"
                placeholder="Enter amount vendor needs to pay"
                value={prebookingAmount}
                onChange={(e) => setPrebookingAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Leave empty if no prebooking payment is required from the vendor
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignOrder} disabled={assigning}>
              {assigning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Confirm Assignment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
