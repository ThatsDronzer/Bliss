"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useEffect, useState } from "react"
import { Clock, MapPin, Loader2, Send, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface BidOrder {
  _id: string
  orderId: string
  orderTitle: string
  orderType: string
  orderDescription: string
  status: string
  biddingDeadline: string
  totalBidsReceived: number
  requirements: {
    eventDate: string
    location: {
      city: string
      state: string
    }
    items: Array<{
      name: string
      quantity?: number
    }>
  }
}

export default function VendorBidOpportunitiesPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("vendor")
  const [bidOrders, setBidOrders] = useState<BidOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [canBid, setCanBid] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<BidOrder | null>(null)
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Bid form state
  const [totalPrice, setTotalPrice] = useState("")
  const [proposalNotes, setProposalNotes] = useState("")
  const [deliveryTimeline, setDeliveryTimeline] = useState("")
  const [additionalService, setAdditionalService] = useState("")
  const [additionalServices, setAdditionalServices] = useState<string[]>([])

  useEffect(() => {
    if (isAuthorized) {
      fetchBidOpportunities()
    }
  }, [isAuthorized])

  const fetchBidOpportunities = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vendor/bid-orders")
      const data = await response.json()

      if (data.success) {
        setBidOrders(data.data)
        setCanBid(data.canBid)
      } else {
        toast.error(data.error || "Failed to fetch bid opportunities")
        setCanBid(false)
      }
    } catch (error) {
      console.error("Error fetching bid opportunities:", error)
      toast.error("Failed to fetch bid opportunities")
    } finally {
      setLoading(false)
    }
  }

  const openBidDialog = (order: BidOrder) => {
    setSelectedOrder(order)
    setTotalPrice("")
    setProposalNotes("")
    setDeliveryTimeline("")
    setAdditionalServices([])
    setShowBidDialog(true)
  }

  const addAdditionalService = () => {
    if (additionalService.trim()) {
      setAdditionalServices([...additionalServices, additionalService.trim()])
      setAdditionalService("")
    }
  }

  const handleSubmitBid = async () => {
    if (!selectedOrder || !totalPrice) {
      toast.error("Please enter the total price")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`/api/vendor/bid-orders/${selectedOrder._id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalPrice: parseFloat(totalPrice),
          additionalServices: additionalServices.map((name) => ({
            name,
            description: "",
            included: true,
          })),
          proposalNotes,
          deliveryTimeline,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Bid submitted successfully!")
        setShowBidDialog(false)
        fetchBidOpportunities() // Refresh list
      } else {
        toast.error(data.error || "Failed to submit bid")
      }
    } catch (error) {
      console.error("Error submitting bid:", error)
      toast.error("Failed to submit bid")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime()
    const deadlineTime = new Date(deadline).getTime()
    const diff = deadlineTime - now

    if (diff < 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
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

  if (!isAuthorized) {
    return null
  }

  if (!canBid) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Bid Opportunities</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to complete KYC verification and get admin approval before you can participate in bidding.
            Please visit the <a href="/vendor-dashboard/kyc" className="font-medium underline">KYC Verification</a> page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Bid Opportunities</h1>
        <p className="text-sm text-gray-600 mt-1">
          Browse and bid on available orders
        </p>
      </div>

      {bidOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">No bid opportunities available at the moment</p>
            <p className="text-sm text-gray-500 mt-2">Check back later for new orders</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bidOrders.map((order) => (
            <Card key={order._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{order.orderTitle}</CardTitle>
                    <CardDescription className="mt-1">
                      {order.orderType} • Order ID: {order.orderId}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{getTimeRemaining(order.biddingDeadline)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{order.orderDescription}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="font-medium">{formatDate(order.requirements.eventDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.requirements.location.city}, {order.requirements.location.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Bids</p>
                    <p className="font-medium text-primary">{order.totalBidsReceived}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Items Required:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.requirements.items.map((item, idx) => (
                      <Badge key={idx} variant="outline">
                        {item.name} {item.quantity && `(${item.quantity})`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={() => openBidDialog(order)} className="w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Bid
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bid Submission Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Your Bid</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Total Price (₹) *</Label>
              <Input
                id="totalPrice"
                type="number"
                placeholder="Enter your quote"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryTimeline">Delivery Timeline</Label>
              <Input
                id="deliveryTimeline"
                placeholder="e.g., 2 days before event"
                value={deliveryTimeline}
                onChange={(e) => setDeliveryTimeline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposalNotes">Proposal Notes</Label>
              <Textarea
                id="proposalNotes"
                placeholder="Explain your approach, experience, and why you're the best fit..."
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Services (Free)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Free setup assistance"
                  value={additionalService}
                  onChange={(e) => setAdditionalService(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAdditionalService())}
                />
                <Button type="button" variant="outline" onClick={addAdditionalService}>
                  Add
                </Button>
              </div>
              {additionalServices.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {additionalServices.map((service, idx) => (
                    <Badge key={idx} variant="secondary">
                      {service}
                      <button
                        onClick={() =>
                          setAdditionalServices(additionalServices.filter((_, i) => i !== idx))
                        }
                        className="ml-2 text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBidDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitBid} disabled={submitting || !totalPrice}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Bid"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
