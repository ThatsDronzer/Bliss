"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, IndianRupee } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "./components/badge"

interface BookingRequest {
  id: string
  vendor: {
    id: string
    name: string
    email: string
    phone: string
    service: string
    service_address?: {
      State?: string
      City?: string
      location?: string
      pinCode?: string
    }
  }
  listing: {
    id: string
    title: string
    description: string
    basePrice: number
    location: string
  }
  bookingDetails: {
    selectedItems: Array<{
      name: string
      price: number
      description: string
    }>
    totalPrice: number
    bookingDate: string
    bookingTime: string
    address?: {
      houseNo?: string
      areaName?: string
      landmark?: string
      state?: string
      pin?: string
    } | null
    status: 'accepted' | 'not-accepted' | 'pending'
    specialInstructions?: string
  }
  createdAt: string
}

export default function CustomerMessagesPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [searchQuery, setSearchQuery] = useState("")
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Redirect if not authenticated or not a user
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=user")
    } else if (isLoaded && isSignedIn && userRole !== "user") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  // Fetch booking requests
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await fetch(`/api/user/booking-requests?page=${currentPage}&limit=9`)
        const data = await response.json()
        
        // Ensure we always set an array, even if empty
        setBookingRequests(Array.isArray(data.messages) ? data.messages : [])
        setTotalPages(data.pagination?.pages || 1)
      } catch (error) {
        console.error('Error fetching booking requests:', error)
        setBookingRequests([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    if (isSignedIn && userRole === "user") {
      fetchBookingRequests()
    }
  }, [isSignedIn, userRole, currentPage])

  // Filter requests based on search query
  const filteredRequests = bookingRequests.filter(request =>
    request.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePayment = async (requestId: string) => {
    // TODO: Implement payment logic
    console.log('Processing payment for request:', requestId)
  }

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Bookings</h1>
          <div className="w-72">
            <Input
              type="search"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No booking requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="space-y-4">
                  {/* Header with Vendor Name and Price */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{request.vendor.name}</h3>
                      <p className="text-sm text-gray-500">{request.listing.title}</p>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-semibold">{request.bookingDetails.totalPrice}</span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date:</span>
                      <span>{new Date(request.bookingDetails.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time:</span>
                      <span>{request.bookingDetails.bookingTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <Badge 
                        variant={
                          request.bookingDetails.status === 'accepted' ? 'success' :
                          request.bookingDetails.status === 'not-accepted' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {request.bookingDetails.status === 'accepted' ? 'Accepted' :
                         request.bookingDetails.status === 'not-accepted' ? 'Declined' :
                         'Pending'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Selected Services */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Selected Services:</h4>
                    <ul className="text-sm space-y-1">
                      {request.bookingDetails.selectedItems.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>₹{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Show vendor contact details and Message button only if request is accepted */}
                  {request.bookingDetails.status === 'accepted' && (
                    <>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Contact Details:</h4>
                        <div className="text-sm space-y-1">
                          <p>Phone: {request.vendor.phone}</p>
                          <p>Email: {request.vendor.email}</p>
                          {request.vendor.service_address && (
                            <>
                              <p>{request.vendor.service_address.location}</p>
                              <p>{request.vendor.service_address.City}, {request.vendor.service_address.State}</p>
                              <p>PIN: {request.vendor.service_address.pinCode}</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={() => handlePayment(request.id)}
                        >
                          Message Vendor
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handlePayment(request.id)}
                        >
                          Pay Now
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}