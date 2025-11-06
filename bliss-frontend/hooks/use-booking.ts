"use client"

import { useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { CoinService } from "@/lib/coin-service"
import { toast } from "@/components/ui/use-toast"

export function useBooking() {
  const { updateBookingStatus, addBooking } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBookingSubmission = async (bookingData: any) => {
    setIsProcessing(true)
    try {
      // Format the amount as a string with ₹ symbol if it's not already
      const formattedBookingData = {
        ...bookingData,
        amount: typeof bookingData.amount === 'number' 
          ? `₹${bookingData.amount.toLocaleString()}`
          : bookingData.amount
      }

      // Add the booking
      addBooking(formattedBookingData)

      // Update booking status to pending
      await updateBookingStatus(bookingData.id, "Pending")

      toast({
        title: "Booking Submitted",
        description: "Your booking has been submitted successfully. The vendor will confirm your booking soon.",
      })

      return true
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast({
        title: "Error",
        description: "Failed to submit the booking. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBookingCompletion = async (
    bookingId: string,
    userId: string,
    bookingAmount: number,
    newStatus: string
  ) => {
    setIsProcessing(true)
    try {
      // Update booking status
      await updateBookingStatus(bookingId, newStatus)

      // If booking is confirmed, award coins
      if (newStatus === "Confirmed") {
        // Award coins based on the numeric amount
        const transaction = await CoinService.awardCoinsForBooking(
          userId,
          bookingId,
          bookingAmount
        )

        toast({
          title: "Booking Confirmed",
          description: `Booking has been confirmed and ${transaction.amount} coins have been awarded to the user.`,
        })
      } else {
        toast({
          title: `Booking ${newStatus}`,
          description: `The booking has been ${newStatus.toLowerCase()}.`,
        })
      }

      return true
    } catch (error) {
      console.error("Error handling booking:", error)
      toast({
        title: "Error",
        description: "Failed to process the booking. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    handleBookingSubmission,
    handleBookingCompletion,
    isProcessing,
  }
} 