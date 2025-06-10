"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Mail,
  Lock,
  AlertCircle,
  User,
  Store,
  ShieldCheck,
  Phone,
  MapPin,
  Building,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"customer" | "vendor" | "admin">("customer")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Vendor specific
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessDescription: "",
    // Admin specific
    adminCode: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      return "Please fill in all required fields"
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long"
    }

    if (userType === "vendor" && (!formData.businessName || !formData.businessType)) {
      return "Please fill in all business information"
    }

    if (userType === "admin" && !formData.adminCode) {
      return "Admin code is required"
    }

    if (!acceptTerms) {
      return "Please accept the terms and conditions"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, we'll just redirect to login
      router.push("/login?message=Account created successfully! Please log in.")
    } catch (err) {
      setError("An error occurred while creating your account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const businessTypes = [
    "Wedding Planner",
    "Photographer",
    "Caterer",
    "Venue",
    "Decorator",
    "DJ/Music",
    "Transportation",
    "Beauty & Makeup",
    "Florist",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="font-bold text-3xl text-gray-900">Blissmet</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Blissmet</h1> */}
          <p className="text-lg text-gray-600">Create your account and start planning amazing events</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and fill in your information
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "customer" | "vendor" | "admin")}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Customer</span>
                </TabsTrigger>
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span>Vendor</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin</span>
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="pl-10"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vendor Specific Fields */}
                {userType === "vendor" && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Business Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="businessName"
                            type="text"
                            placeholder="Your Business Name"
                            className="pl-10"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange("businessName", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select
                          value={formData.businessType}
                          onValueChange={(value) => handleInputChange("businessType", value)}
                        >
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="businessAddress"
                          type="text"
                          placeholder="123 Business St, City, State"
                          className="pl-10"
                          value={formData.businessAddress}
                          onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        placeholder="Tell us about your business and services..."
                        className="min-h-[100px]"
                        value={formData.businessDescription}
                        onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Admin Specific Fields */}
                {userType === "admin" && (
                  <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Admin Verification
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="adminCode">Admin Access Code *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="adminCode"
                          type="password"
                          placeholder="Enter admin access code"
                          className="pl-10"
                          value={formData.adminCode}
                          onChange={(e) => handleInputChange("adminCode", e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-red-600">
                        Admin access requires a special code. Contact your system administrator.
                      </p>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} className="mt-1" />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-pink-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-pink-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Create Account
                    </div>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-pink-600 hover:underline font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
