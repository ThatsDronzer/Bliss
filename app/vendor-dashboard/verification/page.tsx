"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, CheckCircle, XCircle, Clock, AlertCircle, Building, User, FileText, CreditCard } from "lucide-react"

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
import { toast } from "@/components/ui/use-toast"

export default function VendorVerificationPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [isLoading, setIsLoading] = useState(false)
  const [verificationData, setVerificationData] = useState({
    // Owner Information (matches schema)
    ownerName: "",
    owner_contactNo: [] as string[],
    ownerEmail: "",
    ownerImage: "",
    owner_address: {
      State: "",
      City: "",
      location: "",
      pinCode: ""
    },
    ownerAadhar: "",
    
    // Business Information (matches schema)
    service_name: "",
    service_email: "",
    service_phone: "",
    service_address: {
      State: "",
      City: "",
      location: "",
      pinCode: ""
    },
    service_description: "",
    establishedYear: "",
    service_type: "",
    gstNumber: "",
    panNumber: "",
    
    // Bank Details (matches schema)
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    
    // UI helpers for contact numbers
    tempContactNumber: "",
  })
  
  const [verificationStatus, setVerificationStatus] = useState({
    businessInfo: false,
    ownerInfo: false,
    bankDetails: false,
    documents: false,
    additionalInfo: false,
  })
  
  const [currentStep, setCurrentStep] = useState(1)

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

  const serviceTypes = [
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

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setVerificationData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }))
    } else {
      setVerificationData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleAddContactNumber = () => {
    if (verificationData.tempContactNumber.trim() && 
        !verificationData.owner_contactNo.includes(verificationData.tempContactNumber.trim())) {
      setVerificationData(prev => ({
        ...prev,
        owner_contactNo: [...prev.owner_contactNo, prev.tempContactNumber.trim()],
        tempContactNumber: ""
      }))
    }
  }

  const handleRemoveContactNumber = (contact: string) => {
    setVerificationData(prev => ({
      ...prev,
      owner_contactNo: prev.owner_contactNo.filter(c => c !== contact)
    }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Business Information
        return verificationData.service_name && 
               verificationData.service_type && 
               verificationData.service_address.location
      case 2: // Owner Information
        return verificationData.ownerName && 
               verificationData.ownerEmail && 
               verificationData.owner_contactNo.length > 0
      case 3: // Bank Details
        return verificationData.bankName && 
               verificationData.accountNumber && 
               verificationData.ifscCode &&
               verificationData.accountHolderName
      case 4: // Review & Submit
        return true
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      setVerificationStatus(prev => ({ ...prev, [`step${currentStep}`]: true }))
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmitVerification = async () => {
    setIsLoading(true)

    try {
      // Prepare data to match schema structure
      const submitData = {
        clerkId: user.id,
        ownerName: verificationData.ownerName,
        owner_contactNo: verificationData.owner_contactNo,
        ownerEmail: verificationData.ownerEmail,
        ownerImage: verificationData.ownerImage || "https://www.emamiltd.in/wp-content/themes/emami/images/Fair-and-Handsome02-mob-new.jpg",
        owner_address: verificationData.owner_address,
        ownerAadhar: verificationData.ownerAadhar,
        service_name: verificationData.service_name,
        service_email: verificationData.service_email,
        service_phone: verificationData.service_phone,
        service_address: verificationData.service_address,
        service_description: verificationData.service_description,
        establishedYear: verificationData.establishedYear,
        service_type: verificationData.service_type,
        gstNumber: verificationData.gstNumber,
        panNumber: verificationData.panNumber,
        bankName: verificationData.bankName,
        accountNumber: verificationData.accountNumber,
        ifscCode: verificationData.ifscCode,
        accountHolderName: verificationData.accountHolderName,
      }

      const response = await fetch("/api/vendor-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Verification Submitted",
          description: "Your verification documents have been submitted successfully. We'll review them within 3-5 business days.",
        })
        router.push("/vendor-dashboard")
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (err) {
      console.error("Verification submission error:", err)
      toast({
        title: "Error",
        description: "An error occurred while submitting verification. Please try again.",
        variant: "destructive"
      })
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
          <Label htmlFor="service_name">Business/Service Name *</Label>
          <Input
            id="service_name"
            value={verificationData.service_name}
            onChange={(e) => handleInputChange("service_name", e.target.value)}
            placeholder="Enter your business/service name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_type">Service Type *</Label>
          <Select value={verificationData.service_type} onValueChange={(value) => handleInputChange("service_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
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
          <Label htmlFor="service_phone">Business Phone</Label>
          <Input
            id="service_phone"
            value={verificationData.service_phone}
            onChange={(e) => handleInputChange("service_phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_email">Business Email</Label>
        <Input
          id="service_email"
          type="email"
          value={verificationData.service_email}
          onChange={(e) => handleInputChange("service_email", e.target.value)}
          placeholder="business@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_address_location">Business Address *</Label>
        <Textarea
          id="service_address_location"
          value={verificationData.service_address.location}
          onChange={(e) => handleInputChange("service_address.location", e.target.value)}
          placeholder="Enter complete business address"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="service_address_City">City</Label>
          <Input
            id="service_address_City"
            value={verificationData.service_address.City}
            onChange={(e) => handleInputChange("service_address.City", e.target.value)}
            placeholder="Enter city"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_address_State">State</Label>
          <Input
            id="service_address_State"
            value={verificationData.service_address.State}
            onChange={(e) => handleInputChange("service_address.State", e.target.value)}
            placeholder="Enter state"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_address_pinCode">Pincode</Label>
          <Input
            id="service_address_pinCode"
            value={verificationData.service_address.pinCode}
            onChange={(e) => handleInputChange("service_address.pinCode", e.target.value)}
            placeholder="Enter pincode"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_description">Business Description</Label>
        <Textarea
          id="service_description"
          value={verificationData.service_description}
          onChange={(e) => handleInputChange("service_description", e.target.value)}
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
          <Label htmlFor="ownerAadhar">Aadhar Number</Label>
          <Input
            id="ownerAadhar"
            value={verificationData.ownerAadhar}
            onChange={(e) => handleInputChange("ownerAadhar", e.target.value)}
            placeholder="Enter Aadhar number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerImage">Profile Image URL</Label>
          <Input
            id="ownerImage"
            value={verificationData.ownerImage}
            onChange={(e) => handleInputChange("ownerImage", e.target.value)}
            placeholder="Enter profile image URL"
          />
        </div>
      </div>

      {/* Contact Numbers Section */}
      <div className="space-y-4">
        <Label>Contact Numbers *</Label>
        <div className="flex gap-2">
          <Input
            value={verificationData.tempContactNumber}
            onChange={(e) => handleInputChange("tempContactNumber", e.target.value)}
            placeholder="+91 98765 43210"
          />
          <Button type="button" onClick={handleAddContactNumber}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {verificationData.owner_contactNo.map((contact, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {contact}
              <XCircle 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveContactNumber(contact)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Owner Address */}
      <div className="space-y-4">
        <Label>Owner Address</Label>
        <Textarea
          value={verificationData.owner_address.location}
          onChange={(e) => handleInputChange("owner_address.location", e.target.value)}
          placeholder="Enter complete address"
          rows={3}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="owner_address_City">City</Label>
            <Input
              id="owner_address_City"
              value={verificationData.owner_address.City}
              onChange={(e) => handleInputChange("owner_address.City", e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_address_State">State</Label>
            <Input
              id="owner_address_State"
              value={verificationData.owner_address.State}
              onChange={(e) => handleInputChange("owner_address.State", e.target.value)}
              placeholder="Enter state"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_address_pinCode">Pincode</Label>
            <Input
              id="owner_address_pinCode"
              value={verificationData.owner_address.pinCode}
              onChange={(e) => handleInputChange("owner_address.pinCode", e.target.value)}
              placeholder="Enter pincode"
            />
          </div>
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
            <p className="text-sm font-medium text-gray-600">Service Name</p>
            <p className="text-sm">{verificationData.service_name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Service Type</p>
            <p className="text-sm">{verificationData.service_type || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Business Phone</p>
            <p className="text-sm">{verificationData.service_phone || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Business Email</p>
            <p className="text-sm">{verificationData.service_email || "Not provided"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Business Address</p>
            <p className="text-sm">{verificationData.service_address.location || "Not provided"}</p>
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
            <p className="text-sm font-medium text-gray-600">Contact Numbers</p>
            <p className="text-sm">{verificationData.owner_contactNo.join(", ") || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Aadhar Number</p>
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
          <strong>Verification Process:</strong> After submission, our team will review your documents within 3-5 business days. 
          You'll receive an email notification once the verification is complete.
        </AlertDescription>
      </Alert>
    </div>
  )
}