"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, CheckCircle, XCircle, Clock, AlertCircle, Building, User, FileText, CreditCard, PlusCircle } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function VendorVerificationPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationData, setVerificationData] = useState({
    // Business Information
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessPincode: "",
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
    businessDescription: "",
    establishedYear: "",
    gstNumber: "",
    panNumber: "",
    
    // Owner Information
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerCity: "",
    ownerState: "",
    ownerPincode: "",
    ownerAadhar: "",
    
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    
    // Documents
    businessLicense: null as File | null,
    gstCertificate: null as File | null,
    panCard: null as File | null,
    aadharCard: null as File | null,
    bankStatement: null as File | null,
    addressProof: null as File | null,
    
    // Additional Information
    serviceCategories: [] as string[],
    teamSize: "",
    annualRevenue: "",
    certifications: [] as string[],
    insuranceDetails: "",
    qualityStandards: [] as string[],
  })
  
  const [verificationStatus, setVerificationStatus] = useState({
    businessInfo: false,
    ownerInfo: false,
    bankDetails: false,
    documents: false,
    additionalInfo: false,
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [newCertification, setNewCertification] = useState("")
  const [newQualityStandard, setNewQualityStandard] = useState("")

  // Check verification status
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/vendor-verification?clerkId=${user.id}`)
          const data = await response.json()
          if (response.ok) {
            setIsVerified(data.isVerified)
          }
        } catch (error) {
          console.error('Error checking verification status:', error)
        }
      }
    }

    checkVerificationStatus()
  }, [user?.id])

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  if (!isLoaded || !isSignedIn || userRole !== "vendor" || !user) {
    return null
  }

  // Show verified status if vendor is already verified
  if (isVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Verification Complete!</CardTitle>
              <CardDescription>
                Your business has been successfully verified. You can now create listings and access all vendor features.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✓ Your account is verified and active
                </p>
                <p className="text-green-700 text-sm mt-1">
                  You can now create listings, receive bookings, and manage your business through the vendor dashboard.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/vendor-dashboard/listings/new")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Listing
                </Button>
                <Button variant="outline" onClick={() => router.push("/vendor-dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Private Limited Company",
    "Public Limited Company",
    "LLP (Limited Liability Partnership)",
    "Trust",
    "Society",
    "Other",
  ]

  const serviceCategories = [
    "Wedding Venue",
    "Photography & Videography",
    "Catering Services",
    "Decoration & Florist",
    "Music & Entertainment",
    "Transportation",
    "Beauty & Makeup",
    "Wedding Planning",
    "Jewelry & Accessories",
    "Attire & Fashion",
    "Other",
  ]

  const qualityStandards = [
    "ISO 9001",
    "ISO 14001",
    "FSSAI License",
    "Fire Safety Certificate",
    "Municipal License",
    "Professional Association Membership",
    "Other",
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setVerificationData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setVerificationData((prev) => ({ ...prev, [field]: file }))
  }

  const handleAddCertification = () => {
    if (newCertification.trim() && !verificationData.certifications.includes(newCertification.trim())) {
      handleInputChange("certifications", [...verificationData.certifications, newCertification.trim()])
      setNewCertification("")
    }
  }

  const handleRemoveCertification = (certification: string) => {
    handleInputChange(
      "certifications",
      verificationData.certifications.filter((c) => c !== certification)
    )
  }

  const handleAddQualityStandard = () => {
    if (newQualityStandard.trim() && !verificationData.qualityStandards.includes(newQualityStandard.trim())) {
      handleInputChange("qualityStandards", [...verificationData.qualityStandards, newQualityStandard.trim()])
      setNewQualityStandard("")
    }
  }

  const handleRemoveQualityStandard = (standard: string) => {
    handleInputChange(
      "qualityStandards",
      verificationData.qualityStandards.filter((s) => s !== standard)
    )
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Business Information
        return verificationData.businessName && verificationData.businessType && verificationData.businessAddress
      case 2: // Owner Information
        return verificationData.ownerName && verificationData.ownerEmail && verificationData.ownerPhone
      case 3: // Bank Details
        return verificationData.bankName && verificationData.accountNumber && verificationData.ifscCode
      case 4: // Review & Submit
        return true // Always allow submission on review step
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      setVerificationStatus(prev => ({ ...prev, [`step${currentStep}`]: true }))
    } else {
      toast.error("Please fill in all required fields before proceeding.")
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

const handleSubmitVerification = async () => {
  setIsLoading(true)

  try {
    // Include clerkId in the verification data
    const submissionData = {
      ...verificationData,
      clerkId: user?.id
    }

    const response = await fetch("/api/vendor-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(submissionData),
    })

    const result = await response.json()

    if (result.success) {
      toast.success("Your verification has been completed successfully. You can now create listings!")
      setIsVerified(true) // Update local state immediately
    } else {
      throw new Error(result.message || result.error)
    }
  } catch (err) {
    console.error("Verification submission error:", err)
    toast.error("An error occurred while submitting verification. Please try again.")
  } finally {
    setIsLoading(false)
  }
}


  const getStepStatus = (step: number) => {
    if (currentStep > step) return "completed"
    if (currentStep === step) return "current"
    return "pending"
  }

  const renderBusinessInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={verificationData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            placeholder="Enter your business name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type *</Label>
          <Select value={verificationData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstNumber">GST Number</Label>
          <Input
            id="gstNumber"
            value={verificationData.gstNumber}
            onChange={(e) => handleInputChange("gstNumber", e.target.value)}
            placeholder="Enter GST number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="panNumber">Business PAN Number</Label>
          <Input
            id="panNumber"
            value={verificationData.panNumber}
            onChange={(e) => handleInputChange("panNumber", e.target.value)}
            placeholder="Enter PAN number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="establishedYear">Year Established</Label>
          <Input
            id="establishedYear"
            value={verificationData.establishedYear}
            onChange={(e) => handleInputChange("establishedYear", e.target.value)}
            placeholder="e.g., 2020"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPhone">Business Phone *</Label>
          <Input
            id="businessPhone"
            value={verificationData.businessPhone}
            onChange={(e) => handleInputChange("businessPhone", e.target.value)}
            placeholder="+91 98765 43210"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress">Business Address *</Label>
        <Textarea
          id="businessAddress"
          value={verificationData.businessAddress}
          onChange={(e) => handleInputChange("businessAddress", e.target.value)}
          placeholder="Enter complete business address"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessCity">City</Label>
          <Input
            id="businessCity"
            value={verificationData.businessCity}
            onChange={(e) => handleInputChange("businessCity", e.target.value)}
            placeholder="Enter city"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessState">State</Label>
          <Input
            id="businessState"
            value={verificationData.businessState}
            onChange={(e) => handleInputChange("businessState", e.target.value)}
            placeholder="Enter state"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPincode">Pincode</Label>
          <Input
            id="businessPincode"
            value={verificationData.businessPincode}
            onChange={(e) => handleInputChange("businessPincode", e.target.value)}
            placeholder="Enter pincode"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessDescription">Business Description</Label>
        <Textarea
          id="businessDescription"
          value={verificationData.businessDescription}
          onChange={(e) => handleInputChange("businessDescription", e.target.value)}
          placeholder="Describe your business, services, and expertise..."
          rows={4}
        />
      </div>
    </div>
  )

  const renderOwnerInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input
            id="ownerName"
            value={verificationData.ownerName}
            onChange={(e) => handleInputChange("ownerName", e.target.value)}
            placeholder="Enter owner's full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerEmail">Owner Email *</Label>
          <Input
            id="ownerEmail"
            type="email"
            value={verificationData.ownerEmail}
            onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
            placeholder="owner@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerPhone">Owner Phone *</Label>
          <Input
            id="ownerPhone"
            value={verificationData.ownerPhone}
            onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerCity">City</Label>
          <Input
            id="ownerCity"
            value={verificationData.ownerCity}
            onChange={(e) => handleInputChange("ownerCity", e.target.value)}
            placeholder="Enter city"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerState">State</Label>
          <Input
            id="ownerState"
            value={verificationData.ownerState}
            onChange={(e) => handleInputChange("ownerState", e.target.value)}
            placeholder="Enter state"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerPincode">Pincode</Label>
          <Input
            id="ownerPincode"
            value={verificationData.ownerPincode}
            onChange={(e) => handleInputChange("ownerPincode", e.target.value)}
            placeholder="Enter pincode"
          />
        </div>
      </div>
    </div>
  )

  const renderBankDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name *</Label>
          <Input
            id="bankName"
            value={verificationData.bankName}
            onChange={(e) => handleInputChange("bankName", e.target.value)}
            placeholder="Enter bank name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number *</Label>
          <Input
            id="accountNumber"
            value={verificationData.accountNumber}
            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
            placeholder="Enter account number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ifscCode">IFSC Code *</Label>
          <Input
            id="ifscCode"
            value={verificationData.ifscCode}
            onChange={(e) => handleInputChange("ifscCode", e.target.value)}
            placeholder="Enter IFSC code"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountHolderName">Account Holder Name *</Label>
          <Input
            id="accountHolderName"
            value={verificationData.accountHolderName}
            onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
            placeholder="Enter account holder name"
            required
          />
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Bank details are required for payment processing. Your information is encrypted and secure.
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderReview = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please review all the information below before submitting your verification request.
        </AlertDescription>
      </Alert>

      {/* Business Information Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-600">Business Name</p>
            <p className="text-sm">{verificationData.businessName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Business Type</p>
            <p className="text-sm">{verificationData.businessType || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Business Phone</p>
            <p className="text-sm">{verificationData.businessPhone || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Business Email</p>
            <p className="text-sm">{verificationData.businessEmail || "Not provided"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Business Address</p>
            <p className="text-sm">{verificationData.businessAddress || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Owner Information Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Owner Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-600">Owner Name</p>
            <p className="text-sm">{verificationData.ownerName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Owner Email</p>
            <p className="text-sm">{verificationData.ownerEmail || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Owner Phone</p>
            <p className="text-sm">{verificationData.ownerPhone || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Owner Aadhar</p>
            <p className="text-sm">{verificationData.ownerAadhar || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Bank Details Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Bank Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-600">Bank Name</p>
            <p className="text-sm">{verificationData.bankName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Account Holder Name</p>
            <p className="text-sm">{verificationData.accountHolderName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Account Number</p>
            <p className="text-sm">{verificationData.accountNumber ? "••••••••" + verificationData.accountNumber.slice(-4) : "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">IFSC Code</p>
            <p className="text-sm">{verificationData.ifscCode || "Not provided"}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const steps = [
    { title: "Business Information", icon: <Building className="h-4 w-4" /> },
    { title: "Owner Information", icon: <User className="h-4 w-4" /> },
    { title: "Bank Details", icon: <CreditCard className="h-4 w-4" /> },
    { title: "Review & Submit", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Business Verification</h1>
        <p className="text-gray-500 mt-1">Complete your business verification to unlock all features</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                getStepStatus(index + 1) === "completed" 
                  ? "bg-green-500 border-green-500 text-white" 
                  : getStepStatus(index + 1) === "current"
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}>
                {getStepStatus(index + 1) === "completed" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  getStepStatus(index + 1) === "current" ? "text-blue-600" : "text-gray-500"
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  getStepStatus(index + 1) === "completed" ? "bg-green-500" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="w-full" />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep - 1].icon}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && renderBusinessInfo()}
          {currentStep === 2 && renderOwnerInfo()}
          {currentStep === 3 && renderBankDetails()}
          {currentStep === 4 && renderReview()}
        </CardContent>
        <CardContent className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmitVerification} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Verification"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Verification Status Alert */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Verification Process:</strong> Once you submit your verification, your account will be immediately verified and you'll be able to create listings and access all vendor features.
        </AlertDescription>
      </Alert>
    </div>
  )
} 