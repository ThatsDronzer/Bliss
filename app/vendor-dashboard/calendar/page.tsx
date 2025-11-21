"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"

export default function VendorCalendarPage() {
  const router = useRouter()
  const { isAuthenticated, isVendor, bookings } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      router.push("/")
    }
  }, [isAuthenticated, isVendor, router])

  if (!isAuthenticated || !isVendor) {
    return null
  }

  // Filter bookings for the selected date
  const filteredBookings = bookings.filter((booking) => {
    // Only show bookings for this vendor (venue-example for demo)
    if (booking.vendorId !== "venue-example") return false

    const bookingDate = new Date(booking.bookingDate)

    if (view === "day") {
      return (
        selectedDate &&
        bookingDate.getDate() === selectedDate.getDate() &&
        bookingDate.getMonth() === selectedDate.getMonth() &&
        bookingDate.getFullYear() === selectedDate.getFullYear()
      )
    } else if (view === "week") {
      // Get start and end of week for selected date
      const startOfWeek = new Date(selectedDate || new Date())
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(endOfWeek.getDate() + 6)

      return bookingDate >= startOfWeek && bookingDate <= endOfWeek
    } else {
      // Month view - show all bookings in the current month
      return (
        selectedDate &&
        bookingDate.getMonth() === selectedDate.getMonth() &&
        bookingDate.getFullYear() === selectedDate.getFullYear()
      )
    }
  })

  // Get dates with bookings for the calendar
  const datesWithBookings = bookings
    .filter((booking) => booking.vendorId === "venue-example")
    .map((booking) => new Date(booking.bookingDate))

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
    setSelectedDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    setSelectedDate(newDate)
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-gray-500 mt-1">Manage your bookings and availability</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select value={view} onValueChange={(value) => setView(value as "month" | "week" | "day")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: datesWithBookings,
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "rgba(210, 56, 108, 0.1)",
                  fontWeight: "bold",
                  borderRadius: "0",
                },
              }}
            />
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/10 rounded-sm"></div>
                <span className="text-sm">Dates with bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {view === "day"
                ? selectedDate?.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : view === "week"
                  ? "Week View"
                  : selectedDate?.toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </CardTitle>
            <CardDescription>
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                      {new Date(booking.bookingDate).getDate()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{booking.clientName}</h4>
                      <p className="text-sm text-gray-500">{booking.eventDetails}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-xs text-gray-500">{booking.guestCount} guests</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{booking.amount}</div>
                      <div
                        className={`text-xs ${booking.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {booking.paymentStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-lg font-medium">No bookings found</p>
                <p className="text-gray-500">There are no bookings for the selected date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
