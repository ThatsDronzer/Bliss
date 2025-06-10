"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/stripe-js/pure"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/cart/confirmation`,
      },
    })

    if (submitError) {
      setError(submitError.message ?? "An error occurred")
      setProcessing(false)
      toast({
        title: "Payment Failed",
        description: submitError.message,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <Label>Card Details</Label>
          <PaymentElement />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button type="submit" className="w-full" disabled={!stripe || processing}>
          {processing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("")

  // In a real app, you would fetch the client secret from your backend
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // amount in cents
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order before payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>₹1,800</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹11,800</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your payment information securely</CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                      },
                    }}
                  >
                    <CheckoutForm />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 