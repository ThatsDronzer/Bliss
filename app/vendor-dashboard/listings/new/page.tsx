"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Plus, X, DollarSign } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useSession } from '@clerk/clerk-react';
import { Badge } from "@/components/ui/badge"

interface Feature {
  id: string;
  name: string;
  price: string;
  description: string;
}

export default function NewListingPage() {
    const { session } = useSession();
  const [token, setToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(true)
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    capacity: "",
    images: [] as string[],
    terms: [] as string[],
    features: [] as Feature[],
  })
  const [newTerm, setNewTerm] = useState("")
  const [newFeature, setNewFeature] = useState({
    name: "",
    price: "",
    description: "",
  })

  
  useEffect(() => {
    const fetchToken = async () => {
      setTokenLoading(true);
      try {
        if (session) {
          const userToken = await session.getToken();
          console.log("Token fetched:", userToken ? "Success" : "Failed");
          setToken(userToken);
        } else {
          console.log("No session available");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setTokenLoading(false);
      }
    };
    
    if (isSignedIn && session) {
      fetchToken();
    } else {
      setTokenLoading(false);
    }
  }, [session, isSignedIn]);

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])


  if (!isLoaded || !isSignedIn || userRole !== "vendor" || tokenLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const categories = [
    "Wedding Venue",
    "Photography",
    "Catering",
    "Decoration",
    "Music & DJ",
    "Transportation",
    "Beauty & Makeup",
    "Florist",
    "Wedding Planner",
    "Other",
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTerm = () => {
    if (newTerm.trim() && !formData.terms.includes(newTerm.trim())) {
      handleInputChange("terms", [...formData.terms, newTerm.trim()])
      setNewTerm("")
    }
  }

  const handleRemoveTerm = (term: string) => {
    handleInputChange(
      "terms",
      formData.terms.filter((t) => t !== term)
    )
  }

  const handleAddFeature = () => {
    if (newFeature.name.trim() && newFeature.price.trim()) {
      const feature: Feature = {
        id: Date.now().toString(),
        name: newFeature.name.trim(),
        price: newFeature.price.trim(),
        description: newFeature.description.trim(),
      }
      
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
      
      setNewFeature({
        name: "",
        price: "",
        description: "",
      })
    } else {
      toast({
        title: "Validation Error",
        description: "Please provide feature name and price",
        variant: "destructive",
      })
    }
  }

  const handleRemoveFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== featureId)
    }))
  }

  const handleFeatureInputChange = (field: string, value: string) => {
    setNewFeature(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // For demo purposes, we'll just add placeholder URLs
      const newImages = Array.from(files).map((file) => `/placeholder.svg?text=${file.name}`)
      handleInputChange("images", [...formData.images, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    handleInputChange(
      "images",
      formData.images.filter((_, i) => i !== index)
    )
  }

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      return "Please fill in all required fields (Title, Description, Category, Price)"
    }
    return null
  }

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Form submission started");
    console.log("Form data:", formData);
    console.log("Token:", token);
    console.log("Is signed in:", isSignedIn);
    console.log("User role:", userRole);
    console.log("Session:", session);
    
    // Validate form before submission
    const validationError = validateForm();
    if (validationError) {
      console.log("Validation error:", validationError);
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    if (!isSignedIn) {
      console.log("User not signed in");
      toast({
        title: "Authentication Error",
        description: "Please log in to create a listing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data for API submission
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price) || 0, // Convert price to number
        features: formData.features, // Use the features array
        terms: formData.terms || [], // Keep terms separate
      };

      console.log("Submitting data:", submissionData);

      const response = await fetch('/api/listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(submissionData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.message || 'Failed to create listing');
      }

      const data = await response.json();
      console.log("Success response:", data);
     
      toast({ title: "Success", description: "Listing created successfully!" })
      router.push("/vendor-dashboard/listings")
    } catch (err) {
        console.error("Error in handleSubmit:", err);
        toast({
          title: "Error",
          description: (err as Error).message || "Something went wrong",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false);
      }
    }
    return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/vendor-dashboard/listings")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Listing</h1>
          <p className="text-gray-500 mt-1">Create a new venue or service listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the essential details about your listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter listing title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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

                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., ₹50,000 or Starting from ₹25,000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter location"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", e.target.value)}
                    placeholder="e.g., 200 guests"
                  />
                </div> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your service or venue in detail..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload images of your venue or service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click to upload images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Choose Files
                  </Button>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features & Services */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Services</CardTitle>
              <CardDescription>Add individual features or services with their prices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Feature Form */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-4">Add New Feature</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-name">Feature Name *</Label>
                    <Input
                      id="feature-name"
                      value={newFeature.name}
                      onChange={(e) => handleFeatureInputChange("name", e.target.value)}
                      placeholder="e.g., Photography, Catering, Decoration"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feature-price">Price *</Label>
                    <Input
                      id="feature-price"
                      value={newFeature.price}
                      onChange={(e) => handleFeatureInputChange("price", e.target.value)}
                      placeholder="e.g., ₹10,000 or ₹500 per person"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feature-description">Description</Label>
                    <Input
                      id="feature-description"
                      value={newFeature.description}
                      onChange={(e) => handleFeatureInputChange("description", e.target.value)}
                      placeholder="Brief description of the feature"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddFeature} 
                  disabled={!newFeature.name.trim() || !newFeature.price.trim()}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </Button>
              </div>

              {/* Display Added Features */}
              {formData.features.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Added Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.features.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4 bg-white relative">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{feature.name}</h5>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(feature.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {feature.price}
                          </Badge>
                        </div>
                        {feature.description && (
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.features.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No features added yet. Add your first feature above.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
              <CardDescription>Add any specific terms or conditions for your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Add a term or condition"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTerm())}
                />
                <Button type="button" onClick={handleAddTerm} disabled={!newTerm.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.terms.length > 0 && (
                <div className="space-y-2">
                  {formData.terms.map((term, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox checked={true} disabled />
                      <span className="flex-1">{term}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(term)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/vendor-dashboard/listings")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
  };
  

