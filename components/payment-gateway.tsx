import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { useAuth, useUser } from "@clerk/nextjs"

interface PaymentGatewayProps {
  amount: number
  bookingId: string
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentGateway({ amount, bookingId, onSuccess, onCancel }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const { updateBookingStatus } = useAuth()
  const router = useRouter()

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update booking status
      await updateBookingStatus(bookingId, "Confirmed")
      
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed.",
      })
      
      onSuccess()
      router.push("/dashboard/bookings")
    } catch (error) {
      console.error("Payment failed:", error)
      toast({
        title: "Payment Failed",
        description: "Please try again or choose a different payment method.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-600">Amount to Pay</div>
          <div className="text-2xl font-bold">₹{amount.toLocaleString()}</div>
        </div>
      </div>

      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 border p-4 rounded-lg">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex-1">Credit/Debit Card</Label>
        </div>
        <div className="flex items-center space-x-2 border p-4 rounded-lg">
          <RadioGroupItem value="upi" id="upi" />
          <Label htmlFor="upi" className="flex-1">UPI</Label>
        </div>
        <div className="flex items-center space-x-2 border p-4 rounded-lg">
          <RadioGroupItem value="netbanking" id="netbanking" />
          <Label htmlFor="netbanking" className="flex-1">Net Banking</Label>
        </div>
      </RadioGroup>

      {paymentMethod === "card" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="username@upi"
            />
          </div>
        </div>
      )}

      {paymentMethod === "netbanking" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="bank">Select Bank</Label>
            <select
              id="bank"
              className="w-full border rounded-md p-2"
            >
              <option value="">Select a bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ₹${amount.toLocaleString()}`
          )}
        </Button>
      </div>
    </div>
  )
} 