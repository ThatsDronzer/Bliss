"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Calendar, MapPin, Phone, Mail } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock bookings data for demonstration
const mockBookings = [
  {
    id: "booking-1",
    vendorId: "venue-example",
    vendorName: "Royal Wedding Palace",
    vendorCategory: "Venue",
    bookingDate: "2023-12-15",
    status: "Confirmed",
    amount: "₹2,50,000",
    paymentStatus: "Paid",
    image: "/placeholder.svg?height=200&width=300&text=Venue",
    clientName: "Priya & Rahul",
    clientPhone: "+91 98765 43210",
    clientEmail: "priya.sharma@example.com",
    eventDetails: "Wedding ceremony and reception",
    guestCount: 250,
    createdAt: "2023-10-15T10:30:00",
    platformFee: "₹25,000",
  },
  {
    id: "booking-2",
    vendorId: "photographer-1",
    vendorName: "Capture Moments",
    vendorCategory: "Photography",
    bookingDate: "2023-12-15",
    status: "Confirmed",
    amount: "₹75,000",
    paymentStatus: "Paid",
    image: "/placeholder.svg?height=200&width=300&text=Photo",
    clientName: "Priya & Rahul",
    clientPhone: "+91 98765 43210",
    clientEmail: "priya.sharma@example.com",
    eventDetails: "Wedding photography package",
    createdAt: "2023-10-16T11:45:00",
    platformFee: "₹7,500",
  },
  {
    id: "booking-3",
    vendorId: "caterer-1",
    vendorName: "Spice Delight Catering",
    vendorCategory: "Catering",
    bookingDate: "2023-12-14",
    status: "Pending",
    amount: "₹1,20,000",
    paymentStatus: "Pending",
    image: "/placeholder.svg?height=200&width=300&text=Food",
    clientName: "Priya & Rahul",
    clientPhone: "+91 98765 43210",
    clientEmail: "priya.sharma@example.com",
    eventDetails: "Wedding dinner for 250 guests",
    guestCount: 250,
    createdAt: "2023-10-20T09:15:00",
    platformFee: "₹12,000",
  }
];

export default function BookingsPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isSignedIn) {
    return null
  }

  // Sort bookings: pending payment first, then confirmed, then others
  const sortedBookings = [...mockBookings].sort((a, b) => {
    if (a.paymentStatus === "Pending" && b.paymentStatus !== "Pending") return -1;
    if (a.paymentStatus !== "Pending" && b.paymentStatus === "Pending") return 1;
    if (a.status === "Confirmed" && b.status !== "Confirmed") return -1;
    if (a.status !== "Confirmed" && b.status === "Confirmed") return 1;
    return 0;
  });

  // Filter bookings based on search and status
  const filteredBookings = sortedBookings.filter((booking) => {
    const matchesSearch =
      booking.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vendorCategory.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500 mt-1">Manage all your vendor bookings in one place</p>
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
              <CardHeader>
                <CardTitle>{booking.vendorName}</CardTitle>
                <CardDescription>{booking.vendorCategory}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                  View Details
                </Button>
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

      {selectedBooking && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Complete information about your booking</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden">
                  <Image
                    src={selectedBooking.image || "/placeholder.svg"}
                    alt={selectedBooking.vendorName}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedBooking.vendorName}</h3>
                  <p className="text-gray-500">{selectedBooking.vendorCategory}</p>
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
              </div>

              <div className="border-t pt-4 mt-2">
                <h4 className="font-medium mb-2">Vendor Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Delhi NCR, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      contact@{selectedBooking.vendorName.toLowerCase().replace(/\s/g, "")}.in
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              {selectedBooking.paymentStatus === "Pending" && (
                <Button onClick={() => {/* handle payment logic here */}}>
                  Pay Now
                </Button>
              )}
              <Button>Download Invoice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
