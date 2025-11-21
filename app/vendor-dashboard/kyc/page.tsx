"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useEffect, useState } from "react"
import { CheckCircle2, Clock, XCircle, Loader2, Upload } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface KYCStatus {
  upiId?: string
  idProof?: {
    type: string
    documentNumber: string
    documentUrl: string
    verified: boolean
  }
  adminApproved: boolean
  canParticipateInBidding: boolean
  approvedAt?: string
}

export default function VendorKYCPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("vendor")
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [upiId, setUpiId] = useState("")
  const [idProofType, setIdProofType] = useState("")
  const [idProofNumber, setIdProofNumber] = useState("")
  const [idProofUrl, setIdProofUrl] = useState("")

  useEffect(() => {
    if (isAuthorized) {
      fetchKYCStatus()
    }
  }, [isAuthorized])

  const fetchKYCStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vendor/kyc")
      const data = await response.json()

      if (data.success) {
        setKycStatus(data.data)
        setUpiId(data.data.upiId || "")
        if (data.data.idProof) {
          setIdProofType(data.data.idProof.type)
          setIdProofNumber(data.data.idProof.documentNumber)
          setIdProofUrl(data.data.idProof.documentUrl)
        }
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!upiId || !idProofType || !idProofNumber || !idProofUrl) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/vendor/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upiId,
          idProofType,
          idProofNumber,
          idProofUrl,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("KYC details submitted successfully! Waiting for admin approval.")
        fetchKYCStatus()
      } else {
        toast.error(data.error || "Failed to submit KYC")
      }
    } catch (error) {
      console.error("Error submitting KYC:", error)
      toast.error("Failed to submit KYC")
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    )
  }

  if (!isAuthorized) return null

  const isKYCSubmitted = kycStatus?.upiId && kycStatus?.idProof
  const isApproved = kycStatus?.adminApproved

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">KYC Verification</h1>
        <p className="text-sm text-gray-600 mt-1">
          Complete KYC to participate in bidding platform
        </p>
      </div>

      {/* Status Alert */}
      {isKYCSubmitted && (
        <Alert className={isApproved ? "border-green-500" : ""}>
          {isApproved ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Clock className="h-4 w-4 text-yellow-500" />
          )}
          <AlertDescription>
            {isApproved ? (
              <div className="flex items-center gap-2">
                <span>Your KYC has been verified and approved! You can now participate in bidding.</span>
                <Badge className="bg-green-600">Approved</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Your KYC is submitted and pending admin verification.</span>
                <Badge variant="secondary">Pending Approval</Badge>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* KYC Form */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Information</CardTitle>
          <CardDescription>
            Provide your UPI details and ID proof for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID *</Label>
              <Input
                id="upiId"
                type="text"
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                disabled={isApproved}
              />
              <p className="text-xs text-gray-500">
                For receiving payments and prebooking amounts
              </p>
            </div>

            <div className="space-y-4">
              <Label>ID Proof Details *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idProofType">Document Type</Label>
                  <Select
                    value={idProofType}
                    onValueChange={setIdProofType}
                    disabled={isApproved}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhaar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="voter_id">Voter ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idProofNumber">Document Number</Label>
                  <Input
                    id="idProofNumber"
                    placeholder="Enter document number"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    required
                    disabled={isApproved}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idProofUrl">Document Upload URL</Label>
                <Input
                  id="idProofUrl"
                  type="url"
                  placeholder="https://cloudinary.com/your-document-url"
                  value={idProofUrl}
                  onChange={(e) => setIdProofUrl(e.target.value)}
                  required
                  disabled={isApproved}
                />
                <p className="text-xs text-gray-500">
                  Upload your document to Cloudinary or image hosting service and paste the URL here
                </p>
              </div>
            </div>

            {!isApproved && (
              <div className="flex gap-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : isKYCSubmitted ? (
                    "Update KYC Details"
                  ) : (
                    "Submit KYC for Verification"
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Current Status */}
      {isKYCSubmitted && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">UPI ID</p>
                <p className="font-medium">{kycStatus.upiId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID Proof</p>
                <p className="font-medium capitalize">
                  {kycStatus.idProof?.type.replace("_", " ")} - {kycStatus.idProof?.documentNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID Verification Status</p>
                {kycStatus.idProof?.verified ? (
                  <Badge className="bg-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Bidding Access</p>
                {kycStatus.canParticipateInBidding ? (
                  <Badge className="bg-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Disabled
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
