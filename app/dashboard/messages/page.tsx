"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, IndianRupee, ArrowLeft } from "lucide-react"

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
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null)
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
        const data = await bookingApi.getUserBookingRequests({
          page: currentPage,
          limit: 9,
        })
        
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
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">My Bookings </h1>
            <p className="text-gray-500 mt-1">Track your service bookings and requests</p>
          </div>
          <div className="w-full md:w-72 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Two Panel Layout with Pink Border */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-lg border-2 border-pink-200 shadow-lg overflow-hidden" style={{ height: '70vh' }}>
          <div className="h-full flex">
            {/* Left Panel - Vendor List */}
            <div className={`w-full md:w-1/3 border-r-2 border-pink-100 bg-gray-50 flex flex-col ${selectedRequest ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b bg-white">
                <h2 className="font-semibold text-lg">Your Bookings</h2>
              </div>
              
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="p-4 text-center">
                    <p>Loading bookings...</p>
                  </div>
                ) : filteredRequests.length > 0 ? (
                  <div className="divide-y">
                    {filteredRequests.map((request) => (
                      <div
                        key={request.id}
                        onClick={() => setSelectedRequest(request)}
                        className={`p-4 cursor-pointer hover:bg-white transition-colors ${
                          selectedRequest?.id === request.id ? 'bg-white border-r-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{request.vendor.name}</h3>
                          <div className="flex items-center text-sm">
                            <IndianRupee className="h-3 w-3" />
                            <span className="font-medium">{request.bookingDetails.totalPrice}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{request.listing.title}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(request.bookingDetails.bookingDate).toLocaleDateString()}
                          </span>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            request.bookingDetails.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : request.bookingDetails.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : request.bookingDetails.status === 'not-accepted'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {request.bookingDetails.status === 'accepted' ? 'Accepted' :
                             request.bookingDetails.status === 'not-accepted' ? 'Declined' :
                             request.bookingDetails.status.charAt(0).toUpperCase() + request.bookingDetails.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p>No bookings found</p>
                  </div>
                )}
              </ScrollArea>

              {/* Pagination for left panel */}
              {totalPages > 1 && (
                <div className="p-4 border-t bg-white">
                  <div className="flex justify-between items-center text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Booking Request Details */}
            <div className={`flex-1 bg-white flex flex-col ${selectedRequest ? 'flex' : 'hidden md:flex'}`}>
              {selectedRequest ? (
                <>
                  <div className="p-6 border-b">
                    {/* Mobile Back Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden mb-4"
                      onClick={() => setSelectedRequest(null)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Bookings
                    </Button>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedRequest.vendor.name}</h2>
                        <p className="text-gray-500">{selectedRequest.vendor.email}</p>
                        {selectedRequest.vendor.phone && (
                          <p className="text-gray-500">{selectedRequest.vendor.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-xl font-bold">
                          <IndianRupee className="h-5 w-5" />
                          <span>{selectedRequest.bookingDetails.totalPrice}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(selectedRequest.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {/* Service Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Service Details</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium">{selectedRequest.listing.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedRequest.listing.description}</p>
                        </div>
                      </div>

                      {/* Booking Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Date:</span>
                            <p className="font-medium">{new Date(selectedRequest.bookingDetails.bookingDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Time:</span>
                            <p className="font-medium">{selectedRequest.bookingDetails.bookingTime}</p>
                          </div>
                        </div>
                      </div>

                      {/* Selected Services */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Selected Services</h3>
                        <div className="space-y-2">
                          {selectedRequest.bookingDetails.selectedItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                              </div>
                              <div className="flex items-center">
                                <IndianRupee className="h-4 w-4" />
                                <span className="font-medium">{item.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Vendor Contact Information - Only shown if request is accepted */}
                      {selectedRequest.bookingDetails.status === 'accepted' && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Vendor Contact Details</h3>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                              <p><strong>Phone:</strong> {selectedRequest.vendor.phone}</p>
                              <p><strong>Email:</strong> {selectedRequest.vendor.email}</p>
                              {selectedRequest.vendor.service_address && (
                                <div className="mt-3">
                                  <p><strong>Service Location:</strong></p>
                                  <div className="ml-2 text-sm">
                                    {selectedRequest.vendor.service_address.location && <p>{selectedRequest.vendor.service_address.location}</p>}
                                    {selectedRequest.vendor.service_address.City && selectedRequest.vendor.service_address.State && (
                                      <p>{selectedRequest.vendor.service_address.City}, {selectedRequest.vendor.service_address.State}</p>
                                    )}
                                    {selectedRequest.vendor.service_address.pinCode && <p>PIN: {selectedRequest.vendor.service_address.pinCode}</p>}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Booking Status</h3>
                        <div className={`p-4 rounded-lg text-center ${
                          selectedRequest.bookingDetails.status === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : selectedRequest.bookingDetails.status === 'not-accepted'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <p className="font-medium">
                            {selectedRequest.bookingDetails.status === 'accepted' ? 'Booking Accepted' :
                             selectedRequest.bookingDetails.status === 'not-accepted' ? 'Booking Declined' :
                             'Booking Pending'}
                          </p>
                          {selectedRequest.bookingDetails.status === 'pending' && (
                            <p className="text-sm mt-1">Waiting for vendor response</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Action Buttons - Fixed at bottom */}
                  <div className="p-6 border-t bg-gray-50">
                    {selectedRequest.bookingDetails.status === 'accepted' ? (
                      <div className="flex gap-4">
                        <Button
                          onClick={() => handlePayment(selectedRequest.id)}
                          variant="outline"
                          className="flex-1"
                          size="lg"
                        >
                          Message Vendor
                        </Button>
                        <Button
                          onClick={() => handlePayment(selectedRequest.id)}
                          variant="default"
                          className="flex-1"
                          size="lg"
                        >
                          Pay Now
                        </Button>
                      </div>
                    ) : selectedRequest.bookingDetails.status === 'not-accepted' ? (
                      <div className="text-center">
                        <p className="text-gray-500">This booking request was declined by the vendor.</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-500">Waiting for vendor to accept your booking request.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">Select a booking</p>
                    <p className="text-sm">Choose a booking from the left panel to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}