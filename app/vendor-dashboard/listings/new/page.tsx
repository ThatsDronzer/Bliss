"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, DollarSign } from "lucide-react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useSession } from '@clerk/clerk-react';
import { Badge } from "@/components/ui/badge"

interface Feature {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  created_at: string;
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
    terms: [] as string[],
    features: [] as Feature[],
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

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

 const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || []);
  
  
  const validFiles = files.filter(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error(`File too large: ${file.name} (max 10MB)`);
      return false;
    }
    return true;
  });

  const previews = validFiles.map(file => URL.createObjectURL(file));
  setSelectedFiles(prev => [...prev, ...validFiles]);
  setImagePreviews(prev => [...prev, ...previews]);
};

  const handleRemoveImage = (index: number) => {
    // Clean up the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<CloudinaryUploadResponse[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'nextjs_unsigned_upload');
      formData.append('folder', 'listings');
      formData.append('tags', 'temporary');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      return response.json();
    });

    return Promise.all(uploadPromises);
  };

  const deleteUploadedImages = async (images: CloudinaryUploadResponse[]) => {
    for (const image of images) {
      try {
        await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicId: image.public_id }),
        });
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

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
      toast.error("Feature name and price are required")
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

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      return "Please fill in all required fields (Title, Description, Category, Price)"
    }
    if (selectedFiles.length === 0) {
      return "Please upload at least one image"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // ✅ ONLY NOW UPLOAD IMAGES - after form validation
      const uploadedImages = await uploadImagesToCloudinary(selectedFiles);

      // Send to your API
      const response = await fetch('/api/listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          location: formData.location,
          category: formData.category,
          features: formData.features,
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        // ❌ If API fails, delete the images we just uploaded
        await deleteUploadedImages(uploadedImages);
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create listing');
      }

      // ✅ Success
      toast.success("Listing created successfully");
      router.push("/vendor-dashboard/listings");
      
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up object URLs
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    router.push("/vendor-dashboard/listings");
  };

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
              <CardDescription>Select images </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />

              {/* Local previews only - no Cloudinary connection */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
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

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
}