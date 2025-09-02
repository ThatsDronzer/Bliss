"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Download, CreditCard, IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function PaymentsPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [payments, setPayments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isSignedIn) {
    return null
  }

  // Calculate total amounts
  const totalPaid = payments.reduce((sum, payment) => 
    payment.status === "Paid" ? sum + parseFloat(payment.amount.replace(/[₹,]/g, "")) : sum, 0
  )
  const totalPending = payments.reduce((sum, payment) => 
    payment.status === "Pending" ? sum + parseFloat(payment.amount.replace(/[₹,]/g, "")) : sum, 0
  )

  // Filter payments based on search and status
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-500 mt-1">Track your payments and transactions</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Payment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Across all transactions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{totalPending.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Due within next 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹25,000</div>
            <div className="text-xs text-gray-500 mt-1">Due on July 15, 2024</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search payments..."
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-start gap-3 mb-3 md:mb-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.type === "debit"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {payment.type === "debit" ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{payment.vendorName}</h3>
                    <p className="text-sm text-gray-500">{payment.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          payment.status === "Paid"
                            ? "success"
                            : payment.status === "Failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {payment.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{payment.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{payment.amount}</div>
                  <div className="text-xs text-gray-500">{payment.paymentMethod}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
