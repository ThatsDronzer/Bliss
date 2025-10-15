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

interface BookingRequest {
  id: string
  user: {
    name: string
    email: string
    phone?: string
  }
  listing: {
    title: string
    description: string
    basePrice: number
  }
  bookingDetails: {
    selectedItems: Array<{
      name: string
      price: number
      description: string
    }>
    totalPrice: number
    bookingDate: Date
    bookingTime: string
    address?: {
      houseNo?: string
      areaName?: string
      landmark?: string
      state?: string
      pin?: string
    } | null
    status: 'accepted' | 'not-accepted' | 'pending' | 'cancelled'
  }
  createdAt: Date
}

export default function VendorMessagesPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [searchQuery, setSearchQuery] = useState("")
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await fetch(`/api/vendor/booking-requests?page=${currentPage}&limit=9`)
        const data = await response.json()
        
        setBookingRequests(Array.isArray(data.messages) ? data.messages : [])
        setTotalPages(data.pagination?.pages || 1)
      } catch (error) {
        console.error('Error fetching booking requests:', error)
        setBookingRequests([])
      } finally {
        setLoading(false)
      }
    }

    if (isSignedIn && userRole === "vendor") {
      fetchBookingRequests()
    }
  }, [isSignedIn, userRole, currentPage])

  const handleStatusUpdate = async (requestId: string, status: 'accepted' | 'not-accepted') => {
    try {
      const response = await fetch(`/api/vendor/booking-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setBookingRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId
              ? { ...request, bookingDetails: { ...request.bookingDetails, status } }
              : request
          )
        )
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null
  }

  const filteredRequests = bookingRequests.filter(request =>
    request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      accepted: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
      'not-accepted': { color: 'bg-red-100 text-red-800', text: 'Denied' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <div className={`mt-4 text-center py-2 rounded-lg ${config.color}`}>
        {config.text}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Booking Requests</h1>
          <p className="text-gray-500 mt-1">Manage your service booking requests</p>
        </div>
        <div className="w-full md:w-72 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading booking requests...</p>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{request.user.name}</h3>
                    <p className="text-sm text-gray-500">{request.listing.title}</p>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    <span className="font-semibold">{request.bookingDetails.totalPrice}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span>{new Date(request.bookingDetails.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time:</span>
                    <span>{request.bookingDetails.bookingTime}</span>
                  </div>
                  
                  {/* Selected Items */}
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

                  {/* Address - Only shown if request is accepted and address exists */}
                  {request.bookingDetails.status === 'accepted' && request.bookingDetails.address && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Delivery Address:</h4>
                      <div className="text-sm space-y-1">
                        {request.bookingDetails.address.houseNo && <p>{request.bookingDetails.address.houseNo},</p>}
                        {request.bookingDetails.address.areaName && <p>{request.bookingDetails.address.areaName},</p>}
                        {request.bookingDetails.address.landmark && <p>{request.bookingDetails.address.landmark},</p>}
                        {request.bookingDetails.address.state && (
                          <p>
                            {request.bookingDetails.address.state}
                            {request.bookingDetails.address.pin && ` - ${request.bookingDetails.address.pin}`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons - Only shown for pending requests */}
                  {request.bookingDetails.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'not-accepted')}
                        variant="destructive"
                        className="flex-1"
                      >
                        Deny
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'accepted')}
                        variant="default"
                        className="flex-1"
                      >
                        Accept
                      </Button>
                    </div>
                  )}

                  {/* Status Badge */}
                  {request.bookingDetails.status !== 'pending' && getStatusBadge(request.bookingDetails.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No booking requests found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}