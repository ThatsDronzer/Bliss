"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Camera, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/footer"

export default function BecomeVendorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "",
    subCategories: [] as string[],
    description: "",
    experience: "",
    location: "",
    address: "",
    website: "",
    instagram: "",
    facebook: "",
    services: [] as string[],
    priceRange: "",
    portfolio: [] as File[],
    documents: [] as File[],
    termsAccepted: false,
  })

  const categories = [
    "Venue",
    "Photography",
    "Catering",
    "Decoration",
    "DJ/Music",
    "Makeup Artist",
    "Mehndi Artist",
    "Florist",
    "Transportation",
    "Entertainment",
  ]

  const servicesByCategory = {
    Photography: ["Wedding Photography", "Pre-wedding Shoot", "Event Photography", "Portrait Photography"],
    Catering: ["North Indian", "South Indian", "Chinese", "Continental", "Desserts"],
    Decoration: ["Floral Decoration", "Theme Decoration", "Lighting", "Stage Decoration"],
    Venue: ["Banquet Hall", "Outdoor Venue", "Hotel", "Resort", "Farmhouse"],
    "DJ/Music": ["DJ Services", "Live Band", "Sound System", "Lighting Equipment"],
  }

  const locations = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Simulate form submission
    console.log("Form submitted:", formData)
    router.push("/vendor-dashboard")
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Information</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
            placeholder="Enter your business name"
          />
        </div>

        <div>
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => setFormData((prev) => ({ ...prev, ownerName: e.target.value }))}
            placeholder="Enter owner's full name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="business@example.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <Label htmlFor="category">Primary Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your primary service" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            placeholder="Enter years of experience"
            className="col-span-3"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="itemsServed">Items/Services Served</Label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                id="totalItems"
                type="number"
                placeholder="Total items/services offered"
                className="flex-1"
                required
              />
              <Input
                id="monthlyCapacity"
                type="number"
                placeholder="Monthly service capacity"
                className="flex-1"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <Input
                id="minPrice"
                type="number"
                placeholder="Minimum price per item"
                className="flex-1"
                required
              />
              <Input
                id="maxPrice"
                type="number"
                placeholder="Maximum price per item"
                className="flex-1"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="serviceArea">Service Area Coverage</Label>
          <Input
            id="serviceArea"
            placeholder="Enter cities/regions you serve"
            className="col-span-3"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Business Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your business, services, and what makes you unique..."
          rows={4}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Location & Contact</h2>
        <p className="text-gray-600">Where are you located and how can clients reach you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="location">Primary City *</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priceRange">Price Range *</Label>
          <Select
            value={formData.priceRange}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, priceRange: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget (₹10k - ₹50k)</SelectItem>
              <SelectItem value="mid-range">Mid-range (₹50k - ₹2L)</SelectItem>
              <SelectItem value="premium">Premium (₹2L - ₹5L)</SelectItem>
              <SelectItem value="luxury">Luxury (₹5L+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Complete Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          placeholder="Enter your complete business address..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <Label htmlFor="instagram">Instagram (Optional)</Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
            placeholder="@yourbusiness"
          />
        </div>

        <div>
          <Label htmlFor="facebook">Facebook (Optional)</Label>
          <Input
            id="facebook"
            value={formData.facebook}
            onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}
            placeholder="facebook.com/yourbusiness"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Services & Portfolio</h2>
        <p className="text-gray-600">What services do you offer?</p>
      </div>

      {formData.category && servicesByCategory[formData.category as keyof typeof servicesByCategory] && (
        <div>
          <Label>Services Offered *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {servicesByCategory[formData.category as keyof typeof servicesByCategory].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={formData.services.includes(service)}
                  onCheckedChange={() => handleServiceToggle(service)}
                />
                <Label htmlFor={service} className="text-sm">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Portfolio Images *</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Upload your best work</p>
          <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB each (Max 10 images)</p>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Choose Images
          </Button>
        </div>
      </div>

      <div>
        <Label>Business Documents</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload business registration, GST certificate, etc.</p>
          <Button variant="outline" size="sm">
            Choose Files
          </Button>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review your information before submitting</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Business Name</h4>
              <p>{formData.businessName || "Not provided"}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Category</h4>
              <p>{formData.category || "Not selected"}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Location</h4>
              <p>{formData.location || "Not selected"}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Experience</h4>
              <p>{formData.experience || "Not specified"}</p>
            </div>
          </div>

          {formData.services.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Services</h4>
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, termsAccepted: checked as boolean }))}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              . I understand that my application will be reviewed and I will be notified of the status within 2-3
              business days.
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Your application will be reviewed by our team</li>
          <li>• We'll verify your documents and portfolio</li>
          <li>• You'll receive an email notification within 2-3 business days</li>
          <li>• Once approved, you can start receiving bookings!</li>
        </ul>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Become a Vendor
            </h1>
            <div className="text-sm text-gray-600">Step {currentStep} of 4</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}
