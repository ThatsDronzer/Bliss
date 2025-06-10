"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Calendar, Phone, Mail, Check, X } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { useBooking } from "@/hooks/use-booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function VendorBookingsPage() {
  const router = useRouter()
  const { isAuthenticated, isVendor, bookings } = useAuth()
  const { handleBookingCompletion, isProcessing } = useBooking()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"confirm" | "reject" | null>(null)

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      router.push("/")
    }
  }, [isAuthenticated, isVendor, router])

  if (!isAuthenticated || !isVendor) {
    return null
  }

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    // Only show bookings for this vendor (venue-example for demo)
    if (booking.vendorId !== "venue-example") return false

    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.eventDetails.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
    setDialogOpen(true)
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    // Extract numeric amount from string (e.g., "₹2,50,000" -> 250000)
    const numericAmount = parseInt(selectedBooking.amount.replace(/[^0-9]/g, ""))
    
    const success = await handleBookingCompletion(
      bookingId,
      selectedBooking.clientId, // You'll need to add this to your booking data
      numericAmount,
      newStatus
    )

    if (success) {
      setDialogOpen(false)
    }
  }

  const handleActionClick = (booking: any, action: "confirm" | "reject") => {
    setSelectedBooking(booking)
    setActionType(action)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage your client bookings and reservations</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bookings..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={booking.image || "/placeholder.svg"}
                  alt={booking.vendorName}
                  width={400}
                  height={225}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{booking.clientName}</h3>
                <p className="text-sm text-gray-500">{booking.eventDetails}</p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Booking Date: {booking.bookingDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Payment Status:</span>
                    <span
                      className={`text-sm ${booking.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Amount:</span>
                    <span className="text-sm font-bold">{booking.amount}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(booking)}>
                  View Details
                </Button>
                {booking.status === "Pending" && (
                  <>
                    <Button 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => handleActionClick(booking, "confirm")}
                      disabled={isProcessing}
                    >
                      <Check className="w-4 h-4 mr-1" /> Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600"
                      onClick={() => handleActionClick(booking, "reject")}
                      disabled={isProcessing}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium">No bookings found</p>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedBooking && (
            <>
              {actionType ? (
                <>
                  <DialogHeader>
                    <DialogTitle>{actionType === "confirm" ? "Confirm Booking" : "Reject Booking"}</DialogTitle>
                    <DialogDescription>
                      {actionType === "confirm"
                        ? "Are you sure you want to confirm this booking?"
                        : "Are you sure you want to reject this booking?"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={selectedBooking.image || "/placeholder.svg"}
                          alt={selectedBooking.clientName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{selectedBooking.clientName}</h3>
                        <p className="text-gray-500">{selectedBooking.eventDetails}</p>
                        <p className="text-sm">Booking Date: {selectedBooking.bookingDate}</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isProcessing}>
                      Cancel
                    </Button>
                    <Button
                      variant={actionType === "confirm" ? "default" : "destructive"}
                      onClick={() =>
                        handleStatusChange(selectedBooking.id, actionType === "confirm" ? "Confirmed" : "Cancelled")
                      }
                      disabled={isProcessing}
                    >
                      {actionType === "confirm" ? "Confirm Booking" : "Reject Booking"}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>Complete information about this booking</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden">
                        <Image
                          src={selectedBooking.image || "/placeholder.svg"}
                          alt={selectedBooking.clientName}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{selectedBooking.clientName}</h3>
                        <p className="text-gray-500">{selectedBooking.eventDetails}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              selectedBooking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : selectedBooking.status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {selectedBooking.status}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              selectedBooking.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {selectedBooking.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Booking ID</p>
                        <p className="font-medium">{selectedBooking.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Booking Date</p>
                        <p className="font-medium">{selectedBooking.bookingDate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">{selectedBooking.amount}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p
                          className={`font-medium ${
                            selectedBooking.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {selectedBooking.paymentStatus}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Contact</p>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="font-medium">{selectedBooking.clientPhone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="font-medium">{selectedBooking.clientEmail}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Guest Count</p>
                        <p className="font-medium">{selectedBooking.guestCount} guests</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Close
                    </Button>
                    {selectedBooking.status === "Pending" && (
                      <>
                        <Button 
                          onClick={() => handleStatusChange(selectedBooking.id, "Confirmed")}
                          disabled={isProcessing}
                        >
                          Confirm Booking
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleStatusChange(selectedBooking.id, "Cancelled")}
                          disabled={isProcessing}
                        >
                          Reject Booking
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
