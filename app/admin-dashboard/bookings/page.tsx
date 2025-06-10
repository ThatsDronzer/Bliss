"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Download, CheckCircle, XCircle } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { useBooking } from "@/hooks/use-booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

export default function AdminBookingsPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, bookings } = useAuth()
  const { handleBookingCompletion, isProcessing } = useBooking()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vendorName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleExportBookings = () => {
    toast({
      title: "Export Started",
      description: "Bookings data export has been initiated. You'll receive a download link shortly.",
    })
  }

  const handleStatusChange = async (booking: any, newStatus: string) => {
    // Extract numeric amount from string (e.g., "₹2,50,000" -> 250000)
    const numericAmount = parseInt(booking.amount.replace(/[^0-9]/g, ""))
    
    await handleBookingCompletion(
      booking.id,
      booking.clientId, // You'll need to add this to your booking data
      numericAmount,
      newStatus
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage all bookings on the platform</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleExportBookings}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.clientName}</TableCell>
                  <TableCell>{booking.vendorName}</TableCell>
                  <TableCell>{booking.vendorCategory}</TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/admin-dashboard/bookings/${booking.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        {booking.status === "Pending" && (
                          <>
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => handleStatusChange(booking, "Confirmed")}
                              disabled={isProcessing}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleStatusChange(booking, "Cancelled")}
                              disabled={isProcessing}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Booking
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 