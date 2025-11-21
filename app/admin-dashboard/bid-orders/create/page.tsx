"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface OrderItem {
  name: string
  quantity: number
  specifications: string
}

export default function CreateBidOrderPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("admin")
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [orderTitle, setOrderTitle] = useState("")
  const [orderType, setOrderType] = useState("")
  const [orderDescription, setOrderDescription] = useState("")
  const [items, setItems] = useState<OrderItem[]>([{ name: "", quantity: 1, specifications: "" }])
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventDuration, setEventDuration] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [estimatedBudget, setEstimatedBudget] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [biddingDeadline, setBiddingDeadline] = useState("")
  const [minimumBid, setMinimumBid] = useState("")
  const [maximumBid, setMaximumBid] = useState("")

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, specifications: "" }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validation
      if (!orderTitle || !orderType || !orderDescription) {
        toast.error("Please fill in all required fields")
        setSubmitting(false)
        return
      }

      if (!eventDate || !biddingDeadline) {
        toast.error("Event date and bidding deadline are required")
        setSubmitting(false)
        return
      }

      if (new Date(biddingDeadline) <= new Date()) {
        toast.error("Bidding deadline must be in the future")
        setSubmitting(false)
        return
      }

      if (new Date(biddingDeadline) >= new Date(eventDate)) {
        toast.error("Bidding deadline must be before event date")
        setSubmitting(false)
        return
      }

      const validItems = items.filter((item) => item.name.trim() !== "")
      if (validItems.length === 0) {
        toast.error("Please add at least one item")
        setSubmitting(false)
        return
      }

      const payload = {
        orderType,
        orderTitle,
        orderDescription,
        requirements: {
          items: validItems,
          eventDate,
          eventTime,
          eventDuration,
          location: {
            address,
            city,
            state,
            pinCode,
          },
          estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : undefined,
          specialInstructions,
        },
        biddingDeadline,
        minimumBid: minimumBid ? parseFloat(minimumBid) : undefined,
        maximumBid: maximumBid ? parseFloat(maximumBid) : undefined,
      }

      const response = await fetch("/api/admin/bids/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Bid order created successfully!")
        router.push("/admin-dashboard/bid-orders")
      } else {
        toast.error(data.error || "Failed to create bid order")
      }
    } catch (error) {
      console.error("Error creating bid order:", error)
      toast.error("Failed to create bid order")
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Create Bid Order</h1>
          <p className="text-sm text-gray-600 mt-1">
            Post a new order for vendors to bid on
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Order details and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderTitle">Order Title *</Label>
                <Input
                  id="orderTitle"
                  placeholder="e.g., Wedding Light & Sound Setup"
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderType">Order Type *</Label>
                <Select value={orderType} onValueChange={setOrderType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="sound">Sound</SelectItem>
                    <SelectItem value="decoration">Decoration</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="combo">Combo</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDescription">Description *</Label>
              <Textarea
                id="orderDescription"
                placeholder="Detailed description of the requirements..."
                value={orderDescription}
                onChange={(e) => setOrderDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Items Required */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Items Required</CardTitle>
                <CardDescription>List all items needed for this order</CardDescription>
              </div>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <Input
                      placeholder="e.g., LED Lights"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specifications</Label>
                    <Input
                      placeholder="Optional details"
                      value={item.specifications}
                      onChange={(e) => updateItem(index, "specifications", e.target.value)}
                    />
                  </div>
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="mt-8"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>When and where the service is needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime">Event Time</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDuration">Duration</Label>
                <Input
                  id="eventDuration"
                  placeholder="e.g., 4 hours"
                  value={eventDuration}
                  onChange={(e) => setEventDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">Pin Code *</Label>
                <Input
                  id="pinCode"
                  placeholder="123456"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bidding Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Bidding Configuration</CardTitle>
            <CardDescription>Set bidding deadline and budget constraints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="biddingDeadline">Bidding Deadline *</Label>
                <Input
                  id="biddingDeadline"
                  type="datetime-local"
                  value={biddingDeadline}
                  onChange={(e) => setBiddingDeadline(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedBudget">Estimated Budget (₹)</Label>
                <Input
                  id="estimatedBudget"
                  type="number"
                  placeholder="Optional"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumBid">Minimum Bid Amount (₹)</Label>
                <Input
                  id="minimumBid"
                  type="number"
                  placeholder="Optional"
                  value={minimumBid}
                  onChange={(e) => setMinimumBid(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maximumBid">Maximum Bid Amount (₹)</Label>
                <Input
                  id="maximumBid"
                  type="number"
                  placeholder="Optional"
                  value={maximumBid}
                  onChange={(e) => setMaximumBid(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special requirements or notes for vendors..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Bid Order"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
