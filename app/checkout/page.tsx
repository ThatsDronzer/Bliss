"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { CoinRedemption } from "@/components/coin-redemption"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [bookingAmount, setBookingAmount] = useState(2000) // Example amount
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const handleCoinDiscount = (amount: number) => {
    setDiscountAmount(amount)
  }

  const finalAmount = bookingAmount - discountAmount

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Complete your booking payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="space-y-4">
                <h3 className="font-medium">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Total</span>
                    <span>₹{bookingAmount.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coin Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Amount</span>
                    <span>₹{finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Coin Redemption */}
              <CoinRedemption
                userId={user.id}
                bookingAmount={bookingAmount}
                onApplyCoins={handleCoinDiscount}
              />

              {/* Payment Button */}
              <Button className="w-full" size="lg">
                Pay ₹{finalAmount.toLocaleString()}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 