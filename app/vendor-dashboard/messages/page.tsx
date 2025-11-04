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
import { bookingApi, notificationApi } from "@/lib/api/services"

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
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null)
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
        const data = await bookingApi.getVendorBookingRequests({
          page: currentPage,
          limit: 9,
        })
        
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
      const updatedRequest = await bookingApi.updateVendorBookingRequestStatus(requestId, status)
        
        // If backend returns updated data, use it; otherwise refetch all data
        if (updatedRequest.data) {
          setBookingRequests(prevRequests =>
            prevRequests.map(request =>
              request.id === requestId ? updatedRequest.data : request
            )
          )
          // Update selected request
          if (selectedRequest?.id === requestId) {
            setSelectedRequest(updatedRequest.data)
          }
        } else {
          // Refetch all data to get the latest information including address
          const refetchData = await bookingApi.getVendorBookingRequests({
            page: currentPage,
            limit: 9,
          })
          
          const updatedRequests = Array.isArray(refetchData.messages) ? refetchData.messages : []
          setBookingRequests(updatedRequests)
          
          // Update selected request from refetched data
          if (selectedRequest?.id === requestId) {
            const updatedSelected = updatedRequests.find((req: BookingRequest) => req.id === requestId)
            if (updatedSelected) {
              setSelectedRequest(updatedSelected)
            }
          }
        }
        
        // Send notification to customer
        try {
          await notificationApi.notifyCustomer({
            requestId,
            customerPhone: selectedRequest?.user.phone || '',
            vendorName: user?.fullName || 'Vendor',
            status: status === 'accepted' ? 'accepted' : 'rejected',
            customerName: selectedRequest?.user.name || '',
          })
        } catch (notifError) {
          console.error('Failed to send notification:', notifError)
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
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
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
      </div>

      {/* Main Content - Centered Two Panel Layout with Pink Border */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-lg border-2 border-pink-200 shadow-lg overflow-hidden" style={{ height: '70vh' }}>
          <div className="h-full flex">
            {/* Left Panel - Customer List */}
            <div className={`w-full md:w-1/3 border-r-2 border-pink-100 bg-gray-50 flex flex-col ${selectedRequest ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b bg-white">
            <h2 className="font-semibold text-lg">Customer Requests</h2>
          </div>
          
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-4 text-center">
                <p>Loading requests...</p>
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
                      <h3 className="font-medium text-sm">{request.user.name}</h3>
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
                        {request.bookingDetails.status === 'not-accepted' ? 'Denied' : 
                         request.bookingDetails.status.charAt(0).toUpperCase() + request.bookingDetails.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No booking requests found</p>
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

            {/* Right Panel - Message Request Details */}
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
                  Back to Requests
                </Button>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRequest.user.name}</h2>
                    <p className="text-gray-500">{selectedRequest.user.email}</p>
                    {selectedRequest.user.phone && (
                      <p className="text-gray-500">{selectedRequest.user.phone}</p>
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

                  {/* Address - Only shown if request is accepted and address exists */}
                  {selectedRequest.bookingDetails.status === 'accepted' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        {selectedRequest.bookingDetails.address && (
                          selectedRequest.bookingDetails.address.houseNo || 
                          selectedRequest.bookingDetails.address.areaName || 
                          selectedRequest.bookingDetails.address.landmark || 
                          selectedRequest.bookingDetails.address.state ||
                          selectedRequest.bookingDetails.address.pin
                        ) ? (
                          <div className="space-y-1">
                            {selectedRequest.bookingDetails.address.houseNo && <p><strong>House No:</strong> {selectedRequest.bookingDetails.address.houseNo}</p>}
                            {selectedRequest.bookingDetails.address.areaName && <p><strong>Area:</strong> {selectedRequest.bookingDetails.address.areaName}</p>}
                            {selectedRequest.bookingDetails.address.landmark && <p><strong>Landmark:</strong> {selectedRequest.bookingDetails.address.landmark}</p>}
                            {selectedRequest.bookingDetails.address.state && (
                              <p>
                                <strong>State:</strong> {selectedRequest.bookingDetails.address.state}
                                {selectedRequest.bookingDetails.address.pin && ` - ${selectedRequest.bookingDetails.address.pin}`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Address information will be available once the customer provides it.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Action Buttons - Fixed at bottom */}
              <div className="p-6 border-t bg-gray-50">
                {selectedRequest.bookingDetails.status === 'pending' ? (
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'not-accepted')}
                      variant="destructive"
                      className="flex-1"
                      size="lg"
                    >
                      Deny Request
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'accepted')}
                      variant="default"
                      className="flex-1"
                      size="lg"
                    >
                      Accept Request
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    {getStatusBadge(selectedRequest.bookingDetails.status)}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">Select a customer request</p>
                <p className="text-sm">Choose a request from the left panel to view details</p>
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