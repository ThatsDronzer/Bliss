"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useEffect, useState } from "react"
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  Filter,
  Eye,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Vendor {
  _id: string
  ownerName: string
  service_name: string
  ownerEmail: string
  owner_contactNo: string[]
  upiId?: string
  idProof?: {
    type: string
    documentNumber: string
    documentUrl: string
    verified: boolean
  }
  adminApproved: boolean
  canParticipateInBidding: boolean
}

export default function VendorApprovalsPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("admin")
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (isAuthorized) {
      fetchVendors()
    }
  }, [isAuthorized, filterStatus])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const url = new URL("/api/admin/vendor-approval", window.location.origin)
      url.searchParams.append("status", filterStatus)

      const response = await fetch(url.toString())
      const data = await response.json()

      if (data.success) {
        setVendors(data.data)
      } else {
        toast.error(data.error || "Failed to fetch vendors")
      }
    } catch (error) {
      console.error("Error fetching vendors:", error)
      toast.error("Failed to fetch vendors")
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (vendorId: string, approved: boolean) => {
    try {
      setProcessing(true)
      const response = await fetch("/api/admin/vendor-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId,
          approved,
          verifyIdProof: approved, // Auto-verify ID proof if approving
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          approved
            ? "Vendor approved for bidding!"
            : "Vendor rejected"
        )
        fetchVendors() // Refresh list
        setShowDetailsDialog(false)
      } else {
        toast.error(data.error || "Failed to update vendor status")
      }
    } catch (error) {
      console.error("Error updating vendor:", error)
      toast.error("Failed to update vendor status")
    } finally {
      setProcessing(false)
    }
  }

  const getIdProofLabel = (type: string) => {
    const labels: Record<string, string> = {
      aadhar: "Aadhaar Card",
      pan: "PAN Card",
      driving_license: "Driving License",
      passport: "Passport",
      voter_id: "Voter ID",
    }
    return labels[type] || type
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Vendor Approvals</h1>
        <p className="text-sm text-gray-600 mt-1">
          Review and approve vendors for bidding platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter vendors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="all">All Vendors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {vendors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No vendors found in this category</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <Card key={vendor._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {vendor.service_name || vendor.ownerName}
                      </h3>
                      {vendor.adminApproved ? (
                        <Badge className="bg-green-600">Approved</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Owner: {vendor.ownerName}</p>
                      <p>Email: {vendor.ownerEmail}</p>
                      <p>
                        Contact: {vendor.owner_contactNo?.[0] || "N/A"}
                      </p>
                      {vendor.upiId && <p>UPI ID: {vendor.upiId}</p>}
                      {vendor.idProof && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">
                            {getIdProofLabel(vendor.idProof.type)}
                          </Badge>
                          <span className="text-xs">
                            {vendor.idProof.documentNumber}
                          </span>
                          {vendor.idProof.verified && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVendor(vendor)
                        setShowDetailsDialog(true)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                    {!vendor.adminApproved && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproval(vendor._id, true)}
                          disabled={processing}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleApproval(vendor._id, false)}
                          disabled={processing}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vendor Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              Review vendor KYC information
            </DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service Name</p>
                  <p className="font-medium">{selectedVendor.service_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner Name</p>
                  <p className="font-medium">{selectedVendor.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedVendor.ownerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">
                    {selectedVendor.owner_contactNo?.[0] || "N/A"}
                  </p>
                </div>
              </div>

              {selectedVendor.upiId && (
                <div>
                  <p className="text-sm text-gray-500">UPI ID</p>
                  <p className="font-medium">{selectedVendor.upiId}</p>
                </div>
              )}

              {selectedVendor.idProof && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">ID Proof Type</p>
                    <p className="font-medium">
                      {getIdProofLabel(selectedVendor.idProof.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Document Number</p>
                    <p className="font-medium">{selectedVendor.idProof.documentNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Document</p>
                    <a
                      href={selectedVendor.idProof.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      View Document <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Approval Status:</p>
                  {selectedVendor.adminApproved ? (
                    <Badge className="bg-green-600">
                      Approved for Bidding
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending Approval</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>
            {selectedVendor && !selectedVendor.adminApproved && (
              <>
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleApproval(selectedVendor._id, false)
                  }
                  disabled={processing}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() =>
                    handleApproval(selectedVendor._id, true)
                  }
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve for Bidding
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
