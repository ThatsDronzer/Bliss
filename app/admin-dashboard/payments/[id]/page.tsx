"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, CreditCard, Calculator, User, Store, Calendar, DollarSign } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function PaymentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isAdmin } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  // Demo payment data - in real app, fetch by ID
  const payment = {
    id: params.id,
    bookingId: "BK001",
    clientName: "Priya Sharma",
    clientEmail: "priya.sharma@email.com",
    clientPhone: "+91 98765 43210",
    vendorName: "Royal Palace",
    vendorEmail: "royal.palace@email.com",
    vendorPhone: "+91 98765 43211",
    vendorBankDetails: {
      accountNumber: "1234567890",
      ifscCode: "SBIN0001234",
      accountHolder: "Royal Palace Events"
    },
    amount: "₹45,000",
    platformFee: "₹4,500", // 10% platform fee
    vendorAmount: "₹40,500", // Amount after platform fee deduction
    status: "Completed",
    date: "2024-03-15",
    paymentMethod: "Credit Card",
    service: "Wedding Reception",
    bookingDate: "2024-06-20"
  }

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const handlePayToVendor = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Payment Successful",
        description: `₹${payment.vendorAmount} has been transferred to ${payment.vendorName}`,
      })
      
      // In real app, update payment status and send notification
      router.push("/admin-dashboard/payments")
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing the payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Payment Details</h1>
          <p className="text-gray-500 mt-1">Payment ID: {payment.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Booking ID</p>
                  <p className="text-lg">{payment.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-lg">{payment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Date</p>
                  <p className="text-lg">{new Date(payment.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                    {payment.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Payment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">{payment.amount}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee (10%)</span>
                  <span className="text-red-600">-{payment.platformFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Amount to Vendor</span>
                  <span className="text-green-600">{payment.vendorAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Vendor Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Account Holder</p>
                <p className="text-lg">{payment.vendorBankDetails.accountHolder}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Number</p>
                <p className="text-lg font-mono">{payment.vendorBankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                <p className="text-lg font-mono">{payment.vendorBankDetails.ifscCode}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handlePayToVendor}
                disabled={isProcessing || payment.status !== "Completed"}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Pay to Vendor"}
              </Button>
              <Button variant="outline" className="w-full">
                Generate Invoice
              </Button>
              <Button variant="outline" className="w-full">
                Download Receipt
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg">{payment.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg">{payment.clientEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-lg">{payment.clientPhone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg">{payment.vendorName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg">{payment.vendorEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-lg">{payment.vendorPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="text-lg">{payment.service}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Booking Date</p>
                <p className="text-lg">{new Date(payment.bookingDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 